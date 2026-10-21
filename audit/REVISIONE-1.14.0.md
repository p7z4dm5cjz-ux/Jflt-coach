# Revisione linguistica e del correttore — 1.14.0

Data: 21 ottobre 2026. Base GitHub: `cde36f01aa36114bacbd56aa890252ca68aa00b0` (1.13.2).

## Esito e limiti

Questa revisione corregge **93 voci** della banca per competenze e un problema del correttore nel riordino. Il registro JSON allegato conserva consegna, soluzione, alternative e spiegazione prima e dopo ciascuna modifica, con motivazione. Non aggiunge lezioni e non cambia l'algoritmo adattativo.

Il controllo automatico copre tutte le lezioni e le varianti generate nell'inventario descritto sotto. La revisione linguistica ha individuato e corretto i casi documentati, ma **non equivale a una validazione indipendente, voce per voce, di tutta la banca**. In particolare non dimostra l'assenza di altre alternative valide non elencate o di distrattori semanticamente sovrapposti. Le domande nuove di Groq non sono certificate da questa revisione; non è stata effettuata una chiamata reale al servizio.

## Inventario e copertura

| Fonte | Dimensione | Controllo effettuato |
|---|---:|---|
| Catalogo | 117 lezioni | Generazione degli esercizi per ogni lezione con variazioni 0–7 |
| Banca per competenze | 929 allenamenti + 582 verifiche | Soluzioni, varianti, distrattori; conservazione delle parole in tutti i riordini; istruzioni singolare/plurale; revisione linguistica con 93 voci modificate |
| Verifiche riservate assemblate | 762 voci | Soluzioni e varianti accettate dal correttore; alternative errate non accettate |
| Pretest | 45 domande | Stessi controlli sul correttore |
| Phrasal verbs | 211 schede | Esercizi generati: soluzioni, varianti, distrattori; controlli preesistenti sui distrattori curati |
| Negazioni e tempi di base | Generatori parametrizzati | Lettura dei modelli di costruzione e prove automatiche su tutte le varianti incluse |

I conteggi si sovrappongono: le verifiche assemblate includono parte della banca per competenze. Non vanno sommati come domande indipendenti. Le varianti generate possono condividere modelli e non costituiscono altrettante prove indipendenti di padronanza.

## Correzioni principali

- `used-to-train-1`: la soluzione completa è **getting up**, non getting. Istruzione e spiegazione ora corrispondono.
- Passivo dopo like: ammesse **being criticised/criticized** e **to be criticised/criticized**. Non è stata estesa indiscriminatamente questa regola a **would prefer**, che nell'esercizio richiede to eat.
- **Yet/already** e **over/above**: accettate le diverse letture quando il contesto non le esclude; spiegazione della differenza.
- Discorso indiretto: il backshift viene richiesto esplicitamente, senza presentarlo come obbligatorio in ogni situazione reale.
- Movimento, connettivi, tempi e quantità completate: contesti più precisi per rendere pertinente una risposta senza spacciare le altre forme per sempre scorrette.
- Avverbi, comparativi e accordo: rimossi distrattori grammaticalmente difendibili; staff members sostituisce staff dove il plurale deve essere inequivoco.
- Significato: a few non implica necessariamente sufficienza; il past continuous non implica necessariamente interruzione; had hoped non prova da solo il mancato risultato; il perfect continuous non garantisce che un'attività sia incompleta; le relative non consentono da sole di contare tutte le sorelle del parlante.
- Riordino: aggiunte collocazioni naturali di complementi e subordinate; eliminate quattro varianti che omettevano o cambiavano parole fornite. Le virgole non fanno fallire una variante approvata. Rimane necessario coincidere con una soluzione prevista: non si accetta qualsiasi permutazione.
- Consegne: eliminata la richiesta di una sola parola quando le varianti previste possono contenerne più di una; rese coerenti le restrizioni su modali e registro.

## Compatibilità

Gli ID e il numero delle voci restano invariati. Le risposte di riferimento delle voci `check` modificate restano invariate, così i confronti basati sugli stessi ID non cambiano chiave. Nessuna migrazione cancella progressi, bozze, impostazioni o token. Le sessioni già create possono conservare una copia dei vecchi esercizi: per vedere le nuove consegne va avviata una nuova sessione dopo l'aggiornamento.

## Verifiche riproducibili

- `npm run build`: rigenera Worker e manifest della cache.
- `npm run check`: coerenza dei file generati e della versione.
- `npm test`: 274 test, inclusi sei nuovi gruppi di regressione linguistica e di inventario.
- `npm run smoke`: controllo Chromium del sito locale, alle dimensioni mobile e desktop; non sostituisce una prova su Safari/iOS reale.

I test confrontano quanto il programma accetta con i dati attesi. Non valutano autonomamente se ogni frase sia buon inglese: la distinzione è essenziale.

## Riferimenti consultati per i casi dubbi

- Cambridge, [Prefer](https://dictionary.cambridge.org/grammar/british-grammar/prefer): prefer e would prefer hanno vincoli diversi.
- Cambridge, [Verb patterns](https://dictionary.cambridge.org/us/grammar/british-grammar/infinitive-verbs): differenze tra infinito e forma in -ing.
- British Council, [Reported speech: statements](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/reported-speech-statements): backshift e situazioni ancora attuali.
- Cambridge, [Adverbs and adverb phrases](https://dictionary.cambridge.org/uk/grammar/british-grammar/adverbs-and-adverb-phrases): collocazione degli avverbi.

Restano da validare attraverso uso reale e una revisione indipendente: copertura delle risposte libere non elencate, qualità delle domande generate da Groq e adeguatezza della difficoltà per il singolo studente. Questo aggiornamento non dichiara raggiunto automaticamente l'intero obiettivo didattico.
