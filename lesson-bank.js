// Banca locale di esercizi originali per competenza (1.13.0).
// train: allenamento, usato nelle sessioni offline, nel piano quotidiano e nei recuperi.
// check: domande riservate alla verifica successiva, mai mostrate nell'allenamento.
// Competenze: form (costruire la forma), meaning (capire che cosa significa), tense_choice
// (scegliere la struttura giusta per la situazione), use (usarla in un contesto reale),
// word_order (ordine delle parole). Nessuna domanda copiata dal pretest o dai manuali.
//
// Formato compatto:
//   C(skill, consegna, [opzioni], soluzione, perché)        → scelta multipla
//   O(skill, consegna, soluzione, [altre accettate], perché) → risposta aperta
// Le consegne seguono le regole di chiarezza: istruzione italiana, poi la frase inglese.
const C=(skill,stem,options,answer,why)=>({skill,stem,options,answer,why});
const O=(skill,stem,answer,accept,why)=>({skill,stem,answer,accept:accept||[],why});

export const LESSON_BANK={
  sentence:{
    train:[
      O("form","Scrivi solo la parola mancante: Every morning the driver ___ the tyres. (check)","checks",[],"Soggetto singolare al present simple: verbo con -s."),
      O("form","Scrivi solo la parola mancante: The two guards ___ at the gate now. (be)","are",[],"Soggetto plurale: are."),
      C("meaning","Scegli che cosa significa: The officer called the witness.",["L'agente ha chiamato il testimone.","Il testimone ha chiamato l'agente.","L'agente è stato chiamato dal testimone."],"L'agente ha chiamato il testimone.","In inglese il soggetto viene prima del verbo e l'oggetto dopo: officer è chi chiama."),
      C("meaning","Scegli chi compie l'azione: The visitors were met by a guide.",["i visitatori","una guida","nessuno dei due"],"una guida","Con il passivo chi compie l'azione è introdotto da by."),
      C("word_order","Descrivi come ha letto il rapporto. Scegli la frase con l'ordine corretto delle parole.",["She carefully read the report.","She read carefully the report.","Carefully she the report read."],"She carefully read the report.","L'avverbio di modo non si mette tra verbo e oggetto."),
      C("use","Devi scrivere un messaggio breve e chiaro al collega. Scegli la frase corretta.",["The meeting starts at nine.","The meeting start at nine.","Starts the meeting at nine."],"The meeting starts at nine.","Soggetto + verbo con -s + complemento: la frase base."),
      C("use","In un rapporto vuoi dire chi ha trovato la chiave. Scegli la frase corretta.",["A cleaner found the key.","Found a cleaner the key.","The key found a cleaner."],"A cleaner found the key.","Chi agisce (a cleaner) va prima del verbo; la cosa trovata dopo."),
      O("use","Correggi l'errore e riscrivi tutta la frase: Is ready the car.","The car is ready",[],"In una frase affermativa il soggetto viene prima del verbo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the parcel / delivered / the courier","The courier delivered the parcel",[],"Soggetto, verbo, oggetto."),
      O("word_order","Metti le parole in ordine e scrivi la frase: on Fridays / we / the files / archive","We archive the files on Fridays",["On Fridays we archive the files"],"Soggetto, verbo, oggetto e poi il tempo (oppure il tempo all'inizio)."),
      C("meaning","Scegli che cosa significa: The guard stopped the car.",["la guardia ha fermato l'auto","l'auto ha fermato la guardia","la guardia si è fermata dentro l'auto"],"la guardia ha fermato l'auto","Soggetto prima del verbo, oggetto dopo: l'ordine decide chi fa che cosa.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: My brother ___ near the station. (live)","lives",[],"Terza persona singolare: -s."),
      O("form","Scrivi solo la parola mancante: The reports ___ on the desk. (be)","are",[],"Soggetto plurale: are."),
      C("meaning","Scegli che cosa significa: The dog followed the boy.",["Il cane ha seguito il ragazzo.","Il ragazzo ha seguito il cane.","Il cane e il ragazzo si sono seguiti."],"Il cane ha seguito il ragazzo.","Il primo nome è il soggetto."),
      C("word_order","Parli di un'abitudine. Scegli la frase con l'ordine corretto delle parole.",["We often visit the museum.","We visit often the museum.","Often we the museum visit."],"We often visit the museum.","Often va prima del verbo principale."),
      C("use","Vuoi avvisare che l'ufficio è chiuso. Scegli la frase corretta.",["The office is closed today.","Is closed the office today.","The office closed is today."],"The office is closed today.","Soggetto + be + aggettivo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the documents / signed / the manager","The manager signed the documents",[],"Soggetto, verbo, oggetto.")
    ]
  },
  nouns:{
    train:[
      O("form","Scrivi solo la parola mancante: We bought three new ___. (box)","boxes",[],"I nomi in -x prendono -es."),
      O("form","Scrivi solo la parola mancante: Two ___ arrived late. (child)","children",[],"Child ha un plurale irregolare: children."),
      C("meaning","Scegli la parola non numerabile.",["information","report","suggestion"],"information","Information non ha plurale e non prende a/an."),
      C("tense_choice","Scegli la forma corretta: We need ___ about the route.",["some information","an information","informations"],"some information","Information è non numerabile: some information."),
      C("tense_choice","Scegli la forma corretta: There ___ a lot of equipment in the van.",["is","are","were being"],"is","Equipment è non numerabile: verbo al singolare."),
      C("use","Vuoi chiedere un consiglio al tuo tutor. Scegli la frase corretta.",["Can you give me some advice?","Can you give me an advice?","Can you give me advices?"],"Can you give me some advice?","Advice è non numerabile: some advice o a piece of advice."),
      C("use","In un inventario scrivi quanti oggetti ci sono. Scegli la frase corretta.",["There are four pieces of luggage.","There are four luggages.","There is four luggage."],"There are four pieces of luggage.","Luggage non si conta: si contano i pieces."),
      O("use","Correggi l'errore e riscrivi tutta la frase: The police is checking the area.","The police are checking the area",[],"Police è sempre plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: of / two / bread / loaves / we need","We need two loaves of bread",[],"Bread si conta con loaves of."),
      O("word_order","Metti le parole in ordine e scrivi la frase: some / brought / furniture / they / new","They brought some new furniture",[],"Furniture è non numerabile: some new furniture.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Three ___ were waiting outside. (woman)","women",[],"Woman → women."),
      O("form","Scrivi solo la parola mancante: The ___ are in the cupboard. (knife)","knives",[],"Knife → knives."),
      C("meaning","Scegli la parola numerabile.",["suggestion","advice","news"],"suggestion","Suggestion ha il plurale; advice e news no."),
      C("tense_choice","Scegli la forma corretta: The news ___ good this morning.",["is","are","were"],"is","News è singolare."),
      C("use","Vuoi chiedere notizie del viaggio. Scegli la frase corretta.",["Is there any news about the trip?","Are there any news about the trip?","Is there a news about the trip?"],"Is there any news about the trip?","News: singolare e non numerabile."),
      O("word_order","Metti le parole in ordine e scrivi la frase: of / a piece / gave / she / me / useful advice","She gave me a piece of useful advice",[],"Un consiglio = a piece of advice.")
    ]
  },
  articles:{
    train:[
      O("form","Scrivi solo la parola mancante: She is ___ engineer. (articolo)","an",[],"Engineer inizia con suono vocalico: an."),
      O("form","Scrivi solo la parola mancante: Please close ___ door behind you. (articolo)","the",[],"Una porta precisa, nota a entrambi: the."),
      C("meaning","Scegli che cosa indica the in: I saw a car. The car was red.",["la stessa auto già nominata","un'auto qualsiasi","tutte le auto"],"la stessa auto già nominata","Alla seconda menzione si usa the."),
      C("tense_choice","Scegli la forma corretta: ___ honest answer is always better.",["An","A","The a"],"An","Honest si pronuncia senza h: an."),
      C("tense_choice","Scegli la forma corretta: She plays ___ piano very well.",["the","a","nessun articolo"],"the","Con gli strumenti musicali si usa the."),
      C("use","Parli in generale dei cani. Scegli la frase corretta.",["Dogs need regular exercise.","The dogs need regular exercise.","A dogs need regular exercise."],"Dogs need regular exercise.","Per parlare in generale: plurale senza articolo."),
      C("use","Vuoi dire che vai al lavoro in autobus. Scegli la frase corretta.",["I go to work by bus.","I go to the work by the bus.","I go to a work by a bus."],"I go to work by bus.","To work e by bus: senza articolo."),
      O("use","Correggi l'errore e riscrivi tutta la frase: He is a best officer in the unit.","He is the best officer in the unit",[],"Con il superlativo si usa the."),
      O("word_order","Metti le parole in ordine e scrivi la frase: an / is / interesting / it / idea","It is an interesting idea",[],"An davanti a interesting (suono vocalico)."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the / at / station / she / is","She is at the station",[],"Una stazione precisa: at the station.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I need ___ umbrella. (articolo)","an",[],"Umbrella: suono vocalico, an."),
      O("form","Scrivi solo la parola mancante: ___ sun rises in the east. (articolo)","The",[],"Ce n'è uno solo: the sun."),
      C("meaning","Scegli che cosa significa: Water boils at 100 degrees.",["l'acqua in generale","l'acqua di quella bottiglia","un'acqua particolare"],"l'acqua in generale","Senza articolo: in generale."),
      C("tense_choice","Scegli la forma corretta: She works in ___ hospital near the river.",["a","an","nessun articolo"],"a","Prima menzione, suono consonantico: a."),
      C("use","Vuoi dire che tuo fratello fa l'avvocato. Scegli la frase corretta.",["My brother is a lawyer.","My brother is lawyer.","My brother is the lawyer."],"My brother is a lawyer.","Con le professioni serve a/an."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the / tallest / is / building / this / in the city","This is the tallest building in the city",[],"Superlativo con the.")
    ]
  },
  pronouns:{
    train:[
      O("form","Scrivi solo la parola mancante: Can you help ___? (= noi)","us",[],"Dopo il verbo serve il pronome oggetto: us."),
      O("form","Scrivi solo la parola mancante: She hurt ___ during training. (= se stessa)","herself",[],"Riflessivo: herself."),
      C("meaning","Scegli a chi si riferisce them in: The keys? I left them on the desk.",["alle chiavi","alla scrivania","a me"],"alle chiavi","Them sostituisce un nome plurale già citato."),
      C("tense_choice","Scegli la forma corretta: This bag is not mine; it's ___.",["hers","her","she"],"hers","Pronome possessivo senza nome dopo: hers."),
      C("tense_choice","Scegli la forma corretta: ___ and I checked the list.",["She","Her","Hers"],"She","Soggetto: she."),
      C("use","Vuoi dire che hai fatto il lavoro senza aiuto. Scegli la frase corretta.",["I did it myself.","I did it me.","I did it mine."],"I did it myself.","Myself sottolinea che l'hai fatto da solo."),
      C("use","Restituisci un fascicolo a un collega. Scegli la frase corretta.",["This file is yours.","This file is your.","This file is you."],"This file is yours.","Senza nome dopo: yours."),
      O("use","Correggi l'errore e riscrivi tutta la frase: Me and Paolo are on duty today.","Paolo and I are on duty today",["I and Paolo are on duty today"],"Al soggetto serve I; per cortesia si mette per ultimo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to / gave / the keys / me / she","She gave the keys to me",[],"Verbo + oggetto + to + persona."),
      O("word_order","Metti le parole in ordine e scrivi la frase: introduced / to / themselves / the group / they","They introduced themselves to the group",[],"Riflessivo dopo il verbo.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I called ___ yesterday. (= lui)","him",[],"Pronome oggetto: him."),
      O("form","Scrivi solo la parola mancante: Is this pen ___? (= tua)","yours",[],"Pronome possessivo: yours."),
      C("meaning","Scegli a chi si riferisce it in: The car is old, but it still works.",["all'auto","a chi parla","al lavoro"],"all'auto","It sostituisce un nome singolare."),
      C("tense_choice","Scegli la forma corretta: They enjoyed ___ at the party.",["themselves","them","theirs"],"themselves","Godersela: enjoy oneself."),
      C("use","Vuoi indicare che il cane è di tua sorella. Scegli la frase corretta.",["The dog is hers.","The dog is her.","The dog is she."],"The dog is hers.","Possessivo senza nome: hers."),
      O("word_order","Metti le parole in ordine e scrivi la frase: us / they / to / the results / sent","They sent the results to us",[],"Verbo + oggetto + to + persona.")
    ]
  },
  "some-any":{
    train:[
      O("form","Scrivi solo la parola mancante, some o any: We don't have ___ milk left.","any",[],"Nelle negative: any."),
      O("form","Scrivi solo la parola mancante, some o any: I bought ___ apples this morning.","some",[],"Affermativa: some."),
      C("meaning","Scegli che cosa significa: You can take any seat.",["un posto qualsiasi","nessun posto","alcuni posti"],"un posto qualsiasi","Any in frase affermativa = qualunque."),
      C("tense_choice","Non sai se ci sia qualcuno e non ti aspetti una risposta particolare: scegli la domanda neutra. Scegli la forma corretta: Is there ___ in the room?",["anybody","somebody","nobody"],"anybody","Domanda neutra: anybody."),
      C("tense_choice","Scegli la forma corretta: There is ___ at the door. Can you open it?",["someone","anyone","no one"],"someone","Affermativa con una persona precisa: someone."),
      C("use","Offri un caffè a un ospite. Scegli la frase più naturale.",["Would you like some coffee?","Would you like any coffee?","Would you like no coffee?"],"Would you like some coffee?","Nelle offerte si usa some."),
      C("use","Dici che non hai visto nessuno. Scegli la frase corretta.",["I didn't see anyone.","I didn't see no one.","I didn't see someone."],"I didn't see anyone.","Con not si usa anyone; no one già nega."),
      O("use","Correggi l'errore e riscrivi tutta la frase: There isn't nothing in the box.","There isn't anything in the box",["There is nothing in the box"],"Una sola negazione: isn't anything oppure is nothing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: any / have / questions / you / do","Do you have any questions",[],"Domanda: do + soggetto + verbo; any questions."),
      O("word_order","Metti le parole in ordine e scrivi la frase: left / something / she / on the desk","She left something on the desk",[],"Affermativa: something.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante, some o any, in una domanda neutra senza aspettativa di risposta positiva: Have you got ___ change?","any",[],"Domanda neutra: any."),
      O("form","Scrivi solo la parola mancante: There is ___ wrong with the printer. (= qualcosa)","something",[],"Affermativa: something."),
      C("meaning","Scegli che cosa significa: Anybody can join the course.",["chiunque","nessuno","qualcuno in particolare"],"chiunque","Anybody in affermativa = chiunque."),
      C("tense_choice","Scegli la forma corretta: I can't find my keys ___.",["anywhere","somewhere","nowhere"],"anywhere","Con can't: anywhere."),
      C("use","Chiedi gentilmente qualche foglio. Scegli la frase più naturale.",["Could I have some paper, please?","Could I have any paper, please?","Could I have no paper, please?"],"Could I have some paper, please?","Nelle richieste si usa some."),
      O("word_order","Metti le parole in ordine e scrivi la frase: nobody / the office / was / in","Nobody was in the office",[],"Nobody già nega: verbo affermativo.")
    ]
  },
  quantifiers:{
    train:[
      O("form","Scrivi solo la parola mancante, much o many: How ___ people came?","many",[],"People è numerabile: many."),
      O("form","Scrivi solo la parola mancante, few o little: There is very ___ water left.","little",[],"Water è non numerabile: little."),
      C("meaning","Scegli che cosa significa: We have a few days left.",["alcuni giorni, un piccolo numero","quasi nessun giorno","molti giorni"],"alcuni giorni, un piccolo numero","A few indica alcuni giorni, con valore positivo rispetto a few. Non dice da solo se siano sufficienti."),
      C("meaning","Scegli che cosa significa: Few people came.",["quasi nessuno è venuto","sono venute alcune persone","sono venuti tutti"],"quasi nessuno è venuto","Few senza a = pochi, valore negativo."),
      C("tense_choice","Scegli la forma corretta: ___ officer received a badge.",["Each","All","Both"],"Each","Each + nome singolare."),
      C("use","Al telefono chiedi quanto costa il biglietto. Scegli la frase corretta.",["How much is the ticket?","How many is the ticket?","How much are the ticket?"],"How much is the ticket?","Per i prezzi: how much."),
      C("use","Avvisi che rimane poco tempo. Scegli la frase corretta.",["We don't have much time.","We don't have many time.","We don't have few time."],"We don't have much time.","Time non numerabile: much."),
      O("use","Correggi l'errore e riscrivi tutta la frase: All of student passed the test.","All of the students passed the test",["All the students passed the test","All students passed the test"],"All of + the + plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: many / there / not / are / seats","There are not many seats",[],"Many con i numerabili, nelle negative."),
      O("word_order","Metti le parole in ordine e scrivi la frase: received / a copy / each / visitor","Each visitor received a copy",[],"Each + nome singolare + verbo singolare.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante, much o many: How ___ money do you need?","much",[],"Money non numerabile: much."),
      O("form","Scrivi solo le parole mancanti, a few o a little: I need ___ minutes to finish.","a few",[],"Minutes numerabile: a few."),
      C("meaning","Scegli che cosa significa: There's little hope.",["c'è poca speranza","c'è un po' di speranza","c'è molta speranza"],"c'è poca speranza","Little senza a: poco (negativo)."),
      C("tense_choice","Scegli la forma corretta: ___ my parents work in Rome.",["Both","Each","Every"],"Both","Due persone insieme: both."),
      C("use","Vuoi dire che nel testo ci sono pochi errori. Scegli la frase corretta.",["There are few mistakes in the text.","There is few mistakes in the text.","There are little mistakes in the text."],"There are few mistakes in the text.","Mistakes numerabile: few."),
      O("word_order","Metti le parole in ordine e scrivi la frase: much / we / have / don't / information","We don't have much information",[],"Information non numerabile: much.")
    ]
  },
  adjectives:{
    train:[
      O("form","Scrivi solo la parola mancante: She drives very ___. (careful → avverbio)","carefully",[],"Avverbio di modo: careful + -ly."),
      O("form","Scrivi solo la parola mancante: The test was ___. (easy → aggettivo, non cambia)","easy",[],"Dopo be serve l'aggettivo."),
      C("meaning","Scegli che cosa descrive hard in: He works hard.",["il modo in cui lavora","quanto è difficile il lavoro","che lavora raramente"],"il modo in cui lavora","Hard è anche avverbio: con impegno."),
      C("tense_choice","Scegli la forma corretta: The soup smells ___.",["good","well","goodly"],"good","Dopo i verbi dei sensi si usa l'aggettivo."),
      C("tense_choice","Scegli la forma corretta: She speaks English ___.",["fluently","fluent","more fluent"],"fluently","Il verbo speak si descrive con un avverbio."),
      C("use","Descrivi un collega che lavora con precisione. Scegli la frase corretta.",["He is a careful worker.","He is a carefully worker.","He is a worker careful."],"He is a careful worker.","Aggettivo prima del nome."),
      C("use","Di solito arrivi presto, ma non sempre. Scegli la frase che conserva questo significato.",["I usually arrive early.","I never arrive early.","I always arrive late."],"I usually arrive early.","Usually indica ciò che succede abitualmente; never significa mai, always late significa sempre in ritardo."),
      O("use","Correggi l'errore e riscrivi tutta la frase: She answered the question quick.","She answered the question quickly",[],"Serve l'avverbio: quickly."),
      O("word_order","Metti le parole in ordine e scrivi la frase: late / is / never / she","She is never late",[],"Con be l'avverbio di frequenza va dopo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: a / old / car / beautiful / they have","They have a beautiful old car",[],"Opinione prima dell'età.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Please speak ___. (slow → avverbio)","slowly",[],"Avverbio: slowly."),
      O("form","Scrivi solo la parola mancante: She did ___ in the exam. (good → avverbio)","well",[],"L'avverbio di good è well."),
      C("meaning","Scegli che cosa significa: He hardly slept.",["ha dormito pochissimo","ha dormito molto","ha dormito profondamente"],"ha dormito pochissimo","Hardly = quasi per niente."),
      C("tense_choice","Scegli la forma corretta: The music sounds ___.",["loud","loudly","louder than"],"loud","Sound come verbo dei sensi + aggettivo."),
      C("use","Spesso lavori fino a tardi. Scegli la frase che conserva questo significato.",["I often work late.","I rarely work late.","I never work late."],"I often work late.","Often significa spesso; rarely significa raramente, never significa mai."),
      O("word_order","Metti le parole in ordine e scrivi la frase: always / she / on time / is","She is always on time",[],"Con be l'avverbio va dopo il verbo.")
    ]
  },
  comparison:{
    train:[
      O("form","Scrivi solo la parola mancante: This road is ___ than the motorway. (narrow)","narrower",[],"Aggettivo breve: -er."),
      O("form","Scrivi solo le parole mancanti: It is ___ room in the building. (large, superlativo)","the largest",[],"Superlativo: the + -est."),
      C("meaning","Scegli che cosa significa: The train is not as fast as the plane.",["l'aereo è più veloce","il treno è più veloce","sono veloci uguali"],"l'aereo è più veloce","Not as ... as = meno ... di."),
      C("tense_choice","Scegli la forma corretta: This method is ___ than the old one.",["more reliable","reliabler","most reliable"],"more reliable","Aggettivo lungo: more + aggettivo."),
      C("tense_choice","Scegli la forma corretta: Today is ___ day of the year.",["the hottest","the hotter","hottest"],"the hottest","Superlativo: the + -est (con doppia t)."),
      C("use","La seconda offerta costa meno della prima. Scegli la frase che riporta correttamente il confronto.",["The second offer is cheaper than the first.","The second offer is more expensive than the first.","The second offer is as expensive as the first."],"The second offer is cheaper than the first.","Cheaper than indica un prezzo minore; more expensive un prezzo maggiore; as expensive lo stesso prezzo."),
      C("use","Dici che il problema è peggiorato. Scegli la frase corretta.",["The situation is worse than yesterday.","The situation is badder than yesterday.","The situation is more bad than yesterday."],"The situation is worse than yesterday.","Bad → worse."),
      O("use","Correggi l'errore e riscrivi tutta la frase: She is more taller than her brother.","She is taller than her brother",[],"Non si usano insieme more e -er."),
      O("word_order","Metti le parole in ordine e scrivi la frase: than / is / expensive / this one / more / that one","This one is more expensive than that one",["That one is more expensive than this one"],"More + aggettivo + than."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as / is / as / she / tall / her sister","She is as tall as her sister",["Her sister is as tall as she"],"As ... as per l'uguaglianza.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: My office is ___ than yours. (small)","smaller",[],"Small → smaller."),
      O("form","Scrivi solo le parole mancanti: It was ___ film I have ever seen. (good, superlativo)","the best",[],"Good → the best."),
      C("meaning","Scegli che cosa significa: Paolo is as old as Marco.",["hanno la stessa età","Paolo è più vecchio","Marco è più vecchio"],"hanno la stessa età","As ... as = uguaglianza."),
      C("tense_choice","Scegli la forma corretta: This exercise is ___ than the first.",["more difficult","difficulter","most difficult"],"more difficult","Aggettivo lungo: more."),
      C("use","Dici che quest'anno sei più impegnato. Scegli la frase corretta.",["I am busier this year.","I am less busy this year.","I am as busy as last year."],"I am busier this year.","Busier indica maggiore impegno. Less busy indica meno impegno; as busy indica lo stesso livello. More busy non è usato come distrattore errato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the / in / most / is / the team / she / experienced","She is the most experienced in the team",[],"Superlativo lungo: the most + aggettivo.")
    ]
  },
  questions:{
    train:[
      O("form","Scrivi solo la parola mancante: ___ you work on Saturdays? (Usa il present simple)","Do",[],"Domanda al present simple con you: do."),
      O("form","Scrivi solo la parola mancante: ___ she call you yesterday?","Did",[],"Domanda al past simple: did."),
      C("meaning","Scegli che cosa chiede: Who called the manager?",["chi ha chiamato il responsabile","chi ha chiamato il responsabile, ma lui stesso","il responsabile chi ha chiamato"],"chi ha chiamato il responsabile","Senza did, who è il soggetto."),
      C("meaning","Scegli che cosa chiede: Who did the manager call?",["chi è stato chiamato dal responsabile","chi ha chiamato il responsabile","se il responsabile ha chiamato"],"chi è stato chiamato dal responsabile","Con did, who è l'oggetto."),
      C("tense_choice","Scegli la forma corretta: Where ___ your brother live?",["does","do","is"],"does","Terza persona al present simple: does."),
      C("use","Chiedi a un collega da quanto tempo lavora qui. Scegli la frase corretta.",["How long have you worked here?","How long do you work here?","How long you have worked here?"],"How long have you worked here?","Durata fino a ora: present perfect, ausiliare prima del soggetto."),
      C("use","Chiedi l'orario del treno. Scegli la frase corretta.",["What time does the train leave?","What time the train leaves?","What time does the train leaves?"],"What time does the train leave?","Does + soggetto + verbo base."),
      O("use","Correggi l'errore e riscrivi tutta la frase: Why you didn't come?","Why didn't you come",["Why did you not come"],"Nelle domande l'ausiliare va prima del soggetto."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: you / where / born / were","Where were you born",[],"Wh- + be + soggetto."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: does / what / mean / this word","What does this word mean",[],"Wh- + does + soggetto + verbo base.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: ___ they arrive on time last night?","Did",[],"Past simple: did."),
      O("form","Scrivi solo la parola mancante: Where ___ you going now?","are",[],"Present continuous: are."),
      C("meaning","Scegli che cosa chiede: What happened?",["che cosa è successo","che cosa hai fatto","che cosa è stato fatto a te"],"che cosa è successo","What soggetto: niente did."),
      C("tense_choice","Scegli la forma corretta: How often ___ you train?",["do","does","are"],"do","You al present simple: do."),
      C("use","Usa una domanda neutra, senza enfasi o contrasto. Chiedi chi ha scritto il rapporto. Scegli la frase corretta.",["Who wrote the report?","Who did write the report?","Who wrote did the report?"],"Who wrote the report?","Who soggetto: niente did."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: did / when / the meeting / finish","When did the meeting finish",[],"Wh- + did + soggetto + verbo base.")
    ]
  },
  prepositions:{
    train:[
      O("form","Scrivi solo la parola mancante: The briefing is ___ Monday. (preposizione)","on",[],"Con i giorni: on."),
      O("form","Scrivi solo la parola mancante: She was born ___ 1990. (preposizione)","in",[],"Con gli anni: in."),
      C("meaning","Scegli che cosa significa: I'll be there by six.",["al più tardi alle sei","dalle sei in poi","verso le sei, forse dopo"],"al più tardi alle sei","By = entro."),
      C("tense_choice","Scegli la forma corretta: The meeting starts ___ 9 a.m.",["at","in","on"],"at","Con gli orari: at."),
      C("tense_choice","Il movimento va dal corridoio verso l’interno della stanza. Scegli la forma corretta: He walked ___ the room.",["into","out of","towards"],"into","Into indica l’ingresso; out of indica l’uscita; towards indica la direzione senza affermare che la persona entri."),
      C("use","Dici che lavori qui dal 2021. Scegli la frase corretta.",["I have worked here since 2021.","I have worked here for 2021.","I have worked here from 2021."],"I have worked here since 2021.","Punto di partenza: since."),
      C("use","Dai un appuntamento per il pomeriggio. Scegli la frase corretta.",["Let's meet in the afternoon.","Let's meet on the afternoon.","Let's meet at the afternoon."],"Let's meet in the afternoon.","Parti del giorno: in the afternoon."),
      O("use","Correggi l'errore e riscrivi tutta la frase: We arrived to the airport late.","We arrived at the airport late",[],"Arrive at per un luogo preciso."),
      O("word_order","Metti le parole in ordine e scrivi la frase: on / the keys / the table / are","The keys are on the table",[],"Su una superficie: on."),
      O("word_order","Metti le parole in ordine e scrivi la frase: for / waited / two hours / we","We waited for two hours",[],"Durata: for.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The shop opens ___ 8 o'clock. (preposizione)","at",[],"Orario: at."),
      O("form","Scrivi solo la parola mancante: We go on holiday ___ August. (preposizione)","in",[],"Mesi: in."),
      C("meaning","Scegli che cosa significa: The shop is open until seven.",["fino alle sette","dalle sette","entro le sette"],"fino alle sette","Until = fino a."),
      C("tense_choice","Scegli la forma corretta: She lives ___ Via Roma 12.",["at","in","on"],"at","Indirizzo con numero: at."),
      C("use","Dici che sarai via una settimana. Scegli la frase corretta.",["I'll be away for a week.","I'll be away since a week.","I'll be away during a week."],"I'll be away for a week.","Durata: for."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the bridge / walked / we / across","We walked across the bridge",[],"Attraversare: across.")
    ]
  },
  "demonstratives-plurals":{
    train:[
      C("meaning","Scegli che cosa indica those in: Can you pass me those files over there?",["fascicoli lontani da chi parla","fascicoli vicini a chi parla","un solo fascicolo"],"fascicoli lontani da chi parla","Those = plurale e lontano."),
      C("tense_choice","Hai in mano due chiavi. Scegli la forma corretta: ___ keys open the main door.",["These","This","That"],"These","Plurale e vicino: these."),
      C("tense_choice","Scegli il plurale corretto: one bus, two ___.",["buses","bus","buss"],"buses","I nomi in -s prendono -es."),
      C("use","Al telefono presenti te stesso. Scegli la frase corretta.",["Hello, this is Marco.","Hello, that is Marco.","Hello, these is Marco."],"Hello, this is Marco.","Al telefono ci si presenta con this is."),
      C("use","Indichi un edificio lontano a un visitatore. Scegli la frase corretta.",["That building is the library.","This building over there is the library.","Those building is the library."],"That building is the library.","Singolare e lontano: that."),
      O("word_order","Metti le parole in ordine e scrivi la frase: are / these / mine / gloves","These gloves are mine",[],"Dimostrativo + nome plurale + are."),
      O("word_order","Metti le parole in ordine e scrivi la frase: that / was / day / a long","That was a long day",[],"That per un momento passato.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante, al plurale: Three ___ were damaged. (box)","boxes",[],"Box → boxes."),
      O("form","Scrivi solo la parola mancante: Look at ___ birds on the roof over there. (this/that al plurale)","those",[],"Plurale e lontano: those."),
      C("meaning","Scegli che cosa indica this in: This is a good idea.",["l'idea appena detta","un'idea lontana","molte idee"],"l'idea appena detta","This rimanda a ciò che è vicino o appena detto."),
      C("tense_choice","Scegli il plurale corretto: one person, two ___.",["people","persons'","peoples"],"people","Il plurale comune di person è people."),
      C("use","Indichi delle sedie vicino a te. Scegli la frase corretta.",["These chairs are free.","This chairs are free.","Those chair is free."],"These chairs are free.","Plurale e vicino: these."),
      O("word_order","Metti le parole in ordine e scrivi la frase: those / whose / are / shoes","Whose shoes are those",[],"Domanda con whose + nome.")
    ]
  },
  "possessives-compounds":{
    train:[
      C("meaning","Scegli che cosa significa: the managers' office",["l'ufficio di più responsabili","l'ufficio di un responsabile","i responsabili dell'ufficio"],"l'ufficio di più responsabili","Apostrofo dopo la s: plurale."),
      C("meaning","Scegli che cosa significa: a ten-minute break",["una pausa di dieci minuti","dieci pause da un minuto","una pausa dopo dieci minuti"],"una pausa di dieci minuti","Aggettivo composto: niente -s su minute."),
      C("tense_choice","Scegli la forma corretta: This is ___ car.",["my sister's","my sisters","the car of my sister's"],"my sister's","Possesso di persona: 's."),
      C("use","Chiedi di chi è una borsa lasciata in sala. Scegli la frase corretta.",["Whose bag is this?","Who's bag is this?","Who bag is this?"],"Whose bag is this?","Possesso: whose."),
      C("use","In un rapporto indichi la data dell'incontro. Scegli la frase più naturale.",["the date of the meeting","the meeting's date of","the date's meeting"],"the date of the meeting","Con cose astratte si usa spesso of."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the / children's / is / room / upstairs","The children's room is upstairs",[],"Plurale irregolare: children's."),
      O("word_order","Metti le parole in ordine e scrivi la frase: a / we / three-day / need / course","We need a three-day course",[],"Composto con trattino, niente -s.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante, con il genitivo: This is ___ phone. (Anna)","Anna's",[],"Possesso: Anna's."),
      O("form","Scrivi solo ciò che manca: It was a ___ flight. (two hours → aggettivo composto)","two-hour",["two hour"],"Aggettivo composto: two-hour."),
      C("meaning","Scegli che cosa significa: my parents' house",["la casa dei miei genitori","la casa di mio padre","le case dei miei genitori"],"la casa dei miei genitori","Apostrofo dopo la s: plurale."),
      C("tense_choice","Scegli la forma corretta: ___ coat is on the chair?",["Whose","Who's","Who"],"Whose","Possesso: whose."),
      C("use","Indichi la stanza degli ospiti. Scegli la frase corretta.",["the guests' room","the guest's rooms of","the room's guests"],"the guests' room","Più ospiti: guests'."),
      O("word_order","Metti le parole in ordine e scrivi la frase: my / is / friend's / brother / a pilot","My friend's brother is a pilot",[],"Genitivo + nome.")
    ]
  },
  "have-forms":{
    train:[
      C("meaning","Scegli che cosa significa: She's having a shower.",["si sta facendo la doccia","ha una doccia in casa","ha fatto la doccia"],"si sta facendo la doccia","Have come attività: può andare al continuous."),
      C("meaning","Scegli che cosa significa: He's got two brothers.",["ha due fratelli","ha preso due fratelli","aveva due fratelli"],"ha due fratelli","Have got = possesso, presente."),
      C("tense_choice","Scegli la forma corretta: ___ you have a car when you lived in Milan?",["Did","Had","Have"],"Did","Possesso al passato nelle domande: did + have."),
      C("use","Chiedi a un collega se ha una penna. Scegli la frase corretta.",["Have you got a pen?","Do you got a pen?","Are you having a pen?"],"Have you got a pen?","Possesso: have you got...? oppure do you have...?"),
      C("use","Dici che stai pranzando e richiamerai. Scegli la frase corretta.",["I'm having lunch, I'll call you back.","I have lunch now, I'll call you back.","I've got lunch, I'll call you back."],"I'm having lunch, I'll call you back.","Attività in corso: having lunch."),
      O("word_order","Metti le parole in ordine e scrivi la frase: got / any / haven't / we / time","We haven't got any time",[],"Negativa con have got."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: have / does / a garden / she","Does she have a garden",[],"Domanda con have lessicale: does + have.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: ___ your brother have a job? (Usa il present simple)","Does",[],"Have lessicale: does nelle domande."),
      O("form","Scrivi solo le parole mancanti, con have al present continuous: They ___ a meeting right now.","are having",[],"Attività in corso: are having."),
      C("meaning","Scegli che cosa significa: We didn't have time.",["non avevamo tempo","non abbiamo il tempo","non avremo tempo"],"non avevamo tempo","Didn't have: passato."),
      C("tense_choice","Scegli la forma corretta: She ___ a new phone.",["has got","have got","is having got"],"has got","Terza persona: has got."),
      C("use","Dici che oggi non hai la macchina. Scegli la frase corretta.",["I haven't got my car today.","I don't got my car today.","I'm not having my car today."],"I haven't got my car today.","Possesso: haven't got."),
      O("word_order","Metti le parole in ordine e scrivi la frase: a / had / great / we / time","We had a great time",[],"Have a good time: espressione fissa.")
    ]
  },
  "there-it":{
    train:[
      C("meaning","Scegli che cosa significa: There's a problem with the printer.",["la stampante ha un problema","la stampante è lì","c'era un problema"],"la stampante ha un problema","There is = c'è."),
      C("tense_choice","Scegli la forma corretta: ___ is cold today.",["It","There","This there"],"It","Per il tempo atmosferico: it."),
      C("tense_choice","Scegli la forma corretta: ___ were many people at the event.",["There","It","They"],"There","Esistenza: there were."),
      C("use","Avvisi i colleghi che manca la carta. Scegli la frase corretta.",["There isn't any paper in the printer.","It isn't any paper in the printer.","Isn't paper in the printer."],"There isn't any paper in the printer.","Assenza: there isn't."),
      C("use","Commenti un'attività. Scegli la frase corretta.",["It is important to arrive on time.","There is important to arrive on time.","Is important to arrive on time."],"It is important to arrive on time.","It anticipa il soggetto vero (to arrive)."),
      O("word_order","Metti le parole in ordine e scrivi la frase: there / two messages / are / for you","There are two messages for you",[],"There are + plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: takes / it / to walk there / ten minutes","It takes ten minutes to walk there",[],"It takes + tempo + to + verbo.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, con there al passato: ___ an accident on the road yesterday.","There was",[],"Esistenza al passato: there was."),
      O("form","Scrivi solo la parola mancante: ___ is a long way to the station.","It",[],"Distanza: it."),
      C("meaning","Scegli che cosa significa: It's raining.",["piove","c'è pioggia lì","è stata la pioggia"],"piove","Tempo atmosferico: it."),
      C("tense_choice","Scegli la forma corretta: ___ any seats left?",["Are there","Is it","Are they"],"Are there","Domanda di esistenza: are there."),
      C("use","Dici che non è facile trovare parcheggio. Scegli la frase corretta.",["It isn't easy to find parking.","There isn't easy to find parking.","Isn't easy to find parking."],"It isn't easy to find parking.","It + aggettivo + to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: a / near here / there / is / pharmacy","There is a pharmacy near here",[],"There is + singolare.")
    ]
  },
  "imperatives-requests":{
    train:[
      C("meaning","Scegli che cosa esprime: Could you close the window, please?",["una richiesta cortese","un ordine brusco","una domanda sulla capacità"],"una richiesta cortese","Could you...? = richiesta educata."),
      C("tense_choice","Vuoi proporre di fare una pausa. Scegli la forma corretta.",["Let's take a break.","Let's to take a break.","Let's taking a break."],"Let's take a break.","Let's + verbo base."),
      C("tense_choice","Offri aiuto a un collega. Scegli la forma corretta.",["Shall I carry the box?","Do I carry the box?","Will I carry the box?"],"Shall I carry the box?","Offerta: shall I...?"),
      C("use","Chiedi a un superiore il permesso di uscire prima. Scegli la frase più adatta.",["Would it be possible to leave early today?","Leave early today.","I want leave early today."],"Would it be possible to leave early today?","Richiesta formale e cortese."),
      C("use","Su un cartello vieti di fumare. Scegli la frase corretta.",["Do not smoke here.","Not smoke here.","Don't smoking here."],"Do not smoke here.","Imperativo negativo: do not + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: you / me / could / help / please","Could you help me please",["Could you please help me"],"Could you + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: late / be / don't / tomorrow","Don't be late tomorrow",["Tomorrow don't be late"],"Imperativo negativo con be: don't be.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: ___ we start the meeting now? (proposta)","Shall",[],"Proposta: shall we...?"),
      O("form","Scrivi solo ciò che manca, per rendere negativo l'ordine: ___ touch the screen.","Don't",["Do not"],"Imperativo negativo: don't."),
      C("meaning","Scegli che cosa esprime: Would you like a coffee?",["un'offerta","una richiesta di aiuto","un ordine"],"un'offerta","Would you like...? = offerta."),
      C("tense_choice","Chiedi il permesso in modo cortese. Scegli la forma corretta.",["May I come in?","May I to come in?","May I coming in?"],"May I come in?","May I + verbo base."),
      C("use","Chiedi a un collega di aspettare un momento. Scegli la frase più cortese.",["Could you wait a moment, please?","Wait a moment.","You wait a moment."],"Could you wait a moment, please?","Richiesta cortese."),
      O("word_order","Metti le parole in ordine e scrivi la frase: go / let's / by train","Let's go by train",[],"Let's + verbo base.")
    ]
  },
  "space-movement":{
    train:[
      C("meaning","Scegli che cosa significa: She ran across the road.",["ha attraversato la strada correndo","ha corso lungo la strada","ha corso sotto la strada"],"ha attraversato la strada correndo","Across = da una parte all'altra."),
      C("tense_choice","Il gatto era fuori dalla scatola e ci è entrato saltando. Scegli la preposizione che esprime questo ingresso: The cat jumped ___ the box.",["into","out of","over"],"into","Into indica l’ingresso nella scatola; out of indica l’uscita, over il salto al di sopra. In può talvolta esprimere ingresso: per questo non è usato come alternativa errata."),
      C("tense_choice","Avete percorso il tunnel al suo interno, da un’estremità all’altra. Scegli la forma corretta: We drove ___ the tunnel.",["through","across","over"],"through","Dentro e da un capo all'altro: through."),
      C("use","Dai indicazioni a un visitatore. Scegli la frase corretta.",["Go past the bank and turn left.","Go pass the bank and turn left.","Go by the bank turning left at."],"Go past the bank and turn left.","Go past = superare passando davanti."),
      C("use","Descrivi dove si trova il bar. Scegli la frase corretta.",["The café is opposite the station.","The café is opposite to of the station.","The café is in opposite the station."],"The café is opposite the station.","Opposite + luogo, senza of."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the hill / walked / up / we","We walked up the hill",[],"Movimento verso l'alto: up."),
      O("word_order","Metti le parole in ordine e scrivi la frase: out of / she / the building / ran","She ran out of the building",[],"Uscire da: out of.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The plane flew ___ the mountains. (sopra, senza toccare)","over",["above"],"Over e above possono indicare una posizione più alta senza contatto. Over può anche suggerire il passaggio da una parte all’altra."),
      O("form","Scrivi solo la parola mancante: He went ___ the stairs to the basement. (giù)","down",[],"Verso il basso: down."),
      C("meaning","Scegli che cosa significa: The house is between the school and the park.",["in mezzo ai due","dietro ai due","davanti ai due"],"in mezzo ai due","Between = tra due elementi."),
      C("tense_choice","Sono rimasti sulla riva, seguendo il corso del fiume fino al ponte, senza attraversarlo. Scegli la forma corretta: They walked ___ the river to the bridge.",["along","across","into"],"along","Lungo: along."),
      C("use","Dici a un collega dove hai parcheggiato. Scegli la frase corretta.",["I parked behind the building.","I parked behind of the building.","I parked at behind the building."],"I parked behind the building.","Behind senza of."),
      O("word_order","Metti le parole in ordine e scrivi la frase: towards / the exit / she / walked","She walked towards the exit",[],"Direzione: towards.")
    ]
  },
  "basic-connectors":{
    train:[
      C("meaning","Scegli che cosa esprime so in: It was late, so we left.",["una conseguenza","una causa","un contrasto"],"una conseguenza","So introduce la conseguenza."),
      C("tense_choice","Esprimi un contrasto tra le due preferenze, non una causa o una conseguenza. Scegli il connettivo corretto: I like tea, ___ I don't like coffee.",["but","so","because"],"but","Contrasto: but."),
      C("tense_choice","Scegli il connettivo corretto: She stayed at home ___ she was ill.",["because","so","or"],"because","Causa: because."),
      C("use","Nel rapporto unisci due fatti in sequenza. Scegli la frase corretta.",["The alarm rang and the staff left the building.","The alarm rang but the staff left the building because.","The alarm rang or the staff left the building."],"The alarm rang and the staff left the building.","Aggiunta e sequenza: and."),
      C("use","Proponi due alternative al cliente. Scegli la frase corretta.",["You can pay by card or in cash.","You can pay by card but in cash.","You can pay by card so in cash."],"You can pay by card or in cash.","Alternativa: or."),
      O("word_order","Metti le parole in ordine e scrivi la frase: tired / so / was / I / went to bed early / I","I was tired so I went to bed early",[],"Causa, so, conseguenza."),
      O("word_order","Metti le parole in ordine e scrivi la frase: because / missed / the bus / we / were / we / late","We were late because we missed the bus",["We missed the bus because we were late","Because we missed the bus we were late"],"Effetto + because + causa.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The road was closed, ___ we took another route. (conseguenza)","so",[],"Conseguenza: so."),
      O("form","Scrivi solo la parola mancante: Do you want tea ___ coffee? (alternativa)","or",[],"Alternativa: or."),
      C("meaning","Scegli che cosa esprime because in: He called because he needed help.",["la causa","la conseguenza","un'alternativa"],"la causa","Because introduce la causa."),
      C("tense_choice","Scegli il connettivo corretto: The room was small ___ comfortable.",["but","so","because"],"but","Contrasto: but."),
      C("use","Spieghi perché sei in ritardo. Scegli la frase corretta.",["I'm late because the train was cancelled.","I'm late so the train was cancelled.","I'm late or the train was cancelled."],"I'm late because the train was cancelled.","Causa: because."),
      O("word_order","Metti le parole in ordine e scrivi la frase: but / it / was / cheap / slow","It was cheap but slow",["It was slow but cheap"],"Contrasto tra due qualità.")
    ]
  },
  present:{
    train:[
      O("form","Scrivi solo le parole mancanti, al present continuous: Look! It ___. (snow)","is snowing",[],"Azione in corso adesso: is + -ing."),
      O("form","Scrivi solo la parola mancante, al present simple: Water ___ at 100 degrees. (boil)","boils",[],"Fatto generale: present simple."),
      C("meaning","Scegli che cosa significa: I'm staying with my cousin this month.",["una situazione temporanea","un'abitudine di sempre","un piano già passato"],"una situazione temporanea","Present continuous: situazione temporanea."),
      C("meaning","Scegli che cosa significa: He works in a bank.",["presenta il lavoro in banca come situazione abituale","ci lavora solo oggi","ci ha lavorato in passato"],"presenta il lavoro in banca come situazione abituale","Il present simple descrive qui il lavoro abituale. Non garantisce che il posto sia permanente."),
      C("tense_choice","Scegli la forma corretta: Quiet, please. The officer ___ to the witness.",["is talking","talks","talk"],"is talking","In questo momento: present continuous."),
      C("tense_choice","Scegli la forma corretta: I ___ what you mean.",["understand","am understanding","understanding"],"understand","Understand è un verbo di stato: present simple."),
      C("use","Descrivi la tua routine in un'email. Scegli la frase corretta.",["I usually start work at eight.","I am usually starting work at eight.","I usually starting work at eight."],"I usually start work at eight.","Routine: present simple."),
      C("use","Al telefono spieghi che non puoi parlare. Scegli la frase corretta.",["Sorry, I'm driving at the moment.","Sorry, I drive at the moment.","Sorry, I'm drive at the moment."],"Sorry, I'm driving at the moment.","Azione in corso: present continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: these days / a new course / is taking / she","She is taking a new course these days",["These days she is taking a new course"],"Periodo temporaneo: present continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: never / he / meat / eats","He never eats meat",[],"Avverbio di frequenza prima del verbo.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, al present continuous: We ___ for the bus right now. (wait)","are waiting",[],"Adesso: are waiting."),
      O("form","Scrivi solo la parola mancante, al present simple: She ___ two languages. (speak)","speaks",[],"Capacità stabile: speaks."),
      C("meaning","Scegli che cosa significa: The train leaves at six every day.",["un orario fisso","un'azione in corso","un evento passato"],"un orario fisso","Orari e abitudini: present simple."),
      C("tense_choice","Scegli la forma corretta: This soup ___ delicious.",["tastes","is tasting","taste"],"tastes","Taste come stato: present simple."),
      C("use","Spieghi a un collega che sei impegnato con un rapporto. Scegli la frase corretta.",["I'm writing a report now.","I write a report now.","I writing a report now."],"I'm writing a report now.","In corso: present continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: does / the gym / on Mondays / she / go to","Does she go to the gym on Mondays",[],"Domanda al present simple.")
    ]
  },
  past:{
    train:[
      O("form","Scrivi solo le parole mancanti, al past continuous: At ten last night we ___ TV. (watch)","were watching",[],"Azione in corso a un'ora passata."),
      O("form","Scrivi solo la parola mancante, al past simple: The phone ___ while I was cooking. (ring)","rang",[],"Evento breve che interrompe: past simple."),
      C("meaning","Scegli che cosa significa: I was reading when she called.",["la lettura era in corso quando lei ha chiamato","ho finito di leggere e poi lei ha chiamato","leggevo spesso quando chiamava"],"la lettura era in corso quando lei ha chiamato","Il past continuous presenta la lettura come sfondo alla chiamata. Non dice necessariamente che la persona abbia smesso di leggere."),
      C("meaning","Scegli che cosa significa: When she called, I read the message.",["prima ha chiamato, poi ho letto","stavo leggendo durante la chiamata","avevo già letto"],"prima ha chiamato, poi ho letto","Due past simple: azioni in sequenza."),
      C("tense_choice","Descrivi la camminata come attività già in corso quando ha iniziato a piovere. Scegli la forma corretta: While they ___ , it started to rain.",["were walking","walked","walk"],"were walking","Sfondo in corso: past continuous."),
      C("tense_choice","Racconta un viaggio concluso, non un’attività vista mentre si svolgeva. Scegli la forma corretta: Last summer we ___ to Spain.",["went","were going","go"],"went","Evento concluso con tempo preciso: past simple."),
      C("use","Nel rapporto descrivi la scena all'arrivo. Scegli la frase corretta.",["When we arrived, two men were standing at the door.","When we arrived, two men stood stand at the door.","When we were arriving, two men stand at the door."],"When we arrived, two men were standing at the door.","Evento (arrived) + sfondo (were standing)."),
      C("use","Racconti una sequenza di azioni. Scegli la frase corretta.",["He opened the door, looked around and left.","He was opening the door, was looking around and was leaving.","He opens the door, looked around and left."],"He opened the door, looked around and left.","Sequenza di azioni concluse: past simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: was sleeping / the alarm / when / went off / I","I was sleeping when the alarm went off",["When the alarm went off I was sleeping"],"Sfondo + when + evento."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the file / she / yesterday / sent","She sent the file yesterday",["Yesterday she sent the file"],"Past simple con yesterday.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, al past continuous: What ___ at eight last night? (you do)","were you doing",[],"Domanda al past continuous."),
      O("form","Scrivi solo la parola mancante, al past simple: I ___ my keys on the bus. (lose)","lost",[],"Lose → lost."),
      C("meaning","Scegli che cosa significa: It was raining all morning.",["la pioggia è durata per tutta la mattina","ha piovuto un momento","pioverà domattina"],"la pioggia è durata per tutta la mattina","Past continuous: durata nel passato."),
      C("tense_choice","Scegli la forma corretta: She ___ her leg while she was skiing.",["broke","was breaking","breaks"],"broke","Evento breve: past simple."),
      C("use","Spieghi perché non hai risposto al telefono. Scegli la frase corretta.",["Sorry, I was driving when you called.","Sorry, I drove when you were calling.","Sorry, I drive when you called."],"Sorry, I was driving when you called.","Sfondo + evento."),
      O("word_order","Metti le parole in ordine e scrivi la frase: were / while / they / talking / I / waited","I waited while they were talking",["While they were talking I waited"],"While + past continuous.")
    ]
  },
  "perfect-simple":{
    train:[
      O("form","Scrivi solo le parole mancanti, al present perfect: I ___ this film before. (see)","have seen",[],"Esperienza senza tempo preciso."),
      O("form","Scrivi solo la parola mancante, al past simple: We ___ the report on Monday. (finish)","finished",[],"Tempo passato preciso: past simple."),
      C("meaning","Scegli che cosa significa: She has lost her keys.",["non le ha ancora ritrovate","le ha perse e poi ritrovate","le perdeva spesso"],"non le ha ancora ritrovate","Present perfect: risultato ancora valido."),
      C("meaning","Scegli che cosa significa: She lost her keys last week.",["è successo la settimana scorsa; oggi non si sa","le cerca ancora adesso, sicuramente","le perderà presto"],"è successo la settimana scorsa; oggi non si sa","Past simple: fatto concluso nel passato."),
      C("tense_choice","Scegli la forma corretta: I ___ him yesterday.",["met","have met","have meet"],"met","Con yesterday: past simple."),
      C("tense_choice","Scegli la forma corretta: ___ you ever ___ to Japan?",["Have / been","Did / go","Were / been"],"Have / been","Esperienza con ever: present perfect."),
      C("use","Aggiorni il responsabile: il lavoro è appena finito. Scegli la frase corretta.",["We have just finished the inspection.","We just have finished the inspection yesterday.","We finished just the inspection now."],"We have just finished the inspection.","Just + present perfect."),
      C("use","Nel rapporto indichi quando è successo. Scegli la frase corretta.",["The incident happened at 10:30.","The incident has happened at 10:30.","The incident has been happen at 10:30."],"The incident happened at 10:30.","Ora precisa: past simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: already / the tickets / bought / have / we","We have already bought the tickets",["We have bought the tickets already"],"Already tra have e participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: in 2019 / moved / to Rome / they","They moved to Rome in 2019",["In 2019 they moved to Rome"],"Anno preciso: past simple.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, al present perfect: She ___ three emails so far. (send)","has sent",[],"So far: present perfect."),
      O("form","Scrivi solo la parola mancante, al past simple: They ___ here two years ago. (arrive)","arrived",[],"Ago: past simple."),
      C("meaning","Scegli che cosa significa: I've worked here since May.",["lavoro qui da maggio e ci lavoro ancora","ho lavorato qui a maggio","lavorerò qui da maggio"],"lavoro qui da maggio e ci lavoro ancora","Present perfect + since: dura fino a ora."),
      C("tense_choice","Scegli la forma corretta: When ___ you start this job?",["did","have","has"],"did","When: past simple."),
      C("use","Dici a un collega che non hai ancora ricevuto la mail. Scegli la frase corretta.",["I haven't received your email yet.","I received your email yesterday.","I haven't receive your email yet."],"I haven't received your email yet.","La prima frase dice che la mail non è ancora arrivata. La seconda dice che è arrivata ieri; nella terza manca il participio received. Il past simple con yet è possibile in inglese americano e non è trattato come errore."),
      O("word_order","Metti le parole in ordine e scrivi la frase: never / I / flown / have / before","I have never flown before",[],"Never tra have e participio.")
    ]
  },
  "perfect-continuous":{
    train:[
      O("form","Scrivi solo le parole mancanti, al present perfect continuous: She ___ since nine. (study)","has been studying",[],"Durata fino a ora: has been + -ing."),
      O("form","Scrivi solo le parole mancanti, al present perfect simple: I ___ three chapters today. (read)","have read",[],"Quantità completata: present perfect simple."),
      C("meaning","Scegli che cosa significa: I've been painting the kitchen.",["l'attività è durata e forse non è finita","ho finito di dipingere tutta la cucina","dipingo la cucina ogni anno"],"l'attività è durata e forse non è finita","Continuous: processo e durata."),
      C("meaning","Scegli che cosa significa: I've painted the kitchen.",["il lavoro è finito","ci sto ancora lavorando","lo farò domani"],"il lavoro è finito","Simple: risultato completato."),
      C("tense_choice","Scegli la forma corretta: How long ___ you ___ for the bus?",["have / been waiting","have / waited a lot","did / wait now"],"have / been waiting","Durata fino a ora: present perfect continuous."),
      C("tense_choice","Tutti e dieci i rapporti sono completi: metti in evidenza il risultato raggiunto. Scegli la forma corretta: She ___ ten reports this week.",["has written","has been writing","is writing ten"],"has written","Quantità precisa: simple."),
      C("use","Spieghi perché hai le mani sporche. Scegli la frase corretta.",["I've been repairing the bike.","I've repaired the bike since an hour.","I repair the bike for an hour."],"I've been repairing the bike.","Effetto visibile di un'attività recente: continuous."),
      C("use","Tutti e cinque i controlli sono conclusi: metti in evidenza il risultato. Nel rapporto indichi quanti controlli sono stati fatti. Scegli la frase corretta.",["We have carried out five checks.","We have been carrying out five checks.","We are carrying out five checks since."],"We have carried out five checks.","Numero di azioni completate: simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: for two hours / been / they / have / talking","They have been talking for two hours",["For two hours they have been talking"],"Have been + -ing + for."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: have / how long / you / been / learning English","How long have you been learning English",[],"How long + present perfect continuous.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, al present perfect continuous: It ___ all day. (rain)","has been raining",[],"Durata: has been raining."),
      O("form","Scrivi solo le parole mancanti, al present perfect simple: We ___ the problem. (solve)","have solved",[],"Risultato: have solved."),
      C("meaning","Scegli che cosa significa: He's been calling you all morning.",["ha chiamato più volte per tutta la mattina","ha chiamato una volta","chiamerà domattina"],"ha chiamato più volte per tutta la mattina","Continuous: ripetizione nel tempo."),
      C("tense_choice","Scegli la forma corretta: I ___ my keys. Can you help me?",["have lost","have been losing","am losing"],"have lost","Risultato attuale: simple."),
      C("use","Dici che stai cercando casa da mesi. Scegli la frase corretta.",["I've been looking for a flat for months.","I look for a flat for months.","I've looked for a flat since months."],"I've been looking for a flat for months.","Durata: continuous + for."),
      O("word_order","Metti le parole in ordine e scrivi la frase: has / she / since January / here / been working","She has been working here since January",["Since January she has been working here"],"Since + punto di partenza.")
    ]
  },
  "past-perfect":{
    train:[
      O("form","Scrivi solo le parole mancanti, al past perfect: When we arrived, the film ___. (start)","had started",[],"Azione precedente: had + participio."),
      O("form","Scrivi solo le parole mancanti, al past perfect continuous: She was tired because she ___ all day. (work)","had been working",[],"Durata prima di un momento passato."),
      C("meaning","Scegli che cosa significa: When I got there, he had left.",["era già andato via prima del mio arrivo","è andato via quando sono arrivato","stava andando via"],"era già andato via prima del mio arrivo","Past perfect: prima di un altro passato."),
      C("meaning","Scegli che cosa significa: When I got there, he left.",["è andato via subito dopo il mio arrivo","era già andato via","non è andato via"],"è andato via subito dopo il mio arrivo","Due past simple: sequenza."),
      C("tense_choice","Scegli la forma corretta: I didn't recognise her because she ___ her hair.",["had cut","has cut","cut now"],"had cut","Azione precedente: past perfect."),
      C("tense_choice","Scegli la forma corretta: They ___ for an hour when the bus finally came.",["had been waiting","have been waiting","were wait"],"had been waiting","Durata fino a un momento passato."),
      C("use","Nel rapporto chiarisci l'ordine dei fatti. Scegli la frase corretta.",["The guard said that someone had opened the gate.","The guard said that someone has opened the gate before.","The guard said that someone opens the gate."],"The guard said that someone had opened the gate.","Fatto precedente al racconto: past perfect."),
      C("use","Racconti che era la prima volta in aereo. Scegli la frase corretta.",["I had never flown before that trip.","I have never flown before that trip.","I never fly before that trip."],"I had never flown before that trip.","Esperienza fino a un momento passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had / before / she / the email / I called / read","She had read the email before I called",["Before I called she had read the email"],"Past perfect + before + past simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: by the time / had ended / arrived / the meeting / we","The meeting had ended by the time we arrived",["By the time we arrived the meeting had ended"],"By the time + past simple.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, al past perfect: I realised I ___ my wallet at home. (leave)","had left",[],"Prima di realised: had left."),
      O("form","Scrivi solo le parole mancanti, al past perfect continuous: His eyes were red because he ___. (cry)","had been crying",[],"Causa precedente in durata."),
      C("meaning","Scegli che cosa significa: The plane had taken off when we reached the airport.",["l'aereo era già partito","l'aereo è partito al nostro arrivo","l'aereo stava atterrando"],"l'aereo era già partito","Past perfect: già successo."),
      C("tense_choice","Scegli la forma corretta: After she ___ the report, she sent it.",["had finished","has finished","finishes"],"had finished","Anteriorità nel passato."),
      C("use","Dici che non avevi mai visto quella città prima. Scegli la frase corretta.",["I had never seen the city before.","I have never seen the city before then.","I never had see the city before."],"I had never seen the city before.","Past perfect con never."),
      O("word_order","Metti le parole in ordine e scrivi la frase: already / when / had / the train / left / we arrived","The train had already left when we arrived",["When we arrived the train had already left"],"Already con il past perfect.")
    ]
  },
  future:{
    train:[
      O("form","Scrivi solo le parole mancanti, con going to: Look at those clouds! It ___. (rain)","is going to rain",[],"Previsione da un indizio: going to."),
      O("form","Scrivi solo le parole mancanti, con will: I'm cold. I ___ the window. (close)","will close",[],"Decisione presa adesso: will."),
      C("meaning","Scegli che cosa significa: I'm meeting the director at three.",["è un appuntamento già fissato","è una decisione presa ora","è una previsione incerta"],"è un appuntamento già fissato","Present continuous: accordo fissato."),
      C("meaning","Scegli che cosa significa: The train leaves at 6:15.",["un orario ufficiale","un'intenzione personale","una previsione"],"un orario ufficiale","Present simple per gli orari."),
      C("tense_choice","Hai deciso ieri ed è la tua intenzione. Scegli la forma più adatta: I ___ a new laptop next week.",["am going to buy","will buy","buy"],"am going to buy","Intenzione già decisa: going to."),
      C("tense_choice","Scegli la forma corretta: I think tomorrow's meeting ___ useful.",["will be","is being","was being"],"will be","Opinione sul futuro: will."),
      C("use","Il telefono squilla e ti offri di rispondere. Scegli la frase corretta.",["I'll answer it.","I'm going to answer it since yesterday.","I answer it tomorrow."],"I'll answer it.","Offerta immediata: will."),
      C("use","Comunichi un piano concordato per sabato. Scegli la frase corretta.",["We're visiting the base on Saturday.","We visit the base on Saturday maybe.","We'll visiting the base on Saturday."],"We're visiting the base on Saturday.","Accordo fissato: present continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: going to / we / move / are / next year","We are going to move next year",["Next year we are going to move"],"Be going to + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: call / I'll / tomorrow / you","I'll call you tomorrow",["Tomorrow I'll call you"],"Will + verbo base.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, con going to: She ___ medicine at university. (study)","is going to study",[],"Intenzione: going to."),
      O("form","Scrivi solo la parola mancante, al present simple: The course ___ on 3 March. (start)","starts",[],"Calendario: present simple."),
      C("meaning","Scegli che cosa significa: I'll help you with that.",["un'offerta fatta ora","un piano di settimane fa","un orario fisso"],"un'offerta fatta ora","Will per offerte."),
      C("tense_choice","Hai già prenotato il volo. Scegli la forma corretta: We ___ to Paris on Friday.",["are flying","will fly maybe","fly would"],"are flying","Accordo fissato: present continuous."),
      C("use","Prometti di inviare il documento. Scegli la frase corretta.",["I'll send it this afternoon.","I send it this afternoon, promise.","I'm sending it since this afternoon."],"I'll send it this afternoon.","Promessa: will."),
      O("word_order","Metti le parole in ordine e scrivi la frase: at 7 / leaves / the bus / tomorrow","The bus leaves at 7 tomorrow",["Tomorrow the bus leaves at 7","Tomorrow at 7 the bus leaves","At 7 tomorrow the bus leaves","The bus leaves tomorrow at 7"],"Orario fisso: present simple.")
    ]
  },
  "used-to":{
    train:[
      O("form","Scrivi solo le parole mancanti: I ___ smoke, but I stopped years ago. (used to)","used to",[],"Abitudine passata finita: used to."),
      O("form","Scrivi solo le parole mancanti: She isn't used to ___ so early. (get up)","getting up",[],"Be used to richiede la forma in -ing: get up diventa getting up. La particella up resta perché get up significa alzarsi."),
      C("meaning","Scegli che cosa significa: I used to live in Naples.",["vivevo a Napoli, ora no","vivo a Napoli da poco","sono abituato a vivere a Napoli"],"vivevo a Napoli, ora no","Used to: passato non più vero."),
      C("meaning","Scegli che cosa significa: I'm used to living alone.",["sono abituato a vivere da solo","vivevo da solo","vivrò da solo"],"sono abituato a vivere da solo","Be used to + -ing: familiarità."),
      C("tense_choice","Scegli la forma corretta: When we were children, we ___ play in the street.",["would","are used to","get used to"],"would","Would per azioni ripetute nel passato."),
      C("tense_choice","Scegli la forma corretta: Did you ___ like vegetables?",["use to","used to","using to"],"use to","Dopo did: use to."),
      C("use","Parli a un collega del nuovo orario. Scegli la frase corretta.",["I'm slowly getting used to the night shifts.","I slowly get use to the night shifts.","I used to get the night shifts now."],"I'm slowly getting used to the night shifts.","Get used to: abituarsi."),
      C("use","Racconti com'era la città anni fa. Scegli la frase corretta.",["There used to be a cinema here.","There use to be a cinema here.","There was used to be a cinema here."],"There used to be a cinema here.","There used to be: esisteva un tempo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: use to / didn't / like / coffee / I","I didn't use to like coffee",[],"Negativa: didn't use to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to / is / used / she / working late","She is used to working late",[],"Be used to + -ing.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti: He ___ play football every Sunday when he was young. (used to)","used to",[],"Abitudine passata."),
      O("form","Scrivi solo la parola mancante: It took me months to get used to ___ on the left. (drive)","driving",[],"Get used to + -ing."),
      C("meaning","Scegli che cosa significa: She didn't use to wear glasses.",["prima non portava gli occhiali","non è abituata agli occhiali","non porterà gli occhiali"],"prima non portava gli occhiali","Didn't use to: passato."),
      C("tense_choice","Scegli la forma corretta: I'm not used to ___ in an open office.",["working","work","worked"],"working","Be used to + -ing."),
      C("use","Racconti un'abitudine dell'infanzia. Scegli la frase corretta.",["My grandfather used to tell us stories.","My grandfather was used to tell us stories.","My grandfather use to telling us stories."],"My grandfather used to tell us stories.","Used to + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: getting / to / used / the noise / we are","We are getting used to the noise",[],"Get used to + nome.")
    ]
  },
  "may-might":{
    train:[
      O("form","Scrivi solo la parola mancante, per esprimere una possibilità: It ___ rain later, so take an umbrella. (may o might)","may",["might"],"Possibilità: may o might."),
      O("form","Scrivi solo le parole mancanti, con may o might riferito al passato: She ___ the bus. That's why she's late. (miss)","might have missed",["may have missed"],"Possibilità nel passato: might have + participio."),
      C("meaning","Scegli che cosa significa: He might come to the party.",["forse verrà","verrà sicuramente","non può venire"],"forse verrà","Might = possibilità."),
      C("meaning","Scegli che cosa significa: May I use your phone?",["chiedo il permesso","faccio una previsione","esprimo un obbligo"],"chiedo il permesso","May I...? = permesso."),
      C("tense_choice","Non sei sicuro. Scegli la forma corretta: The office ___ be closed on Sunday.",["might","must","has to"],"might","Incertezza: might."),
      C("tense_choice","Scegli la forma corretta: They may ___ late.",["arrive","to arrive","arriving"],"arrive","Modale + verbo base."),
      C("use","Avvisi di un possibile ritardo senza certezza. Scegli la frase corretta.",["The delivery may be delayed.","The delivery must be delayed.","The delivery may delayed."],"The delivery may be delayed.","Possibilità al passivo: may be + participio."),
      C("use","In un rapporto non vuoi affermare più di quanto sai. Scegli la frase più prudente.",["The window could have been opened from outside.","The window was certainly opened from outside.","The window must opened from outside."],"The window could have been opened from outside.","Could have + participio: possibilità."),
      O("word_order","Metti le parole in ordine e scrivi la frase: might / she / the meeting / not / attend","She might not attend the meeting",[],"Might not + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: be / the answer / could / wrong","The answer could be wrong",[],"Could + be + aggettivo.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante, per esprimere una possibilità: We ___ go to the beach if it's sunny. (may o might)","might",["may"],"Possibilità: might."),
      O("form","Scrivi solo le parole mancanti, con may o might riferito al passato: He ___ the message. He hasn't replied. (not see)","may not have seen",["might not have seen"],"Possibilità negativa nel passato."),
      C("meaning","Scegli che cosa significa: It could be true.",["è possibile che sia vero","è certamente vero","è impossibile che sia vero"],"è possibile che sia vero","Could = possibilità."),
      C("tense_choice","Scegli la forma corretta: She ___ be at home; I'm not sure.",["may","must","mustn't"],"may","Incertezza: may."),
      C("use","Chiedi educatamente il permesso di sederti. Scegli la frase corretta.",["May I sit here?","May I to sit here?","Might I sitting here?"],"May I sit here?","May I + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: have / forgotten / he / might","He might have forgotten",[],"Might have + participio.")
    ]
  },
  "verb-patterns":{
    train:[
      O("form","Scrivi solo la parola mancante: I enjoy ___ in the mountains. (walk)","walking",[],"Enjoy + -ing."),
      O("form","Scrivi solo le parole mancanti: We decided ___ the car. (sell)","to sell",[],"Decide + to + verbo."),
      C("meaning","Scegli che cosa significa: He stopped smoking.",["ha smesso di fumare","si è fermato per fumare","fuma ancora"],"ha smesso di fumare","Stop + -ing = smettere."),
      C("meaning","Scegli che cosa significa: He stopped to smoke.",["si è fermato per fumare","ha smesso di fumare","non fuma mai"],"si è fermato per fumare","Stop + to = fermarsi per."),
      C("tense_choice","Scegli la forma corretta: She avoided ___ the question.",["answering","to answer","answer"],"answering","Avoid + -ing."),
      C("tense_choice","Scegli la forma corretta: They want ___ early.",["to leave","leaving","leave"],"to leave","Want + to."),
      C("use","Ringrazi per l'invito in un'email. Scegli la frase corretta.",["I look forward to meeting you.","I look forward to meet you.","I look forward meeting you."],"I look forward to meeting you.","Look forward to + -ing."),
      C("use","Chiedi un favore in modo cortese. Scegli la frase corretta.",["Would you mind closing the door?","Would you mind to close the door?","Would you mind close the door?"],"Would you mind closing the door?","Mind + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: promised / to / she / call back","She promised to call back",[],"Promise + to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: suggested / taking / he / a break","He suggested taking a break",[],"Suggest + -ing.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Do you mind ___? (wait)","waiting",[],"Mind + -ing."),
      O("form","Scrivi solo le parole mancanti: She refused ___ the form. (sign)","to sign",[],"Refuse + to."),
      C("meaning","Scegli che cosa significa: I remember locking the door.",["ricordo di averla chiusa","devo ricordarmi di chiuderla","ho dimenticato di chiuderla"],"ricordo di averla chiusa","Remember + -ing: ricordo del passato."),
      C("tense_choice","Scegli la forma corretta: I hope ___ you soon.",["to see","seeing","see"],"to see","Hope + to."),
      C("use","Proponi un'idea in riunione. Scegli la frase corretta.",["I suggest starting with the budget.","I suggest to start with the budget.","I suggest start with the budget."],"I suggest starting with the budget.","Suggest + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to / forgot / I / lock the door","I forgot to lock the door",[],"Forget + to: non l'ho fatto.")
    ]
  },
  "phrasal-basics":{
    train:[
      O("form","Scrivi solo la parola mancante: Please turn ___ the lights when you leave. (spegni)","off",[],"Turn off = spegnere."),
      O("form","Scrivi solo la parola mancante: Can you look ___ the children for an hour? (badare a)","after",[],"Look after = badare a."),
      C("meaning","Scegli che cosa significa: They called off the meeting.",["hanno annullato la riunione","hanno convocato la riunione","hanno spostato la riunione prima"],"hanno annullato la riunione","Call off = annullare."),
      C("meaning","Scegli che cosa significa: She gave up chocolate.",["ha smesso di mangiare cioccolato","ha regalato il cioccolato","ha comprato cioccolato"],"ha smesso di mangiare cioccolato","Give up = rinunciare, smettere."),
      C("tense_choice","Scegli la forma corretta: Here is the form. Please fill ___.",["it in","in it","it"],"it in","Con un pronome, il pronome va tra verbo e particella."),
      C("tense_choice","Scegli la forma corretta: I'm looking ___ my keys. Have you seen them?",["for","after","up"],"for","Look for = cercare."),
      C("use","In un rapporto scrivi che la squadra eseguirà un controllo. Scegli la frase più formale e corretta.",["The team will carry out an inspection.","The team will carry an inspection out of.","The team will do out an inspection."],"The team will carry out an inspection.","Carry out = eseguire, adatto a un rapporto."),
      C("use","Al telefono chiedi di aspettare un attimo. Scegli la frase corretta.",["Hold on a moment, please.","Hold off a moment, please.","Hold up on a moment, please."],"Hold on a moment, please.","Hold on = attendere."),
      O("word_order","Metti le parole in ordine e scrivi la frase: up / the meeting / they / set","They set up the meeting",["They set the meeting up"],"Set up = organizzare; separabile."),
      O("word_order","Metti le parole in ordine e scrivi la frase: it / please / turn / down","Please turn it down",["Turn it down please"],"Con il pronome: turn it down.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The plane took ___ on time. (decollare)","off",[],"Take off = decollare."),
      O("form","Scrivi solo la parola mancante: We have run ___ of paper. (finire)","out",[],"Run out of = finire."),
      C("meaning","Scegli che cosa significa: Please look into the complaint.",["esamina il reclamo","ignora il reclamo","scrivi il reclamo"],"esamina il reclamo","Look into = indagare, esaminare."),
      C("tense_choice","Scegli la forma corretta: The music is loud. Can you turn ___?",["it down","down it","it"],"it down","Pronome tra verbo e particella."),
      C("use","Chiedi a un collega di scoprire l'orario. Scegli la frase corretta.",["Can you find out the time of the meeting?","Can you find the time out of the meeting?","Can you find up the time of the meeting?"],"Can you find out the time of the meeting?","Find out = scoprire."),
      O("word_order","Metti le parole in ordine e scrivi la frase: picked / at the station / her / up / I","I picked her up at the station",["At the station I picked her up"],"Pick up separabile: pick her up.")
    ]
  },
  "question-meaning":{
    train:[
      C("meaning","Scegli che cosa chiede: What is your manager like?",["com'è di carattere il tuo responsabile","che cosa piace al tuo responsabile","a chi assomiglia fisicamente"],"com'è di carattere il tuo responsabile","What is X like? = com'è (carattere o qualità)."),
      C("meaning","Scegli che cosa chiede: What does your manager like?",["che cosa piace al tuo responsabile","com'è il tuo responsabile","come sta il tuo responsabile"],"che cosa piace al tuo responsabile","Like verbo = piacere."),
      C("tense_choice","Vuoi sapere come sta oggi un collega. Scegli la domanda corretta.",["How is Marco today?","What is Marco like today?","How does Marco like today?"],"How is Marco today?","Stato di salute o umore: how is...?"),
      C("use","Non hai sentito l'orario e chiedi conferma. Scegli la domanda più naturale.",["Sorry, it starts at what time?","Sorry, what time it starts?","Sorry, at what time does starts?"],"Sorry, it starts at what time?","Domanda eco: si ripete la frase con la parola interrogativa."),
      C("use","Vuoi sapere che aspetto ha la persona da accogliere in stazione. Scegli la domanda corretta.",["What does she look like?","How does she look like?","What does she like?"],"What does she look like?","Aspetto fisico: what does she look like?"),
      O("word_order","Metti le parole in ordine e scrivi la domanda: like / the new office / what / is","What is the new office like",[],"What + be + soggetto + like."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: look / what / does / he / like","What does he look like",[],"Aspetto: what does... look like.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: What is the weather ___ in Rome today?","like",[],"Com'è il tempo: what is the weather like?"),
      O("form","Scrivi solo la parola mancante: ___ are you feeling today?","How",[],"Stato: how are you feeling?"),
      C("meaning","Scegli che cosa chiede: How was the trip?",["com'è andato il viaggio","quanto è costato il viaggio","dove è stato il viaggio"],"com'è andato il viaggio","How was...? = com'è andato."),
      C("tense_choice","Vuoi sapere che carattere ha il nuovo insegnante. Scegli la domanda corretta.",["What is the new teacher like?","How is the new teacher like?","What does the new teacher like?"],"What is the new teacher like?","Carattere: what is... like?"),
      C("use","Non hai capito con chi ha parlato il collega e chiedi di ripetere. Scegli la domanda più naturale.",["Sorry, you spoke to who?","Sorry, who you spoke to?","Sorry, to who did spoke?"],"Sorry, you spoke to who?","Domanda eco con who."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: was / how / the interview","How was the interview",[],"How + was + soggetto.")
    ]
  },
  "take-collocations":{
    train:[
      C("meaning","Scegli che cosa significa: The meeting will take place on Friday.",["la riunione si terrà venerdì","la riunione durerà fino a venerdì","la riunione sarà annullata venerdì"],"la riunione si terrà venerdì","Take place = avere luogo."),
      C("meaning","Scegli che cosa significa: Take your time.",["fai con calma","sbrigati","prendi l'orologio"],"fai con calma","Take your time = senza fretta."),
      C("tense_choice","Scegli la collocazione corretta: Before deciding, we must ___ all the costs into account.",["take","make","do"],"take","Take into account = tenere conto."),
      C("use","In un rapporto scrivi che è stato preso un provvedimento. Scegli la frase corretta.",["The manager took immediate action.","The manager made immediate action.","The manager did immediate action."],"The manager took immediate action.","Take action = intervenire."),
      C("use","Chiedi a un collega di prendere appunti in riunione. Scegli la frase corretta.",["Could you take notes during the meeting?","Could you make notes of during the meeting?","Could you take note's during the meeting?"],"Could you take notes during the meeting?","Take notes = prendere appunti."),
      O("word_order","Metti le parole in ordine e scrivi la frase: part / took / in the training / she","She took part in the training",[],"Take part in = partecipare."),
      O("word_order","Metti le parole in ordine e scrivi la frase: for / the error / took / responsibility / he","He took responsibility for the error",[],"Take responsibility for.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The ceremony will take ___ in the main hall.","place",[],"Take place = avere luogo."),
      O("form","Scrivi solo la parola mancante: Please take a ___ at this document. (dare un'occhiata)","look",[],"Take a look = dare un'occhiata."),
      C("meaning","Scegli che cosa significa: It takes two hours to get there.",["servono due ore per arrivarci","ci vogliono due persone","ci si arriva alle due"],"servono due ore per arrivarci","It takes + tempo."),
      C("tense_choice","Scegli la collocazione corretta: We need to ___ a decision today.",["make","take part","do"],"make","Make a decision (britannico anche take a decision, ma qui make)."),
      C("use","Chiedi di fare una breve pausa. Scegli la frase corretta.",["Shall we take a short break?","Shall we make a short break of?","Shall we do a short break?"],"Shall we take a short break?","Take a break."),
      O("word_order","Metti le parole in ordine e scrivi la frase: into account / took / the weather / we","We took the weather into account",[],"Take something into account.")
    ]
  },
  "question-tags":{
    train:[
      C("meaning","Scegli che cosa esprime la frase con tono discendente: It's cold today, isn't it?",["chiedi di essere d'accordo","fai una domanda vera e incerta","dai un ordine"],"chiedi di essere d'accordo","Tag discendente: cerchi conferma."),
      C("tense_choice","Scegli la question tag corretta: You haven't seen my keys, ___?",["have you","haven't you","did you"],"have you","Frase negativa → tag positiva."),
      C("tense_choice","Scegli la question tag corretta: She works in Milan, ___?",["doesn't she","isn't she","does she"],"doesn't she","Present simple positivo → doesn't."),
      C("use","Vuoi confermare l'orario con un collega. Scegli la frase corretta.",["The meeting is at ten, isn't it?","The meeting is at ten, is it not it?","The meeting is at ten, doesn't it?"],"The meeting is at ten, isn't it?","Be positivo → isn't it?"),
      C("use","Proponi di iniziare. Scegli la frase corretta.",["Let's start, shall we?","Let's start, will we?","Let's start, don't we?"],"Let's start, shall we?","Dopo let's: shall we?"),
      O("word_order","Metti le parole in ordine e scrivi la frase: didn't / they / left early / they","They left early didn't they",[],"Past simple positivo → didn't they."),
      O("word_order","Metti le parole in ordine e scrivi la frase: can / he / can't / swim / he","He can swim can't he",[],"Modale positivo → tag negativa con lo stesso modale.")
    ],
    check:[
      O("form","Scrivi solo la question tag mancante: You're coming tomorrow, ___?","aren't you",[],"Be positivo → aren't you."),
      O("form","Scrivi solo la question tag mancante: He didn't call, ___?","did he",[],"Negativa → tag positiva."),
      C("meaning","Scegli che cosa esprime la frase con tono ascendente: You've paid the bill, haven't you?",["non sei sicuro e chiedi davvero","sei certo e cerchi solo conferma","dai un ordine"],"non sei sicuro e chiedi davvero","Tono ascendente: domanda vera."),
      C("tense_choice","Scegli la question tag corretta: Nobody called, ___?",["did they","didn't they","did nobody"],"did they","Nobody rende la frase negativa: tag positiva con they."),
      C("use","Confermi con un ospite che è la prima visita. Scegli la frase corretta.",["This is your first visit, isn't it?","This is your first visit, is this?","This is your first visit, doesn't it?"],"This is your first visit, isn't it?","This is → isn't it."),
      O("word_order","Metti le parole in ordine e scrivi la frase: won't / it / will / be easy / it","It won't be easy will it",[],"Will negativo → will it.")
    ]
  },
  "auxiliary-responses":{
    train:[
      C("meaning","Scegli che cosa significa la risposta: 'I love jazz.' 'So do I.'",["anche a me piace","a me no","davvero?"],"anche a me piace","So + ausiliare + soggetto = anch'io."),
      C("meaning","Scegli che cosa significa la risposta: 'I can't swim.' 'Neither can I.'",["neanch'io so nuotare","io invece sì","ne sei sicuro?"],"neanch'io so nuotare","Neither + ausiliare + soggetto = neanch'io."),
      C("tense_choice","Scegli la risposta corretta: 'I went to the meeting.' '___'",["So did I.","So went I.","So do I."],"So did I.","Past simple → did."),
      C("use","Un collega dice che non ha ricevuto la circolare. Rispondi «neanch'io». Scegli la frase corretta.",["Neither have I.","Neither I have.","So haven't I."],"Neither have I.","Haven't received → neither have I."),
      C("use","Qualcuno dice che non hai controllato la porta; tu l'hai fatto davvero. Scegli la frase più adatta.",["I did check it!","I checked did it!","I do checked it!"],"I did check it!","Did + verbo base per dare enfasi."),
      O("word_order","Metti le parole in ordine e scrivi la frase: am / so / I","So am I",[],"Risposta a una frase con am/is/are."),
      O("word_order","Metti le parole in ordine e scrivi la frase: does / neither / she","Neither does she",[],"Neither + does + soggetto.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti: 'I'm tired.' '___ I.'","So am",[],"So + am + I."),
      O("form","Scrivi solo le parole mancanti: 'She doesn't drive.' '___ I.' (= neanch'io)","Neither do",["Nor do"],"Neither + do + I."),
      C("meaning","Scegli che cosa significa: 'Did you lock the door?' 'I did.'",["sì, l'ho chiusa","no, non l'ho chiusa","la chiuderò"],"sì, l'ho chiusa","Risposta breve con l'ausiliare."),
      C("tense_choice","Scegli la risposta corretta: 'I have finished.' '___'",["So have I.","So did I.","So am I."],"So have I.","Have finished → have."),
      C("use","Rispondi «io sì» a: 'I don't like the new rules.' Scegli la frase corretta.",["I do.","I don't.","I like."],"I do.","Disaccordo breve con do."),
      O("word_order","Metti le parole in ordine e scrivi la frase: can / neither / we","Neither can we",[],"Neither + modale + soggetto.")
    ]
  },
  "quantifiers-of":{
    train:[
      C("meaning","Scegli che cosa significa: None of the files were damaged.",["nessun fascicolo era danneggiato","alcuni erano danneggiati","tutti erano danneggiati"],"nessun fascicolo era danneggiato","None of = nessuno di."),
      C("tense_choice","Scegli la forma corretta: ___ of my colleagues live in Rome.",["Most","Most the","The most"],"Most","Most of + determinante."),
      C("tense_choice","Scegli la forma corretta: ___ people like long meetings.",["Few","Few of","A few of"],"Few","Gruppo generico: few + nome, senza of."),
      C("use","Nel rapporto dici che entrambe le porte erano chiuse. Scegli la frase corretta.",["Both of the doors were locked.","Both of doors were locked.","Both the door was locked."],"Both of the doors were locked.","Both of + the + plurale."),
      C("use","Dici che nessuno degli studenti era assente. Scegli la frase corretta.",["None of the students were absent.","No of the students were absent.","None students were absent."],"None of the students were absent.","None of + the + plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: of / all / the rooms / were / checked","All of the rooms were checked",[],"All (of) the + plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: of them / speaks / neither / French","Neither of them speaks French",[],"Neither of + verbo singolare (formale).")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: ___ of the visitors arrived late. (nessuno)","None",[],"None of = nessuno di."),
      O("form","Scrivi solo la parola mancante: Most ___ the documents are online.","of",[],"Most of + the."),
      C("meaning","Scegli che cosa significa: Some of the answers are wrong.",["alcune risposte sono sbagliate","tutte le risposte sono sbagliate","nessuna risposta è sbagliata"],"alcune risposte sono sbagliate","Some of = alcuni di."),
      C("tense_choice","Scegli la forma corretta: ___ of the two options is good.",["Neither","None","Every"],"Neither","Tra due: neither."),
      C("use","Dici che la maggior parte delle persone ha capito. Scegli la frase corretta.",["Most people understood.","The most of people understood.","Most of people understood."],"Most people understood.","Generico: most + nome."),
      O("word_order","Metti le parole in ordine e scrivi la frase: each / has / of them / a badge","Each of them has a badge",[],"Each of + verbo singolare.")
    ]
  },
  "too-enough":{
    train:[
      C("meaning","Scegli che cosa significa: The box is too heavy to lift.",["è così pesante che non si può sollevare","si può sollevare facilmente","è abbastanza leggera"],"è così pesante che non si può sollevare","Too + aggettivo + to: eccesso."),
      C("tense_choice","Scegli la forma corretta: She isn't old ___ to drive.",["enough","too","so"],"enough","Aggettivo + enough."),
      C("tense_choice","Scegli la forma corretta: There are ___ people in the room.",["too many","too much","enough of"],"too many","Numerabile: too many."),
      C("use","Dici che non c'è abbastanza tempo per finire. Scegli la frase corretta.",["We don't have enough time to finish.","We don't have time enough for finish.","We have too time to finish."],"We don't have enough time to finish.","Enough + nome + to."),
      C("use","Ti lamenti del rumore. Scegli la frase corretta.",["It's too noisy to concentrate.","It's enough noisy to concentrate.","It's too much noisy to concentrate."],"It's too noisy to concentrate.","Too + aggettivo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: enough / not / is / big / the room","The room is not big enough",[],"Aggettivo + enough."),
      O("word_order","Metti le parole in ordine e scrivi la frase: too / to understand / fast / he spoke","He spoke too fast to understand",[],"Too + avverbio + to.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The coffee is ___ hot to drink. (eccesso)","too",[],"Eccesso: too."),
      O("form","Scrivi solo la parola mancante: Is the text clear ___?","enough",[],"Aggettivo + enough."),
      C("meaning","Scegli che cosa significa: He's tall enough to reach the shelf.",["arriva allo scaffale","non ci arriva","è troppo alto per lo scaffale"],"arriva allo scaffale","Enough: sufficiente."),
      C("tense_choice","Scegli la forma corretta: There is ___ traffic today.",["too much","too many","enough of"],"too much","Non numerabile: too much."),
      C("use","Dici che il budget non basta per il progetto. Scegli la frase corretta.",["The budget isn't enough for the project.","The budget isn't too for the project.","The budget isn't enough big for the project."],"The budget isn't enough for the project.","Be + enough."),
      O("word_order","Metti le parole in ordine e scrivi la frase: too / were / the instructions / complicated","The instructions were too complicated",[],"Too + aggettivo.")
    ]
  },
  "so-such":{
    train:[
      C("meaning","Scegli che cosa esprime la frase: It was such a long day that I fell asleep at once.",["una conseguenza dell'intensità","una causa esterna","un desiderio"],"una conseguenza dell'intensità","Such ... that: conseguenza."),
      C("tense_choice","Scegli la forma corretta: The film was ___ boring that we left.",["so","such","such a"],"so","So + aggettivo."),
      C("tense_choice","Scegli la forma corretta: It was ___ nice weather that we ate outside.",["such","so","such a"],"such","Such + aggettivo + nome non numerabile."),
      C("use","Ringrazi per una serata piacevole. Scegli la frase corretta.",["It was such a lovely evening!","It was so a lovely evening!","It was such lovely an evening!"],"It was such a lovely evening!","Such a + aggettivo + nome."),
      C("use","Spieghi perché sei arrivato in anticipo. Scegli la frase corretta.",["The traffic was so light that I arrived early.","The traffic was such light that I arrived early.","The traffic was so light than I arrived early."],"The traffic was so light that I arrived early.","So + aggettivo + that."),
      O("word_order","Metti le parole in ordine e scrivi la frase: such / they are / people / kind","They are such kind people",[],"Such + aggettivo + nome plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: so / that / tired / I was / I slept for ten hours","I was so tired that I slept for ten hours",[],"So + aggettivo + that.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: She speaks ___ quickly that nobody understands her.","so",[],"So + avverbio."),
      O("form","Scrivi solo le parole mancanti: It was ___ good idea that everyone agreed.","such a",[],"Such a + aggettivo + nome singolare."),
      C("meaning","Scegli che cosa significa: I've never seen so many people.",["non ho mai visto così tante persone","ho visto poche persone","non ho mai visto nessuno"],"non ho mai visto così tante persone","So many: quantità intensa."),
      C("tense_choice","Scegli la forma corretta: They were ___ good players that they won easily.",["such","so","such a"],"such","Such + aggettivo + plurale."),
      C("use","Ti lamenti di un problema difficile. Scegli la frase corretta.",["It's such a difficult problem.","It's so a difficult problem.","It's such difficult problem."],"It's such a difficult problem.","Such a + aggettivo + nome."),
      O("word_order","Metti le parole in ordine e scrivi la frase: so / was / that / the room / dark / we couldn't see","The room was so dark that we couldn't see",[],"So + aggettivo + that.")
    ]
  },
  "other-another":{
    train:[
      C("meaning","Scegli che cosa significa: Can I have another coffee?",["un altro caffè, in più","un caffè diverso, non quello","tutti gli altri caffè"],"un altro caffè, in più","Another = uno in più."),
      C("tense_choice","Scegli la forma corretta: Some people agreed; ___ didn't.",["others","other","another"],"others","Others senza nome = gli altri."),
      C("tense_choice","Ci sono due chiavi: una è qui. Scegli la forma corretta: Where is ___ one?",["the other","another","others"],"the other","Tra due, la seconda: the other."),
      C("use","Il collega non può domani e proponi un altro giorno. Scegli la frase corretta.",["Shall we choose another day?","Shall we choose other day?","Shall we choose an other day?"],"Shall we choose another day?","Another + nome singolare."),
      C("use","Chiedi se ci sono altre domande. Scegli la frase corretta.",["Are there any other questions?","Are there any another questions?","Are there any others questions?"],"Are there any other questions?","Other + nome plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: each other / helped / they","They helped each other",[],"Each other = reciprocamente."),
      O("word_order","Metti le parole in ordine e scrivi la frase: two / another / we need / days","We need another two days",[],"Another + numero + nome plurale.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I don't like this room. Can I see ___ one?","another",[],"Un'altra, qualsiasi: another."),
      O("form","Scrivi solo la parola mancante: One of my brothers is a doctor; the ___ is a teacher.","other",[],"Il secondo di due: the other."),
      C("meaning","Scegli che cosa significa: The others stayed at home.",["gli altri del gruppo sono rimasti a casa","altre persone sconosciute","un altro è rimasto a casa"],"gli altri del gruppo sono rimasti a casa","The others = il resto del gruppo."),
      C("tense_choice","Scegli la forma corretta: We need ___ information.",["other","another","others"],"other","Non numerabile: other."),
      C("use","Chiedi un'altra copia del modulo. Scegli la frase corretta.",["Could I have another copy, please?","Could I have other copy, please?","Could I have an others copy, please?"],"Could I have another copy, please?","Another + singolare."),
      O("word_order","Metti le parole in ordine e scrivi la frase: other / colleagues / some / disagreed","Some other colleagues disagreed",[],"Other + plurale.")
    ]
  },
  "do-make":{
    train:[
      C("meaning","Scegli che cosa significa: She made a mistake.",["ha fatto un errore","ha riparato un errore","ha evitato un errore"],"ha fatto un errore","Make a mistake."),
      C("tense_choice","Scegli il verbo corretto: I need to ___ my homework.",["do","make","take"],"do","Do homework."),
      C("tense_choice","Scegli il verbo corretto: Can you ___ a phone call for me?",["make","do","take on"],"make","Make a call."),
      C("use","Nel rapporto scrivi che il gruppo ha fatto progressi. Scegli la frase corretta.",["The team has made good progress.","The team has done good progress.","The team has made a good progresses."],"The team has made good progress.","Make progress (non numerabile)."),
      C("use","Ringrazi un collega per l'aiuto. Scegli la frase corretta.",["Thank you, you did me a big favour.","Thank you, you made me a big favour.","Thank you, you did me a big favours."],"Thank you, you did me a big favour.","Do someone a favour."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the shopping / do / on Saturday / I","I do the shopping on Saturday",["On Saturday I do the shopping"],"Do the shopping."),
      O("word_order","Metti le parole in ordine e scrivi la frase: a decision / made / they / quickly","They made a decision quickly",["They quickly made a decision"],"Make a decision.")
    ],
    check:[
      O("form","Scrivi solo il verbo mancante nella forma base, do o make: Please don't ___ so much noise.","make",[],"Make noise."),
      O("form","Scrivi solo il verbo mancante al past simple, do o make: She ___ her best in the test.","did",[],"Do one's best."),
      C("meaning","Scegli che cosa significa: We need to make an effort.",["dobbiamo impegnarci","dobbiamo fare una pausa","dobbiamo fare la spesa"],"dobbiamo impegnarci","Make an effort."),
      C("tense_choice","Scegli il verbo corretto: Who is going to ___ the washing-up?",["do","make","have made"],"do","Do the washing-up."),
      C("use","Proponi di preparare un piano. Scegli la frase corretta.",["Let's make a plan.","Let's do a plan of.","Let's make the plans of."],"Let's make a plan.","Make a plan."),
      O("word_order","Metti le parole in ordine e scrivi la frase: research / doing / is / she / on the topic","She is doing research on the topic",[],"Do research.")
    ]
  },
  "get-go":{
    train:[
      C("meaning","Scegli che cosa significa: It's getting dark.",["sta diventando buio","è buio da ore","prendi il buio"],"sta diventando buio","Get + aggettivo = diventare."),
      C("meaning","Scegli che cosa significa: The milk has gone off.",["il latte è andato a male","il latte è finito","il latte è stato bevuto"],"il latte è andato a male","Go off = andare a male."),
      C("tense_choice","Scegli la forma corretta: What time did you ___ home last night?",["get","go to","arrive to"],"get","Get home = arrivare a casa (senza to)."),
      C("use","Dici che ti sei perso in città. Scegli la frase corretta.",["I got lost in the old town.","I went lost in the old town.","I got losing in the old town."],"I got lost in the old town.","Get lost = perdersi."),
      C("use","Dici che la situazione sta peggiorando. Scegli la frase corretta.",["The situation is getting worse.","The situation is going worse.","The situation gets worser."],"The situation is getting worse.","Get worse = peggiorare."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to work / got / late / she","She got to work late",[],"Get to = arrivare a."),
      O("word_order","Metti le parole in ordine e scrivi la frase: went / quiet / suddenly / the room","Suddenly the room went quiet",["The room suddenly went quiet","The room went quiet suddenly"],"Go + aggettivo per cambiamenti improvvisi.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Hurry up, we're ___ late. (get)","getting",[],"Get late: si sta facendo tardi."),
      O("form","Scrivi solo la parola mancante: When did you ___ married? (get)","get",[],"Get married = sposarsi."),
      C("meaning","Scegli che cosa significa: The plan went wrong.",["il piano non è riuscito","il piano è partito","il piano è stato cambiato"],"il piano non è riuscito","Go wrong = andare storto."),
      C("tense_choice","Scegli la forma corretta: I'm going to ___ ready for the meeting.",["get","go","make"],"get","Get ready = prepararsi."),
      C("use","Chiedi come arrivare alla stazione. Scegli la frase corretta.",["How do I get to the station?","How do I go the station?","How do I get the station to?"],"How do I get to the station?","Get to + luogo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: better / she / is / getting","She is getting better",[],"Get better = migliorare.")
    ]
  },
  "stative-dynamic":{
    train:[
      C("meaning","Scegli che cosa significa: I'm thinking about the offer.",["sto valutando l'offerta","penso che l'offerta sia buona","ho deciso sull'offerta"],"sto valutando l'offerta","Think dinamico = riflettere, può andare al continuous."),
      C("meaning","Scegli che cosa significa: I think the offer is good.",["è la mia opinione","ci sto riflettendo adesso","ci ho pensato ieri"],"è la mia opinione","Think di stato = opinione: present simple."),
      C("tense_choice","Scegli la forma corretta: This bag ___ to my colleague.",["belongs","is belonging","belonging"],"belongs","Belong è un verbo di stato."),
      C("use","Al telefono dici che stai assaggiando il piatto. Scegli la frase corretta.",["I'm tasting the sauce now.","I taste the sauce now, it is tasting.","I'm taste the sauce now."],"I'm tasting the sauce now.","Taste come azione: continuous."),
      C("use","Esprimi la tua attuale opinione favorevole sulla proposta. Scegli la frase che la comunica.",["I agree with your proposal.","I disagree with your proposal.","I have not decided whether I agree with your proposal."],"I agree with your proposal.","I agree esprime accordo; I disagree disaccordo; l’ultima frase lascia il giudizio in sospeso. Il continuous non è sempre impossibile, ma non è necessario per questa opinione."),
      O("word_order","Metti le parole in ordine e scrivi la frase: a great time / we / are having","We are having a great time",[],"Have come esperienza: continuous possibile."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the answer / know / don't / I","I don't know the answer",[],"Know è di stato: simple.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante al present simple: This coat ___ too much. (cost)","costs",[],"Cost è di stato."),
      O("form","Scrivi solo le parole mancanti al present continuous: She ___ a baby in May. (have)","is having",[],"Have = partorire/esperienza: continuous possibile."),
      C("meaning","Scegli che cosa significa: He's being rude.",["si sta comportando in modo maleducato adesso","è sempre maleducato","era maleducato"],"si sta comportando in modo maleducato adesso","Be + -ing: comportamento temporaneo."),
      C("tense_choice","Scegli la forma corretta: I ___ you are right.",["believe","am believing","believing"],"believe","Believe è di stato."),
      C("use","Dici che il nuovo orario ti piace. Scegli la frase corretta.",["I like the new timetable.","I'm liking the new timetable since.","I am like the new timetable."],"I like the new timetable.","Like: stato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: weighs / the parcel / two kilos","The parcel weighs two kilos",[],"Weigh di stato: simple.")
    ]
  },
  "time-contrasts":{
    train:[
      C("meaning","Scegli che cosa significa: Please reply by Friday.",["rispondi al più tardi venerdì","rispondi da venerdì in poi","rispondi ogni venerdì"],"rispondi al più tardi venerdì","By = entro una scadenza."),
      C("meaning","Scegli che cosa significa: The office is open until six.",["resta aperto fino alle sei","apre alle sei","chiude prima delle sei"],"resta aperto fino alle sei","Until = fino a (continuità)."),
      C("tense_choice","Scegli la forma corretta: I fell asleep ___ the film.",["during","while","for"],"during","During + nome."),
      C("use","Comunichi una scadenza in un'email. Scegli la frase corretta.",["Please send the form by 5 June.","Please send the form until 5 June.","Please send the form during 5 June."],"Please send the form by 5 June.","Scadenza: by."),
      C("use","Dici da quanto aspetti. Scegli la frase corretta.",["I've been waiting for twenty minutes.","I've been waiting since twenty minutes.","I've been waiting during twenty minutes."],"I've been waiting for twenty minutes.","Durata: for."),
      O("word_order","Metti le parole in ordine e scrivi la frase: while / I / was cooking / she called","She called while I was cooking",["While I was cooking she called"],"While + frase."),
      O("word_order","Metti le parole in ordine e scrivi la frase: since / here / lived / have / we / 2018","We have lived here since 2018",[],"Since + punto di partenza.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante, for o since: She has worked here ___ March.","since",[],"Punto di partenza: since."),
      O("form","Scrivi solo la parola mancante, during o while: Don't talk ___ the exam.","during",[],"During + nome."),
      C("meaning","Scegli che cosa significa: We worked from nine to five.",["dalle nove alle cinque","dalle nove in poi","fino alle nove"],"dalle nove alle cinque","From ... to: inizio e fine."),
      C("tense_choice","Scegli la forma corretta: Wait here ___ I come back.",["until","by","during"],"until","Until + frase: fino a quando."),
      C("use","Chiedi di finire il lavoro entro domani. Scegli la frase corretta.",["Can you finish it by tomorrow?","Can you finish it until tomorrow?","Can you finish it since tomorrow?"],"Can you finish it by tomorrow?","Scadenza: by."),
      O("word_order","Metti le parole in ordine e scrivi la frase: for / stayed / three nights / we","We stayed for three nights",[],"Durata: for.")
    ]
  },
  "perfect-adverbs":{
    train:[
      C("meaning","Scegli che cosa significa: Has he arrived yet?",["è già arrivato? (me lo aspetto)","è ancora qui?","arriverà mai?"],"è già arrivato? (me lo aspetto)","Yet nelle domande: aspettativa."),
      C("meaning","Scegli che cosa significa: She has gone to London.",["è a Londra adesso o in viaggio","è stata a Londra ed è tornata","non è mai stata a Londra"],"è a Londra adesso o in viaggio","Gone to: non è ancora tornata."),
      C("tense_choice","Scegli la forma corretta: I've ___ been to Japan twice.",["already","yet","still"],"already","Already nelle affermative."),
      C("use","Il responsabile chiede del rapporto e non l'hai finito. Scegli la frase corretta.",["I haven't finished it yet.","I haven't finished it already.","I still have finished it."],"I haven't finished it yet.","Yet nelle negative."),
      C("use","Dici che stai ancora aspettando una risposta. Scegli la frase corretta.",["I'm still waiting for an answer.","I'm yet waiting for an answer.","I'm already waiting for an answer still."],"I'm still waiting for an answer.","Still = ancora, continuità."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: ever / you / been / have / to Ireland","Have you ever been to Ireland",[],"Ever tra soggetto e participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: just / has / the bus / left","The bus has just left",[],"Just tra have e participio.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Have you finished ___? (già, in domanda)","yet",["already"],"Yet chiede se qualcosa di atteso è avvenuto; already può esprimere sorpresa perché è avvenuto prima del previsto. La consegna consente entrambe le letture."),
      O("form","Scrivi solo la parola mancante: She has ___ left; you've missed her. (appena)","just",[],"Just = appena."),
      C("meaning","Scegli che cosa significa: I've been to Paris.",["ci sono stato e sono tornato","sono a Parigi adesso","andrò a Parigi"],"ci sono stato e sono tornato","Been to: esperienza, ritorno."),
      C("tense_choice","Scegli la forma corretta: It's ten o'clock and he ___ in bed.",["is still","is yet","has already being"],"is still","Still: continuità."),
      C("use","Dici a un collega che hai già inviato il file. Scegli la frase corretta.",["I've already sent the file.","I've sent yet the file.","I've still sent the file."],"I've already sent the file.","Already tra have e participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: never / we / have / met","We have never met",[],"Never tra have e participio.")
    ]
  },
  "ed-ing-adjectives":{
    train:[
      C("meaning","Scegli che cosa significa: The lecture was boring.",["la lezione era noiosa","chi ascoltava era annoiato, non la lezione","la lezione si annoiava"],"la lezione era noiosa","-ing descrive la causa."),
      C("meaning","Scegli che cosa significa: I was bored during the lecture.",["mi sono annoiato","ero noioso","la lezione era interessante"],"mi sono annoiato","-ed descrive la sensazione."),
      C("tense_choice","Scegli la forma corretta: The news was ___.",["surprising","surprised","surprise"],"surprising","La notizia causa sorpresa: -ing."),
      C("use","Descrivi la tua reazione a un risultato. Scegli la frase corretta.",["I'm very disappointed with the result.","I'm very disappointing with the result.","I'm very disappoint with the result."],"I'm very disappointed with the result.","Sensazione: -ed."),
      C("use","Presenti un libro come interessante. Scegli la frase corretta.",["It's a really interesting book.","It's a really interested book.","It's a really interest book."],"It's a really interesting book.","Causa: -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: confused / were / the visitors","The visitors were confused",[],"Sensazione delle persone: -ed."),
      O("word_order","Metti le parole in ordine e scrivi la frase: tiring / a / was / it / journey","It was a tiring journey",[],"Il viaggio causa stanchezza: -ing.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I'm ___ in history. (interest → aggettivo)","interested",[],"Persona che prova interesse: -ed."),
      O("form","Scrivi solo la parola mancante: The film was really ___. (frighten → aggettivo)","frightening",[],"Causa paura: -ing."),
      C("meaning","Scegli che cosa significa: She looks worried.",["sembra preoccupata","è preoccupante","preoccupa gli altri"],"sembra preoccupata","-ed: sensazione."),
      C("tense_choice","Scegli la forma corretta: The instructions were ___.",["confusing","confused","confuse"],"confusing","Le istruzioni causano confusione."),
      C("use","Dici che sei stanco dopo il turno. Scegli la frase corretta.",["I'm exhausted after the shift.","I'm exhausting after the shift.","I'm exhaust after the shift."],"I'm exhausted after the shift.","Sensazione: -ed."),
      O("word_order","Metti le parole in ordine e scrivi la frase: amazing / view / the / was","The view was amazing",[],"Causa stupore: -ing.")
    ]
  },
  "adjective-patterns":{
    train:[
      C("meaning","Scegli che cosa significa: the rich",["le persone ricche","una cosa ricca","il più ricco"],"le persone ricche","The + aggettivo = gruppo di persone."),
      C("word_order","Descrivi un tavolo. Scegli l'ordine corretto degli aggettivi.",["a large old wooden table","a wooden old large table","an old wooden large table"],"a large old wooden table","Dimensione, età, materiale."),
      C("tense_choice","Scegli la forma corretta: She is ___.",["alone","an alone woman","alone woman"],"alone","Alone non va davanti al nome."),
      C("use","Descrivi una borsa smarrita nel rapporto. Scegli la frase corretta.",["a small black leather bag","a black small leather bag","a leather small black bag"],"a small black leather bag","Dimensione, colore, materiale."),
      C("use","Descrivi un collega addormentato. Scegli la frase corretta.",["The guard was asleep.","The guard was an asleep guard.","The asleep guard was."],"The guard was asleep.","Asleep si usa dopo il verbo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: beautiful / a / garden / small / they have","They have a beautiful small garden",[],"Opinione prima della dimensione."),
      O("word_order","Metti le parole in ordine e scrivi la frase: help / the elderly / need / often","The elderly often need help",[],"The + aggettivo = gruppo; verbo plurale.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The ___ need more support. (poor, gruppo di persone)","poor",[],"The poor = i poveri."),
      O("form","Scrivi solo le parole mancanti in ordine: a ___ car (new / red)","new red",[],"Età prima del colore."),
      C("meaning","Scegli che cosa significa: The injured were taken to hospital.",["i feriti sono stati portati in ospedale","il ferito ha portato altri in ospedale","l'ospedale era danneggiato"],"i feriti sono stati portati in ospedale","The + aggettivo: persone."),
      C("word_order","Descrivi una casetta. Scegli l'ordine corretto degli aggettivi.",["a lovely little cottage","a little lovely cottage","a cottage little lovely"],"a lovely little cottage","Opinione prima della dimensione."),
      C("use","Descrivi un oggetto trovato. Scegli la frase corretta.",["a round metal box","a metal round box","a box round metal"],"a round metal box","Forma prima del materiale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: awake / still / was / she","She was still awake",[],"Awake dopo il verbo.")
    ]
  },
  "degree-adverbs":{
    train:[
      C("meaning","Scegli che cosa significa: The test was fairly easy.",["era abbastanza facile, senza esagerare","era facilissimo","era difficile"],"era abbastanza facile, senza esagerare","Fairly = moderatamente."),
      C("meaning","Scegli che cosa significa: The results are rather disappointing.",["sono piuttosto deludenti","sono un po' migliori","sono ottimi"],"sono piuttosto deludenti","Rather con significato negativo: piuttosto."),
      C("tense_choice","Scegli la forma corretta: It's ___ a long way.",["quite","very","fairly a"],"quite","Quite a + nome."),
      C("use","In un rapporto prudente scrivi che l'ipotesi è probabile, non certa. Scegli la frase corretta.",["It is quite likely that the door was forced.","It is very certainly that the door was forced.","It is likely quite that the door was forced."],"It is quite likely that the door was forced.","Quite likely: probabilità moderata."),
      C("use","Nel parlato informale dici che il film era abbastanza bello. Scegli la frase più naturale.",["It was pretty good.","It was good pretty.","It was a pretty good of."],"It was pretty good.","Pretty = abbastanza (informale)."),
      O("word_order","Metti le parole in ordine e scrivi la frase: rather / was / cold / it","It was rather cold",[],"Rather + aggettivo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: an / quite / interesting / it was / idea","It was quite an interesting idea",[],"Quite an + aggettivo + nome.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The meeting was ___ useful. (abbastanza, neutro)","fairly",["quite"],"Fairly/quite = abbastanza."),
      O("form","Scrivi solo la parola mancante: The exam was ___ difficult. (molto)","very",[],"Very = molto."),
      C("meaning","Scegli che cosa significa: He's quite tall.",["è piuttosto alto","è bassissimo","è il più alto"],"è piuttosto alto","Quite = piuttosto."),
      C("tense_choice","Scegli la forma corretta: That's ___ a surprise!",["quite","fairly","pretty a"],"quite","Quite a + nome."),
      C("use","Dici in modo prudente che il piano probabilmente funzionerà. Scegli la frase corretta.",["The plan will probably work.","The plan will work probably surely.","The plan probably will to work."],"The plan will probably work.","Probably tra will e verbo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: pretty / the food / good / was","The food was pretty good",[],"Pretty + aggettivo.")
    ]
  },
  preferences:{
    train:[
      C("meaning","Scegli che cosa significa: I'd rather stay at home tonight.",["stasera preferirei restare a casa","resto sempre a casa","sono rimasto a casa"],"stasera preferirei restare a casa","Would rather + verbo base: preferenza ora."),
      C("meaning","Scegli che cosa significa: I prefer tea to coffee.",["in generale preferisco il tè","stasera vorrei un tè","non mi piace il tè"],"in generale preferisco il tè","Prefer A to B: preferenza generale."),
      C("tense_choice","Scegli la forma corretta: I'd rather ___ by train.",["travel","to travel","travelling"],"travel","Would rather + verbo base."),
      C("use","Rispondi a un'offerta in modo cortese. Scegli la frase corretta.",["I'd prefer to sit by the window, if possible.","I prefer sit by the window, if possible.","I'd rather to sit by the window, if possible."],"I'd prefer to sit by the window, if possible.","Would prefer + to."),
      C("use","Chiedi a un collega di non chiamarti dopo le dieci. Scegli la frase corretta.",["I'd rather you didn't call after ten.","I'd rather you don't calling after ten.","I'd rather you not to call after ten."],"I'd rather you didn't call after ten.","Would rather + soggetto + passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: walking / prefer / to driving / I","I prefer walking to driving",[],"Prefer -ing to -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: rather / I'd / wait / here","I'd rather wait here",[],"Would rather + verbo base.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I'd rather ___ now. (leave)","leave",[],"Would rather + verbo base."),
      O("form","Scrivi solo le parole mancanti: Would you prefer ___ outside? (eat)","to eat",[],"Would prefer + to."),
      C("meaning","Scegli che cosa significa: She'd rather we came tomorrow.",["preferirebbe che venissimo domani","verremo domani di sicuro","siamo venuti ieri"],"preferirebbe che venissimo domani","Would rather + soggetto + passato."),
      C("tense_choice","Scegli la forma corretta: I prefer reading ___ watching TV.",["to","than","from"],"to","Prefer A to B."),
      C("use","Al ristorante esprimi una preferenza. Scegli la frase corretta.",["I'd rather have the fish.","I'd rather to have the fish.","I'd rather having the fish."],"I'd rather have the fish.","Would rather + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to work / prefer / I / alone","I prefer to work alone",[],"Prefer + to.")
    ]
  },
  "had-better-time":{
    train:[
      C("meaning","Scegli che cosa significa: You'd better leave now.",["è meglio che tu vada adesso, altrimenti ci saranno problemi","sei andato via prima","andrai via domani"],"è meglio che tu vada adesso, altrimenti ci saranno problemi","Had better: consiglio forte con conseguenza."),
      C("meaning","Scegli che cosa significa: It's time we went home.",["è ora di andare a casa","siamo andati a casa","andremo a casa un giorno"],"è ora di andare a casa","It's time + passato: è ora che."),
      C("tense_choice","Scegli la forma corretta: You'd better ___ late again.",["not be","not to be","don't be"],"not be","Had better not + verbo base."),
      C("use","Avverti un collega di portare il badge, altrimenti non entra. Scegli la frase corretta.",["You'd better bring your badge.","You'd better to bring your badge.","You'd better bringing your badge."],"You'd better bring your badge.","Had better + verbo base."),
      C("use","Dici che è ora di cambiare il sistema. Scegli la frase corretta.",["It's time we changed the system.","It's time we change the system since.","It's time to changing the system."],"It's time we changed the system.","It's time + soggetto + passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: better / we'd / hurry","We'd better hurry",[],"Had better + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to go / it's / time","It's time to go",[],"It's time + to.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: You'd better ___ a coat. It's cold. (take)","take",[],"Had better + verbo base."),
      O("form","Scrivi solo la parola mancante al passato: It's time you ___ to bed. (go)","went",[],"It's time + passato."),
      C("meaning","Scegli che cosa significa: We'd better not tell him.",["è meglio non dirglielo","gliel'abbiamo detto","dobbiamo dirglielo"],"è meglio non dirglielo","Had better not."),
      C("tense_choice","Scegli la forma corretta: It's high time she ___ a decision.",["made","makes","make"],"made","It's high time + passato."),
      C("use","Consigli con urgenza di salvare il lavoro. Scegli la frase corretta.",["You'd better save your work now.","You'd better saving your work now.","You better to save your work now."],"You'd better save your work now.","Had better + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: not / you'd / better / be late","You'd better not be late",[],"Had better not + verbo base.")
    ]
  },
  "need-past":{
    train:[
      C("meaning","Scegli che cosa significa: You needn't have brought food.",["hai portato da mangiare ma non serviva","non hai portato da mangiare","devi portare da mangiare"],"hai portato da mangiare ma non serviva","Needn't have + participio: azione inutile già fatta."),
      C("meaning","Scegli che cosa significa: We didn't need to wait.",["non è stato necessario aspettare","abbiamo aspettato inutilmente","dobbiamo aspettare"],"non è stato necessario aspettare","Didn't need to: non era necessario."),
      C("tense_choice","Scegli la forma corretta: The car needs ___.",["washing","to washing","wash"],"washing","Need + -ing con significato passivo."),
      C("use","Dici a un collega che non serve stampare il documento. Scegli la frase corretta.",["You don't need to print it.","You don't need print it.","You needn't to print it."],"You don't need to print it.","Don't need to + verbo base."),
      C("use","Dici che il modulo deve essere firmato. Scegli la frase corretta.",["The form needs to be signed.","The form needs signed to be.","The form need to be signing."],"The form needs to be signed.","Need to be + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: have / needn't / you / worried","You needn't have worried",[],"Needn't have + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: repairing / needs / the roof","The roof needs repairing",[],"Need + -ing.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: You needn't ___ come. We managed. (have)","have",[],"Needn't have + participio."),
      O("form","Scrivi solo le parole mancanti: The windows need ___. (clean, passivo con to)","to be cleaned",[],"Need to be + participio."),
      C("meaning","Scegli che cosa significa: She didn't need to take a taxi.",["non era necessario prendere il taxi","ha preso il taxi inutilmente","deve prendere il taxi"],"non era necessario prendere il taxi","Didn't need to."),
      C("tense_choice","Scegli la forma corretta: You ___ bring anything; there's plenty of food.",["needn't","needn't to","don't need"],"needn't","Needn't + verbo base."),
      C("use","Dici che hai comprato i biglietti, ma non serviva. Scegli la frase corretta.",["I needn't have bought the tickets.","I didn't need buy the tickets.","I needn't bought the tickets."],"I needn't have bought the tickets.","Needn't have + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: need / do / to book / we","Do we need to book",[],"Domanda con need to.")
    ]
  },
  perception:{
    train:[
      C("meaning","Scegli che cosa significa: I saw him cross the road.",["l'ho visto attraversare tutta la strada","l'ho visto mentre attraversava","non l'ho visto"],"l'ho visto attraversare tutta la strada","Verbo di percezione + base: azione intera."),
      C("meaning","Scegli che cosa significa: I saw him crossing the road.",["l'ho visto mentre attraversava","l'ho visto attraversare tutta la strada","ha attraversato senza che lo vedessi"],"l'ho visto mentre attraversava","Verbo di percezione + -ing: azione in corso."),
      C("tense_choice","Scegli la forma corretta: This fabric feels ___.",["soft","softly","softness"],"soft","Feel come proprietà + aggettivo."),
      C("use","Nel rapporto descrivi che cosa hai sentito. Scegli la frase corretta.",["I heard someone shouting in the corridor.","I heard someone to shout in the corridor.","I heard someone shouted in the corridor."],"I heard someone shouting in the corridor.","Hear + oggetto + -ing."),
      C("use","Commenti un piatto. Scegli la frase corretta.",["This smells delicious.","This smells deliciously.","This is smelling deliciously."],"This smells delicious.","Smell come proprietà + aggettivo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: leave / we / watched / the plane","We watched the plane leave",[],"Watch + oggetto + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: tired / looks / she","She looks tired",[],"Look + aggettivo.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I heard the door ___. (close, azione intera)","close",[],"Hear + oggetto + verbo base."),
      O("form","Scrivi solo la parola mancante: The music sounds ___. (beautiful, aggettivo)","beautiful",[],"Sound + aggettivo."),
      C("meaning","Scegli che cosa significa: I noticed her looking at me.",["l'ho notata mentre mi guardava","mi ha guardato dopo","non mi ha guardato"],"l'ho notata mentre mi guardava","Notice + -ing: in corso."),
      C("tense_choice","Scegli la forma corretta: The soup tastes ___.",["salty","saltily","salt"],"salty","Taste + aggettivo."),
      C("use","Descrivi una scena osservata. Scegli la frase corretta.",["I saw two men waiting outside.","I saw two men to wait outside.","I saw two men waited outside."],"I saw two men waiting outside.","See + oggetto + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: felt / the ground / shake / we","We felt the ground shake",[],"Feel + oggetto + verbo base.")
    ]
  },
  "verb-object-patterns":{
    train:[
      C("meaning","Scegli che cosa significa: They made him wait.",["lo hanno costretto ad aspettare","gli hanno permesso di aspettare","lui ha fatto aspettare loro"],"lo hanno costretto ad aspettare","Make + oggetto + verbo base = costringere."),
      C("meaning","Scegli che cosa significa: She let me use her car.",["mi ha permesso di usare la sua auto","mi ha costretto a usare la sua auto","ha usato la mia auto"],"mi ha permesso di usare la sua auto","Let + oggetto + verbo base = permettere."),
      C("tense_choice","Scegli la forma corretta: The doctor advised me ___ more water.",["to drink","drink","drinking"],"to drink","Advise + oggetto + to."),
      C("use","Nel regolamento scrivi che i visitatori possono entrare dopo il controllo. Scegli la frase corretta.",["Visitors are allowed to enter after the check.","Visitors are allowed enter after the check.","Visitors are let to enter after the check."],"Visitors are allowed to enter after the check.","Be allowed to."),
      C("use","Chiedi a qualcuno di fare un controllo. Scegli la frase corretta.",["I asked him to check the list.","I asked him check the list.","I asked to him checking the list."],"I asked him to check the list.","Ask + oggetto + to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to stay / told / us / the officer","The officer told us to stay",[],"Tell + oggetto + to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: me / help / let / you","Let me help you",[],"Let + oggetto + verbo base.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: My boss made me ___ the report again. (write)","write",[],"Make + oggetto + verbo base."),
      O("form","Scrivi solo le parole mancanti: They warned us ___ the bridge. (not cross)","not to cross",[],"Warn + oggetto + not to."),
      C("meaning","Scegli che cosa significa: He encouraged me to apply.",["mi ha incoraggiato a candidarmi","mi ha impedito di candidarmi","si è candidato lui"],"mi ha incoraggiato a candidarmi","Encourage + oggetto + to."),
      C("tense_choice","Scegli la forma corretta: They don't let us ___ photos.",["take","to take","taking"],"take","Let + oggetto + verbo base."),
      C("use","Dici che il responsabile ti ha permesso di uscire prima. Scegli la frase corretta.",["My manager allowed me to leave early.","My manager allowed me leave early.","My manager let me to leave early."],"My manager allowed me to leave early.","Allow + oggetto + to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: wanted / to come / she / me","She wanted me to come",[],"Want + oggetto + to.")
    ]
  },
  "verb-pattern-meaning":{
    train:[
      C("meaning","Scegli che cosa significa: I forgot to call her.",["non l'ho chiamata","l'ho chiamata ma non lo ricordo","la chiamo sempre"],"non l'ho chiamata","Forget + to: azione non fatta."),
      C("meaning","Scegli che cosa significa: I'll never forget meeting her.",["ricorderò sempre il nostro incontro","dimenticherò di incontrarla","non l'ho mai incontrata"],"ricorderò sempre il nostro incontro","Forget + -ing: ricordo del passato."),
      C("tense_choice","La stampante non funziona: suggerisci una prova. Scegli la forma corretta: Try ___ it off and on again.",["turning","turn","to turning"],"turning","Try + -ing = fare una prova per vedere se funziona."),
      C("use","Ricordi a un collega una cosa da fare. Scegli la frase corretta.",["Remember to lock the office.","Remember locking the office.","Remember lock the office."],"Remember to lock the office.","Remember + to: compito futuro."),
      C("use","Dici che hai provato con tutte le forze ad aprire il file. Scegli la frase corretta.",["I tried to open the file, but I couldn't.","I tried opening the file, but I couldn't to.","I tried open the file, but I couldn't."],"I tried to open the file, but I couldn't.","Try + to = sforzarsi."),
      O("word_order","Metti le parole in ordine e scrivi la frase: stopped / she / to answer / the phone","She stopped to answer the phone",[],"Stop + to = fermarsi per."),
      O("word_order","Metti le parole in ordine e scrivi la frase: regret / I / you / to tell","I regret to tell you",[],"Regret + to: dare una cattiva notizia.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I remember ___ the door, I'm sure. (lock)","locking",[],"Remember + -ing: ricordo."),
      O("form","Scrivi solo le parole mancanti: Don't forget ___ the lights. (switch off)","to switch off",[],"Forget + to."),
      C("meaning","Scegli che cosa significa: He stopped talking.",["ha smesso di parlare","si è fermato per parlare","non ha mai parlato"],"ha smesso di parlare","Stop + -ing."),
      C("tense_choice","Scegli la forma corretta: I regret ___ so rude yesterday.",["being","to be","be"],"being","Regret + -ing: rimpianto per il passato."),
      C("use","Suggerisci di fare una prova con un'altra password. Scegli la frase corretta.",["Try using a different password.","Try use a different password.","Try to using a different password."],"Try using a different password.","Try + -ing: tentativo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: went on / she / working","She went on working",[],"Go on + -ing = continuare.")
    ]
  },
  "future-perfect":{
    train:[
      O("form","Scrivi solo le parole mancanti, al future perfect: By Friday we ___ the project. (finish)","will have finished",[],"Will have + participio: completato entro una scadenza."),
      O("form","Scrivi solo le parole mancanti, al future continuous: This time tomorrow I ___ to Milan. (fly)","will be flying",[],"Will be + -ing: in corso a un momento futuro."),
      C("meaning","Scegli che cosa significa: At 9 tomorrow I'll be teaching.",["alle nove sarò nel mezzo della lezione","alle nove avrò finito la lezione","alle nove inizierò a insegnare per la prima volta"],"alle nove sarò nel mezzo della lezione","Future continuous: in corso."),
      C("meaning","Scegli che cosa significa: By 9 tomorrow I'll have taught two classes.",["entro le nove avrò già fatto due lezioni","alle nove inizierò due lezioni","farò due lezioni dopo le nove"],"entro le nove avrò già fatto due lezioni","Future perfect: completato entro."),
      C("tense_choice","Scegli la forma corretta: By the end of the year she ___ here for ten years.",["will have worked","will be working","works"],"will have worked","Durata fino a un punto futuro: future perfect."),
      C("tense_choice","Scegli la forma corretta: Don't call at eight. We ___ dinner.",["will be having","will have had","have"],"will be having","In corso alle otto: future continuous."),
      C("use","Il responsabile vuole tutti i controlli conclusi entro mezzogiorno. Scegli la rassicurazione pertinente.",["We will have completed all the checks by noon.", "We will start the checks at noon.", "We will still be checking the equipment at noon."],"We will have completed all the checks by noon.","Will have completed indica completamento entro la scadenza; le altre frasi indicano inizio o lavoro ancora in corso."),
      C("use","Vuoi sapere se la sala sarà occupata dal collega domani; non gli stai chiedendo di usarla. Scegli la domanda più adatta.",["Will you be using the meeting room tomorrow?", "Could you use the meeting room tomorrow?", "Did you use the meeting room yesterday?"],"Will you be using the meeting room tomorrow?","Will you be using chiede dei programmi. Could you use è una richiesta; did you use riguarda un uso passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: will have / by then / left / they","They will have left by then",["By then they will have left"],"Future perfect + by then."),
      O("word_order","Metti le parole in ordine e scrivi la frase: be waiting / will / I / at the entrance","I will be waiting at the entrance",["At the entrance I will be waiting"],"Future continuous.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, al future perfect: By 2030 the city ___ a new metro. (build)","will have built",[],"Completato entro il 2030."),
      O("form","Scrivi solo le parole mancanti, al future continuous: At noon we ___ the visitors. (meet)","will be meeting",[],"In corso a mezzogiorno."),
      C("meaning","Scegli che cosa significa: They'll have arrived by now.",["probabilmente sono già arrivati","arriveranno più tardi","stanno arrivando adesso"],"probabilmente sono già arrivati","Future perfect per una deduzione sul presente."),
      C("tense_choice","Scegli la forma corretta: By next month I ___ the course.",["will have completed","will be completing yesterday","complete"],"will have completed","Scadenza: future perfect."),
      C("use","Avvisi che domani mattina sarai in viaggio. Scegli la frase corretta.",["I'll be travelling tomorrow morning.","I'll have travel tomorrow morning.","I'm travel tomorrow morning."],"I'll be travelling tomorrow morning.","Future continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: by Monday / have / will / we / decided","We will have decided by Monday",["By Monday we will have decided"],"Future perfect.")
    ]
  },
  deduction:{
    train:[
      O("form","Scrivi solo la parola mancante: He's been working all day. He ___ be tired. (deduzione certa)","must",[],"Deduzione forte: must."),
      O("form","Scrivi solo le parole mancanti: The lights are off. They ___ gone out. (must, passato)","must have",[],"Deduzione sul passato: must have + participio."),
      C("meaning","Scegli che cosa significa: She can't be at home; her car isn't there.",["sono sicuro che non è a casa","forse è a casa","non sa stare a casa"],"sono sicuro che non è a casa","Can't = deduzione negativa forte."),
      C("meaning","Scegli che cosa significa: He might have missed the train.",["forse ha perso il treno","ha certamente perso il treno","non poteva perdere il treno"],"forse ha perso il treno","Might have: possibilità passata."),
      C("tense_choice","Ne sei quasi certo. Scegli la forma corretta: The keys ___ be in the car.",["must","might not","can't to"],"must","Certezza: must."),
      C("tense_choice","Scegli la forma corretta: She ___ have seen us; she didn't say hello.",["can't","must","mustn't"],"can't","Impossibilità nel passato: can't have."),
      C("use","Gli indizi ti rendono quasi certo che il ladro sia entrato dalla finestra. Esprimi questa deduzione sul passato. Scegli la frase più adatta.",["The intruder must have entered through the window.","The intruder must entered through the window.","The intruder must to have entered through the window."],"The intruder must have entered through the window.","Must have + participio esprime una deduzione forte sul passato, non una semplice possibilità. Per una possibilità meno certa si possono usare may/might/could have."),
      C("use","Escludi un'ipotesi con sicurezza. Scegli la frase corretta.",["It can't have been the guard; he was off duty.","It mustn't have been the guard; he was off duty.","It can't been the guard; he was off duty."],"It can't have been the guard; he was off duty.","Can't have: impossibile nel passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: have / she / forgotten / must","She must have forgotten",[],"Must have + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: be / that / can't / true","That can't be true",[],"Can't + be.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: You ___ be hungry after the long trip. (deduzione certa)","must",[],"Must: deduzione."),
      O("form","Scrivi solo le parole mancanti: He ___ the message. He hasn't replied. (might, non vedere, passato)","might not have seen",["may not have seen"],"Might not have + participio."),
      C("meaning","Scegli che cosa significa: They must have left early.",["sono quasi certo che siano partiti presto","dovevano partire presto","forse partiranno presto"],"sono quasi certo che siano partiti presto","Must have: deduzione sul passato."),
      C("tense_choice","Scegli la forma corretta: That ___ be Anna at the door; she's in Paris.",["can't","must","has to"],"can't","Impossibilità: can't."),
      C("use","Esprimi una possibilità sul ritardo di un collega. Scegli la frase corretta.",["He may have got stuck in traffic.","He may got stuck in traffic.","He must got stuck in traffic."],"He may have got stuck in traffic.","May have + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: been / it / have / might / a mistake","It might have been a mistake",[],"Might have been.")
    ]
  },
  "conditionals-real":{
    train:[
      O("form","Scrivi solo la parola mancante, al present simple: If it ___ tomorrow, we will stay inside. (rain)","rains",[],"Primo tipo: if + present simple."),
      O("form","Scrivi solo le parole mancanti, con will: If you press this button, the machine ___. (stop)","will stop",[],"Conseguenza futura: will."),
      C("meaning","Scegli che cosa significa: If you heat ice, it melts.",["succede sempre","succederà forse una volta","è successo una volta"],"succede sempre","Zero conditional: verità generale."),
      C("meaning","Scegli che cosa significa: Unless we hurry, we'll miss the bus.",["se non ci sbrighiamo, perderemo l'autobus","se ci sbrighiamo, perderemo l'autobus","anche se ci sbrighiamo, lo perderemo"],"se non ci sbrighiamo, perderemo l'autobus","Unless = se non."),
      C("tense_choice","Scegli la forma corretta: If she ___ early, she will help us.",["arrives","will arrive","arrived"],"arrives","Dopo if non si usa will."),
      C("tense_choice","Scegli la forma corretta: When the alarm ___ , leave the building.",["rings","will ring","rang"],"rings","When + present per il futuro."),
      C("use","Nelle istruzioni di sicurezza scrivi che cosa fare in caso di fumo. Scegli la frase corretta.",["If you see smoke, call this number.","If you will see smoke, call this number.","If you saw smoke, you call this number."],"If you see smoke, call this number.","If + present + imperativo."),
      C("use","Prometti un aiuto a una condizione. Scegli la frase corretta.",["I'll help you if you send me the file.","I help you if you will send me the file.","I'll help you if you will send me the file."],"I'll help you if you send me the file.","Will nella principale, present dopo if."),
      O("word_order","Metti le parole in ordine e scrivi la frase: if / you / late / are / call me","If you are late call me",["Call me if you are late"],"If + present + imperativo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: unless / we / it stops raining / won't go","We won't go unless it stops raining",["Unless it stops raining we won't go"],"Unless = se non.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante, al present simple: If you ___ the form today, we'll process it tomorrow. (send)","send",[],"If + present."),
      O("form","Scrivi solo le parole mancanti, con will: If the train is late, we ___ a taxi. (take)","will take",[],"Conseguenza: will."),
      C("meaning","Scegli che cosa significa: If you mix red and blue, you get purple.",["è sempre così","succederà una volta","non succede mai"],"è sempre così","Zero conditional."),
      C("tense_choice","Scegli la forma corretta: I'll call you as soon as I ___.",["land","will land","landed"],"land","As soon as + present."),
      C("use","Avvisi un collega di una conseguenza. Scegli la frase corretta.",["If you don't save the file, you'll lose your work.","If you won't save the file, you lose your work.","If you don't save the file, you lost your work."],"If you don't save the file, you'll lose your work.","Primo tipo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: when / arrives / she / we'll start","We'll start when she arrives",["When she arrives we'll start"],"When + present.")
    ]
  },
  "conditionals-unreal":{
    train:[
      O("form","Scrivi solo la parola mancante, al past simple: If I ___ more time, I would learn Japanese. (have)","had",[],"Secondo tipo: if + past simple."),
      O("form","Scrivi solo le parole mancanti, con would: If they had asked, I ___ them. (help, passato)","would have helped",[],"Terzo tipo: would have + participio."),
      C("meaning","Scegli che cosa significa: If I were rich, I'd buy a boat.",["Non è ricco: immagina che cosa farebbe se lo fosse.","È ricco e ha deciso di comprare una barca.","Da giovane era ricco e ha comprato una barca."],"Non è ricco: immagina che cosa farebbe se lo fosse.","Secondo condizionale (if + past simple, would + verbo): una situazione immaginaria nel presente. Vuol dire «Se fossi ricco, comprerei una barca», ma non lo è. Qui were non indica il passato: è la forma dell'ipotesi."),
      C("meaning","Scegli che cosa significa: If she had left earlier, she wouldn't have missed the plane.",["È partita tardi e ha perso l'aereo.","È partita presto e ha preso l'aereo.","Partirà presto per non perdere l'aereo."],"È partita tardi e ha perso l'aereo.","Terzo condizionale (if + past perfect, would have + participio): immagina un passato diverso da quello reale. «Se fosse partita prima, non avrebbe perso l'aereo»: in realtà è partita tardi e l'ha perso."),
      C("tense_choice","Scegli la forma corretta: If I ___ you, I would accept the offer.",["were","am","would be"],"were","If I were you: consiglio."),
      C("tense_choice","Scegli la forma corretta: We ___ the match if we had trained more.",["would have won","would win yesterday","won"],"would have won","Terzo tipo: would have + participio."),
      C("use","Dai un consiglio a un collega. Scegli la frase corretta.",["If I were you, I'd speak to the manager.","If I was you, I will speak to the manager.","If I am you, I'd speak to the manager."],"If I were you, I'd speak to the manager.","If I were you + would."),
      C("use","Nel rapporto spieghi che cosa sarebbe successo senza l'intervento. Scegli la frase corretta.",["If the guard hadn't noticed the smoke, the fire would have spread.","If the guard didn't notice the smoke, the fire would spread yesterday.","If the guard hadn't noticed the smoke, the fire will spread."],"If the guard hadn't noticed the smoke, the fire would have spread.","Terzo tipo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: would / if / I / knew / I / tell you","If I knew I would tell you",["I would tell you if I knew"],"Secondo tipo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had / we / would have / if / known / we / come","If we had known we would have come",["We would have come if we had known"],"Terzo tipo.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, con would: If we lived closer, we ___ more often. (visit)","would visit",[],"Secondo tipo."),
      O("form","Scrivi solo le parole mancanti, al past perfect: If you ___ me, I would have come. (call)","had called",[],"Terzo tipo: if + past perfect."),
      C("meaning","Scegli che cosa significa: I would have called if I had had your number.",["non avevo il numero e non ho chiamato","avevo il numero e ho chiamato","chiamerò domani"],"non avevo il numero e non ho chiamato","Terzo tipo."),
      C("tense_choice","Scegli la forma corretta: If she ___ harder, she would pass.",["studied","studies","would study"],"studied","Secondo tipo: past simple."),
      C("use","Dici che cosa faresti con più budget. Scegli la frase corretta.",["If we had a bigger budget, we would hire more staff.","If we have a bigger budget, we would hire more staff.","If we had a bigger budget, we will hire more staff."],"If we had a bigger budget, we would hire more staff.","Secondo tipo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: wouldn't / if / it / rained / we / go out","If it rained we wouldn't go out",["We wouldn't go out if it rained"],"Secondo tipo.")
    ]
  },
  wish:{
    train:[
      O("form","Scrivi solo la parola mancante: I wish I ___ taller. (be, desiderio irreale presente)","were",["was"],"Wish + passato esprime un desiderio irreale nel presente. Were è la forma tradizionale, soprattutto formale; was è comune in contesti meno formali."),
      O("form","Scrivi solo le parole mancanti: I wish I ___ to the party yesterday. (go)","had gone",[],"Wish + past perfect per il passato."),
      C("meaning","Scegli che cosa significa: I wish I knew the answer.",["non so la risposta e mi dispiace","sapevo la risposta","saprò la risposta"],"non so la risposta e mi dispiace","Wish + past: desiderio irreale presente."),
      C("meaning","Scegli che cosa significa: If only I hadn't said that.",["mi pento di averlo detto","non l'ho detto","lo dirò"],"mi pento di averlo detto","If only + past perfect: rimpianto."),
      C("tense_choice","Scegli la forma corretta: I wish it ___ raining.",["would stop","stops","stopped yesterday"],"would stop","Wish + would: desiderio di cambiamento."),
      C("tense_choice","Scegli la forma corretta: You can borrow it ___ you bring it back tomorrow.",["provided that","unless","even"],"provided that","Provided that = a condizione che."),
      C("use","Esprimi un rimpianto sul passato. Scegli la frase corretta.",["I wish I had studied more.","I wish I studied more yesterday.","I wish I would studied more."],"I wish I had studied more.","Wish + past perfect."),
      C("use","Ti lamenti del collega che interrompe sempre. Scegli la frase corretta.",["I wish he wouldn't interrupt me all the time.","I wish he doesn't interrupt me all the time.","I wish he won't interrupt me all the time."],"I wish he wouldn't interrupt me all the time.","Wish + would per comportamenti fastidiosi."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had / I / I wish / more time","I wish I had more time",[],"Wish + past."),
      O("word_order","Metti le parole in ordine e scrivi la frase: if only / listened / had / we","If only we had listened",[],"If only + past perfect.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I wish I ___ how to swim. (know)","knew",[],"Wish + past."),
      O("form","Scrivi solo le parole mancanti: She wishes she ___ the job. (not accept)","hadn't accepted",["had not accepted"],"Rimpianto: past perfect."),
      C("meaning","Scegli che cosa significa: I wish you would listen.",["vorrei che tu ascoltassi (non lo fai)","hai ascoltato","ascolterai di sicuro"],"vorrei che tu ascoltassi (non lo fai)","Wish + would."),
      C("tense_choice","Scegli la forma corretta: We'll go out ___ it rains.",["unless","provided","wish"],"unless","Unless = a meno che."),
      C("use","Dici che vorresti abitare più vicino al lavoro. Scegli la frase corretta.",["I wish I lived closer to work.","I wish I live closer to work.","I wish I would live closer to work yesterday."],"I wish I lived closer to work.","Wish + past."),
      O("word_order","Metti le parole in ordine e scrivi la frase: I / I wish / known / had","I wish I had known",[],"Wish + past perfect.")
    ]
  },
  passive:{
    train:[
      O("form","Scrivi solo le parole mancanti, al passivo presente: English ___ all over the world. (speak)","is spoken",[],"Passivo: be + participio."),
      O("form","Scrivi solo le parole mancanti, al passivo passato: The bridge ___ in 1990. (build)","was built",[],"Passivo passato: was + participio."),
      C("meaning","Scegli chi compie l'azione: The report was written by two analysts.",["due analisti","il rapporto","non è indicato"],"due analisti","Agente con by."),
      C("meaning","Scegli che cosa significa: The road is being repaired.",["stanno riparando la strada adesso","la strada è stata riparata","la strada sarà riparata"],"stanno riparando la strada adesso","Passivo continuous: in corso."),
      C("tense_choice","Scegli la forma corretta: The results ___ next week.",["will be published","will publish","are publishing"],"will be published","Passivo futuro."),
      C("tense_choice","Scegli la forma corretta: The documents must ___ by Friday.",["be signed","signed","be sign"],"be signed","Modale + be + participio."),
      C("use","Nel rapporto l'autore del furto è sconosciuto. Scegli la frase più adatta.",["Two laptops were stolen from the office.","Someone they stole two laptops from the office.","Two laptops stole from the office."],"Two laptops were stolen from the office.","Passivo quando l'agente è sconosciuto."),
      C("use","Comunichi che la riunione è stata annullata. Scegli la frase corretta.",["The meeting has been cancelled.","The meeting has cancelled.","The meeting has been cancel."],"The meeting has been cancelled.","Passivo con present perfect."),
      O("word_order","Metti le parole in ordine e scrivi la frase: was / by the police / the car / found","The car was found by the police",[],"Passivo con agente."),
      O("word_order","Metti le parole in ordine e scrivi la frase: are / every night / the doors / locked","The doors are locked every night",["Every night the doors are locked"],"Passivo presente.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, al passivo presente: Coffee ___ in Brazil. (grow)","is grown",[],"Passivo: is + participio."),
      O("form","Scrivi solo le parole mancanti, al passivo con present perfect: The parcel ___ . (deliver)","has been delivered",[],"Passivo perfect."),
      C("meaning","Scegli che cosa significa: The suspect was being questioned.",["l'interrogatorio era in corso","è stato interrogato ieri, poi è finito","interrogherà qualcuno"],"l'interrogatorio era in corso","Passivo past continuous."),
      C("tense_choice","Descrivi l’azione svolta dagli addetti alle pulizie ieri, non lo stato delle finestre. Scegli la forma corretta: The windows ___ yesterday.",["were cleaned","cleaned","were clean"],"were cleaned","Passivo passato."),
      C("use","Avvisi che il pagamento deve essere effettuato entro lunedì. Scegli la frase corretta.",["Payment must be made by Monday.","Payment must make by Monday.","Payment must been made by Monday."],"Payment must be made by Monday.","Modale + be + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: will / tomorrow / the results / be announced","The results will be announced tomorrow",["Tomorrow the results will be announced"],"Passivo futuro.")
    ]
  },
  reported:{
    train:[
      O("form","Scrivi solo la parola mancante: She said, 'I am busy.' → She said that she ___ busy. (Applica l’arretramento dei tempi (backshift))","was",[],"Backshift: am → was. In questo esercizio si richiede il backshift; nel discorso reale può essere omesso se la situazione è ancora attuale."),
      O("form","Scrivi solo la parola mancante: He ___ me that the office was closed. (say/tell)","told",[],"Tell + persona; say senza persona."),
      C("meaning","Scegli che cosa significa: He said he would call.",["ha detto che avrebbe chiamato","ha detto che chiamava","chiamerà sicuramente adesso"],"ha detto che avrebbe chiamato","Will → would."),
      C("tense_choice","Scegli la forma corretta: She ___ that she was tired.",["said","told","said me"],"said","Say senza oggetto di persona."),
      C("tense_choice","Applica l’arretramento dei tempi (backshift). Scegli la forma corretta: 'I have finished.' → He said he ___ finished.",["had","has","have"],"had","Present perfect → past perfect. In questo esercizio si richiede il backshift; nel discorso reale può essere omesso se la situazione è ancora attuale."),
      C("use","Riferisci al responsabile che cosa ha detto il testimone. Scegli la frase corretta.",["The witness said that he had seen a blue car.","The witness said me that he has seen a blue car.","The witness told that he had seen a blue car."],"The witness said that he had seen a blue car.","Say that + backshift."),
      C("use","Riferisci un ordine. Scegli la frase corretta.",["The officer told us to wait outside.","The officer told us wait outside.","The officer said us to wait outside."],"The officer told us to wait outside.","Tell + persona + to."),
      O("use","Riscrivi la frase in discorso indiretto, iniziando con She said: 'I will send it tomorrow.' (Riferisci le parole alcuni giorni dopo, applicando il backshift)","She said she would send it the next day",["She said that she would send it the next day","She said she would send it the following day","She said that she would send it the following day"],"Will → would, tomorrow → the next day."),
      O("word_order","Metti le parole in ordine e scrivi la frase: told / he / he / me / was leaving","He told me he was leaving",[],"Tell + persona + frase."),
      O("word_order","Metti le parole in ordine e scrivi la frase: not / asked / us / to smoke / she","She asked us not to smoke",[],"Ask + persona + not to.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: 'I can drive.' → He said he ___ drive. (Applica l’arretramento dei tempi (backshift))","could",[],"Can → could. In questo esercizio si richiede il backshift; nel discorso reale può essere omesso se la situazione è ancora attuale."),
      O("form","Scrivi solo la parola mancante: She ___ us to be quiet. (say/tell)","told",[],"Tell + persona + to."),
      C("meaning","Scegli che cosa significa: They said they had been to Rome.",["hanno detto che erano stati a Roma","hanno detto che andranno a Roma","sono a Roma adesso"],"hanno detto che erano stati a Roma","Past perfect nel discorso indiretto."),
      C("tense_choice","Applica l’arretramento dei tempi (backshift). Scegli la forma corretta: 'We are leaving.' → They said they ___ leaving.",["were","are","had"],"were","Are → were. In questo esercizio si richiede il backshift; nel discorso reale può essere omesso se la situazione è ancora attuale."),
      C("use","Riferisci una richiesta del direttore. Scegli la frase corretta.",["The director asked me to check the figures.","The director asked me check the figures.","The director said me to check the figures."],"The director asked me to check the figures.","Ask + persona + to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: said / she / that / was / she / ready","She said that she was ready",[],"Say that + frase.")
    ]
  },
  "indirect-questions":{
    train:[
      O("form","Scrivi solo la parola mancante: Could you tell me where the station ___? (be)","is",[],"Domanda indiretta: ordine affermativo."),
      O("form","Scrivi solo la parola mancante: I wonder ___ she will come. (se)","if",["whether"],"If/whether nelle domande sì/no indirette."),
      C("meaning","Scegli che cosa chiede: Do you know what time it is?",["chiede l'ora in modo cortese","chiede se conosci gli orologi","chiede quando è nato"],"chiede l'ora in modo cortese","Domanda indiretta = più cortese."),
      C("tense_choice","Scegli la forma corretta: Can you tell me how much ___?",["it costs","does it cost","costs it"],"it costs","Ordine affermativo."),
      C("tense_choice","Scegli la forma corretta: She asked me where ___.",["I lived","did I live","do I live"],"I lived","Domanda riferita: niente did, backshift."),
      C("use","Chiedi informazioni a uno sconosciuto. Scegli la frase più cortese.",["Excuse me, could you tell me where the nearest pharmacy is?","Excuse me, where is the nearest pharmacy could you tell me?","Excuse me, could you tell me where is the nearest pharmacy?"],"Excuse me, could you tell me where the nearest pharmacy is?","Domanda indiretta con ordine affermativo."),
      C("use","Riferisci la domanda del cliente. Scegli la frase corretta.",["The customer asked whether the order had arrived.","The customer asked had the order arrived.","The customer asked if had the order arrived."],"The customer asked whether the order had arrived.","Whether + ordine affermativo."),
      O("use","Correggi l'errore e riscrivi tutta la frase: Do you know when does the train leave?","Do you know when the train leaves",[],"Nelle domande indirette niente does."),
      O("word_order","Metti le parole in ordine e scrivi la frase: is / I don't know / he / where","I don't know where he is",[],"Ordine affermativo dopo where."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: open / the shop / do you know / is / if","Do you know if the shop is open",[],"If + ordine affermativo.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Can you tell me what time the film ___? (start)","starts",[],"Ordine affermativo, verbo con -s."),
      O("form","Scrivi solo la parola mancante: He asked ___ I was ready. (se)","if",["whether"],"If/whether."),
      C("meaning","Scegli che cosa significa: I'd like to know why you left.",["vorrei sapere perché sei andato via","vuoi sapere perché sono andato via","sei andato via senza motivo"],"vorrei sapere perché sei andato via","Domanda indiretta."),
      C("tense_choice","Scegli la forma corretta: Do you remember where ___ the keys?",["you put","did you put","put you"],"you put","Ordine affermativo."),
      C("use","Chiedi cortesemente il nome del responsabile. Scegli la frase corretta.",["Could you tell me who is responsible for this?","Could you tell me who responsible is for this?","Could you tell me who does is responsible for this?"],"Could you tell me who is responsible for this?","Who soggetto: ordine invariato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: asked / how old / she / was / he","He asked how old she was",[],"Ordine affermativo riferito.")
    ]
  },
  relatives:{
    train:[
      O("form","Scrivi solo la parola mancante: The man ___ called you is my brother. (relativo per persona)","who",["that"],"Persona soggetto: who o that."),
      O("form","Scrivi solo la parola mancante: This is the town ___ I grew up. (luogo)","where",[],"Luogo: where."),
      C("meaning","Scegli che cosa significa: My sister, who lives in Turin, is a nurse.",["il fatto che viva a Torino è un’informazione aggiunta","ho più sorelle: parlo di quella di Torino","mia sorella non vive a Torino"],"il fatto che viva a Torino è un’informazione aggiunta","Le virgole presentano la relativa come informazione aggiuntiva su una persona già identificata. La frase non dimostra da sola quante sorelle abbia chi parla."),
      C("meaning","Scegli che cosa significa: My sister who lives in Turin is a nurse.",["specifico quale sorella intendo: quella che vive a Torino","ho una sola sorella","mia sorella si trasferisce a Torino"],"specifico quale sorella intendo: quella che vive a Torino","La relativa senza virgole serve a identificare la persona. Spesso distingue fra più persone, ma non fornisce da sola un censimento della famiglia."),
      C("tense_choice","Scegli la forma corretta: Rome, ___ is the capital, is very old.",["which","that","what"],"which","Relativa con virgole: which, non that."),
      C("tense_choice","Scegli la forma corretta: That's the colleague ___ car was stolen.",["whose","who's","which"],"whose","Possesso: whose."),
      C("use","Nel rapporto identifichi il veicolo. Scegli la frase corretta.",["The van that was parked outside belongs to a delivery company.","The van who was parked outside belongs to a delivery company.","The van what was parked outside belongs to a delivery company."],"The van that was parked outside belongs to a delivery company.","Cosa: that/which."),
      C("use","Aggiungi un'informazione su un luogo già noto. Scegli la frase corretta.",["The museum, which opened in 2010, is free on Sundays.","The museum that opened in 2010, is free on Sundays.","The museum, that opened in 2010, is free on Sundays."],"The museum, which opened in 2010, is free on Sundays.","Con le virgole: which."),
      O("word_order","Metti le parole in ordine e scrivi la frase: who / the woman / spoke to me / is a doctor","The woman who spoke to me is a doctor",[],"Relativa dopo il nome."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the book / I lent you / where is","Where is the book I lent you",[],"Relativo oggetto omesso.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The film ___ we saw was great. (relativo per cosa)","that",["which"],"Cosa oggetto: that/which (anche omesso)."),
      O("form","Scrivi solo la parola mancante: Do you know the girl ___ father is a pilot?","whose",[],"Possesso: whose."),
      C("meaning","Scegli che cosa significa: The students, who had studied, passed.",["tutti gli studenti avevano studiato e sono stati promossi","solo quelli che avevano studiato sono stati promossi","nessuno ha studiato"],"tutti gli studenti avevano studiato e sono stati promossi","Con virgole: tutti."),
      C("tense_choice","Scegli la forma corretta: I remember the day ___ we met.",["when","where","which"],"when","Tempo: when."),
      C("use","Descrivi la persona che ha trovato il portafoglio. Scegli la frase corretta.",["The cleaner who found the wallet brought it to reception.","The cleaner which found the wallet brought it to reception.","The cleaner whose found the wallet brought it to reception."],"The cleaner who found the wallet brought it to reception.","Persona: who."),
      O("word_order","Metti le parole in ordine e scrivi la frase: where / this is / I work / the office","This is the office where I work",[],"Luogo: where.")
    ]
  },
  clauses:{
    train:[
      O("form","Scrivi solo la parola mancante: I'll call you when I ___. (arrive)","arrive",[],"Subordinata temporale futura: present."),
      O("form","Scrivi solo le parole mancanti: She left early ___ she could catch the train. (scopo)","so that",[],"Scopo: so that."),
      C("meaning","Scegli che cosa esprime although in: Although it was late, we continued.",["un contrasto","una causa","uno scopo"],"un contrasto","Although = sebbene."),
      C("meaning","Scegli che cosa esprime since in: Since you are here, you can help.",["una causa","un tempo passato","un contrasto"],"una causa","Since = dato che."),
      C("tense_choice","Scegli la forma corretta: ___ the rain, the match continued.",["Despite","Although","Because"],"Despite","Despite + nome."),
      C("tense_choice","Scegli la forma corretta: We'll wait until she ___.",["comes","will come","came"],"comes","Until + present per il futuro."),
      C("use","Nel rapporto spieghi lo scopo del controllo. Scegli la frase corretta.",["The gate was checked so that no one could enter.","The gate was checked so no one can entered.","The gate was checked for that no one could enter."],"The gate was checked so that no one could enter.","So that + could."),
      C("use","Colleghi due fatti in contrasto in modo formale. Scegli la frase corretta.",["Although the evidence was limited, the conclusion was clear.","Although the evidence was limited, but the conclusion was clear.","Despite the evidence was limited, the conclusion was clear."],"Although the evidence was limited, the conclusion was clear.","Although senza but."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as soon as / I'll / I hear / tell you","I'll tell you as soon as I hear",["As soon as I hear I'll tell you"],"As soon as + present."),
      O("word_order","Metti le parole in ordine e scrivi la frase: because / was / the road / closed / we were late","We were late because the road was closed",["Because the road was closed we were late"],"Effetto + because + causa.")
    ],
    check:[
      O("form","Scrivi solo ciò che manca: ___ she was tired, she kept working. (sebbene)","Although",["Though","Even though"],"Contrasto: although."),
      O("form","Scrivi solo ciò che manca: We waited until the rain ___. (stop, passato)","stopped",["had stopped"],"Until + passato."),
      C("meaning","Scegli che cosa esprime while in: While I agree, I have some doubts.",["un contrasto","una durata","una causa"],"un contrasto","While = mentre/sebbene (contrasto)."),
      C("tense_choice","Indica il motivo per cui ha preso il taxi. Scegli la forma corretta: She took a taxi ___ she was late.",["because","although","despite"],"because","Causa: because."),
      C("use","Spieghi perché hai scritto la mail. Scegli la frase corretta.",["I'm writing to ask for information about the course.","I'm writing for asking information about the course.","I'm writing so asking for information about the course."],"I'm writing to ask for information about the course.","Scopo: to + verbo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: despite / we / the cost / chose it","We chose it despite the cost",["Despite the cost we chose it"],"Despite + nome.")
    ]
  },
  linkers:{
    train:[
      O("form","Scrivi solo ciò che manca: The plan is cheap. ___, it is very effective. (inoltre)","Moreover",["Furthermore","In addition"],"Aggiunta formale: moreover."),
      O("form","Scrivi solo la parola mancante: The test was hard. ___, most students passed. (tuttavia)","However",["Nevertheless"],"Contrasto: however."),
      C("meaning","Scegli che cosa esprime therefore in: The road was closed; therefore, we used another route.",["una conseguenza","un esempio","un contrasto"],"una conseguenza","Therefore = quindi."),
      C("meaning","Scegli che cosa esprime for instance.",["un esempio","una conclusione","un contrasto"],"un esempio","For instance = per esempio."),
      C("form","Scegli la punteggiatura corretta.",["The costs are high; however, the benefits are clear.","The costs are high, however the benefits are clear.","The costs are high however, the benefits are clear."],"The costs are high; however, the benefits are clear.","However tra due frasi: punto e virgola prima, virgola dopo."),
      C("tense_choice","È l’ultima frase del testo: introduci una sintesi conclusiva, non un esempio. Scegli il connettivo corretto: ___, I would recommend the second option.",["In conclusion","For example","Moreover than"],"In conclusion","Conclusione: in conclusion."),
      C("use","Hai già elencato un vantaggio. Aggiungine un altro, senza introdurre né un contrasto né una conclusione. Scegli la frase più adatta.",["Furthermore, the new system saves time.","However, the new system saves time.","In conclusion, the new system saves time."],"Furthermore, the new system saves time.","Furthermore aggiunge un argomento; however introduce un contrasto; in conclusion segnala una conclusione."),
      C("use","Introduci un'obiezione in modo formale. Scegli la frase più adatta.",["On the other hand, the cost is considerable.","In the other hand, the cost is considerable.","On the other side hand, the cost is considerable."],"On the other hand, the cost is considerable.","On the other hand."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as a result / was cancelled / the flight","As a result the flight was cancelled",["The flight was cancelled as a result"],"As a result = di conseguenza."),
      O("word_order","Metti le parole in ordine e scrivi la frase: in addition / offers / free parking / the hotel","In addition the hotel offers free parking",["The hotel offers free parking in addition"],"In addition = inoltre.")
    ],
    check:[
      O("form","Scrivi solo ciò che manca: Prices rose. ___, sales fell. (di conseguenza)","Consequently",["Therefore","As a result"],"Conseguenza."),
      O("form","Scrivi solo le parole mancanti: Some options are expensive, ___ the first one. (per esempio)","for example",["for instance","such as"],"Esempio."),
      C("meaning","Scegli che cosa esprime nevertheless.",["un contrasto","una conseguenza","un'aggiunta"],"un contrasto","Nevertheless = tuttavia."),
      C("tense_choice","Scegli il connettivo corretto: The room was small. ___, it was comfortable.",["Nevertheless","Therefore","For example"],"Nevertheless","Contrasto."),
      C("use","Chiudi un testo argomentativo. Scegli la frase più adatta.",["To sum up, the benefits outweigh the costs.","To summing up, the benefits outweigh the costs.","For sum up, the benefits outweigh the costs."],"To sum up, the benefits outweigh the costs.","To sum up."),
      O("word_order","Metti le parole in ordine e scrivi la frase: however / was / the plan / expensive","However the plan was expensive",["The plan was expensive however","The plan however was expensive"],"However all'inizio con valore di contrasto.")
    ]
  },
  "future-in-past":{
    train:[
      O("form","Scrivi solo la parola mancante: She said she ___ call later. (will, al passato)","would",[],"Futuro nel passato: would."),
      O("form","Scrivi solo le parole mancanti: We ___ leave, but the phone rang. (be going to, passato)","were going to",[],"Intenzione passata non realizzata."),
      C("meaning","Scegli che cosa significa: I was going to phone you, but I forgot.",["avevo intenzione di chiamarti ma non l'ho fatto","ti ho chiamato","ti chiamerò"],"avevo intenzione di chiamarti ma non l'ho fatto","Was going to: piano non realizzato."),
      C("meaning","Scegli che cosa significa: He knew he would succeed.",["sapeva che ci sarebbe riuscito","sapeva di esserci riuscito","sa che ci riuscirà"],"sapeva che ci sarebbe riuscito","Would: futuro visto dal passato."),
      C("tense_choice","Scegli la forma corretta: I thought it ___ rain, so I took an umbrella.",["would","will","was"],"would","Previsione nel passato: would."),
      C("tense_choice","Scegli la forma corretta: They ___ meet at six, but the meeting was moved.",["were meeting","are meeting","will meet"],"were meeting","Accordo fissato nel passato: past continuous."),
      C("use","Ti scusi per non aver mandato la mail. Scegli la frase corretta.",["I was going to send it, but the system crashed.","I am going to send it, but the system crashed.","I will send it, but the system crashed."],"I was going to send it, but the system crashed.","Intenzione non realizzata."),
      C("use","Nel rapporto indichi un orario previsto. Scegli la frase corretta.",["The convoy was to leave at 06:00.","The convoy is to leave at 06:00 yesterday.","The convoy was leave at 06:00."],"The convoy was to leave at 06:00.","Was to: programma ufficiale nel passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: would / she / be late / said / she","She said she would be late",[],"Would dopo said."),
      O("word_order","Metti le parole in ordine e scrivi la frase: going to / we / were / buy it","We were going to buy it",[],"Was/were going to.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: He promised he ___ help us. (will, al passato)","would",[],"Would."),
      O("form","Scrivi solo le parole mancanti: I ___ call you, but I lost my phone. (be going to, passato)","was going to",[],"Intenzione non realizzata."),
      C("meaning","Scegli che cosa significa: The train was about to leave.",["il treno stava per partire","il treno era partito","il treno partirà domani"],"il treno stava per partire","Was about to: imminente nel passato."),
      C("tense_choice","Scegli la forma corretta: We knew the trip ___ difficult.",["would be","will be","is"],"would be","Futuro nel passato."),
      C("use","Spieghi un cambio di programma. Scegli la frase corretta.",["We were going to fly, but we took the train.","We are going to fly, but we took the train.","We go to fly, but we took the train."],"We were going to fly, but we took the train.","Piano non realizzato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: about / was / to call / I / you","I was about to call you",[],"Was about to.")
    ]
  },
  "comparative-patterns":{
    train:[
      C("meaning","Scegli che cosa significa: The more you practise, the easier it gets.",["più ti eserciti, più diventa facile","ti eserciti molto ed è facile","è facile anche senza esercizio"],"più ti eserciti, più diventa facile","The + comparativo, the + comparativo."),
      C("meaning","Scegli che cosa significa: Prices are getting higher and higher.",["i prezzi continuano a salire","i prezzi sono altissimi ma stabili","i prezzi scendono"],"i prezzi continuano a salire","Comparativo ripetuto: aumento continuo."),
      C("tense_choice","Scegli la forma corretta: This model is ___ cheaper than the old one.",["far","very","more"],"far","Far/much rafforzano il comparativo."),
      C("use","Nel rapporto confronti due percorsi. Scegli la frase corretta.",["The north route is slightly longer but much safer.","The north route is slightly more long but very safer.","The north route is slight longer but much more safe."],"The north route is slightly longer but much safer.","Slightly/much + comparativo."),
      C("use","Dici che il nuovo sistema non è veloce come il vecchio. Scegli la frase corretta.",["The new system isn't as fast as the old one.","The new system isn't so fast than the old one.","The new system isn't as faster as the old one."],"The new system isn't as fast as the old one.","Not as + aggettivo + as."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the better / the sooner / we start","The sooner we start the better",[],"The sooner, the better."),
      O("word_order","Metti le parole in ordine e scrivi la frase: is getting / the traffic / worse and worse","The traffic is getting worse and worse",[],"Comparativo ripetuto.")
    ],
    check:[
      O("form","Scrivi solo ciò che manca: The test was ___ harder than I expected. (molto)","much",["far","a lot"],"Much + comparativo."),
      O("form","Scrivi solo la parola mancante: The earlier we leave, the ___ traffic we'll find. (little)","less",[],"Little → less."),
      C("meaning","Scegli che cosa significa: She's twice as experienced as me.",["ha il doppio della mia esperienza","ha la metà della mia esperienza","ha la stessa esperienza"],"ha il doppio della mia esperienza","Twice as ... as."),
      C("tense_choice","Scegli la forma corretta: He drives ___ than his brother.",["more carefully","more careful","carefullier"],"more carefully","Comparativo dell'avverbio."),
      C("use","Raccomandi di agire presto. Scegli la frase corretta.",["The sooner we act, the fewer problems we'll have.","Sooner we act, fewer problems we'll have.","The soon we act, the few problems we'll have."],"The sooner we act, the fewer problems we'll have.","The ... the ..."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as / is / this room / big / twice / as that one","This room is twice as big as that one",[],"Twice as ... as.")
    ]
  },
  "generic-reciprocal":{
    train:[
      C("meaning","Scegli che cosa significa: They blamed each other.",["si sono incolpati a vicenda","ognuno ha incolpato se stesso","hanno incolpato qualcun altro"],"si sono incolpati a vicenda","Each other = reciproco."),
      C("meaning","Scegli che cosa significa: They blamed themselves.",["ognuno ha dato la colpa a se stesso","si sono incolpati a vicenda","hanno dato la colpa agli altri"],"ognuno ha dato la colpa a se stesso","Themselves = riflessivo."),
      C("tense_choice","Scegli la forma corretta: Each student must bring ___ own laptop.",["their","his or their","them"],"their","Their singolare per una persona generica."),
      C("use","Nelle istruzioni ti rivolgi a chiunque. Scegli la frase più adatta.",["If anyone has questions, they can contact the desk.","If anyone has questions, he can contact the desk.","If anyone has questions, it can contact the desk."],"If anyone has questions, they can contact the desk.","They per una persona non specificata."),
      C("use","Dici che i due reparti non comunicano. Scegli la frase corretta.",["The two departments rarely talk to each other.","The two departments rarely talk to themselves each.","The two departments rarely talk each other."],"The two departments rarely talk to each other.","Talk to each other."),
      O("word_order","Metti le parole in ordine e scrivi la frase: enjoy / yourselves / at the party","Enjoy yourselves at the party",["At the party enjoy yourselves"],"Yourselves: plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: each other / have known / for years / we","We have known each other for years",[],"Each other dopo il verbo.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I fixed the bike ___. (da solo, riflessivo)","myself",[],"Riflessivo enfatico."),
      O("form","Scrivi solo le parole mancanti: The players congratulated ___. (a vicenda)","each other",["one another"],"Reciproco."),
      C("meaning","Scegli che cosa significa: She lives by herself.",["vive da sola","vive con se stessa e altri","vive vicino a lei"],"vive da sola","By oneself = da solo."),
      C("tense_choice","Scegli la forma corretta: Somebody left ___ umbrella here.",["their","its","them"],"their","Their per persona generica."),
      C("use","Inviti gli ospiti a servirsi. Scegli la frase corretta.",["Please help yourselves to coffee.","Please help you to coffee.","Please help yourself each to coffee."],"Please help yourselves to coffee.","Help yourselves."),
      O("word_order","Metti le parole in ordine e scrivi la frase: introduced / themselves / the new officers","The new officers introduced themselves",[],"Riflessivo.")
    ]
  },
  "mixed-conditionals":{
    train:[
      C("meaning","Scegli che cosa significa: If I had taken the job, I would be in London now.",["non ho preso il lavoro e ora non sono a Londra","ho preso il lavoro e sono a Londra","prenderò il lavoro"],"non ho preso il lavoro e ora non sono a Londra","Misto: passato irreale, conseguenza presente."),
      C("meaning","Scegli che cosa significa: Take an umbrella in case it rains.",["prendilo per precauzione","prendilo solo se piove","non prenderlo se piove"],"prendilo per precauzione","In case = per precauzione."),
      C("tense_choice","Scegli la forma corretta: If she spoke French, she ___ the meeting last week.",["would have led","would lead yesterday","led"],"would have led","Misto: condizione presente, conseguenza passata."),
      C("use","Nel rapporto scrivi in modo formale cosa sarebbe successo. Scegli la frase corretta.",["Had the alarm worked, the damage would have been limited.","Had the alarm worked, the damage would be limited yesterday.","If had the alarm worked, the damage would have been limited."],"Had the alarm worked, the damage would have been limited.","Inversione formale senza if."),
      C("use","Nelle istruzioni scrivi in modo formale cosa fare in caso di problemi. Scegli la frase corretta.",["Should you have any problems, please call us.","Should you having any problems, please call us.","If should you have any problems, please call us."],"Should you have any problems, please call us.","Should + soggetto: formale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: we / if / had left / would be / earlier / we / there now","If we had left earlier we would be there now",["We would be there now if we had left earlier"],"Condizionale misto."),
      O("word_order","Metti le parole in ordine e scrivi la frase: even if / we'll go / it snows","We'll go even if it snows",["Even if it snows we'll go"],"Even if = anche se.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: ___ I known, I would have helped. (inversione formale)","Had",[],"Had + soggetto + participio."),
      O("form","Scrivi solo le parole mancanti, con would: If he had studied medicine, he ___ a doctor now. (be)","would be",[],"Misto: conseguenza presente."),
      C("meaning","Scegli che cosa significa: If I weren't so busy, I would have come to the party.",["sono sempre impegnato e non sono venuto","non sono impegnato e sono venuto","verrò alla festa"],"sono sempre impegnato e non sono venuto","Misto: stato presente, conseguenza passata."),
      C("tense_choice","Scegli la forma corretta: I'll bring snacks ___ we get hungry.",["in case","unless","even"],"in case","Precauzione."),
      C("use","Spieghi la situazione attuale con una scelta passata. Scegli la frase corretta.",["If I hadn't missed the train, I wouldn't be late now.","If I didn't miss the train, I wouldn't be late now yesterday.","If I hadn't missed the train, I won't be late now."],"If I hadn't missed the train, I wouldn't be late now.","Misto."),
      O("word_order","Metti le parole in ordine e scrivi la frase: should / you / need / call me / any help","Should you need any help call me",["Call me should you need any help"],"Should + soggetto.")
    ]
  },
  "complex-verb-patterns":{
    train:[
      C("meaning","Scegli che cosa significa: He is said to have left the country.",["si dice che abbia lasciato il paese","dice di voler lasciare il paese","gli hanno detto di lasciare il paese"],"si dice che abbia lasciato il paese","Is said to have + participio: voce su un fatto passato."),
      C("meaning","Scegli che cosa significa: She hates being interrupted.",["detesta che la interrompano","detesta interrompere gli altri","ha interrotto qualcuno"],"detesta che la interrompano","Gerundio passivo."),
      C("tense_choice","Scegli la forma corretta: The suspect is thought ___ in the area at the moment.",["to be hiding","to have hidden","hiding"],"to be hiding","Infinito continuous: in corso adesso."),
      C("use","Nel rapporto riporti una voce non confermata. Scegli la frase corretta.",["The driver is believed to have fled on foot.","The driver is believed to fled on foot.","The driver is believed having fled on foot."],"The driver is believed to have fled on foot.","Is believed to have + participio."),
      C("use","Dici che il documento deve ancora essere firmato. Scegli la frase corretta.",["The contract still needs to be signed.","The contract still needs to sign by us.","The contract still needs be signed."],"The contract still needs to be signed.","Need + infinito passivo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to have been / is reported / the building / damaged","The building is reported to have been damaged",[],"Infinito perfect passivo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: being / she / followed / remembers","She remembers being followed",[],"Gerundio passivo.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti: He is known ___ several languages. (speak)","to speak",[],"Is known to + infinito."),
      O("form","Scrivi solo le parole mancanti, al passivo: Nobody likes ___ . (criticise)","being criticised",["being criticized","to be criticised","to be criticized"],"Like ammette sia -ing sia to + infinito. Qui sono valide being criticised e to be criticised, entrambe passive; sono accettate anche le grafie americane con -z-."),
      C("meaning","Scegli che cosa significa: The ship is thought to have sunk.",["si pensa che la nave sia affondata","la nave sta affondando","la nave affonderà"],"si pensa che la nave sia affondata","Infinito perfect."),
      C("tense_choice","Scegli la forma corretta: The minister is expected ___ tomorrow.",["to arrive","to have arrived","arriving yesterday"],"to arrive","Azione futura: infinito semplice."),
      C("use","Riferisci in modo impersonale un fatto in corso. Scegli la frase corretta.",["The talks are said to be going well.","The talks are said going well.","The talks are said to going well."],"The talks are said to be going well.","Infinito continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: avoided / he / being / seen","He avoided being seen",[],"Avoid + gerundio passivo.")
    ]
  },
  "future-alternatives":{
    train:[
      C("meaning","Scegli che cosa significa: The train is about to leave.",["il treno sta per partire","il treno partirà domani","il treno è partito"],"il treno sta per partire","Be about to: imminente."),
      C("meaning","Scegli che cosa significa: The President is to visit Rome next month.",["la visita è programmata ufficialmente","il Presidente deve per forza visitare Roma","il Presidente ha visitato Roma"],"la visita è programmata ufficialmente","Be to: programma ufficiale."),
      C("tense_choice","Scegli la forma corretta: The report is due ___ next Monday.",["to be published","publishing","to publishing"],"to be published","Be due to + infinito."),
      C("use","Avvisi che la riunione sta per iniziare. Scegli la frase corretta.",["The meeting is about to start.","The meeting is about starting.","The meeting is about to starting."],"The meeting is about to start.","Be about to + infinito."),
      C("use","Nel comunicato indichi una probabilità bassa. Scegli la frase più adatta.",["The road is unlikely to reopen before Friday.","The road is unlikely reopening before Friday.","The road is unlikely that reopen before Friday."],"The road is unlikely to reopen before Friday.","Be unlikely to + infinito."),
      O("word_order","Metti le parole in ordine e scrivi la frase: on the point of / were / giving up / we","We were on the point of giving up",[],"On the point of + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: is bound to / she / the job / get","She is bound to get the job",[],"Be bound to: quasi certo.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The flight is due ___ land at six.","to",[],"Be due to + infinito."),
      O("form","Scrivi solo la parola mancante: Staff are ___ wear their badges at all times. (istruzione ufficiale)","to",[],"Be to: obbligo ufficiale."),
      C("meaning","Scegli che cosa significa: Prices are likely to rise.",["probabilmente i prezzi saliranno","i prezzi sono saliti","i prezzi non saliranno"],"probabilmente i prezzi saliranno","Be likely to."),
      C("tense_choice","Scegli la forma corretta: I was just about ___ when you called.",["to leave","leaving","leave"],"to leave","Be about to + infinito."),
      C("use","Annunci che una cosa succederà quasi certamente. Scegli la frase corretta.",["There is bound to be a delay.","There is bound being a delay.","There bound to be a delay."],"There is bound to be a delay.","Be bound to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: due / the new rules / are / to come into force","The new rules are due to come into force",[],"Be due to.")
    ]
  },
  causatives:{
    train:[
      C("meaning","Scegli che cosa significa: I had my hair cut.",["mi sono fatto tagliare i capelli","mi sono tagliato i capelli da solo","avevo i capelli tagliati da tempo"],"mi sono fatto tagliare i capelli","Have + oggetto + participio."),
      C("meaning","Scegli che cosa significa: She had her phone stolen.",["le hanno rubato il telefono","ha fatto rubare il telefono","ha rubato un telefono"],"le hanno rubato il telefono","Have something done: anche per eventi subiti."),
      C("tense_choice","Scegli la forma corretta: We're going to ___ the windows cleaned.",["have","make","let"],"have","Have something done."),
      C("use","Dici che farai controllare l'auto. Scegli la frase corretta.",["I'm going to have the car serviced.","I'm going to have serviced the car.","I'm going to have the car service."],"I'm going to have the car serviced.","Oggetto prima del participio."),
      C("use","Il capo ti ha obbligato a rifare il rapporto. Scegli la frase corretta.",["My boss made me rewrite the report.","My boss made me to rewrite the report.","My boss made me rewriting the report."],"My boss made me rewrite the report.","Make + persona + verbo senza to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: let / us / leave early / the manager","The manager let us leave early",[],"Let + persona + verbo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: got / to sign / the client / we / the form","We got the client to sign the form",[],"Get + persona + to.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: We need to have the lock ___. (change)","changed",[],"Have + oggetto + participio."),
      O("form","Scrivi solo le parole mancanti: I got my brother ___ me move. (help)","to help",[],"Get + persona + to."),
      C("meaning","Scegli che cosa significa: They let me use the car.",["mi hanno permesso di usare l'auto","mi hanno obbligato a usare l'auto","hanno usato la mia auto"],"mi hanno permesso di usare l'auto","Let = permettere."),
      C("tense_choice","Scegli la forma corretta: The film made me ___.",["cry","to cry","crying"],"cry","Make + verbo senza to."),
      C("use","Dici che hai fatto installare le telecamere. Scegli la frase corretta.",["We had new cameras installed last week.","We had installed new cameras by someone last week.","We had new cameras install last week."],"We had new cameras installed last week.","Have something done."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had / checked / my eyes / I","I had my eyes checked",[],"Have + oggetto + participio.")
    ]
  },
  "reporting-patterns":{
    train:[
      C("meaning","Scegli che cosa significa: She denied taking the money.",["ha negato di aver preso i soldi","ha rifiutato di prendere i soldi","ha ammesso di aver preso i soldi"],"ha negato di aver preso i soldi","Deny + -ing."),
      C("meaning","Scegli che cosa significa: He offered to drive us.",["si è offerto di accompagnarci","ci ha chiesto di guidare","ha rifiutato di guidare"],"si è offerto di accompagnarci","Offer + to."),
      C("tense_choice","Scegli la forma corretta: The officer warned us ___ the bridge.",["not to cross","not crossing","to not crossing"],"not to cross","Warn + persona + not to."),
      C("use","Nel rapporto riferisci che il sospettato ha ammesso il fatto. Scegli la frase corretta.",["The suspect admitted breaking the window.","The suspect admitted to break the window.","The suspect admitted break the window."],"The suspect admitted breaking the window.","Admit + -ing."),
      C("use","Riferisci un suggerimento del collega. Scegli la frase corretta.",["He suggested postponing the meeting.","He suggested to postpone the meeting.","He suggested us to postpone the meeting."],"He suggested postponing the meeting.","Suggest + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: of / they / him / lying / accused","They accused him of lying",[],"Accuse + persona + of + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to call / she / promised / back","She promised to call back",[],"Promise + to.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: She apologised ___ arriving late.","for",[],"Apologise for + -ing."),
      O("form","Scrivi solo le parole mancanti: He threatened ___ the police. (call)","to call",[],"Threaten + to."),
      C("meaning","Scegli che cosa significa: They insisted on paying.",["hanno insistito per pagare","si sono rifiutati di pagare","ci hanno chiesto di pagare"],"hanno insistito per pagare","Insist on + -ing."),
      C("tense_choice","Scegli la forma corretta: The manager reminded me ___ the door.",["to lock","locking","lock"],"to lock","Remind + persona + to."),
      C("use","Riferisci che il testimone si è rifiutato di firmare. Scegli la frase corretta.",["The witness refused to sign the statement.","The witness refused signing the statement.","The witness refused that he sign the statement."],"The witness refused to sign the statement.","Refuse + to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: congratulated / on / her / passing / we / the exam","We congratulated her on passing the exam",[],"Congratulate on + -ing.")
    ]
  },
  "ever-relatives":{
    train:[
      C("meaning","Scegli che cosa significa: Whatever you decide, I'll support you.",["qualunque cosa tu decida, ti sosterrò","quando avrai deciso, ti sosterrò","se decidi, forse ti sosterrò"],"qualunque cosa tu decida, ti sosterrò","Whatever = qualunque cosa."),
      C("meaning","Scegli che cosa significa: However hard I try, I can't open it.",["per quanto mi sforzi, non riesco ad aprirlo","in ogni modo riesco ad aprirlo","mi sforzo raramente"],"per quanto mi sforzi, non riesco ad aprirlo","However + aggettivo/avverbio = per quanto."),
      C("tense_choice","Scegli la forma corretta: You can sit ___ you like.",["wherever","whoever","whatever"],"wherever","Luogo: wherever."),
      C("use","Dici a un collega che può chiamarti in qualsiasi momento. Scegli la frase corretta.",["Call me whenever you need to.","Call me whatever you need to.","Call me wherever you need to time."],"Call me whenever you need to.","Whenever = ogni volta che."),
      C("use","Nelle istruzioni dici che il primo che arriva apre l'ufficio. Scegli la frase corretta.",["Whoever arrives first should open the office.","Whatever arrives first should open the office.","Who ever arrives first, he should open the office."],"Whoever arrives first should open the office.","Whoever = chiunque."),
      O("word_order","Metti le parole in ordine e scrivi la frase: whichever / take / you prefer","Take whichever you prefer",[],"Whichever = quello che (tra pochi)."),
      O("word_order","Metti le parole in ordine e scrivi la frase: whatever / don't / happens / panic","Whatever happens don't panic",["Don't panic whatever happens"],"Whatever happens.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: ___ you go, take your ID with you. (ovunque)","Wherever",[],"Wherever."),
      O("form","Scrivi solo la parola mancante: ___ wins will receive a prize. (chiunque)","Whoever",[],"Whoever."),
      C("meaning","Scegli che cosa significa: Choose whichever date suits you.",["scegli la data che ti va meglio","scegli una data qualsiasi tranne una","scegli quando vuoi venire"],"scegli la data che ti va meglio","Whichever."),
      C("tense_choice","Scegli la forma corretta: ___ late it is, call me when you arrive.",["However","Whatever","Whenever"],"However","However + aggettivo."),
      C("use","Rassicuri un collega. Scegli la frase corretta.",["Whatever you need, just ask.","Whoever you need, just ask it.","However you need, just ask."],"Whatever you need, just ask.","Whatever."),
      O("word_order","Metti le parole in ordine e scrivi la frase: visit / whenever / you can / us","Visit us whenever you can",["Whenever you can visit us"],"Whenever.")
    ]
  },
  ellipsis:{
    train:[
      C("meaning","Scegli che cosa significa: 'Are you coming?' 'I think so.'",["penso di sì","penso di no","non lo so proprio"],"penso di sì","Think so = penso di sì."),
      C("meaning","Scegli che cosa significa: She can swim, and so can I.",["anche io so nuotare","io non so nuotare","nessuno dei due sa nuotare"],"anche io so nuotare","So + ausiliare + soggetto."),
      C("tense_choice","Scegli la forma corretta: I don't like coffee, and ___ does my wife.",["neither","so","either"],"neither","Neither + ausiliare per due negazioni."),
      C("use","Rispondi che temi di no. Scegli la risposta corretta.",["I'm afraid not.","I'm afraid no.","I'm afraid not so."],"I'm afraid not.","I'm afraid not."),
      C("use","Eviti di ripetere il verbo. Scegli la frase corretta.",["I wasn't invited, but my colleague was.","I wasn't invited, but my colleague was invited too was.","I wasn't invited, but my colleague did."],"I wasn't invited, but my colleague was.","Ausiliare al posto del verbo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: so / I / have / and","And so have I",[],"So + ausiliare + soggetto."),
      O("word_order","Metti le parole in ordine e scrivi la frase: I'd / to / like / but I can't","I'd like to but I can't",[],"To senza ripetere il verbo.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: 'Is the shop open?' 'I don't think ___.'","so",[],"Don't think so."),
      O("form","Scrivi solo la parola mancante: He has finished, and so ___ she. (ausiliare)","has",[],"So has she."),
      C("meaning","Scegli che cosa significa: 'I can't come.' 'Neither can I.'",["neanche io posso venire","io invece posso venire","forse posso venire"],"neanche io posso venire","Neither + ausiliare."),
      C("tense_choice","Scegli la forma corretta: You don't have to come, but you can if you want ___.",["to","it","so"],"to","Ellissi con to."),
      C("use","Rispondi che speri di sì. Scegli la risposta corretta.",["I hope so.","I hope it.","I hope yes."],"I hope so.","Hope so."),
      O("word_order","Metti le parole in ordine e scrivi la frase: neither / I / did / and","And neither did I",[],"Neither + ausiliare + soggetto.")
    ]
  },
  "lexical-contrasts":{
    train:[
      C("meaning","Scegli che cosa significa: Could you lend me your pen?",["mi presti la tua penna?","posso prestarti la mia penna?","mi hai preso la penna?"],"mi presti la tua penna?","Lend = dare in prestito."),
      C("meaning","Scegli che cosa significa: The price has risen.",["il prezzo è salito","qualcuno ha alzato il prezzo apposta","il prezzo è sceso"],"il prezzo è salito","Rise: intransitivo, sale da solo."),
      C("tense_choice","Chiedi un prestito gratuito e prometti di restituire il caricatore. Scegli la forma corretta: Can I ___ your charger for an hour?",["borrow","lend","rent"],"borrow","Borrow = prendere in prestito."),
      C("use","Al telefono chiedi a un collega di portarti un documento in ufficio. Scegli la frase corretta.",["Could you bring the file to my office?","Could you take the file to my office here?","Could you carry me the file to my office?"],"Could you bring the file to my office?","Bring = verso chi parla."),
      C("use","Chiedi a qualcuno di ricordarti di chiamare il cliente. Scegli la frase corretta.",["Please remind me to call the client.","Please remember me to call the client.","Please remind to me to call the client."],"Please remind me to call the client.","Remind + persona + to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: lie down / for a while / I need to","I need to lie down for a while",[],"Lie = sdraiarsi."),
      O("word_order","Metti le parole in ordine e scrivi la frase: raised / the officer / his hand","The officer raised his hand",[],"Raise: transitivo.")
    ],
    check:[
      O("form","Scrivi solo il verbo mancante: Can you ___ me some money until Friday? (lend/borrow)","lend",[],"Lend = prestare."),
      O("form","Scrivi solo il verbo mancante al past simple: The sun ___ at six. (rise/raise)","rose",[],"Rise → rose."),
      C("meaning","Scegli che cosa significa: Don't forget to take your keys.",["porta con te le chiavi","portami le chiavi","lascia le chiavi"],"porta con te le chiavi","Take = portare via da qui."),
      C("tense_choice","Scegli la forma corretta: She ___ the book on the table and left.",["laid","lay","lied"],"laid","Lay (posare) → laid."),
      C("use","Racconti che alla stazione ti hanno derubato. Scegli la frase corretta.",["Someone robbed me at the station.","Someone stole me at the station.","Someone robbed my wallet from me at the station."],"Someone robbed me at the station.","Rob + persona; steal + cosa."),
      O("word_order","Metti le parole in ordine e scrivi la frase: stole / someone / my bike","Someone stole my bike",[],"Steal + cosa.")
    ]
  },
  "discourse-contrasts":{
    train:[
      C("meaning","Scegli che cosa significa: He works like a machine.",["lavora come se fosse una macchina","lavora come macchinista","lavora con una macchina"],"lavora come se fosse una macchina","Like = paragone."),
      C("meaning","Scegli che cosa significa: Instead of driving, we walked.",["invece di guidare, siamo andati a piedi","oltre a guidare, abbiamo camminato","dopo aver guidato, abbiamo camminato"],"invece di guidare, siamo andati a piedi","Instead of + -ing."),
      C("tense_choice","Scegli la forma corretta: I ___ you a quick recovery.",["wish","hope","want that"],"wish","Wish + persona + nome per gli auguri."),
      C("use","Spieghi a cosa serve un oggetto. Scegli la frase corretta.",["This app is used for tracking deliveries.","This app is used for track deliveries.","This app is used to tracking deliveries."],"This app is used for tracking deliveries.","For + -ing per la funzione."),
      C("use","Smentisci un'idea sbagliata. Scegli la frase più adatta.",["The task wasn't easy; on the contrary, it took weeks.","The task wasn't easy; on the other hand, it took weeks.","The task wasn't easy; in contrary, it took weeks."],"The task wasn't easy; on the contrary, it took weeks.","On the contrary = anzi."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as / she / an interpreter / works","She works as an interpreter",[],"As = in qualità di."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to / we / went / buy bread / out","We went out to buy bread",[],"To + verbo = scopo.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I hope ___ see you soon.","to",[],"Hope to + verbo."),
      O("form","Scrivi solo la parola mancante: He used his coat ___ a blanket. (like/as)","as",[],"As = con funzione di."),
      C("meaning","Scegli che cosa significa: On the other hand, it's expensive.",["d'altra parte, è caro","anzi, è economico","quindi è caro"],"d'altra parte, è caro","On the other hand = d'altra parte."),
      C("tense_choice","Scegli la forma corretta: She saved money ___ buy a car.",["to","for","for to"],"to","Scopo: to + verbo."),
      C("use","Esprimi una speranza per il futuro. Scegli la frase corretta.",["I hope you enjoy the course.","I wish you enjoy the course.","I hope you to enjoy the course."],"I hope you enjoy the course.","Hope + frase."),
      O("word_order","Metti le parole in ordine e scrivi la frase: instead of / we / took the stairs / the lift","We took the stairs instead of the lift",[],"Instead of + nome.")
    ]
  },
  "phrasal-scenarios":{
    train:[
      C("meaning","Scegli che cosa significa: The meeting was called off.",["la riunione è stata annullata","la riunione è stata convocata","la riunione è stata rinviata di un'ora"],"la riunione è stata annullata","Call off = annullare."),
      C("meaning","Scegli che cosa significa: We ran out of fuel.",["abbiamo finito il carburante","abbiamo fatto il pieno","siamo scappati dal carburante"],"abbiamo finito il carburante","Run out of = esaurire."),
      C("tense_choice","Scegli la forma corretta: Please fill ___ this form.",["in","on","at"],"in","Fill in = compilare."),
      C("use","Chiedi a un collega di occuparsi di un problema. Scegli la frase corretta.",["Could you look into the problem?","Could you look the problem into?","Could you look at into the problem?"],"Could you look into the problem?","Look into = indagare; non separabile."),
      C("use","Al telefono chiedi di attendere. Scegli la frase corretta.",["Could you hold on a moment, please?","Could you hold a moment on, please?","Could you hold up on a moment, please?"],"Could you hold on a moment, please?","Hold on = attendere."),
      O("word_order","Metti le parole in ordine e scrivi la frase: it / put / off / we / until Monday","We put it off until Monday",[],"Pronome tra verbo e particella."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the old documents / threw / she / away","She threw the old documents away",["She threw away the old documents"],"Throw away separabile.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The car broke ___ on the motorway.","down",[],"Break down = guastarsi."),
      O("form","Scrivi solo la parola mancante: I'm looking ___ to meeting you. (non vedo l'ora)","forward",[],"Look forward to."),
      C("meaning","Scegli che cosa significa: She turned down the offer.",["ha rifiutato l'offerta","ha accettato l'offerta","ha abbassato il prezzo"],"ha rifiutato l'offerta","Turn down = rifiutare."),
      C("tense_choice","Scegli la forma corretta: Can you pick me ___ at the station?",["up","on","off"],"up","Pick up = venire a prendere."),
      C("use","Chiedi di rimandare una riunione. Scegli la frase corretta.",["Can we put off the meeting until Friday?","Can we put the meeting on until Friday?","Can we put out the meeting until Friday?"],"Can we put off the meeting until Friday?","Put off = rimandare."),
      O("word_order","Metti le parole in ordine e scrivi la frase: out / found / the truth / they","They found out the truth",["They found the truth out"],"Find out = scoprire.")
    ]
  },
  "review-narrative":{
    train:[
      C("meaning","Scegli che cosa significa: When I arrived, the meeting had started.",["la riunione era già iniziata quando sono arrivato","la riunione è iniziata dopo il mio arrivo","sono arrivato e poi abbiamo iniziato"],"la riunione era già iniziata quando sono arrivato","Past perfect: prima di un altro passato."),
      C("meaning","Scegli che cosa significa: I used to work nights.",["in passato lavoravo di notte, ora no","sono abituato a lavorare di notte","lavoro di notte da poco"],"in passato lavoravo di notte, ora no","Used to: abitudine passata."),
      C("tense_choice","Scegli la forma corretta: While we ___ , the phone rang.",["were eating","ate","had eaten"],"were eating","Azione in corso interrotta: past continuous."),
      C("use","Nel rapporto racconti la sequenza dei fatti. Scegli la frase corretta.",["The patrol arrived after the suspect had left.","The patrol had arrived after the suspect left before.","The patrol arrives after the suspect had left."],"The patrol arrived after the suspect had left.","Past simple + past perfect."),
      C("use","Racconti che cosa stavi facendo durante il blackout. Scegli la frase corretta.",["I was writing a report when the lights went out.","I wrote a report when the lights were going out.","I had been write a report when the lights went out."],"I was writing a report when the lights went out.","Continuous + simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had been waiting / for an hour / she / when he arrived","She had been waiting for an hour when he arrived",["When he arrived she had been waiting for an hour"],"Past perfect continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: used to / we / in Naples / live","We used to live in Naples",[],"Used to + verbo.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti al past continuous: I ___ when you called. (drive)","was driving",[],"Past continuous."),
      O("form","Scrivi solo le parole mancanti al past perfect: By the time we arrived, the film ___. (start)","had started",[],"Past perfect."),
      C("meaning","Scegli che cosa significa: I'm used to working late.",["sono abituato a lavorare fino a tardi","lavoravo fino a tardi","lavorerò fino a tardi"],"sono abituato a lavorare fino a tardi","Be used to + -ing."),
      C("tense_choice","Scegli la forma corretta: She was tired because she ___ all day.",["had been working","has been working","works"],"had been working","Causa passata con durata."),
      C("use","Racconti un viaggio con una data precisa. Scegli la frase corretta.",["I visited Rome last year.","I have visited Rome last year.","I had visit Rome last year."],"I visited Rome last year.","Tempo finito (last year): past simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: was / she / when / the call came / sleeping","She was sleeping when the call came",["When the call came she was sleeping"],"Continuous + simple.")
    ]
  },
  "reporting-passive":{
    train:[
      O("form","Scrivi solo le parole mancanti: The fire is thought ___ at midnight. (start)","to have started",[],"Fatto passato: to have + participio."),
      O("form","Scrivi solo le parole mancanti: It ___ that the talks will fail. (fear, passivo presente)","is feared",[],"It + passivo + that."),
      C("meaning","Scegli che cosa significa: The gang is reported to be planning another raid.",["si riferisce che la banda stia preparando un altro colpo","la banda ha riferito un colpo","la banda ha già fatto un altro colpo"],"si riferisce che la banda stia preparando un altro colpo","To be + -ing: in corso adesso."),
      C("meaning","Scegli che cosa significa: It is said that the castle is haunted.",["si dice che il castello sia infestato","il castello dice di essere infestato","qualcuno ha detto al castello"],"si dice che il castello sia infestato","It is said that = si dice che."),
      C("tense_choice","Scegli la forma corretta: The suspect is believed ___ the money last week.",["to have taken","to take","taking"],"to have taken","Azione passata rispetto al presente."),
      C("tense_choice","Scegli la forma corretta: ___ that prices will rise again.",["It is expected","It expects","It is expecting"],"It is expected","It + passivo."),
      C("use","Nel comunicato riporti una notizia non confermata in modo impersonale. Scegli la frase più adatta.",["Two people are reported to have been injured.","Two people are reported to injured.","Two people report to have been injured."],"Two people are reported to have been injured.","Passivo di reporting + infinito perfect passivo."),
      C("use","Nel rapporto eviti di citare la fonte. Scegli la frase più adatta.",["It is alleged that the driver was speeding.","It alleges that the driver was speeding.","The driver alleges was speeding."],"It is alleged that the driver was speeding.","It is alleged that."),
      O("word_order","Metti le parole in ordine e scrivi la frase: is known / to be / the area / dangerous","The area is known to be dangerous",[],"Soggetto + passivo + to be."),
      O("word_order","Metti le parole in ordine e scrivi la frase: it / that / is believed / he escaped","It is believed that he escaped",[],"It is believed that.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti: The painting is said ___ worth millions. (be)","to be",[],"Stato presente: to be."),
      O("form","Scrivi solo le parole mancanti: The ship is thought ___ near the coast. (sink, passato)","to have sunk",[],"To have + participio."),
      C("meaning","Scegli che cosa significa: He is understood to have resigned.",["risulta che si sia dimesso","ha capito di doversi dimettere","si dimetterà domani"],"risulta che si sia dimesso","Is understood to have."),
      C("tense_choice","Scegli la forma corretta: The negotiations are said ___ well at the moment.",["to be going","to have gone","go"],"to be going","In corso: to be + -ing."),
      C("use","Riporti un'opinione diffusa in modo formale. Scegli la frase corretta.",["It is widely believed that the plan will succeed.","It widely believes that the plan will succeed.","It is widely believing that the plan will succeed."],"It is widely believed that the plan will succeed.","It is believed that."),
      O("word_order","Metti le parole in ordine e scrivi la frase: are thought / the thieves / to have fled / abroad","The thieves are thought to have fled abroad",[],"Passivo + infinito perfect.")
    ]
  },
  participles:{
    train:[
      O("form","Scrivi solo la parola mancante: The man ___ next to me was very kind. (sit)","sitting",[],"Participio presente al posto di who was sitting."),
      O("form","Scrivi solo la parola mancante: ___ by the noise, the dog ran away. (frighten)","Frightened",[],"Participio passato: valore passivo."),
      C("meaning","Scegli che cosa significa: Having checked the doors, the guard left.",["la guardia ha controllato le porte e poi è uscita","la guardia è uscita mentre controllava","la guardia controllerà le porte"],"la guardia ha controllato le porte e poi è uscita","Having + participio: azione precedente."),
      C("meaning","Scegli che cosa significa: Not knowing the way, we asked a local.",["poiché non conoscevamo la strada, abbiamo chiesto","pur conoscendo la strada, abbiamo chiesto","non abbiamo chiesto la strada"],"poiché non conoscevamo la strada, abbiamo chiesto","Participio con valore causale."),
      C("tense_choice","Scegli la forma corretta: The car ___ outside belongs to my neighbour.",["parked","parking","having park"],"parked","Valore passivo: participio passato."),
      C("tense_choice","Scegli la forma corretta: ___ the email, she called the client.",["Having read","Read","Being read"],"Having read","Azione completata prima: having + participio."),
      C("use","Nel rapporto descrivi in modo sintetico i reperti. Scegli la frase più adatta.",["The items found at the scene were sent to the lab.","The items finding at the scene were sent to the lab.","The items were found at the scene were sent to the lab."],"The items found at the scene were sent to the lab.","Participio passato ridotto."),
      C("use","Colleghi due azioni dello stesso soggetto in stile scritto. Scegli la frase corretta.",["Leaving the office, she noticed a strange car.","Leaving the office, a strange car was noticed by her.","Left the office, she noticed a strange car."],"Leaving the office, she noticed a strange car.","Il soggetto del participio deve coincidere."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the woman / is my boss / talking to Paul","The woman talking to Paul is my boss",[],"Participio dopo il nome."),
      O("word_order","Metti le parole in ordine e scrivi la frase: having / we / finished / went home","Having finished we went home",["We went home having finished"],"Having + participio.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Most of the products ___ here are exported. (make)","made",[],"Participio passato."),
      O("form","Scrivi solo le parole mancanti: ___ the instructions, he started the machine. (read, azione precedente)","Having read",[],"Having + participio."),
      C("meaning","Scegli che cosa significa: Feeling tired, I went to bed.",["poiché ero stanco, sono andato a letto","ero stanco dopo essere andato a letto","non ero stanco"],"poiché ero stanco, sono andato a letto","Participio causale."),
      C("tense_choice","Scegli la forma corretta: Passengers ___ for Rome should go to gate 4.",["travelling","travelled","having travel"],"travelling","Valore attivo: -ing."),
      C("use","Descrivi un documento allegato in modo formale. Scegli la frase corretta.",["Please find the contract signed by both parties.","Please find the contract signing by both parties.","Please find the contract was signed by both parties."],"Please find the contract signed by both parties.","Participio passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: not / what to say / knowing / she stayed silent","Not knowing what to say she stayed silent",["She stayed silent not knowing what to say"],"Not + -ing.")
    ]
  },
  inversion:{
    train:[
      O("form","Scrivi solo la parola mancante: Not only ___ he late, but he also forgot the file. (be, passato)","was",[],"Not only + inversione."),
      O("form","Scrivi solo la parola mancante: Rarely ___ we see such results. (ausiliare presente)","do",[],"Rarely + do + soggetto."),
      C("meaning","Scegli che cosa significa: No sooner had we arrived than it started to rain.",["appena arrivati, ha cominciato a piovere","pioveva da tempo quando siamo arrivati","non siamo arrivati perché pioveva"],"appena arrivati, ha cominciato a piovere","No sooner ... than."),
      C("meaning","Scegli che cosa significa: Under no circumstances should you open this door.",["non devi aprire questa porta in nessun caso","puoi aprirla in certe circostanze","dovresti aprirla subito"],"non devi aprire questa porta in nessun caso","Under no circumstances: divieto assoluto."),
      C("tense_choice","Scegli la forma corretta: Hardly ___ the meeting begun when the alarm rang.",["had","did","has"],"had","Hardly + had + participio."),
      C("tense_choice","Scegli la forma corretta: Little ___ that the police were watching.",["did he know","he knew","knew he"],"did he know","Little + did + soggetto."),
      C("use","In un discorso formale sottolinei un fatto raro. Scegli la frase corretta.",["Seldom have we faced such a challenge.","Seldom we have faced such a challenge.","Seldom have faced we such a challenge."],"Seldom have we faced such a challenge.","Seldom + inversione."),
      C("use","Nelle istruzioni di sicurezza esprimi un divieto forte. Scegli la frase corretta.",["On no account must the alarm be switched off.","On no account the alarm must be switched off.","On no account must be the alarm switched off."],"On no account must the alarm be switched off.","On no account + modale + soggetto."),
      O("word_order","Metti le parole in ordine e scrivi la frase: did / only later / the truth / we / learn","Only later did we learn the truth",[],"Only later + did."),
      O("word_order","Metti le parole in ordine e scrivi la frase: never / I / have / so tired / felt","Never have I felt so tired",[],"Never + have + soggetto.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Seldom ___ she complain. (ausiliare presente)","does",[],"Seldom + does."),
      O("form","Scrivi solo la parola mancante: No sooner ___ I sat down than the phone rang.","had",[],"No sooner had."),
      C("meaning","Scegli che cosa significa: Only when he left did I realise the truth.",["ho capito la verità solo quando è andato via","ho capito la verità prima che andasse via","non ho mai capito la verità"],"ho capito la verità solo quando è andato via","Only when + inversione."),
      C("tense_choice","Scegli la forma corretta: Not until midnight ___ the results.",["did they announce","they announced","announced they"],"did they announce","Not until + inversione."),
      C("use","Sottolinei in modo formale un doppio problema. Scegli la frase corretta.",["Not only is the system slow, but it is also expensive.","Not only the system is slow, but it is also expensive.","Not only is slow the system, but it is also expensive."],"Not only is the system slow, but it is also expensive.","Not only + inversione."),
      O("word_order","Metti le parole in ordine e scrivi la frase: rarely / he / does / on time / arrive","Rarely does he arrive on time",[],"Rarely + does.")
    ]
  },
  clefts:{
    train:[
      O("form","Scrivi solo la parola mancante: It was the manager ___ approved the plan. (persona)","who",["that"],"It was ... who."),
      O("form","Scrivi solo la parola mancante: What I like about this job ___ the variety.","is",[],"What-cleft + is."),
      C("meaning","Scegli che cosa mette in evidenza: It was on Monday that the van was stolen.",["il giorno del furto","chi ha rubato il furgone","il tipo di veicolo"],"il giorno del furto","It was + elemento + that."),
      C("meaning","Scegli che cosa mette in evidenza: What worries me is the cost.",["il costo","la preoccupazione in generale","chi si preoccupa"],"il costo","What-cleft: l'elemento dopo is."),
      C("tense_choice","Scegli la forma corretta: All I want ___ a quiet weekend.",["is","are","be"],"is","All + soggetto + want + is."),
      C("tense_choice","Scegli la forma corretta: It's not the money ___ matters, it's the time.",["that","what","who"],"that","It's ... that."),
      C("use","Correggi un malinteso: non è stato Marco a chiamare, ma Luca. Scegli la frase più adatta.",["It was Luca who called, not Marco.","It was Luca what called, not Marco.","Was Luca who called, not Marco."],"It was Luca who called, not Marco.","It was ... who per correggere."),
      C("use","In una riunione evidenzi la tua priorità. Scegli la frase più adatta.",["What we need now is a clear plan.","What we need now it is a clear plan.","That we need now is a clear plan."],"What we need now is a clear plan.","What-cleft."),
      O("word_order","Metti le parole in ordine e scrivi la frase: that / it was / in Rome / we met","It was in Rome that we met",[],"It was + luogo + that."),
      O("word_order","Metti le parole in ordine e scrivi la frase: is / what I need / some sleep","What I need is some sleep",[],"What-cleft.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: It was in 2019 ___ the company was founded.","that",[],"It was + tempo + that."),
      O("form","Scrivi solo la parola mancante: ___ surprised me was his reaction. (ciò che)","What",[],"What-cleft."),
      C("meaning","Scegli che cosa mette in evidenza: It was the driver who caused the accident.",["chi ha causato l'incidente","quando è avvenuto l'incidente","dove è avvenuto l'incidente"],"chi ha causato l'incidente","It was + persona."),
      C("tense_choice","Scegli la forma corretta: What they did ___ call the police.",["was","were","did"],"was","What + did + was + infinito."),
      C("use","Evidenzi il motivo del ritardo. Scegli la frase più adatta.",["It was the traffic that made us late.","It was the traffic what made us late.","The traffic it was made us late."],"It was the traffic that made us late.","It was ... that."),
      O("word_order","Metti le parole in ordine e scrivi la frase: was / all we heard / a loud bang","All we heard was a loud bang",[],"All-cleft.")
    ]
  },
  nominalisation:{
    train:[
      O("form","Scrivi solo la parola mancante: The ___ of the new rules took a month. (trasforma introduce in un nome)","introduction",[],"Introduce → introduction."),
      O("form","Scrivi solo la parola mancante: There was a sharp ___ in prices. (trasforma reduce in un nome)","reduction",[],"Reduce → reduction."),
      C("meaning","Scegli che cosa significa: The closure of the road caused delays.",["la chiusura della strada ha causato ritardi","la strada vicina ha causato ritardi","chiudere la strada eviterà ritardi"],"la chiusura della strada ha causato ritardi","Closure = chiusura."),
      C("meaning","Scegli che cosa significa: His failure to report the incident was serious.",["il fatto che non abbia segnalato l'incidente è grave","il suo incidente è stato grave","ha segnalato un incidente grave"],"il fatto che non abbia segnalato l'incidente è grave","Failure to + verbo."),
      C("tense_choice","Scegli il nome corretto: The ___ of the suspect took place at dawn.",["arrest","arresting of","arrested"],"arrest","Arrest: nome uguale al verbo."),
      C("tense_choice","Scegli il nome corretto: We need your ___ before we start.",["approval","approve","approving of"],"approval","Approve → approval."),
      C("use","Rendi più formale per un rapporto: We analysed the data and found that... Scegli la frase più adatta.",["Analysis of the data revealed that...","Analyse of the data revealed that...","The analysing of data it revealed that..."],"Analysis of the data revealed that...","Nominalizzazione: stile formale."),
      C("use","Nel rapporto spieghi la causa del ritardo con un nome. Scegli la frase più adatta.",["The delay was due to the late arrival of the equipment.","The delay was due to the equipment arrived late of.","The delay was due to the late arrive of the equipment."],"The delay was due to the late arrival of the equipment.","Arrive → arrival."),
      O("word_order","Metti le parole in ordine e scrivi la frase: of the building / the evacuation / quickly / was completed","The evacuation of the building was completed quickly",["The evacuation of the building was quickly completed"],"Nome + of."),
      O("word_order","Metti le parole in ordine e scrivi la frase: led to / the decision / protests","The decision led to protests",[],"Decide → decision.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The ___ of the bridge will take two years. (trasforma build in un nome, -ing)","building",[],"Build → building."),
      O("form","Scrivi solo la parola mancante: We appreciate your ___. (trasforma assist in un nome)","assistance",[],"Assist → assistance."),
      C("meaning","Scegli che cosa significa: The removal of the barriers took an hour.",["la rimozione delle barriere ha richiesto un'ora","le barriere hanno rimosso un'ora","rimuovere le barriere è vietato"],"la rimozione delle barriere ha richiesto un'ora","Remove → removal."),
      C("tense_choice","Scegli il nome corretto: The ___ of the meeting is to agree a budget.",["purpose","purposing","propose"],"purpose","Purpose = scopo."),
      C("use","Rendi formale: Because they responded quickly, the damage was limited. Scegli la frase più adatta.",["Their quick response limited the damage.","Their quick respond limited the damage.","Their quickly responding it limited the damage."],"Their quick response limited the damage.","Respond → response."),
      O("word_order","Metti le parole in ordine e scrivi la frase: requires / the payment / of the fee / confirmation","The payment of the fee requires confirmation",[],"Nome + of.")
    ]
  },
  hedging:{
    train:[
      O("form","Scrivi solo le parole mancanti: The results ___ a clear trend. (seem, show)","seem to show",[],"Seem to + verbo: prudenza."),
      O("form","Scrivi solo la parola mancante. Esprimi una possibilità: The delay ___ have been caused by the weather.","may",["might","could"],"May have + participio."),
      C("meaning","Scegli che cosa significa: The data would suggest a link.",["i dati sembrano indicare un collegamento","i dati provano un collegamento","i dati escludono un collegamento"],"i dati sembrano indicare un collegamento","Would suggest: affermazione prudente."),
      C("meaning","Scegli quale frase è più prudente.",["It is possible that the system failed.","The system failed.","The system definitely failed."],"It is possible that the system failed.","It is possible that: hedging."),
      C("tense_choice","Scegli la forma corretta: The suspect appears ___ the city.",["to have left","having left","to leaving"],"to have left","Appear to have + participio."),
      C("tense_choice","Scegli la forma più prudente: This approach ___ reduce costs.",["could","will certainly","must"],"could","Could: possibilità."),
      C("use","Nel rapporto presenti una conclusione senza esagerare. Scegli la frase più adatta.",["The evidence tends to support this theory.","The evidence proves this theory without doubt.","The evidence tend supporting this theory."],"The evidence tends to support this theory.","Tend to: prudenza."),
      C("use","In una mail critichi una proposta con tatto. Scegli la frase più adatta.",["It might be worth reconsidering the deadline.","The deadline is wrong and must change.","It might worth reconsider the deadline."],"It might be worth reconsidering the deadline.","Might be worth + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: to be / there / seems / a problem","There seems to be a problem",[],"There seems to be."),
      O("word_order","Metti le parole in ordine e scrivi la frase: likely / is / it / that / the plan will change","It is likely that the plan will change",[],"It is likely that.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The figures ___ to be accurate. (sembrare)","appear",["seem"],"Appear/seem to be."),
      O("form","Scrivi solo la parola mancante. Esprimi una possibilità: The new rules ___ lead to confusion.","might",["may","could"],"Might: possibilità."),
      C("meaning","Scegli che cosa significa: It would appear that the file is missing.",["sembra che il file manchi","il file manca di sicuro","il file comparirà"],"sembra che il file manchi","It would appear that: prudenza."),
      C("tense_choice","Scegli la forma più prudente: The incident ___ have been an accident.",["may","must certainly","will"],"may","May have: possibilità."),
      C("use","Esprimi un'opinione in modo prudente in un saggio. Scegli la frase più adatta.",["To some extent, the policy has been successful.","The policy has been totally successful for sure.","To some extent, the policy have been successful."],"To some extent, the policy has been successful.","To some extent: limita l'affermazione."),
      O("word_order","Metti le parole in ordine e scrivi la frase: tend / to / older drivers / be more careful","Older drivers tend to be more careful",[],"Tend to.")
    ]
  },
  subjunctive:{
    train:[
      O("form","Scrivi solo la parola mancante. Usa lo stile formale: The doctor suggested that he ___ more exercise. (take)","take",[],"Congiuntivo: forma base senza -s."),
      O("form","Scrivi solo la parola mancante. Usa lo stile formale: It is vital that every officer ___ the rules. (know)","know",[],"It is vital that + forma base."),
      C("meaning","Scegli che cosa significa: The judge insisted that the witness be protected.",["il giudice ha preteso che il testimone fosse protetto","il testimone era già protetto","il giudice era protetto"],"il giudice ha preteso che il testimone fosse protetto","Insist that + forma base."),
      C("meaning","Scegli che cosa significa: It's time we left.",["è ora di andare","siamo andati in tempo","è tardi, siamo già andati"],"è ora di andare","It's time + past: dovremmo farlo ora."),
      C("tense_choice","Scegli la forma corretta (stile formale): We request that the payment ___ made by Friday.",["be","is being","will"],"be","Request that + be."),
      C("tense_choice","Scegli la forma corretta: I'd rather you ___ smoke here.",["didn't","don't","won't"],"didn't","Would rather + past per un'altra persona."),
      C("use","Nella circolare imponi una regola in modo formale. Scegli la frase più adatta.",["It is essential that all visitors sign in at reception.","It is essential that all visitors signs in at reception.","It is essential that all visitors will signing in at reception."],"It is essential that all visitors sign in at reception.","Forma base dopo essential that."),
      C("use","Raccomandi formalmente una misura. Scegli la frase più adatta.",["We recommend that the system be updated immediately.","We recommend that the system is update immediately.","We recommend the system to be update immediately."],"We recommend that the system be updated immediately.","Recommend that + be + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: that / demanded / he / they / leave","They demanded that he leave",[],"Demand that + forma base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: we / it's time / went home","It's time we went home",[],"It's time + past.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante. Usa lo stile formale: She asked that the meeting ___ postponed. (be)","be",[],"Ask that + be."),
      O("form","Scrivi solo la parola mancante. Usa lo stile formale: It is important that he ___ on time. (arrive)","arrive",[],"Forma base senza -s."),
      C("meaning","Scegli che cosa significa: I'd rather you called me first.",["preferirei che prima mi chiamassi","hai chiamato me per primo","chiamerò io per primo"],"preferirei che prima mi chiamassi","Would rather + past."),
      C("tense_choice","Scegli la forma corretta (stile formale): The committee proposed that she ___ the director.",["become","becomes","became"],"become","Propose that + forma base."),
      C("use","Insisti formalmente su una procedura. Scegli la frase più adatta.",["We insist that every item be checked twice.","We insist that every item is check twice.","We insist every item to be checked twice."],"We insist that every item be checked twice.","Insist that + be."),
      O("word_order","Metti le parole in ordine e scrivi la frase: suggested / she / that / stay / we","She suggested that we stay",[],"Suggest that + forma base.")
    ]
  },
  cohesion:{
    train:[
      O("form","Scrivi solo la parola mancante: We tested three options. ___ of them worked well. (nessuna)","None",[],"None of them."),
      O("form","Scrivi solo la parola mancante: The first plan was cheap; the second ___ was faster. (sostituto di plan)","one",[],"One evita la ripetizione."),
      C("meaning","Scegli a che cosa si riferisce this in: Costs rose by 20%. This forced us to cut staff.",["l'aumento dei costi","il personale","il 20% del personale"],"l'aumento dei costi","This riprende tutta l'idea precedente."),
      C("meaning","Scegli che cosa esprime the former in: We visited Rome and Milan; the former was more crowded.",["Roma","Milano","entrambe"],"Roma","The former = il primo nominato."),
      C("tense_choice","Scegli la forma corretta: The report was late. ___ delay caused problems.",["This","These","Those"],"This","This + nome singolare per riprendere."),
      C("tense_choice","Scegli il connettivo corretto: The team worked hard. ___, the results were poor.",["Even so","As a result","For example"],"Even so","Even so = eppure."),
      C("use","Eviti di ripetere un nome nel rapporto. Scegli la frase più adatta.",["The officers searched the car and found weapons inside it.","The officers searched the car and found weapons inside the car of them.","The officers searched the car and found weapons inside him."],"The officers searched the car and found weapons inside it.","Pronome per evitare ripetizioni."),
      C("use","Colleghi due paragrafi in modo coeso. Scegli la frase più adatta.",["This approach, however, has some drawbacks.","This approach, however has, some drawbacks.","However this approach has, some drawbacks."],"This approach, however, has some drawbacks.","However tra virgole."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the latter / was / more useful","The latter was more useful",[],"The latter = il secondo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: such / are rare / cases","Such cases are rare",[],"Such + nome riprende quanto detto.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: I asked two colleagues, but ___ of them knew. (nessuno dei due)","neither",[],"Neither of them."),
      O("form","Scrivi solo la parola mancante: These shoes are too small. I need bigger ___.","ones",[],"Ones per il plurale."),
      C("meaning","Scegli a che cosa si riferisce it in: The plan was approved, but it was never applied.",["il piano","l'approvazione","il progetto futuro"],"il piano","Riferimento pronominale."),
      C("tense_choice","Segnala un contrasto con l’aspettativa che un test breve sia facile. Scegli il connettivo corretto: The test is short. ___, it is quite difficult.",["Nonetheless","Therefore","Moreover"],"Nonetheless","Contrasto."),
      C("use","Riprendi un'idea all'inizio della frase. Scegli la frase più adatta.",["These changes will take time.","This changes will take time.","These change will take time."],"These changes will take time.","These + plurale."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the former / cheaper / is","The former is cheaper",[],"The former.")
    ]
  },
  argument:{
    train:[
      O("form","Scrivi solo la parola mancante: ___ some people support the plan, others oppose it. (mentre)","While",["Whereas","Although"],"While = mentre (contrasto)."),
      O("form","Scrivi solo le parole mancanti: ___ , I believe the benefits are greater. (tutto sommato)","On balance",["All things considered","Overall"],"On balance = tutto sommato."),
      C("meaning","Scegli che funzione ha: Admittedly, the cost is high.",["ammette un punto contrario","conclude il testo","dà un esempio"],"ammette un punto contrario","Admittedly = bisogna ammettere."),
      C("meaning","Scegli che funzione ha: It could be argued that...",["presenta un'opinione con prudenza","dà un ordine","racconta un fatto passato"],"presenta un'opinione con prudenza","It could be argued that."),
      C("tense_choice","Scegli il connettivo corretto: ___ the high costs, the project is worthwhile.",["Despite","Although","However"],"Despite","Despite + nome."),
      C("tense_choice","Scegli il connettivo corretto: The plan is cheap. ___, it is easy to apply.",["What is more","Whereas","Despite"],"What is more","Aggiunta."),
      C("use","Introduci la tua tesi in un saggio. Scegli la frase più adatta.",["In my view, public transport should be free.","In my view, public transport should being free.","On my view, public transport should be free."],"In my view, public transport should be free.","In my view."),
      C("use","Rispondi a un'obiezione in modo argomentato. Scegli la frase più adatta.",["Although this is true, it ignores the long-term benefits.","Although this is true, but it ignores the long-term benefits.","Despite this is true, it ignores the long-term benefits."],"Although this is true, it ignores the long-term benefits.","Although senza but."),
      O("word_order","Metti le parole in ordine e scrivi la frase: argue / some people / that / it is too expensive","Some people argue that it is too expensive",[],"Argue that."),
      O("word_order","Metti le parole in ordine e scrivi la frase: on the whole / is positive / the situation","On the whole the situation is positive",["The situation is positive on the whole"],"On the whole = nel complesso.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: ___, the policy has worked well. (nel complesso)","Overall",[],"Overall."),
      O("form","Scrivi solo le parole mancanti: ___ , cars are convenient; on the other, they pollute. (da un lato)","On the one hand",[],"On the one hand ... on the other."),
      C("meaning","Scegli che funzione ha: Nevertheless, the risks remain.",["introduce un contrasto","dà un esempio","aggiunge una ragione simile"],"introduce un contrasto","Nevertheless."),
      C("tense_choice","Scegli il connettivo corretto: Cities are noisy, ___ villages are quiet.",["whereas","despite","therefore"],"whereas","Whereas = mentre."),
      C("use","Concludi un saggio. Scegli la frase più adatta.",["All things considered, the advantages outweigh the disadvantages.","All things considering, the advantages outweigh the disadvantages.","All thing considered, the advantages outweighs the disadvantages."],"All things considered, the advantages outweigh the disadvantages.","All things considered."),
      O("word_order","Metti le parole in ordine e scrivi la frase: it / argued / could be / that / the law is unfair","It could be argued that the law is unfair",[],"It could be argued that.")
    ]
  },
  mixed:{
    train:[
      O("form","Scrivi solo le parole mancanti: By the time we arrive, the film ___. (start, future perfect)","will have started",[],"Future perfect."),
      O("form","Scrivi solo le parole mancanti, al passivo: The suspect ___ at the moment. (question, present continuous)","is being questioned",[],"Passivo continuous."),
      C("meaning","Scegli che cosa significa: She must have forgotten the meeting.",["sono quasi certo che abbia dimenticato la riunione","deve dimenticare la riunione","ha dimenticato di proposito"],"sono quasi certo che abbia dimenticato la riunione","Deduzione sul passato."),
      C("meaning","Scegli che cosa significa: If I hadn't stopped, I would have hit the car.",["mi sono fermato e non ho colpito l'auto","non mi sono fermato e ho colpito l'auto","mi fermerò"],"mi sono fermato e non ho colpito l'auto","Terzo condizionale."),
      C("tense_choice","Scegli la forma corretta: She has been living here ___ 2015.",["since","for","from"],"since","Since + punto di inizio."),
      C("tense_choice","Scegli la forma corretta: He told me he ___ the job the week before.",["had started","has started","starts"],"had started","Discorso indiretto: backshift."),
      C("use","Nel rapporto unisci fatti e deduzioni. Scegli la frase corretta.",["The door had been forced, so the intruder must have used a tool.","The door has been forced yesterday, so the intruder must used a tool.","The door had forced, so the intruder must have use a tool."],"The door had been forced, so the intruder must have used a tool.","Passivo past perfect + deduzione."),
      C("use","Chiedi cortesemente un'informazione. Scegli la frase corretta.",["Could you tell me when the office opens?","Could you tell me when does the office open?","Could you tell me when opens the office?"],"Could you tell me when the office opens?","Domanda indiretta."),
      O("word_order","Metti le parole in ordine e scrivi la frase: been / have / we / for hours / waiting","We have been waiting for hours",[],"Present perfect continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had / I / known / if / I would have helped","If I had known I would have helped",["I would have helped if I had known"],"Terzo condizionale.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti: The road ___ last year. (build, passivo)","was built",[],"Passivo passato."),
      O("form","Scrivi solo le parole mancanti, con would: If I had more money, I ___ a new car. (buy)","would buy",[],"Secondo condizionale."),
      C("meaning","Scegli che cosa significa: He can't have seen us.",["è impossibile che ci abbia visto","non può vederci adesso","non vuole vederci"],"è impossibile che ci abbia visto","Can't have."),
      C("tense_choice","Scegli la forma corretta: I ___ here for five years by next June.",["will have worked","will work","work"],"will have worked","Future perfect."),
      C("use","Riferisci la domanda di un cliente. Scegli la frase corretta.",["She asked if the parcel had arrived.","She asked if had the parcel arrived.","She asked has the parcel arrived."],"She asked if the parcel had arrived.","Domanda riferita."),
      O("word_order","Metti le parole in ordine e scrivi la frase: was / when / I / the phone rang / cooking","I was cooking when the phone rang",[],"Past continuous + past simple.")
    ]
  },
  "advanced-comparatives":{
    train:[
      C("meaning","Scegli che cosa significa: It wasn't so much a mistake as a misunderstanding.",["era più un malinteso che un errore","era un errore grave e un malinteso","non era né un errore né un malinteso"],"era più un malinteso che un errore","Not so much X as Y."),
      C("meaning","Scegli che cosa significa: The new office is nowhere near as big as the old one.",["è molto più piccolo del vecchio","è grande più o meno uguale","è un po' più grande"],"è molto più piccolo del vecchio","Nowhere near as ... as = per niente."),
      C("tense_choice","Scegli la forma corretta: We had three times as ___ calls as yesterday.",["many","much","more"],"many","Many con nomi numerabili."),
      C("use","Nel rapporto confronti due dati senza ripetere il nome. Scegli la frase corretta.",["The crime rate in the north is higher than that in the south.","The crime rate in the north is higher than this of the south.","The crime rate in the north is higher than the south's one rate."],"The crime rate in the north is higher than that in the south.","That sostituisce un nome singolare."),
      C("use","Dici che una soluzione è valida quanto l'altra. Scegli la frase corretta.",["This solution is every bit as good as the other.","This solution is every bit good as the other.","This solution is every bits as good than the other."],"This solution is every bit as good as the other.","Every bit as ... as."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as / it's / a task / difficult / as I thought / not","It's not as difficult a task as I thought",[],"As + aggettivo + a + nome + as."),
      O("word_order","Metti le parole in ordine e scrivi la frase: those / the prices here / of last year / are higher than","The prices here are higher than those of last year",[],"Those sostituisce un nome plurale.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The results of this test are better than ___ of the previous one. (sostituto di results)","those",[],"Those per il plurale."),
      O("form","Scrivi solo la parola mancante: She earns twice as ___ money as I do.","much",[],"Much con nomi non numerabili."),
      C("meaning","Scegli che cosa significa: He's not nearly as experienced as his colleague.",["ha molta meno esperienza del collega","ha più esperienza del collega","ha la stessa esperienza"],"ha molta meno esperienza del collega","Not nearly as."),
      C("tense_choice","Scegli la forma corretta: It's not so much a question of money ___ of time.",["as","than","like"],"as","Not so much ... as."),
      C("use","Dici che il compito è difficile quanto ti aspettavi. Scegli la frase corretta.",["It was as hard a job as I expected.","It was as a hard job as I expected.","It was a as hard job as I expected."],"It was as hard a job as I expected.","As + aggettivo + a + nome."),
      O("word_order","Metti le parole in ordine e scrivi la frase: nowhere near / as / the sequel / is / good / as the original","The sequel is nowhere near as good as the original",[],"Nowhere near as.")
    ]
  },
  "advanced-present":{
    train:[
      C("meaning","Scegli che cosa significa: He's always leaving his keys at home!",["lo fa spesso e mi irrita","lo fa una sola volta","non lo fa mai"],"lo fa spesso e mi irrita","Always + continuous: abitudine fastidiosa."),
      C("meaning","Scegli che cosa significa il present simple in: Minister resigns over scandal.",["un titolo di giornale su un fatto recente","un'abitudine del ministro","un piano futuro"],"un titolo di giornale su un fatto recente","Nei titoli il present simple indica fatti recenti."),
      C("tense_choice","Scegli la forma corretta: I ___ you're right about the timetable.",["suppose","am supposing","supposing"],"suppose","Suppose è di stato."),
      C("use","Racconti la trama di un film in modo vivace. Scegli la frase più adatta.",["The detective enters the room and finds a letter.","The detective entered the room and is finding a letter.","The detective is enter the room and finds a letter."],"The detective enters the room and finds a letter.","Present simple nelle narrazioni e trame."),
      C("use","Ti lamenti di un collega che arriva sempre tardi. Scegli la frase più adatta.",["He's constantly arriving late for meetings.","He constantly is arrive late for meetings.","He's constantly arrived late for meetings."],"He's constantly arriving late for meetings.","Constantly + continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: being / you're / unusually quiet / today","You're being unusually quiet today",["Today you’re being unusually quiet"],"Be + being: comportamento temporaneo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: I / apologise / for the delay","I apologise for the delay",[],"Verbo performativo al present simple.")
    ],
    check:[
      O("form","Scrivi solo il verbo mancante al present simple: I ___ you to stay calm. (beg, verbo performativo)","beg",[],"Verbo performativo."),
      O("form","Scrivi solo le parole mancanti, con be + forever: He ___ complaining about the food!","is forever",[],"Forever + continuous: irritazione."),
      C("meaning","Scegli che cosa significa: The plane leaves at 6.40.",["è un orario programmato","l'aereo sta partendo adesso","l'aereo parte di solito presto"],"è un orario programmato","Present simple per orari."),
      C("tense_choice","Scegli la forma corretta: This fabric ___ very soft.",["feels","is feeling","feel"],"feels","Feel come stato (al tatto)."),
      C("use","Descrivi un comportamento temporaneo e insolito. Scegli la frase corretta.",["The children are being very good today.","The children are very good being today.","The children being very good today."],"The children are being very good today.","Are being: temporaneo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: hereby / I / the meeting / declare / open","I hereby declare the meeting open",[],"Present simple performativo.")
    ]
  },
  "advanced-past":{
    train:[
      C("meaning","Scegli che cosa significa: I was hoping you could help me.",["è una richiesta cortese di aiuto","speravo ma ora ho smesso","ho aiutato qualcuno"],"è una richiesta cortese di aiuto","Past continuous per cortesia."),
      C("meaning","Scegli che cosa significa: We had hoped to finish by noon.",["avevamo sperato di finire entro mezzogiorno","abbiamo finito a mezzogiorno","finiremo a mezzogiorno"],"avevamo sperato di finire entro mezzogiorno","Had hoped colloca la speranza prima di un momento passato. Spesso suggerisce una speranza delusa, ma senza altro contesto non dimostra che il lavoro non sia stato finito."),
      C("tense_choice","Scegli la forma corretta: She talks as if she ___ the boss.",["were","is being","would be"],"were","As if + past: irreale."),
      C("use","Chiedi un favore con molta cortesia. Scegli la frase più adatta.",["I was wondering whether you could check this.","I wondered whether you can check this yesterday.","I was wonder whether you could check this."],"I was wondering whether you could check this.","I was wondering."),
      C("use","Nel rapporto spieghi perché il collega era sporco di fango. Scegli la frase corretta.",["He was covered in mud because he had been searching the field.","He was covered in mud because he has been searching the field.","He was covered in mud because he searched the field since hours."],"He was covered in mud because he had been searching the field.","Past perfect continuous: causa visibile."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had meant / I / to call you","I had meant to call you",[],"Had meant to: intenzione non realizzata."),
      O("word_order","Metti le parole in ordine e scrivi la frase: always / she / was / forgetting / her password","She was always forgetting her password",[],"Always + past continuous.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti al past perfect: We ___ to see more people. (expect)","had expected",[],"Aspettativa non realizzata."),
      O("form","Scrivi solo le parole mancanti al past continuous: I ___ if you were free tonight. (wonder, richiesta cortese)","was wondering",[],"Past continuous di cortesia."),
      C("meaning","Scegli che cosa significa: It's time we were leaving.",["dovremmo andare adesso","siamo andati in orario","andremo domani"],"dovremmo andare adesso","It's time + past."),
      C("tense_choice","Scegli la forma corretta: When I got there, they ___ for an hour.",["had been arguing","have been arguing","argue"],"had been arguing","Durata prima di un momento passato."),
      C("use","Dici che avresti voluto vedere lo spettacolo. Scegli la frase corretta.",["I had wanted to see the show, but it was sold out.","I have wanted to see the show, but it was sold out.","I wanted see the show, but it was sold out."],"I had wanted to see the show, but it was sold out.","Desiderio passato non realizzato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as if / she / looked / she / had seen a ghost","She looked as if she had seen a ghost",[],"As if + past perfect.")
    ]
  },
  "advanced-will-would-should":{
    train:[
      C("meaning","Scegli che cosa significa: The door won't open.",["la porta si rifiuta di aprirsi, è bloccata","la porta si aprirà domani","la porta non deve essere aperta"],"la porta si rifiuta di aprirsi, è bloccata","Won't = rifiuto, anche per oggetti."),
      C("meaning","Scegli che cosa significa: That'll be the postman.",["sarà sicuramente il postino","il postino arriverà più tardi","il postino è stato qui"],"sarà sicuramente il postino","Will per una deduzione sul presente."),
      C("tense_choice","Scegli la forma corretta: When we were kids, we ___ play in the street for hours.",["would","will","should"],"would","Would: abitudine passata."),
      C("use","Rimproveri un collega per non averti avvisato. Scegli la frase corretta.",["You should have told me about the change.","You should told me about the change.","You should have tell me about the change."],"You should have told me about the change.","Should have + participio: rimprovero."),
      C("use","Esprimi un'opinione con tatto in una riunione. Scegli la frase più adatta.",["I would suggest that we wait a week.","I will suggest that we wait a week yesterday.","I would suggesting that we wait a week."],"I would suggest that we wait a week.","Would attenua."),
      O("word_order","Metti le parole in ordine e scrivi la frase: wouldn't / the car / this morning / start","The car wouldn't start this morning",["This morning the car wouldn't start"],"Wouldn't = rifiuto passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: should / you / any problems / have / call me","Should you have any problems call me",["Call me should you have any problems"],"Should + soggetto: condizionale formale.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, con should: The train ___ by now, but it's late. (arrive)","should have arrived",[],"Should have: aspettativa non realizzata."),
      O("form","Scrivi solo la parola mancante: He ___ keep interrupting me, which was annoying. (abitudine passata)","would",[],"Would: abitudine passata."),
      C("meaning","Scegli che cosa significa: You'll be tired after the trip.",["immagino che tu sia stanco","sarai stanco tra un anno","non devi essere stanco"],"immagino che tu sia stanco","Will: deduzione."),
      C("tense_choice","Vuoi attenuare la tua opinione. Scegli la forma corretta: I ___ think it will rain.",["would","will","should have"],"would","I would think: opinione attenuata."),
      C("use","Ti scusi per un errore tuo. Scegli la frase corretta.",["I shouldn't have sent that email.","I shouldn't sent that email.","I shouldn't have send that email."],"I shouldn't have sent that email.","Shouldn't have + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: will / she / at home / be / by now","She will be at home by now",[],"Will per deduzione.")
    ]
  },
  "advanced-ability-possibility":{
    train:[
      C("meaning","Scegli che cosa significa: We managed to catch the last train.",["ci siamo riusciti con difficoltà","eravamo capaci in generale","non l'abbiamo preso"],"ci siamo riusciti con difficoltà","Managed to: riuscire in un caso specifico."),
      C("meaning","Scegli che cosa significa: You might as well go home.",["tanto vale che tu vada a casa","devi andare a casa","forse sei andato a casa"],"tanto vale che tu vada a casa","Might as well."),
      C("tense_choice","Scegli la forma corretta: After hours of trying, he ___ fix the leak.",["was able to","could","can"],"was able to","Successo in un caso specifico: was able to."),
      C("use","Dici che non ti hanno permesso di entrare. Scegli la frase corretta.",["We weren't allowed to enter the building.","We weren't allow to enter the building.","We didn't allowed to enter the building."],"We weren't allowed to enter the building.","Be allowed to."),
      C("use","Esprimi una possibilità passata non realizzata. Scegli la frase corretta.",["You could have been injured.","You could be injured yesterday.","You could have be injured."],"You could have been injured.","Could have + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: be able to / will / we / finish on time","We will be able to finish on time",[],"Will be able to."),
      O("word_order","Metti le parole in ordine e scrivi la frase: succeeded in / she / the problem / solving","She succeeded in solving the problem",[],"Succeed in + -ing.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti: Despite the storm, the pilot ___ land safely. (riuscire, passato)","managed to",["was able to"],"Managed to / was able to."),
      O("form","Scrivi solo le parole mancanti, con could: She ___ a doctor, but she chose law. (become)","could have become",[],"Possibilità non realizzata."),
      C("meaning","Scegli che cosa significa: I couldn't help laughing.",["non sono riuscito a trattenere le risate","non mi hanno aiutato a ridere","non ho riso"],"non sono riuscito a trattenere le risate","Couldn't help + -ing."),
      C("tense_choice","Scegli la forma corretta: Visitors ___ to take photos inside.",["are not allowed","cannot allowed","are not allow"],"are not allowed","Be allowed to."),
      C("use","Dici che proverai ancora: forse funzionerà. Scegli la frase più adatta.",["It may well work this time.","It may good work this time.","It well may to work this time."],"It may well work this time.","May well = è ben possibile."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as well / might / we / take the bus","We might as well take the bus",[],"Might as well.")
    ]
  },
  "advanced-subjunctive":{
    train:[
      C("meaning","Scegli che cosa significa: The rules require that no one enter after 10 p.m.",["dopo le 22 nessuno deve entrare","dopo le 22 tutti entrano","nessuno è entrato dopo le 22"],"dopo le 22 nessuno deve entrare","Require that + forma base."),
      C("meaning","Scegli che cosa significa: Were I in your position, I'd accept.",["se fossi al tuo posto, accetterei","ero al tuo posto e ho accettato","sarò al tuo posto"],"se fossi al tuo posto, accetterei","Inversione con were = if I were."),
      C("tense_choice","Scegli la forma corretta (stile formale): It is crucial that the report ___ submitted today.",["be","is being","will"],"be","Forma base be."),
      C("use","Nel regolamento scrivi un obbligo in modo formale. Scegli la frase più adatta.",["It is required that all staff wear ID badges.","It is required that all staff wears ID badges.","It requires all staff wearing ID badges that."],"It is required that all staff wear ID badges.","Forma base dopo required that."),
      C("use","Nel verbale riporti la proposta del presidente. Scegli la frase più adatta.",["The chair proposed that the vote be delayed.","The chair proposed that the vote is delay.","The chair proposed the vote to delayed."],"The chair proposed that the vote be delayed.","Propose that + be + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: that / insisted / she / be paid / they","She insisted that they be paid",[],"Insist that + be + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: not / that / he / is vital / be told / it","It is vital that he not be told",[],"Congiuntivo negativo: not + be.")
    ],
    check:[
      O("form","Scrivi solo il verbo mancante, al congiuntivo: The manager demanded that he ___ immediately. (apologise)","apologise",["apologize"],"Forma base."),
      O("form","Scrivi solo il verbo mancante, al congiuntivo: It is advisable that each guest ___ a ticket. (book)","book",[],"Forma base senza -s."),
      C("meaning","Scegli che cosa significa: God save the King.",["è un augurio formale","racconta un fatto passato","è una domanda"],"è un augurio formale","Congiuntivo in espressioni fisse."),
      C("tense_choice","Scegli la forma corretta (stile formale): We ask that passengers ___ their seatbelts fastened.",["keep","keeps","kept"],"keep","Ask that + forma base."),
      C("use","Raccomandi formalmente di non usare l'ascensore. Scegli la frase più adatta.",["It is recommended that the lift not be used.","It is recommended that the lift is not use.","It is recommended the lift not to be use."],"It is recommended that the lift not be used.","Not + be + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: were / I / richer / would travel more / I","Were I richer I would travel more",["I would travel more were I richer"],"Inversione con were.")
    ]
  },
  "advanced-perfect":{
    train:[
      C("meaning","Scegli che cosa significa: I've been reading your report.",["ho dedicato tempo alla lettura, senza precisare se ho finito","la lettura è sicuramente completa","inizierò a leggere in futuro"],"ho dedicato tempo alla lettura, senza precisare se ho finito","Il continuous mette in evidenza l’attività recente. Da solo non afferma né esclude che il rapporto sia stato letto fino alla fine."),
      C("meaning","Scegli che cosa significa: I've read your report.",["l'ho letto tutto","ci sto lavorando","non l'ho ancora letto"],"l'ho letto tutto","Simple: risultato completo."),
      C("tense_choice","Scegli la forma corretta: This is the third time she ___ late this week.",["has been","is","was being"],"has been","This is the first/second time + present perfect."),
      C("use","Comunichi un risultato parziale. Scegli la frase corretta.",["We have interviewed twelve witnesses so far.","We have been interviewed twelve witnesses so far.","We interviewed twelve witnesses so far since."],"We have interviewed twelve witnesses so far.","So far + present perfect simple con un numero."),
      C("use","Spieghi perché sei senza fiato. Scegli la frase corretta.",["Sorry, I've been running.","Sorry, I've run since an hour.","Sorry, I'm running since ten minutes."],"Sorry, I've been running.","Present perfect continuous: effetto visibile."),
      O("word_order","Metti le parole in ordine e scrivi la frase: the first time / it's / I've / been here","It's the first time I've been here",[],"It's the first time + present perfect."),
      O("word_order","Metti le parole in ordine e scrivi la frase: as soon as / I'll call you / have finished / I","I'll call you as soon as I have finished",["As soon as I have finished I'll call you"],"Present perfect per il futuro dopo as soon as.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti al present perfect continuous: She ___ English for three years. (study)","has been studying",[],"Durata fino ad ora."),
      O("form","Scrivi solo le parole mancanti al present perfect: It's the second time I ___ this film. (see)","have seen",[],"It's the second time + present perfect."),
      C("meaning","Scegli che cosa significa: By then he'll have been working here for a decade.",["a quel punto lavorerà qui da dieci anni","ha lavorato qui dieci anni fa","inizierà a lavorare tra dieci anni"],"a quel punto lavorerà qui da dieci anni","Future perfect continuous."),
      C("tense_choice","Tutte e tre le email sono già complete e inviate: indica il risultato. Scegli la forma corretta: I ___ three emails this morning (ed è ancora mattina).",["have written","have been writing","wrote yesterday"],"have written","Periodo non concluso, numero: simple."),
      C("use","Dici che aspetterai finché il collega non avrà finito. Scegli la frase corretta.",["I'll wait until you have finished.","I'll wait until you will have finished.","I'll wait until you finished tomorrow."],"I'll wait until you have finished.","Until + present perfect."),
      O("word_order","Metti le parole in ordine e scrivi la frase: has been / it / raining / all morning","It has been raining all morning",[],"Present perfect continuous.")
    ]
  },
  "advanced-participles":{
    train:[
      C("meaning","Scegli che cosa significa: Having been warned, they stayed indoors.",["erano stati avvisati e quindi sono rimasti dentro","hanno avvisato gli altri di restare dentro","resteranno dentro"],"erano stati avvisati e quindi sono rimasti dentro","Having been + participio: passivo anteriore."),
      C("meaning","Scegli che cosa significa: With the power cut off, we used torches.",["poiché la corrente era staccata, abbiamo usato le torce","abbiamo staccato la corrente con le torce","avevamo corrente e torce"],"poiché la corrente era staccata, abbiamo usato le torce","With + nome + participio."),
      C("tense_choice","Scegli la forma corretta: The bridge collapsed, ___ the town in two.",["cutting","cut","having been cut"],"cutting","Participio presente: conseguenza."),
      C("use","Nel rapporto unisci due azioni in sequenza. Scegli la frase corretta.",["Having secured the area, the officers called for backup.","Having secured the area, backup was called by the officers.","Secured the area, the officers called for backup."],"Having secured the area, the officers called for backup.","Stesso soggetto."),
      C("use","Descrivi le circostanze in modo formale. Scegli la frase corretta.",["With the roads blocked, the convoy took a detour.","With the roads blocking, the convoy took a detour.","With blocked the roads, the convoy took a detour."],"With the roads blocked, the convoy took a detour.","With + nome + participio passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: been / having / told / she / left","Having been told she left",["She left having been told"],"Having been + participio."),
      O("word_order","Metti le parole in ordine e scrivi la frase: with / we / time / running out / hurried","With time running out we hurried",["We hurried with time running out"],"With + nome + -ing.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti, con il participio perfetto passivo: ___ twice, he refused to try again. (reject)","Having been rejected",[],"Having been + participio."),
      O("form","Scrivi solo la parola mancante: With everyone ___, the meeting began. (seat)","seated",[],"With + nome + participio."),
      C("meaning","Scegli che cosa significa: The storm hit the coast, causing floods.",["la tempesta ha colpito la costa e ha causato alluvioni","le alluvioni hanno causato la tempesta","la tempesta ha evitato le alluvioni"],"la tempesta ha colpito la costa e ha causato alluvioni","-ing: conseguenza."),
      C("tense_choice","Scegli la forma corretta: ___ in 1900, the building needs repairs.",["Built","Building","Having building"],"Built","Valore passivo."),
      C("use","Correggi il participio mal collegato. Scegli la frase corretta.",["Walking home, I was caught in the rain.","Walking home, the rain caught me.","Walking home, it started to rain on me."],"Walking home, I was caught in the rain.","Il soggetto deve essere chi cammina."),
      O("word_order","Metti le parole in ordine e scrivi la frase: with / his arms / folded / he waited","With his arms folded he waited",["He waited with his arms folded"],"With + nome + participio.")
    ]
  },
  "advanced-word-order":{
    train:[
      C("meaning","Scegli che cosa significa: Strange though it may seem, it's true.",["per quanto possa sembrare strano, è vero","sembra strano quindi non è vero","è strano e falso"],"per quanto possa sembrare strano, è vero","Aggettivo + though."),
      C("meaning","Scegli che cosa mette in evidenza: That I can't accept.",["la cosa che non posso accettare","chi non accetta","il tempo dell'accettazione"],"la cosa che non posso accettare","Fronting: l'oggetto va all'inizio."),
      C("tense_choice","Scegli la forma corretta: Down the hill ___ .",["rolled the ball","the ball rolled it","did roll the ball"],"rolled the ball","Inversione dopo luogo/direzione."),
      C("use","Usa l’inversione completa: il verbo deve precedere il soggetto nominale. Descrivi una scena in modo letterario. Scegli la frase corretta.",["Into the room walked a tall man.","Into the room a tall man did walk.","Into the room walked he."],"Into the room walked a tall man.","Inversione con soggetto nome, non pronome."),
      C("use","Annunci l'arrivo dell'autobus. Scegli la frase corretta.",["Here comes the bus.","Here the bus comes it.","Here does come the bus."],"Here comes the bus.","Here + verbo + nome."),
      O("word_order","Metti le parole in ordine e scrivi la frase: there / she / goes","There she goes",[],"Con pronome: there + pronome + verbo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: try as / we might / we couldn't open it","Try as we might we couldn't open it",["We couldn’t open it try as we might"],"Try as we might = per quanto provassimo.")
    ],
    check:[
      O("form","Scrivi solo il verbo mancante al past simple: On the table ___ a letter. (lie)","lay",[],"Inversione dopo luogo: lie → lay."),
      O("form","Scrivi solo la parola mancante: Much ___ I admire him, I disagree. (sebbene)","as",["though"],"Much as = per quanto."),
      C("meaning","Scegli che cosa significa: Here they are.",["eccoli","ci sono qui da tempo","sono andati via"],"eccoli","Here + pronome + verbo."),
      C("tense_choice","Scegli la forma corretta: Out ___ .",["ran the children","the children did run","ran they"],"ran the children","Inversione con soggetto nome."),
      C("use","Sottolinei la stanchezza in modo letterario. Scegli la frase corretta.",["Exhausted as he was, he kept walking.","As exhausted he was, he kept walking.","Exhausted as was he, he kept walking."],"Exhausted as he was, he kept walking.","Aggettivo + as + soggetto + verbo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: on the corner / a small café / stood","On the corner stood a small café",["A small café stood on the corner"],"Inversione dopo luogo.")
    ]
  },
  "advanced-prepositions":{
    train:[
      C("meaning","Scegli che cosa significa: Who were you talking to?",["con chi parlavi?","chi ti parlava?","di chi parlavi?"],"con chi parlavi?","Preposizione in fondo: stile neutro."),
      C("meaning","Scegli che cosa significa: In view of the weather, the match was cancelled.",["considerato il tempo, la partita è stata annullata","nonostante il tempo, si è giocato","vista dal campo, la partita è finita"],"considerato il tempo, la partita è stata annullata","In view of = considerato."),
      C("tense_choice","Scegli la forma più formale: The person ___ I spoke was helpful.",["to whom","who to","whom"],"to whom","Preposizione + whom: formale."),
      C("use","Nel rapporto scrivi una frase relativa formale. Scegli la frase più adatta.",["The officer with whom I worked has retired.","The officer with who I worked with has retired.","The officer whom I worked with him has retired."],"The officer with whom I worked has retired.","With whom."),
      C("use","Spieghi lo scopo di una modifica in modo formale. Scegli la frase più adatta.",["We changed the rota with a view to improving coverage.","We changed the rota with a view to improve coverage.","We changed the rota in view of improve coverage."],"We changed the rota with a view to improving coverage.","With a view to + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: what / for / is / this tool","What is this tool for",[],"Preposizione in fondo alla domanda."),
      O("word_order","Metti le parole in ordine e scrivi la frase: on which / the evidence / we rely / is weak","The evidence on which we rely is weak",[],"Preposizione + which.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: The issue was finally dealt ___ last week.","with",[],"Deal with."),
      O("form","Scrivi solo la parola mancante: For ___ is this parcel? (who/whom)","whom",[],"Preposizione + whom."),
      C("meaning","Scegli che cosa significa: This is something we need to look into.",["è una cosa da esaminare","è una cosa dentro cui guardare fisicamente","è una cosa già risolta"],"è una cosa da esaminare","Look into = indagare."),
      C("tense_choice","Scegli la forma corretta: The house ___ she grew up has been sold.",["in which","which","in that"],"in which","Preposizione + which."),
      C("use","Correggi la ripetizione della preposizione. Scegli la frase corretta.",["This is the file I was looking for.","This is the file I was looking for it.","This is the file for which I was looking for."],"This is the file I was looking for.","Niente pronome o preposizione doppia."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: are / about / what / you / worried","What are you worried about",[],"Preposizione in fondo.")
    ]
  },
  "advanced-agreement":{
    train:[
      C("meaning","Scegli quale frase indica il numero totale.",["The number of applicants is rising.","A number of applicants are rising.","A number of applicants is rising."],"The number of applicants is rising.","The number of + singolare."),
      C("meaning","Scegli che cosa significa: A number of officers were present.",["erano presenti diversi agenti","il numero di agenti era preciso","nessun agente era presente"],"erano presenti diversi agenti","A number of = diversi, plurale."),
      C("tense_choice","Scegli la forma corretta: Neither the manager nor the staff members ___ aware of the problem.",["were","was","be"],"were","Con neither ... nor si usa qui la concordanza con il soggetto più vicino, staff members, esplicitamente plurale. Staff da solo può invece avere concordanza singolare o plurale."),
      C("use","Nel rapporto parli della squadra come gruppo di persone. Scegli la frase corretta.",["The police have arrested two men.","The police has arrested two men.","The police is arresting two men yesterday."],"The police have arrested two men.","Police è sempre plurale."),
      C("use","Descrivi l'attrezzatura in magazzino. Scegli la frase corretta.",["The equipment is stored in the basement.","The equipments are stored in the basement.","The equipment are stored in the basement."],"The equipment is stored in the basement.","Equipment non numerabile."),
      O("word_order","Metti le parole in ordine e scrivi la frase: is / every one of / the rooms / occupied","Every one of the rooms is occupied",[],"Every one of + singolare."),
      O("word_order","Metti le parole in ordine e scrivi la frase: was / the news / surprising","The news was surprising",[],"News: singolare.")
    ],
    check:[
      O("form","Scrivi solo la parola mancante: Either the driver or the passengers ___ responsible. (is/are)","are",[],"Concorda con il più vicino."),
      O("form","Scrivi solo la parola mancante: Ten kilometres ___ a long way to walk. (is/are)","is",[],"Quantità come unità: singolare."),
      C("meaning","Scegli che cosa significa: Each of the suspects has an alibi.",["ogni sospettato ha un proprio alibi","i sospettati hanno un solo alibi in comune","nessun sospettato ha un alibi"],"ogni sospettato ha un proprio alibi","Each of + singolare: uno per uno."),
      C("tense_choice","Scegli la forma corretta: The information you sent ___ very useful.",["was","were","are"],"was","Information: non numerabile."),
      C("use","Parli dei consigli ricevuti. Scegli la frase corretta.",["The advice they gave us was excellent.","The advices they gave us were excellent.","The advice they gave us were excellent."],"The advice they gave us was excellent.","Advice: non numerabile."),
      O("word_order","Metti le parole in ordine e scrivi la frase: are / my trousers / too long","My trousers are too long",[],"Trousers: plurale.")
    ]
  },
  "review-perspective":{
    train:[
      C("meaning","Scegli che cosa significa: This time next week we'll be lying on a beach.",["la prossima settimana saremo in spiaggia in quel momento","siamo stati in spiaggia","andremo in spiaggia tra un mese"],"la prossima settimana saremo in spiaggia in quel momento","Future continuous."),
      C("meaning","Scegli che cosa significa: He is said to have been working there for years.",["si dice che lavori lì da anni","ha detto che lavorerà lì","lavorava lì anni fa e ha smesso"],"si dice che lavori lì da anni","Infinito perfect continuous."),
      C("tense_choice","Scegli la forma corretta: By the time you read this, I ___ .",["will have left","will leave","leave"],"will have left","Future perfect."),
      C("use","Nel rapporto riferisci una promessa del sospettato. Scegli la frase corretta.",["He promised that he would return the documents.","He promised that he will returned the documents.","He promised that he returns the documents yesterday."],"He promised that he would return the documents.","Would nel discorso indiretto."),
      C("use","Pianifichi una scadenza con una durata. Scegli la frase corretta.",["By June we'll have been working on this for a year.","By June we'll be work on this for a year.","By June we have been working on this for a year."],"By June we'll have been working on this for a year.","Future perfect continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: will / we / have finished / by noon","We will have finished by noon",["By noon we will have finished"],"Future perfect."),
      O("word_order","Metti le parole in ordine e scrivi la frase: once / I've / the data / checked / I'll send it","Once I've checked the data I'll send it",["I'll send it once I've checked the data"],"Present perfect dopo once.")
    ],
    check:[
      O("form","Scrivi solo le parole mancanti al future continuous: Don't call at nine; I ___ . (drive)","will be driving",[],"In corso alle nove."),
      O("form","Scrivi solo le parole mancanti, con l'infinito perfetto: The thieves are believed ___ the country. (leave)","to have left",[],"Infinito perfect."),
      C("meaning","Scegli che cosa significa: She said she would have finished by Friday.",["ha detto che avrebbe finito entro venerdì","ha finito venerdì scorso","finisce ogni venerdì"],"ha detto che avrebbe finito entro venerdì","Future perfect nel passato."),
      C("tense_choice","Scegli la forma corretta: When you ___ the form, give it to reception.",["have completed","will have completed","completed tomorrow"],"have completed","Present perfect dopo when per il futuro."),
      C("use","Indichi una durata fino a un momento futuro. Scegli la frase corretta.",["By 2030 she will have been teaching for twenty years.","By 2030 she will be teach for twenty years.","By 2030 she has been teaching for twenty years."],"By 2030 she will have been teaching for twenty years.","Future perfect continuous."),
      O("word_order","Metti le parole in ordine e scrivi la frase: be meeting / will / the director / we / at ten","We will be meeting the director at ten",["At ten we will be meeting the director"],"Future continuous.")
    ]
  },
  "present-simple":{
    train:[
      C("tense_choice","Scegli la forma corretta: My brother ___ in a bank.",["works","is work","work"],"works","Lavoro stabile: present simple con -s."),
      C("tense_choice","Scegli la forma corretta: How often ___ you check your email?",["do","are","does"],"do","Domanda di frequenza: do + soggetto."),
      C("use","Ti presenti in un'email di lavoro. Scegli la frase corretta.",["I work in the logistics office and I deal with transport.","I am work in the logistics office and I dealing with transport.","I works in the logistics office and I deals with transport."],"I work in the logistics office and I deal with transport.","Routine e lavoro: present simple."),
      C("use","Descrivi l'orario dell'ufficio a un visitatore. Scegli la frase corretta.",["The office opens at eight and closes at four.","The office is opening at eight and is closing at four every day.","The office open at eight and close at four."],"The office opens at eight and closes at four.","Orari fissi: present simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: usually / she / by train / travels","She usually travels by train",["Usually she travels by train"],"Avverbio di frequenza prima del verbo."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: does / where / your sister / live","Where does your sister live",[],"Wh- + does + soggetto + verbo base.")
    ]
  },
  "present-continuous":{
    train:[
      C("tense_choice","Scegli la forma corretta: Look! The bus ___.",["is coming","comes","come"],"is coming","Azione in corso adesso."),
      C("tense_choice","È un’attività temporanea in corso questa settimana. Scegli la forma corretta: This week I ___ from home.",["am working","work every week","worked"],"am working","Situazione temporanea."),
      C("use","Al telefono spieghi che cosa stai facendo. Scegli la frase corretta.",["I'm driving, so I'll call you back later.","I drive, so I'll call you back later.","I'm drive, so I'll call you back later."],"I'm driving, so I'll call you back later.","In corso mentre parli."),
      C("use","Descrivi un cambiamento in corso. Scegli la frase corretta.",["Prices are rising quickly this year.","Prices rise quickly this year now.","Prices are rise quickly this year."],"Prices are rising quickly this year.","Tendenza in corso."),
      O("word_order","Metti le parole in ordine e scrivi la frase: are / at the moment / we / waiting","We are waiting at the moment",["At the moment we are waiting"],"Be + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: you / what / doing / are","What are you doing",[],"Wh- + be + soggetto + -ing.")
    ]
  },
  "past-simple":{
    train:[
      C("tense_choice","Scegli la forma corretta: We ___ the suspect two days ago.",["arrested","have arrested","arrest"],"arrested","Ago: past simple."),
      C("tense_choice","Scegli la forma corretta: ___ you see the match last night?",["Did","Have","Were"],"Did","Domanda al passato: did + verbo base."),
      C("use","Racconti il tuo weekend. Scegli la frase corretta.",["On Saturday I went to the lake and we had lunch there.","On Saturday I have gone to the lake and we have had lunch there.","On Saturday I go to the lake and we had lunch there yesterday."],"On Saturday I went to the lake and we had lunch there.","Tempo finito: past simple."),
      C("use","Nel rapporto indichi quando è arrivata la pattuglia. Scegli la frase corretta.",["The patrol arrived at 22:15.","The patrol has arrived at 22:15.","The patrol arrive at 22:15."],"The patrol arrived at 22:15.","Orario preciso: past simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: didn't / I / the message / receive","I didn't receive the message",[],"Didn't + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: did / when / they / leave","When did they leave",[],"Wh- + did + soggetto + verbo base.")
    ]
  },
  "past-continuous":{
    train:[
      C("tense_choice","La cena era già in corso al momento della telefonata: descrivi lo sfondo. Scegli la forma corretta: I ___ dinner when you called.",["was having","had","have had"],"was having","Azione in corso interrotta."),
      C("tense_choice","Lo spegnimento delle luci è un singolo evento concluso durante la lettura. Scegli la forma corretta: While she was reading, the lights ___ out.",["went","were going","go"],"went","Azione breve che interrompe: past simple."),
      C("use","Il testimone descrive la scena. Scegli la frase corretta.",["Two men were standing near the car when the alarm went off.","Two men stood near the car when the alarm was going off suddenly.","Two men were stand near the car when the alarm went off."],"Two men were standing near the car when the alarm went off.","Sfondo continuous, evento simple."),
      C("use","Ti scusi con un collega: non hai sentito il campanello. Scegli la frase corretta.",["Sorry, I was having a shower.","Sorry, I had a shower since.","Sorry, I was have a shower."],"Sorry, I was having a shower.","In corso in quel momento."),
      O("word_order","Metti le parole in ordine e scrivi la frase: was raining / it / when we left","It was raining when we left",["When we left it was raining"],"Sfondo + evento."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: you / at ten / were / what / doing","What were you doing at ten",[],"Wh- + was/were + soggetto + -ing.")
    ]
  },
  ability:{
    train:[
      C("tense_choice","Scegli la forma corretta: When I was five, I ___ swim.",["could","can","am able"],"could","Abilità generale passata: could."),
      C("tense_choice","Scegli la forma corretta: I'm sorry, I ___ come to the meeting tomorrow.",["can't","couldn't yesterday","not can"],"can't","Impossibilità futura vicina: can't."),
      C("use","Chiedi cortesemente aiuto a un collega. Scegli la frase più adatta.",["Could you help me with this form?","Can you to help me with this form?","Could you helping me with this form?"],"Could you help me with this form?","Could: richiesta cortese."),
      C("use","Nel curriculum descrivi le tue competenze. Scegli la frase corretta.",["I can speak English and French fluently.","I can to speak English and French fluently.","I can speaking English and French fluently."],"I can speak English and French fluently.","Can + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: be able to / I / won't / attend","I won't be able to attend",[],"Futuro: will be able to."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: you / drive / can / a truck","Can you drive a truck",[],"Can + soggetto + verbo base.")
    ]
  },
  obligation:{
    train:[
      C("tense_choice","Scegli la forma corretta: You ___ pay; the museum is free.",["don't have to","mustn't","haven't"],"don't have to","Non è necessario: don't have to."),
      C("tense_choice","Scegli la forma corretta: Yesterday I ___ work late.",["had to","must","have to"],"had to","Obbligo passato: had to."),
      C("use","Nel regolamento esprimi un divieto. Scegli la frase corretta.",["Visitors mustn't enter this area.","Visitors don't have to enter this area.","Visitors mustn't to enter this area."],"Visitors mustn't enter this area.","Divieto: mustn't."),
      C("use","Consigli un collega con tatto. Scegli la frase più adatta.",["You should talk to the manager.","You must to talk to the manager.","You should talking to the manager."],"You should talk to the manager.","Consiglio: should."),
      O("word_order","Metti le parole in ordine e scrivi la frase: have to / we / wear / a uniform","We have to wear a uniform",[],"Have to + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: I / do / have to / sign here","Do I have to sign here",[],"Do + soggetto + have to.")
    ]
  },
  "present-perfect-simple":{
    train:[
      C("tense_choice","Scegli la forma corretta: I ___ that film. Is it good?",["haven't seen","didn't see yesterday","don't see"],"haven't seen","Esperienza fino ad ora."),
      C("tense_choice","Scegli la forma corretta: She ___ here since 2020.",["has worked","works","worked"],"has worked","Since: present perfect."),
      C("use","Comunichi un risultato al responsabile. Scegli la frase corretta.",["We've finished the inventory; you can check it now.","We finished the inventory since; you can check it now.","We've finish the inventory; you can check it now."],"We've finished the inventory; you can check it now.","Risultato con effetto presente."),
      C("use","Chiedi a un collega se ha già mandato il rapporto. Scegli la frase corretta.",["Have you sent the report yet?","Did you sent the report yet?","Have you send the report yet?"],"Have you sent the report yet?","Yet nelle domande."),
      O("word_order","Metti le parole in ordine e scrivi la frase: just / has / the train / left","The train has just left",[],"Just tra has e participio."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: ever / you / been / have / to London","Have you ever been to London",[],"Ever + present perfect.")
    ]
  },
  "present-perfect-continuous":{
    train:[
      C("tense_choice","Scegli la forma corretta: How long ___ you been waiting?",["have","are","did"],"have","How long + have + been + -ing."),
      C("tense_choice","Scegli la forma corretta: Your eyes are red. ___ you been crying?",["Have","Are","Did"],"Have","Effetto visibile di un'attività recente."),
      C("use","Spieghi da quanto tempo studi inglese. Scegli la frase corretta.",["I've been studying English for two years.","I'm studying English since two years.","I study English for two years."],"I've been studying English for two years.","Durata fino ad ora: present perfect continuous."),
      C("use","Spieghi perché la strada è bagnata. Scegli la frase corretta.",["It's been raining all night.","It's raining all night since.","It rained all night now."],"It's been raining all night.","Attività recente con effetto."),
      O("word_order","Metti le parole in ordine e scrivi la frase: have been / we / since nine / working","We have been working since nine",["Since nine we have been working"],"Since + punto di inizio."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: long / how / she / has / been / living here","How long has she been living here",[],"How long + has + been + -ing.")
    ]
  },
  "past-perfect-simple":{
    train:[
      C("tense_choice","Scegli la forma corretta: When we got to the station, the train ___.",["had already left","already left now","has already left"],"had already left","Prima di un altro momento passato."),
      C("tense_choice","Scegli la forma corretta: I ___ him before, so I didn't recognise him.",["had never met","have never met","never meet"],"had never met","Esperienza prima di un momento passato."),
      C("use","Nel rapporto chiarisci la sequenza. Scegli la frase corretta.",["The thief had escaped before the officers arrived.","The thief has escaped before the officers arrived.","The thief had escape before the officers arrived."],"The thief had escaped before the officers arrived.","Past perfect + past simple."),
      C("use","Racconti perché eri nervoso al primo volo. Scegli la frase corretta.",["I was nervous because I had never flown before.","I was nervous because I never flew before.","I was nervous because I have never flown before."],"I was nervous because I had never flown before.","Esperienza precedente."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had / she / the door / locked / already","She had already locked the door",[],"Already tra had e participio."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: had / before / you / met / her","Had you met her before",[],"Had + soggetto + participio.")
    ]
  },
  "past-perfect-continuous":{
    train:[
      C("tense_choice","Scegli la forma corretta: They ___ for hours when help arrived.",["had been walking","have been walking","walk"],"had been walking","Durata prima di un momento passato."),
      C("tense_choice","Scegli la forma corretta: He was out of breath because he ___.",["had been running","has been running","runs"],"had been running","Causa di uno stato passato."),
      C("use","Nel rapporto descrivi da quanto tempo il sospettato osservava l'edificio. Scegli la frase corretta.",["The suspect had been watching the building for two days.","The suspect has been watching the building for two days last week.","The suspect had been watch the building for two days."],"The suspect had been watching the building for two days.","Durata nel passato."),
      C("use","Spieghi perché il prato era bagnato quella mattina. Scegli la frase corretta.",["The grass was wet because it had been raining.","The grass was wet because it has been raining.","The grass was wet because it had been rain."],"The grass was wet because it had been raining.","Causa visibile nel passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: had been / waiting / she / for an hour","She had been waiting for an hour",[],"Had been + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: long / how / had / you / been working there","How long had you been working there",[],"How long + had + been + -ing.")
    ]
  },
  "future-will":{
    train:[
      C("tense_choice","Il telefono squilla adesso. Scegli la forma corretta: I ___ answer it.",["'ll","answered","have answered"],"'ll","Decisione presa sul momento: will."),
      C("tense_choice","Scegli la forma corretta: I think it ___ rain tomorrow.",["will","is","does"],"will","Previsione basata su opinione: will."),
      C("use","Ti offri di aiutare un collega con le borse. Scegli la frase corretta.",["I'll carry that for you.","I carry that for you tomorrow.","I'm carrying that for you every day."],"I'll carry that for you.","Offerta spontanea: will."),
      C("use","Prometti di mandare un documento. Scegli la frase corretta.",["I'll send you the file tonight, I promise.","I send you the file tonight, I promise.","I'll sending you the file tonight, I promise."],"I'll send you the file tonight, I promise.","Promessa: will."),
      O("word_order","Metti le parole in ordine e scrivi la frase: won't / probably / she / come","She probably won't come",["Probably she won’t come"],"Probably prima di won't."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: you / will / help me","Will you help me",[],"Will + soggetto + verbo base.")
    ]
  },
  "future-going-to":{
    train:[
      C("tense_choice","Guarda quelle nuvole! Scegli la forma corretta: It ___ rain.",["is going to","rained","has rained"],"is going to","Previsione basata su prove: going to."),
      C("tense_choice","Hai già deciso. Scegli la forma corretta: I ___ buy a new car next year.",["am going to","will decide to","buy"],"am going to","Intenzione già decisa."),
      C("use","Hai deciso di visitare la Scozia in agosto; il viaggio deve ancora avvenire. Scegli il messaggio che comunica questa intenzione.",["We're going to visit Scotland in August.", "We visited Scotland last August.", "We aren't going to visit Scotland in August."],"We're going to visit Scotland in August.","Going to comunica un'intenzione futura. Le altre frasi descrivono un viaggio passato oppure negano il progetto."),
      C("use","Una scatola sta scivolando verso il bordo. Scegli l'avviso che prevede una caduta imminente.",["Careful! That box is going to fall.", "That box fell a moment ago.", "That box has already fallen."],"Careful! That box is going to fall.","La caduta non è ancora avvenuta: going to collega la previsione all'indizio visibile. Le altre frasi la presentano come già avvenuta."),
      O("word_order","Metti le parole in ordine e scrivi la frase: not / going to / we're / wait","We're not going to wait",[],"Negativa di going to."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: going to / are / what / you / do","What are you going to do",[],"Wh- + be + soggetto + going to.")
    ]
  },
  "future-arrangements":{
    train:[
      C("tense_choice","È già in agenda. Scegli la forma corretta: I ___ the dentist on Friday.",["am seeing","saw","have seen"],"am seeing","Appuntamento fissato: present continuous."),
      C("tense_choice","Scegli la forma corretta: The train ___ at 7.15 tomorrow.",["leaves","left","has left"],"leaves","Orario ufficiale: present simple."),
      C("use","Hai già organizzato di incontrare tua sorella stasera. Scegli il messaggio che rifiuta l'invito per questo impegno.",["Sorry, I'm meeting my sister tonight.", "I met my sister last night, so I'm free tonight.", "I haven't made any plans for tonight."],"Sorry, I'm meeting my sister tonight.","Il present continuous comunica l'impegno fissato. Le altre frasi indicano un incontro passato oppure assenza di programmi."),
      C("use","Comunichi l'orario del corso. Scegli la frase corretta.",["The course starts on 3 March.","The course is start on 3 March.","The course starting on 3 March."],"The course starts on 3 March.","Calendario: present simple."),
      O("word_order","Metti le parole in ordine e scrivi la frase: flying / we're / on Monday / to Paris","We're flying to Paris on Monday",["On Monday we're flying to Paris"],"Present continuous per accordi."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: you / are / tonight / doing / what","What are you doing tonight",[],"Domanda sui piani.")
    ]
  },
  "future-continuous":{
    train:[
      C("tense_choice","Scegli la forma corretta: At 10 tomorrow I ___ in a meeting.",["will be sitting","sat","have sat"],"will be sitting","In corso a un momento futuro."),
      C("tense_choice","Scegli la forma corretta: ___ you be using the car tonight?",["Will","Are","Do"],"Will","Domanda cortese sui piani."),
      C("use","Domani viaggerai dalle 13 alle 18. Scegli il messaggio che spiega perché alle 15 non potrai rispondere.",["I'll be travelling at three tomorrow.", "I'll have finished travelling by three tomorrow.", "I finished travelling at three yesterday."],"I'll be travelling at three tomorrow.","Alle 15 il viaggio sarà in corso. Will have finished lo presenta come già concluso; finished yesterday riguarda ieri."),
      C("use","Chiedi se passare dall'ufficio postale fa già parte del programma del collega, senza chiedergli di cambiare percorso. Scegli la domanda più adatta.",["Will you be going past the post office later?", "Could you go to the post office for me?", "Did you go past the post office earlier?"],"Will you be going past the post office later?","La prima domanda riguarda un programma futuro; could you go chiede di fare una commissione, did you go riguarda il passato."),
      O("word_order","Metti le parole in ordine e scrivi la frase: will / working / be / I / late tonight","I will be working late tonight",["Late tonight I will be working"],"Will be + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: this time next week / be / we'll / on holiday","This time next week we'll be on holiday",["We'll be on holiday this time next week"],"This time next week.")
    ]
  },
  "future-perfect-simple":{
    train:[
      C("tense_choice","Scegli la forma corretta: By the time you arrive, we ___ dinner.",["will have finished","finished","had finished"],"will have finished","Completato prima di un momento futuro."),
      C("tense_choice","Scegli la forma corretta: ___ you have finished by six?",["Will","Do","Are"],"Will","Domanda al future perfect."),
      C("use","Il cliente deve ricevere la merce entro venerdì. Scegli il messaggio che conferma il rispetto della scadenza.",["We will have delivered the goods by Friday.", "We will send the goods after Friday.", "We will start packing the goods on Friday."],"We will have delivered the goods by Friday.","By Friday indica che la consegna sarà completata entro venerdì. Spedire dopo o iniziare a imballare venerdì non garantisce questa scadenza."),
      C("use","Calcoli un obiettivo di risparmio. Scegli la frase corretta.",["By December I'll have saved enough for the trip.","By December I'll save enough for the trip since.","By December I've saved enough for the trip next."],"By December I'll have saved enough for the trip.","By + future perfect."),
      O("word_order","Metti le parole in ordine e scrivi la frase: will have / they / by then / gone home","They will have gone home by then",["By then they will have gone home"],"Future perfect."),
      O("word_order","Metti le parole in ordine e scrivi la frase: won't / she / have finished / by noon","She won't have finished by noon",["By noon she won't have finished"],"Negativa del future perfect.")
    ]
  },
  "future-perfect-continuous":{
    train:[
      C("tense_choice","Scegli la forma corretta: In May I ___ here for ten years.",["will have been working","will be work","have been working next"],"will have been working","Durata fino a un momento futuro."),
      C("tense_choice","Scegli la forma corretta: By eight they ___ for twelve hours.",["will have been driving","will drive","are driving"],"will have been driving","Durata fino a un momento futuro."),
      C("use","Dici da quanto tempo aspetterai quando arriverà il treno. Scegli la frase corretta.",["By the time it arrives, we'll have been waiting for two hours.","By the time it arrives, we'll be waited for two hours.","By the time it arrives, we've been waiting for two hours tomorrow."],"By the time it arrives, we'll have been waiting for two hours.","Future perfect continuous."),
      C("use","Spieghi perché il collega sarà stanco stasera. Scegli la frase corretta.",["He'll be tired because he'll have been training all day.","He'll be tired because he'll train all day before.","He'll be tired because he has been training all day tomorrow."],"He'll be tired because he'll have been training all day.","Causa futura con durata."),
      O("word_order","Metti le parole in ordine e scrivi la frase: will have been / living / we / here / for a year","We will have been living here for a year",[],"Will have been + -ing."),
      O("word_order","Metti le parole in ordine e scrivi la frase: by June / she / will have been / teaching / for twenty years","By June she will have been teaching for twenty years",["She will have been teaching for twenty years by June"],"By + momento futuro.")
    ]
  },
  "spelling-control":{
    train:[
      C("meaning","Scegli che cosa significa: He's lying on the sofa.",["è sdraiato sul divano","sta mentendo sul divano","ha posato il divano"],"è sdraiato sul divano","Lie (sdraiarsi) → lying; il contesto decide il senso."),
      C("tense_choice","Scegli la forma corretta: Every morning she ___ the early bus.",["catches","catched","catchs"],"catches","Present simple, terza persona: -ch → -ches."),
      C("tense_choice","Scegli la forma corretta: Last night we ___ in a small hotel.",["stayed","staied","stay"],"stayed","Vocale + y: si aggiunge solo -ed."),
      C("use","Nel rapporto scrivi che cosa ha fatto il sospettato. Scegli la frase scritta correttamente.",["The suspect dropped the bag and ran.","The suspect droped the bag and runned.","The suspect dropped the bag and runed."],"The suspect dropped the bag and ran.","Drop → dropped; run → ran (irregolare)."),
      C("use","In un messaggio dici che stai arrivando. Scegli la frase scritta correttamente.",["I'm coming, I'm just getting my coat.","I'm comming, I'm just geting my coat.","I'm coming, I'm just geting my coat."],"I'm coming, I'm just getting my coat.","Come → coming; get → getting."),
      O("word_order","Metti le parole in ordine e scrivi la frase: planning / we are / a trip","We are planning a trip",[],"Plan → planning: consonante raddoppiata."),
      O("word_order","Metti le parole in ordine e scrivi la frase: carried / she / the boxes / upstairs","She carried the boxes upstairs",[],"Carry → carried.")
    ]
  },
  negatives:{
    train:[
      C("meaning","Scegli che cosa significa: I didn't see anyone.",["non ho visto nessuno","ho visto qualcuno","non ho visto tutti"],"non ho visto nessuno","Didn't + anyone = nessuno."),
      C("use","Rispondi a un collega che ti chiede se hai le chiavi. Scegli la frase corretta.",["No, I don't have them.","No, I haven't them got.","No, I not have them."],"No, I don't have them.","Do not + have."),
      C("use","Nel rapporto scrivi che non c'erano testimoni. Scegli la frase corretta.",["There were no witnesses at the scene.","There weren't no witnesses at the scene.","There were not any witness at the scene."],"There were no witnesses at the scene.","Una sola negazione: no + nome."),
      C("use","Avvisi che non sei ancora pronto. Scegli la frase corretta.",["I'm not ready yet.","I don't ready yet.","I'm no ready yet."],"I'm not ready yet.","Be + not."),
      O("word_order","Metti le parole in ordine e scrivi la frase: never / he / late / is","He is never late",[],"Never dopo be."),
      O("word_order","Metti le parole in ordine e scrivi la frase: hasn't / the parcel / yet / arrived","The parcel hasn't arrived yet",[],"Yet in fondo alla frase negativa.")
    ]
  },
  "word-building":{
    train:[
      C("meaning","Scegli che cosa significa: The witness was unreliable.",["non ci si poteva fidare del testimone","il testimone era molto affidabile","il testimone non c'era"],"non ci si poteva fidare del testimone","Un- + reliable: contrario."),
      C("tense_choice","Scegli la parola corretta: She explained the rules very ___.",["clearly","clear","clearness"],"clearly","Dopo il verbo serve un avverbio."),
      C("tense_choice","Scegli la parola corretta: The ___ of the new system took a week.",["installation","install","installing of"],"installation","Dopo the serve un nome."),
      C("use","Nel rapporto descrivi il comportamento del conducente. Scegli la frase corretta.",["The driver behaved aggressively towards the officers.","The driver behaved aggressive towards the officers.","The driver behaved aggression towards the officers."],"The driver behaved aggressively towards the officers.","Avverbio dopo il verbo."),
      C("use","Ringrazi per l'aiuto in un'email. Scegli la frase corretta.",["Thank you for your kindness and patience.","Thank you for your kind and patient.","Thank you for your kindly and patience."],"Thank you for your kindness and patience.","Dopo your servono nomi."),
      O("word_order","Metti le parole in ordine e scrivi la frase: was / the decision / unexpected / completely","The decision was completely unexpected",[],"Avverbio + aggettivo."),
      O("word_order","Metti le parole in ordine e scrivi la frase: a careful / she / of the room / made / inspection","She made a careful inspection of the room",[],"Aggettivo + nome.")
    ]
  },
  "dependent-prepositions":{
    train:[
      C("meaning","Scegli che cosa significa: She's good at languages.",["è brava nelle lingue","le lingue le fanno bene","è buona con le lingue straniere, cioè gentile"],"è brava nelle lingue","Good at = bravo in."),
      C("tense_choice","Scegli la preposizione corretta: I'm interested ___ the course.",["in","on","for"],"in","Interested in."),
      C("tense_choice","Scegli la preposizione corretta: It depends ___ the weather.",["on","of","from"],"on","Depend on."),
      C("use","Ti scusi in un'email per il ritardo. Scegli la frase corretta.",["I apologise for the late reply.","I apologise of the late reply.","I apologise to the late reply."],"I apologise for the late reply.","Apologise for."),
      C("use","Nel rapporto dici chi è responsabile della sorveglianza. Scegli la frase corretta.",["Officer Rossi is responsible for the night patrol.","Officer Rossi is responsible of the night patrol.","Officer Rossi is responsible to the night patrol."],"Officer Rossi is responsible for the night patrol.","Responsible for."),
      O("word_order","Metti le parole in ordine e scrivi la frase: of / afraid / she / is / dogs","She is afraid of dogs",[],"Afraid of."),
      O("word_order","Metti le parole in ordine e scrivi la frase: waiting for / we are / the bus","We are waiting for the bus",[],"Wait for.")
    ]
  },
  "review-foundation":{
    train:[
      C("meaning","Scegli che cosa significa: I've lost my keys.",["ho perso le chiavi e ora non le ho","ho perso le chiavi anni fa e le ho ritrovate","perdo sempre le chiavi"],"ho perso le chiavi e ora non le ho","Present perfect: effetto presente."),
      C("tense_choice","Scegli la forma corretta: She ___ TV when the phone rang.",["was watching","watched","has watched"],"was watching","Azione in corso interrotta."),
      C("tense_choice","Scegli la forma corretta: I ___ my grandparents every Sunday.",["visit","am visiting now","visited tomorrow"],"visit","Abitudine: present simple."),
      C("use","Racconti un fatto di ieri. Scegli la frase corretta.",["Yesterday I met an old friend at the station.","Yesterday I have met an old friend at the station.","Yesterday I meet an old friend at the station."],"Yesterday I met an old friend at the station.","Yesterday: past simple."),
      C("use","Comunichi un piano già deciso. Scegli la frase corretta.",["We're going to repaint the office next month.","We going to repaint the office next month.","We will going to repaint the office next month."],"We're going to repaint the office next month.","Be going to + verbo base."),
      O("word_order","Metti le parole in ordine e scrivi la frase: have / never / I / to Japan / been","I have never been to Japan",[],"Never tra have e participio."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: you / do / where / work","Where do you work",[],"Wh- + do + soggetto + verbo.")
    ],
    check:[
      O("form","Scrivi solo il verbo mancante al past simple: She ___ the letter an hour ago. (write)","wrote",[],"Ago: past simple irregolare."),
      O("form","Scrivi solo le parole mancanti al present perfect: We ___ here since 2018. (live)","have lived",[],"Since: present perfect."),
      C("meaning","Scegli che cosa significa: I'm meeting Anna tomorrow.",["ho un appuntamento con Anna domani","incontro Anna tutti i giorni","ho incontrato Anna ieri"],"ho un appuntamento con Anna domani","Present continuous per accordi futuri."),
      C("tense_choice","Scegli la forma corretta: Water ___ at 100 degrees.",["boils","is boiling now","boiled tomorrow"],"boils","Verità generale: present simple."),
      C("use","Spieghi che cosa stavi facendo quando è suonato l'allarme. Scegli la frase corretta.",["I was writing an email when the alarm rang.","I wrote an email when the alarm was ringing all.","I was write an email when the alarm rang."],"I was writing an email when the alarm rang.","Past continuous + past simple."),
      O("word_order","Metti le parole in ordine e scrivi la domanda: finished / you / have / yet","Have you finished yet",[],"Yet in fondo alla domanda.")
    ]
  },
};

function kindOf(item){
  if(item.options)return "choice";
  if(item.skill==="word_order"||/riscrivi tutta la frase|metti le parole in ordine/i.test(item.stem))return /^correggi/i.test(item.stem)?"error_correction":"transformation";
  return "completion";
}
function build(lessonId,list,part){
  return (list||[]).map((it,i)=>({id:lessonId+"-"+part+"-"+i,kind:kindOf(it),skill:it.skill,stem:it.stem,answer:it.answer,accept:[it.answer,...(it.accept||[])],options:it.options||[],why:it.why,origin:"local",bank:part}));
}
export function bankTrainItems(lessonId){return build(lessonId,LESSON_BANK[lessonId]?.train,"train");}
export function bankCheckItems(lessonId){return build(lessonId,LESSON_BANK[lessonId]?.check,"check");}
export const BANK_LESSONS=Object.keys(LESSON_BANK);
