import test from "node:test";
import assert from "node:assert/strict";
import {handle} from "../worker/index.js";
import {validateInput} from "../contract.js";
import {parseBackup} from "../storage.js";
import {freshState} from "../engine.js";

const token="test-token-abcdefghijklmnopqrstuvwxyz";
const env={APP_TOKEN:token,GROQ_API_KEY:"gsk_test_secret",ALLOWED_ORIGIN:"https://example.test",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
const request=data=>new Request("https://worker.test/tutor",{method:"POST",headers:{Authorization:"Bearer "+token,Origin:env.ALLOWED_ORIGIN,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-190",task:"translate",data})});
const ok=result=>Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(result)}}]});

test("1.9.0: traduzione paragrafo per paragrafo, con controllo dell'allineamento",async()=>{
  const paragraphs=["The officers checked the gate.","The report was filed at noon."];
  let sent;const res=await handle(request({paragraphs}),env,async(_u,o)=>{sent=JSON.parse(o.body);return ok({translations:["Gli agenti hanno controllato il cancello.","Il rapporto è stato depositato a mezzogiorno."]});});
  assert.equal(res.status,200);assert.deepEqual(JSON.parse(sent.messages[1].content),{paragraphs});
  assert.ok(sent.messages[0].content.includes("stesso numero di elementi"));
  const short=await handle(request({paragraphs}),env,async()=>ok({translations:["Una sola traduzione."]}));
  assert.equal(short.status,502);assert.match((await short.json()).message,/stesso numero di paragrafi/);
  assert.throws(()=>validateInput("translate",{paragraphs:["x".repeat(3300)]}),/3.200/);
  assert.throws(()=>validateInput("translate",{paragraphs:[]}),/non valido/);
});

test("1.9.0: il backup conserva la traduzione affiancata",()=>{
  const s=freshState(),t=new Date().toISOString();
  s.readings=[{id:"r1",title:"Gate",source:"",text:"The officers checked the gate.",translation:"",feedback:null,created_at:t,auto_translation:{paragraphs:["The officers checked the gate."],translations:["Gli agenti hanno controllato il cancello."],source_text:"The officers checked the gate.",created_at:t}}];
  const wrap=state=>JSON.stringify({format:"jflt-coach-backup/v2",app_version:"1.9.0",exported_at:t,state});
  assert.equal(parseBackup(wrap(s)).readings[0].auto_translation.translations.length,1);
  const bad=structuredClone(s);bad.readings[0].auto_translation.translations.push("extra");
  assert.throws(()=>parseBackup(wrap(bad)),/Traduzione della lettura non valida/);
});
