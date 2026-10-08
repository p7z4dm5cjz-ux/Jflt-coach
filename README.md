# JFLT Coach 0.2.1

Aggiornamento della web app già ospitata su GitHub Pages. Il frontend resta statico; la generazione e la correzione passano da un Worker Cloudflare a Groq. Non si collega a una conversazione ChatGPT e non richiede di copiare le risposte del tutor fra due app.

## Grafica 0.2.1

Nuovo tema locale in `theme.css`: sfondo caldo, verde petrolio, carte più ampie e variante scura automatica. La schermata Oggi mostra la lezione consigliata, uno scritto da riprendere e conteggi ricavati dai dati salvati. La barra principale apre Oggi, Studio, Scritti guidati, Lessico e Altro; l’archivio precedente e le richieste manuali restano raggiungibili. Gli esercizi sono numerati e la scrittura mostra il passaggio attuale. Le icone sono SVG locali e non sono aggiunti font, dipendenze o richieste esterne.

Il service worker usa una nuova cache e include il tema e le icone vettoriali. Il formato dei dati e le impostazioni del tutor non cambiano. Il Worker conserva la versione API 0.2.0: questo aggiornamento riguarda l’interfaccia.

Verifiche: suite automatica con percorsi DOM simulati, navigazione e caching. La resa grafica su Safari/iPhone richiede una prova sul dispositivo; l’anteprima in `design/anteprima.svg` illustra il tema e non è una cattura del browser.

## Funzioni aggiunte

- **43 lezioni**: fondamenta, tutti i principali tempi e loro contrasti, some/any, quantificatori, modali, condizionali, passivi, discorso indiretto, subordinate, coesione e argomentazione. Ogni lezione spiega quando scegliere una forma, con esempi a confronto ed errori frequenti.
- **Esercizi generati su richiesta**: allenamento di 6 o verifica di 10; almeno tre tipi, un cambio di contesto e una produzione personale. La richiesta include gli errori recenti, quelli dello scritto e il lessico selezionato. Le ripetizioni identiche vengono rifiutate; la novità concettuale e la qualità linguistica dipendono ancora dal tutor.
- **Lessico**: 161 verbi multi-parola e 60 termini/collocazioni iniziali, più quelli dai propri testi. Costruzione, registro, significato selezionato ed esempio originale. È una raccolta ampia, non un dizionario esaustivo; alcuni verbi sono preposizionali.
- **Parole cliccabili** nell'allenamento: significato, contesto e un altro esempio. Si può indicare “lo conosco” o “non lo conoscevo”. I termini elementari della lista di esclusione non vengono proposti come glossario.
- **Scrittura guidata**: consiglio → idee → lessico → scaletta → paragrafi → feedback → riscrittura → modello. La simulazione disattiva gli aiuti durante la stesura. Gli errori scelti si possono salvare nel ripasso.
- **Leggere e tradurre**: testo inglese → traduzione autonoma in italiano → confronto del significato → spiegazione di passaggi fraintesi → selezione dei termini sconosciuti. Il tutor non mostra il confronto prima del tentativo. Le parole selezionate tornano nelle richieste di esercizi.
- **Ripasso, progressi e settimana**: intervalli crescenti, piano di base e proposta del tutor, stesura lunga distribuita su due settimane. Aiuti, risposte dubbie e bozze non aumentano i risultati autonomi. Le verifiche consegnate non si possono modificare dopo aver visto il feedback.
- Archivio precedente e backup conservano lo stesso formato. Lo Studio è salvato in `settings.main.learning`; il ripristino originale resta atomico.

## Progressione e limiti didattici

Il carico proposto parte da 3 termini per blocco e arriva fino a 8 dopo pratica distribuita e almeno l'80% di risposte autonome corrette nelle ultime 30 valutate. Si abbassa se emergono difficoltà. Le soglie sono scelte dell'app, non risultati clinici o una scala CEFR/STANAG validata.

La lezione consigliata tiene conto degli ultimi tentativi senza aiuti. Può progredire fino alle lezioni complesse; tutti gli argomenti restano accessibili. Un buon risultato negli esercizi non prova da solo l'uso spontaneo nello scritto. Nessun voto ufficiale JFLT viene assegnato dai nuovi percorsi.

I libri e le errata della versione precedente rimangono disponibili. Questo aggiornamento non costituisce una nuova lettura o verifica integrale dei quattro manuali. I range di parole sono intervalli di allenamento, non requisiti ufficiali JFLT verificati.

## Collegamento gratuito

