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
  if(!object(p))throw new Error("Il tutor non ha restituito un oggetto JSON.");
  const bad=()=>{throw new Error("La risposta del tutor è incompleta. Il lavoro è salvato; puoi riprovare.");};
  if(task==="exercises") {
    if(!arr(p.items,6)||p.items.length!==6)bad();
    const kinds=new Set();
    for(const i of p.items) {
      if(!object(i)||!str(i.stem)||!str(i.answer,600)||!str(i.why)||!["choice","completion","transformation","error_correction"].includes(i.kind)||!arr(i.options,4)||!arr(i.accept,8)||i.accept.some(x=>!str(x,600)))bad();
      if(i.kind==="choice"&&(i.options.length<3||new Set(i.options).size!==i.options.length||!i.options.includes(i.answer)))bad();
      if(i.kind!=="choice"&&i.options.length)bad();
      if(i.options.some(x=>!str(x,600)))bad();
      kinds.add(i.kind);
    }
    if(kinds.size<3)bad();
  } else if(task==="writing_review") {
    if(!str(p.summary)||!arr(p.priorities,3)||p.priorities.some(x=>!str(x))||!arr(p.issues,8)||!object(p.rubric))bad();
    for(const key of ["grammar","content","cohesion","register"])if(!str(p.rubric[key]))bad();
    for(const i of p.issues)if(!object(i)||!str(i.quote,500)||!str(i.correction,800)||!str(i.explanation)||!["error","style"].includes(i.kind)||!str(i.category,100))bad();
  } else if(task==="writing_compare") {
    if(!str(p.summary)||!arr(p.resolved,8)||!arr(p.remaining,8)||!arr(p.transfer,3)||p.transfer.length!==3)bad();
    for(const v of [...p.resolved,...p.remaining])if(!str(v))bad();
    for(const i of p.transfer)if(!object(i)||!str(i.stem)||!str(i.answer,600)||!arr(i.accept,8)||i.accept.some(x=>!str(x,600))||!str(i.why))bad();
  } else if(task==="reading_review") {
    if(!str(p.summary)||!arr(p.segments,6)||!arr(p.terms,5))bad();
    for(const s of p.segments)if(!object(s)||!str(s.quote,800)||!str(s.translation,1400)||!str(s.explanation))bad();
    for(const t of p.terms)if(!object(t)||!str(t.expression,120)||!str(t.meaning_it,300)||!str(t.example,500))bad();
  } else if(task==="clarify") {
    if(!str(p.expression,120)||!str(p.meaning_it,300)||!str(p.explanation)||!str(p.example,500))bad();
  } else bad();
  return p;
}
export const SHAPES={
  exercises:{items:[{kind:"completion",stem:"Consegna in italiano + frase inglese incompleta",options:[],answer:"risposta inglese",accept:["variante valida"],why:"spiegazione italiana"}]},
  writing_review:{summary:"Valutazione italiana",priorities:["massimo tre priorità"],rubric:{grammar:"valutazione",content:"valutazione",cohesion:"valutazione",register:"valutazione"},issues:[{quote:"citazione esatta presente nel testo",correction:"correzione minima",explanation:"regola e motivo",kind:"error",category:"negatives"}]},
  writing_compare:{summary:"confronto concreto",resolved:["errore realmente risolto"],remaining:["errore ancora presente"],transfer:[{stem:"Nuovo esercizio con contesto diverso",answer:"risposta",accept:["variante"],why:"spiegazione"}]},
  reading_review:{summary:"valutazione della traduzione",segments:[{quote:"citazione inglese esatta",translation:"traduzione italiana",explanation:"spiegazione"}],terms:[{expression:"termine presente nel testo",meaning_it:"significato contestuale",example:"esempio inglese originale"}]},
  clarify:{expression:"termine richiesto",meaning_it:"significato contestuale",explanation:"spiegazione italiana della costruzione e del registro",example:"esempio inglese originale"}
};
