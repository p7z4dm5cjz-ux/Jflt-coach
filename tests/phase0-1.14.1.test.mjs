import test from "node:test";
import assert from "node:assert/strict";
import {handle} from "../worker/index.js";
import {freshState} from "../engine.js";
import {exerciseRequest} from "../practice-flow.js";
import {SHAPES,settleAssessment,validateAssessment} from "../contract.js";

const token="phase0-test-token-long-enough-1234";
const env={APP_TOKEN:token,GROQ_API_KEY:"test-only",ALLOWED_ORIGIN:"https://example.test",MODEL:"openai/gpt-oss-120b",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
const send=(data,verify=false)=>new Request("https://worker.test/tutor",{method:"POST",headers:{Authorization:"Bearer "+token,Origin:env.ALLOWED_ORIGIN,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-phase0",task:"exercises",data,...(verify?{verify:true}:{})})});
// Una sola risposta corretta: non bastano le prove per aumentare la difficoltà.
const withOne=()=>{const s=freshState();s.sessions=[{id:"s",lesson_id:"future-going-to",items:[{id:"i",stem:"She ___ going to leave.",answer:"is",skill:"form",kind:"completion",origin:"groq",check:"confirmed"}]}];s.attempts=[{id:"a",session_id:"s",item_id:"i",lesson_id:"future-going-to",stem:"She ___ going to leave.",answer:"is",correct:true,assisted:false,source:"groq",date:"2026-10-19T10:00:00Z"}];return s;};
const assessment=(mode,ids)=>({mode,focus:"meaning",reason:"Proposta del tutor.",goal:"Distingui intenzione e decisione.",evidence_ids:ids,item_skills:["meaning","form","tense_choice","word_order","use","form"]});
const reply=result=>async()=>Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(result)}}]});

test("1.14.1: un aumento non consentito diventa 'mantieni' e il blocco viene comunque creato",async()=>{
  const data=exerciseRequest(withOne(),"future-going-to");
  const res=await handle(send(data),env,reply({...structuredClone(SHAPES.exercises),assessment:assessment("advance",["a"])}));
  const body=await res.json();assert.equal(res.status,200,JSON.stringify(body));
  assert.equal(body.result.assessment.mode,"hold");assert.equal(body.diagnostics.assessment_adjusted,"advance->hold");
  assert.equal(body.result.items.length,6);validateAssessment(body.result.assessment,data.learner);
});

test("1.14.1: senza prove la proposta diventa una diagnosi; le valutazioni corrette restano invariate",()=>{
  const empty=exerciseRequest(freshState(),"future-going-to").learner;
  const s=settleAssessment(assessment("hold",[]),empty);assert.equal(s.assessment.mode,"diagnose");validateAssessment(s.assessment,empty);
  const one=exerciseRequest(withOne(),"future-going-to").learner,ok=assessment("hold",["a"]);
  assert.deepEqual(settleAssessment(ok,one),{assessment:ok,changed:null});
  assert.throws(()=>validateAssessment(assessment("hold",["inventata"]),one),/riscontro/,"prove inventate restano un errore");
});

test("1.14.1: il prompt dice la stessa regola di avanzamento applicata dal Worker",async()=>{
  let system="";const data=exerciseRequest(withOne(),"future-going-to");
  await handle(send(data),env,async(_u,o)=>{system=JSON.parse(o.body).messages[0].content;return reply({...structuredClone(SHAPES.exercises),assessment:assessment("hold",["a"])})();});
  assert.match(system,/learner\.progression\.can_advance è true/);assert.match(system,/nessun errore più recente/);
});

test("1.14.1: VERIFY_MODEL controlla con un altro modello e, se non risponde, torna al generatore",async()=>{
  const data={lesson_id:"past-simple",terms:[]},items={items:SHAPES.exercises.items},check={answers:SHAPES.exercises.items.map((it,i)=>({n:i+1,best:it.answer,all_valid:[],ambiguous:false}))};
  for(const failing of [false,true]){
    const used=[];
    const res=await handle(send(data,true),{...env,VERIFY_MODEL:"qwen/qwen3.8-27b"},async(_u,o)=>{const b=JSON.parse(o.body);used.push(b.model);
      if(b.response_format.json_schema.name==="jflt_verify"){if(failing&&b.model==="qwen/qwen3.8-27b")return Response.json({error:{code:"model_not_found"}},{status:404});assert.equal(b.reasoning_effort,b.model==="qwen/qwen3.8-27b"?undefined:"medium");return reply(check)();}
      return reply(items)();});
    const body=await res.json();assert.equal(res.status,200,JSON.stringify(body));
    assert.deepEqual(used,failing?["openai/gpt-oss-120b","qwen/qwen3.8-27b","openai/gpt-oss-120b"]:["openai/gpt-oss-120b","qwen/qwen3.8-27b"]);
    assert.equal(body.diagnostics.verification_model,failing?"openai/gpt-oss-120b":"qwen/qwen3.8-27b");assert.equal(!!body.diagnostics.verification_model_fallback,failing);
    assert.equal(body.verification.confirmed,6);
  }
});

test("1.14.1: senza VERIFY_MODEL il controllo usa lo stesso modello di prima",async()=>{
  const used=[],check={answers:SHAPES.exercises.items.map((it,i)=>({n:i+1,best:it.answer,all_valid:[],ambiguous:false}))};
  const res=await handle(send({lesson_id:"past-simple",terms:[]},true),env,async(_u,o)=>{const b=JSON.parse(o.body);used.push(b.model);return reply(b.response_format.json_schema.name==="jflt_verify"?check:{items:SHAPES.exercises.items})();});
  assert.equal(res.status,200);assert.deepEqual(used,["openai/gpt-oss-120b","openai/gpt-oss-120b"]);
});
