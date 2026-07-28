<script>
/* ============================================================
   PROGRESSION — levels, ranks, achievements, 90-day path
   ============================================================ */
'use strict';

var RANKS = [
{lvl:1,  t:'Untrained'},      {lvl:3,  t:'Aware'},         {lvl:5,  t:'Deliberate'},
{lvl:8,  t:'Controlled'},     {lvl:11, t:'Consistent'},    {lvl:14, t:'Fluent'},
{lvl:18, t:'Expressive'},     {lvl:22, t:'Commanding'},    {lvl:26, t:'Persuasive'},
{lvl:30, t:'Magnetic'},       {lvl:35, t:'Instrumental'},  {lvl:40, t:'Formidable'},
{lvl:45, t:'Unmistakable'},   {lvl:50, t:'Oracle'}
];

function xpForLevel(l){ return Math.round(120 * Math.pow(l, 1.42)); }
function rankFor(l){ var r=RANKS[0].t; RANKS.forEach(function(x){ if(l>=x.lvl) r=x.t; }); return r; }

var ACHIEVEMENTS = [
{id:'first',   i:'◉', n:'First Breath',        d:'Complete your first scored rep.'},
{id:'warm10',  i:'♨', n:'Warm Body',            d:'Run the full warmup rack ten times.'},
{id:'streak3', i:'▲', n:'Three Days',           d:'Train three days running.'},
{id:'streak7', i:'★', n:'A Full Week',          d:'Seven-day streak.'},
{id:'streak30',i:'✦', n:'Thirty Days',          d:'Thirty-day streak. This is where voices actually change.'},
{id:'reps100', i:'⬤', n:'Century',              d:'One hundred scored reps.'},
{id:'reps500', i:'⬢', n:'Five Hundred',         d:'Five hundred scored reps.'},
{id:'reps2000',i:'⬣', n:'Two Thousand',         d:'Two thousand reps. You are a different speaker than when you started.'},
{id:'perf',    i:'◆', n:'Clean Sheet',          d:'Score 95 or above on any tone drill.'},
{id:'perf5',   i:'◈', n:'Five Clean',           d:'Five separate 95-plus scores.'},
{id:'seven',   i:'⑦', n:'The Seven',            d:'Reach 70% mastery on all seven core tones.'},
{id:'allfam',  i:'❋', n:'Full Spectrum',        d:'Score at least one rep in every tone family.'},
{id:'mono',    i:'⌁', n:'Monotone Killer',      d:'Hit 10 semitones of range on a single utterance.'},
{id:'fall',    i:'↓', n:'The Drop',             d:'Produce a terminal fall of 7 semitones or more.'},
{id:'silence', i:'∅', n:'Hold the Silence',     d:'Hold a two-second pause after a question without breaking it.'},
{id:'floor',   i:'▬', n:'No Trailing',          d:'Ten consecutive reps with under 4 dB of final drop.'},
{id:'tw25',    i:'⟡', n:'Loosened Up',          d:'Clear twenty-five tongue twisters.'},
{id:'tw100',   i:'⟢', n:'Silver Tongue',        d:'Clear a hundred tongue twisters.'},
{id:'brutal',  i:'☠', n:'The Brutal Rack',      d:'Clear every twister in the brutal category.'},
{id:'gaunt',   i:'⚔', n:'Gauntlet Survivor',    d:'Finish the Gauntlet.'},
{id:'gaunt90', i:'♛', n:'Gauntlet Master',      d:'Finish the Gauntlet with an average above 85.'},
{id:'codex',   i:'❑', n:'Read the Manual',      d:'Read every entry in the Codex.'},
{id:'power',   i:'♆', n:'Student of Power',     d:'Read every entry in the Power section.'},
{id:'script',  i:'▤', n:'Off Book',             d:'Run a full annotated script end to end.'},
{id:'day30',   i:'㉚', n:'Month One',            d:'Complete day 30 of the path.'},
{id:'day90',   i:'㊾', n:'The Whole Path',       d:'Complete all ninety days.'}
];

