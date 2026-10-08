// Contenuti originali di orientamento: non copie dei manuali dell'utente.
// I livelli sono tappe del percorso interno, non equivalenze ufficiali STANAG/CEFR.
export const STAGES = ["Fondamenta", "Controllo della frase", "Frasi complesse", "Argomentazione e registro"];
export const SOURCES = [
  ["British Council — grammatica", "https://learnenglish.britishcouncil.org/grammar"],
  ["British Council — phrasal verbs", "https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/phrasal-verbs"],
  ["Cambridge — verbi multi-parola", "https://dictionary.cambridge.org/grammar/british-grammar/verbs-multi-word-verbs"],
  ["British Council — forme del presente", "https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/present-tense"],
  ["British Council — forme del passato", "https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/past-tense"],
  ["British Council — esprimere il futuro", "https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/talking-about-future"],
  ["British Council — future continuous e perfect", "https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/future-continuous-future-perfect"],
  ["Cambridge — future perfect continuous", "https://dictionary.cambridge.org/grammar/british-grammar/future-perfect-continuous"],
  ["Ripasso distribuito — Kim e Webb (2022)", "https://doi.org/10.1111/lang.12479"]
];
const rows = [
  ["sentence",0,"word_order","Costruire una frase","Soggetto, verbo, complemento; accordo soggetto-verbo.","Nelle affermazioni parti normalmente dal soggetto; in inglese non lo ometti come in italiano. He/she/it richiede -s al present simple.","The officer checks the records.","The officers check the records.","Il soggetto cambia: cambia l'accordo, non l'ordine dei complementi.","Non scrivere Checks the records senza un soggetto, salvo un imperativo: Check the records."],
  ["nouns",0,"articles","Nomi, plurali e numerabilità","Countable, uncountable, singolare e plurale.","Un nome numerabile singolare normalmente vuole un determinante: a report, the report. Information, advice ed equipment sono normalmente non numerabili: usa some information, a piece of advice.","We received some information.","We received three reports.","Conta report, non information: cambia il nome o usa una unità di misura.","Evita an information, advices ed equipments nei significati ordinari."],
  ["articles",0,"articles","A, an, the oppure nessun articolo","Decidere se introdurre, identificare o generalizzare.","A/an introduce un elemento non identificato; the indica un referente identificabile; il plurale generico spesso non vuole articolo. A/an dipende dal suono successivo, non dalla sola lettera.","An officer contacted me.","The officer who contacted me was helpful.","Nella seconda frase il lettore può identificare quale ufficiale.","A university ma an hour; i nomi propri e le espressioni geografiche richiedono attenzione specifica."],
  ["pronouns",0,"word_order","Pronomi, possessivi e riflessivi","I/me, my/mine, myself; this/that e riferimenti.","Usa il pronome soggetto prima del verbo e quello oggetto dopo verbo o preposizione. My accompagna un nome; mine lo sostituisce. Il riflessivo si usa quando soggetto e oggetto coincidono, non per rendere più formale me.","She sent me her report.","The report is hers; she wrote it herself.","Hers sostituisce her report; herself sottolinea chi lo ha scritto.","Evita myself come sostituto automatico di I o me. Rendi chiaro a quale nome rimanda it/they."],
  ["some-any",0,"articles","Some, any, no e composti","Some/any; someone, anyone, nothing; any = qualunque.","Some è comune nelle affermazioni e nelle offerte o richieste orientate a un sì; any nelle domande aperte e nelle negative. Any affermativo può significare qualunque. No rende negativo il gruppo nominale senza aggiungere not.","Do you have any questions?", "Would you like some help?", "La prima domanda chiede se esistono domande; la seconda offre aiuto, non applica una regola meccanica 'domanda = any'.", "You may contact any office = qualunque ufficio; evita I don't have no information nell'inglese standard."],
  ["quantifiers",0,"articles","Much, many, few, little, all e each","Quantità, sufficienza e distribuzione.","Many/few accompagnano numerabili plurali; much/little non numerabili. A few/a little indicano una quantità presente, few/little una quantità scarsa. Each/every richiedono normalmente un nome singolare. Both riguarda due; either/neither due alternative.","We have a few witnesses.","We have few witnesses.","La prima comunica che alcuni testimoni ci sono; la seconda sottolinea che sono pochi.","Enough precede il nome ma segue l'aggettivo: enough time, clear enough. Less information, fewer reports."],
  ["adjectives",0,"word_order","Aggettivi e avverbi","Posizione, frequenza, modo e ordine degli aggettivi.","L'aggettivo modifica il nome; l'avverbio può modificare verbo, aggettivo o frase. Gli avverbi di frequenza precedono spesso il verbo lessicale, ma seguono be. L'ordine di molti aggettivi segue tendenze: non accumularli inutilmente.","She usually writes clear reports.","She writes reports clearly.","Clear descrive i rapporti; clearly il modo di scrivere.","Hard e hardly non sono equivalenti: lavora duramente contro quasi non. Good è aggettivo, well normalmente avverbio."],
  ["comparison",0,"word_order","Comparativi e superlativi","Confrontare dati, alternative e risultati.","Usa -er/-est oppure more/most secondo l'aggettivo; non entrambe le forme. As ... as esprime uguaglianza; less ... than una qualità minore. Specifica cosa confronti.","This route is safer than the other one.","This is the safest route available.","Comparativo tra alternative, superlativo all'interno di un gruppo identificato.","Evita more safer. Than introduce il secondo termine; then significa poi."],
  ["questions",0,"word_order","Domande e negazioni","Do, be, have; domande sul soggetto; tag questions.","Con un verbo lessicale al simple usa do/does/did e la forma base. Con be o un ausiliare già presente inverti soggetto e ausiliare. Nelle domande sul soggetto normalmente non aggiungi do.","Who called the witness?", "Who did the witness call?", "Nella prima who è soggetto; nella seconda è oggetto e serve did.", "Evita Did he went? e risposte brevi senza l'ausiliare appropriato: Yes, he did."],
  ["prepositions",0,"prepositions","Preposizioni di tempo, luogo e movimento","At/in/on, since/for, to/into; dipendenze lessicali.","At indica spesso un punto o un orario, on un giorno o una superficie, in un periodo o uno spazio. Since introduce l'inizio, for la durata. Alcune preposizioni dipendono dall'espressione: responsible for, depend on.","We arrived at the station on Monday.","We have worked here since Monday.","Arrived localizza un evento; since collega il periodo dal suo inizio fino al presente.","Non tradurre automaticamente da/in/su: at night, in the morning; arrive at/in, non arrive to."],
  ["present",1,"tenses","Present simple o continuous","Abitudine, situazione stabile, azione temporanea.","Il simple presenta abitudini, fatti o stati; il continuous un processo in corso o una situazione temporanea. Il contesto decide: non basta cercare now. I verbi di stato spesso non usano il continuous nel loro significato stativo.","She works in Rome.","She is working in Rome this week.","La prima descrive il lavoro abituale; la seconda un incarico temporaneo.","I know the answer, non I am knowing. Alcuni verbi cambiano significato: I think / I am thinking about it."],
  ["past",1,"tenses","Past simple o continuous","Evento concluso, sfondo e azione interrotta.","Il simple presenta eventi conclusi nella sequenza narrativa; il continuous descrive una situazione in corso a un momento passato. Non è una distinzione 'azione breve contro lunga': cambia il punto di vista.","I was checking the gate when the alarm sounded.","I checked the gate and then called the control room.","La prima offre uno sfondo interrotto; la seconda una sequenza di eventi.","Evita di mettere tutta una narrazione al continuous solo perché gli eventi sono durati a lungo."],
  ["perfect-simple",1,"tenses","Present perfect o past simple","Legame col presente oppure passato collocato e concluso.","Il present perfect collega un fatto al presente senza collocarlo in un momento passato concluso; il past simple lo colloca in un periodo passato concluso. Con today/this week conta anche come il parlante inquadra il periodo e l'evento.","I have lost my access card.","I lost my access card yesterday.","Nella prima il risultato è pertinente ora; yesterday nella seconda colloca esplicitamente l'evento nel passato.","Evita I have seen him yesterday. Nelle esperienze specificare quando porta normalmente al past simple; le varietà inglesi possono differire."],
  ["perfect-continuous",1,"tenses","Present perfect simple o continuous","Risultato/quantità oppure durata/processo recente.","Il simple mette in primo piano completamento e risultato; il continuous durata, attività o effetti di un processo recente. Gli stati normalmente vogliono il simple. Il continuous non implica sempre che l'attività continui ora.","I have written three reports.","I have been writing reports for two hours.","Tre risultati completati contro tempo dedicato al processo.","I have known her for years, non have been knowing. Specifica since quando o for quanto."],
  ["past-perfect",1,"tenses","Past perfect e past perfect continuous","Un evento o processo precedente a un riferimento passato.","Had + participio rende esplicita l'anteriorità; had been + -ing mette in evidenza la durata di un processo fino a quel punto. Se la sequenza è già chiara non servono past perfect in ogni frase.","The team had left before I arrived.","The team had been waiting for an hour when I arrived.","Partenza già completata contro attesa sviluppata prima dell'arrivo.","Mantieni un riferimento passato: il past perfect non è soltanto un 'passato molto lontano'."],
  ["future",1,"tenses","Will, going to e presente per il futuro","Decisione, previsione, intenzione, accordo e calendario.","Will è comune per decisioni immediate e previsioni; going to per intenzioni già presenti o evidenza; present continuous per accordi; present simple per calendari. Le forme possono sovrapporsi: spiega l'intenzione comunicativa.","I'll call her now.","I'm meeting her at ten tomorrow.","Decisione presa ora contro incontro organizzato.","Nelle subordinate temporali riferite al futuro usa spesso il presente: I'll call when I arrive, non when I will arrive."],
  ["future-perfect",2,"tenses","Future continuous e future perfect","Situazione in corso, risultato e durata entro un momento futuro.","Will be + -ing descrive un processo a un riferimento futuro; will have + participio un risultato entro quel momento; will have been + -ing una durata maturata fino a quel momento. Sono strumenti di significato, non ornamenti.","At ten, we will be interviewing the witnesses.","By ten, we will have interviewed the witnesses.","At ten: attività in corso. By ten: attività già conclusa entro il limite.","Non confondere by (entro) con until (fino a)."],
  ["used-to",1,"tenses","Used to, would, be/get used to","Abitudine passata oppure familiarità.","Used to + forma base descrive abitudini o stati non più attuali. Would può descrivere azioni abituali in un contesto passato, normalmente non stati. Be/get used to + nome/-ing indica familiarità o adattamento.","I used to work at night.","I am used to working at night.","Lavoravo abitualmente contro sono abituato: due significati e costruzioni diversi.","Dopo did: Did you use to ...? Dopo be used to: -ing, non infinito con to."],
  ["ability",1,"modals","Can, could e be able to","Capacità, possibilità pratica e successo specifico.","Can descrive capacità o possibilità attuale; could capacità generale passata o richiesta attenuata; be able to permette altre forme. Per un singolo successo affermativo passato usa spesso was able to/managed to, con eccezioni come verbi di percezione.","She could speak French as a child.","She managed to open the locked door.","Capacità generale contro risultato specifico riuscito.","I modali vogliono la forma base senza to: can speak, non can to speak."],
  ["may-might",1,"modals","May, might e could","Possibilità, incertezza e permesso.","May/might/could possono esprimere possibilità, senza percentuali fisse di certezza. May può anche concedere permesso; might spesso rende l'ipotesi più remota o prudente. Il contesto disambigua.","The delay may affect the operation.","You may enter after identification.","Possibilità di una conseguenza contro permesso di entrare.","May not può negare una possibilità o un permesso: verifica il significato, non tradurlo sempre come non puoi."],
  ["obligation",1,"modals","Must, have to, should, need e divieti","Obbligo, consiglio, necessità e assenza di obbligo.","Must/have to indicano obbligo; should consiglio o aspettativa. Mustn't vieta; don't have to/don't need to tolgono l'obbligo. La distinzione must/have to dipende anche dal contesto, non solo da chi impone la regola.","You must not disclose the password.","You do not have to attend the optional session.","Divieto di divulgare contro partecipazione non obbligatoria.","Non trattare mustn't e don't have to come sinonimi. Per obblighi passati usa spesso had to."],
  ["deduction",2,"modals","Deduzioni presenti e passate","Must/can't/might + infinito o have + participio.","Must esprime una deduzione forte; can't una conclusione di impossibilità; may/might/could una possibilità. Have + participio sposta la deduzione al passato. Should have può esprimere aspettativa disattesa o critica.","He must be at the briefing.","He might have missed the briefing.","Deduzione presente forte contro possibile evento passato.","La negazione deduttiva di must è normalmente can't, non mustn't. Needn't have done indica un'azione fatta ma non necessaria."],
  ["verb-patterns",1,"gerund_infinitive","Gerundio, infinito e complementi verbali","Enjoy doing, decide to do; verbi che cambiano significato.","Impara il verbo insieme alla sua costruzione. Dopo molte preposizioni serve -ing; altri verbi reggono l'infinito. Alcuni ammettono entrambe le forme con significati diversi.","I stopped talking to the witness.","I stopped to talk to the witness.","Ho interrotto il parlare contro mi sono fermato per parlare.","Look forward to hearing: to qui è preposizione. Remember doing richiama un ricordo; remember to do un compito da eseguire."],
  ["phrasal-basics",1,"formal_register","Phrasal verbs e altri verbi multi-parola","Significato, oggetto, posizione e registro.","Studia una espressione e un significato alla volta. Nei separabili, il pronome oggetto si inserisce tra verbo e particella; negli inseparabili resta dopo l'espressione. I verbi senza oggetto non si dividono. Un verbo può avere altri significati e costruzioni.","Please fill it in.","Please look into it.","Fill in separabile: it nel mezzo. Look into inseparabile: it alla fine.","Non tutti i verbi multi-parola sono informali; carry out e rule out sono utili anche in rapporti. La raccolta indica il singolo uso trattato."],
  ["conditionals-real",2,"conditionals","Condizionali zero e primo tipo","Regolarità e possibilità future reali.","If + presente, presente descrive regolarità; if + presente, will/modale/imperativo descrive una possibilità futura. Nella subordinata ordinaria non mettere will solo perché il riferimento è futuro.","If the sensor fails, the alarm stops.","If the sensor fails tonight, we will replace it.","Funzionamento abituale contro un'eventualità specifica futura.","Will dopo if può essere corretto per volontà o altri significati: non è un divieto assoluto. Prima apprendi l'uso ordinario."],
  ["conditionals-unreal",2,"conditionals","Secondo, terzo e condizionali misti","Distanza dalla realtà e ipotesi controfattuali.","Secondo: if + passato, would + forma base, per scenari remoti presenti/futuri. Terzo: if + had + participio, would have + participio, per un passato alternativo. I misti collegano tempi diversi: scegli in base a condizione e conseguenza.","If we had checked the map, we would not have got lost.","If I had accepted the post, I would be abroad now.","Conseguenza passata contro conseguenza presente di una condizione passata.","Non usare if + would have per il normale terzo condizionale. Were è comune nell'ipotetico formale: if I were."],
  ["wish",2,"conditionals","Wish, if only, unless e alternative a if","Desideri irreali e condizioni diverse.","Wish + passato esprime un presente diverso; wish + past perfect un rimpianto; wish + would spesso un cambiamento desiderato. Unless = a meno che, ma non sostituisce ogni if not. Provided that/as long as fissano condizioni.","I wish I knew the answer.","I wish I had checked the address.","Lacuna presente contro rimpianto passato.","Evita wish + will per un normale desiderio sul futuro: hope è spesso la scelta appropriata."],
  ["passive",2,"passive","Passivo: tempi, modali e agente","Mettere al centro l'evento o il destinatario dell'azione.","Il passivo usa be nel tempo appropriato + participio. Con un modale: modal + be + participio; al passato modal + have been + participio. Sceglilo quando l'agente non è noto, importante o è già chiaro.","The team inspected the vehicle.","The vehicle was inspected by the team.","Stesso fatto, centro informativo diverso. Non eliminare l'agente se serve a capire le responsabilità.","La forma being indica processo: is being inspected. Been non sostituisce being."],
  ["reporting-passive",3,"passive","Passivo impersonale e causativo","It is reported that; is believed to; have/get something done.","Le formule impersonali attribuiscono un'informazione: indica la fonte e non trasformare un'ipotesi in un fatto. Have/get + oggetto + participio descrive spesso un lavoro fatto svolgere ad altri, oppure un evento subito.","It is reported that the road is closed.","The road is reported to be closed.","Due costruzioni per la stessa attribuzione; to have been sposta l'evento riportato prima del riferimento.","I had the vehicle repaired non significa necessariamente che l'ho riparato io. Evita un passivo che nasconde informazioni essenziali."],
  ["reported",2,"reported_speech","Discorso indiretto, say/tell e backshift","Riferire affermazioni senza alterarne il senso.","Tell normalmente richiede chi riceve l'informazione: told me. Say può reggere il contenuto senza un destinatario: said that. Il cambio di tempo dipende dal riferimento e dall'attualità del contenuto; non è sempre obbligatorio.","She said that the gate was closed.","She told me that the gate was closed.","Con tell nomini il destinatario. That introduce il contenuto riferito, non una citazione diretta.","Here/there, today/that day cambiano solo se cambia il riferimento. Non correggere una forma accettabile senza conoscerlo."],
  ["indirect-questions",2,"reported_speech","Domande indirette e reporting verbs","Ordine affermativo; ask, advise, warn, deny, suggest.","Dopo Could you tell me... la domanda incorporata usa l'ordine affermativo. Le sì/no usano if/whether. Per riferire richieste/consigli impara le costruzioni del verbo: asked me to, suggested doing, denied doing.","Where is the briefing room?", "Could you tell me where the briefing room is?", "Nella subordinata is segue il soggetto; il punto interrogativo riguarda l'intera richiesta.", "Evita Could you tell me where is ...? Suggest non segue automaticamente il modello tell somebody to do."],
  ["relatives",2,"relatives","Relative restrittive e non restrittive","Identificare oppure aggiungere informazioni.","Le restrittive identificano il referente e non sono separate da virgole; le non restrittive aggiungono informazioni e vogliono le virgole. Who/which/whose/where dipendono dal ruolo. That normalmente non introduce una non restrittiva.","The officers who were on duty signed the log.","The officers, who were on duty, signed the log.","La prima seleziona un gruppo; la seconda presenta l'informazione come aggiuntiva sugli ufficiali già identificati.","Il pronome oggetto può essere omesso in alcune restrittive; il soggetto no. Non usare un doppio oggetto: the witness whom I interviewed him."],
  ["clauses",2,"connectors","Subordinate di causa, tempo, scopo e risultato","Because, since, while, so that, although; coordinare e subordinare.","Because introduce una proposizione; because of un gruppo nominale. So that può esprimere scopo, so ... that risultato. Although introduce concessione. When/while/before/after rendono esplicita la relazione temporale.","We postponed the exercise because it was unsafe.","We postponed the exercise because of the storm.","Proposizione con verbo contro gruppo nominale. Cambia la struttura, non solo il connettivo.","Evita although ... but nella stessa costruzione. Le subordinate devono avere una principale cui collegarsi."],
  ["linkers",2,"connectors","Connettivi e punteggiatura","However, therefore, moreover, nevertheless e paragrafi.","Un connettivo segnala un rapporto logico, non crea da solo una frase corretta. However non unisce due principali con una semplice virgola: usa un punto o un punto e virgola. Inizia un nuovo paragrafo quando cambia il nucleo dell'idea.","The route was shorter. However, it was unsafe.","Although the route was shorter, it was unsafe.","Due principali collegate contro principale con subordinata concessiva.","Evita la comma splice: The route was shorter, however, it was unsafe. Non aggiungere moreover se non c'è davvero un'informazione ulteriore."],
  ["participles",3,"relatives","Frasi participiali e relative ridotte","Sintetizzare mantenendo chiaro il soggetto.","Una relativa può talvolta ridursi con -ing o participio: officers working here, records stored here. In una participiale introduttiva il soggetto implicito deve corrispondere normalmente a quello della principale.","Having checked the gate, the officer called the team.","The records stored in this room are confidential.","Nella prima l'ufficiale compie entrambe le azioni; nella seconda stored descrive i documenti.","Evita il dangling modifier: After checking the gate, the alarm sounded suggerisce che l'allarme abbia controllato il cancello."],
  ["inversion",3,"word_order","Inversione e condizioni senza if","Rarely, not only, had/should/were.","Dopo alcuni elementi negativi o restrittivi iniziali inverti ausiliare e soggetto: Never have I ...; Not only did ... . Nei condizionali puoi omettere if con had/should/were e inversione, in registro formale.","Rarely do we encounter this problem.","Had we known, we would have acted sooner.","Enfasi restrittiva contro condizionale formale equivalente a if we had known.","Non invertire un verbo lessicale senza do quando serve. Usa l'enfasi con parsimonia e una funzione chiara."],
  ["clefts",3,"word_order","Frasi scisse e enfasi","It is ... that; what ... is; informazioni note e nuove.","Una scissa mette a fuoco un elemento: It was the timing that mattered. Una pseudo-scissa mette a fuoco un contenuto: What we need is more time. Usa l'enfasi per guidare il lettore, senza moltiplicare strutture pesanti.","The timing mattered most.","It was the timing that mattered most.","La seconda evidenzia timing, ad esempio per contrastarlo con il costo.","Controlla accordo e riferimento di what. L'enfasi non sostituisce una motivazione."],
  ["nominalisation",3,"formal_register","Nominalizzazione e registro formale","Spostare un processo verso un nome, senza oscurare l'agente.","Nominalizzare può rendere compatta una relazione: the team assessed → the team's assessment. Mantieni verbi concreti quando chiariscono chi fa cosa. Le frasi passive e nominali non sono obbligatorie in ogni rapporto.","The team assessed the risk before deployment.","The risk assessment preceded deployment.","La seconda compatta il processo, ma omette chi ha valutato: aggiungilo quando è rilevante.","Evita catene di nomi difficili da interpretare e parole formali non necessarie."],
  ["hedging",3,"formal_register","Hedging e gradi di certezza","Appears to, is likely to, suggests, evidence and limitations.","Distingui osservazioni, inferenze e raccomandazioni. Appears to/is likely to e may/might modulano una conclusione. Indica evidenza e limiti: attenuare una frase non rende attendibile una congettura senza dati.","The records show three access attempts.","This pattern may indicate an automated attempt.","Prima un dato verificabile; poi una possibile interpretazione, senza confonderli.","Non attribuire percentuali universali a may/might/could. Evita di attenuare un fatto certo o rendere certo un sospetto."],
  ["subjunctive",3,"formal_register","Congiuntivo formale e richieste","It is essential that; suggest that; should.","Dopo alcune espressioni di esigenza o raccomandazione, in registro formale è possibile la forma base: It is essential that he be informed. In inglese britannico è comune anche should + forma base. Il significato del verbo reggente conta.","It is essential that he be informed.","It is essential that he should be informed.","Due opzioni riconosciute; non penalizzare una varietà accettabile.","Suggest that non equivale sempre a richiedere: He suggests that she is wrong esprime una valutazione, non una raccomandazione."],
  ["cohesion",3,"connectors","Frasi intrecciate e paragrafi coerenti","Combinare relative, condizioni, concessioni e riferimenti.","Costruisci prima l'idea principale, poi aggiungi soltanto le relazioni necessarie. Ogni subordinata deve avere un ruolo chiaro. Pronomi, riprese lessicali e connettivi collegano le frasi; una catena molto lunga può andare divisa.","Although the road, which had been inspected earlier, appeared safe, the team postponed the convoy because visibility was poor.","The road had been inspected earlier and appeared safe. Nevertheless, poor visibility led the team to postpone the convoy.","Stessi rapporti logici con diversa distribuzione. Valuta chiarezza, non il numero di subordinate.","Controlla a cosa rimandano which/it/this; evita di ammassare cause, eccezioni e condizioni in una sola frase."],
  ["argument",3,"formal_register","Argomentare, confrontare e raccomandare","Tesi, evidenza, obiezione, risposta e conclusione.","Un paragrafo argomentativo presenta un'idea, la sostiene con ragioni/esempi e ne spiega la rilevanza. Un'obiezione va riconosciuta e valutata; una raccomandazione deve discendere dall'analisi. Integra le strutture già apprese.","Although the proposal would reduce costs, it may increase response times. A limited trial would therefore be preferable.","The proposal would reduce costs. However, its impact on response times remains uncertain; a limited trial is therefore recommended.","Entrambe confrontano vantaggio, limite e conseguenza pratica, con registro diverso.","Non scambiare un'opinione per un dato. Una forma complessa corretta non compensa una consegna non svolta."],
  ["mixed",3,"connectors","Ripasso misto e trasferimento nello scritto","Scegliere tra strutture senza sapere in anticipo la risposta.","Dopo gli esercizi mirati, alterna tempi, modali, quantificatori e subordinate. Spiega la scelta in rapporto al contesto. Poi scrivi un paragrafo senza obblighi artificiali e verifica quali strutture hai usato spontaneamente.","The team has completed the checks, but it may need to inspect the site again if conditions change.","The team completed the checks yesterday; a second inspection was requested after conditions changed.","Cambia il riferimento temporale e cambia anche il rapporto tra possibilità, condizione e narrazione.","Un uso corretto con suggerimenti non dimostra ancora autonomia. Le soglie dell'app sono interne, non voti ufficiali JFLT."]
];
const forms = {
  present:"Simple: I work / she works; I don't work / she doesn't work; Do you work? / Does she work? Continuous: am/is/are + -ing; she isn't working; Is she working? Be al simple: I am / she is / they are, senza do.",
  past:"Simple regolare: worked; irregolare: go/went, see/saw, write/wrote. Negativo: didn't + base; domanda: Did + soggetto + base? Continuous: was/were + -ing; wasn't working; Were they working? Be: was/were, senza did.",
  "perfect-simple":"Have/has + participio: have checked, has written. Negativo: haven't/hasn't + participio; domanda: Have/Has + soggetto + participio? Participi: go/gone, see/seen, write/written, take/taken, do/done; per i regolari: -ed.",
  "perfect-continuous":"Have/has been + -ing: has been working. Negativo: hasn't been working; domanda: Has she been working? Confronta has written (risultato) e has been writing (processo).",
  "past-perfect":"Had + participio: had left; hadn't left; Had they left? Continuous: had been + -ing; hadn't been waiting; Had they been waiting? Had non cambia con la persona.",
  future:"Will + base: will call; won't call; Will she call? Going to: am/is/are going to + base; isn't going to call; Is she going to call? Accordo: is meeting; calendario: the train leaves. Futuro visto dal passato: said she would call; was going to call.",
  "future-perfect":"Will be + -ing: will be working. Will have + participio: will have finished. Will have been + -ing: will have been working. Negazione: won't; domanda: Will + soggetto + resto della costruzione?",
  "used-to":"Used to + base; didn't use to + base; Did she use to work? Be/get used to + nome o -ing: is used to night shifts; is getting used to working at night. Would + base per azioni abituali narrate nel passato.",
  ability:"Can/could + base: can swim, couldn't enter, Could she enter? Be able to + base: is able to, was able to, has been able to, will be able to. Dopo can/could non usare to o -s.",
  "may-might":"May/might/could + base: may arrive, might leave, could change. Negazione: may not/might not; una domanda sul permesso può usare May I ...? I modali non richiedono do e non aggiungono -s.",
  obligation:"Must + base; mustn't + base per un divieto. Have/has to + base; don't/doesn't have to per assenza di obbligo; Do they have to ...? Should/ought to per consigli. Passato ordinario dell'obbligo: had to, non musted.",
  deduction:"Must/may/might/could/can't + have + participio: must have left; might have forgotten; can't have known. Must be waiting esprime una deduzione su un processo attuale. Should have + participio può indicare un dovere non rispettato.",
  "conditionals-real":"Zero: if + presente, presente. Primo: if + presente, will/modale/imperativo. If the gate is open, call the team. Con la subordinata prima della principale usa normalmente una virgola.",
  "conditionals-unreal":"Secondo: if + passato, would + base. Terzo: if + had + participio, would have + participio. Misto passato/presente: If we had checked, we would know now. Could/might possono sostituire would con significati diversi.",
  passive:"Be nel tempo richiesto + participio: is checked; was checked; has been checked; will be checked; must be checked. Processo: is/was being checked. Negazione dopo l'ausiliare; domanda con l'ausiliare prima del soggetto.",
  relatives:"Nome + who/which/that + proposizione restrittiva. Nome + virgola + who/which + informazione aggiuntiva + virgola. Whose + nome per possesso; where per un luogo. Il pronome oggetto può essere omesso in una restrittiva: the report I wrote.",
  clauses:"Because/although/when/while + soggetto + verbo. Because of/despite/in spite of + nome o -ing. So that + proposizione per scopo; so + aggettivo/avverbio + that per risultato. To/in order to + base per lo scopo del soggetto appropriato.",
  cohesion:"Progetta principale e relazioni: Although [concessione], [soggetto + relativa] [verbo principale] because [causa]. Poi valuta se dividere. Ogni clausola deve avere un soggetto/verbo riconoscibile o una riduzione grammaticalmente motivata."
};
// Percorsi separati per le forme, senza rimuovere gli ID delle vecchie lezioni
// di confronto: gli esercizi e i backup precedenti conservano i riferimenti.
const tenseRows = [
  ["present-simple",0,"Present simple","Affermare, negare e chiedere informazioni su abitudini e stati.","Usalo per routine, fatti generali e stati attuali. La terza persona singolare vuole -s. Confronta una funzione abituale con un'attività temporanea: la durata di un'azione, da sola, non decide il tempo.","I check / she checks; I don't check / she doesn't check; Do you check? / Does she check? Be: am/is/are, senza do.","The officer checks the access log every morning.","The officer is checking the access log at the moment.","Routine contro controllo in corso: il riferimento temporale cambia la scelta.","Dopo does/doesn't usa la forma base: Does she check?, non Does she checks?. Con be: Is she available?"],
  ["present-continuous",0,"Present continuous","Descrivere attività in corso e situazioni temporanee.","Usa am/is/are + -ing per un processo in corso o una situazione temporanea attorno al presente. Non occorre che l'azione avvenga esattamente mentre parli. Molti verbi di stato normalmente usano il simple.","I am checking; she is checking; they are checking. Negativo: isn't checking. Domanda: Is she checking?",
  "The team is reviewing witness statements this week.","The team reviews witness statements every week.","Un incarico temporaneo contro un'attività abituale.","Non omettere be. I know, non I am knowing; un verbo come think può però descrivere un'attività: I am thinking about the options."],
  ["present-perfect-simple",1,"Present perfect simple","Collegare esperienza, risultato o stato iniziato prima al presente.","Usa have/has + participio quando guardi un fatto precedente dal presente: esperienza, risultato pertinente o stato che continua. Se collochi l'evento in un momento passato concluso, normalmente passa al past simple.","I have checked; she has written. Negativo: hasn't written. Domanda: Has she written? Participi: taken, seen, gone, written.","The team has recovered the missing equipment.","The team recovered the missing equipment yesterday.","Risultato presentato come attuale contro evento collocato ieri.","Non confondere passato e participio: has written, non has wrote. Non usare normalmente il present perfect con yesterday o last Monday."],
  ["present-perfect-continuous",1,"Present perfect continuous","Mettere in evidenza durata, processo ed effetti recenti.","Usa have/has been + -ing per un'attività sviluppata fino al presente o appena terminata con effetti visibili. La durata è in primo piano. Per risultati contati o molti stati scegli invece il perfect simple.","I have been checking; she has been waiting. Negativo: hasn't been waiting. Domanda: Has she been waiting?",
  "The officer has been compiling the file for two hours.","The officer has compiled three files today.","Tempo dedicato al processo contro numero di risultati completati.","Il processo può essersi appena fermato: non è obbligatorio che continui ora. Usa have known, non have been knowing, nel significato ordinario di conoscere."],
  ["past-simple",0,"Past simple","Raccontare eventi conclusi con forme regolari e irregolari.","Usalo per eventi e stati collocati in un passato concluso, o per una sequenza narrativa. Il momento può essere espresso o già chiaro dal contesto. Nelle domande e negative did porta il passato e il verbo torna alla base.","We checked / went / wrote. Negativo: didn't check / go / write. Domanda: Did they go? Be: was/were, senza did.","The patrol reached the checkpoint at six yesterday.","The patrol has reached the checkpoint; the route is now clear.","Evento collocato ieri contro risultato guardato dal presente.","Did they go?, non Did they went?. Impara insieme base, passato e participio: write / wrote / written."],
  ["past-continuous",0,"Past continuous","Descrivere lo sfondo e un processo a un momento passato.","Usa was/were + -ing per una situazione in corso nel momento passato che stai considerando. Può fare da sfondo a un evento al past simple. Il contrasto riguarda il punto di vista, non una regola azione lunga/azione breve.","I was checking; they were waiting. Negativo: wasn't checking. Domanda: Were they waiting?",
  "The officer was checking the seal when the driver called.","The officer checked the seal and then called the driver.","Controllo in corso all'arrivo della chiamata contro due eventi in sequenza.","Non usare was + forma base. Un'azione durata ore può essere al past simple se la presenti come evento concluso."],
  ["past-perfect-simple",1,"Past perfect simple","Chiarire che un evento era già avvenuto prima di un altro momento passato.","Usa had + participio quando, da un riferimento passato, guardi a un fatto precedente. Serve a chiarire l'ordine o una causa già realizzata. Quando la sequenza è evidente non occorre metterlo in ogni frase del racconto.","They had left; she had written. Negativo: hadn't left. Domanda: Had they left? Had non cambia con il soggetto.","The team had secured the site before the inspector arrived.","The team secured the site after the inspector arrived.","L'ordine degli eventi cambia: nel primo il sito era già messo in sicurezza all'arrivo.","Non equivale a passato molto lontano: serve un punto di riferimento passato. Dopo had usa il participio, non il past simple."],
  ["past-perfect-continuous",1,"Past perfect continuous","Descrivere la durata di un'attività fino a un riferimento passato.","Usa had been + -ing per mettere in evidenza un processo sviluppato prima di un momento passato, spesso spiegandone gli effetti. Confrontalo con il past perfect simple, che può mettere al centro un risultato completato.","They had been waiting. Negativo: hadn't been waiting. Domanda: Had they been waiting?",
  "The witnesses had been waiting for an hour when the interview began.","The team had completed three interviews before noon.","Durata dell'attesa prima dell'inizio contro risultati già completati.","Serve had been, non had + -ing. Con molti stati usa il simple: had known, non had been knowing."],
  ["future-will",1,"Future simple: will","Esprimere previsioni, decisioni immediate, offerte e promesse.","Will + forma base è comune per previsioni, disponibilità, promesse e decisioni prese mentre parli. Non è un automatismo per ogni frase futura: intenzioni già formate e accordi possono usare altre costruzioni.","I will call / I'll call. Negativo: will not / won't call. Domanda: Will she call? Dopo will usa la base, senza to.","The radio is not working. I'll inform the control room now.","We are going to replace the radio tomorrow; the repair is already planned.","Decisione presa ora contro intenzione già stabilita.","Nelle normali subordinate temporali: I'll call when I arrive. Will e going to possono sovrapporsi: il contesto e l'intenzione contano."],
  ["future-going-to",1,"Futuro con going to","Comunicare intenzioni già presenti e previsioni basate su indizi.","Be going to + forma base presenta spesso un'intenzione già formata o una previsione basata su elementi visibili. Confronta piano, decisione immediata e accordo concreto senza trattare le forme come completamente intercambiabili.","I am going to call; she is going to call. Negativo: isn't going to call. Domanda: Are they going to call?",
  "We are going to inspect the storage area tomorrow; that is our plan.","The access ladder is unstable. It is going to fall.","Intenzione già presente contro previsione motivata da un indizio attuale.","Non omettere am/is/are. Going to non significa sempre spostarsi: I'm going to check è un'intenzione, I'm going to the station indica movimento."],
  ["future-arrangements",1,"Presente per il futuro","Distinguere accordi organizzati e orari fissati.","Il present continuous può descrivere un accordo futuro già organizzato; il present simple può presentare un orario o calendario. Il riferimento futuro deve essere chiaro. Confronta un incontro concordato con una semplice intenzione.","Accordo: We are meeting her tomorrow. Calendario: The briefing starts at nine. Negative e domande seguono le forme del presente.","We are meeting the liaison officer at ten tomorrow.","The training session starts at ten tomorrow.","Incontro organizzato contro orario stabilito dal programma.","Un'intenzione non è necessariamente un accordo confermato. Il present continuous mantiene am/is/are anche quando il riferimento è futuro."],
  ["future-continuous",2,"Future continuous","Descrivere un'attività in corso a un momento futuro.","Usa will be + -ing per un'attività che immagini in corso al momento futuro considerato. Può anche descrivere un'attività prevista o temporanea. Confronta in corso a quell'ora con già completata entro quell'ora.","They will be checking. Negativo: won't be checking. Domanda: Will they be checking?",
  "At nine tomorrow, the team will be inspecting the vehicles.","By nine tomorrow, the team will have inspected the vehicles.","Attività in corso alle nove contro ispezioni già concluse entro le nove.","Non confondere will be checking con will have checked. Esplicita il riferimento temporale quando serve a scegliere la forma."],
  ["future-perfect-simple",2,"Future perfect simple","Indicare un risultato completato entro un momento futuro.","Usa will have + participio per guardare indietro da una scadenza futura a un risultato che prevedi già completato. By introduce spesso il limite entro cui avverrà; non sostituisce automaticamente until.","They will have finished. Negativo: won't have finished. Domanda: Will they have finished?",
  "By Friday, the team will have completed the assessment.","On Friday morning, the team will still be carrying out the assessment.","Risultato completato entro la scadenza contro processo ancora in corso.","Will have written, non will have wrote. Una scadenza non impone sempre il perfect: conta se stai guardando al risultato già completato da quel punto futuro."],
  ["future-perfect-continuous",2,"Future perfect continuous","Misurare la durata maturata fino a un momento futuro.","Usa will have been + -ing quando guardi da un momento futuro alla durata di un'attività sviluppata fino ad allora. Confronta il tempo dedicato al processo con un numero di risultati completati.","They will have been working. Negativo: won't have been working. Domanda: Will they have been working?",
  "By noon, the officers will have been searching the area for four hours.","By noon, the officers will have searched three buildings.","Quattro ore di attività contro tre risultati completati entro mezzogiorno.","La costruzione richiede have been + -ing. Non introdurla solo per rendere una frase più complessa: deve essere utile il riferimento alla durata."],
  ["future-in-past",2,"Futuro visto dal passato","Riferire previsioni, intenzioni e accordi successivi a un momento passato.","Da un punto di vista passato puoi usare would, was/were going to o un past continuous per qualcosa che allora era futuro. La costruzione riferisce la prospettiva di quel momento; non dimostra da sola che il piano si sia realizzato.","She said she would call. We were going to leave. They were meeting the inspector the next day.","The officer said she would send the report that evening.","We were going to leave at six, but the road was closed.","Promessa riferita dal passato contro un'intenzione poi modificata.","Would qui può esprimere un futuro riferito, senza una condizione con if. Distinguilo dall'abitudine passata e dal condizionale."],
];
export const TENSE_GROUPS = [
  {title:"Presente",ids:["present-simple","present-continuous","present-perfect-simple","present-perfect-continuous"]},
  {title:"Passato",ids:["past-simple","past-continuous","past-perfect-simple","past-perfect-continuous"]},
  {title:"Futuro",ids:["future-will","future-going-to","future-arrangements","future-continuous","future-perfect-simple","future-perfect-continuous","future-in-past"]}
];
export const TENSE_COMPARISONS = ["present","past","perfect-simple","perfect-continuous","past-perfect","future","future-perfect","used-to","mixed"];
export const LESSONS = [
  ...rows.map(([id,stage,tool,title,goal,when,a,b,contrast,pitfall])=>({id,stage,tool,title,goal,when,forms:forms[id]||"",examples:[a,b],contrast,pitfall})),
  ...tenseRows.map(([id,stage,title,goal,when,forms,a,b,contrast,pitfall])=>({id,stage,tool:"tenses",title,goal,when,forms,examples:[a,b],contrast,pitfall,exercise_focus:true}))
].sort((a,b)=>a.stage-b.stage);
// Schema: espressione | significato selezionato | costruzione S/U/I | registro | tema | alternativa | esempio originale.
// La raccolta include anche prepositional e phrasal-prepositional verbs, dichiarati nell'interfaccia.
const lexicon = `
back up|sostenere con prove|S|neutro|argomentazione|support|The data back up our conclusion.
back down|rinunciare a una posizione|I|neutro|relazioni|withdraw|Neither side was willing to back down.
break down|smettere di funzionare|I|neutro|sicurezza|stop functioning|The radio broke down during the exercise.
break in|entrare con effrazione|I|neutro|indagini|enter by force|Someone tried to break in last night.
break into|entrare con effrazione in|U|neutro|indagini|enter by force|The suspects broke into an empty warehouse.
break out|scoppiare, iniziare improvvisamente|I|neutro|sicurezza|start suddenly|A fire broke out near the depot.
break up|interrompere, disperdere un gruppo|S|neutro|sicurezza|disperse|The officers broke up the fight.
bring about|provocare un cambiamento|S|formale|argomentazione|cause|The new procedure brought about significant improvements.
bring back|riportare|S|neutro|organizzazione|return|Please bring back the signed documents.
bring forward|anticipare una data|S|neutro|organizzazione|advance|We brought the meeting forward by one day.
bring in|introdurre, coinvolgere|S|neutro|organizzazione|introduce|The commander brought in a specialist.
bring up|sollevare un argomento|S|neutro|relazioni|raise|She brought up the issue during the briefing.
call back|richiamare al telefono|S|neutro|relazioni|return a call|I will call the witness back this afternoon.
call for|richiedere, rendere necessario|U|formale|argomentazione|require|The situation calls for a careful assessment.
call off|annullare|S|neutro|organizzazione|cancel|They called off the exercise because of the storm.
call on|invitare formalmente a fare qualcosa|U|formale|argomentazione|request|The report calls on all departments to cooperate.
carry on|continuare|I|neutro|organizzazione|continue|Please carry on with the inspection.
carry out|eseguire, svolgere|S|neutro|indagini|conduct|The team carried out a detailed inspection.
catch up|recuperare terreno o lavoro arretrato|I|neutro|organizzazione|recover lost ground|We need an extra day to catch up.
catch up with|raggiungere chi è avanti|U|neutro|organizzazione|reach|The second vehicle caught up with the convoy.
check in|registrarsi all'arrivo|I|neutro|vita quotidiana|register on arrival|Visitors must check in at reception.
check out|controllare, esaminare|S|informale|indagini|examine|Could you check out this address?
clear up|chiarire|S|neutro|relazioni|clarify|The interview cleared up the misunderstanding.
close down|chiudere un'attività|S|neutro|sicurezza|shut|The authorities closed down the unsafe facility.
come across|trovare per caso|U|neutro|indagini|encounter|I came across an old record in the archive.
come back|tornare|I|neutro|vita quotidiana|return|The patrol came back before midnight.
come down to|dipendere essenzialmente da|U|neutro|argomentazione|depend on|The decision comes down to safety.
come forward|farsi avanti, presentarsi|I|neutro|indagini|present oneself|Two witnesses came forward after the appeal.
come out|essere reso pubblico|I|neutro|indagini|become public|The findings came out last week.
come up|emergere, essere menzionato|I|neutro|relazioni|arise|The question came up at the meeting.
come up with|ideare, trovare una soluzione|U|neutro|argomentazione|devise|The team came up with a safer route.
count on|fare affidamento su|U|neutro|relazioni|rely on|We can count on their support.
cut back on|ridurre una spesa o un uso|U|neutro|organizzazione|reduce|We need to cut back on unnecessary travel.
cut down on|ridurre una quantità o abitudine|U|neutro|vita quotidiana|reduce|I am trying to cut down on screen time.
cut off|interrompere un collegamento|S|neutro|sicurezza|disconnect|The storm cut off the power supply.
deal with|gestire, affrontare|U|neutro|indagini|handle|The unit deals with online fraud.
do away with|eliminare una pratica|U|neutro|argomentazione|abolish|The proposal would do away with duplicate forms.
draw up|redigere|S|formale|organizzazione|draft|We drew up a contingency plan.
drop off|accompagnare e lasciare qualcuno|S|neutro|vita quotidiana|leave at a place|The driver dropped us off at the gate.
end up|finire in una situazione|I|neutro|vita quotidiana|eventually be|We ended up waiting for another hour.
fall behind|rimanere indietro|I|neutro|organizzazione|lag|The project fell behind after the delay.
fall through|non andare in porto|I|neutro|organizzazione|fail to happen|The agreement fell through at the last minute.
figure out|capire, trovare una soluzione|S|informale|indagini|determine|We figured out how the device worked.
fill in|compilare|S|neutro|organizzazione|complete|Please fill in the visitor form.
fill out|compilare un modulo|S|neutro|organizzazione|complete|She filled out the application online.
find out|scoprire, accertare|S|neutro|indagini|discover|We need to find out the exact arrival time.
follow up|approfondire con un'azione successiva|S|neutro|indagini|pursue further|The investigators followed up the lead.
follow up on|dare seguito a|U|neutro|indagini|pursue further|We will follow up on the complaint tomorrow.
get across|comunicare efficacemente|S|neutro|relazioni|convey|The diagram gets the message across clearly.
get along with|andare d'accordo con|U|neutro|relazioni|have a good relationship with|She gets along with the new team.
get around|spostarsi da un luogo all'altro|I|neutro|vita quotidiana|travel locally|It is difficult to get around without a car.
get away|allontanarsi, fuggire|I|neutro|indagini|escape|The suspect tried to get away.
get away with|evitare conseguenze per qualcosa|U|neutro|indagini|avoid punishment for|He thought he could get away with the fraud.
get back|rientrare|I|neutro|vita quotidiana|return|We got back at six.
get back to|ricontattare con una risposta|U|neutro|relazioni|respond later to|I will get back to you after the briefing.
get by|cavarsela con risorse limitate|I|neutro|vita quotidiana|manage|We can get by with the equipment available.
get off|scendere da un mezzo pubblico|U|neutro|vita quotidiana|leave a vehicle|We got off the train at the next station.
get on|salire su un mezzo pubblico|U|neutro|vita quotidiana|board|They got on the bus near the base.
get on with|continuare a lavorare a|U|neutro|organizzazione|continue|Let us get on with the assessment.
get out of|evitare un obbligo|U|neutro|vita quotidiana|avoid|He tried to get out of attending the session.
get over|superare, riprendersi da|U|neutro|vita quotidiana|recover from|It took time to get over the disruption.
get through|riuscire a comunicare al telefono|I|neutro|relazioni|make contact|I could not get through because the line was busy.
get up|alzarsi dal letto|I|neutro|vita quotidiana|rise|I get up early on training days.
give away|divulgare involontariamente|S|neutro|indagini|reveal|The message gave away their location.
give back|restituire|S|neutro|vita quotidiana|return|Please give the keys back to reception.
give in|cedere|I|neutro|relazioni|yield|The negotiators refused to give in.
give out|distribuire|S|neutro|organizzazione|distribute|The staff gave out the safety instructions.
give up|rinunciare, smettere|S|neutro|vita quotidiana|abandon|Do not give up the search too early.
go ahead|procedere|I|neutro|organizzazione|proceed|The inspection can go ahead as planned.
go back|tornare indietro|I|neutro|vita quotidiana|return|We had to go back for the documents.
go off|suonare, attivarsi di un allarme|I|neutro|sicurezza|sound|The alarm went off at dawn.
go on|continuare|I|neutro|organizzazione|continue|The briefing went on for another hour.
go over|esaminare con attenzione|U|neutro|organizzazione|review|Let us go over the procedure once more.
go through|esaminare sistematicamente|U|neutro|indagini|examine|We went through the records one by one.
grow up|crescere dall'infanzia|I|neutro|vita quotidiana|mature|She grew up in a small town.
hand in|consegnare|S|neutro|organizzazione|submit|Hand in the report by Friday.
hand out|distribuire|S|neutro|organizzazione|distribute|The instructor handed out the maps.
hand over|consegnare, trasferire il controllo|S|neutro|indagini|transfer|The patrol handed over the recovered items.
hang on|aspettare un momento|I|informale|relazioni|wait|Hang on while I check the reference.
hold back|trattenere, ostacolare|S|neutro|relazioni|restrain|Uncertainty held back the project.
hold on|attendere, restare in linea|I|neutro|relazioni|wait|Please hold on while I transfer your call.
hold up|ritardare|S|neutro|organizzazione|delay|Heavy traffic held up the convoy.
keep on|continuare un'azione|I|neutro|organizzazione|continue|The team kept on searching after dark.
keep up with|mantenere il passo con|U|neutro|organizzazione|maintain the pace of|The system must keep up with increasing demand.
leave out|omettere|S|neutro|organizzazione|omit|Do not leave out the time of the incident.
let down|deludere|S|neutro|relazioni|disappoint|We do not want to let the team down.
log in|accedere a un sistema|I|neutro|sicurezza|sign in|Users must log in before viewing the records.
log out|uscire da una sessione|I|neutro|sicurezza|sign out|Log out before leaving the workstation.
look after|occuparsi di|U|neutro|vita quotidiana|care for|The staff looked after the visitors.
look ahead|considerare il futuro|I|neutro|argomentazione|plan for the future|We need to look ahead and assess the risks.
look back on|ripensare a|U|neutro|vita quotidiana|reflect on|She looked back on the mission with pride.
look for|cercare|U|neutro|indagini|seek|The patrol was looking for a missing vehicle.
look forward to|attendere con piacere|U|neutro|relazioni|anticipate with pleasure|I look forward to hearing from you.
look into|indagare, approfondire|U|neutro|indagini|investigate|The unit is looking into the complaint.
look out|fare attenzione|I|neutro|sicurezza|be careful|Look out when crossing the service road.
look up|cercare un'informazione|S|neutro|organizzazione|consult|I looked up the address in the directory.
look up to|ammirare|U|neutro|relazioni|admire|The recruits look up to their instructor.
make out|distinguere, decifrare|S|neutro|indagini|discern|We could not make out the number plate.
make up|inventare un racconto|S|neutro|indagini|invent|The witness did not make up the account.
make up for|compensare|U|neutro|argomentazione|compensate for|The extra staff made up for the delay.
move on|passare alla fase successiva|I|neutro|organizzazione|proceed|We can now move on to the next point.
pass on|trasmettere|S|neutro|relazioni|relay|Please pass on the updated instructions.
pay back|restituire denaro|S|neutro|vita quotidiana|repay|He paid the money back the following week.
pay off|dare buoni risultati|I|neutro|argomentazione|prove successful|The additional training paid off.
pick out|individuare, scegliere tra altri|S|neutro|indagini|identify|The witness picked out the vehicle in a photograph.
pick up|andare a prendere|S|neutro|vita quotidiana|collect|The driver will pick you up at the station.
point out|far notare|S|neutro|argomentazione|highlight|The report points out several limitations.
put away|riporre|S|neutro|vita quotidiana|store|Put the equipment away after use.
put forward|proporre|S|formale|argomentazione|propose|The team put forward an alternative plan.
put off|rimandare|S|neutro|organizzazione|postpone|We put off the inspection until Monday.
put on|indossare|S|neutro|sicurezza|wear|Put on your protective clothing before entering.
put out|spegnere un incendio|S|neutro|sicurezza|extinguish|The firefighters put out the fire quickly.
put together|assemblare, preparare|S|neutro|organizzazione|compile|We put together a summary of the evidence.
put up with|tollerare|U|neutro|relazioni|tolerate|We should not put up with unsafe conditions.
rely on|fare affidamento su|U|neutro|argomentazione|depend on|The assessment relies on verified records.
rule out|escludere una possibilità|S|neutro|indagini|exclude|We cannot rule out a technical fault.
run away|fuggire|I|neutro|indagini|escape|The suspect ran away when the patrol arrived.
run into|incontrare per caso|U|neutro|vita quotidiana|encounter|I ran into a former colleague at the airport.
run out of|esaurire una risorsa|U|neutro|organizzazione|exhaust|The vehicle ran out of fuel.
set aside|riservare o accantonare|S|neutro|organizzazione|reserve|We set aside an hour for the briefing.
set off|partire|I|neutro|vita quotidiana|depart|The convoy set off before sunrise.
set out|esporre chiaramente|S|formale|argomentazione|present|The report sets out the main findings.
set up|istituire, predisporre|S|neutro|organizzazione|establish|We set up a temporary control point.
show up|presentarsi|I|informale|vita quotidiana|arrive|Only three visitors showed up.
shut down|arrestare il funzionamento|S|neutro|sicurezza|stop|They shut down the system for maintenance.
sort out|risolvere, sistemare|S|neutro|organizzazione|resolve|We need to sort out the scheduling conflict.
stand by|tenersi pronti|I|neutro|sicurezza|remain ready|The reserve team stood by at the base.
stand for|rappresentare, significare|U|neutro|organizzazione|represent|What does this abbreviation stand for?
stand out|distinguersi|I|neutro|argomentazione|be conspicuous|One inconsistency stands out in the account.
step down|dimettersi da un ruolo|I|neutro|organizzazione|resign|The director decided to step down.
step up|intensificare|S|neutro|sicurezza|increase|The unit stepped up patrols in the area.
stick to|attenersi a|U|neutro|organizzazione|adhere to|Please stick to the agreed procedure.
sum up|riassumere|S|neutro|argomentazione|summarise|The final paragraph sums up the findings.
take after|assomigliare a un familiare|U|neutro|vita quotidiana|resemble|She takes after her father.
take back|ritirare un'affermazione|S|neutro|relazioni|retract|He took back the allegation.
take down|annotare|S|neutro|indagini|record|The officer took down the witness's details.
take off|decollare|I|neutro|vita quotidiana|depart by air|The aircraft took off on time.
take on|assumere un compito|S|neutro|organizzazione|undertake|The team took on an additional task.
take over|assumere il controllo|S|neutro|organizzazione|assume control of|The night shift took over the operation.
take up|iniziare un'attività|S|neutro|vita quotidiana|begin|She took up running last year.
talk over|discutere prima di decidere|S|neutro|relazioni|discuss|We should talk the proposal over first.
think over|valutare con calma|S|neutro|argomentazione|consider|Please think the options over before deciding.
throw away|buttare via|S|neutro|vita quotidiana|discard|Do not throw away the original notes.
turn down|rifiutare un'offerta|S|neutro|relazioni|reject|She turned down the invitation.
turn into|trasformarsi in|U|neutro|argomentazione|become|A minor delay turned into a serious problem.
turn off|spegnere un dispositivo|S|neutro|vita quotidiana|switch off|Turn off the lights before leaving.
turn on|accendere un dispositivo|S|neutro|vita quotidiana|switch on|Turn on the radio before the briefing.
turn out|risultare alla fine|I|neutro|argomentazione|prove|The initial estimate turned out to be wrong.
turn up|arrivare, comparire|I|neutro|vita quotidiana|arrive|The missing document turned up in another folder.
use up|consumare interamente|S|neutro|organizzazione|exhaust|The exercise used up the remaining supplies.
wake up|svegliarsi|I|neutro|vita quotidiana|awake|I woke up before the alarm.
work out|risolvere, calcolare|S|neutro|argomentazione|calculate|We worked out the total cost.
write down|annotare per iscritto|S|neutro|organizzazione|record|Write down the reference number.
phase out|eliminare gradualmente|S|formale|organizzazione|discontinue gradually|The department is phasing out the old system.
lay out|presentare in modo ordinato|S|neutro|argomentazione|present|The document lays out three options.
account for|spiegare, giustificare|U|formale|argomentazione|explain|The delay accounts for the difference in costs.
look through|sfogliare, esaminare rapidamente|U|neutro|organizzazione|review|I looked through the file before the meeting.
hold off|rinviare un'azione|I|neutro|organizzazione|wait|We should hold off until the results arrive.
reach out to|mettersi in contatto con|U|neutro|relazioni|contact|The liaison officer reached out to the local team.
open up|rendere possibile un'opportunità|S|neutro|argomentazione|create|The agreement opened up new opportunities.
weigh up|valutare pro e contro|S|neutro|argomentazione|assess|We weighed up the risks before proceeding.
`.trim();
export const PHRASALS = lexicon.split("\n").map((line,i)=>{
  const [expression,meaning_it,pattern,register,topic,alternative,example] = line.split("|");
  return {id:`pv-${String(i+1).padStart(3,"0")}`,expression,meaning_it,pattern,register,topic,alternative,example,
    difficulty: register==="formale"?"avanzato":expression.split(" ").length>2?"intermedio":"base",
    dictionary_url:`https://dictionary.cambridge.org/dictionary/english/${expression.replaceAll(" ","-")}`};
});
export const PATTERNS = {
  S:"Separabile nel significato indicato: nome prima o dopo la particella; pronome nel mezzo (carry it out).",
  U:"Inseparabile nel significato indicato: oggetto dopo l'espressione (look into it). Può richiedere un complemento o una proposizione.",
  I:"Uso senza oggetto diretto: non inserire un oggetto tra verbo e particella (the alarm went off). Può avere complementi."
};
const terms = `
allegation|affermazione di un illecito non ancora accertata|An allegation must be distinguished from a verified fact.|indagini
evidence|elementi di prova; normalmente nome non numerabile|The report summarises the available evidence.|indagini
statement|dichiarazione, resoconto di una persona|The witness provided a written statement.|indagini
witness|testimone|Two witnesses described the same vehicle.|indagini
suspect|persona sospettata; non equivale a colpevole|The suspect was identified from the footage.|indagini
footage|riprese video; normalmente non numerabile|The team reviewed the security footage.|indagini
lead|pista o informazione da approfondire|The investigators followed up a new lead.|indagini
discrepancy|discrepanza tra elementi che dovrebbero coincidere|There was a discrepancy between the two accounts.|indagini
inconsistency|incoerenza interna o tra versioni|The interview revealed an inconsistency in the timeline.|indagini
seizure|acquisizione o presa in custodia di beni da parte delle autorità; verifica il significato giuridico locale|The report recorded the seizure of several items.|indagini
custody|custodia o trattenimento, secondo il contesto|The document states when the person was taken into custody.|indagini
warrant|provvedimento che autorizza un'azione; il tipo e il sistema giuridico contano|The officers checked the scope of the warrant.|indagini
chain of custody|tracciabilità di chi ha gestito un reperto|Each transfer was recorded in the chain of custody.|indagini
corroborate|confermare con elementi indipendenti|The recordings corroborated part of the account.|indagini
substantiated|sostenuto da elementi sufficienti|The allegation was not substantiated by the available records.|indagini
deterrence|effetto dissuasivo|The proposal aims to improve deterrence without unnecessary restrictions.|sicurezza
compliance|rispetto di requisiti o regole|The inspection checked compliance with the procedure.|sicurezza
breach|violazione o apertura in una protezione, secondo il contesto|The log records a possible security breach.|sicurezza
perimeter|perimetro di un'area|The patrol checked the outer perimeter.|sicurezza
surveillance|sorveglianza; normalmente non numerabile|The report describes the duration of the surveillance.|indagini
dispatch|invio o assegnazione operativa; anche verbo|The control room confirmed the dispatch of a patrol.|sicurezza
liaison|collegamento e coordinamento tra organizzazioni|A liaison officer maintained contact with the local team.|relazioni
deployment|impiego o dislocazione di personale e mezzi|Deployment was delayed until visibility improved.|organizzazione
briefing|riunione informativa operativa|The briefing covered the route and the main risks.|organizzazione
debriefing|raccolta e analisi delle informazioni dopo un'attività|The debriefing identified two procedural issues.|organizzazione
contingency|eventualità per cui preparare un piano alternativo|The plan includes measures for several contingencies.|organizzazione
mitigate|ridurre la gravità o probabilità di un rischio|Additional lighting may mitigate the risk.|argomentazione
assessment|valutazione basata su criteri ed elementi|The assessment distinguishes facts from assumptions.|argomentazione
findings|risultati o elementi emersi da un esame|The findings are summarised in the final section.|argomentazione
account|resoconto o versione; non solo conto|Her account differed from the initial report.|indagini
conflicting|in contrasto tra loro|The team received conflicting instructions.|relazioni
pending|in attesa di definizione|Access remains restricted pending further checks.|organizzazione
prior to|prima di; registro formale|The equipment was inspected prior to deployment.|argomentazione
subsequently|successivamente|The vehicle was subsequently located near the depot.|argomentazione
whereas|mentre, per contrapporre due fatti|The first route is shorter, whereas the second is safer.|argomentazione
nevertheless|tuttavia, nonostante quanto precede|The estimate is uncertain. Nevertheless, it supports a limited trial.|argomentazione
albeit|sebbene, pur; spesso introduce una precisazione breve|The procedure was effective, albeit time-consuming.|argomentazione
extent|misura, grado o estensione|The extent of the damage remains uncertain.|argomentazione
feasible|realizzabile nelle condizioni date|The proposal is feasible with the available staff.|argomentazione
drawback|svantaggio o limite|The main drawback is the longer response time.|argomentazione
trade-off|compromesso tra benefici e costi diversi|There is a trade-off between coverage and response time.|argomentazione
threshold|soglia|The alert is triggered when the threshold is exceeded.|sicurezza
unauthorised|non autorizzato|The log shows an unauthorised access attempt.|sicurezza
tampering|manomissione|The technician found signs of tampering.|indagini
retrieve|recuperare dati o un oggetto|The technician retrieved the access logs.|indagini
retain|conservare, mantenere|Retain the original notes for comparison.|organizzazione
disclose|rivelare informazioni|The summary does not disclose personal details.|relazioni
redact|oscurare informazioni in un documento|Personal details were redacted before publication.|organizzazione
premises|locali o area di un edificio; forma plurale nel significato|The premises were secured after the inspection.|sicurezza
approach|metodo o avvicinamento, secondo il contesto|A different approach may reduce delays.|argomentazione
outcome|esito|The outcome of the review will determine the next step.|argomentazione
deadline|termine entro cui concludere|The deadline was extended by two days.|organizzazione
overlook|non notare; non equivale a look over|The initial assessment overlooked a relevant detail.|indagini
underlying|sottostante, alla base|The report examines the underlying causes.|argomentazione
implications|conseguenze o significato più ampio|The final section discusses the operational implications.|argomentazione
reliable|affidabile|The assessment requires reliable sources.|argomentazione
likelihood|probabilità, possibilità che accada|The likelihood of further delays remains low.|argomentazione
scope|ambito o limiti di un'attività|The briefing clarified the scope of the inspection.|organizzazione
ensure|assicurare che una condizione sia soddisfatta|The checklist helps ensure that no step is omitted.|organizzazione
acknowledge|riconoscere un fatto, limite o messaggio|The report acknowledges the limits of the available data.|argomentazione
`.trim();
export const TERMS = terms.split("\n").map((line,i)=>{const [expression,meaning_it,example,topic]=line.split("|"); return {id:`lex-${i+1}`,expression,meaning_it,example,topic,register:"neutro",pattern:"",alternative:"",difficulty:"intermedio"};});
export const VOCABULARY = [...PHRASALS,...TERMS];
export const BASIC_WORDS = new Set("apple pen pencil dog cat book table chair red blue green mother father water food good bad big small one two three four five yes no hello goodbye car house school day night man woman boy girl i you he she it we they a an the is am are was were be have has do does did in on at to for of and but or not very".split(" "));

// Focus esplicito su ausiliari e negazioni, prima distribuito nei tempi.
LESSONS.push({id:"negatives",stage:1,tool:"word_order",title:"Negazioni: ausiliari, tempi e significato",goal:"Costruire negative senza confondere forma e significato.",when:"Prima individua l'ausiliare. Be, have nei perfect e i modali prendono not direttamente; al present e past simple degli altri verbi usa do/does/did + not + forma base.",forms:"does not work; did not go; is not working; has not arrived; cannot attend",examples:["The officer did not attend the briefing.","The officer had not attended the briefing before the inspection."],contrast:"Did not attend colloca l'assenza nel passato; had not attended la guarda da un altro momento passato.",pitfall:"Dopo doesn't e didn't non mettere -s o il passato. Mustn't è un divieto; don't have to indica che non c'è obbligo. No, nobody e nothing contengono già una negazione."});
