// Scroll deforms the lower spline; the first segment and anchor never move.
export function ribbonGeometry(progress, height=844, strand=0) {
  const p=Math.max(0,Math.min(1,progress));const h=Math.max(300,height);
  const anchorX=strand===0?14:25;
  const tailY=h*(1.02+.65*p);
  const amplitude=14+4*Math.sin(p*Math.PI*2+strand);
  const segments=10;const step=(tailY-125)/segments;
  let d=`M ${anchorX} 4 C ${anchorX-7} 35 ${anchorX+7} 82 ${anchorX} 125`;
  for(let i=0;i<segments;i++){
    const y=125+i*step;const direction=i%2?1:-1;
    const bend=Math.max(2,Math.min(34,anchorX+direction*amplitude));const endX=anchorX+direction*3;
    d+=` C ${bend.toFixed(2)} ${(y+step*.3).toFixed(2)} ${bend.toFixed(2)} ${(y+step*.7).toFixed(2)} ${endX} ${(y+step).toFixed(2)}`;
  }
  return {d,anchorX,anchorY:4,tailY};
}
export function installPeelRibbons(main){
  const layer=document.createElement('div');layer.className='peel-side-ribbons';layer.setAttribute('aria-hidden','true');
  layer.innerHTML=['left','right'].map(side=>`<div class="peel-ribbon-${side}"><svg aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="peel-ribbon-${side}-light" x1="0" x2="1"><stop stop-color="${side==='left'?'#863647':'#b68a72'}"/><stop offset=".45" stop-color="${side==='left'?'#c27a83':'#dfc6a3'}"/><stop offset="1" stop-color="${side==='left'?'#873447':'#a27e59'}"/></linearGradient></defs><circle class="ribbon-anchor" cx="14" cy="4" r="2"/><path class="ribbon-main" fill="none" stroke="url(#peel-ribbon-${side}-light)" stroke-width="3.5"/><path class="ribbon-white" fill="none" stroke="#fffdf6" stroke-width="3"/><path class="ribbon-highlight" fill="none" stroke="#fff1db" stroke-opacity=".35" stroke-width=".65"/></svg></div>`).join('');
  main.append(layer);const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  function paint(){frame=0;const height=innerHeight;const scrollRange=Math.max(1,document.documentElement.scrollHeight-height);const progress=reduced.matches?0:Math.max(0,Math.min(1,scrollY/scrollRange));layer.dataset.progress=progress.toFixed(5);
    layer.querySelectorAll('svg').forEach(svg=>{svg.setAttribute('viewBox',`0 0 36 ${Math.ceil(height*1.75)}`);svg.style.height=`${Math.ceil(height*1.75)}px`;const mainPath=ribbonGeometry(progress,height,0),whitePath=ribbonGeometry(progress,height,1);svg.querySelector('.ribbon-main').setAttribute('d',mainPath.d);svg.querySelector('.ribbon-highlight').setAttribute('d',mainPath.d);svg.querySelector('.ribbon-white').setAttribute('d',whitePath.d);svg.dataset.tailY=mainPath.tailY.toFixed(2);});
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);paint();return layer;
}
