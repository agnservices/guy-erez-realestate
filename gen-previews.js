// Generates p/<id>.html share pages with WhatsApp/Facebook preview (og:image) for seed listings
const fs=require('fs');global.localStorage={getItem:()=>null,setItem(){}};global.window=global;
const src=fs.readFileSync('data.js','utf8');const SEED=eval(src.match(/const SEED = (\[[\s\S]*?\n\]);/)[1].replace(/U\(/g,'U(')&&('(()=>{const U=id=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;return '+src.match(/const SEED = (\[[\s\S]*?\n\]);/)[1]+'})()'));
const B='https://agnservices.github.io/guy-erez-realestate/';fs.mkdirSync('p',{recursive:true});
const e=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
for(const p of SEED){const pr='₪'+p.price.toLocaleString('en-US')+(p.type==='rent'?' לחודש':'');
const t=`${p.title} | ${[p.street,p.neighborhood].filter(Boolean).join(', ')}`;const d=`${pr} · ${p.rooms} חדרים · ${p.sqm} מ"ר · Guy Erez Real Estate`;
fs.writeFileSync(`p/${p.id}.html`,`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${e(t)}</title>
<meta property="og:type" content="website"><meta property="og:title" content="${e(t)}"><meta property="og:description" content="${e(d)}">
<meta property="og:image" content="${e(p.images[0])}"><meta property="og:url" content="${B}p/${p.id}.html"><meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url=../#p${p.id}"><script>location.replace('../#p${p.id}')</script></head><body><a href="../#p${p.id}">${e(t)}</a></body></html>`);}
console.log('generated',SEED.length);
