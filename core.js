// JFLT Coach — logica pura, senza DOM né IndexedDB (testabile in Node).
import { SCHEMA, AREAS, CAPABILITIES } from "./schema.js";
import { validateLearningState } from "./learning.js";

export const APP_VERSION = "0.2.3";
export const BACKUP_FORMAT = "jflt-coach-backup/v1";

/* ------------------------------------------------------------------ */
/* Utilità                                                             */
/* ------------------------------------------------------------------ */

export function todayISO(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function makeRequestId(d = new Date(), rnd = Math.random) {
  const s = todayISO(d).replaceAll("-", "");
  let tail = "";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) tail += chars[Math.floor(rnd() * chars.length)];
  return `r-${s}-${tail}`;
}

export function makeId(prefix, rnd = Math.random) {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(rnd() * 1e6).toString(36)}`;
}

export function wordCount(text) {
  const m = String(text || "").trim().match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g);
  return m ? m.length : 0;
}

// Normalizzazione per il confronto delle risposte: minuscole, apostrofi dritti,
// solo lettere/cifre/apostrofi, spazi singoli.
export function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9à-ÿ'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Normalizzazione rigorosa per decidere che una risposta è esatta:
// conserva la punteggiatura interna (virgole, punto e virgola, due punti),
// rende equivalenti le forme contratte e rende facoltativo il segno finale.
const CONTRACTIONS = [
  [/\bcan't\b/g, "cannot"], [/\bcan not\b/g, "cannot"], [/\bwon't\b/g, "will not"], [/\bshan't\b/g, "shall not"],
  [/\b([a-z]+)n't\b/g, "$1 not"], [/\b([a-z]+)'ve\b/g, "$1 have"], [/\b([a-z]+)'ll\b/g, "$1 will"],
  [/\b([a-z]+)'re\b/g, "$1 are"], [/\bi'm\b/g, "i am"]
];
export function normalizeStrict(s) {
  let t = String(s ?? "")
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  t = t.replace(/\s+([,;:.!?])/g, "$1").replace(/([,;:])(?=\S)/g, "$1 ");
  t = t.replace(/[.!?]+$/, "").trim();
  return t.replace(/\s+/g, " ");
}

/* ------------------------------------------------------------------ */
/* Validatore JSON Schema (sottoinsieme usato da schema.js)            */
/* ------------------------------------------------------------------ */

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (Number.isInteger(v)) return "integer";
  return typeof v;
}

function typeMatches(v, t) {
  const actual = typeOf(v);
  if (t === "number") return actual === "number" || actual === "integer";
  return actual === t;
}

function resolveRef(ref, root) {
  if (!ref.startsWith("#/")) throw new Error(`Riferimento non supportato: ${ref}`);
  return ref.slice(2).split("/").reduce((o, k) => o[k], root);
}

export function validateAgainst(schema, value, root = schema, path = "$", errors = []) {
  if (schema.$ref) return validateAgainst(resolveRef(schema.$ref, root), value, root, path, errors);

  if (schema.anyOf) {
    const ok = schema.anyOf.some((s) => validateAgainst(s, value, root, path, []).length === 0);
    if (!ok) errors.push(`${path}: nessuna delle forme ammesse corrisponde`);
  }
  if (schema.allOf) {
    for (const s of schema.allOf) {
      if (s.if) {
        if (validateAgainst(s.if, value, root, path, []).length === 0 && s.then) {
          validateAgainst(s.then, value, root, path, errors);
        }
      } else validateAgainst(s, value, root, path, errors);
    }
  }
  if ("const" in schema && value !== schema.const) {
    errors.push(`${path}: deve valere ${JSON.stringify(schema.const)}`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path}: valore ${JSON.stringify(value)} non ammesso (ammessi: ${schema.enum.join(", ")})`);
    return errors;
  }
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeMatches(value, t))) {
      errors.push(`${path}: atteso ${types.join(" o ")}, trovato ${typeOf(value)}`);
      return errors;
    }
  }
  if (typeof value === "string") {
    if (schema.minLength != null && value.trim().length < schema.minLength) errors.push(`${path}: testo vuoto o troppo corto`);
    if (schema.maxLength != null && value.length > schema.maxLength) errors.push(`${path}: testo oltre ${schema.maxLength} caratteri`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: formato non valido (${JSON.stringify(value)})`);
  }
  if (typeof value === "number") {
    if (schema.minimum != null && value < schema.minimum) errors.push(`${path}: minimo ${schema.minimum}`);
    if (schema.maximum != null && value > schema.maximum) errors.push(`${path}: massimo ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems != null && value.length < schema.minItems) errors.push(`${path}: servono almeno ${schema.minItems} elementi (trovati ${value.length})`);
    if (schema.maxItems != null && value.length > schema.maxItems) errors.push(`${path}: al massimo ${schema.maxItems} elementi (trovati ${value.length})`);
    if (schema.items) value.forEach((v, i) => validateAgainst(schema.items, v, root, `${path}[${i}]`, errors));
  }
  if (typeOf(value) === "object") {
    for (const k of schema.required || []) if (!(k in value)) errors.push(`${path}: manca il campo "${k}"`);
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(value)) {
      if (props[k]) validateAgainst(props[k], v, root, `${path}.${k}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}: campo non previsto "${k}"`);
    }
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/* Estrazione del JSON incollato                                       */
/* ------------------------------------------------------------------ */

