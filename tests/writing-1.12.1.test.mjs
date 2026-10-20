import test from "node:test";
import assert from "node:assert/strict";
import {WRITING_UNITS,assignmentIndex,freshAssignmentsLeft,courseAssignment} from "../writing-curriculum.js";
import {newCourse,newCourseRound,courseRequest} from "../writing-course.js";
import {validateInput} from "../contract.js";

test("1.12.1: le consegne autonome non si ripetono tra i passi 4 e 5, finché ce ne sono",()=>{
  for(const unit of WRITING_UNITS){
    const c=newCourse(unit.id);c.stage=4;const seen=[];
    while(true){seen.push(assignmentIndex(4,c.rounds[4],1));if(!freshAssignmentsLeft(unit,c))break;c.drafts[4]="x";newCourseRound(c);}
    assert.throws(()=>newCourseRound(c),/tutte le consegne nuove/);
    c.stage=5;c.rounds[5]=0;
    while(true){seen.push(assignmentIndex(5,c.rounds[5],c.rounds[4]+1));if(!freshAssignmentsLeft(unit,c))break;newCourseRound(c);}
    assert.equal(new Set(seen).size,seen.length,unit.id+": "+seen.join(","));
    assert.ok(!seen.includes(0),"la consegna guidata non torna come prova autonoma");
    assert.ok(seen.every(i=>i<unit.tasks.length));
    assert.throws(()=>newCourseRound(c),/tutte le consegne nuove/);
  }
});

test("1.12.1: la richiesta al tutor indica la consegna esatta e il Worker la riconosce",async()=>{
  const {handle}=await import("../worker/index.js");
  const unit=WRITING_UNITS[0],c=newCourse(unit.id);c.stage=4;c.drafts[4]="I am writing to ask for a copy of the programme because the link does not work.";newCourseRound(c);newCourseRound(c);
  c.drafts[4]="I am writing to ask for a copy of the programme because the link does not work today.";
  const data=courseRequest(c,"review");assert.equal(data.task,3);assert.equal(data.topic,unit.tasks[3].details_it);validateInput("writing_coach",data);
  assert.equal(courseAssignment(unit,4,2).details_it,unit.tasks[3].details_it);
  const token="writing-test-token-long-enough-123",env={APP_TOKEN:token,GROQ_API_KEY:"x",ALLOWED_ORIGIN:"https://example.test",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
  let system="";const {SHAPES}=await import("../contract.js");
  await handle(new Request("https://w.test/tutor",{method:"POST",headers:{Authorization:"Bearer "+token,Origin:env.ALLOWED_ORIGIN,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-w",task:"writing_coach",data})}),env,async(_u,o)=>{system=JSON.parse(o.body).messages[0].content;return Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(SHAPES.writing_coach)}}]});});
  assert.ok(system.includes(unit.tasks[3].title),"il Worker usa la consegna indicata");
  assert.ok(!system.includes(unit.tasks[1].details_it),"non quella del primo tentativo");
});

test("1.12.1: gli esercizi di trasferimento passano dal controllo e, se confermati, contano come prove",async()=>{
  const {handle}=await import("../worker/index.js");const {SHAPES}=await import("../contract.js");
  const {practiceEvidence}=await import("../evidence-policy.js");const {freshState}=await import("../engine.js");
  const token="writing-test-token-long-enough-123",env={APP_TOKEN:token,GROQ_API_KEY:"x",ALLOWED_ORIGIN:"https://example.test",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
  const compare=SHAPES.writing_compare,calls=[];
  const res=await handle(new Request("https://w.test/tutor",{method:"POST",headers:{Authorization:"Bearer "+token,Origin:env.ALLOWED_ORIGIN,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-c",task:"writing_compare",verify:true,data:{type:"report",topic:"Fictional gate check",text:"The officers has checked the gate.",rewrite:"The officers have checked the gate.",issues:[]}})}),env,async(_u,o)=>{const body=JSON.parse(o.body);calls.push(body);
    const content=calls.length===1?compare:{answers:compare.transfer.map((t,i)=>({n:i+1,best:t.answer,all_valid:[],ambiguous:false}))};
    return Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(content)}}]});});
  const body=await res.json();assert.equal(res.status,200);assert.equal(calls.length,2,"una chiamata di controllo");
  assert.ok(body.result.transfer.every(t=>t.check==="confirmed"&&!("kind" in t)&&!("options" in t)));
  const s=freshState(),items=body.result.transfer.map((t,i)=>({...t,id:"t"+i,kind:"completion",skill:"form",options:[]}));
  s.sessions.push({id:"tr",lesson_id:"past-simple",source:"groq",items,completed_at:new Date().toISOString(),training:null});
  s.attempts.push(...items.map(it=>({id:"a"+it.id,item_id:it.id,session_id:"tr",lesson_id:"past-simple",stem:it.stem,answer:it.answer,correct:true,assisted:false,source:"groq",date:new Date().toISOString()})));
  assert.equal(practiceEvidence(s,"past-simple").length,3,"prove valutabili, non più escluse");
});
