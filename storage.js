import {freshState,migrate,LEGACY_STORES,VERSION,endpoint,validPlacement} from "./engine.js";
import {validateBackup} from "./legacy/core.js";
import {validateReply} from "./contract.js";
const STORE="app_v2";
export function validateState(s) {
  if(!s||s.version!==2||s.id!=="main"||!s.settings||!Array.isArray(s.attempts)||!Array.isArray(s.sessions)||!Array.isArray(s.writings)||!Array.isArray(s.readings)||!Array.isArray(s.vocabulary))throw new Error("Backup incompleto o formato non riconosciuto.");
  endpoint(s.settings.endpoint);
  if(s.placement!==null&&!validPlacement(s.placement))throw new Error("Pretest non valido nel backup.");
  const validDate=v=>typeof v==="string"&&Number.isFinite(Date.parse(v));
  for(const w of s.writings) {
    if(typeof w.id!=="string"||typeof w.topic!=="string"||typeof w.ideas!=="string"||typeof w.outline!=="string"||typeof w.draft!=="string"||typeof w.rewrite!=="string"||!Array.isArray(w.transfer)||!validDate(w.created_at)||!["report","email","argument"].includes(w.type)||!["guided","exam"].includes(w.mode))throw new Error("Uno scritto nel backup non è valido.");
    if(w.feedback){validateReply("writing_review",w.feedback);if(typeof w.feedback_source!=="string")throw new Error("Manca la bozza revisionata.");}
    if(w.comparison){validateReply("writing_compare",w.comparison);if(typeof w.compare_source?.draft!=="string"||typeof w.compare_source?.rewrite!=="string")throw new Error("Mancano i testi confrontati.");}
  }
  for(const v of s.vocabulary)if(typeof v.id!=="string"||typeof v.expression!=="string"||!v.expression.trim()||typeof v.meaning_it!=="string"||typeof v.example!=="string"||!validDate(v.due)||!Number.isInteger(v.streak)||v.streak<0||!Number.isInteger(v.seen)||v.seen<0)throw new Error("Una voce del lessico non è valida.");
  for(const a of s.attempts)if(typeof a.id!=="string"||typeof a.lesson_id!=="string"||typeof a.correct!=="boolean"||typeof a.answer!=="string"||typeof a.assisted!=="boolean"||!validDate(a.date))throw new Error("Un tentativo nel backup non è valido.");
  for(const set of s.sessions) {
    if(typeof set.id!=="string"||typeof set.lesson_id!=="string"||typeof set.assisted!=="boolean"||!set.answers||typeof set.answers!=="object"||Array.isArray(set.answers)||!Array.isArray(set.items)||!validDate(set.created_at)||set.completed_at!==null&&!validDate(set.completed_at))throw new Error("Una sessione nel backup non è valida.");
    for(const it of set.items)if(typeof it.id!=="string"||typeof it.stem!=="string"||typeof it.answer!=="string"||!Array.isArray(it.options)||it.options.some(v=>typeof v!=="string")||!Array.isArray(it.accept)||it.accept.some(v=>typeof v!=="string")||typeof it.why!=="string")throw new Error("Un esercizio nel backup non è valido.");
    if(Object.values(set.answers).some(v=>typeof v!=="string"))throw new Error("Una risposta nel backup non è valida.");
  }
  for(const r of s.readings) {
    if(typeof r.id!=="string"||typeof r.title!=="string"||typeof r.source!=="string"||typeof r.text!=="string"||typeof r.translation!=="string"||!validDate(r.created_at))throw new Error("Una lettura nel backup non è valida.");
    if(r.feedback){validateReply("reading_review",r.feedback);if(typeof r.feedback_source?.text!=="string"||typeof r.feedback_source?.translation!=="string")throw new Error("Manca il passaggio confrontato.");}
  }
  for(const key of ["attempts","sessions","writings","readings","vocabulary"])if(new Set(s[key].map(x=>x.id)).size!==s[key].length)throw new Error("Il backup contiene identificatori ripetuti.");
  const raw=JSON.stringify(s);
  if(/"(?:app_token|groq_api_key|GROQ_API_KEY|APP_TOKEN)"\s*:/i.test(raw))throw new Error("Il backup contiene credenziali: rimuovile prima di importarlo.");
  return s;
}
export function parseBackup(text) {
  if(text.length>20000000)throw new Error("Il backup supera 20 MB.");
  const b=JSON.parse(text);
  if(b.format==="jflt-coach-backup/v1") {
    const v=validateBackup(b);
    if(!v.ok)throw new Error("Backup precedente non valido: "+v.errors.slice(0,3).join("; "));
    return validateState(migrate(b.stores));
  }
  if(b.format!=="jflt-coach-backup/v2")throw new Error("Formato backup non riconosciuto.");
  return validateState(b.state);
}
const request = req => new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
const complete = tx => new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error||new Error("Salvataggio interrotto."));tx.onerror=()=>reject(tx.error);});
export async function openRepository(factory=globalThis.indexedDB,onBlocked=()=>{}) {
  if(!factory)throw new Error("Questo browser non rende disponibile l'archivio locale. Apri l'app fuori dalla modalità privata.");
  const req=factory.open("jflt-coach",2);
  req.onblocked=onBlocked;
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:"id"});};
  const db=await request(req);db.onversionchange=()=>db.close();
  async function readStore(name) {if(!db.objectStoreNames.contains(name))return [];return request(db.transaction(name).objectStore(name).getAll());}
  async function persist(state) {const tx=db.transaction(STORE,"readwrite"),done=complete(tx);tx.objectStore(STORE).put(state);await done;}
  let state=(await readStore(STORE)).find(v=>v.id==="main");
  if(!state) {
    const stores={};
    for(const key of LEGACY_STORES)stores[key]=await readStore(key);
    state=stores.settings.length?migrate(stores):freshState();await persist(state);
  }
  let queue=Promise.resolve();
  return {get:()=>structuredClone(state),flush:()=>queue,
    change(fn) {
      const operation=queue.then(async()=>{const next=structuredClone(state);await fn(next);next.updated_at=new Date().toISOString();next.release=VERSION;await persist(next);state=next;return structuredClone(state);});
      queue=operation.catch(()=>{});return operation;
    },
    replace(next){validateState(next);return this.change(s=>{for(const k of Object.keys(s))delete s[k];Object.assign(s,structuredClone(next));});},
    async backup(){await queue;return JSON.stringify({format:"jflt-coach-backup/v2",app_version:VERSION,exported_at:new Date().toISOString(),state},null,2);},
    close:()=>db.close()};
}
