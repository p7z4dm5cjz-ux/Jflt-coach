const VERSION="1.0.0";
const CACHE="jflt-shell-"+VERSION;
const SHELL=["./","./index.html","./boot.js","./app.js","./theme.css","./engine.js","./storage.js","./tutor.js","./contract.js","./practice-bank.js","./catalog.js","./placement.js","./bookshelf.js","./data.js","./legacy/core.js","./legacy/schema.js","./legacy/learning.js","./legacy/catalog.js","./legacy/placement.js","./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);for(const path of SHELL){const response=await fetch(new Request(path,{cache:"reload"}));if(!response.ok)throw new Error("Incomplete shell: "+path);await cache.put(path,response);}if((await caches.keys()).some(key=>key.startsWith("jflt-coach-0.")))await self.skipWaiting();})()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key!==CACHE&&(key.startsWith("jflt-shell-")||key.startsWith("jflt-coach-")))await caches.delete(key);await self.clients.claim();})()));
self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING"||event.data==="SKIP_WAITING")self.skipWaiting();});
self.addEventListener("fetch",event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=="GET"||url.origin!==self.location.origin)return;
  const shellUrls=SHELL.map(path=>new URL(path,self.registration.scope).href);
  if(request.mode==="navigate"&&url.href.startsWith(self.registration.scope)) {
    event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match("./index.html"))||fetch(request)));return;
  }
  if(shellUrls.includes(url.href))event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(request))||fetch(request)));
});
