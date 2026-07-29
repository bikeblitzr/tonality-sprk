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

/* Build the utterance plan from the tone's own targets.

   The synthesiser takes one pitch per utterance, so a phrase cannot rise
   onto the accent and then fall away inside itself. The fix is to split
   the accented phrase at the nucleus word: the accent becomes its own
   utterance, and whatever follows it becomes another, lower and quicker.
   That is post-focus compression, and it is also what lets the terminal
   actually land — otherwise an accent in the final phrase cancels the
   fall and the model ends on a rise, which is the opposite of the cue. */
function plan(line, tone, nucleusWord){
  var T = (tone && tone.target) || {};
  var wpm  = T.wpm  ? (T.wpm[0]+T.wpm[1])/2  : 150;
  var span = T.span ? (T.span[0]+T.span[1])/2 : 7;
  var term = T.term ? (T.term[0]+T.term[1])/2 : -5;
  var pauseTarget = T.pause ? (T.pause[0]+T.pause[1])/2 : 14;

  var rate = clamp(wpm/160, 0.55, 1.55);
  var lift = clamp(span/2, 1.5, 7);
  var gap  = clamp(260 + pauseTarget*22, 240, 900);

  var c = chunk(line, nucleusWord);
  var steps = [];

  c.parts.forEach(function(text, i){
    if(i!==c.nuc){
      var after = i>c.nuc;
      steps.push({text:text,
        st:   after ? -lift*0.45 : 0,
        rate: after ? rate*1.05  : rate,
        after: after ? gap*0.8 : gap});
      return;
    }
    /* the accented phrase — split it at the nucleus word */
    var words = text.split(/\s+/);
    var at = -1;
    if(nucleusWord){
      var nw = String(nucleusWord).toLowerCase().replace(/[^a-z0-9']/g,'');
      for(var k=words.length-1;k>=0;k--){
        if(words[k].toLowerCase().replace(/[^a-z0-9']/g,'')===nw){ at=k; break; }
      }
    }
    if(at<0) at = words.length-1;
    var head = words.slice(0, at).join(' ');
    var acc  = words.slice(at, at+1).join(' ');
    var tail = words.slice(at+1).join(' ');

    if(head) steps.push({text:head, st:0, rate:rate, after:90});
    steps.push({text:acc, st:lift, rate:rate*0.86, after: tail?110:gap*1.1});
    if(tail) steps.push({text:tail, st:-lift*0.45, rate:rate*1.05, after:gap*0.8});
  });

  /* a blank or punctuation-only line has nothing to say — never queue an
     empty utterance, which some engines stall on */
  steps = steps.filter(function(st){ return /[a-z0-9]/i.test(st.text||''); });
  if(!steps.length) return [];

  /* Land the ending. The terminal REPLACES whatever the final utterance
     was going to do rather than adding to it — otherwise post-focus
     compression drags a rising terminal back below the line and the rise,
     which is the entire cue for a question tone, never appears. A residue
     of the accent is kept when the accent itself is the last thing said,
     since there is then nothing left to fall onto. */
  var last = steps[steps.length-1];
  var tEnd = term*0.55;
  /* When the accent IS the last thing said, a little of the lift survives
     so the word still reads as accented — but capped below half the
     terminal's own size, so a wide-span tone can never lift hard enough to
     invert the fall it is supposed to demonstrate. */
  var residue = last.st>0 ? Math.min(last.st*0.4, Math.abs(tEnd)*0.45) : 0;
  last.st = tEnd + residue;
  last.rate = rate*0.92;
  last.after = 0;

  return steps.map(function(st){
    return {text:st.text, pitch:clamp(stToPitch(st.st),0.35,2),
            rate:clamp(st.rate,0.4,1.8), after:st.after};
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
