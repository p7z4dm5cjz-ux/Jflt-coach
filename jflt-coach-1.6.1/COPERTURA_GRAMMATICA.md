# Grammatica Test-English: integrazione in JFLT Coach 1.5.0

Aggiornamento del 15 ottobre 2026. Gli indici dei sei livelli sono stati ricontrollati il 15 ottobre; l'inventario dei 28 Grammar Shorts resta quello del 13 ottobre. Nessun deploy remoto eseguito da questa sessione.

## Stato attuale

- **113 lezioni e ripassi**: 59 precedenti e 54 moduli di ampliamento.
- **Nuovo comparativo avanzato**, `advanced-comparatives`: ordine formale con articolo, quantità numerabili/non numerabili, sostituzione that/those, riformulazione qualitativa ed equivalenza. Sei esercizi originali con motivazione.
- **226 voci di confronto**: 198 nei sei indici A1–C1, più 28 shorts, con ripetizioni. Il C1 ora contiene 11 voci; la tabella storica sotto conserva i conteggi del 13 ottobre.
- **30 esercizi con Groq su tutte le lezioni**, in cinque chiamate esplicite da sei, con obiettivi progressivi e recupero lessicale locale finale.
- **918 esercizi locali nella variante iniziale**: 30 per 17 lezioni; due o sei per le altre 96. Nei 16 nuclei ampliati, sei situazioni sono riprese in cinque operazioni. Non sono 30 contesti indipendenti e la rotazione dei soggetti non aumenta la misura del trasferimento.
- **Mappa, prerequisiti e spiegazione delle priorità**, con catalogo libero. Consultazione, pratica, risultati senza aiuti e verifiche distanziate sono distinti.
- **176 domande separate di verifica su 22 nuclei**: mini-rivalutazioni da dieci e prove da quattro. Riuso segnalato, intervalli 1/3/7/14/30 giorni, invito alla rivalutazione dopo quattro settimane. Non vengono certificati gli altri 91 argomenti.
- **Tre nuovi percorsi di scrittura dai libri**: MISSION saggio e rapporto, TARGET confronto argomentato; CAMPAIGN sostiene cronologia e rapporto. Sei controlli preparatori precedono le produzioni. I vecchi quattro percorsi restano riprendibili.
- **211 schede phrasal/sensi, 195 espressioni distinte**, con tre scenari e ripasso separato dei sensi. Non è stata aggiunta una nuova lista phrasal in questa release.

Le correzioni della 1.4.1 rettificata sono conservate: varianti valide, consegne, distrattori e dato personale omesso. La lista esterna completa dei «circa 60 difetti» non era disponibile e non viene dichiarata integralmente risolta.

## Integrazione del nuovo capitolo