export function extractJson(text) {
  let t = String(text || "").trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Nel testo incollato non c'è un oggetto JSON.");
  const candidate = t.slice(start, end + 1).replace(/[“”]/g, '"');
  try {
    return JSON.parse(candidate);
  } catch (e) {
    throw new Error(`Il JSON non è leggibile: ${e.message}. Chiedi al Tutor di restituire solo il JSON.`);
  }
}

/* ------------------------------------------------------------------ */
/* Validazione completa di una risposta (schema + regole di senso)     */
/* ------------------------------------------------------------------ */

const WORD_RANGES = { note: [50, 100], report_letter: [150, 250], essay: [250, 500] };

export function validateResponse(obj, request) {
  const errors = validateAgainst(SCHEMA, obj);
  if (errors.length) return { ok: false, errors };
  const sem = [];
  if (request) {
    if (obj.request_id !== request.request_id) sem.push(`request_id "${obj.request_id}" diverso da quello della richiesta "${request.request_id}"`);
    if (obj.mode !== request.mode) sem.push(`mode "${obj.mode}" diverso da quello della richiesta "${request.mode}"`);
  }
  const p = obj.payload;
  const systematicQuotes = new Set();
  const collectErrors = (list) => list.forEach((e) => { if (e.systematic) systematicQuotes.add(e.quote); });

  switch (obj.mode) {
    case "DIAG_ITEMS": {
      const ids = new Set();
      p.items.forEach((it, i) => {
        if (ids.has(it.id)) sem.push(`items[${i}]: id ripetuto ${it.id}`);
        ids.add(it.id);
        if (it.type === "error_correction" && it.already_correct === null) sem.push(`items[${i}]: per error_correction already_correct deve essere true o false`);
        if (it.type !== "error_correction" && it.already_correct !== null) sem.push(`items[${i}]: already_correct deve essere null se il tipo non è error_correction`);
        if (!it.accept.map(normalize).includes(normalize(it.answer))) sem.push(`items[${i}]: answer deve comparire anche in accept`);
      });
      break;
    }
    case "DIAG_EVAL": {
      const ids = p.texts.map((t) => t.text_id).sort().join(",");
      if (ids !== "D3,D4") sem.push("texts: servono una valutazione per D3 e una per D4");
      p.texts.forEach((t) => collectErrors(t.errors));
      if (request?.data?.texts) {
        p.texts.forEach((t) => {
          const src = request.data.texts.find((x) => x.text_id === t.text_id);
          if (!src) return;
          const norm = normalize(src.text);
          t.errors.forEach((e, i) => { if (!norm.includes(normalize(e.quote))) sem.push(`${t.text_id}.errors[${i}].quote non si trova nel testo inviato: "${e.quote}"`); });
        });
      }
      checkPriorities(p.priorities, sem);
      if (p.stanag_estimate.confidence === "high") sem.push("stanag_estimate.confidence: con due soli testi la fiducia è al massimo medium");
      if (request?.data?.diagnostic?.unclear_item_ids) {
        const allowed = new Set(request.data.diagnostic.unclear_item_ids);
        p.item_rulings.forEach((r, i) => { if (!allowed.has(r.item_id)) sem.push(`item_rulings[${i}]: ${r.item_id} non era tra le risposte da valutare`); });
        const ruled = new Set(p.item_rulings.map((r) => r.item_id));
        for (const idv of allowed) if (!ruled.has(idv)) sem.push(`item_rulings: manca il giudizio sulla risposta ${idv}`);
      }
      break;
    }
    case "GRAMMAR": {
      if (request?.data?.tool && p.tool !== request.data.tool) sem.push(`tool "${p.tool}" diverso da quello richiesto "${request.data.tool}"`);
      if (p.purpose === "check" && p.items.length !== 10) sem.push("una verifica (purpose: check) deve avere 10 item");
      const ids = new Set();
      p.items.forEach((it, i) => {
        if (ids.has(it.id)) sem.push(`items[${i}]: id ripetuto ${it.id}`);
        ids.add(it.id);
        if (!it.accept.map(normalize).includes(normalize(it.answer))) sem.push(`items[${i}]: answer deve comparire anche in accept`);
      });
      break;
    }
    case "WRITE_PLAN": {
      const t = p.task;
      const [min, max] = t.words;
      const ref = WORD_RANGES[t.text_type];
      if (min !== ref[0] || max !== ref[1]) sem.push(`task.words: per ${t.text_type} la lunghezza è ${ref[0]}-${ref[1]} parole (tipo di testo JFLT)`);
      const need = max > 250 ? 2 : 1;
      if (t.draft_sessions !== need) sem.push(`task.draft_sessions: per un testo fino a ${max} parole servono ${need} sessioni di stesura`);
      if (wordCount(p.model_excerpt_en) > 120) sem.push("model_excerpt_en: il modello breve non deve superare 120 parole");
      break;
    }
    case "WRITE_FEEDBACK": {
      collectErrors(p.errors);
      if (p.stanag_estimate.confidence === "high") sem.push("stanag_estimate.confidence: su un solo testo la fiducia è al massimo medium");
      if (request?.data?.text_id && p.text_id !== request.data.text_id) sem.push(`text_id "${p.text_id}" diverso da quello inviato "${request.data.text_id}"`);
      if (request?.data?.transfer_tool) {
        if (!p.transfer) sem.push(`transfer: era richiesta la verifica del trasferimento per "${request.data.transfer_tool}"`);
        else if (p.transfer.tool !== request.data.transfer_tool) sem.push(`transfer.tool diverso da "${request.data.transfer_tool}"`);
      } else if (p.transfer) sem.push("transfer: non era richiesta alcuna verifica del trasferimento (deve essere null)");
      if (request?.data?.text) {
        const norm = normalize(request.data.text);
        p.errors.forEach((e, i) => { if (!norm.includes(normalize(e.quote))) sem.push(`errors[${i}].quote non si trova nel testo inviato: "${e.quote}"`); });
        p.alternatives.forEach((a, i) => { if (!norm.includes(normalize(a.quote))) sem.push(`alternatives[${i}].quote non si trova nel testo inviato: "${a.quote}"`); });
        if (p.transfer) checkOccurrences(p.transfer.occurrences, request.data.text, "transfer.occurrences", sem);
      }
      break;
    }
    case "WRITE_MODEL": {
      if (request && request.data && !request.data.rewrite_text) sem.push("il modello si chiede solo dopo la riscrittura");
      if (request?.data?.text_id && p.text_id !== request.data.text_id) sem.push(`text_id "${p.text_id}" diverso da quello inviato`);
      break;
    }
    case "CHECK_TRANSFER": {
      if (request?.data?.tool && p.transfer.tool !== request.data.tool) sem.push(`transfer.tool diverso da "${request.data.tool}"`);
      if (request?.data?.text) checkOccurrences(p.transfer.occurrences, request.data.text, "transfer.occurrences", sem);
      break;
    }
    case "WEEK_PLAN": {
      const days = p.sessions.map((s) => s.day).join(",");
      if (days !== "mon,tue,wed,thu,fri,sat") sem.push("sessions: servono 6 sessioni, da lunedì a sabato, in ordine");
      p.sessions.forEach((s, i) => { if (s.kind === "grammar" && !s.tool) sem.push(`sessions[${i}]: una sessione di grammatica deve indicare tool`); });
      break;
    }
  }

  // Le flashcard proposte possono nascere solo da errori sistematici.
  if (obj.card_candidates.length) {
    if (!["DIAG_EVAL", "WRITE_FEEDBACK"].includes(obj.mode)) sem.push(`card_candidates: in ${obj.mode} deve essere vuoto`);
    else obj.card_candidates.forEach((c, i) => {
      if (!systematicQuotes.has(c.source_quote)) sem.push(`card_candidates[${i}]: source_quote deve coincidere con un errore marcato systematic: true`);
    });
  }
  return sem.length ? { ok: false, errors: sem } : { ok: true, errors: [] };
}

