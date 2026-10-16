import test from "node:test";
import assert from "node:assert/strict";
import {handle} from "../worker/index.js";
import {SHAPES,anchorTest,validateInput} from "../contract.js";
import {applyVerification,VERIFY_SCHEMA} from "../verification.js";
import {parseBackup} from "../storage.js";
import {freshState,VERSION} from "../engine.js";
import {callTutor,saveToken} from "../tutor.js";

const token="test-token-abcdefghijklmnopqrstuvwxyz";
const budget={idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})};
const env={APP_TOKEN:token,GROQ_API_KEY:"gsk_test_secret",ALLOWED_ORIGIN:"https://example.test",BUDGET:budget};
const passage="The inspection of the northern depot was postponed because two officers were unavailable. A new date has not been confirmed. According to the duty manager, the delay will not affect deliveries this week. However, staff have been asked to keep the loading area clear at all times. Several drivers complained that the notice arrived late, and one described the instructions as vague. The manager accepted that the message could have been clearer and promised a written update by Friday. Until then, visitors must sign in at the main gate and wait to be escorted. The council, which owns the site, has not commented on the decision. Local residents, who often use the road beside the depot, were not informed directly, although the change is unlikely to affect them. The report on the previous inspection, published in March, had already recommended better communication with drivers and contractors.";
const request=(task,data,extra={})=>new Request("https://worker.test/tutor",{method:"POST",headers:{Authorization:"Bearer "+token,Origin:env.ALLOWED_ORIGIN,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-180",task,data,...extra})});
const ok=result=>Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(result)}}]});
const exercisesData={lesson_id:"past-simple",terms:[],practice:{block:1,total:30}};

test("1.8.0: quota esaurita sul modello grande → stesso compito con gpt-oss-20b",async()=>{
  const models=[];
  const res=await handle(request("exercises",exercisesData),env,async(_u,o)=>{const body=JSON.parse(o.body);models.push(body.model);return body.model==="openai/gpt-oss-120b"?Response.json({error:{code:"rate_limit_exceeded"}},{status:429,headers:{"Retry-After":"60"}}):ok(SHAPES.exercises);});
  const body=await res.json();
  assert.equal(res.status,200);assert.deepEqual(models,["openai/gpt-oss-120b","openai/gpt-oss-20b"]);assert.equal(body.model_used,"openai/gpt-oss-20b");assert.equal(body.diagnostics.fallback,true);
  let calls=0;const off=await handle(request("exercises",exercisesData),{...env,MODEL_FALLBACK:"off"},async()=>{calls++;return Response.json({error:{code:"rate_limit_exceeded"}},{status:429});});
  assert.equal(off.status,429);assert.equal(calls,1);
});

test("1.8.0: errore di formato dello schema rigido → un solo nuovo tentativo",async()=>{
  let calls=0;
  const res=await handle(request("clarify",{term:"carry out",context:"The team will carry out a routine inspection."}),env,async()=>{calls++;return calls===1?Response.json({error:{code:"json_validate_failed",message:"x"}},{status:400}):ok(SHAPES.clarify);});
  assert.equal(res.status,200);assert.equal(calls,2);assert.equal((await res.json()).diagnostics.format_retry,true);
  let again=0;const fail=await handle(request("clarify",{term:"carry out",context:"The team will carry out a routine inspection."}),env,async()=>{again++;return Response.json({error:{code:"json_validate_failed"}},{status:400});});
  assert.equal(fail.status,502);assert.equal(again,2);
});

test("1.8.0: il controllo alla cieca conferma, estende o segnala senza cambiare la soluzione",async()=>{
  const sent=[];
  const solver={answers:[
    {n:1,best:"are",all_valid:[],ambiguous:false},
    {n:2,best:"gone",all_valid:[],ambiguous:false},
    {n:3,best:"went",all_valid:[],ambiguous:false},
    {n:4,best:"have finished",all_valid:["have completed"],ambiguous:false},
    {n:5,best:"They didn't check the gate.",all_valid:[],ambiguous:false},
    {n:6,best:"She doesn't work here.",all_valid:[],ambiguous:true}
  ]};
  const res=await handle(request("exercises",exercisesData,{verify:true}),env,async(_u,o)=>{const body=JSON.parse(o.body);sent.push(body);return ok(sent.length===1?SHAPES.exercises:solver);});
  const body=await res.json();
  assert.equal(res.status,200);assert.equal(sent.length,2);
  assert.deepEqual(sent[1].response_format.json_schema.schema,VERIFY_SCHEMA);assert.equal(sent[1].temperature,0);
  const shown=JSON.parse(sent[1].messages[1].content);assert.ok(shown.items.every(i=>!("answer" in i)&&!("accept" in i)&&!("why" in i)));
  const items=body.result.items;
  assert.deepEqual(items.map(i=>i.check),["confirmed","doubt","doubt","extended","confirmed","confirmed"]);
  assert.equal(items[1].answer,SHAPES.exercises.items[1].answer);assert.equal(items[1].doubt,true);assert.match(items[1].check_note,/gone/);
  assert.ok(items[3].accept.includes("have completed"));assert.deepEqual(items[3].accept_added,["have completed"]);
  assert.deepEqual(body.verification,{checked:6,confirmed:3,extended:1,doubts:2,status:"done"});
});

