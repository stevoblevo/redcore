/* Redcore · Brickmark v0.3.1 — lay the course. Vanilla, no build. */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function load(k,d){try{return JSON.parse(localStorage.getItem(k))||d;}catch(e){return d;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

/* ---------- quests = bricks ---------- */
var Q=[
 {k:'safety',n:'Ward',st:'1050 °C · the kiln is hot',h:'Safety: bricks are 2–3 kg. No glass table. Nothing goes in a fireplace.',g:'M15 3 L26 7 V15 C26 21 15 27 15 27 C15 27 4 21 4 15 V7Z M15 10 V17 M15 21 V21.5'},
 {k:'lots',n:'Two hearths',st:'choose your lots',h:'Pick lots: Lot A = one stack / one store; Lot B = another if you can get it. Two lots make impostors honest.',g:'M11 15 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M19 15 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0'},
 {k:'label',n:'Mark the end',st:'pencil, never the face',h:'Pencil the ID (e.g. <code>A-01</code>) on the <strong>end</strong>, not the scan face.',g:'M4 10 H20 V22 H4Z M20 10 L26 7 V19 L20 22 M8 16 H15'},
 {k:'light',n:'Find the shade',st:'window light, no blown flash',h:'Window light or shade. No flash if it blows the clay white.',g:'M5 22 H25 M15 22 m-7 0 a7 7 0 0 1 14 0 M15 6 V10 M6 11 L8.5 13.5 M24 11 L21.5 13.5'},
 {k:'r1',n:'First sight',st:'capture 1 · _r1',h:'Photograph twenty fired-clay faces — capture 1 (<code>_r1</code>). Fill the frame with clay texture, not room.',g:'M3 15 C8 7 22 7 27 15 C22 23 8 23 3 15Z M15 15 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0'},
 {k:'r2',n:'Second sight',st:'capture 2 · _r2',h:'Capture 2 (<code>_r2</code>) of every face — different lighting, day or operator if you can. Same phone is fine. Don\'t rotate 90° between reps unless you record it.',g:'M2 15 C5 10 11 10 14 15 C11 20 5 20 2 15Z M16 15 C19 10 25 10 28 15 C25 20 19 20 16 15Z M8 15 V15.5 M22 15 V15.5'},
 {k:'crop',n:'The square',st:'about 5 × 5 cm',h:'Crop about 5 × 5 cm of the same region. Don\'t invent a crop box — only pass <code>--crop-box</code> if you measured one.',g:'M8 3 V22 H27 M3 8 H22 V27'},
 {k:'name',n:'Speak its name',st:'{lot}-{nn}_r{rep}.jpg',h:'Name every file <code>{lot}-{nn}_r{rep}.jpg</code> — use the <a href="#bench">Namer\'s Bench</a>.',g:'M10 5 C6 5 7 11 4 15 C7 19 6 25 10 25 M20 5 C24 5 23 11 26 15 C23 19 24 25 20 25 M13 15 H17'},
 {k:'ingest',n:'Hash receipt',st:'optional · no EER',opt:1,h:'Optional: <code>python protocol/optical_unit_identity.py --ingest path/to/A-01_r1.jpg</code> (hash receipt, no EER).',g:'M11 4 L9 26 M21 4 L19 26 M5 11 H26 M4 19 H25'},
 {k:'submit',n:'Deliver',st:'carry it to the assay',h:'Submit: carry the course to <a href="#assay">the Assay</a>, open the prefilled issue and attach your zip.',g:'M15 27 V5 M15 3 L10 10 H20Z M7 27 H23'}
];
var KEY='redcore.course.v3',st=load(KEY,null);
if(!st){st={};var old=load('redcore.exp0.checklist.v1',{});Q.forEach(function(q){if(old[q.k])st[q.k]=true;});save(KEY,st);}
function svg(d){return '<svg viewBox="0 0 30 30" aria-hidden="true"><path d="'+d+'"/></svg>';}
var ql=$('#quests'),wall=$('#wall'),hud=$('#hudcourse'),mini=$('#minicourse');
Q.forEach(function(q,i){
  var li=document.createElement('li');li.className='quest';li.dataset.k=q.k;
  li.innerHTML='<button type="button" aria-pressed="false"><span class="glyph" data-t="'+(i+1)+'">'+svg(q.g)+'</span><span class="t"><small>'+q.st+(q.opt?' <span class="opt">◇ side quest</span>':'')+'</small><b>'+q.n+'</b> — '+q.h+'</span></button>';
  ql.appendChild(li);
  var s=document.createElement('div');s.className='slot';s.innerHTML='<b>'+svg(q.g).replace('<svg','<svg fill="none" stroke="currentColor" stroke-width="1.6"')+'</b>';wall.appendChild(s);
  hud.appendChild(document.createElement('i'));mini.appendChild(document.createElement('i'));
});
$$('.quest a',ql).forEach(function(a){a.addEventListener('click',function(e){e.stopPropagation();});});
function count(){return Q.filter(function(q){return st[q.k];}).length;}
function nextQ(){for(var i=0;i<Q.length;i++)if(!st[Q[i].k]&&!Q[i].opt)return i;for(i=0;i<Q.length;i++)if(!st[Q[i].k])return i;return -1;}
function tallySVG(n){ /* Uruk: upright wedge = 1, corner wedge = 10 */
  if(!n)return '<span class="muted">·</span>';
  if(n>=10)return '<svg width="16" height="14" viewBox="0 0 16 14"><path d="M14 1 L2 7 L14 13 L10 7Z" fill="#ffc77a"/></svg>';
  var o='<svg width="'+(n*6)+'" height="14" viewBox="0 0 '+(n*6)+' 14">';for(var i=0;i<n;i++)o+='<path d="M'+(i*6)+' 1 H'+(i*6+5)+' L'+(i*6+3)+' 4 V13 H'+(i*6+2)+' V4Z" fill="#ffc77a"/>';return o+'</svg>';}
function paint(){
  var n=count(),nx=nextQ();
  $$('.quest',ql).forEach(function(li,i){var on=!!st[Q[i].k];li.classList.toggle('done',on);li.classList.toggle('next',i===nx);$('button',li).setAttribute('aria-pressed',on);});
  $$('.slot',wall).forEach(function(s,i){s.classList.toggle('laid',!!st[Q[i].k]);});
  $$('i',hud).forEach(function(s,i){s.classList.toggle('on',!!st[Q[i].k]);});
  $$('i',mini).forEach(function(s,i){s.classList.toggle('on',!!st[Q[i].k]);});
  $('#tally').innerHTML=tallySVG(n);$('#tally').setAttribute('aria-label',n+' of 10 bricks laid');
  $('#coursemsg').textContent=n===10?'Course complete. Ten bricks, one identity unit (if measurement earns it).':n+' / 10 bricks laid'+(nx>=0?' · next: '+Q[nx].n:'');
  aimNeedle();heat=n/10;
}
$$('.quest button',ql).forEach(function(b,i){b.addEventListener('click',function(){
  var q=Q[i],li=b.parentNode;st[q.k]=!st[q.k];save(KEY,st);
  if(st[q.k]){li.classList.add('firing');setTimeout(function(){li.classList.remove('firing');},1100);var r=b.getBoundingClientRect();sparks(r.left+40,r.top+r.height/2,18);pluck(i);
    say(count()===10?'The course is whole! Carry it to the Assay. ⚖':LAY[i%LAY.length].replace('%',q.n));pet.classList.add('happy');setTimeout(function(){pet.classList.remove('happy');},1000);}
  else say('Lifted '+q.n+'. Bricks forgive.');
  paint();
});});
$('#reset').addEventListener('click',function(){st={};save(KEY,st);paint();say('Course broken. Clay remembers anyway.');});
var LAY=['% fired. It cooled past 675 °C… then 580 °C… needle locked. ▦','% laid. Mortar hums.','Ooh, % — that one glows.','% set. North is on our side.','% is in. I can feel the course thinking.'];

/* ---------- sound (optional, off by default): plucked 31-EDO, after AND SO ---------- */
var AC=null,sndOn=load('redcore.snd',false),sb=$('#snd');
function sndPaint(){sb.setAttribute('aria-pressed',sndOn);sb.textContent=sndOn?'♪ on':'♪ off';}
sb.addEventListener('click',function(){sndOn=!sndOn;save('redcore.snd',sndOn);sndPaint();if(sndOn)pluck(0);});sndPaint();
function pluck(step){if(!sndOn)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  var f=196*Math.pow(2,[0,5,10,13,18,23,26,31,36,41][step%10]/31),t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();
  o.type='triangle';o.frequency.value=f;lp.type='lowpass';lp.frequency.setValueAtTime(f*8,t);lp.frequency.exponentialRampToValueAtTime(f,t+.6);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.22,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+1.2);
  o.connect(lp);lp.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+1.3);}catch(e){}}

