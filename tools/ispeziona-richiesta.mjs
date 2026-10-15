// Esegue il vero Worker locale con un fetch intercettato. Nessuna chiamata di rete.
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {handle} from "../worker/index.js";
import {SHAPES} from "../contract.js";
import {VERSION} from "../engine.js";

export async function inspectRequest(task="exercises",lessonId="present-perfect-simple"){
  if(!["exercises","grammar_explain"].includes(task))throw new Error("Usa exercises o grammar_explain.");
  const token="inspection-local-token-not-a-credential";
  const data=task==="exercises"?{lesson_id:lessonId,terms:[],practice:{block:1,total:30},recent_errors:[],already_seen:[]}:{lesson_id:lessonId,question:"Spiega forma, uso e contrasto con un esempio."};
  const input={api_version:1,request_id:"req-local-inspection",task,data};
  let calls=0,budgetCalls=0,captured=null;
  const env={APP_TOKEN:token,GROQ_API_KEY:"inspection-local-placeholder",ALLOWED_ORIGIN:"https://example.test",BUDGET:{idFromName:()=>"local",get:()=>({fetch:async()=>{budgetCalls++;return Response.json({ok:true});}})}};
  const request=new Request("https://worker.test/tutor",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify(input)});
  const response=await handle(request,env,async(url,options)=>{
    calls++;captured={url,method:options.method,body:JSON.parse(options.body)};
    return Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(SHAPES[task])}}]});
  });
  const reply=await response.json();
  if(!response.ok||!captured)throw new Error(reply.message||"Il Worker non ha costruito la richiesta.");
  return {release:VERSION,mode:"offline; risposta Groq simulata; nessuna rete o quota reale",input,groq_request:captured,provider_calls:calls,mocked_budget_calls:budgetCalls,worker_diagnostics:reply.diagnostics};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try{console.log(JSON.stringify(await inspectRequest(process.argv[2],process.argv[3]),null,2));}
  catch(e){console.error(e.message);process.exitCode=1;}
}
