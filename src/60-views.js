<script>
/* ============================================================
   VIEWS
   ============================================================ */
'use strict';

(function(){
var esc=UI.esc, $=UI.$;

function modCard(m){
  var locked=!S.tierUnlocked(m.tier);
  return '<button class="mod'+(locked?' locked':'')+'" style="--mc:'+m.c+';--mcw:color-mix(in srgb,'+m.c+' 13%,transparent)" '+
    (locked?'':'data-drill="'+m.id+'"')+'>'+
    (locked?'<span class="lockbadge">lvl '+S.tierNeed(m.tier)+'</span>':'')+
    '<div class="mh"><span class="mi">'+m.ic+'</span><h3>'+esc(m.n)+'</h3></div>'+
    '<p class="md">'+esc(m.d)+'</p>'+
    '<div class="mf"><span>~'+m.mins+' min</span></div></button>';
}

/* ============================================================ HOME */
UI.registerView('home', function(){
  var s=S.raw(), st=S.stats(), p=S.levelProgress();
  var day=PATH[Math.min(89, (s.day||1)-1)];
  var weak=S.weakQueue(4);
  var hour=new Date().getHours();
  var greet = hour<5?'Late one' : hour<12?'Good morning' : hour<18?'Afternoon' : 'Evening';
  var micWarn = Audio.state()==='live' ? '' :
    '<div class="note acc" style="margin-bottom:20px"><span class="l">Microphone</span>'+
    'Nothing here scores until the mic is on. Everything is processed locally in your browser — no audio is uploaded or stored anywhere. '+
    '<button class="btn sm" style="margin-left:8px" data-act="mic">Turn on the mic</button></div>';

  var calWarn = S.profile() ? '' :
    '<div class="note cy" style="margin-bottom:20px"><span class="l">Calibrate first</span>'+
    '<b>Two minutes, five steps, nothing scored.</b> It measures your room\'s noise floor, your register, your usable pitch range and your natural speaking habits — '+
    'then narrows the pitch tracker from the full human range down to yours. Every score you get afterwards is more accurate for it, and you get a baseline to measure movement against. '+
    'Whatever your voice does — accent, register, a lisp, a soft voice — this is where the app learns it.'+
    '<div style="margin-top:11px"><button class="btn sm" data-drill="calibrate">Calibrate my voice</button></div></div>';

  var todayMods = day.mods.map(function(id){
    return MODULES.filter(function(m){return m.id===id;})[0];
  }).filter(Boolean);

  return '<div class="page">'+
  '<div class="phead"><p class="kick">'+esc(greet)+'</p>'+
  '<h1>'+(s.reps===0?'Start with the warmup.':'Day '+s.day+' · '+esc(day.f))+'</h1>'+
  '<p class="lede">'+(s.reps===0?
    'Six minutes of mechanical warmup, then a single neutral sentence into the Tone Lab so the app can see where you actually are. Do not try to fix anything on day one.':
    esc(day.note))+'</p></div>'+

  micWarn+ calWarn+

  '<div class="grid g4" style="margin-bottom:26px">'+
  '<div class="stat acc"><p class="k">Level</p><div class="v">'+p.lvl+'</div><p class="s">'+esc(p.rank)+'</p></div>'+
  '<div class="stat"><p class="k">Streak</p><div class="v">'+s.streak+'<span style="font-size:14px;color:var(--muted)">d</span></div><p class="s">best '+s.bestStreak+'</p></div>'+
  '<div class="stat cy"><p class="k">Reps</p><div class="v">'+s.reps+'</div><p class="s">'+s.scored+' scored</p></div>'+
  '<div class="stat '+(st.avgRecent>=80?'ok':st.avgRecent>=60?'acc':'no')+'"><p class="k">Recent avg</p><div class="v">'+
    (st.avgRecent!=null?Math.round(st.avgRecent):'—')+'</div><p class="s">last 20 reps</p></div>'+
  '</div>'+

  '<div class="sect"><div class="shead"><h2>Today\'s session</h2>'+
  '<span class="n">'+esc(day.f)+'</span></div>'+
  '<p class="sdesc">'+esc(day.note)+'</p>'+
  '<div class="mods">'+todayMods.map(modCard).join('')+'</div>'+
  '<div class="row" style="margin-top:14px">'+
  '<button class="btn" data-act="startday">Start day '+s.day+'</button>'+
  '<button class="btn gh" data-act="markday">Mark day done →</button>'+
  '<button class="btn gh" data-go="path">See the whole path</button></div></div>'+

  (weak.length? '<div class="sect"><div class="shead"><h2>Your weakest tones</h2>'+
  '<span class="n">spaced repetition</span></div>'+
  '<p class="sdesc">Chosen by how low your mastery is and how long since you last touched them. Follow this queue and you will not plateau.</p>'+
  '<div class="grid gauto">'+weak.map(function(t){ return toneCard(t,true); }).join('')+'</div>'+
  '<div class="row" style="margin-top:12px"><button class="btn sec" data-drill="weak">Drill all four</button></div></div>':'')+

  '<div class="sect"><div class="shead"><h2>Quick start</h2></div>'+
  '<div class="mods">'+
  [ MODULES.filter(function(m){return m.id==='warmup';})[0],
    MODULES.filter(function(m){return m.id==='tonelab';})[0],
    MODULES.filter(function(m){return m.id==='terminal';})[0],
    MODULES.filter(function(m){return m.id==='gauntlet';})[0] ].map(modCard).join('')+
  '</div></div>'+

  '</div>';
});
UI.registerView('home:act', function(a){
  var s=S.raw();
  if(a==='mic') UI.needMic().then(function(){ UI.render(); });
  if(a==='startday'){ var d=PATH[Math.min(89,(s.day||1)-1)]; Drill.launch(d.mods[0]); }
  if(a==='markday'){
    s.dayDone[s.day]=true; s.day=Math.min(90,(s.day||1)+1); S.addXp(50,'day complete'); S.save(); S.checkAch(); UI.render();
  }
});

/* ============================================================ MODULES */
UI.registerView('modules', function(){
  return '<div class="page">'+
  '<div class="phead"><p class="kick">Every drill</p><h1>All Drills</h1>'+
  '<p class="lede">Eighteen training modes. Each one isolates a different parameter of the voice and grades it against a measurable target. '+
  'Locked ones open as you level up — not to gate you, but because drilling the Defect Lab before you can produce a clean terminal is wasted time.</p></div>'+
  '<div class="mods">'+MODULES.map(modCard).join('')+'</div>'+
  '<div class="sect"><div class="shead"><h2>Drill a whole family</h2></div>'+
  '<p class="sdesc">Run every unlocked tone in one family back to back. Good for a focused twenty minutes.</p>'+
  '<div class="grid gauto-s">'+Object.keys(FAMILIES).map(function(k){
    var n=TONES.filter(function(t){return t.fam===k && S.tierUnlocked(t.tier);}).length;
    if(!n) return '';
    return '<button class="btn sec" data-drill="tonelab" data-arg="fam:'+k+'" style="justify-content:flex-start;text-align:left;padding:12px 14px;height:100%">'+
      '<span><b style="display:block;font-size:13.5px;color:'+FAMILIES[k].c+'">'+esc(FAMILIES[k].name)+'</b>'+
      '<span class="tiny dim">'+n+' tones unlocked</span></span></button>';
  }).join('')+'</div></div>'+
  '<div class="sect"><div class="shead"><h2>Articulation by phoneme</h2></div>'+
  '<p class="sdesc">Target a specific sound family.</p>'+
  '<div class="grid gauto-s">'+Object.keys(TWISTER_CATS).map(function(k){
    var n=TWISTERS.filter(function(t){return t.c===k;}).length;
    return '<button class="btn sec" data-drill="twisters" data-arg="'+k+'" style="justify-content:flex-start;text-align:left;padding:12px 14px;height:100%">'+
      '<span><b style="display:block;font-size:13.5px;color:'+TWISTER_CATS[k].c+'">'+esc(TWISTER_CATS[k].name)+'</b>'+
      '<span class="tiny dim">'+n+' items</span></span></button>';
  }).join('')+'</div></div>'+
  '</div>';
});

/* ============================================================ TONES */
function toneCard(t, compact){
  var m=S.masteryOf(t.id), locked=!S.tierUnlocked(t.tier);
  return '<button class="tonecard" style="--tc:'+FAMILIES[t.fam].c+'" data-act="tone" data-arg="'+t.id+'"'+(locked?' disabled style="opacity:.45;--tc:'+FAMILIES[t.fam].c+'"':'')+'>'+
    '<div class="tcbar"></div><div class="tcin">'+
    '<div class="tch"><h3>'+esc(t.name)+'</h3>'+
    (locked?'<span class="chip tiny">lvl '+S.tierNeed(t.tier)+'</span>':'<span class="fam">'+esc(FAMILIES[t.fam].name)+'</span>')+'</div>'+
    '<p class="tcv">'+esc(t.conveys)+'</p>'+
    (compact?'':'<div class="tcm">'+
      '<span class="pill">'+t.target.wpm[0]+'–'+t.target.wpm[1]+' wpm</span>'+
      '<span class="pill">'+t.target.span[0]+'–'+t.target.span[1]+' st</span>'+
      '<span class="pill">term '+t.target.term[0]+'…'+t.target.term[1]+'</span></div>')+
    '<div class="mastery"><div class="meter '+(m>=75?'ok':m>=45?'':'no')+'"><i style="width:'+m+'%"></i></div>'+
    '<span class="pc">'+m+'%</span></div>'+
    '</div></button>';
}

var toneFilter='all', toneSearch='';
UI.registerView('tones', function(arg){
  if(arg && TONE_BY_ID[arg]) return toneDetail(TONE_BY_ID[arg]);
  var list=TONES.filter(function(t){
    if(toneFilter!=='all' && t.fam!==toneFilter) return false;
    if(toneSearch){
      var q=toneSearch.toLowerCase();
      return (t.name+' '+t.conveys+' '+t.useWhen+' '+t.cue).toLowerCase().indexOf(q)>=0;
    }
    return true;
  });
  return '<div class="page wide">'+
  '<div class="phead"><p class="kick">'+TONES.length+' tones · '+Object.keys(FAMILIES).length+' families</p><h1>Tone Library</h1>'+
  '<p class="lede">Every tone carries a measurable acoustic target, a physical cue that produces it reliably, the way it fails when overdone, and its own line pool. '+
  'Click any of them to read the recipe and drill it.</p></div>'+
  '<div class="row" style="margin-bottom:18px">'+
  '<div class="seg" id="famSeg"><button data-f="all"'+(toneFilter==='all'?' class="on"':'')+'>All</button>'+
  Object.keys(FAMILIES).map(function(k){ return '<button data-f="'+k+'"'+(toneFilter===k?' class="on"':'')+'>'+esc(FAMILIES[k].name)+'</button>'; }).join('')+
  '</div><span class="spacer"></span>'+
  '<div class="srch" style="max-width:230px"><span class="si">⌕</span><input type="search" id="toneSearch" placeholder="Search tones" value="'+esc(toneSearch)+'"></div>'+
  '</div>'+
  (toneFilter!=='all'?'<div class="note" style="border-left-color:'+FAMILIES[toneFilter].c+'"><span class="l" style="color:'+FAMILIES[toneFilter].c+'">'+esc(FAMILIES[toneFilter].name)+'</span>'+esc(FAMILIES[toneFilter].blurb)+'</div>':'')+
  (list.length? '<div class="grid gauto">'+list.map(function(t){return toneCard(t);}).join('')+'</div>'
   : '<div class="empty"><div class="ei">⌕</div><p>No tones match that.</p></div>')+
  '</div>';
});
UI.registerView('tones:after', function(){
  var seg=$('#famSeg');
  if(seg) seg.onclick=function(e){ var b=e.target.closest('[data-f]'); if(!b) return; toneFilter=b.dataset.f; UI.render(); };
  var srch=$('#toneSearch');
  if(srch) srch.oninput=function(){ toneSearch=this.value; var v=this.value;
    UI.render(); var n=$('#toneSearch'); if(n){ n.focus(); n.setSelectionRange(v.length,v.length); } };
});
UI.registerView('tones:act', function(a,arg){
  if(a==='tone') UI.go('tones', arg);
  if(a==='back') UI.go('tones');
});

function toneDetail(t){
  var m=S.masteryOf(t.id), st=S.raw().mastery[t.id];
  var T=t.target;
  return '<div class="page">'+
  '<button class="btn gh sm" data-act="back" style="margin-bottom:18px">← All tones</button>'+
  '<div class="phead"><p class="kick" style="color:'+FAMILIES[t.fam].c+'">'+esc(FAMILIES[t.fam].name)+'</p>'+
  '<h1>'+esc(t.name)+'</h1><p class="lede">'+esc(t.conveys)+'</p></div>'+

  '<div class="grid g4" style="margin-bottom:24px">'+
  '<div class="stat"><p class="k">Mastery</p><div class="v">'+m+'<span style="font-size:14px;color:var(--muted)">%</span></div>'+
  '<p class="s">'+(st?st.n+' reps · best '+st.best:'never drilled')+'</p></div>'+
  '<div class="stat"><p class="k">Pace</p><div class="v" style="font-size:19px">'+T.wpm[0]+'–'+T.wpm[1]+'</div><p class="s">words / min</p></div>'+
  '<div class="stat"><p class="k">Range</p><div class="v" style="font-size:19px">'+T.span[0]+'–'+T.span[1]+'</div><p class="s">semitones</p></div>'+
  '<div class="stat"><p class="k">Terminal</p><div class="v" style="font-size:19px">'+T.term[0]+' … '+T.term[1]+'</div><p class="s">semitones</p></div>'+
  '</div>'+

  '<div class="row" style="margin-bottom:26px">'+
  '<button class="btn big" data-drill="tonelab" data-arg="'+t.id+'">▶ Drill this tone</button>'+
  '<button class="btn sec" data-drill="tonelab" data-arg="fam:'+t.fam+'">Drill the whole family</button></div>'+

  '<div class="split">'+
  '<div>'+
  '<div class="sect" style="margin-top:0"><div class="shead"><h2>Use it when</h2></div>'+
  '<p class="prose">'+esc(t.useWhen)+'</p></div>'+

  '<div class="note acc"><span class="l">The cue that produces it</span>'+esc(t.cue)+'</div>'+

  '<div class="sect"><div class="shead"><h2>The recipe</h2></div>'+
  '<div class="prose"><table>'+
  ['pitch','pace','volume','terminal','resonance'].map(function(k){
    return '<tr><td style="text-transform:capitalize">'+k+'</td><td>'+esc(t.recipe[k])+'</td></tr>'; }).join('')+
  '</table></div></div>'+

  '<div class="note no"><span class="l">When it is overdone</span>'+esc(t.overdone)+'</div>'+
  '<div class="note ok"><span class="l">The antidote</span>'+esc(t.antidote)+'</div>'+

  '<div class="sect"><div class="shead"><h2>Line pool</h2><span class="n">'+t.lines.length+' lines</span></div>'+
  '<div class="grid" style="gap:7px">'+t.lines.map(function(l){
    return '<div class="tw" style="padding:10px 14px"><div class="txt"><p style="margin:0">'+esc(l)+'</p></div></div>'; }).join('')+
  '</div></div>'+
  '</div>'+

  '<div>'+
  '<div class="card"><p class="lbl" style="margin-bottom:10px">Acoustic target</p>'+
  [['Pace',T.wpm,'wpm'],['Range',T.span,'st'],['Terminal',T.term,'st'],['Dynamics',T.dyn,'dB'],['Silence',T.pause,'%']].map(function(r){
    return '<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px">'+
      '<span class="dim2">'+r[0]+'</span><span class="mono dim">'+r[1][0]+'–'+r[1][1]+' '+r[2]+'</span></div>'+
      '<div class="meter"><i style="width:100%;background:'+FAMILIES[t.fam].c+';opacity:.55"></i></div></div>';
  }).join('')+
  '<p class="tiny dim" style="margin-top:14px">All values are speaker-normalised. Semitones rather than Hz, so the targets are identical regardless of your natural register.</p>'+
  '</div>'+
  '<div class="card" style="margin-top:12px"><p class="lbl" style="margin-bottom:8px">Family</p>'+
  '<p class="tiny dim2" style="margin:0">'+esc(FAMILIES[t.fam].blurb)+'</p></div>'+
  '</div></div></div>';
}

/* ============================================================ TWISTERS */
var twCat='all', twDiff=0;
UI.registerView('twisters', function(){
  var list=TWISTERS.filter(function(t){
    if(twCat!=='all' && t.c!==twCat) return false;
    if(twDiff && t.d!==twDiff) return false;
    return true;
  });
  var cleared=Object.keys(S.raw().twisters).filter(function(k){return S.raw().twisters[k].cleared;}).length;
  return '<div class="page wide">'+
  '<div class="phead"><p class="kick">'+TWISTERS.length+' items · '+cleared+' cleared</p><h1>Articulation Gym</h1>'+
  '<p class="lede">Tongue twisters organised by the sound they actually target, each with the phonetic reason it is difficult. '+
  'Warm up first, say it slowly and perfectly three times, then climb the speed ladder. Speed built on a wrong motor pattern locks the mistake in.</p></div>'+
  '<div class="row" style="margin-bottom:16px">'+
  '<button class="btn" data-drill="twisters">▶ Run the gym</button>'+
  '<button class="btn sec" data-drill="warmup">♨ Warmup first</button></div>'+
  '<div class="row" style="margin-bottom:18px">'+
  '<div class="seg" id="twSeg"><button data-c="all"'+(twCat==='all'?' class="on"':'')+'>All</button>'+
  Object.keys(TWISTER_CATS).map(function(k){ return '<button data-c="'+k+'"'+(twCat===k?' class="on"':'')+'>'+esc(TWISTER_CATS[k].name)+'</button>'; }).join('')+
  '</div><span class="spacer"></span>'+
  '<div class="seg" id="twDiff"><button data-d="0"'+(!twDiff?' class="on"':'')+'>Any</button>'+
  [1,2,3,4,5].map(function(d){ return '<button data-d="'+d+'"'+(twDiff===d?' class="on"':'')+'>'+d+'</button>'; }).join('')+'</div>'+
  '</div>'+
  (twCat!=='all'?'<div class="note" style="border-left-color:'+TWISTER_CATS[twCat].c+'"><span class="l" style="color:'+TWISTER_CATS[twCat].c+'">'+esc(TWISTER_CATS[twCat].name)+'</span>'+esc(TWISTER_CATS[twCat].blurb)+
    '<div style="margin-top:10px"><button class="btn sm" data-drill="twisters" data-arg="'+twCat+'">Drill this set</button></div></div>':'')+
  '<div class="grid" style="gap:8px">'+list.map(function(t){
    var id=t.c+'|'+t.t.slice(0,34), st=S.raw().twisters[id];
    var diff=''; for(var k=0;k<5;k++) diff+='<i'+(k<t.d?' class="f"':'')+'></i>';
    return '<div class="tw"><span class="twdiff">'+diff+'</span><div class="txt">'+
      '<p>'+esc(t.t)+'</p><div class="meta">'+
      '<span style="color:'+TWISTER_CATS[t.c].c+';font-weight:650">'+esc(TWISTER_CATS[t.c].name)+'</span>'+
      (t.tg||[]).map(function(g){return '<span class="ipa">'+esc(g)+'</span>';}).join('')+
      (st&&st.cleared?'<span class="chip ok tiny">cleared '+st.bpm+' bpm</span>':'')+
      '</div><p class="tiny dim" style="margin:6px 0 0">'+esc(t.why)+'</p></div></div>';
  }).join('')+'</div></div>';
});
UI.registerView('twisters:after', function(){
  var a=$('#twSeg'); if(a) a.onclick=function(e){ var b=e.target.closest('[data-c]'); if(b){ twCat=b.dataset.c; UI.render(); } };
  var d=$('#twDiff'); if(d) d.onclick=function(e){ var b=e.target.closest('[data-d]'); if(b){ twDiff=+b.dataset.d; UI.render(); } };
});

/* ============================================================ EMPHASIS */
UI.registerView('emphasis', function(){
  return '<div class="page">'+
  '<div class="phead"><p class="kick">When to emphasise what</p><h1>Emphasis Lab</h1>'+
  '<p class="lede">The same sentence has between five and eight distinct meanings depending only on which word carries the stress. '+
  'Not shades of meaning — different propositions. If you are not choosing that consciously you are choosing it randomly, several times a minute, all day.</p></div>'+
  '<div class="row" style="margin-bottom:24px"><button class="btn big" data-drill="emphasis">▶ Drill it</button></div>'+

  '<div class="sect" style="margin-top:0"><div class="shead"><h2>The ruleset</h2><span class="n">'+FOCUS_RULES.length+' rules</span></div>'+
  '<p class="sdesc">Everything about where the accent goes. Rule six is the one nobody is taught and it is worth more than the other eleven combined.</p>'+
  '<div class="grid" style="gap:10px">'+FOCUS_RULES.map(function(r,i){
    return '<div class="card" style="padding:15px 18px">'+
      '<div style="display:flex;gap:11px;align-items:flex-start">'+
      '<span class="lawn" style="color:var(--acc);background:var(--acc-wash);border-color:var(--acc-line)">'+(i+1)+'</span>'+
      '<div style="flex:1"><h3 style="font-size:15px;margin:1px 0 5px">'+esc(r.r)+'</h3>'+
      '<p class="tiny dim2" style="margin:0 0 10px">'+esc(r.d)+'</p>'+
      '<div class="grid g2" style="gap:8px">'+
      '<div style="background:var(--no-wash);border:1px solid rgba(239,95,82,.22);border-radius:8px;padding:8px 11px">'+
      '<p class="lbl" style="color:var(--no);margin-bottom:3px">Wrong</p><p class="tiny" style="margin:0">'+r.bad+'</p></div>'+
      '<div style="background:var(--ok-wash);border:1px solid rgba(78,201,126,.22);border-radius:8px;padding:8px 11px">'+
      '<p class="lbl" style="color:var(--ok);margin-bottom:3px">Right</p><p class="tiny" style="margin:0">'+r.good+'</p></div>'+
      '</div></div></div></div>';
  }).join('')+'</div></div>'+

  '<div class="sect"><div class="shead"><h2>The shift table</h2><span class="n">'+EMPHASIS.length+' sentences</span></div>'+
  '<p class="sdesc">Move the stress, change the meaning. Say each row out loud — reading them silently does nothing.</p>'+
  '<div class="grid" style="gap:14px">'+EMPHASIS.map(function(e){
    return '<div class="card">'+
      '<h3 style="font-size:16px;margin-bottom:4px">'+e.w.join(' ')+'</h3>'+
      '<p class="tiny dim" style="margin-bottom:12px">'+esc(e.note)+'</p>'+
      '<div class="grid" style="gap:5px">'+e.w.map(function(w,i){
        if(!e.m[i]) return '';
        return '<div class="read" style="display:grid;grid-template-columns:minmax(120px,180px) 1fr;gap:12px;font-size:13.5px;padding:7px 0;border-top:1px solid var(--line)">'+
          '<span style="font-weight:650"><span style="color:var(--acc)">'+esc(w)+'</span></span>'+
          '<span class="dim2">'+esc(e.m[i])+'</span></div>';
      }).join('')+'</div></div>';
  }).join('')+'</div></div>'+

  '<div class="sect"><div class="shead"><h2>Pause drills</h2><span class="n">'+PAUSE_DRILLS.length+'</span></div>'+
  '<p class="sdesc">Silence is emphasis with no vocal effort. The word before a pause gets promoted for free.</p>'+
  '<div class="row" style="margin-bottom:12px"><button class="btn sec" data-drill="pausegym">▶ Drill the pauses</button></div>'+
  '<div class="grid" style="gap:8px">'+PAUSE_DRILLS.map(function(p){
    return '<div class="tw"><div class="txt"><p>'+esc(p.t).replace(/⟨(\d+)⟩/g,function(_,n){return '<span class="pz">⟨ '+(n/10).toFixed(1)+'s ⟩</span>';})+'</p>'+
      '<div class="meta"><span class="chip cy tiny">'+esc(p.tag)+'</span></div>'+
      '<p class="tiny dim" style="margin:6px 0 0">'+esc(p.why)+'</p></div></div>';
  }).join('')+'</div></div>'+
  '</div>';
});

/* ============================================================ SCRIPTS */
UI.registerView('scripts', function(){
  return '<div class="page">'+
  '<div class="phead"><p class="kick">Teleprompter mode</p><h1>Annotated Scripts</h1>'+
  '<p class="lede">Complete sequences with a tone assigned to every line. Run them end to end and the app grades each line against its assigned tone. '+
  'This is where the individual parameters turn into an actual performance.</p></div>'+
  '<div class="grid gauto-l">'+SCRIPTS.map(function(s){
    return '<button class="mod" style="--mc:var(--acc);--mcw:var(--acc-wash)" data-drill="script" data-arg="'+s.id+'">'+
      '<div class="mh"><span class="mi">▤</span><h3>'+esc(s.name)+'</h3></div>'+
      '<p class="md">'+esc(s.blurb)+'</p>'+
      '<div class="mf"><span>'+esc(s.domain)+'</span><span>·</span><span>'+s.lines.length+' lines</span><span>·</span><span>~'+s.mins+' min</span></div></button>';
  }).join('')+'</div>'+
  '<div class="sect"><div class="shead"><h2>Preview</h2></div>'+
  '<p class="sdesc">The tone tags are the point. Read one of these and you can see the emotional architecture of a whole conversation at a glance.</p>'+
  '<div class="card"><p class="lbl" style="margin-bottom:12px">'+esc(SCRIPTS[0].name)+'</p>'+
  '<div class="tele" style="font-size:17px;padding:0">'+SCRIPTS[0].lines.map(function(l){
    var t=TONE_BY_ID[l[0]]||TONE_BY_ID.neutral;
    return '<p class="ln cur" style="opacity:1;padding-left:0;margin-bottom:9px"><span class="tn" style="color:'+FAMILIES[t.fam].c+'">'+esc(t.name)+'</span>'+esc(l[1])+'</p>';
  }).join('')+'</div></div></div></div>';
});

/* ============================================================ CODEX */
UI.registerView('codex', function(arg){
  if(arg){
    var e=CODEX.filter(function(x){return x.id===arg;})[0];
    if(e){
      S.raw().codexRead[e.id]=1; S.save(); S.checkAch();
      var idx=CODEX.indexOf(e);
      return '<div class="page">'+
      '<button class="btn gh sm" data-act="back" style="margin-bottom:18px">← The Codex</button>'+
      '<div class="phead"><p class="kick">'+esc(e.sub)+'</p><h1>'+esc(e.title)+'</h1></div>'+
      '<div class="prose"><p>'+UI.md(e.body)+'</p></div>'+
      '<hr><div class="row">'+
      (idx>0?'<button class="btn gh" data-act="read" data-arg="'+CODEX[idx-1].id+'">← '+esc(CODEX[idx-1].title)+'</button>':'')+
      '<span class="spacer"></span>'+
      (idx<CODEX.length-1?'<button class="btn sec" data-act="read" data-arg="'+CODEX[idx+1].id+'">'+esc(CODEX[idx+1].title)+' →</button>':'')+
      '</div></div>';
    }
  }
  var read=S.raw().codexRead;
  return '<div class="page">'+
  '<div class="phead"><p class="kick">The theory</p><h1>The Codex</h1>'+
  '<p class="lede">Read it once, reference it forever. Everything the drills are based on — the eight parameters, the complete emphasis ruleset, '+
  'the terminal map, the defect catalogue, and the numbers you are being scored against.</p></div>'+
  '<div class="grid gauto-l">'+CODEX.map(function(e,i){
    return '<button class="mod" style="--mc:var(--vi);--mcw:var(--vi-wash)" data-act="read" data-arg="'+e.id+'">'+
      (read[e.id]?'<span class="lockbadge" style="color:var(--ok);border-color:rgba(78,201,126,.3)">read</span>':'')+
      '<div class="mh"><span class="mi">'+(i+1)+'</span><h3>'+esc(e.title)+'</h3></div>'+
      '<p class="md">'+esc(e.sub)+'</p></button>';
  }).join('')+'</div></div>';
});
UI.registerView('codex:act', function(a,arg){
  if(a==='read') UI.go('codex', arg);
  if(a==='back') UI.go('codex');
});

/* ============================================================ POWER */
var powCh='status';
UI.registerView('power', function(){
  var list=PRINCIPLES.filter(function(p){return p.ch===powCh;});
  var readCount=Object.keys(S.raw().powerRead).length;
  return '<div class="page">'+
  '<div class="phead"><p class="kick">'+PRINCIPLES.length+' principles · '+readCount+' read</p><h1>Power &amp; Psychology</h1>'+
  '<p class="lede">The strategic layer. What to say, why it moves people, how it fails, and — most valuably — what to do when it is being run on you. '+
  'Every principle is paired with the tone that actually delivers it, because a strategy without a tone is just a sentence.</p></div>'+

  '<div class="note vi" style="margin-bottom:22px"><span class="l">'+esc(POWER_INTRO.title)+'</span>'+UI.md(POWER_INTRO.body)+'</div>'+

  '<div class="seg" id="powSeg" style="margin-bottom:18px">'+Object.keys(POWER_CHAPTERS).map(function(k){
    return '<button data-p="'+k+'"'+(powCh===k?' class="on"':'')+'>'+esc(POWER_CHAPTERS[k].name)+'</button>'; }).join('')+'</div>'+

  '<div class="note" style="border-left-color:'+POWER_CHAPTERS[powCh].c+'"><span class="l" style="color:'+POWER_CHAPTERS[powCh].c+'">'+
  esc(POWER_CHAPTERS[powCh].name)+'</span>'+esc(POWER_CHAPTERS[powCh].blurb)+'</div>'+

  '<div class="grid" style="gap:10px;margin-top:16px">'+list.map(function(p,i){
    var t=TONE_BY_ID[p.tone]||TONE_BY_ID.neutral;
    var key=p.ch+'|'+i;
    return '<div class="law'+(S.raw().powerRead[key]?' open':'')+'" data-key="'+key+'">'+
      '<button class="lawh" data-act="toggle" data-arg="'+key+'">'+
      '<span class="lawn" style="color:'+POWER_CHAPTERS[p.ch].c+';background:color-mix(in srgb,'+POWER_CHAPTERS[p.ch].c+' 12%,transparent);border-color:color-mix(in srgb,'+POWER_CHAPTERS[p.ch].c+' 30%,transparent)">'+(i+1)+'</span>'+
      '<h3>'+esc(p.n)+'</h3><span class="cv">›</span></button>'+
      '<div class="lawb"><div class="prose" style="font-size:14.5px">'+
      '<p>'+esc(p.idea)+'</p>'+
      '<h4>In a sale or a negotiation</h4><p>'+esc(p.sales)+'</p>'+
      '<h4>The tone that delivers it</h4>'+
      '<p><b style="color:'+FAMILIES[t.fam].c+'">'+esc(t.name)+'</b> — '+esc(p.toneWhy)+'</p>'+
      '<div class="row" style="margin:0 0 14px"><button class="btn sm" data-drill="tonelab" data-arg="'+t.id+'">▶ Drill '+esc(t.name)+'</button>'+
      '<button class="btn gh sm" data-go="tones" data-arg="'+t.id+'">Read the recipe</button></div>'+
      '<div class="note no" style="margin-bottom:10px"><span class="l">How it fails</span>'+esc(p.fails)+'</div>'+
      '<div class="note ok" style="margin-bottom:0"><span class="l">When it is used on you</span>'+esc(p.counter)+'</div>'+
      '</div></div></div>';
  }).join('')+'</div>'+

  (powCh==='influence'? '<div class="sect"><div class="shead"><h2>Quick reference</h2></div>'+
   '<div class="prose"><table><tr><th>Principle</th><th>Honest use</th><th>Abuse</th></tr>'+
   INFLUENCE.map(function(x){ return '<tr><td>'+esc(x.n)+'</td><td>'+esc(x.use)+'</td><td>'+esc(x.abuse)+'</td></tr>'; }).join('')+
   '</table></div></div>':'')+

  (powCh==='frame'? '<div class="sect"><div class="shead"><h2>The frame rack</h2><span class="n">'+FRAMES.length+'</span></div>'+
   '<p class="sdesc">Ten frames with the line that sets each one and the tone it needs. Say them out loud; the tone is half the frame.</p>'+
   '<div class="grid gauto-l">'+FRAMES.map(function(f){
     var t=TONE_BY_ID[f.tone]||TONE_BY_ID.neutral;
     return '<div class="card"><h3 style="font-size:15px;margin-bottom:5px">'+esc(f.n)+'</h3>'+
       '<p class="tiny dim2" style="margin-bottom:11px">'+esc(f.d)+'</p>'+
       '<p style="font-size:15px;font-style:italic;color:var(--ink);margin-bottom:10px">“'+esc(f.line)+'”</p>'+
       '<div class="row"><span class="chip tiny" style="color:'+FAMILIES[t.fam].c+'">'+esc(t.name)+'</span>'+
       '<button class="btn gh sm" data-drill="tonelab" data-arg="'+t.id+'">Drill</button></div></div>';
   }).join('')+'</div></div>':'')+
  '</div>';
});
UI.registerView('power:after', function(){
  var s=$('#powSeg'); if(s) s.onclick=function(e){ var b=e.target.closest('[data-p]'); if(b){ powCh=b.dataset.p; UI.render(); } };
});
UI.registerView('power:act', function(a,arg,node){
  if(a==='toggle'){
    var law=node.closest('.law');
    law.classList.toggle('open');
    if(law.classList.contains('open')){ S.raw().powerRead[arg]=1; S.save(); S.checkAch(); }
  }
});

/* ============================================================ PATH */
UI.registerView('path', function(){
  var s=S.raw();
  return '<div class="page">'+
  '<div class="phead"><p class="kick">Ninety days</p><h1>The Path</h1>'+
  '<p class="lede">A day-by-day sequence built the way skill acquisition actually works — short spaced sessions, one parameter at a time, '+
  'with review points that let you compare against your own earlier self. You do not have to follow it. It just means never having to decide what to practise.</p></div>'+
  '<div class="grid g3" style="margin-bottom:26px">'+PHASES.map(function(p){
    var done=0; for(var i=p.from;i<=p.to;i++) if(s.dayDone[i]) done++;
    var tot=p.to-p.from+1;
    return '<div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px">'+
      '<h3 style="font-size:16px">'+esc(p.n)+'</h3><span class="tiny mono dim">'+p.from+'–'+p.to+'</span></div>'+
      '<p class="tiny dim2" style="margin-bottom:12px">'+esc(p.blurb)+'</p>'+
      '<div class="mastery"><div class="meter '+(done===tot?'ok':'')+'"><i style="width:'+(done/tot*100)+'%"></i></div>'+
      '<span class="pc">'+done+'/'+tot+'</span></div></div>';
  }).join('')+'</div>'+
  '<div class="row" style="margin-bottom:18px">'+
  '<button class="btn" data-act="jump" data-arg="today">Jump to day '+s.day+'</button>'+
  '<span class="spacer"></span><span class="tiny dim">Click any day to set it as current.</span></div>'+
  '<div class="grid" style="gap:6px" id="pathList">'+PATH.map(function(d){
    var done=s.dayDone[d.d], today=d.d===s.day;
    var mods=d.mods.map(function(id){ var m=MODULES.filter(function(x){return x.id===id;})[0]; return m?m.n:id; }).join(' · ');
    return '<div class="day'+(done?' done':'')+(today?' today':'')+'" data-act="jump" data-arg="'+d.d+'" style="cursor:pointer">'+
      '<div class="daynum"><b>'+d.d+'</b><span>'+(done?'done':today?'now':'day')+'</span></div>'+
      '<div style="flex:1;min-width:0"><b style="font-size:14px">'+esc(d.f)+'</b>'+
      '<p class="tiny dim2" style="margin:2px 0 4px">'+esc(d.note)+'</p>'+
      '<p class="tiny dim mono">'+esc(mods)+'</p></div>'+
      (today?'<button class="btn sm" data-drill="'+d.mods[0]+'">Start</button>':'')+
      '</div>';
  }).join('')+'</div></div>';
});
UI.registerView('path:act', function(a,arg){
  if(a==='jump'){
    if(arg==='today'){ var n=UI.$('.day.today'); if(n) n.scrollIntoView({block:'center'}); return; }
    S.raw().day=+arg; S.save(); UI.render();
    setTimeout(function(){ var n=UI.$('.day.today'); if(n) n.scrollIntoView({block:'center'}); },40);
  }
});

/* ---------- voice profile card ---------- */
function profileCard(){
  var p=S.profile();
  if(!p){
    return '<div class="sect" style="margin-top:0"><div class="card" style="border-color:var(--acc-line);background:var(--acc-wash)">'+
      '<div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">'+
      '<div style="flex:1;min-width:260px"><h3 style="font-size:17px;margin-bottom:5px">Your voice is not calibrated yet</h3>'+
      '<p class="tiny dim2" style="margin:0">Two minutes, five steps, nothing scored. It measures your room noise floor, your register and breath support, your usable pitch range, your articulation and your natural speaking habits — '+
      'and it narrows the pitch tracker from the full human range down to yours, which is the biggest single accuracy gain available.</p></div>'+
      '<button class="btn" data-drill="calibrate">Calibrate now</button></div></div></div>';
  }
  var n=p.natural, sb=p.sibilant, b=Audio.bounds();
  var drift=S.profileDrift();
  function cell(k,v,s){ return '<div class="ro"><p class="k">'+esc(k)+'</p><div class="v" style="font-size:18px">'+v+'</div>'+
    (s?'<p class="t">'+esc(s)+'</p>':'')+'</div>'; }
  return '<div class="sect" style="margin-top:0"><div class="shead"><h2>Your voice profile</h2>'+
  '<span class="n">calibrated '+new Date(p.at).toLocaleDateString()+'</span></div>'+
  '<p class="sdesc">What the engine knows about your instrument and your room. Everything here is a measurement, not a grade.</p>'+
  (drift?'<div class="note acc"><span class="l">Worth re-calibrating</span>'+
    'Your recent reps are averaging <b>'+drift.measured+' Hz</b> against a profile of <b>'+drift.profile+' Hz</b> — that is '+
    Math.abs(drift.st)+' semitones of drift. Different mic, different room, a cold, or just a different time of day. '+
    'Re-running calibration takes two minutes and will sharpen every score.</div>':'')+
  '<div class="readout">'+
    (p.modalHz?cell('Modal pitch', Math.round(p.modalHz)+'<span class="u">Hz</span>','your resting note'):'')+
    (p.lowHz?cell('Usable range', Math.round(p.lowHz)+'–'+Math.round(p.highHz),'Hz · '+(p.semitones||0).toFixed(1)+' st'):'')+
    (p.mpt?cell('Breath', p.mpt.toFixed(1)+'<span class="u">s</span>', p.mpt>=18?'strong':p.mpt>=12?'normal':'short'):'')+
    (sb?cell('Sibilant sep.', sb.ratio.toFixed(2)+'<span class="u">×</span>', 'typical 1.6–2.2'):'')+
    (p.noiseDb!=null?cell('Room floor', Math.round(p.noiseDb)+'<span class="u">dB</span>', p.noiseDb<-54?'quiet':'some noise'):'')+
    cell('Tracker', Math.round(b.lo)+'–'+Math.round(b.hi), 'Hz search window')+
  '</div>'+
  (n?'<div class="card" style="margin-top:12px"><p class="lbl" style="margin-bottom:10px">How you naturally speak — the line every rep is compared against</p>'+
   '<div class="readout">'+
   cell('Pace', Math.round(n.wpm)+'<span class="u">wpm</span>','persuasive 148–174')+
   cell('Range', n.span.toFixed(1)+'<span class="u">st</span>', n.span<4?'reads monotone':n.span<6?'narrow':'engaged')+
   cell('Terminal', (n.term>0?'+':'')+n.term.toFixed(1)+'<span class="u">st</span>', n.term<-2?'you fall':n.term>1?'you rise':'you end flat')+
   cell('Dynamics', n.dyn.toFixed(1)+'<span class="u">dB</span>', n.dyn<4?'flat':'good')+
   cell('Silence', Math.round(n.pauseFrac)+'<span class="u">%</span>','15–25% healthy')+
   '</div></div>':'')+
  (S.raw().prefs.personalTargets?'<div class="note cy" style="margin-top:12px"><span class="l">Personal Mode is on</span>'+
   'Your scores are being measured against bands stretched from this profile rather than the fixed standard. '+
   'That makes them more encouraging and <b>not comparable to anyone else\'s</b>. Turn it off in settings if you are tracking a team.</div>':'')+
  '<div class="row" style="margin-top:12px">'+
  '<button class="btn sec sm" data-drill="calibrate" data-arg="redo">Re-run calibration</button>'+
  (p.history&&p.history.length?'<span class="tiny dim">'+p.history.length+' earlier calibration'+(p.history.length>1?'s':'')+' kept</span>':'')+
  '</div></div>';
}

/* ============================================================ PROGRESS */
UI.registerView('progress', function(){
  var s=S.raw(), st=S.stats(), p=S.levelProgress();
  var byFam={};
  TONES.filter(function(t){return t.fam!=='defect';}).forEach(function(t){
    (byFam[t.fam]=byFam[t.fam]||[]).push({t:t, m:S.masteryOf(t.id)});
  });
  var hist=s.hist.slice(-60);
  return '<div class="page">'+
  '<div class="phead"><p class="kick">Level '+p.lvl+' · '+esc(p.rank)+'</p><h1>Progress</h1>'+
  '<p class="lede">Mastery decays by a point a day after three days without touching a tone. That is deliberate — it is how the weak-spot queue knows what to resurface.</p></div>'+

  '<div class="grid g4" style="margin-bottom:24px">'+
  '<div class="stat acc"><p class="k">Total XP</p><div class="v">'+s.xp.toLocaleString()+'</div><p class="s">'+p.cur+'/'+p.need+' to level '+(p.lvl+1)+'</p></div>'+
  '<div class="stat"><p class="k">Overall mastery</p><div class="v">'+Math.round(st.overall)+'<span style="font-size:14px;color:var(--muted)">%</span></div><p class="s">across '+TONES.length+' tones</p></div>'+
  '<div class="stat cy"><p class="k">Sessions</p><div class="v">'+s.sessions+'</div><p class="s">'+s.streak+' day streak</p></div>'+
  '<div class="stat '+(st.avg100>=80?'ok':'')+'"><p class="k">Avg score</p><div class="v">'+(st.avg100!=null?Math.round(st.avg100):'—')+'</div><p class="s">last 100 reps</p></div>'+
  '</div>'+

  profileCard()+

  (st.avgWpm!=null? '<div class="sect"><div class="shead"><h2>Your averages</h2><span class="n">last 100 scored reps</span></div>'+
  '<div class="readout">'+
  '<div class="ro '+(st.avgWpm>=130&&st.avgWpm<=185?'good':'warn')+'"><p class="k">Pace</p><div class="v">'+Math.round(st.avgWpm)+'<span class="u">wpm</span></div><p class="t">148–174 persuasive</p></div>'+
  '<div class="ro '+(st.avgSpan>=6?'good':st.avgSpan>=4?'warn':'bad')+'"><p class="k">Range</p><div class="v">'+(st.avgSpan!=null?st.avgSpan.toFixed(1):'—')+'<span class="u">st</span></div><p class="t">6–10 engaged</p></div>'+
  '<div class="ro '+(st.avgTerm<=-2?'good':'bad')+'"><p class="k">Terminal</p><div class="v">'+(st.avgTerm!=null?(st.avgTerm>0?'+':'')+st.avgTerm.toFixed(1):'—')+'<span class="u">st</span></div><p class="t">negative = falling</p></div>'+
  '<div class="ro"><p class="k">Tones touched</p><div class="v">'+st.covered+'<span class="u">/'+TONES.length+'</span></div></div>'+
  '</div></div>':'')+

  (hist.length>3? '<div class="sect"><div class="shead"><h2>Score trend</h2><span class="n">last '+hist.length+' reps</span></div>'+
  '<div class="card"><canvas id="trendC" style="width:100%;height:150px;display:block"></canvas></div></div>':'')+

  '<div class="sect"><div class="shead"><h2>Mastery by family</h2></div>'+
  '<p class="sdesc">Anything under 50 is a gap. Anything at zero you have never touched.</p>'+
  '<div class="grid" style="gap:16px">'+Object.keys(byFam).map(function(k){
    var arr=byFam[k].sort(function(a,b){return a.m-b.m;});
    var avg=Math.round(arr.reduce(function(a,b){return a+b.m;},0)/arr.length);
    return '<div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px">'+
      '<h3 style="font-size:15.5px;color:'+FAMILIES[k].c+'">'+esc(FAMILIES[k].name)+'</h3>'+
      '<span class="mono tiny dim">'+avg+'% avg</span></div>'+
      arr.map(function(x){
        return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">'+
          '<span style="flex:0 0 165px;font-size:13px;'+(S.tierUnlocked(x.t.tier)?'':'opacity:.4')+'">'+esc(x.t.name)+'</span>'+
          '<div class="meter '+(x.m>=75?'ok':x.m>=45?'':'no')+'" style="flex:1"><i style="width:'+x.m+'%;background:'+FAMILIES[k].c+'"></i></div>'+
          '<span class="mono tiny dim" style="width:32px;text-align:right">'+x.m+'</span>'+
          '<button class="btn gh sm" data-drill="tonelab" data-arg="'+x.t.id+'" style="padding:3px 9px;font-size:11px">drill</button></div>';
      }).join('')+'</div>';
  }).join('')+'</div></div>'+

  '<div class="sect"><div class="shead"><h2>Achievements</h2>'+
  '<span class="n">'+Object.keys(s.ach).length+' / '+ACHIEVEMENTS.length+'</span></div>'+
  '<div class="grid gauto">'+ACHIEVEMENTS.map(function(a){
    return '<div class="ach'+(s.ach[a.id]?' got':'')+'"><span class="achi">'+a.i+'</span>'+
      '<div><b>'+esc(a.n)+'</b><span>'+esc(a.d)+'</span></div></div>';
  }).join('')+'</div></div>'+

  '<div class="sect"><div class="shead"><h2>Data</h2></div>'+
  '<p class="sdesc">Everything is stored in this browser only. Nothing is uploaded. Export it if you want a backup or want to move to another machine.</p>'+
  '<div class="row"><button class="btn sec" data-act="export">Export progress</button>'+
  '<button class="btn sec" data-act="import">Import</button>'+
  '<button class="btn dgr" data-act="reset">Reset everything</button></div></div>'+
  '</div>';
});
UI.registerView('progress:after', function(){
  var c=UI.$('#trendC'); if(!c) return;
  var hist=S.raw().hist.slice(-60);
  var dpr=Math.min(2,window.devicePixelRatio||1);
  var r=c.getBoundingClientRect();
  c.width=Math.max(2,r.width*dpr); c.height=150*dpr;
  var x=c.getContext('2d'), W=c.width, H=c.height, pad=16*dpr;
  function cv(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  x.clearRect(0,0,W,H);
  x.strokeStyle=cv('--line'); x.lineWidth=1*dpr;
  [0,25,50,75,100].forEach(function(v){
    var y=H-pad-(v/100)*(H-pad*2);
    x.beginPath(); x.moveTo(0,y); x.lineTo(W,y); x.stroke();
    x.fillStyle=cv('--faint'); x.font=(9*dpr)+'px ui-monospace,monospace'; x.fillText(v,3*dpr,y-3*dpr);
  });
  if(hist.length<2) return;
  x.strokeStyle=cv('--acc'); x.lineWidth=2.4*dpr; x.lineJoin='round'; x.beginPath();
  hist.forEach(function(h,i){
    var px=pad+i/(hist.length-1)*(W-pad*2);
    var py=H-pad-(Math.max(0,Math.min(100,h.score))/100)*(H-pad*2);
    if(i===0) x.moveTo(px,py); else x.lineTo(px,py);
  });
  x.stroke();
  x.fillStyle=cv('--acc');
  hist.forEach(function(h,i){
    var px=pad+i/(hist.length-1)*(W-pad*2);
    var py=H-pad-(Math.max(0,Math.min(100,h.score))/100)*(H-pad*2);
    x.beginPath(); x.arc(px,py,2.2*dpr,0,6.284); x.fill();
  });
});
UI.registerView('progress:act', function(a){
  if(a==='export'){
    var b=new Blob([S.exportJson()],{type:'application/json'});
    var u=URL.createObjectURL(b), n=document.createElement('a');
    n.href=u; n.download='tonality-gym-progress.json'; n.click();
    setTimeout(function(){URL.revokeObjectURL(u);},1000);
  }
  if(a==='import'){
    var i=document.createElement('input'); i.type='file'; i.accept='.json';
    i.onchange=function(){ var f=i.files[0]; if(!f) return; var rd=new FileReader();
      rd.onload=function(){ if(!S.importJson(rd.result)) UI.toast('That file could not be read.'); };
      rd.readAsText(f); };
    i.click();
  }
  if(a==='reset'){ if(confirm('Delete all progress? This cannot be undone.')) S.reset(); }
});

})();
</script>
