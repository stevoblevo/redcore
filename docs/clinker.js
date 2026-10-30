/* Clinker (v0.5.0): Tinder's rival. A lump of kiln clinker with an obsidian sheen and smouldering crack-eyes; a deadpan trickster.
   RULES (enforced by construction):
   - Clinker may bluff ONLY about playful lore/game choices: which book branch hides marginalia, whether a journey side path exists.
   - Every line about real science, specs, filenames or submitting comes from TRUE[] and is shown flagged "✓ true". The six rooms
     (hearth, course, bench, pillars, gate, assay, sources) are fact rooms: Clinker never makes a claim there, only TRUE lines.
   - Tinder never lies; sometimes it is wrong by enthusiasm (an honest mistake, not bluffable).
   - Trust per pet (0..100, start 50) saved in localStorage 'redcore.trust'; follow advice -> +10 if right, -10 if wrong.
   - Call the bluff (⚑ in Clinker's bubble, or tap Clinker while a claim is live): a caught lie = sigil 11 + Clinker trust -5;
     calling an honest claim = Clinker trust +5. Autoplay / read-to-me show one bluff called as a demo and change nothing saved. */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);};
function RM(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
var RC=function(){return window.__rc||{say:function(){},takeSigil:function(){}};};
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
var FACT_ROOMS=['hearth','course','bench','pillars','gate','assay','sources'];
var TRUE=['Gate #3 is unmeasured. I don\'t joke about the gate.','Filenames: {lot}-{nn}_r{rep}.jpg. Even I won\'t mess with that.','Three pillars, three numbers. Never merge them. That\'s not a bit.','The v4 figures are MODEL ONLY. Deadpan, but true.','Submit as a GitHub data-submission issue. Straight answer.','Not a PUF. No security claims. I checked.','Magnetite ≈580 °C, hematite ≈675 °C. Look it up in the Plate Library.'];
var LOG=[];var cur=null,demo=false,forced=null,where={room:'hearth',book:null,station:null};
var trust=ld('redcore.trust',{tinder:50,clinker:50});
function inDemo(){return demo||(window.__book&&window.__book.rt&&window.__book.rt.state().on)||(window.__ap&&window.__ap.state().on);}
function setTrust(p,d){if(inDemo())return;trust[p]=Math.max(0,Math.min(100,trust[p]+d));sv('redcore.trust',trust);tpaint();}

/* ---------- DOM ---------- */
var el=document.createElement('div');el.className='clinker';el.id='clinker';el.setAttribute('role','button');el.setAttribute('aria-label','Clinker, the rival. Tap to call the bluff when he makes a claim.');el.tabIndex=0;
el.innerHTML='<svg viewBox="0 0 80 80" aria-hidden="true"><defs><linearGradient id="obs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4658"/><stop offset=".35" stop-color="#16141c"/><stop offset=".7" stop-color="#0a090d"/><stop offset="1" stop-color="#2b2735"/></linearGradient></defs>'+
 '<path class="lump" d="M18 58 L12 40 L22 22 L38 14 L56 18 L68 34 L66 54 L52 66 L30 66Z" fill="url(#obs)"/>'+
 '<path class="sheen" d="M24 26 L36 19 L44 20" fill="none"/><path class="crack" d="M44 66 L46 56 L41 50 L47 44"/>'+
 '<g class="ceyes"><path d="M27 39 L33 37 L37 40"/><path d="M45 40 L49 37 L55 39"/></g><path class="cmouth" d="M34 52 H46"/></svg>';
document.body.appendChild(el);
var bub=document.createElement('div');bub.className='cbub';bub.id='cbub';bub.setAttribute('role','status');bub.innerHTML='<span id="cbt"></span> <button type="button" id="cbluff" hidden>⚑ Call the bluff</button>';document.body.appendChild(bub);
var hud=$('.hud');var tm=document.createElement('span');tm.className='trust';tm.id='trust';tm.title='Trust: follow advice and see who was right';
tm.innerHTML='<span class="tt" title="Tinder trust">☉<i><b id="tr-t"></b></i></span><span class="tc" title="Clinker trust">◆<i><b id="tr-c"></b></i></span>';
var cm=document.createElement('button');cm.type='button';cm.className='cmode';cm.id='cmode';
if(hud){var ap=$('#apbtn');hud.insertBefore(tm,ap);hud.insertBefore(cm,ap);}
function tpaint(){$('#tr-t').style.width=trust.tinder+'%';$('#tr-c').style.width=trust.clinker+'%';tm.setAttribute('aria-label','Trust: Tinder '+trust.tinder+', Clinker '+trust.clinker);tm.dataset.v='T '+trust.tinder+' · C '+trust.clinker;}tpaint();
var MODES=['follow','perch','nap'],mode=ld('redcore.clinkermode',null);if(MODES.indexOf(mode)<0)mode=RM()||matchMedia('(pointer: coarse)').matches?'perch':'follow';
function mpaint(){cm.textContent={follow:'◆ follows',perch:'◆ perches',nap:'◆ naps'}[mode];cm.setAttribute('aria-label','Clinker mode: '+mode+'. Tap to change.');el.classList.toggle('nap',mode==='nap');bub.classList.toggle('nap',mode==='nap');}
cm.addEventListener('click',function(e){e.stopPropagation();mode=MODES[(MODES.indexOf(mode)+1)%3];sv('redcore.clinkermode',mode);mpaint();if(mode!=='nap')csay({follow:'Fine. I\'ll tag along.',perch:'I\'ll sit. Sitting is a skill.',nap:''}[mode],2000);});mpaint();

/* ---------- speech ---------- */
var bt=null;
function csay(t,ms,claim){if(mode==='nap'&&!claim)return;$('#cbt').textContent=t;$('#cbluff').hidden=!claim;bub.classList.add('on');clearTimeout(bt);bt=setTimeout(function(){bub.classList.remove('on');$('#cbluff').hidden=true;},ms||4200);}
function tsay(t,ms){RC().say(t,ms||3600);}
function truth(){var t=TRUE[(Math.random()*TRUE.length)|0];LOG.push({room:where.room,ctx:'fact',lie:false,text:t});csay('✓ true · '+t,4200);}

/* ---------- claims (lore/game only) ---------- */
function claim(c){/* c: {ctx, key, lie, text, pick} */
 if(FACT_ROOMS.indexOf(c.ctx)>=0){c.lie=false;} /* guard: no lie can fire in a fact room */
 cur=c;cur.t=Date.now();cur.called=false;LOG.push({room:where.book?'book':(where.station?'north':where.room),ctx:c.ctx,key:c.key,lie:c.lie,text:c.text,demo:inDemo()});
 csay(c.text,11000,true);}
function rollLie(){if(forced!==null){var f=forced;forced=null;return f;}return Math.random()<.45;}
function callBluff(auto){if(!cur||cur.called||Date.now()-cur.t>12000){csay('Call what? I haven\'t said anything. Yet.',2400);return;}cur.called=true;$('#cbluff').hidden=true;
 var d=inDemo()||auto;
 if(cur.lie){csay(d?'…fine. That was a bluff. (demo: nothing saved)':'…fine. Bluff. You got me.',4200);setTimeout(function(){tsay(d?'Caught him! That\'s how you call a bluff. Your sigils stay yours.':'HA! Caught him! Told you to watch the crack-eyes.',4200);},700);
  if(!d){setTrust('clinker',-5);RC().takeSigil(11,'⚑ The bluff sigil: you caught Clinker lying (about lore, never about science).',el);}}
 else{csay('Wrong. That one was true. Trust me a little more now.',3800);if(!d)setTrust('clinker',5);setTimeout(function(){tsay('He was honest?! …Huh.',2600);},700);}
 LOG.push({ctx:cur.ctx,key:cur.key,called:true,wasLie:cur.lie,demo:d});}
$('#cbluff').addEventListener('click',function(e){e.stopPropagation();callBluff();});
var drag=false;el.addEventListener('click',function(e){e.stopPropagation();if(cur&&!cur.called&&Date.now()-cur.t<12000)callBluff();else quip();});
el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});
var QUIPS=['I\'m clinker. What the kiln couldn\'t finish.','Tinder glows. I smoulder. Different brand.','Ask me something. I may even tell the truth.'];
function quip(){if(where.book||where.station)csay(QUIPS[(Math.random()*3)|0],2600);else truth();}

