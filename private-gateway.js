import {handle} from './worker/index.js';

const LEGACY='https://jflt-coach.crl-r90.workers.dev';
const limits=new Map();
const json=(message,code,status)=>Response.json({message,code},{status,headers:{'Cache-Control':'no-store'}});

// Le credenziali viaggiano solo in HTTPS e non vengono registrate né salvate.
// La policy owner-only di Sites protegge sia i file sia questa API.
export async function tutorGateway(request, fetcher=fetch, serverEnv={}) {
  const url=new URL(request.url),action=url.pathname.slice('/api'.length);
  if(!['/health','/check','/tutor'].includes(action))return json('Funzione del tutor non trovata.','route',404);
  if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)return json('Origine non consentita.','origin',403);
  if(request.method!==(action==='/health'?'GET':'POST'))return json('Metodo non consentito.','method',405);
  const token=request.headers.get('Authorization')?.replace(/^Bearer /,'')||'';
  if(token.length<24||token.length>300)return json('Inserisci il codice personale del tutor o una chiave Groq valida nelle Impostazioni.','auth',401);
  if(Number(request.headers.get('Content-Length'))>40000)return json('Richiesta troppo grande.','size',413);
  const body=request.method==='POST'?await request.text():null;
  if(body&&body.length>40000)return json('Richiesta troppo grande.','size',413);
  const hosted=!!serverEnv.GROQ_API_KEY&&!!serverEnv.APP_TOKEN;
  if(!token.startsWith('gsk_')&&!hosted&&(serverEnv.GROQ_API_KEY||serverEnv.APP_TOKEN))return json('Completa i secret APP_TOKEN e GROQ_API_KEY del sito.','configuration',503);
  if(!token.startsWith('gsk_')&&!hosted) {
    // Compatibilità con il tutor personale già configurato: l'autenticazione
    // continua a essere verificata dal Worker originale, senza esporre la chiave.
    try {
      const upstream=await fetcher(LEGACY+action,{method:request.method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',Origin:'https://p7z4dm5cjz-ux.github.io'},body,redirect:'error',signal:request.signal});
      const headers=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
      const retry=upstream.headers.get('Retry-After');if(retry)headers.set('Retry-After',retry);
      if(action==='/health'&&upstream.ok){const data=await upstream.json();return Response.json({...data,connection_mode:'legacy_worker'},{status:upstream.status,headers});}
      return new Response(upstream.body,{status:upstream.status,headers});
    }catch{return json('Tutor personale non raggiungibile. Puoi continuare offline oppure collegare una chiave Groq.','connection',502);}
  }
  // Una chiave del proprio account gratuito consente di usare il prompt corrente.
  // Il limite locale è prudenziale; restano autorevoli le quote dell'account Groq.
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(hosted?serverEnv.APP_TOKEN:token)))].map(x=>x.toString(16).padStart(2,'0')).join('');
  const BUDGET={idFromName:()=>hash,get:()=>({fetch:async()=>{
    const now=Date.now(),day=Math.floor(now/86400000),minute=Math.floor(now/60000);
    for(const [key,value] of limits)if(value.day!==day)limits.delete(key);
    let row=limits.get(hash);if(!row){row={day,minute,d:0,m:0};limits.set(hash,row);}
    if(row.minute!==minute){row.minute=minute;row.m=0;}
    if(row.d>=60||row.m>=8)return Response.json({ok:false,retry:row.d>=60?86400-Math.floor(now/1000)%86400:60-Math.floor(now/1000)%60});
    row.d++;row.m++;return Response.json({ok:true});
  }})};
  const internal=new Request(url.origin+action,{method:request.method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',Origin:url.origin},body,signal:request.signal});
  const env={APP_TOKEN:hosted?serverEnv.APP_TOKEN:token,GROQ_API_KEY:hosted?serverEnv.GROQ_API_KEY:token,ALLOWED_ORIGIN:url.origin,MODEL:'openai/gpt-oss-120b',BUDGET};
  const response=await handle(internal,env,fetcher);
  if(action==='/health'&&response.ok)return Response.json({...await response.json(),connection_mode:hosted?'server_secret':'session_key',limits:{minute:8,day:60,advisory:true}},{headers:response.headers});
  return response;
}
