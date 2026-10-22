import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,correct} from '../engine.js';
import {planCycle,adaptBlock,closeCycle} from '../path-planner.js';
import {cycleDecision,TRANSFER_DELAY} from '../path-levels.js';
import {pathBlockRequest,pathItemsFromReply,fallbackBlock} from '../path-flow.js';
import {validateInput,validateReply} from '../contract.js';
import {personalPractice} from '../learner-profile.js';
import {advancedPathItems,ADVANCED_PATH_LESSONS} from '../advanced-path-bank.js';
import {ruleInfo} from '../item-tags.js';
import {practiceWindow,lessonEvidence} from '../grammar-checks.js';
import {handle} from '../worker/index.js';

const t=Date.parse('2026-10-21T10:00:00Z');
const saved=(level,extra={})=>({level,autonomous:false,pending_transfer:false,changed_at:null,history:[],...extra});
function answer(state,cycle,{at=t,prefix='first',ok=()=>true,assisted=false,unchecked=false}={}){
  const block_ids=[];
  cycle.blocks.forEach((slots,b)=>{
    const id=prefix+'-'+b;block_ids.push(id);
    const items=slots.map((slot,i)=>({id:id+'-'+i,stem:prefix+' new situation '+b+' '+i,answer:'x',rules:[slot.rule],level:slot.level,focus_lesson:slot.lesson_id,path_role:slot.role,origin:'groq',check:unchecked?'unchecked':'confirmed',...(slot.group?{group:slot.group}:{})}));
    state.sessions.push({id,lesson_id:cycle.main,path_id:'test',items,completed_at:new Date(at).toISOString()});
    for(const [i,it] of items.entries())state.attempts.push({id:'a-'+it.id,session_id:id,item_id:it.id,lesson_id:it.focus_lesson,stem:it.stem,answer:ok(slots[i],b,i)?'x':'wrong',correct:ok(slots[i],b,i),assisted,source:'groq',date:new Date(at).toISOString()});
  });
  return {...cycle,block_ids};
}

test('15 sulla principale anche con prerequisiti noti; gli errori del primo blocco guidano il secondo',()=>{
  const s=freshState();s.lesson_levels={'past-simple':saved(2),'present-simple':saved(4,{autonomous:true})};
  const c=planCycle(s,{force:'past-simple'});
  assert.equal(c.phase,'focused');assert.equal(c.blocks.flat().length,15);
  assert.ok(c.blocks.flat().every(x=>x.lesson_id==='past-simple'));
  const small={...c,blocks:[c.blocks[0].map(x=>({...x,rule:'past-simple.neg'}))]};
  answer(s,small,{ok:()=>false});
  const next=adaptBlock(s,c,1);
  assert.equal(next.filter(x=>x.rule==='past-simple.neg').length,2);
  assert.ok(new Set(next.map(x=>x.rule)).size>=2);
});

test('80% complessivo non nasconde due errori ripetuti sulla negazione',()=>{
  const s=freshState();s.lesson_levels={'past-simple':saved(2)};
  const c=planCycle(s,{force:'past-simple'});
  c.blocks.flat().forEach((slot,i)=>slot.rule='past-simple.'+(i<3?'neg':'use'));
  answer(s,c,{ok:(_,b,i)=>b*5+i>=2});
  const r=cycleDecision(s,'past-simple');
  assert.equal(r.correct,13);assert.equal(r.n,15);assert.equal(r.decision,'stay');assert.deepEqual(r.weak_rules,['past-simple.neg']);
});

test('testi nuovi: prima prova, attesa reale, seconda prova e autonomia coerente nei progressi',()=>{
  const s=freshState();s.lesson_levels={'past-simple':saved(4,{pending_transfer:true})};
  const c=planCycle(s,{timestamp:t});assert.equal(c.phase,'transfer');
  assert.ok(c.blocks.every(b=>b.length===5&&b.every(x=>x.group)));
  const first=closeCycle(s,answer(s,c),new Date(t).toISOString());
  assert.equal(first.awaiting_delay,true);assert.equal(s.lesson_levels['past-simple'].autonomous,false);
  assert.equal(Date.parse(first.transfer_due),t+TRANSFER_DELAY);
  assert.notEqual(planCycle(s,{timestamp:t+1000}).main,'past-simple');
  const tooEarly=closeCycle(s,answer(s,c,{prefix:'early',at:t+1000}),new Date(t+1000).toISOString());
  assert.equal(tooEarly.confirmed,false);assert.equal(s.lesson_levels['past-simple'].autonomous,false);
  const due=planCycle(s,{timestamp:t+TRANSFER_DELAY});assert.equal(due.phase,'transfer');assert.equal(due.main,'past-simple');
  const result=closeCycle(s,answer(s,due,{prefix:'delayed',at:t+TRANSFER_DELAY}),new Date(t+TRANSFER_DELAY).toISOString());
  assert.equal(result.confirmed,true);assert.equal(s.lesson_levels['past-simple'].pending_transfer,false);
  assert.equal(practiceWindow(s,'past-simple').independent,true);assert.equal(lessonEvidence(s,'past-simple').delayed,true);
});