function checkOccurrences(occurrences, text, path, sem) {
  const { dropped } = distinctOccurrences(occurrences, text);
  for (const d of dropped) {
    const i = occurrences.indexOf(occurrences.find((o) => o.quote === d.quote && o.correct === d.correct && o.note_it === d.note_it));
    sem.push(d.reason === "not_found"
      ? `${path}: "${d.quote}" non si trova nel testo inviato`
      : `${path}: "${d.quote}" è citata più volte di quante compaia nel testo, o si sovrappone a un'altra occorrenza (posizione ${i})`);
  }
}

function checkPriorities(list, sem) {
  const ranks = list.map((p) => p.rank);
  if (new Set(ranks).size !== ranks.length) sem.push("priorities: rank ripetuti");
  list.forEach((p, i) => {
    if (p.kind === "grammar_tool" && (!p.tool || p.criterion)) sem.push(`priorities[${i}]: grammar_tool richiede tool e criterion null`);
    if (p.kind === "writing_criterion" && (!p.criterion || p.tool)) sem.push(`priorities[${i}]: writing_criterion richiede criterion e tool null`);
  });
}

/* ------------------------------------------------------------------ */
/* Diagnostico: punteggio degli item                                   */
/* ------------------------------------------------------------------ */

// item: {type, already_correct, stem, accept[], exclude?[]}
// response: {text, marked_correct}
// Esito: "correct" solo per corrispondenza esatta (normalizzazione rigorosa) con una
// soluzione accettata; "wrong" per risposta vuota, frase ricopiata o errore noto
// (frammento in exclude); in tutti gli altri casi "unclear", da far giudicare al Tutor.
export function scoreItem(item, response) {
  const marked = !!response?.marked_correct;
  const ans = normalizeStrict(response?.text);
  const stem = normalizeStrict(item.stem);
  if (item.type === "error_correction") {
    if (item.already_correct) {
      if (marked || ans === stem) return "correct";
      return ans ? "unclear" : "wrong";
    }
    if (marked) return "wrong";
  }
  if (!ans) return "wrong";
  if ((item.accept || []).some((a) => normalizeStrict(a) === ans)) return "correct";
  if (ans === stem) return "wrong"; // frase ricopiata senza modifiche
  const loose = normalize(ans);
  if ((item.exclude || []).some((frag) => loose.includes(normalize(frag)))) return "wrong";
  return "unclear";
}

