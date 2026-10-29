import {exerciseHint} from './exercise-hints.js';
import {normal,gapSentences} from './answer-normal.js';
import {ruleInfo,tagFor} from './item-tags.js';
import {lessonItems} from './practice-bank.js';
export function assistedItem(set,item){return !!set.assisted||!!item.fallback_guided||!!set.hinted_items?.includes(item.id);}
// Tre aiuti in ordine, uno per tocco: 1) la regola e come usare l'indizio della frase, 2) un esempio
// svolto sulla stessa regola, 3) la soluzione con la spiegazione. Ogni aiuto rende la risposta guidata.
export function hintSteps(item,lesson={}){
 const choice=!!item.options?.length,gap=/_{2,}/.test(item.stem||'');
 const tag=item.rules?.length?{rules:item.rules}:lesson.id?tagFor(lesson.id,item):null,rule=tag?ruleInfo(tag.rules[0]):null;
 const how=item.passage?'Leggi tutto il testo, anche dopo lo spazio: il contesto indica quale schema serve.':choice?'Nella frase cerca le parole che decidono il significato (tempo, condizione, intenzione) e scegli l’alternativa che rispetta lo schema; le altre lo violano.':gap?'Le parole già scritte prima e dopo lo spazio sono l’indizio: ti dicono quale schema serve. Scrivi solo la parte che manca, senza ripetere ciò che c’è già.':'Applica lo schema alla frase richiesta.';
 // Gli errori tipici che contengono la soluzione di questo esercizio non si mostrano: la anticiperebbero.
 const keys=[item.answer,...(item.accept||[])].map(normal).filter(Boolean);
 const wrong=(rule?.pitfall||'').split(/;\s*/).map(x=>x.replace(/[.\s]+$/,'')).filter(x=>x&&!keys.some(k=>normal(x).includes(k)));
 const ruleText=rule?rule.name+': '+rule.test+(wrong.length?' Forme sbagliate da evitare: '+wrong.map(x=>'«'+x+'»').join(', ')+'.':''):exerciseHint(item,lesson);
 const steps=[{title:'1. La regola',label:'la regola',text:ruleText+' '+how}];
 steps.push({title:'2. Un esempio',label:'un esempio',text:workedExample(item,lesson,tag)});
 steps.push({title:'3. La soluzione',label:'la soluzione',text:'Risposta: '+item.answer+(item.accept?.length>1?' (accettate anche: '+item.accept.filter(v=>normal(v)!==normal(item.answer)).slice(0,3).join(', ')+')':'')+'. '+(item.why||'')});
 return steps;
}
// Esempio svolto: un altro esercizio della banca con la stessa regola, già completato; altrimenti
// un esempio della scheda della lezione.
function workedExample(item,lesson,tag){
 const key=normal(item.stem||''),answer=normal(item.answer||''),keys=[item.answer,...(item.accept||[])].map(normal).filter(Boolean);
 if(lesson.id&&tag){
  const pool=lessonItems(lesson.id).filter(x=>x.rules?.includes(tag.rules[0])&&normal(x.stem)!==key&&normal(x.answer)!==answer);
  const shows=text=>!keys.some(k=>k.split(' ').length>1&&normal(text).includes(k));
  const gapItems=pool.map(x=>({x,filled:gapSentences(x)[0]})).filter(y=>y.filled&&shows(y.filled+' '+y.x.why));
  const pick=(list)=>list[[...key].reduce((n,c)=>n+c.charCodeAt(0),0)%list.length];
  if(gapItems.length){const {x,filled}=pick(gapItems);return filled+' — '+x.why;}
  const choices=pool.filter(x=>x.options?.length&&shows(x.stem+' '+x.answer+' '+x.why));
  if(choices.length){const x=pick(choices),sentence=x.stem.slice(x.stem.lastIndexOf(': ')+2);return (/_{2,}/.test(sentence)?sentence.replace(/_{2,}/,x.answer):sentence+' → '+x.answer)+' — '+x.why;}
 }
 const example=(lesson.examples||[]).find(x=>typeof x==='string'&&!String(item.stem).includes(x)&&normal(x)!==answer&&!keys.some(k=>k.split(' ').length>1&&normal(x).includes(k)));
 return example?example+' — Guarda come è costruita la forma e applica lo stesso schema alla tua frase.':'Rileggi la scheda della lezione: la sezione «Quando usarla» mostra lo schema con esempi.';
}
export function answerFeedback(item,value){
 const typed=normal(value),reference=normal(item.answer);
 if(!typed)return 'La risposta è vuota: prova prima a costruire la forma richiesta.';
 if(item.options?.length)return 'Confronta il significato dell’opzione scelta con quello richiesto dalla consegna. La spiegazione sotto chiarisce la differenza; una forma può essere grammaticale ma esprimere un’altra situazione.';
 if(/\b(?:did|does|do) (?:not )?(?:went|received|left|wrote|worked|checked|goes|works|has)\b/.test(typed))return 'Dopo do, does o did il verbo principale deve essere alla forma base: il tempo e l’accordo sono già espressi dall’ausiliare.';
 if(/\b(?:can|could|must|should|will|would|may|might) to\b/.test(typed))return 'Hai aggiunto to dopo un modale. In questa costruzione il modale è seguito direttamente dalla forma base del verbo.';
 if(/\bgoing to\b/.test(reference)&&! /\bgoing to\b/.test(typed))return 'Nella tua risposta manca la costruzione going to richiesta qui. Controlla anche la forma di be prima di going e il verbo base dopo to.';
 if(/\bbeen\b/.test(reference)&&! /\bbeen\b/.test(typed))return 'Confronta gli ausiliari: nella costruzione richiesta qui serve anche been. Individua dove si colloca prima del verbo principale.';
 if(/^(?:am|is|are|was|were)\b/.test(reference)&&/^(?:am|is|are|was|were)\b/.test(typed)&&typed.split(' ')[0]!==reference.split(' ')[0])return 'La forma di be che hai scelto differisce da quella richiesta: controlla sia il soggetto (singolare/plurale), sia il tempo della frase.';
 return 'La tua risposta non coincide con le varianti previste. Confronta forma, tempo e significato con la spiegazione sotto. Se ritieni che esprima correttamente la consegna, segnala la risposta per non trattare una possibile variante come errore certo.';
}
