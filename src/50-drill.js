<script>
/* ============================================================
   DRILL RUNNER — the stage. All training modes live here.
   ============================================================ */
'use strict';

var MODULES = [
{id:'calibrate',ic:'◎', n:'Voice Calibration',  c:'var(--cy)',  tier:1, mins:2,
 d:'Five short steps that teach the app your voice. Room noise floor, your register and breath support, your usable pitch range, your articulation baseline and your natural speaking habits. Every score after this is measured more accurately because of it. Run it once, re-run it whenever something changes.'},
{id:'warmup',   ic:'♨', n:'The Warmup',        c:'var(--ok)',  tier:1, mins:6,
 d:'Fourteen steps, in order. Straw phonation, lip trills, hum, the DDK racks, breath benchmark. Six minutes. Do it before everything else — it is the difference between practising your voice and practising your tired voice.'},
{id:'tonelab',  ic:'◐', n:'Tone Lab',           c:'var(--acc)', tier:1, mins:8,
 d:'The core engine. A line, an assigned tone, and a full acoustic grade against that tone\'s target profile — pace, range, terminal, dynamics, silence. This is where mastery is built.'},
{id:'terminal', ic:'↓', n:'Terminal Trainer',   c:'var(--vi)',  tier:1, mins:5,
 d:'Rapid-fire. Every sentence must end down, or up, or flat, on command. The app measures your pitch move over the final syllables in semitones. The highest-leverage habit in the whole app.'},
{id:'monotone', ic:'⌁', n:'Monotone Killer',    c:'var(--cy)',  tier:1, mins:5,
 d:'Widen your pitch range while keeping your mean pitch low. These are independent dials and almost everybody conflates them. Live range meter in semitones.'},
{id:'pace',     ic:'⏱', n:'Pace Gym',           c:'var(--acc)', tier:1, mins:5,
 d:'Hit a target words-per-minute band with a live pacer. Then learn to shift deliberately between slow, conversational and urgent without your pitch coming up with it.'},
{id:'pausegym', ic:'∅', n:'Pause Discipline',   c:'var(--cy)',  tier:1, mins:6,
 d:'Marked pause points with required durations, measured to the millisecond. Includes the two-second post-question silence, which nobody can hold the first time.'},
{id:'floor',    ic:'▬', n:'Volume Floor',       c:'var(--no)',  tier:1, mins:4,
 d:'Stop trailing off. Fall in pitch without falling in energy. Measures your final-syllable intensity against the utterance average — target inside 4 dB.'},
{id:'twisters', ic:'⟡', n:'Articulation Gym',   c:'var(--vi)',  tier:1, mins:8,
 d:'Two hundred and thirty tongue twisters by target phoneme, with a speed ladder. Three clean reps to advance a rung. Metronome, difficulty tiers, and the Brutal Rack.'},
{id:'emphasis', ic:'⟐', n:'Emphasis Shift',     c:'var(--pk)',  tier:1, mins:6,
 d:'One sentence, the stress moves word by word, and the meaning changes completely each time. The single best drill for "when to emphasise what".'},
{id:'contour',  ic:'∿', n:'Contour Tracer',     c:'var(--cy)',  tier:2, mins:6,
 d:'A target pitch shape drawn on screen. Match it with your voice and watch your own line appear over it. Twelve contours from the confident declarative to the contrastive scoop.'},
{id:'script',   ic:'▤', n:'Script Runner',      c:'var(--acc)', tier:2, mins:6,
 d:'Full annotated scripts in teleprompter mode. Every line carries its assigned tone. Run a complete discovery arc, objection loop, hard conversation or keynote open.'},
{id:'roulette', ic:'⚄', n:'Tone Roulette',      c:'var(--pk)',  tier:2, mins:5,
 d:'Random line, random tone, no preparation. Rapid fire. Trains the actual live skill — producing a tone on demand rather than after a run-up.'},
{id:'ab',       ic:'⇄', n:'A/B Compare',        c:'var(--vi)',  tier:2, mins:5,
 d:'Record the same sentence in two different tones, then play them back to back. Nothing teaches you what you actually sound like faster than this.'},
{id:'ear',      ic:'♪', n:'Ear Training',       c:'var(--ok)',  tier:2, mins:5,
 d:'The app plays back your own recordings and asks you to identify which tone you were producing. Brutal, and it is the skill that makes live self-correction possible.'},
{id:'defect',   ic:'⚠', n:'The Defect Lab',     c:'var(--no)',  tier:2, mins:6,
 d:'Produce uptalk, monotone, trailing off, hedging and fry deliberately — then produce the correction on the identical sentence. You cannot reliably avoid a habit you cannot reproduce on purpose.'},
{id:'coldread', ic:'⚡', n:'Cold Read',          c:'var(--acc)', tier:3, mins:5,
 d:'Unseen text, random tone assignment, sixty seconds, no preparation. The closest thing here to actual live pressure.'},
{id:'weak',     ic:'◎', n:'Weak Spots',         c:'var(--no)',  tier:1, mins:8,
 d:'The spaced-repetition queue. The app picks the tones you are worst at and the ones you have not touched in a while, and drills those. Follow this and you will never plateau.'},
{id:'gauntlet', ic:'⚔', n:'The Gauntlet',       c:'var(--no)',  tier:2, mins:12,
 d:'Twelve mixed-mode challenges back to back with no retries. Tone match, terminal, range, pace, pause, articulation. One score at the end. This is the boss fight.'}
];

