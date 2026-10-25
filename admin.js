const ST={New:'חדש',Contacted:'נוצר קשר',Meeting:'פגישה',Signed:'נחתם',Closed:'נסגר'};
logo.textContent=CONFIG.officeName+' – ניהול';
Object.entries(ST).forEach(([k,v])=>lf.add(new Option(v,k)));
gf.onsubmit=e=>{e.preventDefault();if(pw.value===CONFIG.adminPassword){sessionStorage.adm=1;start()}else toast('סיסמה שגויה')};
function start(){gate.style.display='none';app.style.display='block';draw()}
if(sessionStorage.adm)start();
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));['leads','props','agr'].forEach(t=>document.getElementById('t-'+t).style.display=t===b.dataset.t?'':'none')});
lf.onchange=draw;
function draw(){
 const L=DB.leads().filter(l=>!lf.value||l.status===lf.value),P=DB.props(),A=DB.agreements();
 lt.innerHTML='<tr><th>תאריך</th><th>שם</th><th>טלפון</th><th>אימייל</th><th>נכס</th><th>מקור</th><th>סטטוס</th><th>הערות</th><th></th></tr>'+L.map(l=>`<tr><td>${new Date(l.created).toLocaleDateString('he-IL')}</td><td>${esc(l.name)}</td><td><a href="tel:${esc(l.phone)}">${esc(l.phone)}</a></td><td>${esc(l.email)}</td><td>${esc(l.property)}</td><td>${esc(l.source)}</td>
 <td><select onchange="setSt(${l.id},this.value)">${Object.entries(ST).map(([k,v])=>`<option value="${k}" ${l.status===k?'selected':''}>${v}</option>`).join('')}</select></td><td>${esc(l.notes)}</td>
 <td><button class="btn sm gray" onclick="editLead(${l.id})">עריכה</button> <button class="btn sm red" onclick="delLead(${l.id})">מחק</button></td></tr>`).join('');
 pt.innerHTML='<tr><th></th><th>כותרת</th><th>שכונה</th><th>סוג</th><th>מחיר</th><th>חד\'</th><th>סטטוס</th><th></th></tr>'+P.map(p=>`<tr><td><img src="${esc(p.images[0]||'')}" style="width:70px;height:50px;object-fit:cover;border-radius:6px"></td><td>${esc(p.title)}</td><td>${esc(p.neighborhood)}</td><td>${p.type==='sale'?'מכירה':'השכרה'}</td><td>${price(p)}</td><td>${p.rooms}</td>
 <td>${p.status==='active'?'פעיל':`<b style="color:#c62828">${ribbonText(p)}</b>`}</td><td><button class="btn sm gray" onclick="editProp(${p.id})">עריכה</button> <button class="btn sm" onclick="markDone(${p.id})">${p.status==='active'?(p.type==='sale'?'סמן נמכר':'סמן הושכר'):'החזר לפעיל'}</button> <button class="btn sm red" onclick="delProp(${p.id})">מחק</button></td></tr>`).join('');
 const AL=DB.leads();aL.innerHTML=AL.map(l=>`<option value="${l.id}">${esc(l.name)} (${esc(l.phone)})</option>`).join('')||'<option value="">אין לידים</option>';
 aP.innerHTML='<option value="">ללא נכס ספציפי</option>'+P.map(p=>`<option value="${p.id}">${esc(p.title)} – ${esc(p.neighborhood)}</option>`).join('');if(!aF.value)aF.value=CONFIG.defaultFee;
 at.innerHTML='<tr><th>נוצר</th><th>לקוח</th><th>נכס</th><th>דמי תיווך</th><th>סטטוס</th><th>נחתם</th><th></th></tr>'+A.map(a=>`<tr><td>${new Date(a.created).toLocaleString('he-IL')}</td><td>${esc(a.signed?.name||a.leadName)}</td><td>${esc(a.property)}</td><td>${esc(a.fee)}</td><td>${a.signed?'<b style="color:#2e7d32">נחתם ✓</b>':'ממתין לחתימה'}</td><td>${a.signed?new Date(a.signed.at).toLocaleString('he-IL')+'<br>ת"ז: '+esc(a.signed.idNo):''}</td>
 <td><a class="btn sm" target="_blank" href="${link(a)}">${a.signed?'צפייה/PDF':'פתח לחתימה'}</a> <button class="btn sm gray" onclick="navigator.clipboard.writeText('${link(a)}');toast('הקישור הועתק')">העתק קישור</button> ${a.signed?.sig?`<img src="${a.signed.sig}" style="height:34px;vertical-align:middle;background:#fff">`:''}</td></tr>`).join('');
}
function link(a){const d={id:a.id,leadName:a.leadName,phone:a.phone,property:a.property,fee:a.fee,kind:a.kind,created:a.created};return new URL('sign.html#'+btoa(unescape(encodeURIComponent(JSON.stringify(d)))),location.href).href}
function setSt(id,s){const L=DB.leads();L.find(l=>l.id===id).status=s;DB.saveLeads(L)}
function delLead(id){if(confirm('למחוק ליד?')){DB.saveLeads(DB.leads().filter(l=>l.id!==id));draw()}}
function form(title,fields,obj,save){mC.innerHTML=`<h2>${title}</h2><form class="form" id="ef">${fields.map(([k,lab,t,opts])=>`<div><label>${lab}</label>${t==='select'?`<select name="${k}">${opts.map(([v,n])=>`<option value="${v}" ${obj[k]==v?'selected':''}>${n}</option>`).join('')}</select>`:t==='area'?`<textarea name="${k}" rows="4">${esc(obj[k])}</textarea>`:`<input name="${k}" type="${t||'text'}" step="any" value="${esc(obj[k])}">`}</div>`).join('')}<button class="btn">שמירה</button></form>`;
 modal.classList.add('on');ef.onsubmit=e=>{e.preventDefault();save(Object.fromEntries(new FormData(ef)));modal.classList.remove('on');draw();toast('נשמר')}}
