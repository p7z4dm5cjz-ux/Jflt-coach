// JFLT Coach — interfaccia e archiviazione (IndexedDB). Logica pura in core.js.
import * as core from "./core.js";
import { createStudio } from "./studio.js";
import { askAI, appToken } from "./ai-client.js";
import { freshLearning, suggestedLesson } from "./learning.js";
import { icon } from "./ui.js";
import {placementProfile} from "./placement.js";
import {
  DIAG_ITEMS, DIAG_SESSIONS, DIAG_TASKS, BOOK_REFS, ERRATA, OBSERVATIONS, TUTOR_PROMPT,
  AREA_LABELS, CAPABILITY_LABELS, CRITERION_LABELS, TYPE_LABELS
} from "./data.js";

/* ================================================================== */
/* Archiviazione                                                       */
/* ================================================================== */

const DB_NAME = "jflt-coach";
const DB_VERSION = 1;
let db = null;
let memory = null; // ripiego se IndexedDB non è disponibile

function openDb() {
  return new Promise((resolve) => {
    if (!("indexedDB" in self)) { memory = {}; return resolve(); }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      for (const s of core.STORES) if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: "id" });
    };
    req.onsuccess = () => { db = req.result; resolve(); };
    req.onerror = () => { memory = {}; resolve(); };
  });
}

function store(name, mode = "readonly") { return db.transaction(name, mode).objectStore(name); }
const wrap = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

async function get(name, id) {
  if (memory) return structuredClone((memory[name] || {})[id]);
  return wrap(store(name).get(id));
}
async function put(name, obj) {
  if (memory) { (memory[name] ||= {})[obj.id] = structuredClone(obj); return; }
  return wrap(store(name, "readwrite").put(obj));
}
async function all(name) {
  if (memory) return Object.values(memory[name] || {}).map((x) => structuredClone(x));
  return wrap(store(name).getAll());
}
async function clearStore(name) {
  if (memory) { memory[name] = {}; return; }
  return wrap(store(name, "readwrite").clear());
}

/* ================================================================== */
/* Impostazioni e stato                                                */
/* ================================================================== */

async function getSettings() {
  const s = await get("settings", "main");
  if (s) return s;
  const fresh = {
    id: "main", first_run: new Date().toISOString(), include_instructions: true,
    diag: {}, plan: null, last_export: null, persist: null
  };
  await put("settings", fresh);
  return fresh;
}
async function saveSettings(s) {
  // I vecchi pannelli possono avere una copia precedente delle impostazioni:
  // non devono sovrascrivere lo Studio aggiornato durante un autosalvataggio.
  const latest=await get("settings","main");
  if(latest?.learning)s.learning=latest.learning;
  if(latest?.ai_endpoint)s.ai_endpoint=latest.ai_endpoint;
  else delete s.ai_endpoint;
  await put("settings", s);
}

const MODE_LABELS = {
  DIAG_ITEMS: "Frasi per la verifica finale", DIAG_EVAL: "Profilo diagnostico", GRAMMAR: "Esercizi di grammatica",
  WRITE_PLAN: "Consegna di scrittura", WRITE_FEEDBACK: "Correzione dello scritto", WRITE_MODEL: "Testo modello",
  CHECK_TRANSFER: "Verifica del trasferimento", WEEK_PLAN: "Piano settimanale"
};
const STAGE_LABELS = { plan: "Da pianificare", draft: "Stesura in corso", submitted: "In attesa di correzione", feedback: "Da riscrivere", rewritten: "Riscritto", done: "Completato" };
const RELIABILITY_LABELS = { ok: "affidabile", with_errata: "con errata", structure_only: "solo struttura", excluded: "escluso" };
const STATUS_LABELS = { verified: "pagina verificata", unchecked: "pagina non controllata" };
const TOOL_STATUS = { open: "Verifica aperta", transferred: "Trasferimento confermato", back_to_practice: "Torna in esercitazione" };

/* ================================================================== */
/* Utilità di interfaccia                                              */
/* ================================================================== */

const view = document.getElementById("view");
const studio=createStudio({view,getSettings,put,all,toast,legacyRequest:createRequest});
const $ = (sel, root = view) => root.querySelector(sel);
const $$ = (sel, root = view) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let timers = [];
function clearTimers() { timers.forEach(clearInterval); timers = []; }

function toast(msg) {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function fmtTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long" });
}

function debounce(fn, ms = 400) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy"); ta.remove(); return ok;
  }
}

const online = () => navigator.onLine !== false;
function updateNet() {
  const n = document.getElementById("net");
  n.textContent = online() ? "online" : "offline";
  n.classList.toggle("off", !online());
}
async function updateBadge() {
  const pending = (await all("requests")).filter((r) => r.status === "pending").length;
  const b = document.getElementById("badge");
  b.hidden = !pending; b.textContent = pending;
}

const sheetAttrs = `autocorrect="off" autocapitalize="sentences" spellcheck="false" autocomplete="off"`;
const tutorNote = () => `<p class="small muted">Con il <a href="#/connect">Tutor automatico</a> configurato, invio e correzione avvengono nell'app. Offline la richiesta resta salvata. Il copia-incolla è solo un percorso alternativo.</p>`;

/* ================================================================== */
/* Stato del percorso                                                  */
/* ================================================================== */

async function loadState() {
  const [settings, profile, requests, sets, tasks, texts, feedback, checks] = await Promise.all([
    getSettings(), get("profile", "main"), all("requests"), all("grammar_sets"), all("tasks"),
    all("texts"), all("feedback"), all("transfer_checks")
  ]);
  return { settings, profile, requests, sets, tasks, texts, feedback, checks };
}

const diagDone = (s, id) => !!s.settings.diag?.[id]?.submitted_at;
const pendingFor = (s, key) => s.requests.find((r) => r.status === "pending" && r.context?.key === key);

function taskStage(task, texts, feedback) {
  const draft = texts.find((t) => t.id === `${task.id}:draft`);
  const rewrite = texts.find((t) => t.id === `${task.id}:rewrite`);
  const fb = feedback.find((f) => f.task_id === task.id && f.kind === "feedback");
  const model = feedback.find((f) => f.task_id === task.id && f.kind === "model");
  if (model) return "done";
  if (rewrite?.saved_at) return "rewritten";
  if (fb) return "feedback";
  if (draft?.submitted_at) return "submitted";
  if (draft?.text) return "draft";
  return "plan";
}

function nextStep(s) {
  for (const id of ["D1", "D2", "D3", "D4"]) {
    if (!diagDone(s, id)) {
      const ses = DIAG_SESSIONS.find((x) => x.id === id);
      return { title: `Diagnostico ${id}: ${ses.label}`, text: `Consigliato ${ses.day.toLowerCase()}. Senza dizionario, traduttore né correttore.`, href: `#/diag/${id}`, cta: "Apri" };
    }
  }
  if (!s.profile) {
    const p = pendingFor(s, "DIAG_EVAL");
    return p
      ? { title: "Profilo: incolla la risposta del Tutor", text: "La richiesta è pronta. Copiala in ChatGPT e incolla qui la risposta.", href: `#/req/${p.id}`, cta: "Apri la richiesta" }
      : { title: "Profilo e priorità (D5)", text: "Prepara la richiesta per il Tutor: valuterà i due scritti e le risposte da giudicare.", href: "#/diag/D5", cta: "Apri" };
  }
  if (!s.settings.plan) return { title: "Conferma le priorità", text: "Leggi il profilo e conferma lo strumento e la capacità da cui partire.", href: "#/diag/D5", cta: "Apri il profilo" };
  if (!diagDone(s, "D6")) return { title: "D6: riscrivi il rapporto D4", text: "Primo esercizio di revisione, guidato dalle priorità del profilo.", href: "#/task/D4", cta: "Apri" };

  const tool = s.settings.plan.focus_tool;
  const open = s.sets.filter((g) => g.tool === tool && g.status !== "done");
  const done = s.sets.filter((g) => g.tool === tool && g.status === "done");
  if (open.length) return { title: `Esercizi: ${AREA_LABELS[tool]}`, text: "Hai una serie da completare. Funziona anche offline.", href: `#/grammar/${open[0].id}`, cta: "Continua" };
  if (!done.length) {
    const p = pendingFor(s, `GRAMMAR:${tool}`);
    return p
      ? { title: "Esercizi: incolla la risposta del Tutor", text: `Richiesta pronta per ${AREA_LABELS[tool]}.`, href: `#/req/${p.id}`, cta: "Apri la richiesta" }
      : { title: `Esercizi: ${AREA_LABELS[tool]}`, text: "Prima serie sullo strumento prioritario.", href: "#/grammar/new", cta: "Prepara" };
  }

  const active = s.tasks.filter((t) => !t.diag).map((t) => ({ t, stage: taskStage(t, s.texts, s.feedback) })).filter((x) => x.stage !== "done");
  if (active.length) {
    const { t, stage } = active[0];
    const texts = {
      plan: "Leggi consegna e modello, poi prepara la scaletta.",
      draft: "Riprendi la stesura.",
      submitted: "Chiedi la correzione al Tutor (richiede connessione).",
      feedback: "Leggi le priorità e riscrivi il testo.",
      rewritten: "Chiedi il testo modello per il confronto."
    };
    return { title: `Scritto: ${STAGE_LABELS[stage]}`, text: texts[stage], href: `#/task/${t.id}`, cta: "Apri" };
  }
  if (core.recoveryNeeded(s.checks, s.sets, tool)) {
    const pg = pendingFor(s, `GRAMMAR:${tool}`);
    return pg
      ? { title: "Esercitazione mirata: incolla la risposta del Tutor", text: `Lo strumento ${AREA_LABELS[tool]} è tornato in esercitazione. La richiesta è pronta.`, href: `#/req/${pg.id}`, cta: "Apri la richiesta" }
      : { title: `Esercitazione mirata: ${AREA_LABELS[tool]}`, text: "Dopo due esiti deboli (o un esito non acquisito) nel trasferimento, lo strumento torna in esercitazione prima del prossimo scritto.", href: "#/grammar/new/recovery", cta: "Prepara" };
  }
  const p = pendingFor(s, "WRITE_PLAN");
  return p
    ? { title: "Scritto: incolla la consegna del Tutor", text: "La richiesta di consegna è pronta.", href: `#/req/${p.id}`, cta: "Apri la richiesta" }
    : { title: "Nuovo scritto", text: `Chiedi una consegna per la capacità ${s.settings.plan.capability} (${CAPABILITY_LABELS[s.settings.plan.capability]}).`, href: "#/write/new", cta: "Prepara" };
}

/* ================================================================== */
/* Richieste al Tutor                                                  */
/* ================================================================== */

function refsFor({ tool, capability }) {
  return BOOK_REFS.filter((b) => (tool && b.tools.includes(tool)) || (capability && b.capabilities.includes(capability)))
    .map(({ ref_id, book, unit, pages, page_status, reliability, use_it }) => ({ ref_id, book, unit, pages, page_status, reliability, use_it }));
}

function knowledgeFor({ tool, capability, extraTags = [] }) {
  const book_refs = refsFor({ tool, capability });
  const tags = [...core.contextTags({ tool, capability, bookRefs: book_refs }), ...extraTags];
  return {
    book_refs,
    errata: core.pertinent(ERRATA, tags).map(({ id, book, pages, quote, fix, severity }) => ({ id, book, pages, quote, fix, severity })),
    observations: core.pertinent(OBSERVATIONS, tags).map(({ id, book, pages, passage, assessment }) => ({ id, book, pages, passage, assessment }))
  };
}

