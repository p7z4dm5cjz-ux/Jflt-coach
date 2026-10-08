# JFLT Coach 0.2.5

L'aggiornamento rende diagnosticabili i rifiuti Groq e distingue la verifica del Worker dalla prova reale del provider. Il messaggio «Groq non ha accettato la richiesta. Controlla modello, schema e quota nella console; nessun fallback a pagamento» appartiene al primo Worker compilato. Se compare ancora, verificare che anche Cloudflare abbia ricevuto il nuovo codice.

Restano il pre-test di 45 domande, il percorso adattivo e la correzione del blocco «Manca il recupero del lessico selezionato»: gli esercizi strutturalmente validi vengono accettati con un avviso; il vocabolo omesso resta candidato per il ripasso.

## Aggiornare l'app esistente

1. Esportare i dati da Altro e conservare il backup sul dispositivo.
2. Estrarre `jflt-coach-correzione-groq-0.2.5.zip`.
3. Nel repository GitHub caricare tutto il contenuto estratto nella radice, mantenendo le sottocartelle `worker` e `tests`. `index.html`, `app.js`, `learning.js`, `placement.js`, `placement-ui.js` e `bookshelf.js` sono nella radice; `policy.js` è dentro `worker`.
4. Confermare il commit sul ramo pubblicato. Attendere GitHub Pages. Se Cloudflare è collegato al repository, verificare che abbia pubblicato anch'esso il nuovo codice. Se il Worker è stato incollato a mano, sostituire tutto il suo codice con `worker-pronto/index.js` e pubblicare sullo stesso Worker. Non incollare il solo sorgente `worker/index.js`, che ha importazioni locali.
5. Chiudere e riaprire l'app senza cancellare i dati del sito. In Altro verificare la versione 0.2.5; in Tutor automatico salvare/verificare il collegamento, controllare la versione del Worker, poi premere **Verifica Groq**. Deve risultare Worker 0.2.5 e Groq verificato. Infine provare una lezione.

Non occorre creare un altro Worker né cambiare i segreti. Chiavi, token e backup non sono nel pacchetto. I dati e le impostazioni esistenti vengono mantenuti; i backup precedenti sono ancora importabili. Per una prima configurazione vedere SETUP.md.

## Controllo Groq

`GET /health` restituisce versione, modello e formato, senza chiamare Groq o consumare il contatore. `POST /check`, disponibile solo con codice personale e origine consentita, esegue una sola richiesta con output massimo di 200 token. Usa lo stesso modello e JSON Object Mode delle lezioni; non invia scritti, articoli o risposte dello studente. Il test passa solo se Groq restituisce il JSON di verifica atteso. Consuma una richiesta del contatore personale e una piccola parte della quota Groq.

Le risposte delle lezioni restano validate integralmente nel Worker e nell'app. La prova minima non dimostra la qualità didattica degli esercizi né la disponibilità di quota per un blocco lungo. Gli errori mostrano il codice HTTP e i dettagli sanitizzati del provider. Chiavi e `failed_generation` non vengono esposti. Le quote Groq e il limite personale sono distinti; il frontend conserva il motivo e il tempo di attesa. Nessun retry, cambio di modello o provider a pagamento avviene automaticamente. Il piano Free dell'account va mantenuto nella console del proprietario.

## Pre-test e percorso

45 domande originali: 14 tempi verbali, 8 negazioni/domande, 8 phrasal verbs, 3 controlli delle basi, 3 nomi/quantificatori, 3 modali, 3 frasi complesse, 3 costruzioni/connettivi. Alterna risposte a scelta e completamenti. Le domande e le opzioni hanno un ordine ripetibile per sessione; la sessione funziona offline dopo il primo caricamento.

Le risposte si salvano immediatamente. È possibile interrompere, riprendere, scegliere Non so e rivedere le risposte prima della consegna. Le spiegazioni restano nascoste fino alla consegna completa. Il risultato mostra errori, risposte corrette ma incerte, priorità e argomenti che si possono saltare provvisoriamente. Nessun livello ufficiale CEFR/JFLT/STANAG viene assegnato.

