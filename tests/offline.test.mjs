import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
const code=await readFile(new URL("../sw.js",import.meta.url),"utf8");
function setup(old=[]) {
  const listeners={},stores=new Map(old.map(k=>[k,new Map()])),scope="https://example.test/Jflt-coach/";let skipped=0,claimed=0,failed="";
  const resolve=key=>new URL(typeof key==="string"?key:key.url,scope).href;
  const caches={keys:async()=>[...stores.keys()],delete:async key=>stores.delete(key),open:async name=>{if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return {put:async(k,v)=>m.set(resolve(k),v),match:async k=>m.get(resolve(k))};}};
  const self={location:new URL(scope+"sw.js"),registration:{scope},clients:{claim:async()=>claimed++},skipWaiting:async()=>skipped++,addEventListener:(name,fn)=>listeners[name]=fn};
  vm.runInNewContext(code,{self,caches,URL,Request:class extends Request {constructor(path,options){super(new URL(path,scope),options);}},fetch:async req=>{const u=typeof req==="string"?req:req.url;if(u.includes(failed)&&failed)return new Response("",{status:404});return new Response("shell:"+u,{status:200});}});
  return {listeners,stores,setFailure:v=>failed=v,get skipped(){return skipped;},get claimed(){return claimed;},async fire(type,data={}){let promise;listeners[type]({...data,waitUntil:p=>promise=p,respondWith:p=>promise=p});return promise;}};
}
test("Installazione precarica anche i validatori legacy e non cancella altri siti",async()=>{const s=setup(["jflt-coach-0.2.5","other-app"]);await s.fire("install");assert.equal(s.skipped,1);const shell=s.stores.get("jflt-shell-1.0.0");assert.ok([...shell.keys()].some(v=>v.endsWith("/legacy/core.js")));await s.fire("activate");assert.ok(s.stores.has("other-app"));assert.equal(s.stores.has("jflt-coach-0.2.5"),false);const response=await s.fire("fetch",{request:{method:"GET",url:"https://example.test/Jflt-coach/",mode:"navigate"}});assert.ok((await response.text()).includes("index.html"));});
test("Shell incompleta non attiva la release; un futuro aggiornamento attende l'utente",async()=>{const s=setup(["jflt-shell-0.9.0"]);s.setFailure("practice-bank.js");await assert.rejects(s.fire("install"),/Incomplete shell/);assert.equal(s.skipped,0);const valid=setup(["jflt-shell-0.9.0"]);await valid.fire("install");assert.equal(valid.skipped,0);await valid.fire("message",{data:{type:"SKIP_WAITING"}});assert.equal(valid.skipped,1);});
