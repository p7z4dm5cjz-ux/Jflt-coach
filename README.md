# JFLT Coach 1.1.0

Pacchetto completo, 12 ottobre 2026. Aggiornamento del progetto funzionante pubblicato con il commit `4b4e084`: GitHub Pages, Worker Cloudflare `jflt-coach` e Groq restano gli stessi. Non cancellare il repository, il Worker o le credenziali.

## Le modifiche di questa release

- **Aggiornamenti coerenti:** ogni shell ha una cache distinta, identificata dalla release e dall'impronta dei file. Il service worker verifica anche il contenuto scaricato, non soltanto lo stato HTTP. Una risorsa essenziale assente o di un'altra revisione fa fallire l'installazione nuova senza modificare la cache precedente. Le icone e il manifest sono opzionali: un loro errore non blocca la shell. La nuova versione attende la conferma dell'utente prima di attivarsi.
- **Piano quotidiano:** priorità grammaticale e termini effettivamente in scadenza, in una sessione offline; poi una breve bozza per usare la struttura. Durata indicativa di 10, 20 o 30 minuti, selezionabile nelle Impostazioni. Il piano viene salvato quando lo inizi e resta stabile per la giornata; puoi riprendere sessione e bozza senza duplicarle. La bozza breve resta distinta dalle simulazioni complete.
- **Tema Automatico / Chiaro / Scuro**, con preferenza salvata, selettore nelle Impostazioni e pulsante rapido nella barra superiore. Automatico segue il dispositivo.
- **Avanzamento degli esercizi:** contatore live e barra persistente durante lo scorrimento, calcolati sul numero reale di domande, inclusi i recuperi lessicali. Non indica correttezza prima della consegna.
- **Cache di `/health` per 60 secondi**, limitata alla stessa pagina, indirizzo e codice personale. Richieste contemporanee condividono il controllo in corso. Cambio codice/indirizzo, errori di autenticazione, 503 e incompatibilità invalidano la cache. Il pulsante di verifica manuale effettua sempre un controllo nuovo.
- Esempi inglesi delle lezioni evidenziati rispetto alle spiegazioni italiane.
- **Icone JF navy uniformate:** `icon-master.svg` è il master vettoriale unico; le PNG 180/192/512 sono esportazioni dello stesso disegno, senza font esterni. Il collegamento iPhone dichiara esplicitamente `180x180`, e la barra di stato usa `default`. Il favicon SVG mantiene una PNG di compatibilità. Non è aggiunta una schermata d'avvio limitata a un solo modello di iPhone.

**Nessuna modifica alla richiesta Groq:** `worker/runtime.js` e `contract.js` sono identici alla revisione funzionante `groq-schema-v2`. Stessi prompt, schemi, modelli, parametri, limiti e una sola chiamata provider per operazione. Nessun retry automatico, cambio modello o fallback a pagamento. Nel Worker generato cambia soltanto il numero della release.

## Cosa viene conservato

Pretest di 45 domande, 59 lezioni, 161 phrasal verbs, scrittura con revisione/riscrittura/trasferimento, lettura, lessico personale e ripasso distribuito. Le priorità continuano a usare il pretest e i tentativi senza aiuti.

Database IndexedDB `jflt-coach`, versione 2: non viene cancellato né ricreato. I vecchi backup v2 senza piano o preferenza del tema e i backup v1 delle versioni 0.2.x restano importabili. Il backup nuovo include piani e preferenze, ma non il codice personale né la chiave Groq.

Le attività quotidiane completate non dimostrano padronanza. La lunghezza di una bozza non è un voto: risultati autonomi, revisione e trasferimento restano separati. Non sono ancora introdotti scenari narrativi nuovi, varianti parametrizzate offline o mini-rivalutazioni: sono interventi successivi.

## Aggiornamento dall'iPhone con Codespaces

