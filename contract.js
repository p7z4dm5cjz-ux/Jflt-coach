export const TASKS=["exercises","writing_review","writing_compare","reading_review","clarify"];
const object=x=>x&&typeof x==="object"&&!Array.isArray(x);
const str=(x,max=1600)=>typeof x==="string"&&x.trim().length>0&&x.length<=max;
const arr=(x,max)=>Array.isArray(x)&&x.length<=max;
export function validateInput(task,d) {
  if(!TASKS.includes(task)||!object(d))throw new Error("Richiesta del tutor non riconosciuta.");
  if(JSON.stringify(d).length>26000)throw new Error("Il testo è troppo lungo: usa un passaggio più breve.");
  if(task==="exercises"&&(!str(d.lesson_id,100)||!arr(d.terms||[],3)))throw new Error("Manca una lezione valida.");
  if(task.startsWith("writing")&&(!["report","email","argument"].includes(d.type)||!str(d.topic,2000)||!str(d.text,12000)))throw new Error("Mancano consegna o testo dello scritto.");
  if(task==="writing_compare"&&!str(d.rewrite,12000))throw new Error("Manca la riscrittura.");
  if(task==="reading_review"&&(!str(d.text,8000)||!str(d.translation,12000)))throw new Error("Mancano testo o traduzione.");
  if(task==="clarify"&&(!str(d.term,120)||!str(d.context,1200)))throw new Error("Seleziona un termine e il suo contesto.");
  return d;
}
export function validateReply(task,p) {
  const bad=(path,reason)=>{
    const error=new Error("La risposta del tutor è incompleta ("+path+": "+reason+"). Il lavoro è salvato; puoi riprovare.");
    error.replyIssue={path,reason};
    throw error;
  };
  const needObject=(v,path)=>{if(!object(v))bad(path,"deve essere un oggetto");};
  const needString=(v,path,max=1600)=>{if(!str(v,max))bad(path,"manca un testo valido (massimo "+max+" caratteri)");};
  const needArray=(v,path,max)=>{if(!arr(v,max))bad(path,"manca un elenco valido (massimo "+max+" elementi)");};
  const strings=(v,path,max=1600)=>v.forEach((s,n)=>needString(s,path+"["+n+"]",max));
  const exercise=(i,path)=>{
    needObject(i,path);
    needString(i.stem,path+".stem");needString(i.answer,path+".answer",600);needString(i.why,path+".why");
    needArray(i.accept,path+".accept",8);strings(i.accept,path+".accept",600);
  };
  needObject(p,"$");
  if(task==="exercises") {
    needArray(p.items,"items",6);
    if(p.items.length!==6)bad("items","sono richiesti esattamente 6 esercizi");
    const kinds=new Set();
    for(const [n,i] of p.items.entries()) {
      const path="items["+n+"]";
      exercise(i,path);
      if(!["choice","completion","transformation","error_correction"].includes(i.kind))bad(path+".kind","tipo di esercizio non riconosciuto");
      needArray(i.options,path+".options",4);strings(i.options,path+".options",600);
      if(i.kind==="choice"&&i.options.length<3)bad(path+".options","servono almeno 3 opzioni");
      if(i.kind==="choice"&&new Set(i.options).size!==i.options.length)bad(path+".options","le opzioni devono essere diverse");
      if(i.kind==="choice"&&!i.options.includes(i.answer))bad(path+".answer","la soluzione non coincide con una delle opzioni");
      if(i.kind!=="choice"&&i.options.length)bad(path+".options","l'elenco deve essere vuoto per questo tipo di esercizio");
      kinds.add(i.kind);
    }
    if(kinds.size<3)bad("items.kind","sono richiesti almeno 3 tipi di esercizio diversi");
  } else if(task==="writing_review") {
    needString(p.summary,"summary");needArray(p.priorities,"priorities",3);strings(p.priorities,"priorities");
    needArray(p.issues,"issues",8);needObject(p.rubric,"rubric");
    for(const key of ["grammar","content","cohesion","register"])needString(p.rubric[key],"rubric."+key);
    for(const [n,i] of p.issues.entries()) {
      const path="issues["+n+"]";needObject(i,path);
      needString(i.quote,path+".quote",500);needString(i.correction,path+".correction",800);needString(i.explanation,path+".explanation");
      if(!["error","style"].includes(i.kind))bad(path+".kind","deve distinguere error e style");
      needString(i.category,path+".category",100);
    }
  } else if(task==="writing_compare") {
    needString(p.summary,"summary");
    for(const key of ["resolved","remaining"]){needArray(p[key],key,8);strings(p[key],key);}
    needArray(p.transfer,"transfer",3);if(p.transfer.length!==3)bad("transfer","sono richiesti esattamente 3 esercizi");
    for(const [n,i] of p.transfer.entries())exercise(i,"transfer["+n+"]");
  } else if(task==="reading_review") {
    needString(p.summary,"summary");needArray(p.segments,"segments",6);needArray(p.terms,"terms",5);
    for(const [n,s] of p.segments.entries()){const path="segments["+n+"]";needObject(s,path);needString(s.quote,path+".quote",800);needString(s.translation,path+".translation",1400);needString(s.explanation,path+".explanation");}
    for(const [n,t] of p.terms.entries()){const path="terms["+n+"]";needObject(t,path);needString(t.expression,path+".expression",120);needString(t.meaning_it,path+".meaning_it",300);needString(t.example,path+".example",500);}
  } else if(task==="clarify") {
    needString(p.expression,"expression",120);needString(p.meaning_it,"meaning_it",300);needString(p.explanation,"explanation");needString(p.example,"example",500);
  } else bad("task","funzione non riconosciuta");
  return p;
}
// Use the documented Groq strict subset. Counts, text lengths and relationships
// between fields are described here and enforced by validateReply above.
const replyText=(max=1600)=>({type:"string",description:"Testo non vuoto, massimo "+max+" caratteri."});
const replyObject=properties=>({type:"object",properties,required:Object.keys(properties),additionalProperties:false});
const replyList=(items,description)=>({type:"array",items,description});
const transferFields={stem:replyText(),answer:replyText(600),accept:replyList(replyText(600),"Massimo 8 risposte inglesi accettabili."),why:replyText()};
export const REPLY_SCHEMAS={
  exercises:replyObject({items:replyList(replyObject({
    kind:{type:"string",enum:["choice","completion","transformation","error_correction"]},
    stem:replyText(),
    options:replyList(replyText(600),"Choice: 3 o 4 opzioni diverse. Per gli altri tipi: elenco vuoto []."),
    answer:replyText(600),accept:transferFields.accept,why:replyText()
  }),"Esattamente 6 esercizi; almeno 3 tipi diversi.")}),
  writing_review:replyObject({summary:replyText(),priorities:replyList(replyText(),"Da 0 a 3 priorità."),
    rubric:replyObject({grammar:replyText(),content:replyText(),cohesion:replyText(),register:replyText()}),
    issues:replyList(replyObject({quote:replyText(500),correction:replyText(800),explanation:replyText(),kind:{type:"string",enum:["error","style"]},category:replyText(100)}),"Da 0 a 8 osservazioni ancorate al testo.")}),
  writing_compare:replyObject({summary:replyText(),resolved:replyList(replyText(),"Da 0 a 8 errori risolti."),remaining:replyList(replyText(),"Da 0 a 8 errori ancora presenti."),transfer:replyList(replyObject(transferFields),"Esattamente 3 esercizi in nuovi contesti.")}),
  reading_review:replyObject({summary:replyText(),segments:replyList(replyObject({quote:replyText(800),translation:replyText(1400),explanation:replyText()}),"Da 0 a 6 passaggi, con citazioni esatte del testo inglese."),terms:replyList(replyObject({expression:replyText(120),meaning_it:replyText(300),example:replyText(500)}),"Da 0 a 5 termini presenti nel testo.")}),
  clarify:replyObject({expression:replyText(120),meaning_it:replyText(300),explanation:replyText(),example:replyText(500)})
};
export const SHAPES={
  exercises:{items:[
    {kind:"choice",stem:"Scegli la forma corretta: They ___ on duty.",options:["am","is","are"],answer:"are",accept:["are"],why:"They richiede are."},
    {kind:"choice",stem:"Scegli il past simple di go.",options:["goed","went","gone"],answer:"went",accept:["went"],why:"Go ha il past simple irregolare went."},
    {kind:"completion",stem:"Completa con il past simple di leave: She ___ yesterday.",options:[],answer:"left",accept:["left"],why:"Il past simple di leave è left."},
    {kind:"completion",stem:"Completa con il present perfect simple di finish: We ___ the report.",options:[],answer:"have finished",accept:["have finished"],why:"Con we si usa have + participio."},
    {kind:"transformation",stem:"Rendi negativa con didn't: They checked the gate.",options:[],answer:"They didn't check the gate.",accept:["They didn't check the gate.","They did not check the gate."],why:"Dopo did il verbo è alla forma base."},
    {kind:"error_correction",stem:"Correggi l'unico errore: She doesn't works here.",options:[],answer:"She doesn't work here.",accept:["She doesn't work here.","She does not work here."],why:"Dopo doesn't si usa work, senza -s."}
  ]},
  writing_review:{summary:"Valutazione italiana",priorities:["massimo tre priorità"],rubric:{grammar:"valutazione",content:"valutazione",cohesion:"valutazione",register:"valutazione"},issues:[{quote:"citazione esatta presente nel testo",correction:"correzione minima",explanation:"regola e motivo",kind:"error",category:"negatives"}]},
  writing_compare:{summary:"confronto concreto",resolved:["errore realmente risolto"],remaining:["errore ancora presente"],transfer:[1,2,3].map(n=>({stem:"Nuovo esercizio "+n+" con contesto diverso",answer:"risposta",accept:["risposta","variante"],why:"spiegazione"}))},
  reading_review:{summary:"valutazione della traduzione",segments:[{quote:"citazione inglese esatta",translation:"traduzione italiana",explanation:"spiegazione"}],terms:[{expression:"termine presente nel testo",meaning_it:"significato contestuale",example:"esempio inglese originale"}]},
  clarify:{expression:"termine richiesto",meaning_it:"significato contestuale",explanation:"spiegazione italiana della costruzione e del registro",example:"esempio inglese originale"}
};