async function recentErrors(limit = 12) {
  const list = (await all("error_log")).sort((a, b) => b.date.localeCompare(a.date));
  return list.slice(0, limit).map(({ quote, minimal_fix, tool, category, systematic }) => ({ quote, minimal_fix, tool, category, systematic }));
}

async function createRequest(mode, data, context) {
  const existing = (await all("requests")).find((r) => r.status === "pending" && r.context?.key === context.key);
  if (existing) { location.hash = `#/req/${existing.id}`; return; }
  const id = core.makeRequestId();
  const req={ id, request_id: id, mode, date: core.todayISO(), created_at: new Date().toISOString(), status: "pending", data, context };
  await put("requests", req);
  await updateBadge();
  location.hash = `#/req/${id}`;
  const settings=await getSettings();
  if(settings.ai_endpoint&&appToken()&&online())sendLegacy(req).catch(e=>toast(e.message));
}

const sendingLegacy=new Set();
async function sendLegacy(req){
  if(sendingLegacy.has(req.id))return;sendingLegacy.add(req.id);
  const route=location.hash;
  try{
    toast("Richiesta salvata. Il tutor sta lavorando…");
    const settings=await getSettings();
    const payload=await askAI(settings.ai_endpoint,"TUTOR",{request:req},{request_id:req.id});
    const envelope={schema:"jflt-coach/v2",mode:req.mode,request_id:req.id,date:req.date,payload,card_candidates:[],questions:[]};
    const checked=core.validateResponse(envelope,req);if(!checked.ok)throw new Error(`Risposta scartata: ${checked.errors.slice(0,3).join(" ")}`);
    const target=await applyResponse(envelope,req);toast("Risposta del tutor salvata.");
    if(location.hash===route||location.hash===`#/req/${req.id}`)location.hash=target;
  }finally{sendingLegacy.delete(req.id);}
}

async function buildDiagEval() {
  const responses = Object.fromEntries((await all("diag_responses")).map((r) => [r.id, r]));
  const items = DIAG_ITEMS.map((it) => {
    const r = responses[it.id] || {};
    return {
      id: it.id, area: it.area, type: it.type, instruction_it: TYPE_LABELS[it.type], stem: it.stem,
      user_answer: r.text || "", user_marked_correct: !!r.marked_correct, confidence: r.confidence || "unset",
      app_score: r.score || core.scoreItem(it, r), reference_answer: it.answer
    };
  });
  const unclear = items.filter((i) => i.app_score === "unclear").map((i) => i.id);
  const texts = [];
  for (const id of ["D3", "D4"]) {
    const t = await get("diag_texts", id);
    const task = DIAG_TASKS[id];
    texts.push({ text_id: id, text_type: task.text_type, task_en: task.prompt_en, words_range: task.words, content_points: task.content_points, text: t?.text || "", word_count: core.wordCount(t?.text), minutes_used: t?.minutes_used ?? null });
  }
  const k = knowledgeFor({ capability: "A4", extraTags: ["A1", "A2"] });
  return {
    student: { slp: (await getSettings()).student_slp || "non indicato", goal_cycle: "W2: email, narrazioni e rapporti chiari con paragrafi collegati" },
    diagnostic: { items, area_stats: core.areaStats(DIAG_ITEMS, responses), unclear_item_ids: unclear },
    texts, ...k
  };
}

/* Applicazione delle risposte importate */
async function applyResponse(obj, req) {
  const p = obj.payload;
  const now = new Date().toISOString();
  let target = "#/home";
  switch (obj.mode) {
    case "DIAG_EVAL": {
      const rulings = Object.fromEntries(p.item_rulings.map((r) => [r.item_id, r.correct]));
      await put("profile", { id: "main", ...p, rulings, request_id: obj.request_id, imported_at: now });
      for (const t of p.texts) for (const e of t.errors) await put("error_log", { id: core.makeId("err"), date: now, source: t.text_id, ...e });
      await put("feedback", { id: `CARDS-${obj.request_id}`, kind: "cards_offer", task_id: "D5", card_candidates: obj.card_candidates, date: now });
      target = "#/diag/D5";
      break;
    }
    case "GRAMMAR": {
      const id = `G-${obj.request_id.slice(-6)}`;
      await put("grammar_sets", { id, ...p, request_id: obj.request_id, status: "todo", created_at: now });
      target = `#/grammar/${id}`;
      break;
    }
    case "WRITE_PLAN": {
      const id = `T-${obj.request_id.slice(-6)}`;
      await put("tasks", { ...p.task, id, tutor_task_id: p.task.id, model_excerpt_en: p.model_excerpt_en, observation_questions_it: p.observation_questions_it, observations: ["", "", ""], outline: "", created_at: now, request_id: obj.request_id });
      target = `#/task/${id}`;
      break;
    }
    case "WRITE_FEEDBACK": {
      const taskId = req.context.task_id;
      const fid = `FB-${obj.request_id}`;
      let transfer = null;
      if (p.transfer) {
        const v = core.transferVerdict(p.transfer.occurrences, req.data?.text ?? null);
        transfer = { tool: p.transfer.tool, ...v };
        await put("transfer_checks", { id: `TR-${obj.request_id}`, tool: p.transfer.tool, text_id: taskId, version: p.version, date: now, ...v });
      }
      await put("feedback", { id: fid, kind: "feedback", task_id: taskId, version: p.version, payload: p, transfer, card_candidates: obj.card_candidates, date: now, request_id: obj.request_id });
      for (const e of p.errors) await put("error_log", { id: core.makeId("err"), date: now, source: taskId, ...e });
      target = `#/task/${taskId}`;
      break;
    }
    case "WRITE_MODEL": {
      const taskId = req.context.task_id;
      await put("feedback", { id: `MD-${obj.request_id}`, kind: "model", task_id: taskId, payload: p, date: now, request_id: obj.request_id });
      if (taskId === "D4") { const s = await getSettings(); s.diag.D6 = { ...(s.diag.D6 || {}), submitted_at: s.diag.D6?.submitted_at || now }; await saveSettings(s); }
      target = `#/task/${taskId}`;
      break;
    }
    case "CHECK_TRANSFER": {
      const v = core.transferVerdict(p.transfer.occurrences, req.data?.text ?? null);
      await put("transfer_checks", { id: `TR-${obj.request_id}`, tool: p.transfer.tool, text_id: p.text_id, date: now, ...v });
      target = "#/more";
      break;
    }
    case "WEEK_PLAN": {
      const s = await getSettings(); s.week_plan = p; await saveSettings(s); target = "#/home"; break;
    }
    case "DIAG_ITEMS": {
      const s = await getSettings(); s.retest_items = p.items; await saveSettings(s); target = "#/diag"; break;
    }
  }
  req.status = "answered"; req.answered_at = now; req.response = obj;
  await put("requests", req);
  await updateBadge();
  return target;
}

function previewResponse(obj) {
  const p = obj.payload;
  switch (obj.mode) {
    case "DIAG_EVAL": return `Profilo con stima ${p.stanag_estimate.range}, ${p.priorities.length} priorità, partenza da ${p.start_capability}; ${p.item_rulings.length} risposte giudicate.`;
    case "GRAMMAR": return `${p.items.length} esercizi su ${AREA_LABELS[p.tool]} (${p.purpose === "check" ? "verifica" : "esercitazione"}).`;
    case "WRITE_PLAN": return `Consegna ${p.task.text_type}, ${p.task.words[0]}-${p.task.words[1]} parole, ${p.task.draft_sessions} sessione/i di stesura.`;
    case "WRITE_FEEDBACK": return `${p.priorities.length} priorità, ${p.errors.length} errori, ${p.alternatives.length} alternative${p.transfer ? `, ${p.transfer.occurrences.length} usi di ${AREA_LABELS[p.transfer.tool]}` : ""}.`;
    case "WRITE_MODEL": return `Modello di ${core.wordCount(p.model_text_en)} parole con confronto.`;
    case "CHECK_TRANSFER": return `${p.transfer.occurrences.length} usi di ${AREA_LABELS[p.transfer.tool]}.`;
    case "WEEK_PLAN": return `Piano dalla settimana del ${p.week_start}.`;
    case "DIAG_ITEMS": return `${p.items.length} frasi nuove.`;
  }
  return "";
}

/* ================================================================== */
/* Schermate                                                           */
/* ================================================================== */