Servono **Cloudflare Workers Free e Groq Free**, configurati una volta. Le API hanno quote, non sono illimitate: al raggiungimento del limite l'app si ferma e conserva il lavoro. Il codice non ha fallback verso altri provider o piani a pagamento; non può però verificare il piano di fatturazione dell'account, che deve restare Free.

La chiave `GROQ_API_KEY` viene inserita solo nei segreti Cloudflare. `APP_TOKEN` è un diverso codice personale, richiesto dall'app. Di default dura la sessione; si può ricordarlo sul proprio dispositivo con una scelta esplicita. Non entra nei backup. “Disconnetti” lo cancella.

Il Worker conserva soltanto i contatori di quota, con un massimo personale di 10 richieste/minuto e 80/giorno UTC. I testi e il contesto necessari alla correzione transitano su Cloudflare e vengono inviati a Groq; l'archivio dell'app resta nel browser. Il codice non registra testi nei log. Consultare anche le policy dei servizi per il trattamento da parte dei provider.

**Attivazione:** [SETUP.md](SETUP.md) oppure [istruzioni leggibili nel browser](SETUP.html).

## Articoli

Il link importa un **estratto di massimo 25 parole**, da BBC, Guardian, Reuters, AP, NPR o DW. Non legge l'intero articolo e non aggira paywall. L'utente può incollare un passaggio più lungo da studiare: per la quota gratuita sono consigliati 150–350 parole alla volta. Il limite locale dell'editor è 12.000 caratteri; richieste troppo grandi vengono fermate prima di Groq. Non tutti i siti consentono il caricamento automatico.

I termini sconosciuti sono suggeriti dal tutor e confermati dallo studente: non si presume che ogni parola difficile sia nuova per tutti.

## Verifiche effettuate il 7 ottobre 2026

- Test Node sulla logica, regressioni dei backup e del collegamento, schemi compilati con Ajv indipendente. Controlli del service worker in ambiente simulato: cache di altre app, ambito delle richieste e fallback offline.
- Test dell'interfaccia **JSDOM**: programma/ricerca, esercizi/glossario, verifica senza aiuti, scrittura/riscrittura, articoli/backup. Risposte AI simulate.
- `wrangler deploy --dry-run` eseguito con successo: bundle e binding Durable Object SQLite riconosciuti.

**Non verificato:** qualità delle risposte Groq reali (manca una chiave), pubblicazione Cloudflare/GitHub, layout e persistenza su Safari/iPhone, offline in un browser reale. Chromium non era disponibile e il suo download è fallito; `wrangler dev` locale si è fermato per un errore di sistema sulle interfacce di rete. La compilazione del Worker e i test del suo handler non sostituiscono queste prove.

```sh
npm ci
npm test
npx wrangler deploy --dry-run --outdir worker-build
```

Node 24 è la versione usata per le verifiche. Il frontend non ha dipendenze esterne o un passaggio di compilazione.

## File principali

| File | Funzione |
|---|---|
| `catalog.js` | Lezioni e lessico iniziale |
| `learning.js` | Schemi, controlli e progressione |
| `studio.js` | Nuove schermate e salvataggio |
| `theme.css` | Tema, interfaccia mobile e variante scura |
| `ui.js` | Icone vettoriali locali |
| `ai-client.js` | Collegamento al Worker e codice personale |
| `worker/index.js` | Autenticazione, quote e Groq |
| `worker/articles.js` | Estratti pubblici e controllo dei redirect |
| `wrangler.jsonc` | Configurazione Cloudflare, senza segreti |
| `tests/` | Verifiche riproducibili |

## Fonti di riferimento

Spiegazioni ed esempi sono originali. Le modalità di ripasso sono una scelta didattica coerente con la ricerca sulla pratica distribuita, non l'implementazione di un algoritmo dimostrato ottimale.

- [British Council: grammatica](https://learnenglish.britishcouncil.org/free-resources/grammar)
- [British Council: phrasal verbs](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/phrasal-verbs)
- [Cambridge: verbi multi-parola](https://dictionary.cambridge.org/grammar/british-grammar/verbs-multi-word-verbs)
- [Kim e Webb: meta-analisi della pratica distribuita](https://doi.org/10.1111/lang.12479)
- [Groq: output strutturati](https://console.groq.com/docs/structured-outputs)
- [Groq: quote](https://console.groq.com/docs/rate-limits)
- [Cloudflare: Workers Free e pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare: Durable Objects](https://developers.cloudflare.com/durable-objects/get-started/)
- [Cloudflare: segreti](https://developers.cloudflare.com/workers/configuration/secrets/)
