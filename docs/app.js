/* Redcore · Brickmark v0.6.0 — lay the course. Vanilla, no build. */
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
function perchSpot(){if(window.__book&&window.__book.open)return window.__book.perch();if(jOpen){var jh=$('.jp.cur .jh'),jr=jh&&jh.getBoundingClientRect(),Wd=innerWidth;return [Wd-(Wd<760?66:96),Math.max(64,Math.min(innerHeight-200,jr?jr.top-8:innerHeight*.3))];}
  var room=$('#'+curRoom),W=innerWidth,H=innerHeight,side=W-(W<760?66:96),y=H*.3;
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
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');var id=en.target.id;if(id!==curRoom){curRoom=id;perch=null;}try{window.dispatchEvent(new CustomEvent('rc:room',{detail:id}));}catch(e){}
  $$('.doors a').forEach(function(a){a.classList.toggle('here',a.dataset.room===id);});
  if(!seen[id]&&!(AP&&AP.on)){seen[id]=1;setTimeout(function(){say(LINES[id]||'');},500);}}});},{threshold:.35});rooms.forEach(function(r){io.observe(r);});}
else rooms.forEach(function(r){r.classList.add('in');});

/* overlay-button hover cue follows pointer */
$$('.start,.deliver').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.setProperty('--mx',(e.clientX-r.left)+'px');b.style.setProperty('--my',(e.clientY-r.top)+'px');});});
$('#start').addEventListener('click',function(){var r=this.getBoundingClientRect();sparks(r.left+r.width/2,r.top,24);pluck(0);});

/* ---------- hidden sigils (after Field's hidden spores) ---------- */
var SP=[['hearth','12%','82%','☉ The sun sigil: the kiln is a small sun.'],['course','8%','94%','▦ Running bond: each course offset by half a brick.'],['pillars','86%','6%','Ⅲ Three, not one. You read the warning!'],['gate','10%','90%','⌇ Standoff is a low-pass filter. You found the wiggle.'],['assay','88%','90%','⚖ The assay weighs evidence, not hopes.']],found=load('redcore.spores',{});
SP.forEach(function(s,i){var b=document.createElement('button');b.className='spore'+(found[i]?' found':'');b.textContent='✶';b.setAttribute('aria-label','Hidden sigil');b.style.top=s[1];b.style.left=s[2];
  b.addEventListener('click',function(){found[i]=1;save('redcore.spores',found);b.classList.add('found');var r=b.getBoundingClientRect();sparks(r.left+17,r.top+17,14);pluck(9-i);say(s[3]+' ('+Object.keys(found).length+'/'+SPN+')');sp();});
  $('#'+s[0]).appendChild(b);});
var SPN=12;function sp(){$('#spores').textContent='✶ '+Object.keys(found).length+'/'+SPN;}sp();
function takeSigil(i,msg,el){if(found[i]){say(msg+' (already yours)');return;}found[i]=1;save('redcore.spores',found);if(el){el.classList.add('found');var r=el.getBoundingClientRect();sparks(r.left+r.width/2,r.top+r.height/2,16);}pluck(i);say(msg+' ('+Object.keys(found).length+'/'+SPN+')');sp();}

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

/* ---------- v0.4.0 · The North That Was: one brick's life along a field line ---------- */
var J=$('#north'),jw=$('#jworld'),jf=$('#jfield'),jx=jf.getContext('2d'),jOpen=false,jCur=0,camX=0,camY=0,camTX=0,camTY=0,camFrom=null;
var ST=[ /* id, x, y, glyph, branch?  — world coords in screens */
 {id:'pit',x:0,y:0,g:'∴',n:'The Clay Pit'},
 {id:'tablet',x:.5,y:-1,g:'≡',n:'The Tablet',br:1},
 {id:'kiln',x:1,y:0,g:'△',n:'The Kiln'},
 {id:'cool',x:2,y:0,g:'↟',n:'The Cooling'},
 {id:'course',x:3,y:0,g:'▦',n:'The Course'},
 {id:'years',x:4,y:0,g:'◷',n:'The Long Years'},
 {id:'wander',x:4.5,y:-1,g:'✧',n:'The Wanderer',br:1},
 {id:'reader',x:5,y:0,g:'∿',n:'The Reader'},
 {id:'scroll',x:5.5,y:1,g:'§',n:'The Scroll',br:1},
 {id:'ask',x:6,y:0,g:'⊙',n:'The Ask'}];
var SIX={};ST.forEach(function(s,i){SIX[s.id]=i;});
var revealed={},visited={},camTok=0;
var AP={on:false,paused:false};
/* pausable tween: f(p) for p 0..1 over ms; time only advances while autoplay is not paused */
function tween(ms,f,done){var t=0,last=performance.now();if(RM)ms*=1.15;
  (function st(now){var dt=now-last;last=now;if(!(AP.on&&AP.paused))t+=dt;var p=Math.min(1,t/ms);f(p);if(p<1)requestAnimationFrame(st);else if(done)done();})(last);}
function ease(p){return p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;}
/* --- world + track --- */
var trk=$('#jtrack'),tsv='<svg class="jline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M2 20';
ST.forEach(function(s){var X=4+s.x/6*92,Y=20+s.y*13;tsv+=' L'+X.toFixed(1)+' '+Y;});
trk.innerHTML=tsv+' L98 20"/></svg>';
ST.forEach(function(s,i){var b=document.createElement('button');b.type='button';b.className='jn'+(s.br?' br sealed':'');b.dataset.i=i;
  b.style.left=(4+s.x/6*92)+'%';b.style.top=(50+s.y*32)+'%';b.innerHTML='<b>'+s.g+'</b><span>'+(s.br?'? a side path':s.n)+'</span>';
  b.setAttribute('aria-label',s.br?'Hidden side path':'Station: '+s.n);
  b.addEventListener('click',function(){if(b.classList.contains('sealed')){say('Sealed. Something at a station nearby unseals it.');return;}goSt(i);});trk.appendChild(b);});