async function screenHome() {
  const s = await loadState();
  const learning = {...freshLearning(), ...(s.settings.learning || {})};
  const lesson = suggestedLesson(learning, s.settings.plan?.focus_tool);
  const placement = placementProfile(learning.placement);
  const due = learning.reviews.filter(r => Date.parse(r.due) <= Date.now()).length;
  const unfinished = learning.writers.find(w => w.stage < 6);
  const completed = learning.attempts.filter(a => a.submitted).length;
  const n = nextStep(s);
  const pending = s.requests.filter((r) => r.status === "pending");
  const plan = s.settings.plan;
  const lastExport = s.settings.last_export;
  const exportOld = !lastExport || Date.now() - new Date(lastExport).getTime() > 7 * 864e5;
  const dow = (new Date().getDay() + 6) % 7;
  const week = core.WEEK_TEMPLATE;
  const kindLabel = { grammar: "Grammatica", write_plan: "Scrittura: pianificazione", write_draft: "Scrittura: stesura", grammar_review: "Grammatica: ripasso e verifiche", write_revise: "Scrittura: revisione", rest: "Riposo o recupero" };
  view.innerHTML = `
    <span class="eyebrow">Un passo alla volta</span><h2>Oggi</h2>
    <p class="muted page-intro">Capire la grammatica. Usarla nelle tue parole.</p>
    <div class="home-grid">
      <section class="panel hero" aria-labelledby="today-lesson">
        <div class="hero-meta"><span class="tag">Sessione consigliata</span><span>20 minuti di studio</span></div>
        <h3 id="today-lesson">${placement?esc(lesson.title):"Il tuo punto di partenza"}</h3><p>${placement?esc(lesson.goal):"45 domande per scegliere le priorità e saltare le basi già acquisite."}</p>
        <div class="row"><a class="btn" href="${placement?`#/lesson/${lesson.id}`:`#/placement${learning.placement?"/run":""}`}">${placement?"Inizia la lezione":learning.placement?"Riprendi il pre-test":"Inizia il pre-test"} <span aria-hidden="true">→</span></a><a class="btn ghost" href="#/tenses">Tempi verbali</a><a class="btn ghost" href="#/learn">Tutto il programma</a></div>
      </section>
      <section class="panel resume-card"><span class="card-icon">${icon("writing")}</span><h3>${unfinished ? "Riprendi il tuo testo" : "Scrivi, passo passo"}</h3><p class="small muted">${unfinished ? esc(unfinished.topic) : "Prima le idee, poi le parole giuste. Un paragrafo alla volta."}</p><a class="btn ghost" href="#/guided/${unfinished?.id||"new"}">${unfinished ? "Continua a scrivere" : "Prepara un testo"}</a></section>
    </div>
    <div class="metric-grid" aria-label="Il tuo studio finora">
      <a class="panel metric tile" href="#/review"><strong>${due}</strong><span>Carte da ripassare</span></a>
      <a class="panel metric tile" href="#/lexicon"><strong>${learning.vocabulary.length}</strong><span>Parole dai tuoi testi</span></a>
      <a class="panel metric tile" href="#/progress"><strong>${completed}</strong><span>Risposte valutate</span></a>
    </div>
    <section class="panel" aria-labelledby="next-t">
      <span class="eyebrow">Scrittura: diagnostico approfondito</span>
      <h3 id="next-t" style="margin-top:0">${esc(n.title)}</h3>
      <p>${esc(n.text)}</p>
      <a class="btn ghost" href="${n.href}" id="next-go">${esc(n.cta)}</a>
    </section>
    ${pending.length ? `<section class="panel warn"><p style="margin:0">${pending.length} ${pending.length === 1 ? "richiesta" : "richieste"} al Tutor in attesa di risposta. <a href="#/requests">Apri</a></p></section>` : ""}
    ${plan ? `
    <h3>La settimana</h3>
    <ul class="steps">${week.map((w, i) => `<li class="${i === dow ? "current" : ""}"><span class="dot">${i + 1}</span><span>${kindLabel[w.kind]}${w.kind.startsWith("grammar") ? ` · ${esc(AREA_LABELS[plan.focus_tool])}` : ""}</span><span class="small muted">${["lun", "mar", "mer", "gio", "ven", "sab", "dom"][i]}</span></li>`).join("")}</ul>
    <p class="small muted">Strumento in corso: ${esc(AREA_LABELS[plan.focus_tool])}. Capacità: ${plan.capability} (${esc(CAPABILITY_LABELS[plan.capability])}).</p>` : ""}
    ${exportOld ? `<section class="panel"><p style="margin:0 0 8px">${lastExport ? `Ultimo backup: ${fmtDate(lastExport)}.` : "Non hai ancora fatto un backup."} Esporta i dati una volta a settimana su File o iCloud.</p><a class="btn ghost" href="#/more">Fai il backup</a></section>` : ""}
    <a href="#/week">Apri il piano settimanale aggiornato</a>`;
}

async function screenDiag() {
  const s = await loadState();
  const status = (id) => {
    if (id === "D5") return s.profile ? "done" : (pendingFor(s, "DIAG_EVAL") ? "wait" : "");
    if (id === "D6") return diagDone(s, "D6") ? "done" : "";
    return diagDone(s, id) ? "done" : (s.settings.diag?.[id]?.started_at ? "current" : "");
  };
  const href = (id) => (id === "D6" ? "#/task/D4" : `#/diag/${id}`);
  view.innerHTML = `
    <h2>Diagnostico</h2>
    <p class="muted">Sei sessioni da 20 minuti. Il giorno è un consiglio: puoi procedere nell'ordine che ti è comodo.</p>
    <ul class="steps">${DIAG_SESSIONS.map((d) => {
      const st = status(d.id);
      return `<li class="${st}"><span class="dot">${st === "done" ? "✓" : ""}</span><a href="${href(d.id)}">${d.id}: ${esc(d.label)}</a><span class="small muted">${st === "wait" ? "in attesa del Tutor" : esc(d.day.toLowerCase())}</span></li>`;
    }).join("")}</ul>
    <p class="small muted">Regole per tutte le prove: niente dizionario, traduttore, AI né correttore. Disattiva la correzione automatica in Impostazioni › Generali › Tastiera.</p>`;
}

/* ---------- D1 e D2 ---------- */
async function screenDiagItems(sid) {
  const s = await getSettings();
  const ses = DIAG_SESSIONS.find((x) => x.id === sid);
  const items = DIAG_ITEMS.filter((i) => i.session === sid);
  const st = s.diag[sid] || {};
  const responses = Object.fromEntries((await all("diag_responses")).map((r) => [r.id, r]));

  if (st.submitted_at) {
    const scored = items.map((it) => responses[it.id]?.score || "wrong");
    const c = (k) => scored.filter((x) => x === k).length;
    view.innerHTML = `
      <h2>${sid} consegnato</h2>
      <div class="panel ok"><p style="margin:0">Risposte riconosciute come corrette: <strong>${c("correct")}</strong> su ${items.length}. Da far valutare al Tutor nel profilo: <strong>${c("unclear")}</strong>.</p></div>
      <p class="muted">Le soluzioni e l'analisi per area arrivano con il profilo (D5), per non influenzare le prove successive.</p>
      <a class="btn" href="#/diag">Torna al diagnostico</a>`;
    return;
  }
  if (!st.started_at) {
    view.innerHTML = `
      <h2>${sid}: ${items.length} frasi</h2>
      <div class="panel">
        <p>${ses.minutes} minuti. Allo scadere le risposte vengono consegnate così come sono.</p>
        <p>Per ogni frase indica anche se sei <strong>sicuro</strong> o <strong>incerto</strong>: serve a distinguere le regole apprese male dalle lacune note.</p>
        <p class="small muted">Niente dizionario né correttore. Correzione automatica della tastiera disattivata.</p>
      </div>
      <button id="start" class="full">Inizia</button>`;
    $("#start").onclick = async () => { s.diag[sid] = { started_at: new Date().toISOString(), index: 0 }; await saveSettings(s); render(); };
    return;
  }

  const endsAt = new Date(st.started_at).getTime() + ses.minutes * 60e3;
  let idx = Math.min(st.index || 0, items.length - 1);

  const submit = async (auto = false) => {
    const rs = Object.fromEntries((await all("diag_responses")).map((r) => [r.id, r]));
    for (const it of items) {
      const r = rs[it.id] || { id: it.id, session: sid, text: "", marked_correct: false, confidence: "unset" };
      r.score = core.scoreItem(it, r);
      await put("diag_responses", r);
    }
    const fresh = await getSettings();
    fresh.diag[sid] = { ...fresh.diag[sid], submitted_at: new Date().toISOString(), auto_submitted: auto };
    await saveSettings(fresh);
    toast(auto ? "Tempo scaduto: risposte consegnate." : "Risposte consegnate.");
    render();
  };

  const draw = () => {
    const it = items[idx];
    const r = responses[it.id] || { id: it.id, session: sid, text: "", marked_correct: false, confidence: "unset" };
    view.innerHTML = `
      <div class="row"><span class="grow small muted">${sid} · frase ${idx + 1} di ${items.length}</span><span class="timer" id="timer">--:--</span></div>
      <div class="progress"><i style="width:${((idx + 1) / items.length) * 100}%"></i></div>
      <p class="small muted">${esc(TYPE_LABELS[it.type])}</p>
      <p class="stem">${esc(it.stem)}</p>
      ${it.type === "error_correction" ? `<label class="checkline"><input type="checkbox" id="ok" ${r.marked_correct ? "checked" : ""}> La frase è già corretta</label>` : ""}
      <label for="ans">${it.type === "completion" ? "Parola o parole mancanti" : "La tua frase"}</label>
      <textarea id="ans" class="answer" ${sheetAttrs} ${r.marked_correct ? "disabled" : ""}>${esc(r.text)}</textarea>
      <label>Quanto sei sicuro?</label>
      <div class="seg" role="group" aria-label="Sicurezza">
        <button type="button" data-conf="sure" aria-pressed="${r.confidence === "sure"}">Sicuro</button>
        <button type="button" data-conf="unsure" aria-pressed="${r.confidence === "unsure"}">Incerto</button>
      </div>
      <div class="row" style="margin-top:20px">
        <button class="ghost" id="prev" ${idx === 0 ? "disabled" : ""}>Indietro</button>
        <span class="grow"></span>
        ${idx < items.length - 1 ? `<button id="next">Avanti</button>` : `<button id="submit">Consegna</button>`}
      </div>`;
    const save = async () => { responses[it.id] = r; await put("diag_responses", r); };
    const saveDeb = debounce(save, 300);
    $("#ans").oninput = (e) => { r.text = e.target.value; saveDeb(); };
    $("#ok")?.addEventListener("change", (e) => { r.marked_correct = e.target.checked; $("#ans").disabled = e.target.checked; save(); });
    $$("[data-conf]").forEach((b) => (b.onclick = () => { r.confidence = b.dataset.conf; $$("[data-conf]").forEach((x) => x.setAttribute("aria-pressed", x === b)); save(); }));
    const go = async (d) => { await save(); idx += d; const f = await getSettings(); f.diag[sid].index = idx; await saveSettings(f); draw(); };
    $("#prev").onclick = () => go(-1);
    $("#next")?.addEventListener("click", () => go(1));
    $("#submit")?.addEventListener("click", async () => {
      await save();
      const missing = items.filter((x) => { const y = responses[x.id]; return !y || (!y.text?.trim() && !y.marked_correct); }).length;
      if (missing && !confirm(`${missing} frasi senza risposta. Consegnare comunque?`)) return;
      submit(false);
    });
    const t = document.getElementById("timer");
    if (t) t.textContent = fmtTime(endsAt - Date.now());
  };
  draw();
  const tick = () => {
    const left = endsAt - Date.now();
    const t = document.getElementById("timer");
    if (t) { t.textContent = fmtTime(left); t.classList.toggle("low", left < 120e3); }
    if (left <= 0) { clearTimers(); submit(true); }
  };
  tick();
  timers.push(setInterval(tick, 1000));
}

/* ---------- D3 e D4 ---------- */
async function screenDiagText(sid) {
  const s = await getSettings();
  const ses = DIAG_SESSIONS.find((x) => x.id === sid);
  const task = DIAG_TASKS[sid];
  const st = s.diag[sid] || {};
  const rec = (await get("diag_texts", sid)) || { id: sid, text: "" };
  const head = `
    <h2>${sid}: ${esc(ses.label)}</h2>
    <p class="task" lang="en">${esc(task.prompt_en)}</p>
    <ul class="small">${task.content_points.map((c) => `<li lang="en">${esc(c)}</li>`).join("")}</ul>`;

  if (st.submitted_at) {
    view.innerHTML = `${head}
      <div class="panel ok"><p style="margin:0">Consegnato: ${core.wordCount(rec.text)} parole in ${rec.minutes_used ?? "?"} minuti.</p></div>
      <div class="panel model" lang="en">${esc(rec.text)}</div>
      <a class="btn" href="#/diag">Torna al diagnostico</a>`;
    return;
  }
  if (!st.started_at) {
    view.innerHTML = `${head}
      <div class="panel"><p style="margin:0">${ses.minutes} minuti di scrittura e ${ses.review} di rilettura. Niente aiuti. Allo scadere il testo viene consegnato.</p></div>
      <button id="start" class="full">Inizia</button>`;
    $("#start").onclick = async () => { s.diag[sid] = { started_at: new Date().toISOString() }; await saveSettings(s); render(); };
    return;
  }
  const start = new Date(st.started_at).getTime();
  const writeEnd = start + ses.minutes * 60e3;
  const end = writeEnd + ses.review * 60e3;
  view.innerHTML = `${head}
    <div class="row"><span class="grow small muted" id="phase">Scrittura</span><span class="timer" id="timer">--:--</span></div>
    <textarea id="txt" class="sheet" lang="en" ${sheetAttrs} aria-label="Il tuo testo">${esc(rec.text)}</textarea>
    <div class="row"><span class="wc grow" id="wc"></span><button id="submit">Consegna</button></div>`;
  const wc = () => { const n = core.wordCount($("#txt").value); const el = $("#wc"); el.textContent = `${n} parole (richieste ${task.words[0]}-${task.words[1]})`; el.classList.toggle("out", n < task.words[0] || n > task.words[1]); };
  wc();
  const save = debounce(async (v) => { rec.text = v; await put("diag_texts", rec); }, 400);
  $("#txt").oninput = (e) => { wc(); save(e.target.value); };
  const submit = async (auto) => {
    rec.text = $("#txt")?.value ?? rec.text;
    rec.minutes_used = Math.min(Math.round((Date.now() - start) / 60e3), ses.minutes + ses.review);
    rec.submitted_at = new Date().toISOString();
    await put("diag_texts", rec);
    const f = await getSettings(); f.diag[sid] = { ...f.diag[sid], submitted_at: rec.submitted_at, auto_submitted: auto }; await saveSettings(f);
    toast(auto ? "Tempo scaduto: testo consegnato." : "Testo consegnato.");
    render();
  };
  $("#submit").onclick = () => submit(false);
  const tick = () => {
    const now = Date.now();
    const t = document.getElementById("timer");
    if (!t) return;
    const inWrite = now < writeEnd;
    $("#phase").textContent = inWrite ? "Scrittura" : "Rilettura";
    t.textContent = fmtTime((inWrite ? writeEnd : end) - now);
    t.classList.toggle("low", !inWrite);
    if (now >= end) { clearTimers(); submit(true); }
  };
  tick();
  timers.push(setInterval(tick, 1000));
}

