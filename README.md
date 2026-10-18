# JFLT Coach 1.10.0

## Novità della 1.10.0: pretest adattivo con diagnosi

- **Pretest adattivo (circa 15 minuti, di solito 25-35 domande, nessuna richiesta AI).** Ogni area parte da poche domande; dove rispondi bene e con sicurezza si passa oltre, dove sbagli o hai un dubbio la stessa struttura viene ricontrollata con un'altra domanda (dalle 45 del pretest e dalla banca delle verifiche). Un'area si chiude quando lo stato è abbastanza sicuro o raggiunge il massimo di domande (tempi 10, negazioni 7, phrasal 6, altre 4-5).
- **Un errore isolato non diventa una priorità:** se una struttura sbagliata viene poi risolta, resta «da confermare» (a meno che l'intera area sia debole). Ogni domanda conta per la sua struttura principale: un errore di negazione al present simple non abbassa il present simple come tempo.
- **Diagnosi nei risultati:** strutture sbagliate area per area, risposte lasciate vuote, e il pulsante «Chiedi la diagnosi al tutor» (una richiesta Groq) che raggruppa gli errori per tipo, cita le tue risposte e indica da dove partire. La diagnosi resta salvata con la prova e nel backup.
- **Simulazione su 2.500 profili di studente** (stesso modello di risposta per entrambi i pretest): il pretest adattivo individua le aree da ripassare come quello da 45 domande (circa 78-79% contro 77-79%), con circa 30 domande invece di 45 e circa un terzo di falsi allarmi in meno sulle singole lezioni.
- Il pretest da 45 domande già fatto resta valido e ripristinabile.

## Novità della 1.9.6

- **La frase intera giusta conta come giusta.** Se in un esercizio con ___ scrivi tutta la frase invece delle sole parole mancanti, la risposta è accettata quando coincide con la frase completata correttamente. Vale per pretest, esercizi e verifiche; non per le scelte multiple. Il risultato del pretest già fatto si ricalcola da solo.
- **Percorso per aree.** Le tappe dopo il pretest sono ripartite tra le aree in proporzione agli errori (tempi, negazioni e phrasal valgono doppio): le due aree più deboli si alternano invece di occupare da sole le prime tappe. Dentro ogni area viene prima la lezione con più errori.

## Novità della 1.9.5

- **Pretest ripristinabile.** Se un pretest completato è stato messo da parte con «Ripetere il pretest», in Oggi e nella pagina del pretest compare «Hai già un pretest completato» con il pulsante per ripristinarlo. «Inizia una nuova prova» ora chiede conferma.
- **Testi più chiari e coerenti** (revisione dell'interfaccia):
  - i pulsanti dicono «con il tutor»; Groq resta nominato solo dove serve (Impostazioni, Comprendi);
  - «Mini-rivalutazione» diventa «Inizia la verifica breve · 10 domande», lo stesso nome usato nel resto dell'app;
  - in Oggi il riquadro con Groq si chiama «Allenamento con il tutor» e spiega che è un'alternativa al piano di oggi, che è offline; la casella del piano si chiama «Esercizi»;
  - risultato del pretest scritto per esteso («25 risposte corrette su 45»); niente più «consegna» nel senso di invio;
  - Studio si apre con «Percorso e lezioni»; la sezione Comprendi ha lo stesso nome ovunque;
  - Impostazioni: «Importa un backup» (accetta anche i backup delle versioni attuali) e la spiegazione che su iPhone Safari e l'app sulla schermata Home hanno archivi separati;
  - corretti i doppi punti finali in alcune descrizioni delle lezioni e il termine «nucleo del soggetto».

## Novità della 1.9.4 (verifica di coerenza)

- **Una sola regola per «senza aiuti» e «mantenimento»** in classifica, scheda della lezione, motivi del percorso e Progressi: le ultime due sessioni intere, almeno 8 risposte e 8 contesti diversi, 85% di risposte giuste. Prima la scheda della lezione usava ancora le ultime 12 risposte.
- **I motivi delle tappe seguono lo stato reale:** dopo una sessione riuscita non compare più «hai incontrato difficoltà», ma la percentuale dell'ultima sessione.
- **Le lezioni da confermare tornano davvero.** La verifica breve copre 30 lezioni su 117: per le altre una sessione riuscita torna nel percorso dopo 3 giorni, il mantenimento dopo 21.
- **Progressi:** la percentuale indica su quante risposte recenti è calcolata.
- **App più robusta:** se il browser rifiuta il funzionamento offline (navigazione privata, browser integrati), l'app si apre comunque invece di mostrare «Non ho potuto aprire l'archivio».

## Novità della 1.9.3

- **Corretto: il piano restava sempre sulla stessa lezione.** Il mantenimento guardava solo le ultime 12 risposte; con le sessioni da 30 esercizi venivano tutte dalla stessa sessione, quindi la condizione «due sessioni diverse» non si verificava mai e la prima priorità del pretest (spesso le negazioni) restava in testa per sempre. Ora contano le ultime due sessioni intere. Dopo una sessione riuscita (almeno 85%) la lezione passa a «Da confermare» e il percorso va alla tappa successiva; con due sessioni riuscite passa al mantenimento e torna solo con le verifiche distanziate.
- Il peso degli errori di una sessione lunga è limitato, così una sessione andata male non blocca la classifica per giorni.

## Novità della 1.9.2

- **Il percorso lo propone l'app.** Dopo il pretest, nella pagina dei risultati, in Oggi e in Studio c'è «Il tuo percorso»: cinque tappe numerate, ognuna con il motivo («Nel pretest: 7 risposte sbagliate su 8 domande che riguardano questa struttura») e un solo pulsante «Inizia». La tappa 1 è la stessa del piano di oggi e dell'allenamento completo. Il catalogo delle lezioni resta aperto per chi vuole scegliere.
- Sotto la tabella dei risultati è spiegato come nascono «Priorità», «Da confermare» e «Basi già controllate».

## Novità della 1.9.1

- **Consegne chiare in tutti gli esercizi.** Ogni esercizio con risposta da scrivere comincia con un'istruzione italiana che dice esattamente che cosa scrivere: «Scrivi solo la parola mancante» (una parola), «Scrivi solo le parole mancanti» (più parole), «Riscrivi tutta la frase» o «Correggi l'errore e riscrivi tutta la frase» (frase intera), «Metti le parole in ordine e scrivi la frase». La parola da usare è tra parentesi alla fine, es. «(work)» o «(usa work al past simple)». Tolte le etichette tecniche e i termini come «lacuna» o «gruppo verbale». Riviste oltre 800 consegne: pretest, verifiche, esercizi di grammatica, banca offline, negazioni, phrasal verbs e recupero. Le soluzioni non cambiano; dove la nuova consegna ammette un'altra risposta corretta, questa è stata aggiunta alle varianti accettate.
- **Esercizi generati da Groq:** il Worker chiede le stesse regole di chiarezza; per quelli che non le rispettano, sotto la casella compare un'indicazione automatica («Scrivi solo ciò che va al posto di ___» oppure «Scrivi tutta la frase»).
- **Il tutor non si blocca per una correzione minore:** l'app accetta un Worker della stessa release (es. app 1.9.1 con Worker 1.9.0); versioni principali diverse restano bloccate come prima.
- Controllo automatico nei test: ogni consegna locale dice che cosa scrivere, non usa gergo e dice «parola» o «parole» secondo la soluzione.

## Novità della 1.9.0

- **Testo e traduzione affiancati** (Comprendi → una lettura): a sinistra incolli il testo inglese, a destra «Traduci con Groq» mostra la traduzione italiana paragrafo per paragrafo. I due riquadri scorrono insieme. I testi lunghi vengono divisi automaticamente in richieste da circa 3.000 caratteri; ogni traduzione deve avere lo stesso numero di paragrafi dell'originale. Se modifichi il testo, l'app avvisa che la traduzione è da rifare. La traduzione resta salvata nella lettura e nel backup.
- La funzione esistente di confronto con **la tua traduzione** resta disponibile sotto i riquadri, in «Prova a tradurre tu e confronta».
- **Eliminare letture e testi:** in fondo alla pagina di ogni lettura e di ogni testo scritto, con richiesta di conferma. I risultati degli esercizi restano.


## Novità della 1.8.0

- **Esercizi controllati prima di arrivarti.** Dopo la generazione, il Worker chiede a Groq di risolvere gli esercizi senza vedere le soluzioni. Se il controllo conferma la soluzione, l'esercizio resta com'è; se trova altre risposte corrette, le aggiunge alle varianti accettate (massimo 8); se arriva a una soluzione diversa o trova l'esercizio ambiguo, l'esercizio resta visibile ma è segnato come dubbio ed escluso dal punteggio e dalle priorità. La soluzione originale non viene mai sostituita. Se il controllo non risponde, gli esercizi arrivano comunque, segnati come non controllati.
- **Più margine sul piano gratuito.** Se `gpt-oss-120b` risponde «quota raggiunta» (HTTP 429), il Worker ripete la stessa richiesta con `openai/gpt-oss-20b`, che su Groq ha limiti propri. Un errore di formato dello schema rigido (`json_validate_failed`) viene ritentato una volta. Per disattivare il passaggio al modello piccolo: variabile `MODEL_FALLBACK=off` nel Worker; per il controllo: `VERIFY=off`.
- **Prova di comprensione stile JFLT** (Comprendi → una lettura): 6 domande a scelta multipla in inglese su idea principale, dettagli, inferenze, scopo dell'autore e lessico nel contesto; ogni risposta è collegata a una frase letterale del testo (le domande senza riscontro vengono scartate) e passa dal controllo alla cieca. Risultato, tempo impiegato e storico delle prove restano nella lettura e nel backup. Allena il formato, non stima il livello.
- **Menu:** «Comprendi» è una sezione propria anche su iPhone.
- **Controlli automatici su GitHub** (`.github/workflows/ci.yml`): a ogni caricamento eseguono `npm run check`, `npm test` e una prova nel browser vero (`npm run smoke`: 8 pagine, iPhone e computer, tema chiaro e scuro; fallisce con errori in console, pagine che sbordano, versione sbagliata o cache offline non aggiornata). Non pubblicano nulla e non usano chiavi.

Consumo: con il controllo ogni blocco di esercizi o prova di lettura usa 2 chiamate Groq invece di 1, conteggiate una sola volta nel limite personale del Worker (10/minuto, 80/giorno).

## Nuova grafica (1.7.0)

Direzione «Allenamento»: blu notte e arancio, carattere Barlow incluso nell'app (funziona anche offline; licenza SIL OFL in `fonts/OFL-Barlow.txt`).

- **Oggi:** settimana a pallini (giorni con attività), piano del giorno in due blocchi con stato, priorità con i contesti corretti su 8.
- **Intestazione compatta su iPhone:** marchio e accesso alle impostazioni; lo stato «Offline» compare solo quando serve. Il tema si sceglie in Impostazioni → Aspetto.
- **Barra in basso:** cinque sezioni con icone vere (Oggi, Studio, Comprendi, Scrittura, Ripasso); Impostazioni passa all’icona in alto. Durante esercizi, pretest e verifiche la barra si nasconde.
- **Esercizi:** schede più leggibili, opzioni grandi, barra di avanzamento spessa, verifica in evidenza.
- Tema scuro ridisegnato con gli stessi criteri.
- Corretti: versione «1.1.0» rimasta scritta a mano nella pagina (ora letta dall'app, con controllo automatico), voce «Oggi» non evidenziata all'apertura, conteggio delle domande di verifica non aggiornato.

Nessuna modifica a contenuti, correzione delle risposte, salvataggi o Worker Groq rispetto alla 1.6.1.

## Correzioni della 1.6.1

Revisione didattica completa degli esercizi locali, delle verifiche e dei percorsi di scrittura. Corrette le risposte giuste che venivano rifiutate, tolte le soluzioni visibili nelle consegne, resi indipendenti i controlli e migliorate le opzioni a scelta multipla. Il Worker Groq resta invariato nel funzionamento. Dettagli in [CORREZIONI_1.6.1.md](CORREZIONI_1.6.1.md).

## Novità del 16 ottobre

**Impara a comprendere:** incolla fino a 8.000 caratteri inglesi e chiedi il senso complessivo, i passaggi e fino a cinque parole spiegate nel contesto. Puoi indicare una specifica espressione. Nessuna traduzione preliminare richiesta. Le spiegazioni distinguono registro, alternative e uso grammaticale senza attribuire intenzioni certe all’autore. Citazioni non presenti vengono escluse con avviso. L’analisi non verifica la veridicità delle notizie.

**Dizionario personale:** salva volontariamente significato, frase originale, fonte, spiegazione ed esempio. I significati diversi restano separati; il significato è modificabile. Le voci entrano nel ripasso e nel backup. Il testo incollato viene inviato a Groq solo su comando. Non inserire dati riservati.

**Grammatica:** quattro moduli nuovi (formazione delle parole, ortografia, domande di descrizione/eco, collocazioni con take); 120 esercizi locali aggiunti. Quattro banche da 30 su formazione, ortografia, preposizioni dipendenti e ripasso dei tempi. Le banche sono finite: ruotarle non produce nuove frasi. Otto nuove aree di verifica, con 64 domande distinte dall’allenamento; totale 240 su 30 aree. Le altre 87 lezioni non hanno ancora una verifica dedicata.

La 1.6.0 conserva i percorsi MISSION/TARGET della 1.5.0 e non dichiara ancora completata la revisione didattica di tutte le lezioni.


Pacchetto completo del 16 ottobre 2026, basato sulla 1.4.1 rettificata. Include app, Worker generato, configurazione, contenuti, script e test. Usa il repository e il Worker esistenti. Non occorre cancellare il progetto o cambiare i secret.

## Cosa cambia

- **Percorso visibile:** mappa di cinque gruppi, ordine di studio consigliato, prerequisiti e spiegazione del prossimo argomento. Il catalogo completo resta libero. Le fasce A1–C1 sono orientative, non una certificazione.
- **Partenza:** pretest di 45 domande. Nessun obbligo di cominciare dalle negazioni. Le priorità usano pretest, esercizi senza aiuti, errori degli scritti attuali e nuove verifiche.
- **Verifiche grammaticali locali:** mini-rivalutazione di 10 domande su cinque aree, oppure quattro domande sulla singola struttura. Banca separata di 240 domande su 30 nuclei; gli altri argomenti non sono dichiarati verificati. Prima vengono usate domande non viste, poi il riuso è segnalato.
- **Ripasso:** dopo una verifica riuscita, intervalli di 1, 3, 7, 14 e 30 giorni; dopo un errore, un giorno. Più tentativi nella stessa giornata non accelerano la progressione. Dopo quattro settimane compare l'invito alla mini-rivalutazione. Sono promemoria dentro l'app, non notifiche inviate a dispositivo chiuso.
- **Progresso distinto:** consultata, praticata, pratica senza aiuti riuscita, verifiche distanziate riuscite. Cambiare solo soggetto o ripetere più operazioni sulla stessa situazione non diventa prova di otto contesti diversi.
- **30 esercizi Groq:** cinque blocchi con obiettivo dominante: riconoscimento, forma, trasformazione, contesto, ripasso misto. Ogni blocco conserva sei esercizi e almeno tre tipi. Una sola chiamata per blocco, recupero lessicale locale alla fine.
- **Offline ampliato:** 30 operazioni su 16 nuclei di tempi/modali, oltre ai 30 esercizi delle negazioni. Le altre 96 lezioni hanno due o sei esercizi locali e l'allenamento completo con Groq. Nei 16 nuovi nuclei sei situazioni vengono esercitate in cinque operazioni; sono 30 esercizi, non 30 contesti indipendenti. Le varianti di soggetto non aumentano la misura di trasferimento.
- **Risposte AI dubbie:** il pulsante «La mia risposta potrebbe essere valida» mantiene il tentativo, lo indica come da verificare e lo esclude da punteggio valutabile e priorità. Non dichiara corretta la risposta e non avvia un secondo modello.
- **117 lezioni:** comprendono i comparativi avanzati e i quattro nuovi moduli; il confronto con Test-English è aggiornato nella matrice.
- **Scrittura dai libri:** i nuovi percorsi sono saggio MISSION, rapporto MISSION/CAMPAIGN e confronto argomentato TARGET. Comprensione, completamenti, ordine e registro precedono le tre frasi proprie; seguono paragrafo, scaletta, testo autonomo e conferma in un'altra giornata.
- **Grammatica → scrittura:** la lezione può aprire un percorso dei libri con il focus conservato. Dagli errori e dai rimandi si torna alla regola e poi alla bozza salvata.

I quattro percorsi di scrittura precedenti restano leggibili e riprendibili per chi li aveva iniziati; non sono più le proposte principali. Le osservazioni di stile non diventano errori grammaticali. Non vengono imposti generici racconti personali o richieste di informazioni al posto dei compiti dei libri.

## Materiali e copertura

Riferimenti verificati per lo scritto: MISSION p. 23 e pp. 72–79; TARGET pp. 154–155; CAMPAIGN p. 51 (pagina PDF 47). Le sintesi Oxford già presenti continuano a sostenere la grammatica. Modelli, esempi e tracce sono originali; i PDF non sono inclusi nel pacchetto.

La matrice contiene **226 voci**: 198 dei sei indici Test-English A1–C1, ricontrollati il 15 ottobre, più 28 Grammar Shorts dell'inventario del 13 ottobre. Sono voci di indice, con ripetizioni, non argomenti unici. Il nuovo capitolo è [Advanced comparative structures](https://test-english.com/grammar-points/c1/advanced-comparative-structures/).

Il catalogo ha 117 lezioni; la banca servita da `grammarItems` contiene 1038 esercizi nella variante iniziale. Il totale include operazioni sullo stesso contesto e non è una misura di padronanza. Restano 211 schede di phrasal/sensi, tre scenari e ripasso separato dei significati. Collocazioni nominali e sensi phrasal sono selezioni: non viene dichiarata equivalenza integrale con ogni esercizio di Test-English.

Dettagli: [PIANO_SCRITTURA.md](PIANO_SCRITTURA.md), [COPERTURA_GRAMMATICA.md](COPERTURA_GRAMMATICA.md), [NOVITA_1.5.0.md](NOVITA_1.5.0.md).

## Aggiornare da Codespaces, anche dall'iPhone

Carica `jflt-coach-completo-1.6.0.zip` nella radice del repository esistente, sul ramo main. Nel terminale del Codespace controlla `git status --short`: conserva prima eventuali modifiche o file non tracciati che potrebbero essere sovrascritti. Poi:

```bash
git pull --ff-only &&
git diff --quiet &&
git diff --cached --quiet &&
git branch backup-prima-1.6.0 &&
unzip -t jflt-coach-completo-1.6.0.zip &&
unzip -o jflt-coach-completo-1.6.0.zip &&
npm ci &&
npm run check &&
npm test
```

Il blocco si ferma se trova modifiche ai file tracciati, un branch di backup già esistente o un controllo fallito. Non usare comandi di reset per superare l'errore.

Dopo i controlli:

```bash
unzip -Z1 jflt-coach-completo-1.6.0.zip | xargs -d '\n' git add --
git status --short
git diff --cached --stat
```

L'elenco deve contenere soltanto file del pacchetto. Questo ZIP è verificato e usa nomi relativi senza spazi. Per pubblicare le modifiche e rimuovere lo ZIP temporaneo dal ramo corrente:

```bash
git rm -- jflt-coach-completo-1.6.0.zip &&
git commit -m "Percorso grammaticale e scrittura dai libri 1.6.0" &&
git push origin main
```

Attendi il deploy sia di **GitHub Pages** sia del **Worker Cloudflare** sul nuovo commit. Il comando Cloudflare resta `npx wrangler deploy`, dalla radice; nome `jflt-coach`, binding `BUDGET`, classe `Budget`, migrazione `v1`. Non cambiare `APP_TOKEN`, `GROQ_API_KEY`, modello o origine.

Riapri [JFLT Coach](https://p7z4dm5cjz-ux.github.io/Jflt-coach/) e premi **Aggiorna l'app** quando compare il banner. In Impostazioni verifica **app 1.6.0 e Worker 1.6.0**, poi usa **Verifica Groq**. La dimensione del file caricato non è una prova di versione.

## Salvataggi e funzionamento

Il database resta `jflt-coach`, versione 2. Non viene cancellato. I backup precedenti rimangono importabili; i nuovi includono verifiche, letture e focus dei percorsi, senza credenziali. Le sessioni già salvate conservano i propri esercizi e risultati: avvia una nuova sessione per usare le banche aggiornate.

Restano tema automatico/chiaro/scuro, icone uniformi, impostazioni iOS, contatore degli esercizi e cache del controllo `/health` per 60 secondi. La cache della shell è atomica: tutti i file essenziali devono corrispondere alle impronte della stessa revisione; icone e manifest sono opzionali. L'aggiornamento attende la conferma e il completamento dei salvataggi.

Modelli e bozze funzionano offline dopo il primo caricamento. Spiegazioni e revisioni AI partono solo su comando. Un errore di rete/quota conserva il lavoro; nessun retry automatico, nessun fallback a pagamento. Le sei tappe della scrittura richiedono Groq per la revisione delle produzioni.

## Sviluppo e verifiche

Node 24, dalla versione 24.15.0. Dipendenze conservate dalla release precedente.

```bash
npm ci
npm run build
npm run check
npm test
npx wrangler deploy --dry-run --outdir worker-build
node scripts/check-package.mjs /percorso/jflt-coach-completo-1.6.0.zip
```

`build` rigenera `worker/index.js` e `sw.js`. Il controllo verifica sintassi, versione, configurazione, copertura delle lezioni, icone e impronte della shell. Il controllo dello ZIP verifica CRC, elenco completo, byte identici ai sorgenti, import relativi e file offline.

Le prove automatiche coprono i vecchi backup, grading, 117 richieste didattiche, i nuovi flussi DOM, quota, errori provider, ripassi, risposte contestate e salvataggi durante una risposta AI. La 1.6.0 supera 163 test, inclusi richiesta di comprensione, citazioni, dizionario e backup. Le chiamate Groq sono simulate: non è stata usata la tua chiave e il collegamento reale a Groq non è stato provato da questo ambiente. Il rendering su Safari/iPhone e una risposta reale con le nuove istruzioni restano da controllare dopo la pubblicazione. L'avvio di un browser reale non è riuscito in questo ambiente.

## Richiesta Groq effettiva

```bash
node tools/ispeziona-richiesta.mjs exercises mixed-conditionals
node tools/ispeziona-richiesta.mjs grammar_explain negatives
```

Lo script intercetta il `fetch` del Worker locale e mostra richiesta, messaggi, contesto, schema e parametri senza usare rete o quota. Il Worker seleziona lezione, libri, obiettivo del blocco e consegna dai propri dati. Non manda tutto il catalogo al modello.

Modello configurato `openai/gpt-oss-120b`; supportato anche `openai/gpt-oss-20b`. Schema `json_schema`, `strict: true`, revisione `groq-path-v6`. Ragionamento, temperatura, limiti e quote del provider restano quelli funzionanti: 10 richieste personali al minuto e 80 al giorno. Il controllo della forma e delle citazioni non garantisce la correttezza linguistica di ogni risposta generata.

Le correzioni precedenti, incluse privacy, varianti accettate e distrattori phrasal, sono conservate: [CORREZIONI_1.4.1.md](CORREZIONI_1.4.1.md). La lista esterna integrale dei «circa 60 difetti» non era disponibile e non viene dichiarata chiusa.
