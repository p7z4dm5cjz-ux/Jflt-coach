import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {webcrypto} from "node:crypto";
import vm from "node:vm";
const code=await readFile(new URL("../sw.js",import.meta.url),"utf8");
const manifest=JSON.parse(code.match(/^const ASSETS=(.*);$/m)[1]);
const assetBytes=new Map(await Promise.all(manifest.map(async asset=>[asset.path,await readFile(new URL("../"+asset.path.slice(2),import.meta.url))])));
const currentCache="jflt-shell-"+JSON.parse(code.match(/^const VERSION=(.*);$/m)[1])+"-"+JSON.parse(code.match(/^const REVISION=(.*);$/m)[1]);
function setup(old=[]) {
  const listeners={},stores=new Map(old.map(k=>[k,new Map([["old-asset",new Response("old")]])])),scope="https://example.test/Jflt-coach/";let skipped=0,claimed=0,failed="",mismatch="";
  const resolve=key=>new URL(typeof key==="string"?key:key.url,scope).href;
  const caches={keys:async()=>[...stores.keys()],delete:async key=>stores.delete(key),open:async name=>{if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return {put:async(k,v)=>m.set(resolve(k),v),match:async k=>m.get(resolve(k))?.clone()};}};
  const self={location:new URL(scope+"sw.js"),registration:{scope},clients:{claim:async()=>claimed++},skipWaiting:async()=>skipped++,addEventListener:(name,fn)=>listeners[name]=fn};
  vm.runInNewContext(code,{self,caches,crypto:webcrypto,URL,Request:class extends Request{constructor(path,options){super(new URL(path,scope),options);}},fetch:async req=>{const u=typeof req==="string"?req:req.url;if(failed&&u.includes(failed))return new Response("",{status:404});const path="./"+new URL(u,scope).pathname.split("/Jflt-coach/")[1];return new Response(mismatch&&u.includes(mismatch)?"different release":assetBytes.get(path),{status:200});}});
  return {listeners,stores,setFailure:v=>failed=v,setMismatch:v=>mismatch=v,get skipped(){return skipped;},get claimed(){return claimed;},async fire(type,data={}){let promise;listeners[type]({...data,waitUntil:p=>promise=p,respondWith:p=>promise=p});return promise;}};
}
test("Installazione completa precarica i validatori legacy e conserva gli altri siti",async()=>{const s=setup(["jflt-coach-0.2.5","other-app"]);await s.fire("install");assert.equal(s.skipped,1);const shell=s.stores.get(currentCache);assert.ok([...shell.keys()].some(v=>v.endsWith("/legacy/core.js")));await s.fire("activate");assert.ok(s.stores.has("other-app"));assert.equal(s.stores.has("jflt-coach-0.2.5"),false);const response=await s.fire("fetch",{request:{method:"GET",url:"https://example.test/Jflt-coach/",mode:"navigate"}});assert.ok((await response.text()).includes("<!doctype html>"));});
test("Shell incompleta rimuove solo la cache nuova e preserva quella attiva",async()=>{const s=setup(["jflt-shell-1.0.0"]);s.setFailure("practice-bank.js");await assert.rejects(s.fire("install"),/Incomplete shell/);assert.equal(s.skipped,0);assert.equal(s.stores.has(currentCache),false);assert.equal(s.stores.get("jflt-shell-1.0.0").size,1);});
test("Un asset di un'altra revisione non viene attivato",async()=>{const s=setup(["jflt-shell-1.0.0"]);s.setMismatch("contract.js");await assert.rejects(s.fire("install"),/Release non coerente/);assert.equal(s.stores.has(currentCache),false);assert.ok(s.stores.has("jflt-shell-1.0.0"));});
test("Icone opzionali mancanti non bloccano una shell completa",async()=>{const s=setup();s.setFailure("icon-");await s.fire("install");assert.ok(s.stores.get(currentCache).has("https://example.test/Jflt-coach/index.html"));assert.equal([...s.stores.get(currentCache).keys()].some(k=>k.includes("icon-")),false);});
test("Aggiornamento attende l'utente e pulisce le vecchie cache soltanto all'attivazione",async()=>{const s=setup(["jflt-shell-1.0.0"]);await s.fire("install");assert.equal(s.skipped,0);assert.ok(s.stores.has("jflt-shell-1.0.0"));await s.fire("message",{data:{type:"SKIP_WAITING"}});assert.equal(s.skipped,1);await s.fire("activate");assert.equal(s.stores.has("jflt-shell-1.0.0"),false);assert.equal(s.claimed,1);});
test("Moduli critici dalla cache non vengono aggiornati singolarmente né toccano il Worker",async()=>{const s=setup();await s.fire("install");s.setMismatch("app.js");const response=await s.fire("fetch",{request:{method:"GET",url:"https://example.test/Jflt-coach/app.js",mode:"cors"}});assert.equal(await response.text(),assetBytes.get("./app.js").toString());assert.equal(await s.fire("fetch",{request:{method:"POST",url:"https://test.workers.dev/tutor",mode:"cors"}}),undefined);});
