import {now,uid,countWords,localDay} from "./engine.js";
import {WRITING_UNITS,courseAssignment} from "./writing-curriculum.js";
import {validateReply,sanitizeCoach} from "./contract.js";
export function newCourse(unitId) {
  if(!WRITING_UNITS.some(u=>u.id===unitId))throw new Error("Percorso di scrittura non riconosciuto.");
  return {id:uid("course"),unit_id:unitId,stage:0,preparation:{answers:{},checked:false},drafts:["","","","","",""],rounds:[0,0,0,0,0,0],reviews:[],checks:[],archives:[],created_at:now(),completed_at:null};
}
export function courseReview(course) {return course.reviews.findLast(r=>r.stage===course.stage&&r.round===course.rounds[course.stage]&&r.mode==="review"&&r.text===course.drafts[course.stage]);}
export function courseAssisted(course) {return course.stage<4||course.reviews.some(r=>r.stage===course.stage&&r.round===course.rounds[course.stage]);}
export function courseWaiting(course,timestamp=Date.now()) {
  const independent=course.checks.find(c=>c.stage===4);
  return course.stage===5&&(!independent||localDay(independent.completed_at)===localDay(timestamp));
}
export function courseRequest(course,mode,question="") {
  const unit=WRITING_UNITS.find(u=>u.id===course.unit_id),stage=course.stage;
  if(course.completed_at)throw new Error("Questo percorso è concluso. Puoi iniziarne un altro.");
  if(courseWaiting(course))throw new Error("La conferma usa una nuova consegna in un'altra giornata. La tua bozza resta salvata.");
  if(mode==="review") {
    if(stage===0)throw new Error("Prima completa i controlli sul modello.");
    const text=course.drafts[stage];
    if(countWords(text)<(stage===1?6:15))throw new Error("Scrivi un tentativo prima di chiedere la revisione.");
    if(stage===1&&text.split(/\n+/).filter(s=>s.trim()).length!==3)throw new Error("Scrivi tre frasi, una per riga.");
  }
  const assignment=courseAssignment(unit,stage,course.rounds[stage]);
  return {criteria_version:1,unit_id:unit.id,type:unit.type,stage,round:course.rounds[stage],mode,topic:assignment.details_it,text:course.drafts[stage],question:question.trim(),...(course.grammar_lesson_id?{lesson_id:course.grammar_lesson_id}:{})};
}
export function addCourseReview(course,mode,result,question="") {
  validateReply("writing_coach",result);
  const text=course.drafts[course.stage],review={id:uid("coach"),stage:course.stage,round:course.rounds[course.stage],mode,text,question,assisted:courseAssisted(course),result:sanitizeCoach(result,text,mode),created_at:now()};
  course.reviews.push(review);return review;
}
export function advanceCourse(course,timestamp=Date.now()) {
  if(course.completed_at)throw new Error("Percorso già concluso.");
  const stage=course.stage,unit=WRITING_UNITS.find(u=>u.id===course.unit_id);
  if(stage===0) {
    if(!course.preparation.checked||!unit.preparation.every(q=>course.preparation.answers[q.id]===q.answer))throw new Error("Rivedi le risposte sul modello prima di proseguire.");
  }else {
    const review=courseReview(course);
    if(!review?.result.ready)throw new Error("Serve una revisione attuale pronta per il passo successivo.");
    if(stage>=4&&review.assisted)throw new Error("Questa prova ha ricevuto aiuti. Usa una nuova consegna per la verifica autonoma.");
    if(courseWaiting(course,timestamp))throw new Error("Completa la conferma in un'altra giornata.");
  }
  course.checks.push({stage,round:course.rounds[stage],text:course.drafts[stage],review_id:stage===0?null:courseReview(course).id,completed_at:new Date(timestamp).toISOString()});
  if(stage===5)course.completed_at=new Date(timestamp).toISOString();else course.stage++;
}
export function newCourseRound(course) {
  if(course.stage<4||course.completed_at)throw new Error("La nuova consegna è disponibile nella prova autonoma.");
  if(course.rounds[course.stage]>=1000)throw new Error("Inizia un nuovo percorso per continuare l'allenamento.");
  if(course.drafts[course.stage]){course.archives??=[];course.archives.push({stage:course.stage,round:course.rounds[course.stage],text:course.drafts[course.stage],created_at:now()});}
  course.rounds[course.stage]++;course.drafts[course.stage]="";
}
