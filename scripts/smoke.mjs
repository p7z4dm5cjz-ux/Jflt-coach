// Prova nel browser vero (Chromium): apre l'app servita localmente come su GitHub Pages,
// a misura di iPhone e di computer, in tema chiaro e scuro. Fallisce se trova errori in
// console, pagine che sbordano in orizzontale, versione sbagliata o service worker assente.
// Uso: npm run smoke   (in GitHub Actions dopo `npx playwright install --with-deps chromium`)
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {extname,normalize,join} from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";
import {VERSION} from "../engine.js";

const root=fileURLToPath(new URL("../",import.meta.url));
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".webmanifest":"application/manifest+json",".png":"image/png",".svg":"image/svg+xml",".woff2":"font/woff2"};
const server=createServer(async(req,res)=>{
  const url=new URL(req.url,"http://localhost");
  let path=decodeURIComponent(url.pathname.replace(/^\/Jflt-coach/,""));if(path==="/"||path==="")path="/index.html";
  const file=normalize(join(root,path));
  if(!file.startsWith(root)||/node_modules|\.git/.test(file)){res.writeHead(404).end();return;}
  try{const body=await readFile(file);res.writeHead(200,{"Content-Type":types[extname(file)]||"application/octet-stream"});res.end(body);}
  catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,"127.0.0.1",r));
const base="http://127.0.0.1:"+server.address().port+"/Jflt-coach/";
const routes=["#/","#/studio","#/lesson/present-perfect-simple","#/writing","#/review","#/reading","#/settings","#/placement"];
const failures=[];
const browser=await chromium.launch();
try{
  for(const [name,viewport] of [["iPhone",{width:390,height:844}],["desktop",{width:1280,height:860}]]){
    for(const scheme of ["light","dark"]){
      const context=await browser.newContext({viewport,colorScheme:scheme,serviceWorkers:"allow"}),page=await context.newPage();
      const label=name+"/"+scheme;
      page.on("console",m=>{if(m.type()==="error")failures.push(label+" console: "+m.text());});
      page.on("pageerror",e=>failures.push(label+" errore: "+e.message));
      for(const route of routes){
        await page.goto(base+route);await page.waitForTimeout(700);
        const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>window.innerWidth+1,h1:document.querySelector("main h1")?.textContent||"",text:document.getElementById("view")?.textContent||""}));
        if(state.overflow)failures.push(label+" "+route+": la pagina sborda in orizzontale");
        if(!state.h1.trim())failures.push(label+" "+route+": manca il titolo della pagina");
        if(/Non ho potuto aprire|Sessione non trovata|Lezione non trovata/.test(state.text))failures.push(label+" "+route+": pagina in errore");
      }
      await page.goto(base+"#/settings");await page.waitForTimeout(700);
      const versions=await page.evaluate(()=>[...document.querySelectorAll("[data-app-version]")].map(e=>e.textContent));
      if(!versions.length||versions.some(v=>v!==VERSION))failures.push(label+": versione mostrata "+versions.join(",")+" invece di "+VERSION);
      if(name==="iPhone"&&scheme==="light"){
        const sw=await page.evaluate(async()=>{const reg=await navigator.serviceWorker.getRegistration();return !!reg;});
        if(!sw)failures.push(label+": service worker non registrato");
      }
      await context.close();
    }
  }
}finally{await browser.close();server.close();}
if(failures.length){console.error("Prova nel browser non superata:\n- "+failures.join("\n- "));process.exitCode=1;}
else console.log("Prova nel browser superata: "+routes.length+" pagine × iPhone/computer × chiaro/scuro, versione "+VERSION+".");