$$('.jp',jw).forEach(function(p){var s=ST[SIX[p.dataset.s]];p.style.left=(s.x*100)+'vw';p.style.top=(s.y*100)+'vh';});
function reveal(id,msg){if(revealed[id])return;revealed[id]=1;var b=$$('.jn',trk)[SIX[id]];b.classList.remove('sealed');b.classList.add('fresh');$('span',b).textContent=ST[SIX[id]].n;b.setAttribute('aria-label','Side path: '+ST[SIX[id]].n);
  var r=b.getBoundingClientRect();sparks(r.left+14,r.top+14,10);if(msg)say(msg);}
function jsize(){var D2=Math.min(2,devicePixelRatio||1);jf.width=innerWidth*D2;jf.height=innerHeight*D2;jx.setTransform(D2,0,0,D2,0,0);$$('canvas.jc',J).forEach(fitC);}
function fitC(cv){var D2=Math.min(2,devicePixelRatio||1),w=cv.clientWidth||300,h=cv.clientHeight||200;if(cv.width!==Math.round(w*D2)){cv.width=Math.round(w*D2);cv.height=Math.round(h*D2);cv.getContext('2d').setTransform(D2,0,0,D2,0,0);}}
addEventListener('resize',function(){if(jOpen){jsize();camX=camTX;camY=camTY;place();}});
function place(){jw.style.transform='translate3d('+(-camX*innerWidth)+'px,'+(-camY*innerHeight)+'px,0)';}
function goSt(i,quiet){i=Math.max(0,Math.min(ST.length-1,i));var s=ST[i],prev=jCur;jCur=i;visited[s.id]=1;
  $$('.jp',jw).forEach(function(p){p.classList.toggle('cur',p.dataset.s===s.id);});
  $$('.jn',trk).forEach(function(b,k){b.classList.toggle('here',k===i);b.classList.toggle('seen',!!visited[ST[k].id]);});
  camTX=s.x;camTY=s.y;var fx=camX,fy=camY;
  if(RM){var tk=++camTok;J.classList.add('fade');setTimeout(function(){J.classList.remove('fade');if(tk!==camTok)return;camX=camTX;camY=camTY;place();perch=null;},260);}
  else{var tok=++camTok;tween(1100,function(p){if(tok!==camTok)return;var e=ease(p);camX=fx+(camTX-fx)*e;camY=fy+(camTY-fy)*e;place();},function(){perch=null;});}
  perch=null;var on=SON[s.id];if(on)on();
  if(!quiet&&!AP.on)say(TL[s.id]);
  $('#jprev').disabled=i===0;$('#jnext').disabled=i===ST.length-1;
  if(!AP.on)history.replaceState(null,'','#north='+s.id);try{window.dispatchEvent(new CustomEvent('rc:station',{detail:s.id}));}catch(e){}}
var TL={pit:'Station one. Stir it! Nothing here knows which way is north.',tablet:'A side path. Somebody pressed wedges into this clay. Lore, not a translation.',kiln:'Into the kiln. Hold the bellows and we go up to 1050 °C.',cool:'Now we cool. Watch 675 °C, then 580 °C. Then drag the compass onto the brick.',course:'One brick says very little. Lay its neighbours.',years:'Seasons, then centuries. The wall weathers. The north it holds stays put (model assumption).',wander:'Oh, Ash! My cousin from the chimney. Tap them.',reader:'A scanner at standoff h. Lift it and watch the signal fade: exp(−2πkh).',scroll:'A scroll tucked under the scanner. Lore, clearly marked.',ask:'This is the Ask. The real course starts with your phone.'};
var SON={};
function nextMain(d){var i=jCur;do{i+=d;}while(i>0&&i<ST.length-1&&ST[i].br&&!revealed[ST[i].id]);goSt(i);}
$('#jprev').addEventListener('click',function(){nextMain(-1);});$('#jnext').addEventListener('click',function(){nextMain(1);});
addEventListener('keydown',function(e){if(!jOpen||AP.on||rdOpen||/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||''))return;if(e.key==='ArrowRight')nextMain(1);if(e.key==='ArrowLeft')nextMain(-1);});
function openJ(id){if(rdOpen)closeDoc();if(!jOpen){jOpen=true;J.hidden=false;document.body.classList.add('jopen');jsize();
  var s=ST[SIX[id]||0];camX=camTX=s.x;camY=camTY=s.y;place();requestAnimationFrame(jframe);curRoom='north';}
  goSt(SIX[id]||0,AP.on);}
