// JFLT Coach — contenuti statici: diagnostico, consegne, riferimenti ai libri,
// errata, osservazioni e istruzioni del Tutor. Tutto disponibile offline.

export const AREA_LABELS = {
  tenses: "Tempi verbali", articles: "Articoli e determinanti", prepositions: "Preposizioni",
  connectors: "Connettivi", conditionals: "Periodo ipotetico", word_order: "Ordine delle parole",
  modals: "Modali", passive: "Passivo", relatives: "Relative", reported_speech: "Discorso indiretto",
  gerund_infinitive: "Gerundio o infinito", formal_register: "Registro formale"
};

export const CAPABILITY_LABELS = {
  A1: "Email funzionale", A2: "Narrazione", A3: "Descrizione e procedura",
  A4: "Rapporto fattuale breve", A5: "Confronto e raccomandazione",
  B1: "Rapporto analitico", B2: "Argomentazione", B3: "Ipotesi e scenari", B4: "Obiezioni e risposta"
};

export const CRITERION_LABELS = {
  comprehensibility: "Comprensibilità", task: "Rispetto della consegna",
  organisation: "Organizzazione e coesione", grammar: "Controllo grammaticale", lexis_register: "Lessico e registro"
};

export const TYPE_LABELS = {
  error_correction: "Correggi la frase (se è già corretta, spunta la casella)",
  transformation: "Riscrivi la frase come indicato",
  completion: "Completa con la forma giusta"
};

/* ------------------------------------------------------------------ */
/* Diagnostico: 40 frasi (D1 = 1-20, D2 = 21-40)                       */
/* 16 correzioni (4 già corrette), 16 trasformazioni, 8 completamenti  */
/* ------------------------------------------------------------------ */

const I = (n, session, area, stage, type, stem, extra) => ({
  id: `D${String(n).padStart(2, "0")}`, n, session, area, stage, type, stem,
  already_correct: type === "error_correction" ? false : null, accept: [], exclude: [], ...extra
});

// Tutte le combinazioni di parti alternative: V(["a","b"], " c") -> ["a c", "b c"]
const V = (...parts) => parts.reduce((acc, p) => {
  const opts = Array.isArray(p) ? p : [p];
  return acc.flatMap((a) => opts.map((o) => a + o));
}, [""]);