// Statistiche per area: combina punteggio automatico e giudizi del Tutor.
export function areaStats(items, responses, rulings = {}) {
  const stats = Object.fromEntries(AREAS.map((a) => [a, { total: 0, correct: 0, wrong: 0, unclear: 0, wrong_sure: 0, wrong_unsure: 0, right_unsure: 0 }]));
  for (const it of items) {
    const r = responses[it.id] || {};
    let res = r.score || scoreItem(it, r);
    if (res === "unclear" && it.id in rulings) res = rulings[it.id] ? "correct" : "wrong";
    const s = stats[it.area];
    s.total++;
    s[res]++;
    const unsure = r.confidence === "unsure";
    if (res === "wrong") unsure ? s.wrong_unsure++ : s.wrong_sure++;
    if (res === "correct" && unsure) s.right_unsure++;
  }
  for (const s of Object.values(stats)) s.pct = s.total ? Math.round((s.correct / s.total) * 100) : null;
  return stats;
}

/* ------------------------------------------------------------------ */
/* Trasferimento: esito di una verifica e stato dello strumento        */
/* ------------------------------------------------------------------ */

// Abbina ogni occorrenza citata a un punto diverso del testo: la stessa frase citata
// due volte conta una sola volta se nel testo compare una sola volta; citazioni che
// si sovrappongono a un'occorrenza già contata non contano.
export function distinctOccurrences(occurrences, text) {
  const t = normalize(text);
  const used = [];
  const kept = [];
  const dropped = [];
  for (const o of occurrences) {
    const q = normalize(o.quote);
    const spans = [];
    if (q) for (let i = t.indexOf(q); i >= 0; i = t.indexOf(q, i + 1)) spans.push([i, i + q.length]);
    const free = spans.find(([a, b]) => used.every(([c, d]) => b <= c || a >= d));
    if (free) { used.push(free); kept.push(o); }
    else dropped.push({ ...o, reason: spans.length ? "duplicate" : "not_found" });
  }
  return { kept, dropped };
}

// Esito calcolato dall'app dalle occorrenze giudicate dal Tutor
// (il Tutor non decide l'esito). Con il testo, contano solo le occorrenze distinte.
export function transferVerdict(occurrences, text = null) {
  const all = occurrences;
  if (text != null) occurrences = distinctOccurrences(occurrences, text).kept;
  const n = occurrences.length;
  const correct = occurrences.filter((o) => o.correct).length;
  const wrong = n - correct;
  let verdict;
  if (n === 0) verdict = "insufficient_data";
  else if (n === 1) verdict = correct ? "partial" : "single_error";
  else if (wrong === 0) verdict = "confirmed";
  else if (correct >= wrong) verdict = "mixed";
  else verdict = "not_acquired";
  return { verdict, n, correct, wrong, ignored: all.length - n };
}

export const VERDICT_LABELS = {
  insufficient_data: "Dati insufficienti: la struttura non compare. Verifica aperta, non conta come insuccesso.",
  partial: "Un solo uso, corretto: dati parziali. Verifica aperta.",
  single_error: "Un solo uso, sbagliato: segnale da approfondire. Verifica aperta, con un breve recupero mirato.",
  confirmed: "Almeno due usi, tutti corretti: trasferimento confermato.",
  mixed: "Usi corretti e sbagliati, con i corretti almeno pari agli errori: verifica aperta. Due esiti deboli di fila riportano lo strumento in esercitazione.",
  not_acquired: "Errori più numerosi degli usi corretti: lo strumento torna in esercitazione."
};

// Stato dello strumento dalla sequenza degli esiti (dal più vecchio al più recente).
// Esiti "deboli": single_error e mixed. Due deboli consecutivi -> back_to_practice.
// partial azzera la serie; insufficient_data non la modifica.
export function transferStatus(verdicts) {
  let status = "open";
  let weakStreak = 0;
  for (const v of verdicts) {
    if (v === "confirmed") { status = "transferred"; weakStreak = 0; }
    else if (v === "not_acquired") { status = "back_to_practice"; weakStreak = 0; }
    else if (v === "single_error" || v === "mixed") {
      weakStreak++;
      status = weakStreak >= 2 ? "back_to_practice" : "open";
      if (weakStreak >= 2) weakStreak = 0;
    } else if (v === "partial") { weakStreak = 0; if (status !== "transferred") status = "open"; }
    // insufficient_data: nessun cambiamento
  }
  return status;
}

