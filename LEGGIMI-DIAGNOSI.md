# Richiesta Groq corretta e diagnostica

Nel pacchetto completo queste modifiche sono già integrate: segui il README
per pubblicare l'intero progetto. I tre file indicati sotto identificano i
sorgenti della correzione, senza richiedere un ulteriore aggiornamento separato.

Aggiornamento del 10 ottobre 2026. Questo pacchetto sostituisce il precedente
pacchetto diagnostico: aggiunge la correzione della richiesta oltre alla diagnosi.
La revisione serale corregge anche l'esempio di accept nel confronto degli scritti:
contiene ora la soluzione insieme alla variante, come richiesto dalle istruzioni.
È una patch compatibile con la 1.0.0 del repository pubblico Jflt-coach, verificata
al commit 52e2deb8cd4203cfb49d75934314a1c04934bfcf. Non è la release 1.0.1
preparata altrove e non va applicata sopra una versione differente senza confronto.

## Che cosa cambia nella richiesta

- Ogni chiamata contiene solo le istruzioni del compito selezionato:
  esercizi, revisione dello scritto, confronto, traduzione oppure chiarimento.
- `response_format` usa `json_schema`, con `strict: true`, invece di `json_object`.
  Ogni campo è obbligatorio; tutti gli oggetti dichiarano
  `additionalProperties: false`. Tipi ed enumerazioni sono espliciti.
- L'esempio degli esercizi contiene sei elementi, con scelta multipla,
  completamento, trasformazione e correzione. L'esempio del confronto contiene
  tre esercizi di trasferimento. Sono esempi di formato, non esercizi da copiare.
- Le istruzioni esplicitano `options: []` per i tipi diversi da choice,
  `accept` come elenco, la soluzione copiata da un'opzione anziché una lettera,
  i limiti dei campi, le varianti valide e il contesto necessario per risolvere.
- La revisione richiede testi nella griglia, distingue errori da stile e richiede
  citazioni letterali. Il confronto controlla davvero bozza e riscrittura.
- «Verifica Groq» usa lo stesso modo `json_schema` rigoroso, con un oggetto minimo.

Lo schema usa il sottoinsieme documentato da Groq: oggetti, elenchi, tipi,
enumerazioni, required e additionalProperties. Conteggi degli elenchi,
lunghezze dei testi e relazioni fra campi (per esempio answer presente in options)
sono istruiti nel prompt e restano verificati dal contratto del Worker.
Lo schema non dimostra la correttezza dell'inglese.

Documentazione verificata il 10 ottobre 2026:
https://console.groq.com/docs/structured-outputs
Groq documenta strict:true per openai/gpt-oss-120b e openai/gpt-oss-20b.

## Applicazione nella 1.0.0 esistente

Sostituisci questi tre file nel repository, mantenendo i percorsi:

1. `contract.js` nella radice.
2. `worker/runtime.js` nella cartella `worker`.
3. `worker/index.js` nella cartella `worker`.

Il file `worker/index.js` è già generato e pronto per il deploy Cloudflare.
Il caricamento della cartella `tests` è facoltativo per l'esecuzione dell'app,
ma necessario per portare anche i controlli automatici alla nuova richiesta.
Nello ZIP ci sono i due test aggiornati e il nuovo test del formato.

Attendi la build Cloudflare riferita al commit che contiene l'ultimo file Worker.
L'app e il Worker continuano a dichiarare 1.0.0 per mantenere la compatibilità.
La risposta autenticata `/health` identifica questa patch con:

```json
{
  "prompt_revision": "groq-schema-v2",
  "response_mode": "json_schema",
  "diagnostics_revision": "groq-reply-v1"
}
```

Non usare il solo numero 1.0.0 come prova che la patch è online. Il dry-run locale
ha prodotto 138.11 KiB; la dimensione nel log è un'indicazione, non una prova
autonoma della versione attiva.

## Prova reale dopo il deploy

Apri l'app, esegui «Verifica Groq», poi genera il blocco nella lezione che falliva.
La prima prova conferma il modo strutturato minimo; la seconda verifica il
compito completo. Per gli altri compiti prova la revisione e il confronto dello
scritto, la revisione della traduzione e il chiarimento di un termine.

Se una risposta viene rifiutata, il messaggio ora contiene «Diagnosi:» e distingue
richiesta rifiutata dal provider, risposta interrotta, JSON invalido e campo
respinto dai controlli. Per esempio `items[3].options` indica options del quarto
esercizio. Conserva il messaggio completo e il riferimento della richiesta.

La risposta HTTP include anche `diagnostics` con fase, stato del provider,
finish_reason, token dichiarati ed esito dei controlli. Nei nuovi dati diagnostici
non vengono inclusi chiavi, codice personale, prompt o testo dello studente.

## Verifiche e limiti

- 52 test su 52 superati; controlli di sintassi, configurazione e sincronizzazione
  del Worker superati; `wrangler deploy --dry-run` riuscito.
- I cinque compiti inviano lo schema corretto e preservano i dati dell'app.
  Gli esempi passano sia il JSON Schema sia i controlli di risposta.
- Campi mancanti e tipi errati sono rifiutati dagli schemi. Conteggi errati e
  una soluzione B estranea alle opzioni sono ancora rifiutati dal Worker.
- Il client 1.0.0 attraversa health e tutor e accetta le nuove risposte.
  Le regole dei backup e dell'accettazione dei risultati restano quelle della 1.0.0.
- Modello, parametri, budget personale e credenziali sono quelli esistenti.
  Il limite della risposta resta 4.000 token (250 per la verifica).
  Una sola chiamata Groq per operazione; nessun retry o fallback automatico.
- I test del provider sono simulati. Nessuna chiamata autenticata a Groq è
  stata eseguita da questa sessione e nessuna pubblicazione è stata effettuata.
  Il difetto della richiesta è verificato sul codice; la causa dello specifico
  errore precedente e la qualità delle risposte reali restano da confermare.