/* ---------- sparks ---------- */
function sparks(x,y,n){if(RM)return;for(var i=0;i<n;i++){(function(){var s=document.createElement('i');s.className='spark';document.body.appendChild(s);
  var a=Math.random()*6.283,v=2+Math.random()*5,vx=Math.cos(a)*v,vy=Math.sin(a)*v-3,px=x,py=y,life=0;
  (function step(){life++;vy+=.18;px+=vx;py+=vy;s.style.transform='translate('+px+'px,'+py+'px)';s.style.opacity=1-life/45;if(life<45)requestAnimationFrame(step);else s.remove();})();})();}}

/* ---------- the guide pet: Tinder, a kiln sprite ---------- */
var pet=$('#pet'),bub=$('#bubble'),PX=innerWidth-100,PY=innerHeight-140,VX=0,VY=0,mx=PX,my=PY,drag=null,lastMove=Date.now(),bt=null;
function say(t,ms){if(typeof mode!=='undefined'&&mode==='nap')return;bub.textContent=t;bub.classList.add('on');clearTimeout(bt);bt=setTimeout(function(){bub.classList.remove('on');},ms||3600);}
addEventListener('pointermove',function(e){if(e.pointerType==='mouse'){mx=e.clientX;my=e.clientY;lastMove=Date.now();}
  if(drag){var nx=e.clientX-drag.ox,ny=e.clientY-drag.oy;VX=nx-PX;VY=ny-PY;PX=nx;PY=ny;drag.moved=drag.moved||Math.abs(VX)+Math.abs(VY)>3;}},{passive:true});
