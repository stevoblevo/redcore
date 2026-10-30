(function(){
  'use strict';
  var KEY='redcore.exp0.checklist.v1';
  var state={};try{state=JSON.parse(localStorage.getItem(KEY))||{};}catch(e){}
  var boxes=[].slice.call(document.querySelectorAll('#checklist input[type=checkbox]'));
  function paint(){
    var n=0;boxes.forEach(function(b){var on=!!state[b.dataset.k];b.checked=on;b.closest('li').classList.toggle('done',on);if(on)n++;});
    document.getElementById('bar').style.width=(boxes.length?100*n/boxes.length:0)+'%';
    document.getElementById('pct').textContent=n+' / '+boxes.length;
  }
  boxes.forEach(function(b){b.addEventListener('change',function(){state[b.dataset.k]=b.checked;try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}paint();});});
  document.getElementById('reset').addEventListener('click',function(){state={};try{localStorage.removeItem(KEY);}catch(e){}paint();});
  paint();

  var lot=document.getElementById('lot'),nn=document.getElementById('nn'),rep=document.getElementById('rep');
  function pad(v){v=Math.max(1,Math.min(20,parseInt(v,10)||1));return (v<10?'0':'')+v;}
  function name(l,n,r){return l+'-'+pad(n)+'_r'+r+'.jpg';}
  function upd(){
    document.getElementById('fname').textContent=name(lot.value,nn.value,rep.value);
    var out=[];for(var i=1;i<=10;i++){out.push(name(lot.value,i,1)+'   '+name(lot.value,i,2));}
    document.getElementById('shotlist').textContent=out.join('\n')+'\n\n(20 faces total: A-01…A-10 and B-01…B-10, or one lot of 20.)';
  }
  [lot,nn,rep].forEach(function(el){el.addEventListener('input',upd);});
  upd();
  document.getElementById('copy').addEventListener('click',function(){
    var t=document.getElementById('fname').textContent,btn=this;
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){btn.textContent='Copied';setTimeout(function(){btn.textContent='Copy';},1200);},function(){btn.textContent=t;});
  });

  var link=document.getElementById('submitLink');
  function v(id){return (document.getElementById(id).value||'').trim();}
  function build(){
    var body=[
      '## Experiment 0 data submission','',
      '- Lots: '+(v('s_lots')||'_'),
      '- Faces photographed: '+(v('s_faces')||'_'),
      '- Lighting / reps: '+(v('s_light')||'_'),
      '- Filenames follow `{lot}-{nn}_r{rep}.jpg` (e.g. `A-01_r1.jpg`): yes / no','',
      '## Notes',v('s_notes')||'_','',
      '## Attach','Drag your zip of photos here before posting.','',
      '_Optical texture only. Not a B-map, not the spectrum gate (#3). No bits-per-brick claim._'
    ].join('\n');
    link.href='https://github.com/stevoblevo/redcore/issues/new?labels=data-submission&title='+
      encodeURIComponent('Data: Experiment 0 photos'+(v('s_lots')?' — '+v('s_lots'):''))+'&body='+encodeURIComponent(body);
  }
  ['s_lots','s_faces','s_light','s_notes'].forEach(function(id){document.getElementById(id).addEventListener('input',build);});
  build();
})();

