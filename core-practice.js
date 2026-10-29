import {lessonRules} from "./item-tags.js";
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
 const r=rules[id],sentence=subject+" "+r[2](v)+" "+rest+" "+r[1][0].toLowerCase()+r[1].slice(1)+".";
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
 // Regola e livello (item-tags.js): forma, negativa e domanda della lezione; il significato dell'alternativa in esame.
 const make=(x,page,stem,answer,kind="completion",options=[],accept=[answer])=>({id:x.context+"-task"+page,context_id:id+"-situation-"+x.i,kind,skill:page===0?"recognise":"form",stem,answer,accept:[...new Set(accept)],options,why,formula:name,origin:"local",rules:[id+"."+(["use","form","neg","q","use"][page])],level:page===0?1:2});
 const items=[1,0,2,3,4].flatMap(page=>contexts.map(x=>{
   const {v}=x,phrase=affirm(v),rest=v[4][page];
   const body=subject+" "+phrase+" "+rest,full=body+" "+when+".";
   if(page===0||page===4){
     const cv=page===0?verbs[(x.i+3)%verbs.length]:v,crest=cv[4][page];
     const group=contrasts(id),focus=group[(x.i+Math.abs(variation)+(page===4?1:0))%group.length],r2=rules[focus];
     const sentence=contextSentence(focus,subject,cv,crest);
     const options=page===0?group.map(k=>meanings[k]):group.map(k=>contextSentence(k,subject,cv,crest));
     const answer=page===0?meanings[focus]:sentence;
     const stem=page===0?"Scegli il significato espresso dalla frase: "+sentence:"Scegli la frase che presenta esplicitamente "+meanings[focus]+". Le altre frasi sono grammaticali, ma presentano situazioni diverse.";
     return {...make(x,page,stem,answer,"choice",options),skill:"recognise",focus_lesson:focus,rules:[focus+(page===4&&lessonRules(focus).some(r=>r.key==="contrast")?".contrast":".use")],formula:r2[0],why:r2[6]+" Qui la frase presenta "+meanings[focus]+". Le altre alternative rappresentano: "+group.filter(k=>k!==focus).map(k=>meanings[k]).join("; ")+". La distinzione riguarda il significato espresso, non una regola che vieta ogni altra forma."};
   }
   if(page===1)return make(x,page,(phrase.includes(" ")?"Scrivi solo le parole mancanti (":"Scrivi solo la parola mancante (")+name+"): "+time+", "+who+" ___ "+rest+". ("+v[0]+")",phrase);
   if(page===2){const neg=subject+" "+negative+" "+tail(v)+" "+rest+" "+when+".";return make(x,page,"Rendi negativa e riscrivi tutta la frase"+(id==="obligation"?" esprimendo un divieto, non l'assenza di obbligo":"")+": "+full,neg,"transformation",[],[neg,time+", "+who+" "+negative+" "+tail(v)+" "+rest+"."]);}
   if(page===3)return make(x,page,"Trasforma in domanda e riscrivi tutta la frase, iniziando con "+cap(aux)+": "+full,cap(aux)+" "+who+" "+tail(v)+" "+rest+" "+when+"?","transformation");
 }));
 if(id==="future-going-to"){
  const starts=[['I','am','check the equipment'],['She','is','write the summary'],['We','are','prepare the briefing'],['They','are','read the instructions'],['It','is','rain']];
  starts.forEach(([subject,answer,tail],i)=>{items[i]={...items[i],stem:'Scrivi solo la forma di be mancante: '+subject+' ___ going to '+tail+'.',answer,accept:[answer],rules:['future-going-to.form'],level:2,why:'Be going to richiede am con I, is con he/she/it, are con you/we/they. Qui il soggetto è '+subject+': serve '+answer+'. Going to e il verbo base sono già presenti: non riscriverli.'};});
  const challenges=[
   ['The team is going to inspect the site, but no appointment has been made. Che cosa puoi concludere?', ['È già fissato un appuntamento con un orario concordato.','La squadra ha intenzione di fare il controllo; un appuntamento non è ancora fissato.','La squadra sta eseguendo il controllo proprio ora.'],1,'future-going-to','Going to comunica qui un’intenzione. La seconda parte esclude un appuntamento già fissato; non descrive un’attività in corso.'],
   ['The ladder is moving and one support has broken. It is going to fall. Perché il parlante presenta questa previsione?', ['Sta comunicando una decisione volontaria della scala.','Descrive una caduta già conclusa.','Sta interpretando indizi osservabili nel presente.'],2,'future-going-to','La scala instabile e il supporto rotto sono indizi presenti. Going to può esprimere una previsione, non soltanto un piano.'],
   ['“The phone is ringing.” — “I’ll answer it.” Che cosa esprime la risposta in questo scambio?', ['Una decisione presa mentre si risponde alla situazione.','Un appuntamento concordato con chi telefona.','Un’azione completata prima che il telefono squillasse.'],0,'future-will','In questo scambio la risposta reagisce alla situazione e offre un’azione immediata. Will non significa sempre decisione spontanea: è il dialogo a rendere pertinente questa lettura.'],
   ['I’m meeting the technician at 10; we confirmed the appointment yesterday. Quale dettaglio rende esplicito l’accordo futuro?', ['Il solo fatto che meeting termini in -ing.','La conferma dell’appuntamento e l’orario.','Il fatto che l’incontro sia già terminato.'],1,'future-arrangements','Il present continuous può presentare un accordo futuro: qui la conferma e l’orario lo rendono esplicito. La forma in -ing da sola non basta a collocare un evento nel futuro.'],
   ['We are not going to inspect the warehouse; we are going to inspect the office. Quale frase conserva il piano comunicato?', ['We are going to inspect both buildings.','We are going to inspect neither building.','We intend to inspect the office, not the warehouse.'],2,'future-going-to','La negazione riguarda il magazzino, non tutte le ispezioni. Il piano positivo riguarda l’ufficio: entrambe le informazioni vanno conservate nella parafrasi.'],
   ['The team ___ the site tomorrow. Senza altre informazioni, quale valutazione è corretta?', ['Will inspect, is going to inspect e is inspecting possono essere possibili, con contesti o punti di vista diversi.','Tomorrow impone sempre is going to inspect.','Is inspecting non può mai riferirsi al futuro.'],0,'future-arrangements','Tomorrow indica quando, ma non chiarisce da solo se si tratti di intenzione, previsione o accordo. Non è corretto dichiarare una sola forma obbligatoria senza un contesto sufficiente.']
  ];
  const challengeRules=['future-going-to.contrast','future-going-to.evidence','future-will.use','future-arrangements.use','future-going-to.use','future-arrangements.contrast'];
  challenges.forEach(([stem,options,n,focus,explanation],i)=>{items[24+i]={...items[24+i],stem,options,answer:options[n],accept:[options[n]],focus_lesson:focus,rules:[challengeRules[i]],level:3,why:explanation+' Le altre alternative modificano il significato o attribuiscono alla forma una regola troppo rigida.'};});
 }
 return items.map((item,i)=>({...item,difficulty:i<5?1:i<12?2:i<24?3:4,difficulty_label:i<5?'Base · costruisci la forma':i<12?'Comprendi forma e significato':i<24?'Applica · negazioni e domande':'Approfondisci · contesto e alternative'}));

}

