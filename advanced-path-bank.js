// Riserva di contesti originali: livello 3, risposta breve e tempo dedotto dalla situazione.
// Le frasi restano finite: una ripetizione non diventa una nuova prova di padronanza.
const BANK={
  "past-simple":[
    ["use","Yesterday, the patrol ___ the missing driver at 18:30. (find)","found","Yesterday e l'orario collocano il ritrovamento in un passato concluso."],
    ["use","In 2021, our unit ___ its headquarters to Milan. (move)","moved","Il trasferimento è un evento concluso nel 2021: serve moved."],
    ["use","The interview ended an hour ago. It ___ exactly forty minutes. (last)","lasted","Anche la durata riguarda un'intervista già terminata."],
    ["use","Last Tuesday, I ___ the old key to the caretaker. (give)","gave","Il momento è concluso; il passato irregolare di give è gave."],
    ["use","The road reopened yesterday. The repairs ___ three days. (take)","took","La strada è stata riaperta: la durata dei lavori è conclusa."],
    ["neg","Yesterday I stayed at the office all day. I ___ to the airport. (not go)","did not go","La negazione riguarda ieri: did not porta il tempo e go resta alla base."],
    ["neg","We checked the empty room last night, but we ___ any documents there. (not find)","did not find","La ricerca è collocata nella scorsa notte: did not find, non did not found."],
    ["q","The meeting ended at noon yesterday. What time ___? (it / start)","did it start","La domanda riguarda l'inizio di un evento concluso: did + soggetto + base."],
    ["q","I spoke to a witness yesterday. Who ___ to? (you / speak)","did you speak","Who è l'oggetto di speak to: occorrono did e la base speak."],
    ["contrast","The retired officer died in 1998. She ___ three books during her lifetime. (write)","wrote","La vita dell'autrice è un periodo concluso: wrote, non un bilancio che arriva al presente."]
  ],
  "present-perfect-simple":[
    ["use","I still own this car. I ___ it since 2019. (have)","have had","Il possesso è iniziato nel 2019 e continua: have had. Have indica qui uno stato."],
    ["use","She is still our commander. She ___ in charge since March. (be)","has been","Since collega l'inizio al presente: has been, con has per she."],
    ["use","We remain close friends. We ___ each other since childhood. (know)","have known","La conoscenza dura ancora. Know è un verbo di stato: have known."],
    ["use","This building still belongs to our organisation. We ___ it since 2004. (own)","have owned","Il possesso continua adesso: have owned. Own non richiede qui il continuous."],
    ["use","He is still afraid of dogs. He ___ them since that incident. (fear)","has feared","La paura è uno stato iniziato allora e ancora presente: has feared."],
    ["neg","I am still waiting for her reply. She ___ to my email yet. (not respond)","has not responded","Yet e l'attesa ancora aperta collegano la mancata risposta al presente."],
    ["neg","We still have no news from Leo. We ___ from him since Monday. (not hear)","have not heard","Since Monday indica l'intervallo che arriva fino a ora."],
    ["q","You still own that flat. How long ___ it? (you / own)","have you owned","Si chiede la durata attuale del possesso: have + soggetto + owned."],
    ["q","She is still the team leader. How long ___ in charge? (she / be)","has she been","La durata arriva al presente; nella domanda has precede she."],
    ["contrast","I still trust him completely. I ___ him since our first mission together. (trust)","have trusted","La fiducia continua dal primo incontro a oggi: have trusted, non un periodo passato chiuso."]
  ],
  "past-continuous":[
    ["use","At 10 yesterday, I was halfway through a report. I ___ it when the alarm rang. (write)","was writing","Halfway indica un'attività già in corso al momento dell'allarme."],
    ["use","When I entered, the officer was in the middle of a phone call. She ___ to a witness. (talk)","was talking","La telefonata era in corso all'ingresso: was talking descrive lo sfondo."],
    ["use","The bus was halfway across the bridge when its engine stopped. It ___ the bridge. (cross)","was crossing","Halfway esclude un attraversamento già concluso: was crossing."],
    ["use","At the instant the lights went out, we were halfway through dinner. We ___. (eat)","were eating","La cena era in corso in quel momento del passato: were eating."],
    ["use","The recording shows us in the middle of an inspection at 09:15 yesterday. We ___ the engine then. (check)","were checking","Il filmato fissa un'azione in corso in un istante passato."],
    ["neg","At the moment of the collision, I was a passenger, not the driver. I ___. (not drive)","was not driving","Si nega l'attività in corso in quell'istante: was not driving."],
    ["neg","When the call came, she was awake and reading a book. She ___. (not sleep)","was not sleeping","Il contesto esclude che stesse dormendo in quel momento: was not sleeping."],
    ["q","I saw you halfway through a task when the power failed. What ___ at that moment? (you / do)","were you doing","La domanda riguarda l'attività allora in corso: were you doing."],
    ["q","You saw her in the middle of a phone call when you arrived. Who ___ to at that moment? (she / talk)","was she talking","La conversazione era già in corso all'arrivo; was precede il soggetto."],
    ["contrast","The workers were halfway through painting the wall when it began to rain. They ___ the wall at that moment. (paint)","were painting","L'inizio della pioggia interrompe un'attività in corso: were painting."]
  ]
};
export function advancedPathItems(lessonId){
  return (BANK[lessonId]||[]).map(([rule,stem,answer,why],i)=>({id:"advanced-"+lessonId+"-"+i,kind:"completion",stem:"Completa solo lo spazio: "+stem,answer,accept:[answer],options:[],why,rules:[lessonId+"."+rule],level:3,skill:"tense_choice",origin:"local"}));
}
export const ADVANCED_PATH_LESSONS=Object.keys(BANK);
