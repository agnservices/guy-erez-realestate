// שכבת נתונים – localStorage (גרסת דמו)
const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;
const SEED = [
 {id:1,street:'רחוב ארלוזורוב',title:'דירת 4 חדרים משופצת',type:'sale',status:'active',neighborhood:'הצפון הישן',price:5200000,rooms:4,sqm:105,floor:3,description:'דוגמה: דירה מוארת עם מרפסת שמש, קרובה לכיכר המדינה ולפארק הירקון.',images:[U('photo-1502672260266-1c1ef2d93688'),U('photo-1505691938895-1758d7feb511'),U('photo-1484154218962-a197022b5858')]},
 {id:2,street:'שדרות רוטשילד',title:'פנטהאוז עם נוף לים',type:'sale',status:'sold',neighborhood:'לב העיר',price:12900000,rooms:5,sqm:180,floor:12,description:'דוגמה: פנטהאוז יוקרתי עם מרפסת גג ונוף פתוח לים.',images:[U('photo-1600596542815-ffad4c1539a9'),U('photo-1600585154340-be6161a56a0c'),U('photo-1600607687939-ce8a6c25118c')]},
 {id:3,street:'רחוב פלורנטין',title:'דירת 2 חדרים להשכרה',type:'rent',status:'active',neighborhood:'פלורנטין',price:6800,rooms:2,sqm:55,floor:2,description:'דוגמה: דירה צעירה ומעוצבת בלב פלורנטין, מרוהטת חלקית.',images:[U('photo-1522708323590-d24dbb6b0267'),U('photo-1493809842364-78817add7ffb'),U('photo-1556909114-f6e7ad7d3136')]},
 {id:4,street:'רחוב איינשטיין',title:'דירת גן 3 חדרים',type:'sale',status:'active',neighborhood:'רמת אביב',price:4700000,rooms:3,sqm:90,floor:0,description:'דוגמה: דירת גן שקטה עם גינה פרטית של 60 מ"ר.',images:[U('photo-1560448204-e02f11c3d0e2'),U('photo-1560185007-cde436f6a4d0'),U('photo-1560185893-a55cbc8c57e8')]},
 {id:5,street:'רחוב שבזי',title:'לופט בנווה צדק',type:'rent',status:'rented',neighborhood:'נווה צדק',price:11500,rooms:3,sqm:95,floor:1,description:'דוגמה: לופט בסגנון תעשייתי בבניין לשימור.',images:[U('photo-1536376072261-38c75010e6c9'),U('photo-1586023492125-27b2c045efd7'),U('photo-1554995207-c18c203602cb')]},
 {id:6,street:'רחוב ויצמן',title:'דירת 5 חדרים לשפחה',type:'sale',status:'active',neighborhood:'בבלי',price:7300000,rooms:5,sqm:130,floor:6,description:'דוגמה: דירה מרווחת עם ממ"ד וחניה כפולה, ליד פארק הירקון.',images:[U('photo-1600566753190-17f0baa2a6c3'),U('photo-1600210492486-724fe5c67fb0'),U('photo-1600573472550-8090b5e0745e')]},
 {id:7,street:'רחוב בן יהודה',title:'סטודיו ליד הים',type:'rent',status:'active',neighborhood:'הצפון הישן',price:5200,rooms:1,sqm:35,floor:4,description:'דוגמה: סטודיו קומפקטי במרחק הליכה מחוף גורדון.',images:[U('photo-1554995207-c18c203602cb'),U('photo-1502005229762-cf1b2da7c5d6'),U('photo-1505691938895-1758d7feb511')]},
 {id:8,street:'רחוב יפת',title:'דירת 3.5 חדרים ביפו',type:'sale',status:'active',neighborhood:'יפו',price:3900000,rooms:3.5,sqm:85,floor:2,description:'דוגמה: דירה בבניין ערבי משופץ עם תקרות גבוהות וקשתות.',images:[U('photo-1512917774080-9991f1c4c750'),U('photo-1484154218962-a197022b5858'),U('photo-1493809842364-78817add7ffb')]}
];
const DB = {
  get(k,d){try{return JSON.parse(localStorage.getItem('tlvre_'+k))??d}catch(e){return d}},
  set(k,v){localStorage.setItem('tlvre_'+k,JSON.stringify(v))},
  props(){let p=this.get('props',null);if(!p){p=SEED;this.set('props',p)}return p},
  saveProps(p){this.set('props',p)},
  leads(){return this.get('leads',[])},
  saveLeads(l){this.set('leads',l)},
  addLead(l){const a=this.leads();l.id=Date.now();l.created=new Date().toISOString();l.status=l.status||'New';a.unshift(l);this.saveLeads(a);return l},
  agreements(){return this.get('agreements',[])},
  saveAgreements(a){this.set('agreements',a)}
};

const price=p=>'₪'+Number(p.price).toLocaleString('he-IL')+(p.type==='rent'?' לחודש':'');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