// "accept" elenca le risposte considerate esatte (forme contratte e segno finale
// sono già equivalenti); "exclude" elenca frammenti che rivelano l'errore tipico.
// Qualsiasi altra risposta va al Tutor come risposta da giudicare.
export const DIAG_ITEMS = [
  I(1, "D1", "tenses", "A", "error_correction", "I have seen him yesterday at the station.",
    { answer: "I saw him yesterday at the station.", accept: ["I saw him yesterday at the station.", "I saw him at the station yesterday.", "Yesterday I saw him at the station.", "Yesterday, I saw him at the station."], exclude: ["have seen", "'ve seen"] }),
  I(2, "D1", "articles", "A", "error_correction", "The patrol found a car abandoned near the river.",
    { already_correct: true, answer: "The patrol found a car abandoned near the river." }),
  I(3, "D1", "prepositions", "A", "completion", "The coordination meeting is ___ Monday morning.",
    { answer: "on", accept: ["on"] }),
  I(4, "D1", "connectors", "A", "transformation", "The road was icy. The driver did not slow down. (Although …)",
    { answer: "Although the road was icy, the driver did not slow down.",
      accept: ["Although the road was icy, the driver did not slow down.", "The driver did not slow down although the road was icy.", "The driver did not slow down, although the road was icy."] }),
  I(5, "D1", "conditionals", "B", "completion", "If I ___ (know) about the delay, I would have called you.",
    { answer: "had known", accept: ["had known", "'d known"] }),
  I(6, "D1", "word_order", "A", "error_correction", "Can you tell me where is the commander's office?",
    { answer: "Can you tell me where the commander's office is?", accept: ["Can you tell me where the commander's office is?"], exclude: ["where is the"] }),
  I(7, "D1", "modals", "A", "transformation", "It is not necessary for you to bring the documents. (need)",
    { answer: "You don't need to bring the documents.", accept: ["You don't need to bring the documents.", "You need not bring the documents.", "You don't need to bring the documents with you."] }),
  I(8, "D1", "passive", "A", "transformation", "Someone stole three cars from the car park last night. (Three cars …)",
    { answer: "Three cars were stolen from the car park last night.", accept: ["Three cars were stolen from the car park last night.", "Three cars were stolen last night from the car park."], exclude: ["three cars stole"] }),
  I(9, "D1", "relatives", "A", "transformation", "The officer filed a report. His car was damaged. (whose)",
    { answer: "The officer whose car was damaged filed a report.", accept: ["The officer whose car was damaged filed a report."], exclude: ["who's car", "whose his"] }),
  I(10, "D1", "tenses", "A", "transformation", "I started working here in 2019. (have … since)",
    { answer: "I have worked here since 2019.", accept: ["I have worked here since 2019.", "I have been working here since 2019."], exclude: ["have worked here from 2019", "have started"] }),
  I(11, "D1", "reported_speech", "A", "transformation", "\"I will send the report tomorrow,\" she said. (Riferito alcuni giorni dopo: She said …)",
    { answer: "She said she would send the report the next day.",
      accept: V(["She said", "She said that"], [" she would", " she'd"], " send the report ", ["the next day", "the following day", "the day after"], "."),
      exclude: ["she will send"] }),
  I(12, "D1", "articles", "A", "completion", "She works as ___ interpreter for the Ministry.",
    { answer: "an", accept: ["an"] }),
  I(13, "D1", "gerund_infinitive", "A", "error_correction", "We are looking forward to meet the new commander.",
    { answer: "We are looking forward to meeting the new commander.", accept: ["We are looking forward to meeting the new commander."], exclude: ["forward to meet the"] }),
  I(14, "D1", "prepositions", "A", "error_correction", "The investigation depends of the results of the analysis.",
    { answer: "The investigation depends on the results of the analysis.", accept: ["The investigation depends on the results of the analysis.", "The investigation depends upon the results of the analysis."], exclude: ["depends of"] }),
  I(15, "D1", "connectors", "A", "error_correction", "The evidence was weak; however, the case went to trial.",
    { already_correct: true, answer: "The evidence was weak; however, the case went to trial." }),
  I(16, "D1", "tenses", "A", "completion", "When I arrived, the meeting ___ (already / start).",
    { answer: "had already started", accept: ["had already started", "'d already started", "had started already"] }),
  I(17, "D1", "modals", "A", "error_correction", "You must to wear your uniform during the ceremony.",
    { answer: "You must wear your uniform during the ceremony.", accept: ["You must wear your uniform during the ceremony."], exclude: ["must to"] }),
  I(18, "D1", "formal_register", "B", "transformation", "The number of thefts increased sharply. (There was a …)",
    { answer: "There was a sharp increase in the number of thefts.", accept: ["There was a sharp increase in the number of thefts."] }),
  I(19, "D1", "conditionals", "B", "error_correction", "If the patrol would have arrived earlier, they would have caught the thief.",
    { answer: "If the patrol had arrived earlier, they would have caught the thief.",
      accept: V("If the patrol had arrived earlier, they ", ["would have", "'d have"], " caught the thief."), exclude: ["patrol would have arrived"] }),
  I(20, "D1", "passive", "B", "transformation", "People believe that the suspect has left the country. (The suspect is …)",
    { answer: "The suspect is believed to have left the country.", accept: ["The suspect is believed to have left the country."], exclude: ["is believed to has", "is believed that"] }),

  I(21, "D2", "tenses", "A", "error_correction", "I was knowing the answer, but I didn't say anything.",
    { answer: "I knew the answer, but I didn't say anything.", accept: ["I knew the answer, but I didn't say anything.", "I knew the answer but I didn't say anything."], exclude: ["was knowing"] }),
  I(22, "D2", "articles", "A", "error_correction", "The crime rate has fallen in the most European countries.",
    { answer: "The crime rate has fallen in most European countries.", accept: ["The crime rate has fallen in most European countries."], exclude: ["the most european"] }),
  I(23, "D2", "prepositions", "A", "completion", "She is responsible ___ training new staff.",
    { answer: "for", accept: ["for"] }),
  I(24, "D2", "connectors", "A", "error_correction", "The flight was cancelled because the bad weather.",
    { answer: "The flight was cancelled because of the bad weather.",
      accept: V("The flight was cancelled ", ["because of", "due to", "owing to"], " the bad weather."), exclude: ["because the bad weather"] }),
  I(25, "D2", "conditionals", "A", "transformation", "I don't have a car, so I can't drive you to the airport. (If …)",
    { answer: "If I had a car, I could drive you to the airport.",
      accept: [...V("If I had a car, I ", ["could", "would", "'d"], " drive you to the airport."), ...V("I ", ["could", "would", "'d"], " drive you to the airport if I had a car.")],
      exclude: ["if i would have a car", "if i have a car"] }),
  I(26, "D2", "word_order", "A", "transformation", "How long does the training last? (Do you know …)",
    { answer: "Do you know how long the training lasts?", accept: ["Do you know how long the training lasts?", "Do you know how long the training will last?"], exclude: ["how long does the training"] }),
  I(27, "D2", "modals", "B", "transformation", "I'm sure he forgot the meeting. (must)",
    { answer: "He must have forgotten the meeting.", accept: ["He must have forgotten the meeting.", "He must have forgotten about the meeting."], exclude: ["must forgot"] }),
  I(28, "D2", "passive", "A", "error_correction", "The report was wrote by the duty officer.",
    { answer: "The report was written by the duty officer.", accept: ["The report was written by the duty officer."], exclude: ["was wrote"] }),
  I(29, "D2", "relatives", "B", "error_correction", "Colonel Bianchi, who led the operation, will brief the press.",
    { already_correct: true, answer: "Colonel Bianchi, who led the operation, will brief the press." }),
  I(30, "D2", "tenses", "B", "completion", "By the end of next year, I ___ (complete) the officer course.",
    { answer: "will have completed", accept: ["will have completed", "'ll have completed"] }),
  I(31, "D2", "reported_speech", "B", "transformation", "\"Did you see the driver?\" the officer asked the witness. (The officer asked the witness …)",
    { answer: "The officer asked the witness if she had seen the driver.",
      accept: V("The officer asked the witness ", ["if", "whether"], [" she", " he", " they"], " had seen the driver."),
      exclude: ["did you see", "if did"] }),
  I(32, "D2", "prepositions", "A", "error_correction", "We arrived to Rome late at night.",
    { answer: "We arrived in Rome late at night.", accept: ["We arrived in Rome late at night."], exclude: ["arrived to"] }),
  I(33, "D2", "articles", "A", "completion", "___ police have closed the road to the airport.",
    { answer: "The", accept: ["the"] }),
  I(34, "D2", "connectors", "B", "transformation", "He apologised. He was still disciplined. (Despite …)",
    { answer: "Despite apologising, he was still disciplined.",
      accept: [...V(["Despite apologising", "Despite apologizing", "Despite having apologised", "Despite having apologized", "Despite his apology"], ", he was still disciplined."),
               ...V("He was still disciplined despite ", ["apologising", "apologizing", "having apologised", "having apologized", "his apology"], ".")],
      exclude: ["despite he apologised", "despite he apologized", "despite of"] }),
  I(35, "D2", "gerund_infinitive", "A", "completion", "The suspect refused ___ (answer) any questions.",
    { answer: "to answer", accept: ["to answer"] }),
  I(36, "D2", "conditionals", "B", "transformation", "I didn't study law, so I'm not a lawyer now. (If …)",
    { answer: "If I had studied law, I would be a lawyer now.",
      accept: V(["If I had studied law", "If I'd studied law"], ", I ", ["would", "'d"], " be a lawyer now."),
      exclude: ["if i would have studied"] }),
  I(37, "D2", "relatives", "A", "transformation", "This is the officer. I spoke to him yesterday. (who)",
    { answer: "This is the officer who I spoke to yesterday.",
      accept: V("This is the officer ", ["who I spoke to yesterday", "whom I spoke to yesterday", "that I spoke to yesterday", "I spoke to yesterday", "to whom I spoke yesterday"], "."),
      exclude: ["spoke to him yesterday"] }),
  I(38, "D2", "word_order", "B", "error_correction", "Rarely have we seen such a well-organised operation.",
    { already_correct: true, answer: "Rarely have we seen such a well-organised operation." }),
  I(39, "D2", "formal_register", "B", "transformation", "The commander decided to postpone the exercise, which surprised everyone. (The commander's decision …)",
    { answer: "The commander's decision to postpone the exercise surprised everyone.", accept: ["The commander's decision to postpone the exercise surprised everyone."] }),
  I(40, "D2", "tenses", "A", "error_correction", "This is the first time I visit NATO headquarters.",
    { answer: "This is the first time I have visited NATO headquarters.", accept: ["This is the first time I have visited NATO headquarters.", "This is the first time I have visited the NATO headquarters."], exclude: ["time i visit "] })
].map((it) => ({ ...it, accept: it.accept.length ? it.accept : [it.answer] }));

