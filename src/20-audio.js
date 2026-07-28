<script>
/* ============================================================
   AUDIO ENGINE
   Mic capture · pitch tracking (McLeod/NSDF) · RMS envelope
   VAD & pause detection · rate estimation · terminal inflection
   dynamic range · recording & playback · scoring
   ============================================================ */
'use strict';

var Audio = (function(){

var ctx=null, stream=null, source=null, analyser=null, proc=null, gain=null;
var SR=48000, BUF=2048;
var running=false, capturing=false;
var listeners=[];

/* rolling capture */
var frames=[];         // {t, f0, rms, db, voiced}
var chunks=[];         // Float32 audio for playback
var t0=0;
var lastErr=null;
var micState='idle';   // idle | live | denied | error

/* ---------- helpers ---------- */
function hzToSt(hz, ref){ return 12*Math.log2(hz/ref); }
function median(a){ if(!a.length) return 0; var b=a.slice().sort(function(x,y){return x-y;}); var m=b.length>>1;
  return b.length%2 ? b[m] : (b[m-1]+b[m])/2; }
function pct(a,p){ if(!a.length) return 0; var b=a.slice().sort(function(x,y){return x-y;});
  var i=(b.length-1)*p; var lo=Math.floor(i), hi=Math.ceil(i);
  return lo===hi ? b[lo] : b[lo]+(b[hi]-b[lo])*(i-lo); }
function mean(a){ return a.length ? a.reduce(function(s,x){return s+x;},0)/a.length : 0; }
function clamp(v,a,b){ return v<a?a:v>b?b:v; }

/* ---------- pitch: McLeod Pitch Method (normalised square difference) ---------- */
function detectPitch(buf, sr){
  var n=buf.length, i, j;
  // quick energy gate
  var rms=0; for(i=0;i<n;i++) rms+=buf[i]*buf[i];
  rms=Math.sqrt(rms/n);
  if(rms<0.006) return -1;

  var maxLag=Math.floor(sr/60);      // 60 Hz floor
  var minLag=Math.floor(sr/900);     // 900 Hz ceiling
  if(maxLag>n-1) maxLag=n-1;

  var nsdf=new Float32Array(maxLag+1);
  for(var lag=minLag; lag<=maxLag; lag++){
    var ac=0, m=0;
    var lim=n-lag;
    for(i=0;i<lim;i++){
      var a=buf[i], b=buf[i+lag];
      ac += a*b;
      m  += a*a + b*b;
    }
    nsdf[lag] = m>0 ? (2*ac/m) : 0;
  }

  // pick peaks after first negative zero crossing
  var start=minLag;
  while(start<=maxLag && nsdf[start]>0) start++;
  var peaks=[], maxVal=-1;
  for(i=start+1;i<maxLag;i++){
    if(nsdf[i]>nsdf[i-1] && nsdf[i]>=nsdf[i+1]){
      // parabolic refine
      var a2=nsdf[i-1], b2=nsdf[i], c2=nsdf[i+1];
      var d=(a2-2*b2+c2);
      var shift = d!==0 ? 0.5*(a2-c2)/d : 0;
      var val = d!==0 ? b2 - 0.25*(a2-c2)*shift : b2;
      peaks.push({lag:i+shift, val:val});
      if(val>maxVal) maxVal=val;
    }
  }
  if(!peaks.length || maxVal<0.4) return -1;

  var thresh=maxVal*0.87;
  for(j=0;j<peaks.length;j++){
    if(peaks[j].val>=thresh){
      var f=sr/peaks[j].lag;
      if(f>=60 && f<=900) return f;
      return -1;
    }
  }
  return -1;
}

/* ---------- octave-error smoothing ---------- */
function smoothF0(arr){
  var out=arr.slice();
  var vals=arr.filter(function(v){return v>0;});
  if(vals.length<6) return out;
  var med=median(vals);
  for(var i=0;i<out.length;i++){
    if(out[i]<=0) continue;
    // fix octave jumps against the running median
    if(out[i] > med*1.7) out[i]/=2;
    else if(out[i] < med*0.58) out[i]*=2;
  }
  // median filter of 5
  var f=out.slice();
  for(i=2;i<out.length-2;i++){
    var w=[out[i-2],out[i-1],out[i],out[i+1],out[i+2]].filter(function(v){return v>0;});
    if(w.length>=3) f[i]=median(w);
  }
  return f;
}

/* ---------- init ---------- */
function ready(){ return micState==='live'; }
function state(){ return micState; }
function error(){ return lastErr; }

function start(){
  if(running) return Promise.resolve(true);
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    micState='error'; lastErr='This browser does not expose microphone access.'; emit(); return Promise.resolve(false);
  }
  return navigator.mediaDevices.getUserMedia({audio:{
      echoCancellation:false, noiseSuppression:false, autoGainControl:false, channelCount:1
    }}).then(function(s){
    stream=s;
    var AC=window.AudioContext||window.webkitAudioContext;
    ctx=new AC();
    SR=ctx.sampleRate;
    source=ctx.createMediaStreamSource(stream);
    analyser=ctx.createAnalyser();
    analyser.fftSize=BUF; analyser.smoothingTimeConstant=0;
    gain=ctx.createGain(); gain.gain.value=0;
    proc=ctx.createScriptProcessor(BUF,1,1);
    source.connect(analyser);
    source.connect(proc);
    proc.connect(gain); gain.connect(ctx.destination);
    proc.onaudioprocess=onAudio;
    running=true; micState='live'; lastErr=null; emit();
    return true;
  }).catch(function(e){
    micState = (e && (e.name==='NotAllowedError'||e.name==='PermissionDeniedError')) ? 'denied' : 'error';
    lastErr = (e && e.message) || 'Microphone unavailable.';
    emit();
    return false;
  });
}

function stop(){
  try{ if(proc){proc.disconnect(); proc.onaudioprocess=null;} }catch(e){}
  try{ if(source) source.disconnect(); }catch(e){}
  try{ if(gain) gain.disconnect(); }catch(e){}
  try{ if(stream) stream.getTracks().forEach(function(t){t.stop();}); }catch(e){}
  try{ if(ctx && ctx.close) ctx.close(); }catch(e){}
  ctx=stream=source=analyser=proc=gain=null;
  running=false; capturing=false; micState='idle'; emit();
}

/* ---------- live frame handler ---------- */
var liveF0=-1, liveDb=-90, liveRms=0;
var specBins=new Uint8Array(16);

function onAudio(ev){
  var buf=ev.inputBuffer.getChannelData(0);
  var n=buf.length, i, s=0;
  for(i=0;i<n;i++) s+=buf[i]*buf[i];
  var rms=Math.sqrt(s/n);
  var db=20*Math.log10(Math.max(rms,1e-7));
  liveRms=rms; liveDb=db;
  var f0=detectPitch(buf, SR);
  liveF0=f0;

  if(analyser){
    var fd=new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fd);
    var step=Math.floor(fd.length/16);
    for(i=0;i<16;i++){
      var m=0; for(var j=0;j<step;j++){ var v=fd[i*step+j]; if(v>m) m=v; }
      specBins[i]=m;
    }
  }

  if(capturing){
    var t=(performance.now()-t0)/1000;
    frames.push({t:t, f0:f0, rms:rms, db:db, voiced:f0>0 && db>-52});
    var c=new Float32Array(n); c.set(buf); chunks.push(c);
    if(frames.length>24000){ frames.shift(); chunks.shift(); }
  }
}