function closeJ(to){if(!jOpen)return;jOpen=false;J.hidden=true;document.body.classList.remove('jopen');perch=null;curRoom='hearth';
  if(/^#north/.test(location.hash))history.replaceState(null,'',location.pathname+location.search);if(to)go(to);}
$('#jx').addEventListener('click',function(){closeJ('#hearth');});
function northHash(){var m=location.hash.match(/^#north(?:=(\w+))?$/);if(m)openJ(m[1]&&SIX[m[1]]!==undefined?m[1]:'pit');}
addEventListener('hashchange',northHash);
J.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-out]');if(a){e.preventDefault();var h=a.getAttribute('href');closeJ(h);}});
/* the glowing field line through every station (generative) */
function jframe(t){if(!jOpen)return;var W2=innerWidth,H2=innerHeight;jx.clearRect(0,0,W2,H2);
  var base=H2*.86;function sx(wx){return (wx-camX)*W2+W2/2;}function sy(wy){return (wy-camY)*H2+base;}
  jx.lineCap='round';
  for(var pass=0;pass<2;pass++){jx.strokeStyle=pass?'rgba(255,170,110,.85)':'rgba(255,59,47,.22)';jx.lineWidth=pass?1.6:9;jx.beginPath();
    for(var wx=-1;wx<=7;wx+=.02){var y=Math.sin(wx*Math.PI*2+t*.0004)*.012;var X=sx(wx),Y=sy(y);wx===-1?jx.moveTo(X,Y):jx.lineTo(X,Y);}jx.stroke();
    ST.forEach(function(s){if(!s.br)return;var a=sx(s.x-.5),b=sx(s.x+.5),m=sx(s.x);jx.beginPath();jx.moveTo(a,sy(0));jx.bezierCurveTo(a+(m-a)*.6,sy(0),m-(m-a)*.4,sy(s.y),m,sy(s.y));jx.bezierCurveTo(m+(b-m)*.4,sy(s.y),b-(b-m)*.6,sy(0),b,sy(0));
      jx.setLineDash(revealed[s.id]?[]:[4,10]);jx.stroke();jx.setLineDash([]);});}
  /* flowing north-pointing chevrons along the line */
  jx.fillStyle='rgba(255,199,122,.7)';for(var k=0;k<60;k++){var wx2=((k/8+(RM?0:t*.00005))%8)-1,X2=sx(wx2),Y2=sy(Math.sin(wx2*Math.PI*2+t*.0004)*.012);if(X2<-20||X2>W2+20)continue;
    jx.beginPath();jx.moveTo(X2,Y2-5);jx.lineTo(X2+3,Y2+2);jx.lineTo(X2-3,Y2+2);jx.fill();}
  ST.forEach(function(s,i){var X=sx(s.x),Y=sy(s.y);if(X<-60||X>W2+60||Y<-60||Y>H2+60)return;jx.font='22px system-ui,serif';jx.textAlign='center';
    jx.fillStyle=i===jCur?'#ffc77a':visited[s.id]?'rgba(255,138,92,.85)':'rgba(255,255,255,.25)';jx.fillText(s.br&&!revealed[s.id]?'?':s.g,X,Y-14);});
  /* tick active station sims */
  var a=ST[jCur].id;if(SIM[a])SIM[a]();
  requestAnimationFrame(jframe);}
var SIM={};
/* --- grains: random magnetic grains in clay (model, exaggerated for the eye) --- */
var THETA=-Math.PI/2+0.32; /* the north that was, illustrative direction (not a measured declination) */
function Grains(cv,o){this.cv=cv;this.o=o;this.T=o.T||20;this.g=[];this.stir=[];this.order=0;
  for(var i=0;i<(o.n||170);i++)this.g.push({x:Math.random(),y:Math.random(),a:Math.random()*6.283,va:0,vx:0,vy:0,h:Math.random()<.3,lock:0,la:0});}
Grains.prototype.reset=function(T){this.T=T;this.g.forEach(function(g){g.lock=0;g.a=Math.random()*6.283;});};
Grains.prototype.step=function(){var cv=this.cv,c2=cv.getContext('2d'),w=cv.clientWidth,h=cv.clientHeight,T=this.T,o=this.o,sm=RM?.4:1;fitC(cv);
  var sx=0,sy=0,self=this;this.stir=this.stir.filter(function(s){return --s.l>0;});
  this.g.forEach(function(g){
    if(T<675&&g.h&&!g.lock&&o.cool){g.lock=1;g.la=THETA+(Math.random()-.5)*1.1;}
    if(T<580&&!g.h&&!g.lock&&o.cool){g.lock=1;g.la=THETA+(Math.random()-.5)*1.1;}
    if(g.lock){var d=((g.la-g.a+9.4248)%6.2832)-3.1416;g.a+=d*.12*sm;}
    else{var jit=o.wet?.03:.04+T/1050*.5;g.va=g.va*.85+(Math.random()-.5)*jit*sm;g.a+=g.va;}
    if(o.wet){self.stir.forEach(function(s){var dx=g.x-s.x,dy=(g.y-s.y)*h/w,d=Math.sqrt(dx*dx+dy*dy);if(d<.22){var f=(1-d/.22);g.vx+=s.vx*f*.08+(-dy)*s.s*f*.004;g.vy+=s.vy*f*.08+dx*s.s*f*.004;g.va+=s.s*f*.01*(Math.random()-.3);}});
      g.x+=g.vx*sm;g.y+=g.vy*sm;g.vx*=.93;g.vy*=.93;g.x=(g.x+1)%1;g.y=(g.y+1)%1;}
    else if(T>300){g.x+=(Math.random()-.5)*.0008*T/1050;g.y+=(Math.random()-.5)*.0008*T/1050;}
    sx+=Math.cos(g.a);sy+=Math.sin(g.a);});
  this.order=Math.sqrt(sx*sx+sy*sy)/this.g.length;
  /* clay colour: wet umber → glowing orange → fired red */
  var hot=Math.max(0,(T-450)/600);
  c2.fillStyle=o.wet?'#4a2a1c':'rgb('+(120+135*hot|0)+','+(42+120*hot|0)+','+(26+50*hot|0)+')';c2.fillRect(0,0,w,h);
  if(o.wet){c2.fillStyle='rgba(255,220,190,.05)';for(var q=0;q<6;q++){c2.beginPath();c2.ellipse(w*((q*.37+performance.now()*.00002)%1),h*((q*.61)%1),40,14,q,0,6.283);c2.fill();}}
  if(hot>0){var gr=c2.createRadialGradient(w/2,h*.7,10,w/2,h/2,w*.7);gr.addColorStop(0,'rgba(255,240,180,'+(.55*hot)+')');gr.addColorStop(1,'rgba(255,90,30,0)');c2.fillStyle=gr;c2.fillRect(0,0,w,h);}
  c2.lineWidth=2;c2.lineCap='round';
  this.g.forEach(function(g){var X=g.x*w,Y=g.y*h,L=g.h?4:5.5;c2.strokeStyle=g.lock?(g.h?'#ffb38a':'#ffe2b0'):(g.h?'rgba(120,30,18,.95)':'rgba(25,14,12,.95)');
    c2.beginPath();c2.moveTo(X-Math.cos(g.a)*L,Y-Math.sin(g.a)*L);c2.lineTo(X+Math.cos(g.a)*L,Y+Math.sin(g.a)*L);c2.stroke();
    c2.fillStyle=c2.strokeStyle;c2.beginPath();c2.arc(X+Math.cos(g.a)*L,Y+Math.sin(g.a)*L,1.4,0,6.283);c2.fill();});
  if(o.arrow&&this.order>.15){var m=Math.atan2(sy,sx),R=Math.min(w,h)*.38*this.order;c2.strokeStyle='rgba(255,59,47,.9)';c2.lineWidth=4;c2.beginPath();c2.moveTo(w/2-Math.cos(m)*R,h/2-Math.sin(m)*R);c2.lineTo(w/2+Math.cos(m)*R,h/2+Math.sin(m)*R);c2.stroke();}
};
/* 1 · Clay Pit */
var pitG=new Grains($('#cv-pit'),{wet:1}),stirred=0;
SIM.pit=function(){pitG.step();var o=pitG.order;$('#pit-order').textContent=o<.12?'chaotic · no north':o<.3?'a brief swirl · still no north':'a stir-current · not a field';};
function stirAt(x,y,vx,vy){pitG.stir.push({x:x,y:y,vx:vx,vy:vy,s:Math.sign(vx*.3+vy+.01)*Math.min(4,Math.hypot(vx,vy)*80),l:26});stirred+=Math.hypot(vx,vy);
  if(stirred>2.2&&!revealed.tablet)reveal('tablet','Clunk. Something hard under the clay: a side path opened ⇡ (The Tablet).');}
(function(){var cv=$('#cv-pit'),lx=null,ly=null;cv.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  if(lx!==null&&(e.pointerType==='mouse'||e.buttons))stirAt(x,y,x-lx,y-ly);lx=x;ly=y;});cv.addEventListener('pointerleave',function(){lx=null;});})();
function demoStir(ms,done){var a0=Math.random()*6;tween(ms,function(p){var a=a0+p*Math.PI*6,x=.5+Math.cos(a)*.28,y=.5+Math.sin(a)*.3;stirAt(x,y,-Math.sin(a)*.04,Math.cos(a)*.04);
  var cv=$('#cv-pit'),r=cv.getBoundingClientRect();ghost(r.left+x*r.width,r.top+y*r.height);},function(){ghost();if(done)done();});}
/* ghost hand for demos */
var gh=document.createElement('i');gh.className='ghosthand';gh.setAttribute('aria-hidden','true');document.body.appendChild(gh);
function ghost(x,y){if(x===undefined){gh.classList.remove('on');return;}gh.classList.add('on');gh.style.transform='translate('+(x-11)+'px,'+(y-11)+'px)';}
/* Tablet (branch) */
$('#sg-tablet').addEventListener('click',function(){takeSigil(5,'≡ The tablet sigil: wedges in clay, the first written records were bricks of a kind.',this);});
/* 2 · Kiln */
var kG=new Grains($('#cv-kiln'),{}),kT=20,bel=0;
SIM.kiln=function(){if(bel&&kT<1050)kT=Math.min(1050,kT+(RM?4:9));else if(!bel&&kT>20&&kT<1050)kT=Math.max(20,kT-1.5);kG.T=kT;kG.step();
  $('#kiln-t').textContent=Math.round(kT)+' °C';J.style.setProperty('--heat',(kT/1050).toFixed(3));if(kT>=1050&&!kiDone){kiDone=1;say('1050 °C! Every grain is free. Now let me cool.');}};
var kiDone=0,kb=$('#kiln-b');
['pointerdown'].forEach(function(ev){kb.addEventListener(ev,function(){bel=1;});});['pointerup','pointerleave','pointercancel'].forEach(function(ev){kb.addEventListener(ev,function(){bel=0;});});
kb.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();bel=1;}});kb.addEventListener('keyup',function(){bel=0;});
SON.kiln=function(){if(kT<20)kT=20;};
/* 3 · Cooling + compass */
var cG=new Grains($('#cv-cool'),{cool:1,arrow:1,T:1050}),cT=1050,cool=$('#cool-t'),locked=false,comp=$('#jcomp');
function setCool(T){cT=T;cool.value=T;cG.T=T;$('#cool-out').textContent=Math.round(T)+' °C';
  $('#cool-h').classList.toggle('on',T<675);$('#cool-m').classList.toggle('on',T<580);if(T>=580&&locked)unlock();}
