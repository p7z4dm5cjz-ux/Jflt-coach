import {readFile,readdir} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
import {LESSONS} from "../catalog.js";
import {COVERED_LESSONS} from "../practice-bank.js";
import {VERSION} from "../engine.js";
const root=new URL("../",import.meta.url);
const icons=JSON.parse(await readFile(new URL("scripts/icon-assets.json",root),"utf8"));
const hash=bytes=>createHash("sha256").update(bytes).digest("hex");
assert.equal(hash(await readFile(new URL(icons.master,root))),icons.sha256,"Master icone modificato: esegui npm run build:icons.");
assert.deepEqual(icons.exports.map(x=>x.size),[180,192,512]);
for(const icon of icons.exports){const png=await readFile(new URL(icon.file,root));assert.equal(png.readUInt32BE(16),icon.size);assert.equal(png.readUInt32BE(20),icon.size);assert.equal(hash(png),icon.sha256,"Icona non sincronizzata: "+icon.file);}
async function walk(path){let files=[];for(const e of await readdir(path,{withFileTypes:true})){if([".git","node_modules",".wrangler","worker-build","design"].includes(e.name))continue;const u=new URL(e.name+(e.isDirectory()?"/":""),path);files.push(...e.isDirectory()?await walk(u):[u]);}return files;}
for(const file of await walk(root))if(/\.(mjs|js)$/.test(file.pathname)){const result=spawnSync(process.execPath,["--check",file.pathname],{encoding:"utf8"});assert.equal(result.status,0,result.stderr);}
const config=JSON.parse(await readFile(new URL("wrangler.jsonc",root),"utf8"));
assert.equal(config.name,"jflt-coach");
assert.equal(config.main,"worker/index.js");
assert.equal(config.durable_objects.bindings[0].class_name,"Budget");
assert.deepEqual(config.migrations,[{tag:"v1",new_sqlite_classes:["Budget"]}]);
assert.equal(JSON.parse(await readFile(new URL("package.json",root),"utf8")).version,VERSION);
assert.equal(JSON.parse(await readFile(new URL("package-lock.json",root),"utf8")).version,VERSION);
assert.ok((await readFile(new URL("index.html",root),"utf8")).includes('content="'+VERSION+'"'));
{const page=await readFile(new URL("index.html",root),"utf8");const stale=page.replace('content="'+VERSION+'"',"").match(/\b\d+\.\d+\.\d+\b/);assert.ok(!stale,"index.html contiene una versione scritta a mano: "+stale?.[0]+". Usa data-app-version.");}
assert.ok((await readFile(new URL("sw.js",root),"utf8")).includes('VERSION="'+VERSION+'"'));
assert.deepEqual(new Set(COVERED_LESSONS),new Set(LESSONS.map(l=>l.id)));
const worker=await readFile(new URL("worker/index.js",root),"utf8");
assert.equal(/^\s*import /m.test(worker),false);
console.log("Sintassi, configurazione, release e copertura di "+LESSONS.length+" lezioni verificate.");
