/* The Brickmaker's Book (v0.5.0): a choose-your-path storybook inside the obsidian hearth.
   Credits (both toolkits by stevoblevo, same author as this repo):
   - Storeybrook (github.com/stevoblevo/storeybrook): the SVG filters #sb-deckle / #sb-bleed / #sb-ink are copied
     from project/components/bundle.js ensureDefs(); the page-turn leaf follows spread() (rotateY over dur-turn
     700ms, ease-paper, swap at half); washes, paper grain/fibre, lore/real tags from 01-paper.md and 03-color.md;
     reduced motion is checked at run time (06-motion.md).
   - Depthfield (github.com/stevoblevo/depthfield): three planes, never more; pointer travel 18/36/64px, sink
     60/130/220px over the scroll, follow 0.05 per frame, tilt gain 2.2 from devicemotion gravity in screen space
     (components/bundle.js D.tilt, simplified); depth-of-field pull far->near on chapter change; text never parallaxes.
   Saved state: localStorage 'redcore.book' {page, path, read}. Read-to-me never writes it. */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));};
function RMq(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
var RC=function(){return window.__rc||{say:function(){},takeSigil:function(){}};};
var KEY='redcore.book';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||null;}catch(e){return null;}}
var S=load()||{page:null,path:[],read:{}};if(!S.read)S.read={};if(!S.path)S.path=[];
function persist(){if(RT.on)return;try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

/* ---------- shared SVG filters (copied from Storeybrook ensureDefs) ---------- */
(function(){if(document.getElementById('sb-defs'))return;var NS='http://www.w3.org/2000/svg',s=document.createElementNS(NS,'svg');
 s.setAttribute('id','sb-defs');s.setAttribute('width','0');s.setAttribute('height','0');s.setAttribute('aria-hidden','true');s.style.position='absolute';
 s.innerHTML='<filter id="sb-deckle" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>'+
 '<filter id="sb-bleed" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" result="dd"/><feGaussianBlur in="dd" stdDeviation="0.9"/></filter>'+
 '<filter id="sb-ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter>';
 document.body.insertBefore(s,document.body.firstChild);})();

/* ---------- painting helpers: watercolor wash + ink line ---------- */
var C={sky:'#c8e3f4',meadow:'#cfe3b8',rose:'#f3c6d3',sun:'#f7dc97',brook:'#8cc2e6',clay:'#e7a983',brick:'#c9643f',night:'#9fb2d6',ink:'#2f3b48',shade:'#c7d3cf'};
function W(d,c,o){return '<path class="bk-wash" d="'+d+'" fill="'+c+'"'+(o?' opacity="'+o+'"':'')+'/>';}
function I(d,w){return '<path class="bk-ink" d="'+d+'"'+(w?' stroke-width="'+w+'"':'')+'/>';}
function blob(cx,cy,rx,ry,c,o){return '<ellipse class="bk-wash" cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'"'+(o?' opacity="'+o+'"':'')+'/>';}
function svg(inner){return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+inner+'</svg>';}
function ridge(y,a,seed){var d='M-20 '+y,x;for(x=-20;x<=420;x+=20)d+=' L'+x+' '+(y-Math.abs(Math.sin((x+seed)*.021)*a)-Math.sin((x+seed*3)*.07)*a*.25).toFixed(1);return d;}
function hill(y,a,seed,c){var r=ridge(y,a,seed);return W(r+' L420 320 L-20 320Z',c)+I(r);}
function houses(y,n,x0){var g='',i,x;for(i=0;i<n;i++){x=x0+i*38;var h=26+(i*13%17);g+=W('M'+x+' '+y+' v-'+h+' l15 -14 l15 14 v'+h+'Z',i%2?C.rose:C.clay,.8)+I('M'+x+' '+y+' v-'+h+' l15 -14 l15 14 v'+h+' M'+(x+11)+' '+(y-10)+' h7');}return g;}
function bricks(x,y,cols,rows,c){var g='',r,k;for(r=0;r<rows;r++)for(k=0;k<cols;k++){var bx=x+k*22+(r%2?11:0),by=y-r*10;g+=W('M'+bx+' '+by+' h20 v-9 h-20Z',c||C.brick,.85)+I('M'+bx+' '+by+' h20 v-9 h-20Z',1.1);}return g;}
function stars(n){var g='',i;for(i=0;i<n;i++){var x=(i*97)%400,y=(i*53)%120+8;g+=I('M'+x+' '+(y-3)+' v6 M'+(x-3)+' '+y+' h6',1);}return g;}
function sunb(x,y,r,c){return blob(x,y,r*1.6,r*1.6,c||C.sun,.55)+'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fbf7ec"/>'+I('M'+(x-r)+' '+y+' a'+r+' '+r+' 0 1 0 '+(2*r)+' 0 a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0',1.2);}
function kiln(x,y){return W('M'+(x-60)+' '+y+' v-50 q60 -70 120 0 v50Z',C.clay)+I('M'+(x-60)+' '+y+' v-50 q60 -70 120 0 v50Z M'+(x-18)+' '+y+' v-26 q18 -22 36 0 v26')+blob(x,y-14,16,12,'#ff9a52',.9)+I('M'+(x+30)+' '+(y-82)+' v-40 h14 v32');}
/* scenes: [sky/back, mid, front], each a plane (Depthfield: three, never more) */
var SC={
 cover:function(){return [W('M0 0H400V300H0Z',C.sun,.4)+sunb(300,80,26),hill(220,40,3,C.clay)+houses(214,6,60),hill(270,20,9,C.meadow)+bricks(250,268,5,3)];},
 town:function(){return [W('M0 0H400V160H0Z',C.sky,.7)+sunb(320,70,22)+hill(170,30,1,C.shade),houses(220,8,30)+I('M300 170 v-50 h10 v50'),hill(262,16,5,C.meadow)+I('M40 290 q30 -30 60 0',1.2)];},
 river:function(){return [W('M0 0H400V150H0Z',C.sky,.7)+hill(160,26,7,C.meadow),W('M-10 200 Q120 170 210 210 T420 200 V250 H-10Z',C.brook)+I('M-10 200 Q120 170 210 210 T420 200'),W('M0 300 V250 Q90 228 170 258 T400 250 V300Z',C.clay)+I('M150 250 l8 -30 l6 30 M120 262 q10 -10 22 0',1.3)];},
 hill:function(){return [W('M0 0H400V170H0Z',C.rose,.5)+sunb(80,60,18),W('M60 300 L170 90 L240 120 L340 300Z',C.brick,.9)+I('M60 300 L170 90 L240 120 L340 300 M150 170 h40 M140 200 h70 M128 230 h96'),hill(275,14,4,C.meadow)+I('M250 290 l12 -40 l4 40',1.3)];},
 kiln:function(){return [W('M0 0H400V180H0Z',C.sun,.45)+hill(190,22,2,C.shade),kiln(200,240)+bricks(40,240,3,4,C.clay),hill(275,10,8,C.meadow)+bricks(300,286,3,2,C.clay)];},
 still:function(){return [W('M0 0H400V200H0Z',C.night,.85)+stars(26)+'<circle cx="320" cy="60" r="16" fill="#fbf7ec"/>'+I('M304 60 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0',1.2),kiln(190,245),hill(282,10,6,C.shade)];},
 storm:function(){var r='',i;for(i=0;i<40;i++)r+=I('M'+((i*37)%420)+' '+((i*23)%160)+' l-8 22',1);return [W('M0 0H400V210H0Z','#8f9bb0',.85)+blob(120,50,110,40,'#7d889e',.7)+blob(300,40,120,36,'#7d889e',.6),kiln(200,248)+r,hill(284,10,2,C.shade)+r];},
 cool:function(){return [W('M0 0H400V190H0Z',C.rose,.45)+sunb(70,150,24),kiln(250,240)+bricks(40,252,4,4)+I('M60 200 q4 -10 0 -20 M90 200 q4 -10 0 -20',1),hill(280,10,3,C.meadow)];},
 travel:function(){return [W('M0 0H400V170H0Z',C.sky,.7)+hill(175,24,5,C.meadow),W('M140 300 L190 170 L210 170 L300 300Z',C.sun,.7)+I('M140 300 L190 170 M300 300 L210 170')+I('M60 190 v-40 l10 -16 l10 16 v40 M330 200 q20 -40 40 0'),bricks(150,262,3,2)+I('M130 270 h90 M140 280 a10 10 0 1 0 0.1 0 M210 280 a10 10 0 1 0 0.1 0',1.4)];},
 chapel:function(){return [W('M0 0H400V180H0Z',C.sky,.6)+sunb(330,60,18),W('M150 250 V120 L190 70 L230 120 V250Z',C.clay)+I('M150 250 V120 L190 70 L230 120 V250Z M178 250 v-34 q12 -16 24 0 v34 M182 140 q8 -12 16 0 v20 h-16Z'),bricks(40,288,6,4)+bricks(250,288,6,4)];},
 bridge:function(){return [W('M0 0H400V160H0Z',C.sky,.7)+hill(165,20,6,C.meadow),W('M0 170 H400 V200 H0Z',C.brick,.8)+I('M0 170 H400 M0 200 H40 Q100 130 160 200 H240 Q300 130 360 200 H400')+W('M0 200 H400 V260 H0Z',C.brook,.8),W('M0 300 V262 Q200 246 400 264 V300Z',C.clay)+I('M120 262 v-30 h18 v30 M126 232 l-6 -10 h30 l-6 10',1.3)];},
 hearth:function(){return [W('M0 0H400V300H0Z',C.clay,.35),bricks(70,250,12,9,C.brick)+W('M150 250 v-60 q50 -40 100 0 v60Z','#3a2a20',.85)+blob(200,232,34,18,'#ff9a52',.95),hill(286,6,1,C.shade)+I('M300 280 h30 v-50 h-30Z M306 240 h18 v30 h-18Z',1.4)];},
 help:function(){return [W('M0 0H400V300H0Z',C.sun,.35)+sunb(200,90,30),bricks(60,240,13,5),W('M150 300 V190 h100 v110Z','#fbf7ec')+I('M150 300 V190 h100 v110 M170 210 h60 v60 h-60Z M200 285 a5 5 0 1 0 .1 0',1.6)];},
 map:function(){return [W('M0 0H400V300H0Z',C.meadow,.45),W('M30 260 Q120 120 200 160 T370 60',C.brook,.0)+I('M30 260 Q120 120 200 160 T370 60',1.2),I('M340 250 l10 -24 l10 24 l-10 -6Z M350 200 v60',1.2)];}
};
/* ---------- the story ---------- */
var S1='<sup><a href="#src-1">1</a>,<a href="#src-2">2</a></sup>';
var P={
 town:{n:1,t:'The brickmaker wakes',cap:'Plate i · the old town before the bells',
  lore:'In an old town of chimneys and slow bells, a brickmaker wakes before dawn. Today she fires a batch. First, she needs clay, and there are two beds she trusts.',
  fact:'Brickmark is a <b>magnetic provenance assay</b> for fired clay: batch provenance first. It is <b>not a PUF</b> and makes no security claims.',src:'docs/SAELION_REALITY_PROGRAM.md §1, §2.2',
  ch:[['river','Dig at the river bend','soft grey clay, silty and slick'],['hill','Cut from the red hill','iron-red clay, gritty and stubborn']]},
 river:{n:2,t:'The river bend',cap:'Plate ii · the clay bed at the river',
  lore:'She kneels where the river slows and lifts out clay as grey as rain. She wedges it on the bench, folding the air out, until it is smooth as a held breath.',
  fact:'Clay carries tiny iron-oxide grains, among them <b>magnetite</b> and <b>hematite</b>. Wet and stirred, they point every which way: nothing in the pit knows north.',src:'Dunlop &amp; Özdemir (1997); Butler (1992)'+S1,
  ch:[['kiln','Carry the green bricks to the kiln','']]},
 hill:{n:2,t:'The red hill',cap:'Plate ii · the cut face of the red hill',sig:[8,'☝','12%','86%','☝ The thumbprint sigil: every hand-made brick carries its maker\'s press (lore).'],
  lore:'She climbs the red hill and cuts a face of clay so iron-bright it stains her hands. She presses each brick into the mould and leaves, by habit, one thumbprint in the margin of her ledger.',
  fact:'Bricks from one clay bed and one firing form a <b>batch</b>. Telling batches apart comes first; telling one brick or one course apart only if repeatability survives measurement.',src:'docs/SAELION_REALITY_PROGRAM.md §1, WP4',
  ch:[['kiln','Carry the green bricks to the kiln','']]},
 kiln:{n:3,t:'Into the kiln',cap:'Plate iii · the kiln and its chimney',plate:'assets/kiln-plate-map.webp',
  lore:'She stacks the green bricks with gaps for the fire to breathe, seals the door with mud, and lights it. The kiln will burn all night. Which night will it be?',
  fact:'Fired hot enough, the grains\' magnetic order is shaken loose. It is on the way <em>down</em>, as the brick cools, that a record sets.',src:'Dunlop &amp; Özdemir (1997); Butler (1992)'+S1,
  ch:[['still','A still night, every star out','the kiln hums alone'],['storm','A storm night, rain on the roof','she sits up with the fire']]},
 still:{n:4,t:'A still night',cap:'Plate iv · stars over the kiln',
  lore:'No wind. The stars come out one by one and the kiln glows like a small sun. Toward morning she lets the fire die and the long cooling begins.',
  fact:'As it cools, <b>hematite</b> settles below its Néel temperature, <b>≈675&nbsp;°C</b>.',src:'Dunlop &amp; Özdemir (1997); Butler (1992)'+S1,
  ch:[['cool','Wait for the cooling','']]},
 storm:{n:4,t:'A storm night',cap:'Plate iv · rain on the kiln roof',sig:[9,'⚘','64%','6%','⚘ The moth sigil: drawn to the kiln\'s glow, it settled in the margin instead (lore).'],
  lore:'Rain hisses on the kiln roof all night. A moth comes in out of the weather and sits by her lamp. (The story makes no claim that the storm changed the bricks.)',
  fact:'Below its Curie temperature, <b>≈580&nbsp;°C</b>, <b>magnetite</b> locks.',src:'Dunlop &amp; Özdemir (1997); Butler (1992)'+S1,
  ch:[['cool','Wait for the cooling','']]},
 cool:{n:5,t:'The cooling',cap:'Plate v · the bricks, ticking as they cool',
  lore:'At dawn she opens the door. The bricks tick softly as they cool, and in each one, too small to see, something has quietly made up its mind.',
  fact:'<b>Grains lock to the field while cooling.</b> They freeze in a slight preference for Earth\'s field at that moment: <b>the north that was</b>. Bricks fired in one kiln share roughly the same north.',src:'Dunlop &amp; Özdemir (1997); Butler (1992)'+S1+' · site: The North That Was',
  ch:[['travel','Load the cart','']]},
 travel:{n:6,t:'Where the bricks go',cap:'Plate vi · the road out of town',
  lore:'A carter comes up the road with an empty cart and three orders in his coat: one from the chapel, one from the bridge-builders, one from a family who want a new hearth. Which will you follow?',
  fact:'Once laid, the north a brick holds stays put while the wall weathers. On this site that is a <span class="tag model">model assumption</span>, not a measurement.',src:'site: The North That Was, station 5',
  ch:[['chapel','To the chapel','an ending: the wall'],['bridge','To the bridge','an ending: the reader'],['hearth','To a family\'s hearth','an ending: the photograph']]},
 chapel:{n:7,end:'I',t:'The chapel wall',cap:'Ending I · laid in courses',
  lore:'The masons lay her bricks in courses, each row offset by half a brick. One brick alone says very little. Together, row on row, they hold a pattern no single brick could.',
  fact:'<b>The course is the identity.</b> Brickmark\'s identity unit may be the course: aggregate <b>four to eight bricks</b> for a usable identity length, <em>if measured course BER earns it</em>.',src:'docs/SAELION_REALITY_PROGRAM.md §2.2',
  ch:[['help','And so…','']]},
 bridge:{n:7,end:'II',t:'The bridge',cap:'Ending II · a reader at the parapet',
  lore:'The bridge stands for centuries. One day a surveyor comes with a scanner and holds it a hand\'s breadth off the stone, then closer, then closer still, listening for the north that was.',
  fact:'<b>The scanner reads at a standoff.</b> The field signal fades with distance as <code>exp(−2πkh)</code> (<span class="tag model">model</span>). Standoff repeatability <b>≤&nbsp;0.2&nbsp;mm</b> is a derived jig spec. Spectrum gate #3 is <b>UNMEASURED</b>: repeat at 0.5 / 1 / 2 / 5&nbsp;mm.',src:'issue #3 · site: Three Pillars, Gate #3',
  ch:[['help','And so…','']]},
 hearth:{n:7,end:'III',t:'A family\'s hearth',cap:'Ending III · by the fire, years later',plate:'assets/hearthplate.webp',
  lore:'Her bricks become a hearth. Years later, a child kneels by the fire with a phone, and carefully, in good light, photographs one brick\'s face, then the next.',
  fact:'<b>The photo you take matters.</b> Experiment 0 collects phone photos of <b>twenty clay faces</b>, each named <code>{lot}-{nn}_r{rep}.jpg</code>, submitted as a GitHub issue.',src:'protocol/experiment0_optical.md · .github/ISSUE_TEMPLATE/data-submission.md',
  ch:[['help','And so…','']]},
 help:{n:8,t:'And so, you can help',cap:'Plate viii · a phone, a brick, good light',
  lore:'Every path in this book ends the same way: with someone who looks closely. The brickmaker is long gone. The north that was is still in the wall. The next page is yours.',
  fact:'The real course: ten quests. Start with safety, choose lots, then photograph twenty faces and deliver them to the assay as a data-submission issue.',src:'site: the Course · protocol/experiment0_optical.md',
  ch:[['#course','Begin the course ▦','leaves the book for Room II'],['map','See the paths taken','the map at the back of the book'],['travel','Read another ending','back to the carter']]},
 map:{n:9,t:'Paths taken',cap:'Endpaper · the brickmaker\'s map',sig:[10,'✣','8%','88%','✣ The rose sigil: every path in this book bends back to the course.'],
  lore:'Pressed into the back of the book, a map of every path. The ones you have walked are inked; the rest are still in pencil.',fact:'',src:'',ch:[['#course','Begin the course ▦',''],['town','Start again from page one','your bookmark moves with you']]}
};
var ORDER=['town','river','hill','kiln','still','storm','cool','travel','chapel','bridge','hearth','help','map'];
window.__bookPages=P;

/* ---------- DOM ---------- */
var B=document.createElement('section');B.className='book';B.id='book';B.hidden=true;B.setAttribute('aria-label','The Brickmaker\'s Book');
B.innerHTML='<div class="bk-top"><button type="button" id="bk-x" aria-label="Close the book (Esc)">✕ Close</button><button type="button" id="bk-back">← Back</button><button type="button" id="bk-mapb">⌘ Paths</button><button type="button" id="bk-rt" aria-pressed="false">▶ Read to me</button></div>'+
 '<div class="bk-vol" id="bk-vol"><div class="bk-spread" id="bk-spread"><div class="bk-left"><div class="bk-dio" id="bk-dio"><div class="bk-plate" id="bk-plate"></div><div class="bk-pl back"></div><div class="bk-haze"></div><div class="bk-pl mid"></div><div class="bk-pl front"></div><div class="bk-vig"></div></div><div class="bk-capt" id="bk-capt"></div></div>'+
 '<div class="bk-right" id="bk-right"><div class="bk-text" id="bk-text"></div><div class="bk-folio" id="bk-folio"></div></div></div>'+
 '<div class="bk-cover" id="bk-cover"><div class="bk-cf"><div><p>a storybook from the obsidian hearth</p><h1>The Brickmaker\'s Book</h1><span class="bk-seal">❦</span><p>choose your path · three endings</p><div id="bk-cbtns"></div></div></div><div class="bk-cb"></div></div>'+
 '<button class="bk-rib" id="bk-rib" type="button" aria-label="Bookmark ribbon"><span id="bk-ribt">bookmark</span></button><div class="bk-ribcue" id="bk-ribcue"></div></div>'+
 '<div class="bk-cap" id="bk-cap" hidden role="status" aria-live="polite"><p id="bk-capt2"></p><div class="ctl"><span id="bk-step" style="font-size:.75rem;color:#a99c97"></span><button type="button" id="bk-voice" aria-pressed="false" title="Speak the captions">🔈</button><button type="button" id="bk-pause" aria-label="Pause">❚❚</button><button type="button" id="bk-stop" aria-label="Stop">■</button></div><div class="bar"><i id="bk-prog"></i></div></div>';
document.body.appendChild(B);
var vol=$('#bk-vol'),dio=$('#bk-dio'),txt=$('#bk-text'),right=$('#bk-right'),spread=$('#bk-spread'),PL=$$('.bk-pl',dio);
var BK={open:false,page:null};window.__book=BK;
BK.perch=function(){var r=right.getBoundingClientRect(),m=innerWidth<760;return m?[innerWidth-60,Math.max(64,Math.min(innerHeight-160,r.top+6))]:[Math.min(innerWidth-60,r.right-58),Math.max(64,r.top+14)];};

function paint(id){var sc=(SC[id]||SC.cover)();PL[0].innerHTML=svg(sc[0]);PL[1].innerHTML=svg(sc[1]);PL[2].innerHTML=svg(sc[2]);
 var p=P[id];$('#bk-plate').style.backgroundImage=p&&p.plate?'url('+p.plate+')':'none';$('#bk-capt').textContent=p?p.cap:'';
 if(!RMq()&&!B.classList.contains('rm')){dio.classList.add('pull');requestAnimationFrame(function(){requestAnimationFrame(function(){dio.classList.remove('pull');});});}}
function mapSVG(read){var N={town:[200,30],river:[120,90],hill:[280,90],kiln:[200,150],still:[120,210],storm:[280,210],cool:[200,270],travel:[200,330],chapel:[90,400],bridge:[200,400],hearth:[310,400],help:[200,470]};
 var E=[['town','river'],['town','hill'],['river','kiln'],['hill','kiln'],['kiln','still'],['kiln','storm'],['still','cool'],['storm','cool'],['cool','travel'],['travel','chapel'],['travel','bridge'],['travel','hearth'],['chapel','help'],['bridge','help'],['hearth','help']];
 var g='<svg viewBox="0 0 400 500" role="img" aria-label="Map of paths taken">';E.forEach(function(e){var a=N[e[0]],b=N[e[1]];g+='<path class="e'+(read[e[0]]&&read[e[1]]?' read':'')+'" d="M'+a[0]+' '+a[1]+' L'+b[0]+' '+b[1]+'"/>';});
 Object.keys(N).forEach(function(k){var a=N[k],p=P[k];g+='<g class="n'+(read[k]?' read':'')+(p.end?' end':'')+'" data-go="'+k+'" tabindex="0" role="button" aria-label="'+p.t+(read[k]?' (read)':' (unread)')+'"><circle cx="'+a[0]+'" cy="'+a[1]+'" r="11"/><text x="'+a[0]+'" y="'+(a[1]+26)+'">'+(p.end?'Ending '+p.end:p.t)+'</text></g>';});
 return g+'</svg>';}
function readView(){return RT.on?RT.read:S.read;}
function endCount(r){return ['chapel','bridge','hearth'].filter(function(k){return r[k];}).length;}
function render(id){var p=P[id],r=readView(),h='<p class="bk-eye">'+(p.end?'Ending '+p.end+' of III':'Page '+p.n)+'</p><h2>'+p.t+'</h2><p class="bk-lore"><span class="bk-tag lore">lore</span>'+p.lore+'</p>';
 if(p.fact)h+='<aside class="bk-fact"><span class="bk-tag real">real</span>'+p.fact+'<span class="src">Source: '+p.src+'</span></aside>';
 if(id==='map')h+='<div class="bk-map" id="bk-map">'+mapSVG(r)+'</div><p class="bk-lore" style="font-size:.9rem">Endings read: <b id="bk-ends">'+endCount(r)+' / 3</b> · pages read: '+ORDER.filter(function(k){return r[k];}).length+' / '+ORDER.length+'</p>';
 h+='<div class="bk-choices">'+p.ch.map(function(c){var ext=c[0].charAt(0)==='#';return '<button type="button" class="bk-choice'+(ext&&c[0]==='#course'?' go':'')+(!ext&&r[c[0]]&&p.ch.length>1?' read':'')+'" data-go="'+c[0]+'">'+c[1]+(c[2]?'<small>'+c[2]+'</small>':'')+'</button>';}).join('')+'</div>';
 txt.innerHTML=h;$('#bk-folio').textContent='— '+(p.end?'ending '+p.end.toLowerCase():p.n)+' —';
 $$('.bk-mg',right).forEach(function(m){m.remove();});
 if(p.sig){var sg=p.sig,b=document.createElement('button');b.type='button';b.className='bk-mg';b.textContent=sg[1];b.setAttribute('aria-label','Marginalia');b.style.top=sg[2];b.style.left=sg[3];b.dataset.sig=sg[0];
  try{if((JSON.parse(localStorage.getItem('redcore.spores'))||{})[sg[0]])b.classList.add('found');}catch(e){}
  b.addEventListener('click',function(e){e.stopPropagation();if(RT.on)return;RC().takeSigil(sg[0],sg[4],b);b.classList.add('found');});right.appendChild(b);}
 right.scrollTop=0;spread.scrollTop=0;}
function ribbon(){var sp=RT.on?RT.snapPage:S.page,t=sp&&P[sp]?(P[sp].end?'ending '+P[sp].end:'p. '+P[sp].n):'—';$('#bk-ribt').textContent='bookmark · '+t;
 $('#bk-ribcue').textContent=sp?(sp===BK.page?'Bookmarked here: '+P[sp].t:'Resume at '+P[sp].t):'Your ribbon follows you as you read';
 var cb=$('#bk-cbtns');cb.innerHTML=(S.page&&!RT.on?'<button class="bk-btn" type="button" data-cover="resume">Resume at '+P[S.page].t+'</button><button class="bk-btn alt" type="button" data-cover="begin">Begin again</button>':'<button class="bk-btn" type="button" data-cover="begin">Open the book</button>');}

/* turning: Storeybrook spread() leaf */
var turning=false;
function turn(id,dir,done){var p=P[id];if(!p)return;if(turning){return;}
 var rm=RMq()||B.classList.contains('rm');
 function swap(){BK.page=id;paint(id);render(id);var r=readView();r[id]=1;if(!RT.on){S.page=id;persist();history.replaceState(null,'','#book='+id);}ribbon();RC().reperch&&RC().reperch();
  window.dispatchEvent(new CustomEvent('rc:bookpage',{detail:{page:id,rt:RT.on}}));}
 if(rm||!vol.animate||!vol.classList.contains('opened')){swap();if(done)done();return;}
 turning=true;var leaf=document.createElement('div');leaf.className='bk-leaf';leaf.innerHTML='<div></div><div class="b"></div>';
 if(dir<0){leaf.style.right='auto';leaf.style.left='0';leaf.style.transformOrigin='right center';}
 vol.appendChild(leaf);var a=leaf.animate([{transform:'rotateY(0deg)'},{transform:'rotateY('+(dir<0?180:-180)+'deg)'}],{duration:700,easing:'cubic-bezier(.45,.05,.25,1)'});
 setTimeout(swap,350);a.onfinish=function(){leaf.remove();turning=false;if(done)done();};}
function choose(to){if(to.charAt(0)==='#'){closeBook();setTimeout(function(){var el=$(to);if(el)el.scrollIntoView({behavior:RMq()?'auto':'smooth'});RC().say('Your page now. Brick one: Ward. ▦',4200);},80);return;}
 if(!RT.on){if(to==='town')S.path=[];S.path.push(to);}turn(to,1);}
function back(){if(RT.on)return;if(S.path.length>1){S.path.pop();var to=S.path[S.path.length-1];persist();turn(to,-1);}else closeCoverBack();}
function closeCoverBack(){vol.classList.remove('opened');BK.page=null;}

function openCover(){vol.classList.add('opened');}
function openBook(page){var rc=RC();if(rc.ap&&rc.ap())rc.apStop();rc.closeJ&&rc.closeJ();rc.closeDoc&&rc.closeDoc();rc.closeMenu&&rc.closeMenu();
 if(!BK.open){BK.open=true;B.hidden=false;document.body.classList.add('bopen');B.classList.toggle('rm',RMq());loop();}
 if(page&&P[page]){openCover();turn(page,1);}else{vol.classList.remove('opened');paint('cover');ribbon();}
 rc.reperch&&rc.reperch();if(!RT.on)setTimeout(function(){rc.say(page?'We\'re in the book. I\'ll sit in the margin.':'The Brickmaker\'s Book. Tap the cover, or follow the ribbon.',3600);},400);
 window.dispatchEvent(new CustomEvent('rc:bookopen'));}
function closeBook(){if(!BK.open)return;if(RT.on)rtStop();BK.open=false;B.hidden=true;document.body.classList.remove('bopen');BK.page=null;
 if(/^#book/.test(location.hash))history.replaceState(null,'',location.pathname+location.search);RC().reperch&&RC().reperch();window.dispatchEvent(new CustomEvent('rc:bookclose'));}
BK.openBook=openBook;BK.closeBook=closeBook;BK.state=function(){return JSON.parse(JSON.stringify(S));};BK.go=function(id){turn(id,1);};
function nextP(){if(RT.on)return false;if(!vol.classList.contains('opened')){cover(S.page?'resume':'begin');return true;}var p=P[BK.page];if(!p)return false;
 var fw=p.ch.filter(function(c){return c[0].charAt(0)!=='#';});if(BK.page==='help'||BK.page==='map'||fw.length!==1){pulse();return false;}choose(fw[0][0]);return true;}
function pulse(){$$('.bk-choice',txt).forEach(function(b){b.classList.remove('pulse');void b.offsetWidth;b.classList.add('pulse');});RC().say('Choose a path to turn the page.',2200);}
BK.next=nextP;BK.back=function(){if(!vol.classList.contains('opened')||RT.on)return false;back();return true;};BK.pulse=pulse;BK.demoSink=null;
/* drag-to-curl: the leaf follows the finger/cursor and commits past halfway */
(function(){var d=null,leaf=null;
 function mk(dir){leaf=document.createElement('div');leaf.className='bk-leaf curl';leaf.innerHTML='<div></div><div class="b"></div>';if(dir<0){leaf.style.right='auto';leaf.style.left='0';leaf.style.transformOrigin='right center';}vol.appendChild(leaf);}
 spread.addEventListener('pointerdown',function(e){if(RT.on||turning||e.button>0||e.target.closest('button,a,input,.bk-mg,.bk-map'))return;d={x:e.clientX,y:e.clientY,id:e.pointerId,on:false,dir:0};},true);
 addEventListener('pointermove',function(e){if(!d||e.pointerId!==d.id)return;var dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(!d.on){if(Math.abs(dx)>14&&Math.abs(dx)>Math.abs(dy)*1.3){d.dir=dx<0?1:-1;if(d.dir<0&&S.path.length<2){d=null;return;}d.on=true;mk(d.dir);try{spread.setPointerCapture(d.id);}catch(x){}}else if(Math.abs(dy)>14){d=null;}return;}
  var half=vol.clientWidth*(innerWidth<760?1:.5),pr=Math.max(0,Math.min(1,(d.dir>0?-dx:dx)/half));d.pr=pr;leaf.style.transform='rotateY('+(d.dir>0?-1:1)*pr*180+'deg)';},{passive:true});
 function end(){if(!d)return;var dd=d;d=null;if(!dd.on||!leaf)return;var l=leaf;leaf=null;
  if((dd.pr||0)>.5){var ok=dd.dir>0?nextP():BK.back();l.style.transition='transform .25s ease-out';l.style.transform='rotateY('+(dd.dir>0?-180:180)+'deg)';setTimeout(function(){l.remove();},260);window.__curl={committed:true,ok:ok,dir:dd.dir};}
  else{l.style.transition='transform .3s cubic-bezier(.34,1.56,.64,1)';l.style.transform='rotateY(0deg)';setTimeout(function(){l.remove();},320);window.__curl={committed:false,dir:dd.dir};}}
 addEventListener('pointerup',end);addEventListener('pointercancel',end);})();
function cover(act){if(act==='resume'&&S.page){openCover();turn(S.page,1);}else{S.path=['town'];openCover();turn('town',1);}}
$('#bk-cover').addEventListener('click',function(e){var a=e.target.closest('[data-cover]');cover(a?a.dataset.cover:(S.page?'resume':'begin'));});
txt.addEventListener('click',function(e){var g=e.target.closest('[data-go]');if(!g||RT.on)return;e.preventDefault();var to=g.dataset.go;
 if(g.closest('#bk-map')){if(!readView()[to]){RC().say('Still in pencil. Walk there to ink it in.',2600);return;}S.path.push(to);turn(to,1);return;}choose(to);});
$('#bk-x').addEventListener('click',function(){closeBook();});
$('#bk-back').addEventListener('click',function(){back();});
$('#bk-mapb').addEventListener('click',function(){if(RT.on)return;openCover();S.path.push('map');turn('map',1);});
$('#bk-rib').addEventListener('click',function(e){e.stopPropagation();if(RT.on)return;var c=$('#bk-ribcue');c.classList.add('on');setTimeout(function(){c.classList.remove('on');},1800);
 if(S.page&&S.page!==BK.page){openCover();turn(S.page,1);}else RC().say(S.page?'Bookmarked right here.':'The ribbon moves with you.',2200);});
addEventListener('keydown',function(e){if(!BK.open||RT.on)return;if(e.key==='Escape'){closeBook();}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();back();}else if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();nextP();}});
function bookHash(){var m=location.hash.match(/^#book(?:=(\w+))?$/);if(m)openBook(m[1]);else if(BK.open&&!/^#book/.test(location.hash)&&location.hash)closeBook();}
addEventListener('hashchange',bookHash);

/* ---------- depth: pointer + tilt + scroll -> three planes (Depthfield numbers) ---------- */
var PAR=[18,36,64],SINK=[60,130,220],tx=0,ty=0,cx=0,cy=0,gx=0,gy=0,tiltOn=false,lastT=0;
addEventListener('pointermove',function(e){if(!BK.open)return;tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2;},{passive:true});
function onMotion(e){var g=e.accelerationIncludingGravity;if(!g||g.x==null)return;var m=Math.hypot(g.x,g.y,g.z||0);if(m<1)return;
 var a=0;try{a=(screen.orientation&&screen.orientation.angle)||0;}catch(x){}a=a*Math.PI/180;var sg=/iP(hone|ad|od)/.test(navigator.userAgent)?1:-1,x=sg*g.x/m,y=sg*g.y/m;
 var vx=x*Math.cos(a)-y*Math.sin(a),vy=-(x*Math.sin(a)+y*Math.cos(a));gx+=(vx-gx)*.15;gy+=(vy-gy)*.15;tiltOn=true;lastT=Date.now();}
function askTilt(){var D=window.DeviceOrientationEvent;if(D&&typeof D.requestPermission==='function'){D.requestPermission().then(function(p){if(p==='granted')addEventListener('devicemotion',onMotion,{passive:true});}).catch(function(){});}else addEventListener('devicemotion',onMotion,{passive:true});}
B.addEventListener('pointerdown',function once(){askTilt();B.removeEventListener('pointerdown',once);});
var looping=false;
function loop(){if(looping)return;looping=true;(function f(){if(!BK.open){looping=false;return;}
 var rm=RMq()||B.classList.contains('rm'),px=tx,py=ty;if(tiltOn&&Date.now()-lastT<1200){px=Math.max(-1,Math.min(1,px+Math.sin(gx)*2.2));py=Math.max(-1,Math.min(1,py+Math.sin(gy)*2.2));}
 if(RT.on&&!rm){var t=performance.now()/1000;px=Math.sin(t*.5)*.6;py=Math.cos(t*.37)*.3;}
 cx+=(px-cx)*.05;cy+=(py-cy)*.05;var sc=innerWidth<760?(spread.scrollTop/Math.max(1,spread.scrollHeight-spread.clientHeight)):(right.scrollTop/Math.max(1,right.scrollHeight-right.clientHeight)),k=innerWidth<760?.55:1;sc=Math.min(.3,sc*.3)/.3;if(BK.demoSink!==null)sc=BK.demoSink;
 PL.forEach(function(pl,i){pl.style.transform=rm?'none':'translate3d('+(-cx*PAR[i]*k).toFixed(1)+'px,'+(-cy*PAR[i]*.5*k+sc*SINK[i]*.35).toFixed(1)+'px,0)';});
 requestAnimationFrame(f);})();}

/* ---------- READ TO ME: turns pages, walks every branch and ending, narrates captions. Never writes saved progress. ---------- */
var RT={on:false,paused:false,i:-1,read:{},snap:null,snapPage:null};
var RSTEPS=[
 ['cover','Read to me: The Brickmaker\'s Book. Click or Space to pause, Esc to stop.'],
 ['town','Page one. A brickmaker wakes before the bells. Two clay beds: the river, or the red hill. Real: Brickmark is a provenance assay, not a PUF.'],
 ['river','First path: the river bend. Real: clay carries magnetite and hematite grains, pointing every which way.'],
 ['kiln','Into the kiln. On the way down, as it cools, a record sets.'],
 ['still','A still night. Real: hematite settles below about 675 °C.'],
 ['cool','The cooling. Real: grains lock to the field while cooling, the north that was. (Watch: scrolling sinks the three planes; the text stays still.)'],
 ['travel','Where do the bricks go? A chapel, a bridge, or a hearth.'],
 ['chapel','Ending one: the chapel wall. Real: the course is the identity, four to eight bricks, if measured course BER earns it.'],
 ['help','And so, you can help.'],
 ['hill','Back to the start, the other path: the red hill. Real: one bed, one firing, one batch. (A thumbprint hides in this margin; tap it yourself.)'],
 ['storm','A storm night. Real: magnetite locks below about 580 °C. (A moth hides in this margin.)'],
 ['bridge','Ending two: the bridge. Real: the scanner reads at a standoff; exp(−2πkh) is a model; Gate #3 is unmeasured.'],
 ['hearth','Ending three: a family\'s hearth. Real: the photo you take matters: twenty faces, named {lot}-{nn}_r{rep}.jpg.'],
 ['help','Every path converges: and so, you can help.'],
 ['map','The paths taken: every branch inked. Your own bookmark and map are untouched. The course is yours.']];
var RD=5000,RTOT=0,rtTm=null,rtDue=0,rtLeft=0,rtEl=0,rtLast=0;
function rdur(){return (RMq()||B.classList.contains('rm'))?RD*1.25:RD;}
function rtPaint(){$('#bk-rt').setAttribute('aria-pressed',RT.on);$('#bk-rt').textContent=RT.on?'■ Stop reading':'▶ Read to me';$('#bk-cap').hidden=!RT.on;$('#bk-cap').classList.toggle('paused',RT.paused);$('#bk-pause').textContent=RT.paused?'▶':'❚❚';}
var voice=false;function speak(t){if(!voice||!window.speechSynthesis)return;try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t.replace(/[{}]/g,''));u.rate=1;speechSynthesis.speak(u);}catch(e){}}
function rtRun(){RT.i++;if(RT.i>=RSTEPS.length){rtStop(true);return;}var s=RSTEPS[RT.i];$('#bk-capt2').textContent=s[1];$('#bk-step').textContent=(RT.i+1)+' / '+RSTEPS.length;speak(s[1]);
 if(s[0]==='cover'){vol.classList.remove('opened');paint('cover');}else{openCover();RT.read[s[0]]=1;turn(s[0],1);}
 if(s[0]==='cool'){var t0=performance.now();if(window.__scroll)window.__scroll.hint('⇣ scrolling sinks the planes',3600);(function f(){if(!RT.on){BK.demoSink=null;return;}var q=Math.min(1,(performance.now()-t0)/3600);BK.demoSink=Math.sin(q*Math.PI);if(q<1)requestAnimationFrame(f);else BK.demoSink=null;})();}
 window.dispatchEvent(new CustomEvent('rc:rtstep',{detail:{i:RT.i,page:s[0]}}));
 rtLeft=rdur();rtDue=Date.now()+rtLeft;clearTimeout(rtTm);rtTm=setTimeout(rtRun,rtLeft);}
function rtProg(){if(!RT.on)return;var n=performance.now();if(!RT.paused)rtEl+=n-rtLast;rtLast=n;$('#bk-prog').style.width=Math.min(100,rtEl/RTOT*100).toFixed(1)+'%';requestAnimationFrame(rtProg);}
function rtStart(){if(RT.on)return;if(!BK.open)openBook();RT.snap=localStorage.getItem(KEY);RT.snapPage=S.page;RT.snapB=BK.page;RT.on=true;RT.paused=false;RT.i=-1;RT.read={};RTOT=RSTEPS.length*rdur();rtEl=0;rtLast=performance.now();rtStart0=Date.now();
 document.body.classList.add('bkread');rtPaint();requestAnimationFrame(rtProg);rtRun();window.__rtStarted=rtStart0;}
var rtStart0=0;
function rtStop(finished){if(!RT.on)return;RT.on=false;RT.paused=false;clearTimeout(rtTm);try{speechSynthesis&&speechSynthesis.cancel();}catch(e){}document.body.classList.remove('bkread');
 /* restore exactly what was saved before */
 try{if(RT.snap===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,RT.snap);}catch(e){}S=load()||{page:null,path:[],read:{}};
 window.__rtDone={finished:!!finished,ms:Date.now()-rtStart0,step:RT.i};rtPaint();
 if(RT.snapB&&P[RT.snapB]){turn(RT.snapB,-1);}else{vol.classList.remove('opened');paint('cover');}ribbon();
 window.dispatchEvent(new CustomEvent('rc:rtstop',{detail:{finished:!!finished}}));
 RC().say(finished?'The end, and the beginning. Your bookmark is where you left it.':'Stopped reading. Your page, your path.',4200);}
function rtPause(){if(!RT.on||RT.paused)return;RT.paused=true;clearTimeout(rtTm);rtLeft=Math.max(0,rtDue-Date.now());try{speechSynthesis&&speechSynthesis.pause();}catch(e){}rtPaint();}
function rtResume(){if(!RT.on||!RT.paused)return;RT.paused=false;rtDue=Date.now()+rtLeft;rtTm=setTimeout(rtRun,rtLeft);try{speechSynthesis&&speechSynthesis.resume();}catch(e){}rtPaint();}
function rtToggle(){RT.paused?rtResume():rtPause();}
BK.rt={start:rtStart,stop:rtStop,toggle:rtToggle,state:function(){return {on:RT.on,paused:RT.paused,i:RT.i,n:RSTEPS.length,total:RSTEPS.length*rdur()};}};
$('#bk-rt').addEventListener('click',function(e){e.stopPropagation();RT.on?rtStop():rtStart();});
$('#bk-pause').addEventListener('click',function(e){e.stopPropagation();rtToggle();});
$('#bk-stop').addEventListener('click',function(e){e.stopPropagation();rtStop();});
$('#bk-voice').addEventListener('click',function(e){e.stopPropagation();voice=!voice;this.setAttribute('aria-pressed',voice);if(!voice)try{speechSynthesis.cancel();}catch(x){}});
addEventListener('pointerdown',function(e){if(!RT.on||e.target.closest('#bk-cap,#bk-rt,#clinker,.cbub'))return;rtToggle();},true);
addEventListener('keydown',function(e){if(!RT.on)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();rtStop();}else if(e.key===' '||e.code==='Space'){e.preventDefault();rtToggle();}},true);
bookHash();
})();
