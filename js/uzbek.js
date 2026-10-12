// Theme-only presentation extension. Data and functional controllers stay shared.
const svg = paths => `<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const motif=svg('<path d="M16 2C19 9 23 13 30 16C23 19 19 23 16 30C13 23 9 19 2 16C9 13 13 9 16 2Z"/><path d="M16 9L23 16L16 23L9 16Z"/><circle cx="16" cy="16" r="2"/>');
const icons=[svg('<path d="M4 27V15A12 12 0 0128 15V27M10 27V16A6 6 0 0122 16V27M4 27H28M16 4V8"/>'),svg('<circle cx="12" cy="19" r="8"/><circle cx="22" cy="19" r="7"/><path d="M8 7L12 3L16 7L12 11ZM20 8L23 5L26 8L23 11Z"/>'),svg('<path d="M12 24V7L27 4V21M12 10L27 7"/><ellipse cx="8" cy="25" rx="4" ry="3"/><ellipse cx="23" cy="22" rx="4" ry="3"/>'),svg('<path d="M3 10H10L12 6H20L22 10H29V27H3Z"/><circle cx="16" cy="18" r="6"/>'),svg('<path d="M7 4V12M3 4V10Q3 14 7 14Q11 14 11 10V4M7 14V29M25 29V4Q18 6 18 17H25"/>')];
const lantern='<div class="uz-lantern"><span></span><i></i></div>';
export function normalizeGuest(value=''){return value.normalize('NFKC').replace(/[<>\u0000-\u001f\u007f]/g,'').trim().slice(0,60);}
export function enhanceUzbek({config,main,opening,monogram,fullDate,params}){
 const hero=main.querySelector('.hero');hero.classList.add('uz-courtyard');hero.querySelector('.hero-art').classList.add('uz-arch','uz-frame');
 const decor=document.createElement('div');decor.className='uz-courtyard-decor';decor.setAttribute('aria-hidden','true');decor.innerHTML=`<div class="uz-carved-arch"></div>${lantern}${lantern}<div class="uz-adras-accent"></div><div class="uz-dust">${Array.from({length:8},(_,i)=>`<i style="--n:${i}"></i>`).join('')}</div>`;hero.prepend(decor);
 hero.querySelectorAll('.arch-frame>span').forEach(e=>{e.innerHTML=motif;});
 main.querySelectorAll('.ornament').forEach(e=>{e.classList.add('uz-divider');e.innerHTML=motif;});
 main.querySelector('.message').classList.add('uz-suzani');
 const weekdays={Sun:'Yakshanba',Mon:'Dushanba',Tue:'Seshanba',Wed:'Chorshanba',Thu:'Payshanba',Fri:'Juma',Sat:'Shanba'};const weekday=new Intl.DateTimeFormat('en-US',{timeZone:config.timeZone,weekday:'short'}).format(new Date(config.date));main.querySelector('.date-composition>span').textContent=weekdays[weekday];
 const guest=normalizeGuest(params.get('guest')||'');const messageTitle=main.querySelector('.message h2');messageTitle.textContent=guest?`${guest}, Sizni nikoh oqshomimizga taklif etamiz.`:'Aziz mehmonimiz';
 main.querySelectorAll('.timeline-icon').forEach((e,i)=>{e.innerHTML=icons[i%icons.length];});
 const story=document.createElement('section');story.className='uz-story uz-courtyard reveal';story.setAttribute('aria-label','O‘zbek hovlisida iliq oqshom');story.innerHTML=`<div class="uz-story-layers" aria-hidden="true"><div class="uz-story-arch uz-arch"></div>${lantern}${lantern}<div class="uz-greenery"></div><div class="uz-adras-accent"></div></div><p class="eyebrow">BIR OQSHOM · BIR UMRLIK XOTIRA</p><p class="uz-story-phrase">Baxtimizga sherik bo‘ling.</p>`;main.querySelector('.schedule').after(story);
 const location=main.querySelector('.location');location.querySelector('.eyebrow').textContent='MANZIL';const map=location.querySelector('.cta');if(map){map.replaceChildren(document.createTextNode('Xaritada ochish'));const icon=document.createElement('span');icon.innerHTML=svg('<path d="M25 13C25 21 16 29 16 29S7 21 7 13A9 9 0 0125 13Z"/><circle cx="16" cy="13" r="3"/>');map.append(icon);}location.querySelector('.venue-art>span').innerHTML=motif;
 const submit=main.querySelector('button[type=submit]');submit.firstChild.textContent='Javobni yuborish ';submit.querySelector('span').innerHTML=svg('<path d="M6 26L26 6M7 6H26V25"/>');
 const footer=main.querySelector('footer');footer.classList.add('uz-final','uz-suzani');const mono=document.createElement('strong');mono.className='uz-final-monogram';mono.textContent=monogram;footer.querySelector('.ornament').after(mono);footer.querySelector('p').textContent='Sizni intiqlik bilan kutamiz.';
 opening.classList.add('uz-courtyard');const back=decor.cloneNode(true);opening.prepend(back);
 // Clone the real hero so the revealed scene and the destination share exact geometry.
 const reveal=hero.cloneNode(true);reveal.classList.add('uz-opening-hero');reveal.setAttribute('aria-hidden','true');reveal.querySelector('.scroll-cue').remove();opening.prepend(reveal);
 opening.querySelector('.scene-card').remove();opening.querySelector('.opening-copy h1').textContent='Xush kelibsiz';opening.querySelector('#opening-hint').textContent='Taklifnomani ochish';opening.querySelector('.opening-footnote').textContent='Non markaziga mayin teging';opening.querySelector('#open').setAttribute('aria-label','Nonni bosib taklifnomani ochish');
 const line=document.createElement('span');line.className='uz-bread-seam';line.setAttribute('aria-hidden','true');opening.querySelector('.scene').append(line);
 const music=document.querySelector('#music');music.classList.add('uz-music');
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){let pending=false;window.addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{const bounds=story.getBoundingClientRect();story.style.setProperty('--story-depth',`${Math.max(-15,Math.min(15,(innerHeight/2-bounds.top)*.025))}px`);pending=false;});},{passive:true});}
}
