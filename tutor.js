import {VERSION,API_VERSION,endpoint,uid} from "./engine.js";
import {validateInput,validateReply,validateAssessment} from "./contract.js";
const KEY="jflt-coach-app-token";
let memoryToken="";
const HEALTH_TTL=60000;
let healthCache=null,healthPending=null,healthGeneration=0;
export function invalidateHealth(){healthCache=null;healthPending=null;healthGeneration++;}
const storedToken=storage=>{try{return globalThis[storage]?.getItem(KEY)||"";}catch{return "";}};
export function getToken(){return storedToken("sessionStorage")||storedToken("localStorage")||memoryToken;}
export function isTokenRemembered(){const value=getToken();return !!value&&storedToken("localStorage")===value;}
export function saveToken(value,remember=false) {
  invalidateHealth();
  memoryToken=value.trim();
  for(const storage of ["localStorage","sessionStorage"]){try{globalThis[storage]?.removeItem(KEY);}catch{}}
  if(memoryToken){try{globalThis[remember?"localStorage":"sessionStorage"]?.setItem(KEY,memoryToken);}catch{}}
}
export async function callTutor(settings,path,task,data,fetcher=fetch) {
  const token=getToken();
  if(!token)throw new Error("Inserisci il codice personale del tutor nelle Impostazioni.");
  if(task)validateInput(task,data);
  const address=endpoint(settings.endpoint);
  if(path==="/health")return loadHealth(settings,fetcher,token,address,true);
  {
    const health=await loadHealth(settings,fetcher,token,address);
    if(!health.groq_configured)throw new Error("Il Worker è collegato, ma manca GROQ_API_KEY nei secret Cloudflare.");
    if(data?.learner&&!health.features?.includes("adaptive_profile"))throw new Error("Il Worker deve essere aggiornato per il percorso adattivo. Gli esercizi offline restano disponibili.");
    if(task&&!health.capabilities?.includes(task))throw new Error("Questo Worker non supporta la funzione richiesta. Attendi l'aggiornamento Cloudflare.");
  }
  return send(settings,path,task,data,fetcher,token);
}
async function loadHealth(settings,fetcher,token,address,force=false) {
  const matches=value=>value&&value.address===address&&value.token===token&&value.fetcher===fetcher;
  if(!force&&matches(healthCache)&&Date.now()<healthCache.expires)return healthCache.payload;
  if(!force&&matches(healthPending))return healthPending.promise;
  const generation=healthGeneration;
  const promise=send(settings,"/health",null,null,fetcher,token).then(payload=>{
    if(generation===healthGeneration&&healthPending?.promise===promise)healthCache={address,token,fetcher,payload,expires:Date.now()+HEALTH_TTL};
    return payload;
  }).catch(error=>{invalidateHealth();throw error;}).finally(()=>{if(healthPending?.promise===promise)healthPending=null;});
  healthPending={address,token,fetcher,promise};
  return promise;
}
const VERIFY_TASKS=["exercises","reading_test","writing_compare"];
// Stessa release = stessa versione principale e secondaria (1.9.x): una correzione che
// cambia solo i contenuti dell'app non blocca il tutor mentre Cloudflare pubblica il Worker.
const release=v=>String(v||"").split(".").slice(0,2).join(".");
const sameRelease=v=>/^\d+\.\d+\.\d+$/.test(String(v||""))&&release(v)===release(VERSION);
async function send(settings,path,task,data,fetcher,token) {
  const verify=VERIFY_TASKS.includes(task),requestId=uid("req"),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),verify?90000:45000);
  try {
    const response=await fetcher(endpoint(settings.endpoint)+path,{method:path==="/health"?"GET":"POST",headers:{Authorization:"Bearer "+token,...(path!=="/health"?{"Content-Type":"application/json"}:{})},body:path==="/health"?undefined:JSON.stringify({request_id:requestId,api_version:API_VERSION,task,data,...(verify?{verify:true}:{})}),signal:controller.signal,cache:"no-store"});
    const raw=await response.text();let payload;
    try{payload=JSON.parse(raw);}catch{throw new Error("Il Worker non ha restituito JSON. Controlla l'indirizzo e la build Cloudflare.");}
    if(!response.ok) {
      const retry=response.headers.get("Retry-After");
      const error=new Error((payload.message||"Richiesta rifiutata dal Worker.")+(retry?" Riprova tra "+retry+" secondi.":""));
      error.status=response.status;error.code=payload.code;error.requestId=payload.request_id;
      if([401,403,409,426,503].includes(response.status)||payload.code==="version")invalidateHealth();
      throw error;
    }
    if(payload.api_version!==API_VERSION||!sameRelease(payload.version)){invalidateHealth();const error=new Error("Versioni diverse: app "+VERSION+", Worker "+(payload.version||"precedente")+". Attendi il deploy Cloudflare della stessa release.");error.code="version";throw error;}
    if(path==="/health")return payload;
    if(payload.request_id!==requestId)throw new Error("La risposta non corrisponde alla richiesta inviata.");
    if(task)validateReply(task,payload.result);
    if(task==="exercises"&&data?.learner)validateAssessment(payload.result.assessment,data.learner);
    if(task&&payload.verification)Object.defineProperty(payload.result,"verification",{value:payload.verification,enumerable:false});
    return task?payload.result:payload;
  }catch(error) {
    if(error.name==="AbortError")throw new Error("Il tutor non ha risposto entro "+(verify?90:45)+" secondi. Il lavoro resta salvato.");
    if(error instanceof TypeError)throw new Error("Collegamento al Worker non riuscito. Verifica connessione, indirizzo e origine consentita su Cloudflare.");
    throw error;
  }finally{clearTimeout(timer);}
}
