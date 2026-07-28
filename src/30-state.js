<script>
/* ============================================================
   STATE — persistence, XP, mastery, streaks, spaced repetition
   ============================================================ */
'use strict';

var Store = (function(){
  var KEY='tonalitygym.v1';
  var mem={};
  var ok=(function(){ try{ var k='__t'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return true; }catch(e){ return false; } })();
  return {
    get:function(){
      if(!ok) return mem[KEY]||null;
      try{ var v=localStorage.getItem(KEY); return v?JSON.parse(v):null; }catch(e){ return null; }
    },
    set:function(v){
      if(!ok){ mem[KEY]=v; return; }
      try{ localStorage.setItem(KEY, JSON.stringify(v)); }catch(e){}
    },
    clear:function(){ if(!ok){ mem={}; return; } try{ localStorage.removeItem(KEY); }catch(e){} },
    available:ok
  };
})();

var S = (function(){
  var def={
    v:1, xp:0, reps:0, scored:0, sessions:0,
    mastery:{},        // toneId -> {m:0-100, n:reps, last:ts, best:0}
    twisters:{},       // twisterId -> {cleared:bool, bpm:n, reps:n}
    codexRead:{}, powerRead:{},
    ach:{}, day:1, dayDone:{},
    streak:0, lastDay:null, bestStreak:0,
    hist:[],           // {ts, tone, score, wpm, span, term}
    prefs:{theme:'dark', ref:'auto', voice:'unset', hardMode:false, autoNext:true, showNums:true},
    counters:{warmups:0, perfect:0, floorStreak:0, twCleared:0, gauntlets:0, gauntletBest:0, scripts:0},
    firstSeen:null
  };
  var s = Store.get() || JSON.parse(JSON.stringify(def));
  // migrate missing keys
  (function fill(t,d){ for(var k in d){ if(!(k in t)) t[k]=JSON.parse(JSON.stringify(d[k]));
    else if(d[k] && typeof d[k]==='object' && !Array.isArray(d[k])) fill(t[k],d[k]); } })(s,def);
  if(!s.firstSeen) s.firstSeen=Date.now();

  function save(){ Store.set(s); }
  function today(){ var d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
  function dayDiff(a,b){
    if(!a) return 99;
    var pa=a.split('-').map(Number), pb=b.split('-').map(Number);
    var da=new Date(pa[0],pa[1]-1,pa[2]), db=new Date(pb[0],pb[1]-1,pb[2]);
    return Math.round((db-da)/86400000);
  }

  function touchDay(){
    var t=today();
    if(s.lastDay===t) return;
    var d=dayDiff(s.lastDay,t);
    if(d===1) s.streak++;
    else if(d>1||d===99) s.streak=1;
    s.lastDay=t; s.sessions++;
    if(s.streak>s.bestStreak) s.bestStreak=s.streak;
    checkAch(); save();
  }

  function level(){
    var l=1; while(l<50 && s.xp>=cumXp(l+1)) l++;
    return l;
  }
  function cumXp(l){ var t=0; for(var i=1;i<l;i++) t+=xpForLevel(i); return t; }
  function levelProgress(){
    var l=level(), a=cumXp(l), b=cumXp(l+1);
    return {lvl:l, rank:rankFor(l), cur:s.xp-a, need:b-a, pct: b>a ? (s.xp-a)/(b-a)*100 : 100, total:s.xp};
  }

  function addXp(n, why){
    s.xp+=n; touchDay(); checkAch(); save();
    if(window.UI && UI.toast) UI.toast('<b>+'+n+' XP</b> · '+(why||''), 'xp');
    if(window.UI && UI.paintHud) UI.paintHud();
  }

  /* mastery with decay: loses 1 point per day after 3 days idle */
  function masteryOf(id){
    var m=s.mastery[id];
    if(!m) return 0;
    var days=Math.floor((Date.now()-(m.last||Date.now()))/86400000);
    var decay=Math.max(0, days-3);
    return Math.max(0, Math.round(m.m - decay));
  }
  function rawMastery(id){ return s.mastery[id] ? s.mastery[id].m : 0; }

  function recordRep(toneId, score, extra){
    touchDay();
    s.reps++;
    var m=s.mastery[toneId] || (s.mastery[toneId]={m:0,n:0,last:0,best:0});
    if(score!=null){
      s.scored++;
      // exponential moving toward the score, weighted by how many reps done
      var w = m.n<3 ? 0.45 : m.n<8 ? 0.3 : 0.18;
      var base=masteryOf(toneId);
      m.m = Math.round(clamp01(base + (score-base)*w));
      if(score>m.best) m.best=score;
      s.hist.push({ts:Date.now(), tone:toneId, score:score,
        wpm: extra&&extra.wpm?Math.round(extra.wpm):null,
        span: extra&&extra.span!=null?+extra.span.toFixed(1):null,
        term: extra&&extra.term!=null?+extra.term.toFixed(1):null});
      if(s.hist.length>900) s.hist=s.hist.slice(-900);
      if(score>=95){ s.counters.perfect++; }
      if(extra && extra.floorDrop!=null){
        if(extra.floorDrop<4) s.counters.floorStreak++; else s.counters.floorStreak=0;
      }
    }
    m.n++; m.last=Date.now();
    var xp = score==null ? 6 : Math.max(5, Math.round(score/6) + (score>=90?12:score>=75?6:0));
    s.xp+=xp;
    checkAch(); save();
    if(window.UI && UI.paintHud) UI.paintHud();
    return xp;
  }
  function clamp01(v){ return v<0?0:v>100?100:v; }

  /* spaced repetition queue: weakest & stalest first, unlocked only */
  function weakQueue(n, filterFam){
    var lvl=level();
    var pool=TONES.filter(function(t){
      if(t.fam==='defect') return false;
      if(filterFam && t.fam!==filterFam) return false;
      return tierUnlocked(t.tier);
    });
    var scored=pool.map(function(t){
      var m=s.mastery[t.id];
      var mast=masteryOf(t.id);
      var days = m ? (Date.now()-(m.last||0))/86400000 : 999;
      var urgency = (100-mast)*1.0 + Math.min(60, days*4) + (m?0:35);
      return {t:t, u:urgency, m:mast};
    });
    scored.sort(function(a,b){ return b.u-a.u; });
    return scored.slice(0, n||8).map(function(x){ return x.t; });
  }

  function tierUnlocked(tier){
    var l=level();
    return tier<=1 || (tier===2 && l>=4) || (tier===3 && l>=9) || (tier===4 && l>=16);
  }
  function tierNeed(tier){ return tier<=1?1:tier===2?4:tier===3?9:16; }

  /* achievements */
  function grant(id){
    if(s.ach[id]) return false;
    s.ach[id]=Date.now();
    var a=ACHIEVEMENTS.filter(function(x){return x.id===id;})[0];
    if(a && window.UI && UI.toast) UI.toast(a.i+' <b>'+a.n+'</b> unlocked', 'xp');
    s.xp+=45;
    return true;
  }
  function checkAch(){
    var c=s.counters;
    if(s.scored>=1) grant('first');
    if(c.warmups>=10) grant('warm10');
    if(s.streak>=3) grant('streak3');
    if(s.streak>=7) grant('streak7');
    if(s.streak>=30) grant('streak30');
    if(s.reps>=100) grant('reps100');
    if(s.reps>=500) grant('reps500');
    if(s.reps>=2000) grant('reps2000');
    if(c.perfect>=1) grant('perf');
    if(c.perfect>=5) grant('perf5');
    if(c.floorStreak>=10) grant('floor');
    if(c.twCleared>=25) grant('tw25');
    if(c.twCleared>=100) grant('tw100');
    if(c.gauntlets>=1) grant('gaunt');
    if(c.gauntletBest>=85) grant('gaunt90');
    if(c.scripts>=1) grant('script');
    var core=['neutral','concern','challenge','skeptic','vision','consequence','certainty'];
    if(core.every(function(id){ return masteryOf(id)>=70; })) grant('seven');
    var fams={}; Object.keys(s.mastery).forEach(function(id){ if(TONE_BY_ID[id]) fams[TONE_BY_ID[id].fam]=1; });
    if(Object.keys(fams).length>=9) grant('allfam');
    if(CODEX.every(function(x){ return s.codexRead[x.id]; })) grant('codex');
    if(Object.keys(s.powerRead).length>=PRINCIPLES.length) grant('power');
    if(s.dayDone[30]) grant('day30');
    if(s.dayDone[90]) grant('day90');
  }
  function noteMetric(k,v){
    if(k==='span' && v>=10) grant('mono');
    if(k==='term' && v<=-7) grant('fall');
    if(k==='pause' && v>=2) grant('silence');
    if(k==='brutal') grant('brutal');
    save();
  }

  function stats(){
    var h=s.hist;
    var last20=h.slice(-20), last100=h.slice(-100);
    function avg(a,f){ var v=a.map(f).filter(function(x){return x!=null;}); return v.length? v.reduce(function(p,c){return p+c;},0)/v.length : null; }
    var masteries=TONES.filter(function(t){return t.fam!=='defect';}).map(function(t){ return masteryOf(t.id); });
    return {
      avgRecent: avg(last20,function(x){return x.score;}),
      avg100: avg(last100,function(x){return x.score;}),
      avgWpm: avg(last100,function(x){return x.wpm;}),
      avgSpan: avg(last100,function(x){return x.span;}),
      avgTerm: avg(last100,function(x){return x.term;}),
      overall: masteries.length ? masteries.reduce(function(a,b){return a+b;},0)/masteries.length : 0,
      covered: Object.keys(s.mastery).length,
      total: TONES.length
    };
  }

  function reset(){ Store.clear(); location.reload(); }
  function exportJson(){ return JSON.stringify(s,null,2); }
  function importJson(txt){
    try{ var o=JSON.parse(txt); if(!o||typeof o!=='object') throw 0;
      Store.set(o); location.reload(); return true; }catch(e){ return false; }
  }

  return {
    raw:function(){return s;}, save:save, level:level, levelProgress:levelProgress,
    addXp:addXp, recordRep:recordRep, masteryOf:masteryOf, rawMastery:rawMastery,
    weakQueue:weakQueue, tierUnlocked:tierUnlocked, tierNeed:tierNeed,
    grant:grant, checkAch:checkAch, noteMetric:noteMetric, stats:stats, touchDay:touchDay,
    reset:reset, exportJson:exportJson, importJson:importJson, today:today
  };
})();
</script>
