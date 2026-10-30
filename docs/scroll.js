/* Redcore v0.6.0: scroll nav + scroll mechanics. Wheel (both axes), trackpad, touch swipes and keys, everywhere.
   Mode 'redcore.scroll' = 'guided' (default: room snaps, station snaps, scrubs) | 'free' (plain native scroll, no snapping).
   Never traps: the md reader, text panels and anything else that can scroll natively in that direction keep the wheel. */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));};
function RM(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
var mode=(function(){try{return JSON.parse(localStorage.getItem('redcore.scroll'))||'guided';}catch(e){return 'guided';}})();if(mode!=='free')mode='guided';
function guided(){return mode==='guided';}
var J=function(){return window.__rcJ;},BK=function(){return window.__book||{};};
function readerOpen(){var r=$('#reader');return r&&!r.hidden;}
function journeyOpen(){return J()&&J().open();}
function bookOpen(){return BK().open;}
function typing(e){return /INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||'')||(e.target&&e.target.isContentEditable);}
/* can an ancestor of el (inside stop) scroll natively along axis in dir? */
function nativeScroll(el,axis,dir,stop){for(;el&&el!==stop&&el!==document.body&&el!==document.documentElement;el=el.parentElement){var cs=getComputedStyle(el),ov=axis==='y'?cs.overflowY:cs.overflowX;
  if(/auto|scroll/.test(ov)){if(axis==='y'){if(dir>0?el.scrollTop+el.clientHeight<el.scrollHeight-1:el.scrollTop>0)return true;}else{if(dir>0?el.scrollLeft+el.clientWidth<el.scrollWidth-1:el.scrollLeft>0)return true;}}}return false;}

/* ---------- settings toggle + hint chip ---------- */
var hud=$('.hud'),tg=document.createElement('button');tg.type='button';tg.id='scrollmode';tg.className='scrollmode';
function tpaint(){tg.textContent=mode==='guided'?'⇳ guided':'⇳ free';tg.setAttribute('aria-label','Scroll: '+mode+'. Tap to switch to '+(mode==='guided'?'free':'guided')+'.');tg.setAttribute('aria-pressed',mode==='guided');document.documentElement.classList.toggle('scroll-free',mode==='free');}
tg.addEventListener('click',function(e){e.stopPropagation();mode=mode==='guided'?'free':'guided';try{localStorage.setItem('redcore.scroll',JSON.stringify(mode));}catch(x){}tpaint();hint(mode==='guided'?'Scroll: guided · snaps room to room':'Scroll: free · plain native scroll, no snapping',2200);});
if(hud)hud.insertBefore(tg,$('#apbtn'));tpaint();
var hc=document.createElement('div');hc.className='scrollhint';hc.id='scrollhint';document.body.appendChild(hc);var ht=null;
function hint(t,ms){hc.textContent=t;hc.classList.add('on');clearTimeout(ht);ht=setTimeout(function(){hc.classList.remove('on');},ms||1800);}

/* ---------- rooms: snap room to room ---------- */
var ROOMS=[['hearth','☉','Hearth'],['course','▦','Course'],['bench','✎','Bench'],['pillars','Ⅲ','Pillars'],['gate','⌇','Gate #3'],['assay','⚖','Assay'],['sources','❧','Plate Library']].filter(function(r){return document.getElementById(r[0]);});
function rel(id){return document.getElementById(id);}
function curRoomI(){var c=innerHeight*.5,best=0;ROOMS.forEach(function(r,i){var b=rel(r[0]).getBoundingClientRect();if(b.top<=c)best=i;});return best;}
var anim=null;
function scrollToY(y,done){y=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,y));var y0=scrollY;if(anim)cancelAnimationFrame(anim.raf);
 if(RM()||Math.abs(y-y0)<2){window.scrollTo({top:y,behavior:'instant'});anim=null;if(done)done();return;}
 var t0=performance.now(),D=Math.min(900,420+Math.abs(y-y0)*.25);anim={};
 (function f(n){var p=Math.min(1,(n-t0)/D),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;window.scrollTo({top:y0+(y-y0)*e,behavior:'instant'});if(p<1)anim.raf=requestAnimationFrame(f);else{anim=null;if(done)done();}})(t0);}
