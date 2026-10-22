import test from "node:test";
import assert from "node:assert/strict";
import {inspectRequest} from "../tools/ispeziona-richiesta.mjs";
test("Richiesta effettiva intercettata: una chiamata, stessa configurazione e solo contesto della lezione",async()=>{
  const output=await inspectRequest("exercises","mixed-conditionals"),body=output.groq_request.body;
  assert.equal(output.release,"1.17.0");assert.equal(output.provider_calls,1);assert.equal(output.mocked_budget_calls,1);
  assert.equal(body.model,"openai/gpt-oss-120b");assert.equal(body.reasoning_effort,"low");assert.equal(body.max_completion_tokens,4000);assert.equal(body.temperature,0.55);
  assert.equal(body.response_format.type,"json_schema");assert.equal(body.response_format.json_schema.strict,true);
  assert.equal(body.response_format.json_schema.name,"jflt_exercises");
  assert.equal(JSON.parse(body.messages[1].content).practice.total,30);
  const context=JSON.parse(body.messages[0].content.split("Riferimenti didattici della richiesta: ")[1]);
  assert.equal(context.lesson.id,"mixed-conditionals");assert.equal(context.lesson.title.includes("misti"),true);
  assert.equal(Array.isArray(context.lesson),false);assert.equal(Object.hasOwn(output.groq_request,"headers"),false);
  assert.equal(output.worker_diagnostics.schema_valid,true);assert.equal(JSON.stringify(output).includes("inspection-local-placeholder"),false);
});
test("Spiegazione e lezione ignota: richiesta dedicata o rifiuto locale, senza rete",async()=>{
  const output=await inspectRequest("grammar_explain","negatives");assert.equal(output.groq_request.body.response_format.json_schema.name,"jflt_grammar_explain");
  await assert.rejects(()=>inspectRequest("exercises","unknown-lesson"),/Lezione non riconosciuta/);
});
