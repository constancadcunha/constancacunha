'use strict';
/* ── micro utils ── */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const lerp=(a,b,t)=>a+(b-a)*t;
const R=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ══════════════════════════════════════
   THEME-AWARE PALETTE CONSTANTS
══════════════════════════════════════ */
const VG_PAL=['#1b3a6e','#2a5298','#4a7ab5','#7aaad4','#e8b84b','#d4843a','#f5e6c8','#1e2e4a','#0d1826','#3a5e8e'];
const MONET_PAL=['#5a8c78','#7abcac','#48866e','#8870a8','#a4c4b4','#c4e0d4','#4a6e8a','#9ab0c0','#78989a','#d4c0e8'];
const VG_TRAIL=['rgba(232,184,75,','rgba(212,132,58,','rgba(74,122,181,','rgba(245,230,200,'];
const MONET_TRAIL=['rgba(90,140,120,','rgba(122,188,172,','rgba(136,112,168,','rgba(74,110,138,'];

const VG_QUOTES=[
  {t:"If you hear a voice within you saying 'you cannot paint' — then by all means paint, and that voice will be silenced.",a:"— Vincent van Gogh"},
  {t:"I dream my painting and I paint my dream.",a:"— Vincent van Gogh"},
  {t:"What would life be if we had no courage to attempt anything?",a:"— Vincent van Gogh"},
  {t:"I am seeking. I am striving. I am in it with all my heart.",a:"— Vincent van Gogh"},
  {t:"Great things are done by a series of small things brought together.",a:"— Vincent van Gogh"},
  {t:"The more I think about it, the more I feel that there is nothing more truly artistic than to love people.",a:"— Vincent van Gogh"},
];
const MONET_QUOTES=[
  {t:"I must have flowers, always and always.",a:"— Claude Monet"},
  {t:"Color is my day-long obsession, joy and torment.",a:"— Claude Monet"},
  {t:"I would like to paint the way a bird sings.",a:"— Claude Monet"},
  {t:"My garden is my most beautiful masterpiece.",a:"— Claude Monet"},
  {t:"The light constantly changes, and that alters the atmosphere and beauty of things every minute.",a:"— Claude Monet"},
  {t:"I am following Nature without being able to grasp her.",a:"— Claude Monet"},
];

/* shared active palettes (mutated on theme change) */
let activePal=VG_PAL.slice();
let activeTrail=VG_TRAIL.slice();

