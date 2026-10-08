import test from "node:test";
import assert from "node:assert/strict";
import {saveToken,callTutor} from "../tutor.js";
saveToken("a-personal-token-longer-than-24");
test("Un Worker vecchio blocca la richiesta AI prima di Groq",async()=>{const calls=[];await assert.rejects(callTutor({endpoint:"https://test.workers.dev"},"/check",null,null,async(url)=>{calls.push(url);return Response.json({version:"0.2.0"});}),/Versioni diverse/);assert.equal(calls.length,1);assert.ok(calls[0].endsWith("/health"));});
test("Il client verifica versione e corrispondenza della risposta",async()=>{await assert.rejects(callTutor({endpoint:"https://test.workers.dev"},"/check",null,null,async(url)=>Response.json(url.endsWith("/health")?{version:"1.0.0",api_version:1,groq_configured:true}:{version:"1.0.0",api_version:1,request_id:"wrong"})),/corrisponde/);});
test("Errore di quota presenta il tempo di attesa",async()=>{await assert.rejects(callTutor({endpoint:"https://test.workers.dev"},"/check",null,null,async(url)=>url.endsWith("/health")?Response.json({version:"1.0.0",api_version:1,groq_configured:true}):Response.json({message:"quota"},{status:429,headers:{"Retry-After":"20"}})),/20 secondi/);});
