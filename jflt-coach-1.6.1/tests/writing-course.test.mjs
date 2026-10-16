import test from "node:test";
import assert from "node:assert/strict";
import {IDBFactory} from "fake-indexeddb";
import {WRITING_UNITS,COURSE_STAGES,courseAssignment,courseContext} from "../writing-curriculum.js";
import {newCourse,courseRequest,courseReview,courseWaiting,addCourseReview,advanceCourse,newCourseRound} from "../writing-course.js";
import {SHAPES,sanitizeCoach,validateInput,validateReply} from "../contract.js";
import {freshState,recommendation} from "../engine.js";
import {LESSONS} from "../catalog.js";
import {openRepository,parseBackup,validateState} from "../storage.js";
const text="I am writing to ask about the course. Four colleagues are available on Monday afternoons. Could you confirm the date and whether equipment is included?";
const sentences="I am writing to ask about the course.\nFour colleagues are free on Monday afternoons.\nCould you confirm the date and equipment?";
const ready=()=>({...structuredClone(SHAPES.writing_coach),ready:true});
const start=()=>{const c=newCourse("email-request");const unit=WRITING_UNITS[0];c.preparation.answers=Object.fromEntries(unit.preparation.map(q=>[q.id,q.answer]));c.preparation.checked=true;advanceCourse(c);return c;};
const toIndependent=()=>{const c=start();for(let stage=1;stage<=3;stage++){c.drafts[stage]=stage===1?sentences:text;addCourseReview(c,"review",ready());advanceCourse(c);}return c;};
test("Sette percorsi originali, quattro precedenti e tre dai libri: modello diverso dalla consegna e grammatica collegata a lezioni esistenti",()=>{
  assert.equal(COURSE_STAGES.length,6);assert.equal(WRITING_UNITS.length,7);
  for(const unit of WRITING_UNITS){assert.equal(unit.preparation.length,unit.book_based?6:3);assert.ok(unit.model.length>=(unit.book_based?4:5));assert.ok(unit.grammar.every(id=>LESSONS.some(l=>l.id===id)),unit.id);const guided=courseAssignment(unit,3),independent=courseAssignment(unit,4),transfer=courseAssignment(unit,5);assert.equal(new Set([guided.details_it,independent.details_it,transfer.details_it]).size,3);assert.notEqual(courseAssignment(unit,4,1).title,independent.title);assert.notEqual(courseAssignment(unit,5,1).title,transfer.title);assert.equal("model" in courseContext(unit,4),false);assert.equal("outline" in courseContext(unit,5),false);}
});
test("Si studia prima di scrivere: comprensione verificata e tre frasi prima del testo lungo",()=>{
  const c=newCourse("email-request");assert.throws(()=>advanceCourse(c),/risposte/);assert.throws(()=>courseRequest(c,"review"),/controlli/);const hint=courseRequest(c,"hint","Perché could?");validateInput("writing_coach",hint);assert.equal(hint.text,"");
  const begun=start();assert.throws(()=>courseRequest(begun,"review"),/tentativo/);begun.drafts[1]=text;assert.throws(()=>courseRequest(begun,"review"),/tre frasi/);begun.drafts[1]=sentences;validateInput("writing_coach",courseRequest(begun,"review"));
});
test("Una revisione vale solo per quel testo; errore e citazione inventata non confermano il passo",()=>{
  const c=start();c.drafts[1]=sentences;addCourseReview(c,"review",ready());assert.ok(courseReview(c));c.drafts[1]+=" Changed.";assert.equal(courseReview(c),undefined);assert.throws(()=>advanceCourse(c),/attuale/);
  const error={quote:"colleagues",correction:"colleagues",explanation:"Controlla il verbo.",kind:"error",category:"present-simple"};addCourseReview(c,"review",{...ready(),issues:[error]});assert.equal(courseReview(c).result.ready,false);
  addCourseReview(c,"review",{...ready(),issues:[{...error,quote:"absent phrase",kind:"style"}]});assert.equal(courseReview(c).result.omitted,1);assert.throws(()=>advanceCourse(c),/attuale/);
  const style=sanitizeCoach({...ready(),issues:[{...error,kind:"style"}]},c.drafts[1],"review");assert.equal(style.ready,true);assert.equal(style.issues[0].kind,"style");
});
test("Un aiuto e una riscrittura dopo feedback restano guidati; una nuova consegna riparte senza aiuti",()=>{
  const c=toIndependent();c.drafts[4]=text;addCourseReview(c,"hint",ready());addCourseReview(c,"review",ready());assert.equal(courseReview(c).assisted,true);assert.throws(()=>advanceCourse(c),/aiuti/);newCourseRound(c);assert.equal(c.archives[0].text,text);assert.equal(c.drafts[4],"");assert.equal(courseReview(c),undefined);
  c.drafts[4]=text;addCourseReview(c,"review",{...ready(),ready:false});c.drafts[4]+=" Thank you for your help.";addCourseReview(c,"review",ready());assert.equal(courseReview(c).assisted,true);assert.throws(()=>advanceCourse(c),/aiuti/);newCourseRound(c);c.drafts[4]=text;addCourseReview(c,"review",ready());assert.equal(courseReview(c).assisted,false);advanceCourse(c);assert.equal(c.stage,5);
});
test("La conferma usa altri fatti in un altro giorno, senza far diventare l'attesa una richiesta AI",()=>{
  const c=toIndependent();c.drafts[4]=text;addCourseReview(c,"review",ready());const today=Date.now(),tomorrow=today+86400000;advanceCourse(c,today);assert.ok(courseWaiting(c,today));assert.throws(()=>courseRequest(c,"review"),/giornata/);assert.equal(courseWaiting(c,tomorrow),false);
  c.checks[4].completed_at=new Date(Date.now()-86400000).toISOString();c.drafts[5]=text;validateInput("writing_coach",courseRequest(c,"review"));addCourseReview(c,"review",ready());advanceCourse(c);assert.ok(c.completed_at);assert.equal(c.checks.length,6);assert.throws(()=>advanceCourse(c),/concluso/);const s=freshState();s.writing_courses.push(c);validateState(s);
});
test("Percorsi, bozze e spiegazioni sopravvivono a riapertura e backup; vecchi backup senza campi nuovi funzionano",async()=>{
  const factory=new IDBFactory(),repo=await openRepository(factory),course=start();course.drafts[1]=sentences;addCourseReview(course,"review",ready());await repo.change(s=>{s.writing_courses.push(course);s.lesson_studies.push({lesson_id:"present-perfect-simple",question:"Quando?",result:structuredClone(SHAPES.grammar_explain),created_at:new Date().toISOString()});});const backup=await repo.backup();repo.close();const reopened=await openRepository(factory);assert.equal(reopened.get().writing_courses[0].drafts[1],sentences);assert.ok(courseReview(reopened.get().writing_courses[0]).result.ready);await reopened.replace(parseBackup(backup));assert.equal(reopened.get().lesson_studies[0].question,"Quando?");reopened.close();const old=freshState();delete old.writing_courses;delete old.lesson_studies;validateState(old);
});
test("Backup alterato non può convertire aiuti in autonomia né confermare un testo diverso",()=>{
  const s=freshState(),c=toIndependent();c.drafts[4]=text;addCourseReview(c,"hint",ready());addCourseReview(c,"review",ready());s.writing_courses.push(c);validateState(s);const forged=structuredClone(s);forged.writing_courses[0].reviews.at(-1).assisted=false;assert.throws(()=>validateState(forged),/autonoma/);const broken=structuredClone(s);broken.writing_courses[0].checks[1].text="other text";assert.throws(()=>validateState(broken),/tappa/);const malformed=structuredClone(s);malformed.writing_courses[0].checks[0].completed_at="invalid";assert.throws(()=>validateState(malformed),/tappa/);
});
test("Le regole sbagliate nel passo attuale aggiornano la proposta; stile e revisioni superate no",()=>{
  const s=freshState(),c=start();c.drafts[1]=sentences;addCourseReview(c,"review",{...ready(),issues:[{quote:"Four colleagues",correction:"Four colleagues",explanation:"Regola pertinente.",kind:"error",category:"phrasal-basics"}]});s.writing_courses.push(c);assert.equal(recommendation(s)[0].id,"phrasal-basics");c.reviews.at(-1).result.issues[0].kind="style";assert.notEqual(recommendation(s)[0].id,"phrasal-basics");c.reviews.at(-1).result.issues[0].kind="error";c.drafts[1]+=" Changed";assert.notEqual(recommendation(s)[0].id,"phrasal-basics");
});
test("Nuovi contratti rifiutano testi e domande troppo lunghi, campi mancanti e forme di risposta sbagliate",()=>{
  const c=start();c.drafts[1]=sentences;const d=courseRequest(c,"review");for(const mutation of [x=>x.stage=9,x=>x.question="x".repeat(501),x=>x.text="x".repeat(6001),x=>x.round=-1,x=>x.mode="generate"]){const bad=structuredClone(d);mutation(bad);assert.throws(()=>validateInput("writing_coach",bad));}assert.throws(()=>validateInput("grammar_explain",{lesson_id:"negatives",question:"x".repeat(501)}));const g=structuredClone(SHAPES.grammar_explain);g.examples.pop();assert.throws(()=>validateReply("grammar_explain",g),/due o tre/);
});