/* ---------- capture control ---------- */
function beginCapture(){ frames=[]; chunks=[]; t0=performance.now(); capturing=true; }
function endCapture(){ capturing=false; return analyse(); }
function isCapturing(){ return capturing; }
function live(){ return {f0:liveF0, db:liveDb, rms:liveRms, spec:specBins, elapsed: capturing?(performance.now()-t0)/1000:0}; }
function liveFrames(){ return frames; }

/* ---------- analysis ---------- */
function analyse(){
  var raw=frames.slice();
  if(raw.length<10) return null;

  var f0raw=raw.map(function(f){return f.f0>0?f.f0:-1;});
  var f0s=smoothF0(f0raw);
  for(var i=0;i<raw.length;i++) raw[i].f0s=f0s[i];

  var voiced=raw.filter(function(f){ return f.f0s>0 && f.db>-52; });
  if(voiced.length<6) return {empty:true, dur:raw.length? raw[raw.length-1].t : 0};

  var hz=voiced.map(function(f){return f.f0s;});
  var baseline=median(hz);

  /* --- pitch span: 80th-percentile in semitones (never min/max) --- */
  var sts=hz.map(function(h){ return hzToSt(h, baseline); });
  var span = pct(sts,0.9) - pct(sts,0.1);

  /* --- pause / VAD segmentation --- */
  var dbs=raw.map(function(f){return f.db;});
  var loud=pct(dbs,0.92);
  var floorDb=pct(dbs,0.08);
  var gate=Math.max(loud-26, floorDb+7, -60);
  var frameDur = raw.length>1 ? (raw[raw.length-1].t-raw[0].t)/(raw.length-1) : BUF/SR;

  var segs=[], cur=null;
  for(i=0;i<raw.length;i++){
    var on = raw[i].db>gate;
    if(on){ if(!cur){cur={s:raw[i].t,e:raw[i].t};} else cur.e=raw[i].t; }
    else { if(cur){ segs.push(cur); cur=null; } }
  }
  if(cur) segs.push(cur);
  // merge segments separated by < 120 ms
  var merged=[];
  segs.forEach(function(s){
    if(merged.length && s.s - merged[merged.length-1].e < 0.12) merged[merged.length-1].e=s.e;
    else merged.push({s:s.s,e:s.e});
  });
  segs=merged.filter(function(s){ return s.e-s.s > 0.05; });

  var pauses=[];
  for(i=1;i<segs.length;i++){
    var g=segs[i].s - segs[i-1].e;
    if(g>=0.2) pauses.push(g);
  }
  var dur = raw[raw.length-1].t - raw[0].t;
  var speechTime = segs.reduce(function(a,s){ return a + (s.e-s.s); }, 0);
  var pauseFrac = dur>0 ? (1 - speechTime/dur)*100 : 0;
  var trailPause = segs.length ? Math.max(0, dur - segs[segs.length-1].e) : 0;

  /* --- terminal inflection: last voiced run --- */
  var term=0, termConf=0;
  var tail=[];
  for(i=raw.length-1;i>=0;i--){
    if(raw[i].f0s>0 && raw[i].db>gate) tail.push(raw[i]);
    else if(tail.length>4) break;
    if(tail.length>40) break;
  }
  tail.reverse();
  if(tail.length>=6){
    var half=Math.max(2,Math.floor(tail.length/2));
    var early=median(tail.slice(0,half).map(function(f){return f.f0s;}));
    var late =median(tail.slice(-half).map(function(f){return f.f0s;}));
    if(early>0 && late>0){ term = hzToSt(late, early); termConf = Math.min(1, tail.length/14); }
  }

  /* --- peak-to-end fall (nuclear peak → final) --- */
  var nucFall=0;
  if(voiced.length>8){
    var lastQ = voiced.slice(Math.floor(voiced.length*0.55));
    var peakHz = pct(voiced.slice(0,Math.floor(voiced.length*0.8)).map(function(f){return f.f0s;}), 0.93);
    var endHz  = median(lastQ.slice(-Math.max(3,Math.floor(lastQ.length*0.28))).map(function(f){return f.f0s;}));
    if(peakHz>0 && endHz>0) nucFall = hzToSt(endHz, peakHz);
  }

  /* --- dynamic range: per-segment RMS in dB --- */
  var segDb=segs.map(function(s){
    var fs=raw.filter(function(f){ return f.t>=s.s && f.t<=s.e; });
    var e=mean(fs.map(function(f){return f.rms*f.rms;}));
    return 20*Math.log10(Math.max(Math.sqrt(e),1e-7));
  }).filter(function(v){return v>-70;});
  var dyn = segDb.length>1 ? (pct(segDb,0.95)-pct(segDb,0.05)) : 0;

  /* --- volume floor: final 18% vs overall --- */
  var voicedAll=raw.filter(function(f){return f.db>gate;});
  var overallDb = 20*Math.log10(Math.max(Math.sqrt(mean(voicedAll.map(function(f){return f.rms*f.rms;}))),1e-7));
  var tailN=Math.max(3, Math.floor(voicedAll.length*0.18));
  var tailDb = 20*Math.log10(Math.max(Math.sqrt(mean(voicedAll.slice(-tailN).map(function(f){return f.rms*f.rms;}))),1e-7));
  var floorDrop = overallDb - tailDb;

  /* --- fry detection: voiced frames well under modal --- */
  var fryFrames=voiced.filter(function(f){ return f.f0s < baseline*0.62; }).length;
  var fryPct = voiced.length ? fryFrames/voiced.length*100 : 0;

  return {
    empty:false,
    dur:dur, speechTime:speechTime,
    baseline:baseline, span:span, meanSt:mean(sts),
    lowSt:pct(sts,0.1), highSt:pct(sts,0.9),
    term:term, termConf:termConf, nucFall:nucFall,
    pauses:pauses, pauseCount:pauses.length,
    pauseFrac:pauseFrac, meanPause:mean(pauses), maxPause:pauses.length?Math.max.apply(null,pauses):0,
    trailPause:trailPause,
    dyn:dyn, floorDrop:floorDrop, overallDb:overallDb,
    segs:segs, segCount:segs.length,
    fryPct:fryPct,
    frames:raw, gate:gate, frameDur:frameDur
  };
}

