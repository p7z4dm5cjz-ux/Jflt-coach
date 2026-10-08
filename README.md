# JFLT Coach 0.2.4

L'app sceglie il punto di partenza con un pre-test di 45 domande anziché imporre le lezioni elementari. L'aggiornamento risolve anche il blocco «Manca il recupero del lessico selezionato»: un blocco grammaticalmente valido viene accettato con un avviso; il vocabolo omesso resta nel ripasso.

## Aggiornare l'app esistente

1. Esportare i dati da Altro e conservare il backup sul dispositivo.
2. Estrarre `jflt-coach-aggiornamento-0.2.4.zip`.
3. Nel repository GitHub caricare tutto il contenuto estratto nella radice, mantenendo le sottocartelle `worker` e `tests`. `index.html`, `app.js`, `learning.js`, `placement.js`, `placement-ui.js` e `bookshelf.js` sono nella radice; `policy.js` è dentro `worker`.
4. Confermare il commit sul ramo pubblicato. Attendere GitHub Pages e il deploy del Worker Cloudflare già collegato.
5. Chiudere e riaprire l'app senza cancellare i dati del sito. In Altro verificare la versione 0.2.4; in Oggi aprire il pre-test. Riprovare una generazione.

Non occorre creare un altro Worker né cambiare i segreti. Chiavi, token e backup non sono nel pacchetto. I dati e le impostazioni esistenti vengono mantenuti; i backup precedenti sono ancora importabili. Per una prima configurazione vedere SETUP.md.

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

84 test automatici superati, con risposte AI simulate. Comprendono una sessione completa di 45 domande, salvataggio/ripresa, soluzioni nascoste, adattamento delle priorità, phrasal verbs nel ripasso, backup e regressione del blocco lessicale. L'interfaccia è verificata con JSDOM. Bundle del Worker compilato interamente in locale con esbuild.

Da provare dopo la pubblicazione: generazione reale con Groq e uso su Safari/iPhone. Nessun nuovo deploy è stato eseguito da questa sessione. Il controllo Wrangler è stato bloccato dalla revisione automatica per il possibile invio di codice/metadati a Cloudflare; è stato sostituito dalla compilazione locale. Un browser reale non è disponibile nell'ambiente di verifica.

```sh
npm ci
npm test
```

## Architettura

Frontend statico su GitHub Pages, moduli JavaScript, IndexedDB e service worker. Cloudflare Worker ESM come proxy autenticato verso Groq; il modello è scelto dall'allowlist del progetto. I segreti GROQ_API_KEY e APP_TOKEN restano nelle impostazioni Cloudflare. Il token del dispositivo viene ricordato solo con scelta esplicita ed è escluso dai backup.

Il Durable Object BUDGET conserva solo contatori: dieci richieste al minuto, ottanta al giorno secondo la configurazione attuale. Quote o errori non causano retry automatici o passaggi a servizi a pagamento. Lo Studio è salvato in settings.main.learning; il pre-test è in learning.placement, con validazione anche nel ripristino.