var holdT=null,held=false;
pet.addEventListener('pointerdown',function(e){drag={ox:e.clientX-PX,oy:e.clientY-PY,moved:false};held=false;pet.setPointerCapture(e.pointerId);pet.style.cursor='grabbing';
  clearTimeout(holdT);holdT=setTimeout(function(){if(drag&&!drag.moved){held=true;openMenu();}},560);});
pet.addEventListener('pointerup',function(){clearTimeout(holdT);var d=drag;drag=null;pet.style.cursor='';if(held){held=false;return;}if(d&&!d.moved)petTap();else{say(THROW[(Math.random()*THROW.length)|0]);thrown=Date.now();}});
pet.addEventListener('pointercancel',function(){clearTimeout(holdT);drag=null;pet.style.cursor='';});
pet.addEventListener('contextmenu',function(e){e.preventDefault();});
var THROW=['Wheee — I am ceramic, I bounce!','Rude. Accurate, but rude.','I landed on north. Obviously.'];var thrown=0;
function petTap(){var nx=nextQ();if(nx<0){say('All ten laid. The Assay awaits ⚖ — or go find the hidden ✶ sigils.');go('#assay');return;}
  var q=Q[nx];say('Next brick: '+q.n+' — '+q.st+'. Follow my tail!');var li=$$('.quest',ql)[nx];li.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});}
setInterval(function(){pet.classList.add('blink');setTimeout(function(){pet.classList.remove('blink');},160);},2760); /* Sae-wink: open 2.6 s, closed 0.16 s */
/* ---------- pet mode: follow · perch · nap (v0.3.1) ---------- */
var COARSE=matchMedia('(pointer:coarse)').matches,MODES=['follow','perch','nap'],
  mode=load('redcore.petmode',null);if(MODES.indexOf(mode)<0)mode=(RM||COARSE)?'perch':'follow';
var wake=load('redcore.petwake','perch'),pm=$('#pmode'),menu=$('#petmenu'),curRoom='hearth',perch=null;
var MLINE={follow:'Follow mode: I\'ll trail your cursor. Say if I get clingy.',perch:'Perch mode: I\'ll sit by the side and hop rooms with you.',nap:'Nap time. I\'ll be the ember up top — tap it to wake me.'};
var CUE={follow:'Tinder · follows (tap: perch)',perch:'Tinder · perches (tap: nap)',nap:'Tinder · napping (tap: wake)'};
function pmPaint(){pm.dataset.m=mode;pm.setAttribute('data-cue',CUE[mode]);pm.setAttribute('aria-label','Tinder mode: '+mode+'. Tap to change.');
  pet.classList.toggle('nap',mode==='nap');$$('button',menu).forEach(function(b){b.setAttribute('aria-checked',b.dataset.m===mode);});}
