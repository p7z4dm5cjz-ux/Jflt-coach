import test from "node:test";
import assert from "node:assert/strict";
import {QUESTIONS,AREAS,newPlacement,orderedQuestions,orderedOptions,isCorrect,placementProfile,validPlacement} from "../placement.js";
import {LESSONS} from "../catalog.js";
import {freshLearning,suggestedLesson,validateLearningState} from "../learning.js";
import {validateAgainst,validateBackup,STORES,BACKUP_FORMAT} from "../core.js";
import {bookContext} from "../bookshelf.js";
import {providerRequest} from "../worker/policy.js";
const completed=()=>{const p=newPlacement("repeatable-seed","2026-10-08T10:00:00Z");p.answers=QUESTIONS.map(q=>({id:q.id,value:q.answer,confidence:"sure"}));p.submitted_at="2026-10-08T10:20:00Z";return p;};
test("45 domande con peso su tempi, negazioni e phrasal e tutti i riferimenti validi",()=>{
  assert.equal(QUESTIONS.length,45);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,45);
  assert.deepEqual(Object.keys(AREAS).map(a=>QUESTIONS.filter(q=>q.area===a).length),[14,8,8,3,3,3,3,3]);
  assert.ok(QUESTIONS.filter(q=>!q.options).length>=12);
  for(const q of QUESTIONS){assert.ok(q.ref&&q.why);assert.ok(isCorrect(q,q.answer));for(const id of q.lessons)assert.ok(LESSONS.some(l=>l.id===id),id);if(q.options){assert.equal(q.options.filter(v=>isCorrect(q,v)).length,1);assert.equal(q.options.length,3);}}
});
test("ordine ripetibile ma differente per sessione senza perdere domande o scelte",()=>{
  const a=orderedQuestions("a"),b=orderedQuestions("b");assert.deepEqual(orderedQuestions("a"),a);assert.notDeepEqual(a.map(q=>q.id),b.map(q=>q.id));assert.deepEqual(new Set(a.map(q=>q.id)),new Set(QUESTIONS.map(q=>q.id)));
  for(const q of QUESTIONS.filter(q=>q.options))assert.deepEqual(new Set(orderedOptions(q,"a")),new Set(q.options));
});
test("nessun risultato prima della consegna; consegna incompleta e risposte alterate rifiutate",()=>{
  const p=newPlacement("seed");assert.equal(placementProfile(p),null);p.submitted_at=new Date().toISOString();assert.equal(validPlacement(p),false);
  const good=completed();assert.equal(validPlacement(good),true);good.answers[0].value="fabricated answer";assert.equal(validPlacement(good),false);
  const dup=completed();dup.answers[1]={...dup.answers[0]};assert.equal(validPlacement(dup),false);
});
test("forme contratte e apostrofi tipografici accettati senza accettare un tempo sbagliato",()=>{
  const q=QUESTIONS.find(q=>q.id==="N02");assert.ok(isCorrect(q,"didn’t stop"));assert.equal(isCorrect(q,"didn't stopped"),false);
  assert.equal(isCorrect(QUESTIONS.find(q=>q.id==="T06"),"have been waiting"),true);assert.equal(isCorrect(QUESTIONS.find(q=>q.id==="T06"),"had been waiting"),false);
});
test("basi sicure saltate e errore specifico indirizza a negazioni anziché soggetti",()=>{
  const state=freshLearning();state.placement=completed();state.placement.answers.find(a=>a.id==="N02").value="didn't stopped";
  const profile=placementProfile(state.placement);assert.equal(profile.correct,44);assert.equal(profile.lessonStatus.sentence,"skip");assert.equal(profile.lessonStatus.pronouns,"skip");assert.equal(profile.lessonStatus.negatives,"review");assert.equal(suggestedLesson(state).id,"negatives");
});
test("non so e risposte indovinate distinguono ripresa e conferma",()=>{
  const p=completed();p.answers.find(a=>a.id==="P06").value="";p.answers.find(a=>a.id==="B01").confidence="unsure";
  const profile=placementProfile(p);assert.equal(profile.areas.find(a=>a.id==="phrasals").unknown,1);assert.equal(profile.lessonStatus["phrasal-basics"],"review");assert.equal(profile.lessonStatus.pronouns,"confirm");assert.equal(profile.uncertain.length,1);
});
test("nuove difficoltà riaprono una lezione saltata; pratica consolidata supera l'errore iniziale",()=>{
  const s=freshLearning();s.placement=completed();s.attempts=[{lesson_id:"sentence",set_id:"new",submitted:true,assisted:false,verdict:"incorrect"}];assert.equal(suggestedLesson(s).id,"sentence");
  s.placement.answers.find(a=>a.id==="P06").value="";s.attempts=Array.from({length:10},(_,i)=>({lesson_id:"phrasal-basics",set_id:i<5?"a":"b",submitted:true,assisted:false,verdict:"correct"}));assert.notEqual(suggestedLesson(s).id,"phrasal-basics");
});
test("backup precedenti, bozze e pre-test consegnato rimangono compatibili",()=>{
  const state=freshLearning();state.placement=newPlacement("seed");assert.deepEqual(validateLearningState(state,validateAgainst),[]);
  state.placement=completed();const stores=Object.fromEntries(STORES.map(k=>[k,[]]));stores.settings=[{id:"main",first_run:"2026-10-08T10:00:00Z",include_instructions:true,diag:{},plan:null,last_export:null,persist:null,learning:state}];assert.ok(validateBackup({format:BACKUP_FORMAT,app_version:"0.2.4",exported_at:"2026-10-08T10:00:00Z",stores}).ok);
  delete state.placement;assert.deepEqual(validateLearningState(state,validateAgainst),[]);
});
test("quattro libri usati in contesti autorevoli; errata e genere dello scritto arrivano al tutor",()=>{
  const books=new Set(LESSONS.flatMap(l=>bookContext(l.id).notes.map(n=>n.book)));for(const id of ["OXFORD","CAMPAIGN","MISSION","TARGET"])assert.ok(books.has(id));
  const ctx=bookContext("conditionals-unreal");assert.ok(ctx.errata.some(e=>e.correction_it.includes("past perfect")));
  const canonical=providerRequest({request_id:"books",mode:"EXERCISES",data:{lesson:{id:"past"},n_items:6,book_context:{notes:[{book:"fake"}]}}});assert.ok(canonical.data.book_context.notes.some(n=>n.book==="OXFORD"));assert.ok(!JSON.stringify(canonical.data.book_context).includes("fake"));assert.ok(canonical.prompt.includes("errata"));
  const writing=providerRequest({request_id:"write",mode:"WRITING_COACH",data:{stage:"advice",writing_type:"argument",mode:"guided"}});assert.ok(writing.data.book_context.notes.some(n=>n.book==="TARGET"));
});