/* ---------- advice at the book's branch pages ---------- */
var BR={town:{opts:['river','hill'],secret:'hill',name:{river:'the river bend',hill:'the red hill'}},kiln:{opts:['still','storm'],secret:'storm',name:{still:'the still night',storm:'the storm night'}}};
var adv=null;
function advise(page){var b=BR[page];if(!b)return;var other=function(x){return b.opts[0]===x?b.opts[1]:b.opts[0];};
 var tWrong=Math.random()<.25,tPick=tWrong?other(b.secret):b.secret,lie=rollLie(),cPick=lie?other(b.secret):b.secret;
 adv={page:page,tinder:tPick,clinker:cPick,tWrong:tWrong,cLie:lie};
 setTimeout(function(){tsay((tWrong?'Ooh, ooh! I\'m SURE the marginalia is on ':'I think there\'s marginalia on ')+b.name[tPick]+' path!',4200);},500);
 setTimeout(function(){claim({ctx:'book',key:page,lie:lie,pick:cPick,text:(cPick===tPick?'Tinder\'s right, for once. ':'Tinder\'s guessing. ')+'The secret\'s on '+b.name[cPick]+'. Trust me.'});},1700);
 if(cPick!==tPick)setTimeout(function(){tsay('Don\'t listen to the lump! '+b.name[tPick]+'!',3000);},3600);}
