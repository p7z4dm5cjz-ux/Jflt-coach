import test from "node:test";
import assert from "node:assert/strict";
import Ajv from "ajv";
import {TASKS,SHAPES,REPLY_SCHEMAS,validateReply} from "../contract.js";
import {handle} from "../worker/index.js";
import {callTutor,saveToken} from "../tutor.js";

const token="request-format-token-longer-than-24";
const env={APP_TOKEN:token,GROQ_API_KEY:"private-test-provider-key",ALLOWED_ORIGIN:"https://example.test",MODEL:"openai/gpt-oss-120b",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
const inputs={
  grammar_explain:{lesson_id:"present-perfect-simple",question:"Quando scelgo il past simple?"},
  writing_coach:{unit_id:"email-request",type:"email",stage:1,round:0,mode:"review",topic:"Scrivi una richiesta cortese",text:"I am writing to ask about the course.\nFour colleagues are available on Monday.\nCould you confirm the date and equipment?",question:""},
  exercises:{lesson_id:"present-perfect-simple",terms:[{expression:"carry out",meaning_it:"eseguire"}],recent_errors:[{stem:"Completa: She ___ the report. (write, present perfect)",answer:"has wrote"}]},
  writing_review:{type:"report",topic:"Fictional gate check",text:"The officers has checked the gate.",mode:"practice"},
  writing_compare:{type:"report",topic:"Fictional gate check",text:"The officers has checked the gate.",rewrite:"The officers have checked the gate.",issues:[]},
  reading_understand:{text:"The officers have checked the gate.",selection:""},
  translate:{paragraphs:["The officers have checked the gate."]},
  reading_test:{text:"The inspection of the northern depot was postponed because two officers were unavailable. A new date has not been confirmed. According to the duty manager, the delay will not affect deliveries this week. However, staff have been asked to keep the loading area clear at all times. Several drivers complained that the notice arrived late, and one described the instructions as vague. The manager accepted that the message could have been clearer and promised a written update by Friday. Until then, visitors must sign in at the main gate and wait to be escorted. The council, which owns the site, has not commented on the decision. Local residents, who often use the road beside the depot, were not informed directly, although the change is unlikely to affect them. The report on the previous inspection, published in March, had already recommended better communication with drivers and contractors."},
  reading_review:{text:"The officers have checked the gate.",translation:"Gli agenti hanno controllato il cancello."},
  clarify:{term:"carry out",context:"The team will carry out a routine inspection."},
  path_block:{path_id:"path-format",cycle:1,page:0,main_lesson:"present-simple",main_level:4,slots:[1,2,3].map(n=>({n,lesson_id:"present-simple",rule:"present-simple.use",level:4,role:"main",group:"p1"})).concat([{n:4,lesson_id:"future-going-to",rule:"future-going-to.evidence",level:1,role:"review",group:null},{n:5,lesson_id:"present-simple",rule:"present-simple.neg",level:2,role:"main",group:null}])},
  diagnosis:{areas:[{area:"Negazioni e domande",correct:1,total:8}],errors:[{area:"Negazioni e domande",lessons:["negatives","past-simple"],stem:"Frase negativa al passato. Scrivi solo le parole mancanti: We ___ the vehicle yesterday. (stop)",given:"not stopped",expected:"did not stop"}]}
};
const request=(task,path="/tutor")=>new Request("https://worker.test"+path,{method:"POST",headers:{Authorization:"Bearer "+token,Origin:env.ALLOWED_ORIGIN,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-format",task,data:inputs[task]})});
const provider=result=>Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(result)}}]});
const ajv=new Ajv({strict:true,allErrors:true});

test("Ogni richiesta manda lo schema del suo compito e conserva i dati dello studente",async()=>{
  for(const task of TASKS){
    let calls=0;
    const response=await handle(request(task),env,async(_url,options)=>{
      calls++;
      const body=JSON.parse(options.body);
      assert.deepEqual(body.response_format,{type:"json_schema",json_schema:{name:"jflt_"+task,strict:true,schema:REPLY_SCHEMAS[task]}});
      assert.deepEqual(JSON.parse(body.messages[1].content),inputs[task]);
      assert.equal(body.messages[0].role,"system");assert.equal(body.messages[1].role,"user");
      assert.ok(body.messages[0].content.includes("Il compito di questa richiesta è "+task));
      for(const other of TASKS.filter(x=>x!==task))assert.ok(!body.messages[0].content.includes(other),other+" non deve mescolarsi a "+task);
      assert.ok(!body.messages[0].content.includes(env.GROQ_API_KEY));
      return provider(SHAPES[task]);
    });
    assert.equal(response.status,200,task);assert.equal(calls,1);
    const body=await response.json();assert.deepEqual(body.result,["reading_understand","reading_test"].includes(task)?{...SHAPES[task],omitted:0}:SHAPES[task]);assert.equal(body.prompt_revision,"groq-path-feedback-v20");
  }
});

test("Gli esempi completi soddisfano sia lo schema sia i controlli dell'app",()=>{
  for(const task of TASKS){const valid=ajv.compile(REPLY_SCHEMAS[task]);assert.equal(valid(SHAPES[task]),true,JSON.stringify(valid.errors));assert.equal(validateReply(task,SHAPES[task],inputs[task]),SHAPES[task]);}
  assert.equal(SHAPES.exercises.items.length,6);
  assert.ok(SHAPES.exercises.items.some(i=>i.kind==="choice"));
  assert.ok(SHAPES.exercises.items.some(i=>i.kind==="transformation"));
  assert.equal(SHAPES.writing_compare.transfer.length,3);
});

