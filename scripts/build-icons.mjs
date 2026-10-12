import {readFile,writeFile} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
const root=new URL("../",import.meta.url),master=await readFile(new URL("icon-master.svg",root),"utf8");
const hash=bytes=>createHash("sha256").update(bytes).digest("hex");
let sharp,command;
try{const module=await import(process.env.JFLT_SHARP_MODULE||"sharp");sharp=module.default;}
catch{for(const candidate of ["magick","convert"]){const result=spawnSync(candidate,["-version"],{encoding:"utf8"});if(result.status===0&&result.stdout.includes("ImageMagick")){command=candidate;break;}}}
if(!sharp&&!command)throw new Error("Esportazione icone: installa ImageMagick oppure sharp. Le PNG distribuite sono già pronte; non serve rigenerarle per aggiornare l'app.");
const exports=[];
for(const size of [180,192,512]){
  const svg=Buffer.from(master.replace('width="512" height="512"',`width="${size}" height="${size}"`));
  let png;
  if(sharp)png=await sharp(svg,{density:72}).flatten({background:"#13233f"}).removeAlpha().png().toBuffer();
  else{const result=spawnSync(command,["svg:-","-alpha","off","png24:-"],{input:svg,maxBuffer:8*1024*1024});if(result.status!==0)throw new Error("Esportazione icona "+size+": "+String(result.stderr));png=result.stdout;}
  if(png.readUInt32BE(16)!==size||png.readUInt32BE(20)!==size)throw new Error("Dimensioni esportate non corrette: "+size);
  exports.push({file:`icon-${size}.png`,size,sha256:hash(png),png});
}
for(const item of exports)await writeFile(new URL(item.file,root),item.png);
await writeFile(new URL("scripts/icon-assets.json",root),JSON.stringify({master:"icon-master.svg",sha256:hash(master),renderer:sharp?"sharp":"ImageMagick",exports:exports.map(({png,...item})=>item)},null,2)+"\n");
console.log("Icone 180/192/512 esportate dallo stesso master SVG. Rigenera ora la cache con npm run build:sw.");