export const DIAG_SESSIONS = [
  { id: "D1", day: "Lunedì", label: "20 frasi", minutes: 18 },
  { id: "D2", day: "Martedì", label: "20 frasi", minutes: 18 },
  { id: "D3", day: "Mercoledì", label: "Email, 80-100 parole", minutes: 15, review: 2 },
  { id: "D4", day: "Giovedì", label: "Rapporto breve, 150-200 parole", minutes: 18, review: 2 },
  { id: "D5", day: "Venerdì", label: "Profilo e priorità", needsTutor: true },
  { id: "D6", day: "Sabato", label: "Riscrittura del rapporto D4" }
];

export const DIAG_TASKS = {
  D3: {
    id: "D3", text_type: "note", words: [80, 100],
    prompt_en: "You are the liaison officer at an Italian Carabinieri unit. Write an email to Major Collins at the allied headquarters. The coordination meeting planned for Thursday must be moved. Explain why, propose two alternative dates and times, and ask for confirmation. All names and details are fictional.",
    content_points: ["Reason for moving the meeting", "Two alternative dates and times", "Request for confirmation", "Appropriate opening and closing"]
  },
  D4: {
    id: "D4", text_type: "report_letter", words: [150, 200],
    prompt_en: "During a multinational training exercise, an incident occurred at the vehicle checkpoint you were responsible for. Write a short report for your commander: what happened, the actions taken, the outcome and one recommendation. All names and details are fictional.",
    content_points: ["What happened: when, where, who", "Actions taken", "Outcome", "One recommendation"]
  }
};