// Recupero: lo strumento è tornato in esercitazione e dopo l'ultima verifica del
// trasferimento non è stata completata nessuna serie di esercizi su quello strumento.
export function recoveryNeeded(checks, sets, tool) {
  if (!tool) return false;
  const seq = checks.filter((c) => c.tool === tool).sort((a, b) => a.date.localeCompare(b.date));
  if (!seq.length || transferStatus(seq.map((c) => c.verdict)) !== "back_to_practice") return false;
  const last = seq[seq.length - 1].date;
  return !sets.some((g) => g.tool === tool && g.status === "done" && (g.score?.date || "") > last);
}

// Criterio esercizi: almeno 9/10 in due verifiche distanziate di almeno 7 giorni.
export function exerciseCriterionMet(checks) {
  const passed = checks.filter((c) => c.total === 10 && c.correct >= 9).map((c) => new Date(c.date).getTime()).sort((a, b) => a - b);
  for (let i = 0; i < passed.length; i++)
    for (let j = i + 1; j < passed.length; j++)
      if (passed[j] - passed[i] >= 7 * 864e5) return true;
  return false;
}

/* ------------------------------------------------------------------ */
/* Priorità e piano iniziale                                           */
/* ------------------------------------------------------------------ */

export function focusToolFromProfile(profile, stats) {
  const p = (profile?.priorities || []).slice().sort((a, b) => a.rank - b.rank).find((x) => x.kind === "grammar_tool");
  if (p) return p.tool;
  let best = null;
  for (const [area, s] of Object.entries(stats || {})) {
    if (!s.total) continue;
    const score = s.correct / s.total - s.wrong_sure * 0.01;
    if (!best || score < best.score) best = { area, score };
  }
  return best ? best.area : "tenses";
}

export const WEEK_TEMPLATE = [
  { day: "mon", kind: "grammar" },
  { day: "tue", kind: "write_plan" },
  { day: "wed", kind: "grammar" },
  { day: "thu", kind: "write_draft" },
  { day: "fri", kind: "grammar_review" },
  { day: "sat", kind: "write_revise" },
  { day: "sun", kind: "rest" }
];

/* ------------------------------------------------------------------ */
/* Errata e osservazioni pertinenti                                    */
/* ------------------------------------------------------------------ */

export function pertinent(list, contextTags) {
  const tags = new Set(contextTags.filter(Boolean));
  return list.filter((e) => (e.tags || []).some((t) => tags.has(t)));
}

export function contextTags({ tool, capability, bookRefs = [] }) {
  return [tool, capability, ...bookRefs.map((b) => b.ref_id)];
}

/* ------------------------------------------------------------------ */
/* Messaggio per il Tutor                                              */
/* ------------------------------------------------------------------ */

export function buildMessage(request, { tutorPrompt, includeInstructions = true } = {}) {
  const head = includeInstructions && tutorPrompt ? `${tutorPrompt.trim()}\n\n=== RICHIESTA ===\n` : "";
  return `${head}MODE: ${request.mode}\nREQUEST_ID: ${request.request_id}\nDATE: ${request.date}\nDATA:\n${JSON.stringify(request.data, null, 2)}\n`;
}

/* ------------------------------------------------------------------ */
/* Backup                                                              */
/* ------------------------------------------------------------------ */

export const STORES = [
  "settings", "diag_responses", "diag_texts", "profile", "requests", "grammar_sets",
  "grammar_answers", "tasks", "texts", "feedback", "error_log", "cards",
  "transfer_checks", "device_tests", "to_verify"
];