/* ---------- D5: profilo ---------- */
async function screenProfile() {
  const s = await loadState();
  const missing = ["D1", "D2", "D3", "D4"].filter((id) => !diagDone(s, id));
  if (missing.length) {
    view.innerHTML = `<h2>Profilo (D5)</h2><div class="panel warn"><p style="margin:0">Completa prima: ${missing.join(", ")}.</p></div><a class="btn" href="#/diag">Torna al diagnostico</a>`;
    return;
  }
  if (!s.profile) {
    const p = pendingFor(s, "DIAG_EVAL");
    view.innerHTML = `<h2>Profilo (D5)</h2>
      <p>Il Tutor valuterà i due scritti con la griglia, giudicherà le risposte che l'app non riconosce e proporrà due o tre priorità.</p>
      ${tutorNote()}
      ${p ? `<a class="btn" href="#/req/${p.id}">Apri la richiesta in attesa</a>` : `<button id="mk">Prepara la richiesta di profilo</button>`}`;
    $("#mk")?.addEventListener("click", async () => createRequest("DIAG_EVAL", await buildDiagEval(), { key: "DIAG_EVAL" }));
    return;
  }
  const pr = s.profile;
  const responses = Object.fromEntries((await all("diag_responses")).map((r) => [r.id, r]));
  const stats = core.areaStats(DIAG_ITEMS, responses, pr.rulings);
  const offer = s.feedback.find((f) => f.kind === "cards_offer" && f.task_id === "D5");
  const focusDefault = core.focusToolFromProfile(pr, stats);
  const plan = s.settings.plan;
  const t3 = pr.texts.find((t) => t.text_id === "D3");
  const t4 = pr.texts.find((t) => t.text_id === "D4");
  const prios = pr.priorities.slice().sort((a, b) => a.rank - b.rank);
  view.innerHTML = `
    <h2>Profilo</h2>
    <section class="panel">
      <p style="margin:0"><span class="tag">Stima di scrittura</span> <strong style="font:600 22px var(--serif)">${esc(pr.stanag_estimate.range)}</strong> <span class="small muted">fiducia ${pr.stanag_estimate.confidence === "low" ? "bassa" : "media"}</span></p>
      <p class="small" style="margin:8px 0 0">${esc(pr.stanag_estimate.basis_it)}</p>
      <p class="small muted" style="margin:6px 0 0">Stima orientativa, non ufficiale.</p>
    </section>
    <h3>Priorità</h3>
    <ol>${prios.map((p) => `<li><strong>${esc(p.kind === "grammar_tool" ? AREA_LABELS[p.tool] : CRITERION_LABELS[p.criterion])}</strong>: ${esc(p.issue_it)} <span class="small muted">${esc(p.why_it)}</span></li>`).join("")}</ol>
    <p>Capacità di partenza: <strong>${pr.start_capability}</strong> (${esc(CAPABILITY_LABELS[pr.start_capability])}). <span class="small muted">${esc(pr.start_rationale_it)}</span></p>
    ${plan ? `<div class="panel ok"><p style="margin:0">Priorità confermate: strumento ${esc(AREA_LABELS[plan.focus_tool])}, capacità ${plan.capability}.</p></div>` : `
    <section class="panel next">
      <label for="tool">Strumento da esercitare per primo</label>
      <select id="tool">${core.AREAS.map((a) => `<option value="${a}" ${a === focusDefault ? "selected" : ""}>${esc(AREA_LABELS[a])}</option>`).join("")}</select>
      <label for="cap">Capacità di scrittura</label>
      <select id="cap">${core.CAPABILITIES.map((c) => `<option value="${c}" ${c === pr.start_capability ? "selected" : ""}>${c} · ${esc(CAPABILITY_LABELS[c])}</option>`).join("")}</select>
      <button id="confirm" class="full" style="margin-top:14px">Conferma le priorità</button>
    </section>`}
    <h3>Griglia di scrittura</h3>
    <table><thead><tr><th>Criterio</th><th class="num">D3</th><th class="num">D4</th></tr></thead><tbody>
    ${Object.keys(CRITERION_LABELS).map((c) => `<tr><td>${esc(CRITERION_LABELS[c])}<details><summary class="small muted">motivazione</summary><p class="small">D3: ${esc(t3.rubric[c].evidence)}</p><p class="small">D4: ${esc(t4.rubric[c].evidence)}</p></details></td><td class="num">${t3.rubric[c].score}/4</td><td class="num">${t4.rubric[c].score}/4</td></tr>`).join("")}
    </tbody></table>
    <h3>Frasi per area</h3>
    <table><thead><tr><th>Area</th><th class="num">Esatte</th><th></th><th class="num">Errori sicuri</th></tr></thead><tbody>
    ${core.AREAS.map((a) => { const x = stats[a]; return `<tr><td>${esc(AREA_LABELS[a])}</td><td class="num">${x.correct}/${x.total}</td><td><div class="bar"><i style="width:${x.pct}%"></i></div></td><td class="num">${x.wrong_sure}</td></tr>`; }).join("")}
    </tbody></table>
    <p class="small muted">Errore sicuro = regola appresa in modo errato, priorità alta. Errore incerto = lacuna nota.</p>
    <details><summary>Soluzioni del diagnostico</summary>
      ${DIAG_ITEMS.map((it) => { const r = responses[it.id] || {}; let sc = r.score; if (sc === "unclear" && it.id in pr.rulings) sc = pr.rulings[it.id] ? "correct" : "wrong"; return `<div class="fix"><span class="small muted">${it.id} · ${esc(AREA_LABELS[it.area])}</span><div class="${sc === "correct" ? "mark-good" : "mark-bad"}">${sc === "correct" ? "Esatta" : "Da rivedere"}</div><div class="small">Tua: ${esc(r.marked_correct ? "(frase già corretta)" : r.text || "—")}</div><div class="small" lang="en">Riferimento: ${esc(it.answer)}</div></div>`; }).join("")}
    </details>
    ${renderCardOffer(offer)}`;
  $("#confirm")?.addEventListener("click", async () => {
    const f = await getSettings();
    f.plan = { focus_tool: $("#tool").value, capability: $("#cap").value, confirmed_at: new Date().toISOString() };
    await saveSettings(f);
    toast("Priorità confermate.");
    location.hash = "#/home";
  });
  bindCardOffer(offer);
}

function renderCardOffer(offer) {
  if (!offer || !offer.card_candidates?.length) return "";
  if (offer.decided) return `<p class="small muted">Flashcard: ${offer.kept} salvate su ${offer.card_candidates.length} proposte.</p>`;
  return `<h3>Flashcard proposte</h3>
    <p class="small muted">Nascono solo da errori sistematici. Scegli tu quali tenere: nessuna è selezionata in automatico.</p>
    ${offer.card_candidates.map((c, i) => `<label class="checkline"><input type="checkbox" data-card="${i}"><span><span lang="en">${esc(c.front)}</span><br><span class="small muted">${esc(c.back)}</span></span></label>`).join("")}
    <button class="ghost" id="cards-save">Salva le flashcard scelte</button>`;
}
function bindCardOffer(offer) {
  $("#cards-save")?.addEventListener("click", async () => {
    const chosen = $$("[data-card]").filter((x) => x.checked).map((x) => offer.card_candidates[+x.dataset.card]);
    for (const c of chosen) await put("cards", { id: core.makeId("card"), ...c, created_at: new Date().toISOString(), source: offer.task_id });
    offer.decided = true; offer.kept = chosen.length;
    await put("feedback", offer);
    toast(`${chosen.length} flashcard salvate. Apri Studio → Ripasso.`);
    render();
  });
}

