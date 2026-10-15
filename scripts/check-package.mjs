// Verify a complete release ZIP against its source, including all shell bytes.
import {readFile,readdir} from "node:fs/promises";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
const root=resolve(dirname(fileURLToPath(import.meta.url)),".."),archive=process.argv[2];
if(!archive)throw new Error("Uso: node scripts/check-package.mjs /percorso/pacchetto.zip");
const skip=new Set(["node_modules","worker-build",".git",".wrangler"]),hash=bytes=>createHash("sha256").update(bytes).digest("hex");
async function walk(base=""){const files=[];for(const e of await readdir(resolve(root,base),{withFileTypes:true})){if(skip.has(e.name))continue;const path=base+e.name;if(e.isDirectory())files.push(...await walk(path+"/"));else files.push(path);}return files.sort();}
execFileSync("unzip",["-t",archive],{stdio:"pipe"});
const names=execFileSync("unzip",["-Z1",archive],{encoding:"utf8"}).trim().split("\n").filter(n=>!n.endsWith("/")).sort();
assert.deepEqual(names,await walk(),"Lo ZIP deve contenere esattamente tutti i file del progetto, senza dipendenze o residui.");
const bytes=new Map();for(const name of names){const b=execFileSync("unzip",["-p",archive,name],{maxBuffer:10000000});assert.equal(hash(b),hash(await readFile(resolve(root,name))),"File diverso: "+name);bytes.set(name,b);}
for(const name of names.filter(n=>/\.(mjs|js)$/.test(n)))for(const match of bytes.get(name).toString().matchAll(/(?:from\s*|import\s*\()(["'])(\.[^"']+)\1/g)){const dependency=resolve(dirname(resolve(root,name)),match[2]);assert.ok(names.some(n=>resolve(root,n)===dependency),"Import mancante in "+name+": "+match[2]);}
const sw=bytes.get("sw.js").toString(),assets=JSON.parse(sw.match(/^const ASSETS=(.*);$/m)[1]);
for(const asset of assets)assert.equal(hash(bytes.get(asset.path.slice(2))),asset.hash,"Shell non coerente: "+asset.path);
const raw=await readFile(archive);console.log("Pacchetto completo: "+names.length+" file, "+raw.length+" byte; CRC, import, sorgenti e impronte shell OK.\nSHA256 "+hash(raw));
