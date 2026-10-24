import {STARTING_LEVELS,startingLevel,levelSequence} from "./starting-level.js";
import {LESSONS, VOCABULARY, PHRASALS} from "./catalog.js";
import {placementProfile, validPlacement, newPlacement} from "./placement.js";
import {PARTICLE_ALTERNATIVES,BASE_MEANING_DISTRACTORS} from "./phrasal-extension.js";
import {normal,correct} from "./answer-normal.js";
import {lessonEvidence,practiceWindow} from "./grammar-checks.js";
import {courseOrder} from "./learning-path.js";
export {normal,correct} from "./answer-normal.js";
export const VERSION = "1.18.1";
export const API_VERSION = 1;
export const LEGACY_STORES = ["settings","diag_responses","diag_texts","profile","requests","grammar_sets","grammar_answers","tasks","texts","feedback","error_log","cards","transfer_checks","device_tests","to_verify"];
export const now = () => new Date().toISOString();
export const uid = prefix => prefix + "-" + crypto.randomUUID();
export const countWords = text => (String(text).match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu)||[]).length;
export function endpoint(value) {
  const u = new URL(value);
  if(u.protocol!=="https:" || !u.hostname.endsWith(".workers.dev") || u.username || u.password || u.port || u.search || u.hash || !["","/"].includes(u.pathname)) throw new Error("Inserisci l'indirizzo HTTPS del Worker, senza percorsi aggiuntivi.");
  return u.origin;
}
export function freshState() {
  return {id:"main",version:2,release:VERSION,created_at:now(),updated_at:now(),settings:{endpoint:"https://jflt-coach.crl-r90.workers.dev",daily_minutes:20,theme:"auto"},placement:null,attempts:[],sessions:[],writings:[],writing_courses:[],lesson_studies:[],readings:[],vocabulary:[],daily_plans:[],legacy:null};
}
// Ricominciare da zero: nuovo archivio con le sole preferenze tecniche (Worker, tema, minuti).
// Il codice del tutor sta fuori dall'archivio e resta sul dispositivo.
export function resetProgress(state) {
  const fresh=freshState(),old=state?.settings||{};
  fresh.settings={...fresh.settings,...(old.endpoint?{endpoint:old.endpoint}:{}),...(old.theme?{theme:old.theme}:{}),...(old.daily_minutes?{daily_minutes:old.daily_minutes}:{})};
  return fresh;
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
  const sequence=levelSequence(state);
  const defaults=sequence||["present-simple","past-simple","present-perfect-simple","negatives","phrasal-basics","present-perfect-continuous","past-perfect-simple","verb-patterns"];
  const courseErrors=(state.writing_courses||[]).slice(-3).flatMap(c=>c.reviews.findLast(r=>r.stage===c.stage&&r.round===c.rounds[c.stage]&&r.mode==="review"&&r.text===c.drafts[c.stage])?.result.issues.filter(i=>i.kind==="error")||[]);
  const writingErrors=[...state.writings.slice(-3).flatMap(w=>w.feedback_source===w.draft?(w.feedback?.issues||[]).filter(i=>i.kind==="error"):[]),...courseErrors];
  const mapCategory={tenses:["past-simple","present-perfect-simple"],negation:["negatives"],phrasals:["phrasal-basics"],word_order:["sentence"],verb_patterns:["verb-patterns"]};
  const scored=LESSONS.map((l,index)=>{
    const w=practiceWindow(state,l.id),errors=w.errors,recent=w.accuracy;
    let status=profile?.lessonStatus[l.id]||"new";
    if(w.independent)status="maintain";
    // Ultima sessione riuscita (almeno 6 risposte, 85%): la tappa lascia il posto alla successiva
    // e torna con la verifica distanziata; il pretest non la tiene più in testa.
    else if(w.goodSession)status=profile?.lessonStatus[l.id]||"new";
    else if(errors)status="review";
    const evidence=lessonEvidence(state,l.id);
    if(evidence.errors)status="review";
    const base=(sequence||!profile)&&defaults.includes(l.id)?15-10*defaults.indexOf(l.id)/defaults.length:0;
    const writingWeight=writingErrors.filter(i=>i.category===l.id||(mapCategory[i.category]||[]).includes(l.id)).length*8;
    // Un pretest di base non dimostra la padronanza degli approfondimenti.
    // Gli errori nei prerequisiti li rendono pertinenti, senza precedere il recupero.
    const bridge=l.extension&&profile?(l.prerequisites||[]).some(id=>profile.lessonStatus[id]==="review")?5:0:0;
    const score=Math.min(errors,6)*6+writingWeight+evidence.errors*12+(evidence.due_now?120:0)+(w.due&&!evidence.due_now?60:0)+(status==="review"?20:0)+(status!=="confirm"&&profile?.priorityIds.includes(l.id)?30-profile.priorityIds.indexOf(l.id):0)+base+bridge-(l.extension?l.stage+1:0)-(["skip","maintain"].includes(status)&&!w.due?100:0)-(evidence.delayed&&!evidence.due_now?35:0);
    return {...l,course_due:!!(evidence.due_now||w.due),course_recovery:errors>0||evidence.errors>0||writingWeight>0,eligible:!sequence||sequence.includes(l.id)||errors>0||evidence.errors>0||evidence.due_now||w.due||writingWeight>0||profile?.lessonStatus[l.id]==="review",status,score,index,accuracy:recent,attempts:w.all.length,window:w.window.length};
  });
  return courseOrder(state,scored.filter(l=>l.eligible));
}
// Il percorso consigliato: le prime tappe della classifica, nello stesso ordine usato dal
// piano di oggi e dall'allenamento completo, così la proposta è una sola.
export function learningPath(state,size=5) {
  return recommendation(state).slice(0,size);
}
export function localDay(timestamp=Date.now()) {
  const d=new Date(timestamp);
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
}
export function dailyPlan(state,timestamp=Date.now()) {
  const day=localDay(timestamp),saved=state.daily_plans?.find(p=>p.day===day);
  const minutes=saved?.minutes||([10,20,30].includes(state.settings.daily_minutes)?state.settings.daily_minutes:20);
  const lesson=LESSONS.find(l=>l.id===saved?.lesson_id)||learningPath(state)[0];
  const termIds=saved?.term_ids||state.vocabulary.filter(v=>Date.parse(v.due)<=timestamp).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,minutes===10?2:minutes===30?5:3).map(v=>v.id);
  const terms=termIds.map(id=>state.vocabulary.find(v=>v.id===id)).filter(Boolean);
  const practice=state.sessions.find(s=>s.id===saved?.practice_id),writing=state.writings.find(w=>w.id===saved?.writing_id);
  const minimumWords=minutes===10?35:minutes===30?90:60,writingWords=countWords(writing?.draft||"");
  return {day,minutes,lesson_id:lesson.id,lesson,term_ids:terms.map(t=>t.id),terms,minimum_words:minimumWords,
    id:saved?.id||null,practice_id:practice?.id||null,writing_id:writing?.id||null,
    practice_complete:!!practice?.completed_at,writing_words:writingWords,writing_complete:writingWords>=minimumWords,
    completed_steps:Number(!!practice?.completed_at)+Number(writingWords>=minimumWords)};
}
export function dailyWritingTopic(plan) {
  const future=/^future/.test(plan.lesson_id),present=/^present/.test(plan.lesson_id);
  const scenarios=future?[
    "Il coordinatore ha deciso di controllare il deposito domani. L'incontro con il tecnico è già fissato alle 09:00. Secondo te il lavoro richiederà due ore. Distingui intenzione, appuntamento e previsione.",
    "È stato deciso di rivedere il percorso di accesso. Il sopralluogo con il responsabile è fissato per giovedì alle 10:00. Ritieni che il nuovo percorso ridurrà i ritardi. Distingui decisione, accordo e previsione."
  ]:present?[
    "Di solito la squadra controlla due ingressi ogni mattina. Oggi sta verificando anche il magazzino. Finora ha controllato tre locali; lavora dalle 08:00. Distingui routine, attività in corso e risultati.",
    "Il centro registra le consegne ogni giorno. Oggi due addetti stanno controllando le etichette. Finora hanno verificato quattro scatole; lavorano da un'ora. Distingui abitudini, attività e risultati."
  ]:[
    "Alle 08:15 viene segnalata una porta danneggiata; la squadra arriva alle 08:25. Un testimone dice di aver sentito un rumore alle 07:50, ma non ha visto nessuno. Nessun ferito. L'area viene isolata. Distingui osservazioni e dichiarazioni.",
    "Alle 14:10 viene segnalata una perdita d'acqua; il tecnico arriva alle 14:30. Un addetto riferisce di aver chiuso la valvola alle 14:20. Nessun danno alle persone. Il locale resta chiuso in attesa della verifica. Distingui fatti confermati e dichiarazioni."
  ];
  const variant=(Number((plan.day||"0").replaceAll("-",""))||0)%scenarios.length;
  return "Scrivi un breve aggiornamento di servizio in inglese (almeno "+plan.minimum_words+" parole). Fatti fittizi: "+scenarios[variant]+" " +
    "Scegli tu le strutture adatte al significato; non forzare «"+plan.lesson.title+"» in ogni frase. "+
    (plan.terms.length?"Se pertinenti, recupera a memoria: "+plan.terms.map(t=>t.expression).join(", ")+". ":"")+"Non inserire dati reali. Usa soltanto dati fittizi. La lunghezza misura il lavoro svolto, non la correttezza.";
}
export function addTerm(state, term, context="") {
  const existing=state.vocabulary.find(v=>v.id===term.id||normal(v.expression)===normal(term.expression)&&normal(v.meaning_it)===normal(term.meaning_it));
  if(existing){if(term.source_text){for(const key of ["source_text","source_url","explanation","register","alternative","ai_generated"])if(term[key]!==undefined)existing[key]=term[key];}return existing;}
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
  return terms.map(v=>({id:"recover-"+v.id,term_id:v.id,kind:"retrieval",skill:"form",stem:"Scrivi l'espressione inglese della scheda studiata che significa «"+v.meaning_it+"». Indizio: inizia con "+v.expression[0]+" e ha "+v.expression.split(/\s+/).length+(v.expression.split(/\s+/).length===1?" parola.":" parole."),answer:v.expression,accept:[v.expression],options:[],why:"Espressione della scheda: "+v.expression+". Esempio: "+v.example,origin:"local"}));
}
export function phrasalItems(term, variation=0) {
  const distractors=term.meaning_distractors||BASE_MEANING_DISTRACTORS[term.id];
  if(!distractors)throw new Error("Scheda senza alternative linguistiche revisionate.");
  const words=term.expression.split(" ");
  const particles=words.slice(1).join(" "),alternatives=PARTICLE_ALTERNATIVES[term.id]||[];
  const pronoun=term.object_pronoun||(["pv-013","pv-016","pv-020","pv-039","pv-050","pv-055","pv-086","pv-089","pv-097","pv-106","pv-118","pv-134","pv-159"].includes(term.id)?"them":"it");
  const correctForm=term.pattern==="S"?words[0]+" "+pronoun+" "+words.slice(1).join(" "):term.expression+" "+pronoun;
  const misplaced=term.pattern==="S"?term.expression+" "+pronoun:words[0]+" "+pronoun+" "+words.slice(1).join(" ");
  return [
    {id:term.id+"-meaning",term_id:term.id,kind:"choice",skill:"recognise",stem:"Scegli il significato di "+term.expression+" in questo esempio:\n"+term.example,answer:term.meaning_it,options:[term.meaning_it,...distractors],why:"Nel contesto significa: "+term.meaning_it+"."},
    {id:term.id+"-particles",term_id:term.id,kind:"completion",skill:"form",stem:(particles.includes(" ")?"Scrivi solo le parole mancanti":"Scrivi solo la parola mancante")+". Completa l’espressione della scheda studiata («"+term.meaning_it+"»): "+words[0]+" ___",answer:particles,accept:[particles,...alternatives],options:[],why:"La scheda insegna "+term.expression+"."+(alternatives.length?" Per il significato richiesto sono valide anche: "+alternatives.map(a=>words[0]+" "+a).join(", ")+".":"")},
    term.pattern==="I"?{id:term.id+"-pattern",term_id:term.id,kind:"choice",skill:"choose",stem:"Scegli la risposta corretta. Nell'esempio «"+term.example+"», "+term.expression+" richiede un oggetto diretto?",answer:"No: in questo uso è intransitivo.",options:["No: in questo uso è intransitivo.","Sì: va sempre inserito it tra verbo e particella.","Sì: l'oggetto diretto è obbligatorio dopo l'espressione."],why:"La costruzione del significato qui studiato è intransitiva. Altri significati possono avere costruzioni diverse."}:{id:term.id+"-pronoun",term_id:term.id,kind:"choice",skill:"choose",stem:"Scegli l'ordine corretto delle parole con il pronome "+pronoun+". L'espressione significa «"+term.meaning_it+"».",answer:correctForm,options:[correctForm,misplaced,pronoun+" "+term.expression],why:term.pattern==="S"?"In questo uso separabile, "+pronoun+" va tra il verbo e la particella.":"In questo uso inseparabile, il pronome segue l'intera espressione."}
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
