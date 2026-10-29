# Pubblicazione privata e tutor

La versione Sites resta riservata al proprietario. Il ramo GitHub `codex/jflt-unified-1.18.3` conserva i sorgenti comuni e il Worker generato; la revisione non cambia le impostazioni di GitHub Pages né la visibilità del repository.

Il build privato esporta una copia della sorgente GitHub in `coach-src/`, registra repository e commit in `.openai/coach-source.json`, copia soltanto gli asset previsti e inserisce il profilo privato. Rigenera l'impronta della pagina e della cache senza modificare i sorgenti comuni. Nessun file dei progressi o secret entra nell'archivio di pubblicazione.

## Tutor con il proprio codice

Il Worker originale deve essere aggiornato dal proprietario Cloudflare con `npm run deploy:worker`. Conserva i secret già configurati `APP_TOKEN` e `GROQ_API_KEY`. Il file `worker/index.js` è generato da `npm run build:worker` e usa il prompt corrente. Il comando di deploy non viene eseguito senza autenticazione; non si usa un account temporaneo.

In alternativa, per usare il medesimo codice nel sito privato, configurare nei secret di Sites `APP_TOKEN` e `GROQ_API_KEY` e ridistribuire la versione salvata. L'app invia il codice; la chiave rimane sul server. Gli stessi sorgenti costruiscono il prompt. Una chiave `gsk_…` inserita nelle impostazioni può essere usata nella sessione, senza essere salvata sul server o nei backup.

Il collegamento di compatibilità al Worker esistente rimane disponibile per le altre attività; se non espone `path_feedback`, il percorso adattivo segnala che è precedente e usa la banca locale. La verifica `/health` non prova una risposta reale Groq: il comando «Verifica Groq» compie la chiamata reale. Le risposte simulate nei test non vengono descritte come collaudo del proprio account.

## Progressi

Nel vecchio sito: Impostazioni → Esporta backup JSON. Nel nuovo: Impostazioni → Importa un backup → controlla il riepilogo → Importa questo backup. L'importazione sostituisce i dati dell'indirizzo di destinazione: prima esportare quelli presenti. Pretest, livelli, percorsi, risposte, lessico e bozze sono conservati; il codice del tutor va reinserito perché non è nel backup.

## Controlli

`npm test`, `npm run check` e `npm run tags:check`. La nuova matrice controlla cicli reali dalla banca di base: 15 contesti diversi al livello 1, poi altri 15 al livello 2, per tutti i 17 argomenti. Gli altri 100 argomenti conservano la loro banca finita; nuovi contesti avanzati richiedono Groq. La nuova banca non certifica da sola il trasferimento in scrittura libera.

Sono controllati anche i casi 15 risposte corrette/2 contesti validi, contesti dei vecchi backup, guida priva di flag sul tentativo, blocchi AI ripetuti, prompt precedente, chiave lato server e migrazione senza perdita di dati. Test linguistici e paradigmi non garantiscono ogni futura risposta AI.

Nella sessione di preparazione non era disponibile né un'autenticazione Cloudflare né una chiave/codice Groq reale. L'aggiornamento del Worker originale e il collaudo con l'account personale rimangono da eseguire con le credenziali del proprietario.