test('trasferimento: aiuti, controlli mancanti e ripetizioni non confermano; errori tornano al contesto',()=>{
  for(const flags of [{assisted:true},{unchecked:true}]){
    const s=freshState();s.lesson_levels={'past-simple':saved(4,{pending_transfer:true})};
    const c=planCycle(s,{timestamp:t});const r=closeCycle(s,answer(s,c,flags),new Date(t).toISOString());
    assert.equal(r.decision,'insufficient');assert.equal(s.lesson_levels['past-simple'].transfer_passed_at,undefined);
  }
  const s=freshState();s.lesson_levels={'past-simple':saved(4,{pending_transfer:true})};
  const c=planCycle(s,{timestamp:t});closeCycle(s,answer(s,c),new Date(t).toISOString());
  const repeated=closeCycle(s,answer(s,c,{at:t+TRANSFER_DELAY}),new Date(t+TRANSFER_DELAY).toISOString());
  assert.equal(repeated.confirmed,false);
  const wrong=closeCycle(s,answer(s,c,{prefix:'fail',at:t+TRANSFER_DELAY,ok:()=>false}),new Date(t+TRANSFER_DELAY).toISOString());
  assert.equal(wrong.to,3);assert.equal(s.lesson_levels['past-simple'].pending_transfer,false);
});

test('cinque spazi nel contratto e nel Worker, controllo alla cieca e risposta breve',async()=>{
  const s=freshState();s.lesson_levels={'past-simple':saved(4,{pending_transfer:true})};
  const cycle={...planCycle(s,{timestamp:t}),n:1},data=pathBlockRequest(s,{id:'test'},cycle,0);
  validateInput('path_block',data);
  const group=data.slots[0].group;
  const reply={passages:[{group,text:'A new report: (1) ___ then (2) ___ and (3) ___ before (4) ___ and (5) ___.'}],items:data.slots.map((slot,i)=>({n:i+1,kind:'completion',stem:'Spazio ('+(i+1)+'): scrivi la forma corretta (leave).',answer:'left',accept:['left'],options:[],why:'Evento passato concluso.',group}))};
  validateReply('path_block',reply,data);
  const broken=structuredClone(reply);broken.passages[0].text=broken.passages[0].text.replace('(5) ___','');
  assert.throws(()=>validateReply('path_block',broken,data),/manca lo spazio/);
  const token='test-token-more-than-24-characters';
  const env={APP_TOKEN:token,GROQ_API_KEY:'test-only',ALLOWED_ORIGIN:'https://example.test',MODEL:'openai/gpt-oss-120b',BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
  const request=new Request('https://worker.test/tutor',{method:'POST',headers:{Authorization:'Bearer '+token,Origin:env.ALLOWED_ORIGIN,'Content-Type':'application/json'},body:JSON.stringify({api_version:1,request_id:'req-transfer',task:'path_block',data,verify:true})});
  const sent=[];
  const response=await handle(request,env,async(_,o)=>{const payload=JSON.parse(o.body);sent.push(payload);const result=sent.length===1?reply:{answers:data.slots.map((slot,i)=>({n:i+1,best:'left',all_valid:[],ambiguous:false,rule:slot.rule,names_form:false}))};return Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify(result)}}]});});
  assert.equal(response.status,200);assert.equal(sent.length,2);
  assert.match(sent[0].messages[0].content,/CINQUE spazi/);
  assert.ok(!JSON.stringify(JSON.parse(sent[1].messages[1].content)).includes('"answer"'));
  const result=(await response.json()).result;
  const items=pathItemsFromReply(result,data.slots);assert.ok(items.every(i=>i.check==='confirmed'&&i.passage));
  assert.equal(new Set(items.map(i=>i.context_id)).size,5);
  s.sessions.push({lesson_id:'other-topic',items});
  const personal=personalPractice(s,'past-simple');assert.equal(personal.length,5);assert.ok(personal.every(i=>i.passage&&i.personal_review));
});

test('errori nelle lezioni intrecciate non abbassano una principale risolta correttamente',()=>{
  const s=freshState();s.lesson_levels={'past-simple':saved(4,{pending_transfer:true}),'present-simple':saved(4,{autonomous:true}),'past-continuous':saved(4,{autonomous:true}),'articles':saved(4,{autonomous:true})};
  const c=planCycle(s,{force:'past-simple',timestamp:t});assert.ok(c.roles.intertwined.length);
  const r=closeCycle(s,answer(s,c,{ok:slot=>slot.lesson_id==='past-simple'}),new Date(t).toISOString());
  assert.equal(r.accuracy,1);assert.equal(r.decision,'stay');assert.equal(r.to,4);
  assert.ok(r.secondary.length);assert.equal(s.lesson_levels['past-simple'].autonomous,false);
});

test('riserva avanzata: trenta contesti diversi, regole esistenti, soluzioni accettate e scelta offline',()=>{
  const all=ADVANCED_PATH_LESSONS.flatMap(advancedPathItems);
  assert.equal(all.length,30);assert.equal(new Set(all.map(i=>i.stem)).size,30);
  for(const item of all){assert.equal(item.level,3);assert.ok(ruleInfo(item.rules[0]));assert.ok(correct(item,item.answer));assert.ok(!/usa il (?:past|present)/i.test(item.stem));}
  const slots=Array.from({length:5},()=>({lesson_id:'past-simple',rule:'past-simple.use',level:3,role:'main'}));
  const result=fallbackBlock(freshState(),slots);assert.equal(result.exact,5);assert.ok(result.items.every(i=>i.level===3));
});
