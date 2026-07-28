<script>
/* ============================================================
   THE TONALITY ADVISOR
   A deterministic rules engine. Takes where you are in the call,
   the line you are about to say, and what the room is doing —
   returns which tone to use, why, what to emphasise, where to
   pause, and which tone would be a mistake.

   No model at runtime. Every recommendation traces back to a
   named rule, which is shown to the user.
   ============================================================ */
'use strict';

/* ---------- call stages, each a prior over tones ---------- */
var STAGES = [
{id:'frame',    n:'Opening & frame',      hint:'First two minutes. Setting the terms.',
 tones:{warm:3, invite:2.6, certainty:2.2, nq_playful:2, takeaway:1.6, sl_care:1.6, nq_neutral:1.4}},
{id:'discovery',n:'Discovery — situation', hint:'Facts. How it works now.',
 tones:{nq_curious:3.2, neutral:3, probe:2, nq_neutral:1.8, reflect:1.4}},
{id:'pain',     n:'Pain & problem',        hint:'What it costs them. Emotional disclosure.',
 tones:{concern:3.2, nq_concern:3, sl_pain:2.4, reflect:2, probe:1.8}},
{id:'account',  n:'Accountability',        hint:'Ownership. Confronting the pattern.',
 tones:{challenge:3.2, nq_challenge:2.6, skeptic:2, confront:1.6, measured:1.2}},
{id:'conseq',   n:'Consequence',           hint:'Cost of doing nothing.',
 tones:{consequence:3.5, nq_challenge:2.2, c_grave:1.6, challenge:1.4}},
{id:'vision',   n:'Vision & future pace',  hint:'What it looks like if it works.',
 tones:{vision:3.5, c_hopeful:1.8, intrigue:1.4, warm:1.2}},
{id:'transition',n:'Transition into pitch',hint:'Summarising, moving on.',
 tones:{certainty:3.4, sl_presup:1.8, nq_neutral:1.4, invite:1.2}},
{id:'pitch',    n:'Presenting',            hint:'Explaining what it is.',
 tones:{sl_certain:2.8, b_teach:2.6, sl_obvious:2, intrigue:1.8, absolute:1.6, sincerity:1.6}},
{id:'tiedown',  n:'Tie-downs',             hint:'Extracting their reasons.',
 tones:{probe:3, invite:2.4, nq_curious:2.2, reflect:2, skeptic:1.6}},
{id:'objection',n:'Objection',             hint:'They pushed back.',
 tones:{unbothered:2.8, sl_hypo:2.6, invite:2.2, sincerity:2, measured:1.8, absolute:1.6}},
{id:'close',    n:'The ask',               hint:'Asking for the decision.',
 tones:{sl_close:3.6, nq_soft:2.4, certainty:1.8, absolute:1.4}},
{id:'postyes',  n:'After the yes',         hint:'Logistics. Do not re-sell.',
 tones:{sl_presup:3.4, c_bright:2, certainty:1.8, warm:1.6}},
{id:'bad',      n:'Bad news / repair',     hint:'Something went wrong.',
 tones:{apology:3, c_grave:2.6, sincerity:2.4, c_soothe:2, c_clinical:1.8}},
{id:'lead',     n:'Managing / feedback',   hint:'Not a sale. A person who works for you.',
 tones:{confront:2.4, sincerity:2.4, disappoint:2, nurture:1.8, measured:1.8, command:1.4}},
{id:'speak',    n:'Presenting to a room',  hint:'One to many.',
 tones:{b_keynote:2.6, b_narrate:2.2, b_teach:2.2, b_anchor:1.8, gravity:1.6}}
];

