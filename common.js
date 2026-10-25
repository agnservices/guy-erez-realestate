// קרוסלה עם חצים + החלקה
function carousel(el,imgs,onChange){
  let i=0;el.innerHTML=`<img src="${esc(imgs[0]||'')}" alt="">`+(imgs.length>1?`<button class="nv prev" aria-label="הקודם">›</button><button class="nv next" aria-label="הבא">‹</button><div class="dots">${imgs.map(()=>'<i></i>').join('')}</div>`:'');
  const img=el.querySelector('img');
  const show=n=>{i=(n+imgs.length)%imgs.length;img.src=imgs[i];el.querySelectorAll('.dots i').forEach((d,k)=>d.classList.toggle('on',k===i));onChange&&onChange(i)};
  el.querySelector('.prev')?.addEventListener('click',e=>{e.stopPropagation();show(i-1)});
  el.querySelector('.next')?.addEventListener('click',e=>{e.stopPropagation();show(i+1)});
  let x0=null;el.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
  el.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(dx>0?i+1:i-1);x0=null});
  show(0);return {show};
}
function toast(m){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2600)}
const ribbonText=p=>p.status==='sold'?'נמכר':p.status==='rented'?'הושכר':'';