/* ---------- Grammatica ---------- */
async function screenGrammarNew(recovery = false) {
  const s = await getSettings();
  const tool = s.plan?.focus_tool || "tenses";
  view.innerHTML = `<h2>${recovery ? "Esercitazione mirata" : "Nuovi esercizi"}</h2>
    ${recovery ? `<div class="panel warn"><p style="margin:0">Lo strumento è tornato in esercitazione dopo la verifica del trasferimento. Gli esercizi si concentreranno sui tuoi errori recenti.</p></div>` : ""}
    <label for="tool">Strumento</label>
    <select id="tool">${core.AREAS.map((a) => `<option value="${a}" ${a === tool ? "selected" : ""}>${esc(AREA_LABELS[a])}</option>`).join("")}</select>
    <label>Tipo</label>
    <div class="seg" role="group"><button type="button" data-p="practice" aria-pressed="true">Esercitazione (6)</button><button type="button" data-p="check" aria-pressed="false">Verifica (10)</button></div>
    ${tutorNote()}
    <button id="mk" class="full">Prepara la richiesta</button>`;
  let purpose = "practice";
  $$("[data-p]").forEach((b) => (b.onclick = () => { purpose = b.dataset.p; $$("[data-p]").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
  $("#mk").onclick = async () => {
    const t = $("#tool").value;
    const cap = s.plan?.capability || "A2";
    const seen = (await all("grammar_sets")).filter((g) => g.tool === t).flatMap((g) => g.items.map((i) => i.stem));
    const data = {
      tool: t, capability: cap, purpose, n_items: purpose === "check" ? 10 : 6,
      ...(recovery ? { recovery: { reason_it: "Lo strumento è tornato in esercitazione dopo esiti deboli nel trasferimento.", transfer_history: (await all("transfer_checks")).filter((c) => c.tool === t).map(({ date, verdict, n, correct, wrong }) => ({ date, verdict, n, correct, wrong })) } } : {}),
      recent_errors: (await recentErrors()).filter((e) => !e.tool || e.tool === t),
      already_seen: seen, ...knowledgeFor({ tool: t, capability: cap })
    };
    createRequest("GRAMMAR", data, { key: `GRAMMAR:${t}` });
  };
}

async function screenGrammarSet(id) {
  const set = await get("grammar_sets", id);
  if (!set) { view.innerHTML = `<p>Serie non trovata.</p>`; return; }
  const answers = Object.fromEntries((await all("grammar_answers")).filter((a) => a.set_id === id).map((a) => [a.item_id, a]));
  const ref = set.book_ref && BOOK_REFS.find((b) => b.ref_id === set.book_ref.ref_id);
  const errata = ref ? ERRATA.filter((e) => e.tags.includes(ref.ref_id)) : [];
  const answered = set.items.filter((i) => answers[i.id]?.final);
  const firstSix = set.items.slice(0, 6).map((i) => answers[i.id]?.final).filter(Boolean);
  const stop = firstSix.filter((x) => x === "wrong").length >= 3;
  const limit = stop ? Math.max(4, answered.length) : set.items.length;
  const finished = answered.length >= limit;

  if (finished && set.status !== "done") {
    const correct = answered.filter((i) => answers[i.id].final === "correct").length;
    set.status = "done"; set.score = { correct, total: answered.length, stopped: stop, date: new Date().toISOString() };
    await put("grammar_sets", set);
  }

  const itemHtml = (it, i) => {
    const a = answers[it.id];
    if (i >= limit && !a) return "";
    let res = "";
    if (a?.final) res = `<p class="${a.final === "correct" ? "mark-good" : "mark-bad"}">${a.final === "correct" ? "Esatta" : "Sbagliata"}${a.self_judged ? " (giudicata da te)" : ""}</p><p class="small" lang="en">Soluzione: ${esc(it.answer)}</p><p class="small">${esc(it.explanation_it)}</p>`;
    else if (a?.auto === "unclear") res = `<div class="panel warn"><p class="small">La tua risposta non coincide con le soluzioni previste. Soluzione: <span lang="en">${esc(it.answer)}</span>${it.accept.length > 1 ? ` (accettate anche: ${esc(it.accept.filter((x) => x !== it.answer).join("; "))})` : ""}.</p><p class="small">${esc(it.explanation_it)}</p><div class="row"><button class="ghost" data-judge="correct" data-id="${it.id}">Era equivalente</button><button class="ghost" data-judge="wrong" data-id="${it.id}">Era sbagliata</button></div></div>`;
    return `<section class="panel" id="it-${it.id}">
      <p class="small muted">${i + 1}. ${esc(it.instruction_it)}</p>
      <p class="stem" lang="en">${esc(it.stem)}</p>
      <textarea class="answer" data-ans="${it.id}" lang="en" ${sheetAttrs} ${a ? "disabled" : ""}>${esc(a?.text || "")}</textarea>
      ${a ? res : `<button class="ghost" data-check="${it.id}" style="margin-top:8px">Controlla</button>`}
    </section>`;
  };

  view.innerHTML = `
    <h2>${esc(AREA_LABELS[set.tool])}</h2>
    <p class="small muted">${set.purpose === "check" ? "Verifica" : "Esercitazione"} · ${set.items.length} esercizi · disponibile offline</p>
    <section class="panel"><p style="margin:0">${esc(set.explanation_it)}</p>
    ${ref ? `<p class="small" style="margin:8px 0 0">Libro: ${esc(ref.book)} p. ${esc(ref.pages)}${ref.unit ? `, unità ${esc(ref.unit)}` : ""} <span class="tag ${ref.page_status === "verified" ? "ok" : "warn"}">${STATUS_LABELS[ref.page_status]}</span> <span class="tag">${RELIABILITY_LABELS[ref.reliability]}</span></p>
    ${errata.map((e) => `<p class="small" style="margin:6px 0 0"><span class="tag err">errata ${e.id}</span> ${esc(e.quote)} → ${esc(e.fix)}</p>`).join("")}` : ""}</section>
    ${stop ? `<div class="panel warn"><p style="margin:0">Tre errori nelle prime sei risposte: fermati con gli esercizi nuovi e rileggi la spiegazione. Il tempo che resta serve a capire le correzioni.</p></div>` : ""}
    ${set.items.map(itemHtml).join("")}
    ${set.status === "done" ? `<div class="panel ok"><p style="margin:0">Serie completata: ${set.score.correct} su ${set.score.total}.${set.purpose === "check" && set.score.total === 10 ? (set.score.correct >= 9 ? " Verifica superata (regola dell'app, non soglia STANAG)." : " Verifica non superata.") : ""}</p></div><a class="btn" href="#/home">Torna a Oggi</a>` : ""}`;

  $$("[data-check]").forEach((b) => (b.onclick = async () => {
    const it = set.items.find((x) => x.id === b.dataset.check);
    const text = $(`[data-ans="${it.id}"]`).value;
    const auto = core.scoreItem({ type: it.type, already_correct: null, accept: it.accept, stem: it.stem }, { text });
    await put("grammar_answers", { id: `${id}:${it.id}`, set_id: id, item_id: it.id, text, auto, final: auto === "unclear" ? null : auto, date: new Date().toISOString() });
    await render();
    document.getElementById(`it-${it.id}`)?.scrollIntoView({ block: "center" });
  }));
  $$("[data-judge]").forEach((b) => (b.onclick = async () => {
    const a = answers[b.dataset.id];
    a.final = b.dataset.judge; a.self_judged = true;
    await put("grammar_answers", a);
    render();
  }));
}

/* ---------- Scritti ---------- */
async function screenWriteList() {
  const s = await loadState();
  const rows = [
    ...["D3", "D4"].filter((id) => diagDone(s, id)).map((id) => ({ id, title: `${id} · ${DIAG_TASKS[id].text_type === "note" ? "Email" : "Rapporto"} del diagnostico`, stage: id === "D4" ? (diagDone(s, "D6") ? "rewritten" : "feedback") : "done", href: id === "D4" ? "#/task/D4" : "#/diag/D3" })),
    ...s.tasks.map((t) => ({ id: t.id, title: `${t.capability} · ${CAPABILITY_LABELS[t.capability]}`, stage: taskStage(t, s.texts, s.feedback), href: `#/task/${t.id}` }))
  ];
  view.innerHTML = `<h2>Scritti</h2>
    <p><a class="btn" href="#/guided/new">Laboratorio passo passo o simulazione</a></p>
    ${rows.length ? `<ul class="steps">${rows.map((r) => `<li class="${r.stage === "done" ? "done" : ""}"><span class="dot">${r.stage === "done" ? "✓" : ""}</span><a href="${r.href}">${esc(r.title)}</a><span class="small muted">${STAGE_LABELS[r.stage] || ""}</span></li>`).join("")}</ul>` : `<p class="muted">Ancora nessuno scritto. Il primo arriva con il diagnostico.</p>`}
    ${s.settings.plan ? `<a class="btn" href="#/write/new" style="margin-top:12px">Nuova consegna</a>` : ""}`;
}

async function screenWriteNew() {
  const s = await getSettings();
  const cap = s.plan?.capability || "A2";
  view.innerHTML = `<h2>Nuova consegna</h2>
    <label for="cap">Capacità</label>
    <select id="cap">${core.CAPABILITIES.map((c) => `<option value="${c}" ${c === cap ? "selected" : ""}>${c} · ${esc(CAPABILITY_LABELS[c])}</option>`).join("")}</select>
    <label for="tt">Tipo di testo (intervalli di allenamento: verifica la consegna del tuo JFLT)</label>
    <select id="tt"><option value="note">Nota o email, 50-100 parole</option><option value="report_letter" selected>Rapporto o lettera formale, 150-250 parole</option><option value="essay">Saggio, 250-500 parole (stesura in due sessioni)</option></select>
    ${tutorNote()}
    <button id="mk" class="full">Prepara la richiesta</button>`;
  $("#mk").onclick = async () => {
    const st = await loadState();
    const c = $("#cap").value;
    const tt = $("#tt").value;
    const words = { note: [50, 100], report_letter: [150, 250], essay: [250, 500] }[tt];
    const data = {
      capability: c, capability_label: CAPABILITY_LABELS[c], text_type: tt, words, draft_sessions: words[1] > 250 ? 2 : 1,
      profile_priorities: st.profile?.priorities || [], recent_errors: await recentErrors(),
      ...knowledgeFor({ capability: c, tool: st.settings.plan?.focus_tool })
    };
    createRequest("WRITE_PLAN", data, { key: "WRITE_PLAN" });
  };
}

async function diagTaskAsTask(id) {
  const t = DIAG_TASKS[id];
  return { id, diag: true, capability: "A4", text_type: t.text_type, prompt_en: t.prompt_en, words: t.words, content_points: t.content_points, checklist_it: [], draft_sessions: 1 };
}

async function transferToolFor(s) {
  const tool = s.settings.plan?.focus_tool;
  if (!tool) return null;
  return s.sets.some((g) => g.tool === tool && g.status === "done") ? tool : null;
}

function toolStatus(checks, tool) {
  const seq = checks.filter((c) => c.tool === tool).sort((a, b) => a.date.localeCompare(b.date)).map((c) => c.verdict);
  return core.transferStatus(seq);
}

async function screenTask(id) {
  const s = await loadState();
  const isDiag = id === "D4";
  const task = isDiag ? await diagTaskAsTask("D4") : s.tasks.find((t) => t.id === id);
  if (!task) { view.innerHTML = `<p>Scritto non trovato.</p>`; return; }
  if (isDiag && !s.profile) { view.innerHTML = `<h2>D6</h2><div class="panel warn"><p style="margin:0">La riscrittura di D4 si fa dopo il profilo (D5).</p></div>`; return; }

  let draft = s.texts.find((t) => t.id === `${id}:draft`);
  if (isDiag) { const d4 = await get("diag_texts", "D4"); draft = { id: "D4:draft", text: d4?.text || "", submitted_at: d4?.submitted_at }; }
  else draft ||= { id: `${id}:draft`, task_id: id, version: "draft", text: "", parts: [] };
  let rewrite = s.texts.find((t) => t.id === `${id}:rewrite`) || { id: `${id}:rewrite`, task_id: id, version: "rewrite", text: "" };

  // Correzione: per D4 viene dal profilo, per gli altri dal Tutor.
  let fb = s.feedback.filter((f) => f.task_id === id && f.kind === "feedback").sort((a, b) => a.date.localeCompare(b.date)).pop();
  if (isDiag) {
    const t4 = s.profile.texts.find((t) => t.text_id === "D4");
    fb = { diag: true, payload: { rubric: t4.rubric, errors: t4.errors, alternatives: [], priorities: s.profile.priorities.slice().sort((a, b) => a.rank - b.rank).map((p) => ({ criterion: p.criterion || "grammar", label: p.kind === "grammar_tool" ? AREA_LABELS[p.tool] : CRITERION_LABELS[p.criterion], issue_it: p.issue_it, why_it: p.why_it })), rewrite_request_it: "Riscrivi il rapporto applicando le priorità del profilo. Conserva le tue idee.", stanag_estimate: null, transfer: null } };
  }
  const model = s.feedback.find((f) => f.task_id === id && f.kind === "model");
  const stage = isDiag ? (model ? "done" : rewrite.saved_at ? "rewritten" : "feedback") : taskStage(task, s.texts, s.feedback);
  const parts = draft.parts || [];
  const sessionsDone = parts.filter((p) => p.ended_at).length;

  const consegna = `
    <h2>${isDiag ? "D6 · Riscrittura di D4" : `Scritto ${esc(task.capability)}`}</h2>
    <p class="task" lang="en">${esc(task.prompt_en)}</p>
    <p class="small muted">${task.words[0]}-${task.words[1]} parole${task.draft_sessions === 2 ? " · stesura in due sessioni" : ""}</p>
    <ul class="small">${task.content_points.map((c) => `<li lang="en">${esc(c)}</li>`).join("")}</ul>
    ${task.checklist_it?.length ? `<details><summary>Checklist</summary><ul class="small">${task.checklist_it.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></details>` : ""}`;

  let body = "";
  if (!isDiag && ["plan", "draft"].includes(stage)) {
    body += `
      <h3>Modello breve</h3>
      <div class="panel model" lang="en">${esc(task.model_excerpt_en)}</div>
      ${task.observation_questions_it.map((q, i) => `<label for="obs${i}">${esc(q)}</label><textarea class="answer" id="obs${i}" data-obs="${i}">${esc(task.observations?.[i] || "")}</textarea>`).join("")}
      <h3>Scaletta</h3>
      <textarea class="answer" id="outline" lang="en" ${sheetAttrs} placeholder="Un punto per riga">${esc(task.outline || "")}</textarea>
      <h3>Stesura${task.draft_sessions === 2 ? ` · sessione ${Math.min(sessionsDone + 1, 2)} di 2` : ""}</h3>
      <p class="small muted">15 minuti a tempo, senza dizionario né correttore. Il testo si salva da solo.</p>
      <div class="row"><button class="ghost" id="tstart">${parts.some((p) => !p.ended_at) ? "Sessione in corso" : "Avvia il timer"}</button><span class="grow"></span><span class="timer" id="timer"></span></div>
      <textarea id="draft" class="sheet" lang="en" ${sheetAttrs} aria-label="Stesura">${esc(draft.text)}</textarea>
      <div class="row"><span class="wc grow" id="wc"></span>
        ${task.draft_sessions === 2 && sessionsDone < 1 ? `<button class="ghost" id="endpart">Chiudi la sessione 1</button>` : ""}
        <button id="submitdraft">Consegna la stesura</button></div>`;
  } else if (!isDiag) {
    body += `<h3>Stesura consegnata</h3><div class="panel model" lang="en">${esc(draft.text)}</div><p class="small muted">${core.wordCount(draft.text)} parole</p>`;
  } else {
    body += `<h3>Il tuo rapporto D4</h3><div class="panel model" lang="en">${esc(draft.text)}</div>`;
  }

  if (stage === "submitted") {
    const p = pendingFor(s, `WRITE_FEEDBACK:${id}`);
    body += `<h3>Correzione</h3>${tutorNote()}${p ? `<a class="btn" href="#/req/${p.id}">Apri la richiesta in attesa</a>` : `<button id="askfb">Chiedi la correzione</button>`}`;
  }

  if (fb && ["feedback", "rewritten", "done"].includes(stage)) {
    const p = fb.payload;
    body += `
      <h3>Correzione${fb.diag ? " (dal profilo)" : ""}</h3>
      <section class="panel"><p class="small muted" style="margin-top:0">Priorità</p>
        <ol>${p.priorities.map((x) => `<li><strong>${esc(x.label || CRITERION_LABELS[x.criterion])}</strong>: ${esc(x.issue_it)} <span class="small muted">${esc(x.why_it)}</span></li>`).join("")}</ol></section>
      <section class="panel"><p class="small muted" style="margin-top:0">Errori, con correzione minima</p>
        ${p.errors.map((e) => `<div class="fix"><span class="was" lang="en">${esc(e.quote)}</span><span class="now" lang="en">${esc(e.minimal_fix)}</span><div class="why">${esc(e.rule_it)}${e.systematic ? ` <span class="tag err">ricorrente</span>` : ""}</div></div>`).join("") || `<p class="small">Nessun errore effettivo.</p>`}</section>
      ${p.alternatives.length ? `<section class="panel alt"><p class="small muted" style="margin-top:0">Alternative di stile (non sono errori)</p>${p.alternatives.map((a) => `<div class="fix"><span lang="en">${esc(a.quote)}</span><span class="now" lang="en">${esc(a.option)}</span><div class="why">${esc(a.note_it)}</div></div>`).join("")}</section>` : ""}
      ${fb.transfer ? `<section class="panel ${fb.transfer.verdict === "confirmed" ? "ok" : fb.transfer.verdict === "not_acquired" ? "err" : "warn"}" id="transfer"><p style="margin:0"><strong>Trasferimento · ${esc(AREA_LABELS[fb.transfer.tool])}</strong>: ${fb.transfer.correct} corretti su ${fb.transfer.n} usi.</p><p class="small" style="margin:6px 0 0">${esc(core.VERDICT_LABELS[fb.transfer.verdict])}</p><p class="small muted" style="margin:6px 0 0">Stato dello strumento: ${TOOL_STATUS[toolStatus(s.checks, fb.transfer.tool)]}</p></section>` : ""}
      ${p.stanag_estimate ? `<p class="small">Stima orientativa: <strong>${esc(p.stanag_estimate.range)}</strong>. ${esc(p.stanag_estimate.basis_it)}</p>` : ""}
      ${fb.diag ? "" : renderCardOffer(fb)}
      <h3>Riscrittura</h3>
      <p>${esc(p.rewrite_request_it)}</p>
      <textarea id="rewrite" class="sheet" lang="en" ${sheetAttrs} aria-label="Riscrittura" ${stage === "done" ? "readonly" : ""}>${esc(rewrite.text || draft.text)}</textarea>
      <div class="row"><span class="wc grow" id="wc2"></span>${stage === "done" ? "" : `<button id="saverw">Salva la riscrittura</button>`}</div>`;
  }

  if (stage === "rewritten") {
    const p = pendingFor(s, `WRITE_MODEL:${id}`);
    body += `<h3>Testo modello</h3><p class="small muted">Il modello completo si vede solo dopo la tua riscrittura.</p>${tutorNote()}${p ? `<a class="btn" href="#/req/${p.id}">Apri la richiesta in attesa</a>` : `<button id="askmodel">Chiedi il modello</button>`}`;
  }
  if (model) {
    const m = model.payload;
    body += `<h3>Confronto e modello</h3>
      ${m.improvements_it.length ? `<p class="small muted">Migliorato</p><ul>${m.improvements_it.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${m.still_open_it.length ? `<p class="small muted">Ancora da lavorare</p><ul>${m.still_open_it.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      <div class="panel model" lang="en" id="modeltext">${esc(m.model_text_en)}</div>`;
  }

  view.innerHTML = consegna + body;

  // Pianificazione e stesura
  if ($("#draft")) {
    const wc = () => { const n = core.wordCount($("#draft").value); const el = $("#wc"); el.textContent = `${n} parole (${task.words[0]}-${task.words[1]})`; el.classList.toggle("out", n < task.words[0] || n > task.words[1]); };
    wc();
    const saveDraft = debounce(async (v) => { draft.text = v; await put("texts", draft); }, 400);
    $("#draft").oninput = (e) => { wc(); saveDraft(e.target.value); };
    $("#outline").oninput = debounce(async (e) => { task.outline = e.target.value; await put("tasks", task); }, 400);
    $$("[data-obs]").forEach((el) => (el.oninput = debounce(async () => { task.observations[+el.dataset.obs] = el.value; await put("tasks", task); }, 400)));
    const running = parts.find((p) => !p.ended_at);
    const runTimer = (p) => {
      const end = new Date(p.started_at).getTime() + 15 * 60e3;
      const tick = () => { const t = document.getElementById("timer"); if (!t) return; const left = end - Date.now(); t.textContent = fmtTime(left); t.classList.toggle("low", left < 120e3); };
      tick(); timers.push(setInterval(tick, 1000));
    };
    if (running) runTimer(running);
    $("#tstart").onclick = async () => {
      if (parts.some((p) => !p.ended_at)) return;
      const p = { session: parts.length + 1, started_at: new Date().toISOString() };
      draft.parts = [...parts, p]; await put("texts", draft); parts.push(p); runTimer(p);
      $("#tstart").textContent = "Sessione in corso";
    };
    $("#endpart")?.addEventListener("click", async () => {
      const p = draft.parts?.find((x) => !x.ended_at) || { session: 1, started_at: new Date().toISOString() };
      p.ended_at = new Date().toISOString(); p.words = core.wordCount($("#draft").value);
      draft.text = $("#draft").value;
      draft.parts = [...(draft.parts || []).filter((x) => x !== p && x.session !== p.session), p];
      await put("texts", draft); toast("Sessione 1 chiusa. Riprendi con la sessione 2."); render();
    });
    $("#submitdraft").onclick = async () => {
      draft.text = $("#draft").value;
      if (!draft.text.trim()) { toast("Il testo è vuoto."); return; }
      if (task.draft_sessions === 2 && sessionsDone < 1 && !confirm("È prevista una seconda sessione di stesura. Consegnare comunque?")) return;
      (draft.parts || []).forEach((p) => { if (!p.ended_at) { p.ended_at = new Date().toISOString(); p.words = core.wordCount(draft.text); } });
      draft.submitted_at = new Date().toISOString();
      await put("texts", draft); toast("Stesura consegnata."); render();
    };
  }
  $("#askfb")?.addEventListener("click", async () => {
    const st = await loadState();
    const tool = await transferToolFor(st);
    const data = {
      text_id: id, version: "draft",
      task: { prompt_en: task.prompt_en, text_type: task.text_type, words: task.words, content_points: task.content_points, checklist_it: task.checklist_it, capability: task.capability },
      text: draft.text, word_count: core.wordCount(draft.text), outline: task.outline || "",
      transfer_tool: tool, profile_priorities: st.profile?.priorities || [], recent_errors: await recentErrors(),
      ...knowledgeFor({ capability: task.capability, tool })
    };
    createRequest("WRITE_FEEDBACK", data, { key: `WRITE_FEEDBACK:${id}`, task_id: id });
  });
  if ($("#rewrite")) {
    const wc2 = () => { const n = core.wordCount($("#rewrite").value); $("#wc2").textContent = `${n} parole`; };
    wc2();
    $("#rewrite").oninput = wc2;
    $("#saverw")?.addEventListener("click", async () => {
      rewrite.text = $("#rewrite").value; rewrite.saved_at = new Date().toISOString();
      await put("texts", rewrite);
      if (isDiag) { const f = await getSettings(); f.diag.D6 = { submitted_at: rewrite.saved_at }; await saveSettings(f); }
      toast("Riscrittura salvata."); render();
    });
    if (!fb.diag) bindCardOffer(fb);
  }
  $("#askmodel")?.addEventListener("click", async () => {
    const data = {
      text_id: id, task: { prompt_en: task.prompt_en, text_type: task.text_type, words: task.words, content_points: task.content_points },
      draft_text: draft.text, rewrite_text: rewrite.text,
      feedback: { priorities: fb.payload.priorities, errors: fb.payload.errors.map(({ quote, minimal_fix, rule_it }) => ({ quote, minimal_fix, rule_it })) },
      ...knowledgeFor({ capability: task.capability })
    };
    createRequest("WRITE_MODEL", data, { key: `WRITE_MODEL:${id}`, task_id: id });
  });
}

/* ---------- Richieste ---------- */
async function screenRequests() {
  const reqs = (await all("requests")).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const pend = reqs.filter((r) => r.status === "pending");
  const done = reqs.filter((r) => r.status !== "pending");
  const li = (r) => `<li class="${r.status === "pending" ? "wait" : "done"}"><span class="dot">${r.status === "pending" ? "" : "✓"}</span><a href="#/req/${r.id}">${esc(MODE_LABELS[r.mode])}</a><span class="small muted">${fmtDate(r.created_at)}</span></li>`;
  view.innerHTML = `<h2>Tutor</h2>
    <p class="muted">Le richieste del percorso precedente restano qui. Configura il collegamento automatico per inviarle e importare la correzione senza copia-incolla.</p><a class="btn" href="#/connect">Tutor automatico</a><a class="btn ghost" href="#/learn">Nuovo Studio</a>
    ${!online() ? `<div class="panel warn"><p style="margin:0">Sei offline: le richieste restano in attesa. Esercizi già importati, diagnostico e scrittura funzionano normalmente.</p></div>` : ""}
    <h3>In attesa</h3>${pend.length ? `<ul class="steps">${pend.map(li).join("")}</ul>` : `<p class="small muted">Nessuna richiesta in attesa.</p>`}
    <a class="btn ghost" href="#/import">Incolla una risposta</a>
    ${done.length ? `<h3>Completate</h3><ul class="steps">${done.slice(0, 20).map(li).join("")}</ul>` : ""}`;
}

async function screenRequest(id) {
  const req = await get("requests", id);
  if (!req) { view.innerHTML = `<p>Richiesta non trovata.</p>`; return; }
  const s = await getSettings();
  const msg = core.buildMessage(req, { tutorPrompt: TUTOR_PROMPT, includeInstructions: s.include_instructions });
  view.innerHTML = `
    <h2>${esc(MODE_LABELS[req.mode])}</h2>
    <p class="small muted">Richiesta ${esc(req.request_id)} · ${fmtDate(req.created_at)} · <span class="tag ${req.status === "pending" ? "warn" : "ok"}">${req.status === "pending" ? "in attesa" : "importata"}</span></p>
    ${req.status === "pending" ? `
      <div class="panel"><p>Invio diretto al tutor Groq tramite il tuo Worker.</p><button id="send-ai" ${sendingLegacy.has(req.id)?"disabled":""}>${sendingLegacy.has(req.id)?"Tutor al lavoro…":"Invia e importa automaticamente"}</button><a href="#/connect">Configura collegamento</a></div>
      ${!online() ? `<div class="panel warn"><p style="margin:0">Sei offline. La richiesta è salvata: copiala e inviala quando torni in linea.</p></div>` : ""}
      <h3>1. Copia il messaggio</h3>
      <p class="small muted">${s.include_instructions ? "Contiene le istruzioni complete del Tutor: funziona anche in una chat nuova." : "Senza istruzioni: usalo in un progetto ChatGPT che le ha già."}</p>
      <textarea class="code" id="msg" readonly>${esc(msg)}</textarea>
      <div class="row" style="margin-top:8px"><button id="copy">Copia messaggio</button><a class="btn ghost" href="https://chatgpt.com/" target="_blank" rel="noopener">Apri ChatGPT</a></div>
      <h3>2. Incolla la risposta</h3>
      <textarea class="code" id="resp" placeholder="Incolla qui il JSON del Tutor"></textarea>
      <div class="row" style="margin-top:8px"><button class="ghost" id="paste">Incolla dagli appunti</button><button id="check">Controlla la risposta</button></div>
      <div id="out"></div>` : `<div class="panel ok"><p style="margin:0">Importata il ${fmtDate(req.answered_at)}.</p></div><details><summary>Messaggio inviato</summary><textarea class="code" readonly>${esc(msg)}</textarea></details>`}`;
  if (req.status !== "pending") return;
  $("#send-ai").onclick=async()=>{const b=$("#send-ai");b.disabled=true;try{await sendLegacy(req);}catch(e){toast(e.message);}finally{if(b.isConnected)b.disabled=false;}};
  $("#copy").onclick = async () => toast((await copyText(msg)) ? "Messaggio copiato." : "Copia non riuscita: seleziona il testo a mano.");
  $("#paste").onclick = async () => {
    try { $("#resp").value = await navigator.clipboard.readText(); } catch { toast("Lettura degli appunti non consentita: incolla a mano."); }
  };
  $("#check").onclick = () => checkAndImport($("#resp").value, req);
}

async function checkAndImport(text, fixedReq) {
  const out = $("#out");
  let obj;
  try { obj = core.extractJson(text); } catch (e) { out.innerHTML = `<div class="panel err"><p style="margin:0">${esc(e.message)}</p></div>`; return; }
  let req = fixedReq;
  if (!req) {
    req = await get("requests", obj.request_id);
    if (!req) { out.innerHTML = `<div class="panel err"><p style="margin:0">Nessuna richiesta con request_id ${esc(obj.request_id)}. Controlla di aver incollato la risposta giusta.</p></div>`; return; }
    if (req.status !== "pending") { out.innerHTML = `<div class="panel err"><p style="margin:0">Questa risposta è già stata importata.</p></div>`; return; }
  }
  const r = core.validateResponse(obj, req);
  if (!r.ok) {
    out.innerHTML = `<div class="panel err"><p>La risposta non è valida. Copia questi errori nella chat e chiedi al Tutor di correggere il JSON:</p><ul class="errors" id="errlist">${r.errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul><button class="ghost" id="copyerr">Copia gli errori</button></div>`;
    $("#copyerr").onclick = async () => { await copyText(`Il JSON non è valido per jflt-coach/v2. Correggi questi punti e restituisci di nuovo SOLO il JSON:\n- ${r.errors.join("\n- ")}`); toast("Errori copiati."); };
    return;
  }
  out.innerHTML = `<div class="panel ok"><p>${esc(previewResponse(obj))}</p>${obj.questions.length ? `<p class="small">Domande del Tutor: ${obj.questions.map(esc).join(" · ")}</p>` : ""}<button id="doimport">Importa</button></div>`;
  $("#doimport").onclick = async () => { const target = await applyResponse(obj, req); toast("Risposta importata."); location.hash = target; };
}

async function screenImport() {
  view.innerHTML = `<h2>Incolla una risposta</h2>
    <p class="muted">L'app riconosce la richiesta dal request_id.</p>
    <textarea class="code" id="resp" placeholder="Incolla qui il JSON del Tutor"></textarea>
    <div class="row" style="margin-top:8px"><button class="ghost" id="paste">Incolla dagli appunti</button><button id="check">Controlla la risposta</button></div>
    <div id="out"></div>`;
  $("#paste").onclick = async () => { try { $("#resp").value = await navigator.clipboard.readText(); } catch { toast("Lettura degli appunti non consentita: incolla a mano."); } };
  $("#check").onclick = () => checkAndImport($("#resp").value, null);
}

/* ---------- Altro: backup, impostazioni, libri, laboratorio ---------- */
async function exportData() {
  await studio.flush();
  const stores = {};
  for (const s of core.STORES) stores[s] = await all(s);
  const backup = { format: core.BACKUP_FORMAT, exported_at: new Date().toISOString(), app_version: core.APP_VERSION, stores };
  const json = JSON.stringify(backup, null, 1);
  const name = `jflt-coach-backup-${core.todayISO()}.json`;
  const file = new File([json], name, { type: "application/json" });
  let shared = false;
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); shared = true; } catch (e) { if (e.name === "AbortError") return false; }
  }
  if (!shared) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  }
  const s = await getSettings(); s.last_export = backup.exported_at; await saveSettings(s);
  return backup;
}

// Ripristino atomico: una sola transazione su tutti gli archivi. Se un record non
// può essere scritto la transazione viene annullata e i dati precedenti restano intatti.
async function restoreData(obj) {
  await studio.flush();
  const v = core.validateBackup(obj);
  if (!v.ok) throw new Error(`backup non valido: ${v.errors.join("; ")}`);
  if (memory) {
    const next = {};
    for (const name of core.STORES) next[name] = Object.fromEntries(obj.stores[name].map((r) => [r.id, structuredClone(r)]));
    memory = next; // sostituzione solo a copia riuscita
    return;
  }
  await new Promise((resolve, reject) => {
    let tx;
    try { tx = db.transaction(core.STORES, "readwrite"); } catch (e) { reject(e); return; }
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error || new Error("ripristino annullato"));
    try {
      for (const name of core.STORES) {
        const st = tx.objectStore(name);
        st.clear();
        for (const r of obj.stores[name]) st.put(r);
      }
    } catch (e) {
      try { tx.abort(); } catch {}
      reject(e);
    }
  });
}

async function screenMore() {
  const s = await loadState();
  const tools = [...new Set(s.checks.map((c) => c.tool))];
  const cards = await all("cards");
  view.innerHTML = `<h2>Altro</h2>
    <div class="row"><a class="btn" href="#/connect">Tutor automatico</a><a class="btn ghost" href="#/learn">Studio</a><a class="btn ghost" href="#/diag">Diagnostico</a></div>
    <h3>Backup</h3>
    <p class="small muted">${s.settings.last_export ? `Ultimo backup: ${fmtDate(s.settings.last_export)}.` : "Nessun backup finora."} Il file contiene tutti i dati dell'app; salvalo su File o iCloud.</p>
    <div class="row"><button id="exp">Esporta i dati</button><label class="btn ghost" for="imp" style="margin:0">Ripristina da file</label><input type="file" id="imp" accept="application/json,.json" hidden></div>
    <div id="restore"></div>
    <h3>Tutor</h3><p><a href="#/requests">Richieste e risposte del percorso precedente</a></p>
    <label for="slp">Profilo SLP attuale (resta solo su questo telefono)</label>
    <input type="text" id="slp" placeholder="es. 2-2-2-2" value="${esc(s.settings.student_slp || "")}" autocomplete="off">
    <label class="checkline"><input type="checkbox" id="instr" ${s.settings.include_instructions ? "checked" : ""}> Includi le istruzioni complete in ogni messaggio</label>
    <p class="small muted">Disattivalo solo se usi un progetto ChatGPT con le istruzioni già inserite.</p>
    <button class="ghost" id="copyprompt">Copia le istruzioni del Tutor</button>
    <h3>Cosa funziona offline</h3>
    <table><tbody>
      <tr><td>Diagnostico D1-D4, riscritture, stesure, scalette</td><td><span class="tag ok">offline</span></td></tr>
      <tr><td>Esercizi già importati, punteggio automatico</td><td><span class="tag ok">offline</span></td></tr>
      <tr><td>Preparare e copiare le richieste al Tutor</td><td><span class="tag ok">offline</span></td></tr>
      <tr><td>Profilo, esercizi nuovi, consegne, correzioni, modelli</td><td><span class="tag warn">richiede connessione</span></td></tr>
      <tr><td>Backup e ripristino</td><td><span class="tag ok">offline</span></td></tr>
    </tbody></table>
    ${tools.length ? `<h3>Trasferimento</h3><table><tbody>${tools.map((t) => `<tr><td>${esc(AREA_LABELS[t])}</td><td>${TOOL_STATUS[toolStatus(s.checks, t)]}</td></tr>`).join("")}</tbody></table>` : ""}
    <p class="small muted">Flashcard del percorso precedente: ${cards.length}. <a href="#/review">Apri il ripasso distribuito</a>.</p>
    <h3>Altre sezioni</h3>
    <div class="row"><a class="btn ghost" href="#/books">Libri ed errata</a><a class="btn ghost" href="#/lab">Laboratorio dispositivo</a></div>
    <p class="small muted" style="margin-top:16px">JFLT Coach ${core.APP_VERSION}</p>`;
  $("#exp").onclick = async () => { const b = await exportData(); if (b) toast("Backup esportato."); render(); };
  $("#slp").onchange = async (e) => { const f = await getSettings(); f.student_slp = e.target.value.trim(); await saveSettings(f); toast("Profilo salvato."); };
  $("#instr").onchange = async (e) => { const f = await getSettings(); f.include_instructions = e.target.checked; await saveSettings(f); };
  $("#copyprompt").onclick = async () => toast((await copyText(TUTOR_PROMPT)) ? "Istruzioni copiate." : "Copia non riuscita.");
  $("#imp").onchange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    let obj;
    try { obj = JSON.parse(await file.text()); } catch { $("#restore").innerHTML = `<div class="panel err"><p style="margin:0">Il file non è un JSON leggibile.</p></div>`; return; }
    const v = core.validateBackup(obj);
    if (!v.ok) { $("#restore").innerHTML = `<div class="panel err"><p>Backup non valido:</p><ul class="errors">${v.errors.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`; return; }
    const counts = Object.entries(obj.stores).filter(([, r]) => r.length).map(([k, r]) => `${k}: ${r.length}`).join(", ");
    $("#restore").innerHTML = `<div class="panel warn"><p>Backup del ${fmtDate(obj.exported_at)} (${esc(counts)}). Il ripristino sostituisce tutti i dati attuali.</p><button class="danger" id="dorestore">Sostituisci i dati</button></div>`;
    $("#dorestore").onclick = async () => {
      try {
        await restoreData(obj);
      } catch (err) {
        $("#restore").innerHTML = `<div class="panel err"><p style="margin:0">Ripristino non riuscito: ${esc(err.message)}. I dati precedenti sono rimasti intatti.</p></div>`;
        return;
      }
      await updateBadge(); toast("Dati ripristinati."); location.hash = "#/home";
    };
  };
}