function setMode(m,quiet){if(m===mode&&!quiet)return;var was=mode;mode=m;save('redcore.petmode',m);if(m!=='nap'){wake=m;save('redcore.petwake',m);}
  perch=null;pmPaint();closeMenu();if(quiet)return;
  if(was==='nap'){var r=pm.getBoundingClientRect();PX=r.left-20;PY=r.bottom+4;VX=0;VY=0;}
  if(m==='nap'){bub.classList.remove('on');pm.classList.add('cue');setTimeout(function(){pm.classList.remove('cue');},2200);var r2=pet.getBoundingClientRect();sparks(r2.left+32,r2.top+32,8);}
  else say(MLINE[m]);}
pm.addEventListener('click',function(){var r=pm.getBoundingClientRect();if(mode==='nap'){sparks(r.left+13,r.top+13,10);setMode(wake==='follow'&&(RM||COARSE)?'perch':wake);}
  else setMode(mode==='follow'?'perch':'nap');});
function openMenu(){pmPaint();menu.hidden=false;var w=menu.offsetWidth||220;menu.style.transform='translate('+Math.max(6,Math.min(PX-w/2+32,innerWidth-w-6))+'px,'+Math.max(56,PY-50)+'px)';say('Follow, perch, or nap?',2400);}
function closeMenu(){menu.hidden=true;}
$$('button',menu).forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();if(b.dataset.m===mode){closeMenu();say(MLINE[mode]);}else setMode(b.dataset.m);});});
addEventListener('pointerdown',function(e){if(!menu.hidden&&!menu.contains(e.target)&&!pet.contains(e.target))closeMenu();});
addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
function perchSpot(){var room=$('#'+curRoom),W=innerWidth,H=innerHeight,side=W-(W<760?66:96),y=H*.3;
  var nq=$$('.quest',ql)[nextQ()],qr=nq&&nq.getBoundingClientRect();
  if(curRoom==='course'&&qr&&qr.top>70&&qr.bottom<H-60)y=qr.top+qr.height/2-32;
  else if(room){var h=$('h2',room)||$('h1',room),hr=h&&h.getBoundingClientRect();if(hr&&hr.top>60&&hr.top<H-160)y=hr.top-4;}
  return [side,Math.max(64,Math.min(H-140,y))];}
addEventListener('resize',function(){perch=null;});pmPaint();
function tick(){
  if(!drag&&mode!=='nap'){var tx,ty,idle=Date.now()-lastMove>2500||COARSE;
    if(Date.now()-thrown<1400){VX*=.94;VY*=.94;PX+=VX;PY+=VY;}
    else if(rdOpen){var pr=$('#rdpanel').getBoundingClientRect();tx=Math.max(4,pr.left+18);ty=Math.max(56,pr.top-50);
      if(RM){PX=tx;PY=ty;VX=VY=0;}else{VX+=(tx-PX)*.02;VY+=(ty-PY)*.02;VX*=.8;VY*=.8;PX+=VX;PY+=VY;}}
    else if(mode==='perch'){if(!perch)perch=perchSpot();tx=perch[0];ty=perch[1];
      if(RM){PX=tx;PY=ty;VX=0;VY=0;}else{VX+=(tx-PX)*.02;VY+=(ty-PY)*.02;VX*=.8;VY*=.8;PX+=VX;PY+=VY;if(Math.abs(tx-PX)<.3&&Math.abs(ty-PY)<.3){PX=tx;PY=ty;VX=VY=0;}}}
    else{ if(idle){var t=target();tx=t[0];ty=t[1];}else{tx=mx+28;ty=my+22;}
      VX+=(tx-PX)*.012;VY+=(ty-PY)*.012;VX*=.86;VY*=.86;PX+=VX;PY+=VY;}
    var W=innerWidth,H=innerHeight;if(!rdOpen&&PX<4){PX=4;VX=-VX*.6;}if(PX>W-60){PX=W-60;VX=-VX*.6;}if(PY<56){PY=56;VY=-VY*.6;}if(PY>H-120){PY=H-120;VY=-VY*.6;}}
  pet.style.transform='translate('+PX+'px,'+PY+'px) rotate('+Math.max(-20,Math.min(20,VX*2))+'deg)';
  bub.style.transform='translate('+Math.min(PX+56,innerWidth-250)+'px,'+Math.max(PY-48,60)+'px)';bub.style.left='0';bub.style.top='0';
  /* tail = compass needle toward next quest */
  var nq=$$('.quest',ql)[nextQ()]||$('#assay'),r=nq.getBoundingClientRect(),a=Math.atan2(r.top+r.height/2-(PY+32),r.left+30-(PX+32))*180/Math.PI-90;
  $('.tail',pet).style.transform='rotate('+a+'deg)';
  requestAnimationFrame(tick);
}
function target(){var nq=$$('.quest',ql)[nextQ()],r=nq?nq.getBoundingClientRect():null,W=innerWidth,H=innerHeight;
  if(r&&r.top>60&&r.bottom<H-40)return [Math.min(r.right-70,W-70),r.top-46];
  return [W-(W<760?72:110),H-(W<760?170:150)];}
