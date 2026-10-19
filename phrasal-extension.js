// Nuovi sensi; non rinumerare le 161 schede precedenti.
const rows = [
  ["be-over","be over","essere finito","I","The inspection is over; everyone can leave.","finish"],
  ["break-up-relationship","break up","terminare una relazione","I","They broke up last spring but remained friends.","separate"],
  ["bring-up-child","bring up","crescere ed educare un bambino","S","Her grandparents brought her up in a small town.","raise","her"],
  ["call-for-person","call for","passare a prendere qualcuno","U","I'll call for you at the hotel before the briefing.","collect","her"],
  ["check-out-hotel","check out","lasciare un alloggio dopo la registrazione di uscita","I","We checked out of the hotel before taking the train.","leave the hotel"],
  ["come-on","come on","esortare a procedere o sbrigarsi","I","Come on! The coach leaves in five minutes.","hurry"],
  ["cross-out","cross out","barrare una parola scritta","S","Cross out the old address before adding the new one.","strike through"],
  ["cut-up","cut up","tagliare in pezzi","S","She cut up the damaged label before discarding it.","cut into pieces"],
  ["fill-up","fill up","riempire completamente","S","We filled up the water tank before departure.","fill completely"],
  ["get-along","get along","avere un buon rapporto reciproco","I","The new colleagues get along despite their different habits.","have a good relationship"],
  ["get-down-body","get down","abbassarsi verso terra","I","The instructor told everyone to get down below the smoke.","lower oneself"],
  ["get-down-write","get down","annotare per iscritto","S","Get the registration number down before you forget it.","record"],
  ["get-in-enter","get in","riuscire a entrare","I","The side door was locked, but we got in through reception.","enter"],
  ["get-on-progress","get on","procedere o fare progressi","I","How are you getting on with the new course?",
   "progress"],
  ["get-rid-of","get rid of","liberarsi di qualcosa","U","We need to get rid of the duplicate copies.","remove"],
  ["give-in-submit","give in","consegnare un elaborato","S","Please give in your answer sheets before leaving the room.","submit"],
  ["give-way","give way","cedere il passaggio","I","At the junction, give way to vehicles from the right.","yield"],
  ["go-for-choice","go for","scegliere un'opzione","U","We went for the simpler plan after reviewing the costs.","choose"],
  ["go-off-light","go off","spegnersi una luce","I","The lights went off during the power cut.","stop operating"],
  ["go-on-happen","go on","accadere o essere in corso","I","Nobody knew what was going on in the next room.","happen"],
  ["go-out-leisure","go out","uscire per svago","I","The team went out for dinner after the course.","go out socially"],
  ["go-out-relationship","go out with","avere una relazione con qualcuno","U","She went out with her old school friend for a year.","date","him"],
  ["go-with-match","go with","abbinarsi a qualcosa","U","This shirt goes with the dark jacket.","match"],
  ["go-together","go together","stare bene insieme","I","The jacket and trousers go together.","match"],
  ["hang-out","hang out","passare del tempo insieme senza impegno","I","We hang out at the café after class.","spend time socially"],
  ["hang-up","hang up","terminare una telefonata","I","She said goodbye and hung up.","end a call"],
  ["keep-in","keep in","far rimanere all'interno","S","The rain kept us in all afternoon.","make someone stay inside","them"],
  ["keep-up","keep up","mantenere un'attività o un risultato","S","Keep up the good work during the next phase.","maintain"],
  ["knock-down-person","knock down","urtare una persona facendola cadere","S","The cyclist was knocked down by a car at the junction.","hit and cause to fall","him"],
  ["lie-down","lie down","sdraiarsi","I","The visitor lay down until they felt better.","recline"],
  ["put-down-write","put down","scrivere un dato su un elenco","S","Put your name down on the attendance list.","write"],
  ["put-on-weight","put on","aumentare il proprio peso","S","He put on some weight during the winter.","gain"],
  ["put-through-call","put through","collegare una telefonata al destinatario","S","The operator put me through to the coordinator.","connect","her"],
  ["put-up-price","put up","aumentare un prezzo","S","The hotel put up its room prices in June.","increase"],
  ["ring-back","ring back","richiamare qualcuno al telefono","S","I'll ring you back after lunch.","return a call","her"],
  ["ring-up","ring up","telefonare a qualcuno","S","She rang up her colleague to confirm the meeting.","telephone","her"],
  ["set-out-aim","set out","iniziare con uno scopo dichiarato","I","We set out to reduce errors in the timetable.","begin with an aim"],
  ["sit-down","sit down","sedersi","I","Please sit down while we check your booking.","sit"],
  ["split-up","split up","separarsi in una relazione","I","They split up after moving to different cities.","separate"],
  ["stay-behind","stay behind","rimanere dopo la partenza degli altri","I","Two colleagues stayed behind to tidy the room.","remain"],
  ["take-off-clothing","take off","togliersi un indumento","S","She took off her wet jacket in the changing room.","remove"],
  ["tidy-up","tidy up","riordinare un luogo","S","Please tidy up the classroom before leaving.","put in order"],
  ["try-on","try on","provare un indumento","S","She tried on the jacket to check the size.","test the fit"],
  ["turn-down-volume","turn down","abbassare il volume o livello","S","Turn down the radio while the briefing is in progress.","reduce"],
  ["turn-up-volume","turn up","aumentare il volume o livello","S","Turn up the speaker so everyone can hear.","increase"],
  ["wash-up-dishes","wash up","lavare le stoviglie","S","We washed up the plates after dinner before reviewing the notes.","wash the dishes","them"],
  ["wash-up-body","wash up","lavarsi mani o viso","I","He washed his hands and face: he washed up before sitting down to eat.","wash oneself"],
  ["wear-out-object","wear out","consumare un oggetto con l'uso","S","Years of use wore out the protective cover.","use until unusable"],
  ["work-out-exercise","work out","fare esercizio fisico","I","We work out at the gym twice a week.","exercise"],
  ["wrap-up-object","wrap up","avvolgere un oggetto","S","Wrap up the fragile box before transport.","wrap"],
];
// Alternative scritte per ciascun contesto: non riciclate casualmente da altre schede.
const distractors={
  "be-over":["stare per iniziare","rimanere in attesa"],
  "break-up-relationship":["iniziare a frequentarsi","ricontattarsi al telefono"],
  "bring-up-child":["andare a prendere qualcuno","sollevare un argomento"],
  "call-for-person":["annullare un incontro","richiedere una verifica"],
  "check-out-hotel":["registrarsi all'arrivo","ispezionare le stanze"],
  "come-on":["ordinare di fermarsi","annunciare il proprio ritorno"],
  "cross-out":["sottolineare per evidenziare","ricopiare senza modifiche"],
  "cut-up":["riparare una superficie","incollare due parti"],
  "fill-up":["svuotare un recipiente","compilare un modulo"],
  "get-along":["litigare abitualmente","raggiungere una destinazione"],
  "get-down-body":["alzarsi in piedi","annotare un numero"],
  "get-down-write":["cancellare un numero","abbassarsi verso terra"],
  "get-in-enter":["uscire da un luogo","salire su un autobus"],
  "get-on-progress":["interrompere un'attività","salire su un autobus"],
  "get-rid-of":["conservare con cura","richiedere copie aggiuntive"],
  "give-in-submit":["cedere a una pressione","rifiutare la consegna"],
  "give-way":["avere la precedenza","accelerare per sorpassare"],
  "go-for-choice":["rifiutare tutte le opzioni","rinviare la decisione"],
  "go-off-light":["accendersi una luce","suonare un allarme"],
  "go-on-happen":["essere stato annullato","andare in vacanza"],
  "go-out-leisure":["rimanere a lavorare","smettere di funzionare"],
  "go-out-relationship":["somigliare a un familiare","interrompere una relazione"],
  "go-with-match":["essere incompatibile con","seguire una persona"],
  "go-together":["essere incompatibili","arrivare in momenti diversi"],
  "hang-out":["terminare una telefonata","appendere un indumento"],
  "hang-up":["rimanere in linea","richiamare più tardi"],
  "keep-in":["mandare fuori","annotare un'informazione"],
  "keep-up":["interrompere un'attività","rinunciare a un risultato"],
  "knock-down-person":["aiutare una persona ad alzarsi","bussare alla porta"],
  "lie-down":["alzarsi in piedi","dire una bugia"],
  "put-down-write":["cancellare un nome","criticare una persona"],
  "put-on-weight":["perdere peso","indossare un indumento"],
  "put-through-call":["interrompere la telefonata","annotare il numero"],
  "put-up-price":["abbassare un prezzo","rimandare un pagamento"],
  "ring-back":["interrompere la telefonata","rimanere in attesa"],
  "ring-up":["annullare un incontro","concludere la conversazione"],
  "set-out-aim":["rinunciare allo scopo","esporre i risultati in un testo"],
  "sit-down":["alzarsi in piedi","stendersi a terra"],
  "split-up":["iniziare una relazione","condividere lo stesso alloggio"],
  "stay-behind":["partire prima degli altri","restare indietro negli studi"],
  "take-off-clothing":["indossare un indumento","decollare un aereo"],
  "tidy-up":["mettere in disordine","chiudere un'attività"],
  "try-on":["indossare definitivamente","rifiutare senza provare"],
  "turn-down-volume":["rifiutare un'offerta","aumentare il volume"],
  "turn-up-volume":["arrivare a un appuntamento","abbassare il volume"],
  "wash-up-dishes":["lavarsi le mani","riordinare dei documenti"],
  "wash-up-body":["lavare le stoviglie","terminare una riunione"],
  "wear-out-object":["riparare un oggetto","indossare per la prima volta"],
  "work-out-exercise":["calcolare un risultato","lavorare in un altro ufficio"],
  "wrap-up-object":["scartare un pacco","concludere una riunione"]
};
// Due casi della banca precedente con traduzioni sinonime: opzioni esplicite.
// Sensi equivalenti o quasi equivalenti: non compaiono mai come opzione sbagliata l'uno dell'altro.
export const MEANING_GROUPS=[
  ["pv-076","pv-078","phrasal-sense-give-in-submit"],
  ["pv-136","pv-153","phrasal-sense-get-down-write","phrasal-sense-put-down-write"],
  ["pv-050","phrasal-sense-get-along"],
  ["pv-069","phrasal-sense-get-on-progress"],
  ["pv-017","pv-072","pv-083","phrasal-sense-keep-up"],
  ["pv-105","phrasal-sense-go-for-choice"],
  ["pv-037","pv-143","phrasal-sense-get-rid-of"],
  ["pv-150","phrasal-sense-wear-out-object"],
  ["pv-106","phrasal-sense-call-for-person"],
  ["pv-013","phrasal-sense-ring-back"],
  ["phrasal-sense-break-up-relationship","phrasal-sense-split-up"],
  ["pv-003","pv-146","phrasal-sense-go-off-light"],
  ["phrasal-sense-go-with-match","phrasal-sense-go-together"],
  ["phrasal-sense-hang-out","phrasal-sense-go-out-leisure"],
  ["pv-126","phrasal-sense-tidy-up"]
];
export const BASE_MEANING_DISTRACTORS={
  "pv-001": [
    "smentire una conclusione",
    "fare una copia di sicurezza"
  ],
  "pv-002": [
    "insistere sulla propria posizione",
    "tornare fisicamente indietro"
  ],
  "pv-003": [
    "iniziare a funzionare",
    "suddividere i dati"
  ],
  "pv-004": [
    "uscire senza permesso",
    "interrompere una conversazione"
  ],
  "pv-005": [
    "uscire da un edificio",
    "demolire un edificio"
  ],
  "pv-006": [
    "spegnersi lentamente",
    "essere rinviato"
  ],
  "pv-007": [
    "riunire un gruppo",
    "iniziare una relazione"
  ],
  "pv-008": [
    "impedire un cambiamento",
    "riportare un oggetto"
  ],
  "pv-009": [
    "portare via definitivamente",
    "anticipare una scadenza"
  ],
  "pv-010": [
    "posticipare una data",
    "annullare un appuntamento"
  ],
  "pv-011": [
    "escludere una persona",
    "riportare un oggetto al proprietario"
  ],
  "pv-012": [
    "evitare un argomento",
    "crescere un bambino"
  ],
  "pv-013": [
    "interrompere una telefonata",
    "annullare un incontro"
  ],
  "pv-014": [
    "annullare una valutazione",
    "telefonare a un esperto"
  ],
  "pv-015": [
    "rimandare senza annullare",
    "confermare lo svolgimento"
  ],
  "pv-016": [
    "telefonare informalmente",
    "esonerare da un compito"
  ],
  "pv-017": [
    "interrompere",
    "iniziare da zero"
  ],
  "pv-018": [
    "rinviare un controllo",
    "abbandonare un controllo"
  ],
  "pv-019": [
    "restare ulteriormente indietro",
    "aspettare senza lavorare"
  ],
  "pv-020": [
    "superare e distanziare",
    "allontanarsi da chi precede"
  ],
  "pv-021": [
    "lasciare l'alloggio",
    "verificare un documento"
  ],
  "pv-022": [
    "lasciare un albergo",
    "cancellare un indirizzo"
  ],
  "pv-023": [
    "creare un equivoco",
    "pulire una stanza"
  ],
  "pv-024": [
    "aprire un'attività",
    "trasferire un'attività senza chiuderla"
  ],
  "pv-025": [
    "cercare senza trovare",
    "creare un nuovo documento"
  ],
  "pv-026": [
    "partire definitivamente",
    "presentarsi per la prima volta"
  ],
  "pv-027": [
    "essere irrilevante per",
    "scendere fisicamente verso"
  ],
  "pv-028": [
    "rifiutare di testimoniare",
    "arretrare fisicamente"
  ],
  "pv-029": [
    "rimanere segreto",
    "essere ritirato dalla pubblicazione"
  ],
  "pv-030": [
    "essere deliberatamente escluso",
    "essere risolto definitivamente"
  ],
  "pv-031": [
    "scartare una soluzione",
    "copiare senza modifiche"
  ],
  "pv-032": [
    "contare numericamente",
    "diffidare di"
  ],
  "pv-033": [
    "aumentare una spesa",
    "eliminare ogni spostamento"
  ],
  "pv-034": [
    "aumentare una quantità",
    "interrompere un collegamento"
  ],
  "pv-035": [
    "ripristinare un collegamento",
    "ridurre una spesa"
  ],
  "pv-036": [
    "evitare di affrontare",
    "consegnare a un cliente"
  ],
  "pv-037": [
    "mantenere una pratica",
    "rimandare una decisione"
  ],
  "pv-038": [
    "distruggere un piano",
    "mettere in pratica un piano"
  ],
  "pv-039": [
    "andare a prendere qualcuno",
    "investire qualcuno"
  ],
  "pv-040": [
    "iniziare intenzionalmente",
    "uscire immediatamente"
  ],
  "pv-041": [
    "anticipare il programma",
    "recuperare il ritardo"
  ],
  "pv-042": [
    "essere concluso con successo",
    "essere anticipato"
  ],
  "pv-043": [
    "non riuscire a capire",
    "inventare dati falsi"
  ],
  "pv-044": [
    "svuotare un modulo",
    "consegnare senza compilare"
  ],
  "pv-045": [
    "annullare una domanda",
    "stampare senza compilare"
  ],
  "pv-046": [
    "nascondere un dato",
    "decidere un orario"
  ],
  "pv-047": [
    "abbandonare una pista",
    "inventare una pista"
  ],
  "pv-048": [
    "ignorare una segnalazione",
    "annullare una segnalazione"
  ],
  "pv-049": [
    "nascondere un messaggio",
    "attraversare fisicamente"
  ],
  "pv-050": [
    "litigare con",
    "incontrare per la prima volta"
  ],
  "pv-051": [
    "rimanere sul posto",
    "evitare una regola"
  ],
  "pv-052": [
    "rimanere sul posto",
    "avvicinarsi volontariamente"
  ],
  "pv-053": [
    "essere punito per",
    "confessare volontariamente"
  ],
  "pv-054": [
    "partire",
    "richiamare al telefono"
  ],
  "pv-055": [
    "ignorare una richiesta",
    "restituire un oggetto"
  ],
  "pv-056": [
    "disporre di risorse illimitate",
    "rinunciare per mancanza di mezzi"
  ],
  "pv-057": [
    "salire su un mezzo",
    "passare accanto a un mezzo"
  ],
  "pv-058": [
    "scendere da un mezzo",
    "sorpassare un mezzo"
  ],
  "pv-059": [
    "abbandonare il lavoro",
    "litigare con"
  ],
  "pv-060": [
    "assumere un nuovo obbligo",
    "portare a termine un obbligo"
  ],
  "pv-061": [
    "peggiorare a causa di",
    "passare fisicamente sopra"
  ],
  "pv-062": [
    "interrompere una chiamata",
    "superare un esame"
  ],
  "pv-063": [
    "andare a dormire",
    "alzare un oggetto"
  ],
  "pv-064": [
    "nascondere un'informazione",
    "regalare un oggetto"
  ],
  "pv-065": [
    "trattenere un oggetto",
    "buttare un oggetto"
  ],
  "pv-066": [
    "resistere senza cedere",
    "consegnare un elaborato"
  ],
  "pv-067": [
    "raccogliere ciò che era stato distribuito",
    "esaurirsi per stanchezza"
  ],
  "pv-068": [
    "continuare una ricerca",
    "distribuire materiali"
  ],
  "pv-069": [
    "annullare",
    "restare sospeso"
  ],
  "pv-070": [
    "proseguire senza tornare",
    "consegnare documenti"
  ],
  "pv-071": [
    "smettere di suonare",
    "andare a male"
  ],
  "pv-072": [
    "terminare subito",
    "tornare all'inizio"
  ],
  "pv-073": [
    "ignorare i dettagli",
    "saltare una procedura"
  ],
  "pv-074": [
    "scartare senza leggere",
    "distruggere i documenti"
  ],
  "pv-075": [
    "educare un bambino",
    "rimanere infantile"
  ],
  "pv-076": [
    "trattenere un documento",
    "distribuire copie"
  ],
  "pv-077": [
    "raccogliere le copie",
    "scrivere le istruzioni"
  ],
  "pv-078": [
    "trattenere il controllo",
    "distruggere gli oggetti"
  ],
  "pv-079": [
    "interrompere definitivamente",
    "riagganciare il telefono"
  ],
  "pv-080": [
    "accelerare un progetto",
    "dare inizio a un progetto"
  ],
  "pv-081": [
    "riagganciare",
    "richiamare il giorno dopo"
  ],
  "pv-082": [
    "accelerare",
    "annullare definitivamente"
  ],
  "pv-083": [
    "smettere",
    "iniziare a prepararsi"
  ],
  "pv-084": [
    "rimanere indietro rispetto a",
    "ridurre la domanda"
  ],
  "pv-085": [
    "includere",
    "evidenziare"
  ],
  "pv-086": [
    "sostenere emotivamente",
    "far scendere fisicamente"
  ],
  "pv-087": [
    "chiudere una sessione",
    "cancellare un account"
  ],
  "pv-088": [
    "aprire una sessione",
    "registrare un nuovo account"
  ],
  "pv-089": [
    "ignorare i bisogni di",
    "cercare una persona scomparsa"
  ],
  "pv-090": [
    "ripensare soltanto al passato",
    "ignorare i rischi futuri"
  ],
  "pv-091": [
    "aspettare con piacere",
    "evitare qualsiasi ricordo"
  ],
  "pv-092": [
    "aver già trovato",
    "rinunciare alla ricerca"
  ],
  "pv-093": [
    "temere",
    "guardare fisicamente davanti a"
  ],
  "pv-094": [
    "ignorare una questione",
    "guardare verso il futuro"
  ],
  "pv-095": [
    "abbassare l'attenzione",
    "cercare un'informazione"
  ],
  "pv-096": [
    "cancellare un dato",
    "ammirare una persona"
  ],
  "pv-097": [
    "disprezzare",
    "cercare in un dizionario"
  ],
  "pv-098": [
    "inventare un numero",
    "cancellare una targa"
  ],
  "pv-099": [
    "verificare un racconto",
    "compensare un danno"
  ],
  "pv-100": [
    "aggravare",
    "essere irrilevante per"
  ],
  "pv-101": [
    "rimanere sullo stesso punto",
    "tornare all'inizio"
  ],
  "pv-102": [
    "trattenere un'informazione",
    "respingere un'informazione"
  ],
  "pv-103": [
    "prendere denaro in prestito",
    "spendere denaro"
  ],
  "pv-104": [
    "rivelarsi inutile",
    "restituire un prestito"
  ],
  "pv-105": [
    "ignorare tutte le alternative",
    "andare a prendere qualcuno"
  ],
  "pv-106": [
    "lasciare qualcuno alla destinazione",
    "respingere un passeggero"
  ],
  "pv-107": [
    "omettere un dettaglio",
    "nascondere un limite"
  ],
  "pv-108": [
    "lasciare fuori dopo l'uso",
    "gettare definitivamente"
  ],
  "pv-109": [
    "ritirare una proposta",
    "respingere una proposta"
  ],
  "pv-110": [
    "annullare definitivamente",
    "anticipare un appuntamento"
  ],
  "pv-111": [
    "togliersi un indumento",
    "aumentare di peso"
  ],
  "pv-112": [
    "appiccare un incendio",
    "rimandare un intervento"
  ],
  "pv-113": [
    "separare le parti",
    "scartare le prove"
  ],
  "pv-114": [
    "rifiutare di tollerare",
    "proporre una soluzione"
  ],
  "pv-115": [
    "diffidare di",
    "essere indipendente da"
  ],
  "pv-116": [
    "confermare come unica spiegazione",
    "scoprire per la prima volta"
  ],
  "pv-117": [
    "rimanere fermo",
    "tornare spontaneamente"
  ],
  "pv-118": [
    "evitare una persona",
    "fissare un appuntamento"
  ],
  "pv-119": [
    "rifornirsi di",
    "risparmiare una risorsa"
  ],
  "pv-120": [
    "utilizzare immediatamente tutto",
    "dimenticare senza pianificare"
  ],
  "pv-121": [
    "arrivare a destinazione",
    "annullare la partenza"
  ],
  "pv-122": [
    "nascondere i risultati",
    "iniziare un viaggio"
  ],
  "pv-123": [
    "smantellare",
    "rinunciare a istituire"
  ],
  "pv-124": [
    "non presentarsi",
    "andarsene senza avvisare"
  ],
  "pv-125": [
    "avviare il funzionamento",
    "aumentare la potenza"
  ],
  "pv-126": [
    "complicare un problema",
    "rinviare senza affrontare"
  ],
  "pv-127": [
    "intervenire già attivamente",
    "abbandonare il posto"
  ],
  "pv-128": [
    "essere contrario a",
    "sedersi al posto di"
  ],
  "pv-129": [
    "passare inosservato",
    "essere eliminato"
  ],
  "pv-130": [
    "assumere un incarico",
    "essere promosso"
  ],
  "pv-131": [
    "ridurre",
    "sospendere completamente"
  ],
  "pv-132": [
    "deviare da",
    "abbandonare"
  ],
  "pv-133": [
    "sviluppare ogni dettaglio",
    "contraddire i risultati"
  ],
  "pv-134": [
    "prendersi cura di",
    "andare a prendere"
  ],
  "pv-135": [
    "ribadire un'affermazione",
    "trasmettere un'accusa"
  ],
  "pv-136": [
    "cancellare un dato",
    "smontare una struttura"
  ],
  "pv-137": [
    "atterrare",
    "togliersi un indumento"
  ],
  "pv-138": [
    "rifiutare un compito",
    "completare un compito"
  ],
  "pv-139": [
    "cedere il controllo",
    "sospendere un'operazione"
  ],
  "pv-140": [
    "abbandonare un'attività",
    "ridurre il tempo dedicato"
  ],
  "pv-141": [
    "evitare una discussione",
    "imporre senza discutere"
  ],
  "pv-142": [
    "decidere senza riflettere",
    "dimenticare le alternative"
  ],
  "pv-143": [
    "conservare con cura",
    "trascrivere"
  ],
  "pv-144": [
    "accettare un'offerta",
    "abbassare il volume"
  ],
  "pv-145": [
    "rimanere identico a",
    "allontanarsi da"
  ],
  "pv-146": [
    "accendere un dispositivo",
    "aumentarne il volume"
  ],
  "pv-147": [
    "spegnere un dispositivo",
    "abbassarne il volume"
  ],
  "pv-148": [
    "essere deciso in anticipo",
    "essere impedito"
  ],
  "pv-149": [
    "scomparire",
    "aumentare il volume"
  ],
  "pv-150": [
    "lasciare intatte le scorte",
    "ricostituire le scorte"
  ],
  "pv-151": [
    "addormentarsi",
    "rimanere addormentato"
  ],
  "pv-152": [
    "fare esercizio fisico",
    "ignorare i costi"
  ],
  "pv-153": [
    "cancellare un appunto",
    "memorizzare senza scrivere"
  ],
  "pv-154": [
    "introdurre gradualmente",
    "sospendere solo per un giorno"
  ],
  "pv-155": [
    "nascondere le opzioni",
    "eliminare tutte le opzioni"
  ],
  "pv-156": [
    "essere estraneo alla causa",
    "calcolare senza spiegare"
  ],
  "pv-157": [
    "archiviare senza leggere",
    "cercare un documento perduto"
  ],
  "pv-158": [
    "iniziare immediatamente",
    "interrompere per sempre"
  ],
  "pv-159": [
    "evitare ogni contatto con",
    "prendere fisicamente un oggetto"
  ],
  "pv-160": [
    "chiudere ogni possibilità",
    "esaminare un'opportunità già persa"
  ],
  "pv-161": [
    "ignorare i rischi",
    "misurare il peso fisico"
  ]
};
export const PARTICLE_ALTERNATIVES={
  "pv-025":["upon"],"pv-033":["down on"],"pv-034":["back on"],
  "pv-044":["out"],"pv-045":["in"],"pv-050":["on with"],
  "pv-051":["about","round"],"pv-117":["off"],"pv-121":["out"],
  "phrasal-sense-get-along":["on"],"phrasal-sense-get-on-progress":["along"],
  "phrasal-sense-go-for-choice":["with"],"phrasal-sense-go-off-light":["out"],
  "phrasal-sense-knock-down-person":["over"],"phrasal-sense-stay-behind":["on"]
};
export const EXTRA_PHRASALS=rows.map(([id,expression,meaning_it,pattern,example,alternative,object_pronoun])=>({
  id:"phrasal-sense-"+id,expression,meaning_it,pattern,example,alternative,object_pronoun:object_pronoun||"it",
  meaning_distractors:distractors[id],
  topic:pattern==="I"?"vita quotidiana":"contesto e significato",register:"neutro",difficulty:"intermedio"
}));
export const PHRASAL_SCENARIOS=[
  {id:"travel",title:"Una trasferta e un alloggio",text:"We set off before dawn and checked in at the hotel at noon. The next morning, I called for my colleague at reception. We checked out after the briefing and picked up the documents on the way back.",expressions:["set off","check in","call for","check out","pick up"]},
  {id:"briefing",title:"Preparare e correggere un briefing",text:"I wrote down the revised time and crossed out the old address. We carried out the checks and handed in the forms. After everyone left, two colleagues stayed behind to tidy up.",expressions:["write down","cross out","carry out","hand in","stay behind","tidy up"]},
  {id:"fault",title:"Un guasto durante il corso",text:"The projector broke down and the lights went off. An alarm went off in the corridor. We found out that a cable was damaged, so we put off the demonstration and carried on with the discussion.",expressions:["break down","go off","find out","put off","carry on"]},
];
