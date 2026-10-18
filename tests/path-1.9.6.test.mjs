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

test("1.9.6: dopo il pretest le due aree più deboli si alternano nelle prime tappe",()=>{
  const wrong=new Set(["N01","N02","N03","N04","N05","N06","N07","T01","T02","T03","T04","T05","T06"]);
  const s=freshState(),t=new Date().toISOString();
  s.placement={version:1,bank_version:BANK_VERSION,seed:"x",answers:QUESTIONS.map(q=>({id:q.id,value:wrong.has(q.id)?"":q.answer,confidence:"sure"})),position:44,started_at:t,submitted_at:t};
  const tenseLessons=new Set(QUESTIONS.filter(q=>q.area==="tenses").flatMap(q=>q.lessons));
  const top=recommendation(s).slice(0,4).map(l=>l.id);
  assert.equal(top[0],"negatives");
  assert.ok(tenseLessons.has(top[1]),"la seconda tappa deve essere un tempo verbale: "+top.join(", "));
  assert.ok(top.filter(id=>tenseLessons.has(id)).length>=2);
  assert.equal(placementProfile(s.placement).priorityIds.length,new Set(placementProfile(s.placement).priorityIds).size);
});
