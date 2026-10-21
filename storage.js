import {validateGuides} from "./lesson-guide.js";
import {freshState,migrate,LEGACY_STORES,VERSION,endpoint,validPlacement} from "./engine.js";
import {validateBackup} from "./legacy/core.js";
import {validateReply,validateAssessment,READING_TEST_TYPES} from "./contract.js";
import {LESSONS} from "./catalog.js";
import {BLOCK_SIZE} from "./practice-flow.js";
import {WRITING_UNITS} from "./writing-curriculum.js";
import {localDay} from "./engine.js";
import {validateChecks} from "./grammar-checks.js";
const STORE="app_v2";
export function validateState(s) {
  if(!s||s.version!==2||s.id!=="main"||!s.settings||!Array.isArray(s.attempts)||!Array.isArray(s.sessions)||!Array.isArray(s.writings)||!Array.isArray(s.readings)||!Array.isArray(s.vocabulary))throw new Error("Backup incompleto o formato non riconosciuto.");
  endpoint(s.settings.endpoint);
  if(s.settings.starting_level!=null&&!["A1","A2","B1","B2","C1"].includes(s.settings.starting_level))throw new Error("Livello iniziale non valido nel backup.");
  if(s.placement!==null&&!validPlacement(s.placement))throw new Error("Pretest non valido nel backup.");
  const validDate=v=>typeof v==="string"&&Number.isFinite(Date.parse(v));
  if(s.lesson_guides!==undefined)validateGuides(s.lesson_guides,LESSONS);
  if(s.grammar_checks!==undefined)validateChecks(s.grammar_checks);
  if(s.diagnoses!==undefined){
    if(!Array.isArray(s.diagnoses)||s.diagnoses.length>10)throw new Error("Diagnosi del pretest non valide.");
    for(const d of s.diagnoses){if(typeof d?.id!=="string"||!validDate(d.created_at)||!validDate(d.placement_started_at))throw new Error("Diagnosi del pretest non valida.");validateReply("diagnosis",d.result);}
  }
  if(s.lesson_reads!==undefined&&(!Array.isArray(s.lesson_reads)||s.lesson_reads.some(r=>!LESSONS.some(l=>l.id===r.lesson_id)||!validDate(r.date))||new Set(s.lesson_reads.map(r=>r.lesson_id)).size!==s.lesson_reads.length))throw new Error("Lezioni consultate non valide.");
  for(const a of s.attempts)if(a.disputed!==undefined&&typeof a.disputed!=="boolean"||a.context_id!==undefined&&typeof a.context_id!=="string")throw new Error("Indicazione del contesto o segnalazione non valida.");
  if(s.lesson_studies!==undefined) {
    if(!Array.isArray(s.lesson_studies))throw new Error("Spiegazioni grammaticali non valide.");
    for(const study of s.lesson_studies){if(!LESSONS.some(l=>l.id===study.lesson_id)||typeof study.question!=="string"||study.question.length>500||!validDate(study.created_at))throw new Error("Una spiegazione grammaticale non è valida.");validateReply("grammar_explain",study.result);}
    if(new Set(s.lesson_studies.map(x=>x.lesson_id)).size!==s.lesson_studies.length)throw new Error("Spiegazioni grammaticali ripetute.");
  }
  if(s.writing_courses!==undefined) {
    if(!Array.isArray(s.writing_courses))throw new Error("Percorsi di scrittura non validi.");
    for(const c of s.writing_courses) {
      if(c.assignment_version!==undefined&&![2,3].includes(c.assignment_version))throw new Error("Versione delle consegne non valida.");
      if(c.task_indices!==undefined&&(!c.task_indices||typeof c.task_indices!=="object"||Array.isArray(c.task_indices)||Object.entries(c.task_indices).some(([k,v])=>!["4","5"].includes(k)||!Number.isInteger(v)||v<1||v>9)))throw new Error("Consegne salvate non valide.");
      if(c?.grammar_lesson_id!==undefined&&!LESSONS.some(l=>l.id===c.grammar_lesson_id))throw new Error("Lezione del percorso non riconosciuta.");
      const unit=WRITING_UNITS.find(u=>u.id===c?.unit_id),validText=x=>typeof x==="string"&&x.length<=6000,validStage=x=>Number.isInteger(x)&&x>=0&&x<=5,validRound=x=>Number.isInteger(x)&&x>=0&&x<=1000;
      if(!unit||typeof c.id!=="string"||!validStage(c.stage)||!Array.isArray(c.drafts)||c.drafts.length!==6||!c.drafts.every(validText)||!Array.isArray(c.rounds)||c.rounds.length!==6||!c.rounds.every(validRound)||!validDate(c.created_at)||c.completed_at!==null&&!validDate(c.completed_at)||!c.preparation||typeof c.preparation.checked!=="boolean"||!c.preparation.answers||typeof c.preparation.answers!=="object"||Array.isArray(c.preparation.answers)||!Array.isArray(c.reviews)||!Array.isArray(c.checks)||!Array.isArray(c.archives))throw new Error("Un percorso di scrittura non è valido.");
      if(c.task_indices&&Object.values(c.task_indices).some(index=>index>=unit.tasks.length))throw new Error("Consegne salvate non valide.");
      for(const [id,index] of Object.entries(c.preparation.answers))if(!unit.preparation.some(q=>q.id===id&&Number.isInteger(index)&&index>=0&&index<q.options.length))throw new Error("Una risposta sul modello non è valida.");
      for(const [index,r] of c.reviews.entries()) {
        if(typeof r.id!=="string"||!validStage(r.stage)||r.stage>c.stage||!validRound(r.round)||r.round>c.rounds[r.stage]||!validText(r.text)||!validDate(r.created_at)||typeof r.assisted!=="boolean"||!["hint","review"].includes(r.mode)||typeof r.question!=="string"||r.question.length>500)throw new Error("Una revisione del percorso non è valida.");
        const assisted=r.stage<4||c.reviews.slice(0,index).some(old=>old.stage===r.stage&&old.round===r.round);
        if(r.assisted!==assisted)throw new Error("Un aiuto non può diventare una prova autonoma.");
        validateReply("writing_coach",r.result);if(r.result.issues.some(i=>!r.text.includes(i.quote))||r.mode==="hint"&&r.result.ready||r.result.ready&&(r.result.criteria&&Object.values(r.result.criteria).some(c=>c.status!=="met")||r.result.omitted||r.result.issues.some(i=>i.kind==="error")))throw new Error("Revisione non ancorata al testo o conferma non valida.");
      }
      if(c.checks.length!==c.stage+Number(!!c.completed_at)||!!c.completed_at&&c.stage!==5||new Set(c.reviews.map(r=>r.id)).size!==c.reviews.length)throw new Error("Tappe e revisioni non corrispondono.");
      for(const [index,check] of c.checks.entries()) {
        const review=c.reviews.find(r=>r.id===check.review_id);
        const badEvidence=index===0?(!c.preparation.checked||!unit.preparation.every(q=>c.preparation.answers[q.id]===q.answer)||check.review_id!==null):(!review||review.mode!=="review"||review.stage!==index||review.round!==check.round||review.text!==check.text||!review.result.ready||index>=4&&review.assisted);
        if(check.stage!==index||!validText(check.text)||!validRound(check.round)||check.round>c.rounds[index]||!validDate(check.completed_at)||badEvidence)throw new Error("Una tappa confermata non è valida.");
      }
      if(c.completed_at&&localDay(c.checks[4].completed_at)===localDay(c.checks[5].completed_at))throw new Error("La conferma deve essere in un'altra giornata.");
      for(const a of c.archives)if(!validStage(a.stage)||a.stage<4||!validRound(a.round)||a.round>=c.rounds[a.stage]||!validText(a.text)||!validDate(a.created_at))throw new Error("Una bozza precedente non è valida.");
    }
    if(new Set(s.writing_courses.map(c=>c.id)).size!==s.writing_courses.length)throw new Error("Percorsi di scrittura ripetuti.");
  }
  if(s.daily_plans!==undefined) {
    if(!Array.isArray(s.daily_plans))throw new Error("Piani quotidiani non validi nel backup.");
    for(const plan of s.daily_plans)if(typeof plan.id!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(plan.day)||!validDate(plan.day)||![10,20,30].includes(plan.minutes)||!LESSONS.some(l=>l.id===plan.lesson_id)||!Array.isArray(plan.term_ids)||plan.term_ids.some(v=>typeof v!=="string")||!validDate(plan.created_at)||![plan.practice_id,plan.writing_id].every(id=>id===null||typeof id==="string"))throw new Error("Un piano quotidiano nel backup non è valido.");
    if(new Set(s.daily_plans.map(x=>x.id)).size!==s.daily_plans.length||new Set(s.daily_plans.map(x=>x.day)).size!==s.daily_plans.length)throw new Error("Il backup contiene piani quotidiani ripetuti.");
  }
  for(const w of s.writings) {
    if(w.grammar_lesson_id!==undefined&&!LESSONS.some(l=>l.id===w.grammar_lesson_id))throw new Error("Lezione dello scritto non riconosciuta.");
    if(typeof w.id!=="string"||typeof w.topic!=="string"||typeof w.ideas!=="string"||typeof w.outline!=="string"||typeof w.draft!=="string"||typeof w.rewrite!=="string"||!Array.isArray(w.transfer)||!validDate(w.created_at)||!["report","email","argument"].includes(w.type)||!["guided","exam"].includes(w.mode))throw new Error("Uno scritto nel backup non è valido.");
    if(w.feedback){validateReply("writing_review",w.feedback);if(typeof w.feedback_source!=="string")throw new Error("Manca la bozza revisionata.");}
    if(w.comparison){validateReply("writing_compare",w.comparison);if(typeof w.compare_source?.draft!=="string"||typeof w.compare_source?.rewrite!=="string")throw new Error("Mancano i testi confrontati.");}
  }
  for(const v of s.vocabulary)if(typeof v.id!=="string"||typeof v.expression!=="string"||!v.expression.trim()||typeof v.meaning_it!=="string"||typeof v.example!=="string"||!validDate(v.due)||!Number.isInteger(v.streak)||v.streak<0||!Number.isInteger(v.seen)||v.seen<0)throw new Error("Una voce del lessico non è valida.");
  for(const a of s.attempts)if(typeof a.id!=="string"||typeof a.lesson_id!=="string"||typeof a.correct!=="boolean"||typeof a.answer!=="string"||typeof a.assisted!=="boolean"||!validDate(a.date))throw new Error("Un tentativo nel backup non è valido.");
  for(const set of s.sessions) {
    if(typeof set.id!=="string"||typeof set.lesson_id!=="string"||typeof set.assisted!=="boolean"||!set.answers||typeof set.answers!=="object"||Array.isArray(set.answers)||!Array.isArray(set.items)||!validDate(set.created_at)||set.completed_at!==null&&!validDate(set.completed_at))throw new Error("Una sessione nel backup non è valida.");
    if(set.adaptive_plans!==undefined){
      if(!Array.isArray(set.adaptive_plans)||set.adaptive_plans.length>5||new Set(set.adaptive_plans.map(p=>p.page)).size!==set.adaptive_plans.length)throw new Error("Piani adattivi non validi.");
      for(const plan of set.adaptive_plans){if(!Number.isInteger(plan.page)||plan.page<0||plan.page>4||plan.page*6>=set.items.length||!validDate(plan.created_at))throw new Error("Blocco adattivo non valido.");validateAssessment(plan.assessment);}
    }
    if(set.remediation_focus!==undefined&&(!Array.isArray(set.remediation_focus)||set.remediation_focus.length>3||set.remediation_focus.some(f=>!f||!["stem","answer","reference","why"].every(k=>typeof f[k]==="string")||f.diagnosis!==null&&typeof f.diagnosis!=="string")))throw new Error("Spiegazione della riprova non valida.");
    if(set.remediation_parent!==undefined&&(!set.assisted||!s.sessions.some(p=>p.id===set.remediation_parent&&p.id!==set.id)))throw new Error("La riprova locale deve restare guidata e collegata alla sessione originale.");
    if(set.remediation_blocks!==undefined&&(!set.remediation_blocks||typeof set.remediation_blocks!=="object"||Array.isArray(set.remediation_blocks)||Object.entries(set.remediation_blocks).some(([page,id])=>!/^\d$/.test(page)||Number(page)>4||!s.sessions.some(r=>r.id===id&&r.remediation_parent===set.id))))throw new Error("Collegamento alla riprova non valido.");
    if(set.hinted_items!==undefined&&(!Array.isArray(set.hinted_items)||set.hinted_items.some(id=>typeof id!=="string"||!set.items.some(it=>it.id===id))||set.hinted_items.length>set.items.length||new Set(set.hinted_items).size!==set.hinted_items.length))throw new Error("I suggerimenti usati devono restare associati a una prova con aiuti.");
    if(set.hint_levels!==undefined&&(!set.hint_levels||typeof set.hint_levels!=="object"||Array.isArray(set.hint_levels)||Object.entries(set.hint_levels).some(([id,level])=>!set.hinted_items?.includes(id)||!Number.isInteger(level)||level<1||level>3)))throw new Error("Livelli dei suggerimenti non validi.");
    for(const it of set.items)if(it.doubt!==undefined&&typeof it.doubt!=="boolean"||it.check_note!==undefined&&typeof it.check_note!=="string")throw new Error("Un esercizio contiene un controllo non valido.");
    for(const it of set.items)if(it.rules!==undefined&&(!Array.isArray(it.rules)||it.rules.length>4||it.rules.some(r=>typeof r!=="string"||r.length>80))||it.level!==undefined&&(!Number.isInteger(it.level)||it.level<1||it.level>5))throw new Error("Un esercizio contiene regole o livello non validi.");
    for(const it of set.items)if(typeof it.id!=="string"||typeof it.stem!=="string"||typeof it.answer!=="string"||!Array.isArray(it.options)||it.options.some(v=>typeof v!=="string")||!Array.isArray(it.accept)||it.accept.some(v=>typeof v!=="string")||typeof it.why!=="string")throw new Error("Un esercizio nel backup non è valido.");
    if(Object.values(set.answers).some(v=>typeof v!=="string"))throw new Error("Una risposta nel backup non è valida.");
    if(set.training!==undefined) {
      const t=set.training,pages=Math.ceil(t?.grammar_target/BLOCK_SIZE);
      const validItem=it=>it&&typeof it.id==="string"&&typeof it.stem==="string"&&typeof it.answer==="string"&&typeof it.why==="string"&&Array.isArray(it.options)&&it.options.every(v=>typeof v==="string")&&Array.isArray(it.accept)&&it.accept.every(v=>typeof v==="string");
      if(!t||![BLOCK_SIZE,30].includes(t.grammar_target)||!Number.isInteger(t.page)||t.page<0||t.page>=pages||!Array.isArray(t.checked)||t.checked.length>pages||t.checked.some((page,index)=>page!==index)||t.page>t.checked.length||!Array.isArray(t.recovery)||t.recovery.length>5||t.recovery.some(it=>!validItem(it)||it.kind!=="retrieval")||t.target!==t.grammar_target+t.recovery.length||t.parent_id!==null&&typeof t.parent_id!=="string")throw new Error("Il percorso a blocchi nel backup non è valido.");
      const grammar=set.items.filter(it=>it.kind!=="retrieval").length,lexical=set.items.length-grammar;
      if(!["local","groq"].includes(set.source)||grammar<6||grammar>t.grammar_target||grammar%BLOCK_SIZE!==0||set.source==="local"&&grammar!==t.grammar_target||lexical!==(grammar===t.grammar_target?t.recovery.length:0)||set.items.length<t.checked.length*BLOCK_SIZE||!!set.completed_at!==(t.checked.length===pages)||new Set(set.items.map(it=>it.id)).size!==set.items.length)throw new Error("Gli esercizi e i blocchi salvati non corrispondono.");
      if(t.parent_id!==null&&!s.sessions.some(parent=>parent.id===t.parent_id&&parent.id!==set.id))throw new Error("Manca la sessione originale della riprova.");
      if(t.parent_id!==null&&!set.assisted)throw new Error("La riprova guidata deve restare distinta dalla prova autonoma.");
    }
  }
  for(const r of s.readings) {
    if(typeof r.id!=="string"||typeof r.title!=="string"||typeof r.source!=="string"||typeof r.text!=="string"||typeof r.translation!=="string"||!validDate(r.created_at))throw new Error("Una lettura nel backup non è valida.");
    if(r.understanding){
      const u=r.understanding;validateReply("reading_understand",u);
      const snap=r.understanding_source;if(typeof snap?.text!=="string"||typeof snap.source!=="string"||typeof snap.selection!=="string"||u.segments.some(x=>!snap.text.includes(x.quote))||u.terms.some(x=>!snap.text.includes(x.quote)||!x.quote.includes(x.expression))||u.questions.some(x=>!snap.text.includes(x.quote)))throw new Error("Analisi della lettura senza riscontro nel testo originale.");
    }
    if(r.understanding_answers&&(typeof r.understanding_answers!=="object"||Array.isArray(r.understanding_answers)||Object.entries(r.understanding_answers).some(([k,v])=>!/^\d$/.test(k)||Number(k)>2||typeof v!=="string"||v.length>1200)))throw new Error("Risposte di comprensione non valide.");
    if(r.auto_translation!==undefined&&r.auto_translation!==null){const a=r.auto_translation;if(typeof a!=="object"||!Array.isArray(a.paragraphs)||!Array.isArray(a.translations)||a.paragraphs.length!==a.translations.length||a.paragraphs.length>200||[...a.paragraphs,...a.translations].some(v=>typeof v!=="string")||typeof a.source_text!=="string"||!validDate(a.created_at))throw new Error("Traduzione della lettura non valida.");}
    if(r.test!==undefined&&r.test!==null){
      const t=r.test;
      if(typeof t!=="object"||typeof t.id!=="string"||typeof t.source_text!=="string"||!Array.isArray(t.questions)||t.questions.length<4||t.questions.length>6||!validDate(t.started_at)||t.completed_at!==null&&!validDate(t.completed_at)||!t.answers||typeof t.answers!=="object"||Array.isArray(t.answers))throw new Error("Prova di comprensione non valida.");
      for(const q of t.questions)if(!READING_TEST_TYPES.includes(q?.type)||typeof q.question!=="string"||!Array.isArray(q.options)||q.options.length!==4||q.options.some(o=>typeof o!=="string")||!q.options.includes(q.answer)||typeof q.quote!=="string"||!t.source_text.includes(q.quote)||typeof q.why!=="string"||q.doubt!==undefined&&typeof q.doubt!=="boolean")throw new Error("Domanda di comprensione senza riscontro nel testo.");
      if(Object.entries(t.answers).some(([k,v])=>!/^\d$/.test(k)||Number(k)>=t.questions.length||typeof v!=="string"||!t.questions[Number(k)].options.includes(v)))throw new Error("Risposte della prova non valide.");
      if(t.completed_at&&(!Number.isInteger(t.score)||!Number.isInteger(t.total)||t.score<0||t.score>t.total||t.total>t.questions.length))throw new Error("Punteggio della prova non valido.");
    }
    if(r.test_history!==undefined&&(!Array.isArray(r.test_history)||r.test_history.length>20||r.test_history.some(x=>!Number.isInteger(x?.score)||!Number.isInteger(x?.total)||x.score>x.total||!validDate(x.completed_at))))throw new Error("Storico delle prove non valido.");
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