test("Gli esempi rispettano la richiesta di includere la soluzione nelle risposte accettate",()=>{
  for(const exercise of [...SHAPES.exercises.items,...SHAPES.writing_compare.transfer]){
    assert.ok(exercise.accept.includes(exercise.answer),exercise.stem);
  }
});

test("Gli schemi usano solo il subset documentato e rendono obbligatorio ogni campo",()=>{
  const allowed=new Set(["type","properties","required","additionalProperties","items","enum","description"]);
  const walk=schema=>{
    for(const key of Object.keys(schema))assert.ok(allowed.has(key),key);
    if(schema.type==="object"){
      assert.equal(schema.additionalProperties,false);
      assert.deepEqual([...schema.required].sort(),Object.keys(schema.properties).sort());
      for(const property of Object.values(schema.properties))walk(property);
    }
    if(schema.type==="array")walk(schema.items);
  };
  for(const schema of Object.values(REPLY_SCHEMAS))walk(schema);
});

test("Campi mancanti e tipi sbagliati vengono esclusi dallo schema di ogni compito",()=>{
  const mutations={
    grammar_explain:[p=>delete p.form,p=>p.examples[0].why=null],
    writing_coach:[p=>delete p.focus,p=>p.ready="yes",p=>p.issues=[{kind:"suggestion"}]],
    exercises:[p=>delete p.items[3].options,p=>delete p.items[0].accept,p=>p.items[0].kind="multiple choice"],
    writing_review:[p=>delete p.issues,p=>p.rubric.grammar=7,p=>p.issues[0].kind="suggestion"],
    writing_compare:[p=>delete p.transfer[1].accept,p=>p.remaining="none"],
    reading_understand:[p=>delete p.terms,p=>p.terms[0].why=null,p=>p.questions[0].quote=4],
    reading_review:[p=>delete p.terms,p=>p.segments[0].quote=null],
    translate:[p=>delete p.translations,p=>p.translations=[3]],
    reading_test:[p=>delete p.questions,p=>p.questions[0].type="opinion",p=>delete p.questions[2].quote],
    clarify:[p=>delete p.example,p=>p.explanation=[]],
    diagnosis:[p=>delete p.advice,p=>p.patterns[0].lesson_ids="negatives"],
    path_block:[p=>delete p.passages,p=>delete p.items[0].group,p=>p.items[0].n="1",p=>p.items[1].kind="gap"]
  };
  for(const task of TASKS){const valid=ajv.compile(REPLY_SCHEMAS[task]);for(const mutate of mutations[task]){const bad=structuredClone(SHAPES[task]);mutate(bad);assert.equal(valid(bad),false,task);}}
});

test("Il Worker conserva i controlli sui conteggi e sulla soluzione anche con schema rigoroso",async()=>{
  const wrongAnswer=structuredClone(SHAPES.exercises);wrongAnswer.items[0].answer="B";
  const wrongCount=structuredClone(SHAPES.exercises);wrongCount.items.pop();
  // The documented subset cannot impose these relationships: the contract must.
  const valid=ajv.compile(REPLY_SCHEMAS.exercises);
  for(const [bad,path] of [[wrongAnswer,"items[0].answer"],[wrongCount,"items"]]){
    assert.equal(valid(bad),true);
    let calls=0;const response=await handle(request("exercises"),env,async()=>{calls++;return provider(bad);});
    assert.equal(response.status,502);assert.equal(calls,1);
    assert.equal((await response.json()).diagnostics.issue.path,path);
  }
});

test("Verifica Groq prova lo stesso modo rigoroso; un rifiuto non genera retry o fallback",async()=>{
  for(const model of ["openai/gpt-oss-120b","openai/gpt-oss-20b"]){
    let calls=0;const response=await handle(request(null,"/check"),{...env,MODEL:model},async(_url,options)=>{
      calls++;const body=JSON.parse(options.body);assert.equal(body.model,model);assert.equal(body.max_completion_tokens,250);
      assert.equal(body.response_format.type,"json_schema");assert.equal(body.response_format.json_schema.strict,true);
      const valid=ajv.compile(body.response_format.json_schema.schema);assert.equal(valid({ok:true}),true);assert.equal(valid({ok:false}),false);
      return provider({ok:true});
    });
    assert.equal(response.status,200);assert.equal(calls,1);
  }
  let calls=0;const response=await handle(request("exercises"),env,async()=>{calls++;return Response.json({error:{code:"invalid_request_error",param:"response_format",message:"private-test-provider-key"}},{status:400});});
  assert.equal(calls,1);assert.equal(response.status,502);const text=await response.text();assert.ok(text.includes("response_format"));assert.ok(!text.includes(env.GROQ_API_KEY));
});

test("Il client attraversa health e tutor e accetta le nuove risposte",async()=>{
  saveToken(token);
  let workerCalls=0,groqCalls=0;
  const result=await callTutor({endpoint:"https://test.workers.dev"},"/tutor","exercises",inputs.exercises,async(url,options)=>{
    workerCalls++;
    return handle(new Request(url,options),env,async()=>{groqCalls++;return provider(SHAPES.exercises);});
  });
  assert.deepEqual(result.items.map(({check,...item})=>item),SHAPES.exercises.items);assert.ok(result.items.every(item=>item.check==="unchecked"));assert.equal(result.verification.status,"unavailable");assert.equal(workerCalls,2);assert.equal(groqCalls,2);
});