async function screenBooks() {
  view.innerHTML = `<h2>Libri ed errata</h2>
    <p class="small muted">Una chiave o un modello vale solo su pagine verificate e senza errata pertinente.</p>
    <table><thead><tr><th>Riferimento</th><th>Stato</th></tr></thead><tbody>
    ${BOOK_REFS.map((b) => `<tr><td><strong>${esc(b.book)}</strong> p. ${esc(b.pages)}${b.unit ? ` (unità ${esc(b.unit)})` : ""}<br><span class="small muted">${esc(b.use_it)}</span></td><td><span class="tag ${b.page_status === "verified" ? "ok" : "warn"}">${STATUS_LABELS[b.page_status]}</span><br><span class="tag ${b.reliability === "ok" ? "" : "err"}">${RELIABILITY_LABELS[b.reliability]}</span></td></tr>`).join("")}
    </tbody></table>
    <h3>Errata</h3>
    ${ERRATA.map((e) => `<div class="fix"><span class="small muted">${e.id} · ${esc(e.book)} p. ${esc(e.pages)} · gravità ${e.severity}</span><span class="was" style="display:block">${esc(e.quote)}</span><span class="now">${esc(e.fix)}</span></div>`).join("")}
    <h3>Osservazioni</h3>
    ${OBSERVATIONS.map((o) => `<div class="fix"><span class="small muted">${o.id} · ${esc(o.book)} p. ${esc(o.pages)}</span><div>${esc(o.passage)}</div><div class="why">${esc(o.assessment)}</div></div>`).join("")}`;
}

