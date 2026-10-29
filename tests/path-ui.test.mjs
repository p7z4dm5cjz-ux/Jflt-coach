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
const requests=[];let doubtFirstGap=false;
// Groq finto: un esercizio per slot, rispettando livello e spazi del testo.
const tutor=async(settings,path,task,data)=>{
  assert.equal(task,'path_block');requests.push(data);
  let gap=0;const group=data.slots.find(s=>s.group)?.group;
  const items=data.slots.map(s=>{
    const tag=' ['+data.path_id+' c'+data.cycle+'b'+data.page+'n'+s.n+']';
    if(s.group){gap++;const doubt=doubtFirstGap&&gap===1;return {n:s.n,kind:'completion',stem:'Spazio ('+gap+'): scrivi la forma corretta (work).',options:[],answer:'works',accept:['works'],why:'Abitudine.',group:s.group,check:doubt?'doubt':'confirmed',...(doubt?{doubt:true,check_note:'Dubbio.'}:{})};}
    if(s.level===1)return {n:s.n,kind:'choice',stem:'Scegli la forma corretta: She ___ here.'+tag,options:['works','work','working'],answer:'works',accept:['works'],why:'Terza persona.',group:'',check:'confirmed'};
    return {n:s.n,kind:'completion',stem:'Scrivi solo la parola mancante: He ___ every day. (work)'+tag,options:[],answer:'works',accept:['works'],why:'Abitudine.',group:'',check:'confirmed'};
  });
  return {passages:group?[{group,text:'Every morning she (1) ___ early, he (2) ___ late and they (3) ___ hard.'+(gap===5?' Then (4) ___ and (5) ___.':'')+' Path '+data.path_id+' cycle '+data.cycle+' block '+data.page+'.'}]:[],items};
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
  assert.ok(requests[1].avoid.some(s=>s.includes('c1b0')),'le frasi già proposte vanno evitate');
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

test('livello 4: il testo resta visibile se il primo spazio è escluso, e ogni spazio conta per il suo testo',async()=>{
  saveToken('path-ui-token-longer-than-24-chars');doubtFirstGap=true;
  await repo.change(s=>{s.lesson_levels['present-perfect-simple']={level:4,autonomous:false,pending_transfer:false,changed_at:null,history:[]};});
  await app.goto('lesson/present-perfect-simple');
  await until(()=>view().includes('Percorso adattivo con il tutor'));
  click('Esercita questa lezione · 60 min');
  await until(()=>document.querySelectorAll('.exercise').length>=2);
  const set=repo.get().sessions.at(-1);
  assert.equal(set.items.filter(i=>i.group).length,3);assert.ok(set.items[0].doubt);
  assert.ok(document.querySelector('.path-passage')?.textContent.includes('(2) ___'),'il testo deve restare visibile');
  const legends=[...document.querySelectorAll('legend')].map(l=>l.textContent);
  assert.ok(legends.some(t=>/livello 4 · intrecciare/i.test(t)),legends.join('|'));
  assert.ok(legends.filter(t=>/livello [34]/.test(t)).every(t=>!/Present perfect|Forma|Domanda|Contrasto|Quando/.test(t)),'dal livello 3 nessun nome di regola: '+legends.join('|'));
  const ids=set.items.filter(i=>i.group).map(i=>i.context_id);
  assert.equal(new Set(ids).size,3);assert.ok(ids.every(id=>id.startsWith('path:')));
  doubtFirstGap=false;
});

test('percorso concluso: «Nuovo percorso» parte con un solo clic',async()=>{
  saveToken('path-ui-token-longer-than-24-chars');
  const path=repo.get().paths.at(-1);
  await repo.change(s=>{const x=s.paths.find(p=>p.id===path.id);x.completed_at=new Date().toISOString();});
  await app.goto('path/'+path.id);
  await until(()=>view().includes('Percorso concluso'));
  const before=repo.get().paths.length;
  click('Nuovo percorso · 45 minuti');
  await until(()=>repo.get().paths.length===before+1&&document.querySelectorAll('.exercise').length>=3);
  assert.equal(repo.get().paths.at(-1).length,45);
});

test('trasferimento completo dalla UI: cinque spazi, nessuna regola anticipata, prima prova e backup',async()=>{
  await repo.change(s=>{s.lesson_levels['past-simple']={level:4,autonomous:false,pending_transfer:true,changed_at:null,history:[]};});
  await app.goto('lesson/past-simple');
  await until(()=>buttons().some(b=>b.textContent==='Esercita questa lezione · 30 min'));
  click('Esercita questa lezione · 30 min');
  await until(()=>repo.get().paths.at(-1).cycles[0]?.phase==='transfer'&&document.querySelectorAll('.exercise').length===5);
  for(let page=0;page<3;page++){
    await until(()=>document.querySelectorAll('.exercise').length===5&&[...document.querySelectorAll('legend')].every(l=>l.textContent.includes('Scegli dal contesto')));
    assert.match(document.querySelector('.path-passage').textContent,/\(5\) ___/);
    assert.ok([...document.querySelectorAll('legend')].every(l=>l.textContent.includes('Scegli dal contesto')));
    await answerBlock();
    if(page<2){click('Prossimo blocco del percorso');await until(()=>repo.get().paths.at(-1).cycles[0].block_ids.length===page+2&&document.querySelectorAll('.exercise').length===5);}
  }
  click('Chiudi il ciclo e vedi il risultato');
  await until(()=>view().includes('Prima prova su testo superata'));
  assert.equal(repo.get().lesson_levels['past-simple'].autonomous,false);
  assert.ok(repo.get().lesson_levels['past-simple'].transfer_due);
  const restored=parseBackup(await repo.backup());
  assert.ok(restored.lesson_levels['past-simple'].transfer_due);
});

test('Ricomincia da zero: prima il backup, poi la conferma; restano Worker, tema e codice del tutor',async()=>{
  saveToken('path-ui-token-longer-than-24-chars');
  await repo.change(s=>{s.settings.theme='dark';});
  let downloads=0;globalThis.URL.createObjectURL=()=>{downloads++;return 'blob:test';};globalThis.URL.revokeObjectURL=()=>{};
  await app.goto('settings');
  await until(()=>view().includes('Ricomincia da zero'));
  assert.ok(repo.get().attempts.length>0&&repo.get().paths.length>0);
  click('Prepara il backup e ricomincia');
  await until(()=>buttons().some(b=>b.textContent==='Sì, cancella tutti i progressi'));
  assert.equal(downloads,1);assert.ok(repo.get().attempts.length>0,'niente viene cancellato prima della conferma');
  click('Sì, cancella tutti i progressi');
  await until(()=>repo.get().attempts.length===0);
  const s=repo.get();
  assert.deepEqual([s.sessions.length,s.paths,s.lesson_levels,s.placement,s.settings.starting_level],[0,undefined,undefined,null,undefined]);
  assert.equal(s.settings.theme,'dark');assert.equal(s.settings.endpoint,'https://jflt-coach.crl-r90.workers.dev');
  assert.equal((await import('../tutor.js')).getToken(),'path-ui-token-longer-than-24-chars');
  await until(()=>location.hash==='#/home');
});
