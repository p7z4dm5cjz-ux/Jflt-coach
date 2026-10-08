# Attivare JFLT Coach 0.2.4

Se il tutor è già configurato, seguire prima **Aggiornare l’app esistente** nel README: non servono nuovi segreti né un nuovo Worker.

L'aggiornamento mantiene l'indirizzo `https://p7z4dm5cjz-ux.github.io/Jflt-coach/`. La pubblicazione va fatta sul repository esistente: non crearne uno nuovo e non cambiare dominio, così il browser ritrova l'archivio precedente.

Il pacchetto non contiene dati personali, backup, libri completi o chiavi reali. Non contiene neppure l'account Cloudflare o Groq: vanno collegati/configurati dal proprietario.

## 1. Prima dell'aggiornamento

Apri l'app attuale e usa **Altro → Esporta i dati**. Conserva il backup in File/iCloud. Non cancellare i dati del sito o il browser per forzare l'aggiornamento.

## 2. Aggiornare il repository GitHub esistente

Dal computer, estrai l'archivio completo e apri [il repository](https://github.com/p7z4dm5cjz-ux/Jflt-coach).

1. **Add file → Upload files**.
2. Carica i file estratti, conservando le cartelle `worker` e `tests`, e sostituisci i file esistenti. Non caricare `node_modules`, `.git`, `.wrangler`, backup o chiavi.
3. **Commit changes** sul ramo usato da Pages (attualmente verificare **Settings → Pages**). Non modificare la cartella o la fonte di pubblicazione già funzionante.
4. Attendi la conclusione del deployment Pages. Apri il sito in Safari, attendi l'aggiornamento, poi chiudi e riapri l'app. Deve comparire la scheda **Studio**.

Nel pacchetto frontend, `jflt-coach-frontend-0.2.4.zip`, ci sono solo i file per Pages. Il pacchetto completo include anche il Worker e i test, necessari per configurare il backend e riprodurre le verifiche.

## 3. Creare il servizio AI gratuito

Serve anche un account [Groq](https://console.groq.com/) sul piano **Free**. Crea una chiave API nella sua console. Non inviarla in chat, non inserirla su GitHub e non incollarla nel campo del codice personale dell'app.

Usa [Cloudflare Workers](https://dash.cloudflare.com/) sul piano **Free**. Nel progetto sono già configurati il Worker `jflt-coach-tutor`, il modello `openai/gpt-oss-120b` e il Durable Object SQLite per le quote. `ALLOWED_ORIGIN` è l'origine GitHub senza `/Jflt-coach/`: `https://p7z4dm5cjz-ux.github.io`.

### Dal computer con Wrangler

Nella cartella estratta, con Node 24 e un terminale:

```sh
npm ci
npm test
npx wrangler login
npx wrangler deploy
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put APP_TOKEN
```

`login` apre Cloudflare per l'accesso. `deploy` pubblica solo il Worker e la migrazione SQLite: non carica i backup. All'inizio il Worker non è operativo finché non inserisci entrambi i segreti.

Per `GROQ_API_KEY` incolla la chiave Groq nel prompt del terminale. Per `APP_TOKEN` usa un **diverso codice casuale di almeno 24 caratteri**, generato con il tuo gestore password. Conservalo: è quello che inserirai nell'app. I segreti non vanno scritti in `wrangler.jsonc`.

L'output del deployment fornisce un indirizzo simile a `https://jflt-coach-tutor.TUOSOTTODOMINIO.workers.dev`.

### Alternativa: collegamento GitHub da Cloudflare

In **Workers & Pages → Create application → Import a repository**, collega il repository esistente e il ramo aggiornato. Usa come comando di deploy `npx wrangler deploy`, con la radice del progetto come directory. La configurazione è `wrangler.jsonc`; non creare un sito Pages aggiuntivo su Cloudflare. Dopo la prima pubblicazione, aggiungi `GROQ_API_KEY` e `APP_TOKEN` come **segreti** nelle impostazioni del Worker e applica il nuovo deployment.

Le etichette del pannello possono cambiare: se non trovi l'importazione Worker, usa il percorso Wrangler. Non basta incollare soltanto `worker/index.js`: importa altri moduli e richiede il binding SQLite.

## 4. Collegare l'app una volta

Nell'app aggiornata apri **Studio → Tutor automatico** (anche da Altro).

1. Inserisci l'indirizzo HTTPS del Worker.
2. Inserisci il codice `APP_TOKEN`, **non** la chiave Groq.
3. Se è il tuo telefono personale, puoi scegliere **Ricorda il codice su questo mio dispositivo**. Di default dura solo la sessione. Il codice non viene esportato nei backup; “Disconnetti” lo rimuove.
4. Leggi e conferma l'informativa, poi **Salva e verifica il collegamento**.
5. Apri **Some, any, no e composti → Genera 6 esercizi nuovi**. Questa prima generazione verifica anche la chiave Groq e l'accesso al modello; il semplice controllo del collegamento non chiama Groq.

Non serve aprire ChatGPT per le sessioni quotidiane. L'app usa il modello Groq del Worker, non questa conversazione o il tuo abbonamento ChatGPT.

## 5. Prova reale su iPhone

Il pacchetto è testato con risposte AI simulate, non ancora con Safari reale o una chiave Groq.

1. In Safari verifica la scheda Studio e le spiegazioni; installa/riprendi l'icona Home dello stesso indirizzo.
2. Genera esercizi, apri una parola sottolineata e segnala un termine sconosciuto. Scrivi risposte, cambia schermata, torna e controlla che siano salvate.
3. Prova la verifica senza aiuti: niente glossario, indizi o feedback prima della consegna completa. Dopo la consegna le risposte restano ferme.
4. Fai il percorso di scrittura: idee, termini, scaletta, paragrafi, revisione, riscrittura e poi modello.
5. Incolla un breve articolo/passaggio in inglese, prova la traduzione, confrontala e salva una parola sconosciuta. Deve entrare nel lessico/ripasso e nei successivi esercizi.
6. Dopo un primo caricamento con rete, prova ad aprire Studio in modalità aereo. Puoi leggere e lavorare sulle bozze; le nuove generazioni/correzioni richiedono rete. Riattiva la rete prima di chiamare il tutor.
7. Esporta un nuovo backup e prova il ripristino. Controlla che comprenda anche Studio; il vecchio backup rimane importabile.

## Se il collegamento non funziona

| Messaggio | Controllo |
|---|---|
| Worker non configurato / 503 | Entrambi i segreti presenti e binding `BUDGET` applicato tramite Wrangler |
| Non autorizzato / 401 | Il codice nell'app deve coincidere con `APP_TOKEN`, non con la chiave Groq |
| Origin non consentita / 403 | Apri dal dominio GitHub corretto; `ALLOWED_ORIGIN` non contiene il percorso dell'app |
| Quota / 429 | Aspetta il tempo indicato; controlla la quota Free del tuo account, senza abilitare piani a pagamento |
| Contesto troppo lungo / 413 | Usa un passaggio di circa 150–350 parole, con traduzione essenziale |
| Risposta AI scartata / 502 | Nessuna risposta viene importata; riprova e conserva il messaggio, senza chiavi o codici, per il controllo |
| Ancora vecchia interfaccia | Attendi il deploy Pages; riapri l'app senza cancellare i dati del sito |

Le quote sono limiti, non una promessa di disponibilità illimitata. L'app conserva bozze e risposte quando il servizio si ferma e non fa retry automatici o fallback a pagamento.
