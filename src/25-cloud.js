<script>
/* ============================================================
   CLOUD — Supabase auth, sync and telemetry.

   Local-first by design. The app works completely without an
   account and completely offline; the cloud is additive. If the
   CDN is blocked, the network is down, or the config is blank,
   everything degrades to exactly the previous behaviour.

   NEVER uploads audio. Derived numbers only.
   ============================================================ */
'use strict';

var CLOUD_CONFIG = {
  url: 'https://pbppdiytunqhbouyreek.supabase.co',
  key: 'sb_publishable_JldfAxoUGGHON5PXY7e20w_SmCAT1_f'
};

var Cloud = (function(){

var sb=null, ready=false, booting=null;
var user=null, profile=null;
var listeners=[];
var queue=[];              // telemetry waiting to flush
var pushTimer=null, flushTimer=null;
var sessionStart=Date.now(), activeMs=0, lastTick=Date.now(), focused=true;

function on(fn){ listeners.push(fn); }
function emit(){ listeners.forEach(function(f){ try{f();}catch(e){} }); }

function configured(){ return !!(CLOUD_CONFIG.url && CLOUD_CONFIG.key); }

/* ---------- boot ---------- */
function boot(){
  if(booting) return booting;
  if(!configured()) return Promise.resolve(false);
  booting = import('https://esm.sh/@supabase/supabase-js@2').then(function(m){
    sb = m.createClient(CLOUD_CONFIG.url, CLOUD_CONFIG.key, {
      auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:false}
    });
    return sb.auth.getSession();
  }).then(function(res){
    ready = true;
    var s = res && res.data && res.data.session;
    if(s && s.user){ user = s.user; return loadProfile().then(pullAll); }
  }).then(function(){
    if(sb) sb.auth.onAuthStateChange(function(evt, sess){
      if(evt==='SIGNED_OUT'){ user=null; profile=null; emit(); }
    });
    emit();
    return true;
  }).catch(function(e){
    ready=false;
    console.warn('[cloud] unavailable —', e && e.message);
    return false;
  });
  return booting;
}

/* ---------- auth ---------- */
function signUp(f){
  // f: {email, pin, username, fullName, phone}
  if(!ready) return Promise.reject(new Error('Cloud not ready'));
  if(!/^\d{6}$/.test(f.pin)) return Promise.reject(new Error('PIN must be exactly 6 digits'));
  return sb.auth.signUp({
    email: f.email.trim(),
    password: f.pin,
    options:{ data:{
      username: (f.username||'').trim(),
      full_name: (f.fullName||'').trim(),
      phone: (f.phone||'').trim(),
      org: 'sprk'
    }}
  }).then(function(r){
    if(r.error) throw r.error;
    user = r.data.user;
    if(!r.data.session){
      // shouldn't happen with confirm-email off, but handle it
      return signIn(f.email, f.pin);
    }
    return loadProfile().then(function(){ return pushAll(true); });
  }).then(function(){ emit(); return true; });
}

function signIn(email, pin){
  if(!ready) return Promise.reject(new Error('Cloud not ready'));
  return sb.auth.signInWithPassword({email:email.trim(), password:pin}).then(function(r){
    if(r.error) throw r.error;
    user = r.data.user;
    return loadProfile().then(pullAll);
  }).then(function(){ emit(); return true; });
}

function signOut(){
  if(!ready) return Promise.resolve();
  return pushAll(true).catch(function(){}).then(function(){
    return sb.auth.signOut();
  }).then(function(){ user=null; profile=null; emit(); });
}

function loadProfile(){
  if(!user) return Promise.resolve(null);
  return sb.from('profiles').select('*').eq('id', user.id).maybeSingle().then(function(r){
    profile = r.data || null;
    if(profile) sb.from('profiles').update({last_seen:new Date().toISOString()}).eq('id',user.id).then(function(){});
    return profile;
  });
}

function signedIn(){ return !!user; }
function isAdmin(){ return !!(profile && profile.role==='admin'); }
function me(){ return {user:user, profile:profile}; }

/* ---------- sync ---------- */
function pullAll(){
  if(!user) return Promise.resolve();
  return Promise.all([
    sb.from('progress').select('payload,updated_at').eq('user_id',user.id).maybeSingle(),
    sb.from('voice_profiles').select('payload').eq('user_id',user.id).maybeSingle()
  ]).then(function(res){
    var p = res[0] && res[0].data, v = res[1] && res[1].data;
    var local = S.raw();
    if(p && p.payload && Object.keys(p.payload).length){
      var remote = p.payload;
      // remote wins only if it is genuinely further along — protects a
      // fresh browser from wiping a phone's progress and vice versa
      if((remote.reps||0) >= (local.reps||0)) S.mergeRemote(remote);
    }
    if(v && v.payload && v.payload.done && !(local.profile && local.profile.done)){
      S.raw().profile = v.payload; Audio.setProfile(v.payload); S.save();
    }
    if(window.UI) UI.render();
  }).catch(function(e){ console.warn('[cloud] pull failed', e && e.message); });
}

function pushAll(immediate){
  if(!user || !ready) return Promise.resolve();
  if(!immediate){
    clearTimeout(pushTimer);
    return new Promise(function(res){ pushTimer=setTimeout(function(){ pushAll(true).then(res); }, 4000); });
  }
  var s = S.raw(), lp = S.levelProgress();
  var payload = JSON.parse(JSON.stringify(s));
  delete payload.advisorMisses;   // those go to their own table
  if(payload.prefs) delete payload.prefs.demoUnlock;  // device-local, never synced
  payload.secondsActive = Math.round(totalSeconds());

  var jobs = [
    sb.from('progress').upsert({
      user_id:user.id, payload:payload, xp:s.xp|0, level:lp.lvl|0,
      reps:s.reps|0, streak:s.streak|0, updated_at:new Date().toISOString()
    }, {onConflict:'user_id'})
  ];
  if(s.profile && s.profile.done){
    var vp=s.profile;
    jobs.push(sb.from('voice_profiles').upsert({
      user_id:user.id, payload:vp,
      modal_hz:vp.modalHz||null, low_hz:vp.lowHz||null, high_hz:vp.highHz||null,
      flat_span: vp.flat?vp.flat.span:null,
      nat_span:  vp.natural?vp.natural.span:null,
      ceil_span: vp.expressive?vp.expressive.span:null,
      updated_at:new Date().toISOString()
    }, {onConflict:'user_id'}));
  }
  return Promise.all(jobs).catch(function(e){ console.warn('[cloud] push failed', e && e.message); });
}

/* ---------- telemetry ---------- */
function log(table, row){
  if(!configured()) return;
  queue.push({t:table, r:row});
  if(queue.length>400) queue.shift();
  clearTimeout(flushTimer);
  flushTimer=setTimeout(flush, 2500);
}
function flush(){
  if(!ready || !user || !queue.length) return Promise.resolve();
  var batch=queue.splice(0, queue.length);
  var byTable={};
  batch.forEach(function(x){
    (byTable[x.t]=byTable[x.t]||[]).push(Object.assign({user_id:user.id}, x.r));
  });
  return Promise.all(Object.keys(byTable).map(function(t){
    return sb.from(t).insert(byTable[t]);
  })).catch(function(e){
    console.warn('[cloud] telemetry flush failed', e && e.message);
    queue = batch.concat(queue);   // put it back, try again later
  });
}

function logRep(o){
  log('reps', {
    tone:o.tone||null, drill:o.drill||null, score:o.score==null?null:Math.round(o.score),
    wpm:num(o.wpm), span:num(o.span), term:num(o.term), dyn:num(o.dyn),
    pause_frac:num(o.pauseFrac), floor_drop:num(o.floorDrop), fry_pct:num(o.fryPct),
    base_hz:num(o.baseHz), personalised: !!o.personalised
  });
}
function logFairness(o){
  log('fairness_flags', {
    verdict:o.verdict, tone:o.tone||null, score:o.score==null?null:Math.round(o.score),
    acoustics:o.acoustics||null, note:o.note||null
  });
}
function logAdvisorMiss(o){
  log('advisor_misses', {
    stage:o.stage||null, line:(o.line||'').slice(0,600),
    mods:o.mods||[], recommended:o.recommended||null, expected:o.expected||null
  });
}
function logFeedback(o){
  log('feedback', {page:o.page||null, message:(o.message||'').slice(0,4000), context:o.context||null});
  return flush();
}
function num(v){ return (v==null||isNaN(v))?null:Math.round(v*100)/100; }

/* ---------- time on task ---------- */
function tick(){
  var now=Date.now();
  if(focused && now-lastTick < 65000) activeMs += now-lastTick;
  lastTick=now;
}
function totalSeconds(){
  tick();
  return (S.raw().secondsActive||0) + activeMs/1000;
}
setInterval(function(){
  tick();
  if(activeMs > 30000){
    S.raw().secondsActive = Math.round((S.raw().secondsActive||0) + activeMs/1000);
    activeMs = 0; S.save();
    if(user) pushAll();
  }
}, 30000);
document.addEventListener('visibilitychange', function(){
  tick(); focused = !document.hidden; lastTick=Date.now();
});
window.addEventListener('beforeunload', function(){
  tick();
  S.raw().secondsActive = Math.round((S.raw().secondsActive||0) + activeMs/1000);
  S.save();
});

/* ---------- admin ---------- */
function team(){
  if(!ready || !isAdmin()) return Promise.resolve(null);
  return Promise.all([
    sb.from('team_overview').select('*').order('reps', {ascending:false}),
    sb.from('team_weak_tones').select('*'),
    sb.from('fairness_flags').select('*').order('created_at',{ascending:false}).limit(60),
    sb.from('advisor_misses').select('*').order('created_at',{ascending:false}).limit(60),
    sb.from('feedback').select('*').order('created_at',{ascending:false}).limit(60),
    sb.from('reps').select('user_id,tone,score,created_at,drill').order('created_at',{ascending:false}).limit(800)
  ]).then(function(r){
    return {
      people:  r[0].data||[], weak: r[1].data||[],
      fairness:r[2].data||[], misses:r[3].data||[],
      feedback:r[4].data||[], reps:r[5].data||[]
    };
  }).catch(function(e){ console.warn('[cloud] team fetch failed', e && e.message); return null; });
}

return {
  boot:boot, configured:configured, isReady:function(){return ready;},
  signUp:signUp, signIn:signIn, signOut:signOut,
  signedIn:signedIn, isAdmin:isAdmin, me:me, on:on,
  pushAll:pushAll, pullAll:pullAll, flush:flush,
  logRep:logRep, logFairness:logFairness, logAdvisorMiss:logAdvisorMiss, logFeedback:logFeedback,
  totalSeconds:totalSeconds, team:team
};
})();
</script>
