// Original controlled practice. Six situations, five operations per situation.
// Reusing a situation is deliberate practice, not independent proof of mastery.
const verbs=[
  ["check","checked","checked","checking","the equipment"],
  ["write","wrote","written","writing","the summary"],
  ["prepare","prepared","prepared","preparing","the timetable"],
  ["read","read","read","reading","the instructions"],
  ["inspect","inspected","inspected","inspecting","the room"],
  ["update","updated","updated","updating","the register"]
];
const subjects=["The coordinator","The instructor","The assistant","The supervisor"];
const rules={
 "present-simple":["present simple","Every Monday",v=>v[0]==="have"?"has":v[0]+(v[0].endsWith("ch")?"es":"s"),"does not","does",v=>v[0],"Un'abitudine al presente: alla terza persona la -s è sul verbo affermativo, ma passa a does nelle domande e nelle negazioni."],
 "present-continuous":["present continuous","Right now",v=>"is "+v[3],"is not","is",v=>v[3],"Un'attività in corso ora: be al presente + verbo in -ing. La negazione e l'inversione riguardano is."],
 "past-simple":["past simple","Yesterday",v=>v[1],"did not","did",v=>v[0],"Un evento nel passato concluso: la forma passata compare solo nell'affermativa. Dopo did/did not torna la forma base."],
 "past-continuous":["past continuous","At 10 yesterday",v=>"was "+v[3],"was not","was",v=>v[3],"Un'attività in corso in un momento passato: was + -ing. Non si aggiunge did a was."],
 "present-perfect-simple":["present perfect simple","So far today",v=>"has "+v[2],"has not","has",v=>v[2],"Un risultato collegato al presente, in un periodo ancora aperto: has + participio passato, non la forma base."],
 "present-perfect-continuous":["present perfect continuous","For the last twenty minutes",v=>"has been "+v[3],"has not","has",v=>"been "+v[3],"Durata di un'attività fino al presente: has been + -ing. La negazione riguarda has; been resta necessario."],
 "past-perfect-simple":["past perfect simple","By 10 yesterday",v=>"had "+v[2],"had not","had",v=>v[2],"Un fatto già compiuto prima di un riferimento passato: had + participio. La domanda inizia con had."],
 "past-perfect-continuous":["past perfect continuous","For twenty minutes before the meeting began",v=>"had been "+v[3],"had not","had",v=>"been "+v[3],"Un'attività durata fino a un punto passato: had been + -ing. La durata precede l'inizio della riunione."],
 "future-will":["future con will","Tomorrow",v=>"will "+v[0],"will not","will",v=>v[0],"Will + forma base. Nella domanda si inverte will e soggetto; nella negazione si aggiunge not a will."],
 "future-going-to":["be going to","Tomorrow",v=>"is going to "+v[0],"is not","is",v=>"going to "+v[0],"Un'intenzione già decisa: be going to + forma base. È be a portare negazione e inversione."],
 "future-arrangements":["present continuous per un accordo futuro","Tomorrow at 10, as arranged",v=>"is "+v[3],"is not","is",v=>v[3],"Un accordo futuro con momento stabilito: present continuous. Il tempo futuro è dato dal contesto, non da will."],
 "future-continuous":["future continuous","At this time tomorrow",v=>"will be "+v[3],"will not","will",v=>"be "+v[3],"Un'attività in corso in un momento futuro: will be + -ing. Be non va omesso."],
 "future-perfect-simple":["future perfect simple","By this time tomorrow",v=>"will have "+v[2],"will not","will",v=>"have "+v[2],"Un completamento entro un momento futuro: will have + participio. By indica il limite entro cui sarà compiuto."],
 "future-perfect-continuous":["future perfect continuous","For twenty minutes by the time the meeting starts",v=>"will have been "+v[3],"will not","will",v=>"have been "+v[3],"La durata raggiunta a un punto futuro: will have been + -ing. Servono sia have sia been."],
 "ability":["can per capacità attuale","Without assistance",v=>"can "+v[0],"cannot","can",v=>v[0],"Capacità: can + forma base, senza to e senza -s. Cannot è la negazione; can precede il soggetto nella domanda."],
 "obligation":["must per obbligo","Before the meeting",v=>"must "+v[0],"must not","must",v=>v[0],"Must + forma base indica obbligo. Attenzione: must not esprime un divieto, non assenza di obbligo (don't have to)."]
};
export const CORE_LESSONS=Object.keys(rules);
const cap=s=>s[0].toUpperCase()+s.slice(1);
export function coreItems(id,variation=0){
 const r=rules[id];if(!r)return null;
 const [name,time,affirm,negative,aux,tail,why]=r;
 const subject=subjects[Math.abs(variation)%subjects.length],who=subject.toLowerCase();
 const contexts=verbs.map((v,i)=>({v,i,context:id+"-s"+(Math.abs(variation)%subjects.length)+"-v"+i}));
 const make=(x,page,stem,answer,kind="completion",options=[])=>({id:x.context+"-task"+page,context_id:id+"-situation-"+x.i,kind,skill:page===0?"recognise":"form",stem,answer,accept:[answer],options,why,formula:name,origin:"local"});
 return [0,1,2,3,4].flatMap(page=>contexts.map(x=>{
   const {v}=x,phrase=affirm(v),rest=v[4],full=subject+" "+phrase+" "+rest+".",neg=subject+" "+negative+" "+tail(v)+" "+rest+".";
   if(page===0){const options=[phrase,"to "+v[0],"has "+v[3]];return make(x,page,"Usa "+name+". "+time+": "+who+" ___ "+rest+".",phrase,"choice",options);}
   if(page===1)return make(x,page,"Forma richiesta: "+name+". "+time+": "+who+" ___ "+rest+". ("+v[0]+")",phrase);
   if(page===2)return make(x,page,"Riscrivi nella negativa della forma indicata ("+name+"): "+full+(id==="obligation"?" Qui devi esprimere un divieto, non assenza di obbligo.":""),neg,"transformation");
   if(page===3)return make(x,page,"In un rapporto fittizio vuoi formulare una domanda sì/no. Usa "+name+"; inizia con "+cap(aux)+" e mantieni soggetto e complemento: "+full,cap(aux)+" "+who+" "+tail(v)+" "+rest+"?","transformation");
   // Both the required tense and exactly one wrong verb phrase are specified.
   return make(x,page,"Correggi il gruppo verbale usando "+name+" ("+time.toLowerCase()+"): "+subject+" to "+v[0]+" "+rest+".",full,"error_correction");
 }));
}