cool.addEventListener('input',function(){var T=+cool.value;if(T>cT+1)cG.reset(T);setCool(T);});
SIM.cool=function(){cG.step();};
function unlock(){locked=false;comp.classList.remove('locked');$('#cool-msg').textContent='Drag the compass onto the brick.';}
function lockTry(){var r=comp.getBoundingClientRect(),c=$('#cv-cool').getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  if(cx<c.left||cx>c.right||cy<c.top||cy>c.bottom){comp.style.transform='';return false;}
  if(cT>=580){comp.classList.add('spin');setTimeout(function(){comp.classList.remove('spin');},1200);$('#cool-msg').textContent='Too hot: above 580 °C the magnetite holds no direction. Cool it more.';say('Spinning! Still too hot to remember anything.');return false;}
  locked=true;comp.classList.add('locked');$('#jneedle').style.transform='rotate('+(THETA*180/Math.PI+90)+'deg)';
  $('#cool-msg').textContent='Locked. The needle points at the north that was (direction illustrative).';say('Locked! That arrow is the north that was. It stays in the brick.');
  var b=comp.getBoundingClientRect();sparks(b.left+b.width/2,b.top+b.height/2,14);pluck(3);return true;}
(function(){var d=null;comp.addEventListener('pointerdown',function(e){d={x:e.clientX,y:e.clientY};comp.setPointerCapture(e.pointerId);comp.classList.add('drag');});
  comp.addEventListener('pointermove',function(e){if(!d)return;comp.style.transform='translate('+(e.clientX-d.x)+'px,'+(e.clientY-d.y)+'px)';});
  comp.addEventListener('pointerup',function(){if(!d)return;d=null;comp.classList.remove('drag');lockTry();});
  comp.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();var c=$('#cv-cool').getBoundingClientRect(),r=comp.getBoundingClientRect();
    comp.style.transform='translate('+(c.left+c.width/2-r.left-r.width/2)+'px,'+(c.top+c.height/2-r.top-r.height/2)+'px)';lockTry();}});})();