// Gli archivi salvano i payload del Tutor insieme a metadati locali. Riutilizziamo
// i loro schemi e controlliamo anche i record creati dall'app, senza richiedere
// una consegna quando il lavoro è ancora una bozza.
const backupText = { type: "string" };
const backupId = { type: "string", pattern: "^[A-Za-z0-9_.:-]{1,120}$", minLength: 1 };
const backupDate = { type: "string", pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]{1,3})?Z$", backupTimestamp: true };
const backupDay = { type: "string", pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$", backupTimestamp: true };
const backupBool = { type: "boolean" };
const backupCount = { type: "integer", minimum: 0 };
const nullable = (s) => ({ anyOf: [s, { type: "null" }] });
const backupObject = (required, properties) => ({ type: "object", required, properties, additionalProperties: true });
const backupArray = (items) => ({ type: "array", items });
const storedPayload = (name, required, properties) => {
  const s = SCHEMA.$defs[name];
  return backupObject([...s.required, ...required], { ...s.properties, id: backupId, ...properties });
};
const backupVerdict = backupObject(["verdict", "n", "correct", "wrong"], {
  verdict: { enum: Object.keys(VERDICT_LABELS) },
  n: { ...backupCount, maximum: 20 }, correct: { ...backupCount, maximum: 20 }, wrong: { ...backupCount, maximum: 20 },
  ignored: { ...backupCount, maximum: 20 }
});
const backupCards = { type: "array", maxItems: 6, items: { $ref: "#/$defs/Card" } };
const backupDiagState = backupObject([], {
  started_at: backupDate, submitted_at: backupDate, auto_submitted: backupBool,
  index: { type: "integer", minimum: 0, maximum: 19 }
});
const BACKUP_RECORD_SCHEMAS = {
  settings: backupObject(["id", "first_run", "include_instructions", "diag", "plan", "last_export", "persist"], {
    id: { const: "main" }, first_run: backupDate, include_instructions: backupBool,
    diag: { type: "object", additionalProperties: false, properties: Object.fromEntries(["D1", "D2", "D3", "D4", "D5", "D6"].map((k) => [k, backupDiagState])) },
    plan: nullable(backupObject(["focus_tool", "capability", "confirmed_at"], {
      focus_tool: { enum: AREAS }, capability: { enum: CAPABILITIES }, confirmed_at: backupDate
    })),
    last_export: nullable(backupDate), persist: nullable(backupBool), student_slp: backupText,
    week_plan: { $ref: "#/$defs/WEEK_PLAN" }, retest_items: SCHEMA.$defs.DIAG_ITEMS.properties.items
  }),
  diag_responses: backupObject(["id", "session", "text", "marked_correct", "confidence"], {
    id: { type: "string", pattern: "^D(0[1-9]|[1-3][0-9]|40)$" }, session: { enum: ["D1", "D2"] },
    text: backupText, marked_correct: backupBool, confidence: { enum: ["sure", "unsure", "unset"] },
    score: { enum: ["correct", "wrong", "unclear"] }
  }),
  diag_texts: backupObject(["id", "text"], {
    id: { enum: ["D3", "D4"] }, text: backupText, submitted_at: backupDate, minutes_used: { ...backupCount, maximum: 20 }
  }),
  profile: storedPayload("DIAG_EVAL", ["id", "rulings", "request_id", "imported_at"], {
    id: { const: "main" }, rulings: { type: "object" }, request_id: SCHEMA.properties.request_id, imported_at: backupDate
  }),
  requests: backupObject(["id", "request_id", "mode", "date", "created_at", "status", "data", "context"], {
    id: backupId, request_id: SCHEMA.properties.request_id, mode: SCHEMA.properties.mode, date: backupDay,
    created_at: backupDate, status: { enum: ["pending", "answered"] }, data: { type: "object" },
    context: backupObject(["key"], { key: backupId, task_id: backupId }), answered_at: backupDate, response: SCHEMA
  }),
  grammar_sets: storedPayload("GRAMMAR", ["id", "request_id", "status", "created_at"], {
    request_id: SCHEMA.properties.request_id, status: { enum: ["todo", "done"] }, created_at: backupDate,
    score: backupObject(["correct", "total", "stopped", "date"], {
      correct: backupCount, total: backupCount, stopped: backupBool, date: backupDate
    })
  }),
  grammar_answers: backupObject(["id", "set_id", "item_id", "text", "auto", "final", "date"], {
    id: backupId, set_id: backupId, item_id: backupId, text: backupText,
    auto: { enum: ["correct", "wrong", "unclear"] }, final: { enum: ["correct", "wrong", null] },
    date: backupDate, self_judged: backupBool
  }),
  tasks: storedPayload("WritingTask", ["model_excerpt_en", "observation_questions_it", "observations", "outline", "created_at", "request_id"], {
    model_excerpt_en: SCHEMA.$defs.WRITE_PLAN.properties.model_excerpt_en,
    observation_questions_it: SCHEMA.$defs.WRITE_PLAN.properties.observation_questions_it,
    observations: { type: "array", minItems: 3, maxItems: 3, items: backupText }, outline: backupText,
    created_at: backupDate, request_id: SCHEMA.properties.request_id, tutor_task_id: backupId
  }),
  texts: backupObject(["id", "task_id", "version", "text"], {
    id: backupId, task_id: backupId, version: { enum: ["draft", "rewrite"] }, text: backupText,
    submitted_at: backupDate, saved_at: backupDate,
    parts: backupArray(backupObject(["session", "started_at"], {
      session: { type: "integer", minimum: 1, maximum: 2 }, started_at: backupDate, ended_at: backupDate, words: backupCount
    }))
  }),
  feedback: {
    anyOf: [
      backupObject(["id", "kind", "task_id", "card_candidates", "date"], {
        id: backupId, kind: { const: "cards_offer" }, task_id: { const: "D5" }, card_candidates: backupCards,
        date: backupDate, decided: backupBool, kept: backupCount
      }),
      backupObject(["id", "kind", "task_id", "version", "payload", "transfer", "card_candidates", "date", "request_id"], {
        id: backupId, kind: { const: "feedback" }, task_id: backupId, version: { enum: ["draft", "rewrite"] },
        payload: { $ref: "#/$defs/WRITE_FEEDBACK" },
        transfer: nullable({ ...backupVerdict, required: [...backupVerdict.required, "tool"], properties: { ...backupVerdict.properties, tool: { enum: AREAS } } }),
        card_candidates: backupCards, date: backupDate, request_id: SCHEMA.properties.request_id, decided: backupBool, kept: backupCount
      }),
      backupObject(["id", "kind", "task_id", "payload", "date", "request_id"], {
        id: backupId, kind: { const: "model" }, task_id: backupId, payload: { $ref: "#/$defs/WRITE_MODEL" },
        date: backupDate, request_id: SCHEMA.properties.request_id
      })
    ]
  },
  error_log: storedPayload("ErrorEntry", ["id", "date", "source"], { date: backupDate, source: backupId }),
  cards: storedPayload("Card", ["id", "created_at", "source"], { created_at: backupDate, source: backupId }),
  transfer_checks: backupObject(["id", "tool", "text_id", "date", ...backupVerdict.required], {
    id: backupId, tool: { enum: AREAS }, text_id: backupId, date: backupDate, ...backupVerdict.properties,
    version: { enum: ["draft", "rewrite"] }
  }),
  device_tests: backupObject(["id", "status", "date"], { id: backupId, status: { enum: ["pass", "fail"] }, date: backupDate }),
  // Riservato: questa iterazione non legge il contenuto di questi record.
  to_verify: backupObject(["id"], { id: backupId })
};

function checkBackupDates(s, value, path, errors) {
  if (s.$ref) return checkBackupDates(resolveRef(s.$ref, SCHEMA), value, path, errors);
  if (s.backupTimestamp && typeof value === "string") {
    const d = new Date(value);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value.slice(0, 10)) errors.push(`${path}: data non valida`);
  }
  if (s.anyOf) {
    const branch = s.anyOf.find((b) => validateAgainst(b, value, SCHEMA).length === 0);
    if (branch) checkBackupDates(branch, value, path, errors);
  }
  if (Array.isArray(value) && s.items) value.forEach((v, i) => checkBackupDates(s.items, v, `${path}[${i}]`, errors));
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [k, child] of Object.entries(s.properties || {})) if (k in value) checkBackupDates(child, value[k], `${path}.${k}`, errors);
  }
}

