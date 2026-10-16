# JFLT Coach 1.6.1 — correzioni didattiche

16 ottobre 2026. Base: 1.6.0 pubblicata su GitHub (commit 3bea30b). Nessuna modifica a Worker Groq, chiavi, quote o modello: cambiano solo contenuti, correzione delle risposte e testi del Worker (obiettivi dei blocchi ed esempio di formato).

## Risposte corrette che venivano rifiutate
- Esercizi: go on a walk, the other one, 4-day, should have done, in order to / so as to, explain to me the procedure, we haven't got any / we've got no, when I have arrived.
- Novità 1.6.0: experience of/with, concern over/at, agree to, protect against, solution for, whom, differences, co-operation, 'll / 're / 's going to, who/that nelle relative.
- Verifiche: You don't need to bring your own chair.
- Maiuscole: la correzione rispetta le maiuscole ma ignora il punto finale e gli spazi.

## Consegne precise o riscritte
- Indicano la forma richiesta: passivo al past simple, need + buy, stand al past simple, some o any.
- Among/between: nuova frase con parti distinte e nominate.
- Etichette che rivelavano la soluzione, tolte da 13 verifiche e da 1 esercizio (vocale, h muta, superlativo, ordinale, «(must/can/could, negativo)», «(mai)», «forma were», «tell», «usando that»).
- Verifiche indipendenti da pretest e allenamento: il divieto con must, le relative con where, look into, take notes, take into account, take responsibility, apologise for, what … look like.
- Phrasal verbs nelle verifiche: ora si riscrive la frase sostituendo il nome con un pronome (Turn it off), quindi si verifica la posizione del pronome.
- Maiuscole: si riscrive una frase intera invece di copiare la parola già mostrata.
- Esercizi delle preposizioni dipendenti che ripetevano la stessa costruzione nella stessa sessione: sostituiti (charged with, based on).

## Esercizi offline dei 16 nuclei dei tempi
- A ogni operazione cambia il complemento, quindi la soluzione non compare più in una consegna precedente della stessa situazione.
- Le frasi di negazione, domanda e correzione conservano l'espressione di tempo (every Monday, by this time tomorrow…).
- Nella correzione si accettano l'espressione di tempo all'inizio o alla fine, oppure omessa.
- Scelta multipla: le opzioni sbagliate sono forme corrette di altri tempi, escluse dal contesto (is checking, has checked…), non più forme agrammaticali.

## Scrittura dai libri
- Domande preparatorie: la risposta giusta cambia posizione e le opzioni sbagliate sono plausibili. Chi aveva un percorso a metà potrebbe dover rispondere di nuovo al passo 0.
- Rapporto MISSION: la nota sul modello distingue past simple (inspected) e past continuous (were blocking).

## Altro
- Phrasal verbs: 15 gruppi di significati equivalenti non compaiono più come opzione sbagliata l'uno dell'altro.
- Testi: «gli officers / inspectors / applicants», stato e non abitudine per know e own, travelled britannico spiegato, prefissi il-/ir-, take it into account obbligatorio, obiettivi dei blocchi adatti a ogni lezione, esempio di formato «Gli agenti».

## Verifiche
- `npm run check`: OK.
- `npm test`: 170 test superati. Ai 163 della 1.6.0 si aggiungono 7 test di regressione in `tests/fixes-1.6.1.test.mjs`.
- Aggiornamento simulato in Chromium dalla 1.6.0 alla 1.6.1: banner, dati conservati, nessun errore in console.
