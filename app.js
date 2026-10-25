const C=CONFIG;document.title=C.officeName;
logo.textContent=C.officeName;heroT.textContent=C.officeName;heroP.textContent=C.tagline;
const wa=(t='')=>`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t||'שלום, אשמח לפרטים')}`;
waHero.href=waFloat.href=wa();callBtn.href='tel:'+C.phone;
foot.innerHTML=`© ${new Date().getFullYear()} ${esc(C.officeName)} · ${esc(C.phone)} · ${esc(C.email)} · רישיון תיווך ${esc(C.licenseNo)}`;
let props=DB.props();
[...new Set(props.map(p=>p.neighborhood))].forEach(n=>fN.add(new Option(n,n)));
function render(){
  const n=fN.value,t=fT.value,mi=+fMin.value||0,ma=+fMax.value||Infinity,r=+fR.value||0;
  const list=props.filter(p=>(!n||p.neighborhood===n)&&(!t||p.type===t)&&p.price>=mi&&p.price<=ma&&p.rooms>=r)
    .sort((a,b)=>(a.status!=='active')-(b.status!=='active'));
  count.textContent=`נמצאו ${list.length} נכסים`;grid.innerHTML='';
  list.forEach(p=>{const d=document.createElement('div');const rb=ribbonText(p);d.className='card'+(rb?' done':'');
    d.innerHTML=`${rb?`<div class="ribbon">${rb}</div>`:''}<span class="tag">${p.type==='sale'?'למכירה':'להשכרה'}</span><div class="car"></div>
    <div class="cb"><div class="pr">${price(p)}</div><h3>${esc(p.title)}</h3><div style="color:#0b4f8a">${esc(p.neighborhood)}, תל אביב</div>
    <div class="meta"><span>${p.rooms} חד'</span><span>${p.sqm} מ"ר</span><span>קומה ${p.floor}</span></div><button class="btn sm">לפרטים</button></div>`;
    carousel(d.querySelector('.car'),p.images);d.querySelector('.cb').onclick=()=>openM(p.id);grid.appendChild(d)});
}
[fN,fT,fMin,fMax,fR].forEach(e=>e.oninput=render);render();
function openM(id){const p=props.find(x=>x.id==id);if(!p)return;const rb=ribbonText(p);
  mTh.innerHTML=p.images.map(s=>`<img src="${esc(s)}">`).join('');
  const c=carousel(mCar,p.images,i=>mTh.querySelectorAll('img').forEach((t,k)=>t.classList.toggle('on',k===i)));
  mTh.querySelectorAll('img').forEach((t,k)=>t.onclick=()=>c.show(k));
  mC.innerHTML=`${rb?`<div style="background:#d32f2f;color:#fff;display:inline-block;padding:4px 14px;border-radius:6px;font-weight:800">${rb}</div>`:''}
   <div class="pr">${price(p)}</div><h2 style="margin:4px 0">${esc(p.title)}</h2><div>${esc(p.neighborhood)}, תל אביב · ${p.type==='sale'?'למכירה':'להשכרה'}</div>
   <div class="meta"><span>${p.rooms} חדרים</span><span>${p.sqm} מ"ר</span><span>קומה ${p.floor}</span></div><p>${esc(p.description)}</p>
   <h3>מתעניינים בנכס?</h3><form class="form" id="pForm"><div class="two"><input name="name" placeholder="שם מלא" required><input name="phone" type="tel" placeholder="טלפון" required></div><input name="email" type="email" placeholder="אימייל"><textarea name="notes" rows="2" placeholder="הודעה (לא חובה)"></textarea>
   <div><button class="btn">שליחת פרטים</button> <a class="btn alt" target="_blank" href="${wa('שלום, אני מתעניין/ת בנכס: '+p.title+' ('+p.neighborhood+')')}">וואטסאפ על הנכס</a></div></form>`;
  pForm.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(pForm));DB.addLead({...f,propertyId:p.id,property:p.title,source:'טופס נכס'});pForm.reset();toast('תודה! ניצור קשר בהקדם')};
  modal.classList.add('on');document.body.style.overflow='hidden';location.hash='p'+p.id}
function closeM(){modal.classList.remove('on');document.body.style.overflow='';history.replaceState(null,'',location.pathname)}
modal.onclick=e=>{if(e.target===modal)closeM()};document.onkeydown=e=>e.key==='Escape'&&closeM();
genForm.onsubmit=e=>{e.preventDefault();DB.addLead({...Object.fromEntries(new FormData(genForm)),property:'',source:'טופס כללי'});genForm.reset();toast('תודה! ניצור קשר בהקדם')};
if(/^#p\d+/.test(location.hash))openM(location.hash.slice(2));
