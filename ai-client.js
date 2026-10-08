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
export async function askAI(endpoint,mode,data,{request_id=crypto.randomUUID(),fetcher=fetch,timeout=55000}={}){
  if(!endpoint)throw new Error("Collega prima il Worker in Altro → Tutor automatico.");
  if(!appToken())throw new Error("Inserisci il codice personale del tutor in Altro → Tutor automatico. Non è la chiave Groq.");
  if(globalThis.navigator?.onLine===false)throw new Error("Sei offline: il lavoro resta salvato. Le lezioni e i ripassi già presenti funzionano senza rete.");
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const response=await fetcher(`${workerUrl(endpoint)}/ai`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${appToken()}`},body:JSON.stringify({request_id,mode,data}),signal:controller.signal,credentials:"omit",cache:"no-store"});
    let body;try{body=await response.json();}catch{throw new Error("Il servizio non ha restituito una risposta leggibile. I tuoi dati sono conservati.");}
    if(!response.ok){const retry=Number(response.headers.get("retry-after"));let msg=body.message||"Servizio temporaneamente non disponibile.";if(response.status===429)msg=`Quota o frequenza gratuita raggiunta.${retry?` Riprova fra ${retry} secondi.`:" Riprova più tardi."} Nessun passaggio automatico a pagamento.`;if(response.status===401)msg="Codice personale non valido. Controllalo in Tutor automatico.";throw new Error(msg);}
    if(body.request_id!==request_id||body.mode!==mode)throw new Error("La risposta appartiene a un'altra richiesta ed è stata scartata.");
    return body.payload;
  }catch(e){if(e.name==="AbortError")throw new Error("Il tutor ha impiegato troppo tempo. Il lavoro è salvato: puoi riprovare, senza invii automatici ripetuti.");throw e;}finally{clearTimeout(timer);}
}
