import test from "node:test";
import assert from "node:assert/strict";
import {handle} from "../worker/index.js";
import {validateReply} from "../contract.js";
const token="diagnostic-token-more-than-24-characters";
const env={APP_TOKEN:token,GROQ_API_KEY:"secret-provider-key",ALLOWED_ORIGIN:"https://example.test",MODEL:"openai/gpt-oss-120b",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
const payload=()=>({items:Array.from({length:6},(_,n)=>({kind:["completion","transformation","error_correction"][n%3],stem:"Completa: She ___ yesterday. "+n,options:[],answer:"left",accept:["left"],why:"Il contesto è passato."}))});
const req=()=>new Request("https://worker.test/tutor",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-diagnostic",task:"exercises",data:{lesson_id:"negatives",terms:[]}})});
async function invoke(content,finish_reason="stop") {
  let calls=0;
  const response=await handle(req(),env,async(_url,options)=>{calls++;const input=JSON.parse(options.body);assert.equal(input.max_completion_tokens,4000);assert.equal(input.response_format.type,"json_schema");assert.equal(input.response_format.json_schema.strict,true);return Response.json({id:"not-echoed",choices:[{finish_reason,message:{content}}],usage:{prompt_tokens:1200,completion_tokens:850,total_tokens:2050}});});
  return {response,body:await response.json(),calls};
}
test("Diagnosi della risposta originale: manca options nel quarto esercizio",async()=>{
  const original=payload();delete original.items[3].options;
  const {response,body,calls}=await invoke(JSON.stringify(original));
  assert.equal(response.status,502);assert.equal(calls,1);
  assert.equal(body.diagnostics.stage,"schema_validation");assert.equal(body.diagnostics.json_valid,true);
  assert.equal(body.diagnostics.schema_valid,false);assert.equal(body.diagnostics.issue.path,"items[3].options");
  assert.equal(body.diagnostics.finish_reason,"stop");assert.equal(body.diagnostics.completion_tokens,850);
  assert.match(body.message,/items\[3\]\.options/);
});
test("Diagnosi distingue un accept assente da una soluzione non presente nelle opzioni",async()=>{
  const missing=payload();delete missing.items[0].accept;
  assert.equal((await invoke(JSON.stringify(missing))).body.diagnostics.issue.path,"items[0].accept");
  const labelled=payload();labelled.items[0]={kind:"choice",stem:"She ___ a police officer.",options:["am","is","are"],answer:"B",accept:["B"],why:"Terza persona."};
  const {response,body}=await invoke(JSON.stringify(labelled));
  assert.equal(response.status,502);assert.equal(body.diagnostics.issue.path,"items[0].answer");
  assert.match(body.diagnostics.issue.reason,/non coincide/);assert.deepEqual(labelled.items[0].options,["am","is","are"]);
});
test("JSON invalido non espone contenuti, chiave o messaggi del parser",async()=>{
  const {response,body}=await invoke("private-student-text secret-provider-key");
  assert.equal(response.status,502);assert.equal(body.diagnostics.stage,"json_parse");assert.equal(body.diagnostics.json_valid,false);
  const serialized=JSON.stringify(body);assert.ok(!serialized.includes("private-student-text"));assert.ok(!serialized.includes("secret-provider-key"));
});
test("Una risposta troncata viene distinta dalla validazione del JSON",async()=>{
  const {response,body}=await invoke('{"items":[',"length");
  assert.equal(response.status,502);assert.equal(body.code,"truncated");assert.equal(body.diagnostics.stage,"provider_finish");
  assert.equal(body.diagnostics.finish_reason,"length");assert.equal(body.diagnostics.json_valid,null);
});
test("Risultato valido invariato e una sola chiamata Groq",async()=>{
  const original=payload();const {response,body,calls}=await invoke(JSON.stringify(original));
  assert.equal(response.status,200);assert.deepEqual(body.result,original);assert.equal(calls,1);
  assert.equal(body.diagnostics.stage,"accepted");assert.equal(body.diagnostics.schema_valid,true);
});
test("Il contratto diagnostico conserva i vecchi trasferimenti senza options e con accept vuoto",()=>{
  const previous={summary:"Confronto",resolved:[],remaining:[],transfer:Array.from({length:3},(_,n)=>({stem:"She ___ yesterday. "+n,answer:"left",accept:[],why:"Passato concluso."}))};
  assert.equal(validateReply("writing_compare",previous),previous);
});