La priorità nasce dagli errori specifici. Una risposta positiva isolata normalmente richiede conferma; il controllo delle basi permette di saltare la parte su soggetto e pronomi quando tutte e tre le risposte sono corrette e sicure. I risultati successivi senza aiuti possono riaprire lezioni saltate o superare una difficoltà iniziale. I phrasal verbs sbagliati entrano nel ripasso; gli esercizi AI ricevono anche le difficoltà iniziali pertinenti alla lezione.

Le soglie sono criteri pratici dell'app, non scale validate. Il pre-test campiona gli argomenti: non dimostra la padronanza di tutti gli usi di ogni struttura. Per consolidare si usano verifiche nuove e la scrittura.

## Materiali didattici

`bookshelf.js` contiene sintesi originali dei passaggi pertinenti consultati nei quattro PDF forniti: Oxford, CAMPAIGN, MISSION e TARGET. Oxford guida strutture, usi e contrasti; i manuali operativi guidano contesti, rapporti, comunicazioni e argomentazione. Si distinguono pagine stampate e pagine del PDF, quando differiscono. Le errata già registrate prevalgono sulle formulazioni difettose.

Le lezioni mostrano i riferimenti e le sintesi. Il Worker ricostruisce il contesto dei libri dal catalogo, anziché fidarsi di riferimenti forniti dal client, e lo include nelle richieste di esercizi, scrittura e traduzione. Il genere dello scritto determina i passaggi pertinenti. Gli esempi e gli esercizi sono originali: non si distribuiscono i PDF o copie dei loro esercizi. Per le integrazioni avanzate si distingue il metodo di scrittura dai contenuti grammaticali originali dell'app. Questa è una lettura mirata dei passaggi utili, non una verifica integrale di ogni pagina dei quattro manuali.

Il programma comprende 59 lezioni, incluse 15 lezioni sui singoli tempi/costruzioni verbali e una lezione dedicata alle negazioni. Restano lessico crescente, parole cliccabili, scrittura guidata, simulazione senza aiuti, lettura/traduzione, ripasso, backup e percorsi precedenti.

## Correzione del recupero lessicale

L'assenza di un termine selezionato non è più un errore bloccante. Il Worker restituisce gli esercizi inalterati e un avviso. Il termine resta candidato per i blocchi successivi; non viene segnato come conosciuto o appreso. Non si eseguono chiamate AI aggiuntive e non si inseriscono parole a forza nelle frasi.

I controlli strutturali sugli esercizi restano attivi: schema, numero e tipi richiesti, completamenti con lacuna, soluzioni presenti nelle alternative, duplicazioni e citazioni. Le annotazioni incoerenti possono essere omesse. Questi controlli non certificano la correttezza semantica di ogni spiegazione AI.

## Verifiche

90 test automatici superati, con risposte AI simulate. Comprendono la verifica distinta Worker/Groq, il riconoscimento del vecchio backend, i rifiuti di parametri/chiave/modello/quota, autenticazione e contatori, assenza di invii aggiuntivi, una sessione completa di 45 domande, salvataggio/ripresa, adattamento delle priorità, backup e regressione del blocco lessicale. L'interfaccia è verificata con JSDOM. Bundle del Worker compilato interamente in locale con esbuild.

Da provare dopo la pubblicazione: verifica e generazione reale con Groq e uso su Safari/iPhone. Nessun nuovo deploy è stato eseguito da questa sessione, che non ha accesso agli account del proprietario. I test non usano una chiave Groq reale.

```sh
npm ci
npm test
```

## Architettura

Frontend statico su GitHub Pages, moduli JavaScript, IndexedDB e service worker. Cloudflare Worker ESM come proxy autenticato verso Groq; il modello è scelto dall'allowlist del progetto. I segreti GROQ_API_KEY e APP_TOKEN restano nelle impostazioni Cloudflare. Il token del dispositivo viene ricordato solo con scelta esplicita ed è escluso dai backup.

Il Durable Object BUDGET conserva solo contatori: dieci richieste al minuto, ottanta al giorno secondo la configurazione attuale. Quote o errori non causano retry automatici o passaggi a servizi a pagamento. Lo Studio è salvato in settings.main.learning; il pre-test è in learning.placement, con validazione anche nel ripristino.
