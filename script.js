'use strict';
/* ── micro utils ── */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const lerp=(a,b,t)=>a+(b-a)*t;
const R=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ══════════════════════════════════════
   SMOOTH CURSOR
══════════════════════════════════════ */
(()=>{
  const o=$('#cur-outer'),i=$('#cur-inner');
  if(!o||!i)return;
  let mx=-200,my=-200,ox=-200,oy=-200;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    i.style.left=mx+'px';i.style.top=my+'px';
  },{passive:true});
  (function loop(){
    ox=lerp(ox,mx,.11);oy=lerp(oy,my,.11);
    o.style.left=ox+'px';o.style.top=oy+'px';
    requestAnimationFrame(loop);
  })();
  const HOVER='a,button,.sblob,.edu-frame,.exp-card,.crs-card,.sk-strip,.ctt-soc,.mdot,.epdot,.abq-btn,.abchip,.mini-clr';
  document.addEventListener('mouseover',e=>{if(e.target.closest(HOVER))document.body.classList.add('cbig');});
  document.addEventListener('mouseout',e=>{if(e.target.closest(HOVER))document.body.classList.remove('cbig');});
})();

/* ══════════════════════════════════════
   GLOBAL VAN GOGH SWIRL BG
══════════════════════════════════════ */
(()=>{
  const cv=$('#bg-canvas'),cx=cv.getContext('2d');
  const PAL=['#1b3a6e','#2a5298','#4a7ab5','#7aaad4','#e8b84b','#d4843a','#f5e6c8','#1e2e4a','#0d1826','#3a5e8e'];
  let W,H,T=0;
  const pts=[],stars=[];
  class P{
    constructor(){this.reset();}
    reset(){this.x=R(0,W);this.y=R(0,H);this.px=this.x;this.py=this.y;
      this.sp=R(.28,.72);this.life=R(90,280);this.ml=this.life;
      this.sz=R(.5,1.7);this.col=PAL[0|R(0,PAL.length)];this.c=R(-.6,.6);}
    tick(){this.px=this.x;this.py=this.y;
      const a=Math.sin(this.x/W*5.5+T*.0021)*Math.cos(this.y/H*4.2-T*.0018)*Math.PI*2.5
             +Math.sin(this.x/W*2.8-this.y/H*3.8+T*.0013)*Math.PI*1.3+this.c;
      this.x+=Math.cos(a)*this.sp;this.y+=Math.sin(a)*this.sp;
      this.life--;if(this.life<=0||this.x<-4||this.x>W+4||this.y<-4||this.y>H+4)this.reset();}
    draw(){cx.beginPath();cx.moveTo(this.px,this.py);cx.lineTo(this.x,this.y);
      cx.globalAlpha=(this.life/this.ml)*.5;cx.strokeStyle=this.col;cx.lineWidth=this.sz;cx.lineCap='round';cx.stroke();}
  }
  function build(){
    W=cv.width=innerWidth;H=cv.height=innerHeight;
    for(let i=pts.length;i<780;i++)pts.push(new P());
    stars.length=0;
    for(let i=0;i<120;i++)stars.push({x:R(0,100),y:R(0,72),r:R(.5,2.3),ph:R(0,Math.PI*2),fr:R(.4,1.9),halo:Math.random()>.5});
  }
  build();addEventListener('resize',build);
  (function loop(){
    cx.globalAlpha=.017;cx.fillStyle='#03050c';cx.fillRect(0,0,W,H);
    pts.forEach(p=>{p.tick();p.draw();});
    const t=performance.now()/1000;
    stars.forEach(s=>{
      const a=.18+.8*Math.abs(Math.sin(t*s.fr+s.ph));
      cx.globalAlpha=a*.86;cx.beginPath();cx.arc(s.x/100*W,s.y/100*H,s.r,0,Math.PI*2);cx.fillStyle='#f5e6c8';cx.fill();
      if(s.halo){const g=cx.createRadialGradient(s.x/100*W,s.y/100*H,0,s.x/100*W,s.y/100*H,s.r*7);
        g.addColorStop(0,'rgba(245,230,200,.26)');g.addColorStop(1,'rgba(245,230,200,0)');
        cx.globalAlpha=a*.22;cx.beginPath();cx.arc(s.x/100*W,s.y/100*H,s.r*7,0,Math.PI*2);cx.fillStyle=g;cx.fill();}
    });
    cx.globalAlpha=1;T++;requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════
   BRUSH TRAIL
══════════════════════════════════════ */
(()=>{
  const cv=$('#trail-canvas'),cx=cv.getContext('2d');
  let W,H;
  function r(){W=cv.width=innerWidth;H=cv.height=innerHeight;}
  r();addEventListener('resize',r);
  const trail=[];
  const COLS=['rgba(232,184,75,','rgba(212,132,58,','rgba(74,122,181,','rgba(245,230,200,'];
  document.addEventListener('mousemove',e=>{
    trail.push({x:e.clientX,y:e.clientY,life:1,sz:R(2.2,5.2)});
    if(trail.length>34)trail.shift();
  },{passive:true});
  (function loop(){
    cx.clearRect(0,0,W,H);
    for(let i=1;i<trail.length;i++){
      const p=trail[i],q=trail[i-1];p.life-=.044;if(p.life<=0)continue;
      const ci=Math.floor(i/(34/COLS.length))%COLS.length;
      cx.beginPath();cx.moveTo(q.x,q.y);cx.lineTo(p.x,p.y);
      cx.strokeStyle=COLS[ci]+(p.life*.36)+')';cx.lineWidth=p.sz*p.life;cx.lineCap='round';cx.stroke();
    }
    for(let i=trail.length-1;i>=0;i--)if(trail[i].life<=0)trail.splice(i,1);
    requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════
   HERO CANVAS
══════════════════════════════════════ */
(()=>{
  const cv=$('#hero-canvas');if(!cv)return;
  const cx=cv.getContext('2d');let W,H,T=0;
  function rs(){W=cv.width=cv.offsetWidth||innerWidth;H=cv.height=cv.offsetHeight||innerHeight;}
  rs();addEventListener('resize',rs);
  const arcs=Array.from({length:12},(_,i)=>({a:R(0,Math.PI*2),sp:R(.003,.009),col:`hsla(${R(200,240)},55%,${R(38,68)}%,`,lw:R(1,3.5),len:R(55,190)}));
  (function loop(){
    cx.clearRect(0,0,W,H);
    arcs.forEach((arc,i)=>{arc.a+=arc.sp;const Rv=W*.22+i*16;
      const x=W/2+Math.cos(arc.a)*Rv,y=H/2+Math.sin(arc.a)*Rv*.55;
      cx.save();cx.translate(x,y);cx.beginPath();cx.arc(0,0,arc.len,arc.a,arc.a+1.6);
      cx.strokeStyle=arc.col+(.06+.04*Math.sin(T*.03+i))+')';cx.lineWidth=arc.lw;cx.stroke();cx.restore();
    });
    T++;requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════
   PRELOADER
══════════════════════════════════════ */
(()=>{
  const cv=$('#pre-canvas');if(!cv)return;
  const cx=cv.getContext('2d');let a=0,raf;
  function draw(){
    cx.clearRect(0,0,260,260);
    cx.save();cx.beginPath();cx.arc(130,130,104,0,Math.PI*2);cx.fillStyle='#020408';cx.fill();cx.restore();
    for(let i=0;i<7;i++){const ang=a+i*(Math.PI/3.5);
      cx.beginPath();cx.arc(130,130,104*(.3+i*.09),ang,ang+Math.PI*.85);
      cx.strokeStyle=['#e8b84b','#4a7ab5','#2a5298','#d4843a','#7aaad4','#f5e6c8','#1b3a6e'][i];
      cx.lineWidth=2.1-i*.17;cx.globalAlpha=.74;cx.stroke();}
    for(let i=0;i<22;i++){const ang=(i/22)*Math.PI*2+a*.28;const d=104*(.38+.55*Math.abs(Math.sin(i*1.4)));
      cx.beginPath();cx.arc(130+Math.cos(ang)*d,130+Math.sin(ang)*d,1.3,0,Math.PI*2);
      cx.fillStyle='#f5e6c8';cx.globalAlpha=.4+.5*Math.abs(Math.sin(a+i));cx.fill();}
    cx.globalAlpha=1;a+=.047;raf=requestAnimationFrame(draw);
  }
  draw();
  addEventListener('load',()=>setTimeout(()=>{cancelAnimationFrame(raf);const p=$('#preloader');p.classList.add('done');p.addEventListener('transitionend',()=>p.remove(),{once:true});},1200));
})();

/* ══════════════════════════════════════
   NAV scroll + active
══════════════════════════════════════ */
(()=>{
  const nav=$('#nav'),links=$$('.nav-ul a');
  const IDS=['hero','about','skills','experience','courses','education','contacts'];
  addEventListener('scroll',()=>{
    nav.classList.toggle('slim',scrollY>60);
    let cur='';IDS.forEach(id=>{const el=document.getElementById(id);if(el&&scrollY>=el.offsetTop-220)cur=id;});
    links.forEach(l=>l.classList.toggle('on',l.getAttribute('href').slice(1)===cur));
  },{passive:true});
  $('#nav-logo')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
})();

/* ══════════════════════════════════════
   HERO WORDS + ORBIT
══════════════════════════════════════ */
$$('.h1-word').forEach((el,i)=>el.style.animationDelay=(i*80)+'ms');
(()=>{
  const ring=$('#orbit-ring');if(!ring)return;
  const words=['design','dream','create','craft','build','paint','imagine','ship','iterate','research','prototype','UX','sketch','refine','motion','light'];
  let idx=0;
  setInterval(()=>{
    const w=document.createElement('span');w.className='orbit-word';w.textContent=words[idx++%words.length];
    w.style.cssText=`left:${R(5,88)}%;top:${R(12,82)}%;--or:${R(-15,15)}deg;--od:${R(4,7)}s;--odel:0s`;
    ring.appendChild(w);setTimeout(()=>w.remove(),7500);
  },1600);
})();

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
(()=>{
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);}});
  },{threshold:.055});
  $$('.rup').forEach(el=>obs.observe(el));
})();

/* ══════════════════════════════════════
   ABOUT — portrait wipe canvas + portrait parallax + dblclick
══════════════════════════════════════ */
(()=>{
  // Wipe canvas (paint reveal effect)
  const wipe=$('#ab-wipe');
  if(wipe){
    const wx=wipe.getContext('2d');let W=0,H=0,T=0,phase=0;
    function rz(){W=wipe.width=wipe.offsetWidth||400;H=wipe.height=wipe.offsetHeight||600;}
    rz();addEventListener('resize',rz);
    // Paint-wipe: starts fully covering, recedes to reveal portrait
    const strokes=Array.from({length:22},(_,i)=>({
      y:i/22,w:1,speed:R(.003,.009),done:false,col:`rgba(${[4,6,14].map(v=>v+~~R(0,8)).join(',')},`
    }));
    (function loop(){
      wx.clearRect(0,0,W,H);
      let allDone=true;
      strokes.forEach(s=>{
        if(s.w>0){allDone=false;s.w=Math.max(0,s.w-s.speed);}else s.done=true;
        if(!s.done){
          wx.fillStyle=s.col+(s.w*.95)+')';
          const jag=Math.sin(T*.06+s.y*8)*(s.w*18);
          wx.fillRect(s.w*W+jag,s.y*H,W,H/22+2);
        }
      });
      T++;if(!allDone)requestAnimationFrame(loop);
    })();
  }

  // Portrait parallax
  const col=document.getElementById('ab-img-col');
  const img=document.getElementById('ab-img');
  if(col&&img){
    document.addEventListener('mousemove',e=>{
      const rx=(e.clientX/innerWidth-.5)*4;const ry=(e.clientY/innerHeight-.5)*2.5;
      img.style.transform=`scale(1.05) translate(${rx}px,${ry}px)`;
    },{passive:true});
  }
  // Double-click easter egg
  col?.addEventListener('dblclick',openEgg);
})();

/* ══════════════════════════════════════
   ABOUT — Quote rotator
══════════════════════════════════════ */
(()=>{
  const qs=[
    {t:"If you hear a voice within you saying 'you cannot paint' — then by all means paint, and that voice will be silenced.",a:"— Vincent van Gogh"},
    {t:"I dream my painting and I paint my dream.",a:"— Vincent van Gogh"},
    {t:"What would life be if we had no courage to attempt anything?",a:"— Vincent van Gogh"},
    {t:"I am seeking. I am striving. I am in it with all my heart.",a:"— Vincent van Gogh"},
    {t:"Great things are done by a series of small things brought together.",a:"— Vincent van Gogh"},
    {t:"The more I think about it, the more I feel that there is nothing more truly artistic than to love people.",a:"— Vincent van Gogh"},
  ];
  let qi=0;
  const txt=$('#abq-text'),cite=$('#abq-cite'),dotsW=$('#abq-dots');
  if(!txt)return;
  if(dotsW)qs.forEach((_,i)=>{const d=document.createElement('button');d.className='abq-dot'+(i===0?' on':'');d.setAttribute('aria-label',`Quote ${i+1}`);d.addEventListener('click',()=>show(i));dotsW.appendChild(d);});
  function show(n){qi=(n+qs.length)%qs.length;
    txt.style.transition='opacity .3s';txt.style.opacity='0';
    setTimeout(()=>{txt.textContent=qs[qi].t;if(cite)cite.textContent=qs[qi].a;txt.style.opacity='1';},280);
    $$('.abq-dot').forEach((d,i)=>d.classList.toggle('on',i===qi));}
  $('#abq-prev')?.addEventListener('click',()=>show(qi-1));
  $('#abq-next')?.addEventListener('click',()=>show(qi+1));
  setInterval(()=>show(qi+1),7800);
})();

/* ══════════════════════════════════════
   SKILLS — Horizontal drag scroll + strip canvases
══════════════════════════════════════ */
(()=>{
  const track=$('#sk-track');if(!track)return;
  let isDragging=false,startX=0,scrollL=0;
  track.addEventListener('mousedown',e=>{isDragging=true;startX=e.pageX-track.offsetLeft;scrollL=track.scrollLeft||0;track.style.cursor='grabbing';e.preventDefault();});
  document.addEventListener('mousemove',e=>{if(!isDragging)return;const x=e.pageX-track.offsetLeft;track.scrollLeft=scrollL-(x-startX)*1.1;},{passive:true});
  document.addEventListener('mouseup',()=>{isDragging=false;track.style.cursor='grab';});
  track.addEventListener('touchstart',e=>{startX=e.touches[0].pageX-track.offsetLeft;scrollL=track.scrollLeft||0;},{passive:true});
  track.addEventListener('touchmove',e=>{const x=e.touches[0].pageX-track.offsetLeft;track.scrollLeft=scrollL-(x-startX);},{passive:true});

  const stripW=()=>$$('.sk-strip')[0]?.offsetWidth+2||360;
  $('#sk-nav-l')?.addEventListener('click',()=>{track.scrollBy({left:-stripW(),behavior:'smooth'});});
  $('#sk-nav-r')?.addEventListener('click',()=>{track.scrollBy({left:stripW(),behavior:'smooth'});});

  // Secret strip -> egg
  $('#sk-secret')?.addEventListener('click',openEgg);

  // Live particle canvas inside each strip
  $$('.strip-cv').forEach((cv,si)=>{
    const strip=cv.parentElement;const acc=strip.style.getPropertyValue('--acc')||'#e8b84b';
    const cx=cv.getContext('2d');let W=0,H=0,T=0;
    function rz(){W=cv.width=strip.offsetWidth;H=cv.height=strip.offsetHeight;}
    rz();addEventListener('resize',rz);
    const pts=Array.from({length:55},()=>({x:R(0,1),y:R(0,1),a:R(0,Math.PI*2),sp:R(.0002,.0006),life:R(60,200),ml:0}));
    pts.forEach(p=>p.ml=p.life);
    const col=acc.startsWith('#')?acc:'#e8b84b';
    (function loop(){
      cx.globalAlpha=.025;cx.fillStyle='rgba(0,0,0,1)';cx.fillRect(0,0,W,H);
      pts.forEach(p=>{
        p.a+=Math.sin(p.x*4+T*.002)*0.07;p.x+=Math.cos(p.a)*p.sp;p.y+=Math.sin(p.a)*p.sp;
        if(p.x<0)p.x=1;if(p.x>1)p.x=0;if(p.y<0)p.y=1;if(p.y>1)p.y=0;
        p.life--;if(p.life<=0){p.x=R(0,1);p.y=R(0,1);p.life=p.ml;}
        cx.beginPath();cx.arc(p.x*W,p.y*H,R(.4,1.5),0,Math.PI*2);
        cx.fillStyle=col;cx.globalAlpha=(p.life/p.ml)*.22;cx.fill();
      });
      cx.globalAlpha=1;T++;requestAnimationFrame(loop);
    })();
  });

  // Animate language bars when visible
  const langObs=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){
      e.target.querySelectorAll('.sklb-f').forEach(f=>{if(f.dataset.w)f.style.width=f.dataset.w+'%';});
    }});
  },{threshold:.1});
  $$('.sk-strip').forEach(s=>langObs.observe(s));
})();

/* ══════════════════════════════════════
   EXPERIENCE — Timeline accordion + spine fill
══════════════════════════════════════ */
(()=>{
  // Accordion
  $$('.exp-card-head').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const i=btn.dataset.target;const card=btn.closest('.exp-card');
      const isOpen=card.dataset.open==='true';
      // close all
      $$('.exp-card').forEach(c=>{c.dataset.open='false';c.querySelector('.exp-toggle-icon').textContent='add';});
      if(!isOpen){card.dataset.open='true';btn.querySelector('.exp-toggle-icon').textContent='remove';}
    });
  });

  // Spine paint-fill on scroll
  const path=$('#exp-path-fill');
  if(path){
    const total=path.getTotalLength();
    path.style.strokeDasharray=total;
    path.style.strokeDashoffset=total;
    const obs=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting)animatePath();});
    },{threshold:.05});
    const section=$('#experience');if(section)obs.observe(section);
    function animatePath(){let offset=total;const step=total/120;
      (function frame(){offset=Math.max(0,offset-step);path.style.strokeDashoffset=offset;if(offset>0)requestAnimationFrame(frame);})();}
  }
})();