function judge(page){if(!adv)return;var A=adv,b=BR[A.page];if(!b||b.opts.indexOf(page)<0){adv=null;return;}var has=page===b.secret,msgs=[];
 ['tinder','clinker'].forEach(function(p){if(A[p]===page){setTrust(p,has?10:-10);msgs.push(p);}});
 if(msgs.length){var who=msgs.indexOf('clinker')>=0&&msgs.indexOf('tinder')<0?'clinker':msgs.indexOf('tinder')>=0&&msgs.indexOf('clinker')<0?'tinder':'both';
  setTimeout(function(){if(has){if(who==='clinker')csay('See? Honest smoulder. Look in the margin.',3200);else if(who==='tinder')tsay('Told you! Check the margin! ✶',3200);else tsay('We agreed AND we were right. Look in the margin.',3200);}
   else{if(who==='clinker')csay(A.cLie?'Heh. Nothing here. Should\'ve called it.':'Huh. I was wrong. Rare.',3200);else if(who==='tinder')tsay('Oh no, I got excited. Sorry! Honest mistake.',3200);else csay('We were both wrong. Now that\'s teamwork.',3200);}},900);}
 adv=null;}
window.addEventListener('rc:bookpage',function(e){var d=e.detail;where.book=d.page;where.station=null;if(d.rt)return;judge(d.page);if(BR[d.page])advise(d.page);});
window.addEventListener('rc:bookopen',function(){where.book='cover';});
window.addEventListener('rc:bookclose',function(){where.book=null;});
/* journey stations: lore claims about side paths */
var JC={pit:['Stir the pit. Something\'s under it.','Don\'t bother stirring. Nothing under the pit.'],years:['Watch the years. Someone shows up on the wall.','The wall stays empty. Skip ahead.'],reader:['Lift the scanner. Something\'s tucked under it.','Nothing under the scanner. Promise.']};
window.addEventListener('rc:station',function(e){var id=e.detail;where.station=id;where.book=null;if(window.__ap&&window.__ap.state().on)return;if(JC[id]&&Math.random()<.7){var lie=rollLie();claim({ctx:'north',key:id,lie:lie,text:JC[id][lie?1:0]});}});
window.addEventListener('rc:northclose',function(){where.station=null;});
var argued={};
window.addEventListener('rc:room',function(e){var id=e.detail;where.room=id;if(where.book||where.station)return;if(inDemo())return;
 if(!argued[id]&&Math.random()<.5){argued[id]=1;setTimeout(function(){truth();setTimeout(function(){tsay(['I knew that first!','I was going to say that!','Show-off.'][(Math.random()*3)|0],2200);},1400);},2600);}});