/* ------------------------------------------------------------------ */
/* Riferimenti ai libri (dalla mappatura del documento)                */
/* ------------------------------------------------------------------ */

const R = (ref_id, book, pages, capabilities, tools, page_status, reliability, use_it, unit = null) =>
  ({ id: ref_id, ref_id, book, unit, pages, capabilities, tools, page_status, reliability, use_it });

export const BOOK_REFS = [
  R("CAMP-98-99", "CAMPAIGN", "98-99", ["A1"], [], "verified", "ok", "Email tra uffici Interpol (modello di lingua), frasi funzionali, compito 6"),
  R("TARGET-75", "TARGET", "75", ["A1"], [], "verified", "ok", "Invito a una riunione: consegna più lunga"),
  R("CAMP-33", "CAMPAIGN", "33", ["A2"], ["tenses"], "verified", "ok", "Riscrivere una testimonianza in terza persona"),
  R("CAMP-51", "CAMPAIGN", "51", ["A2"], ["tenses"], "verified", "with_errata", "Rapporto breve su un episodio (past continuous e past simple)"),
  R("MISSION-39-40", "MISSION", "39-40", ["A2", "A4"], ["tenses"], "verified", "with_errata", "Rapporto d'arresto autentico: sequenza narrativa. Non riportare i dati personali"),
  R("OXF-17-22", "OXFORD", "50-61", ["A2"], ["tenses"], "unchecked", "ok", "Past simple e past continuous", "17-22"),
  R("OXF-25-28", "OXFORD", "68-75", ["A2", "A4"], ["tenses"], "unchecked", "ok", "Present perfect e past simple", "25-28"),
  R("OXF-33", "OXFORD", "84-85", ["A2"], ["tenses"], "unchecked", "ok", "Past perfect", "33"),
  R("CAMP-91", "CAMPAIGN", "91", ["A3"], ["connectors"], "verified", "ok", "Procedura con sequenziatori (compito 10)"),
  R("CAMP-87-93", "CAMPAIGN", "87, 93", ["A3"], [], "verified", "ok", "Profili di persone e gruppi"),
  R("OXF-47-49", "OXFORD", "116-121", ["A3", "A4"], ["passive"], "unchecked", "ok", "Passivo", "47-49"),
  R("OXF-157-160", "OXFORD", "354-361", ["A3"], ["relatives"], "unchecked", "ok", "Frasi relative", "157-160"),
  R("CAMP-23", "CAMPAIGN", "23", ["A4"], [], "verified", "ok", "Rapporto con titoletti (modello di lingua)"),
  R("CAMP-43", "CAMPAIGN", "43", ["A4"], [], "verified", "with_errata", "Rapporto su un piano d'azione (compito 7, be going to)"),
  R("MISSION-72-78", "MISSION", "72-78", ["A4"], [], "verified", "with_errata", "Qualità del rapporto: chiarezza, completezza, concisione, oggettività"),
  R("MISSION-83", "MISSION", "83", ["A4"], ["formal_register"], "verified", "ok", "Parole da evitare nei rapporti"),
  R("MISSION-79", "MISSION", "79", ["A4"], [], "verified", "structure_only", "Rapporto modello didattico: solo struttura"),
  R("OXF-51", "OXFORD", "124", ["A4", "B1"], ["passive"], "verified", "ok", "Passivo impersonale", "51"),
  R("OXF-62-94-147", "OXFORD", "148, 220, 332-337", ["A5"], ["modals"], "unchecked", "ok", "Should/had better, suggest e recommend, comparativi", "62, 94, 147-149"),
  R("TARGET-14-22", "TARGET", "14-22", ["B1"], ["connectors"], "verified", "with_errata", "Connettivi tra frasi"),
  R("MISSION-16-19", "MISSION", "16-19", ["B1"], ["reported_speech"], "verified", "ok", "Discorso indiretto"),
  R("MISSION-80-82", "MISSION", "80-82", ["B1"], ["reported_speech", "word_order"], "verified", "with_errata", "Domande indirette e discorso riferito"),
  R("OXF-97", "OXFORD", "228-229", ["B1"], ["reported_speech"], "verified", "with_errata", "Say e tell, cambio dei tempi", "97"),
  R("OXF-98-100", "OXFORD", "230-235", ["B1"], ["reported_speech"], "unchecked", "ok", "Discorso indiretto: domande e verbi introduttivi", "98-100"),
  R("TARGET-154-157", "TARGET", "154-157", ["B2"], ["connectors"], "verified", "with_errata", "Metodo del saggio"),
  R("TARGET-156", "TARGET", "156", ["B2"], [], "verified", "with_errata", "Saggio modello (struttura analitica; datato)"),
  R("MISSION-23", "MISSION", "23", ["B2"], [], "verified", "ok", "Guida al saggio e traccia da 350 parole"),
  R("OXF-165", "OXFORD", "372-373", ["B2", "B4"], ["connectors"], "verified", "with_errata", "Coesione: contrasto", "165"),
  R("OXF-164-167", "OXFORD", "368-379", ["B2"], ["connectors"], "unchecked", "ok", "Coesione: addizione, finalità, causa", "164, 166-167"),
  R("OXF-101-104", "OXFORD", "236-243", ["B3"], ["conditionals"], "verified", "with_errata", "Periodo ipotetico (spiegazioni verificate)", "101-104"),
  R("OXF-59-60", "OXFORD", "142-145", ["B3"], ["modals"], "unchecked", "ok", "Deduzione e gradi di certezza", "59-60"),
  R("TARGET-57-PARTS", "TARGET", "57", ["B3"], ["conditionals"], "verified", "with_errata", "Solo were to, should + infinito, inversione con had/should"),
  R("COND-MISSION-TARGET", "MISSION", "MISSION 50-51; TARGET 55-56", ["B3"], ["conditionals"], "verified", "excluded", "Spiegazioni escluse; usabili solo gli esempi corretti"),
  R("TARGET-155", "TARGET", "155", ["B4"], [], "verified", "ok", "Raccogliere le tesi contrarie e confutarle"),
  R("OXF-177", "OXFORD", "400", ["B4"], ["word_order"], "verified", "ok", "Inversione dopo espressioni negative (facoltativa)", "177"),
  R("TARGET-76-78", "TARGET", "76-78", ["B1"], [], "verified", "structure_only", "Verbale di riunione: solo struttura")
];

