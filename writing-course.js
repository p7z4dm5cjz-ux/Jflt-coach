import {now,uid,countWords,localDay} from "./engine.js";
import {WRITING_UNITS,assignmentIndex,freshAssignmentsLeft} from "./writing-curriculum.js";
import {validateReply,sanitizeCoach} from "./contract.js";
export function newCourse(unitId) {
  if(!WRITING_UNITS.some(u=>u.id===unitId))throw new Error("Percorso di scrittura non riconosciuto.");
  return {assignment_version:2,id:uid("course"),unit_id:unitId,stage:0,preparation:{answers:{},checked:false},drafts:["","","","","",""],rounds:[0,0,0,0,0,0],reviews:[],checks:[],archives:[],created_at:now(),completed_at:null};
}
// Old saves did not record which assignment accompanied the draft. Do not guess.
export function courseTaskIndex(course) {
  const stage=course.stage;
  if(stage<4)return 0;
  if(Number.isInteger(course.task_indices?.[stage]))return course.task_indices[stage];
  if(course.assignment_version!==2)return null;
  const index=assignmentIndex(stage,course.rounds[stage],stage===5?course.rounds[4]+1:0);
  return index<WRITING_UNITS.find(u=>u.id===course.unit_id).tasks.length?index:null;
}
export function confirmCourseTask(course,index) {
  const unit=WRITING_UNITS.find(u=>u.id===course.unit_id);
  if(!Number.isInteger(index)||index<1||index>=unit.tasks.length)throw new Error("Scegli la consegna originale della bozza.");
  course.task_indices??={};course.task_indices[course.stage]=index;
  // Unknown historical assignments cannot be treated as unseen assessments.
  course.assignment_version=3;
}
export function courseNeedsTask(course){return course.stage>=4&&courseTaskIndex(course)===null;}
export function courseReview(course) {return course.reviews.findLast(r=>r.stage===course.stage&&r.round===course.rounds[course.stage]&&r.mode==="review"&&r.text===course.drafts[course.stage]&&(course.assignment_version!==3||r.task===courseTaskIndex(course)));}
export function courseAssisted(course) {return course.stage<4||course.reviews.some(r=>r.stage===course.stage&&r.round===course.rounds[course.stage]);}
export function courseWaiting(course,timestamp=Date.now()) {
  const independent=course.checks.find(c=>c.stage===4);
  return course.stage===5&&(!independent||localDay(independent.completed_at)===localDay(timestamp));
}
export function courseRequest(course,mode,question="") {
  const unit=WRITING_UNITS.find(u=>u.id===course.unit_id),stage=course.stage;
  if(courseNeedsTask(course))throw new Error("Conferma la consegna originale della bozza prima di chiedere la revisione.");
  if(course.completed_at)throw new Error("Questo percorso è concluso. Puoi iniziarne un altro.");
  if(courseWaiting(course))throw new Error("La conferma usa una nuova consegna in un'altra giornata. La tua bozza resta salvata.");
  if(mode==="review") {
    if(stage===0)throw new Error("Prima completa i controlli sul modello.");
    const text=course.drafts[stage];
    if(countWords(text)<(stage===1?6:15))throw new Error("Scrivi un tentativo prima di chiedere la revisione.");
    if(stage===1&&text.split(/\n+/).filter(s=>s.trim()).length!==3)throw new Error("Scrivi tre frasi, una per riga.");
  }
  const task=courseTaskIndex(course),assignment=unit.tasks[task];
  return {criteria_version:1,unit_id:unit.id,type:unit.type,stage,round:course.rounds[stage],task,mode,topic:assignment.details_it,text:course.drafts[stage],question:question.trim(),...(course.grammar_lesson_id?{lesson_id:course.grammar_lesson_id}:{})};
}
export function addCourseReview(course,mode,result,question="") {
  validateReply("writing_coach",result);
  const text=course.drafts[course.stage],review={task:courseTaskIndex(course),id:uid("coach"),stage:course.stage,round:course.rounds[course.stage],mode,text,question,assisted:courseAssisted(course),result:sanitizeCoach(result,text,mode),created_at:now()};
  course.reviews.push(review);return review;
}
export function advanceCourse(course,timestamp=Date.now()) {
  if(course.completed_at)throw new Error("Percorso già concluso.");
  if(courseNeedsTask(course))throw new Error("Conferma la consegna originale della bozza.");
  if(course.stage>=4&&course.assignment_version===3)throw new Error("Questa bozza resta un allenamento: per una prova autonoma inizia una nuova unità, con consegne tracciate.");
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
  if(stage===5)course.completed_at=new Date(timestamp).toISOString();else {course.stage++;if(course.stage===4)course.assignment_version=2;}
}
export function newCourseRound(course) {
  if(course.assignment_version!==2)throw new Error("La bozza precedente è conservata. Inizia una nuova unità per una prova autonoma con consegne tracciate.");
  if(course.stage<4||course.completed_at)throw new Error("La nuova consegna è disponibile nella prova autonoma.");
  const unit=WRITING_UNITS.find(u=>u.id===course.unit_id);
  if(unit&&!freshAssignmentsLeft(unit,course))throw new Error("Hai già usato tutte le consegne nuove di questa unità: per un'altra prova autonoma inizia un'altra unità di scrittura.");
  if(course.drafts[course.stage]){course.archives??=[];course.archives.push({stage:course.stage,round:course.rounds[course.stage],text:course.drafts[course.stage],created_at:now()});}
  course.rounds[course.stage]++;course.drafts[course.stage]="";
}
