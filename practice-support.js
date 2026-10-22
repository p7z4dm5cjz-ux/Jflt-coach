import {exerciseHint} from './exercise-hints.js';
import {normal} from './answer-normal.js';
export function assistedItem(set,item){return !!set.assisted||!!set.hinted_items?.includes(item.id);}
export function hintSteps(item,lesson={}){
 const choice=!!item.options?.length;
 const focus=choice?'Prima di scegliere, descrivi il significato della frase: quando avviene il fatto, è concluso o in corso, è un’intenzione o un obbligo? Confronta tutte le alternative.':/_{2,}/.test(item.stem)?'Leggi ciò che è già scritto prima e dopo lo spazio. Individua il soggetto e il momento dell’azione; non ripetere le parole già presenti.':'Individua ciò che la consegna chiede di cambiare. Tieni fissi il significato e gli elementi che non devi modificare.';
 const context=item.passage?'Leggi il testo intero, anche le frasi dopo lo spazio. Metti in ordine gli eventi e distingui ciò che vale ancora adesso da ciò che è concluso.':focus;
 const steps=[{title:'1. Cerca l’indizio',text:context},{title:'2. Richiama la regola',text:exerciseHint(item,lesson)}];
 const example=(lesson.examples||[]).find(x=>typeof x==='string'&&!item.stem.includes(x)&&normal(x)!==normal(item.answer));
 if(example)steps.push({title:'3. Confronta un esempio diverso',text:example+' — Individua soggetto, forma verbale e riferimento temporale. Applica il ragionamento alla tua frase, senza copiare questo esempio.'});
 return steps;
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