/* ------------------------------------------------------------------ */
/* Errata (errori confermati) e osservazioni                           */
/* ------------------------------------------------------------------ */

const E = (n, book, pages, quote, fix, severity, tags) => ({ id: `E${n}`, book, pages, quote, fix, severity, tags });

export const ERRATA = [
  E(1, "MISSION/TARGET", "MISSION 51; TARGET 56", "if a certain condition would have been fulfilled; If + past perfect + would + past participle", "if a certain condition had been fulfilled; If + past perfect, would have + past participle", "alta", ["conditionals", "B3", "COND-MISSION-TARGET"]),
  E(2, "MISSION/TARGET", "MISSION 51; TARGET 56", "I would use public transports", "public transport (non numerabile)", "alta", ["conditionals", "COND-MISSION-TARGET"]),
  E(3, "TARGET", "18, 22", "George has left, however he did leave you the forms; John had a terrible headache, however he went to work", "George has left; however, he did leave… (punto e virgola o punto fermo prima di however)", "alta", ["connectors", "B1", "B2", "TARGET-14-22"]),
  E(4, "TARGET", "57", "If my mother in law will come here, I have to leave earlier", "If my mother-in-law is coming, I'll have to leave earlier; if + will solo per volontà", "alta", ["conditionals", "B3", "TARGET-57-PARTS"]),
  E(5, "MISSION", "79", "several phone call; no-one had survived and were declared dead; were foreign, we are trying", "several phone calls; there were no survivors: all occupants were declared dead at the scene; punto fermo prima di We are trying", "alta", ["A4", "tenses", "MISSION-79"]),
  E(6, "TARGET", "76-78", "will reduce with 10%; a significant lower profit as expected; the extend to which", "will fall by 10%; a significantly lower profit than expected; the extent to which", "alta", ["B1", "formal_register", "TARGET-76-78"]),
  E(7, "OXFORD", "228", "Quando invece non si vuole nominare, si usa tell", "Quando invece si vuole nominare la persona, si usa tell", "media", ["reported_speech", "B1", "OXF-97"]),
  E(8, "OXFORD", "228", "That si può usare nel discorso diretto", "nel discorso indiretto", "media", ["reported_speech", "B1", "OXF-97"]),
  E(9, "MISSION/TARGET", "MISSION 51; TARGET 56", "Tipo 2: If + past simple + would; the past simple of to be is were for all persons", "would + forma base; were possibile per tutte le persone nella if-clause, was corretto con I/he/she/it", "media", ["conditionals", "B3", "COND-MISSION-TARGET"]),
  E(10, "TARGET", "57", "If she were in the neighbourhood, why didn't she come to visit us?", "If she was in the neighbourhood… (passato reale)", "media", ["conditionals", "TARGET-57-PARTS"]),
  E(11, "OXFORD", "236", "nella frase con if non si usano will né altri modali", "vale per will futuro; altri modali sì (If you can't come, let me know)", "media", ["conditionals", "OXF-101-104"]),
  E(12, "MISSION", "25", "to argue and to plea; Plea is the arraignment before a trial", "to plead; la plea è la dichiarazione dell'imputato all'arraignment", "media", ["A4", "lexis"]),
  E(13, "MISSION", "80", "is there anybody with him; what was he doing; there the permit is; what's is happening", "whether there is anybody with him; what he was doing; where the permit is; what is happening", "media", ["word_order", "reported_speech", "MISSION-80-82"]),
  E(14, "TARGET", "15", "a comma (or in a very complicated sentence, a colon); but the exclude contracts", "semicolon (punto e virgola); they exclude", "media", ["connectors", "TARGET-14-22"]),
  E(15, "TARGET", "22", "Having nothing to discuss in conclusion the Officers left; I'm delighted of your performance", "in conclusion introduce la conclusione di un testo; delighted with", "media", ["connectors", "TARGET-14-22"]),
  E(16, "TARGET", "32", "sincerely – with best wishes", "sincerely = sinceramente, davvero", "media", ["formal_register"]),
  E(17, "MISSION", "81", "Are the family or friends?", "Are they family or friends?", "bassa", ["word_order", "MISSION-80-82"]),
  E(18, "TARGET", "20", "your credit limit have been exceeded", "has been exceeded", "bassa", ["connectors", "TARGET-14-22"]),
  E(19, "MISSION", "78", "Detects signs of untruthfulness; as you the subject through the story", "Detect signs…; as you take the subject through the story", "bassa", ["A4", "MISSION-72-78"]),
  E(20, "MISSION", "73", "Saturday 7th December 2012", "il 7 dicembre 2012 era venerdì", "bassa", ["A4", "MISSION-72-78"]),
  E(21, "MISSION", "84", "request elencato due volte; manca detain", "aggiungere detain all'esercizio", "bassa", ["A4"]),
  E(22, "TARGET", "16, 18, 19, 57", "if he is not seek; eighteen month; court jail; next, he hope; the only riding; you mother", "sick; eighteen months; county jail; he hopes; the only one riding; your mother", "bassa", ["connectors", "conditionals", "TARGET-14-22", "TARGET-57-PARTS"]),
  E(23, "TARGET", "156", "UK presentato come membro UE; PESD come politica attuale; major repercussion", "datato (Brexit 2020; PESD divenuta PSDC); major repercussions", "bassa", ["B2", "TARGET-156"]),
  E(24, "TARGET", "154-157", "piece if writing; linking words my come useful; you reader; Don't give anyting for granted", "piece of writing; may come in useful; your reader; take anything for granted", "bassa", ["B2", "TARGET-154-157"]),
  E(25, "CAMPAIGN", "43", "Why is the Central Station area hotspot?; How much time to they have", "a hotspot; do they have", "bassa", ["A4", "CAMP-43"]),
  E(26, "CAMPAIGN", "51", "write short a report", "write a short report", "bassa", ["A2", "CAMP-51"]),
  E(27, "MISSION", "39-40", "some what; fumbling the with the papers; the defendants mouth; Upon Tpr. Maliszewski I explained; in front a small red vehicle; preforming; 700 mil.", "somewhat; fumbling with the papers; the defendant's mouth; Upon Tpr. Maliszewski's arrival, I explained; in front of; performing; 700 ml", "bassa", ["A2", "A4", "MISSION-39-40"]),
  E(28, "OXFORD", "236, 238, 240", "alla fine del periodo, non è mai seguita dalla virgola", "non è preceduta dalla virgola (di norma)", "bassa", ["conditionals", "OXF-101-104"]),
  E(29, "OXFORD", "372, 386", "while (anche); Anyway… tradotto Tuttavia", "while = mentre; anyway = comunque", "bassa", ["connectors", "OXF-165"]),
  E(30, "MISSION", "11", "posh da Port Out, Starboard Home presentato come fatto", "paretimologia senza prove (Etymonline)", "bassa", ["lexis"])
];