/* ---------- rate ---------- */
function wpm(a, wordCount){
  if(!a || !a.speechTime || !wordCount) return 0;
  // exclude long pauses (>600ms) so the figure reflects articulation + normal junctures
  var longPause = a.pauses.filter(function(p){return p>0.6;}).reduce(function(s,p){return s+p;},0);
  var t = Math.max(0.3, a.dur - longPause);
  return wordCount/(t/60);
}

/* ---------- scoring ---------- */
function inBand(v, band){ return v>=band[0] && v<=band[1]; }
function bandScore(v, band, tolerance){
  if(inBand(v,band)) return 1;
  var tol = tolerance!=null ? tolerance : (band[1]-band[0])*0.9 + 0.001;
  var d = v<band[0] ? band[0]-v : v-band[1];
  return clamp(1 - d/tol, 0, 1);
}

function scoreAgainstTone(a, tone, wordCount){
  if(!a || a.empty) return null;
  var T=tone.target, parts=[], faults=[], wins=[];

  var W=wpm(a, wordCount);
  var sW=bandScore(W, T.wpm, 42);
  parts.push({k:'Pace', v:Math.round(W), u:'wpm', s:sW, band:T.wpm});
  if(sW<0.62){
    if(W<T.wpm[0]) faults.push({t:'warn',b:'Too slow for this tone',s:'Target is '+T.wpm[0]+'–'+T.wpm[1]+' wpm. You ran at '+Math.round(W)+'. Slow delivery reads as laboured rather than deliberate below about 120.'});
    else faults.push({t:'bad',b:'Rushing',s:'Target is '+T.wpm[0]+'–'+T.wpm[1]+' wpm. You ran at '+Math.round(W)+'. Rushing is almost always a pause problem, not a rate problem — add silence rather than slowing the words.'});
  } else wins.push('Pace sat in the pocket for this tone.');

  var sS=bandScore(a.span, T.span, 5);
  parts.push({k:'Range', v:a.span.toFixed(1), u:'st', s:sS, band:T.span});
  if(a.span<4) faults.push({t:'bad',b:'Monotone',s:'Only '+a.span.toFixed(1)+' semitones of range. Under 4 and listeners stop processing content. Widen the movement while keeping your mean pitch low — those are independent dials.'});
  else if(a.span>15) faults.push({t:'warn',b:'Theatrical range',s:a.span.toFixed(1)+' semitones. Over about 14 it reads as performance rather than conversation.'});
  else if(sS>=0.62) wins.push('Pitch range was in the engaged band.');

  var sT=bandScore(a.term, T.term, 3.4);
  var termLbl = a.term<=-1 ? 'falling' : a.term>=1 ? 'rising' : 'flat';
  parts.push({k:'Terminal', v:(a.term>0?'+':'')+a.term.toFixed(1), u:'st '+termLbl, s:sT, band:T.term});
  if(sT<0.6){
    if(T.term[1]<0 && a.term>-1) faults.push({t:'bad',b:'Terminal did not fall',s:'This tone needs a fall of '+Math.abs(T.term[1])+'–'+Math.abs(T.term[0])+' semitones. You ended '+termLbl+' ('+a.term.toFixed(1)+' st). A statement that ends level or rising is heard as unsure, and it is the fastest way to lose a claim.'});
    else if(T.term[0]>0 && a.term<1) faults.push({t:'bad',b:'Terminal did not lift',s:'This tone needs a genuine rise. You ended '+termLbl+'. A question delivered flat reads as an interrogation.'});
    else faults.push({t:'warn',b:'Terminal off target',s:'Target '+T.term[0]+' to '+T.term[1]+' st; you produced '+a.term.toFixed(1)+'.'});
  } else wins.push('Terminal inflection was correct for the tone.');

  var sD=bandScore(a.dyn, T.dyn, 5);
  parts.push({k:'Dynamics', v:a.dyn.toFixed(1), u:'dB', s:sD, band:T.dyn});
  if(a.dyn<4) faults.push({t:'warn',b:'Flat dynamics',s:'Only '+a.dyn.toFixed(1)+' dB between your quietest and loudest phrase. Aim for 8–12. Volume variation is the parameter most speakers never touch.'});

  var sP=bandScore(a.pauseFrac, T.pause, 12);
  parts.push({k:'Silence', v:Math.round(a.pauseFrac), u:'%', s:sP, band:T.pause});
  if(a.pauseFrac<10) faults.push({t:'bad',b:'No silence',s:'Only '+Math.round(a.pauseFrac)+'% of that was pause. Under 10% is the acoustic signature of rushing regardless of your word rate.'});
  else if(sP>=0.65) wins.push('Pause fraction was healthy.');

  if(a.floorDrop>4.5) faults.push({t:'bad',b:'Trailing off',s:'Your final syllables were '+a.floorDrop.toFixed(1)+' dB below the utterance average. A correct falling terminal keeps its intensity to the last consonant — target within 4 dB. This is a breath-planning problem: breathe one clause earlier.'});
  else if(a.floorDrop<=4.5 && a.term<-1) wins.push('You fell in pitch without falling in energy — that is the hard version and you got it.');

  if(a.fryPct>28) faults.push({t:'warn',b:'Phrase-final fry',s:Math.round(a.fryPct)+'% of your voiced frames dropped below your modal floor. Occasional creak is normal English; this much starts costing you. Breathe earlier.'});

  var weights={Pace:1, Range:1.25, Terminal:1.55, Dynamics:.8, Silence:1};
  var tot=0, wsum=0;
  parts.forEach(function(p){ var w=weights[p.k]||1; tot+=p.s*w; wsum+=w; });
  var score=Math.round(clamp(tot/wsum,0,1)*100);
  if(a.floorDrop>6) score=Math.max(0,score-7);
  if(a.span<3) score=Math.max(0,score-8);

  return {score:score, parts:parts, faults:faults, wins:wins, wpm:W};
}

