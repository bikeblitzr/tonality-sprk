<script>
/* ============================================================
   REFERENCE CLIPS — your best and worst take of each tone, kept
   on this device so you can play them back to back.

   Audio still never leaves the browser. This stores it in IndexedDB
   instead of throwing it away at the end of the rep, which is the only
   thing that changes. Settings has a one-click wipe.

   Budget: 16 kHz mono, 12 seconds max, two clips per tone, and only
   for the 20 most recently trained tones — about 15 MB at the ceiling.
   ============================================================ */
var Clips = (function(){
'use strict';

var DB='tonalitygym.clips', STORE='clips', META='meta', VER=1;
var MAX_TONES=20, MAX_SEC=12, RATE=16000;
var dbp=null, supported = typeof indexedDB!=='undefined';

function open(){
  if(!supported) return Promise.reject(new Error('no indexeddb'));
  if(dbp) return dbp;
  dbp = new Promise(function(res, rej){
    var rq;
    try{ rq=indexedDB.open(DB, VER); }catch(e){ rej(e); return; }
    rq.onupgradeneeded=function(){
      var d=rq.result;
      if(!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
      if(!d.objectStoreNames.contains(META))  d.createObjectStore(META);
    };
    rq.onsuccess=function(){ res(rq.result); };
    rq.onerror=function(){ rej(rq.error); };
  }).catch(function(e){ dbp=null; throw e; });
  return dbp;
}

function tx(store, mode){
  return open().then(function(d){
    return d.transaction(store, mode).objectStore(store);
  });
}
function req(r){
  return new Promise(function(res, rej){
    r.onsuccess=function(){ res(r.result); };
    r.onerror=function(){ rej(r.error); };
  });
}

/* ---- the record for one tone: {best:{score,blob,at}, worst:{...}} ---- */
function get(toneId){
  if(!supported) return Promise.resolve(null);
  return tx(STORE,'readonly').then(function(st){ return req(st.get(toneId)); })
    .catch(function(){ return null; });
}

function put(toneId, rec){
  return tx(STORE,'readwrite').then(function(st){ return req(st.put(rec, toneId)); });
}

/* least-recently-trained tones get dropped so this cannot grow forever */
function touchAndTrim(toneId){
  return tx(META,'readwrite').then(function(st){
    return req(st.get('order')).then(function(order){
      order = Array.isArray(order) ? order.filter(function(x){ return x!==toneId; }) : [];
      order.unshift(toneId);
      var drop = order.slice(MAX_TONES);
      order = order.slice(0, MAX_TONES);
      return req(st.put(order,'order')).then(function(){ return drop; });
    });
  }).then(function(drop){
    if(!drop.length) return;
    return tx(STORE,'readwrite').then(function(st){
      return Promise.all(drop.map(function(id){ return req(st.delete(id)); }));
    });
  }).catch(function(){});
}

/* Called after every scored rep. Keeps the take only if it beats the
   stored best or undercuts the stored worst — so the pair always
   brackets everything you have produced for that tone. */
function record(toneId, score, opts){
  if(!supported || !toneId || score==null) return Promise.resolve(null);
  opts=opts||{};
  return get(toneId).then(function(rec){
    rec = rec || {};
    var isBest  = !rec.best  || score >  rec.best.score;
    var isWorst = !rec.worst || score <  rec.worst.score;
    /* first ever take is both, so there is something to hear immediately */
    if(!isBest && !isWorst) return null;
    var blob = Audio.exportWavSmall(MAX_SEC, RATE);
    if(!blob) return null;
    var entry = {score:score, blob:blob, at:Date.now(), line:opts.line||null};
    if(isBest)  rec.best  = entry;
    if(isWorst) rec.worst = entry;
    /* one rep should never be shown as both ends of a comparison */
    if(rec.best && rec.worst && rec.best.at===rec.worst.at && rec.best.score===rec.worst.score){
      rec.worst = null;
    }
    return put(toneId, rec)
      .then(function(){ return touchAndTrim(toneId); })
      .then(function(){ return {best:isBest, worst:isWorst}; });
  }).catch(function(){ return null; });
}

/* ---- playback ---- */
var au=null, curUrl=null;
function stop(){
  if(au){ try{ au.pause(); }catch(e){} au=null; }
  if(curUrl){ URL.revokeObjectURL(curUrl); curUrl=null; }
}
function play(blob, onEnd){
  stop();
  if(!blob) { if(onEnd) onEnd(); return; }
  curUrl = URL.createObjectURL(blob);
  au = new window.Audio(curUrl);
  au.onended = function(){ stop(); if(onEnd) onEnd(); };
  au.onerror  = function(){ stop(); if(onEnd) onEnd(); };
  au.play().catch(function(){ stop(); if(onEnd) onEnd(); });
}

function clearAll(){
  if(!supported) return Promise.resolve();
  return open().then(function(d){
    return Promise.all([STORE,META].map(function(name){
      return req(d.transaction(name,'readwrite').objectStore(name).clear());
    }));
  }).catch(function(){});
}

function stats(){
  if(!supported) return Promise.resolve({tones:0, clips:0, bytes:0});
  return tx(STORE,'readonly').then(function(st){
    return Promise.all([req(st.getAll()), req(st.getAllKeys())]);
  }).then(function(r){
    var recs=r[0]||[], clips=0, bytes=0;
    recs.forEach(function(x){
      ['best','worst'].forEach(function(k){
        if(x && x[k] && x[k].blob){ clips++; bytes += x[k].blob.size||0; }
      });
    });
    return {tones:recs.length, clips:clips, bytes:bytes};
  }).catch(function(){ return {tones:0, clips:0, bytes:0}; });
}

return {supported:supported, record:record, get:get, play:play, stop:stop,
        clearAll:clearAll, stats:stats, MAX_SEC:MAX_SEC, MAX_TONES:MAX_TONES};
})();
</script>