$('#cool-go').addEventListener('click',function(){if(cT<100){cG.reset(1050);setCool(1050);}var f=cT;tween(4200,function(p){setCool(f-(f-20)*p);});});
function demoCompass(ms,done){comp.style.transform='';var c=$('#cv-cool').getBoundingClientRect(),r=comp.getBoundingClientRect(),dx=c.left+c.width*.5-r.left-r.width/2,dy=c.top+c.height*.5-r.top-r.height/2;
  tween(ms,function(p){var e=ease(p);comp.style.transform='translate('+dx*e+'px,'+dy*e+'px)';ghost(r.left+r.width/2+dx*e,r.top+r.height/2+dy*e);},function(){ghost();lockTry();if(done)done();});}
/* 4 · Course: identity is the pattern, not the brick (visual only; your saved quests are not touched) */
var cw=$('#jwall'),CB=[],seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
for(var ci=0;ci<18;ci++){var bdiv=document.createElement('i'),ang=THETA+(rnd()-.5)*1.6;bdiv.className='jb'+(ci===8?' me laid':'');bdiv.style.setProperty('--a',(ang*180/Math.PI+90)+'deg');bdiv.style.setProperty('--d',(ci*.06)+'s');
  bdiv.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3 V17 M10 3 L7 7 M10 3 L13 7"/></svg>';cw.appendChild(bdiv);CB.push(ang);}
var csig=$('#jsig');
function courseShow(all){$$('.jb',cw).forEach(function(b,i){if(i!==8)b.classList.toggle('laid',all);});$('#course-lay').textContent=all?'Lift the neighbours':'Lay the neighbours';
  $('#course-out').innerHTML=all?'<b>The course:</b> eighteen arrows, each a little off. The <em>pattern</em> across them is the candidate identity, if measured course BER earns it.':'<b>One brick:</b> one noisy arrow. Many bricks fired in one kiln share roughly the same north; one arrow alone says little.';
  var d='';if(all)CB.forEach(function(a,i){var X=(i%6)*20+10+(Math.floor(i/6)%2?10:0),Y=Math.floor(i/6)*18+9-Math.cos(a-THETA)*0+Math.sin(a-THETA)*7;d+=(i%6?' L':' M')+X.toFixed(1)+' '+Y.toFixed(1);});
  csig.innerHTML=all?'<path d="'+d+'"/>':'';csig.classList.toggle('on',all);cAll=all;}
var cAll=false;$('#course-lay').addEventListener('click',function(){courseShow(!cAll);if(cAll){var r=cw.getBoundingClientRect();sparks(r.left+r.width/2,r.top,12);}});
/* 5 · Long Years: time-lapse (lore) */
var yv=$('#cv-years'),yr=$('#years-t'),yPlay=false,yT=0,LICH=[];for(var li2=0;li2<140;li2++)LICH.push([Math.random(),Math.random(),Math.random()]);
var SEAS=['spring','summer','autumn','winter'],ROM=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
SIM.years=function(){if(yPlay){yT=Math.min(+yr.max,yT+(RM?.04:.09));yr.value=yT;if(yT>=+yr.max)yPlay=false,$('#years-go').textContent='▶ again';}
  var c2=yv.getContext('2d');fitC(yv);var w=yv.clientWidth,h=yv.clientHeight,yrs=yT*25,ph=yT%1,s=Math.floor(ph*4);
  var sky=[[90,130,110],[70,110,160],[150,80,40],[150,160,175]][s];c2.fillStyle='rgb('+sky.join(',')+')';c2.fillRect(0,0,w,h);
  var sa=ph*6.283;c2.fillStyle=s===3?'rgba(255,255,255,.5)':'rgba(255,230,160,.9)';c2.beginPath();c2.arc(w*(.1+.8*((ph*4)%1)),h*.35-Math.sin(((ph*4)%1)*Math.PI)*h*.25,9,0,6.283);c2.fill();
  var bh=h*.12,top=h*.38;for(var r=0;r*bh<h-top;r++)for(var cc=-1;cc<w/(bh*2.2)+1;cc++){var X=cc*bh*2.2+(r%2?bh*1.1:0),Y=top+r*bh;c2.fillStyle='rgb('+(150-yrs*.06|0)+','+(52-yrs*.01|0)+',36)';c2.fillRect(X+1,Y+1,bh*2.2-2,bh-2);
    c2.strokeStyle='rgba(255,220,170,.35)';c2.lineWidth=1.2;var ax=X+bh*1.1,ay=Y+bh/2,aa=THETA+((cc*7+r*3)%5-2)*.15;c2.beginPath();c2.moveTo(ax-Math.cos(aa)*bh*.3,ay-Math.sin(aa)*bh*.3);c2.lineTo(ax+Math.cos(aa)*bh*.3,ay+Math.sin(aa)*bh*.3);c2.stroke();}
  var nl=Math.min(LICH.length,yrs*.45|0);for(var k2=0;k2<nl;k2++){var L=LICH[k2];c2.fillStyle='rgba(170,190,110,'+(.25+L[2]*.35)+')';c2.beginPath();c2.arc(L[0]*w,top+L[1]*(h-top),2+L[2]*4,0,6.283);c2.fill();}
  if(s===3){c2.fillStyle='rgba(255,255,255,.85)';c2.fillRect(0,top-3,w,4);for(var q=0;q<40;q++){c2.fillRect((q*53+performance.now()*.02)%w,(q*37+performance.now()*.05)%h,2,2);}}
  if(s===2){c2.fillStyle='rgba(230,120,40,.9)';for(var q2=0;q2<14;q2++)c2.fillRect((q2*71+performance.now()*.03)%w,(q2*29+performance.now()*.04)%top,4,3);}
  var cen=Math.floor(yrs/100);$('#years-out').textContent=SEAS[s]+' · century '+(cen<1?'—':ROM[Math.min(9,cen-1)])+' (lore time-lapse)';
  if(cen>=3&&!revealed.wander)reveal('wander','Someone is wandering the top of the wall ⇡ (The Wanderer).');};
yr.addEventListener('input',function(){yT=+yr.value;yPlay=false;$('#years-go').textContent='▶ play';});
$('#years-go').addEventListener('click',function(){if(yT>=+yr.max)yT=0;yPlay=!yPlay;this.textContent=yPlay?'❚❚ pause':'▶ play';});
/* Wanderer (branch): Ash, a second critter */
var ash=$('#ash'),ashT=0;SIM.wander=function(){ashT+=RM?.004:.012;ash.style.transform='translate('+(Math.sin(ashT)*38)+'%,'+(Math.sin(ashT*2.3)*14)+'%) scaleX('+(Math.cos(ashT)>0?1:-1)+')';};
ash.addEventListener('click',function(){takeSigil(6,'✧ The wanderer sigil: Ash, made of what the kiln left. Tinder and Ash, fire and after.',this);});
/* 6 · Reader: scanner at standoff h; exp(−2πkh) (model; Gate #3 UNMEASURED) */
var rv=$('#cv-reader'),rh=$('#reader-h'),rX=0,rPass=0,KS=[];for(var kk=0;kk<9;kk++)KS.push({k:.15+kk*.22,a:.4+Math.random()*.6,p:Math.random()*6.283});
function sig(x,h){var s=0;KS.forEach(function(c){s+=c.a*Math.exp(-2*Math.PI*c.k*h)*Math.cos(2*Math.PI*c.k*x+c.p);});return s/3;}
SIM.reader=function(){var c2=rv.getContext('2d');fitC(rv);var w=rv.clientWidth,h=rv.clientHeight,H0=+rh.value,mm=w/24;rX+=(RM?.04:.1);if(rX>24){rX=0;rPass++;if(rPass>=1&&!revealed.scroll)reveal('scroll','Something slid out from under the scanner ⇣ (The Scroll).');}
  c2.fillStyle='#120c0e';c2.fillRect(0,0,w,h);var face=h*.62;
  for(var x=0;x<w;x+=2){var v=sig(x/mm,0);c2.fillStyle='rgb('+(140+v*90|0)+','+(48+v*30|0)+',32)';c2.fillRect(x,face,2,h-face);}
  var sh=face-12-H0*(face*.5/5);c2.fillStyle='#d9cfc8';c2.fillRect(rX*mm-10,sh-14,20,14);c2.strokeStyle='rgba(255,199,122,.5)';c2.setLineDash([3,4]);c2.beginPath();c2.moveTo(rX*mm,sh);c2.lineTo(rX*mm,face);c2.stroke();c2.setLineDash([]);
  c2.strokeStyle='#ff8a5c';c2.lineWidth=2;c2.beginPath();for(var x2=0;x2<=rX*mm;x2+=2){var yy=h*.22-sig(x2/mm,H0)*h*.18;x2?c2.lineTo(x2,yy):c2.moveTo(x2,yy);}c2.stroke();
  c2.strokeStyle='rgba(255,255,255,.12)';c2.beginPath();c2.moveTo(0,h*.22);c2.lineTo(w,h*.22);c2.stroke();
  c2.fillStyle='rgba(255,200,180,.8)';c2.font='12px system-ui,sans-serif';c2.fillText('model signal at h = '+H0.toFixed(2)+' mm · synthetic source',8,14);
  $('#reader-out').textContent=H0.toFixed(2)+' mm';$('#reader-k').textContent=Math.exp(-2*Math.PI*.5*H0).toFixed(3);};
rh.addEventListener('input',function(){});
/* Scroll (branch) */
$('#sg-scroll').addEventListener('click',function(){takeSigil(7,'§ The scroll sigil: the record is in the wall; the reading is what\'s unproven.',this);});
/* Ask */
$('#ask-go').addEventListener('click',function(){closeJ('#course');setTimeout(function(){say('Brick one: Ward. Then twenty faces. Your course starts here. ▦',5000);},600);});
SON.reader=function(){rX=0;};SON.years=function(){};
/* v0.6.0 scroll bridge: scroll.js drives travel and the scrubs through these */
window.__rcJ={open:function(){return jOpen;},ST:ST,SIX:SIX,cur:function(){return jCur;},revealed:function(){return revealed;},goSt:goSt,nextMain:nextMain,
 cam:function(){return [camX,camY];},setCam:function(x,y){camTok++;camX=camTX=x;if(y!==undefined)camY=camTY=y;place();},
 cool:function(){return cT;},setCool:function(T){T=Math.max(20,Math.min(1050,T));if(T>cT+1)cG.reset(T);setCool(T);if(T<580&&!locked&&cT<580){comp.style.transform='';var c=$('#cv-cool').getBoundingClientRect(),r=comp.getBoundingClientRect();comp.style.transform='translate('+(c.left+c.width/2-r.left-r.width/2)+'px,'+(c.top+c.height/2-r.top-r.height/2)+'px)';lockTry();}},
 locked:function(){return locked;},
 years:function(){return [yT,+yr.max];},setYears:function(v){yT=Math.max(0,Math.min(+yr.max,v));yr.value=yT;yPlay=false;$('#years-go').textContent='▶ play';},
 h:function(){return [+rh.value,+rh.min,+rh.max];},setH:function(v){rh.value=Math.max(+rh.min,Math.min(+rh.max,v));},
 kiln:function(){return kT;},stoke:function(d){kT=Math.min(1050,Math.max(kT,20)+d);},
 ap:function(){return AP.on;},say:say,reperch:function(){perch=null;}};
/* doors + hearth entry */
northHash();

/* ---------- AUTOPLAY: see everything (v0.4.0). Never writes your saved quest progress or sigils. ---------- */
var apb=$('#apbtn'),cap=$('#apcap'),capT=$('#aptext'),capP=$('#approg'),capS=$('#apstep'),gkv=null;
function room(id,line){return {d:2600,c:line,f:function(){if(jOpen)closeJ();go('#'+id);}};}
var STEPS=[
 {d:3400,c:'Autoplay: I\'ll walk you through everything. Click or Space to pause, Esc to stop.',f:function(){if(jOpen)closeJ();go('#hearth');}},
 room('course','Room II, the Course: ten quests, ten bricks. I\'m only looking. Your progress stays yours.'),
 room('bench','Room III, the Namer\'s Bench: every photo gets a name like A-01_r1.jpg.'),
 room('pillars','Room IV, the Three Pillars: pitch, standoff, and a MODEL-ONLY error budget.'),
 {d:3200,c:'Room V, Gate #3: exp(−2πkh), a model curve. The gate is UNMEASURED.',f:function(){go('#gate');var k=$('#k');gkv=k.value;tween(2600,function(p){k.value=(.2+1.2*Math.sin(p*Math.PI)).toFixed(2);draw();},function(){k.value=gkv;draw();});}},
 room('assay','Room VI, the Assay: where a finished course gets delivered.'),
 room('sources','The Plate Library: the real books behind 580 °C and 675 °C.'),
 {d:3600,c:'A clay tablet: repo docs open right here. This one is the README.',f:function(){openDoc('README.md',false);}},
 {d:2600,c:'Now through the glyph door: The North That Was. ↟',f:function(){closeDoc();openJ('pit');}},
 {d:4200,c:'1 · The Clay Pit. Wet clay, grains pointing every which way. I\'ll stir… chaos.',f:function(){goSt(SIX.pit,1);setTimeout(function(){demoStir(3200);},300);}},
 {d:3600,c:'A side path opens: The Tablet. Wedges pressed in clay (lore). The sigil waits for your own tap.',f:function(){reveal('tablet');goSt(SIX.tablet,1);}},
 {d:4200,c:'2 · The Kiln. Up to 1050 °C. Hot enough that every grain shivers free.',f:function(){goSt(SIX.kiln,1);bel=1;tween(3400,function(){},function(){bel=0;kT=1050;});}},
 {d:4600,c:'3 · The Cooling, scrubbed by scroll: past 675 °C the hematite settles; at 580 °C the magnetite locks the compass.',f:function(){goSt(SIX.cool,1);cG.reset(1050);setCool(1050);if(window.__scroll)window.__scroll.hint('⇣ scroll scrubs the cooling',3800);tween(3800,function(p){window.__rcJ.setCool(1050-1000*p);});}},
 {d:2800,c:'Drag the compass to the brick… locked. That is the north that was.',f:function(){demoCompass(1600);}},
 {d:2600,c:'4 · The Course. One brick: one noisy arrow.',f:function(){goSt(SIX.course,1);courseShow(false);}},
 {d:3400,c:'Lay its neighbours. The identity is the course pattern, not the single brick (if measurement earns it).',f:function(){courseShow(true);}},
 {d:5200,c:'5 · The Long Years. Seasons, then centuries. The wall weathers; the record stays (model assumption).',f:function(){goSt(SIX.years,1);yT=0;yPlay=true;}},
 {d:3400,c:'A second critter on the wall: Ash, my cousin from the chimney. Tap Ash yourself for the sigil.',f:function(){yPlay=false;reveal('wander');goSt(SIX.wander,1);}},
 {d:5200,c:'6 · The Reader. A scanner at standoff h. Lift it and the signal fades as exp(−2πkh). Gate #3: UNMEASURED.',f:function(){goSt(SIX.reader,1);rh.value=.5;tween(4400,function(p){rh.value=(.5+4.5*ease(p)).toFixed(2);});}},
 {d:3400,c:'Under the scanner: The Scroll (lore). Another sigil for your own hand.',f:function(){reveal('scroll');goSt(SIX.scroll,1);}},
 {d:4600,c:'7 · The Ask. You can help: photograph a face. That\'s where the real course begins.',f:function(){goSt(SIX.ask,1);}}];
var TOT=STEPS.reduce(function(a,s){return a+s.d;},0),apI=-1,apDue=0,apLeft=0,apTm=null,apEl=0,apLast=0,apStart=0;
function apPaint(){apb.setAttribute('aria-pressed',AP.on);apb.dataset.cue=AP.on?(AP.paused?'Autoplay · paused (tap: resume)':'Autoplay · on (tap: stop)'):'Autoplay · see everything';
  $('#jap').textContent=AP.on?'■ Stop autoplay':'▶ Autoplay';cap.hidden=!AP.on;cap.classList.toggle('paused',AP.paused);$('#appause').textContent=AP.paused?'▶':'❚❚';
  $('#appause').setAttribute('aria-label',AP.paused?'Resume autoplay':'Pause autoplay');}
function apRun(){apI++;if(apI>=STEPS.length){apStop(true);return;}var s=STEPS[apI];capT.textContent=s.c;capS.textContent=(apI+1)+' / '+STEPS.length;say(s.c,Math.min(5200,s.d));
  try{s.f();}catch(e){console.warn(e);}try{window.dispatchEvent(new CustomEvent('rc:apstep',{detail:{i:apI,c:s.c}}));}catch(e){}apLeft=s.d;apDue=Date.now()+apLeft;clearTimeout(apTm);apTm=setTimeout(apRun,apLeft);}
function apProg(){if(!AP.on)return;var now=performance.now();if(!AP.paused)apEl+=now-apLast;apLast=now;capP.style.width=Math.min(100,apEl/TOT*100).toFixed(1)+'%';requestAnimationFrame(apProg);}
function apStart_(){if(AP.on)return;AP.on=true;AP.paused=false;apI=-1;apEl=0;apLast=performance.now();apStart=Date.now();closeMenu();document.body.classList.add('autoplay');apPaint();requestAnimationFrame(apProg);apRun();window.__apStarted=apStart;}
function apStop(finished){if(!AP.on)return;AP.on=false;AP.paused=false;clearTimeout(apTm);ghost();document.body.classList.remove('autoplay');bel=0;
  if(gkv!==null){$('#k').value=gkv;draw();gkv=null;}if(/^#autoplay$/.test(location.hash))history.replaceState(null,'',location.pathname+location.search);
  window.__apDone={finished:!!finished,ms:Date.now()-apStart,step:apI};apPaint();
  say(finished?'That\'s everything. The Ask is yours: photograph a face. ⊙':'Autoplay stopped. You\'re driving now.',5000);}
function apPause(){if(!AP.on||AP.paused)return;AP.paused=true;clearTimeout(apTm);apLeft=Math.max(0,apDue-Date.now());apPaint();say('Paused. Click or Space to resume, Esc to stop.',3000);}
function apResume(){if(!AP.on||!AP.paused)return;AP.paused=false;apDue=Date.now()+apLeft;apTm=setTimeout(apRun,apLeft);apPaint();}
function apToggle(){AP.paused?apResume():apPause();}
function apSkip(){if(!AP.on)return;AP.paused=false;clearTimeout(apTm);apPaint();apRun();}
window.__rc={say:say,takeSigil:takeSigil,found:function(){return Object.keys(found).length;},closeJ:function(){if(jOpen)closeJ();},closeDoc:closeDoc,closeMenu:closeMenu,ap:function(){return AP.on;},apStop:function(){apStop();},reperch:function(){perch=null;},pluck:pluck,sparks:sparks};
window.__ap={start:apStart_,stop:apStop,state:function(){return {on:AP.on,paused:AP.paused,i:apI,n:STEPS.length,total:TOT};}};
apb.addEventListener('click',function(e){e.stopPropagation();AP.on?apStop():apStart_();});
$('#jap').addEventListener('click',function(e){e.stopPropagation();AP.on?apStop():apStart_();});
$('#appause').addEventListener('click',function(e){e.stopPropagation();apToggle();});
$('#apskip').addEventListener('click',function(e){e.stopPropagation();apSkip();});
$('#apstop').addEventListener('click',function(e){e.stopPropagation();apStop();});
addEventListener('pointerdown',function(e){if(!AP.on||e.target.closest('#apcap,#apbtn,#jap'))return;apToggle();},true);
addEventListener('keydown',function(e){if(!AP.on)return;if(e.key==='Escape'){apStop();}else if(e.key===' '||e.code==='Space'){e.preventDefault();apToggle();}else if(e.key==='ArrowRight'){apSkip();}},true);
if(location.hash==='#autoplay')setTimeout(apStart_,900);
addEventListener('hashchange',function(){if(location.hash==='#autoplay'&&!AP.on)apStart_();});
(function(){var g='',r2=0;for(var row=0;row<4;row++)for(var c=0;c<7;c++){r2=(row*7+c)*2654435761%97;if(r2%3===0)continue;var X=26+c*22,Y=30+row*26,ro=(r2%4)*45;g+='<path transform="translate('+X+' '+Y+') rotate('+ro+')" d="M-7 -4 L7 0 L-7 4 Z M-7 0 H-12"/>';}$('#wedges').innerHTML=g;})();
apPaint();

paint();
})();
