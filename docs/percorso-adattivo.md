# Percorso adattivo — 1.11.0

## Avvio e riferimenti consultati il 19 ottobre 2026

Test-English organizza la grammatica per livello: A1 inizia con be, dimostrativi e pronomi; A2 con domande e confronti fra tempi. Queste sono sequenze editoriali, non prove che ogni adulto debba ripartire da A1.
- https://test-english.com/grammar-points/a1/
- https://test-english.com/grammar-points/a2/
- https://www.oxfordlearnersdictionaries.com/grammar/online-grammar/ (spiegazioni e pratica; non attribuiamo alla pagina un percorso diagnostico verificato).

JFLT mantiene il pretest già presente e la raccomandazione delle lezioni basata sui risultati. Il percorso guidato apre ora la pratica AI se il codice del tutor è presente e il browser è online. Altrimenti apre la pratica locale. Nessun reset dei dati. La scelta manuale della lezione rimane disponibile.

## Implementazione

Il profilo è ricalcolato dai dati salvati, distinto dalle valutazioni AI: evidenze del pretest e primi tentativi su frasi nuove, successi, errori, aiuti, competenze separate. Ripetizioni, contestazioni e domande AI non confermate sono escluse dalle nuove evidenze. I ripassi offline recenti vengono comunque inviati, marcati come review e assistiti, per orientare il recupero senza diventare nuove prove autonome. Vengono inviati al massimo 16 esempi; le statistiche conservano una vista più ampia. Non è una certificazione CEFR.

Ogni blocco resta di sei domande (massimo 30 per sessione), per compatibilità con salvataggi e recuperi lessicali. L'AI restituisce obiettivo, motivazione, competenza per domanda e riferimenti alle risposte. Con zero evidenze è richiesta una diagnosi; per avanzare occorrono almeno due successi autonomi citati. Non si impone più il livello tramite il numero del blocco. Il limite di due prove è una protezione pratica, non una soglia psicometrica calibrata.

Le valutazioni restano nella sessione e nei backup. Le domande confermate dal secondo passaggio AI sono già persistenti nelle sessioni: la banca personale le seleziona senza duplicare gli archivi, privilegiando errori e risposte assistite. Il ripasso personale è dichiarato guidato e non crea nuove prove autonome. Il controllo automatico non equivale a una revisione umana.

## Limiti e verifica

Il percorso adattivo decide il prossimo blocco all'interno della lezione selezionata. La selezione della lezione resta affidata al percorso esistente e ai risultati; non è un curriculum interamente pianificato da Groq. I risultati delle frasi ripetute non aumentano le nuove evidenze, ma non abbiamo una deduplicazione semantica delle parafrasi. La difficoltà delle nuove domande è proposta dal modello, non calibrata sperimentalmente.

Test locali coprono profilo, pretest, successi/errori, aiuti, ripetizioni, domande dubbie, schema effettivamente inviato dal Worker, riferimenti inventati, passaggio al secondo blocco, salvataggio, backup e uso offline. Le risposte Groq nei test sono simulate: la qualità didattica live va verificata con sessioni reali.

Il client richiede la feature adaptive_profile del Worker. Pubblicare insieme app e Worker 1.11.0. Nessun provider a pagamento aggiunto.