const LAB_TESTS = [
  { id: "t1", title: "La web app avvia un Comando Rapido", how: "Crea in Comandi Rapidi un comando \"JFLT-Tutor\", poi tocca il pulsante qui sotto.", action: "shortcut" },
  { id: "t2", title: "Il Comando riceve il testo integro", how: "Nel Comando, mostra il testo ricevuto: deve arrivare intero (circa 4.000 caratteri).", action: "shortcut-long" },
  { id: "t3", title: "L'app legge gli appunti al ritorno", how: "Copia un testo qualsiasi e tocca il pulsante.", action: "clipboard" },
  { id: "t4", title: "Il Comando riporta all'app", how: "Aggiungi in fondo al Comando l'azione Apri URL con l'indirizzo dell'app." },
  { id: "t5", title: "I modelli restituiscono JSON valido", how: "Su 10 richieste per motore (ChatGPT, On-Device, Cloud), almeno 9 risposte importate senza errori." },
  { id: "t6", title: "I dati restano salvati per 30 giorni", how: "Automatico: non blocca l'uso. Il backup settimanale resta comunque necessario.", auto: "persist" },
  { id: "t7", title: "I campi di scrittura non correggono da soli", how: "Scrivi \"teh\" in una stesura: non deve diventare \"the\"." },
  { id: "t8", title: "L'app funziona offline", how: "Attiva la modalità aereo, chiudi l'app e riaprila dalla Home.", auto: "offline" }
];