requestAnimationFrame(tick);

/* compass: needle swings toward your next brick */
function aimNeedle(){var nq=$$('.quest',ql)[nextQ()],ang=0;if(nq){var r=nq.getBoundingClientRect();ang=r.top>innerHeight?180:r.bottom<0?0:90;}
  $('#needle').style.transform='rotate('+(count()===10?0:ang)+'deg)';}
addEventListener('scroll',function(){aimNeedle();},{passive:true});
$('#compass').addEventListener('click',petTap);
function go(h){var el=$(h);if(el)el.scrollIntoView({behavior:RM?'auto':'smooth'});}

/* ---------- rooms ---------- */
var LINES={hearth:'Hi! I\'m Tinder, born in a kiln. Drag me, throw me, tap me for hints.',course:'Each quest is a brick. Fire all ten and we\'ve got a course.',bench:'The Bench stamps names. Tap the tablet to copy one.',pillars:'Three pillars. Merge them and the roof falls in. Literally.',gate:'Gate #3 is unmeasured. This curve is a model, not a promise.',assay:'This is it. Label the course, then deliver it.',sources:'The Plate Library. Real books live here.'},seen={};
var rooms=$$('.room');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');var id=en.target.id;if(id!==curRoom){curRoom=id;perch=null;}
  $$('.doors a').forEach(function(a){a.classList.toggle('here',a.dataset.room===id);});
  if(!seen[id]){seen[id]=1;setTimeout(function(){say(LINES[id]||'');},500);}}});},{threshold:.35});rooms.forEach(function(r){io.observe(r);});}
else rooms.forEach(function(r){r.classList.add('in');});

/* overlay-button hover cue follows pointer */
$$('.start,.deliver').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.setProperty('--mx',(e.clientX-r.left)+'px');b.style.setProperty('--my',(e.clientY-r.top)+'px');});});
$('#start').addEventListener('click',function(){var r=this.getBoundingClientRect();sparks(r.left+r.width/2,r.top,24);pluck(0);});

/* ---------- hidden sigils (after Field's hidden spores) ---------- */
var SP=[['hearth','12%','82%','☉ The sun sigil: the kiln is a small sun.'],['course','8%','94%','▦ Running bond: each course offset by half a brick.'],['pillars','86%','6%','Ⅲ Three, not one. You read the warning!'],['gate','10%','90%','⌇ Standoff is a low-pass filter. You found the wiggle.'],['assay','88%','90%','⚖ The assay weighs evidence, not hopes.']],found=load('redcore.spores',{});
SP.forEach(function(s,i){var b=document.createElement('button');b.className='spore'+(found[i]?' found':'');b.textContent='✶';b.setAttribute('aria-label','Hidden sigil');b.style.top=s[1];b.style.left=s[2];
  b.addEventListener('click',function(){found[i]=1;save('redcore.spores',found);b.classList.add('found');var r=b.getBoundingClientRect();sparks(r.left+17,r.top+17,14);pluck(9-i);say(s[3]+' ('+Object.keys(found).length+'/5)');sp();});
  $('#'+s[0]).appendChild(b);});
function sp(){$('#spores').textContent='✶ '+Object.keys(found).length+'/5';}sp();

/* ---------- Namer's Bench ---------- */
var lot=$('#lot'),nn=$('#nn'),rep=$('#rep');
function pad(v){v=Math.max(1,Math.min(20,parseInt(v,10)||1));return (v<10?'0':'')+v;}
function name(l,n,r){return l+'-'+pad(n)+'_r'+r+'.jpg';}
function upd(){$('#fname').textContent=name(lot.value,nn.value,rep.value);var out=[];for(var i=1;i<=10;i++)out.push(name(lot.value,i,1)+'   '+name(lot.value,i,2));
  $('#shotlist').textContent=out.join('\n')+'\n\n(20 faces total: A-01…A-10 and B-01…B-10, or one lot of 20.)';}
