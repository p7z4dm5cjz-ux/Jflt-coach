// Original controlled practice. Six situations, five operations per situation.
// Each situation keeps its verb; the complement changes at every operation.
// Reusing a situation is deliberate practice, not independent proof of mastery.
// Each operation uses a different complement, so a later item never repeats the
// sentence (or the answer) already shown in an earlier operation of the same situation.
const verbs=[
  ["check","checked","checked","checking",["the equipment","the visitor list","the radios","the door locks","the vehicles"]],
  ["write","wrote","written","writing",["the summary","the shift report","the incident log","the reply","the statement"]],
  ["prepare","prepared","prepared","preparing",["the timetable","the briefing","the documents","the patrol plan","the meeting room"]],
  ["read","read","read","reading",["the instructions","the new rules","the messages","the case file","the warning notice"]],
  ["inspect","inspected","inspected","inspecting",["the room","the vehicle","the storage area","the cameras","the entrance"]],
  ["update","updated","updated","updating",["the register","the database","the contact list","the map","the schedule"]]
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
const third=v=>v[0]==="have"?"has":v[0]+(/(ch|sh|ss|x)$/.test(v[0])?"es":"s");
// Contrasti di significato: tutte le alternative sono costruzioni grammaticali.
const meanings={
 "present-simple":"un’abitudine attuale", "present-continuous":"un’attività in corso adesso",
 "past-simple":"un evento concluso ieri", "past-continuous":"un’attività in corso a un momento del passato",
 "present-perfect-simple":"un risultato raggiunto nel periodo attuale ancora aperto", "present-perfect-continuous":"la durata di un’attività fino ad adesso",
 "past-perfect-simple":"un risultato già raggiunto prima di un momento passato", "past-perfect-continuous":"la durata di un’attività fino a un momento passato",
 "future-will":"una previsione personale, non un piano già deciso", "future-going-to":"un’intenzione futura già decisa",
 "future-arrangements":"un accordo futuro già fissato", "future-continuous":"un’attività in corso a un momento futuro",
 "future-perfect-simple":"un risultato già raggiunto entro un momento futuro", "future-perfect-continuous":"la durata raggiunta da un’attività a un momento futuro",
 "ability":"una capacità attuale", "obligation":"un obbligo da rispettare"
};
const groups=[['present-simple','present-continuous','past-simple'],['present-perfect-simple','present-perfect-continuous','past-simple'],['past-perfect-simple','past-perfect-continuous','past-continuous'],['future-will','future-going-to','future-arrangements'],['future-continuous','future-perfect-simple','future-perfect-continuous'],['ability','obligation','future-will']];
function contextSentence(id,subject,v,rest){
 const r=rules[id],sentence=subject+" "+r[2](v)+" "+rest+" "+r[1].toLowerCase()+".";
 if(id==="future-will")return "This is only my prediction, not an existing plan: "+sentence;
 if(id==="future-going-to")return "A decision has already been made: "+sentence;
 if(id==="future-arrangements")return "The appointment is confirmed: "+sentence;
 return sentence;
}
function contrasts(id){return groups.find(g=>g.includes(id))||groups[0];}
export function coreItems(id,variation=0){
 const r=rules[id];if(!r)return null;
 const [name,time,affirm,negative,aux,tail,why]=r;
 const subject=subjects[Math.abs(variation)%subjects.length],who=subject.toLowerCase();
 const when=time[0].toLowerCase()+time.slice(1);
 const contexts=verbs.map((v,i)=>({v,i,context:id+"-s"+(Math.abs(variation)%subjects.length)+"-v"+i}));
 const make=(x,page,stem,answer,kind="completion",options=[],accept=[answer])=>({id:x.context+"-task"+page,context_id:id+"-situation-"+x.i,kind,skill:page===0?"recognise":"form",stem,answer,accept:[...new Set(accept)],options,why,formula:name,origin:"local"});
 return [0,1,2,3,4].flatMap(page=>contexts.map(x=>{
   const {v}=x,phrase=affirm(v),rest=v[4][page];
   const body=subject+" "+phrase+" "+rest,full=body+" "+when+".";
   if(page===0||page===4){
     const cv=page===0?verbs[(x.i+3)%verbs.length]:v,crest=cv[4][page];
     const group=contrasts(id),focus=group[(x.i+Math.abs(variation)+(page===4?1:0))%group.length],r2=rules[focus];
     const sentence=contextSentence(focus,subject,cv,crest);
     const options=page===0?group.map(k=>meanings[k]):group.map(k=>contextSentence(k,subject,cv,crest));
     const answer=page===0?meanings[focus]:sentence;
     const stem=page===0?"Scegli il significato espresso dalla frase: "+sentence:"Scegli la frase che presenta esplicitamente "+meanings[focus]+". Le altre frasi sono grammaticali, ma presentano situazioni diverse.";
     return {...make(x,page,stem,answer,"choice",options),skill:"recognise",focus_lesson:focus,formula:r2[0],why:r2[6]+" Qui la frase presenta "+meanings[focus]+". Le altre alternative rappresentano: "+group.filter(k=>k!==focus).map(k=>meanings[k]).join("; ")+". La distinzione riguarda il significato espresso, non una regola che vieta ogni altra forma."};
   }
   if(page===1)return make(x,page,(phrase.includes(" ")?"Scrivi solo le parole mancanti (":"Scrivi solo la parola mancante (")+name+"): "+time+", "+who+" ___ "+rest+". ("+v[0]+")",phrase);
   if(page===2){const neg=subject+" "+negative+" "+tail(v)+" "+rest+" "+when+".";return make(x,page,"Rendi negativa e riscrivi tutta la frase"+(id==="obligation"?" esprimendo un divieto, non l'assenza di obbligo":"")+": "+full,neg,"transformation");}
   if(page===3)return make(x,page,"Trasforma in domanda e riscrivi tutta la frase, iniziando con "+cap(aux)+": "+full,cap(aux)+" "+who+" "+tail(v)+" "+rest+" "+when+"?","transformation");
 }));
}
