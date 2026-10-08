import { providerRequest, validateProviderPayload, budgetDecision, secureEqual, FREE_MODELS } from "./policy.js";
import { articleExcerpt } from "./articles.js";

// SQLite-backed Durable Object: conserva SOLO due contatori, non testi o risposte.
export class Budget {
  constructor(ctx){this.ctx=ctx;}
  async fetch(){
    const result=await this.ctx.storage.transaction(async tx=>{const decision=budgetDecision(await tx.get("budget"));if(decision.ok)await tx.put("budget",decision.record);return decision;});
    return Response.json({ok:result.ok,retry:result.retry});
  }
}
export async function handle(request,env,fetcher=fetch){
  const origin=request.headers.get("Origin"),allowed=env.ALLOWED_ORIGIN;
  const cors={"Access-Control-Allow-Origin":allowed||"","Vary":"Origin","Access-Control-Allow-Methods":"POST, GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Expose-Headers":"Retry-After","Cache-Control":"no-store"};
  const reply=(body,status=200,extra={})=>Response.json(body,{status,headers:{...cors,...extra}});
  // CORS non è autenticazione: il codice personale è obbligatorio per /ai e /health.
  if(!allowed||origin!==allowed)return new Response("Origin non consentita.",{status:403,headers:{"Cache-Control":"no-store"}});
  const path=new URL(request.url).pathname;if(!["/ai","/health","/article"].includes(path))return reply({message:"Percorso non disponibile."},404);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(!env.APP_TOKEN||env.APP_TOKEN.length<24||!env.GROQ_API_KEY||!env.BUDGET)return reply({message:"Configurazione incompleta: controlla segreti e binding del Worker."},503);
  if(!await secureEqual(request.headers.get("Authorization")||"",`Bearer ${env.APP_TOKEN}`))return reply({message:"Non autorizzato."},401);
  if(path==="/health"&&request.method==="GET")return reply({ready:true,version:"0.2.0",provider:"Groq",billing:"mantieni il tuo account sul piano Free"});
  if(request.method!=="POST")return reply({message:"Metodo non consentito."},405);
  if(!request.headers.get("Content-Type")?.startsWith("application/json"))return reply({message:"Richiesta JSON necessaria."},415);
  let budget;try{budget=await env.BUDGET.get(env.BUDGET.idFromName("personal")).fetch(new Request("https://budget/consume",{method:"POST"})).then(r=>r.json());}catch{return reply({message:"Contatore di sicurezza non disponibile. Nessuna chiamata AI effettuata."},503);}
  if(!budget.ok)return reply({message:"Limite personale raggiunto."},429,{"Retry-After":String(budget.retry)});
  if(path==="/article"){
    try{const raw=await request.text();if(raw.length>2500)return reply({message:"Indirizzo troppo lungo."},413);const {url}=JSON.parse(raw);return reply(await articleExcerpt(url,fetcher));}catch(e){return reply({message:e.message||"Fonte non leggibile: incolla il passaggio."},400);}
  }
  const size=Number(request.headers.get("Content-Length")||0);if(size>60000)return reply({message:"Richiesta troppo lunga: riduci il testo o il contesto."},413);
  let input,config;
  try{const raw=await request.text();if(new TextEncoder().encode(raw).length>60000)return reply({message:"Richiesta troppo lunga."},413);input=JSON.parse(raw);config=providerRequest(input);}catch{return reply({message:"Richiesta non valida."},400);}
  const model=env.MODEL||FREE_MODELS[0];if(!FREE_MODELS.includes(model))return reply({message:"Modello non previsto dalla configurazione gratuita."},503);
  // Margine prudenziale, non contatore esatto dei token: evita richieste enormi
  // sul piano Free. La quota effettiva è sempre quella del proprio account Groq.
  if(JSON.stringify(config).length>15000)return reply({message:"Contesto troppo lungo per questo blocco gratuito. Usa un passaggio più breve (circa 150–350 parole) e una traduzione o risposta essenziale."},413);
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
  try{
    const upstream=await fetcher("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${env.GROQ_API_KEY}`},body:JSON.stringify({model,messages:[{role:"system",content:config.prompt},{role:"user",content:JSON.stringify(config.data)}],temperature:input.mode==="EXERCISES"?0.7:0.2,reasoning_effort:"low",max_completion_tokens:3500,response_format:{type:"json_schema",json_schema:{name:input.mode==="TUTOR"?input.data.request.mode:input.mode,strict:true,schema:config.schema}}}),signal:controller.signal});
    if(upstream.status===429)return reply({message:"Quota gratuita Groq raggiunta."},429,{"Retry-After":upstream.headers.get("retry-after")||"60"});
    if(!upstream.ok)return reply({message:upstream.status===401?"La chiave Groq configurata nel Worker non è valida.":"Groq non ha accettato la richiesta. Controlla modello, schema e quota nella console; nessun fallback a pagamento."},502);
    const json=await upstream.json();if(json.choices?.[0]?.finish_reason==="length")return reply({message:"Risposta troppo lunga e incompleta. Riduci il numero di esercizi o il testo."},502);
    let payload;try{payload=JSON.parse(json.choices?.[0]?.message?.content||"");}catch{return reply({message:"Risposta AI non leggibile: non è stata importata."},502);}
    const errors=validateProviderPayload(input,payload);if(errors.length)return reply({message:`Risposta AI scartata dai controlli: ${errors.slice(0,3).join(" ")}`},502);
    return reply({request_id:input.request_id,mode:input.mode,payload});
  }catch{return reply({message:"Servizio AI interrotto o non raggiungibile. Il lavoro locale resta salvato."},504);}finally{clearTimeout(timer);}
}
// Il terzo argomento passato da Cloudflare è ExecutionContext, non fetch.
export default {fetch(request,env){return handle(request,env);}};