[lot,nn,rep].forEach(function(el){el.addEventListener('input',upd);});upd();
$('#copy').addEventListener('click',function(){var t=$('#fname').textContent,h=$('#copyhint'),b=this;var r=b.getBoundingClientRect();sparks(r.left+r.width/2,r.top+r.height/2,10);
  (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){h.textContent='stamped · copied';say('Stamped: '+t);setTimeout(function(){h.textContent='tap to copy';},1400);},function(){h.textContent='select & copy: '+t;});});

/* ---------- the Assay (submit) ---------- */
var link=$('#submitLink');function v(id){return ($('#'+id).value||'').trim();}
function build(){var body=['## Experiment 0 data submission','','- Lots: '+(v('s_lots')||'_'),'- Faces photographed: '+(v('s_faces')||'_'),'- Lighting / reps: '+(v('s_light')||'_'),
  '- Filenames follow `{lot}-{nn}_r{rep}.jpg` (e.g. `A-01_r1.jpg`): yes / no','','## Notes',v('s_notes')||'_','','## Attach','Drag your zip of photos here before posting.','',
  '_Optical texture only. Not a B-map, not the spectrum gate (#3). No bits-per-brick claim._'].join('\n');
  link.href='https://github.com/stevoblevo/redcore/issues/new?labels=data-submission&title='+encodeURIComponent('Data: Experiment 0 photos'+(v('s_lots')?' — '+v('s_lots'):''))+'&body='+encodeURIComponent(body);}
['s_lots','s_faces','s_light','s_notes'].forEach(function(id){$('#'+id).addEventListener('input',build);});build();
link.addEventListener('click',function(){var p=$('#plate'),r=p.getBoundingClientRect();sparks(r.left+65,r.top+65,30);pluck(9);p.classList.add('go');
  if(!st.submit){st.submit=true;save(KEY,st);paint();}say('Delivered to the assay! Now drag your zip into the issue. Publish the fail if it fails.',6000);
  setTimeout(function(){p.classList.remove('go');},2600);});

/* ---------- kiln backdrop: heats with your course ---------- */
var heat=0,c=$('#kiln'),x=c.getContext('2d'),W,H,D=Math.min(2,window.devicePixelRatio||1),px=0,tx=0,ty=0,py=0,sy=0,emb=[];
function size(){W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0);}size();addEventListener('resize',size);
addEventListener('pointermove',function(e){tx=e.clientX/W-.5;ty=e.clientY/H-.5;},{passive:true});
addEventListener('scroll',function(){sy=scrollY;},{passive:true});
for(var i=0;i<60;i++)emb.push({x:Math.random(),y:Math.random(),v:.0006+Math.random()*.0016,r:.6+Math.random()*1.8,p:Math.random()*6});
function frame(t){px+=(tx-px)*.05;py+=(ty-py)*.05;var hh=.5+heat*.5;
  var g=x.createRadialGradient(W*(.5+px*.2),H*.9,10,W*.5,H*.7,Math.max(W,H)*.9);
  g.addColorStop(0,'rgb('+(70+60*heat|0)+','+(18+14*heat|0)+',14)');g.addColorStop(.4,'#1a0909');g.addColorStop(1,'#08070a');x.fillStyle=g;x.fillRect(0,0,W,H);
  /* magnetic field lines, faint, pointing north */
  x.strokeStyle='rgba(255,59,47,'+(.04+.05*heat)+')';x.lineWidth=1;for(var L=0;L<7;L++){x.beginPath();var cx=W*(.5+px*.1),s=60+L*70;x.ellipse(cx,H*.5-((sy*.1)%140),s*.55,s,0,0,6.283);x.stroke();}
  for(var j=0;j<emb.length;j++){var e=emb[j];if(!RM){e.y-=e.v*(1+heat*2);if(e.y<-.02){e.y=1.02;e.x=Math.random();}}
    var ex=e.x*W+Math.sin(t*.001+e.p)*8+px*40,ey=e.y*H;x.fillStyle='rgba(255,'+(120+(e.p*20|0))+',70,'+(hh*(.3+.3*Math.sin(t*.003+e.p)))+')';x.beginPath();x.arc(ex,ey,e.r,0,6.283);x.fill();}
  if(!RM)requestAnimationFrame(frame);}
requestAnimationFrame(frame);

