<script>
/* ============================================================
   UI CORE — router, shell, helpers, modal, toasts, canvases
   ============================================================ */
'use strict';

var UI = (function(){

/* ---------- tiny helpers ---------- */
function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function el(h){ var d=document.createElement('div'); d.innerHTML=h.trim(); return d.firstChild; }
function rnd(a){ return a[Math.floor(Math.random()*a.length)]; }
function shuffle(a){ var b=a.slice(); for(var i=b.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=b[i]; b[i]=b[j]; b[j]=t; } return b; }
function words(s){ return String(s).replace(/[⟨⟩]/g,' ').split(/\s+/).filter(function(w){ return /[a-z0-9]/i.test(w); }).length; }
function fmtT(s){ s=Math.max(0,Math.floor(s)); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
function md(s){
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/\n/g,'<br>');
}

/* ---------- toasts ---------- */
var toastT=null;
function toast(html, cls){
  var t=el('<div class="toast '+(cls||'')+'">'+html+'</div>');
  $('#toasts').appendChild(t);
  setTimeout(function(){ t.style.transition='opacity .3s,transform .3s'; t.style.opacity='0'; t.style.transform='translateY(8px)';
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 320); }, 2600);
  var kids=$$('#toasts .toast');
  if(kids.length>4 && kids[0].parentNode) kids[0].parentNode.removeChild(kids[0]);
}

/* ---------- modal ---------- */
function modal(html){
  $('#mbox').innerHTML='<button class="mclose" onclick="UI.closeModal()">✕</button>'+html;
  $('#modal').classList.add('on');
}
function closeModal(){ $('#modal').classList.remove('on'); }
$('#modal').addEventListener('click', function(e){ if(e.target.id==='modal') closeModal(); });

/* ---------- theme ---------- */
function setTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  S.raw().prefs.theme=t; S.save();
}
function toggleTheme(){ setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'); }

/* ---------- nav ---------- */
var NAV=[
{g:'Train'},
{id:'home',      ic:'◉', n:'Today'},
{id:'coach',     ic:'✦', n:'Custom Prompt'},
{id:'modules',   ic:'▦', n:'All Drills'},
{id:'tones',     ic:'◐', n:'Tone Library', tag:function(){return TONES.length;}},
{id:'twisters',  ic:'⟡', n:'Articulation', tag:function(){return TWISTERS.length;}},
{id:'emphasis',  ic:'⟐', n:'Emphasis Lab'},
{id:'scripts',   ic:'▤', n:'Scripts', tag:function(){return SCRIPTS.length;}},
{g:'Study'},
{id:'codex',     ic:'❑', n:'The Codex'},
{id:'power',     ic:'♆', n:'Power & Psych'},
{g:'You'},
{id:'path',      ic:'⟶', n:'90-Day Path'},
{id:'progress',  ic:'▲', n:'Progress'},
{id:'account',   ic:'◍', n:'Account'}
];
var NAV_ADMIN=[
{g:'Admin'},
{id:'admin',     ic:'▚', n:'Team'},
{g:'Your own training'},
{id:'home',      ic:'◉', n:'Today'},
{id:'progress',  ic:'▲', n:'Progress'},
{id:'account',   ic:'◍', n:'Account'}
];

var view='home', viewArg=null;

function go(v, arg){
  view=v; viewArg=arg||null;
  if(location.hash!=='#'+v) history.replaceState(null,'','#'+v);
  render();
  $('#main').scrollTop=0;
  $('#rail').classList.remove('open'); $('#scrim').classList.remove('on');
}

function paintNav(){
  $('#nav').innerHTML = (isAdminMode()?NAV_ADMIN:NAV).map(function(n){
    if(n.g) return '<div class="navgrp">'+esc(n.g)+'</div>';
    var tag = n.tag ? '<span class="tag">'+n.tag()+'</span>' : '';
    return '<button class="nb'+(view===n.id?' on':'')+'" data-go="'+n.id+'"><span class="ic">'+n.ic+'</span>'+esc(n.n)+tag+'</button>';
  }).join('');
}

var adminMode=false;
function isAdminMode(){ return adminMode && window.Cloud && Cloud.isAdmin(); }

function paintHud(){
  var p=S.levelProgress(), s=S.raw();
  var admin = window.Cloud && Cloud.isAdmin && Cloud.isAdmin();
  $('#hud').innerHTML =
    (admin?'<div class="seg" style="width:100%;margin:0 0 10px;display:flex" id="roleSeg">'+
      '<button data-r="student" style="flex:1"'+(!adminMode?' class="on"':'')+'>Student</button>'+
      '<button data-r="admin" style="flex:1"'+(adminMode?' class="on"':'')+'>Admin</button></div>':'')+
    '<div class="hudtop"><span class="hudlvl">Level <i>'+p.lvl+'</i></span><span class="hudrank">'+esc(p.rank)+'</span></div>'+
    '<div class="xpbar"><i style="width:'+p.pct.toFixed(1)+'%"></i></div>'+
    '<div class="hudsub"><span>'+p.cur+' / '+p.need+' xp</span><span><b>'+s.streak+'</b>d streak · <b>'+s.reps+'</b> reps</span></div>';
  var seg=$('#roleSeg');
  if(seg) seg.onclick=function(e){
    var b=e.target.closest('[data-r]'); if(!b) return;
    e.stopPropagation();
    adminMode = b.dataset.r==='admin';
    go(adminMode?'admin':'home');
  };
}

function paintMic(){
  var st=Audio.state(), d=$('#micdot');
  d.className='micdot'+(st==='live'?' live':(st==='denied'||st==='error')?' err':'');
  d.querySelector('span').textContent = st==='live'?'mic on':st==='denied'?'blocked':st==='error'?'no mic':'mic off';
}
Audio.on(function(){ paintMic(); if(view==='home'||view==='modules') render(); });

/* ---------- mic gate ---------- */
function needMic(){
  return Audio.ready() ? Promise.resolve(true) : Audio.start().then(function(ok){
    if(!ok){
      modal('<h2>Microphone needed</h2>'+
        '<p class="dim2" style="font-size:14.5px">'+esc(Audio.error()||'')+'</p>'+
        '<div class="note no" style="margin-top:14px"><span class="l">To fix it</span>'+
        'Click the padlock or camera icon in your browser address bar and allow microphone access for this site, then reload. '+
        'On iOS you must be on HTTPS. Everything is processed locally in your browser — no audio ever leaves this device.</div>'+
        '<div class="row" style="margin-top:16px"><button class="btn" onclick="location.reload()">Reload</button>'+
        '<button class="btn gh" onclick="UI.closeModal()">Use without mic</button></div>');
    }
    return ok;
  });
}

/* ---------- canvas: live scope ---------- */
function LiveScope(canvas, opts){
  opts=opts||{};
  var ctx2=canvas.getContext('2d'), raf=null;
  var hist=[], MAX=opts.max||260;
  var dpr=Math.min(2,window.devicePixelRatio||1);
  function size(){
    var r=canvas.getBoundingClientRect();
    canvas.width=Math.max(2,r.width*dpr); canvas.height=Math.max(2,r.height*dpr);
  }
  size();
  var ro = window.ResizeObserver ? new ResizeObserver(size) : null;
  if(ro) ro.observe(canvas);

  function cssv(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

  function draw(){
    var L=Audio.live();
    var base=opts.baseline || null;
    hist.push({f0:L.f0, db:L.db});
    if(hist.length>MAX) hist.shift();

    var W=canvas.width, H=canvas.height;
    ctx2.clearRect(0,0,W,H);

    // grid
    ctx2.strokeStyle=cssv('--line'); ctx2.lineWidth=1*dpr;
    for(var i=1;i<4;i++){ var y=H*i/4; ctx2.beginPath(); ctx2.moveTo(0,y); ctx2.lineTo(W,y); ctx2.stroke(); }

    // reference baseline
    var voiced=hist.filter(function(h){return h.f0>0;}).map(function(h){return h.f0;});
    var ref = base || (voiced.length>5 ? Audio.median(voiced) : 0);

    if(ref>0){
      ctx2.strokeStyle=cssv('--acc-line'); ctx2.setLineDash([4*dpr,4*dpr]);
      ctx2.beginPath(); ctx2.moveTo(0,H/2); ctx2.lineTo(W,H/2); ctx2.stroke(); ctx2.setLineDash([]);
    }

    // rms band
    ctx2.fillStyle=cssv('--cy-wash');
    ctx2.beginPath(); ctx2.moveTo(0,H);
    for(var j=0;j<hist.length;j++){
      var x=j/(MAX-1)*W;
      var amp=Math.max(0, Math.min(1,(hist[j].db+62)/56));
      ctx2.lineTo(x, H-amp*H*0.34);
    }
    ctx2.lineTo(W,H); ctx2.closePath(); ctx2.fill();

    // pitch trace
    if(ref>0){
      ctx2.strokeStyle=cssv('--acc'); ctx2.lineWidth=2.4*dpr; ctx2.lineJoin='round'; ctx2.lineCap='round';
      var span=opts.span||14; // semitones top-to-bottom
      var started=false;
      ctx2.beginPath();
      for(j=0;j<hist.length;j++){
        var x2=j/(MAX-1)*W;
        if(hist[j].f0>0){
          var st=12*Math.log2(hist[j].f0/ref);
          var y2=H/2 - (st/span)*H;
          y2=Math.max(3*dpr,Math.min(H-3*dpr,y2));
          if(!started){ ctx2.moveTo(x2,y2); started=true; } else ctx2.lineTo(x2,y2);
        } else { started=false; }
      }
      ctx2.stroke();
    }
    raf=requestAnimationFrame(draw);
  }
  draw();
  return {stop:function(){ if(raf) cancelAnimationFrame(raf); if(ro) ro.disconnect(); }, clear:function(){hist=[];}};
}

/* ---------- canvas: static contour plot ---------- */
function drawContour(canvas, target, trace, opts){
  opts=opts||{};
  var dpr=Math.min(2,window.devicePixelRatio||1);
  var r=canvas.getBoundingClientRect();
  canvas.width=Math.max(2,r.width*dpr); canvas.height=Math.max(2,(opts.h||190)*dpr);
  canvas.style.height=(opts.h||190)+'px';
  var c=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  function cssv(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  c.clearRect(0,0,W,H);

  var span=opts.span||16, pad=14*dpr;
  function Y(st){ return H/2 - (st/span)*(H-pad*2); }
  function X(t){ return pad + t*(W-pad*2); }

  c.strokeStyle=cssv('--line'); c.lineWidth=1*dpr;
  [-6,-3,0,3,6].forEach(function(st){
    c.beginPath(); c.moveTo(0,Y(st)); c.lineTo(W,Y(st)); c.stroke();
    c.fillStyle=cssv('--faint'); c.font=(9*dpr)+'px ui-monospace,monospace';
    c.fillText((st>0?'+':'')+st, 3*dpr, Y(st)-3*dpr);
  });
  c.strokeStyle=cssv('--line2'); c.beginPath(); c.moveTo(0,Y(0)); c.lineTo(W,Y(0)); c.stroke();

  function path(pts, colour, width, dash){
    if(!pts||pts.length<2) return;
    c.strokeStyle=colour; c.lineWidth=width*dpr; c.lineJoin='round'; c.lineCap='round';
    if(dash) c.setLineDash(dash.map(function(d){return d*dpr;})); else c.setLineDash([]);
    c.beginPath();
    pts.forEach(function(p,i){ var x=X(p[0]), y=Math.max(4*dpr,Math.min(H-4*dpr,Y(p[1])));
      if(i===0) c.moveTo(x,y); else c.lineTo(x,y); });
    c.stroke(); c.setLineDash([]);
  }
  path(target, cssv('--muted'), 2.6, [6,5]);
  if(trace && trace.length) path(trace, cssv('--acc'), 3);
}

/* ---------- canvas: waveform ---------- */
function drawWave(canvas, data, progress){
  var dpr=Math.min(2,window.devicePixelRatio||1);
  var r=canvas.getBoundingClientRect();
  canvas.width=Math.max(2,r.width*dpr); canvas.height=Math.max(2,r.height*dpr);
  var c=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  function cssv(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  c.clearRect(0,0,W,H);
  if(!data.length) return;
  var bw=W/data.length, mx=Math.max.apply(null,data)||1;
  data.forEach(function(v,i){
    var h=Math.max(1.5*dpr,(v/mx)*H*0.86);
    c.fillStyle = (progress!=null && i/data.length<=progress) ? cssv('--acc') : cssv('--hi');
    c.fillRect(i*bw, (H-h)/2, Math.max(1,bw-1*dpr), h);
  });
}

/* ---------- score ring ---------- */
function ring(score, label){
  var R=48, C=2*Math.PI*R, off=C*(1-Math.max(0,Math.min(100,score))/100);
  var col = score>=85?'var(--ok)' : score>=68?'var(--acc)' : score>=45?'var(--acc)' : 'var(--no)';
  return '<div class="ring"><svg width="112" height="112" viewBox="0 0 112 112">'+
    '<circle cx="56" cy="56" r="'+R+'" fill="none" stroke="var(--hi)" stroke-width="9"/>'+
    '<circle cx="56" cy="56" r="'+R+'" fill="none" stroke="'+col+'" stroke-width="9" stroke-linecap="round" '+
      'stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg>'+
    '<div class="txt"><div><b style="color:'+col+'">'+Math.round(score)+'</b><span>'+esc(label||'score')+'</span></div></div></div>';
}

function readouts(parts){
  return '<div class="readout">'+parts.map(function(p){
    var cls = p.s>=.78?'good' : p.s>=.5?'warn' : 'bad';
    return '<div class="ro '+cls+'"><p class="k">'+esc(p.k)+'</p>'+
      '<div class="v">'+esc(p.v)+'<span class="u">'+esc(p.u||'')+'</span></div>'+
      (p.band?'<p class="t">target '+p.band[0]+'–'+p.band[1]+'</p>':'')+'</div>';
  }).join('')+'</div>';
}

function faultList(faults, wins){
  var h='';
  if(faults && faults.length) h+=faults.map(function(f){
    return '<div class="fault '+(f.t==='warn'?'warn':'')+'"><span class="fi">'+(f.t==='warn'?'△':'✕')+'</span>'+
      '<div><b>'+esc(f.b)+'</b><span>'+esc(f.s)+'</span></div></div>'; }).join('');
  if(wins && wins.length) h+=wins.map(function(w){
    return '<div class="fault ok"><span class="fi">✓</span><div><span>'+esc(w)+'</span></div></div>'; }).join('');
  return h ? '<div class="faults">'+h+'</div>' : '';
}

/* ---------- render dispatcher ---------- */
var VIEWS={};
function registerView(id, fn){ VIEWS[id]=fn; }
function render(){
  paintNav(); paintHud(); paintMic();
  var fn=VIEWS[view]||VIEWS.home;
  $('#view').innerHTML = fn(viewArg) || '';
  if(VIEWS[view+':after']) VIEWS[view+':after'](viewArg);
}

/* ---------- global click delegation ---------- */
document.addEventListener('click', function(e){
  var t=e.target.closest('[data-go]');
  if(t){ go(t.dataset.go, t.dataset.arg||null); return; }
  var d=e.target.closest('[data-drill]');
  if(d){ Drill.launch(d.dataset.drill, d.dataset.arg||null); return; }
  var a=e.target.closest('[data-act]');
  if(a && VIEWS[view+':act']) VIEWS[view+':act'](a.dataset.act, a.dataset.arg, a);
});

$('#themeBtn').onclick=toggleTheme;
$('#fbBtn').onclick=feedbackModal;
$('#railToggle').onclick=function(){ $('#rail').classList.toggle('open'); $('#scrim').classList.toggle('on'); };
$('#scrim').onclick=function(){ $('#rail').classList.remove('open'); $('#scrim').classList.remove('on'); };
$('#hud').onclick=function(){ go('progress'); };
/* ---------- feedback ---------- */
function feedbackModal(){
  modal('<h2>Tell me what is wrong with it</h2>'+
    '<p class="dim2" style="font-size:14.5px;margin-top:6px">Anything — a score that felt unfair, a drill that made no sense, '+
    'a tone that is missing, wording that is confusing. This is a beta and the misses are the useful part.</p>'+
    '<textarea id="fbMsg" placeholder="What happened, and what did you expect instead?" style="min-height:120px;margin-top:14px"></textarea>'+
    '<p class="tiny dim" style="margin-top:8px">Sent with the page you are on and your level. No audio, ever.'+
    (Cloud.signedIn()?'':' <b style="color:var(--acc)">You are not signed in — this will only be stored in this browser.</b>')+'</p>'+
    '<div class="row" style="margin-top:14px"><button class="btn" id="fbSend">Send</button>'+
    '<button class="btn gh" onclick="UI.closeModal()">Cancel</button></div>');
  $('#fbMsg').focus();
  $('#fbSend').onclick=function(){
    var m=$('#fbMsg').value.trim();
    if(!m){ closeModal(); return; }
    var s=S.raw();
    var ctx={level:S.levelProgress().lvl, reps:s.reps, calibrated:!!(s.profile&&s.profile.done),
             personalTargets:!!s.prefs.personalTargets, ua:navigator.userAgent.slice(0,120)};
    if(Cloud.signedIn()) Cloud.logFeedback({page:view, message:m, context:ctx});
    else { s.localFeedback=(s.localFeedback||[]).concat([{page:view,message:m,at:Date.now()}]).slice(-40); S.save(); }
    closeModal(); toast('Thank you — logged');
  };
}

$('#helpBtn').onclick=function(){
  modal('<h2>Keyboard</h2><div class="prose" style="margin-top:12px">'+
  '<table><tr><td><kbd>space</kbd></td><td>Start / stop recording in a drill</td></tr>'+
  '<tr><td><kbd>→</kbd></td><td>Next item</td></tr>'+
  '<tr><td><kbd>←</kbd></td><td>Previous item</td></tr>'+
  '<tr><td><kbd>R</kbd></td><td>Redo this rep</td></tr>'+
  '<tr><td><kbd>P</kbd></td><td>Play back your recording</td></tr>'+
  '<tr><td><kbd>esc</kbd></td><td>Exit the drill</td></tr>'+
  '<tr><td><kbd>1</kbd>–<kbd>9</kbd></td><td>Jump to a nav item</td></tr></table>'+
  '<h4>Privacy</h4><p>Everything runs in your browser. No audio is uploaded, stored on a server, or sent anywhere. '+
  'Your progress lives in this browser\'s local storage — export it from the Progress page if you want a backup.</p></div>');
};
$('#settingsBtn').onclick=function(){
  var s=S.raw();
  modal('<h2>Settings</h2>'+
   '<div class="sect" style="margin-top:16px">'+
   '<label class="ck" style="margin-bottom:12px"><input type="checkbox" id="setHard"'+(s.prefs.hardMode?' checked':'')+'>'+
     '<span><b>Hard mode</b><br><span class="dim tiny">Tighter score bands and no partial credit on terminals. Turn this on once you are consistently above 80.</span></span></label>'+
   '<label class="ck" style="margin-bottom:12px"><input type="checkbox" id="setAuto"'+(s.prefs.autoNext?' checked':'')+'>'+
     '<span><b>Auto-advance</b><br><span class="dim tiny">Move to the next item automatically after a scored rep.</span></span></label>'+
   '<label class="ck" style="margin-bottom:16px"><input type="checkbox" id="setNums"'+(s.prefs.showNums?' checked':'')+'>'+
     '<span><b>Show live numbers</b><br><span class="dim tiny">Live pitch and level readouts during recording. Turn off if it distracts you.</span></span></label>'+
   '<hr><p class="lbl" style="margin-bottom:10px">Your voice</p>'+
   (S.profile()
     ? '<p class="tiny dim2" style="margin-bottom:10px">Calibrated — modal pitch <b class="mono">'+Math.round(S.profile().modalHz||0)+' Hz</b>, '+
       'range <b class="mono">'+Math.round(S.profile().lowHz||0)+'–'+Math.round(S.profile().highHz||0)+' Hz</b>.</p>'+
       '<label class="ck" style="margin-bottom:12px"><input type="checkbox" id="setPersonal"'+(s.prefs.personalTargets?' checked':'')+'>'+
       '<span><b>Personal Mode</b><br><span class="dim tiny">Scores against bands stretched from <em>your</em> calibration instead of the fixed research-backed ones. '+
       'More encouraging early on — but scores stop being comparable between people, so leave it off if you are tracking a team. '+
       'The “vs your baseline” readout appears either way.</span></span></label>'
     : '<p class="tiny dim2" style="margin-bottom:10px">Not calibrated yet. Two minutes, and every score afterwards is measured more accurately.</p>')+
   '<div class="row" style="margin-bottom:16px"><button class="btn sec sm" id="calBtn">'+(S.profile()?'Re-run calibration':'Calibrate my voice')+'</button>'+
   (S.profile()?'<button class="btn gh sm" id="calClear">Clear profile</button>':'')+'</div>'+
   '<hr><p class="lbl" style="margin-bottom:8px">Your data</p>'+
   '<div class="row"><button class="btn sec sm" id="expBtn">Export progress</button>'+
   '<button class="btn sec sm" id="impBtn">Import</button>'+
   '<button class="btn dgr sm" id="resetBtn">Reset everything</button></div>'+
   (Store.available?'':'<div class="note no" style="margin-top:12px"><span class="l">Heads up</span>Local storage is blocked in this browser, so progress will not survive a reload.</div>')+
   '</div>');
  $('#setHard').onchange=function(){ s.prefs.hardMode=this.checked; S.save(); };
  $('#setAuto').onchange=function(){ s.prefs.autoNext=this.checked; S.save(); };
  $('#setNums').onchange=function(){ s.prefs.showNums=this.checked; S.save(); };
  if($('#setPersonal')) $('#setPersonal').onchange=function(){
    s.prefs.personalTargets=this.checked; S.save();
    toast(this.checked ? 'Personal Mode <b>on</b> — scores are no longer comparable between people'
                       : 'Personal Mode <b>off</b> — back to the fixed standard');
  };
  $('#calBtn').onclick=function(){ closeModal(); needMic().then(function(ok){ if(ok) Drill.launch('calibrate','redo'); }); };
  if($('#calClear')) $('#calClear').onclick=function(){
    if(confirm('Clear your voice profile? The pitch tracker goes back to searching the full range for everyone, and the "vs your baseline" readouts disappear.')){
      S.clearProfile(); closeModal(); render();
    }
  };
  $('#expBtn').onclick=function(){
    var b=new Blob([S.exportJson()],{type:'application/json'});
    var u=URL.createObjectURL(b), a=document.createElement('a');
    a.href=u; a.download='tonality-gym-progress.json'; a.click();
    setTimeout(function(){URL.revokeObjectURL(u);},1000);
  };
  $('#impBtn').onclick=function(){
    var i=document.createElement('input'); i.type='file'; i.accept='.json';
    i.onchange=function(){ var f=i.files[0]; if(!f) return; var r=new FileReader();
      r.onload=function(){ if(!S.importJson(r.result)) toast('That file could not be read.'); };
      r.readAsText(f); };
    i.click();
  };
  $('#resetBtn').onclick=function(){
    if(confirm('Delete all progress, mastery, streaks and achievements? This cannot be undone.')) S.reset();
  };
};

document.addEventListener('keydown', function(e){
  if($('#stage').classList.contains('on')) return;
  if(/input|textarea|select/i.test(e.target.tagName)) return;
  if(e.key==='Escape'){ closeModal(); return; }
  var n=parseInt(e.key,10);
  if(n>=1&&n<=9){
    var items=NAV.filter(function(x){return !x.g;});
    if(items[n-1]) go(items[n-1].id);
  }
});

window.addEventListener('hashchange', function(){
  var h=location.hash.replace('#','');
  if(h && VIEWS[h] && h!==view) go(h);
});

return {
  $:$, $$:$$, esc:esc, el:el, rnd:rnd, shuffle:shuffle, words:words, fmtT:fmtT, md:md,
  toast:toast, modal:modal, closeModal:closeModal, setTheme:setTheme, toggleTheme:toggleTheme,
  go:go, render:render, registerView:registerView, paintHud:paintHud, paintMic:paintMic,
  needMic:needMic, LiveScope:LiveScope, drawContour:drawContour, drawWave:drawWave,
  ring:ring, readouts:readouts, faultList:faultList, feedbackModal:feedbackModal,
  isAdminMode:isAdminMode, setAdminMode:function(v){adminMode=!!v;},
  current:function(){return view;}, arg:function(){return viewArg;}
};
})();
</script>
