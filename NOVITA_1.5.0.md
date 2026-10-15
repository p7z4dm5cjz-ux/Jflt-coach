# JFLT Coach 1.5.0 — esito della revisione

15 ottobre 2026. Base: 1.4.1 rettificata. Il pacchetto è aggiornato; nessuna pubblicazione remota è stata eseguita.

## Modifiche effettive

| Area | Implementazione | Limite dichiarato |
|---|---|---|
| Percorso grammaticale | Mappa, gruppi di difficoltà, prerequisiti, motivo della proposta e catalogo libero. | Livelli orientativi dei gruppi, non equivalenze individuali CEFR. |
| Diagnosi | Pretest 45; verifiche da quattro; mini-rivalutazioni da dieci su cinque aree. | 176 domande separate su 22 nuclei; altri argomenti non vengono certificati. |
| Ripasso | Scadenze 1/3/7/14/30 giorni, un giorno dopo un errore, invito dopo quattro settimane. | Intervalli di prodotto; nessuna notifica esterna; domande finite e riuso segnalato. |
| Allenamento AI | Cinque obiettivi distinti selezionati dal Worker, sei esercizi per chiamata; errori e contesti precedenti trasmessi. | Non una verifica linguistica automatica del contenuto generato. |
| Offline | 30 esercizi in 17 lezioni; 918 operazioni totali nella variante iniziale del catalogo. | Nei 16 nuclei ampliati sei situazioni ricorrono in cinque operazioni. Le altre 96 lezioni conservano verifiche brevi e AI da 30. |
| Correzione | Normalizzazione unica pretest/esercizi/verifiche. Segnalazione della risposta AI dubbia, esclusa da punteggio e priorità. | La segnalazione non approva la risposta; serve una verifica linguistica. |
| Scrittura | MISSION saggio, MISSION/CAMPAIGN rapporto, TARGET confronto argomentato. Modelli diversi dalle tracce guidate. | Tracce finite; feedback AI, non valutazione certificata. |
| Passi preparatori | Sei controlli locali di comprensione, completamento, ordine e registro, poi tre frasi proprie. | I completamenti e riordini iniziali sono a scelta, prima della produzione libera. |
| Grammatica e bozza | Percorso dei libri aperto dalla lezione, focus inviato dal server, ritorno alla bozza. | Le costruzioni non vengono imposte quando il contesto non le richiede. |
| Lacuna avanzata | Comparativi avanzati, sei esercizi, matrice aggiornata a 226 voci. | Collocazioni nominali e sensi phrasal restano selezioni. |

I precedenti quattro percorsi di scrittura rimangono nei salvataggi, ma i nuovi avvii propongono i tre percorsi dei libri. Il cognome dell'agente rimane omesso; sono conservate le correzioni di risposte e distrattori della 1.4.1. La lista esterna integrale dei «circa 60 difetti» non era disponibile.

## Verifiche eseguite

- `npm run check`: sintassi, configurazione, versioni, 113 lezioni, Worker e impronte della shell sincronizzati.
- `npm test`: **157 test superati, zero fallimenti**. Include backup precedenti, stato alterato rifiutato, varianti grammaticali, separazione dei contesti, scadenze, modello/consegna e focus autorevoli, quote e risposte provider simulate.
- 25 prove DOM: navigazione, pretest, esercizi a blocchi, recupero lessicale, scrittura MISSION, mini-rivalutazione, verifica riprendibile, risposta contestata, autosave e ritorno alla bozza.
- Worker preparato con `wrangler deploy --dry-run`; nessun deploy reale e nessun cambio di credenziali, quote o modello.
- Archivio completo verificato con `scripts/check-package.mjs`: CRC, elenco completo dei file, confronto dei byte con i sorgenti, import relativi e impronte offline. Per ripetere il controllo, passare allo script il percorso dello ZIP.

## Verifiche che restano esterne

Non è stata eseguita una chiamata vera a Groq con il tuo account. Le prove intercettano il fetch e verificano la richiesta effettiva senza quota. Il modello mantiene configurazione e schema rigoroso funzionanti; la revisione delle istruzioni è `groq-path-v6`.

Non è stato possibile avviare Chromium/WebKit qui: i browser non erano installati e il tentativo di ottenere Chromium non è riuscito. I test DOM e service worker sono simulati, non prove di rendering o di aggiornamento su Safari/iPhone. Il pacchetto va quindi controllato anche sul dispositivo dopo il deploy.

La release si riconosce da **app 1.5.0 e Worker 1.5.0**, non dalla dimensione del caricamento. Per l'aggiornamento da Codespaces usare i comandi nel README, conservando repository e secret esistenti.
