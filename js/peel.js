import {installPeelRibbons} from './peel-ribbons.js';
// Theme-only visuals and pointer interaction; the shared engine owns opening/audio.
export const PEEL_THRESHOLD = 0.92;
export function dragProgress(start, current, distance) {
  return Math.max(0, Math.min(1, (current - start) / Math.max(1, distance)));
}
export function giftCardData(cards) {
  if (!Array.isArray(cards)) return [];
  return cards.filter(card => card && typeof card.holder === 'string' && typeof card.number === 'string')
    .map(({holder, number}) => ({holder:holder.trim().slice(0,100),number:number.replace(/[\s-]/g,'')}))
    .filter(card => card.holder && /^\d{12,19}$/.test(card.number)).slice(0,2);
}
const rings = '<svg viewBox="0 0 90 60" fill="none" aria-hidden="true"><circle cx="33" cy="35" r="20" stroke="currentColor" stroke-width="1.4"/><circle cx="58" cy="35" r="19" stroke="currentColor" stroke-width="1.4"/><path d="M25 10L33 3L41 10L33 17ZM55 13L60 8L65 13L60 18Z" stroke="currentColor" stroke-width="1.2"/></svg>';
const dove = '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M17 59C29 49 27 36 15 15C39 19 53 33 59 41C68 30 88 19 107 21C101 38 89 44 77 48C92 48 101 53 110 60C96 64 88 66 75 63C60 76 42 68 35 63L13 69L17 59Z" fill="#fffaf2" stroke="#c3b39a" stroke-width=".8"/><path d="M28 29C38 39 47 45 59 48M84 30L68 43" fill="none" stroke="#d9cdbb" stroke-width=".9"/><circle cx="75" cy="54" r="1" fill="#a6977e"/></svg>';
export async function copyCardNumber(number) {
  if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(number);return true;}catch{/* Try the user-gesture fallback below. */}}
  const previous=document.activeElement;const field=document.createElement('textarea');field.value=number;field.readOnly=true;field.setAttribute('aria-hidden','true');field.tabIndex=-1;field.style.cssText='position:fixed;top:0;left:0;opacity:0;width:1px;height:1px';
  document.body.append(field);
  try{field.select();field.setSelectionRange(0,number.length);return Boolean(document.execCommand?.('copy'));}catch{return false;}
  finally{field.remove();previous?.focus({preventScroll:true});}
}
export function renderGiftCards(main, cards, demo=false, wording={}) {
  main.querySelector('.peel-gifts')?.remove();
  const data=giftCardData(cards); if (!data.length) return;
  const section=document.createElement('section');section.className='peel-gifts reveal';if(!main.hidden)section.classList.add('visible');
  const heading=document.createElement('h2');heading.textContent=wording.title??'To‘yona uchun karta';
  const intro=document.createElement('p');intro.textContent=wording.intro??'Ishtirokingiz — biz uchun eng katta sovg‘a.';
  const description=document.createElement('p');description.className='gift-description';description.textContent=wording.description??'Agar istasangiz, ezgu tilaklaringizni to‘yona shaklida ham ulashishingiz mumkin.';
  section.append(heading,intro,description);
  for (const card of data) {
    const visual=document.createElement('article');visual.className='peel-gift-card';visual.setAttribute('aria-label','Sovg‘a uchun karta');
    const number=document.createElement('p');number.className='gift-number';number.textContent=card.number.replace(/(.{4})/g,'$1 ').trim();
    const holder=document.createElement('p');holder.className='gift-holder';holder.textContent=card.holder;
    // Deliberately project only these two fields: never expiry, CVV or other metadata.
    visual.append(number,holder);section.append(visual);
    const actions=document.createElement('div');actions.className='gift-copy-actions';
    const copy=document.createElement('button');copy.type='button';copy.className='gift-copy-number';copy.textContent='Karta raqamini nusxalash';copy.setAttribute('aria-label',`${card.holder}: karta raqamini nusxalash`);
    const feedback=document.createElement('p');feedback.className='gift-copy-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
    let copying=false;copy.addEventListener('click',async()=>{if(copying)return;copying=true;copy.setAttribute('aria-busy','true');const copied=await copyCardNumber(card.number);feedback.textContent=copied?'Karta raqami nusxalandi':'Nusxalash imkoni bo‘lmadi. Raqamni belgilang va nusxalang.';copying=false;copy.removeAttribute('aria-busy');});actions.append(copy,feedback);section.append(actions);
  }
  if(demo){const note=document.createElement('p');note.className='gift-demo-note';note.textContent='Namuna karta — haqiqiy to‘lov uchun emas.';section.append(note);}
  main.querySelector('.rsvp').before(section);
}
export function setupPeel({main, opening, config, complete}) {
  const button=opening.querySelector('#open');const scene=opening.querySelector('.scene');
  const track=document.createElement('div');track.className='peel-track';track.setAttribute('aria-hidden','true');
  track.innerHTML='<span class="peel-torn"></span><span class="peel-intact"></span><span class="peel-removed"></span>';scene.append(track);
  button.innerHTML='<span class="peel-grip" aria-hidden="true">→</span>';
  button.setAttribute('role','slider');button.setAttribute('aria-label','Konvert lentasini o‘ngga torting');
  button.setAttribute('aria-valuemin','0');button.setAttribute('aria-valuemax','100');button.setAttribute('aria-valuenow','0');button.setAttribute('aria-orientation','horizontal');button.setAttribute('aria-describedby','opening-hint');
  opening.querySelector('#opening-hint').textContent='Lentani oxirigacha o‘ngga torting';
  opening.querySelector('.opening-footnote').textContent='Klaviatura: → bilan torting, ← bilan qaytaring';
  opening.querySelector('.opening-copy h1').textContent='Muhabbat bilan, sizga';
  const seal=document.createElement('div');seal.className='peel-embossed-rings';seal.setAttribute('aria-hidden','true');seal.innerHTML=rings;opening.querySelector('.ceremony').append(seal);const monogram=document.createElement('span');monogram.className='peel-envelope-monogram';monogram.textContent=scene.querySelector('.scene-card strong').textContent;opening.querySelector('.ceremony').append(monogram);
  const floral='<svg viewBox="0 0 100 50" aria-hidden="true" fill="none" stroke="currentColor" stroke-width=".85"><path d="M10 40C32 36 43 23 50 7C57 23 68 36 90 40M50 7V42M30 32C14 28 20 17 30 32ZM38 24C27 10 38 7 38 24ZM70 32C86 28 80 17 70 32ZM62 24C73 10 62 7 62 24Z"/><circle cx="50" cy="7" r="3"/></svg>';
  main.querySelectorAll('.ornament').forEach(node=>{node.classList.add('peel-floral-divider');node.innerHTML=floral;});
  const flourish=document.createElement('div');flourish.className='peel-envelope-flourish';flourish.setAttribute('aria-hidden','true');flourish.innerHTML=floral;opening.querySelector('.ceremony').append(flourish);
  const endMonogram=document.createElement('strong');endMonogram.className='peel-final-monogram';endMonogram.textContent=monogram.textContent;main.querySelector('footer .ornament').after(endMonogram);
  main.querySelectorAll('.arch-frame>span').forEach(n=>{n.className='peel-rings';n.innerHTML=rings;});
  const birds=document.createElement('div');birds.className='peel-doves';birds.setAttribute('aria-hidden','true');birds.innerHTML=dove;
  main.querySelector('.hero').append(birds);
  main.querySelectorAll('.cta>span').forEach(span=>{span.classList.add('peel-cta-icon');span.setAttribute('aria-hidden','true');span.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 19L19 5M6 5H19V18"/></svg>';});
  const mapLink=main.querySelector('.location a.cta');if(mapLink)mapLink.firstChild.textContent='Xaritada ochish ';
  const weekday=new Intl.DateTimeFormat('en-US',{timeZone:config.timeZone,weekday:'short'}).format(new Date(config.date));main.querySelector('.date-composition>span').textContent={Sun:'Yakshanba',Mon:'Dushanba',Tue:'Seshanba',Wed:'Chorshanba',Thu:'Payshanba',Fri:'Juma',Sat:'Shanba'}[weekday];
  const final=main.querySelector('footer');final.classList.add('peel-final');const finalDove=birds.cloneNode(true);final.append(finalDove);
  renderGiftCards(main,config.giftCards,config.giftCardsDemo===true,config.themeOptions?.peel?.gifting);
  installPeelRibbons(main);
  const hero=main.querySelector('.hero').cloneNode(true);hero.classList.add('peel-opening-hero');hero.setAttribute('aria-hidden','true');hero.querySelector('.scroll-cue').remove();opening.prepend(hero);
  let pointer=null,startX=0,startProgress=0,progress=0,done=false,distance=1;
  function update(value){progress=value;scene.style.setProperty('--peel-progress',progress);scene.style.setProperty('--pull-x',`${progress*distance}px`);button.setAttribute('aria-valuenow',String(Math.round(progress*100)));button.setAttribute('aria-valuetext',`${Math.round(progress*100)} foiz tortildi`);}
  function finish(){if(done)return;done=true;update(1);button.setAttribute('aria-valuetext','Konvert ochilmoqda');complete();}
  function reset(){if(done)return;scene.classList.add('peel-resetting');update(0);}
  function measure(){distance=Math.max(1,track.getBoundingClientRect().width-button.getBoundingClientRect().width);}
  button.addEventListener('pointerdown',event=>{if(done||pointer!==null||!event.isPrimary||event.button!==0)return;event.preventDefault();scene.classList.remove('peel-resetting');measure();pointer=event.pointerId;startX=event.clientX;startProgress=progress;button.setPointerCapture(pointer);});
  button.addEventListener('pointermove',event=>{if(done||event.pointerId!==pointer)return;event.preventDefault();update(dragProgress(startX-startProgress*distance,event.clientX,distance));if(progress>=PEEL_THRESHOLD)finish();});
  button.addEventListener('pointerup',event=>{if(event.pointerId!==pointer)return;pointer=null;if(!done)reset();});
  button.addEventListener('pointercancel',event=>{if(event.pointerId!==pointer)return;pointer=null;reset();});
  button.addEventListener('lostpointercapture',()=>{pointer=null;if(!done)reset();});
  button.addEventListener('keydown',event=>{if(done)return;if(!['ArrowRight','ArrowLeft','Home','Escape','Enter',' '].includes(event.key))return;event.preventDefault();scene.classList.remove('peel-resetting');measure();if(event.key==='ArrowRight'){update(Math.min(1,progress+.1));if(progress>=PEEL_THRESHOLD)finish();}else if(event.key==='ArrowLeft')update(Math.max(0,progress-.1));else if(['Home','Escape'].includes(event.key))reset();});
}