function editLead(id){const L=DB.leads();const l=L.find(x=>x.id===id)||{status:'New',source:'ידני'};
 form(id?'עריכת ליד':'ליד חדש',[['name','שם'],['phone','טלפון','tel'],['email','אימייל','email'],['property','נכס מבוקש'],['source','מקור'],['status','סטטוס','select',Object.entries(ST)],['notes','הערות','area']],l,
 f=>{if(id){Object.assign(l,f);DB.saveLeads(L)}else DB.addLead(f)})}
function editProp(id){const P=DB.props();const p=P.find(x=>x.id===id)||{type:'sale',status:'active',images:[]};
 form(id?'עריכת נכס':'נכס חדש',[['title','כותרת'],['neighborhood','שכונה'],['type','סוג','select',[['sale','מכירה'],['rent','השכרה']]],['status','סטטוס','select',[['active','פעיל'],['sold','נמכר'],['rented','הושכר']]],['price','מחיר (₪)','number'],['rooms','חדרים','number'],['sqm','מ"ר','number'],['floor','קומה','number'],['description','תיאור','area'],['images','כתובות תמונות (שורה לכל תמונה)','area']],{...p,images:p.images.join('\n')},
 f=>{const o={...p,...f,price:+f.price,rooms:+f.rooms,sqm:+f.sqm,floor:+f.floor,images:f.images.split(/\s*\n\s*/).filter(Boolean)};if(id)P[P.indexOf(p)]=o;else{o.id=Date.now();P.unshift(o)}DB.saveProps(P)})}
function markDone(id){const P=DB.props();const p=P.find(x=>x.id===id);p.status=p.status==='active'?(p.type==='sale'?'sold':'rented'):'active';DB.saveProps(P);draw()}
function delProp(id){if(confirm('למחוק נכס?')){DB.saveProps(DB.props().filter(p=>p.id!==id));draw()}}
function csv(){const L=DB.leads(),h=['created','name','phone','email','property','source','status','notes'];
 const rows=[['תאריך','שם','טלפון','אימייל','נכס','מקור','סטטוס','הערות'],...L.map(l=>h.map(k=>k==='status'?ST[l[k]]:l[k]))];
 const s='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:'text/csv;charset=utf-8'}));a.download='leads.csv';a.click()}
function newAgr(){const l=DB.leads().find(x=>x.id==aL.value);if(!l)return toast('יש לבחור ליד');const p=DB.props().find(x=>x.id==aP.value);
 const a={id:Date.now(),leadId:l.id,leadName:l.name,phone:l.phone,property:p?`${p.title}, ${p.neighborhood}, תל אביב (${price(p)})`:'',fee:aF.value,kind:aK.value,created:new Date().toISOString()};
 const A=DB.agreements();A.unshift(a);DB.saveAgreements(A);draw();aOut.innerHTML=`קישור לחתימה: <a href="${link(a)}" target="_blank">פתיחה</a> · <a target="_blank" class="btn sm alt" href="https://wa.me/${String(l.phone).replace(/\D/g,'').replace(/^0/,'972')}?text=${encodeURIComponent('שלום '+l.name+', מצורף הסכם תיווך לחתימה: '+link(a))}">שליחה בוואטסאפ</a>`}