function checkBackupLinks(stores, errors) {
  const requests = new Map(stores.requests.map((r) => [r.id, r]));
  const tasks = new Set(["D3", "D4", ...stores.tasks.map((r) => r.id)]);
  const sets = new Map(stores.grammar_sets.map((r) => [r.id, r]));
  const main = stores.settings[0];
  const bad = (where, issue) => errors.push(`${where}: ${issue}`);
  for (const store of ["profile", "grammar_sets", "tasks", "feedback"]) {
    for (const r of stores[store]) if (r.request_id && !requests.has(r.request_id)) bad(`${store}.${r.id}`, "richiesta originale mancante");
  }
  if (main.plan && !stores.profile.length) bad("settings.main.plan", "profilo diagnostico mancante");
  for (const p of stores.profile) {
    if (p.texts.map((t) => t.text_id).sort().join(",") !== "D3,D4") bad("profile.main.texts", "servono le valutazioni distinte di D3 e D4");
    const issues = []; checkPriorities(p.priorities, issues); issues.forEach((s) => bad("profile.main", s));
    for (const [id, correct] of Object.entries(p.rulings)) if (!/^D(0[1-9]|[1-3][0-9]|40)$/.test(id) || typeof correct !== "boolean") bad("profile.main.rulings", "giudizio non valido");
  }
  for (const r of stores.requests) {
    if (r.id !== r.request_id) bad(`requests.${r.id}`, "id e request_id non coincidono");
    if (r.status === "answered" && (!r.response || !r.answered_at)) bad(`requests.${r.id}`, "risposta o data di importazione mancanti");
    if (r.response && (r.response.request_id !== r.request_id || r.response.mode !== r.mode)) bad(`requests.${r.id}`, "risposta associata alla richiesta sbagliata");
    if (r.context.task_id && !tasks.has(r.context.task_id)) bad(`requests.${r.id}`, "compito mancante");
  }
  for (const r of stores.diag_responses) if (r.session !== (Number(r.id.slice(1)) <= 20 ? "D1" : "D2")) bad(`diag_responses.${r.id}`, "sessione errata");
  for (const g of stores.grammar_sets) {
    if (new Set(g.items.map((i) => i.id)).size !== g.items.length) bad(`grammar_sets.${g.id}`, "identificativi degli esercizi duplicati");
    if (g.items.some((i) => !i.accept.map(normalize).includes(normalize(i.answer)))) bad(`grammar_sets.${g.id}`, "soluzione assente dalle risposte accettate");
    if (g.status === "done" && !g.score) bad(`grammar_sets.${g.id}`, "punteggio della serie completata mancante");
    if (g.score && (g.score.correct > g.score.total || g.score.total > g.items.length)) bad(`grammar_sets.${g.id}.score`, "conteggi incoerenti");
  }
  for (const a of stores.grammar_answers) {
    if (!sets.get(a.set_id)?.items.some((i) => i.id === a.item_id)) bad(`grammar_answers.${a.id}`, "serie o esercizio mancante");
    if (a.id !== `${a.set_id}:${a.item_id}`) bad(`grammar_answers.${a.id}`, "identificativo incoerente");
  }
  for (const t of stores.tasks) {
    const words = WORD_RANGES[t.text_type];
    if (t.words[0] !== words[0] || t.words[1] !== words[1] || t.draft_sessions !== (words[1] > 250 ? 2 : 1)) bad(`tasks.${t.id}`, "lunghezza o numero di sessioni incoerenti");
  }
  for (const t of stores.texts) {
    if (!tasks.has(t.task_id)) bad(`texts.${t.id}`, "compito mancante");
    if (t.id !== `${t.task_id}:${t.version}`) bad(`texts.${t.id}`, "identificativo incoerente");
  }
  for (const f of stores.feedback) {
    if (f.kind !== "cards_offer" && (!tasks.has(f.task_id) || f.payload.text_id !== f.task_id)) bad(`feedback.${f.id}`, "compito mancante o non corrispondente");
    if (f.kind === "feedback" && f.version !== f.payload.version) bad(`feedback.${f.id}`, "versione del testo non corrispondente");
    if (f.kind !== "model" && f.kept != null && f.kept > f.card_candidates.length) bad(`feedback.${f.id}`, "conteggio delle flashcard incoerente");
  }
  for (const r of [...stores.transfer_checks, ...stores.feedback.filter((f) => f.transfer).map((f) => ({ id: f.id, ...f.transfer }))]) {
    if (r.n !== r.correct + r.wrong || transferVerdict(Array.from({ length: r.n }, (_, i) => ({ correct: i < r.correct }))).verdict !== r.verdict) bad(`transfer_checks.${r.id}`, "esito o conteggi incoerenti");
  }
  for (const r of stores.transfer_checks) if (!tasks.has(r.text_id)) bad(`transfer_checks.${r.id}`, "testo associato a un compito mancante");
  for (const r of stores.error_log) if (!tasks.has(r.source)) bad(`error_log.${r.id}`, "compito di origine mancante");
  for (const r of stores.cards) if (r.source !== "D5" && !tasks.has(r.source)) bad(`cards.${r.id}`, "compito di origine mancante");
}

