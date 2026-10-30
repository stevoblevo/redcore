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