/* ══════════════════════════════════════
   GLOBAL VAN GOGH / MONET SWIRL BG
══════════════════════════════════════ */
(()=>{
  const cv=$('#bg-canvas'),cx=cv.getContext('2d');
  let W,H,T=0;
  const pts=[],stars=[];
  class P{
    constructor(){this.reset();}
    reset(){this.x=R(0,W);this.y=R(0,H);this.px=this.x;this.py=this.y;
      this.sp=R(.28,.72);this.life=R(90,280);this.ml=this.life;
      this.sz=R(.5,1.7);
      this.col=activePal[0|R(0,activePal.length)];
      this.c=R(-.6,.6);}
    tick(){this.px=this.x;this.py=this.y;
      const isLM=document.body.classList.contains('light');
      let a;
      if(isLM){
        // Monet: gentle horizontal water-lily ripple flow
        a=Math.sin(this.x/W*2.2+T*.0008)*Math.PI*.85
          +Math.cos(this.y/H*1.5+T*.0006)*Math.PI*.42
          +this.c*.35;
      }else{
        // Van Gogh: tight dramatic swirl
        a=Math.sin(this.x/W*5.5+T*.0021)*Math.cos(this.y/H*4.2-T*.0018)*Math.PI*2.5
          +Math.sin(this.x/W*2.8-this.y/H*3.8+T*.0013)*Math.PI*1.3+this.c;
      }
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
    const isLM=document.body.classList.contains('light');
    cx.globalAlpha=.017;cx.fillStyle=isLM?'rgba(236,232,224,1)':'#03050c';cx.fillRect(0,0,W,H);
    pts.forEach(p=>{p.tick();p.draw();});
    const t=performance.now()/1000;
    if(!isLM){
      stars.forEach(s=>{
        const a=.18+.8*Math.abs(Math.sin(t*s.fr+s.ph));
        cx.globalAlpha=a*.86;cx.beginPath();cx.arc(s.x/100*W,s.y/100*H,s.r,0,Math.PI*2);cx.fillStyle='#f5e6c8';cx.fill();
        if(s.halo){const g=cx.createRadialGradient(s.x/100*W,s.y/100*H,0,s.x/100*W,s.y/100*H,s.r*7);
          g.addColorStop(0,'rgba(245,230,200,.26)');g.addColorStop(1,'rgba(245,230,200,0)');
          cx.globalAlpha=a*.22;cx.beginPath();cx.arc(s.x/100*W,s.y/100*H,s.r*7,0,Math.PI*2);cx.fillStyle=g;cx.fill();}
      });
    } else {
      // Monet: floating petal/flower particles instead of stars
      stars.forEach(s=>{
        const a=.12+.5*Math.abs(Math.sin(t*s.fr*0.6+s.ph));
        const px=(s.x/100+Math.sin(t*0.18+s.ph)*0.8)/1*W;
        const py=(s.y/100+Math.cos(t*0.14+s.ph)*0.3)/1*H;
        cx.globalAlpha=a*.7;
        cx.beginPath();cx.ellipse(px,py,s.r*2.5,s.r*1.2,t*0.3+s.ph,0,Math.PI*2);
        cx.fillStyle=activePal[0|((s.x+s.y)%activePal.length)];cx.fill();
      });
    }
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
  document.addEventListener('mousemove',e=>{
    trail.push({x:e.clientX,y:e.clientY,life:1,sz:R(2.2,5.2)});
    if(trail.length>34)trail.shift();
  },{passive:true});
  (function loop(){
    cx.clearRect(0,0,W,H);
    for(let i=1;i<trail.length;i++){
      const p=trail[i],q=trail[i-1];p.life-=.044;if(p.life<=0)continue;
      const ci=Math.floor(i/(34/activeTrail.length))%activeTrail.length;
      cx.beginPath();cx.moveTo(q.x,q.y);cx.lineTo(p.x,p.y);
      cx.strokeStyle=activeTrail[ci]+(p.life*.36)+')';cx.lineWidth=p.sz*p.life;cx.lineCap='round';cx.stroke();
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
  function rs(){W=cv.width=cv.offsetWidth||innerWidth;H=cv.height=cv.offsetHeight||innerHeight;buildPads();buildShimmers();}
  // Dark VG arcs — starry swirling arcs
  const arcs=Array.from({length:12},(_,i)=>({a:R(0,Math.PI*2),sp:R(.003,.009),col:`hsla(${R(200,240)},55%,${R(38,68)}%,`,lw:R(1,3.5),len:R(55,190)}));

  /* ── MONET: Water Lilies (Nymphéas) ──
     Dense impressionist pond filling the full hero canvas.
     Three layers: water+shimmer → lily pads → blooms */
  let padData=[],shimmers=[];
  const PAD_COLS=['#2a5e3c','#3a7050','#305a40','#3e6e40','#264e34','#2c6040','#3a6848'];
  const BLOOM_COLS=['rgba(228,170,185,','rgba(246,200,212,','rgba(212,158,174,','rgba(238,215,222,','rgba(255,228,232,'];
  const SHIMMER_COLS=['rgba(138,188,178,','rgba(100,162,152,','rgba(168,210,200,','rgba(88,140,160,','rgba(180,220,210,','rgba(148,198,188,'];
  function buildPads(){
    padData=Array.from({length:72},()=>{
      const rx=W*R(.016,.054);
      return {x:R(-rx,W+rx),y:R(H*.04,H*1.02),rx,ry:rx*R(.24,.38),
        rot:R(0,Math.PI*2),rotsp:R(-.0003,.0003),
        spx:R(-.22,.22),spy:R(-.10,.10),
        col:PAD_COLS[0|R(0,PAD_COLS.length)],
        alpha:R(.52,.82),
        bloom:Math.random()>.46,
        bloomPh:R(0,Math.PI*2),bloomSp:R(.005,.015),
        bloomCol:BLOOM_COLS[0|R(0,BLOOM_COLS.length)],
        petalN:5+Math.floor(R(0,4))};
    });
  }
  function buildShimmers(){
    shimmers=Array.from({length:32},()=>({
      y:R(0,H),speed:R(.04,.14),ph:R(0,Math.PI*2),
      col:SHIMMER_COLS[0|R(0,SHIMMER_COLS.length)],
      al:R(.05,.16),wavAmp:R(6,28),wavFreq:R(.003,.009)
    }));
  }
  function drawWaterLayer(t){
    // Base water gradient — deep teal to muted blue-green
    const wg=cx.createLinearGradient(0,0,0,H);
    wg.addColorStop(0,'rgba(28,72,58,.72)');
    wg.addColorStop(.4,'rgba(22,58,48,.68)');
    wg.addColorStop(1,'rgba(18,48,40,.74)');
    cx.fillStyle=wg;cx.globalAlpha=1;cx.fillRect(0,0,W,H);
    // Sky reflection bands — soft lavender/blue shimmer
    const refCols=['rgba(180,208,218,','rgba(168,200,215,','rgba(148,188,210,'];
    for(let i=0;i<18;i++){
      const ry=(i/18)*H+Math.sin(t*.0004+i*.42)*8;
      const rh=R(2,9);const rc=refCols[0|R(0,refCols.length)];
      const al=(.03+.07*Math.abs(Math.sin(t*.0006+i*.7)))*(1-Math.abs(ry/H-.5)*1.2);
      if(al<=0)continue;
      cx.fillStyle=rc+al+')';cx.fillRect(0,ry,W,rh);
    }
    // Shimmer ripples — horizontal wavey brushstroke lines
    shimmers.forEach(s=>{
      const sy=s.y+Math.sin(t*s.speed*.04+s.ph)*5;
      cx.beginPath();
      cx.moveTo(0,sy);
      for(let x=0;x<W;x+=8)cx.lineTo(x,sy+Math.sin(x*s.wavFreq+t*.002+s.ph)*s.wavAmp*.25);
      cx.strokeStyle=s.col+s.al+')';cx.lineWidth=R(1,3.5);cx.globalAlpha=1;cx.stroke();
    });
  }
  function drawPad(p,t){
    cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);
    // Pad shadow
    cx.beginPath();cx.ellipse(3,4,p.rx*.94,p.ry*.88,0,0,Math.PI*2);
    cx.fillStyle='rgba(10,26,20,.35)';cx.globalAlpha=p.alpha*.5;cx.fill();
    // Pad body — cut with notch (like real lily pad with V-slice)
    cx.beginPath();
    cx.moveTo(0,0);
    cx.ellipse(0,0,p.rx,p.ry,0,Math.PI*.08,Math.PI*1.92);
    cx.closePath();
    cx.fillStyle=p.col;cx.globalAlpha=p.alpha;cx.fill();
    // Pad surface vein (mid-rib)
    cx.beginPath();cx.moveTo(0,0);cx.lineTo(p.rx*.88,0);
    cx.strokeStyle='rgba(20,40,28,.32)';cx.lineWidth=.8;cx.globalAlpha=p.alpha*.5;cx.stroke();
    // Bloom petals
    if(p.bloom){
      const ba=.28+.18*Math.sin(t*.018*p.bloomSp*80+p.bloomPh);
      const pr=p.rx*.44,pry=p.ry*.52;
      for(let i=0;i<p.petalN;i++){
        const pa=(i/p.petalN)*Math.PI*2,nx=Math.cos(pa)*pr*.55,ny=Math.sin(pa)*pry*.55;
        cx.beginPath();
        cx.ellipse(nx,ny,pr*.58,pry*.42,pa,0,Math.PI*2);
        cx.fillStyle=p.bloomCol+(.68+.14*Math.sin(t*.011+i))+')';
        cx.globalAlpha=ba;cx.fill();
      }
      // Inner petals (lighter layer)
      for(let i=0;i<p.petalN+1;i++){
        const pa=(i/p.petalN)*Math.PI*2+Math.PI/p.petalN,nx=Math.cos(pa)*pr*.28,ny=Math.sin(pa)*pry*.28;
        cx.beginPath();cx.ellipse(nx,ny,pr*.38,pry*.28,pa,0,Math.PI*2);
        cx.fillStyle='rgba(255,235,238,';
        cx.globalAlpha=ba*.7;cx.fill();
      }
      // Stamen center — golden yellow
      cx.beginPath();cx.arc(0,0,p.rx*.13,0,Math.PI*2);
      cx.fillStyle='rgba(252,228,120,.96)';cx.globalAlpha=ba*.9;cx.fill();
      cx.beginPath();cx.arc(0,0,p.rx*.065,0,Math.PI*2);
      cx.fillStyle='rgba(255,248,180,1)';cx.globalAlpha=ba;cx.fill();
    }
    cx.restore();
  }
  rs();addEventListener('resize',rs);
  (function loop(){
    const isLM=document.body.classList.contains('light');
    cx.clearRect(0,0,W,H);
    if(isLM){
      drawWaterLayer(T);
      // Sort pads back-to-front by y for proper layering
      const sorted=padData.slice().sort((a,b)=>a.y-b.y);
      sorted.forEach(p=>{
        p.x=p.x+p.spx*.12;p.y=p.y+p.spy*.06;
        p.rot+=p.rotsp;
        if(p.x<-p.rx*2)p.x=W+p.rx;if(p.x>W+p.rx*2)p.x=-p.rx;
        if(p.y<-p.ry*2)p.y=H+p.ry;if(p.y>H+p.ry*2)p.y=-p.ry;
        drawPad(p,T);
      });
    }else{
      arcs.forEach((arc,i)=>{arc.a+=arc.sp;const Rv=W*.22+i*16;
        const x=W/2+Math.cos(arc.a)*Rv,y=H/2+Math.sin(arc.a)*Rv*.55;
        cx.save();cx.translate(x,y);cx.beginPath();cx.arc(0,0,arc.len,arc.a,arc.a+1.6);
        cx.strokeStyle=arc.col+(.06+.04*Math.sin(T*.03+i))+')';cx.lineWidth=arc.lw;cx.stroke();cx.restore();
      });
    }
    T++;requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════
   PRELOADER
══════════════════════════════════════ */
(()=>{
  const cv=$('#pre-canvas');if(!cv)return;
  const cx=cv.getContext('2d');let a=0,raf;
  const VG_COLS=['#e8b84b','#4a7ab5','#2a5298','#d4843a','#7aaad4','#f5e6c8','#1b3a6e'];
  const MN_COLS=['#5a8c78','#8870a8','#7abcac','#4a6e8a','#a4c4b4','#c4e0d4','#48866e'];
  function draw(){
    const isLM=document.body.classList.contains('light');
    const cols=isLM?MN_COLS:VG_COLS;
    const bg=isLM?'#e8ede4':'#020408';
    cx.clearRect(0,0,260,260);
    cx.save();cx.beginPath();cx.arc(130,130,104,0,Math.PI*2);cx.fillStyle=bg;cx.fill();cx.restore();
    for(let i=0;i<7;i++){const ang=a+i*(Math.PI/3.5);
      cx.beginPath();cx.arc(130,130,104*(.3+i*.09),ang,ang+Math.PI*.85);
      cx.strokeStyle=cols[i];
      cx.lineWidth=2.1-i*.17;cx.globalAlpha=.74;cx.stroke();}
    for(let i=0;i<22;i++){const ang=(i/22)*Math.PI*2+a*.28;const d=104*(.38+.55*Math.abs(Math.sin(i*1.4)));
      cx.beginPath();cx.arc(130+Math.cos(ang)*d,130+Math.sin(ang)*d,1.3,0,Math.PI*2);
      cx.fillStyle=isLM?'#5a8c78':'#f5e6c8';cx.globalAlpha=.4+.5*Math.abs(Math.sin(a+i));cx.fill();}
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
  $('#nav-logo')?.addEventListener('click',()=>{scrollTo({top:0,behavior:'smooth'});});
  // Nav logo secret: 5 rapid clicks opens egg
  let nlc=0,nlT=0;
  $('#nav-logo')?.addEventListener('click',()=>{
    const now=Date.now();if(now-nlT>1800)nlc=0;nlT=now;nlc++;
    if(nlc>=5){nlc=0;openEgg();}
  });
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
   ABOUT — Quote rotator (theme-aware)
══════════════════════════════════════ */
(()=>{
  let qi=0;
  const txt=$('#abq-text'),cite=$('#abq-cite'),dotsW=$('#abq-dots');
  if(!txt)return;
  const maxLen=Math.max(VG_QUOTES.length,MONET_QUOTES.length);
  if(dotsW){
    for(let i=0;i<maxLen;i++){
      const d=document.createElement('button');
      d.className='abq-dot'+(i===0?' on':'');
      d.setAttribute('aria-label',`Quote ${i+1}`);
      d.addEventListener('click',()=>show(i));
      dotsW.appendChild(d);
    }
  }
  function getQ(){return document.body.classList.contains('light')?MONET_QUOTES:VG_QUOTES;}
  function show(n){
    const qs=getQ();
    qi=(n+qs.length)%qs.length;
    txt.style.transition='opacity .3s';txt.style.opacity='0';
    setTimeout(()=>{
      txt.textContent=qs[qi].t;
      if(cite)cite.textContent=qs[qi].a;
      txt.style.opacity='1';
    },280);
    $$('.abq-dot').forEach((d,i)=>d.classList.toggle('on',i===qi));
  }
  $('#abq-prev')?.addEventListener('click',()=>show(qi-1));
  $('#abq-next')?.addEventListener('click',()=>show(qi+1));
  setInterval(()=>show(qi+1),7800);
  // Export for theme switching — reset to quote 0 with new palette
  window.resetAboutQuotes=()=>show(0);
})();

/* ══════════════════════════════════════
   SKILLS — Gallery Wall paintings + section canvas
══════════════════════════════════════ */
(()=>{
  // Section-level atmospheric background canvas
  const bgCv=$('#sk-bg-cv');
  if(bgCv){
    const bgCx=bgCv.getContext('2d');let BW=0,BH=0,BT=0;
    function rbg(){BW=bgCv.width=bgCv.offsetWidth||innerWidth;BH=bgCv.height=bgCv.offsetHeight||700;}
    rbg();addEventListener('resize',rbg);
    const bpts=Array.from({length:220},()=>({
      x:R(0,1),y:R(0,1),px:0,py:0,
      a:R(0,Math.PI*2),sp:R(.0003,.0008),
      col:activePal[0|R(0,activePal.length)],
      life:R(120,380),ml:0,sz:R(.6,2.2)
    }));
    bpts.forEach(p=>{p.ml=p.life;p.px=p.x;p.py=p.y;});
    (function bloop(){
      const isLM=document.body.classList.contains('light');
      bgCx.globalAlpha=.014;bgCx.fillStyle=isLM?'rgba(216,232,220,1)':'#04020c';bgCx.fillRect(0,0,BW,BH);
      bpts.forEach(p=>{
        p.px=p.x;p.py=p.y;
        const ang=Math.sin(p.x*6+BT*.0014)*Math.cos(p.y*5-BT*.0011)*Math.PI*3
                 +Math.sin(p.x*3-p.y*4+BT*.001)*Math.PI*1.5;
        p.x+=Math.cos(ang)*p.sp;p.y+=Math.sin(ang)*p.sp;
        if(p.x<0||p.x>1||p.y<0||p.y>1||--p.life<=0){
          p.x=R(0,1);p.y=R(0,1);p.px=p.x;p.py=p.y;p.life=p.ml;
          p.col=activePal[0|R(0,activePal.length)];
        }
        bgCx.beginPath();bgCx.moveTo(p.px*BW,p.py*BH);bgCx.lineTo(p.x*BW,p.y*BH);
        bgCx.globalAlpha=(p.life/p.ml)*.48;bgCx.strokeStyle=p.col;bgCx.lineWidth=p.sz;bgCx.lineCap='round';bgCx.stroke();
      });
      bgCx.globalAlpha=1;BT++;requestAnimationFrame(bloop);
    })();
  }

  // Per-painting canvas — visible Van Gogh arc swirls
  $$('.sk-paint-cv').forEach((cv)=>{
    const painting=cv.parentElement;
    const acc=painting.style.getPropertyValue('--sacc').trim()||'#e8b84b';
    const cx=cv.getContext('2d');let W=0,H=0,T=0;
    function rz(){W=cv.width=painting.offsetWidth||220;H=cv.height=painting.offsetHeight||420;}
    rz();addEventListener('resize',rz);
    const col=acc.startsWith('#')?acc:'#e8b84b';
    // Arc-based strokes — visible curving sweeps like VG brushwork
    const arcs=Array.from({length:20},()=>({
      cx:R(.1,.9),cy:R(.05,.95),
      r:R(.06,.2),
      a:R(0,Math.PI*2),
      span:R(.8,2.2),
      spd:R(.0014,.0044)*(Math.random()>.5?1:-1),
      lw:R(1.2,3.8),
      life:R(120,280),ml:0,
      al:R(.1,.38)
    }));
    arcs.forEach(a=>{a.ml=a.life;});
    (function loop(){
      const isLM=document.body.classList.contains('light');
      cx.globalAlpha=.028;cx.fillStyle=isLM?'rgba(255,255,255,.45)':'rgba(0,0,0,.88)';cx.fillRect(0,0,W,H);
      arcs.forEach(arc=>{
        arc.a+=arc.spd;
        if(--arc.life<=0){
          arc.cx=R(.1,.9);arc.cy=R(.05,.95);arc.r=R(.06,.2);
          arc.a=R(0,Math.PI*2);arc.span=R(.8,2.2);arc.spd=R(.0014,.0044)*(Math.random()>.5?1:-1);
          arc.lw=R(1.2,3.8);arc.life=arc.ml;arc.al=R(.1,.38);
        }
        const al=(arc.life/arc.ml)*arc.al;
        cx.beginPath();
        cx.arc(arc.cx*W,arc.cy*H,arc.r*Math.min(W,H),arc.a,arc.a+arc.span);
        cx.strokeStyle=col;cx.lineWidth=arc.lw;cx.globalAlpha=al;cx.lineCap='round';cx.stroke();
      });
      cx.globalAlpha=1;T++;requestAnimationFrame(loop);
    })();
  });

  // Animate language bars when painting is visible
  const langObs=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){
      e.target.querySelectorAll('.sklb-f').forEach(f=>{if(f.dataset.w)f.style.width=f.dataset.w+'%';});
    }});
  },{threshold:.1});
  $$('.sk-painting').forEach(s=>langObs.observe(s));
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
  function bg(){
    if(document.body.classList.contains('light')){
      // Monet: soft light water garden — pale sage green
      const g=cx.createLinearGradient(0,0,0,cv.height);
      g.addColorStop(0,'#b8d8c4');g.addColorStop(1,'#8ab8a0');
      cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);
    }else{
      // Van Gogh: dark night sky
      const g=cx.createLinearGradient(0,0,0,cv.height);
      g.addColorStop(0,'#03060f');g.addColorStop(1,'#0a1422');
      cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);
    }
  }
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
  // Export for theme switching
  window.refreshMiniCanvasBg=()=>bg();
  window._miniSetCol=(c)=>{col=c;};
})();

/* ══════════════════════════════════════
   THEME UPDATE HELPERS
══════════════════════════════════════ */
function updateTicker(isLight){
  const t1=document.getElementById('ticker-admirer-1');
  const t2=document.getElementById('ticker-admirer-2');
  const label=isLight?'Monet Admirer':'Van Gogh Admirer';
  if(t1)t1.textContent=label;
  if(t2)t2.textContent=label;
}

function updateMiniLabel(isLight){
  const el=document.getElementById('ctt-mpl-text');
  if(!el)return;
  // Find the text node (after the icon span)
  el.childNodes.forEach(node=>{
    if(node.nodeType===3&&node.textContent.trim().length>0){
      node.textContent=isLight?'Paint the water garden':'Paint your own starry night';
    }
  });
}

function updateMiniPalette(isLight){
  const dots=$$('.mdot');
  const VG_DOTS=['#e8b84b','#4a7ab5','#f5e6c8','#d4843a','#7aaad4'];
  const MN_DOTS=['#5a8c78','#8870a8','#7abcac','#c4e0d4','#a4c4b4'];
  const pal=isLight?MN_DOTS:VG_DOTS;
  dots.forEach((d,i)=>{
    if(i>=pal.length)return;
    d.dataset.c=pal[i];
    d.style.setProperty('--dc',pal[i]);
    // If this dot is 'on', update the active color too
    if(d.classList.contains('on')&&window._miniSetCol)window._miniSetCol(pal[i]);
  });
}

function updateEggTexts(isLight){
  const title=document.getElementById('egg-title');
  const sub=document.getElementById('egg-sub-text');
  const quote=document.getElementById('egg-quote-text');
  if(isLight){
    if(title)title.textContent='Paint Your Water Garden';
    if(sub)sub.textContent='Drag your brush across the lily pond.';
    if(quote)quote.textContent='"I must have flowers, always and always." — Claude Monet';
  }else{
    if(title)title.textContent='Paint Your Starry Night';
    if(sub)sub.textContent='Drag your brush across the canvas.';
    if(quote)quote.textContent='"I dream my painting and I paint my dream." — Van Gogh';
  }
}

function updateFavicon(isLight){
  const link=document.querySelector('link[rel="icon"]');
  if(link)link.href=isLight?'favicon-light.svg':'favicon-dark.svg';
}

function updateTheme(isLight){
  // Switch bg canvas particle palette
  activePal=isLight?MONET_PAL.slice():VG_PAL.slice();
  // Switch trail palette
  activeTrail=isLight?MONET_TRAIL.slice():VG_TRAIL.slice();
  // Update ticker
  updateTicker(isLight);
  // Update mini canvas label
  updateMiniLabel(isLight);
  // Update mini canvas palette
  updateMiniPalette(isLight);
  // Update egg modal texts
  updateEggTexts(isLight);
  // Swap favicon
  updateFavicon(isLight);
  // Reset about quotes to first quote of new set
  if(window.resetAboutQuotes)window.resetAboutQuotes();
  // Refresh mini canvas background
  if(window.refreshMiniCanvasBg)window.refreshMiniCanvasBg();
}

/* ══════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════ */
(()=>{
  const btn=$('#theme-btn'),icon=$('#theme-icon');if(!btn)return;
  const saved=localStorage.getItem('vg-light');
  // On first load (no saved preference), respect OS preference
  const preferLight=saved===null
    ?window.matchMedia('(prefers-color-scheme: light)').matches
    :saved==='1';
  if(preferLight){
    document.body.classList.add('light');
    if(icon)icon.textContent='dark_mode';
    setTimeout(()=>updateTheme(true),0);
  }
  btn.addEventListener('click',()=>{
    document.body.classList.toggle('light');
    const on=document.body.classList.contains('light');
    localStorage.setItem('vg-light',on?'1':'0');
    if(icon)icon.textContent=on?'dark_mode':'light_mode';
    updateTheme(on);
    // If egg is open, reinit canvas with new theme
    const modal=$('#egg-modal');
    if(modal&&modal.classList.contains('open')){
      if(window.reinitEggCanvas)window.reinitEggCanvas();
    }
  });
})();

/* ══════════════════════════════════════
   EASTER EGG — Starry Night / Water Lily paint canvas
══════════════════════════════════════ */
function openEgg(){
  const m=$('#egg-modal');
  if(m){m.classList.add('open');m.setAttribute('aria-hidden','false');if(window.reinitEggCanvas)window.reinitEggCanvas();else window.initEggCanvas&&window.initEggCanvas();}
}

(()=>{
  const modal=$('#egg-modal'),closeBtn=$('#egg-close'),clearBtn=$('#egg-clear');
  const cv=$('#egg-canvas');if(!cv||!modal)return;
  const cx=cv.getContext('2d');const EW=cv.width,EH=cv.height;
  let painting=false,lx=0,ly=0,col='#E8B84B',inited=false;

  /* ── Van Gogh: Starry Night ── */
  function drawStarryNight(){
    const g=cx.createLinearGradient(0,0,0,EH);
    g.addColorStop(0,'#010812');g.addColorStop(.55,'#0b1a3e');g.addColorStop(1,'#182e58');
    cx.fillStyle=g;cx.fillRect(0,0,EW,EH);
    // moon glow
    const mg=cx.createRadialGradient(EW*.2,EH*.16,0,EW*.2,EH*.16,55);
    mg.addColorStop(0,'rgba(245,232,188,.95)');mg.addColorStop(.2,'rgba(232,198,120,.52)');mg.addColorStop(1,'rgba(220,178,75,0)');
    cx.beginPath();cx.arc(EW*.2,EH*.16,55,0,Math.PI*2);cx.fillStyle=mg;cx.fill();
    // stars
    for(let i=0;i<75;i++){const sx=R(0,EW),sy=R(0,EH*.72),sr=R(.5,2.9);
      const sg=cx.createRadialGradient(sx,sy,0,sx,sy,sr*5);
      sg.addColorStop(0,'rgba(255,248,210,1)');sg.addColorStop(.35,'rgba(222,200,130,.42)');sg.addColorStop(1,'rgba(220,200,130,0)');
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
    cx.fillStyle='#040c04';cx.beginPath();cx.moveTo(EW*.77,EH*.8);
    cx.bezierCurveTo(EW*.74,EH*.52,EW*.75,EH*.2,EW*.77,EH*.04);
    cx.bezierCurveTo(EW*.79,EH*.2,EW*.8,EH*.52,EW*.77,EH*.8);cx.fill();
  }

  /* ── Monet: Water Lily Pond ── */
  function drawWaterLilies(){
    // Dawn sky — pale lavender-cream to soft morning blue
    const skyG=cx.createLinearGradient(0,0,0,EH*.48);
    skyG.addColorStop(0,'#e8e4f0');skyG.addColorStop(.5,'#d4e8f0');skyG.addColorStop(1,'#b8d8e8');
    cx.fillStyle=skyG;cx.fillRect(0,0,EW,EH*.48);
    // Water — deep sage-green pond
    const waterG=cx.createLinearGradient(0,EH*.42,0,EH);
    waterG.addColorStop(0,'#1a3a2a');waterG.addColorStop(.4,'#2a5040');waterG.addColorStop(1,'#182e24');
    cx.fillStyle=waterG;cx.fillRect(0,EH*.42,EW,EH*.58);
    // Sky reflection shimmer
    const reflG=cx.createLinearGradient(0,EH*.42,0,EH*.7);
    reflG.addColorStop(0,'rgba(184,216,232,.18)');reflG.addColorStop(1,'rgba(26,58,42,0)');
    cx.fillStyle=reflG;cx.fillRect(0,EH*.42,EW,EH*.28);
    // Japanese bridge
    const bx=EW*.5,by=EH*.44,bw=EW*.58,bh=16;
    cx.fillStyle='#2a4838';
    cx.beginPath();cx.ellipse(bx,by,bw/2,bh,0,0,Math.PI*2);cx.fill();
    // Bridge arch
    cx.beginPath();cx.ellipse(bx,by-6,bw/2-8,bh-4,0,Math.PI,Math.PI*2);
    cx.strokeStyle='#3a5848';cx.lineWidth=3;cx.stroke();
    // Bridge posts
    for(let i=0;i<9;i++){
      const px=bx-bw/2+8+(i/8)*(bw-16);
      cx.beginPath();cx.moveTo(px,by+2);cx.lineTo(px,by-14);
      cx.strokeStyle='#4a6858';cx.lineWidth=2;cx.stroke();
    }
    // Willow branches — left
    cx.strokeStyle='rgba(60,80,50,.6)';
    for(let i=0;i<7;i++){
      cx.beginPath();cx.moveTo(EW*.04,0);
      cx.bezierCurveTo(EW*.04+Math.sin(i)*20,EH*.3,EW*.02+Math.cos(i)*15,EH*.5,EW*.06+Math.sin(i+1)*25,EH*.55);
      cx.lineWidth=R(1,2.5);cx.globalAlpha=.55;cx.stroke();
    }
    // Willow branches — right
    for(let i=0;i<6;i++){
      cx.beginPath();cx.moveTo(EW*.96,0);
      cx.bezierCurveTo(EW*.94+Math.sin(i)*18,EH*.25,EW*.96+Math.cos(i)*12,EH*.45,EW*.9+Math.sin(i+2)*20,EH*.5);
      cx.lineWidth=R(1,2);cx.globalAlpha=.45;cx.stroke();
    }
    cx.globalAlpha=1;
    // Morning mist
    const mistG=cx.createLinearGradient(0,EH*.38,0,EH*.56);
    mistG.addColorStop(0,'rgba(208,232,224,0)');
    mistG.addColorStop(.5,'rgba(208,232,224,.16)');
    mistG.addColorStop(1,'rgba(208,232,224,0)');
    cx.fillStyle=mistG;cx.fillRect(0,EH*.38,EW,EH*.18);
    // Lily pads
    const padCols=['#2a6048','#3a7058','#4a7a60','#3a6850'];
    for(let i=0;i<20;i++){
      const lx=R(EW*.05,EW*.95),ly=R(EH*.5,EH*.92),lr=R(9,22);
      cx.beginPath();cx.ellipse(lx,ly,lr,lr*.35,R(-.5,.5),0,Math.PI*2);
      cx.fillStyle=padCols[0|R(0,padCols.length)];cx.globalAlpha=.78;cx.fill();
      // Notch line
      cx.beginPath();cx.moveTo(lx,ly);
      cx.lineTo(lx+lr*.9*Math.cos(0),ly);
      cx.strokeStyle='rgba(20,40,30,.5)';cx.lineWidth=1;cx.globalAlpha=.6;cx.stroke();
    }
    cx.globalAlpha=1;
    // Water lily flowers
    const flpals=['rgba(240,200,210,','rgba(255,220,230,','rgba(220,185,205,'];
    for(let i=0;i<9;i++){
      const fx=R(EW*.1,EW*.9),fy=R(EH*.52,EH*.88);
      const fp=flpals[0|R(0,flpals.length)];
      for(let p=0;p<7;p++){
        const pa=(p/7)*Math.PI*2;
        cx.beginPath();cx.ellipse(fx+Math.cos(pa)*7,fy+Math.sin(pa)*5,9,4,pa,0,Math.PI*2);
        cx.fillStyle=fp+'.72)';cx.fill();
      }
      cx.beginPath();cx.arc(fx,fy,3.5,0,Math.PI*2);
      cx.fillStyle='rgba(255,240,190,.95)';cx.fill();
    }
    // Water ripples
    for(let i=0;i<14;i++){
      const rx=R(0,EW),ry=R(EH*.47,EH);
      cx.beginPath();cx.ellipse(rx,ry,R(14,52),R(3,9),0,0,Math.PI*2);
      cx.strokeStyle='rgba(90,160,130,.10)';cx.lineWidth=1;cx.stroke();
    }
  }

  window.initEggCanvas=function(){
    if(inited)return;inited=true;
    if(document.body.classList.contains('light')){
      drawWaterLilies();
    }else{
      drawStarryNight();
    }
  };

  window.reinitEggCanvas=function(){
    inited=false;
    initEggCanvas();
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

  // Click name 5x — Van Gogh or Monet popup based on theme
  let nc=0;$('#hero-h1')?.addEventListener('click',()=>{nc++;if(nc>=5){
    const isLight=document.body.classList.contains('light');
    const qtext=isLight
      ?'"I must have flowers, always and always." — Claude Monet'
      :'"What would life be if we had no courage to attempt anything?" — Van Gogh';
    const bgCol=isLight?'rgba(20,42,38,.97)':'rgba(3,5,12,.97)';
    const fgCol=isLight?'#c4e0d4':'#e8b84b';
    const borderCol=isLight?'rgba(90,140,120,.3)':'rgba(232,184,75,.3)';
    const pop=document.createElement('div');
    pop.style.cssText=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9900;font-family:"IM Fell English",serif;font-style:italic;font-size:1.35rem;color:${fgCol};text-align:center;pointer-events:none;background:${bgCol};padding:26px 42px;border:1px solid ${borderCol};max-width:480px;line-height:1.72;opacity:0;transition:opacity .4s`;
    pop.textContent=qtext;
    document.body.appendChild(pop);requestAnimationFrame(()=>pop.style.opacity='1');
    setTimeout(()=>{pop.style.opacity='0';setTimeout(()=>pop.remove(),400);},4200);nc=0;}});
})();