/* ---- 90-day path. Each day: focus, modules, and a one-line note. ---- */
var PATH = (function(){
  var d=[], i;
  function day(n,f,mods,note){ return {d:n, f:f, mods:mods, note:note}; }

  /* Phase 1 — Foundations (1-21) */
  var p1=[
  ['Calibration','warmup,tonelab','Run the warmup rack, then record one neutral sentence and just look at the numbers. Do not try to fix anything today.'],
  ['Terminal falls','warmup,terminal','The single highest-leverage habit. Every declarative ends down, every time.'],
  ['Terminal falls','terminal,tonelab','Same again. Consistency beats depth — hitting it 75% of the time matters more than any one big fall.'],
  ['Pitch range','warmup,monotone','Widen the movement. Keep the mean low. These are separate dials and today is about proving that to yourself.'],
  ['Pitch range','monotone,tonelab','Again. If your span is still under 6 semitones, exaggerate until it feels ridiculous.'],
  ['Pace','warmup,pace','Find your natural rate, then learn to sit deliberately above and below it.'],
  ['Review','gauntlet','First short gauntlet. Do not worry about the score — you are establishing a baseline.'],
  ['Articulation','warmup,twisters','Start the tongue twister ladder. Warmup rack first, always.'],
  ['The seven — curious','tonelab,twisters','Neutral and Curious. Slow the second half of every question.'],
  ['The seven — concern','tonelab','Slight Concern. Lean in physically; let the posture make the tone.'],
  ['The seven — challenge','tonelab','Accountability. Intensity comes from slowing down, never from volume.'],
  ['Pause','warmup,pausegym','Silence is a positive act. Two full seconds after a question.'],
  ['Pause','pausegym,tonelab','Again. Confident speakers use fewer, longer pauses. Anxious ones use more, shorter.'],
  ['Review','gauntlet','Second gauntlet. Compare against day 7.'],
  ['The seven — skeptic','tonelab','Skeptical Disbelief. The rise-fall-rise contour. Most people cannot produce this on command yet.'],
  ['The seven — vision','tonelab,contour','Vision. Ask, then stop. The picture forms in the silence.'],
  ['The seven — drop','tonelab','Consequence. Lowest, slowest, quietest. Underplay it.'],
  ['The seven — certainty','tonelab','Certainty. Low mean, wide range. The counter-intuitive one.'],
  ['Volume floor','warmup,floor','Stop trailing off. Fall in pitch without falling in energy.'],
  ['Articulation','twisters,warmup','Push the speed ladder up one rung on everything you have cleared.'],
  ['Phase review','gauntlet,tonelab','Full gauntlet. You should see movement on terminals and range by now.']];

  /* Phase 2 — Range (22-56) */
  var p2=[
  ['Emphasis','emphasis','Where the stress falls is where the meaning lives. Start with the seven-word classic.'],
  ['Emphasis','emphasis,tonelab','New information takes the accent. Given information loses it.'],
  ['Emphasis','emphasis','Contrast overrides everything. Learn the low onglide.'],
  ['Post-focus compression','emphasis,tonelab','One accent, then compress everything after it. The most under-taught skill in speaking.'],
  ['Authority family','tonelab','Absolute Certainty. Once per conversation. Anchor it physically.'],
  ['Authority family','tonelab','Utter Sincerity. The drop in energy after certainty.'],
  ['Authority family','tonelab,contour','Command and Gravity. Steep falls, long silences.'],
  ['Review','gauntlet,twisters','Gauntlet plus twenty twisters.'],
  ['Warmth family','tonelab','Genuine Warmth. Range, not register. Smile before you speak.'],
  ['Warmth family','tonelab','Reassurance and Gratitude. Normalise before you solve.'],
  ['Warmth family','tonelab','Clean Apology. No but, no if, no explanation until asked.'],
  ['Contour tracing','contour','Trace the confident declarative and the genuine question.'],
  ['Contour tracing','contour','Fall-rise and rise-fall. The two hardest shapes.'],
  ['Review','gauntlet','Gauntlet.'],
  ['Curiosity family','tonelab','Confusion and Intrigue. Twice a conversation maximum on confusion.'],
  ['Curiosity family','tonelab','The Probe and the Mirror. Four words, then silence.'],
  ['Pressure family','tonelab','Confrontation, with permission first. Ask for the licence.'],
  ['Pressure family','tonelab','Urgency without panic. Fast and low, never fast and high.'],
  ['Pressure family','tonelab','The Takeaway. Only when you mean it.'],
  ['Articulation','twisters,warmup','Brutal rack. Slow first, then ladder up.'],
  ['Review','gauntlet,emphasis','Gauntlet plus emphasis.'],
  ['Straight Line','tonelab','Belfort system. Bottled Enthusiasm and I Really Want to Know.'],
  ['Straight Line','tonelab','Declarative-as-question. Deliberate uptalk on setup only.'],
  ['Straight Line','tonelab','Implied Obviousness and Money Aside.'],
  ['Straight Line','tonelab,script','No Big Deal close, then silence. Run the objection loop script.'],
  ['Quiet Model','tonelab','NEPQ. Detached Neutral as a baseline state.'],
  ['Quiet Model','tonelab','Unagenda\'d Curiosity and Quiet Concern.'],
  ['Quiet Model','tonelab,script','Soft Ask and Respectful Pressure. Run the discovery script.'],
  ['Review','gauntlet','Gauntlet. Two systems now available to you.'],
  ['Colour wheel','tonelab','Delight, Deadpan, Incredulity. Pure range work.'],
  ['Colour wheel','tonelab','Resignation, Defiance, Tenderness.'],
  ['Colour wheel','tonelab','Wry, Awe, Conspiratorial.'],
  ['Colour wheel','tonelab,script','Run the Full Range Gauntlet script — one sentence, fourteen tones.'],
  ['Defect lab','defect','Produce uptalk on purpose. Then produce its opposite.'],
  ['Phase review','gauntlet,emphasis,twisters','Big session. Compare everything against day 21.']];

  /* Phase 3 — Command (57-90) */
  var p3=[
  ['Defect lab','defect','Monotone on purpose, then Engaged Range on the same sentence.'],
  ['Defect lab','defect','Trailing off on purpose, then the volume floor drill.'],
  ['Defect lab','defect','Hedging on purpose. Then delete every qualifier and fall at the end.'],
  ['Broadcast','tonelab,script','The anchor read. One emphasis per clause, consistent falls.'],
  ['Broadcast','tonelab','Narrator. 110–130 wpm. Vary at sentence level, not word level.'],
  ['Broadcast','tonelab,script','The keynote turn. Two full seconds of silence first.'],
  ['Review','gauntlet','Gauntlet.'],
  ['Power','power,tonelab','Status behaviours. Read the chapter, then drill the tones it names.'],
  ['Power','power,tonelab','Frame control. Time frame, permission frame, disqualification frame.'],
  ['Power','power,tonelab','The influence engine. Every principle paired with its tone.'],
  ['Power','power,tonelab','How decisions break. Anchoring, loss aversion, framing.'],
  ['Power','power,tonelab','Reading the room. The pause before the answer.'],
  ['Power','power,tonelab','Self-command. Composure is leverage.'],
  ['Review','gauntlet,emphasis','Gauntlet plus emphasis.'],
  ['Cold read','coldread','Random text, random tone, no prep. Sixty seconds.'],
  ['Cold read','coldread,contour','Again, harder.'],
  ['Ear training','ear','Identify your own tones from playback. Harder than it sounds.'],
  ['Ear training','ear,tonelab','Again. This is the skill that makes live self-correction possible.'],
  ['Scripts','script','Run the discovery arc end to end.'],
  ['Scripts','script','Run the hard conversation.'],
  ['Scripts','script','Run the keynote open.'],
  ['Review','gauntlet','Gauntlet.'],
  ['Weak spots','weak','Whatever your lowest three tone masteries are. The app picks.'],
  ['Weak spots','weak,twisters','Again, plus articulation.'],
  ['Weak spots','weak,contour','Again, plus contour work.'],
  ['Integration','script,emphasis','Full script with conscious emphasis placement on every line.'],
  ['Integration','tonelab,pausegym','Tone plus pause discipline together.'],
  ['Integration','gauntlet','Gauntlet.'],
  ['Range extremes','tonelab','Calm Menace, Grave, Restrained Allure. The tier-four colours.'],
  ['Range extremes','contour','The terraced build and the contrastive scoop.'],
  ['Free practice','weak,twisters,emphasis','Your choice. Follow the weak-spot queue.'],
  ['Free practice','weak,script','Your choice.'],
  ['Final review','gauntlet,emphasis,twisters','Everything. Compare against day 1.'],
  ['The wall','gauntlet','Full gauntlet at maximum difficulty. Then go and use it on someone.']];

  var all=p1.concat(p2).concat(p3);
  for(i=0;i<all.length;i++) d.push(day(i+1, all[i][0], all[i][1].split(','), all[i][2]));
  return d;
})();

var PHASES=[
{n:'Foundations', from:1, to:21, blurb:'Terminals, range, pace and pause. The four dials that account for most of the perceived difference between a trained and an untrained speaker.'},
{n:'Range',       from:22,to:56, blurb:'Emphasis, the full tone taxonomy, both named sales systems, and the colour wheel. This is where the instrument gets built.'},
{n:'Command',     from:57,to:90, blurb:'Defect elimination, broadcast work, psychology, cold reading, and integration under pressure. This is where it becomes automatic.'}
];
</script>
