# JFLT Coach 1.4.1 — correzioni verificate

15 ottobre 2026. Pacchetto completo derivato dalla 1.4.0, senza pubblicazione remota.

## Rettifica dopo il controllo di coerenza

Il ricontrollo del 15 ottobre ha riprodotto tre difetti nel primo pacchetto 1.4.1 e li ha corretti:

1. La regola can not non delimitava la fine di not: I can notice diventava I cannotice nella normalizzazione, facendo accettare la parola unita errata. Ora confronta parole complete e gestisce anche spazi multipli.
2. Un punto seguito da spazi o da un a capo non veniva rimosso prima del confronto. Ora gli spazi esterni sono tolti prima della punteggiatura finale: una risposta giusta non viene rifiutata per il solo spazio dopo il punto.
3. Nella banca precedente, put off poteva proporre rinviare un'azione come alternativa sbagliata a rimandare. Put off e hold off ora hanno opzioni esplicite in tutti i giri di variazione.

Sono aggiunti tre test riproducibili. Questo ZIP rettificato sostituisce il primo pacchetto 1.4.1; il numero di release resta 1.4.1. La cache ha una nuova impronta e aggiorna anche un'eventuale prima 1.4.1 già installata.

## Ambito della revisione

Sono stati riprodotti i cinque esempi del messaggio: advice senza articolo, would be working nel condizionale misto, having used dopo admitted, out per le luci che si spengono e contrazioni modali di have. La 1.4.0 li rifiutava. Le prove della 1.4.1 li accettano e continuano a rifiutare errori di forma e significato comparabili.

Il file esterno `revisione-1.4.0-difetti.md` e lo script esterno `verifica-groq.mjs` non erano disponibili. Questa è una revisione autonoma dei casi identificabili nei sorgenti, non la chiusura attestata di tutti i «circa 60 difetti» citati. Non è una certificazione di ogni possibile risposta corretta.

## Correzioni del correttore

| Punto | Comportamento della 1.4.1 | File / id |
|---|---|---|
| Advice | Accetta She gave me advice, some advice, a piece of advice, a bit of advice; rifiuta an advice e advices. | practice-bank.js · nouns-offline-1 |
| Risultato presente del condizionale misto | Accetta would work e would be working; il riferimento now e la consegna con would restano espliciti. | grammar-drills.js · mixed-conditionals-local-0 |
| Admit | Accetta using, having used, to using e to having used; rifiuta to use. | reporting-patterns-local-0 |
| Contrazioni di have | Espande should've, might've, would've, could've e must've, anche con apostrofo tipografico. Non accetta should of o un participio scorretto. | engine.js · normal |
| Altre negative | Riconosce shan't e can not; non fonde can not only con cannot only. | engine.js · normal |
| Avverbio usually | Accetta le posizioni iniziale e finale nei due riordini senza posizione obbligata. | adjective-patterns-local-3/4 |
| Altri visitatori | Accetta others e the others nel contesto non ulteriormente determinato. | other-another-local-3 |
| Preferenza | La consegna specifica l'infinito con to, evitando un giudizio generico su tutte le costruzioni con prefer. | preferences-local-1 |
| Ricordo passato | Accetta saving e having saved; la consegna richiede una forma in -ing. | verb-pattern-meaning-local-1 |
| Nome collettivo | La consegna specifica l'accordo singolare con Council come unità, invece di dichiarare impossibile ogni altro accordo. | advanced-present-local-4 |
| Passivo | Accetta anche The camera got repaired, con o senza by them. | passive-offline-0 |
| Anteriorità | Accetta Having finished e After finishing nel completamento del rapporto. | participles-offline-0 |
| Discorso indiretto | La consegna chiede di mantenere il past simple: where I worked. Il contesto temporale non viene lasciato implicito. | mixed-offline-1 |
| Costruzione con appear | Accetta to suggest e to be suggesting. | hedging-offline-1 |
| That di conseguenza | Accetta that oppure — per l'omissione consentita, indicata nella consegna. | so-such-local-4 |

Le risposte sono ancora confrontate con soluzioni e varianti dichiarate. Non è stato introdotto un correttore semantico arbitrario che accetti qualunque parafrasi. Maiuscole, contrazioni e punteggiatura finale continuano a essere normalizzate.

## Consegne

Sei esercizi prima anticipavano direttamente la risposta richiesta:

| Id | Modifica |
|---|---|
| imperatives-requests-local-3 | Una proposta completa con shall sostituisce il cloze che indicava già shall. |
| mixed-conditionals-local-3 | Richiede di trasformare una frase con if e should in una frase con inversione. |
| advanced-will-would-should-local-5 | Stessa trasformazione in un altro contesto. |
| generic-reciprocal-local-0 | Richiede di riscrivere la frase con un pronome senza genere, invece di fornire they nella consegna. |
| advanced-past-local-4 | Il suggerimento non contiene più la soluzione were. |
| advanced-word-order-local-2 | Riordino della frase intera al posto del solo pronome già suggerito. |

La frase con carefully è ora un **riordino nella forma neutra**, non una dichiarazione che ogni altra posizione sia scorretta. L'esercizio Only Anna did called chiede precisamente di togliere l'ausiliare superfluo. Sono esplicitati present perfect, conseguenza passata o ellissi dove il contesto precedente lasciava più letture.

