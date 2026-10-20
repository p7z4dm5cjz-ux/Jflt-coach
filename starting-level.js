// Self-assessed entry points, not a CEFR certification or a replacement for evidence.
export const STARTING_LEVELS = [
 {id:"A1",label:"A1 · Principiante",lessons:["sentence","present-simple","questions","present-continuous"]},
 {id:"A2",label:"A2 · Elementare",lessons:["past-simple","past-continuous","future-going-to","present-perfect-simple"]},
 {id:"B1",label:"B1 · Intermedio",lessons:["present-perfect-simple","past-perfect-simple","conditionals-real","passive"]},
 {id:"B2",label:"B2 · Intermedio avanzato",lessons:["conditionals-unreal","mixed-conditionals","deduction","reported"]},
 {id:"C1",label:"C1 · Avanzato",lessons:["inversion","hedging","nominalisation","cohesion"]}
];
export const startingLevel = state => STARTING_LEVELS.find(l=>l.id===state.settings?.starting_level)||null;
