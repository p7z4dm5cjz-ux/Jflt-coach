export const TASKS=["exercises","grammar_explain","writing_coach","writing_review","writing_compare","reading_review","reading_understand","reading_test","translate","clarify","diagnosis","path_block"];
const object=x=>x&&typeof x==="object"&&!Array.isArray(x);
const str=(x,max=1600)=>typeof x==="string"&&x.trim().length>0&&x.length<=max;
const arr=(x,max)=>Array.isArray(x)&&x.length<=max;
export function validateInput(task,d) {
  if(!TASKS.includes(task)||!object(d))throw new Error("Richiesta del tutor non riconosciuta.");
  if(JSON.stringify(d).length>26000)throw new Error("Il testo è troppo lungo: usa un passaggio più breve.");
  if(task==="exercises"&&(!str(d.lesson_id,100)||!arr(d.terms||[],3)))throw new Error("Manca una lezione valida.");
  if(task==="grammar_explain"&&(!str(d.lesson_id,100)||d.question!==undefined&&(typeof d.question!=="string"||d.question.length>500)))throw new Error("Manca la lezione o la domanda è troppo lunga.");
  if(task==="writing_coach") {
    if(!["report","email","argument"].includes(d.type)||!str(d.unit_id,100)||!Number.isInteger(d.stage)||d.stage<0||d.stage>5||!Number.isInteger(d.round)||d.round<0||d.round>1000||!["hint","review"].includes(d.mode)||!str(d.topic,2000)||typeof d.text!=="string"||d.text.length>6000||d.mode==="review"&&!str(d.text,6000)||typeof d.question!=="string"||d.question.length>500||d.task!==undefined&&(!Number.isInteger(d.task)||d.task<0||d.task>9))throw new Error("Passo del percorso o testo non valido.");
  }
  if(["writing_review","writing_compare"].includes(task)&&(!["report","email","argument"].includes(d.type)||!str(d.topic,2000)||!str(d.text,12000)))throw new Error("Mancano consegna o testo dello scritto.");
  if(["writing_review","writing_coach"].includes(task)&&d.lesson_id!==undefined&&!str(d.lesson_id,100))throw new Error("Riferimento alla lezione non valido.");
  if(task==="writing_compare"&&!str(d.rewrite,12000))throw new Error("Manca la riscrittura.");
  if(task==="reading_review"&&(!str(d.text,8000)||!str(d.translation,12000)))throw new Error("Mancano testo o traduzione.");
  if(task==="reading_understand"&&(!str(d.text,8000)||typeof d.selection!=="string"||d.selection.length>120||d.selection.trim()&&!d.text.includes(d.selection.trim())))throw new Error("Incolla un testo e scegli un'espressione presente nel passaggio (massimo 120 caratteri).");
  if(task==="reading_test"&&(!str(d.text,8000)||(d.text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length<120))throw new Error("Incolla un testo inglese di almeno 120 parole (massimo 8.000 caratteri).");
  if(task==="translate"&&(!arr(d.paragraphs,40)||!d.paragraphs.length||d.paragraphs.some(x=>!str(x,3000))||d.paragraphs.join("").length>3200))throw new Error("Testo da tradurre non valido: massimo 3.200 caratteri per richiesta.");
  if(task==="clarify"&&(!str(d.term,120)||!str(d.context,1200)))throw new Error("Seleziona un termine e il suo contesto.");
  if(task==="diagnosis"){
    const okArea=a=>object(a)&&str(a.area,60)&&Number.isInteger(a.correct)&&Number.isInteger(a.total)&&a.total>0&&a.correct>=0&&a.correct<=a.total;
    const okError=e=>object(e)&&str(e.area,60)&&arr(e.lessons,4)&&e.lessons.every(x=>str(x,100))&&str(e.stem,1600)&&typeof e.given==="string"&&e.given.length<=350&&str(e.expected,600);
    if(!arr(d.areas,8)||!d.areas.length||!d.areas.every(okArea)||!arr(d.errors,25)||!d.errors.length||!d.errors.every(okError))throw new Error("Servono le aree e almeno una risposta sbagliata del pretest (massimo 25).");
  }
  if(["exercises","grammar_explain"].includes(task)&&d.learner!==undefined)validateLearner(d.learner,d.lesson_id);
  if(task==="path_block")validatePathInput(d);
  return d;
}
// ---- Percorso adattivo: blocco da 5 esercizi con regola e livello assegnati dall'app ----
export const PATH_ROLES=["main","recovery","intertwined","review"];
export const PATH_KINDS=["choice","completion","transformation","error_correction"];
export const PATH_STEM_MAX=220;
export function validatePathInput(d){
  const okSlot=(s,n)=>object(s)&&s.n===n+1&&str(s.lesson_id,100)&&str(s.rule,120)&&s.rule.startsWith(s.lesson_id+".")&&Number.isInteger(s.level)&&s.level>=1&&s.level<=4&&PATH_ROLES.includes(s.role)&&(s.group===null||/^p[1-4]$/.test(s.group||""));
  if(!str(d.path_id,100)||!Number.isInteger(d.cycle)||d.cycle<1||d.cycle>8||!Number.isInteger(d.page)||d.page<0||d.page>2||!str(d.main_lesson,100)||!Number.isInteger(d.main_level)||d.main_level<1||d.main_level>4)throw new Error("Blocco del percorso non valido.");
  if(!arr(d.slots,5)||d.slots.length!==5||!d.slots.every(okSlot))throw new Error("Servono 5 esercizi con lezione, regola e livello.");
  const groups=d.slots.filter(s=>s.group);
  if(d.phase!==undefined&&!["focused","mixed","transfer"].includes(d.phase))throw new Error("Fase del percorso non valida.");
  if(groups.length&&(groups.length!==(d.phase==="transfer"?5:3)||new Set(groups.map(s=>s.group)).size!==1||groups.some(s=>s.level!==4)))throw new Error("Numero o livello degli spazi del testo non valido.");
  if(d.phase==="transfer"&&groups.length!==5)throw new Error("La verifica richiede un testo con cinque spazi.");
  if(d.avoid_passages!==undefined&&(!arr(d.avoid_passages,6)||d.avoid_passages.some(x=>!str(x,900))))throw new Error("Testi già visti non validi.");
  if(d.avoid!==undefined&&(!arr(d.avoid,40)||d.avoid.some(x=>!str(x,PATH_STEM_MAX))))throw new Error("Elenco delle frasi già viste non valido.");
  if(d.weak_rules!==undefined&&(!arr(d.weak_rules,8)||d.weak_rules.some(r=>!object(r)||!str(r.rule,120)||!Number.isInteger(r.n)||!Number.isInteger(r.correct)||r.n<1||r.correct<0||r.correct>r.n)))throw new Error("Regole deboli non valide.");
  return d;
}
export const gapMark=k=>"("+k+") ___";
export function validateReply(task,p,data=null) {
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
    if(p.assessment!==undefined)validateAssessment(p.assessment);
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
  } else if(task==="path_block") {
    needArray(p.items,"items",5);if(p.items.length!==5)bad("items","sono richiesti esattamente 5 esercizi");
    needArray(p.passages,"passages",1);
    const slots=data?.slots||[],group=slots.find(s=>s.group)?.group||null;
    for(const [n,x] of p.passages.entries()){needObject(x,"passages["+n+"]");needString(x.text,"passages["+n+"].text",900);if(x.group!==group)bad("passages["+n+"].group","gruppo del testo non richiesto");}
    if(group&&p.passages.length!==1)bad("passages","serve un testo per gli spazi del livello 4");
    if(!group&&p.passages.length)bad("passages","il testo è previsto solo con gli spazi del livello 4");
    if(group){const marks=[...p.passages[0].text.matchAll(/\((\d+)\) ___/g)].map(m=>Number(m[1]));const expected=slots.filter(s=>s.group).length;if(marks.length>expected||new Set(marks).size!==marks.length||marks.length===expected&&marks.some((k,n)=>k!==n+1))bad("passages[0].text","gli spazi sono duplicati o fuori ordine");}
    let gap=0;
    for(const [n,i] of p.items.entries()){
      const path="items["+n+"]",slot=slots[n];
      exercise(i,path);
      if(i.stem.length>PATH_STEM_MAX)bad(path+".stem","consegna troppo lunga (massimo "+PATH_STEM_MAX+" caratteri)");
      if(i.n!==n+1)bad(path+".n","numero dell'esercizio fuori ordine");
      if(!PATH_KINDS.includes(i.kind))bad(path+".kind","tipo di esercizio non riconosciuto");
      needArray(i.options,path+".options",4);strings(i.options,path+".options",600);
      if(i.kind==="choice"&&(i.options.length<3||new Set(i.options).size!==i.options.length||!i.options.includes(i.answer)))bad(path+".options","servono 3 o 4 opzioni diverse che contengano la soluzione");
      if(i.kind!=="choice"&&i.options.length)bad(path+".options","l'elenco deve essere vuoto per questo tipo di esercizio");
      if(typeof i.group!=="string")bad(path+".group","manca il gruppo (stringa vuota se assente)");
      if(slot){
        if((slot.group||"")!==i.group)bad(path+".group","gruppo diverso da quello richiesto");
        if(slot.level===1&&i.kind!=="choice")bad(path+".kind","il livello 1 richiede una scelta");
        if(slot.level===2&&i.kind==="choice")bad(path+".kind","il livello 2 richiede di produrre la forma");
        if(slot.group){gap++;if(i.kind!=="completion")bad(path+".kind","gli spazi del testo sono completamenti");if(!i.stem.startsWith("Spazio ("+gap+")"))bad(path+".stem","deve iniziare con «Spazio ("+gap+")»");if(!p.passages[0]?.text.includes(gapMark(gap)))bad("passages[0].text","manca lo spazio "+gapMark(gap));}
      }
    }
  } else if(task==="grammar_explain") {
    needString(p.summary,"summary");needString(p.form,"form");needString(p.contrast,"contrast");
    needArray(p.when,"when",4);strings(p.when,"when");if(!p.when.length)bad("when","serve almeno un uso");
    needArray(p.pitfalls,"pitfalls",3);strings(p.pitfalls,"pitfalls");if(!p.pitfalls.length)bad("pitfalls","serve almeno un punto da controllare");
    needArray(p.examples,"examples",3);if(p.examples.length<2)bad("examples","servono due o tre esempi");
    for(const [n,e] of p.examples.entries()){needObject(e,"examples["+n+"]");needString(e.en,"examples["+n+"].en",400);needString(e.it,"examples["+n+"].it",400);needString(e.why,"examples["+n+"].why",1200);}
  } else if(task==="writing_coach") {
    needString(p.summary,"summary");needString(p.next_step,"next_step",800);
    if(p.criteria!==undefined){needObject(p.criteria,"criteria");for(const key of ['content','organisation','grammar','register']){const c=p.criteria[key];needObject(c,'criteria.'+key);if(!['met','developing','not_assessed'].includes(c.status))bad('criteria.'+key,'esito non valido');needString(c.reason,'criteria.'+key+'.reason',500);}}

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

  } else if(task==="reading_test") {
    needArray(p.questions,"questions",6);if(p.questions.length!==6)bad("questions","sono richieste esattamente 6 domande");
    const types=new Set();
    for(const [n,x] of p.questions.entries()){
      const path="questions["+n+"]";needObject(x,path);
      if(!READING_TEST_TYPES.includes(x.type))bad(path+".type","tipo di domanda non riconosciuto");types.add(x.type);
      needString(x.question,path+".question",400);needString(x.quote,path+".quote",500);needString(x.why,path+".why",1200);needString(x.answer,path+".answer",300);
      needArray(x.options,path+".options",4);if(x.options.length!==4)bad(path+".options","servono 4 opzioni");strings(x.options,path+".options",300);
      if(new Set(x.options).size!==4)bad(path+".options","le opzioni devono essere diverse");
      if(!x.options.includes(x.answer))bad(path+".answer","la soluzione non coincide con una delle opzioni");
    }
    if(types.size<4)bad("questions.type","servono almeno 4 tipi di domanda diversi");
  } else if(task==="translate") {
    needArray(p.translations,"translations",40);if(!p.translations.length)bad("translations","manca la traduzione");strings(p.translations,"translations",6000);
  } else if(task==="clarify") {
    needString(p.expression,"expression",120);needString(p.meaning_it,"meaning_it",300);needString(p.explanation,"explanation");needString(p.example,"example",500);
  } else if(task==="diagnosis") {
    needString(p.summary,"summary");
    needArray(p.patterns,"patterns",4);if(!p.patterns.length)bad("patterns","serve almeno un tipo di errore");
    p.patterns.forEach((x,i)=>{const path="patterns["+i+"]";needObject(x,path);needString(x.title,path+".title",200);needString(x.explanation,path+".explanation",1200);needString(x.evidence,path+".evidence",600);needArray(x.lesson_ids,path+".lesson_ids",4);strings(x.lesson_ids,path+".lesson_ids",100);});
    needArray(p.advice,"advice",3);if(!p.advice.length)bad("advice","serve almeno un consiglio");strings(p.advice,"advice",600);
  } else bad("task","funzione non riconosciuta");
  return p;
}
export function sanitizeCoach(result,text,mode) {
  const issues=result.issues.filter(i=>text.includes(i.quote));
  const omitted=(Number.isInteger(result.omitted)?result.omitted:0)+result.issues.length-issues.length;
  return {...result,issues,ready:mode==="review"&&result.ready&&(!result.criteria||Object.values(result.criteria).every(c=>c.status==="met"))&&omitted===0&&!issues.some(i=>i.kind==="error"),...(omitted?{omitted}:{} )};
}
// Use the documented Groq strict subset. Counts, text lengths and relationships
// between fields are described here and enforced by validateReply above.
const replyText=(max=1600)=>({type:"string",description:"Testo non vuoto, massimo "+max+" caratteri."});
const replyObject=properties=>({type:"object",properties,required:Object.keys(properties),additionalProperties:false});
const replyList=(items,description)=>({type:"array",items,description});
const transferFields={stem:replyText(),answer:replyText(600),accept:replyList(replyText(600),"Massimo 8 risposte inglesi accettabili."),why:replyText()};
export const REPLY_SCHEMAS={
  grammar_explain:replyObject({summary:replyText(),form:replyText(),when:replyList(replyText(),"Da 1 a 4 usi."),examples:replyList(replyObject({en:replyText(400),it:replyText(400),why:replyText(1200)}),"Due o tre esempi inglesi originali, con traduzione e motivazione."),contrast:replyText(),pitfalls:replyList(replyText(),"Da 1 a 3 errori tipici pertinenti.")}),
  writing_coach:replyObject({criteria:replyObject(Object.fromEntries(["content","organisation","grammar","register"].map(k=>[k,replyObject({status:{type:"string",enum:["met","developing","not_assessed"]},reason:replyText(500)})]))),summary:replyText(),focus:replyList(replyObject({form:replyText(300),meaning_it:replyText(300),why:replyText(1200),example_en:replyText(400)}),"Da 1 a 3 forme spiegate, con esempio in un altro contesto."),issues:replyList(replyObject({quote:replyText(300),correction:replyText(400),explanation:replyText(1200),kind:{type:"string",enum:["error","style"]},category:replyText(100)}),"Da 0 a 2 osservazioni con citazione letterale del testo dello studente."),next_step:replyText(800),ready:{type:"boolean",description:"True solo per una revisione senza errori prioritari e con le funzioni richieste presenti. Sempre false per un aiuto."}}),
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
  reading_test:replyObject({questions:replyList(replyObject({type:{type:"string",enum:["main_idea","detail","inference","purpose","vocabulary"]},question:replyText(400),options:replyList(replyText(300),"Esattamente 4 opzioni diverse, una sola corretta."),answer:replyText(300),quote:replyText(500),why:replyText(1200)}),"Esattamente 6 domande, almeno 4 tipi diversi.")}),
  translate:replyObject({translations:replyList(replyText(6000),"Una traduzione italiana per ogni paragrafo ricevuto, nello stesso ordine.")}),
  clarify:replyObject({expression:replyText(120),meaning_it:replyText(300),explanation:replyText(),example:replyText(500)}),
  path_block:replyObject({
    passages:replyList(replyObject({group:replyText(4),text:replyText(900)}),"Un testo inglese di 50–110 parole solo se ci sono slot con group, altrimenti []. Uno spazio numerato per ogni slot con group: tre nell'allenamento, cinque nella fase transfer."),
    items:replyList(replyObject({
      n:{type:"integer",description:"Numero dello slot, da 1 a 5, nell'ordine."},
      kind:{type:"string",enum:["choice","completion","transformation","error_correction"]},
      stem:replyText(220),
      options:replyList(replyText(600),"Choice: 3 o 4 opzioni diverse. Per gli altri tipi: elenco vuoto []."),
      answer:replyText(600),accept:transferFields.accept,why:replyText(),
      group:{type:"string",description:"Il group dello slot (p1, p2, p3) per gli spazi del testo, altrimenti stringa vuota."}
    }),"Esattamente 5 esercizi, uno per slot, nello stesso ordine.")
  }),
  diagnosis:replyObject({summary:replyText(),patterns:replyList(replyObject({title:replyText(200),explanation:replyText(1200),evidence:replyText(600),lesson_ids:replyList(replyText(100),"Da 0 a 4 id di lezione copiati da quelli ricevuti.")}),"Da 1 a 4 tipi di errore, dal più importante."),advice:replyList(replyText(600),"Da 1 a 3 consigli concreti, in ordine.")})
};
export const SHAPES={
  grammar_explain:{summary:"Distingui il fatto concluso dalla situazione collegata al presente.",form:"Past simple: soggetto + passato; present perfect: soggetto + have/has + participio.",when:["Past simple con un momento passato concluso.","Present perfect per un risultato attuale senza tempo passato concluso."],examples:[{en:"We checked the door yesterday.",it:"Abbiamo controllato la porta ieri.",why:"Yesterday identifica un tempo concluso."},{en:"We have checked the door, so it is safe now.",it:"Abbiamo controllato la porta, quindi ora è sicura.",why:"Il risultato interessa il presente."}],contrast:"Il contesto decide; una forma non sostituisce sempre l'altra.",pitfalls:["Non usare il present perfect con yesterday in questo significato."]},
  writing_coach:{criteria:Object.fromEntries(["content","organisation","grammar","register"].map(k=>[k,{status:"met",reason:"Requisito del passo rispettato."}])),summary:"Lo scopo è comprensibile.",focus:[{form:"Could you + verbo base",meaning_it:"Potrebbe…?",why:"Una richiesta cortese usa il verbo base dopo could.",example_en:"Could you confirm the address?"}],issues:[],next_step:"Controlla che il destinatario trovi tutte le informazioni richieste.",ready:false},
  exercises:{items:[
    {kind:"choice",stem:"Scegli la forma corretta: They ___ on duty.",options:["am","is","are"],answer:"are",accept:["are"],why:"They richiede are."},
    {kind:"choice",stem:"Scegli il significato di: They have already left.",options:["They are no longer here.","They are about to leave.","They leave every day."],answer:"They are no longer here.",accept:["They are no longer here."],why:"Have already left presenta un evento già avvenuto con un risultato attuale: ora non sono qui."},
    {kind:"completion",stem:"Scrivi solo la parola mancante: She ___ yesterday. (usa leave al past simple)",options:[],answer:"left",accept:["left"],why:"Il past simple di leave è left."},
    {kind:"completion",stem:"Scrivi solo le parole mancanti: We ___ the report. (usa finish al present perfect simple)",options:[],answer:"have finished",accept:["have finished"],why:"Con we si usa have + participio."},
    {kind:"transformation",stem:"Rendi negativa la parte tra parentesi quadre. Scrivi solo la parte che sostituisce [checked]: They [checked] the gate.",options:[],answer:"didn't check",accept:["didn't check","did not check"],why:"Il passato negativo richiede did not + verbo base: checked diventa did not check."},
    {kind:"error_correction",stem:"Correggi la parte tra parentesi quadre. Scrivi solo la parte che sostituisce [works]: She doesn't [works] here.",options:[],answer:"work",accept:["work"],why:"Dopo doesn't si usa work, senza -s; doesn't resta nella frase."}
  ]},
  writing_review:{summary:"Valutazione italiana",priorities:["massimo tre priorità"],rubric:{grammar:"valutazione",content:"valutazione",cohesion:"valutazione",register:"valutazione"},issues:[{quote:"citazione esatta presente nel testo",correction:"correzione minima",explanation:"regola e motivo",kind:"error",category:"negatives"}]},
  writing_compare:{summary:"confronto concreto",resolved:["errore realmente risolto"],remaining:["errore ancora presente"],transfer:[1,2,3].map(n=>({stem:"Nuovo esercizio "+n+" con contesto diverso",answer:"risposta",accept:["risposta","variante"],why:"spiegazione"}))},
  reading_review:{summary:"valutazione della traduzione",segments:[{quote:"citazione inglese esatta",translation:"traduzione italiana",explanation:"spiegazione"}],terms:[{expression:"termine presente nel testo",meaning_it:"significato contestuale",example:"esempio inglese originale"}]},
  reading_understand:{summary:"Gli agenti hanno controllato il cancello; il testo presenta un risultato attuale.",segments:[{quote:"The officers have checked the gate.",meaning_it:"Gli agenti hanno controllato il cancello.",why:"Il present perfect collega il controllo al presente."}],terms:[{expression:"checked",meaning_it:"controllato",quote:"The officers have checked the gate.",why:"Checked indica un controllo, non necessariamente una riparazione.",register:"Neutro",alternative:"Inspected suggerisce spesso un esame più sistematico; non è sempre equivalente.",example:"The technician checked the cable."}],questions:[{question:"Che cosa hanno controllato gli agenti?",answer:"Il cancello.",quote:"The officers have checked the gate."}]},
  reading_test:{questions:[{type:"main_idea",question:"What is the passage mainly about?",options:["A delayed depot inspection and its practical effects","A new delivery schedule for local residents","A complaint by the council about the depot","The results of the March inspection"],answer:"A delayed depot inspection and its practical effects",quote:"The inspection of the northern depot was postponed because two officers were unavailable.",why:"Il testo parte dal rinvio dell'ispezione e ne descrive le conseguenze pratiche; le altre opzioni riprendono dettagli secondari o non presenti."},{type:"detail",question:"Why was the inspection postponed?",options:["Deliveries were delayed.","Two officers were unavailable.","The council refused to approve it.","Drivers complained about the notice."],answer:"Two officers were unavailable.",quote:"The inspection of the northern depot was postponed because two officers were unavailable.",why:"La causa è esplicita: because two officers were unavailable. Le lamentele degli autisti riguardano l'avviso, non il rinvio."},{type:"inference",question:"What can be inferred about the notice sent to drivers?",options:["It was written by the council.","It cancelled all deliveries.","It was not as clear as it should have been.","It was sent in March."],answer:"It was not as clear as it should have been.",quote:"The manager accepted that the message could have been clearer and promised a written update by Friday.",why:"Could have been clearer implica che il messaggio non era abbastanza chiaro, senza dirlo direttamente."},{type:"purpose",question:"What is the manager's attitude to the drivers' complaints?",options:["He partly accepts them.","He rejects them completely.","He ignores them.","He blames the council."],answer:"He partly accepts them.",quote:"The manager accepted that the message could have been clearer and promised a written update by Friday.",why:"Accepted che il messaggio poteva essere più chiaro e promette un aggiornamento: riconosce in parte il problema."},{type:"vocabulary",question:"In the passage, 'vague' is closest in meaning to:",options:["late","official","unclear","short"],answer:"unclear",quote:"Several drivers complained that the notice arrived late, and one described the instructions as vague.",why:"Vague indica istruzioni poco precise; late riguarda il momento di arrivo dell'avviso, non il contenuto."},{type:"detail",question:"What must visitors do until the update?",options:["Park beside the depot.","Sign in at the main gate and wait to be escorted.","Call the duty manager.","Use the loading area."],answer:"Sign in at the main gate and wait to be escorted.",quote:"Until then, visitors must sign in at the main gate and wait to be escorted.",why:"Until then rimanda all'aggiornamento di venerdì; nel frattempo i visitatori devono registrarsi e attendere un accompagnatore."}]},
  translate:{translations:["Gli agenti hanno controllato il cancello."]},
  clarify:{expression:"termine richiesto",meaning_it:"significato contestuale",explanation:"spiegazione italiana della costruzione e del registro",example:"esempio inglese originale"},
  path_block:{passages:[{group:"p1",text:"The night shift (1) ___ at ten. By the time the patrol arrived, the alarm (2) ___ for twenty minutes, so the officers (3) ___ the building at once."}],items:[
    {n:1,kind:"completion",stem:"Spazio (1): scrivi la forma corretta (start).",options:[],answer:"starts",accept:["starts"],why:"Orario fisso di un servizio: present simple."},
    {n:2,kind:"completion",stem:"Spazio (2): scrivi la forma corretta (ring).",options:[],answer:"had been ringing",accept:["had been ringing"],why:"Durata fino a un momento passato: past perfect continuous."},
    {n:3,kind:"completion",stem:"Spazio (3): scrivi la forma corretta (search).",options:[],answer:"searched",accept:["searched"],why:"Azione conclusa in sequenza nel racconto: past simple."},
    {n:4,kind:"choice",stem:"Scegli la forma corretta: Look at those clouds. It ___ rain.",options:["is going to","will","rains"],answer:"is going to",accept:["is going to"],why:"Previsione basata su un indizio presente: going to.",group:""},
    {n:5,kind:"error_correction",stem:"Correggi solo la parte sbagliata: She don't work on Sundays.",options:[],answer:"doesn't work",accept:["doesn't work","does not work"],why:"Con she l'ausiliare è does.",group:""}
  ].map(i=>({group:"p1",...i}))},
  diagnosis:{summary:"Gli errori si concentrano sull'ausiliare nelle frasi negative e interrogative; i tempi verbali sono incerti soprattutto tra present simple e continuous.",patterns:[{title:"Ausiliare mancante nelle negative al passato",explanation:"Dopo did il verbo torna alla forma base e not segue l'ausiliare.",evidence:"«We not stopped» invece di «We did not stop».",lesson_ids:["negatives"]}],advice:["Parti dalla lezione sulle negazioni: 30 esercizi, poi una verifica dopo tre giorni."]}
};