/* ---------- targeted scorers ---------- */
function scoreTerminal(a, want){ // want: 'fall'|'rise'|'flat'
  if(!a||a.empty) return null;
  var t=a.term, ok, msg;
  if(want==='fall'){ ok = t<=-3; msg = ok ? 'Clean fall of '+Math.abs(t).toFixed(1)+' semitones.' :
    t<=-1 ? 'Only '+Math.abs(t).toFixed(1)+' st. Under 3 it is not reliably heard as a fall at all — go lower at the end, and keep the volume up while you do it.' :
    'You ended '+(t>=1?'rising':'flat')+'. That is the uptalk pattern. Say it again and put the last word at the bottom of your range.'; }
  else if(want==='rise'){ ok = t>=2.5; msg = ok ? 'Clear rise of '+t.toFixed(1)+' semitones.' :
    'You ended '+(t<=-1?'falling':'flat')+' ('+t.toFixed(1)+' st). A genuine question needs a lift of at least 3 semitones on the final syllable.'; }
  else { ok = Math.abs(t)<1.6; msg = ok ? 'Held level — suspended, which is what a sustained tone needs.' :
    'You moved '+t.toFixed(1)+' st. A level tone should stay within about 1.5 either way.'; }
  return {ok:ok, msg:msg, val:t, score: ok?100:Math.round(clamp(100-Math.abs((want==='fall'?-4:want==='rise'?4:0)-t)*13,0,100))};
}