async function screenLab() {
  const s = await getSettings();
  const results = Object.fromEntries((await all("device_tests")).map((t) => [t.id, t]));
  const first = new Date(s.first_run);
  const due = new Date(first.getTime() + 30 * 864e5);
  const persistLine = Date.now() >= due.getTime()
    ? "Superato: i dati del primo avvio sono ancora presenti dopo 30 giorni."
    : `In corso dal ${fmtDate(s.first_run)}: esito il ${fmtDate(due.toISOString())}. Persistenza richiesta al sistema: ${s.persist === true ? "concessa" : s.persist === false ? "non concessa" : "non disponibile"}.`;
  const swReady = !!navigator.serviceWorker?.controller;
  view.innerHTML = `<h2>Laboratorio dispositivo</h2>
    <p class="muted">Prove da fare sull'iPhone. Nessuna blocca l'uso dell'app: le funzioni non verificate restano spente o con il percorso manuale.</p>
    ${LAB_TESTS.map((t) => {
      const r = results[t.id];
      const auto = t.auto === "persist" ? persistLine : t.auto === "offline" ? (swReady ? "Cache pronta: prova in modalità aereo." : "Cache non ancora attiva: riapri l'app una volta online.") : "";
      return `<section class="panel"><p style="margin:0"><strong>${esc(t.title)}</strong> ${r ? `<span class="tag ${r.status === "pass" ? "ok" : "err"}">${r.status === "pass" ? "superato" : "non superato"}</span>` : ""}</p>
        <p class="small" style="margin:6px 0">${esc(t.how)}</p>${auto ? `<p class="small muted">${esc(auto)}</p>` : ""}
        <div class="row">${t.action === "shortcut" ? `<a class="btn ghost" href="shortcuts://run-shortcut?name=JFLT-Tutor&input=text&text=${encodeURIComponent("prova JFLT Coach")}">Avvia il Comando</a>` : ""}
        ${t.action === "shortcut-long" ? `<a class="btn ghost" href="shortcuts://run-shortcut?name=JFLT-Tutor&input=text&text=${encodeURIComponent("x".repeat(3990) + "FINE")}">Invia 4.000 caratteri</a>` : ""}
        ${t.action === "clipboard" ? `<button class="ghost" data-clip>Leggi gli appunti</button>` : ""}
        <button class="ghost" data-res="${t.id}" data-v="pass">Superato</button><button class="ghost" data-res="${t.id}" data-v="fail">Non superato</button></div></section>`;
    }).join("")}`;
  $$("[data-res]").forEach((b) => (b.onclick = async () => { await put("device_tests", { id: b.dataset.res, status: b.dataset.v, date: new Date().toISOString() }); render(); }));
  $("[data-clip]")?.addEventListener("click", async () => {
    try { const t = await navigator.clipboard.readText(); toast(`Letti ${t.length} caratteri dagli appunti.`); } catch { toast("Lettura non consentita: usa l'incolla manuale."); }
  });
}

/* ================================================================== */
/* Router                                                              */
/* ================================================================== */

async function render() {
  await studio.flush();
  clearTimers();
  const hash = location.hash.replace(/^#\/?/, "") || "home";
  const [a, b] = hash.split("/");
  view.dataset.screen = a;
  const tab = { home: "home", placement:"learn", diag: "learn", learn:"learn", tenses:"learn", lesson:"learn", practice:"learn", lexicon:"lexicon", review:"learn", progress:"learn", week:"learn",articles:"learn",guided:"write",connect:"more",task: "write", write: "write", grammar: "home", requests: "more", req: "more", import: "more", more: "more", books: "more", lab: "more" }[a] || "home";
  document.querySelectorAll("nav.tabs a").forEach((x) => (x.dataset.tab === tab ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current")));
  try {
    if (await studio.render(hash)) {}
    else if (a === "home") await screenHome();
    else if (a === "diag" && !b) await screenDiag();
    else if (a === "diag" && (b === "D1" || b === "D2")) await screenDiagItems(b);
    else if (a === "diag" && (b === "D3" || b === "D4")) await screenDiagText(b);
    else if (a === "diag" && b === "D5") await screenProfile();
    else if (a === "diag" && b === "D6") { location.hash = "#/task/D4"; return; }
    else if (a === "grammar" && b === "new") await screenGrammarNew(hash.split("/")[2] === "recovery");
    else if (a === "grammar") await screenGrammarSet(b);
    else if (a === "write" && b === "new") await screenWriteNew();
    else if (a === "write") await screenWriteList();
    else if (a === "task") await screenTask(b);
    else if (a === "requests") await screenRequests();
    else if (a === "req") await screenRequest(b);
    else if (a === "import") await screenImport();
    else if (a === "more") await screenMore();
    else if (a === "books") await screenBooks();
    else if (a === "lab") await screenLab();
    else await screenHome();
  } catch (e) {
    console.error(e);
    view.innerHTML = `<div class="panel err"><p>Si è verificato un errore: ${esc(e.message)}</p><p class="small">I dati salvati non sono stati toccati. Torna a <a href="#/home">Oggi</a>.</p></div>`;
  }
  window.scrollTo(0, 0);
}

async function boot() {
  await openDb();
  const s = await getSettings();
  if (memory) toast("Archiviazione non disponibile: i dati non verranno salvati. Esporta prima di chiudere.");
  if (s.persist == null && navigator.storage?.persist) {
    // richiesta non bloccante; l'esito viene solo registrato
    navigator.storage.persist().then(async (granted) => { const f = await getSettings(); f.persist = granted; await saveSettings(f); }).catch(() => {});
  }
  updateNet();
  addEventListener("online", () => { updateNet(); if (/requests|req\//.test(location.hash)) render(); });
  addEventListener("offline", () => { updateNet(); if (/requests|req\//.test(location.hash)) render(); });
  addEventListener("hashchange", render);
  await updateBadge();
  await render();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    let ready=false;
    navigator.serviceWorker.addEventListener("controllerchange",()=>{if(ready)toast("Aggiornamento pronto. Riapri l'app dopo aver salvato il lavoro.");ready=true;});
    navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(r=>r.update()).catch(()=>{});
  }
}

if (new URLSearchParams(location.search).has("selftest")) window.__jflt = { restoreData, all, get, put };

boot();
