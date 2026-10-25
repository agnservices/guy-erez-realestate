const C=CONFIG;let A={};try{A=JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1)))))}catch(e){}
const stored=DB.agreements().find(x=>x.id===A.id);let S=stored?.signed||null;
cN.value=S?.name||A.leadName||'';cP.value=S?.phone||A.phone||'';
const F=(v,ph='____________')=>`<span class="fl">${esc(v)||ph}</span>`;
function doc(){const d=new Date(S?.at||Date.now());const buyer=A.kind!=='seller';
 window.doc_.innerHTML=`<div style="text-align:center;font-weight:800;color:#0b4f8a">${esc(C.officeName)} · ${esc(C.officeNameHe)}</div><h1>הזמנת שירותי תיווך במקרקעין</h1><p style="text-align:center">לפי חוק המתווכים במקרקעין, התשנ"ו-1996</p>
 <p>תאריך: ${F(d.toLocaleDateString('he-IL'))}</p>
 <p><b>המתווך:</b> ${esc(C.officeName)} (${esc(C.officeNameHe)}), רישיון תיווך מס' ${esc(C.licenseNo)}, ${esc(C.address)}, טל' ${esc(C.phone)} (להלן: "המתווך").</p>
 <p><b>הלקוח:</b> שם ${F(S?.name||cN.value)} ת"ז ${F(S?.idNo||cI.value)} טלפון ${F(S?.phone||cP.value)} (להלן: "הלקוח").</p>
 <p><b>הנכס:</b> ${F(A.property,'כפי שיוצג ללקוח על ידי המתווך')}</p>
 <p><b>סוג העסקה:</b> ${buyer?'רכישה / שכירות של הנכס על ידי הלקוח':'מכירה / השכרה של הנכס של הלקוח'}</p>
 <ol>
 <li>הלקוח מזמין בזאת מהמתווך שירותי תיווך בקשר לנכס המפורט לעיל ו/או לנכסים שיוצגו לו על ידי המתווך.</li>
 <li>הלקוח מתחייב לשלם למתווך דמי תיווך בשיעור ${F(A.fee||C.defaultFee)} ממחיר העסקה (בשכירות – כמקובל, משכר הדירה החודשי), וזאת במועד חתימת הסכם מחייב בין הצדדים לעסקה.</li>
 <li>זכאות המתווך לדמי התיווך תקום אם היה הגורם היעיל שהביא להתקשרות הצדדים בהסכם מחייב, כקבוע בסעיף 14 לחוק המתווכים במקרקעין.</li>
 <li>הלקוח מתחייב שלא להעביר מידע שקיבל מהמתווך לגבי הנכס לצד שלישי, ולא לנהל משא ומתן ישיר בעקיפת המתווך.</li>
 <li>${buyer?'':'ככל שתוסכם בלעדיות, תקופתה ופעולות השיווק יפורטו בנספח נפרד בהתאם לסעיף 9(ג) לחוק. '}המתווך מצהיר כי יפעל בנאמנות ובהגינות כלפי הלקוח ויגלה לו כל מידע מהותי הידוע לו בנוגע לנכס.</li>
 <li>המתווך מציין כי ייתכן שהוא פועל גם מטעם הצד השני לעסקה.</li>
 <li>הלקוח מאשר כי חתימתו האלקטרונית על מסמך זה מחייבת כחתימה בכתב יד.</li>
 </ol>
 <p><b>חתימת הלקוח:</b> ${S?.sig?`<img src="${S.sig}" style="height:80px;vertical-align:middle">`:F('')} ${S?`<br><small>נחתם אלקטרונית: ${new Date(S.at).toLocaleString('he-IL')}</small>`:''}</p>
 <p style="font-size:12px;color:#777">* תבנית כללית לדוגמה – אינה מהווה ייעוץ משפטי, יש להתאים ולאשר אצל עורך דין.</p>`}
window.doc_=document.getElementById('doc');doc();[cN,cI,cP].forEach(e=>e.oninput=doc);
// משטח חתימה
const ctx=pad.getContext('2d');let drawn=false,dn=false;
function size(){const r=pad.getBoundingClientRect(),k=devicePixelRatio||1;pad.width=r.width*k;pad.height=r.height*k;ctx.scale(k,k);ctx.lineWidth=2.5;ctx.lineCap='round';ctx.strokeStyle='#0b2a4a';drawn=false}size();
const pt=e=>{const r=pad.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
pad.onpointerdown=e=>{dn=true;pad.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(...pt(e))};
pad.onpointermove=e=>{if(!dn)return;ctx.lineTo(...pt(e));ctx.stroke();drawn=true};
pad.onpointerup=pad.onpointercancel=()=>dn=false;
function clr(){ctx.clearRect(0,0,pad.width,pad.height);drawn=false}
function validId(id){id=String(id).trim();if(!/^\d{5,9}$/.test(id))return false;id=id.padStart(9,'0');return [...id].reduce((s,c,i)=>{let n=c*((i%2)+1);return s+(n>9?n-9:n)},0)%10===0}
go.onclick=async()=>{if(!cN.value.trim())return toast('נא למלא שם מלא');if(!validId(cI.value))return toast('מספר ת"ז אינו תקין');if(!drawn)return toast('נא לחתום');if(!ok.checked)return toast('נא לאשר את תנאי ההסכם');
 S={name:cN.value.trim(),idNo:cI.value.trim(),phone:cP.value.trim(),sig:pad.toDataURL('image/png'),at:new Date().toISOString(),ua:navigator.userAgent};
 const all=DB.agreements();let a=all.find(x=>x.id===A.id);if(!a){a={...A,id:A.id||Date.now()};all.unshift(a)}a.signed=S;DB.saveAgreements(all);
 if(a.leadId){const L=DB.leads();const l=L.find(x=>x.id===a.leadId);if(l){l.status='Signed';DB.saveLeads(L)}}
 doc();fill.style.display='none';done.style.display='block';await pdf()};
async function pdf(){const c=await html2canvas(window.doc_,{scale:2,backgroundColor:'#fff',useCORS:true});const {jsPDF}=window.jspdf;const p=new jsPDF('p','mm','a4');
 const w=210,h=c.height*w/c.width,img=c.toDataURL('image/jpeg',.92);let y=0;while(y<h){if(y)p.addPage();p.addImage(img,'JPEG',0,-y,w,h);y+=297}
 p.save(`הסכם-תיווך-${(S?.name||'לקוח').replace(/\s+/g,'-')}.pdf`)}
if(S){fill.style.display='none';done.style.display='block'}
