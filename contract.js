export const TASKS=["exercises","grammar_explain","writing_coach","writing_review","writing_compare","reading_review","reading_understand","clarify"];
const object=x=>x&&typeof x==="object"&&!Array.isArray(x);
const str=(x,max=1600)=>typeof x==="string"&&x.trim().length>0&&x.length<=max;
const arr=(x,max)=>Array.isArray(x)&&x.length<=max;
export function validateInput(task,d) {
  if(!TASKS.includes(task)||!object(d))throw new Error("Richiesta del tutor non riconosciuta.");
  if(JSON.stringify(d).length>26000)throw new Error("Il testo è troppo lungo: usa un passaggio più breve.");
  if(task==="exercises"&&(!str(d.lesson_id,100)||!arr(d.terms||[],3)))throw new Error("Manca una lezione valida.");
  if(task==="grammar_explain"&&(!str(d.lesson_id,100)||d.question!==undefined&&(typeof d.question!=="string"||d.question.length>500)))throw new Error("Manca la lezione o la domanda è troppo lunga.");
  if(task==="writing_coach") {
    if(!["report","email","argument"].includes(d.type)||!str(d.unit_id,100)||!Number.isInteger(d.stage)||d.stage<0||d.stage>5||!Number.isInteger(d.round)||d.round<0||d.round>1000||!["hint","review"].includes(d.mode)||!str(d.topic,2000)||typeof d.text!=="string"||d.text.length>6000||d.mode==="review"&&!str(d.text,6000)||typeof d.question!=="string"||d.question.length>500)throw new Error("Passo del percorso o testo non valido.");
  }
  if(["writing_review","writing_compare"].includes(task)&&(!["report","email","argument"].includes(d.type)||!str(d.topic,2000)||!str(d.text,12000)))throw new Error("Mancano consegna o testo dello scritto.");
  if(["writing_review","writing_coach"].includes(task)&&d.lesson_id!==undefined&&!str(d.lesson_id,100))throw new Error("Riferimento alla lezione non valido.");
  if(task==="writing_compare"&&!str(d.rewrite,12000))throw new Error("Manca la riscrittura.");
  if(task==="reading_review"&&(!str(d.text,8000)||!str(d.translation,12000)))throw new Error("Mancano testo o traduzione.");
  if(task==="reading_understand"&&(!str(d.text,8000)||typeof d.selection!=="string"||d.selection.length>120||d.selection.trim()&&!d.text.includes(d.selection.trim())))throw new Error("Incolla un testo e scegli un'espressione presente nel passaggio (massimo 120 caratteri).");
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
  } else if(task==="grammar_explain") {
    needString(p.summary,"summary");needString(p.form,"form");needString(p.contrast,"contrast");
    needArray(p.when,"when",4);strings(p.when,"when");if(!p.when.length)bad("when","serve almeno un uso");
    needArray(p.pitfalls,"pitfalls",3);strings(p.pitfalls,"pitfalls");if(!p.pitfalls.length)bad("pitfalls","serve almeno un punto da controllare");
    needArray(p.examples,"examples",3);if(p.examples.length<2)bad("examples","servono due o tre esempi");
    for(const [n,e] of p.examples.entries()){needObject(e,"examples["+n+"]");needString(e.en,"examples["+n+"].en",400);needString(e.it,"examples["+n+"].it",400);needString(e.why,"examples["+n+"].why",1200);}
  } else if(task==="writing_coach") {
    needString(p.summary,"summary");needString(p.next_step,"next_step",800);
    if(typeof p.ready!=="boolean")bad("ready","deve essere booleano");
    needArray(p.focus,"focus",3);if(!p.focus.length)bad("focus","serve almeno una spiegazione della forma");
    for(const [n,f] of p.focus.entries()){needObject(f,"focus["+n+"]");for(const [key,max] of [["form",300],["meaning_it",300],["why",1200],["example_en",400]])needString(f[key],"focus["+n+"]."+key,max);}
    needArray(p.issues,"issues",2);
    for(const [n,i] of p.issues.entries()){needObject(i,"issues["+n+"]");needString(i.quote,"issues["+n+"].quote",300);needString(i.correction,"issues["+n+"].correction",400);needString(i.explanation,"issues["+n+"].explanation",1200);needString(i.category,"issues["+n+"].category",100);if(!["error","style"].includes(i.kind))bad("issues["+n+"].kind","deve distinguere error e style");}
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
  } else if(task==="reading_understand") {
    needString(p.summary,"summary");needArray(p.segments,"segments",3);needArray(p.terms,"terms",5);needArray(p.questions,"questions",3);
    for(const [n,x] of p.segments.entries())for(const [k,max] of [["quote",800],["meaning_it",1400],["why",1600]])needString(x?.[k],"segments["+n+"]."+k,max);
    for(const [n,x] of p.terms.entries())for(const [k,max] of [["expression",120],["meaning_it",300],["quote",800],["why",1200],["register",200],["alternative",500],["example",500]])needString(x?.[k],"terms["+n+"]."+k,max);
    for(const [n,x] of p.questions.entries())for(const [k,max] of [["question",500],["answer",800],["quote",800]])needString(x?.[k],"questions["+n+"]."+k,max);

  } else if(task==="clarify") {
    needString(p.expression,"expression",120);needString(p.meaning_it,"meaning_it",300);needString(p.explanation,"explanation");needString(p.example,"example",500);
  } else bad("task","funzione non riconosciuta");
  return p;
}
export function sanitizeCoach(result,text,mode) {
  const issues=result.issues.filter(i=>text.includes(i.quote));
  const omitted=(Number.isInteger(result.omitted)?result.omitted:0)+result.issues.length-issues.length;
  return {...result,issues,ready:mode==="review"&&result.ready&&omitted===0&&!issues.some(i=>i.kind==="error"),...(omitted?{omitted}:{} )};
}
// Use the documented Groq strict subset. Counts, text lengths and relationships
// between fields are described here and enforced by validateReply above.
const replyText=(max=1600)=>({type:"string",description:"Testo non vuoto, massimo "+max+" caratteri."});
const replyObject=properties=>({type:"object",properties,required:Object.keys(properties),additionalProperties:false});
const replyList=(items,description)=>({type:"array",items,description});
const transferFields={stem:replyText(),answer:replyText(600),accept:replyList(replyText(600),"Massimo 8 risposte inglesi accettabili."),why:replyText()};
export const REPLY_SCHEMAS={
  grammar_explain:replyObject({summary:replyText(),form:replyText(),when:replyList(replyText(),"Da 1 a 4 usi."),examples:replyList(replyObject({en:replyText(400),it:replyText(400),why:replyText(1200)}),"Due o tre esempi inglesi originali, con traduzione e motivazione."),contrast:replyText(),pitfalls:replyList(replyText(),"Da 1 a 3 errori tipici pertinenti.")}),
  writing_coach:replyObject({summary:replyText(),focus:replyList(replyObject({form:replyText(300),meaning_it:replyText(300),why:replyText(1200),example_en:replyText(400)}),"Da 1 a 3 forme spiegate, con esempio in un altro contesto."),issues:replyList(replyObject({quote:replyText(300),correction:replyText(400),explanation:replyText(1200),kind:{type:"string",enum:["error","style"]},category:replyText(100)}),"Da 0 a 2 osservazioni con citazione letterale del testo dello studente."),next_step:replyText(800),ready:{type:"boolean",description:"True solo per una revisione senza errori prioritari e con le funzioni richieste presenti. Sempre false per un aiuto."}}),
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
  reading_understand:replyObject({summary:replyText(),segments:replyList(replyObject({quote:replyText(800),meaning_it:replyText(1400),why:replyText()}),"Da 1 a 3 passaggi esatti, significato e costruzione."),terms:replyList(replyObject({expression:replyText(120),meaning_it:replyText(300),quote:replyText(800),why:replyText(1200),register:replyText(200),alternative:replyText(500),example:replyText(500)}),"Da 1 a 5 termini testuali; se selection è presente includila. Quote contiene expression esattamente."),questions:replyList(replyObject({question:replyText(500),answer:replyText(800),quote:replyText(800)}),"Da 1 a 3 domande in italiano sul senso con risposta e prova testuale esatta.")}),
  clarify:replyObject({expression:replyText(120),meaning_it:replyText(300),explanation:replyText(),example:replyText(500)})
};
export const SHAPES={
  grammar_explain:{summary:"Distingui il fatto concluso dalla situazione collegata al presente.",form:"Past simple: soggetto + passato; present perfect: soggetto + have/has + participio.",when:["Past simple con un momento passato concluso.","Present perfect per un risultato attuale senza tempo passato concluso."],examples:[{en:"We checked the door yesterday.",it:"Abbiamo controllato la porta ieri.",why:"Yesterday identifica un tempo concluso."},{en:"We have checked the door, so it is safe now.",it:"Abbiamo controllato la porta, quindi ora è sicura.",why:"Il risultato interessa il presente."}],contrast:"Il contesto decide; una forma non sostituisce sempre l'altra.",pitfalls:["Non usare il present perfect con yesterday in questo significato."]},
  writing_coach:{summary:"Lo scopo è comprensibile.",focus:[{form:"Could you + verbo base",meaning_it:"Potrebbe…?",why:"Una richiesta cortese usa il verbo base dopo could.",example_en:"Could you confirm the address?"}],issues:[],next_step:"Controlla che il destinatario trovi tutte le informazioni richieste.",ready:false},
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
  reading_understand:{summary:"Il gruppo ha controllato il cancello; il testo presenta un risultato attuale.",segments:[{quote:"The officers have checked the gate.",meaning_it:"Gli agenti hanno controllato il cancello.",why:"Il present perfect collega il controllo al presente."}],terms:[{expression:"checked",meaning_it:"controllato",quote:"The officers have checked the gate.",why:"Checked indica un controllo, non necessariamente una riparazione.",register:"Neutro",alternative:"Inspected suggerisce spesso un esame più sistematico; non è sempre equivalente.",example:"The technician checked the cable."}],questions:[{question:"Che cosa hanno controllato gli agenti?",answer:"Il cancello.",quote:"The officers have checked the gate."}]},
  clarify:{expression:"termine richiesto",meaning_it:"significato contestuale",explanation:"spiegazione italiana della costruzione e del registro",example:"esempio inglese originale"}
};

export function anchorReading(result,text) {
  const segments=result.segments.filter(x=>text.includes(x.quote));
  const terms=result.terms.filter(x=>text.includes(x.quote)&&x.quote.includes(x.expression));
  const questions=result.questions.filter(x=>text.includes(x.quote));
  return {...result,segments,terms,questions,omitted:(Number.isInteger(result.omitted)?result.omitted:0)+result.segments.length+result.terms.length+result.questions.length-segments.length-terms.length-questions.length};
}
