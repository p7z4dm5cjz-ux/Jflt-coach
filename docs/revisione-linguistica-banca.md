# Revisione linguistica della banca attiva — 19 ottobre 2026

Base: commit e4d802c7018ef21364552387025fe670f41af25f. Revisione editoriale del codice e dei contenuti locali, con test di regressione. Non una certificazione esterna o una validazione con studenti.

## Copertura

| Componente | Elementi esaminati | Metodo |
|---|---:|---|
| Core, 16 lezioni | 480 operazioni; 1.920 istanze nelle quattro varianti | Lettura delle regole, dei sei verbi con complementi, dei quattro soggetti, delle cinque operazioni e dei sei quesiti avanzati sul futuro; verifica di tutte le combinazioni |
| Negazioni | 30 modelli, 240 istanze | Lettura delle otto serie lessicali e dei trenta modelli, controllo di flessione, significato e spiegazione |
| Estensioni grammaticali | 444 esercizi in 58 moduli | Lettura di consegna, soluzione, alternative e spiegazione |
| Banca di base effettivamente usata | 84 esercizi in 42 lezioni | Lettura delle righe sorgenti, comprese quelle oggi superate dalla banca core |
| Verifiche brevi | 240 quesiti | Controllo delle forme richieste, delle varianti e delle ambiguità |
| Pretest | 45 quesiti | Controllo delle risposte aperte, delle scelte e delle motivazioni |
| Phrasal verbs | 211 schede, 633 esercizi | Lettura dei sensi e degli esempi; revisione delle tre famiglie di esercizi e delle alternative |

Sono 3.606 istanze nel controllo automatico esaustivo: molte sono varianti dello stesso modello, **non 3.606 situazioni indipendenti**. Le rotazioni delle estensioni non producono esercizi nuovi. Le 117 lezioni restano tutte coperte.

## Correzioni

- **Phrasal verbs:** le 161 schede originarie ora hanno ciascuna due distrattori scritti per il proprio senso. Nessuna pesca casuale di traduzioni da altre schede. Le 50 schede aggiuntive conservano le proprie alternative curate. Le opzioni rimangono stabili fra sessioni; l'ordine nell'interfaccia può variare.
- **Pronomi:** le costruzioni riferite a persone, fra cui call on, take after, pick up, get along with, usano them invece del generico it. Le schede con un pronome specifico lo conservano.
- **Wash up:** stoviglie e igiene personale hanno esempi distinti. Il primo usa plates come oggetto diretto e l'esercizio wash them up; il secondo specifica hands and face. Evitata la precedente ambiguità del solo riferimento al pasto.
- **Particelle:** la consegna chiarisce che si recupera l'espressione della scheda studiata. Le alternative equivalenti già accettate restano valide; non viene pretesa una sola traduzione inglese possibile della definizione italiana.
- **Contesto:** bored/boring, confused/confusing, wherever/whenever, might well/might as well, ever/never e would/will ora indicano il significato da esprimere. Le forme escluse non vengono dichiarate universalmente scorrette.
- **Discorso indiretto:** la consegna della banca di base richiede espressamente il backshift. Il solo fatto che una frase sia stata pronunciata ieri non basta a imporlo.
- **Inversione e accordo:** indicato il present perfect in Never … we seen; esplicitato Council come ente singolare; precisato il registro formale nell'irreale con were. Le tag di conferma specificano la polarità, distinguendo il caso convenzionale di Let's.
- **Correzioni aperte:** accettati Only Anna did call yesterday, The team has made some progress / a lot of progress, The response was much faster. Restano respinti did called, a progress, more faster. Non si accettano indiscriminatamente sinonimi o cambi di tempo.
- **Participi:** esplicitata la successione delle azioni; mantenuti After finishing e After having finished, aggiunto On finishing.
- **Negazioni:** nella frase errata con Nobody didn't il verbo è ora alla base: l'esercizio riguarda davvero la doppia negazione, senza aggiungere involontariamente un secondo errore di flessione. Corretta la spiegazione della negazione al past continuous.
- **Ordine:** nelle trasformazioni negative core sono accettati sia il complemento temporale finale sia quello iniziale con virgola.
- **Verifiche:** sostituito being tired con his tiredness per eliminare il dubbio sulla subordinata ridotta; reso esplicito il contrasto con However; distinto practical da practicable; reso naturale il contesto del viaggio al past perfect continuous.
- **Istruzioni:** nei completamenti delle estensioni e della banca base «ciò che manca» evita di promettere una sola parola quando sono ammesse varianti di più parole. Nei compiti di trasformazione resta la richiesta della frase intera.

## Verifica e limiti

Il nuovo file tests/bank-language-review.test.mjs verifica le correzioni con risposte alternative scritte esplicitamente, non soltanto con la soluzione del database. Controlla anche errori che devono essere rifiutati, stabilità dei distrattori, tutte le varianti core/negazioni e l'inventario complessivo. La verifica inventariale della soluzione di riferimento è un controllo strutturale: **non prova da sola la qualità linguistica**.

Build, check e intera suite: 229 test superati. Non sono state effettuate chiamate a Groq né modificati token, quote o provider.

La revisione riguarda la banca locale attiva. Non certifica le risposte che Groq genererà in futuro, né riscrive gli esercizi già salvati nelle sessioni personali. Per vedere le nuove consegne occorre iniziare una nuova sessione dopo l'aggiornamento dell'app. ID di lezioni e schede, formato dei backup e progressi sono conservati; non si ricalcolano retroattivamente i vecchi punteggi. La cartella legacy non è una banca di esercizi del percorso attuale.

## Riferimenti linguistici consultati per i casi dubbi

- Cambridge, English Grammar Today: [Reported speech: indirect speech](https://dictionary.cambridge.org/grammar/british-grammar/reported-speech-indirect-speech).
- Cambridge, English Grammar Today: [May as well and might as well](https://dictionary.cambridge.org/grammar/british-grammar/may-as-well-and-might-as-well).
- British Council: [Adjectives ending in -ed and -ing](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/adjectives-ending-ed-ing).
- Cambridge Dictionary: [wash up](https://dictionary.cambridge.org/dictionary/english/wash-up).

Consultati i risultati indicizzati disponibili; l'apertura diretta di alcune pagine Cambridge ha restituito 403. Nessun esercizio è stato copiato da queste fonti.
