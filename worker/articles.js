// Solo un breve estratto pubblico. Per la traduzione di passaggi più lunghi
// lo studente fornisce il testo selezionato nell'app; nessun aggiramento di paywall.
const domains=["bbc.com","bbc.co.uk","theguardian.com","reuters.com","apnews.com","npr.org","dw.com"];
function publicNewsUrl(value){const u=new URL(value);if(u.protocol!=="https:"||u.username||u.password||u.port||!domains.some(d=>u.hostname===d||u.hostname.endsWith(`.${d}`)))throw new Error("Fonte non supportata: apri l'articolo originale e incolla un passaggio.");return u;}
export async function articleExcerpt(value,fetcher=fetch){
  let url=publicNewsUrl(value),response;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{
    for(let i=0;i<4;i++){
      response=await fetcher(url.href,{redirect:"manual",signal:controller.signal,headers:{Accept:"text/html"}});
      if(response.status>=300&&response.status<400){url=publicNewsUrl(new URL(response.headers.get("location"),url).href);continue;}break;
    }
    if(!response?.ok||!response.headers.get("content-type")?.includes("text/html"))throw new Error("Articolo non leggibile pubblicamente. Incolla il passaggio che vuoi studiare.");
    const reader=response.body.getReader(),decoder=new TextDecoder();let html="",bytes=0;
    while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>300000){await reader.cancel();break;}html+=decoder.decode(value,{stream:true});}
    html=html.replace(/<(script|style|nav|footer|header)[\s\S]*?<\/\1>/gi,"");
    const article=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]||html;
    const paras=[...article.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>m[1].replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/\s+/g," ").trim()).filter(t=>t.split(/\s+/).length>=20&&!/cookies|subscribe|newsletter|sign in|javascript/i.test(t));
    if(!paras.length)throw new Error("Non ho trovato un passaggio affidabile. Incolla il testo selezionato dall'articolo.");
    const text=paras[0].split(/\s+/).slice(0,25).join(" ");
    return {text,source_url:url.href,notice:"Breve estratto automatico (massimo 25 parole), non articolo completo. Controlla il contesto nell'originale; puoi sostituirlo con un passaggio incollato da te."};
  }finally{clearTimeout(timer);}
}