export const READING_TEST_TYPES=["main_idea","detail","inference","purpose","vocabulary"];
// Tiene solo le domande la cui citazione è letterale nel testo inviato.
export function anchorTest(result,text) {
  const questions=result.questions.filter(x=>text.includes(x.quote));
  return {...result,questions,omitted:result.questions.length-questions.length};
}
export function anchorReading(result,text) {
  const segments=result.segments.filter(x=>text.includes(x.quote));
  const terms=result.terms.filter(x=>text.includes(x.quote)&&x.quote.includes(x.expression));
  const questions=result.questions.filter(x=>text.includes(x.quote));
  return {...result,segments,terms,questions,omitted:(Number.isInteger(result.omitted)?result.omitted:0)+result.segments.length+result.terms.length+result.questions.length-segments.length-terms.length-questions.length};
}

export const ADAPTIVE_SKILLS=["form","meaning","tense_choice","word_order","use"];
export function validateLearner(p,lessonId){
 if(!object(p)||p.version!==1||p.lesson_id!==lessonId||!arr(p.skills,5)||!arr(p.evidence,16)||!str(p.pretest_status,30))throw new Error("Profilo adattivo non valido.");
 if(p.starting_level!=null&&!["A1","A2","B1","B2","C1"].includes(p.starting_level))throw new Error("Livello iniziale non valido.");
 if(p.related!==undefined&&(!arr(p.related,4)||p.related.some(r=>!object(r)||!str(r.lesson_id,100)||!['observations','independent_correct','errors'].every(k=>Number.isInteger(r[k])&&r[k]>=0)||!str(r.pretest_status,30))))throw new Error("Prerequisiti del profilo non validi.");
 for(const e of p.evidence)if(!object(e)||!str(e.id,200)||!ADAPTIVE_SKILLS.includes(e.skill)||typeof e.correct!=="boolean"||typeof e.assisted!=="boolean"||!["stem","given","expected"].every(k=>typeof e[k]==="string"&&e[k].length<=240))throw new Error("Prove del profilo non valide.");
 if(p.global_skills!==undefined&&!arr(p.global_skills,5))throw new Error("Competenze trasversali non valide.");
 for(const s of [...p.skills,...(p.global_skills||[])])if(!ADAPTIVE_SKILLS.includes(s.skill)||!["observations","independent_correct","errors","assisted"].every(k=>Number.isInteger(s[k])&&s[k]>=0))throw new Error("Competenze del profilo non valide.");
 return p;
}
// Decisione unica sull'avanzamento, usata da interfaccia, profilo e Worker sugli stessi dati.
// rows: risposte di pratica in ordine cronologico ({correct, assisted, block_complete, skill,
// context_id|stem, session_id|block_id}). Contano le risposte già verificate (block_complete),
// in finestre mobili: ultime 6 per aumentare la difficoltà, ultime 12 (almeno 8 contesti e tre competenze) per l'autonomia,
// anche da sessioni brevi o miste; la tenuta nel tempo la controllano le verifiche distanziate. Un errore in un blocco recente non ancora verificato blocca
// comunque l'avanzamento: le prove recenti prevalgono su quelle vecchie.
export const PROGRESS_SKILLS=["form","meaning","tense_choice","word_order","use"];
export function progressDecision(rows){
 // Si decide sempre sulle ultime 12 risposte: sono anche le prove inviate al Worker, che
 // ripete lo stesso calcolo e arriva per forza allo stesso risultato.
 const recent=rows.slice(-12),done=recent.filter(r=>r.block_complete),lastDone=recent.findLastIndex(r=>r.block_complete);
 const pending=recent.slice(lastDone+1).filter(r=>!r.block_complete),pendingErrors=pending.filter(r=>!r.correct||r.assisted).length;
 const latest=done.slice(-6),window=done.slice(-12),good=rs=>rs.filter(r=>r.correct&&!r.assisted).length;
 const can_advance=!pendingErrors&&latest.length===6&&latest.every(r=>!r.assisted)&&good(latest)>=5;
 const skills=new Set(window.filter(r=>r.correct&&!r.assisted).map(r=>r.skill));
 const contexts=new Set(window.map(r=>r.context_id||r.stem)).size;
 const coverage=skills.has("form")&&(skills.has("meaning")||skills.has("tense_choice"))&&(skills.has("use")||skills.has("word_order"));
 const ready=can_advance&&window.length===12&&window.every(r=>!r.assisted)&&good(window)>=10&&contexts>=8&&coverage;
 const missing=[window.length<12&&"risposte verificate",!coverage&&"competenze",good(window)<10&&"risposte corrette"].filter(Boolean);
 return {can_advance,ready,latest,window,pending_errors:pendingErrors,errors:latest.filter(r=>!r.correct).length,missing,decision_rows:recent};
}
export const ASSESSMENT_SCHEMA=replyObject({mode:{type:"string",enum:["diagnose","consolidate","hold","advance"]},focus:{type:"string",enum:ADAPTIVE_SKILLS},reason:replyText(700),goal:replyText(500),evidence_ids:replyList(replyText(200),"Da zero a 8 id realmente presenti in learner.evidence. Vuoto solo senza prove."),item_skills:replyList({type:"string",enum:ADAPTIVE_SKILLS},"Esattamente 6 competenze, una per esercizio nell'ordine.")});
export const ADAPTIVE_EXERCISES_SCHEMA=replyObject({...REPLY_SCHEMAS.exercises.properties,assessment:ASSESSMENT_SCHEMA});
// Una proposta di Groq che contraddice le regole viene ricondotta alla modalità ammessa invece di
// far fallire il blocco: senza prove serve una diagnosi; senza i requisiti si mantiene la difficoltà.
export const HOLD_REASON="Difficoltà mantenuta: per aumentarla servono almeno cinque risposte corrette sulle ultime sei verificate, senza aiuti e senza errori più recenti.";
export function settleAssessment(a,learner){
 if(!object(a)||!object(learner)||!Array.isArray(learner.evidence))return {assessment:a,changed:null};
 if(!learner.evidence.length&&a.mode!=="diagnose")return {assessment:{...a,mode:"diagnose",evidence_ids:[],reason:"Mancano risposte su questa lezione: il blocco serve a verificare il punto di partenza."},changed:a.mode+"->diagnose"};
 if(a.mode==="advance"&&!progressDecision(learner.evidence.filter(e=>e.source==="practice")).can_advance)return {assessment:{...a,mode:"hold",reason:HOLD_REASON},changed:"advance->hold"};
 return {assessment:a,changed:null};
}
export function validateAssessment(a,learner){
 if(!object(a)||!["diagnose","consolidate","hold","advance"].includes(a.mode)||!ADAPTIVE_SKILLS.includes(a.focus)||!str(a.reason,700)||!str(a.goal,500)||!arr(a.evidence_ids,8)||!a.evidence_ids.every(id=>str(id,200))||!arr(a.item_skills,6)||a.item_skills.length!==6||!a.item_skills.every(s=>ADAPTIVE_SKILLS.includes(s)))throw new Error("Valutazione adattiva incompleta.");
 if(learner){const ids=new Set(learner.evidence.map(e=>e.id));if(a.evidence_ids.some(id=>!ids.has(id))||ids.size&&!a.evidence_ids.length)throw new Error("Valutazione senza riscontro nelle risposte.");if(!ids.size&&a.mode!=="diagnose")throw new Error("Senza prove serve una verifica iniziale.");if(a.mode==='advance'&&!progressDecision(learner.evidence.filter(e=>e.source==='practice')).can_advance)throw new Error("Servono almeno cinque risposte corrette sulle ultime sei verificate, senza aiuti e senza errori più recenti, per aumentare la difficoltà.");
 }
 return a;
}
