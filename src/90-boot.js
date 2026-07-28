<script>
/* ============================================================
   BOOT
   ============================================================ */
(function(){
'use strict';

// theme from saved prefs
var pref=S.raw().prefs.theme;
document.documentElement.setAttribute('data-theme', pref==='light'?'light':'dark');

// route from hash
var h=location.hash.replace('#','');
if(h) UI.go(h); else UI.render();

// first-run welcome → straight into calibration
var s=S.raw();
if(!s.reps && !s.seenIntro){
  s.seenIntro=1; S.save();
  setTimeout(function(){
    UI.modal(
    '<h2>The Tonality Gym</h2>'+
    '<p class="dim2" style="font-size:15px;margin-top:6px">An endless training system for voice, tone, emphasis, articulation and the psychology behind them. '+
    'It listens to you and grades what you produce against measurable acoustic targets.</p>'+
    '<div class="note acc" style="margin-top:16px"><span class="l">Three things before you start</span>'+
    '<b>1 · It needs the microphone.</b> Everything is processed locally in your browser using the Web Audio API. No audio is uploaded, stored on a server, or sent anywhere. Your progress lives in this browser only.<br><br>'+
    '<b>2 · Use headphones or a quiet room.</b> The pitch tracker is good but it is not magic. Background noise and speaker bleed will confuse it.<br><br>'+
    '<b>3 · Calibrate first.</b> Two minutes, five short steps, nothing scored. It teaches the app your room and your voice — and everything you do afterwards is measured more accurately because of it.</div>'+
    '<div class="note cy" style="margin-top:10px"><span class="l">The one thing to know</span>'+
    'Confident speech has a <b>low mean pitch</b> and a <b>wide pitch range</b>. Most people flatten their voice to sound serious, which just sounds dead — '+
    'and raise their whole register to sound animated, which sounds anxious. Those are two independent dials. Learning to move them separately is the single fastest improvement available to almost anyone.</div>'+
    '<div class="row" style="margin-top:18px">'+
    '<button class="btn" id="introMic">Turn on the mic &amp; calibrate</button>'+
    '<button class="btn gh" onclick="UI.closeModal()">Look around first</button></div>');
    UI.$('#introMic').onclick=function(){ UI.closeModal(); UI.needMic().then(function(ok){ if(ok) Drill.launch('calibrate'); }); };
  }, 500);
}

// keep the streak honest on load
S.touchDay();

// resume audio context on first gesture (iOS/Safari)
document.addEventListener('click', function once(){
  document.removeEventListener('click', once);
}, {once:true});

// warn before leaving mid-drill
window.addEventListener('beforeunload', function(e){
  if(UI.$('#stage').classList.contains('on')){ e.preventDefault(); e.returnValue=''; }
});

})();
</script>
</body>
</html>