/* ══════════════════════════════════════
   COURSES — background canvas
══════════════════════════════════════ */
(()=>{
  const cv=$('#courses-canvas');if(!cv)return;
  const cx=cv.getContext('2d');let W,H,T=0;
  function rs(){W=cv.width=cv.offsetWidth||innerWidth;H=cv.height=cv.offsetHeight||600;}
  rs();addEventListener('resize',rs);
  const pts=Array.from({length:180},()=>({x:R(0,1),y:R(0,1),a:R(0,Math.PI*2),sp:R(.0002,.0006),col:['#1b3a6e','#2a5298','#e8b84b','#d4843a','#4a7ab5'][0|R(0,5)],sz:R(.4,1.7),life:R(80,240),ml:0}));
  pts.forEach(p=>p.ml=p.life);
  (function loop(){
    cx.globalAlpha=.02;cx.fillStyle='#0c1528';cx.fillRect(0,0,W,H);
    pts.forEach(p=>{
      p.a+=Math.sin(p.x*4+T*.0018)*0.07;p.x+=Math.cos(p.a)*p.sp;p.y+=Math.sin(p.a)*p.sp;
      if(p.x<0)p.x=1;if(p.x>1)p.x=0;if(p.y<0)p.y=1;if(p.y>1)p.y=0;
      p.life--;if(p.life<=0){p.x=R(0,1);p.y=R(0,1);p.life=p.ml;}
      cx.beginPath();cx.arc(p.x*W,p.y*H,p.sz,0,Math.PI*2);cx.fillStyle=p.col;cx.globalAlpha=(p.life/p.ml)*.25;cx.fill();
    });
    cx.globalAlpha=1;T++;requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════
   CONTACT — candle canvas + date
══════════════════════════════════════ */
(()=>{
  const dateEl=$('#ctt-date');if(dateEl){const d=new Date();dateEl.textContent=d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});}
  const cv=$('#candle-canvas');if(!cv)return;
  const cx=cv.getContext('2d');let W,H,T=0;
  function rs(){const r=cv.parentElement.getBoundingClientRect();W=cv.width=r.width||innerWidth;H=cv.height=r.height||800;}
  rs();addEventListener('resize',rs);
  const sparks=Array.from({length:38},()=>({x:R(.2,.4),y:R(.45,.75),a:R(-Math.PI*.85,-Math.PI*.15),sp:R(.0003,.001),life:R(30,100),ml:0}));
  sparks.forEach(s=>s.ml=s.life);
  (function loop(){
    cx.clearRect(0,0,W,H);const t=T*.03;
    const g=cx.createRadialGradient(W*.28,H*.55,0,W*.28,H*.55,H*.42);
    g.addColorStop(0,`rgba(201,125,42,${.06+.025*Math.sin(t)})`);
    g.addColorStop(.5,`rgba(180,100,30,${.03+.012*Math.sin(t+1)})`);
    g.addColorStop(1,'rgba(180,100,30,0)');
    cx.fillStyle=g;cx.fillRect(0,0,W,H);
    sparks.forEach(s=>{
      s.x+=Math.cos(s.a)*s.sp;s.y+=Math.sin(s.a)*s.sp-s.sp*.45;
      s.life--;if(s.life<=0){s.x=R(.2,.4);s.y=R(.45,.75);s.life=s.ml;s.sp=R(.0003,.001);s.a=R(-Math.PI*.85,-Math.PI*.15);}
      const al=s.life/s.ml;
      cx.beginPath();cx.arc(s.x*W,s.y*H,R(.4,1.4),0,Math.PI*2);cx.fillStyle=`rgba(245,210,130,${al*.38})`;cx.fill();
    });
    cx.globalAlpha=1;T++;requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════
   MINI PAINT CANVAS
══════════════════════════════════════ */
(()=>{
  const cv=$('#mini-canvas');if(!cv)return;
  const cx=cv.getContext('2d');let painting=false,lx=0,ly=0,col='#e8b84b';
  function bg(){const g=cx.createLinearGradient(0,0,0,cv.height);g.addColorStop(0,'#03060f');g.addColorStop(1,'#0a1422');cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);}
  bg();
  function pos(e){const r=cv.getBoundingClientRect(),sx=cv.width/r.width,sy=cv.height/r.height;const cl=e.touches?e.touches[0]:e;return[(cl.clientX-r.left)*sx,(cl.clientY-r.top)*sy];}
  function stroke(e){if(!painting)return;const[x,y]=pos(e);
    cx.beginPath();cx.moveTo(lx,ly);cx.lineTo(x,y);cx.strokeStyle=col;cx.lineWidth=R(2.2,5);cx.lineCap='round';cx.globalAlpha=.78;cx.stroke();
    for(let i=0;i<3;i++){cx.beginPath();cx.arc(x+R(-8,8),y+R(-8,8),R(1,3),0,Math.PI*2);cx.fillStyle=col;cx.globalAlpha=.15;cx.fill();}
    cx.globalAlpha=1;[lx,ly]=[x,y];}
  cv.addEventListener('mousedown',e=>{painting=true;[lx,ly]=pos(e);});
  cv.addEventListener('mousemove',stroke);
  cv.addEventListener('mouseup',()=>painting=false);
  cv.addEventListener('mouseleave',()=>painting=false);
  cv.addEventListener('touchstart',e=>{e.preventDefault();painting=true;[lx,ly]=pos(e);},{passive:false});
  cv.addEventListener('touchmove',e=>{e.preventDefault();stroke(e);},{passive:false});
  cv.addEventListener('touchend',()=>painting=false);
  $$('.mdot').forEach(b=>{b.addEventListener('click',()=>{$$('.mdot').forEach(x=>x.classList.remove('on'));b.classList.add('on');col=b.dataset.c;});});
  $('#mini-clear')?.addEventListener('click',()=>bg());
})();

/* ══════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════ */
(()=>{
  const btn=$('#theme-btn'),icon=$('#theme-icon');if(!btn)return;
  if(localStorage.getItem('vg-light')==='1'){document.body.classList.add('light');if(icon)icon.textContent='dark_mode';}
  btn.addEventListener('click',()=>{
    document.body.classList.toggle('light');
    const on=document.body.classList.contains('light');
    localStorage.setItem('vg-light',on?'1':'0');
    if(icon)icon.textContent=on?'dark_mode':'light_mode';
  });
})();

/* ══════════════════════════════════════
   EASTER EGG — Starry Night paint canvas
══════════════════════════════════════ */
function openEgg(){
  const m=$('#egg-modal');
  if(m){m.classList.add('open');m.setAttribute('aria-hidden','false');initEggCanvas();}
}

(()=>{
  const modal=$('#egg-modal'),closeBtn=$('#egg-close'),clearBtn=$('#egg-clear');
  const cv=$('#egg-canvas');if(!cv||!modal)return;
  const cx=cv.getContext('2d');const EW=cv.width,EH=cv.height;
  let painting=false,lx=0,ly=0,col='#E8B84B',inited=false;

  window.initEggCanvas=function(){
    if(inited)return;inited=true;
    const g=cx.createLinearGradient(0,0,0,EH);g.addColorStop(0,'#010812');g.addColorStop(.55,'#0b1a3e');g.addColorStop(1,'#182e58');cx.fillStyle=g;cx.fillRect(0,0,EW,EH);
    // moon glow
    const mg=cx.createRadialGradient(EW*.2,EH*.16,0,EW*.2,EH*.16,55);mg.addColorStop(0,'rgba(245,232,188,.95)');mg.addColorStop(.2,'rgba(232,198,120,.52)');mg.addColorStop(1,'rgba(220,178,75,0)');cx.beginPath();cx.arc(EW*.2,EH*.16,55,0,Math.PI*2);cx.fillStyle=mg;cx.fill();
    // stars
    for(let i=0;i<75;i++){const sx=R(0,EW),sy=R(0,EH*.72),sr=R(.5,2.9);
      const sg=cx.createRadialGradient(sx,sy,0,sx,sy,sr*5);sg.addColorStop(0,'rgba(255,248,210,1)');sg.addColorStop(.35,'rgba(222,200,130,.42)');sg.addColorStop(1,'rgba(220,200,130,0)');
      cx.beginPath();cx.arc(sx,sy,sr*5,0,Math.PI*2);cx.fillStyle=sg;cx.fill();
      cx.beginPath();cx.arc(sx,sy,sr,0,Math.PI*2);cx.fillStyle='rgba(255,255,220,.9)';cx.fill();}
    // swirl clouds
    [[EW*.42,EH*.28,62,'rgba(74,122,181,'],[EW*.62,EH*.34,44,'rgba(42,82,152,'],[EW*.3,EH*.42,40,'rgba(116,164,212,']].forEach(([bx,by,br,bc])=>{
      for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2,len=br*R(.5,.9);
        cx.save();cx.translate(bx,by);cx.beginPath();cx.moveTo(Math.cos(a)*br*.2,Math.sin(a)*br*.2);
        cx.quadraticCurveTo(Math.cos(a+.8)*len*.6,Math.sin(a+.8)*len*.6,Math.cos(a+.3)*len,Math.sin(a+.3)*len);
        cx.strokeStyle=bc+R(.25,.55)+')';cx.lineWidth=R(1.5,3.2);cx.lineCap='round';cx.stroke();cx.restore();}
    });
    // hills
    cx.fillStyle='#030e06';cx.beginPath();cx.moveTo(0,EH*.82);
    for(let x=0;x<=EW;x+=6)cx.lineTo(x,EH*.82+Math.sin(x*.03)*10+R(-2,2));
    cx.lineTo(EW,EH);cx.lineTo(0,EH);cx.closePath();cx.fill();
    // cypress
    cx.fillStyle='#040c04';cx.beginPath();cx.moveTo(EW*.77,EH*.8);cx.bezierCurveTo(EW*.74,EH*.52,EW*.75,EH*.2,EW*.77,EH*.04);cx.bezierCurveTo(EW*.79,EH*.2,EW*.8,EH*.52,EW*.77,EH*.8);cx.fill();
  };

  function getP(e){const r=cv.getBoundingClientRect(),sx=cv.width/r.width,sy=cv.height/r.height;const cl=e.touches?e.touches[0]:e;return[(cl.clientX-r.left)*sx,(cl.clientY-r.top)*sy];}
  function swirl(x,y){
    for(let i=0;i<16;i++){const a=(i/16)*Math.PI*2,len=R(10,28);
      cx.beginPath();cx.moveTo(x,y);cx.quadraticCurveTo(x+Math.cos(a+.9)*len*.45,y+Math.sin(a+.9)*len*.45,x+Math.cos(a+.3)*len,y+Math.sin(a+.3)*len);
      cx.strokeStyle=col;cx.lineWidth=R(1.5,3.2);cx.lineCap='round';cx.globalAlpha=R(.42,.84);cx.stroke();}
    cx.globalAlpha=1;}

  cv.addEventListener('mousedown',e=>{painting=true;[lx,ly]=getP(e);swirl(lx,ly);});
  cv.addEventListener('mousemove',e=>{if(!painting)return;[lx,ly]=getP(e);swirl(lx,ly);});
  cv.addEventListener('mouseup',()=>painting=false);cv.addEventListener('mouseleave',()=>painting=false);
  cv.addEventListener('touchstart',e=>{e.preventDefault();painting=true;[lx,ly]=getP(e);},{passive:false});
  cv.addEventListener('touchmove',e=>{e.preventDefault();if(!painting)return;[lx,ly]=getP(e);swirl(lx,ly);},{passive:false});
  cv.addEventListener('touchend',()=>painting=false);

  $$('.epdot').forEach(b=>{b.addEventListener('click',()=>{$$('.epdot').forEach(x=>x.classList.remove('on'));b.classList.add('on');col=b.dataset.c;});});
  clearBtn?.addEventListener('click',()=>{inited=false;initEggCanvas();});

  function close(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}
  closeBtn?.addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});

  // Egg triggers
  $('#footer-star')?.addEventListener('click',openEgg);
  window.openEgg=openEgg;

  // Konami code
  let kseq=[];const K=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  document.addEventListener('keydown',e=>{kseq.push(e.key);if(kseq.length>10)kseq.shift();if(kseq.join(',')===K.join(','))openEgg();});

  // Click name 5x
  let nc=0;$('#hero-h1')?.addEventListener('click',()=>{nc++;if(nc>=5){
    const pop=document.createElement('div');
    pop.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9900;font-family:"IM Fell English",serif;font-style:italic;font-size:1.35rem;color:#e8b84b;text-align:center;pointer-events:none;background:rgba(3,5,12,.97);padding:26px 42px;border:1px solid rgba(232,184,75,.3);max-width:480px;line-height:1.72;opacity:0;transition:opacity .4s';
    pop.textContent='"What would life be if we had no courage to attempt anything?" — Van Gogh';
    document.body.appendChild(pop);requestAnimationFrame(()=>pop.style.opacity='1');
    setTimeout(()=>{pop.style.opacity='0';setTimeout(()=>pop.remove(),400);},4200);nc=0;}});
})();