/* demo bluff: read-to-me (book) and autoplay (journey) each show one bluff called. Nothing saved. */
window.addEventListener('rc:rtstep',function(e){if(e.detail.page!=='town')return;demo=true;setTimeout(function(){tsay('Marginalia on the red hill path, I think!',3200);},300);
 setTimeout(function(){claim({ctx:'book',key:'demo',lie:true,text:'Nah. It\'s on the river bend. Trust me.'});},1200);
 setTimeout(function(){ghostTap();callBluff(true);demo=false;},3200);});
window.addEventListener('rc:apstep',function(e){if(!/Clay Pit/.test(e.detail.c))return;demo=true;
 setTimeout(function(){claim({ctx:'north',key:'demo',lie:true,text:'Don\'t bother stirring. Nothing under the pit.'});},800);setTimeout(function(){ghostTap();callBluff(true);demo=false;},3000);});
function ghostTap(){el.classList.add('called');setTimeout(function(){el.classList.remove('called');},900);}

/* ---------- movement ---------- */
var X=40,Y=innerHeight-200,VX=0,VY=0,mx=innerWidth/2,my=innerHeight/2,last=0;
addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;last=Date.now();},{passive:true});
function spot(){if(window.__book&&window.__book.open){var l=$('.bk-left');var r=l?l.getBoundingClientRect():null;return r?[Math.max(6,r.left+8),Math.min(innerHeight-150,r.bottom-70)]:[20,innerHeight-160];}
 if(document.body.classList.contains('jopen'))return [16,Math.max(70,innerHeight*.3)];return [innerWidth<760?10:70,innerHeight-(innerWidth<760?200:170)];}
(function tick(){if(mode!=='nap'){var tx,ty,rm=RM();if(mode==='perch'||Date.now()-last>2500||matchMedia('(pointer: coarse)').matches){var s=spot();tx=s[0];ty=s[1];}else{tx=mx-90;ty=my+26;}
  if(rm||mode==='perch'&&Math.abs(tx-X)+Math.abs(ty-Y)<1){X=rm?tx:X+(tx-X)*.08;Y=rm?ty:Y+(ty-Y)*.08;}else{VX+=(tx-X)*.01;VY+=(ty-Y)*.01;VX*=.84;VY*=.84;X+=VX;Y+=VY;}
  X=Math.max(4,Math.min(innerWidth-50,X));Y=Math.max(56,Math.min(innerHeight-110,Y));}
 el.style.transform='translate('+X.toFixed(1)+'px,'+Y.toFixed(1)+'px)';bub.style.transform='translate('+Math.max(6,Math.min(X+10,innerWidth-262))+'px,'+(Y>innerHeight*.5?Math.max(56,Y-(bub.offsetHeight||60)-8):Y+52)+'px)';requestAnimationFrame(tick);})();
window.__clinker={log:LOG,trust:function(){return JSON.parse(JSON.stringify(trust));},force:function(l){forced=!!l;},call:function(){callBluff();},cur:function(){return cur&&{lie:cur.lie,ctx:cur.ctx,key:cur.key,called:cur.called};},mode:function(){return mode;},FACT_ROOMS:FACT_ROOMS};
})();