/* ---------- Gate #3 plot: exp(-2πkh) vs standoff h (model only) ---------- */
var dc=$('#decay'),k=$('#k'),d=dc.getContext('2d'),HS=[0.5,1,2,5],HMAX=6;
function draw(){if(dc.clientWidth&&dc.clientWidth<600){dc.width=600;dc.height=380;}var kv=parseFloat(k.value),w=dc.width,h=dc.height,L=60,R=20,T=24,B=48,pw=w-L-R,ph=h-T-B;
  $('#kout').textContent=kv.toFixed(2);$('#lout').textContent=(1/kv).toFixed(2);
  d.clearRect(0,0,w,h);d.font='14px system-ui,sans-serif';d.strokeStyle='rgba(255,255,255,.08)';d.fillStyle='rgba(255,255,255,.55)';
  for(var i=0;i<=HMAX;i++){var gx=L+pw*i/HMAX;d.beginPath();d.moveTo(gx,T);d.lineTo(gx,T+ph);d.stroke();d.fillText(i+' mm',gx-14,h-22);}
  for(var j=0;j<=4;j++){var gy=T+ph*j/4;d.beginPath();d.moveTo(L,gy);d.lineTo(L+pw,gy);d.stroke();d.fillText((1-j/4).toFixed(2),12,gy+5);}
  d.fillText('standoff h',L+pw-70,h-4);var gr=d.createLinearGradient(L,0,L+pw,0);gr.addColorStop(0,'#ff8a5c');gr.addColorStop(1,'#ff3b2f');
  d.strokeStyle=gr;d.lineWidth=3;d.beginPath();for(var s=0;s<=300;s++){var hv=HMAX*s/300,yy=T+ph*(1-Math.exp(-2*Math.PI*kv*hv));s?d.lineTo(L+pw*s/300,yy):d.moveTo(L,yy);}d.stroke();d.lineWidth=1;
  HS.forEach(function(hv){var a=Math.exp(-2*Math.PI*kv*hv),X=L+pw*hv/HMAX,Y=T+ph*(1-a);d.fillStyle='#fff';d.beginPath();d.arc(X,Y,5,0,6.283);d.fill();d.fillStyle='rgba(255,200,180,.9)';d.fillText(a<0.001?a.toExponential(1):a.toFixed(3),X+8,Y-8);});
  d.fillStyle='#ff8a5c';d.fillText('exp(−2πkh) · model, unmeasured',L+8,T+14);}
k.addEventListener('input',draw);draw();

/* ---------- the clay tablet: repo docs read in-world (v0.3.1) ---------- */
var REPO='https://github.com/stevoblevo/redcore',RAW='https://raw.githubusercontent.com/stevoblevo/redcore/main/',rdOpen=false,rdPath='',
  rd=$('#reader'),rdp=$('#rdpanel'),rdb=$('#rdbody'),rdLast=null;