export function validateBackup(obj) {
  const errors = [];
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return { ok: false, errors: ["il file non contiene un oggetto"] };
  if (obj.format !== BACKUP_FORMAT) errors.push(`formato non riconosciuto (atteso ${BACKUP_FORMAT})`);
  if (typeof obj.exported_at !== "string" || Number.isNaN(Date.parse(obj.exported_at))) errors.push("exported_at mancante o non valido");
  else {
    validateAgainst(backupDate, obj.exported_at, SCHEMA, "exported_at", errors);
    checkBackupDates(backupDate, obj.exported_at, "exported_at", errors);
  }
  if (typeof obj.app_version !== "string" || !/^[0-9]+\.[0-9]+\.[0-9]+(?:[-+][A-Za-z0-9.-]+)?$/.test(obj.app_version)) errors.push("app_version mancante o non valido");
  if (!obj.stores || typeof obj.stores !== "object" || Array.isArray(obj.stores)) {
    errors.push("manca stores");
    return { ok: false, errors };
  }
  for (const k of Object.keys(obj.stores)) if (!STORES.includes(k)) errors.push(`archivio sconosciuto: ${k}`);
  for (const k of STORES) {
    const rows = obj.stores[k];
    if (!(k in obj.stores)) { errors.push(`manca l'archivio ${k}: backup incompleto`); continue; }
    if (!Array.isArray(rows)) { errors.push(`${k}: atteso un elenco`); continue; }
    const ids = new Set();
    rows.forEach((r, i) => {
      if (!r || typeof r !== "object" || Array.isArray(r)) errors.push(`${k}[${i}]: non è un oggetto`);
      else if (typeof r.id !== "string" || !r.id) errors.push(`${k}[${i}]: manca id`);
      else if (ids.has(r.id)) errors.push(`${k}: id ripetuto ${r.id}`);
      else {
        ids.add(r.id);
        const schema = BACKUP_RECORD_SCHEMAS[k];
        validateAgainst(schema, r, SCHEMA, `${k}[${i}]`, errors);
        checkBackupDates(schema, r, `${k}[${i}]`, errors);
      }
    });
  }
  const main = Array.isArray(obj.stores.settings) && obj.stores.settings.find((r) => r && r.id === "main");
  if (!main) errors.push("settings: manca il record principale (main): backup incompleto");
  else if (typeof main.first_run !== "string" || typeof main.diag !== "object" || main.diag === null) errors.push("settings.main: campi first_run o diag mancanti");
  if(main?.learning)errors.push(...validateLearningState(main.learning,validateAgainst));
  if(main?.ai_endpoint){try{const u=new URL(main.ai_endpoint);if(u.protocol!=="https:"||!u.hostname.endsWith(".workers.dev")||u.username||u.password||u.search||u.hash)errors.push("Indirizzo del tutor non valido.");}catch{errors.push("Indirizzo del tutor non valido.");}}
  if(main&&(Object.hasOwn(main,"groq_api_key")||Object.hasOwn(main,"app_token")))errors.push("Il backup non deve contenere chiavi o codici segreti.");
  if (!errors.length) checkBackupLinks(obj.stores, errors);
  return { ok: errors.length === 0, errors };
}

export { AREAS, CAPABILITIES };