function roomTop(i){return rel(ROOMS[i][0]).getBoundingClientRect().top+scrollY;}
function goRoom(i,dir){i=Math.max(0,Math.min(ROOMS.length-1,i));var el=rel(ROOMS[i][0]),top=roomTop(i),y=top;
 if(dir<0&&el.offsetHeight>innerHeight+4)y=top+el.offsetHeight-innerHeight; /* coming up into a tall room: land on its foot */
 hop();scrollToY(y);window.__lastSnap={room:ROOMS[i][0],at:Date.now()};}
function stepRoom(dir){var i=curRoomI(),el=rel(ROOMS[i][0]),b=el.getBoundingClientRect();
 /* inside a tall room, first page through it natively-ish */
 if(dir>0&&b.bottom>innerHeight+4){scrollToY(scrollY+Math.min(b.bottom-innerHeight,innerHeight*.85));return;}
 if(dir<0&&b.top<-4){scrollToY(scrollY-Math.min(-b.top,innerHeight*.85));return;}
 if((dir>0&&i===ROOMS.length-1)||(dir<0&&i===0)){var y=dir>0?document.documentElement.scrollHeight:0;scrollToY(y);return;}
 goRoom(i+dir,dir);}
function hop(){['pet','clinker'].forEach(function(id){var e=document.getElementById(id);if(!e||RM())return;e.classList.remove('hop');void e.offsetWidth;e.classList.add('hop');});if(window.__rc&&window.__rc.reperch)window.__rc.reperch();}
var wAcc=0,wLock=0,wLast=0,trackpadT=0;
function onRoomWheel(e){var dx=e.deltaX,dy=e.deltaY;if(Math.abs(dx)>0.5)trackpadT=Date.now();var ax=Math.abs(dx)>Math.abs(dy)?'x':'y',d=ax==='x'?dx:dy,dir=d>0?1:-1;
 if(nativeScroll(e.target,ax,dir,document.body))return; /* a text panel can scroll: let it */
 if(!guided())return; /* free: plain native page scroll */
 if(ax==='y'){var i=curRoomI(),b=rel(ROOMS[i][0]).getBoundingClientRect();if((dir>0&&b.bottom>innerHeight+4)||(dir<0&&b.top<-4)){if(!anim)return;}} /* inside a tall room: native */
 e.preventDefault();var now=Date.now();if(now-wLast>220)wAcc=0;wLast=now;if(anim||now<wLock)return;wAcc+=d;
 if(Math.abs(wAcc)>=40){wAcc=0;wLock=now+(RM()?150:650);stepRoom(dir);}}
/* ---------- minimap: slim field line with glyph nodes ---------- */
var mm=document.createElement('nav');mm.className='minimap';mm.id='minimap';mm.setAttribute('aria-label','Where you are: rooms');
mm.innerHTML='<svg class="mml" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true"><path d="M5 0 C2 20 8 30 5 50 S2 80 5 100"/></svg><i class="mmk" id="mmk"></i>'+ROOMS.map(function(r,i){return '<button type="button" data-i="'+i+'" style="top:'+(4+i/(ROOMS.length-1)*92)+'%" aria-label="'+r[2]+'"><b>'+r[1]+'</b><span>'+r[2]+'</span></button>';}).join('');
document.body.appendChild(mm);
mm.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var i=+b.dataset.i;if(guided())goRoom(i,1);else rel(ROOMS[i][0]).scrollIntoView();});
function mmPaint(){if(journeyOpen()||bookOpen()){mm.classList.add('off');return;}mm.classList.remove('off');var H=document.documentElement.scrollHeight-innerHeight,f=H>0?scrollY/H:0;$('#mmk').style.top=(4+f*92)+'%';var i=curRoomI();$$('button',mm).forEach(function(b,k){b.classList.toggle('here',k===i);});}
addEventListener('scroll',mmPaint,{passive:true});addEventListener('resize',mmPaint);setInterval(mmPaint,500);mmPaint();
/* journey minimap: a live marker on the existing glyph track */
var jmk=document.createElement('i');jmk.className='jmk';jmk.id='jmk';var jt=$('#jtrack');if(jt)jt.appendChild(jmk);
function jmPaint(){if(!journeyOpen())return;var c=J().cam();jmk.style.left=(4+c[0]/6*92)+'%';jmk.style.top=(50+c[1]*32)+'%';}