function repoPath(href,base){var m;
  if(/^https?:/i.test(href)){
    if(href.replace(/\/$/,'')===REPO)return 'README.md';
    m=href.match(/^https:\/\/github\.com\/stevoblevo\/redcore\/(?:blob|tree)\/main\/([^?#]+)/);return m?decodeURIComponent(m[1]):null;}
  if(base===undefined||/^(#|mailto:|data:)/i.test(href))return null;
  var parts=(base.replace(/[^\/]*$/,'')+href.split('#')[0].split('?')[0]).split('/'),out=[];
  parts.forEach(function(x){if(x==='..')out.pop();else if(x&&x!=='.')out.push(x);});return out.join('/')||null;}
function esc(t){return t.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
function clean(html){var d=new DOMParser().parseFromString('<div>'+html+'</div>','text/html'),r=d.body.firstChild;
  $$('script,iframe,object,embed,style',r).forEach(function(n){n.remove();});
  $$('*',r).forEach(function(n){[].slice.call(n.attributes).forEach(function(a){if(/^on/i.test(a.name)||/^\s*javascript:/i.test(a.value))n.removeAttribute(a.name);});});
  /* math-ish: $…$ and $$…$$ spans */
  $$('p,li,td',r).forEach(function(n){if(/\$[^$\n]+\$/.test(n.innerHTML)&&!n.querySelector('code'))n.innerHTML=n.innerHTML.replace(/\$\$?([^$\n]+)\$\$?/g,'<span class="math">$1</span>');});
  return r.innerHTML;}
function openDoc(path,push){rdPath=path;rdLast=rdLast||document.activeElement;rd.hidden=false;rdOpen=true;closeMenu();
  $('#rdtitle').textContent=path;$('#rdsrc').href=REPO+'/blob/main/'+path;rdb.innerHTML='<p class="rdwait">Unfurling the tablet…</p>';rdb.scrollTop=0;
  rdp.style.transform='';if(push!==false)history.replaceState(null,'','#read='+encodeURI(path));
  say('A tablet! I\'ll sit on its edge. Esc or ✕ to put it back.');$('#rdx').focus({preventScroll:true});
  fetch(RAW+path).then(function(r){if(!r.ok)throw new Error(r.status);return r.text();}).then(function(t){if(rdPath!==path)return;
    rdb.innerHTML=/\.md$/i.test(path)&&window.marked?clean(marked.parse(t)):'<pre><code>'+esc(t)+'</code></pre>';
    var h=$('h1',rdb);if(h)$('#rdtitle').textContent=h.textContent+' · '+path;
    $$('a[href]',rdb).forEach(function(a){var h=a.getAttribute('href');if(h.charAt(0)==='#'){a.addEventListener('click',function(e){e.preventDefault();var t=rdb.querySelector('[id="'+h.slice(1)+'"]');if(t)t.scrollIntoView({behavior:RM?'auto':'smooth'});});return;}
      var rp=repoPath(h,path);if(rp)a.dataset.read=rp;else if(/^https?:/i.test(h)){a.target='_blank';a.rel='noopener';}});
  }).catch(function(e){if(rdPath===path)rdb.innerHTML='<p class="rdwait">The tablet would not unfurl ('+esc(String(e.message||e))+'). <a href="'+REPO+'/blob/main/'+esc(path)+'" target="_blank" rel="noopener" class="leave">Read it on GitHub</a>.</p>';});}
function closeDoc(){if(!rdOpen)return;rd.hidden=true;rdOpen=false;rdPath='';perch=null;if(/^#read=/.test(location.hash))history.replaceState(null,'',location.pathname+location.search);
  if(rdLast&&rdLast.focus)rdLast.focus({preventScroll:true});rdLast=null;}
$('#rdx').addEventListener('click',closeDoc);
rd.addEventListener('click',function(e){if(e.target===rd)closeDoc();});
addEventListener('keydown',function(e){if(e.key==='Escape')closeDoc();});
var lc=document.createElement('div');lc.className='leavecue';lc.setAttribute('role','status');document.body.appendChild(lc);var lct=null;
function leaving(where){lc.textContent='Leaving the hearth → '+where+' ↗';lc.classList.add('on');clearTimeout(lct);lct=setTimeout(function(){lc.classList.remove('on');},2200);}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey)return;
  var h=a.getAttribute('href'),rp=a.dataset.read||(a.closest('#reader')?null:repoPath(h));
  if(rp&&a.id!=='rdsrc'){e.preventDefault();openDoc(rp);return;}
  if(/^https?:/i.test(h)&&a.host!==location.host){if(!a.target){a.target='_blank';a.rel='noopener';}
    if(/github\.com/.test(a.host)){leaving('GitHub');if(a.id!=='submitLink')say('Leaving the hearth for GitHub. I\'ll keep the fire on.');}}},true);
/* drag the tablet by its bar */
(function(){var bar=$('#rdbar'),d=null,ox=0,oy=0;
  bar.addEventListener('pointerdown',function(e){if(e.target.closest('button,a'))return;d={x:e.clientX-ox,y:e.clientY-oy};bar.setPointerCapture(e.pointerId);bar.style.cursor='grabbing';});
  bar.addEventListener('pointermove',function(e){if(!d)return;ox=e.clientX-d.x;oy=e.clientY-d.y;rdp.style.transform='translate('+ox+'px,'+oy+'px)';});
  bar.addEventListener('pointerup',function(){d=null;bar.style.cursor='';});
  new MutationObserver(function(){if(rd.hidden){ox=oy=0;}}).observe(rd,{attributes:true,attributeFilter:['hidden']});})();
/* source refs like briefs/v4.md become tablet links */
$$('.src').forEach(function(p){var w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),ns=[],n;while((n=w.nextNode()))if(!n.parentNode.closest('a'))ns.push(n);
  ns.forEach(function(t){var re=/\b((?:docs|briefs|protocol|cuda|sim)\/[\w.\/-]+\.(?:md|py))/g;if(!re.test(t.nodeValue))return;var sp=document.createElement('span');
    sp.innerHTML=esc(t.nodeValue).replace(re,'<a class="rdlink" href="'+REPO+'/blob/main/$1">$1</a>');t.parentNode.replaceChild(sp,t);});});
function readHash(){var m=location.hash.match(/^#read=(.+)$/);if(m){var p=decodeURI(m[1]);if(p!==rdPath)openDoc(p,false);}else if(rdOpen)closeDoc();}
addEventListener('hashchange',readHash);readHash();

paint();
})();