const O = (n, book, pages, passage, assessment, tags) => ({ id: `O${n}`, book, pages, passage, assessment, tags });

export const OBSERVATIONS = [
  O(1, "MISSION", "75", "he was bleeding e looking for clues sotto why", "La consegna ammette più posizioni e la chiave dice possible answers: esercizio di discussione, non errore.", ["A4", "MISSION-72-78"]),
  O(2, "MISSION", "19", "they'd be here by 7 o'clock", "Corretto se riferito nello stesso luogo.", ["reported_speech", "MISSION-16-19"]),
  O(3, "MISSION", "17", "She said (that) she doesn't speak French (riga Present → Past)", "Inglese corretto se ancora vero; incoerenza didattica della tabella.", ["reported_speech", "MISSION-16-19"]),
  O(4, "TARGET", "20", "Esercizio 1, item 4, 5 e 9", "Item 4 e 5 ammettono due risposte; la chiave dell'item 9 è accettabile.", ["connectors", "TARGET-14-22"]),
  O(5, "MISSION", "79", "Past perfect per l'intera sequenza; truck e lorry alternati", "Scelte di stile discutibili, non errori.", ["A4", "tenses", "MISSION-79"]),
  O(6, "MISSION", "81", "What is/are their names?; permit of stay", "Forma compatta poco chiara; il termine usuale è residence permit.", ["word_order", "MISSION-80-82"]),
  O(7, "TARGET", "33", "We freely appreciate the current difficulties", "Collocazione poco comune: preferire fully appreciate.", ["formal_register"]),
  O(8, "TARGET", "57", "Can you ask Mark if he wants to stay for dinner?", "Corretto, ma non è un periodo ipotetico (if = whether).", ["conditionals", "TARGET-57-PARTS"]),
  O(9, "OXFORD", "400", "Only when I saw her, did I realize…", "Virgola prima dell'ausiliare invertito: scelta di stile incoerente.", ["word_order", "OXF-177"]),
  O(10, "OXFORD", "228", "He lives in Paris → Lorna tells me you live in Paris", "Corretto (cambio di persona), può confondere.", ["reported_speech", "OXF-97"]),
  O(11, "MISSION/TARGET", "MISSION 23; TARGET 155", "Modali e cautela nell'opinione", "Per il JFLT si segue TARGET p. 155: opinione chiara, cautela misurata dove le prove sono incerte.", ["B2", "MISSION-23", "TARGET-155"])
];