| Livello | Argomento | Modulo app | Esercizi locali | Fonte |
|---|---|---|---:|---|
| C1 | Advanced comparative structures | `advanced-comparatives`, con basi `comparison` e `comparative-patterns` | 6 | [Test-English](https://test-english.com/grammar-points/c1/advanced-comparative-structures/) |

La riga nuova è distinta dalle valutazioni della 1.3.0: non è stata retroattivamente inclusa nelle 123 lacune di quell'inventario. La matrice aggiornata leggibile dal codice è `grammar-coverage.json`.

## Metodo e limiti

Le pagine di Test-English forniscono un riferimento per sequenza, forma, significato e contrasti. I testi, esempi ed esercizi dell'app sono originali: non è una copia del sito né un'integrazione con il suo sistema di correzione. MISSION, TARGET, CAMPAIGN e le sintesi Oxford restano i riferimenti dei libri disponibili.

«Ampliato» significa contenuti e attività identificabili, non equivalenza completa con tutte le soluzioni della fonte. Le collocazioni nominali restano una selezione; i sensi phrasal non garantiscono parità con tutti gli usi. Le schede avanzate non costituiscono un corso C1 certificato. Il pretest e le brevi verifiche campionano alcune conoscenze: non diagnosticheranno separatamente ogni lezione.

Gli esercizi AI sono confrontati con la soluzione e le varianti fornite dal modello. Una risposta dubbia può essere segnalata ed esclusa dalle priorità: non diventa automaticamente giusta. Schema JSON e citazioni controllate non garantiscono correttezza linguistica. Le prove provider sono simulate; il rendering Safari/iPhone e le nuove risposte reali Groq restano da verificare dopo il deploy.

## Conteggi storici del confronto al 13 ottobre

Gli stati nelle tre colonne centrali sono quelli della 1.3.0. Non sono percentuali di padronanza dello studente.

| Sezione | Voci | Nucleo 1.3 | Parziale 1.3 | Assente 1.3 | Voci ampliate 1.4 |
|---|---:|---:|---:|---:|---:|
| A1 | 36 | 22 | 10 | 4 | 14 |
| A2 | 41 | 25 | 9 | 7 | 16 |
| B1 | 41 | 21 | 15 | 5 | 20 |
| B1+ | 36 | 17 | 11 | 8 | 19 |
| B2 | 33 | 12 | 10 | 11 | 22 |
| C1 | 10 | 0 | 10 | 0 | 10 |
| Grammar shorts | 28 | 5 | 7 | 16 | 23 |
| Totale | 225 | 102 | 72 | 51 | 124 |

## Nuovi moduli, per tappa

### Fondamenta

| Modulo | Id verificabile | Controlli locali |
|---|---|---:|
| This/these, that/those e plurali | `demonstratives-plurals` | 6 |
| Genitivo, whose e nomi composti | `possessives-compounds` | 6 |
| Have: possesso, have got e ausiliare | `have-forms` | 6 |
| There, it e soggetti anticipatori | `there-it` | 6 |
| Ordini, permesso, offerte e richieste cortesi | `imperatives-requests` | 6 |
| Luogo, percorso e confini | `space-movement` | 6 |
| And, but, or, so e because | `basic-connectors` | 6 |

### Controllo della frase

| Modulo | Id verificabile | Controlli locali |
|---|---|---:|
| Question tags: forma, polarità e significato | `question-tags` | 6 |
| So/neither, risposte brevi ed enfasi | `auxiliary-responses` | 6 |
| All/most/both, of e quantità zero | `quantifiers-of` | 6 |
| Too, too much/many e enough | `too-enough` | 6 |
| So, such e conseguenze con that | `so-such` | 6 |
| Other, another e alternative determinate | `other-another` | 6 |
| Do o make: collocazioni e significato | `do-make` | 6 |
| Get e go: costruzioni, non solo phrasal | `get-go` | 6 |
| Verbi di stato e significati dinamici | `stative-dynamic` | 6 |
| Tempo: for/since/from, during/while e scadenze | `time-contrasts` | 6 |
| Already, still, yet, ever e been/gone | `perfect-adverbs` | 6 |
| Aggettivi in -ed e -ing | `ed-ing-adjectives` | 6 |
| Ordine degli aggettivi, avverbi e aggettivi nominali | `adjective-patterns` | 6 |
| Quite, rather, fairly, pretty e probabilità | `degree-adverbs` | 6 |
| Verbo, aggettivo e nome con preposizione | `dependent-prepositions` | 6 |
| Prefer, would prefer, rather e sooner | `preferences` | 6 |
| Had better, it's time e urgenza | `had-better-time` | 6 |
| Need: necessità, libertà e azioni superflue | `need-past` | 6 |
| Sensi: proprietà, percezione e azione osservata | `perception` | 6 |
| Verbo + oggetto: make, let, allow, advise | `verb-object-patterns` | 6 |
| Remember, forget, stop, try e cambi di senso | `verb-pattern-meaning` | 6 |
| Ripasso graduato: eventi e piani | `review-foundation` | 6 |

### Frasi complesse

| Modulo | Id verificabile | Controlli locali |
|---|---|---:|
| Comparativi avverbiali, intensificatori e the ... the | `comparative-patterns` | 6 |
| One, singular they, riflessivi e reciprocità | `generic-reciprocal` | 6 |
| Condizionali misti, even if e inversione | `mixed-conditionals` | 6 |
| Gerundio e infinito: perfect, continuous e passivo | `complex-verb-patterns` | 6 |
| Futuro imminente, programmato e probabile | `future-alternatives` | 6 |
| Have/get something done e due oggetti | `causatives` | 6 |
| Reporting verbs: contenuto, fonte e costruzione | `reporting-patterns` | 6 |
| Whatever, whoever, wherever e however | `ever-relatives` | 6 |
| Ellissi, sostituzione e infinito ridotto | `ellipsis` | 6 |
| Verbi vicini: bring/take, come/go, lay/lie | `lexical-contrasts` | 6 |
| Scopo, ruolo, contrasto e aspettative | `discourse-contrasts` | 6 |
| Phrasal: scenari e significati distinti | `phrasal-scenarios` | 6 |
| Ripasso graduato: narrazione e conseguenze | `review-narrative` | 6 |

### Argomentazione e registro

| Modulo | Id verificabile | Controlli locali |
|---|---|---:|
| Presente avanzato: racconto, comportamento e tono | `advanced-present` | 6 |
| Passato avanzato: cortesia e prospettiva narrativa | `advanced-past` | 6 |
| Will, would, should: oltre il futuro | `advanced-will-would-should` | 6 |
| Capacità, possibilità, permesso e concessione | `advanced-ability-possibility` | 6 |
| Congiuntivo formale e forme remote | `advanced-subjunctive` | 6 |
| Perfect: riferimento, durata e risultato | `advanced-perfect` | 6 |
| Participiali: soggetti, anteriorità e risultati | `advanced-participles` | 6 |
| Fronting, inversione ed enfasi | `advanced-word-order` | 6 |
| Preposizioni: domande, relative e passivi | `advanced-prepositions` | 6 |
| Accordo avanzato: gruppi, quantità e collettivi | `advanced-agreement` | 6 |
| Ripasso graduato: prospettive e forme complesse | `review-perspective` | 6 |

## Matrice storica delle 225 voci, più il capitolo nuovo riportato sopra

Ogni riferimento indica dove studiare l'argomento, non equivalenza ufficiale con la pagina del sito. Gli id sono verificabili in catalog.js; l'elenco strutturato è in grammar-coverage.json.

### A1

Fonte: [indice A1](https://test-english.com/grammar-points/a1/).

| N. | Argomento | Stato 1.3 | Lezioni da consultare 1.4 | Intervento/limite |
|---:|---|---|---|---|
| 1 | Essere al presente | Presente* | `present-simple`, `questions`, `negatives` | Nucleo precedente; non parità integrale dichiarata. |
| 2 | Dimostrativi | Parziale | `pronouns`, `demonstratives-plurals` | Ampliato; non parità integrale dichiarata. |
| 3 | Pronomi soggetto e possessivi | Presente* | `pronouns` | Nucleo precedente; non parità integrale dichiarata. |
| 4 | Articoli e plurali | Parziale | `articles`, `nouns`, `demonstratives-plurals` | Ampliato; non parità integrale dichiarata. |
| 5 | Aggettivi di base | Presente* | `adjectives` | Nucleo precedente; non parità integrale dichiarata. |
| 6 | Presente semplice | Presente* | `present-simple` | Nucleo precedente; non parità integrale dichiarata. |
| 7 | Domande e interrogativi | Presente* | `questions` | Nucleo precedente; non parità integrale dichiarata. |
| 8 | Frequenza degli avverbi | Presente* | `adjectives` | Nucleo precedente; non parità integrale dichiarata. |
| 9 | Pronomi soggetto e oggetto | Presente* | `pronouns` | Nucleo precedente; non parità integrale dichiarata. |
| 10 | Genitivo e interrogativo possessivo | Da aggiungere | `possessives-compounds` | Ampliato; non parità integrale dichiarata. |
| 11 | Preposizioni temporali | Presente* | `prepositions` | Nucleo precedente; non parità integrale dichiarata. |
| 12 | Preposizioni di luogo | Presente* | `prepositions` | Nucleo precedente; non parità integrale dichiarata. |
| 13 | Capacità e permesso | Parziale | `ability`, `may-might`, `imperatives-requests` | Ampliato; non parità integrale dichiarata. |
| 14 | Presente progressivo | Presente* | `present-continuous` | Nucleo precedente; non parità integrale dichiarata. |
| 15 | Confronto dei presenti | Presente* | `present` | Nucleo precedente; non parità integrale dichiarata. |
| 16 | Imperativo | Parziale | `sentence`, `conditionals-real`, `imperatives-requests` | Ampliato; non parità integrale dichiarata. |
| 17 | Essere al passato | Presente* | `past-simple`, `past` | Nucleo precedente; non parità integrale dichiarata. |
| 18 | Passato semplice | Presente* | `past-simple`, `past` | Nucleo precedente; non parità integrale dichiarata. |
| 19 | Passato: negazioni e domande | Presente* | `past-simple`, `negatives`, `questions` | Nucleo precedente; non parità integrale dichiarata. |
| 20 | Infinito e gerundio | Presente* | `verb-patterns` | Nucleo precedente; non parità integrale dichiarata. |
| 21 | Desideri e offerte cortesi | Parziale | `some-any`, `imperatives-requests` | Ampliato; non parità integrale dichiarata. |
| 22 | Possesso con have got | Da aggiungere | `have-forms` | Ampliato; non parità integrale dichiarata. |
| 23 | Numerabilità e determinanti | Presente* | `nouns`, `some-any` | Nucleo precedente; non parità integrale dichiarata. |
| 24 | Costruzioni esistenziali | Da aggiungere | `there-it` | Ampliato; non parità integrale dichiarata. |
| 25 | Scelta tra there e it | Da aggiungere | `there-it` | Ampliato; non parità integrale dichiarata. |
| 26 | Posizione nello spazio | Parziale | `prepositions`, `space-movement` | Ampliato; non parità integrale dichiarata. |
| 27 | Quantità di base | Parziale | `quantifiers`, `some-any`, `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 28 | Comparativo degli aggettivi | Presente* | `comparison` | Nucleo precedente; non parità integrale dichiarata. |
| 29 | Superlativo degli aggettivi | Presente* | `comparison` | Nucleo precedente; non parità integrale dichiarata. |
| 30 | Futuro con will e shall | Parziale | `future-will`, `imperatives-requests` | Ampliato; non parità integrale dichiarata. |
| 31 | Futuro intenzionale | Presente* | `future-going-to` | Nucleo precedente; non parità integrale dichiarata. |
| 32 | Aggettivo oppure avverbio | Presente* | `adjectives` | Nucleo precedente; non parità integrale dichiarata. |
| 33 | Scelta dell'articolo | Presente* | `articles` | Nucleo precedente; non parità integrale dichiarata. |
| 34 | Congiunzioni di base | Parziale | `clauses`, `linkers`, `basic-connectors` | Ampliato; non parità integrale dichiarata. |
| 35 | Ordine della frase | Presente* | `sentence`, `questions` | Nucleo precedente; non parità integrale dichiarata. |
| 36 | Riferimenti con this e it | Parziale | `pronouns`, `demonstratives-plurals` | Ampliato; non parità integrale dichiarata. |

### A2

Fonte: [indice A2](https://test-english.com/grammar-points/a2/).

| N. | Argomento | Stato 1.3 | Lezioni da consultare 1.4 | Intervento/limite |
|---:|---|---|---|---|
| 1 | Forme interrogative | Presente* | `questions` | Nucleo precedente; non parità integrale dichiarata. |
| 2 | Domande soggetto e preposizioni | Parziale | `questions`, `prepositions`, `advanced-prepositions`, `auxiliary-responses` | Ampliato; non parità integrale dichiarata. |
| 3 | Confronto dei presenti | Presente* | `present` | Nucleo precedente; non parità integrale dichiarata. |
| 4 | Passato semplice | Presente* | `past-simple` | Nucleo precedente; non parità integrale dichiarata. |
| 5 | Confronto dei passati | Presente* | `past` | Nucleo precedente; non parità integrale dichiarata. |
| 6 | Scopo con to e for | Parziale | `clauses`, `verb-patterns`, `discourse-contrasts` | Ampliato; non parità integrale dichiarata. |
| 7 | Connettivi e collegamenti temporali | Presente* | `clauses`, `linkers` | Nucleo precedente; non parità integrale dichiarata. |
| 8 | Confronto dei futuri | Presente* | `future` | Nucleo precedente; non parità integrale dichiarata. |
| 9 | Accordi futuri | Presente* | `future-arrangements` | Nucleo precedente; non parità integrale dichiarata. |
| 10 | Relative identificative | Presente* | `relatives` | Nucleo precedente; non parità integrale dichiarata. |
| 11 | Perfetto presente | Presente* | `present-perfect-simple` | Nucleo precedente; non parità integrale dichiarata. |
| 12 | Perfetto oppure passato | Presente* | `perfect-simple` | Nucleo precedente; non parità integrale dichiarata. |
| 13 | Pronomi indefiniti | Presente* | `some-any`, `negatives` | Nucleo precedente; non parità integrale dichiarata. |
| 14 | Confronti aggettivali e avverbiali | Parziale | `comparison`, `adjectives`, `comparative-patterns` | Ampliato; non parità integrale dichiarata. |
| 15 | Eccesso e sufficienza | Parziale | `quantifiers`, `too-enough` | Ampliato; non parità integrale dichiarata. |
| 16 | Quantificatori | Parziale | `quantifiers`, `some-any`, `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 17 | Most, most of, the most | Da aggiungere | `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 18 | Infinito e gerundio | Presente* | `verb-patterns` | Nucleo precedente; non parità integrale dichiarata. |
| 19 | Costruzioni con go | Da aggiungere | `get-go` | Ampliato; non parità integrale dichiarata. |
| 20 | Obbligo e divieto | Presente* | `obligation`, `negatives` | Nucleo precedente; non parità integrale dichiarata. |
| 21 | Consiglio con should | Presente* | `obligation` | Nucleo precedente; non parità integrale dichiarata. |
| 22 | Condizionale reale e tempo | Presente* | `conditionals-real`, `clauses` | Nucleo precedente; non parità integrale dichiarata. |
| 23 | Pronomi e possessivi | Presente* | `pronouns` | Nucleo precedente; non parità integrale dichiarata. |
| 24 | Condizionale irreale presente | Presente* | `conditionals-unreal` | Nucleo precedente; non parità integrale dichiarata. |
| 25 | Passivo semplice | Presente* | `passive` | Nucleo precedente; non parità integrale dichiarata. |
| 26 | Abitudini passate | Presente* | `used-to` | Nucleo precedente; non parità integrale dichiarata. |
| 27 | Possibilità con might | Presente* | `may-might` | Nucleo precedente; non parità integrale dichiarata. |
| 28 | Preposizioni di movimento | Parziale | `prepositions`, `space-movement` | Ampliato; non parità integrale dichiarata. |
| 29 | Accordo con so/neither | Da aggiungere | `auxiliary-responses` | Ampliato; non parità integrale dichiarata. |
| 30 | Ripasso verbale A2 | Parziale | `mixed`, `review-foundation` | Ampliato; non parità integrale dichiarata. |
| 31 | Anteriorità passata | Presente* | `past-perfect-simple` | Nucleo precedente; non parità integrale dichiarata. |
| 32 | Discorso riferito | Presente* | `reported`, `indirect-questions` | Nucleo precedente; non parità integrale dichiarata. |
| 33 | Verbi con due oggetti | Da aggiungere | `causatives` | Ampliato; non parità integrale dichiarata. |
| 34 | Significati di get | Da aggiungere | `get-go` | Ampliato; non parità integrale dichiarata. |
| 35 | Scelta tra do e make | Da aggiungere | `do-make` | Ampliato; non parità integrale dichiarata. |
| 36 | Stato oppure azione | Parziale | `present`, `stative-dynamic` | Ampliato; non parità integrale dichiarata. |
| 37 | Sintassi dei phrasal | Presente* | `phrasal-basics` | Nucleo precedente; non parità integrale dichiarata. |
| 38 | Cessazione: no longer/anymore | Parziale | `negatives` | Ampliato; non parità integrale dichiarata. |
| 39 | Espressioni temporali simili | Da aggiungere | `time-contrasts` | Ampliato; non parità integrale dichiarata. |
| 40 | Possibilità: may/might | Presente* | `may-might` | Nucleo precedente; non parità integrale dichiarata. |
| 41 | Ausiliari principali | Presente* | `questions`, `negatives` | Nucleo precedente; non parità integrale dichiarata. |

### B1

Fonte: [indice B1](https://test-english.com/grammar-points/b1/).

| N. | Argomento | Stato 1.3 | Lezioni da consultare 1.4 | Intervento/limite |
|---:|---|---|---|---|
| 1 | Confronto dei presenti | Presente* | `present` | Nucleo precedente; non parità integrale dichiarata. |
| 2 | Scelta del futuro | Presente* | `future` | Nucleo precedente; non parità integrale dichiarata. |
| 3 | Passato oppure perfetto | Presente* | `perfect-simple` | Nucleo precedente; non parità integrale dichiarata. |
| 4 | Perfetto: risultato o processo | Presente* | `perfect-continuous` | Nucleo precedente; non parità integrale dichiarata. |
| 5 | Durata: during/for/while | Parziale | `prepositions`, `clauses`, `time-contrasts` | Ampliato; non parità integrale dichiarata. |
| 6 | Confronti aggettivali e avverbiali | Parziale | `comparison`, `adjectives`, `comparative-patterns` | Ampliato; non parità integrale dichiarata. |
| 7 | Uso degli articoli | Presente* | `articles` | Nucleo precedente; non parità integrale dichiarata. |
| 8 | Other e another | Da aggiungere | `other-another` | Ampliato; non parità integrale dichiarata. |
| 9 | Capacità nei diversi tempi | Presente* | `ability` | Nucleo precedente; non parità integrale dichiarata. |
| 10 | Obbligo e consiglio | Presente* | `obligation` | Nucleo precedente; non parità integrale dichiarata. |
| 11 | Pronomi riflessivi | Presente* | `pronouns` | Nucleo precedente; non parità integrale dichiarata. |
| 12 | Aggettivi in -ed/-ing | Da aggiungere | `ed-ing-adjectives` | Ampliato; non parità integrale dichiarata. |
| 13 | Tempi della narrazione | Presente* | `past`, `past-perfect` | Nucleo precedente; non parità integrale dichiarata. |
| 14 | Ripasso verbale B1 | Parziale | `mixed`, `review-narrative` | Ampliato; non parità integrale dichiarata. |
| 15 | Abitudini e adattamento | Presente* | `used-to` | Nucleo precedente; non parità integrale dichiarata. |
| 16 | Forme passive | Presente* | `passive` | Nucleo precedente; non parità integrale dichiarata. |
| 17 | Attivo oppure passivo | Presente* | `passive` | Nucleo precedente; non parità integrale dichiarata. |
| 18 | Deduzioni modali | Presente* | `deduction` | Nucleo precedente; non parità integrale dichiarata. |
| 19 | Condizione e tempo futuri | Presente* | `conditionals-real`, `clauses` | Nucleo precedente; non parità integrale dichiarata. |
| 20 | Ipotesi irreali presenti | Presente* | `conditionals-unreal` | Nucleo precedente; non parità integrale dichiarata. |
| 21 | Confronto dei condizionali | Presente* | `conditionals-real`, `conditionals-unreal` | Nucleo precedente; non parità integrale dichiarata. |
| 22 | Ipotesi irreali passate | Presente* | `conditionals-unreal` | Nucleo precedente; non parità integrale dichiarata. |
| 23 | Discorso riferito | Presente* | `reported`, `indirect-questions` | Nucleo precedente; non parità integrale dichiarata. |
| 24 | Infinito oppure gerundio | Presente* | `verb-patterns` | Nucleo precedente; non parità integrale dichiarata. |
| 25 | Quantificatori | Parziale | `quantifiers`, `some-any`, `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 26 | Distribuzione: all/both | Parziale | `quantifiers`, `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 27 | Alternative: both/either/neither | Parziale | `quantifiers`, `negatives`, `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 28 | Quantità nulla o libera | Parziale | `some-any`, `quantifiers`, `negatives`, `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 29 | Intensità con so/such | Parziale | `clauses`, `so-such` | Ampliato; non parità integrale dichiarata. |
| 30 | Relative identificative e aggiuntive | Presente* | `relatives` | Nucleo precedente; non parità integrale dichiarata. |
| 31 | Domande di conferma | Parziale | `questions`, `question-tags` | Ampliato; non parità integrale dichiarata. |
| 32 | Contrasto, scopo e causa | Presente* | `clauses`, `linkers` | Nucleo precedente; non parità integrale dichiarata. |
| 33 | Verbo e preposizione | Parziale | `prepositions`, `verb-patterns`, `dependent-prepositions` | Ampliato; non parità integrale dichiarata. |
| 34 | Aggettivo e preposizione | Parziale | `prepositions`, `dependent-prepositions` | Ampliato; non parità integrale dichiarata. |
| 35 | Consigli urgenti e it's time | Da aggiungere | `had-better-time` | Ampliato; non parità integrale dichiarata. |
| 36 | Durata e inizio del periodo | Parziale | `prepositions`, `time-contrasts` | Ampliato; non parità integrale dichiarata. |
| 37 | Aggettivi numerici composti | Da aggiungere | `possessives-compounds` | Ampliato; non parità integrale dichiarata. |
| 38 | Phrasal: gruppo 1 | Parziale | `phrasal-basics`, `phrasal-scenarios` | Ampliato — Nuovi sensi e scenari; non parità dimostrata con tutti gli usi ed esercizi dei tre gruppi. |
| 39 | Phrasal: gruppo 2 | Parziale | `phrasal-basics`, `phrasal-scenarios` | Ampliato — Nuovi sensi e scenari; non parità dimostrata con tutti gli usi ed esercizi dei tre gruppi. |
| 40 | Phrasal: gruppo 3 | Parziale | `phrasal-basics`, `phrasal-scenarios` | Ampliato — Nuovi sensi e scenari; non parità dimostrata con tutti gli usi ed esercizi dei tre gruppi. |
| 41 | Preferenze con rather/sooner | Da aggiungere | `preferences` | Ampliato; non parità integrale dichiarata. |

### B1+

Fonte: [indice B1+](https://test-english.com/grammar-points/b1-b2/).

| N. | Argomento | Stato 1.3 | Lezioni da consultare 1.4 | Intervento/limite |
|---:|---|---|---|---|
| 1 | Tipi di domanda | Parziale | `questions`, `indirect-questions`, `question-tags`, `auxiliary-responses`, `advanced-prepositions` | Ampliato; non parità integrale dichiarata. |
| 2 | Domande indirette | Presente* | `indirect-questions` | Nucleo precedente; non parità integrale dichiarata. |
| 3 | Funzioni degli ausiliari | Parziale | `questions`, `negatives`, `auxiliary-responses` | Ampliato; non parità integrale dichiarata. |
| 4 | Comparativi correlativi | Da aggiungere | `comparative-patterns` | Ampliato; non parità integrale dichiarata. |
| 5 | Perfetto: risultato o processo | Presente* | `perfect-continuous` | Nucleo precedente; non parità integrale dichiarata. |
| 6 | Aggettivi usati come nomi | Da aggiungere | `adjective-patterns` | Ampliato; non parità integrale dichiarata. |
| 7 | Ordine degli aggettivi | Parziale | `adjectives`, `adjective-patterns` | Ampliato; non parità integrale dichiarata. |
| 8 | Intensità con so/such | Parziale | `clauses`, `so-such` | Ampliato; non parità integrale dichiarata. |
| 9 | Tempi narrativi | Presente* | `past`, `past-perfect` | Nucleo precedente; non parità integrale dichiarata. |
| 10 | Posizione degli avverbi | Parziale | `adjectives`, `adjective-patterns` | Ampliato; non parità integrale dichiarata. |
| 11 | Futuro progressivo e perfetto | Presente* | `future-perfect` | Nucleo precedente; non parità integrale dichiarata. |
| 12 | Ripasso verbale B1+ | Parziale | `mixed`, `review-perspective` | Ampliato; non parità integrale dichiarata. |
| 13 | Condizionali reali e tempo | Presente* | `conditionals-real`, `clauses` | Nucleo precedente; non parità integrale dichiarata. |
| 14 | Condizionali irreali | Presente* | `conditionals-unreal` | Nucleo precedente; non parità integrale dichiarata. |
| 15 | Desideri e rimpianti | Presente* | `wish` | Nucleo precedente; non parità integrale dichiarata. |
| 16 | Aggettivi in -ed/-ing | Da aggiungere | `ed-ing-adjectives` | Ampliato; non parità integrale dichiarata. |
| 17 | Abitudini e adattamento | Presente* | `used-to` | Nucleo precedente; non parità integrale dichiarata. |
| 18 | Abitudini: would/used to | Presente* | `used-to` | Nucleo precedente; non parità integrale dichiarata. |
| 19 | Complementi verbali | Presente* | `verb-patterns` | Nucleo precedente; non parità integrale dichiarata. |
| 20 | Deduzioni sul passato | Presente* | `deduction` | Nucleo precedente; non parità integrale dichiarata. |
| 21 | Probabilità e avverbi | Parziale | `hedging`, `may-might`, `degree-adverbs`, `future-alternatives` | Ampliato; non parità integrale dichiarata. |
| 22 | Preferenze verbali | Da aggiungere | `preferences` | Ampliato; non parità integrale dichiarata. |
| 23 | Verbi di percezione | Da aggiungere | `perception` | Ampliato; non parità integrale dichiarata. |
| 24 | Passivo nei tempi | Presente* | `passive` | Nucleo precedente; non parità integrale dichiarata. |
| 25 | Passivo di attribuzione | Presente* | `reporting-passive` | Nucleo precedente; non parità integrale dichiarata. |
| 26 | Causativo di servizio | Presente* | `reporting-passive` | Nucleo precedente; non parità integrale dichiarata. |
| 27 | Verbi per riferire | Parziale | `indirect-questions`, `verb-patterns`, `reporting-patterns` | Ampliato; non parità integrale dichiarata. |
| 28 | Contrasto e scopo | Presente* | `clauses` | Nucleo precedente; non parità integrale dichiarata. |
| 29 | Relativi con -ever | Da aggiungere | `ever-relatives` | Ampliato; non parità integrale dichiarata. |
| 30 | Quantificatori estesi | Parziale | `quantifiers`, `some-any`, `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 31 | Avverbi temporali del perfetto | Parziale | `present-perfect-simple`, `negatives`, `perfect-adverbs` | Ampliato; non parità integrale dichiarata. |
| 32 | Necessità presente e passata | Parziale | `obligation`, `deduction`, `negatives`, `need-past` | Ampliato; non parità integrale dichiarata. |
| 33 | Grado degli avverbi | Da aggiungere | `degree-adverbs` | Ampliato; non parità integrale dichiarata. |
| 34 | Tempo futuro: azione conclusa | Presente* | `clauses`, `future` | Nucleo precedente; non parità integrale dichiarata. |
| 35 | Scelta tra do e make | Da aggiungere | `do-make` | Ampliato; non parità integrale dichiarata. |
| 36 | Doppie negazioni | Presente* | `negatives` | Nucleo precedente; non parità integrale dichiarata. |

### B2

Fonte: [indice B2](https://test-english.com/grammar-points/b2/).

| N. | Argomento | Stato 1.3 | Lezioni da consultare 1.4 | Intervento/limite |
|---:|---|---|---|---|
| 1 | Have: verbo e ausiliare | Presente* | `negatives`, `present-perfect-simple`, `reporting-passive`, `have-forms` | Ampliato; non parità integrale dichiarata. |
| 2 | Relazioni tra clausole | Presente* | `clauses`, `linkers` | Nucleo precedente; non parità integrale dichiarata. |
| 3 | Pronomi generici | Da aggiungere | `generic-reciprocal` | Ampliato; non parità integrale dichiarata. |
| 4 | Riflessivi e reciproci | Parziale | `pronouns`, `generic-reciprocal` | Ampliato; non parità integrale dichiarata. |
| 5 | Soggetti anticipatori | Da aggiungere | `there-it` | Ampliato; non parità integrale dichiarata. |
| 6 | Narrazione e abitudini | Presente* | `past`, `past-perfect`, `used-to` | Nucleo precedente; non parità integrale dichiarata. |
| 7 | Significati di get | Da aggiungere | `get-go` | Ampliato; non parità integrale dichiarata. |
| 8 | Connettivi del discorso | Presente* | `linkers`, `cohesion` | Nucleo precedente; non parità integrale dichiarata. |
| 9 | Speculazione e deduzione | Presente* | `deduction`, `hedging` | Nucleo precedente; non parità integrale dichiarata. |
| 10 | Inversione negativa | Presente* | `inversion` | Nucleo precedente; non parità integrale dichiarata. |
| 11 | Distanziamento e attribuzione | Presente* | `reporting-passive`, `hedging` | Nucleo precedente; non parità integrale dichiarata. |
| 12 | Passato con significato irreale | Parziale | `wish`, `preferences`, `had-better-time` | Ampliato; non parità integrale dichiarata. |
| 13 | Verbo, oggetto e complemento | Parziale | `verb-patterns`, `indirect-questions`, `verb-object-patterns` | Ampliato; non parità integrale dichiarata. |
| 14 | Alternative condizionali | Parziale | `wish`, `conditionals-real`, `mixed-conditionals` | Ampliato; non parità integrale dichiarata. |
| 15 | Condizionali combinati | Parziale | `conditionals-unreal`, `inversion`, `wish`, `mixed-conditionals` | Ampliato; non parità integrale dichiarata. |
| 16 | Condizionali misti | Parziale | `conditionals-unreal`, `mixed-conditionals` | Ampliato; non parità integrale dichiarata. |
| 17 | Permesso e necessità avanzati | Parziale | `ability`, `may-might`, `obligation`, `need-past`, `advanced-ability-possibility` | Ampliato; non parità integrale dichiarata. |
| 18 | Verbi di percezione | Da aggiungere | `perception` | Ampliato; non parità integrale dichiarata. |
| 19 | Infinito e gerundio complessi | Parziale | `verb-patterns`, `participles`, `reporting-passive`, `complex-verb-patterns` | Ampliato; non parità integrale dichiarata. |
| 20 | Scelta delle forme future | Presente* | `future`, `future-arrangements`, `future-perfect` | Nucleo precedente; non parità integrale dichiarata. |
| 21 | Futuro imminente o previsto | Parziale | `hedging`, `future`, `future-alternatives` | Ampliato; non parità integrale dichiarata. |
| 22 | Prospettiva futura dal passato | Presente* | `future-in-past` | Nucleo precedente; non parità integrale dichiarata. |
| 23 | Ellissi e sostituzione | Da aggiungere | `ellipsis` | Ampliato; non parità integrale dichiarata. |
| 24 | Nomi composti e possessivi | Da aggiungere | `possessives-compounds` | Ampliato; non parità integrale dichiarata. |
| 25 | Enfasi con frasi scisse | Presente* | `clefts` | Nucleo precedente; non parità integrale dichiarata. |
| 26 | Relative identificative e aggiuntive | Presente* | `relatives` | Nucleo precedente; non parità integrale dichiarata. |
| 27 | Clausole participiali | Presente* | `participles` | Nucleo precedente; non parità integrale dichiarata. |
| 28 | Passivo con due oggetti | Da aggiungere | `causatives` | Ampliato; non parità integrale dichiarata. |
| 29 | Genitivo temporale | Da aggiungere | `possessives-compounds` | Ampliato; non parità integrale dichiarata. |
| 30 | Aggettivi composti | Da aggiungere | `possessives-compounds` | Ampliato; non parità integrale dichiarata. |
| 31 | Nome e preposizione | Da aggiungere | `dependent-prepositions` | Ampliato — Selezione di collocazioni, non tutte le 50 della fonte. |
| 32 | Modifica dei comparativi | Parziale | `comparison`, `comparative-patterns` | Ampliato; non parità integrale dichiarata. |
| 33 | Infinito ridotto | Da aggiungere | `ellipsis` | Ampliato; non parità integrale dichiarata. |

### C1

Fonte: [indice C1](https://test-english.com/grammar-points/c1/).

| N. | Argomento | Stato 1.3 | Lezioni da consultare 1.4 | Intervento/limite |
|---:|---|---|---|---|
| 1 | Presenti: usi avanzati | Parziale | `present`, `advanced-present` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 2 | Passati: usi avanzati | Parziale | `past`, `past-perfect`, `advanced-past` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 3 | Modali: will/would/should avanzati | Parziale | `future-will`, `used-to`, `deduction`, `subjunctive`, `advanced-will-would-should` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 4 | Modali: capacità e possibilità avanzate | Parziale | `ability`, `may-might`, `deduction`, `advanced-ability-possibility` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 5 | Congiuntivo presente e passato | Parziale | `subjunctive`, `wish`, `conditionals-unreal`, `advanced-subjunctive` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 6 | Perfetti: usi avanzati | Parziale | `perfect-simple`, `perfect-continuous`, `past-perfect`, `future-perfect`, `advanced-perfect` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 7 | Participiali avanzate | Parziale | `participles`, `advanced-participles` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 8 | Ordine avanzato | Parziale | `inversion`, `clefts`, `advanced-word-order` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 9 | Preposizioni avanzate | Parziale | `prepositions`, `indirect-questions`, `advanced-prepositions` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |
| 10 | Accordo avanzato | Parziale | `sentence`, `quantifiers`, `relatives`, `advanced-agreement` | Ampliato — Introduzione avanzata strutturata e sei controlli locali, non corso C1 certificato. |

### Grammar shorts

Fonte: [indice Grammar shorts](https://test-english.com/grammar-points/shorts/).

| N. | Argomento | Stato 1.3 | Lezioni da consultare 1.4 | Intervento/limite |
|---:|---|---|---|---|
| 1 | Altezza: above/over | Da aggiungere | `space-movement` | Ampliato; non parità integrale dichiarata. |
| 2 | Contrasto: although/however | Presente* | `clauses`, `linkers` | Nucleo precedente; non parità integrale dichiarata. |
| 3 | Quantità e numero | Parziale | `nouns`, `quantifiers`, `quantifiers-of` | Ampliato; non parità integrale dichiarata. |
| 4 | Evitare soggetti doppi | Parziale | `relatives`, `sentence`, `demonstratives-plurals` | Ampliato; non parità integrale dichiarata. |
| 5 | Distribuzione: between/among | Da aggiungere | `space-movement` | Ampliato; non parità integrale dichiarata. |
| 6 | Direzione: bring/take | Da aggiungere | `lexical-contrasts` | Ampliato; non parità integrale dichiarata. |
| 7 | Pulizia: clean/wash | Da aggiungere | `lexical-contrasts` | Ampliato; non parità integrale dichiarata. |
| 8 | Direzione: come/go | Da aggiungere | `lexical-contrasts` | Ampliato; non parità integrale dichiarata. |
| 9 | Esperienza e assenza: been/gone | Da aggiungere | `perfect-adverbs` | Ampliato; non parità integrale dichiarata. |
| 10 | Scelta tra if/whether | Parziale | `indirect-questions`, `reporting-patterns` | Ampliato; non parità integrale dichiarata. |
| 11 | Sostituzione: instead/instead of | Da aggiungere | `discourse-contrasts` | Ampliato; non parità integrale dichiarata. |
| 12 | Possessivo oppure contrazione | Da aggiungere | `demonstratives-plurals` | Ampliato; non parità integrale dichiarata. |
| 13 | Periodo: last/next e articolo | Da aggiungere | `time-contrasts` | Ampliato; non parità integrale dichiarata. |
| 14 | Posare oppure giacere | Da aggiungere | `lexical-contrasts` | Ampliato; non parità integrale dichiarata. |
| 15 | Quantità: less/fewer | Presente* | `quantifiers` | Nucleo precedente; non parità integrale dichiarata. |
| 16 | Somiglianza e ruolo | Da aggiungere | `discourse-contrasts` | Ampliato; non parità integrale dichiarata. |
| 17 | Poche quantità e sufficienza | Presente* | `quantifiers` | Nucleo precedente; non parità integrale dichiarata. |
| 18 | Guardare e vedere | Da aggiungere | `perception`, `lexical-contrasts` | Ampliato; non parità integrale dichiarata. |
| 19 | Avverbio oppure modale | Da aggiungere | `degree-adverbs` | Ampliato; non parità integrale dichiarata. |
| 20 | Esperienza: never/ever | Parziale | `negatives`, `present-perfect-simple`, `perfect-adverbs` | Ampliato; non parità integrale dichiarata. |
| 21 | Contrasto e confutazione | Da aggiungere | `discourse-contrasts` | Ampliato; non parità integrale dichiarata. |
| 22 | Alzare e salire | Da aggiungere | `lexical-contrasts` | Ampliato; non parità integrale dichiarata. |
| 23 | Ricordare e dimenticare azioni | Parziale | `verb-patterns`, `verb-pattern-meaning` | Ampliato; non parità integrale dichiarata. |
| 24 | Riferire: say/tell | Presente* | `reported` | Nucleo precedente; non parità integrale dichiarata. |
| 25 | Provare e tentare | Da aggiungere | `verb-pattern-meaning` | Ampliato; non parità integrale dichiarata. |
| 26 | Limite: until/by | Presente* | `future-perfect`, `clauses` | Nucleo precedente; non parità integrale dichiarata. |
| 27 | Contrasto: whereas/while | Parziale | `clauses`, `discourse-contrasts` | Ampliato; non parità integrale dichiarata. |
| 28 | Desiderio, speranza, aspettativa | Parziale | `wish`, `discourse-contrasts` | Ampliato; non parità integrale dichiarata. |

## Fonti di approfondimento

Consultate il 13 ottobre 2026; sono rimandi pubblici, non copie di testi/esercizi.

- [Question tags](https://test-english.com/grammar-points/b1/question-tags/)
- [Preferenze](https://test-english.com/grammar-points/b1-b2/would-rather-would-prefer/)
- [Necessità presente e passata](https://test-english.com/grammar-points/b1-b2/neednt-dont-need-to-didnt-need-to-neednt-have/)
- [Due oggetti](https://test-english.com/grammar-points/a2/verbs-with-two-objects/)
- [Have got](https://test-english.com/grammar-points/a1/have-got/)
- [Get](https://test-english.com/grammar-points/a2/the-different-uses-of-the-verb-get/)
- [Go](https://test-english.com/grammar-points/a2/use-verb-go-english/)
- [Most/of](https://test-english.com/grammar-points/a2/most-most-of-the-most/)
- [Forme non finite complesse](https://test-english.com/grammar-points/b2/gerunds-infinitives-complex-forms/)
- [Ellissi](https://test-english.com/grammar-points/b2/ellipsis-and-substitution/)
- [Verbo/oggetto/complemento](https://test-english.com/grammar-points/b2/verb-object-infinitive-gerund/)
- [Futuri alternativi](https://test-english.com/grammar-points/b2/ways-express-future/)
- [Phrasal gruppo 1](https://test-english.com/grammar-points/b1/b1-phrasal-verbs-1-exercises-explanation/)
- [Phrasal gruppo 2](https://test-english.com/grammar-points/b1/b1-phrasal-verbs-2-exercises-and-explanation/)
- [Phrasal gruppo 3](https://test-english.com/grammar-points/b1/b1-phrasal-verbs-3-exercises-and-explanation/)
- [Usi avanzati del presente](https://test-english.com/grammar-points/c1/advanced-present-simple-and-present-continuous/)
- [Usi avanzati del passato](https://test-english.com/grammar-points/c1/advanced-past-simple-past-continuous-past-perfect/)
- [Modali will/would/should](https://test-english.com/grammar-points/c1/advanced-modal-verbs-will-would-and-should/)
- [Capacità/possibilità avanzate](https://test-english.com/grammar-points/c1/advanced-modal-verbs-can-be-able-to-may-might/)
- [Congiuntivo](https://test-english.com/grammar-points/c1/the-subjunctive-in-english-present-and-past/)
- [Perfect avanzati](https://test-english.com/grammar-points/c1/the-perfect-tenses-forms-and-uses/)
- [Participiali avanzate](https://test-english.com/grammar-points/c1/advanced-participle-clauses/)
- [Ordine avanzato](https://test-english.com/grammar-points/c1/advanced-word-order/)
- [Preposizioni avanzate](https://test-english.com/grammar-points/c1/prepositions-position-and-advanced-patterns/)
- [Accordo avanzato](https://test-english.com/grammar-points/c1/subject-verb-agreement-advanced-rules/)

## Verifiche e pubblicazione

157 test superati: suite precedente e nuove prove del percorso, con aspettative aggiornate dove cambia il prodotto. Controlli di sintassi, configurazione, versioni, copertura e impronte offline superati. Il Worker si prepara con dry-run; non è stato pubblicato. Il pacchetto finale è controllato con CRC, elenco completo, import e corrispondenza byte per byte dei sorgenti e della shell. Le prove di rete e DOM sono simulate, non una chiamata reale a Groq o un test Safari.

Per usare le modifiche bisogna aggiornare sia GitHub Pages sia il Worker Cloudflare alla 1.5.0. Istruzioni in README.md. Non cancellare progressi o credenziali; schema database e vecchi id sono conservati.
