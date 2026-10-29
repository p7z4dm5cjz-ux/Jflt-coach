import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,correct} from '../engine.js';
import {FOUNDATION_LESSONS,pathFoundationItems} from '../core-practice.js';
import {lessonRules,ruleInfo} from '../item-tags.js';
import {planCycle,closeCycle} from '../path-planner.js';
import {fallbackBlock,cycleSummary,ensureFreshPathReply,pathBlockRequest} from '../path-flow.js';
import {pathAnswers,cycleDecision} from '../path-levels.js';
import {validateInput} from '../contract.js';
import {tutorGateway} from '../private-gateway.js';
import {callTutor,saveToken} from '../tutor.js';
import {VERSION,API_VERSION} from '../engine.js';

function localCycle(s,lesson,level,prefix){
  const cycle={...planCycle(s,{force:lesson}),n:1,block_ids:[]};
  for(const [page,slots] of cycle.blocks.entries()){
    const {items,exact}=fallbackBlock(s,slots);assert.equal(items.length,5);assert.equal(exact,5,lesson+' '+level+' '+page);
    const id=prefix+'-'+page,set={id,path_id:prefix,lesson_id:lesson,source:'local',completed_at:new Date().toISOString(),items:items.map((i,n)=>({...i,id:id+'-'+n}))};
    s.sessions.push(set);cycle.block_ids.push(id);
    for(const i of set.items)s.attempts.push({id:'a-'+i.id,session_id:id,item_id:i.id,lesson_id:lesson,stem:i.stem,context_id:i.context_id,correct:true,assisted:false,source:'local',date:new Date().toISOString()});
  }
  return cycle;
}

test('17 argomenti: 15 contesti distinti a livello 1, poi altri 15 a livello 2',()=>{
  for(const lesson of FOUNDATION_LESSONS){
    const s=freshState();s.lesson_levels={[lesson]:{level:1,autonomous:false,pending_transfer:false,history:[]}};
    const first=localCycle(s,lesson,1,'recognition');let result=closeCycle(s,first);assert.equal(result.n,15,lesson);assert.equal(result.to,2,lesson);
    const second=localCycle(s,lesson,2,'production');result=closeCycle(s,second);assert.equal(result.n,15,lesson);assert.equal(result.to,3,lesson);
    assert.equal(new Set(s.attempts.map(a=>a.context_id||a.stem)).size,30,lesson);
  }
});

test('la banca nuova conserva il contesto tra operazioni e tutte le soluzioni sono correggibili',()=>{
  for(const lesson of FOUNDATION_LESSONS){const items=pathFoundationItems(lesson);assert.equal(new Set(items.map(i=>i.context_id)).size,36);
    for(const i of items){assert.ok(ruleInfo(i.rules[0]));assert.ok(correct(i,i.answer));assert.ok(i.stem.length<=220);if(i.kind==='choice'){assert.equal(new Set(i.options).size,3);assert.ok(i.options.includes(i.answer));}}
    for(const context of new Set(items.map(i=>i.context_id)))assert.ok(items.filter(i=>i.context_id===context).length>=4);
  }
});

test('15 corrette con due contesti: mostra 2 nuove e 13 ripetizioni senza promuovere',()=>{
  const s=freshState(),lesson='past-simple',cycle={...planCycle(s,{force:lesson}),n:1,level:2,block_ids:['s']};
  const items=Array.from({length:15},(_,n)=>({id:'i'+n,stem:'Frase diversa '+n,context_id:'event'+n%2,answer:'x',origin:'local',level:2,rules:['past-simple.form']}));
  s.sessions=[{id:'s',path_id:'test',lesson_id:lesson,source:'local',items,completed_at:new Date().toISOString()}];
  s.attempts=items.map(i=>({session_id:'s',item_id:i.id,lesson_id:lesson,stem:i.stem,correct:true,assisted:false,source:'local',date:new Date().toISOString()}));
  const summary=cycleSummary(s,cycle);assert.equal(summary.correct,15);assert.equal(summary.evidence.valid,2);assert.equal(summary.evidence.repeated,13);
  assert.equal(cycleDecision(s,lesson,2).decision,'insufficient');
  // Anche i vecchi tentativi senza context_id recuperano l'identità dall'esercizio.
  assert.equal(pathAnswers(s,lesson).length,2);
});

