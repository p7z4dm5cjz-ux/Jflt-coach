import test from "node:test";
import assert from "node:assert/strict";
import {QUESTIONS,BANK_VERSION} from "../placement.js";
import {freshState,recommendation,dailyPlan} from "../engine.js";

function pretest(){
  const s=freshState(),t=new Date().toISOString(),wrong={tenses:6,negatives:7,phrasals:2,basics:1,clauses:1,patterns:3},count={};
  s.placement={version:1,bank_version:BANK_VERSION,seed:"x",answers:QUESTIONS.map(q=>{count[q.area]=(count[q.area]||0)+1;return {id:q.id,value:count[q.area]<=(wrong[q.area]||0)?"":q.answer,confidence:"sure"};}),position:44,started_at:t,submitted_at:t};
  return s;
}
const session=(s,lesson,id,correct,total=30)=>{for(let i=0;i<total;i++)s.attempts.push({lesson_id:lesson,correct:i<correct,assisted:false,disputed:false,source:"local",session_id:id,context_id:id+"-"+i,stem:id+"-"+i,date:new Date().toISOString()});};

test("1.9.3: dopo una sessione da 30 riuscita la tappa lascia il posto alla successiva",()=>{
  const s=pretest();const first=recommendation(s)[0].id;
  session(s,first,"s1",20);assert.equal(recommendation(s)[0].id,first,"con il 67% la tappa resta in testa");
  session(s,first,"s2",27);
  assert.notEqual(recommendation(s)[0].id,first);assert.notEqual(dailyPlan(s).lesson_id,first);
  assert.equal(recommendation(s).find(l=>l.id===first).status,"confirm");
});

test("1.9.3: due sessioni intere riuscite portano al mantenimento anche con 30 esercizi",()=>{
  const s=pretest();session(s,"negatives","a",27);session(s,"negatives","b",28);
  assert.equal(recommendation(s).find(l=>l.id==="negatives").status,"maintain");
});