var Drill = (function(){

var $=UI.$, esc=UI.esc, el=UI.el;
var stage=$('#stage');

var D = null; // active drill state
var scope=null, clockT=null, holdT=null;

/* ---------------- lifecycle ---------------- */
function open(name, total){
  D.name=name; D.total=total; D.i=0; D.t0=Date.now(); D.results=[];
  $('#stName').textContent=name;
  stage.classList.add('on');
  clearInterval(clockT);
  clockT=setInterval(function(){ $('#stClock').textContent=UI.fmtT((Date.now()-D.t0)/1000); },500);
  $('#stClock').textContent='0:00';
  paintTop();
}
function close(){
  stage.classList.remove('on');
  clearInterval(clockT); clearTimeout(holdT);
  if(scope){ scope.stop(); scope=null; }
  if(Audio.isCapturing()) Audio.endCapture();
  Audio.stopPlay();
  if(window.ModelVoice) ModelVoice.stop();
  if(window.Clips) Clips.stop();
  D=null;
  UI.render();
}
function paintTop(){
  if(!D) return;
  $('#stPos').textContent = D.total ? (Math.min(D.i+1,D.total)+' / '+D.total) : '';
  $('#stProg').style.width = D.total ? (D.i/D.total*100)+'%' : '0%';
}
function body(h){ $('#stBody').innerHTML=h; clearBanner(); paintTop(); }
function hint(h){ $('#stHint').innerHTML=h||''; }

/* ---------------- the pass banner ----------------
   Nothing in this app advances on its own. When a rep clears the bar you
   get told, and then it is your call: move on, or stay here and run it
   again. Reading the feedback is most of the value of the rep. */
function clearBanner(){ var b=$('#stBanner'); if(b){ b.className='stbanner'; b.innerHTML=''; } }
function passBanner(ok, opts){
  opts=opts||{};
  var b=$('#stBanner'); if(!b) return;
  var last = D && D.total && D.i>=D.total-1;
  b.className='stbanner on'+(ok?'':' warn');
  b.innerHTML=
    '<span class="bmark">'+(ok?'✓':'·')+'</span>'+
    '<b>'+UI.esc(opts.title || (ok?'All done — you can continue.':'Logged. Take another run at it when you are ready.'))+'</b>'+
    '<span class="bsub">'+UI.esc(opts.sub || (ok
      ? 'Or stay here and run it again — repeating a rep you already cleared is how it becomes automatic.'
      : 'Read the numbers below, then record again. You can also move on and come back to it.'))+'</span>'+
    '<span class="bspace"></span>'+
    '<button class="btn gh sm" data-bn="again">Run it again</button>'+
    '<button class="btn'+(ok?'':' sec')+' sm" data-bn="next">'+(last?'Finish':'Continue')+' →</button>';
  b.onclick=function(e){
    var t=e.target.closest('[data-bn]'); if(!t) return;
    if(t.dataset.bn==='next'){ clearBanner(); if(D&&D.next) D.next(); }
    else { clearBanner(); if(D&&D.redo) D.redo(); }
  };
}

/* ---------------- the reference row ----------------
   Three ways to hear the target before and after you record it:
   a synthesised model of the shape, your best take, and your worst.
   Rendered in the body so it is there before the first rep, and
   refreshed in place whenever a new best or worst lands. */
function refRow(tone, line){
  var id='rf'+Math.random().toString(36).slice(2,8);
  setTimeout(function(){ fillRef(id, tone, line); },0);
  return '<div id="'+id+'" data-ref="1"></div>';
}
function fillRef(id, tone, line){
  var w=document.getElementById(id); if(!w) return;
  var toneId = tone && tone.id;
  /* gate on support, not on the voice list — engines populate voices
     asynchronously and the row can render before that lands */
  var hasModel = !!(window.ModelVoice && ModelVoice.supported);
  var get = (window.Clips && Clips.supported && toneId) ? Clips.get(toneId) : Promise.resolve(null);
  get.then(function(rec){
    if(!w.isConnected) return;
    rec = rec||{};
    if(!hasModel && !rec.best && !rec.worst){ w.innerHTML=''; return; }
    var both = rec.best && rec.worst;
    function clip(kind, e){
      if(!e) return '';
      return '<button class="clipbtn '+kind+'" data-ref-play="'+kind+'">'+
        '<span class="ci">▶</span><span><b>Your '+(kind==='best'?'best':'worst')+' — '+e.score+'</b>'+
        '<span>'+ago(e.at)+'</span></span></button>';
    }
    w.innerHTML='<div class="clipstrip">'+
      '<p class="lbl" style="color:var(--acc);margin:0">Reference</p>'+
      '<div class="cs">'+
        (hasModel?'<button class="clipbtn model" data-ref-play="model">'+
          '<span class="ci">♪</span><span><b>Hear the shape</b><span>synthesised from this tone\'s targets</span></span></button>':'')+
        clip('best',rec.best)+clip('worst',rec.worst)+
        (both?'<button class="clipbtn" data-ref-play="ab"><span class="ci">⇄</span><span><b>Play both</b><span>worst, then best</span></span></button>':'')+
      '</div>'+
      '<p class="tiny dim" style="margin:9px 0 0">'+
      (hasModel?'The model is a synthesiser, not a performance — it demonstrates the pace, the pauses, which word takes the accent and which way the ending moves. Copy the shape, not the timbre. ':'')+
      (both?'Your two takes are '+(rec.best.score-rec.worst.score)+' points apart. Listen for what actually changed between them — it is almost always the terminal and how far the pitch travelled, not the volume. ':
        (rec.best||rec.worst)?'One take saved so far. Record a clearly better or worse one and the pair fills in. ':'')+
      'Your recordings are kept on this device only and never uploaded.</p></div>';

    var playing=null;
    function reset(){
      Array.prototype.forEach.call(w.querySelectorAll('.clipbtn'), function(x){ x.classList.remove('playing'); });
      playing=null;
    }
    w.onclick=function(e){
      var t=e.target.closest('[data-ref-play]'); if(!t) return;
      var k=t.dataset.refPlay, was=playing;
      if(window.Clips) Clips.stop();
      if(window.ModelVoice) ModelVoice.stop();
      reset();
      if(was===k) return;
      playing=k; t.classList.add('playing');
      if(k==='model'){
        var nuc=null;
        try{ var f=analyseForm(line); var n=findNucleus(line,f); nuc=n&&n.word; }catch(err){}
        var ok=ModelVoice.speak(line, tone, {nucleus:nuc, onEnd:reset});
        if(!ok){ reset(); UI.toast('This browser has no speech voice installed — the model shape is unavailable here.'); }
      } else if(k==='ab'){
        Clips.play(rec.worst.blob, function(){
          if(playing!=='ab') return;
          setTimeout(function(){ if(playing==='ab') Clips.play(rec.best.blob, reset); }, 420);
        });
      } else {
        Clips.play(rec[k].blob, reset);
      }
    };
  });
}
function ago(ts){
  var m=(Date.now()-ts)/60000;
  if(m<1) return 'just now';
  if(m<60) return Math.round(m)+' min ago';
  var h=m/60; if(h<24) return Math.round(h)+(Math.round(h)===1?' hour ago':' hours ago');
  var d=Math.round(h/24); return d===1?'yesterday':d+' days ago';
}
/* save the take, then refresh the row in place so a new best appears at once */
function keepClip(tone, score, line){
  if(!window.Clips || !Clips.supported || !tone) return;
  Clips.record(tone.id, score, {line:line}).then(function(r){
    if(!r || (!r.best && !r.worst)) return;
    var host=document.querySelector('[data-ref="1"]');
    if(host) fillRef(host.id, tone, line);
  });
}

function foot(nextLabel, showPrev){
  $('#stNext').textContent=nextLabel||'Next →';
  $('#stPrev').style.display = showPrev===false ? 'none' : '';
}

$('#stExit').onclick=close;
$('#stRestart').onclick=function(){ if(D && D.restart) D.restart(); };
$('#stNext').onclick=function(){ if(D && D.next) D.next(); };
$('#stPrev').onclick=function(){ if(D && D.prev) D.prev(); };

document.addEventListener('keydown', function(e){
  if(!stage.classList.contains('on')) return;
  if(/input|textarea|select/i.test(e.target.tagName)) return;
  if(e.key==='Escape'){ e.preventDefault(); close(); }
  else if(e.key===' '){ e.preventDefault(); if(D&&D.space) D.space(); }
  else if(e.key==='ArrowRight'){ e.preventDefault(); if(D&&D.next) D.next(); }
  else if(e.key==='ArrowLeft'){ e.preventDefault(); if(D&&D.prev) D.prev(); }
  else if(e.key==='r'||e.key==='R'){ if(D&&D.redo) D.redo(); }
  else if(e.key==='p'||e.key==='P'){ if(Audio.hasRecording()) playback(); }
});

/* ---------------- shared record widget ---------------- */
function recPanel(opts){
  opts=opts||{};
  var showNums = S.raw().prefs.showNums;
  return '<div class="scope" style="height:'+(opts.h||150)+'px" id="scopeWrap">'+
    '<canvas id="scopeC"></canvas>'+
    '<div class="ov"><div class="ovtop"><span id="ovLeft">'+(opts.label||'ready')+'</span><span id="ovRight"></span></div>'+
    (showNums?'<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px">'+
      '<span class="big" id="ovBig">—</span><div class="lvl" id="ovLvl"></div></div>':'<div></div>')+
    '</div></div>'+
    '<div class="row" style="margin-top:13px">'+
    '<button class="btn big" id="recBtn">● Record <kbd style="opacity:.6;margin-left:6px">space</kbd></button>'+
    '<button class="btn sec" id="playBtn" style="display:none">▶ Playback</button>'+
    '<button class="btn gh" id="redoBtn" style="display:none">Redo <kbd style="opacity:.6">R</kbd></button>'+
    '<span class="spacer"></span><span class="tiny dim" id="recNote"></span></div>'+
    '<div id="result"></div>';
}

var levelRaf=null;
function startScope(baseline){
  var c=$('#scopeC'); if(!c) return;
  if(scope) scope.stop();
  scope=UI.LiveScope(c, {baseline:baseline||null});
  cancelAnimationFrame(levelRaf);
  (function tickNums(){
    var L=Audio.live(), b=$('#ovBig'), lv=$('#ovLvl'), r=$('#ovRight');
    if(b) b.textContent = L.f0>0 ? Math.round(L.f0)+' Hz' : '—';
    if(r) r.textContent = Audio.isCapturing() ? L.elapsed.toFixed(1)+'s' : '';
    if(lv){
      if(!lv.children.length){ for(var i=0;i<9;i++) lv.appendChild(document.createElement('i')); }
      var amp=Math.max(0,Math.min(1,(L.db+58)/50));
      for(var j=0;j<9;j++){
        var on = amp*9 > j;
        lv.children[j].style.height = (on? 6+j*1.9 : 2)+'px';
        lv.children[j].style.opacity = on? '1':'.22';
      }
    }
    levelRaf=requestAnimationFrame(tickNums);
  })();
}

function wireRecorder(onDone, opts){
  opts=opts||{};
  var rec=$('#recBtn'), play=$('#playBtn'), redo=$('#redoBtn');
  var recording=false;
  startScope(opts.baseline);

  function begin(){
    if(!Audio.ready()){ UI.needMic().then(function(ok){ if(ok){ startScope(opts.baseline); begin(); } }); return; }
    recording=true;
    if(window.ModelVoice) ModelVoice.stop();
    if(window.Clips) Clips.stop();
    Audio.beginCapture({spectra: !!opts.spectra});
    rec.textContent='■ Stop'; rec.classList.remove('sec');
    $('#ovLeft').textContent='recording';
    $('#recNote').textContent='';
    play.style.display='none'; redo.style.display='none';
    $('#result').innerHTML='';
    if(opts.maxSec) holdT=setTimeout(end, opts.maxSec*1000);
  }
  function end(){
    if(!recording) return;
    clearTimeout(holdT);
    recording=false;
    var a=Audio.endCapture();
    Audio.snapshot();
    rec.textContent='● Record';
    $('#ovLeft').textContent='done';
    play.style.display=''; redo.style.display='';
    if(!a || a.empty){
      $('#result').innerHTML='<div class="note no" style="margin-top:14px"><span class="l">Nothing detected</span>'+
        'No voiced speech was picked up. Check that the right microphone is selected, move closer, and speak at a normal conversational level.</div>';
      return;
    }
    onDone(a);
  }
  rec.onclick=function(){ recording?end():begin(); };
  play.onclick=playback;
  redo.onclick=function(){ $('#result').innerHTML=''; play.style.display='none'; redo.style.display='none'; begin(); };
  D.space=function(){ recording?end():begin(); };
  D.redo=function(){ if(!recording){ $('#result').innerHTML=''; begin(); } };
}

function playback(){
  var w=$('#playBtn'); if(!Audio.hasRecording()) return;
  if(w) w.textContent='▶ Playing…';
  Audio.play(function(){ if(w) w.textContent='▶ Playback'; });
}

/* ---------------- utility ---------------- */
/* "vs your baseline" strip — always shown when a profile exists, alongside
   the standard score rather than instead of it. Two honest numbers. */
/* "Was that score fair?" — the highest-value telemetry in the app.
   The audio engine was validated against synthetic signals, not real
   voices, so this is how a systematic misread on a particular kind of
   voice actually surfaces instead of quietly making someone give up. */
function fairnessStrip(tone, score, a){
  var id='fair'+Math.random().toString(36).slice(2,8);
  setTimeout(function(){
    var w=document.getElementById(id); if(!w) return;
    w.onclick=function(e){
      var b=e.target.closest('[data-fair]'); if(!b) return;
      var v=b.dataset.fair;
      if(window.Cloud && Cloud.signedIn()){
        Cloud.logFairness({verdict:v, tone:tone&&tone.id, score:score,
          acoustics:{wpm:a&&Math.round(a.dur*10)/10, span:a&&+a.span.toFixed(1), term:a&&+a.term.toFixed(1),
                     dyn:a&&+a.dyn.toFixed(1), floorDrop:a&&+a.floorDrop.toFixed(1),
                     baseHz:a&&Math.round(a.baseline), fryPct:a&&Math.round(a.fryPct)}});
      } else {
        var s=S.raw(); s.localFairness=(s.localFairness||[]).concat([{v:v,tone:tone&&tone.id,score:score,at:Date.now()}]).slice(-60); S.save();
      }
      w.innerHTML='<p class="tiny dim" style="margin:0">Logged — thank you. That is what makes the scoring better.</p>';
    };
  },0);
  return '<div id="'+id+'" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--line);'+
    'display:flex;gap:9px;align-items:center;flex-wrap:wrap">'+
    '<span class="tiny dim">Was that score fair?</span>'+
    '<button class="btn gh sm" data-fair="about_right" style="padding:3px 10px;font-size:11.5px">Fair</button>'+
    '<button class="btn gh sm" data-fair="too_low" style="padding:3px 10px;font-size:11.5px">Too harsh</button>'+
    '<button class="btn gh sm" data-fair="too_high" style="padding:3px 10px;font-size:11.5px">Too generous</button>'+
    '</div>';
}

function baselineStrip(r){
  if(!r || !r.vsBase || !r.vsBase.length) return '';
  var hr=r.vsBase.headroom;
  var lbl = r.vsBase[0] && r.vsBase[0].ref==='flat' ? 'vs your flat — your own floor' : 'vs your calibration baseline';
  return '<div style="margin:12px 0 0">'+
    '<p class="lbl" style="margin-bottom:7px;color:var(--cy)">'+lbl+'</p>'+
    '<div class="readout">'+r.vsBase.map(function(x){
      var sign = x.d>0?'+':'';
      return '<div class="ro '+(x.good?'good':'')+'" style="'+(x.good?'':'opacity:.75')+'">'+
        '<p class="k">'+esc(x.k)+'</p>'+
        '<div class="v" style="font-size:17px">'+sign+x.d+'<span class="u">'+esc(x.u)+'</span></div>'+
        '<p class="t">'+(x.good?'above your flat':x.d<-0.4?'below it':'about the same')+'</p></div>';
    }).join('')+'</div>'+
    (hr? '<div style="margin-top:10px">'+
      '<div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:5px">'+
      '<span class="dim2">Range you deployed — of the '+hr.travel+' st you demonstrated on demand</span>'+
      '<span class="mono '+(hr.pct>=70?'':'dim')+'" style="color:'+(hr.pct>=70?'var(--ok)':hr.pct>=40?'var(--acc)':'var(--muted)')+'">'+hr.pct+'%</span></div>'+
      '<div class="meter '+(hr.pct>=70?'ok':'')+'"><i style="width:'+Math.min(100,hr.pct)+'%"></i></div>'+
      '<p class="tiny dim" style="margin:6px 0 0">Your flat sits at '+hr.flat+' st, your ceiling at '+hr.ceil+' st. '+
      (hr.pct>=70?'You are using most of what you have.':hr.pct>=40?'Room to push further — the capacity is already there.':'You have far more range available than you are using here. That is a deployment habit, not a limit.')+'</p></div>':'')+
    '</div>';
}

function toneChip(t){ return '<span class="tone">'+esc(t.name)+'</span>'; }
function cueBlock(t, extra){
  return '<div class="cue">'+toneChip(t)+
    '<span class="chip tiny">'+esc(FAMILIES[t.fam].name)+'</span>'+
    (extra||'')+'</div>'+
    '<p class="tiny dim2" style="margin:-6px 0 14px;max-width:70ch"><b style="color:var(--ink)">Cue:</b> '+esc(t.cue)+'</p>';
}
function targetPills(t){
  var T=t.target;
  return '<div class="tcm" style="margin-bottom:14px">'+
   '<span class="pill">'+T.wpm[0]+'–'+T.wpm[1]+' wpm</span>'+
   '<span class="pill">'+T.span[0]+'–'+T.span[1]+' st range</span>'+
   '<span class="pill">terminal '+T.term[0]+' to '+T.term[1]+' st</span>'+
   '<span class="pill">'+T.dyn[0]+'–'+T.dyn[1]+' dB</span>'+
   '<span class="pill">'+T.pause[0]+'–'+T.pause[1]+'% silence</span></div>';
}
function unlockedTones(){ return TONES.filter(function(t){ return S.tierUnlocked(t.tier); }); }

/* ============================================================
   MODE: VOICE CALIBRATION
   Teaches the engine this specific voice and this specific room.
   ============================================================ */
/* One sentence, read three ways. Deliberately neutral in content so no
   emotional colour leaks in and contaminates the measurement, and the
   SAME sentence every time so the three reads are directly comparable. */
var CAL_LINE = 'The meeting is on Thursday morning, and I told them we would have the numbers ready by then.';

function mCalibrate(arg){
  var isRedo = arg==='redo';
  var R = {};   // results accumulate here
  var STEPS = [
    {id:'intro'},
    {id:'noise'}, {id:'sustain'}, {id:'glide'}, {id:'sibilant'},
    {id:'flat'}, {id:'natural'}, {id:'expressive'},
    {id:'done'}
  ];
  var NSTEPS = 7;
  D={i:0};
  open('Voice Calibration', NSTEPS);

  function draw(){
    var st=STEPS[D.i];
    if(!st) return finish();
    ({intro:sIntro, noise:sNoise, sustain:sSustain, glide:sGlide, sibilant:sSibilant,
      flat:sFlat, natural:sNatural, expressive:sExpressive, done:finish})[st.id]();
    D.total = NSTEPS;
    $('#stPos').textContent = (st.id==='intro'||st.id==='done') ? '' : (D.i)+' / '+NSTEPS;
    $('#stProg').style.width = ((D.i)/(STEPS.length-1)*100)+'%';
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){ D.i--; draw(); } };
  D.restart=function(){ R={}; D.i=0; draw(); };

  /* ---------- 0 · intro ---------- */
  function sIntro(){
    body('<div class="cue"><span class="tone">Before anything else</span></div>'+
      '<h2 style="font-size:26px;letter-spacing:-.02em;margin:0 0 12px">Let the app hear your voice first.</h2>'+
      '<p class="prose" style="margin-bottom:16px">Two minutes, five short steps. It is not a test and nothing here is scored.</p>'+
      '<div class="note cy"><span class="l">What it actually fixes</span>'+
      '<b>Your room.</b> Measuring the background noise means the app can tell your silences apart from your speech. Without it, a fan or an air conditioner gets counted as talking, and every pause and pace number goes soft.<br><br>'+
      '<b>Your register.</b> The pitch tracker currently searches the entire human range for everyone. Knowing roughly where your voice sits lets it search a much narrower window, and a narrower window means far fewer octave errors. This is the single biggest accuracy gain available.<br><br>'+
      '<b>Your habits.</b> Your natural pace, range and terminal tendency become the line you get measured against later — so you can see movement from your own starting point, not just against a fixed standard.</div>'+
      '<div class="note"><span class="l">If you have an accent, a soft voice, a lisp or anything else</span>'+
      'Good — that is exactly what this is for. Everything measured here is reported as a plain number against a typical range. '+
      'It is a measurement, not a judgement, and nothing in it is treated as a fault.</div>'+
      '<div class="row" style="margin-top:18px"><button class="btn big" id="calGo">Start →</button>'+
      (isRedo?'<button class="btn gh" onclick="Drill.close()">Cancel</button>':
              '<button class="btn gh" id="calSkip">Skip for now</button>')+'</div>');
    hint('You can re-run this any time from Progress, or from the settings menu.');
    foot('Start →', false);
    $('#calGo').onclick=function(){ D.i++; draw(); };
    if($('#calSkip')) $('#calSkip').onclick=function(){ close(); };
    D.space=function(){ D.i++; draw(); };
  }

  /* ---------- shared step frame ---------- */
  function step(n, title, instruction, note, extra){
    body('<div class="cue"><span class="tone">Step '+n+' of 5</span>'+
      '<span class="chip tiny">'+esc(title)+'</span></div>'+
      '<p class="utter sm">'+instruction+'</p>'+
      (note?'<div class="note cy" style="margin-bottom:14px"><span class="l">Why</span>'+note+'</div>':'')+
      (extra||'')+
      recPanel({h:130}));
  }

  /* ---------- 1 · room noise ---------- */
  function sNoise(){
    step(1,'Room noise',
      'Say nothing at all. Just hit record and sit still for about four seconds.',
      'This is the reference the app uses to tell your silence apart from your speech. It is the only measurement here that cannot be worked out from a recording of you talking.');
    hint('Do not hold your breath — just breathe normally and stay quiet.');
    foot('Next →');
    wireRecorder(function(){
      var r=Audio.analyseNoise();
      if(!r){ $('#result').innerHTML='<div class="note no" style="margin-top:14px">Nothing captured. Try again.</div>'; return; }
      R.noiseDb=r.floorDb;
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        UI.readouts([
          {k:'Noise floor', v:Math.round(r.floorDb), u:'dB', s:r.ok?1:0.25},
          {k:'Loudest', v:Math.round(r.peakDb), u:'dB', s:0.7},
          {k:'Spread', v:Math.round(r.spread), u:'dB', s:0.7}
        ])+
        '<div class="note '+(r.ok?'ok':'no')+'" style="margin-top:12px"><span class="l">'+(r.ok?'Good':'Worth fixing')+'</span>'+esc(r.verdict)+'</div>';
      passBanner(!!r.ok);
    }, {maxSec:5});
  }

  /* ---------- 2 · sustained vowel ---------- */
  function sSustain(){
    step(2,'Register & breath',
      'Take a breath, then hold an <b>“ahh”</b> on one comfortable note for as long as you can. Do not push — comfortable, not loud.',
      'Gives the app your modal pitch, which is the anchor for every semitone measurement afterwards. The length also benchmarks your breath support, which is what runs out when people trail off at the end of sentences.');
    hint('Comfortable pitch, comfortable volume. Straining makes the number worse, not better.');
    foot('Next →');
    wireRecorder(function(){
      var r=Audio.analyseSustain();
      if(!r || r.empty){ $('#result').innerHTML='<div class="note no" style="margin-top:14px">No steady tone detected. Try again a little louder.</div>'; return; }
      R.modalHz=r.modalHz; R.mpt=r.mpt; R.steadiness=r.steadiness;
      var mptOk = r.mpt>=12, mptGood = r.mpt>=18;
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        UI.readouts([
          {k:'Your pitch', v:Math.round(r.modalHz), u:'Hz', s:1},
          {k:'Held for', v:r.mpt.toFixed(1), u:'s', s:mptGood?1:mptOk?0.7:0.3},
          {k:'Steadiness', v:r.steadiness.toFixed(2), u:'st sd', s:r.steadiness<1.2?1:0.5}
        ])+
        '<div class="note cy" style="margin-top:12px"><span class="l">Reading</span>'+
        'Your modal pitch is <b>'+Math.round(r.modalHz)+' Hz</b>. For reference, adult male voices commonly sit around 110–120 Hz and adult female voices around 200–210 Hz — but there is a very wide normal range and where you sit is not better or worse, it is just your instrument.<br><br>'+
        '<b>Breath support:</b> '+(mptGood?'Strong. Above eighteen seconds is good support — you should not be running out of air at the end of sentences.':
          mptOk?'Solid. Twelve to eighteen seconds is a normal range. The volume-floor drill will still be worth doing.':
          'Short. Under twelve seconds usually means the breath is running out before the sentence does, which is the most common cause of trailing off. The warmup rack and the volume-floor drill both target this directly.')+'</div>';
      passBanner(true);
    }, {maxSec:26});
  }

  /* ---------- 3 · glide ---------- */
  function sGlide(){
    step(3,'Your range',
      'On an <b>“ooo”</b> or a lip trill, slide from the lowest note you can comfortably make up to the highest, and back down. Two or three passes.',
      'This sets the pitch tracker\'s search window. It currently searches the entire human range for every user, which is exactly what causes octave errors — hearing 110 Hz as 220, or the reverse. Narrowing it to your actual range is the biggest single accuracy improvement in the app.');
    hint('Comfortable range only. Do not chase your extremes — the app wants your usable range, not your record.');
    foot('Next →');
    wireRecorder(function(){
      var r=Audio.analyseGlide();
      if(!r || r.empty || r.semitones<4){
        $('#result').innerHTML='<div class="note no" style="margin-top:14px"><span class="l">Not enough movement</span>'+
          'Less than four semitones of travel was detected. Try again and make the slide obvious — go properly low, then properly high.</div>'; return;
      }
      R.lowHz=r.lowHz; R.highHz=r.highHz; R.semitones=r.semitones;
      var b={lo:Math.max(50,Math.min(160,r.lowHz*0.72)), hi:Math.max(240,Math.min(900,r.highHz*1.55))};
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        UI.readouts([
          {k:'Low', v:Math.round(r.lowHz), u:'Hz', s:1},
          {k:'High', v:Math.round(r.highHz), u:'Hz', s:1},
          {k:'Range', v:r.semitones.toFixed(1), u:'st', s:r.semitones>=12?1:0.7},
          {k:'Octaves', v:(r.semitones/12).toFixed(1), u:'', s:0.8}
        ])+
        '<div class="note ok" style="margin-top:12px"><span class="l">Tracker narrowed</span>'+
        'Search window is now <b>'+Math.round(b.lo)+'–'+Math.round(b.hi)+' Hz</b> instead of 60–900. '+
        'That is roughly a '+Math.round((1-(b.hi-b.lo)/840)*100)+'% narrower search, which means substantially fewer octave errors on every rep from here on — and it runs faster too.</div>';
      passBanner(true);
    }, {maxSec:22});
  }

  /* ---------- 4 · sibilants ---------- */
  function sSibilant(){
    step(4,'Articulation',
      'A long <b>“ssssss”</b> for two seconds. <span class="pz">⟨ pause ⟩</span> Then a long <b>“shhhhh”</b> for two seconds.',
      'These two sounds are made a few millimetres apart in the mouth, and the distance between them is one of the clearest measurable markers of articulation precision. Leave a clear gap between them so the app can tell where one ends and the other begins.',
      '<div class="note" style="margin-bottom:14px"><span class="l">Read this before you see the number</span>'+
      'What comes back is a frequency measurement and nothing more. It is not a diagnosis, it cannot be one, and a browser is not qualified to make one. '+
      'Accents, vocal tract size and microphone placement all move this number legitimately. If it flags something, the only thing that means is that the sibilant drills are worth your time.</div>');
    hint('Steady and even. Do not run the two sounds together — the gap is what makes this measurable.');
    foot('Next →');
    wireRecorder(function(){
      var r=Audio.analyseSibilants();
      if(!r){ $('#result').innerHTML='<div class="note no" style="margin-top:14px">Nothing captured. Try again.</div>'; return; }
      if(r.tooFew){
        $('#result').innerHTML='<div class="note no" style="margin-top:14px"><span class="l">Could not separate the two sounds</span>'+
          'The app needs two distinct stretches of sound with a clear gap between them. Try again: hold the "sss" for a full two seconds, stop completely for a beat, then hold the "shh" for two seconds.</div>';
        return;
      }
      R.sibilant={sHz:r.sHz, shHz:r.shHz, ratio:r.ratio, flag:r.flag};
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        UI.readouts([
          {k:'/s/ centre', v:(r.sHz/1000).toFixed(1), u:'kHz', s:1},
          {k:'/ʃ/ centre', v:(r.shHz/1000).toFixed(1), u:'kHz', s:1},
          {k:'Separation', v:r.ratio.toFixed(2), u:'×', s:r.flag==='ok'?1:r.flag==='soft'?0.6:0.3}
        ])+
        '<div class="note '+(r.flag==='ok'?'ok':r.flag==='soft'?'':'cy')+'" style="margin-top:12px">'+
        '<span class="l">What this number is</span>'+esc(r.verdict)+
        '<br><br><span class="dim">The separation ratio is what matters rather than the absolute frequencies — absolute values shift with vocal tract size, so a larger person legitimately reads lower on both. Typical separation is around 1.6–2.2×.</span></div>'+
        (r.flag!=='ok'?'<div class="row" style="margin-top:12px">'+
          '<button class="btn sec sm" data-drill="twisters" data-arg="sib">Open the sibilant rack</button>'+
          '<button class="btn gh sm" id="calRetry">Re-record this step</button></div>':'');
      var rt=$('#calRetry'); if(rt) rt.onclick=function(){ D.redo(); };
    }, {maxSec:9, spectra:true});
  }

  /* ---------- 5,6,7 · the same sentence, three ways ----------
     This is the heart of it. Flat is not the same number for everyone —
     one person's completely unemphasised speech already carries six
     semitones, another's carries two. Measuring the FLOOR is what makes
     everything above it meaningful.                                    */
  function readStep(n, key, title, instruction, why, hintTxt, tone){
    step(n, title, instruction, why,
      '<p class="utter xs" style="margin:0 0 14px;color:var(--ink)">“'+esc(CAL_LINE)+'”</p>');
    hint(hintTxt);
    foot(n===7?'Finish →':'Next →');
    wireRecorder(function(a){
      var r=Audio.analyseNatural(a, UI.words(CAL_LINE));
      if(!r){ $('#result').innerHTML='<div class="note no" style="margin-top:14px">Nothing captured. Try again.</div>'; return; }
      R[key]=r;
      var cmp='';
      if(key==='natural' && R.flat){
        var d=r.span-R.flat.span;
        cmp='<div class="note '+(d>1.5?'ok':'')+'" style="margin-top:12px"><span class="l">Against your flat</span>'+
          (d>0.4? 'You added <b>'+d.toFixed(1)+' semitones</b> of movement over your flat read. That gap is the thing this app trains.'
                : 'Almost identical to your flat read ('+d.toFixed(1)+' st difference). Your conversational voice is running very close to your floor — which is normal, and it is exactly the gap the drills open up.')+'</div>';
      }
      if(key==='expressive' && R.flat){
        var span=r.span-R.flat.span;
        cmp='<div class="note ok" style="margin-top:12px"><span class="l">Your demonstrated range</span>'+
          'From <b>'+R.flat.span.toFixed(1)+'</b> flat to <b>'+r.span.toFixed(1)+'</b> at full expression — <b>'+span.toFixed(1)+' semitones</b> of travel available to you on demand.'+
          (R.natural? ' In normal conversation you use about <b>'+Math.round(Math.max(0,Math.min(100,(R.natural.span-R.flat.span)/Math.max(0.5,span)*100)))+'%</b> of it.' : '')+'</div>';
      }
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        UI.readouts([
          {k:'Pace', v:Math.round(r.wpm), u:'wpm', s:0.8},
          {k:'Range', v:r.span.toFixed(1), u:'st', s:0.8},
          {k:'Terminal', v:(r.term>0?'+':'')+r.term.toFixed(1), u:'st', s:0.8},
          {k:'Dynamics', v:r.dyn.toFixed(1), u:'dB', s:0.8},
          {k:'Silence', v:Math.round(r.pauseFrac), u:'%', s:0.8}
        ])+cmp;
      passBanner(true);
    }, {maxSec:24});
  }

  function sFlat(){
    readStep(5,'flat','Your flat — the floor',
      'Read it with <b>absolutely no expression</b>. Deliberately dull. Like you are reading a serial number out loud and would rather not be.',
      'This is the measurement that makes all the others mean something. "Flat" is not the same number for everyone — a naturally melodic voice can be completely disengaged and still carry six semitones, while another voice sits at two. Without knowing <em>your</em> floor, every span figure afterwards is measured against a population average instead of against you.',
      'Genuinely flat. Bored. If it sounds slightly wrong to say it this way, that is the correct amount of wrong.');
  }
  function sNatural(){
    readStep(6,'natural','How you actually talk',
      'Now the same sentence <b>the way you would really say it</b> to a colleague. Not performed, not careful — just normal.',
      'Your habit. The gap between this and your flat read is how much expression you currently deploy without thinking about it, and that is the number the drills move.',
      'Normal voice. This is the one step where trying hard makes the measurement worse.');
  }
  function sExpressive(){
    readStep(7,'expressive','Your ceiling',
      'Same sentence one more time, with <b>as much colour as you would ever use</b>. Push it further than feels comfortable.',
      'Your demonstrated ceiling in actual speech — different from the glide, which measures singing range. The distance between your flat and this is your real working range, and how much of it you use day to day is the single most useful number in your profile.',
      'Overdo it. Practice happens at the edges; performance lands at about sixty percent of them.');
  }

  /* ---------- done ---------- */
  function finish(){
    var p=S.saveProfile(R);
    S.addXp(80, 'voice calibration');
    var n=p.natural, sb=p.sibilant;
    var b=Audio.bounds();

    function row(k,v,note){
      return '<div style="display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-top:1px solid var(--line)">'+
        '<span class="dim2" style="font-size:13.5px">'+k+'</span>'+
        '<span style="text-align:right"><b class="mono" style="font-size:14px">'+v+'</b>'+
        (note?'<br><span class="tiny dim">'+note+'</span>':'')+'</span></div>';
    }

    body('<div style="max-width:640px;margin:6px auto 0">'+
      '<div class="cue"><span class="tone">Calibrated</span></div>'+
      '<h2 style="font-size:27px;letter-spacing:-.025em;margin:0 0 8px">Your voice profile</h2>'+
      '<p class="dim2" style="font-size:15px;margin-bottom:20px">Saved. The engine is now tuned to this voice and this room, and every score from here is measured against it.</p>'+

      '<div class="card">'+
      '<p class="lbl" style="margin-bottom:4px">The instrument</p>'+
      (p.modalHz?row('Modal pitch', Math.round(p.modalHz)+' Hz', 'your resting note'):'')+
      (p.lowHz?row('Usable range', Math.round(p.lowHz)+'–'+Math.round(p.highHz)+' Hz',
        (p.semitones||0).toFixed(1)+' semitones · '+((p.semitones||0)/12).toFixed(1)+' octaves'):'')+
      (p.mpt?row('Breath support', p.mpt.toFixed(1)+' s', p.mpt>=18?'strong':p.mpt>=12?'normal':'short — work the volume floor'):'')+
      (sb?row('Sibilant separation', sb.ratio.toFixed(2)+'×',
        Math.round(sb.sHz/100)/10+' kHz vs '+Math.round(sb.shHz/100)/10+' kHz'):'')+
      (p.noiseDb!=null?row('Room noise floor', Math.round(p.noiseDb)+' dB', p.noiseDb<-54?'quiet':'some background'):'')+
      '</div>'+

      (p.flat && p.expressive ? (function(){
        var fl=p.flat, ex=p.expressive, na=n||fl;
        var travel=Math.max(0.1, ex.span-fl.span);
        var used=Math.max(0,Math.min(100,(na.span-fl.span)/travel*100));
        return '<div class="card" style="margin-top:12px">'+
        '<p class="lbl" style="margin-bottom:10px">Your three-point range — the important one</p>'+
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:14px">'+
        ['<div class="ro"><p class="k">Flat</p><div class="v" style="font-size:19px">'+fl.span.toFixed(1)+'<span class="u">st</span></div><p class="t">your floor</p></div>',
         '<div class="ro warn"><p class="k">Natural</p><div class="v" style="font-size:19px">'+na.span.toFixed(1)+'<span class="u">st</span></div><p class="t">your habit</p></div>',
         '<div class="ro good"><p class="k">Full colour</p><div class="v" style="font-size:19px">'+ex.span.toFixed(1)+'<span class="u">st</span></div><p class="t">your ceiling</p></div>'].join('')+
        '</div>'+
        '<div class="meter" style="height:9px"><i style="width:'+used.toFixed(0)+'%"></i></div>'+
        '<p class="tiny dim2" style="margin:9px 0 0">You have <b style="color:var(--ink)">'+travel.toFixed(1)+' semitones</b> of movement available on demand, and in normal conversation you use about <b style="color:var(--ink)">'+Math.round(used)+'%</b> of it. '+
        'Closing that gap is what the training is, and it is measured against <em>your</em> floor — not against anyone else\'s.</p>'+
        '</div>';
      })() : '')+

      (n?'<div class="card" style="margin-top:12px">'+
      '<p class="lbl" style="margin-bottom:4px">How you naturally speak</p>'+
      row('Pace', Math.round(n.wpm)+' wpm', 'persuasive band is 148–174')+
      row('Pitch range', n.span.toFixed(1)+' st',
        (p.flat? 'your flat is '+p.flat.span.toFixed(1)+' — so you add '+(n.span-p.flat.span).toFixed(1)+' without thinking'
               : n.span<4?'under 4 reads as monotone':'engaged'))+
      row('Terminal', (n.term>0?'+':'')+n.term.toFixed(1)+' st', n.term<-2?'you fall — good':n.term>1?'you tend to rise on statements':'you tend to end flat')+
      row('Dynamics', n.dyn.toFixed(1)+' dB', n.dyn<4?'flat — most people are':'good variation')+
      row('Silence', Math.round(n.pauseFrac)+'%', '15–25% is healthy')+
      '</div>':'')+

      '<div class="note ok" style="margin-top:14px"><span class="l">What changed under the hood</span>'+
      'Pitch tracker now searches <b>'+Math.round(b.lo)+'–'+Math.round(b.hi)+' Hz</b> instead of 60–900. '+
      'Octave-error correction is anchored to your modal pitch rather than to each utterance\'s own median. '+
      'Every rep from here gets a second readout showing movement against these numbers.</div>'+

      (n && n.term>-1 ?'<div class="note acc" style="margin-top:10px"><span class="l">Your first target</span>'+
       'Your natural terminal is '+(n.term>1?'rising':'flat')+' at '+(n.term>0?'+':'')+n.term.toFixed(1)+' semitones. '+
       'That is the highest-leverage single habit to change, and the Terminal Trainer exists for exactly it. Start there.</div>':'')+

      (p.flat && p.expressive && n && (n.span-p.flat.span) < (p.expressive.span-p.flat.span)*0.4
       ?'<div class="note acc" style="margin-top:10px"><span class="l">Your first target</span>'+
        'You demonstrated '+(p.expressive.span-p.flat.span).toFixed(1)+' semitones of range on demand, but you only use '+
        Math.round((n.span-p.flat.span)/Math.max(0.5,p.expressive.span-p.flat.span)*100)+'% of it when you actually talk. '+
        'That is not a capacity problem — the range is already there. It is a deployment habit, and the Monotone Killer is the drill that closes it. '+
        'The trick worth knowing: widen the movement while keeping your average pitch <em>low</em>. Most people raise their whole voice instead, which reads as anxious rather than engaged.</div>':'')+

      '<div class="row" style="margin-top:20px">'+
      '<button class="btn big" onclick="Drill.close();Drill.launch(\'warmup\')">Now do the warmup →</button>'+
      '<button class="btn gh" onclick="Drill.close()">Done</button></div>'+
      '<p class="tiny dim" style="margin-top:14px">Re-run this any time from Progress. Worth doing again if you change microphone or room, or if you are ill.</p>'+
      '</div>');
    hint(''); foot('Done', false);
    D.next=close;
  }

  draw();
}

/* ============================================================
   MODE: CUSTOM LINE
   Drills the line the advisor was just given, in the tone it
   recommended — then the runner-up, so the choice gets trained
   and not just the execution.
   ============================================================ */
function mCustom(){
  var res = (typeof CP!=='undefined' && CP.res) ? CP.res : null;
  if(!res || !res.line){
    UI.toast('Write a line in Custom Prompt first'); UI.go('coach'); return;
  }
  var primary=res.ranked[0].tone;
  var alt=res.ranked[1]?res.ranked[1].tone:null;
  var items=[
    {t:primary, l:res.line, tag:'Recommended'},
    {t:primary, l:res.line, tag:'Again — tighter'},
    {t:primary, l:res.line, tag:'Third rep'}
  ];
  if(alt) items.push({t:alt, l:res.line, tag:'Now the alternative'});
  items.push({t:primary, l:res.line, tag:'Back to the recommendation'});

  D={i:0};
  open('Your line · '+primary.name, items.length);

  function draw(){
    if(D.i>=items.length) return customEnd();
    var it=items[D.i], t=it.t;
    var notes = D.i===0 ? deliveryNotes(res) : [];
    body('<div class="cue">'+toneChip(t)+
      '<span class="chip tiny">'+esc(it.tag)+'</span>'+
      (t.id!==primary.id?'<span class="chip cy tiny">compare against the recommendation</span>':'')+'</div>'+
      '<p class="tiny dim2" style="margin:-6px 0 14px;max-width:70ch"><b style="color:var(--ink)">Cue:</b> '+esc(t.cue)+'</p>'+
      '<p class="utter sm">'+(t.id===primary.id? markLine(res) : esc(res.line))+'</p>'+
      refRow(t, res.line)+
      (notes.length?'<div class="note acc" style="margin-bottom:14px">'+
        notes.slice(0,3).map(function(n){ return '<b>'+esc(n.k)+':</b> '+esc(n.v); }).join('<br>')+'</div>':'')+
      (t.id!==primary.id?'<div class="note cy" style="margin-bottom:14px"><span class="l">Why this rep matters</span>'+
        'Same words, different intent. Being able to hear the gap between two plausible tones on your own sentence is the skill — picking the right one is downstream of being able to tell them apart.</div>':'')+
      targetPills(t)+
      recPanel({h:130}));
    hint('<b>'+esc(t.recipe.terminal)+'</b>');
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var r=Audio.scoreAgainstTone(a, t, UI.words(it.l), S.raw().prefs.personalTargets);
      if(!r) return;
      var xp=S.recordRep(t.id, r.score, {wpm:r.wpm, span:a.span, term:a.term, floorDrop:a.floorDrop, baseHz:a.baseline, drill:D&&D.name?D.name:null});
      D.results.push({tone:t, score:r.score, isAlt:t.id!==primary.id});
      $('#result').innerHTML='<hr style="margin:20px 0 18px">'+
        '<div class="scorewrap">'+UI.ring(r.score)+
        '<div class="verdict"><h3>'+verdictTitle(r.score)+'</h3><p>'+verdictLine(r.score, t)+'</p>'+
        '<p class="tiny dim" style="margin-top:6px">+'+xp+' xp · '+esc(t.name)+' mastery '+S.masteryOf(t.id)+'%</p></div></div>'+
        UI.readouts(r.parts)+baselineStrip(r)+UI.faultList(r.faults, r.wins);
      keepClip(t, r.score, it.l);
      passBanner(r.score>=72);
    }, {maxSec:26});
  }
  function customEnd(){
    var main=D.results.filter(function(x){return !x.isAlt;}).map(function(x){return x.score;});
    var altS=D.results.filter(function(x){return x.isAlt;}).map(function(x){return x.score;});
    var avg=main.length?Math.round(main.reduce(function(a,b){return a+b;},0)/main.length):0;
    var first=main[0], last=main[main.length-1];
    end(avg+' on your line',
      (main.length>1 && last>first ? 'Went from '+first+' to '+last+' across the session — that is the rep working. ' : '')+
      (altS.length? 'You also ran it as '+alt.name+'. Play both back if you recorded them: the words never changed, and that gap is entirely tone. ' : '')+
      'Save the scenario in Custom Prompt and it will be here next time.',
      'custom line');
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: WARMUP
   ============================================================ */
function mWarmup(){
  var steps=TWISTERS.filter(function(t){return t.c==='warmup';});
  D={i:0};
  open('The Warmup', steps.length);
  function draw(){
    if(D.i>=steps.length){
      S.raw().counters.warmups++; S.addXp(30,'warmup complete'); S.save();
      return end('Warm.', 'Voice is online. Straw phonation and lip trills keep working for several minutes — go straight into a drill while it lasts.');
    }
    var s=steps[D.i];
    body('<div class="cue"><span class="tone">Step '+(D.i+1)+'</span><span class="chip tiny">'+esc((s.tg||[]).join(' '))+'</span></div>'+
      '<p class="utter sm">'+esc(s.t)+'</p>'+
      '<div class="note cy"><span class="l">Why this one</span>'+esc(s.why)+'</div>'+
      '<div class="row" style="margin-top:16px"><button class="btn" id="doneStep">Done → next</button>'+
      '<button class="btn gh" id="skipStep">Skip</button></div>');
    hint('Take your time. There is no scoring here — the warmup is mechanical.');
    foot('Next →');
    $('#doneStep').onclick=function(){ D.i++; draw(); };
    $('#skipStep').onclick=function(){ D.i++; draw(); };
    D.space=function(){ D.i++; draw(); };
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; draw(); };
  draw();
}

/* ============================================================
   MODE: TONE LAB  (also powers weak-spots and family drills)
   ============================================================ */
function mToneLab(arg){
  var pool;
  if(arg && arg.indexOf('fam:')===0) pool=TONES.filter(function(t){return t.fam===arg.slice(4) && S.tierUnlocked(t.tier);});
  else if(arg && TONE_BY_ID[arg]) pool=[TONE_BY_ID[arg]];
  else if(arg==='weak') pool=S.weakQueue(8);
  else pool=UI.shuffle(unlockedTones().filter(function(t){return t.fam!=='defect';})).slice(0,8);
  if(!pool.length) pool=[TONE_BY_ID.neutral];

  var items=[];
  pool.forEach(function(t){
    var lines=UI.shuffle(t.lines).slice(0, pool.length===1?6:2);
    lines.forEach(function(l){ items.push({t:t, l:l}); });
  });
  items = pool.length===1 ? items : UI.shuffle(items).slice(0,12);

  D={i:0};
  open(arg==='weak'?'Weak Spots':(pool.length===1?pool[0].name:'Tone Lab'), items.length);

  function draw(){
    if(D.i>=items.length) return summary();
    var it=items[D.i], t=it.t;
    body(cueBlock(t)+targetPills(t)+
      '<p class="utter">'+esc(it.l)+'</p>'+
      refRow(t, it.l)+
      recPanel({label:'ready', h:140}));
    hint('<b>Non-negotiable:</b> '+esc(t.recipe.terminal));
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var r=Audio.scoreAgainstTone(a, t, UI.words(it.l), S.raw().prefs.personalTargets);
      if(!r) return;
      if(S.raw().prefs.hardMode) r.score=Math.max(0, Math.round(r.score*0.88));
      var xp=S.recordRep(t.id, r.score, {wpm:r.wpm, span:a.span, term:a.term, floorDrop:a.floorDrop, baseHz:a.baseline, drill:D&&D.name?D.name:null});
      S.noteMetric('span', a.span); S.noteMetric('term', a.term);
      D.results.push({tone:t, score:r.score});
      $('#result').innerHTML=
        '<hr style="margin:20px 0 18px">'+
        '<div class="scorewrap">'+UI.ring(r.score)+
        '<div class="verdict"><h3>'+verdictTitle(r.score)+'</h3><p>'+verdictLine(r.score, t)+'</p>'+
        '<p class="tiny dim" style="margin-top:6px">+'+xp+' xp · mastery on '+esc(t.name)+' now '+S.masteryOf(t.id)+'%'+
        (r.personalised?' · <span style="color:var(--cy)">personal bands</span>':'')+'</p></div></div>'+
        UI.readouts(r.parts)+baselineStrip(r)+UI.faultList(r.faults, r.wins)+fairnessStrip(t, r.score, a);
      $('#recNote').textContent='Press R to redo, → for next.';
      keepClip(t, r.score, it.l);
      passBanner(r.score>=72);
    }, {maxSec:22});
    D.next=function(){ D.i++; draw(); };
    D.prev=function(){ if(D.i>0){D.i--; draw();} };
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };

  function summary(){
    var sc=D.results.map(function(r){return r.score;});
    var avg=sc.length? Math.round(sc.reduce(function(a,b){return a+b;},0)/sc.length) : 0;
    var worst=D.results.slice().sort(function(a,b){return a.score-b.score;})[0];
    end(avg+' average', sc.length?
      ('Best rep '+Math.max.apply(null,sc)+'. Weakest was '+esc(worst.tone.name)+' at '+worst.score+
       '. '+(avg>=85?'That is performance level — try hard mode.':avg>=70?'Solid. Push the parameter with the lowest readout.':'Work the terminal first. It carries more weight than anything else in the score.')) :
      'No scored reps this session.');
  }
  draw();
}
function verdictTitle(s){ return s>=92?'Excellent':s>=82?'Strong':s>=70?'Solid':s>=55?'Getting there':s>=38?'Off target':'Not yet'; }
function verdictLine(s,t){
  return s>=92 ? 'That is a clean production of '+t.name+'. Do it twice more so it sticks.'
    : s>=82 ? 'Very close. Look at the lowest readout and exaggerate that one parameter on the next rep.'
    : s>=70 ? 'The shape is right. Now make it consistent — consistency matters more than depth.'
    : s>=55 ? 'Partly there. Read the cue again and produce the physical setup before you speak.'
    : 'Reset. Read the recipe, do the physical cue first, then say it deliberately over-done. You can dial it back later.';
}