/* ---------- situational modifiers ---------- */
var MODS = [
{id:'defensive', n:'They have gone defensive', ic:'▲',
 up:{c_soothe:3, unbothered:2.4, measured:2, sincerity:1.8, invite:1.6},
 down:{challenge:-3, confront:-3.5, nq_challenge:-2.5, skeptic:-2, c_impatient:-3, takeaway:-1.5},
 why:'Pressure applied to a defensive person hardens the position. Drop your own energy and let entrainment bring theirs down — you cannot argue someone out of a defence.'},
{id:'quiet', n:'They have gone quiet', ic:'◌',
 up:{probe:3.2, invite:2.4, reflect:2, nq_concern:1.8, confused:1.4},
 down:{sl_certain:-2.5, b_teach:-2, absolute:-1.5, c_bright:-2},
 why:'Silence after a disclosure is usually processing, not disengagement. Anything you say to fill it interrupts them. Ask four words and wait.'},
{id:'excited', n:'They are excited / selling it back', ic:'▲',
 up:{sl_close:3.5, sl_presup:2.4, nq_soft:1.8},
 down:{sl_certain:-2, b_teach:-2.5, intrigue:-2, sl_obvious:-1.5},
 why:'They are closing themselves. Every extra sentence you add now is a new surface for a new objection. Stop and ask.'},
{id:'price', n:'Price just came up', ic:'£',
 up:{sl_hypo:3, absolute:2.2, sl_close:2, sincerity:1.8, c_clinical:1.6},
 down:{scarce:-2, c_apolog:-2.5, invite:-1},
 why:'Isolate before you handle. Find out whether it is the number or the thing, and never apologise for the number — a flat delivery with no pause after it is what stops it becoming a negotiation.'},
{id:'think', n:'They said "let me think about it"', ic:'…',
 up:{sl_hypo:3.2, probe:2.6, confront:2, sincerity:2, invite:1.8},
 down:{sl_close:-2.5, urgent:-3, scarce:-2.5, sl_presup:-2},
 why:'That sentence is a mask for exactly one concern. Closing harder makes them defend the mask. Isolate what is actually underneath it first.'},
{id:'senior', n:'Senior or highly skeptical buyer', ic:'◆',
 up:{c_clinical:3, c_proud:2.2, measured:2, unbothered:1.8, sincerity:1.6},
 down:{sl_certain:-3, nq_playful:-2.5, c_delight:-2, intrigue:-1.5, sl_question:-2},
 why:'Enthusiasm reads as junior to this buyer. Specificity is what buys credibility — the precise number, the actual failure rate, the real constraint.'},
{id:'first', n:'First 90 seconds of the call', ic:'◐',
 up:{warm:2.6, invite:2.2, nq_playful:1.8, certainty:1.4},
 down:{consequence:-3, confront:-3.5, challenge:-2.5, disappoint:-3, c_menace:-4},
 why:'You have no licence yet. Anything confrontational this early reads as aggression rather than honesty, and you cannot get the licence back.'},
{id:'trust', n:'Deep rapport already built', ic:'✓',
 up:{confront:2, challenge:1.8, nq_challenge:1.8, takeaway:1.4, c_wry:1.4},
 down:{},
 why:'Directness is now available to you and it is worth spending. The moves that would have detonated the call at minute two are the ones that move it at minute forty.'},
{id:'phone', n:'Phone, not video or in person', ic:'☏',
 up:{},
 down:{c_conspir:-1.5, scarce:-1},
 why:'The visual channel is gone, so every signal has to be acoustic. Slow about ten percent, compress your dynamic range — a whisper disappears into a phone codec — and add more verbal acknowledgement, because they cannot see you nodding. Phone codecs also cut low frequencies, which strips the chest resonance that carries authority; compensate with articulation, not volume.'},
{id:'group', n:'More than one person listening', ic:'⚉',
 up:{b_teach:2, c_clinical:1.8, b_anchor:1.4, certainty:1.4},
 down:{c_conspir:-3, c_tender:-2.5, confront:-2},
 why:'Never confront anyone in front of colleagues — they will defend the position publicly whatever they privately think. Find the quiet one and give them a private route to say it.'},
{id:'rushed', n:'They are short on time', ic:'⏱',
 up:{c_bright:2.4, urgent:2, c_clinical:2, command:1.4},
 down:{vision:-2.5, b_narrate:-3, intrigue:-2, gravity:-1.5},
 why:'Vision and story work need room. Under time pressure they read as stalling. Lead with the conclusion and offer the reasoning second.'}
];

