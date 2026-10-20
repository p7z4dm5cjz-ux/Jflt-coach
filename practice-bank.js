import {LESSONS} from "./catalog.js";
import {coreItems} from "./core-practice.js";
import {negativeItems} from "./negative-bank.js";
import {EXTENSION_DRILLS,extensionItems} from "./grammar-drills.js";
import {bankTrainItems} from "./lesson-bank.js";
// Esercizi originali; nessuna domanda copiata dal pretest o dai manuali.
const rows = {
sentence:[["Metti le parole in ordine e scrivi la frase: checked / the guard / the list","The guard checked the list"],["Scrivi solo ciò che manca: The guards ___ the lists daily. (check)","check"]],
nouns:[["Scrivi solo ciò che manca: We need two ___ of information. (piece)","pieces"],["Correggi l'errore e riscrivi tutta la frase: She gave me an advice.","She gave me advice","She gave me some advice","She gave me a piece of advice","She gave me a bit of advice"]],
articles:[["Scrivi solo ciò che manca: She is ___ experienced investigator.","an"],["Scrivi solo l'articolo mancante; se non serve, scrivi un trattino (-): We travelled by ___ train.","—","-","nessun articolo","nessuno"]],
pronouns:[["Scrivi solo ciò che manca: I asked Anna to send ___ the file. (= a me)","me"],["Scrivi solo ciò che manca: This is their office. The office is ___.","theirs"]],
"some-any":[["Scrivi solo la parola mancante, some o any: There aren't ___ seats left.","any"],["Scrivi solo la parola mancante, some o any. È un'offerta: Would you like ___ coffee?","some"]],
quantifiers:[["Scrivi solo la parola mancante, much o many: How ___ luggage is there?","much"],["Scrivi solo la parola mancante, few o little: We have very ___ time.","little"]],
adjectives:[["Scrivi solo ciò che manca: Please speak ___. (trasforma clear in avverbio)","clearly"],["Scrivi solo la parola mancante, good o well: She performed ___.","well"]],
comparison:[["Scrivi solo ciò che manca: This option is ___ than the previous one. (cheap)","cheaper"],["Scrivi solo le parole mancanti: It is the ___ solution available. (reliable)","most reliable"]],
questions:[["Scrivi solo ciò che manca: ___ you send the message last night?","Did"],["Trasforma in domanda e riscrivi tutta la frase: She works here.","Does she work here?"]],
prepositions:[["Scrivi solo ciò che manca: The meeting is ___ Tuesday.","on"],["Scrivi solo la parola mancante, since o for: He has lived here ___ 2020.","since"]],
"present-simple":[["Scrivi solo ciò che manca: My colleague ___ the cameras every Friday. (usa test al present simple)","tests"],["Rendi negativa e riscrivi tutta la frase: He drives to work.","He does not drive to work","He doesn't drive to work"]],
"present-continuous":[["Scrivi solo le parole mancanti: Listen! Someone ___ at the door. (knock)","is knocking"],["Rendi negativa e riscrivi tutta la frase: They are recording the interview.","They are not recording the interview","They aren't recording the interview"]],
"past-simple":[["Scrivi solo ciò che manca: We ___ the message last night. (send)","sent"],["Correggi l'errore e riscrivi tutta la frase: They didn't knew the address.","They did not know the address","They didn't know the address"]],
"past-continuous":[["Scrivi solo le parole mancanti: She ___ lunch when the call arrived. (usa prepare al past continuous)","was preparing"],["Scrivi le prime tre parole della domanda, they compreso. Usa il past continuous: ___ they ___ outside at noon yesterday? (wait)","Were they waiting","Were they waiting outside at noon yesterday?"]],
present:[["Scrivi solo le parole mancanti. La situazione è temporanea: This month, I ___ in a different office. (work)","am working"],["Scrivi solo la parola mancante. È un'abitudine attuale: She ___ to work every Monday. (cycle)","cycles"]],
past:[["Scrivi solo le parole mancanti. L'azione era in corso: We ___ when the lights went out. (eat)","were eating"],["Scrivi solo ciò che manca: He ___ the door and left. (close)","closed"]],
"perfect-simple":[["Scrivi solo ciò che manca: I ___ my wallet last Thursday. (lose)","lost"],["Scrivi solo le parole mancanti: Someone ___ the window; the room is cold now. (usa open al present perfect)","has opened"]],
"perfect-continuous":[["Scrivi solo le parole mancanti: He ___ five applications so far. (usa process al present perfect simple)","has processed"],["Scrivi solo le parole mancanti: He ___ applications all morning. (usa process al present perfect continuous)","has been processing"]],
"past-perfect":[["Scrivi solo le parole mancanti: The train ___ before we got there. (usa depart al past perfect simple)","had departed"],["Scrivi solo le parole mancanti: We ___ for forty minutes when it opened. (usa queue al past perfect continuous)","had been queuing","had been queueing"]],
future:[["Scrivi solo le parole mancanti: 'I'm tired.' 'I ___ you home.' (usa drive con will)","will drive","'ll drive"],["Scrivi solo le parole mancanti: We ___ the system next week. (usa upgrade con going to)","are going to upgrade"]],
"used-to":[["Scrivi solo le parole mancanti: She ___ in a hospital, but now she works here. (usa use to e work)","used to work"],["Scrivi solo le parole mancanti: He is used to ___ early. (get up)","getting up"]],
ability:[["Scrivi solo ciò che manca: She can ___ the form. (translate)","translate"],["Scrivi solo le parole mancanti: After training, they ___ to operate the device. (usa be able con will)","will be able"]],
"may-might":[["Scrivi solo le parole mancanti: The schedule ___ next week. (usa change con might)","might change"],["Correggi l'errore e riscrivi tutta la frase: He may to arrive later.","He may arrive later"]],
obligation:[["Scrivi solo le parole mancanti: You ___ wear a tie; it is optional. (usa have to alla forma negativa)","do not have to","don't have to"],["Scrivi solo le parole mancanti. È un divieto: Visitors ___ touch the equipment. (usa must)","must not","mustn't"]],
"verb-patterns":[["Scrivi solo ciò che manca: He avoided ___ about the incident. (talk)","talking"],["Scrivi solo le parole mancanti: She agreed ___ us. (help)","to help"]],
"phrasal-basics":[["Sostituisci the lights con them e riscrivi tutta la frase: Please switch off the lights.","Please switch them off"],["Sostituisci the request con it e riscrivi tutta la frase: We will look into the request.","We will look into it"]],
"present-perfect-simple":[["Scrivi solo le parole mancanti: The technician ___ the radio, so it works now. (usa repair al present perfect)","has repaired"],["Scrivi solo le parole mancanti: We ___ the answer yet. (usa receive al present perfect negativo)","have not received","haven't received"]],
"present-perfect-continuous":[["Scrivi solo le parole mancanti: She ___ on the case since dawn and is still busy. (usa work al present perfect continuous)","has been working"],["Correggi l'errore e riscrivi tutta la frase: They have waiting for an hour.","They have been waiting for an hour","They have waited for an hour"]],
"past-perfect-simple":[["Scrivi solo le parole mancanti: By the time I arrived, everyone ___. (usa leave al past perfect)","had left"],["Scrivi solo le parole mancanti: They ___ the warning before the test started. (usa see al past perfect negativo)","had not seen","hadn't seen"]],
"past-perfect-continuous":[["Scrivi solo le parole mancanti: His eyes were tired because he ___ for hours. (usa read al past perfect continuous)","had been reading"],["Correggi l'errore e riscrivi tutta la frase: She had been work all night.","She had been working all night"]],
"future-will":[["Scrivi solo le parole mancanti: I ___ you as soon as I know. (usa tell con will)","will tell","'ll tell"],["Correggi l'errore e riscrivi tutta la frase: We will to contact you.","We will contact you"]],
"future-going-to":[["Scrivi solo le parole mancanti: I ___ a new laptop this weekend. (usa buy con going to)","am going to buy"],["Scrivi solo le parole mancanti: Look at those clouds! It ___. (usa rain con going to)","is going to rain"]],
"future-arrangements":[["Scrivi solo le parole mancanti: We ___ the trainer on Wednesday. (usa meet al present continuous)","are meeting"],["Scrivi solo ciò che manca: The workshop ___ at 14:00 tomorrow. (usa begin al present simple)","begins"]],
"future-perfect":[["Scrivi solo le parole mancanti: By Friday, we ___ the checks. (usa complete al future perfect)","will have completed"],["Scrivi solo le parole mancanti: At this time tomorrow, I ___. (usa travel al future continuous)","will be travelling","will be traveling"]],
deduction:[["Scrivi solo le parole mancanti: She ___ the message; she replied to it. (usa must e read)","must have read"],["Scrivi solo le parole mancanti: He ___ in Rome; I can see him here in Milan. (usa can e be alla forma negativa)","cannot be","can't be"]],
"conditionals-real":[["Scrivi solo le parole mancanti: If it rains tomorrow, we ___ indoors. (usa stay con will)","will stay"],["Correggi l'errore e riscrivi tutta la frase: If the temperature will fall, we will close the road.","If the temperature falls, we will close the road"]],
"conditionals-unreal":[["Scrivi solo le parole mancanti: If I had more time, I ___ another course. (take)","would take","could take","might take"],["Scrivi solo le parole mancanti: If they had asked, we ___ them. (help)","would have helped","could have helped","might have helped"]],
wish:[["Scrivi solo le parole mancanti. Il rimpianto riguarda il passato: I wish I ___ the number. (save)","had saved"],["Scrivi solo la parola mancante. Il desiderio riguarda il presente: I wish I ___ more time. (have)","had"]],
passive:[["Trasforma al passivo e riscrivi tutta la frase: They repaired the camera.","The camera was repaired","The camera was repaired by them","The camera got repaired","The camera got repaired by them"],["Scrivi solo le parole mancanti: The form must ___ before noon. (usa sign al passivo)","be signed"]],
reported:[["Scrivi solo la parola mancante. Applica il backshift dal presente al passato: She said, 'I am busy.' → She said that she ___ busy.","was"],["Scrivi solo le parole mancanti: He told me ___ outside. (wait)","to wait"]],
"indirect-questions":[["Metti le parole in ordine e scrivi la frase: Could you tell me / where / the office / is","Could you tell me where the office is?"],["Correggi l'errore e riscrivi tutta la frase: Do you know when does the class start?","Do you know when the class starts?"]],
relatives:[["Scrivi solo ciò che manca: The person ___ called is waiting outside.","who","that"],["Scrivi solo il relativo di luogo mancante: This is the building ___ we met.","where"]],
clauses:[["Scrivi solo ciò che manca: I will call you when I ___. (arrive)","arrive","have arrived"],["Scrivi solo ciò che manca: We waited until the rain ___. (stop)","stopped","had stopped"]],
linkers:[["Scrivi solo la parola mancante, although o despite: ___ the noise, she continued working.","Despite"],["Scrivi solo la parola mancante, although o despite: ___ it was noisy, she continued working.","Although"]],
"future-continuous":[["Scrivi solo le parole mancanti: At eight tomorrow, the team ___ the equipment. (usa test al future continuous)","will be testing"],["Correggi l'errore e riscrivi tutta la frase: I will be work at noon.","I will be working at noon"]],
"future-perfect-simple":[["Scrivi solo le parole mancanti: By the end of the day, she ___ all the files. (usa check al future perfect)","will have checked"],["Correggi l'errore e riscrivi tutta la frase: They will have finish by Monday.","They will have finished by Monday"]],
"future-perfect-continuous":[["Scrivi solo le parole mancanti: By August, he ___ here for three years. (usa work al future perfect continuous)","will have been working"],["Correggi l'errore e riscrivi tutta la frase: By noon, we will have been wait for two hours.","By noon, we will have been waiting for two hours"]],
"future-in-past":[["Scrivi solo le parole mancanti: They ___ us, but the phone failed. (usa call con going to, al passato)","were going to call"],["Scrivi solo le parole mancanti: He said he ___ the next day. (usa return con would)","would return"]],
"reporting-passive":[["Scrivi solo le parole mancanti: She is believed ___ abroad now. (be)","to be"],["Scrivi solo le parole mancanti: He is believed ___ the country last week. (leave)","to have left"]],
participles:[["Prima ha finito, poi ha inviato. Scrivi solo le parole mancanti: ___ the report, she sent it to the office. (finish)","Having finished","After finishing","After having finished","On finishing"],["Scrivi solo ciò che manca: The documents ___ yesterday are on the desk. (receive)","received"]],
inversion:[["Scrivi solo la parola mancante. Usa il present perfect: Never ___ I seen such a queue.","have"],["Correggi l'ordine delle parole e riscrivi tutta la frase, mantenendo il past simple: Only then I understood the problem.","Only then did I understand the problem"]],
clefts:[["Scrivi solo ciò che manca: It was Anna ___ found the error.","who","that"],["Scrivi solo ciò che manca: What we need ___ more time.","is"]],
nominalisation:[["Scrivi solo ciò che manca: The ___ of the route took two hours. (trasforma inspect in un nome)","inspection"],["Scrivi solo ciò che manca: Their ___ was unexpected. (trasforma refuse in un nome)","refusal"]],
hedging:[["Scrivi solo la parola mancante. Esprimi una possibilità, non una certezza: This change ___ improve response times.","may","might","could"],["Correggi l'errore e riscrivi tutta la frase: The evidence appears suggesting a link.","The evidence appears to suggest a link","The evidence appears to be suggesting a link"]],
subjunctive:[["Scrivi solo la parola mancante. Usa lo stile formale: They recommended that he ___ present. (be)","be","should be"],["Scrivi solo la parola mancante. Usa lo stile formale: It is essential that she ___ informed. (be)","be","should be"]],
cohesion:[["Scrivi solo la parola mancante, therefore o however: The road was blocked. ___, we used another route.","Therefore"],["Scrivi solo la parola mancante, therefore o however: The plan was useful. ___, it was too expensive.","However"]],
argument:[["Scrivi solo la parola mancante, although o therefore: ___ training is expensive, it reduces mistakes.","Although"],["Scrivi solo la parola mancante, therefore o although: Costs are lower and performance is better. ___, this option is preferable.","Therefore"]],
mixed:[["Correggi l'errore e riscrivi tutta la frase: If we had left earlier, we would arrived on time.","If we had left earlier, we would have arrived on time"],["Correggi l'ordine delle parole e riscrivi tutta la frase, mantenendo il past simple: She asked me where did I work.","She asked me where I worked"]]
};
export function grammarItems(lessonId, variation=0) {
  const core=coreItems(lessonId,variation);if(core)return core;
  if(lessonId==="negatives")return negativeItems(variation);
  const extended=extensionItems(lessonId,variation);
  if(extended)return extended;
  const bank=rows[lessonId];
  if(!bank)throw new Error("Lezione non disponibile.");
  return bank.map((row,i)=>({id:lessonId+"-offline-"+i,kind:row[0].startsWith("Correggi")?"error_correction":"completion",skill:"form",stem:row[0],answer:row[1],accept:row.slice(1),options:[],why:"Soluzione: "+row[1]+". "+(LESSONS.find(l=>l.id===lessonId)?.pitfall||""),origin:"local"})).sort((a,b)=>variation%2?a.id.localeCompare(b.id):b.id.localeCompare(a.id));
}
// Esercizi per le sessioni: quelli storici più la banca per competenza (lesson-bank.js).
// La banca alterna i tipi (significato o scelta, uso o ordine, forma) finché ce ne sono di
// ciascuno. Nelle lezioni brevi si aggiunge in coda; in quelle lunghe
// prende il posto di alcune varianti, distribuita fino alla fine, così la sessione resta della
// stessa lunghezza e anche le ultime 12 risposte (quelle che decidono i progressi) sono complete.
const GROUP=s=>s==="meaning"||s==="tense_choice"?0:s==="use"||s==="word_order"?1:2;
function alternate(items){
  const groups=[0,1,2].map(g=>items.filter(i=>GROUP(i.skill)===g)),out=[];
  while(groups.some(g=>g.length))for(const g of groups)if(g.length)out.push(g.shift());
  return out;
}
export function lessonItems(lessonId,variation=0){
  const base=grammarItems(lessonId,variation),bank=alternate(bankTrainItems(lessonId));
  if(!bank.length)return base;
  const shift=Math.abs(variation)%bank.length,rotated=[...bank.slice(shift),...bank.slice(0,shift)];
  if(base.length<12)return [...base,...rotated];
  const out=[...base],n=rotated.length;
  rotated.forEach((item,k)=>{out[Math.floor((k+1)*base.length/n)-1]=item;});
  return out;
}
export const COVERED_LESSONS=[...Object.keys(rows),...Object.keys(EXTENSION_DRILLS),"negatives"];
