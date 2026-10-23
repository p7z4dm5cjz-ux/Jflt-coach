import test from "node:test";
import assert from "node:assert/strict";
import {QUESTIONS,BANK_VERSION,isCorrect,placementProfile} from "../placement.js";
import {freshState,recommendation} from "../engine.js";
import {correct} from "../answer-normal.js";

const Q=id=>QUESTIONS.find(q=>q.id===id);
test("1.9.6: la frase intera giusta vale quanto le sole parole mancanti",()=>{
  assert.equal(isCorrect(Q("N01"),"She doesn’t work night shifts."),true);
  assert.equal(isCorrect(Q("N07"),"Why didn't he report the incident yesterday?"),true);
  assert.equal(isCorrect(Q("N01"),"She works night shifts."),false);
  assert.equal(isCorrect(Q("N07"),"Why he didn't report the incident yesterday?"),false);
  assert.equal(correct({kind:"choice",stem:"They ___ ready.",answer:"are",accept:["are"],options:["is","are"]},"They are ready."),false,"le scelte multiple restano a opzione");
  assert.equal(correct({kind:"error_correction",stem:"Correggi l'errore e riscrivi tutta la frase: She work here.",answer:"She works here.",accept:[]},"She work here."),false);
});

test("Dopo il pretest tempi e negazioni restano prioritari ma le basi precedono le negazioni",()=>{
  const wrong=new Set(["N01","N02","N03","N04","N05","N06","N07","T01","T02","T03","T04","T05","T06"]);
  const s=freshState(),t=new Date().toISOString();
  s.placement={version:1,bank_version:BANK_VERSION,seed:"x",answers:QUESTIONS.map(q=>({id:q.id,value:wrong.has(q.id)?"":q.answer,confidence:"sure"})),position:44,started_at:t,submitted_at:t};
  const tenseLessons=new Set(QUESTIONS.filter(q=>q.area==="tenses").flatMap(q=>q.lessons));
  const top=recommendation(s).map(l=>l.id);
  assert.ok(top.indexOf("present-simple")<top.indexOf("negatives"));
  assert.ok(top.indexOf("past-simple")<top.indexOf("negatives"));
  assert.ok(top.slice(0,4).filter(id=>tenseLessons.has(id)).length>=2);
  assert.equal(placementProfile(s.placement).priorityIds.length,new Set(placementProfile(s.placement).priorityIds).size);
});

test("1.10.0: il pretest da 45 già fatto resta valido accanto a quello adattivo",async()=>{
  const {newPlacement,validPlacement,newAdaptivePlacement,adaptiveNext}=await import("../placement.js");
  const old=newPlacement("v1");old.answers=QUESTIONS.map(q=>({id:q.id,value:q.answer,confidence:"sure"}));old.position=44;old.submitted_at=new Date().toISOString();
  assert.ok(validPlacement(old));assert.equal(placementProfile(old).total,45);
  const p=newAdaptivePlacement("v2");assert.ok(validPlacement(p));let it,n=0;while((it=adaptiveNext(p))&&n<50){p.answers.push({id:it.id,value:it.answer,confidence:"sure"});n++;}
  p.submitted_at=new Date().toISOString();const prof=placementProfile(p);
  assert.equal(prof.total,n);assert.ok(prof.areas.every(a=>a.status==="skip"),"tutte giuste e sicure: basi controllate");assert.equal(prof.priorityIds.length,0);
});

test("1.10.0: una svista ricontrollata con una risposta giusta non diventa priorità",async()=>{
  const {newAdaptivePlacement,adaptiveNext}=await import("../placement.js");
  const p=newAdaptivePlacement("slip");let it,first=null;
  while(it=adaptiveNext(p)){const slip=!first&&it.area==="tenses";if(slip)first=it;p.answers.push({id:it.id,value:slip?"":it.answer,confidence:"sure"});}
  p.submitted_at=new Date().toISOString();const prof=placementProfile(p),lesson=first.lessons[0];
  assert.ok(prof.rows.filter(r=>r.item.lessons.includes(lesson)).length>=2,"la struttura sbagliata viene ricontrollata");
  assert.equal(prof.lessonStatus[lesson],"confirm");assert.ok(!prof.priorityIds.includes(lesson));
});
