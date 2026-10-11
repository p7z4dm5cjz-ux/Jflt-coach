# JFLT Coach 1.0.0

Riscrittura completa dell'app e del tutor. L'app continua a usare GitHub Pages, il Worker Cloudflare **jflt-coach** e Groq. Il pacchetto contiene già il Worker aggiornato, la sua configurazione e i test.

**Pacchetto completo aggiornato il 10 ottobre 2026, revisione Groq `groq-schema-v2`.** Contiene l'intero progetto con la richiesta corretta e la diagnostica già integrate. Non richiede di applicare lo ZIP diagnostico separatamente. App e Worker mantengono il numero 1.0.0 per compatibilità; la revisione della richiesta è identificata separatamente.

## Pubblicazione sul tuo progetto esistente

1. Nell'app attuale esporta un backup dei progressi, poi estrai questo ZIP sul computer.
2. Apri [il repository Jflt-coach](https://github.com/p7z4dm5cjz-ux/Jflt-coach), scegli **Add file → Upload files** e carica nella radice i file estratti, comprese le cartelle **worker**, **legacy** e **scripts**. Conferma il commit su **main**. **index.html**, **package.json** e **wrangler.jsonc** devono essere direttamente nella radice del repository.
3. Attendi la pubblicazione GitHub Pages e la build Cloudflare collegata a **quel commit**. La build Cloudflare deve usare la radice del repository e il comando già configurato **npx wrangler deploy**.
4. Chiudi e riapri [JFLT Coach](https://p7z4dm5cjz-ux.github.io/Jflt-coach/). Apri **Impostazioni → Verifica collegamento Worker**: app e Worker devono entrambi mostrare **1.0.0**. Poi premi **Verifica Groq** e genera un blocco nella lezione che falliva: la prima prova usa un oggetto minimo, la seconda verifica il compito completo.

Il Worker usa ancora [lo stesso indirizzo](https://jflt-coach.crl-r90.workers.dev). I secret **GROQ_API_KEY** e **APP_TOKEN** già configurati restano nel servizio Cloudflare esistente. Il codice personale del tutor può essere recuperato dallo stesso dispositivo; se manca, va inserito in Impostazioni.

Una build riferita a un commit precedente non dimostra l'esito del nuovo aggiornamento. Verifica il commit della build. La risposta autenticata `/health` deve contenere `prompt_revision: "groq-schema-v2"` e `response_mode: "json_schema"`; il solo numero 1.0.0 non identifica questa revisione.

## Cosa cambia

- **Pretest di 45 domande**, interrompibile e riprendibile. Tempi, negazioni e phrasal verbs hanno più peso. Le risposte corrette ma incerte restano da confermare; le basi già controllate vengono lasciate fuori dalle priorità.
- **59 lezioni**, incluse le forme verbali singole, i confronti tra tempi e una lezione specifica sulle negazioni. Ogni lezione ha esercizi originali offline; Groq può generare blocchi misti nuovi.
- **Scrittura in un editor unico**: appunti e scaletta facoltativi, bozza, revisione ancorata a citazioni reali, riscrittura, confronto e tre esercizi in contesti nuovi. La simulazione separa la stesura autonoma dagli aiuti.
- **161 phrasal verbs ed espressioni multiword**: significato contestuale, particelle, posizione del pronome e registro. Gli esercizi riguardano il significato selezionato nella scheda.
- **Recupero del lessico separato**: se l'AI omette un termine selezionato, gli esercizi validi rimangono utilizzabili e l'app aggiunge una domanda locale per ogni parola da recuperare. Una semplice menzione non dimostra apprendimento.
- **Lettura e traduzione**, lessico personale, ripasso distribuito, risultati senza suggerimenti e backup.
- **Tutor verificabile**: collegamento Worker, versione del codice e risposta Groq hanno stati separati. Gli errori indicano se il problema riguarda codice personale, secret, modello, quota, risposta incompleta o connessione.

## Progressi e materiali

Sulla stessa origine web, l'app aggiorna l'archivio IndexedDB **jflt-coach** creando una nuova tabella. Conserva le tabelle precedenti, recupera scritti, letture, pretest e lessico e mantiene una copia dei record originali nei backup nuovi.

I backup **jflt-coach-backup/v1** delle versioni 0.2.x e quelli nuovi **v2** sono importabili. L'importazione viene validata prima della sostituzione dei dati della nuova app. Esporta prima il lavoro attuale. Il codice del tutor e la chiave Groq sono esclusi dai backup.

Le vecchie parole segnate come conosciute sono conservate, ma restano da verificare con recupero attivo. Il nuovo percorso non trasforma auto-valutazioni o vecchi tentativi non valutati in prove di padronanza.

Le sintesi si riferiscono a **Oxford Complete English Grammar**, **CAMPAIGN**, **MISSION** e **TARGET**, con rimandi e correzioni dei passaggi difettosi già individuati. Le spiegazioni e gli esercizi sono originali; i PDF dei libri non sono ridistribuiti. Alcuni rimandi sono indicazioni di consultazione, esplicitamente distinti dalle sintesi.

## Groq e funzionamento offline

Il backend invia una sola richiesta Groq per operazione, con **response_format: json_schema e strict: true**, modello esplicito e contratto validato anche nell'app. Ogni compito riceve istruzioni separate e uno schema con campi obbligatori. L'esempio degli esercizi contiene sei elementi; quello del confronto contiene tre esercizi e include la soluzione fra le risposte accettate. Non cambia automaticamente modello o provider e non usa fallback a pagamento. Sono supportati **openai/gpt-oss-120b** e **openai/gpt-oss-20b**; il modello configurato è il primo.

Lo schema vincola campi, tipi ed enumerazioni. Conteggi, lunghezze e corrispondenza fra soluzione e opzioni restano espliciti nel prompt e controllati dal Worker. Gli errori includono la fase diagnostica e, quando pertinente, il campo rifiutato. Il formato corretto non garantisce da solo la correttezza dell'inglese.

Il limite personale resta 10 richieste al minuto e 80 al giorno. I limiti del tuo account Groq possono essere più bassi. Il controllo del Worker non usa Groq; il pulsante **Verifica Groq** usa una richiesta. Nessuna richiesta AI viene inviata automaticamente alla riconnessione.

Dopo il primo caricamento completo, lezioni, pretest, esercizi originali, schede e bozze sono disponibili offline. Le correzioni AI richiedono la connessione. La lettura usa un passaggio incollato dall'utente, con fonte facoltativa.

Gli aggiornamenti successivi vengono proposti con un pulsante che attende il salvataggio prima del ricaricamento. Il passaggio dalle vecchie versioni 0.2.x attiva la nuova cache senza ricaricare a forza una bozza aperta; chiudi e riapri l'app per entrare nella nuova versione.

## Verifica e manutenzione del codice

Requisito per i test: Node 24 LTS, dalla versione 24.15.0. Il deploy Cloudflare già configurato usa Node 24.18.0.

~~~sh
npm ci
npm run build:worker
npm run check
npm test
~~~

**worker/index.js** è il file autonomo distribuito a Cloudflare. **worker/runtime.js**, **contract.js** e le sintesi dei libri sono i sorgenti usati dal comando **build:worker**. Dopo una modifica a questi sorgenti, rigenera il file e includilo nel commit.

La configurazione mantiene il binding **BUDGET**, la classe **Budget** e la migrazione SQLite **v1** esistenti. Il nome del servizio è **jflt-coach**.

Per verificare localmente la compilazione del Worker senza pubblicare:

~~~sh
npx wrangler deploy --dry-run --outdir worker-build
~~~

I test coprono flussi DOM, tutte le 45 domande, esercizi, recupero lessicale, scrittura e trasferimento, migrazione IndexedDB, backup, cache offline, autenticazione, CORS, quota, contratto Groq ed errori del provider.

Questo pacchetto contiene il codice verificato con **52 test su 52 superati**, controllo di configurazione e sincronizzazione riuscito e dry-run del Worker riuscito (138.11 KiB). Le prove del provider sono simulate; nessuna chiamata autenticata a Groq o pubblicazione sul tuo account è stata eseguita da questa sessione.

La build di prova non verifica la tua chiave Groq né il deploy sul tuo account. Il controllo reale dopo il deploy è **Impostazioni → Verifica Groq**, seguito dalla generazione degli esercizi e dalla prova del compito che falliva. Le verifiche UI automatiche usano JSDOM; la resa su browser e dispositivi reali resta da controllare.

Documentazione tecnica di riferimento: [API Groq](https://console.groq.com/docs/api-reference), [GPT-OSS 120B](https://console.groq.com/docs/model/openai/gpt-oss-120b), [configurazione Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/).
