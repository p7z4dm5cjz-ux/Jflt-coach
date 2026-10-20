import {LESSONS} from "./catalog.js";
// Self-assessed entry points, not a CEFR certification or a replacement for evidence.
export const STARTING_LEVELS = [
 {id:"A1",label:"A1 · Principiante",lessons:["sentence","present-simple","questions","present-continuous"]},
 {id:"A2",label:"A2 · Elementare",lessons:["past-simple","past-continuous","future-going-to","present-perfect-simple"]},
 {id:"B1",label:"B1 · Intermedio",lessons:["present-perfect-simple","past-perfect-simple","conditionals-real","passive"]},
 {id:"B2",label:"B2 · Intermedio avanzato",lessons:["conditionals-unreal","mixed-conditionals","deduction","reported"]},
 {id:"C1",label:"C1 · Avanzato",lessons:["inversion","hedging","nominalisation","cohesion"]}
];
export const startingLevel = state => STARTING_LEVELS.find(l=>l.id===state.settings?.starting_level)||null;

// Pedagogical sequence, not an official CEFR classification of individual rules.
const overrides={A2:['past-simple','past-continuous','imperatives-requests','basic-connectors'],B1:['present-perfect-simple','present-perfect-continuous','past-perfect-simple','past-perfect-continuous','conditionals-real','passive','reported','indirect-questions','relatives','clauses','linkers','stative-dynamic','time-contrasts','perfect-adverbs','preferences','verb-pattern-meaning','review-foundation']};
export function lessonLevel(id){const l=LESSONS.find(l=>l.id===id);return Object.entries(overrides).find(([,ids])=>ids.includes(id))?.[0]||['A1','A2','B2','C1'][l?.stage||0];}
export function levelSequence(state){
 const level=startingLevel(state);if(!level)return null;
 const order=STARTING_LEVELS.map(l=>l.id),start=order.indexOf(level.id);
 return order.slice(start).flatMap(id=>{const entry=STARTING_LEVELS.find(l=>l.id===id).lessons;return [...new Set([...entry,...LESSONS.filter(l=>lessonLevel(l.id)===id).map(l=>l.id)])];}).filter((id,i,all)=>all.indexOf(id)===i);
}