1. Nell'app funzionante esporta un backup dei progressi.
2. Carica **lo ZIP**, non i singoli file, nella radice del [repository esistente](https://github.com/p7z4dm5cjz-ux/Jflt-coach) con **Upload files**, sul ramo `main`.
3. Torna al terminale del Codespace già usato. Esegui il blocco seguente. Si ferma se ci sono modifiche ai file tracciati, un backup con quel nome esiste già o un controllo fallisce. Non forza né cancella modifiche locali.

```bash
git pull --ff-only &&
git diff --quiet &&
git diff --cached --quiet &&
git branch backup-prima-1.1.0 &&
unzip -t jflt-coach-completo-1.1.0.zip &&
unzip -o jflt-coach-completo-1.1.0.zip &&
npm run check &&
npm test
```

4. Dopo i controlli riusciti, prepara e pubblica i soli file modificati, compresa la rimozione dello ZIP temporaneo:

```bash
git rm -- jflt-coach-completo-1.1.0.zip &&
git add -- README.md LEGGIMI-DIAGNOSI.md app.js engine.js storage.js tutor.js theme.css appearance.css index.html sw.js icon-master.svg icon-180.png icon-192.png icon-512.png package.json package-lock.json scripts/build-sw.mjs scripts/service-worker.js scripts/build-icons.mjs scripts/icon-assets.json scripts/check.mjs tests/client.test.mjs tests/daily.test.mjs tests/health-cache.test.mjs tests/offline.test.mjs tests/request-format.test.mjs tests/ui.test.mjs tests/worker.test.mjs worker/index.js &&
git commit -m "Piano quotidiano, tema scuro e aggiornamenti sicuri 1.1.0" &&
git push origin main
```

Se si ferma, leggi o condividi l'errore prima di proseguire. Il branch di backup conserva il commit precedente nel Codespace e il repository conserva la sua cronologia. Lo ZIP rimosso resta nel commit del caricamento e nella tua copia scaricata.

5. Attendi **GitHub Pages e Cloudflare** sul nuovo commit. Il comando Cloudflare resta **npx wrangler deploy**, dalla radice del progetto. Non cambiare secret, binding o migrazioni. Un push riuscito non conferma da solo il deploy.
6. Riapri [l'app](https://p7z4dm5cjz-ux.github.io/Jflt-coach/). Quando appare **Aggiornamento pronto**, premi **Aggiorna l'app**: il pulsante attende i salvataggi prima di ricaricare. Chiudi eventuali altre schede della vecchia versione. In Impostazioni app e Worker devono mostrare **1.1.0**. Poi prova Verifica Groq e una generazione completa.

La cache 1.1.0 viene installata solo quando tutti i file essenziali corrispondono alla revisione generata. Se Pages sta ancora pubblicando, la versione precedente continua a funzionare: riprova **Cerca aggiornamenti** dopo la pubblicazione. La compatibilità della risposta Worker resta controllata a ogni operazione.

## Sviluppo e controlli

Node 24 dalla versione 24.15.0. Le dipendenze sono le stesse della release precedente.

```bash
npm ci
npm run build
npm run check
npm test
npx wrangler deploy --dry-run --outdir worker-build
```

`npm run build` rigenera sia **worker/index.js** sia **sw.js**. Qualsiasi modifica a un file della shell richiede **build:sw**: `check` rifiuta una cache manifest non sincronizzata. `engine.js` resta la fonte del numero di release. La configurazione conserva il binding **BUDGET**, la classe **Budget** e la migrazione SQLite **v1**.

Per modificare il logo, edita soltanto `icon-master.svg`, poi esegui **npm run build:icons** e **npm run build:sw**. L'esportazione usa ImageMagick se disponibile oppure il modulo Node `sharp`; questi strumenti servono solo a chi rigenera le immagini. Il pacchetto include già le PNG pronte e non aggiunge dipendenze all'app o al deploy. `check` controlla master, impronte e dimensioni delle tre esportazioni per impedire aggiornamenti parziali delle icone.

Test: **75 su 75 superati**. Coprono contratti Groq, errori provider, autenticazione, quota, migrazione e backup, flussi DOM, piano riprendibile, preferenze, avanzamento live, TTL/invalidation del controllo e installazioni offline incomplete/incoerenti.

Le prove DOM usano JSDOM e quelle del service worker un ambiente simulato con impronte reali dei file. **Non sono prove di rendering su Safari.** Non è stato possibile avviare il browser reale in questo ambiente; la verifica visuale e del passaggio da una versione installata su iPhone resta da fare dopo il deploy. Questa sessione non ha pubblicato sul tuo account e non ha fatto chiamate reali a Groq. Il flusso 1.0.0 precedente è stato confermato funzionante dall'utente.

## Materiali e limiti

Sintesi originali basate su Oxford Complete English Grammar, CAMPAIGN, MISSION e TARGET; i PDF non sono ridistribuiti. I rimandi e le errata restano nelle lezioni. Usa sempre dati fittizi negli scritti inviati al tutor.

Modelli supportati: **openai/gpt-oss-120b** e **openai/gpt-oss-20b**. La configurazione usa il primo; lo schema è `json_schema`, `strict: true`, revisione `groq-schema-v2`. Formato corretto non significa necessariamente inglese corretto. Limite personale: 10 richieste al minuto e 80 al giorno; `/health` non consuma quota Groq o contatore personale. Verifica Groq usa una chiamata. Nessuna chiamata AI parte automaticamente alla riconnessione.

`LEGGIMI-DIAGNOSI.md` conserva la descrizione storica della revisione Groq; per release, aggiornamenti e test correnti fa fede questo README.