/* ---------- lexical / structural triggers ---------- */
var TRIGGERS = [
/* duration & history */
{re:/\b(how long|how many (months|years|weeks)|since when|been going on|up until now)\b/i,
 w:{concern:2.8, nq_concern:2.4, sl_pain:1.6},
 why:'A duration question lands directly on accumulated cost. Lean in physically — the lean lowers your larynx and softens your volume without you having to act it.'},
{re:/\b(what have you (actually |really )?(done|tried)|what did you do about)\b/i,
 w:{challenge:2.8, nq_challenge:2, skeptic:1.4},
 why:'This separates research from action, and it only works if you slow down. Intensity here comes from pace and pitch floor, never from volume.'},

/* accountability */
{re:/\b(who('s| is) responsible|whose (fault|decision)|what('s| is) (really )?(stopping|holding) you)\b/i,
 w:{challenge:3.2, nq_challenge:2.4, confront:1.4},
 why:'An ownership question. They must arrive at the answer themselves — a reframe you deliver is a claim they can argue with, one they produce is a position they defend.'},
{re:/\b(why hasn'?t|why haven'?t|why did(n'?t)? you)\b/i,
 w:{challenge:2.6, skeptic:1.8, nq_challenge:1.6},
 why:'Carries an implicit accusation. Only the tone stops it landing as one — low, slow, no volume increase, and a full second of silence after.'},

/* doubt */
{re:/\b(what makes you (think|believe)|why now|why this|are you sure|really\?|how confident)\b/i,
 w:{skeptic:3, nq_challenge:1.6, confused:1.2},
 why:'You are asking them to justify a belief. Keep the volume down — skepticism delivered quietly reads as curiosity, delivered firmly it reads as an accusation.'},

/* consequence */
{re:/\b(if nothing changes|what happens (if|then)|next year|twelve months|settle for|stay(ing)? (the same|where you are)|cost of waiting|do nothing)\b/i,
 w:{consequence:3.6, nq_challenge:1.8, c_grave:1.4},
 why:'The consequence beat. Lowest, slowest, quietest thing you will say all call — and underplay it, because the content is already heavy and adding weight on top makes it theatre.'},

/* vision */
{re:/\b(let'?s say|imagine|picture|what would (that|it) (look|feel)|how would (life|things|that) change|twelve months from now|if we (helped|got) you)\b/i,
 w:{vision:3.6, c_hopeful:1.4, intrigue:1.2},
 why:'Future pace. Ask, then stop completely — the picture forms in the silence, not in your description of it. If you keep talking you are describing your vision, not building theirs.'},

/* opening / why-they-came */
{re:/\b(what made you|why did you (book|reach|call|take)|what was it about|what brought you)\b/i,
 w:{nq_curious:2.8, neutral:2.2, sl_care:1.6, warm:1.2},
 why:'Asking why they came. Their own stated reason for trusting you is the strongest thing you own and it is free — but only if the question sounds genuinely interested rather than procedural. Slow the back half.'},

/* probes — short, open-ended follow-ups */
{re:/^\s*(say more|tell me more|meaning|like what|such as|and\??|go on|how so|which part|in what way|what specifically|more on that|expand)\b/i,
 w:{probe:4, reflect:1.4},
 why:'A probe works because it is short. Say the four words and then say nothing at all — the shorter the probe, the more they fill.'},

/* correction / clarification */
{re:/\b(it'?s not .{1,30}(it'?s|but)|not quite|that'?s not (quite )?(right|what)|the other way round|actually,? it)\b/i,
 w:{measured:2.8, c_clinical:1.4, absolute:1.2},
 why:'A correction. Deaccent the corrected item — say the right version at <em>lower</em> prominence than the wrong one and it lands as a clarification rather than a rebuke. Do not speed up; speeding up sounds defensive.'},

/* closes */
{re:/\b(do you want (our|my) help|shall we|want to (go ahead|get started|do this)|should we (set|get)|are you in|what do you say)\b/i,
 w:{sl_close:4, nq_soft:2},
 why:'The ask. Deliver it flatter and more ordinary than everything around it, then stop dead. The flatness only works because of the silence that follows it.'},
{re:/\b(paid in full|payment plan|deposit|which (one )?works|card|invoice|start date)\b/i,
 w:{sl_presup:3, c_bright:1.6, certainty:1.4},
 why:'Post-yes logistics. Calm and matter-of-fact — any energy here reads as relief, and relief tells them you were not sure.'},

/* price */
{re:/\b(costs?|price|pricing|investment|tuition|\$\s?\d|£\s?\d|\d+\s?(k|grand|thousand))\b/i,
 w:{sl_close:2, c_clinical:2, absolute:1.6},
 why:'State the number flatly and keep moving. A pause immediately after a price is an invitation to object — do not leave one.'},

/* objection handling */
{re:/\b(hypothetically|money aside|setting .{0,12}aside|if (cost|price|money|that) (weren'?t|wasn'?t)|pretend it)\b/i,
 w:{sl_hypo:4, invite:1.4},
 why:'An isolation question. It has to sound genuinely low-stakes or they see the trap — and if you argue with the answer you get, you have taught them the question was fake.'},
{re:/\b(anything else|is that the only|if we (sort|sorted|fix|fixed) that)\b/i,
 w:{invite:2.4, sl_hypo:2.2, probe:1.6},
 why:'Isolating down to one concern. Rising terminal, light and quick — this is one of the few places a lift is correct.'},

/* permission & frame */
{re:/\b(can i (be|ask)|would it be (alright|ok)|do you mind|is that (fair|cool|ok)|mind if i)\b/i,
 w:{invite:3.4, nq_soft:1.4},
 why:'A permission ask, and one of the few sentences that should genuinely rise at the end. One rise, then go back to falls — it only works against a floor of falling terminals.'},
{re:/\b(i(\'| a)m going to be (straight|honest)|can i be (completely )?(honest|straight|blunt)|to be honest with you)\b/i,
 w:{sincerity:3.2, invite:2, confront:1.2},
 why:'You are buying a licence. Drop your energy below the line before it — sincerity is a fall in intensity, and if the previous line was already soft it has nowhere to land.'},

/* takeaway / disqualification */
{re:/\b(not sure this is (a fit|right)|might not be|i don'?t think (we|you) should|probably isn'?t for you|rather (we didn'?t|not)|people we can'?t help)\b/i,
 w:{takeaway:3.8, sincerity:1.6, c_clinical:1.2},
 why:'The takeaway, and it only works if you mean it. Flat, unemotional, slightly quieter — you are withdrawing, so actually withdraw. A fake one teaches them everything else was technique too.'},

/* apology & bad news */
{re:/\b(my (mistake|fault)|i (got|was) (that )?wrong|i(\'| a)m sorry|apolog|should have (told|said))\b/i,
 w:{apology:3.8, sincerity:2, c_grave:1.2},
 why:'One apology, one sentence about what changes, then move. No "but", no explanation until they ask for one — the apology ends exactly where the excuse would start.'},
{re:/\b(difficult news|didn'?t (go|work out)|we lost|bad news|has to be said|not going to (be able|happen))\b/i,
 w:{c_grave:3.2, apology:1.8, c_clinical:1.8, sincerity:1.6},
 why:'Underplay it. The more serious the content, the flatter the delivery should be — heavy content plus heavy delivery reads as manufactured.'},

/* authority */
{re:/\b(this works|i (know|guarantee)|i(\'| ha)ve (seen|watched) (it|this) work|not going to be a problem|will not find|nowhere else)\b/i,
 w:{absolute:3.4, sl_certain:1.4},
 why:'One absolute-certainty line per conversation, on the single load-bearing claim. Anchor it physically — the body produces this tone more reliably than intention does. Then follow it with sincerity so it does not tip into dominance.'},
{re:/\b(stop|now|do it|send it|put it down|get me|no\.)\b/i, short:true,
 w:{command:2.6, absolute:1.2},
 why:'A command. Short, complete, no hedges, steepest fall in the system — and reserve it, because one per hour gets obeyed and one every four minutes gets ignored.'},

/* teaching */
{re:/\b(there are (three|two|four)|here'?s how it works|think of it (like|as)|step (one|two)|first.{0,25}then|let me (show|explain))\b/i,
 w:{b_teach:3.2, sl_certain:1.6, c_bright:1.2},
 why:'One idea per intonation phrase, and deaccent every term the second time you say it. Repeating a word at full prominence is what makes teaching sound patronising.'},

/* intrigue */
{re:/\b(the reason|something i want to show|here'?s the (bit|part)|nobody (mentions|tells)|what actually happen|let me tell you)\b/i,
 w:{intrigue:3, sl_obvious:1.4, b_keynote:1.2},
 why:'Stretch one sonorant in the key word to create the suspension — then pay it off within two sentences, because intrigue that is not delivered on becomes irritation.'},

/* mirror */
{re:/^\s*["“'].{2,40}["”']\s*$/,
 w:{reflect:4},
 why:'A mirror. Their exact words, their register, one beat slower, falling terminal — a mirror that rises becomes a challenge.'},

/* obviousness pivot */
{re:/\b(obviously|of course|sure,? it|that'?s (a )?given|table stakes|goes without saying)\b/i,
 w:{sl_obvious:3.2, c_wry:1.2},
 why:'Deaccent the obvious clause and re-energise on the pivot — but only ever deaccent something they have already agreed to. Deaccenting a contested claim is how you lose an argument you never had.'},

/* feedback / management */
{re:/\b(third time|not the standard|expected (better|more)|you told me|this isn'?t like you|we(\'| ha)ve (had|been) (this|through))\b/i,
 w:{disappoint:3.2, confront:2.4, measured:1.4},
 why:'Quiet and slow, with no anger in it at all — disappointment is anger that has been allowed to cool, and it lands considerably harder. Say it once, say what happens next, then return to normal energy.'},

/* de-escalation */
{re:/\b(one piece at a time|i(\'| ha)ve got (it|you)|we(\'| wi)ll sort|tell me what happened|from the start|not going anywhere)\b/i,
 w:{c_soothe:3.4, reassure:2, sincerity:1.4},
 why:'Go slower and quieter than they are and they will match you within about three exchanges. Never name their emotion as a problem — let entrainment do it silently.'},

/* reassurance */
{re:/\b(that'?s normal|happens to (nearly |almost )?every|you'?re not behind|nothing (you|unusual)|completely fine|fixable)\b/i,
 w:{reassure:3.4, nurture:1.6, warm:1.2},
 why:'Normalise with a fact rather than a feeling. "That happens to about half of them" beats "do not worry" every time.'},

/* gratitude */
{re:/\b(thank you for|i appreciate|that took|you didn'?t have to|owe you)\b/i,
 w:{gratitude:3.4, sincerity:1.6, warm:1.4},
 why:'Name the specific thing it cost them, then stop. Generic thanks reads as punctuation; specific thanks reads as attention.'},

/* scarcity */
{re:/\b(two left|last one|only \d+|until (friday|monday|the end)|waiting list|cap(ped)? (this|at)|closes)\b/i,
 w:{scarce:3.2, c_clinical:1.4},
 why:'Only ever state a limit you could put in writing. Voiced but quiet — a true whisper has no pitch and loses every ounce of authority in the line.'},

/* urgency */
{re:/\b(today|right now|this week|deadline|before (friday|monday)|window|can'?t wait)\b/i,
 w:{urgent:2.4, certainty:1.2},
 why:'Urgency is fast and low. Panic is fast and high. If your pitch rises with your rate you have produced anxiety, and anxiety is contagious.'}
];

/* ---------- structural analysis ---------- */
var STOPWORDS = ('a an the and or but if of to in on at for with from by as is are was were be been being am do does did done have has had will would can could shall should may might must ' +
  'i you he she it we they me him her us them my your his its our their this that these those there here what which who whom whose when where why how not no nor so than then too very just about into over under again further once').split(' ');
var STOP = {}; STOPWORDS.forEach(function(w){ STOP[w]=1; });

function tokenise(s){
  return String(s||'').trim().split(/\s+/).filter(Boolean).map(function(w){
    return {raw:w, clean:w.toLowerCase().replace(/[^a-z0-9'’-]/g,'')};
  });
}
function isContent(w){ return w.clean && !STOP[w.clean] && w.clean.length>1; }

function analyseForm(line){
  var t=String(line||'').trim();
  var f={
    isQuestion: /\?\s*$/.test(t),
    isWh: /^\s*(what|why|how|when|where|who|which|whose)\b/i.test(t),
    isYesNo: false,
    isImperative: false,
    words: tokenise(t).length,
    hedges: [],
    contrast: null,
    repeats: []
  };
  f.isYesNo = f.isQuestion && !f.isWh &&
    /^\s*(is|are|was|were|do|does|did|can|could|will|would|shall|should|have|has|had|am|may|might|must|any|so)\b/i.test(t);
  f.isImperative = !f.isQuestion && /^\s*(stop|go|do|send|put|get|come|look|listen|tell|give|take|call|sit|leave|wait|show|make)\b/i.test(t);

  var HEDGE=/\b(just|sort of|kind of|maybe|perhaps|possibly|i think|i guess|a bit|a little|probably|sorry|quickly|if that('| i)s ok|i could be wrong|might)\b/gi, m;
  while((m=HEDGE.exec(t))) f.hedges.push(m[0]);

  var c = t.match(/\bnot\s+(?:the\s+|a\s+|an\s+)?([\w'’-]+)\b[^.]*?\b(?:it'?s|its|but|it is)\s+(?:the\s+|a\s+|an\s+)?([\w'’-]+)/i);
  if(c) f.contrast={from:c[1], to:c[2]};

  var seen={}, toks=tokenise(t);
  toks.forEach(function(w,i){
    if(!isContent(w)) return;
    if(seen[w.clean]!=null) f.repeats.push({word:w.raw, first:seen[w.clean], again:i});
    else seen[w.clean]=i;
  });
  return f;
}

/* where the nuclear accent should land */
function findNucleus(line, form){
  var toks=tokenise(line);
  if(!toks.length) return null;
  if(form.contrast){
    for(var i=toks.length-1;i>=0;i--)
      if(toks[i].clean===form.contrast.to.toLowerCase().replace(/[^a-z0-9'’-]/g,''))
        return {i:i, word:toks[i].raw, rule:'contrast',
          why:'Contrast overrides everything. "'+form.contrast.from+'" versus "'+form.contrast.to+'" is the whole point of the sentence, so the accent goes on the correction — and it needs the low onglide: dip below your baseline immediately before the peak, or it just reads as ordinary emphasis and the contrast does not land.'};
  }
  for(var j=toks.length-1;j>=0;j--){
    if(isContent(toks[j])){
      var rep=null;
      form.repeats.forEach(function(r){ if(r.again===j) rep=r; });
      if(rep){
        for(var k=j-1;k>=0;k--) if(isContent(toks[k]) && k!==rep.first)
          return {i:k, word:toks[k].raw, rule:'given',
            why:'"'+rep.word+'" has already been said, so it is given information and loses the accent. Re-accenting a word you already used is the most common cause of speech that sounds patronising, and almost nobody notices they are doing it.'};
      }
      return {i:j, word:toks[j].raw, rule:'default',
        why:'Default focus falls on the last content word. Everything after it should drop in pitch range and volume — that is post-focus compression, and it improves how clearly a listener identifies your emphasis by twenty-five to thirty percentage points.'};
    }
  }
  return {i:toks.length-1, word:toks[toks.length-1].raw, rule:'default', why:'Last word carries it.'};
}

/* ---------- the engine ---------- */
function advise(input){
  var stageId=input.stage, line=String(input.line||'').trim(), mods=input.mods||[];
  var stage = STAGES.filter(function(s){return s.id===stageId;})[0] || STAGES[0];
  var scores={}, reasons=[], warnings=[];

  function add(id, v, why, src){
    if(!TONE_BY_ID[id]) return;
    scores[id]=(scores[id]||0)+v;
    if(why) reasons.push({tone:id, v:v, why:why, src:src});
  }

  Object.keys(stage.tones).forEach(function(id){
    add(id, stage.tones[id], null, 'stage');
  });
  reasons.push({tone:null, v:0, src:'stage',
    why:'Stage — <b>'+stage.n+'</b>. '+stage.hint+' That sets the starting distribution before anything you typed is considered.'});

  var fired=[];
  if(line){
    TRIGGERS.forEach(function(t){
      if(t.short && tokenise(line).length>7) return;
      if(t.re.test(line)){
        fired.push(t);
        Object.keys(t.w).forEach(function(id){ add(id, t.w[id], null, 'phrase'); });
        reasons.push({tone:Object.keys(t.w)[0], v:0, src:'phrase', why:t.why});
      }
    });
  }

  var form = analyseForm(line);
  if(line){
    if(form.isWh){ add('nq_curious',1.4,null,'form'); add('neutral',1.2,null,'form'); }
    if(form.isYesNo){ add('invite',1.4,null,'form'); add('nq_soft',1,null,'form'); }
    if(form.isImperative){ add('command',2,null,'form'); }
    if(!form.isQuestion && form.words>22){ add('b_teach',1.4,null,'form'); add('b_narrate',1,null,'form'); }
    if(!form.isQuestion && form.words<=5){ add('sl_close',0.8,null,'form'); add('probe',0.8,null,'form'); }
  }

  mods.forEach(function(mid){
    var m=MODS.filter(function(x){return x.id===mid;})[0];
    if(!m) return;
    Object.keys(m.up||{}).forEach(function(id){ add(id, m.up[id], null, 'mod'); });
    Object.keys(m.down||{}).forEach(function(id){ add(id, m.down[id], null, 'mod'); });
    reasons.push({tone:null, v:0, src:'mod', why:'<b>'+m.n+'.</b> '+m.why});
    Object.keys(m.down||{}).forEach(function(id){
      if(m.down[id]<=-2.5 && TONE_BY_ID[id]) warnings.push({tone:id, why:m.n});
    });
  });

  // locked out entirely
  var locked=[];
  Object.keys(scores).forEach(function(id){
    if(scores[id]<0){ locked.push(id); delete scores[id]; }
  });

  var ranked=Object.keys(scores)
    .filter(function(id){ return TONE_BY_ID[id] && S.tierUnlocked(TONE_BY_ID[id].tier); })
    .map(function(id){ return {id:id, tone:TONE_BY_ID[id], score:scores[id]}; })
    .sort(function(a,b){ return b.score-a.score; });

  if(!ranked.length) ranked=[{id:'neutral', tone:TONE_BY_ID.neutral, score:1}];

  var top=ranked[0].score, total=ranked.reduce(function(s,r){ return s+Math.max(0,r.score); },0)||1;
  ranked.forEach(function(r){ r.pct=Math.round(r.score/total*100); });

  var confidence = ranked.length>1 ? Math.min(99, Math.round(40 + (ranked[0].score-ranked[1].score)/Math.max(1,top)*55 + (fired.length?12:0))) : 70;

  return {
    stage:stage, ranked:ranked.slice(0,4), reasons:reasons, warnings:warnings,
    locked:locked.map(function(id){ return TONE_BY_ID[id]; }).filter(Boolean),
    form:form, nucleus: line? findNucleus(line, form) : null,
    fired:fired.length, confidence:confidence, line:line
  };
}

/* ---------- delivery instruction for a specific line ---------- */
function deliveryNotes(res){
  if(!res.line) return [];
  var t=res.ranked[0].tone, f=res.form, out=[];

  var lo=t.target.term[0], hi=t.target.term[1];
  var wantRise = lo > 0, wantFall = hi < 0, spans = lo<=0 && hi>=0;
  out.push({
    k:'Terminal',
    v: wantRise ? 'Lift the last word — up '+lo+' to '+hi+' semitones'
       : wantFall ? 'Land the last word down — '+Math.abs(hi)+' to '+Math.abs(lo)+' semitones below the peak'
       : 'Gentle fall or held level — anywhere from '+Math.abs(lo)+' down to '+hi+' up',
    d: spans
        ? 'This tone tolerates either. A soft fall closes the thought; holding it level leaves it suspended so they keep imagining. On a future-pace question the level tone is usually stronger — it signals there is more to come and stops them treating it as answered.'
        : (f.isQuestion && wantFall
        ? 'It is written as a question but this tone wants a falling terminal. That is correct and deliberate: a wh-question delivered with a rise sounds uncertain, and in this position the fall is what makes it land as genuine curiosity rather than an interrogation.'
        : (!f.isQuestion && wantRise
        ? 'It is a statement but this tone lifts. Use it only on setup material — never on a claim, a price, a commitment or a close, where a rise hollows the content out.'
        : t.recipe.terminal))
  });

  if(res.nucleus){
    out.push({k:'Emphasis', v:'Hit “'+String(res.nucleus.word).replace(/[.,!?;:]+$/,'')+'”', d:res.nucleus.why});
  }

  var pauseWhere = f.isQuestion
    ? 'Two full seconds after the question mark. Longer than feels survivable — anything under about 1.5 seconds and you will answer it yourself, which is the most common self-inflicted wound in selling.'
    : (res.ranked[0].id==='consequence' || res.ranked[0].id==='c_grave' || res.ranked[0].id==='gravity')
    ? 'A full second before you start, and a longer one after you finish. The silence carries the weight the words deliberately do not.'
    : (res.ranked[0].id==='sl_close')
    ? 'Nothing before it. Then absolute silence after. Whoever speaks first loses, and ten seconds feels like sixty from the inside — count it.'
    : 'A short beat before the emphasised word. A pause promotes whatever precedes it, so you get emphasis for free without raising your voice.';
  out.push({k:'Pause', v:'Where the silence goes', d:pauseWhere});

  out.push({k:'Pace', v:t.target.wpm[0]+'–'+t.target.wpm[1]+' wpm', d:t.recipe.pace});

  if(f.hedges.length){
    out.push({k:'Cut these', v:f.hedges.join(', '),
      d:'Every hedge is a small withdrawal from your own credibility. Delete them and say the identical sentence with a falling terminal — nothing else changes, and listen to what happens to the claim.'});
  }
  if(f.contrast){
    out.push({k:'Contrastive scoop', v:'"'+f.contrast.from+'" → "'+f.contrast.to+'"',
      d:'Dip below your baseline immediately before the peak on the correction, and let the peak arrive about a tenth of a second later than it would in ordinary emphasis. That low onglide is what makes a contrast audible, and it is exactly what most people leave out.'});
  }
  if(f.words>28 && !f.isQuestion){
    out.push({k:'Too long', v:f.words+' words in one breath',
      d:'Skilled English speakers phrase at around five and a half syllables. Break this into two or three intonation phrases with real pauses between them, or the emphasis has nowhere to sit.'});
  }
  return out;
}

/* ---------- shared state for the Custom Prompt view ----------
   Global on purpose: both the view and the custom drill mode read it,
   and they live in separate closures.                              */
var CP = {stage:'discovery', line:'', mods:[], res:null};

/* renders the line with the nucleus marked and post-focus material dimmed */
function markLine(r){
  if(!r || !r.line) return '';
  function esc2(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  var toks=r.line.trim().split(/\s+/);
  var n=r.nucleus?r.nucleus.i:-1;
  return toks.map(function(w,i){
    if(i===n) return '<span class="em">'+esc2(w)+'</span>';
    if(n>=0 && i>n) return '<span class="soft">'+esc2(w)+'</span>';
    return esc2(w);
  }).join(' ') + (r.form && r.form.isQuestion ? ' <span class="pz">⟨ 2s ⟩</span>' : '');
}
</script>
