let volatileToken="";
export function workerUrl(value){
  const url=new URL(value);
  if(url.protocol!=="https:"||!url.hostname.endsWith(".workers.dev")||url.username||url.password||url.search||url.hash)throw new Error("Inserisci l'indirizzo HTTPS del Worker (*.workers.dev), senza chiavi o parametri.");
  return url.origin;
}
const tokenKey="jflt-coach-app-token";
export function setAppToken(token,{remember=false}={}){volatileToken=token.trim();try{sessionStorage.setItem(tokenKey,volatileToken);}catch{}try{if(remember)localStorage.setItem(tokenKey,volatileToken);else localStorage.removeItem(tokenKey);}catch{}}
export function appToken(){try{const token=sessionStorage.getItem(tokenKey);if(token)return token;}catch{}try{return localStorage.getItem(tokenKey)||volatileToken;}catch{return volatileToken;}}
export function forgetToken(){volatileToken="";try{sessionStorage.removeItem(tokenKey);}catch{}try{localStorage.removeItem(tokenKey);}catch{}}
function failure(response,body){
  let message=typeof body?.message==="string"?body.message:"Servizio temporaneamente non disponibile.";
  if(message.startsWith("Groq non ha accettato la richiesta."))message+=" Questo messaggio proviene da un Worker precedente: aggiorna anche il Worker Cloudflare, oltre all'app su GitHub.";
  if(response.status===429){
    const value=response.headers.get("retry-after");
    const retry=value&&/^\d+(\.\d+)?$/.test(value)?Math.ceil(Number(value)):value?Math.ceil((Date.parse(value)-Date.now())/1000):0;
    if(!body?.message)message="Quota o frequenza gratuita raggiunta.";
    message+=Number.isFinite(retry)&&retry>0?` Riprova fra ${retry} secondi.`:" Riprova più tardi.";
    message+=" Nessun passaggio automatico a pagamento.";
  }
  if(response.status===401)message="Codice personale non valido. Controllalo in Tutor automatico.";
  return new Error(message);
}
export async function inspectTutor(endpoint,{verifyGroq=false,fetcher=fetch,timeout=55000}={}){
  if(!endpoint||!appToken())throw new Error("Salva prima l'indirizzo e il codice personale in Tutor automatico.");
  if(globalThis.navigator?.onLine===false)throw new Error("Sei offline: torna in linea per verificare il tutor.");
  const base=workerUrl(endpoint),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  const headers={Authorization:`Bearer ${appToken()}`};
  try{
    const read=async(path,options={})=>{
      const response=await fetcher(`${base}${path}`,{...options,headers:{...headers,...options.headers},signal:controller.signal,credentials:"omit",cache:"no-store"});
      let body;try{body=await response.json();}catch{throw new Error("Il Worker non ha restituito una risposta leggibile.");}
      if(!response.ok)throw failure(response,body);
      return body;
    };
    const health=await read("/health");
    if(!health?.ready)throw new Error("Worker non pronto.");
    if(!verifyGroq)return health;
    if(!health.capabilities?.includes("groq_check"))throw new Error(`Worker ${health.version||"senza versione"}: manca la verifica Groq. Aggiorna il Worker Cloudflare con il pacchetto 0.2.5; il solo aggiornamento GitHub non basta.`);
    const request_id=crypto.randomUUID(),check=await read("/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id})});
    if(check.request_id!==request_id||check.groq_verified!==true)throw new Error("La verifica Groq non ha restituito una conferma valida.");
    return check;
  }catch(e){if(e.name==="AbortError")throw new Error("Verifica interrotta per tempo scaduto. Nessun nuovo invio automatico.");throw e;}finally{clearTimeout(timer);}
}
export async function askAI(endpoint,mode,data,{request_id=crypto.randomUUID(),fetcher=fetch,timeout=55000,onWarning=()=>{}}={}){
  if(!endpoint)throw new Error("Collega prima il Worker in Altro → Tutor automatico.");
  if(!appToken())throw new Error("Inserisci il codice personale del tutor in Altro → Tutor automatico. Non è la chiave Groq.");
  if(globalThis.navigator?.onLine===false)throw new Error("Sei offline: il lavoro resta salvato. Le lezioni e i ripassi già presenti funzionano senza rete.");
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const response=await fetcher(`${workerUrl(endpoint)}/ai`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${appToken()}`},body:JSON.stringify({request_id,mode,data}),signal:controller.signal,credentials:"omit",cache:"no-store"});
    let body;try{body=await response.json();}catch{throw new Error("Il servizio non ha restituito una risposta leggibile. I tuoi dati sono conservati.");}
    if(!response.ok)throw failure(response,body);
    if(body.request_id!==request_id||body.mode!==mode)throw new Error("La risposta appartiene a un'altra richiesta ed è stata scartata.");
    if(Array.isArray(body.warnings)){const warnings=body.warnings.filter(w=>typeof w==="string").slice(0,3).map(w=>w.slice(0,240));if(warnings.length)onWarning(warnings.join(" "));}
    return body.payload;
  }catch(e){if(e.name==="AbortError")throw new Error("Il tutor ha impiegato troppo tempo. Il lavoro è salvato: puoi riprovare, senza invii automatici ripetuti.");throw e;}finally{clearTimeout(timer);}
}