test("1.8.0: se il controllo non risponde, gli esercizi arrivano comunque, segnati come non controllati",async()=>{
  let calls=0;const res=await handle(request("exercises",exercisesData,{verify:true}),env,async()=>{calls++;return calls===1?ok(SHAPES.exercises):Response.json({error:{code:"server_error"}},{status:500});});
  const body=await res.json();assert.equal(res.status,200);assert.equal(body.verification.status,"unavailable");assert.ok(body.result.items.every(i=>i.check==="unchecked"&&!i.doubt));
  let plain=0;await handle(request("exercises",exercisesData),env,async()=>{plain++;return ok(SHAPES.exercises);});assert.equal(plain,1);
});

test("1.8.0: varianti aggiunte al massimo fino a 8 e mai per le scelte multiple",()=>{
  const item={kind:"completion",stem:"x ___",answer:"a1",accept:["a1","a2","a3","a4","a5","a6","a7"],options:[]};
  const {items}=applyVerification([item],{answers:[{n:1,best:"a1",all_valid:["b1","b2","b3"],ambiguous:false}]});
  assert.equal(items[0].accept.length,8);
  const choice={kind:"choice",stem:"y ___",answer:"is",accept:["is"],options:["am","is","are"]};
  const r=applyVerification([choice],{answers:[{n:1,best:"is",all_valid:["are"],ambiguous:false}]});
  assert.deepEqual(r.items[0].accept,["is"]);assert.equal(r.items[0].check,"confirmed");
});

test("1.8.0: prova di comprensione stile JFLT, con citazioni ancorate e controllo",async()=>{
  assert.throws(()=>validateInput("reading_test",{text:"Too short."}),/120 parole/);
  const invented=structuredClone(SHAPES.reading_test);invented.questions[0].quote="This sentence is not in the passage.";
  assert.equal(anchorTest(invented,passage).questions.length,5);
  const solver={answers:SHAPES.reading_test.questions.slice(1).map((q,i)=>({n:i+1,best:q.type==="vocabulary"?"late":q.answer,all_valid:[],ambiguous:false}))};
  let calls=0;const res=await handle(request("reading_test",{text:passage},{verify:true}),env,async(_u,o)=>{calls++;const body=JSON.parse(o.body);if(calls===2)assert.equal(JSON.parse(body.messages[1].content).passage,passage);return ok(calls===1?invented:solver);});
  const body=await res.json();
  assert.equal(res.status,200);assert.equal(body.result.questions.length,5);assert.equal(body.result.omitted,1);
  assert.equal(body.result.questions.filter(q=>q.doubt).length,1);
  const broken=structuredClone(SHAPES.reading_test);broken.questions.forEach((q,i)=>{if(i<3)q.quote="Not in the text "+i;});
  const bad=await handle(request("reading_test",{text:passage}),env,async()=>ok(broken));assert.equal(bad.status,502);
});

test("1.8.0: il client chiede il controllo solo per esercizi e prove di lettura",async()=>{
  saveToken(token);const flags={};
  const fetcher=async(url,options)=>{if(url.endsWith("/health"))return Response.json({version:VERSION,api_version:1,groq_configured:true,capabilities:["exercises","clarify","reading_test"]});const body=JSON.parse(options.body);flags[body.task]=body.verify===true;return Response.json({result:body.task==="clarify"?SHAPES.clarify:SHAPES[body.task]});};
  await callTutor({endpoint:"https://flags.workers.dev"},"/tutor","exercises",exercisesData,fetcher).catch(()=>{});
  await callTutor({endpoint:"https://flags.workers.dev"},"/tutor","clarify",{term:"carry out",context:"The team will carry out a routine inspection."},fetcher).catch(()=>{});
  await callTutor({endpoint:"https://flags.workers.dev"},"/tutor","reading_test",{text:passage},fetcher).catch(()=>{});
  assert.deepEqual(flags,{exercises:true,clarify:false,reading_test:true});
});

test("1.8.0: il backup conserva la prova di lettura e rifiuta citazioni senza riscontro",()=>{
  const s=freshState(),created=new Date().toISOString();
  const questions=SHAPES.reading_test.questions.map(q=>({...q}));questions[1].doubt=true;
  s.readings=[{id:"r1",title:"Depot",source:"",text:passage,translation:"",feedback:null,created_at:created,test:{id:"t1",questions,omitted:0,verification:{status:"done"},source_text:passage,answers:{0:questions[0].answer,1:questions[1].options[0]},started_at:created,completed_at:created,score:1,total:5},test_history:[{score:3,total:6,completed_at:created}]}];
  const wrap=state=>JSON.stringify({format:"jflt-coach-backup/v2",app_version:"1.8.0",exported_at:created,state});
  assert.equal(parseBackup(wrap(s)).readings[0].test.questions.length,6);
  const tampered=structuredClone(s);tampered.readings[0].test.questions[0].quote="Invented sentence.";
  assert.throws(()=>parseBackup(wrap(tampered)),/riscontro/);
});