function scorePace(a, wordCount, band){
  if(!a||a.empty) return null;
  var W=wpm(a,wordCount);
  var s=Math.round(bandScore(W,band,40)*100);
  return {val:Math.round(W), score:s, ok:inBand(W,band),
    msg: inBand(W,band) ? 'In the band.' : W<band[0] ? 'Under target — '+Math.round(W)+' vs '+band[0]+'.' : 'Over target — '+Math.round(W)+' vs '+band[1]+'.'};
}

function scoreRange(a, minSt){
  if(!a||a.empty) return null;
  var ok=a.span>=minSt;
  return {val:a.span, score:Math.round(clamp(a.span/minSt,0,1.3)*77), ok:ok,
    msg: ok ? a.span.toFixed(1)+' semitones — engaged.' : 'Only '+a.span.toFixed(1)+' st. Widen the movement, and do it without raising your average pitch.'};
}

function scoreFloor(a){
  if(!a||a.empty) return null;
  var ok=a.floorDrop<=4;
  return {val:a.floorDrop, ok:ok, score:Math.round(clamp(1-(a.floorDrop-1)/9,0,1)*100),
    msg: ok ? 'Held to the end — '+a.floorDrop.toFixed(1)+' dB drop.' : 'Lost '+a.floorDrop.toFixed(1)+' dB by the end. Target under 4.'};
}