/* v0.2.0 · kiln hero (three course ridges, embers, pointer/tilt/scroll parallax) */
(function(){
  'use strict';
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c=document.getElementById('kiln');if(!c)return;var x=c.getContext('2d'),W,H,D=Math.min(2,window.devicePixelRatio||1);
  var px=0,py=0,tx=0,ty=0,sy=0,emb=[];
  function size(){W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0);}
  size();addEventListener('resize',size);
  addEventListener('pointermove',function(e){tx=e.clientX/W-.5;ty=e.clientY/H-.5;},{passive:true});
  addEventListener('deviceorientation',function(e){if(e.gamma!=null){tx=Math.max(-.5,Math.min(.5,Math.sin(e.gamma*Math.PI/180)*1.1));}},{passive:true});
  addEventListener('scroll',function(){sy=scrollY;},{passive:true});
  for(var i=0;i<70;i++)emb.push({x:Math.random(),y:Math.random(),v:.0006+Math.random()*.0016,r:.6+Math.random()*1.8,p:Math.random()*6});
  var planes=[{pt:18,sk:60,base:.62,bh:16,col:[60,16,14]},{pt:36,sk:130,base:.74,bh:22,col:[96,26,20]},{pt:64,sk:220,base:.87,bh:30,col:[140,40,30]}];
  function course(p,i,t){
    var off=px*p.pt, sink=Math.min(sy,H)/H*p.sk, y0=H*p.base+sink+py*p.pt*.4, bw=p.bh*2.6, rows=6;
    for(var r=0;r<rows;r++){var yy=y0+r*(p.bh+3),shift=(r%2?bw/2:0)+off;
      for(var bx=-bw+(shift%bw);bx<W+bw;bx+=bw+3){
        var glow=.75+.25*Math.sin(t*.0007+bx*.01+r+i);
        x.fillStyle='rgb('+(p.col[0]*glow|0)+','+(p.col[1]*glow|0)+','+(p.col[2]*glow|0)+')';
        x.fillRect(bx,yy,bw,p.bh);}
    }
    x.fillStyle='rgba(255,120,80,'+(.25-i*.05)+')';x.fillRect(0,y0-1,W,1.2);
  }
  function frame(t){
    px+=(tx-px)*.05;py+=(ty-py)*.05;
    var g=x.createRadialGradient(W*(.5+px*.2),H*(.55+Math.min(sy,H)/H*.15),10,W*.5,H*.6,Math.max(W,H)*.8);
    g.addColorStop(0,'#5a1810');g.addColorStop(.35,'#240b0a');g.addColorStop(1,'#0b0a0c');x.fillStyle=g;x.fillRect(0,0,W,H);
    for(var i=0;i<3;i++){course(planes[i],i,t);if(i<2){x.fillStyle='rgba(11,10,12,.08)';x.fillRect(0,0,W,H);}}
    for(var j=0;j<emb.length;j++){var e=emb[j];if(!RM){e.y-=e.v;if(e.y<-.02){e.y=1.02;e.x=Math.random();}}
      var ex=e.x*W+Math.sin(t*.001+e.p)*8+px*40,ey=e.y*H,dx=ex-tx*W-W/2,dy=ey-(ty*H+H/2);
      if(dx*dx+dy*dy<118*118){ex+=dx*.15;ey+=dy*.15;}
      x.fillStyle='rgba(255,'+(120+(e.p*20|0))+',70,'+(.35+.35*Math.sin(t*.003+e.p))+')';x.beginPath();x.arc(ex,ey,e.r,0,6.283);x.fill();}
    if(!RM)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* reveal + course light-up */
  var els=[].slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');var cr=en.target.querySelector('.course');if(cr)setTimeout(function(){cr.classList.add('lit');},400);io.unobserve(en.target);}});},{threshold:.08});els.forEach(function(e){io.observe(e);});}
  else els.forEach(function(e){e.classList.add('in');});

  /* spectrum gate plot: exp(-2πkh) vs standoff h */
  var dc=document.getElementById('decay'),k=document.getElementById('k');if(!dc||!k)return;
  var d=dc.getContext('2d'),HS=[0.5,1,2,5],HMAX=6;
  function draw(){
    if(dc.clientWidth&&dc.clientWidth<600){dc.width=600;dc.height=380;}var kv=parseFloat(k.value),w=dc.width,h=dc.height,L=60,R=20,T=24,B=48,pw=w-L-R,ph=h-T-B;
    document.getElementById('kout').textContent=kv.toFixed(2);document.getElementById('lout').textContent=(1/kv).toFixed(2);
    d.clearRect(0,0,w,h);d.font='14px system-ui,sans-serif';d.strokeStyle='rgba(255,255,255,.08)';d.fillStyle='rgba(255,255,255,.55)';
    for(var i=0;i<=HMAX;i++){var gx=L+pw*i/HMAX;d.beginPath();d.moveTo(gx,T);d.lineTo(gx,T+ph);d.stroke();d.fillText(i+' mm',gx-14,h-22);}
    for(var j=0;j<=4;j++){var gy=T+ph*j/4;d.beginPath();d.moveTo(L,gy);d.lineTo(L+pw,gy);d.stroke();d.fillText((1-j/4).toFixed(2),12,gy+5);}
    d.fillText('standoff h',L+pw-70,h-4);
    var gr=d.createLinearGradient(L,0,L+pw,0);gr.addColorStop(0,'#ff8a5c');gr.addColorStop(1,'#ff3b2f');
    d.strokeStyle=gr;d.lineWidth=3;d.beginPath();
    for(var s=0;s<=300;s++){var hh=HMAX*s/300,yy=T+ph*(1-Math.exp(-2*Math.PI*kv*hh));s?d.lineTo(L+pw*s/300,yy):d.moveTo(L,yy);}d.stroke();d.lineWidth=1;
    HS.forEach(function(hh){var a=Math.exp(-2*Math.PI*kv*hh),X=L+pw*hh/HMAX,Y=T+ph*(1-a);
      d.fillStyle='#fff';d.beginPath();d.arc(X,Y,5,0,6.283);d.fill();d.fillStyle='rgba(255,200,180,.9)';d.fillText(a<0.001?a.toExponential(1):a.toFixed(3),X+8,Y-8);});
    d.fillStyle='#ff8a5c';d.fillText('exp(−2πkh) · model, unmeasured',L+8,T+14);
  }
  k.addEventListener('input',draw);draw();
})();
