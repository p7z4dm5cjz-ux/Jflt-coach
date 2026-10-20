import test from "node:test";
import assert from "node:assert/strict";
import {freshState,recommendation} from "../engine.js";
import {learnerProfile} from "../learner-profile.js";
import {validateAssessment} from "../contract.js";
import {blockAdaptation} from "../adaptive-practice.js";
import {practiceWindow} from "../grammar-checks.js";

const SK=["form","meaning","use","form","tense_choice","word_order"];
let serial=0;
// Una sessione con n risposte; results: "ok" | "bad" | "doubt" (esclusa); complete=false: blocco non ancora verificato.
function addSession(s,results,{lesson="past-simple",complete=true,hinted=false}={}){
  const id="s"+(serial++),items=results.map((r,i)=>({id:id+"-"+i,stem:id+" context "+i,kind:"completion",answer:"was",accept:["was"],options:[],skill:SK[i%SK.length],...(r==="doubt"?{doubt:true}:{})}));
  s.sessions.push({id,lesson_id:lesson,source:"local",items,assisted:false,created_at:new Date().toISOString(),completed_at:complete?new Date().toISOString():null,training:{grammar_target:results.length,page:0,checked:complete?[0,1,2,3,4]:[]},...(hinted?{hinted_items:items.map(i=>i.id)}:{})});
  s.attempts.push(...items.map((it,i)=>({id:"a"+it.id,item_id:it.id,session_id:id,lesson_id:lesson,stem:it.stem,context_id:it.id,answer:results[i]==="ok"?"was":"were",correct:results[i]==="ok",assisted:false,source:"local",date:new Date().toISOString(),...(results[i]==="doubt"?{disputed:true}:{})})));
  return id;
}
const advance=p=>({mode:"advance",focus:"meaning",reason:"Nuova prova.",goal:"Confronta.",evidence_ids:p.evidence.filter(e=>e.source==="practice").slice(-6).map(e=>e.id),item_skills:SK});
const workerAccepts=p=>{try{validateAssessment(advance(p),p);return true;}catch{return false;}};

test("1.12.1: dopo due blocchi riusciti, cinque errori e una domanda esclusa fermano l'avanzamento ovunque",()=>{
  const s=freshState();addSession(s,Array(12).fill("ok"));
  let p=learnerProfile(s,"past-simple");assert.equal(p.progression.can_advance,true);assert.equal(workerAccepts(p),true);
  const last=addSession(s,["bad","bad","bad","bad","bad","doubt"]);
  p=learnerProfile(s,"past-simple");
  assert.equal(p.progression.can_advance,false);assert.equal(p.progression.ready,false);assert.equal(workerAccepts(p),false);
  assert.equal(blockAdaptation(s,s.sessions.find(x=>x.id===last)).mode,"consolidate");
  assert.equal(practiceWindow(s,"past-simple").independent,false);
  assert.equal(recommendation(s).find(l=>l.id==="past-simple").status,"review");
});

test("1.12.1: un errore in un blocco recente non ancora verificato blocca l'aumento di difficoltà",()=>{
  const s=freshState();addSession(s,Array(12).fill("ok"));addSession(s,["ok","bad","ok"],{complete:false});
  const p=learnerProfile(s,"past-simple");assert.equal(p.progression.can_advance,false);assert.equal(workerAccepts(p),false);
});

test("1.12.1: anche sessioni brevi e diverse producono prove valide per avanzare",()=>{
  const s=freshState();for(let i=0;i<3;i++)addSession(s,["ok","ok","ok","ok"]);
  const p=learnerProfile(s,"past-simple");assert.equal(p.progression.can_advance,true);assert.equal(p.progression.ready,true);assert.equal(workerAccepts(p),true);
});

test("1.12.1: su 400 storie casuali interfaccia, profilo e Worker danno la stessa risposta",()=>{
  let x=7;const rnd=()=>(x=(x*48271)%2147483647)/2147483647;
  for(let k=0;k<400;k++){
    const s=freshState(),n=1+Math.floor(rnd()*5);
    for(let j=0;j<n;j++){const len=1+Math.floor(rnd()*8);addSession(s,Array.from({length:len},()=>{const r=rnd();return r<0.75?"ok":r<0.95?"bad":"doubt";}),{complete:rnd()>0.15,hinted:rnd()<0.05});}
    const p=learnerProfile(s,"past-simple"),ui=blockAdaptation(s,s.sessions.at(-1)).mode==="advance";
    assert.equal(p.progression.can_advance,ui,"interfaccia e profilo");
    if(p.evidence.some(e=>e.source==="practice"))assert.equal(workerAccepts(p),p.progression.can_advance,"profilo e Worker");
  }
});

test("1.12.1: il profilo resta entro 16 prove anche con molti blocchi in sospeso",async()=>{
  const {validateLearner}=await import("../contract.js");
  const s=freshState();addSession(s,Array(12).fill("ok"));for(let i=0;i<4;i++)addSession(s,["bad","ok","bad","ok","bad","ok"],{complete:false});
  const p=learnerProfile(s,"past-simple");assert.ok(p.evidence.length<=16);validateLearner(p,"past-simple");
  assert.equal(p.progression.can_advance,false);assert.equal(workerAccepts(p),false);
});