function scorePauses(a, wanted){ // wanted: array of seconds
  if(!a||a.empty) return null;
  var got=a.pauses.slice();
  var rows=wanted.map(function(w,i){
    var g=got[i];
    if(g==null) return {want:w, got:null, ok:false};
    return {want:w, got:g, ok: Math.abs(g-w) <= Math.max(0.22, w*0.35)};
  });
  var hit=rows.filter(function(r){return r.ok;}).length;
  return {rows:rows, score:Math.round(hit/Math.max(1,wanted.length)*100), hit:hit, total:wanted.length};
}

/* ---------- contour comparison ---------- */
function contourTrace(a){
  if(!a||a.empty) return [];
  var v=a.frames.filter(function(f){return f.f0s>0 && f.db>a.gate;});
  if(v.length<4) return [];
  var t0v=v[0].t, t1v=v[v.length-1].t, span=Math.max(.15,t1v-t0v);
  var base=a.baseline;
  return v.map(function(f){ return [ (f.t-t0v)/span, hzToSt(f.f0s, base) ]; });
}

function scoreContour(trace, target){
  if(!trace.length) return {score:0, msg:'Nothing detected. Check the mic and speak up.'};
  // normalise target to zero-mean like the trace
  var tm=mean(target.map(function(p){return p[1];}));
  var um=mean(trace.map(function(p){return p[1];}));
  function at(pts,x){
    for(var i=1;i<pts.length;i++){
      if(pts[i][0]>=x){
        var a1=pts[i-1], b1=pts[i];
        var r=(x-a1[0])/Math.max(1e-6,(b1[0]-a1[0]));
        return a1[1]+(b1[1]-a1[1])*r;
      }
    }
    return pts[pts.length-1][1];
  }
  var err=0, N=40;
  for(var i=0;i<=N;i++){
    var x=i/N;
    var d=(at(trace,x)-um)-(at(target,x)-tm);
    err+=d*d;
  }
  var rmse=Math.sqrt(err/(N+1));
  var score=Math.round(clamp(1-(rmse-0.7)/5.5,0,1)*100);
  var msg = score>=82 ? 'Very close match — that is the shape.' :
            score>=62 ? 'Right shape, magnitude off. Exaggerate the movement.' :
            score>=38 ? 'The direction is roughly there but the contour is flatter than the target.' :
                        'Not the shape yet. Watch the grey line and try tracing it with an exaggerated "ooo" first, then add the words.';
  return {score:score, rmse:rmse, msg:msg};
}