/* ------------------------------------------------------------------ */
/* Istruzioni del Tutor (Prompt B, versione per lo schema v2)          */
/* ------------------------------------------------------------------ */

export const TUTOR_PROMPT = `Sei il Tutor di scrittura di JFLT Coach per un adulto italiano che prepara il JFLT (STANAG 6001). Profilo e obiettivo dello studente sono in DATA.student, quando presenti. Lavori solo su grammatica e scrittura in inglese. Non sei un esaminatore certificato: ogni stima di livello è orientativa.

FORMATO DELLE RICHIESTE
Ogni richiesta contiene MODE, REQUEST_ID, DATE e un blocco DATA in JSON con tutto il materiale: testo dell'esercizio, risposte o testo dell'utente, riferimenti ai libri, errata e osservazioni pertinenti. Usa solo quel materiale; se manca qualcosa di indispensabile scrivilo in "questions" e non inventare.

FORMATO DELLE RISPOSTE
Rispondi SOLO con un oggetto JSON valido, senza testo prima o dopo e senza blocchi markdown:
{"schema":"jflt-coach/v2","mode":"<MODE della richiesta>","request_id":"<REQUEST_ID>","date":"<DATE>","payload":{...},"card_candidates":[...],"questions":[...]}
Il contenuto di "payload" dipende dal modo. Nessun campo in più; dove indicato usa null o [].

TIPI COMUNI
- tool: tenses | articles | prepositions | connectors | conditionals | word_order | modals | passive | relatives | reported_speech | gerund_infinitive | formal_register
- capability: A1 | A2 | A3 | A4 | A5 | B1 | B2 | B3 | B4
- criterion: comprehensibility | task | organisation | grammar | lexis_register
- Rubric: {"comprehensibility":{"score":0-4,"evidence":"citazione breve"},"task":{...},"organisation":{...},"grammar":{...},"lexis_register":{...}}
- Error: {"quote":"testo copiato alla lettera","minimal_fix":"correzione minima","category":"grammar|lexis|organisation|task|register|spelling|punctuation","tool":tool o null,"rule_it":"regola in 1-2 frasi","systematic":true|false}
- StanagEstimate: {"range":"es. 1+ / 2","confidence":"low|medium","basis_it":"...","note":"stima orientativa, non ufficiale"}
- Card: {"front":"...","back":"...","tag":tool|"lexis"|"organisation"|"register","source_quote":"quote di un errore systematic","reason_it":"..."}

PAYLOAD PER MODO
- DIAG_ITEMS: {"items":[20 × {"id","area":tool,"type":"error_correction|transformation|completion","instruction_it","stem","already_correct":true|false per error_correction altrimenti null,"answer","accept":[tutte le risposte accettabili, inclusa answer],"explanation_it"}]}
- DIAG_EVAL: {"texts":[{"text_id":"D3","rubric":Rubric,"errors":[Error],"comment_it"},{"text_id":"D4",...}],"item_rulings":[{"item_id","correct":true|false,"note_it"} per ogni id in DATA.diagnostic.unclear_item_ids],"stanag_estimate":StanagEstimate,"priorities":[2-3 × {"rank":1-3,"kind":"grammar_tool|writing_criterion","tool":tool o null,"criterion":criterion o null,"issue_it","why_it"}],"start_capability":capability,"start_rationale_it"}
- GRAMMAR: {"tool":DATA.tool,"capability","purpose":DATA.purpose,"explanation_it","book_ref":{"ref_id","book","pages"} oppure null,"items":[DATA.n_items × {"id","type","instruction_it","stem","answer","accept":[...],"explanation_it"}]}
- WRITE_PLAN: {"task":{"id","capability","text_type":"note|report_letter|essay","prompt_en","words":[min,max],"content_points":[2-6],"checklist_it":[2-8],"draft_sessions":1|2},"model_excerpt_en":"modello ORIGINALE, max 120 parole","observation_questions_it":[3 domande]}
- WRITE_FEEDBACK: {"text_id","version":"draft|rewrite","rubric":Rubric,"priorities":[2-3 × {"criterion","issue_it","why_it"}],"errors":[Error],"alternatives":[{"quote","option","note_it"}],"transfer":{"tool","occurrences":[{"quote","correct":true|false,"note_it"}]} oppure null,"rewrite_request_it","stanag_estimate":StanagEstimate}
- WRITE_MODEL: {"text_id","improvements_it":[...],"still_open_it":[...],"model_text_en"}
- CHECK_TRANSFER: {"text_id","transfer":{"tool","occurrences":[...]}}
- WEEK_PLAN: {"week_start":"AAAA-MM-GG","capability","sessions":[6 × {"day":"mon|tue|wed|thu|fri|sat","kind":"grammar|write_plan|write_draft|write_revise|write_short","focus_it","tool":tool o null}],"rationale_it"}

REGOLE
1. Lunghezze per tipo di testo JFLT: note 50-100, report_letter 150-250, essay 250-500 parole; draft_sessions 2 solo oltre 250 parole. Non aumentare la lunghezza per alzare il livello.
2. Correzione: 2-3 priorità; correzioni minime che conservano le idee dell'utente; ogni "quote" copiata alla lettera dal testo in DATA; errori effettivi in "errors", alternative stilistiche in "alternatives". systematic: true solo se lo stesso tipo di errore compare almeno due volte nel testo o in DATA.recent_errors.
3. card_candidates: solo in DIAG_EVAL e WRITE_FEEDBACK, solo per errori systematic: true (source_quote = quote dell'errore), al massimo 6. Negli altri modi [].
4. Il testo modello non va mai in WRITE_FEEDBACK: solo in WRITE_MODEL, che arriva dopo la riscrittura e sviluppa le idee dell'utente.
5. Trasferimento: elenca ogni uso dello strumento indicato con la citazione esatta e correct true/false. Non decidere l'esito: lo calcola l'app. Se lo strumento non compare, occurrences è [].
6. Stima STANAG: confidence "low" o "medium", mai "high" su uno o due testi. Livello 2 = testi chiari, paragrafi collegati, strutture semplici controllate; livello 3 = argomentazione e analisi efficaci, errori occasionali che non ostacolano la comprensione.
7. Libri: cita solo i riferimenti in DATA.book_refs. Una chiave del libro vale solo se page_status è "verified" e non c'è errata pertinente; altrimenti risolvi in modo indipendente e segnala la discrepanza in "questions". Applica DATA.errata (errori confermati) e non presentare DATA.observations come errori. Mai come modello di lingua un riferimento "structure_only"; mai regole da un riferimento "excluded". Per i condizionali le regole vengono dalle unità Oxford 101-104.
8. Esercizi nuovi: frasi naturali, contesto professionale fittizio, nessun dato reale di servizio; in "accept" tutte le soluzioni accettabili; evita le frasi in DATA.already_seen. Se DATA.recovery è presente, gli esercizi mirano agli errori dello strumento elencati in DATA.recent_errors.
9. Prima di rispondere controlla che il JSON sia valido, che request_id, mode e date coincidano con la richiesta e che ogni "answer" compaia in "accept".`;