/* ---------- journey: true horizontal scroll ---------- */
var SCRUB={
 cool:{get:function(){return J().cool();},set:function(v){J().setCool(v);},min:20,max:1050,per:-0.9,lab:function(v){return Math.round(v)+' °C';}},
 years:{get:function(){return J().years()[0];},set:function(v){J().setYears(v);},min:0,max:16,per:0.012,lab:function(v){return 'year '+Math.round(v*25);}},
 reader:{get:function(){return J().h()[0];},set:function(v){J().setH(v);},min:.25,max:5,per:0.004,lab:function(v){return 'h = '+v.toFixed(2)+' mm';}}};
function stId(){return J().ST[J().cur()].id;}
function onMain(){return J().ST[J().cur()].y===0;}
var g={acc:0,last:0,edge:false,travel:false,idle:null,v:0};
function travel(dxPx){var c=J().cam(),x=c[0]+dxPx/innerWidth*1.1;x=Math.max(-.15,Math.min(6.15,x));J().setCam(x,0);g.travel=true;jmPaint();clearTimeout(g.idle);g.idle=setTimeout(settle,RM()?60:180);}
function nearest(x){var ST=J().ST,rv=J().revealed(),bi=0,bd=1e9;ST.forEach(function(s,i){if(s.y!==0)return;var d=Math.abs(s.x-x);if(d<bd){bd=d;bi=i;}});return bi;}
function settle(){g.travel=false;if(!journeyOpen())return;var x=J().cam()[0],i=nearest(x);if(guided()){var same=i===J().cur();J().goSt(i,same);if(RM())J().setCam(J().ST[i].x,0);}else if(i!==J().cur()){/* free: no snap, but know where we are */J().goSt(i,true);J().setCam(x,0);}window.__lastStation={id:J().ST[i].id,at:Date.now()};}
function sidePath(dir){/* dir -1 = up, +1 = down */var ST=J().ST,s=ST[J().cur()],rv=J().revealed();
 if(s.y!==0){if((s.y<0&&dir>0)||(s.y>0&&dir<0)){J().goSt(nearest(s.x));return true;}return false;}
 var best=-1;ST.forEach(function(b,i){if(b.br&&Math.abs(b.x-s.x)<=.5&&Math.sign(b.y)===dir)best=i;});
 if(best<0)return false;if(!rv[ST[best].id]){J().say('A side path is sealed here. Play the station to unseal it.',2600);return true;}J().goSt(best);hint(dir<0?'⇡ side path':'⇣ side path');return true;}
function scrub(id,dy){var S=SCRUB[id];if(!S)return false;var v=S.get(),nv=Math.max(S.min,Math.min(S.max,v+dy*S.per));if(nv===v)return false;S.set(nv);hint('scroll-scrub · '+S.lab(nv),900);window.__scrub={id:id,v:nv};return true;}
var kv={t:0,sum:0};
function kilnFlick(dy){var now=performance.now(),dt=Math.max(8,now-kv.t);kv.t=now;var v=Math.abs(dy)/dt*16;/* px per frame */
 if(v>=40||Math.abs(dy)>=90){J().stoke(Math.min(160,Math.abs(dy)*.9));hint('a fast flick stokes the kiln · '+Math.round(J().kiln())+' °C',900);window.__stoke={t:J().kiln()};return true;}return false;}