/* ============================================================
   MODE: TERMINAL TRAINER
   ============================================================ */
function mTerminal(){
  var wants=['fall','fall','rise','fall','flat','fall','rise','fall','fall','rise','fall','fall'];
  var pool=POOLS.discovery.lines.concat(POOLS.close.lines, POOLS.pitch.lines, POOLS.everyday.lines);
  var items=wants.map(function(w){ return {w:w, l:UI.rnd(pool)}; });
  D={i:0};
  open('Terminal Trainer', items.length);
  var LBL={fall:'END IT DOWN', rise:'END IT UP', flat:'HOLD IT LEVEL'};
  var DESC={
    fall:'Falling terminal. A statement that closes. Target 4–7 semitones down, and keep the volume up all the way to the last consonant.',
    rise:'Rising terminal. A genuine question. Target at least 3 semitones up, starting from a low point.',
    flat:'Level terminal. Suspended — "there is more coming". Stay within about 1.5 semitones either way.'};
  function draw(){
    if(D.i>=items.length) return summaryScores('Terminal Trainer');
    var it=items[D.i];
    var col = it.w==='fall'?'var(--vi)':it.w==='rise'?'var(--cy)':'var(--muted)';
    body('<div class="cue"><span class="tone" style="background:transparent;border-color:'+col+';color:'+col+'">'+LBL[it.w]+'</span></div>'+
      '<p class="tiny dim2" style="margin:-6px 0 16px;max-width:66ch">'+esc(DESC[it.w])+'</p>'+
      '<p class="utter">'+esc(it.l)+'</p>'+
      recPanel({h:150}));
    hint('The last three words are the whole drill. Everything before them is a run-up.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var r=Audio.scoreTerminal(a, it.w);
      S.recordRep('__terminal', r.score, {term:a.term});
      S.noteMetric('term', a.term);
      D.results.push({score:r.score, w:it.w});
      var arrow = a.term<=-1?'↓':a.term>=1?'↑':'→';
      $('#result').innerHTML='<hr style="margin:20px 0 16px">'+
        '<div class="scorewrap">'+UI.ring(r.score, it.w)+
        '<div class="verdict"><h3>'+arrow+' '+(a.term>0?'+':'')+a.term.toFixed(1)+' semitones</h3><p>'+esc(r.msg)+'</p></div></div>'+
        UI.readouts([
          {k:'Terminal move',v:(a.term>0?'+':'')+a.term.toFixed(1),u:'st',s:r.ok?1:0.25},
          {k:'Peak → end',v:a.nucFall.toFixed(1),u:'st',s:0.7},
          {k:'Final energy',v:a.floorDrop.toFixed(1),u:'dB drop',s:a.floorDrop<4?1:0.3},
          {k:'Range',v:a.span.toFixed(1),u:'st',s:a.span>=4?1:0.3}
        ])+
        (a.floorDrop>4.5?UI.faultList([{t:'bad',b:'You trailed off',s:'A fall in pitch is not the same as a fall in energy. Keep the intensity within 4 dB of the average right through the last consonant.'}]):'');
      passBanner(!!r.ok);
    }, {maxSec:14});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: MONOTONE KILLER
   ============================================================ */
function mMonotone(){
  var lines=POOLS.speaking.lines.concat(POOLS.pitch.lines, TONE_BY_ID.d_mono.lines);
  var targets=[5,6,7,8,9,10,8,11,9,12];
  var items=targets.map(function(t){ return {t:t, l:UI.rnd(lines)}; });
  D={i:0};
  open('Monotone Killer', items.length);
  function draw(){
    if(D.i>=items.length) return summaryScores('Monotone Killer');
    var it=items[D.i];
    body('<div class="cue"><span class="tone">Target '+it.t+' semitones of range</span></div>'+
      '<div class="note cy" style="margin-bottom:16px"><span class="l">The whole trick</span>'+
      'Widen the movement <b>without raising your average pitch</b>. Range and register are independent dials, and almost everyone moves them together. '+
      'If your mean climbs while your range widens, you have produced anxiety rather than engagement.</div>'+
      '<p class="utter sm">'+esc(it.l)+'</p>'+recPanel({h:160}));
    hint('Under 4 semitones is monotone. 6–10 is engaged. Over 14 is theatrical.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var r=Audio.scoreRange(a, it.t);
      var sc=Math.round(Math.min(100, a.span/it.t*100));
      S.recordRep('__range', sc, {span:a.span});
      S.noteMetric('span', a.span);
      D.results.push({score:sc});
      $('#result').innerHTML='<hr style="margin:20px 0 16px">'+
        '<div class="scorewrap">'+UI.ring(sc,'range')+
        '<div class="verdict"><h3>'+a.span.toFixed(1)+' semitones</h3><p>'+esc(r.msg)+
        (a.span>=10?' ':'')+'</p><p class="tiny dim" style="margin-top:5px">Mean pitch '+Math.round(a.baseline)+' Hz. '+
        'Watch that this does not climb as your range widens.</p></div></div>'+
        UI.readouts([
          {k:'Range',v:a.span.toFixed(1),u:'st',s:a.span/it.t,band:[it.t,it.t+4]},
          {k:'Low point',v:a.lowSt.toFixed(1),u:'st',s:.7},
          {k:'High point',v:a.highSt.toFixed(1),u:'st',s:.7},
          {k:'Base',v:Math.round(a.baseline),u:'Hz',s:.7}
        ]);
      passBanner(a.span>=it.t);
    }, {maxSec:16});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: PACE GYM
   ============================================================ */
function mPace(){
  var bands=[[100,130],[148,174],[175,205],[85,115],[148,174],[120,145],[160,190],[95,125]];
  var labels=['Deliberate','Persuasive','Urgent','Grave','Persuasive','Conversational','Brisk','Consequence'];
  var pool=POOLS.pitch.lines.concat(POOLS.speaking.lines, POOLS.leadership.lines);
  var items=bands.map(function(b,i){ return {b:b, n:labels[i], l:UI.rnd(pool)}; });
  D={i:0};
  open('Pace Gym', items.length);
  function draw(){
    if(D.i>=items.length) return summaryScores('Pace Gym');
    var it=items[D.i], w=UI.words(it.l);
    var lo=(w/it.b[1]*60), hi=(w/it.b[0]*60);
    body('<div class="cue"><span class="tone">'+esc(it.n)+' · '+it.b[0]+'–'+it.b[1]+' wpm</span>'+
      '<span class="chip tiny">'+w+' words → '+lo.toFixed(1)+'–'+hi.toFixed(1)+' seconds</span></div>'+
      '<p class="utter sm">'+esc(it.l)+'</p>'+
      '<div class="pacer" id="pacer"></div>'+
      recPanel({h:130}));
    hint('Keep your pitch floor while you change the rate. Urgency is <b>fast and low</b>; panic is fast and high.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    drawPacer(it.b);
    wireRecorder(function(a){
      var r=Audio.scorePace(a, w, it.b);
      S.recordRep('__pace', r.score, {wpm:r.val});
      D.results.push({score:r.score});
      $('#result').innerHTML='<hr style="margin:20px 0 16px">'+
        '<div class="scorewrap">'+UI.ring(r.score,'pace')+
        '<div class="verdict"><h3>'+r.val+' words per minute</h3><p>'+esc(r.msg)+'</p></div></div>'+
        UI.readouts([
          {k:'Rate',v:r.val,u:'wpm',s:r.ok?1:.3,band:it.b},
          {k:'Duration',v:a.dur.toFixed(1),u:'s',s:.7},
          {k:'Silence',v:Math.round(a.pauseFrac),u:'%',s:a.pauseFrac>=12?1:.4,band:[15,25]},
          {k:'Pauses',v:a.pauseCount,u:'',s:.7}
        ])+
        (a.pauseFrac<10?UI.faultList([{t:'warn',b:'Rate without pause',s:'You can hit a word count and still sound rushed. Under 10% silence is the acoustic signature of rushing regardless of wpm.'}]):'');
      passBanner(!!r.ok);
    }, {maxSec:26});
  }
  function drawPacer(band){
    var p=$('#pacer'); if(!p) return;
    var min=70, max=230;
    function X(v){ return (v-min)/(max-min)*100; }
    var h='<div class="zone" style="left:'+X(band[0])+'%;width:'+(X(band[1])-X(band[0]))+'%"></div>';
    [80,110,140,170,200].forEach(function(v){ h+='<div class="tk" style="left:'+X(v)+'%"></div><div class="lb" style="left:'+X(v)+'%">'+v+'</div>'; });
    h+='<div class="nd" id="paceNd" style="left:0%"></div>';
    p.innerHTML=h;
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: PAUSE DISCIPLINE
   ============================================================ */
function mPause(){
  var items=UI.shuffle(PAUSE_DRILLS).slice(0,8);
  D={i:0};
  open('Pause Discipline', items.length);
  function parse(t){
    var wanted=[], parts=[];
    var re=/⟨(\d+)⟩/g, m, last=0;
    while((m=re.exec(t))){
      parts.push({txt:t.slice(last,m.index)});
      wanted.push(parseInt(m[1],10)/10);
      parts.push({pause:parseInt(m[1],10)/10});
      last=m.index+m[0].length;
    }
    parts.push({txt:t.slice(last)});
    return {wanted:wanted, parts:parts};
  }
  function draw(){
    if(D.i>=items.length) return summaryScores('Pause Discipline');
    var it=items[D.i], p=parse(it.t);
    var html=p.parts.map(function(x){
      return x.pause!=null ? '<span class="pz">⟨ '+x.pause.toFixed(1)+'s ⟩</span>' : esc(x.txt);
    }).join('');
    body('<div class="cue"><span class="tone">'+esc(it.tag)+'</span>'+
      '<span class="chip tiny">'+p.wanted.length+' pause'+(p.wanted.length>1?'s':'')+'</span></div>'+
      '<p class="utter sm">'+html+'</p>'+
      '<div class="note cy"><span class="l">Why</span>'+esc(it.why)+'</div>'+
      recPanel({h:130}));
    hint('Below 200 ms nothing is heard as a pause at all. Count them out — they feel three times longer from the inside.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var r=Audio.scorePauses(a, p.wanted);
      S.recordRep('__pause', r.score, {});
      if(a.maxPause>=2) S.noteMetric('pause', a.maxPause);
      D.results.push({score:r.score});
      var rows=r.rows.map(function(row,i){
        var g = row.got==null ? '—' : row.got.toFixed(2)+'s';
        return '<div class="ro '+(row.ok?'good':'bad')+'"><p class="k">Pause '+(i+1)+'</p>'+
          '<div class="v">'+g+'</div><p class="t">want '+row.want.toFixed(1)+'s</p></div>';
      }).join('');
      $('#result').innerHTML='<hr style="margin:20px 0 16px">'+
        '<div class="scorewrap">'+UI.ring(r.score,'pauses')+
        '<div class="verdict"><h3>'+r.hit+' of '+r.total+' held</h3>'+
        '<p>'+(r.hit===r.total?'All held. That is harder than it looks — most people cut the long ones by half.':
          'The gaps you missed were almost certainly too short. Silence feels roughly three times longer to the speaker than to the listener.')+'</p></div></div>'+
        '<div class="readout">'+rows+'</div>'+
        UI.readouts([
          {k:'Longest gap',v:a.maxPause.toFixed(2),u:'s',s:.7},
          {k:'Silence',v:Math.round(a.pauseFrac),u:'%',s:a.pauseFrac>=15?1:.4,band:[15,25]},
          {k:'Gaps found',v:a.pauseCount,u:'',s:.7},
          {k:'Duration',v:a.dur.toFixed(1),u:'s',s:.7}
        ]);
    }, {maxSec:32});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: VOLUME FLOOR
   ============================================================ */
function mFloor(){
  var pool=TONE_BY_ID.d_trail.lines.concat(POOLS.pitch.lines, POOLS.close.lines);
  var items=UI.shuffle(pool).slice(0,10);
  D={i:0};
  open('Volume Floor', items.length);
  function draw(){
    if(D.i>=items.length) return summaryScores('Volume Floor');
    body('<div class="cue"><span class="tone">Hold the energy to the last consonant</span></div>'+
      '<div class="note no" style="margin-bottom:16px"><span class="l">The distinction</span>'+
      'A correct falling terminal and "trailing off" both drop in pitch. The difference is that a correct fall <b>keeps its intensity and its voicing</b> to the very end. '+
      'Target: final syllables within <b>4 dB</b> of the utterance average.</div>'+
      '<p class="utter sm">'+esc(items[D.i])+'</p>'+recPanel({h:140}));
    hint('If you run out of air at the end, you breathed too late. Take it one clause earlier.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var r=Audio.scoreFloor(a);
      S.recordRep('__floor', r.score, {floorDrop:a.floorDrop, term:a.term});
      D.results.push({score:r.score});
      $('#result').innerHTML='<hr style="margin:20px 0 16px">'+
        '<div class="scorewrap">'+UI.ring(r.score,'hold')+
        '<div class="verdict"><h3>'+a.floorDrop.toFixed(1)+' dB drop</h3><p>'+esc(r.msg)+
        (a.term<-1 && r.ok ? ' And you still fell in pitch — that is the combination you want.' :
         a.term>-1 ? ' Note you did not fall in pitch either. Both have to happen.' : '')+'</p></div></div>'+
        UI.readouts([
          {k:'Final drop',v:a.floorDrop.toFixed(1),u:'dB',s:r.ok?1:.25,band:[0,4]},
          {k:'Terminal',v:(a.term>0?'+':'')+a.term.toFixed(1),u:'st',s:a.term<-2?1:.4},
          {k:'Fry',v:Math.round(a.fryPct),u:'%',s:a.fryPct<25?1:.3},
          {k:'Dynamics',v:a.dyn.toFixed(1),u:'dB',s:.7}
        ])+
        (a.fryPct>28?UI.faultList([{t:'warn',b:'Creak at the end',s:'You dropped below your modal floor on '+Math.round(a.fryPct)+'% of voiced frames. That is a breath problem — take the breath at the previous clause boundary.'}]):'');
      passBanner(!!r.ok);
    }, {maxSec:16});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: ARTICULATION GYM
   ============================================================ */
function mTwisters(arg){
  var pool = arg && TWISTER_CATS[arg] ? TWISTERS.filter(function(t){return t.c===arg;}) : TWISTERS.filter(function(t){return t.c!=='warmup';});
  var items=UI.shuffle(pool).slice(0, Math.min(10, pool.length));
  var LADDER=[60,80,100,120,145];
  D={i:0, rung:0, clean:0};
  open('Articulation'+(arg?' · '+TWISTER_CATS[arg].name:''), items.length);
  var metro=null;
  function stopMetro(){ if(metro){ clearInterval(metro.t); try{metro.ctx.close();}catch(e){} metro=null; } }
  function startMetro(bpm){
    stopMetro();
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    var c=new AC();
    metro={ctx:c, t:setInterval(function(){
      var o=c.createOscillator(), g=c.createGain();
      o.frequency.value=1400; g.gain.value=0.0001;
      o.connect(g); g.connect(c.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.09, c.currentTime+0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime+0.06);
      o.stop(c.currentTime+0.08);
    }, 60000/bpm)};
  }
  function draw(){
    if(D.i>=items.length){ stopMetro(); return end('Articulation done',
      'Cleared '+D.clean+' of '+items.length+'. Anything you failed, drop a rung and get three clean reps before you climb again.'); }
    var t=items[D.i], id=twId(t);
    var st=S.raw().twisters[id]||{cleared:false,bpm:0,reps:0};
    var diff='';
    for(var k=0;k<5;k++) diff+='<i'+(k<t.d?' class="f"':'')+'></i>';
    body('<div class="cue"><span class="tone">'+esc(TWISTER_CATS[t.c].name)+'</span>'+
      '<span class="chip tiny">'+esc((t.tg||[]).join(' '))+'</span>'+
      '<span class="twdiff" style="padding-top:0">'+diff+'</span>'+
      (st.cleared?'<span class="chip ok tiny">cleared at '+st.bpm+'</span>':'')+'</div>'+
      '<p class="utter sm">'+esc(t.t)+'</p>'+
      '<div class="note vi"><span class="l">Why it is hard</span>'+esc(t.why)+'</div>'+
      '<div class="row" style="margin:16px 0 0">'+
      '<span class="lbl">Speed ladder</span>'+
      '<div class="seg" id="ladder">'+LADDER.map(function(b,i){
        return '<button data-b="'+i+'"'+(i===D.rung?' class="on"':'')+'>'+b+' bpm</button>'; }).join('')+'</div>'+
      '<button class="btn sec sm" id="metroBtn">▶ Metronome</button>'+
      '</div>'+
      '<div class="row" style="margin-top:16px">'+
      '<button class="btn" id="cleanBtn">✓ Three clean reps</button>'+
      '<button class="btn gh" id="failBtn">✕ Broke it</button>'+
      '<button class="btn sec" id="recTw">● Record it</button></div>'+
      '<div id="result"></div>');
    hint('Say it slowly and perfectly three times before you speed up. Speed built on a wrong motor pattern just locks the mistake in.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    $('#ladder').onclick=function(e){ var b=e.target.closest('button[data-b]'); if(!b) return;
      D.rung=+b.dataset.b; UI.$$('#ladder button').forEach(function(x){x.classList.remove('on');}); b.classList.add('on');
      if(metro) startMetro(LADDER[D.rung]); };
    $('#metroBtn').onclick=function(){ if(metro){ stopMetro(); this.textContent='▶ Metronome'; }
      else { startMetro(LADDER[D.rung]); this.textContent='■ Stop'; } };
    $('#cleanBtn').onclick=function(){
      var s=S.raw().twisters[id]||(S.raw().twisters[id]={cleared:false,bpm:0,reps:0});
      s.reps+=3;
      if(!s.cleared){ S.raw().counters.twCleared++; }
      s.cleared=true; s.bpm=Math.max(s.bpm, LADDER[D.rung]);
      D.clean++;
      if(t.c==='brutal'){
        var allBrutal=TWISTERS.filter(function(x){return x.c==='brutal';});
        if(allBrutal.every(function(x){ var q=S.raw().twisters[twId(x)]; return q&&q.cleared; })) S.noteMetric('brutal',1);
      }
      S.recordRep('__artic', null, {}); S.addXp(12, esc(t.t.slice(0,26))+'…');
      if(D.rung<LADDER.length-1){ D.rung++; UI.toast('Rung up → <b>'+LADDER[D.rung]+' bpm</b>'); }
      D.i++; draw();
    };
    $('#failBtn').onclick=function(){ if(D.rung>0) D.rung--; D.i++; draw(); };
    $('#recTw').onclick=function(){
      UI.needMic().then(function(ok){ if(!ok) return;
        if(Audio.isCapturing()){ var a=Audio.endCapture(); Audio.snapshot();
          $('#recTw').textContent='● Record it';
          $('#result').innerHTML='<div class="playbar" style="margin-top:16px">'+
            '<button class="playbtn" id="pbBtn">▶</button><div class="wavewrap"><canvas id="pbWave"></canvas></div>'+
            '<span class="tiny dim mono">'+(a&&a.dur?a.dur.toFixed(1)+'s':'')+'</span></div>'+
            '<p class="tiny dim" style="margin-top:9px">Listen for smeared consonants and inserted vowels. Those are the two failure modes and they are obvious on playback and invisible live.</p>';
          UI.drawWave($('#pbWave'), Audio.waveform(150));
          $('#pbBtn').onclick=function(){ Audio.play(); };
        } else { Audio.beginCapture(); $('#recTw').textContent='■ Stop'; }
      });
    };
    D.space=function(){ $('#cleanBtn').click(); };
  }
  D.next=function(){ stopMetro(); D.i++; draw(); };
  D.prev=function(){ if(D.i>0){ stopMetro(); D.i--; draw(); } };
  D.restart=function(){ stopMetro(); D.i=0; D.clean=0; draw(); };
  draw();
}
function twId(t){ return t.c+'|'+t.t.slice(0,34); }

/* ============================================================
   MODE: EMPHASIS SHIFT
   ============================================================ */
function mEmphasis(){
  var items=[];
  UI.shuffle(EMPHASIS).slice(0,5).forEach(function(e){
    e.w.forEach(function(_,i){ if(e.m[i]) items.push({e:e, k:i}); });
  });
  D={i:0};
  open('Emphasis Shift', items.length);
  function draw(){
    if(D.i>=items.length) return summaryScores('Emphasis Shift');
    var it=items[D.i], e=it.e;
    var sentence=e.w.map(function(w,i){
      return i===it.k ? '<span class="em">'+esc(w)+'</span>' : '<span'+(i>it.k?' class="soft"':'')+'>'+esc(w)+'</span>';
    }).join(' ');
    body('<div class="cue"><span class="tone">Stress word '+(it.k+1)+': “'+esc(e.w[it.k])+'”</span></div>'+
      '<p class="utter">'+sentence+'</p>'+
      '<div class="note acc"><span class="l">What it now means</span>'+esc(e.m[it.k])+'</div>'+
      '<div class="note cy" style="margin-top:10px"><span class="l">Do this too</span>'+
      'Hit the marked word — and then <b>compress everything after it</b>. Drop your pitch range and your volume for the rest of the sentence. '+
      'That is post-focus compression, and it improves how clearly the listener identifies your emphasis by twenty-five to thirty percentage points.</div>'+
      recPanel({h:130}));
    hint('One accent per phrase. If two words feel emphasised, you have produced shouting.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var sc=Math.round(Math.min(100,
        (a.span>=4?36:a.span*9) +
        (a.dyn>=5?26:a.dyn*5) +
        (a.pauseFrac>=8?18:a.pauseFrac*2) +
        (a.floorDrop<5?20:6) ));
      S.recordRep('__emph', sc, {span:a.span, term:a.term});
      D.results.push({score:sc});
      $('#result').innerHTML='<hr style="margin:20px 0 16px">'+
        '<div class="scorewrap">'+UI.ring(sc,'prominence')+
        '<div class="verdict"><h3>'+(sc>=78?'Clear prominence':sc>=55?'Some prominence':'Too flat to read')+'</h3>'+
        '<p>Prominence is a composite of pitch excursion, extra duration on the stressed syllable, and about 3 dB of extra intensity. '+
        'Play it back and check that you can hear which word you hit.</p></div></div>'+
        UI.readouts([
          {k:'Range',v:a.span.toFixed(1),u:'st',s:a.span>=4?1:.3,band:[4,12]},
          {k:'Dynamics',v:a.dyn.toFixed(1),u:'dB',s:a.dyn>=5?1:.35,band:[5,14]},
          {k:'Terminal',v:(a.term>0?'+':'')+a.term.toFixed(1),u:'st',s:.7},
          {k:'Held to end',v:a.floorDrop.toFixed(1),u:'dB',s:a.floorDrop<5?1:.3}
        ])+
        '<p class="tiny dim" style="margin-top:12px">'+esc(e.note)+'</p>';
    }, {maxSec:14});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: CONTOUR TRACER
   ============================================================ */
function mContour(){
  var items=UI.shuffle(CONTOURS).slice(0,8);
  D={i:0};
  open('Contour Tracer', items.length);
  function draw(){
    if(D.i>=items.length) return summaryScores('Contour Tracer');
    var c=items[D.i];
    body('<div class="cue"><span class="tone">'+esc(c.name)+'</span>'+
      '<span class="chip tiny">difficulty '+c.diff+'/5</span></div>'+
      '<p class="utter sm">'+esc(c.line)+'</p>'+
      '<div class="tracer" style="margin-bottom:14px"><canvas id="ctC"></canvas></div>'+
      '<div class="note cy"><span class="l">The shape</span>'+esc(c.why)+'</div>'+
      recPanel({h:120}));
    hint('Try it first on a single "ooo" with no words. Get the shape, then put the words on it.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    setTimeout(function(){ UI.drawContour($('#ctC'), c.pts, null, {h:190}); },30);
    wireRecorder(function(a){
      var tr=Audio.contourTrace(a);
      var r=Audio.scoreContour(tr, c.pts);
      S.recordRep('__contour', r.score, {span:a.span, term:a.term});
      D.results.push({score:r.score});
      UI.drawContour($('#ctC'), c.pts, tr, {h:190});
      $('#result').innerHTML='<hr style="margin:20px 0 16px">'+
        '<div class="scorewrap">'+UI.ring(r.score,'match')+
        '<div class="verdict"><h3>'+(r.score>=80?'Matched':r.score>=55?'Close':'Not the shape')+'</h3><p>'+esc(r.msg)+'</p>'+
        '<p class="tiny dim" style="margin-top:5px">Your line is gold, the target is dashed grey.</p></div></div>'+
        UI.readouts([
          {k:'Match',v:r.score,u:'%',s:r.score/100},
          {k:'Range',v:a.span.toFixed(1),u:'st',s:a.span>=4?1:.3},
          {k:'Terminal',v:(a.term>0?'+':'')+a.term.toFixed(1),u:'st',s:.7},
          {k:'Duration',v:a.dur.toFixed(1),u:'s',s:.7}
        ]);
    }, {maxSec:14});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: SCRIPT RUNNER
   ============================================================ */
function mScript(arg){
  var sc = SCRIPTS.filter(function(s){return s.id===arg;})[0] || SCRIPTS[0];
  D={i:0, scored:[]};
  open(sc.name, sc.lines.length);
  function draw(){
    if(D.i>=sc.lines.length){
      S.raw().counters.scripts++; S.save(); S.checkAch();
      return summaryScores(sc.name);
    }
    var t=TONE_BY_ID[sc.lines[D.i][0]]||TONE_BY_ID.neutral;
    var tele=sc.lines.map(function(l,i){
      var tt=TONE_BY_ID[l[0]]||TONE_BY_ID.neutral;
      var cls = i===D.i?'cur' : i<D.i?'past':'';
      return '<p class="ln '+cls+'"><span class="tn">'+esc(tt.name)+'</span>'+esc(l[1])+'</p>';
    }).join('');
    body('<div class="cue"><span class="tone">'+esc(t.name)+'</span>'+
      '<span class="chip tiny">'+esc(sc.domain)+'</span>'+
      '<span class="chip tiny">line '+(D.i+1)+' of '+sc.lines.length+'</span></div>'+
      '<p class="tiny dim2" style="margin:-6px 0 12px"><b style="color:var(--ink)">Cue:</b> '+esc(t.cue)+'</p>'+
      '<div class="tele" id="tele" style="max-height:230px;overflow:hidden">'+tele+'</div>'+
      recPanel({h:120}));
    hint('<b>'+esc(t.recipe.terminal)+'</b>');
    foot(D.i===sc.lines.length-1?'Finish →':'Next line →');
    setTimeout(function(){ var cur=UI.$('.ln.cur'); if(cur) cur.scrollIntoView({block:'center', behavior:'auto'}); },20);
    wireRecorder(function(a){
      var r=Audio.scoreAgainstTone(a, t, UI.words(sc.lines[D.i][1]), S.raw().prefs.personalTargets);
      if(!r) return;
      S.recordRep(t.id, r.score, {wpm:r.wpm, span:a.span, term:a.term, floorDrop:a.floorDrop, baseHz:a.baseline, drill:D&&D.name?D.name:null});
      D.results.push({score:r.score, tone:t});
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        '<div class="scorewrap">'+UI.ring(r.score)+
        '<div class="verdict"><h3>'+verdictTitle(r.score)+'</h3><p>'+verdictLine(r.score,t)+'</p></div></div>'+
        UI.readouts(r.parts)+UI.faultList(r.faults.slice(0,2), r.wins.slice(0,1));
      passBanner(r.score>=70);
    }, {maxSec:24});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: TONE ROULETTE
   ============================================================ */
function mRoulette(){
  var pool=unlockedTones().filter(function(t){return t.fam!=='defect';});
  var allLines=[]; Object.keys(POOLS).forEach(function(k){ allLines=allLines.concat(POOLS[k].lines); });
  var items=[]; for(var i=0;i<14;i++) items.push({t:UI.rnd(pool), l:UI.rnd(allLines)});
  D={i:0};
  open('Tone Roulette', items.length);
  function draw(){
    if(D.i>=items.length) return summaryScores('Tone Roulette');
    var it=items[D.i];
    body('<div class="cue"><span class="tone">'+esc(it.t.name)+'</span>'+
      '<span class="chip tiny">'+esc(FAMILIES[it.t.fam].name)+'</span></div>'+
      '<p class="utter">'+esc(it.l)+'</p>'+
      '<p class="tiny dim" style="margin:-6px 0 14px">No preparation. Say it now, in that tone. This is the actual live skill.</p>'+
      recPanel({h:120}));
    hint('Cue is hidden on purpose. Press <kbd>H</kbd> if you genuinely need it.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    var shown=false;
    document.onkeydown=null;
    wireRecorder(function(a){
      var r=Audio.scoreAgainstTone(a, it.t, UI.words(it.l), S.raw().prefs.personalTargets);
      if(!r) return;
      S.recordRep(it.t.id, r.score, {wpm:r.wpm, span:a.span, term:a.term, floorDrop:a.floorDrop, baseHz:a.baseline, drill:D&&D.name?D.name:null});
      D.results.push({score:r.score, tone:it.t});
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        '<div class="scorewrap">'+UI.ring(r.score)+
        '<div class="verdict"><h3>'+verdictTitle(r.score)+'</h3>'+
        '<p><b style="color:var(--ink)">Cue was:</b> '+esc(it.t.cue)+'</p></div></div>'+
        UI.readouts(r.parts)+baselineStrip(r)+UI.faultList(r.faults.slice(0,2));
      passBanner(true);
    }, {maxSec:16});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: A/B COMPARE
   ============================================================ */
function mAB(){
  var pool=unlockedTones().filter(function(t){return t.fam!=='defect';});
  var lines=POOLS.everyday.lines.concat(POOLS.pitch.lines, POOLS.close.lines);
  var items=[];
  for(var i=0;i<5;i++){
    var a=UI.rnd(pool), b=UI.rnd(pool.filter(function(x){return x.id!==a.id;}));
    items.push({a:a, b:b, l:UI.rnd(lines)});
  }
  D={i:0, slot:0, recs:[]};
  open('A/B Compare', items.length);
  function draw(){
    if(D.i>=items.length) return end('Done', 'Recording yourself is the coaching. Real-time self-perception is unreliable — you hear your own voice through bone conduction, which is a different signal from the one everybody else receives.');
    var it=items[D.i];
    var t = D.slot===0 ? it.a : it.b;
    body('<div class="cue"><span class="tone">'+(D.slot===0?'A':'B')+' · '+esc(t.name)+'</span>'+
      '<span class="chip tiny">then the same line as '+esc(D.slot===0?it.b.name:it.a.name)+'</span></div>'+
      '<p class="tiny dim2" style="margin:-6px 0 14px"><b style="color:var(--ink)">Cue:</b> '+esc(t.cue)+'</p>'+
      '<p class="utter">'+esc(it.l)+'</p>'+
      recPanel({h:120})+
      '<div id="abSlots" style="margin-top:16px"></div>');
    hint(D.slot===0?'Record version A, then you will do the same words as a different tone.':'Now B. Same words. Everything else changes.');
    foot(D.slot===0?'Skip to B →':'Next pair →');
    paintSlots();
    wireRecorder(function(an){
      var r=Audio.scoreAgainstTone(an, t, UI.words(it.l));
      Audio.snapshot();
      D.recs[D.slot]={buf:true, wav:Audio.exportWav(), tone:t, a:an, r:r};
      S.recordRep(t.id, r?r.score:null, r?{wpm:r.wpm,span:an.span,term:an.term,floorDrop:an.floorDrop}:{});
      if(r) D.results.push({score:r.score, tone:t});
      $('#result').innerHTML='<div class="note ok" style="margin-top:16px"><span class="l">Captured '+(D.slot===0?'A':'B')+'</span>'+
        (r? ('Score '+r.score+' · range '+an.span.toFixed(1)+' st · terminal '+(an.term>0?'+':'')+an.term.toFixed(1)+' st · '+Math.round(r.wpm)+' wpm') : '')+'</div>';
      paintSlots();
      if(D.slot===0){ setTimeout(function(){ D.slot=1; draw(); }, 1300); }
      else { setTimeout(paintSlots, 100); }
    }, {maxSec:16});
  }
  function paintSlots(){
    var w=$('#abSlots'); if(!w) return;
    var h='';
    [0,1].forEach(function(k){
      var rec=D.recs[k];
      h+='<div class="playbar" style="margin-top:9px"><button class="playbtn" data-ab="'+k+'"'+(rec?'':' style="opacity:.3"')+'>▶</button>'+
         '<div style="flex:1;min-width:0"><b style="font-size:13.5px">'+(k===0?'A':'B')+' · '+esc(rec?rec.tone.name:(k===0?items[D.i].a.name:items[D.i].b.name))+'</b>'+
         '<div class="tiny dim">'+(rec&&rec.r?('score '+rec.r.score+' · '+rec.a.span.toFixed(1)+' st range · terminal '+(rec.a.term>0?'+':'')+rec.a.term.toFixed(1)):'not recorded yet')+'</div></div></div>';
    });
    if(D.recs[0]&&D.recs[1]){
      h+='<div class="note cy" style="margin-top:12px"><span class="l">Listen for</span>'+
      'The words are identical. Play A then B and notice how much of the meaning came from tone alone. That gap is what you are training.</div>';
    }
    w.innerHTML=h;
    UI.$$('#abSlots [data-ab]').forEach(function(b){
      b.onclick=function(){
        var rec=D.recs[+b.dataset.ab]; if(!rec||!rec.wav) return;
        var au=new window.Audio(URL.createObjectURL(rec.wav)); au.play();
      };
    });
  }
  D.next=function(){ if(D.slot===0){D.slot=1;} else {D.slot=0; D.recs=[]; D.i++;} draw(); };
  D.prev=function(){ if(D.slot===1){D.slot=0;} else if(D.i>0){D.i--; D.slot=0; D.recs=[];} draw(); };
  D.restart=function(){ D.i=0; D.slot=0; D.recs=[]; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: EAR TRAINING
   ============================================================ */
function mEar(){
  var pool=unlockedTones().filter(function(t){return t.fam!=='defect';});
  var lines=POOLS.everyday.lines.concat(POOLS.close.lines);
  D={i:0, phase:'rec', bank:[]};
  var ROUNDS=6;
  open('Ear Training', ROUNDS*2);
  function draw(){
    if(D.phase==='rec'){
      if(D.bank.length>=ROUNDS){ D.phase='quiz'; D.i=0; return draw(); }
      var t=UI.rnd(pool.filter(function(x){ return !D.bank.some(function(b){return b.tone.id===x.id;}); }));
      var l=UI.rnd(lines);
      body('<div class="cue"><span class="tone">Record '+(D.bank.length+1)+' of '+ROUNDS+'</span>'+
        '<span class="chip tiny">'+esc(t.name)+'</span></div>'+
        '<p class="tiny dim2" style="margin:-6px 0 14px"><b style="color:var(--ink)">Cue:</b> '+esc(t.cue)+'</p>'+
        '<p class="utter sm">'+esc(l)+'</p>'+
        '<div class="note vi" style="margin-bottom:14px"><span class="l">Phase one</span>'+
        'Record six lines in six different tones. Then the app plays them back in a random order and you have to identify which was which. '+
        'It is much harder than it sounds, and it is the skill that lets you correct yourself live.</div>'+
        recPanel({h:110}));
      hint('Produce the tone properly — you are building the test material.');
      foot('Skip →');
      wireRecorder(function(a){
        Audio.snapshot();
        D.bank.push({tone:t, line:l, wav:Audio.exportWav()});
        S.recordRep(t.id, null, {});
        $('#result').innerHTML='<div class="note ok" style="margin-top:14px"><span class="l">Banked</span>'+
          (D.bank.length)+' of '+ROUNDS+' recorded.</div>';
        setTimeout(function(){ if(D) draw(); }, 900);
      }, {maxSec:12});
      D.i=D.bank.length;
    } else {
      var order=D.order||(D.order=UI.shuffle(D.bank.map(function(_,i){return i;})));
      if(D.i>=order.length) return summaryScores('Ear Training');
      var item=D.bank[order[D.i]];
      var opts=UI.shuffle(D.bank.map(function(b){return b.tone;}));
      body('<div class="cue"><span class="tone">Which tone was this?</span>'+
        '<span class="chip tiny">'+(D.i+1)+' of '+order.length+'</span></div>'+
        '<div class="playbar" style="margin:0 0 18px"><button class="playbtn" id="earPlay">▶</button>'+
        '<div style="flex:1"><b style="font-size:14px">“'+esc(item.line)+'”</b>'+
        '<div class="tiny dim">Play it as many times as you like.</div></div></div>'+
        '<div class="grid gauto-s" id="earOpts">'+opts.map(function(o){
          return '<button class="btn sec" data-ear="'+o.id+'" style="justify-content:flex-start;text-align:left;padding:11px 14px">'+esc(o.name)+'</button>';
        }).join('')+'</div><div id="result"></div>');
      hint('Listen for terminal direction first, then range, then pace. That is the diagnostic order.');
      foot(D.i===order.length-1?'Finish →':'Next →');
      var au=null;
      $('#earPlay').onclick=function(){ if(au) au.pause(); au=new window.Audio(URL.createObjectURL(item.wav)); au.play(); };
      setTimeout(function(){ $('#earPlay').click(); }, 300);
      $('#earOpts').onclick=function(e){
        var b=e.target.closest('[data-ear]'); if(!b) return;
        var right = b.dataset.ear===item.tone.id;
        UI.$$('#earOpts button').forEach(function(x){
          x.disabled=true;
          if(x.dataset.ear===item.tone.id){ x.style.borderColor='var(--ok)'; x.style.background='var(--ok-wash)'; }
          else if(x===b){ x.style.borderColor='var(--no)'; x.style.background='var(--no-wash)'; }
        });
        D.results.push({score: right?100:0});
        S.recordRep('__ear', right?100:0, {});
        $('#result').innerHTML='<div class="note '+(right?'ok':'no')+'" style="margin-top:16px"><span class="l">'+(right?'Correct':'That was '+esc(item.tone.name))+'</span>'+
          esc(item.tone.conveys)+' — '+esc(item.tone.recipe.terminal)+'</div>';
        setTimeout(function(){ if(D) D.next(); }, 2400);
      };
    }
  }
  D.next=function(){ if(D.phase==='rec'){ draw(); } else { D.i++; draw(); } };
  D.prev=function(){ if(D.phase==='quiz'&&D.i>0){D.i--; draw();} };
  D.restart=function(){ D={i:0,phase:'rec',bank:[],results:[],next:D.next,prev:D.prev,restart:D.restart,total:ROUNDS*2,name:'Ear Training',t0:Date.now()}; draw(); };
  draw();
}

/* ============================================================
   MODE: DEFECT LAB
   ============================================================ */
function mDefect(){
  var defs=TONES.filter(function(t){return t.fam==='defect';});
  var items=[];
  defs.forEach(function(d){
    var l=UI.rnd(d.lines);
    items.push({d:d, l:l, mode:'produce'});
    items.push({d:d, l:l, mode:'fix'});
  });
  D={i:0};
  open('The Defect Lab', items.length);
  var FIXTONE={d_uptalk:'certainty', d_mono:'sl_certain', d_trail:'absolute', d_hedge:'certainty', d_fry:'certainty'};
  function draw(){
    if(D.i>=items.length) return summaryScores('The Defect Lab');
    var it=items[D.i];
    if(it.mode==='produce'){
      body('<div class="cue"><span class="tone" style="background:var(--no-wash);border-color:var(--no);color:var(--no)">Produce the defect: '+esc(it.d.name.replace(' (on purpose)',''))+'</span></div>'+
        '<p class="utter sm">'+esc(it.l)+'</p>'+
        '<div class="note no"><span class="l">Do it deliberately</span>'+esc(it.d.cue)+'<br><br>'+
        '<b>Why this works:</b> you cannot reliably avoid a habit you cannot reproduce on purpose. Producing it voluntarily converts it from an involuntary tic into a switch you control.</div>'+
        recPanel({h:120}));
      hint('Exaggerate. The point is to feel it clearly from the inside.');
    } else {
      var ft=TONE_BY_ID[FIXTONE[it.d.id]]||TONE_BY_ID.certainty;
      body('<div class="cue"><span class="tone" style="background:var(--ok-wash);border-color:var(--ok);color:var(--ok)">Now the fix: '+esc(ft.name)+'</span></div>'+
        '<p class="utter sm">'+esc(it.l)+'</p>'+
        '<div class="note ok"><span class="l">The correction</span>'+esc(it.d.antidote)+'</div>'+
        recPanel({h:120}));
      hint('Identical words. Everything else changes. That contrast is the whole lesson.');
    }
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var target = it.mode==='produce' ? it.d : (TONE_BY_ID[FIXTONE[it.d.id]]||TONE_BY_ID.certainty);
      var r=Audio.scoreAgainstTone(a, target, UI.words(it.l));
      if(!r) return;
      if(it.mode==='fix') S.recordRep(target.id, r.score, {wpm:r.wpm,span:a.span,term:a.term,floorDrop:a.floorDrop});
      else S.recordRep('__defect', r.score, {});
      D.results.push({score:r.score});
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        '<div class="scorewrap">'+UI.ring(r.score, it.mode==='produce'?'defect':'fix')+
        '<div class="verdict"><h3>'+(it.mode==='produce'?'Defect produced':'Correction')+'</h3>'+
        '<p>'+(it.mode==='produce'?'Good. Now play it back and listen to what it does to the claim — then do the identical sentence with the fix.':'Play both back. The gap between them is what you are training.')+'</p></div></div>'+
        UI.readouts(r.parts);
    }, {maxSec:16});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: COLD READ
   ============================================================ */
var COLD=[
'The committee met for the third time in six weeks and reached the same conclusion it had reached twice before, which was that no conclusion could reasonably be reached until the survey data arrived. The survey data had been due in March.',
'There is a particular kind of quiet that settles over an office at about ten past six, once the last of the day people have gone and before the cleaners arrive, and in twelve years I have never once found it unpleasant.',
'Three things changed that year, and only one of them was planned. The planned one cost us four hundred thousand pounds and delivered almost nothing. The other two cost nothing at all and are the reason the business still exists.',
'It takes roughly nine minutes to walk from the station to the site, and in that nine minutes you pass a bakery, two betting shops, a launderette that has been closing down since 2011, and the exact spot where the whole thing started.',
'She had a habit, when she was thinking, of turning her pen over and over between two fingers, and everyone in that building knew that when the pen stopped moving somebody was about to be told something they did not want to hear.',
'The instructions are clear enough. Remove the panel. Disconnect the two grey cables, not the black one. Wait ninety seconds. Reconnect in the reverse order. The number of people who have got this wrong is genuinely difficult to believe.',
'We assume, most of the time, that the loudest voice in a meeting is the most confident one. In my experience it is almost always the least certain, and the person you actually need to listen to has not said anything for twenty minutes.',
'On the fourteenth we sent the letter. On the sixteenth they replied. On the twentieth their solicitor replied to the reply. By the end of the month the cost of the correspondence had exceeded the value of the thing being corresponded about.',
'What nobody tells you about doing this for a living is how much of it is waiting. Not waiting nervously — just waiting. Sitting in a car outside a building, at eight in the morning, with a coffee going cold in the holder.',
'The problem was never the technology. It was that four separate teams each believed a different team was responsible for the same decision, and all four were quite sure the matter had already been settled.'
];
function mCold(){
  var pool=unlockedTones().filter(function(t){return t.fam!=='defect';});
  var items=[]; for(var i=0;i<5;i++) items.push({t:UI.rnd(pool), txt:UI.rnd(COLD)});
  D={i:0};
  open('Cold Read', items.length);
  function draw(){
    if(D.i>=items.length) return summaryScores('Cold Read');
    var it=items[D.i];
    body('<div class="cue"><span class="tone">'+esc(it.t.name)+'</span>'+
      '<span class="chip tiny">unseen text · no prep</span></div>'+
      '<p class="utter xs">'+esc(it.txt)+'</p>'+
      recPanel({h:120}));
    hint('Do not read it silently first. Hit record and go. That is the drill.');
    foot(D.i===items.length-1?'Finish →':'Next →');
    wireRecorder(function(a){
      var r=Audio.scoreAgainstTone(a, it.t, UI.words(it.txt), S.raw().prefs.personalTargets);
      if(!r) return;
      S.recordRep(it.t.id, r.score, {wpm:r.wpm,span:a.span,term:a.term,floorDrop:a.floorDrop,baseHz:a.baseline, drill:D&&D.name?D.name:null});
      D.results.push({score:r.score, tone:it.t});
      $('#result').innerHTML='<hr style="margin:18px 0 14px">'+
        '<div class="scorewrap">'+UI.ring(r.score)+
        '<div class="verdict"><h3>'+verdictTitle(r.score)+'</h3>'+
        '<p>Long-form is different physics. Vary at the <b>sentence</b> level rather than the word level, and breathe at the syntactic boundaries — under fifteen percent of your breaths should land mid-phrase.</p></div></div>'+
        UI.readouts(r.parts)+UI.faultList(r.faults.slice(0,3), r.wins.slice(0,1));
    }, {maxSec:60});
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){ if(D.i>0){D.i--; draw();} };
  D.restart=function(){ D.i=0; D.results=[]; draw(); };
  draw();
}

/* ============================================================
   MODE: THE GAUNTLET
   ============================================================ */
function mGauntlet(){
  var pool=unlockedTones().filter(function(t){return t.fam!=='defect';});
  var allLines=[]; Object.keys(POOLS).forEach(function(k){ allLines=allLines.concat(POOLS[k].lines); });
  var ch=[];
  ch.push({k:'tone', t:UI.rnd(pool), l:UI.rnd(allLines)});
  ch.push({k:'term', w:'fall', l:UI.rnd(POOLS.close.lines)});
  ch.push({k:'range', target:8, l:UI.rnd(POOLS.speaking.lines)});
  ch.push({k:'tone', t:UI.rnd(pool), l:UI.rnd(allLines)});
  ch.push({k:'pace', b:[148,174], l:UI.rnd(POOLS.pitch.lines)});
  ch.push({k:'term', w:'rise', l:UI.rnd(POOLS.discovery.lines)});
  ch.push({k:'contour', c:UI.rnd(CONTOURS.filter(function(x){return x.diff<=3;}))});
  ch.push({k:'tone', t:UI.rnd(pool), l:UI.rnd(allLines)});
  ch.push({k:'floor', l:UI.rnd(POOLS.leadership.lines)});
  ch.push({k:'pause', p:UI.rnd(PAUSE_DRILLS)});
  ch.push({k:'tone', t:UI.rnd(pool), l:UI.rnd(allLines)});
  ch.push({k:'term', w:'fall', l:UI.rnd(POOLS.leadership.lines)});
  D={i:0};
  open('The Gauntlet', ch.length);
  var TITLES={tone:'Tone match', term:'Terminal', range:'Range', pace:'Pace', contour:'Contour', floor:'Volume floor', pause:'Pause'};
  function draw(){
    if(D.i>=ch.length) return gauntletEnd();
    var c=ch[D.i], head, sub='', line='', extra='';
    if(c.k==='tone'){ head=c.t.name; sub=c.t.cue; line=c.l; }
    else if(c.k==='term'){ head=c.w==='fall'?'END IT DOWN':'END IT UP'; sub='Terminal inflection only. Nothing else is scored.'; line=c.l; }
    else if(c.k==='range'){ head='Hit '+c.target+' semitones'; sub='Widen the movement. Keep the mean pitch low.'; line=c.l; }
    else if(c.k==='pace'){ head=c.b[0]+'–'+c.b[1]+' wpm'; sub='Persuasive band. Hit it.'; line=c.l; }
    else if(c.k==='contour'){ head=c.c.name; sub=c.c.why; line=c.c.line; extra='<div class="tracer" style="margin:0 0 14px"><canvas id="gC"></canvas></div>'; }
    else if(c.k==='floor'){ head='Hold the energy'; sub='Fall in pitch without falling in volume. Under 4 dB of final drop.'; line=c.l; }
    else if(c.k==='pause'){ head=c.p.tag; sub=c.p.why; line=c.p.t.replace(/⟨(\d+)⟩/g, function(_,n){ return '⟨ '+(n/10).toFixed(1)+'s ⟩'; }); }

    body('<div class="cue"><span class="tone">'+esc(TITLES[c.k])+'</span>'+
      '<span class="chip acc tiny">'+esc(head)+'</span>'+
      '<span class="chip no tiny">one attempt</span></div>'+
      '<p class="tiny dim2" style="margin:-6px 0 14px;max-width:70ch">'+esc(sub)+'</p>'+
      extra+'<p class="utter sm">'+esc(line)+'</p>'+recPanel({h:110}));
    hint('No retries in the Gauntlet. One shot, then it moves on.');
    foot(D.i===ch.length-1?'Finish →':'Next →');
    if(c.k==='contour') setTimeout(function(){ UI.drawContour($('#gC'), c.c.pts, null, {h:150}); },30);
    wireRecorder(function(a){
      var sc=0, msg='';
      if(c.k==='tone'){ var r=Audio.scoreAgainstTone(a,c.t,UI.words(c.l)); sc=r?r.score:0; msg=r?verdictLine(sc,c.t):'';
        S.recordRep(c.t.id, sc, {wpm:r&&r.wpm,span:a.span,term:a.term,floorDrop:a.floorDrop}); }
      else if(c.k==='term'){ var t2=Audio.scoreTerminal(a,c.w); sc=t2.score; msg=t2.msg; S.recordRep('__terminal',sc,{term:a.term}); }
      else if(c.k==='range'){ sc=Math.round(Math.min(100,a.span/c.target*100)); msg=a.span.toFixed(1)+' semitones.'; S.recordRep('__range',sc,{span:a.span}); }
      else if(c.k==='pace'){ var p2=Audio.scorePace(a,UI.words(c.l),c.b); sc=p2.score; msg=p2.msg; S.recordRep('__pace',sc,{wpm:p2.val}); }
      else if(c.k==='contour'){ var tr=Audio.contourTrace(a); var cr=Audio.scoreContour(tr,c.c.pts); sc=cr.score; msg=cr.msg;
        UI.drawContour($('#gC'), c.c.pts, tr, {h:150}); S.recordRep('__contour',sc,{}); }
      else if(c.k==='floor'){ var f2=Audio.scoreFloor(a); sc=f2.score; msg=f2.msg; S.recordRep('__floor',sc,{floorDrop:a.floorDrop}); }
      else if(c.k==='pause'){ var want=[]; var re=/⟨(\d+)⟩/g,m; while((m=re.exec(c.p.t))) want.push(parseInt(m[1],10)/10);
        var pr=Audio.scorePauses(a,want); sc=pr.score; msg=pr.hit+' of '+pr.total+' pauses held.'; S.recordRep('__pause',sc,{}); }
      D.results.push({score:sc, k:c.k});
      $('#result').innerHTML='<hr style="margin:18px 0 14px"><div class="scorewrap">'+UI.ring(sc)+
        '<div class="verdict"><h3>'+sc+'</h3><p>'+esc(msg)+'</p></div></div>';
      setTimeout(function(){ if(D) D.next(); }, 2200);
    }, {maxSec:26});
  }
  function gauntletEnd(){
    var sc=D.results.map(function(r){return r.score;});
    var avg=sc.length?Math.round(sc.reduce(function(a,b){return a+b;},0)/sc.length):0;
    var s=S.raw();
    s.counters.gauntlets++; if(avg>s.counters.gauntletBest) s.counters.gauntletBest=avg;
    S.addXp(60+Math.round(avg/2),'gauntlet'); S.save(); S.checkAch();
    var byK={}; D.results.forEach(function(r){ (byK[r.k]=byK[r.k]||[]).push(r.score); });
    var rows=Object.keys(byK).map(function(k){
      var v=Math.round(byK[k].reduce(function(a,b){return a+b;},0)/byK[k].length);
      return '<div class="ro '+(v>=80?'good':v>=55?'warn':'bad')+'"><p class="k">'+esc(TITLES[k])+'</p><div class="v">'+v+'</div></div>';
    }).join('');
    body('<div class="dend" style="text-align:center;max-width:640px;margin:30px auto">'+
      UI.ring(avg,'gauntlet')+
      '<h2 style="font-size:28px;margin:18px 0 8px">'+(avg>=85?'Formidable.':avg>=70?'Strong run.':avg>=50?'Respectable.':'Rough one.')+'</h2>'+
      '<p class="dim2" style="font-size:15px">Average '+avg+' across '+sc.length+' challenges. Best ever: '+s.counters.gauntletBest+'.</p>'+
      '<div class="readout" style="margin-top:22px">'+rows+'</div>'+
      '<p class="tiny dim" style="margin-top:20px">The lowest category is your next week of training. Everything else can wait.</p>'+
      '<div class="row" style="justify-content:center;margin-top:20px"><button class="btn" onclick="Drill.launch(\'gauntlet\')">Run it again</button>'+
      '<button class="btn gh" onclick="Drill.close()">Done</button></div></div>');
    hint(''); foot('Done', false);
    D.next=close;
  }
  D.next=function(){ D.i++; draw(); };
  D.prev=function(){};
  D.restart=function(){ launch('gauntlet'); };
  draw();
}

/* ============================================================
   shared endings
   ============================================================ */
function summaryScores(title){
  var sc=(D.results||[]).map(function(r){return r.score;}).filter(function(x){return x!=null;});
  var avg=sc.length?Math.round(sc.reduce(function(a,b){return a+b;},0)/sc.length):0;
  var best=sc.length?Math.max.apply(null,sc):0;
  end(sc.length? (avg+' average') : 'Session done',
    sc.length? ('Best rep '+best+' across '+sc.length+' scored reps. '+
      (avg>=85?'That is performance level. Turn on hard mode in settings.':
       avg>=70?'Consistent. Pick the weakest readout and make that next week\'s single focus.':
       avg>=50?'The shape is forming. One parameter at a time — do not try to fix everything.':
       'Go back to the warmup and the Codex entry for this drill. Mechanics first.')) :
      'No scored reps. Come back with the mic on.', title);
}
function end(title, sub, name){
  var xp=Math.max(15, Math.round((D.results||[]).length*4));
  S.addXp(xp, name||D.name||'session');
  body('<div class="dend" style="text-align:center;max-width:600px;margin:50px auto">'+
    '<h2 style="font-size:34px;letter-spacing:-.03em;margin:0 0 12px">'+esc(title)+'</h2>'+
    '<p class="dim2" style="font-size:16px;max-width:56ch;margin:0 auto">'+esc(sub)+'</p>'+
    '<div class="row" style="justify-content:center;margin-top:26px">'+
    '<button class="btn" onclick="Drill.close()">Done</button>'+
    '<button class="btn gh" onclick="Drill.restart()">Go again</button></div></div>');
  hint(''); foot('Done', false);
  D.next=close;
}

/* ============================================================
   launcher
   ============================================================ */
var MODES={
  calibrate:mCalibrate, custom:mCustom,
  warmup:mWarmup, tonelab:mToneLab, terminal:mTerminal, monotone:mMonotone,
  pace:mPace, pausegym:mPause, floor:mFloor, twisters:mTwisters,
  emphasis:mEmphasis, contour:mContour, script:mScript, roulette:mRoulette,
  ab:mAB, ear:mEar, defect:mDefect, coldread:mCold, gauntlet:mGauntlet,
  weak:function(){ mToneLab('weak'); }
};

function launch(id, arg){
  var mod=MODULES.filter(function(m){return m.id===id;})[0];
  if(mod && !S.tierUnlocked(mod.tier)){
    UI.toast('Locked until level '+S.tierNeed(mod.tier)); return;
  }
  var fn=MODES[id];
  if(!fn){ UI.toast('Unknown drill'); return; }
  var needsMic = id!=='warmup';
  if(needsMic && !Audio.ready()){
    UI.needMic().then(function(){ fn(arg); });
  } else fn(arg);
}

return {launch:launch, close:close, restart:function(){ if(D&&D.restart) D.restart(); }, MODULES:MODULES};
})();
</script>
