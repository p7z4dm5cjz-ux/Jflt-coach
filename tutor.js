import {VERSION,API_VERSION,endpoint,uid} from "./engine.js";
import {validateInput,validateReply} from "./contract.js";
const KEY="jflt-coach-app-token";
let memoryToken="";
export function getToken(){try{return sessionStorage.getItem(KEY)||localStorage.getItem(KEY)||memoryToken;}catch{return memoryToken;}}
export function saveToken(value,remember=false) {
  memoryToken=value.trim();
  try{localStorage.removeItem(KEY);sessionStorage.removeItem(KEY);if(memoryToken)(remember?localStorage:sessionStorage).setItem(KEY,memoryToken);}catch{}
}
export async function callTutor(settings,path,task,data,fetcher=fetch) {
  const token=getToken();
  if(!token)throw new Error("Inserisci il codice personale del tutor nelle Impostazioni.");
  if(task)validateInput(task,data);
  if(path!=="/health") {
    const health=await callTutor(settings,"/health",null,null,fetcher);
    if(!health.groq_configured)throw new Error("Il Worker è collegato, ma manca GROQ_API_KEY nei secret Cloudflare.");
    if(task&&!health.capabilities?.includes(task))throw new Error("Questo Worker non supporta la funzione richiesta. Attendi l'aggiornamento Cloudflare.");
  }
  const requestId=uid("req"),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
  try {
    const response=await fetcher(endpoint(settings.endpoint)+path,{method:path==="/health"?"GET":"POST",headers:{Authorization:"Bearer "+token,...(path!=="/health"?{"Content-Type":"application/json"}:{})},body:path==="/health"?undefined:JSON.stringify({request_id:requestId,api_version:API_VERSION,task,data}),signal:controller.signal,cache:"no-store"});
    const raw=await response.text();let payload;
    try{payload=JSON.parse(raw);}catch{throw new Error("Il Worker non ha restituito JSON. Controlla l'indirizzo e la build Cloudflare.");}
    if(!response.ok) {
      const retry=response.headers.get("Retry-After");
      const error=new Error((payload.message||"Richiesta rifiutata dal Worker.")+(retry?" Riprova tra "+retry+" secondi.":""));
      error.status=response.status;error.code=payload.code;error.requestId=payload.request_id;throw error;
    }
    if(payload.api_version!==API_VERSION||payload.version!==VERSION)throw new Error("Versioni diverse: app "+VERSION+", Worker "+(payload.version||"precedente")+". Attendi il deploy Cloudflare della stessa release.");
    if(path==="/health")return payload;
    if(payload.request_id!==requestId)throw new Error("La risposta non corrisponde alla richiesta inviata.");
    if(task)validateReply(task,payload.result);
    return task?payload.result:payload;
  }catch(error) {
    if(error.name==="AbortError")throw new Error("Il tutor non ha risposto entro 45 secondi. Il lavoro resta salvato.");
    if(error instanceof TypeError)throw new Error("Collegamento al Worker non riuscito. Verifica connessione, indirizzo e origine consentita su Cloudflare.");
    throw error;
  }finally{clearTimeout(timer);}
}