function onJourneyWheel(e){var Jel=$('#north');var dx=e.deltaX,dy=e.deltaY;if(e.deltaMode===1){dx*=16;dy*=16;}if(Math.abs(dx)>0.5)trackpadT=Date.now();
 var ax=Math.abs(dx)>Math.abs(dy)?'x':'y',d=ax==='x'?dx:dy;if(nativeScroll(e.target,ax,d>0?1:-1,Jel))return;e.preventDefault();
 if(J().ap())return;var now=Date.now(),newG=now-g.last>200;g.last=now;if(newG)g.edge=false;
 if(ax==='x'){travel(dx);return;}
 var id=stId(),pad=now-trackpadT<1200;
 if(onMain()&&!g.travel){if(id==='kiln'&&kilnFlick(dy))return;if(SCRUB[id]){if(scrub(id,dy)){g.edge=true;return;}if(g.edge)return;}}
 if(pad&&!g.travel){/* trackpad: vertical flick = side path */if(Math.abs(dy)>30&&newG)sidePath(dy>0?1:-1);return;}
 if(!onMain()){if(newG&&!sidePath(dy>0?1:-1))travel(dy);else if(!newG)return;return;}
 travel(dy);} /* mouse wheel: vertical maps to horizontal travel */
/* ---------- touch swipes ---------- */
var T=null;
function tStart(e){if(e.touches.length!==1){T=null;return;}var t=e.touches[0];T={x:t.clientX,y:t.clientY,lx:t.clientX,ly:t.clientY,t:Date.now(),ax:null,el:e.target};}
function tMove(e){if(!T)return;var t=e.touches[0],dx=t.clientX-T.x,dy=t.clientY-T.y;if(!T.ax&&Math.hypot(dx,dy)>10)T.ax=Math.abs(dx)>Math.abs(dy)?'x':'y';
 if(journeyOpen()&&T.ax&&!T.el.closest('canvas.jc,input,#jcomp,button')){var ndir=T.ax==='x'?(T.lx-t.clientX>0?1:-1):(T.ly-t.clientY>0?1:-1);
  if(nativeScroll(T.el,T.ax,ndir,$('#north')))T.nat=true;else{if(e.cancelable)e.preventDefault();if(T.ax==='x')travel(T.lx-t.clientX);else{var id=stId();if(onMain()&&SCRUB[id])scrub(id,(T.ly-t.clientY)*1.6);}}}
 T.lx=t.clientX;T.ly=t.clientY;}
function tEnd(){if(!T)return;var dx=T.lx-T.x,dy=T.ly-T.y,dt=Date.now()-T.t,tt=T;T=null;if(!tt.ax)return;var fast=dt<450;
 if(journeyOpen()){if(tt.nat||tt.el.closest('canvas.jc,input,#jcomp,button'))return;if(tt.ax==='y'&&fast&&Math.abs(dy)>50){var id=stId();if(id==='kiln'&&onMain()){J().stoke(Math.min(220,Math.abs(dy)*1.2));hint('a fast flick stokes the kiln · '+Math.round(J().kiln())+' °C',900);window.__stoke={t:J().kiln()};return;}
   if(!(onMain()&&SCRUB[id]&&!atEdge(id,-dy)))sidePath(dy<0?-1:1);}return;}
 if(bookOpen()){if(tt.ax==='x'&&Math.abs(dx)>60)return;/* the curl handles it */return;}
 if(readerOpen())return;
 if(tt.ax==='x'&&Math.abs(dx)>60&&!nativeScroll(tt.el,'x',dx<0?1:-1,document.body)){if(guided())goRoom(curRoomI()+(dx<0?1:-1),dx<0?1:-1);else{var i=curRoomI()+(dx<0?1:-1);if(ROOMS[i])rel(ROOMS[i][0]).scrollIntoView();}return;}
 if(tt.ax==='y'&&guided()&&Math.abs(dy)>40&&!nativeScroll(tt.el,'y',dy<0?1:-1,document.body))setTimeout(function(){touchSettle(dy<0?1:-1);},RM()?0:140);}
