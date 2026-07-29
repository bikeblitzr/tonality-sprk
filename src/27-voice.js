<script>
/* ============================================================
   MODEL VOICE — a synthesised reference of what a tone should
   sound like, so you have something to repeat after.

   Uses the browser's own speech synthesiser. No key, no account,
   no network, nothing to set up, and it works offline.

   It is not trying to sound like a person. It is driven directly
   from the tone's target numbers — pace from the wpm band, the size
   of the pitch lift from the semitone span, the terminal from the
   terminal target, real pauses at the phrase joints, and the accent
   on the nucleus word — so what it demonstrates is precisely the
   thing you are being scored on. The texture you get from your own
   saved takes; the shape you get from this.
   ============================================================ */
var ModelVoice = (function(){
'use strict';

var SS = window.speechSynthesis;
var supported = !!(SS && typeof SpeechSynthesisUtterance!=='undefined');
var voices=[], picked=null, chain=null, onDone=null, speaking=false;

function loadVoices(){
  if(!supported) return;
  try{ voices = SS.getVoices()||[]; }catch(e){ voices=[]; }
  if(voices.length) picked = pick(voices);
}
if(supported){
  loadVoices();
  try{ SS.onvoiceschanged = loadVoices; }catch(e){}
}

/* prefer a local, natural-sounding English voice; fall back to any English,
   then to whatever exists */
function pick(list){
  var en = list.filter(function(v){ return /^en(-|_|$)/i.test(v.lang||''); });
  var pool = en.length?en:list;
  var nice = pool.filter(function(v){
    return /natural|neural|enhanced|premium|siri|google|samantha|daniel|karen|serena/i.test(v.name||'');
  });
  var local = (nice.length?nice:pool).filter(function(v){ return v.localService; });
  return (local[0] || (nice[0]||pool[0]) || list[0] || null);
}

function available(){ return supported && (voices.length>0 || !!picked); }
function voiceName(){ return picked ? (picked.name||'system voice') : 'system voice'; }

/* semitones -> the synthesiser's pitch multiplier (1 = the voice's default) */
function stToPitch(st){ return Math.pow(2, st/12); }
function clamp(v,a,b){ return v<a?a:v>b?b:v; }

/* Split a line into intonation phrases at real punctuation, then mark the
   chunk containing the nucleus so it can carry the accent. */
function chunk(line, nucleusWord){
  var parts = String(line).split(/([,;:—–]|\.\.\.|\s-\s)/).filter(function(x){ return x && !/^[\s,;:—–-]*$/.test(x) || /\.\.\./.test(x); });
  var out=[];
  parts.forEach(function(p){
    p=p.replace(/^[\s,;:—–]+|[\s,;:—–]+$/g,'').trim();
    if(p) out.push(p);
  });
  if(!out.length) out=[String(line).trim()];
  /* long single chunks get split near the middle at a word boundary so
     there is somewhere for a breath to go */
  var split=[];
  out.forEach(function(p){
    var w=p.split(/\s+/);
    if(w.length>11){
      var mid=Math.round(w.length/2);
      split.push(w.slice(0,mid).join(' '), w.slice(mid).join(' '));
    } else split.push(p);
  });
  var nucIdx = -1;
  if(nucleusWord){
    var nw=String(nucleusWord).toLowerCase().replace(/[^a-z0-9']/g,'');
    for(var i=split.length-1;i>=0;i--){
      if(split[i].toLowerCase().replace(/[^a-z0-9'\s]/g,'').split(/\s+/).indexOf(nw)>=0){ nucIdx=i; break; }
    }
  }
  if(nucIdx<0) nucIdx = split.length-1;
  return {parts:split, nuc:nucIdx};
}

/* Build the utterance plan from the tone's own targets. */
function plan(line, tone, nucleusWord){
  var T = (tone && tone.target) || {};
  var wpm  = T.wpm  ? (T.wpm[0]+T.wpm[1])/2  : 150;
  var span = T.span ? (T.span[0]+T.span[1])/2 : 7;
  var term = T.term ? (T.term[0]+T.term[1])/2 : -5;
  var pauseTarget = T.pause ? (T.pause[0]+T.pause[1])/2 : 14;

  /* rate 1.0 is roughly 160 wpm on most engines */
  var rate = clamp(wpm/160, 0.55, 1.55);
  /* half the span above the line on the accent, half below on the tail —
     which is what post-focus compression actually looks like */
  var lift = clamp(span/2, 1.5, 7);
  var gap  = clamp(260 + pauseTarget*22, 240, 900);

  var c = chunk(line, nucleusWord);
  var last = c.parts.length-1;
  return c.parts.map(function(text, i){
    var pitch = 1, r = rate, post = gap;
    if(i===c.nuc){                       /* the accented phrase */
      pitch = stToPitch(lift);
      r = rate*0.9;                      /* stressed syllables are longer */
      post = gap*1.25;
    } else if(i>c.nuc){                  /* everything after the focus */
      pitch = stToPitch(-lift*0.45);
      r = rate*1.05;
      post = gap*0.8;
    }
    if(i===last){                        /* land the terminal */
      pitch = stToPitch((i===c.nuc?lift:0) + term*0.55);
      r = rate*0.92;
      post = 0;
    }
    return {text:text, pitch:clamp(pitch,0.35,2), rate:clamp(r,0.4,1.8), after:post};
  });
}

function stop(){
  chain=null; speaking=false;
  try{ SS.cancel(); }catch(e){}
  if(onDone){ var f=onDone; onDone=null; try{ f(); }catch(e){} }
}

function speak(line, tone, opts){
  opts=opts||{};
  if(!supported){ if(opts.onEnd) opts.onEnd(); return false; }
  if(!voices.length) loadVoices();
  stop();
  var steps = plan(line, tone, opts.nucleus);
  if(!steps.length){ if(opts.onEnd) opts.onEnd(); return false; }
  onDone = opts.onEnd || null;
  speaking = true;
  var me = chain = {};
  var i = 0;
  function next(){
    if(chain!==me) return;                       /* superseded or stopped */
    if(i>=steps.length){ speaking=false; chain=null; var f=onDone; onDone=null; if(f) f(); return; }
    var st = steps[i++];
    var u = new SpeechSynthesisUtterance(st.text);
    if(picked) u.voice = picked;
    u.rate = st.rate; u.pitch = st.pitch; u.volume = 1;
    u.lang = (picked && picked.lang) || 'en-US';
    u.onend = function(){ if(st.after) setTimeout(next, st.after); else next(); };
    u.onerror = function(){ speaking=false; chain=null; var f=onDone; onDone=null; if(f) f(); };
    try{ SS.speak(u); }catch(e){ u.onerror(); }
  }
  /* some engines get wedged if a cancel is still settling */
  setTimeout(next, 60);
  return true;
}

function isSpeaking(){ return speaking; }

return {supported:supported, available:available, speak:speak, stop:stop,
        isSpeaking:isSpeaking, voiceName:voiceName, plan:plan, chunk:chunk};
})();
</script>