test('la guida registrata sull’esercizio resta esclusa anche se il tentativo perde il flag',()=>{
  const s=freshState();s.sessions=[{id:'s',path_id:'test',source:'local',completed_at:new Date().toISOString(),items:[{id:'i',stem:'Unique guided exercise',origin:'local',fallback_guided:true,level:2,rules:['past-simple.form']}]}];
  s.attempts=[{session_id:'s',item_id:'i',lesson_id:'past-simple',stem:'Unique guided exercise',correct:true,assisted:false,source:'local'}];
  assert.equal(pathAnswers(s,'past-simple').length,0);
});

test('un blocco generato che ricicla frasi viene rifiutato senza altra chiamata',()=>{
  const s=freshState();s.sessions=[{items:[{stem:'Already proposed sentence'}]}];
  const slots=Array.from({length:5},(_,i)=>({n:i+1,lesson_id:'past-simple',rule:'past-simple.form',level:2,role:'main'}));
  const result={passages:[],items:slots.map((slot,i)=>({n:i+1,stem:i?'New question '+i:'Already proposed sentence',answer:'left',kind:'completion',accept:['left'],options:[],why:'Past.',group:''}))};
  assert.throws(()=>ensureFreshPathReply(s,result,slots),/ripetuto/);
  result.items[0].stem='New question 1';assert.throws(()=>ensureFreshPathReply(freshState(),result,slots),/ripetuto/);
});

test('la richiesta al tutor contiene risultati e copertura coerenti con le prove locali',()=>{
  const s=freshState();s.lesson_levels={'past-simple':{level:2,autonomous:false,pending_transfer:false,history:[]}};
  const cycle=localCycle(s,'past-simple',2,'test'),data=pathBlockRequest(s,{id:'path-test'},cycle,2);
  validateInput('path_block',data);assert.equal(data.progress.n,15);assert.equal(data.progress.correct,15);assert.equal(data.progress.needed,0);assert.ok(data.coverage.length>=3);
  const bad=structuredClone(data);bad.progress.needed=1;assert.throws(()=>validateInput('path_block',bad),/Progresso/);
});

test('il codice personale può usare i secret del sito con il prompt corrente, senza esporre la chiave',async()=>{
  const token='personal-token-more-than-24-characters',key='server-only-secret';let called=false;
  const request=new Request('https://coach.example/api/health',{headers:{Authorization:'Bearer '+token}});
  const env={APP_TOKEN:token,GROQ_API_KEY:key};
  const response=await tutorGateway(request,async()=>{called=true;throw Error('unexpected network');},env);
  assert.equal(response.status,200);const health=await response.json();assert.equal(called,false);assert.equal(health.connection_mode,'server_secret');assert.equal(health.prompt_revision,'groq-path-feedback-v20');assert.ok(health.features.includes('path_feedback'));assert.ok(!JSON.stringify(health).includes(key));
  const denied=await tutorGateway(new Request('https://coach.example/api/health',{headers:{Authorization:'Bearer wrong-token-more-than-24-characters'}}),async()=>{},env);assert.equal(denied.status,401);
});

test('un Worker con il prompt precedente viene segnalato prima di generare un blocco',async()=>{
  saveToken('test-only-client-code-more-than-24');let calls=0;
  try {
    const s=freshState(),cycle={...planCycle(s,{force:'past-simple'}),n:1},data=pathBlockRequest(s,{id:'test'},cycle,0);
    await assert.rejects(()=>callTutor(s.settings,'/tutor','path_block',data,async()=>{calls++;return Response.json({api_version:API_VERSION,version:VERSION,groq_configured:true,capabilities:['path_block'],features:['path_block']});}),/prompt precedente/);
    assert.equal(calls,1);
  }finally{saveToken('');}
});