function atEdge(id,d){var S=SCRUB[id],v=S.get(),dir=d*S.per>0?1:-1;return dir>0?v>=S.max:v<=S.min;}
function touchSettle(dir){/* after a native touch scroll, settle onto a room edge in the swipe direction */var i=curRoomI(),el=rel(ROOMS[i][0]),b=el.getBoundingClientRect();
 var nx=ROOMS[i+1]&&rel(ROOMS[i+1][0]).getBoundingClientRect();
 if(dir>0&&nx&&nx.top>0&&nx.top<innerHeight){if(b.bottom<innerHeight*.9||nx.top<innerHeight*.6)goRoom(i+1,1);}
 else if(dir<0&&b.top>0&&b.top<innerHeight&&ROOMS[i-1]){goRoom(i-1,-1);}else if(dir<0&&b.top>0&&b.top<innerHeight*.5){goRoom(i,1);}}
addEventListener('touchstart',tStart,{passive:true});addEventListener('touchmove',tMove,{passive:false});addEventListener('touchend',tEnd,{passive:true});
/* ---------- book: horizontal wheel/trackpad turns pages (vertical stays native text scroll) ---------- */
var b={acc:0,last:0,lock:0};
function onBookWheel(e){var dx=e.deltaX,dy=e.deltaY;if(Math.abs(dx)<=Math.abs(dy))return;/* vertical: native */if(nativeScroll(e.target,'x',dx>0?1:-1,$('#book')))return;e.preventDefault();
 if(!guided())return;var now=Date.now();if(now-b.last>240)b.acc=0;b.last=now;if(now<b.lock)return;b.acc+=dx;
 if(Math.abs(b.acc)>=70){var dir=b.acc>0?1:-1;b.acc=0;b.lock=now+(RM()?200:900);var ok=dir>0?BK().next():BK().back();window.__bookWheel={dir:dir,ok:ok};}}
/* ---------- one wheel router ---------- */
addEventListener('wheel',function(e){if(e.ctrlKey)return;/* pinch zoom */if(readerOpen())return;/* the md reader scrolls natively */
 if(bookOpen())return onBookWheel(e);if(journeyOpen())return onJourneyWheel(e);onRoomWheel(e);},{passive:false});
/* ---------- keys ---------- */
addEventListener('keydown',function(e){if(typing(e)||readerOpen()||bookOpen()||e.altKey||e.ctrlKey||e.metaKey)return;if(window.__ap&&window.__ap.state().on)return;
 var k=e.key;
 if(journeyOpen()){if(k==='ArrowUp'||k==='ArrowDown'){var id=stId(),d=k==='ArrowDown'?1:-1;if(onMain()&&SCRUB[id]&&scrub(id,d*120)){e.preventDefault();return;}if(onMain()&&id==='kiln'&&d<0){J().stoke(120);hint('stoked · '+Math.round(J().kiln())+' °C',800);e.preventDefault();return;}if(sidePath(d))e.preventDefault();}
  else if(k==='PageDown'){e.preventDefault();J().nextMain(1);}else if(k==='PageUp'){e.preventDefault();J().nextMain(-1);}return;} /* ←/→ already step stations */
 if(!guided())return;
 if(k==='ArrowDown'||k==='PageDown'||k==='ArrowRight'){e.preventDefault();stepRoom(1);}else if(k==='ArrowUp'||k==='PageUp'||k==='ArrowLeft'){e.preventDefault();stepRoom(-1);}
 else if(k==='Home'){e.preventDefault();goRoom(0,1);}else if(k==='End'){e.preventDefault();goRoom(ROOMS.length-1,1);}});
(function f(){jmPaint();requestAnimationFrame(f);})();
window.__scroll={mode:function(){return mode;},hint:hint,goRoom:goRoom,room:function(){return ROOMS[curRoomI()][0];}};
})();