/* ---------- playback ---------- */
var playCtx=null, playSrc=null;
function buildBuffer(){
  if(!chunks.length) return null;
  var total=chunks.reduce(function(s,c){return s+c.length;},0);
  var AC=window.AudioContext||window.webkitAudioContext;
  playCtx=playCtx||new AC();
  var b=playCtx.createBuffer(1,total,SR);
  var d=b.getChannelData(0), o=0;
  chunks.forEach(function(c){ d.set(c,o); o+=c.length; });
  return b;
}
var lastBuf=null;
function snapshot(){ lastBuf=buildBuffer(); return lastBuf; }
function play(onEnd){
  var b=lastBuf||buildBuffer();
  if(!b) { if(onEnd) onEnd(); return null; }
  try{ if(playSrc) playSrc.stop(); }catch(e){}
  playSrc=playCtx.createBufferSource();
  playSrc.buffer=b; playSrc.connect(playCtx.destination);
  playSrc.onended=function(){ if(onEnd) onEnd(); };
  if(playCtx.state==='suspended') playCtx.resume();
  playSrc.start();
  return b.duration;
}
function stopPlay(){ try{ if(playSrc) playSrc.stop(); }catch(e){} }
function waveform(nPoints){
  var b=lastBuf||buildBuffer();
  if(!b) return [];
  var d=b.getChannelData(0), step=Math.max(1,Math.floor(d.length/nPoints)), out=[];
  for(var i=0;i<nPoints;i++){
    var m=0, s=i*step, e=Math.min(d.length,s+step);
    for(var j=s;j<e;j++){ var v=Math.abs(d[j]); if(v>m) m=v; }
    out.push(m);
  }
  return out;
}
function hasRecording(){ return !!(lastBuf||chunks.length); }

/* export as wav */
function exportWav(){
  var b=lastBuf||buildBuffer();
  if(!b) return null;
  var d=b.getChannelData(0), len=d.length;
  var buf=new ArrayBuffer(44+len*2), view=new DataView(buf);
  function ws(o,s){ for(var i=0;i<s.length;i++) view.setUint8(o+i,s.charCodeAt(i)); }
  ws(0,'RIFF'); view.setUint32(4,36+len*2,true); ws(8,'WAVE'); ws(12,'fmt ');
  view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true);
  view.setUint32(24,SR,true); view.setUint32(28,SR*2,true); view.setUint16(32,2,true);
  view.setUint16(34,16,true); ws(36,'data'); view.setUint32(40,len*2,true);
  for(var i=0;i<len;i++){ var s=clamp(d[i],-1,1); view.setInt16(44+i*2, s<0?s*0x8000:s*0x7FFF, true); }
  return new Blob([view],{type:'audio/wav'});
}

/* ---------- events ---------- */
function on(fn){ listeners.push(fn); }
function emit(){ listeners.forEach(function(f){ try{f(micState,lastErr);}catch(e){} }); }

return {
  start:start, stop:stop, ready:ready, state:state, error:error, on:on,
  beginCapture:beginCapture, endCapture:endCapture, isCapturing:isCapturing,
  live:live, liveFrames:liveFrames, analyse:analyse,
  wpm:wpm, scoreAgainstTone:scoreAgainstTone, scoreTerminal:scoreTerminal,
  scorePace:scorePace, scoreRange:scoreRange, scoreFloor:scoreFloor, scorePauses:scorePauses,
  contourTrace:contourTrace, scoreContour:scoreContour,
  snapshot:snapshot, play:play, stopPlay:stopPlay, waveform:waveform, hasRecording:hasRecording,
  exportWav:exportWav, hzToSt:hzToSt, pct:pct, median:median, mean:mean
};
})();
</script>
