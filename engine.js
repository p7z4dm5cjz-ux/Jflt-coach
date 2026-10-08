import {LESSONS, VOCABULARY, PHRASALS} from "./catalog.js";
import {placementProfile, validPlacement, newPlacement} from "./placement.js";
export const VERSION = "1.0.0";
export const API_VERSION = 1;
export const LEGACY_STORES = ["settings","diag_responses","diag_texts","profile","requests","grammar_sets","grammar_answers","tasks","texts","feedback","error_log","cards","transfer_checks","device_tests","to_verify"];
export const now = () => new Date().toISOString();
export const uid = prefix => prefix + "-" + crypto.randomUUID();
export const countWords = text => (String(text).match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu)||[]).length;
export function normal(value) {
  return String(value).normalize("NFKC").toLowerCase().replace(/[‘’]/g,"'").replace(/\bwon't\b/g,"will not").replace(/\bcan't\b/g,"cannot").replace(/\b([a-z]+)n't\b/g,"$1 not").replace(/\bi'm\b/g,"i am").replace(/\b(i|you|we|they)'ve\b/g,"$1 have").replace(/\b(i|you|we|they|he|she|it)'ll\b/g,"$1 will").replace(/\b(you|we|they)'re\b/g,"$1 are").replace(/[.,!?;:]+$/g,"").replace(/\s+/g," ").trim();
}
export const correct = (item, answer) => {
  const variants=value=>[value,value.replace(/\b(he|she|it|that|there)'s\b/gi,"$1 is"),value.replace(/\b(he|she|it|that|there)'s\b/gi,"$1 has"),value.replace(/\b(i|you|we|they|he|she|it)'d\b/gi,"$1 had"),value.replace(/\b(i|you|we|they|he|she|it)'d\b/gi,"$1 would")].map(normal);
  const candidates=variants(String(answer));
  return [item.answer,...(item.accept||[])].some(v=>variants(String(v)).some(value=>candidates.includes(value)));
};
export function endpoint(value) {
  const u = new URL(value);
  if(u.protocol!=="https:" || !u.hostname.endsWith(".workers.dev") || u.username || u.password || u.port || u.search || u.hash || !["","/"].includes(u.pathname)) throw new Error("Inserisci l'indirizzo HTTPS del Worker, senza percorsi aggiuntivi.");
  return u.origin;
}
export function freshState() {
  return {id:"main",version:2,release:VERSION,created_at:now(),updated_at:now(),settings:{endpoint:"https://jflt-coach.crl-r90.workers.dev",daily_minutes:20},placement:null,attempts:[],sessions:[],writings:[],readings:[],vocabulary:[],legacy:null};
}
export function migrate(stores) {
  const s=freshState(), old=stores?.settings?.find(v=>v.id==="main"), l=old?.learning||{};
  s.legacy=JSON.parse(JSON.stringify(stores||{},(key,value)=>/^(app_token|groq_api_key|GROQ_API_KEY|APP_TOKEN)$/i.test(key)?undefined:value));
  s.placement=validPlacement(l.placement)?structuredClone(l.placement):null;
  try {if(old?.ai_endpoint)s.settings.endpoint=endpoint(old.ai_endpoint);} catch {}
  s.attempts=(l.attempts||[]).map(a=>({...a,id:a.id||uid("legacy"),correct:a.verdict==="correct",assisted:!!a.assisted,source:"legacy",date:a.date||now(),answer:a.answer||a.user_answer||"",session_id:a.set_id||"legacy"}));
  s.writings=(l.writers||[]).map(w=>({id:w.id,type:w.type||"report",mode:w.mode||"guided",topic:w.topic||w.prompt||"Testo precedente",ideas:w.ideas||"",outline:w.outline||"",draft:(w.paragraphs||[]).filter(Boolean).join("\n\n"),rewrite:w.rewrite||"",feedback:null,comparison:null,transfer:[],created_at:w.created_at||now(),legacy_feedback:w.feedback||null}));
  s.readings=(l.articles||[]).map(r=>({id:r.id,title:"Lettura precedente · "+new Date(r.created_at).toLocaleDateString("it-IT"),source:r.source_url||"",text:r.text||"",translation:r.translation||"",feedback:null,legacy_feedback:r.feedback||null,created_at:r.created_at||now()}));
  for(const t of stores?.tasks||[]) {
    const texts=(stores.texts||[]).filter(x=>x.task_id===t.id);
    if(texts.length&&!s.writings.some(w=>w.id===t.id))s.writings.push({id:t.id,type:t.writing_type||t.type||"report",mode:"guided",topic:t.prompt_en||t.prompt||"Testo dall'archivio",ideas:"",outline:t.outline||"",draft:texts.find(x=>x.version==="draft")?.text||"",rewrite:texts.find(x=>x.version==="rewrite")?.text||"",feedback:null,comparison:null,transfer:[],created_at:t.created_at||now()});
  }
  const terms=new Map([...VOCABULARY,...(l.vocabulary||[])].map(v=>[v.id,v]));
  const ids=new Set([...(l.known||[]),...(l.pending||[]),...(l.reviews||[]).map(v=>v.term_id||v.id),...(l.vocabulary||[]).map(v=>v.id)]);
  s.vocabulary=[...ids].filter(id=>terms.has(id)).map(id=>({...terms.get(id),added_at:now(),due:now(),streak:0,seen:0,last_correct:null,legacy_known:(l.known||[]).includes(id)}));
  return s;
}
export function recommendation(state) {
  const profile=placementProfile(state.placement);
  const defaults=["negatives","present-perfect-simple","past-simple","phrasal-basics","present-perfect-continuous","past-perfect-simple","verb-patterns"];
  const writingErrors=state.writings.slice(-3).flatMap(w=>w.feedback_source===w.draft?(w.feedback?.issues||[]).filter(i=>i.kind==="error"):[]);
  const mapCategory={tenses:["past-simple","present-perfect-simple"],negation:["negatives"],phrasals:["phrasal-basics"],word_order:["sentence"],verb_patterns:["verb-patterns"]};
  const scored=LESSONS.map((l,index)=>{
    const a=state.attempts.filter(a=>a.lesson_id===l.id&&!a.assisted&&a.source!=="legacy").slice(-12);
    const errors=a.filter(a=>!a.correct).length, recent=a.length?a.filter(a=>a.correct).length/a.length:null;
    const distinct=new Set(a.map(a=>a.session_id)).size;
    let status=profile?.lessonStatus[l.id]||"new";
    if(distinct>=2&&new Set(a.map(a=>a.stem)).size>=4&&a.length>=8&&recent>=0.85)status="maintain";
    else if(errors)status="review";
    const base=defaults.includes(l.id)?15-defaults.indexOf(l.id):0;
    const writingWeight=writingErrors.filter(i=>i.category===l.id||(mapCategory[i.category]||[]).includes(l.id)).length*8;
    const score=errors*6+writingWeight+(status==="review"?20:0)+(profile?.priorityIds.includes(l.id)?30-profile.priorityIds.indexOf(l.id):0)+base-(["skip","maintain"].includes(status)?100:0);
    return {...l,status,score,index,accuracy:recent,attempts:a.length};
  });
  return scored.sort((a,b)=>b.score-a.score||a.index-b.index);
}
export function addTerm(state, term, context="") {
  const existing=state.vocabulary.find(v=>normal(v.expression)===normal(term.expression));
  if(existing)return existing;
  const v={...term,id:term.id||uid("word"),context,added_at:now(),due:now(),streak:0,seen:0,last_correct:null};
  state.vocabulary.push(v);return v;
}
export function recordReview(term, isCorrect, assisted=false, timestamp=Date.now()) {
  term.seen++;term.last_correct=isCorrect&&!assisted;
  term.streak=isCorrect&&!assisted?term.streak+1:0;
  const days=[0,1,3,7,14,30][Math.min(term.streak,5)];
  term.due=new Date(timestamp+(days?days*86400000:600000)).toISOString();
}
export function recoveryItems(terms) {
  return terms.map(v=>({id:"recover-"+v.id,term_id:v.id,kind:"retrieval",skill:"form",stem:"Scrivi l'espressione inglese che significa «"+v.meaning_it+"». Indizio: "+v.expression[0]+"… ("+v.expression.split(/\s+/).length+" parole).",answer:v.expression,accept:[v.expression],options:[],why:"Espressione: "+v.expression+". Esempio: "+v.example,origin:"local"}));
}
export function phrasalItems(term, variation=0) {
  const other=PHRASALS.filter(v=>v.id!==term.id&&v.meaning_it!==term.meaning_it);
  const words=term.expression.split(" ");
  const correctForm=term.pattern==="S"?words[0]+" it "+words.slice(1).join(" "):term.expression+" it";
  const misplaced=term.pattern==="S"?term.expression+" it":words[0]+" it "+words.slice(1).join(" ");
  return [
    {id:term.id+"-meaning",term_id:term.id,kind:"choice",skill:"recognise",stem:term.example+"\nChe cosa significa "+term.expression+" in questo esempio?",answer:term.meaning_it,options:[term.meaning_it,other[variation%other.length].meaning_it,other[(variation+17)%other.length].meaning_it],why:"Nel contesto significa: "+term.meaning_it+"."},
    {id:term.id+"-particles",term_id:term.id,kind:"completion",skill:"form",stem:"Ricostruisci l'espressione nella forma base: "+words[0]+" ___\nSignificato: "+term.meaning_it+". Scrivi tutte le parole mancanti.",answer:words.slice(1).join(" "),options:[],why:"L'espressione completa è "+term.expression+"."},
    term.pattern==="I"?{id:term.id+"-pattern",term_id:term.id,kind:"choice",skill:"choose",stem:"Nell'uso mostrato («"+term.example+"»), "+term.expression+" richiede un oggetto diretto?",answer:"No: in questo uso è intransitivo.",options:["No: in questo uso è intransitivo.","Sì: va sempre inserito it tra verbo e particella.","Sì: l'oggetto diretto è obbligatorio dopo l'espressione."],why:"La costruzione del significato qui studiato è intransitiva. Altri significati possono avere costruzioni diverse."}:{id:term.id+"-pronoun",term_id:term.id,kind:"choice",skill:"choose",stem:"Per il significato «"+term.meaning_it+"», quale ordine è corretto con il pronome oggetto it? Scegli il gruppo di parole.",answer:correctForm,options:[correctForm,misplaced,"it "+term.expression],why:term.pattern==="S"?"In questo uso separabile, it va tra il verbo e la particella.":"In questo uso inseparabile, il pronome segue l'intera espressione."}
  ];
}
export function writingReady(w, step) {
  if(step==="review"&&countWords(w.draft)<30)throw new Error("Scrivi almeno 30 parole prima della revisione.");
  if(step==="compare") {
    if(!w.feedback||w.feedback_source!==w.draft)throw new Error("Revisiona la bozza attuale prima di confrontare la riscrittura.");
    if(countWords(w.rewrite)<30||normal(w.rewrite)===normal(w.draft))throw new Error("La riscrittura deve contenere almeno 30 parole e modificare la bozza.");
  }
}
export function sanitizeFeedback(payload, source) {
  return {...payload,issues:payload.issues.filter(i=>source.includes(i.quote)),omitted:payload.issues.filter(i=>!source.includes(i.quote)).length};
}
export const GENRES={report:{label:"Rapporto",range:"150–220",topic:"Scrivi un rapporto su questo episodio fittizio: alle 08:15 un addetto segnala una porta danneggiata. La pattuglia arriva alle 08:25. Nessuno è ferito. Un testimone riferisce di aver sentito un rumore alle 07:50, ma non ha visto persone. La zona viene isolata e si richiede una verifica tecnica. Distingui fatti osservati e dichiarazioni."},email:{label:"Email",range:"100–150",topic:"Scrivi un'email al coordinatore del corso. Il briefing è previsto per venerdì alle 09:00; due colleghi arriveranno alle 09:30. Chiedi se è possibile spostarlo, spiega il motivo e proponi un'alternativa. Tutti i dati sono fittizi."},argument:{label:"Testo argomentativo",range:"220–300",topic:"È preferibile affiancare un collega esperto ai nuovi arrivati oppure affidare la formazione iniziale a un corso centralizzato? Sostieni una posizione, considera un'obiezione e proponi una soluzione concreta. Usa esempi fittizi."}};
export {newPlacement,placementProfile,validPlacement};