// Contesti originali per il percorso. Le operazioni sullo stesso evento condividono
// l'identità: cambiare consegna o forma non crea una nuova prova indipendente.
const pathScenarios=[
 ['The porter','open','opened','opened','opening','the main gate','the side entrance'],
 ['The driver','leave','left','left','leaving','the depot','the service station'],
 ['The clerk','send','sent','sent','sending','the appointment letters','the updated timetable'],
 ['The technician','test','tested','tested','testing','the fire alarm','the emergency lights'],
 ['The plumber','repair','repaired','repaired','repairing','the damaged pipe','the leaking tap'],
 ['The archivist','file','filed','filed','filing','the signed forms','the delivery notes'],
 ['The engineer','measure','measured','measured','measuring','the water pressure','the room temperature'],
 ['The interpreter','translate','translated','translated','translating','the witness statement','the safety instructions'],
 ['The investigator','interview','interviewed','interviewed','interviewing','the main witness','the bus driver'],
 ['The pharmacist','order','ordered','ordered','ordering','the essential supplies','the replacement equipment'],
 ['The coordinator','arrange','arranged','arranged','arranging','the next briefing','the training session'],
 ['The controller','monitor','monitored','monitored','monitoring','the radio channel','the emergency line'],
 ['The analyst','compare','compared','compared','comparing','the two maps','the laboratory results'],
 ['The mechanic','replace','replaced','replaced','replacing','the worn tyre','the damaged battery'],
 ['The warden','search','searched','searched','searching','the storage room','the empty workshop'],
 ['The receptionist','record','recorded','recorded','recording','the caller’s details','the visitor’s request'],
 ['The inspector','read','read','read','reading','the maintenance log','the incident report'],
 ['The courier','deliver','delivered','delivered','delivering','the sealed parcel','the confidential envelope']
];
export const FOUNDATION_LESSONS=['sentence',...CORE_LESSONS];
export function pathFoundationItems(id){
 if(!FOUNDATION_LESSONS.includes(id))return [];
 const out=[],available=lessonRules(id).map(r=>r.key);
 for(const [index,row] of pathScenarios.entries())for(let variant=0;variant<2;variant++){
  const [actor,base,past,part,ing]=row,object=row[5+variant],v=[base,past,part,ing],n=index*2+variant;
  const context_id=id+':foundation-event:'+n,make=(rule,level,stem,answer,kind='completion',options=[],why='')=>({id:context_id+':'+rule+':'+level,context_id,kind,stem,answer,accept:[answer],options,why,origin:'local',focus_lesson:id,rules:[id+'.'+rule],level,skill:level===1?'meaning':'form'});
  if(id==='sentence'){
   const verb=third(v),sentence=actor+' '+verb+' '+object+'.';
   out.push(make('subj',1,'Qual è il soggetto in: '+sentence,actor,'choice',[actor,object,verb],'Il soggetto è '+actor+': è la persona di cui si afferma l’azione.'));
   out.push(make('role',1,'Chi compie l’azione in: '+sentence,actor,'choice',[actor,object,verb],'La frase attiva presenta '+actor+' come chi compie l’azione.'));
   out.push(make('svo',1,'Scegli l’ordine corretto: '+object+' / '+actor+' / '+verb+'.',sentence,'choice',[sentence,verb+' '+object+' '+actor+'.',object+' '+actor+' '+verb+'.'],'L’ordine neutro affermativo è soggetto, verbo, oggetto: '+sentence));
   out.push(make('agr',1,'Scegli la forma corretta: '+actor+' ___ '+object+'.',verb,'choice',[verb,base,ing],'Il soggetto singolare richiede la terza persona singolare del present simple.'));
   out.push(make('agr',2,'Scrivi solo la parola mancante: '+actor+' ___ '+object+' every week. ('+base+')',verb,'completion',[],'Il soggetto singolare concorda con '+verb+'.'));
   continue;
  }
  const [name,time,affirm,negative,aux,tail,why]=rules[id],group=contrasts(id),sentence=contextSentence(id,actor,v,object);
  out.push(make('use',1,'Scegli il significato: '+sentence,meanings[id],'choice',group.map(k=>meanings[k]),why+' Il contesto presenta '+meanings[id]+'.'));
  if(available.includes('contrast'))out.push(make('contrast',1,'Quale interpretazione corrisponde a: '+sentence,meanings[id],'choice',group.map(k=>meanings[k]),'Confronta il riferimento temporale e il significato. '+why));
  out.push(make('form',2,'Scrivi solo ciò che manca ('+name+'): '+time+', '+actor.toLowerCase()+' ___ '+object+'. ('+base+')',affirm(v),'completion',[],why));
  const when=time[0].toLowerCase()+time.slice(1),full=actor+' '+affirm(v)+' '+object+' '+when+'.';
  out.push(make('neg',2,'Riscrivi la frase negativa'+(id==='obligation'?' esprimendo un divieto':'')+': '+full,actor+' '+negative+' '+tail(v)+' '+object+' '+when+'.','transformation',[],why));
  out.push(make('q',2,'Trasforma in domanda, iniziando con '+cap(aux)+': '+full,cap(aux)+' '+actor.toLowerCase()+' '+tail(v)+' '+object+' '+when+'?','transformation',[],why));
 }
 return out;
}