## Phrasal verbs

- Le **50 nuove schede** hanno due distrattori scritti per ciascun contesto. Non sono più estratti casualmente da traduzioni che possono essere sinonime. Nei 211 giri simulati per ciascuna scheda le alternative restano quelle revisionate; l'interfaccia continua a mescolarne l'ordine.
- Per le **161 schede precedenti** è aggiunta l'esclusione delle voci con la stessa alternativa inglese, oltre al confronto della traduzione. Put off e hold off hanno ora due distrattori espliciti ciascuno. Non è dimostrato che siano eliminati tutti i sinonimi possibili nelle altre vecchie schede.
- Quindici schede di completamento hanno sedici varianti mirate, ad esempio fill in/out, get along/on, cut back/down on, set off/out, run away/off e knock down/over. La tabella esatta è PARTICLE_ALTERNATIVES in phrasal-extension.js.
- La scheda go-off-light è limitata allo spegnimento di una **luce**, dove sono ammessi off e out. Non si estende automaticamente go out a qualunque dispositivo.
- La spiegazione dopo il completamento mostra anche le varianti ammesse. Il recupero lessicale domanda esplicitamente l'espressione della scheda studiata, distinguendolo dal completamento con più soluzioni valide.

## Dati personali e aggiornamento

Le due occorrenze del cognome nelle errata MISSION 39–40 sono sostituite con `[nome omesso]`. Anche il Worker è rigenerato. Una ricerca nei sorgenti testuali del nuovo progetto non trova il cognome presente nella vecchia voce; il test non lo ricopia come stringa nel repository.

La modifica del pacchetto non rimuove automaticamente il dato da una versione già pubblicata o dalla cronologia Git. Per cambiare la versione servita occorre caricare questa release e attendere GitHub Pages e Cloudflare. Non è stata modificata la cronologia remota.

Database, vecchi id, bozze, impostazioni e progressi conservano il formato precedente. Le sessioni già salvate mantengono le vecchie consegne e soluzioni, senza ricalcolo retroattivo dei punteggi. Per provare la banca corretta avvia una nuova sessione.

## Richiesta Groq: cosa è verificato

`tools/ispeziona-richiesta.mjs` esegue il **vero Worker locale** e intercetta la chiamata provider prima della rete. Per esempio:

```bash
node tools/ispeziona-richiesta.mjs exercises mixed-conditionals
node tools/ispeziona-richiesta.mjs grammar_explain negatives
```

L'output mostra input, messaggi, contesto selezionato, schema, modello e parametri. La risposta Groq è simulata e dichiarata come tale; lo script non richiede credenziali e non consuma quota reale. Non è lo script esterno citato nella revisione e non è una verifica del tuo account.

I controlli confermano: una sola chiamata provider, solo la lezione pertinente nei riferimenti, modello `openai/gpt-oss-120b`, `reasoning_effort: low`, temperatura 0.55 per esercizi e 0.2 per gli altri compiti, massimo 4000 token per il tutor, JSON Schema rigoroso. La revisione delle istruzioni resta `groq-coverage-v5`.

**Limiti conservati:** un elemento che non rispetta il contratto fa rifiutare l'intero blocco da sei; la richiesta consuma quota. Non ci sono retry automatici né fallback a pagamento. Schema, campi e citazioni non dimostrano che una soluzione generata sia linguisticamente corretta. Non è stata effettuata una chiamata reale con il tuo account.

La documentazione ufficiale Groq consultata durante la verifica conferma il supporto dello schema rigoroso per i due modelli configurabili. Una segnalazione in un forum non dimostra da sola un difetto della richiesta di questa app: non è stata usata per cambiare una configurazione funzionante.

## Verifiche effettuate

- `npm run check`: superato; Worker e shell sincronizzati alla 1.4.1.
- `npm test`: **141/141**, inclusi 18 nuovi test con risposte indipendenti, controesempi errati, privacy, backup e ispezione delle richieste.
- Preparazione Cloudflare `--dry-run`: riuscita, **417.61 KiB** / gzip 80.15 KiB. La dimensione arrotondata coincide con la 1.4.0: **non è una prova della versione attiva**. Verifica app e Worker nelle Impostazioni.
- Archivio finale verificato separatamente con CRC, elenco completo, import relativi, byte dei sorgenti e impronte della shell.
- Nessun deploy remoto, nessuna chiamata reale a Groq, nessuna nuova prova di rendering o aggiornamento su Safari iOS. I test DOM e service worker sono simulati.

## Riferimenti

- [Groq — Structured Outputs](https://console.groq.com/docs/structured-outputs)
- [Cambridge — Contractions](https://dictionary.cambridge.org/grammar/british-grammar/contractions)
- [Cambridge — Admit](https://dictionary.cambridge.org/dictionary/english/admit)
- [Cambridge — Go off](https://dictionary.cambridge.org/dictionary/english/go-off)
- [Cambridge — Go out](https://dictionary.cambridge.org/dictionary/english/go-out)

Le fonti orientano regole e controlli; le frasi di esercizio restano materiale originale.
