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
export function renderGiftCards(main, cards) {
  main.querySelector('.peel-gifts')?.remove();
  const data=giftCardData(cards); if (!data.length) return;
  const section=document.createElement('section');section.className='peel-gifts reveal';if(!main.hidden)section.classList.add('visible');
  const heading=document.createElement('h2');heading.textContent='Mehringiz — eng go‘zal tuhfa';
  const intro=document.createElement('p');intro.textContent='Ishtirokingiz biz uchun eng katta sovg‘a.';
  section.append(heading,intro);
  for (const card of data) {
    const visual=document.createElement('article');visual.className='peel-gift-card';visual.setAttribute('aria-label','Sovg‘a uchun karta');
    const number=document.createElement('p');number.className='gift-number';number.textContent=card.number.replace(/(.{4})/g,'$1 ').trim();
    const holder=document.createElement('p');holder.className='gift-holder';holder.textContent=card.holder;
    // Deliberately project only these two fields: never expiry, CVV or other metadata.
    visual.append(number,holder);section.append(visual);
  }
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
  main.querySelectorAll('.arch-frame>span').forEach(n=>{n.className='peel-rings';n.innerHTML=rings;});
  const birds=document.createElement('div');birds.className='peel-doves';birds.setAttribute('aria-hidden','true');birds.innerHTML=dove;
  main.querySelector('.hero').append(birds);
  main.querySelectorAll('.cta>span').forEach(span=>{span.classList.add('peel-cta-icon');span.setAttribute('aria-hidden','true');span.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 19L19 5M6 5H19V18"/></svg>';});
  const weekday=new Intl.DateTimeFormat('en-US',{timeZone:config.timeZone,weekday:'short'}).format(new Date(config.date));main.querySelector('.date-composition>span').textContent={Sun:'Yakshanba',Mon:'Dushanba',Tue:'Seshanba',Wed:'Chorshanba',Thu:'Payshanba',Fri:'Juma',Sat:'Shanba'}[weekday];
  const final=main.querySelector('footer');final.classList.add('peel-final');const finalDove=birds.cloneNode(true);final.append(finalDove);
  renderGiftCards(main,config.giftCards);
  const ribbons=document.createElement('div');ribbons.className='peel-side-ribbons';ribbons.setAttribute('aria-hidden','true');
  const ribbon='<svg viewBox="0 0 35 450" preserveAspectRatio="none"><path d="M17 -20C-6 50 39 70 18 138C-6 204 43 242 18 300C-4 358 35 409 15 470" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M28 -40C10 35 42 93 24 164C5 238 36 288 25 358C11 412 30 430 27 475" fill="none" stroke="#fffaf2" stroke-width="2"/><path d="M6 -15C25 38 1 100 11 157C30 220 0 288 9 352C28 406 4 441 10 471" fill="none" stroke="#b69b73" stroke-opacity=".55" stroke-width="1.3"/></svg>';
  ribbons.innerHTML=`<div class="peel-ribbon-left">${ribbon}</div><div class="peel-ribbon-right">${ribbon}</div>`;main.append(ribbons);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){let scheduled=false;window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{ribbons.style.setProperty('--ribbon-y',`${Math.min(160,window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*160)}px`);scheduled=false;});},{passive:true});}
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
