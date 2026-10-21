import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {openRepository,parseBackup} from '../storage.js';
const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://example.test/#/home',pretendToBeVisual:true});
for(const k of ['window','document','location','Node','navigator','sessionStorage','localStorage'])Object.defineProperty(globalThis,k,{value:k==='window'?dom.window:dom.window[k],configurable:true});
window.scrollTo=()=>{};
const {mountApp}=await import('../app.js'),{saveToken}=await import('../tutor.js'),repo=await openRepository(new IDBFactory());
const requests=[];
// Groq finto: un esercizio per slot, rispettando livello e spazi del testo.
const tutor=async(settings,path,task,data)=>{
  assert.equal(task,'path_block');requests.push(data);
  let gap=0;const group=data.slots.find(s=>s.group)?.group;
  const items=data.slots.map(s=>{
    const tag=' [c'+data.cycle+'b'+data.page+'n'+s.n+']';
    if(s.group){gap++;return {n:s.n,kind:'completion',stem:'Spazio ('+gap+'): scrivi la forma corretta (work).'+tag,options:[],answer:'works',accept:['works'],why:'Abitudine.',group:s.group,check:'confirmed'};}
    if(s.level===1)return {n:s.n,kind:'choice',stem:'Scegli la forma corretta: She ___ here.'+tag,options:['works','work','working'],answer:'works',accept:['works'],why:'Terza persona.',group:'',check:'confirmed'};
    return {n:s.n,kind:'completion',stem:'Scrivi solo la parola mancante: He ___ every day. (work)'+tag,options:[],answer:'works',accept:['works'],why:'Abitudine.',group:'',check:'confirmed'};
  });
  return {passages:group?[{group,text:'Every morning she (1) ___ early, he (2) ___ late and they (3) ___ hard.'}]:[],items};
};
const app=await mountApp(repo,document.getElementById('view'),tutor);
async function until(f){for(let i=0;i<400;i++){if(f())return;await new Promise(r=>setTimeout(r,5));}throw Error('timeout '+document.getElementById('notice').textContent);}
const buttons=()=>[...document.querySelectorAll('button')];
const click=t=>{const b=buttons().find(b=>b.textContent===t);assert.ok(b,t+' · '+buttons().map(b=>b.textContent).join(' | '));b.click();};
const view=()=>document.getElementById('view').textContent;
async function answerBlock(correct=true){
  const id=repo.get().sessions.at(-1).id;
  await repo.change(s=>{const set=s.sessions.find(x=>x.id===id);for(const it of set.items)set.answers[it.id]=correct?it.answer:'wrong';});
  await app.render();
  click('Verifica le risposte');
  await until(()=>!!repo.get().sessions.find(x=>x.id===id).completed_at);
  await until(()=>buttons().some(b=>/Prossimo blocco del percorso|Chiudi il ciclo/.test(b.textContent)));
}

test('percorso: avvio da Oggi, tre blocchi da 5, risultato del ciclo e salita di livello',async()=>{
  saveToken('path-ui-token-longer-than-24-chars');
  await repo.change(s=>{s.settings.starting_level='B1';});await app.render();
  await until(()=>view().includes('Percorso con il tutor'));
  assert.match(view(),/Si parte da «/);
  click('45 minuti · 3 cicli');
  await until(()=>document.querySelectorAll('.exercise').length===5);
  const first=repo.get().sessions.at(-1),path=repo.get().paths[0];
  assert.equal(first.path_id,path.id);assert.deepEqual(first.path_block,{cycle:1,page:0});
  assert.equal(path.length,45);assert.equal(path.cycles[0].blocks.length,3);
  assert.match(view(),/ciclo 1 di 3 · blocco 1 di 3/);
  assert.match(view(),/Perché questo blocco/);
  assert.ok([...document.querySelectorAll('legend')].every(l=>/Lezione del ciclo · .+ · livello 2/.test(l.textContent)),[...document.querySelectorAll('legend')].map(l=>l.textContent).join('|'));
  assert.ok(first.items.every(i=>i.rules?.length&&i.level===2&&i.focus_lesson===path.cycles[0].main&&i.origin==='groq'));
  for(let page=0;page<3;page++){
    await answerBlock();
    if(page<2){click('Prossimo blocco del percorso');await until(()=>repo.get().sessions.length===page+2&&document.querySelectorAll('.exercise').length===5);}
  }
  click('Chiudi il ciclo e vedi il risultato');
  await until(()=>view().includes('Sali di livello'));
  const state=repo.get(),cycle=state.paths[0].cycles[0];
  assert.equal(cycle.result.decision,'up');assert.equal(cycle.result.n,15);
  assert.equal(state.lesson_levels[cycle.main].level,3);
  assert.equal(requests.length,3);assert.ok(requests.every(r=>r.slots.length===5&&r.main_lesson===cycle.main));
  assert.ok(requests[1].avoid.some(s=>s.includes('[c1b0')),'le frasi già proposte vanno evitate');
  // Il backup con percorso e livelli resta valido.
  assert.ok(parseBackup(await repo.backup()));
});

test('percorso senza tutor: blocco dalla banca locale con avviso, poi ripresa da Oggi',async()=>{
  saveToken('');
  click('Inizia il ciclo 2');
  await until(()=>document.querySelectorAll('.exercise').length>=3);
  const set=repo.get().sessions.at(-1);
  assert.equal(set.source,'local');assert.match(set.fallback_note,/banca locale/);
  assert.match(view(),/Tutor non collegato/);
  assert.equal(repo.get().paths[0].cycles[1].n,2);
  assert.equal(repo.get().paths[0].cycles[1].level,3);
  await app.goto('home');
  await until(()=>view().includes('Continua il percorso'));
  assert.match(view(),/Ciclo 2 di 3 · blocco 1 di 3/);
  click('Riprendi il percorso');
  await until(()=>location.hash==='#/practice/'+set.id);
});

test('lezione: «Esercita questa lezione» apre un nuovo percorso su quella lezione',async()=>{
  saveToken('path-ui-token-longer-than-24-chars');
  await app.goto('lesson/past-simple');
  await until(()=>view().includes('Percorso adattivo con il tutor'));
  click('Esercita questa lezione · 30 min');
  await until(()=>repo.get().paths.length===2&&document.querySelectorAll('.exercise').length===5);
  const [old,current]=repo.get().paths;
  assert.ok(old.completed_at,'il percorso precedente si chiude');
  assert.equal(current.forced_lesson,'past-simple');assert.equal(current.length,30);
  assert.equal(current.cycles[0].main,'past-simple');
});
