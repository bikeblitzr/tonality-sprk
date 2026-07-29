<script>
/* ============================================================
   THE BRAIN — authored knowledge spine
   Every node is real: a mechanism, a figure from the literature,
   a rule this app actually applies, or a decision it actually makes.
   t = what it is · h = how it helps you · v = headline figure
   The 72 tones, 230 twisters, 39 principles, codex chapters,
   advisor stages/triggers, emphasis tables and drill modes are
   expanded into this graph at runtime from their own datasets,
   so nothing here is duplicated and nothing is invented.
   ============================================================ */
'use strict';

var BRAIN = [
/* ROOT + THE TEN DOMAINS ------------------------------------------------ */
{id:"root",n:"How this works",k:"root",
 t:"Everything this app measures, every number it scores you against, and every rule it uses to decide what you should sound like. None of it is invented. This map is the whole engine, opened up.",
 h:"You are being graded by a machine. You should be able to see exactly what it believes and why, so you can argue with it — and so you can trust it when it says you got better."},

{id:"voice",p:"root",n:"Sound & the voice",k:"domain",hemi:-1,
 t:"How a human being physically produces a sound, from the air in your lungs to the pressure wave that leaves your mouth. Three stages: a power supply, a vibrating source, and a filter that shapes it.",
 h:"Almost every voice problem is one of these three stages failing. Knowing which stage is broken tells you which drill fixes it, instead of guessing."},

{id:"pros",p:"root",n:"Prosody",k:"domain",hemi:-1,
 t:"The music of speech — the parts that ride on top of the words. Four independent dials: pitch, timing, loudness and voice quality. Change the dials and the same sentence means something different.",
 h:"This is the entire subject of this app. Every drill here moves one of these four dials on purpose, so you stop being at the mercy of whichever one your mood happens to move."},

{id:"artic",p:"root",n:"Articulation",k:"domain",hemi:-1,
 t:"How the tongue, lips, jaw and soft palate carve airflow into distinguishable speech sounds. Roughly 44 phonemes in English, each a specific geometry held for a few tens of milliseconds.",
 h:"Tonality can be perfect and still fail if the words arrive smeared. Articulation is the cheapest fix in the whole app — it is mechanical, it responds fast, and progress is obvious within days."},

{id:"eng",p:"root",n:"The measurement engine",k:"domain",hemi:-1,
 t:"What actually happens between your microphone and your score. Sampling, windowing, pitch detection, voice-activity gating, segmentation, and the derived statistics. All of it runs inside your browser.",
 h:"When a score surprises you, this is where the answer is. It also shows you exactly what is never captured — no audio leaves the machine, and this is the proof of it."},

{id:"score",p:"root",n:"Scoring & fairness",k:"domain",hemi:-1,
 t:"How a set of acoustic numbers becomes a grade out of 100 — which bands, taken from which findings, weighted how, and what the app does about the fact that no two voices start in the same place.",
 h:"A score you do not understand is just a number to feel bad about. A score you understand is an instruction."},

{id:"perc",p:"root",n:"How listeners decode you",k:"domain",hemi:1,
 t:"What the person on the other end actually does with your voice — how fast they judge it, which acoustic cues drive which impressions, and how much of it happens before they have processed a single word.",
 h:"You are not optimising for a score. You are optimising for the effect in someone else's head. This is the part that says which effect each number produces."},

{id:"emph",p:"root",n:"Emphasis & meaning",k:"domain",hemi:1,
 t:"Which word you stress, and what that does to the sentence. English encodes a startling amount of meaning in stress placement — enough that the same nine words can carry nine different claims.",
 h:"Most people put the stress where their breath happens to land. Choosing it deliberately is the single highest-leverage change available in a sentence you have already written."},

{id:"tone",p:"root",n:"The tone system",k:"domain",hemi:1,
 t:"Seventy-two named tones in ten families. Each one is a specific combination of the four prosodic dials, with a measurable target, a physical cue that reliably produces it, and a characteristic way it goes wrong.",
 h:"Named things can be practised. Turning voice into a vocabulary of 72 reproducible settings is what makes it trainable instead of a personality trait."},

{id:"psych",p:"root",n:"Influence & psychology",k:"domain",hemi:1,
 t:"Status, framing, attention, and the decision shortcuts people run under uncertainty. The part of persuasion that sits above the voice and decides what the voice is being used for.",
 h:"Tone without judgement is a trick. This is the layer that tells you which tone the moment actually calls for, and where the line is between influence and manipulation."},

{id:"learn",p:"root",n:"Learning & practice",k:"domain",hemi:1,
 t:"How a motor skill is actually acquired — variability, spacing, interference, feedback timing, and why the thing that feels like efficient practice is usually the thing that produces the least durable skill.",
 h:"It decides how you should use the other nine domains. Same hours, very different outcome, depending on how the sessions are shaped."},

/* ===================================================================== */
/* DOMAIN 1 — SOUND & THE VOICE                                          */
/* ===================================================================== */
{id:"v.pow",p:"voice",n:"The power supply",k:"concept",
 t:"Air pressure below the vocal folds — subglottal pressure — driven by the diaphragm, intercostals and abdominal wall. Typically 5 to 10 cm of water for conversational speech, rising to 30 or more for a shout.",
 h:"Almost everything people call confidence in a voice is really pressure stability. If the support fails, pitch wobbles, the ends of sentences die, and no amount of intention fixes it."},

{id:"v.pow.dia",p:"v.pow",n:"The diaphragm",k:"concept",
 t:"A dome of muscle under the lungs. It contracts downward to inhale, and then — critically — releases slowly against the abdominal wall during speech rather than collapsing.",
 h:"The controlled release is the skill. That eccentric control is what lets you spend a breath evenly across a long sentence instead of dumping most of it into the first four words."},

{id:"v.pow.sup",p:"v.pow",n:"Breath support, precisely",k:"concept",
 t:"Not taking a big breath. It is the balance between the elastic recoil of the ribcage wanting to collapse and the abdominal muscles resisting it, held steady so pressure stays constant while lung volume falls.",
 h:"This is why the count-to-twenty drill exists. Losing more than about 4 dB from the first number to the last means the balance is failing, and that is a measurable, trainable thing."},

{id:"v.pow.mpt",p:"v.pow",n:"Maximum phonation time",k:"number",v:"15-25 s",
 t:"How long you can sustain a comfortable vowel on one breath. Around 15 to 20 seconds indicates adequate support in most adults; above 25 is strong; under 10 usually points to inefficient fold closure rather than small lungs.",
 h:"It is the cheapest weekly benchmark you have. One number, thirty seconds, and it moves in response to training — the app records it during calibration."},

{id:"v.pow.clav",p:"v.pow",n:"Clavicular breathing",k:"defect",
 t:"Breathing high into the chest with visible shoulder rise. Recruits accessory neck muscles, raises the larynx, and gives you a small volume of air held under unstable pressure.",
 h:"It is the default under stress, which is exactly when you need the opposite. Catching it is easy — if your shoulders move on the inhale, that is it."},

{id:"v.src",p:"voice",n:"The source: vocal folds",k:"concept",
 t:"Two layered folds of tissue in the larynx, roughly 17 to 25 mm long in adult men and 12 to 17 mm in adult women. Air forced between them sets up a self-sustaining oscillation.",
 h:"Fold length is the only reason male and female voices sit in different registers. It is also why raw pitch in Hz is useless for comparing two people — and why this app converts everything to semitones."},

{id:"v.src.ber",p:"v.src",n:"Why folds vibrate at all",k:"concept",
 t:"Not muscle twitching — they oscillate passively. Airflow between the folds drops the pressure there, they get sucked together, pressure builds beneath, they blow apart, and the cycle repeats. Around 100 times a second for a typical male voice.",
 h:"Once you know it is aerodynamic rather than muscular, the fix for a strained voice stops being 'push harder' and becomes 'change the airflow' — which is exactly what straw phonation does."},

{id:"v.src.f0",p:"v.src",n:"Fundamental frequency (F0)",k:"number",v:"85-180 / 165-255 Hz",
 t:"The rate of that oscillation, and the physical thing your ear reports as pitch. Typical speaking F0 is about 85 to 180 Hz for adult men and 165 to 255 Hz for adult women, with large individual spread.",
 h:"Every pitch measurement in this app is F0. The spread across normal people is so wide that a raw Hz target would be meaningless — which is why your calibration matters."},

{id:"v.src.reg",p:"v.src",n:"Registers",k:"concept",
 t:"Distinct modes of fold vibration. Modal is the everyday speaking mode with full closure. Falsetto has thin, stretched folds and incomplete closure. Vocal fry is a slow, irregular flutter at the very bottom, often under 70 Hz.",
 h:"Each register has a characteristic effect on a listener, and each has a drill here. Fry in particular reads as boredom or exhaustion and is worth learning to hear in yourself."},

{id:"v.src.fry",p:"v.src.reg",n:"Vocal fry",k:"defect",v:"<70 Hz",
 t:"Irregular, low-frequency pulsing at the bottom of the range, heard as a creak. Physiologically harmless in small amounts, and normal at the very end of a falling phrase — but pervasive fry reads as disengagement.",
 h:"The app detects it by finding periodicity below your own floor with high cycle-to-cycle irregularity. It flags it rather than scoring it down, because occasional fry is completely normal."},

{id:"v.src.clos",p:"v.src",n:"Closed quotient",k:"concept",
 t:"The fraction of each vibration cycle where the folds are fully shut. Higher closed quotient means a sharper, more energetic pulse, more harmonic energy up high, and a voice that carries further at the same effort.",
 h:"This is the actual mechanism behind 'projection'. You are not being louder — you are making a more efficient pulse, which is why warmups that improve closure make you audible without shouting."},

{id:"v.filt",p:"voice",n:"The filter: your vocal tract",k:"concept",
 t:"The tube from folds to lips, about 17 cm in adult men and 14 in adult women. It has resonant frequencies that amplify some harmonics of the source and suppress others. Those peaks are called formants.",
 h:"Timbre — what makes your voice sound like yours rather than someone else's at the same pitch — is almost entirely this tube. And unlike fold length, its shape is partly under your control."},

{id:"v.filt.fmt",p:"v.filt",n:"Formants",k:"concept",
 t:"Resonant peaks in the vocal tract, numbered from the bottom. F1 and F2 together determine which vowel a listener hears. F3 upward carries most of the individual character of a voice.",
 h:"Vowel clarity is literally F1/F2 separation. The vowel gymnastics rack exists to widen that separation, which is why collapsed vowels sound muffled no matter how crisp your consonants are."},

{id:"v.filt.sf",p:"v.filt",n:"The singer's formant",k:"concept",v:"~2.8-3.2 kHz",
 t:"A cluster of resonances around 2.8 to 3.2 kHz produced by lowering the larynx and widening the pharynx. It sits in the region where the ear is most sensitive and where orchestras and room noise are weakest.",
 h:"It is the reason a trained speaker cuts through a noisy room without effort. The yawn-sigh warmup is the fastest way to feel the larynx drop that produces it."},

{id:"v.filt.nas",p:"v.filt",n:"Nasality",k:"concept",
 t:"When the soft palate fails to seal the nasal cavity, sound leaks through the nose and adds a second, competing resonator. A little is normal on /m/, /n/ and /ŋ/. Constant leakage is heard as whine.",
 h:"The nasal rack in the articulation gym is really soft-palate training. Learning to open and close that valve deliberately removes a whole category of tonal problem."},

{id:"v.hyg",p:"voice",n:"What actually damages a voice",k:"concept",
 t:"Dehydration, throat clearing, shouting over noise, speaking at the extreme bottom of your range for hours, and reflux. Not, generally, ordinary heavy use with decent technique.",
 h:"You are going to be doing a lot of reps in this app. Knowing which habits cost you tissue and which are just noise means you can train hard without wrecking anything."},

{id:"v.hyg.hyd",p:"v.hyg",n:"Hydration and the mucosal wave",k:"concept",
 t:"The vocal folds are covered by a loose, fluid-dependent layer that ripples with each cycle. Dehydrate it and phonation threshold pressure rises measurably — it takes more push to make any sound at all.",
 h:"It is why your voice is worse in dry air or after a night out and it feels like effort. Systemic water takes hours; there is no shortcut right before you speak."},

{id:"v.hyg.svc",p:"v.hyg",n:"Semi-occluded vocal tract exercises",k:"method",
 t:"Partially blocking the mouth — a straw, lip trill, hum, or /v/ — raises pressure above the folds. That back-pressure pushes them apart slightly, so they collide with less force while still vibrating efficiently.",
 h:"This is the most evidence-backed warmup that exists, and it is why the first three steps of the warmup rack are a hum, a trill and a straw. Effects last several minutes into speech."},

/* ===================================================================== */
/* DOMAIN 2 — PROSODY                                                    */
/* ===================================================================== */
{id:"p.pitch",p:"pros",n:"Pitch",k:"concept",
 t:"The dial with the most information on it. Three separate things matter and they move independently: where your voice sits on average, how far it travels, and what it does at the end of a phrase.",
 h:"Most people treat pitch as one knob and turn it the wrong way. Learning that these are three separate controls is the fastest single improvement available to nearly anyone."},

{id:"p.pitch.st",p:"p.pitch",n:"Why semitones, not hertz",k:"method",
 t:"Pitch perception is logarithmic — a jump from 100 to 200 Hz sounds the same size as 200 to 400. A semitone is one twelfth of a doubling, so equal semitone distances sound equal to everyone regardless of register.",
 h:"It is what lets a bass voice and a high voice be held to the identical target. Every pitch number in this app is in semitones for exactly this reason."},

{id:"p.pitch.mean",p:"p.pitch",n:"Mean pitch",k:"concept",
 t:"Where your voice sits on average across an utterance. It rises under arousal — stress, excitement, fear — because the muscles that tension the folds tighten along with everything else.",
 h:"Listeners read a raised mean as anxiety, not enthusiasm. If you sound nervous when you are not, this is almost always the reason, and it is independent of how expressive you are."},

{id:"p.pitch.span",p:"p.pitch",n:"Pitch span",k:"number",v:"6-10 st engaged",
 t:"How far your voice travels within a phrase. Under about 4 semitones reads as monotone; 6 to 10 reads as engaged; above 14 starts to sound theatrical in most business contexts.",
 h:"This is the number that decides whether people stay awake. It is also the one most people get backwards — they flatten to sound serious, which just sounds dead."},

{id:"p.pitch.conf",p:"p.pitch",n:"The confidence combination",k:"rule",
 t:"Speech heard as confident has a low mean pitch AND a wide pitch span. Anxious speech has a high mean and a narrow span. These are two independent dials, and almost everyone moves them together.",
 h:"It is the single most useful fact in this app. Practise dropping your floor while widening your travel and you get the whole effect at once, instead of trading one for the other."},

{id:"p.pitch.decl",p:"p.pitch",n:"Declination",k:"concept",
 t:"Pitch drifts gradually downward across any long utterance as subglottal pressure falls. It is largely automatic, and listeners subtract it — they hear a late high note as higher than the same note early on.",
 h:"It means your emphasis has to get physically bigger toward the end of a long sentence just to stay equally audible. Most people fade instead, which is why endings die."},

{id:"p.pitch.term",p:"p.pitch",n:"Terminal contour",k:"concept",v:"4-7 st fall",
 t:"What pitch does over the last stressed syllable of a phrase. A confident declarative falls 4 to 7 semitones. Below about 3 semitones the listener does not register it as a fall at all.",
 h:"It is the difference between a statement and a request for permission. This is the one target the app never personalises, because a fall is a physical event, not a relative one."},

{id:"p.pitch.up",p:"p.pitch.term",n:"Uptalk",k:"defect",
 t:"A rising terminal on a declarative sentence. In some dialects it is a genuine discourse marker meaning 'still speaking, stay with me'. In most professional settings it is decoded as uncertainty.",
 h:"The Defect Lab makes you produce it deliberately before correcting it, because you cannot reliably stop doing something you cannot hear yourself doing."},

{id:"p.time",p:"pros",n:"Timing",k:"concept",
 t:"Rate, rhythm and silence. Three components: how many words per minute, how evenly they are spaced, and how much of the total time is not speech at all.",
 h:"Timing is the dial people underuse most. Silence in particular is free, immediately available, and produces a bigger perceived change in authority than anything else you can do in one session."},

{id:"p.time.wpm",p:"p.time",n:"Words per minute",k:"number",v:"148-174 persuasive",
 t:"Conversational English runs roughly 120 to 150 wpm. Persuasive speech sits higher, around 148 to 174. Above about 200 comprehension starts falling for unfamiliar material.",
 h:"Faster is more persuasive than most people expect, up to a limit — but only if pause structure survives. The Pace Gym trains rate and pause together for that reason."},

{id:"p.time.syl",p:"p.time",n:"Syllable rate",k:"number",v:"5-6 syll/s",
 t:"A more honest measure than wpm, because word length varies. Comfortable English runs about 5 to 6 syllables per second. Above 6.5 with a pause fraction under 10% is the signature of rushing.",
 h:"The app uses both. Two people at the same wpm can be doing very different things, and syllable rate plus pause fraction separates 'brisk' from 'panicking'."},

{id:"p.time.pause",p:"p.time",n:"Pause",k:"number",v:"200 ms floor",
 t:"A gap under about 200 ms is not perceived as a pause at all — it reads as articulation. A sentence boundary wants 400 to 700 ms. After asking a real question, 1500 ms or more.",
 h:"Almost everyone pauses too briefly to register. Knowing the floor is 200 ms means you can stop guessing and start counting."},

{id:"p.time.filled",p:"p.time.pause",n:"Filled pauses",k:"defect",
 t:"Um, uh, so, like, you know. They occupy the silence rather than removing it. Interestingly, a low rate of them can increase perceived sincerity — it is the high rate that costs you.",
 h:"The fix is not eliminating them. It is being comfortable with 400 ms of nothing, at which point they mostly disappear on their own."},

{id:"p.time.isoc",p:"p.time",n:"Stress timing",k:"concept",
 t:"English tends toward roughly equal intervals between stressed syllables, squashing unstressed ones to fit. Languages like Spanish and Japanese instead give every syllable near-equal length.",
 h:"It is why the Italian and Japanese lines in the world rack feel so strange to say. Practising a syllable-timed language is direct training for even, unhurried delivery."},

{id:"p.loud",p:"pros",n:"Loudness",k:"concept",
 t:"Perceived intensity, measured here in decibels relative to your own utterance average. Two things matter: the range you cover, and whether you hold level at the ends of phrases.",
 h:"Loudness is the dial people confuse with confidence. Absolute volume matters far less than variation — a wide, controlled range reads as authority; constant loudness reads as aggression."},

{id:"p.loud.dyn",p:"p.loud",n:"Dynamic range",k:"number",v:"8-12 dB",
 t:"The spread between the quietest and loudest parts of a phrase. Around 8 to 12 dB reads as expressive. Under 4 dB is flagged as flat regardless of what pitch is doing.",
 h:"You can have decent pitch movement and still sound dead if intensity is nailed down. This is the second half of expressiveness and it is measured separately for that reason."},

{id:"p.loud.acc",p:"p.loud",n:"The accent increment",k:"number",v:"~3 dB",
 t:"A stressed syllable in English is typically about 3 dB louder than its neighbours, alongside being longer and higher. Three cues stacked, of which loudness is the weakest.",
 h:"It explains why shouting a word does not emphasise it properly. Real emphasis needs the pitch and length changes too, which is what the Emphasis Lab drills."},

{id:"p.loud.floor",p:"p.loud",n:"The volume floor",k:"rule",v:"within 4 dB",
 t:"Final-syllable intensity relative to the utterance average. Staying within about 4 dB means you landed the sentence. Dropping further means you trailed off, even if your pitch fell correctly.",
 h:"This is exactly what separates a proper falling terminal from fading out. Both look like a pitch drop; only one of them sounds decisive."},

{id:"p.qual",p:"pros",n:"Voice quality",k:"concept",
 t:"Timbre independent of pitch and loudness — breathy, creaky, pressed, resonant, nasal. Determined by how the folds close and how the tract above them is shaped.",
 h:"It carries emotional information the other three dials cannot. Warmth in particular is almost entirely a quality effect, not a pitch one."},

{id:"p.qual.brth",p:"p.qual",n:"Breathiness",k:"concept",
 t:"Incomplete fold closure lets unmodulated air escape alongside the tone, adding noise between the harmonics. Reads as intimacy, vulnerability or fatigue depending on context.",
 h:"It is a legitimate tool — deliberately breathy is the standard move for delivering bad news or lowering someone's guard. Unintentionally breathy just reads as tired."},

{id:"p.qual.press",p:"p.qual",n:"Pressed phonation",k:"defect",
 t:"Squeezing the folds harder than the airflow requires. Produces a tight, effortful sound, raises collision force, and is the main mechanical route to nodules in heavy voice users.",
 h:"It is what 'trying to sound authoritative' usually produces. The antidote is aerodynamic, not muscular — more flow, less squeeze, which is what the trills retrain."},

{id:"p.indep",p:"pros",n:"The dials are independent",k:"rule",
 t:"Pitch, timing, loudness and quality can each be moved without moving the others. Untrained speakers move them as a block — getting louder, faster, higher and tighter all at once under pressure.",
 h:"Separating them is most of what training is. Nearly every drill in this app isolates one dial and holds the others still, because that is the only way the coupling breaks."}
,
/* ===================================================================== */
/* DOMAIN 3 — ARTICULATION                                               */
/* ===================================================================== */
{id:"a.place",p:"artic",n:"Place of articulation",k:"concept",
 t:"Where in the mouth the airflow is obstructed. Front to back: lips, lips-and-teeth, between the teeth, the ridge behind the teeth, the hard palate, the soft palate, the throat.",
 h:"Twisters are hard when consecutive sounds sit at different places — the tongue has to travel. Knowing the map tells you why a given line defeats you and which one to use as a warmup for it."},

{id:"a.place.bil",p:"a.place",n:"Bilabial",k:"concept",v:"/p/ /b/ /m/ /w/",
 t:"Both lips. The most visible articulation and the easiest to feel, which is why lip trills and hums are the first thing in every warmup rack.",
 h:"If you want fast proof that resonance work is doing something, hum and feel your lips buzz. That buzz is the forward placement everyone talks about."},

{id:"a.place.alv",p:"a.place",n:"Alveolar",k:"concept",v:"/t/ /d/ /n/ /s/ /z/ /l/",
 t:"Tongue tip against the ridge just behind the upper teeth. The most crowded region in English — six phonemes at essentially one location, distinguished only by voicing, nasality and airflow shape.",
 h:"This crowding is why so many twisters live here. Tiny errors of a millimetre or two turn one sound into another, which is exactly what makes them useful."},

{id:"a.place.pal",p:"a.place",n:"Postalveolar",k:"concept",v:"/ʃ/ /ʒ/ /tʃ/ /dʒ/",
 t:"Slightly further back, with the tongue blade broad and the lips usually rounded. The 'sh' family. Differs from /s/ by only a few millimetres of blade position.",
 h:"The /s/ versus /ʃ/ contrast is the hardest in English and where lisps live. The app measures it directly during calibration by comparing the spectral centre of gravity of each."},

{id:"a.place.vel",p:"a.place",n:"Velar",k:"concept",v:"/k/ /g/ /ŋ/",
 t:"Back of the tongue against the soft palate. The slowest of the three main stop positions for most people, and the one neglected by warmups that only work the front of the mouth.",
 h:"The puh-tuh-kuh drill exists specifically to include it. If your kuh rate is well below your puh rate, that is a real, fixable asymmetry."},

{id:"a.manner",p:"artic",n:"Manner of articulation",k:"concept",
 t:"What kind of obstruction it is. Full closure and release is a stop. Narrow gap with turbulence is a fricative. Stop then fricative is an affricate. Airflow through the nose is a nasal. Near-open is an approximant.",
 h:"Manner is what breaks first under speed — affricates collapse into fricatives, stops become glottal. Knowing the failure mode lets you hear your own errors instead of just feeling clumsy."},

{id:"a.manner.stop",p:"a.manner",n:"Stops",k:"concept",
 t:"Complete closure, pressure builds, then release. Six in English: /p b t d k g/. The release burst is what your ear uses to place them, and it lasts only a few milliseconds.",
 h:"Crispness is the burst. Mumbling is stops that never fully close, so there is no pressure and no burst. That is a mechanical fault with a mechanical fix."},

{id:"a.manner.vot",p:"a.manner.stop",n:"Voice onset time",k:"number",v:"~30 ms",
 t:"The gap between releasing a stop and the vocal folds starting. English voiceless stops have a long lag — the puff of air you feel on 'pin'. Voiced stops start almost immediately.",
 h:"It is the only difference between /p/ and /b/, and it is measured in tens of milliseconds. Native speakers control it unconsciously and cannot easily change it on demand — which is what makes the plosive rack useful."},

{id:"a.manner.fric",p:"a.manner",n:"Fricatives",k:"concept",
 t:"A gap narrow enough to make the airflow turbulent, held rather than released. /f v θ ð s z ʃ ʒ h/. The most precise sustained geometry in speech.",
 h:"Fricatives are unforgiving because there is no burst to hide behind — the sound is the geometry, continuously, for as long as you hold it."},

{id:"a.manner.aff",p:"a.manner",n:"Affricates",k:"concept",v:"/tʃ/ /dʒ/",
 t:"A stop released into a fricative at the same place, functioning as one sound. The 'ch' in church and the 'j' in judge.",
 h:"Under speed they collapse into their fricative half — 'church' becomes 'shursh'. It is one of the most common and least-noticed speed errors."},

{id:"a.manner.appr",p:"a.manner",n:"Approximants",k:"concept",v:"/r/ /l/ /w/ /j/",
 t:"The articulators come close but never close enough to make turbulence. /r/ and /l/ demand the most precise tongue shaping in English, and there are two entirely different ways to make /r/.",
 h:"They are the first thing to blur when you are tired, because near-misses still nearly work. That is why 'red leather, yellow leather' is the standard fatigue test."},

{id:"a.clus",p:"artic",n:"Consonant clusters",k:"concept",
 t:"Consonants with no vowel between them. English allows up to three at the start of a syllable and four at the end — /str/ at the front, /lfθs/ in 'twelfths' at the back. Among the densest of any major language.",
 h:"Clusters are where articulation actually breaks. Every native speaker simplifies them in casual speech; making them survive at speed is what the cluster rack trains."},

{id:"a.ddk",p:"artic",n:"Diadochokinetic rate",k:"number",v:"5-7 /s",
 t:"How fast you can repeat a syllable cleanly. Clinical norms run about 5 to 7 repetitions per second for single syllables, and 1.5 to 2.5 per second for the full puh-tuh-kuh sequence.",
 h:"It is an objective articulatory-speed benchmark used in speech pathology, it takes ten seconds to test, and it responds to training. The warmup rack measures all four."},

{id:"a.cog",p:"artic",n:"Spectral centre of gravity",k:"method",v:"/s/ ~6.5k, /ʃ/ ~3.4k",
 t:"The power-weighted average frequency of a fricative's energy. /s/ concentrates high, around 5 to 8 kHz. /ʃ/ sits lower, around 2.5 to 4 kHz, because the longer cavity in front resonates lower.",
 h:"This is how the app measures your sibilant separation objectively during calibration, instead of asking whether you think you have a lisp."},

{id:"a.cog.bug",p:"a.cog",n:"Why it is peak-gated",k:"method",
 t:"A naive average across the whole spectrum is dragged upward by low-level noise skirts spread across every bin. Measured that way, /ʃ/ came out at 4174 Hz against a known 3400 — enough to compress the ratio from 1.91 to 1.45.",
 h:"That error would have flagged perfectly normal speakers as having collapsed separation. Gating at 45% of peak and weighting by power brought it to 1.94 against 1.91 truth."},

{id:"a.lisp",p:"artic",n:"Lisps, properly defined",k:"concept",
 t:"Interdental means the tongue protrudes, turning /s/ toward /θ/. Lateral means air escapes over the sides, producing a wet slushy /s/. Neither is a defect of effort — both are learned tongue postures.",
 h:"The app measures the acoustic consequence rather than judging you, and it adjusts what it expects during calibration. A soft /s/ never costs you tonality points."},

/* ===================================================================== */
/* DOMAIN 4 — THE MEASUREMENT ENGINE                                     */
/* ===================================================================== */
{id:"e.chain",p:"eng",n:"The signal chain",k:"concept",
 t:"Microphone, then the browser's Web Audio API, then a script node delivering blocks of raw float samples, then everything else in JavaScript. Nine stages between air pressure and a number on screen.",
 h:"Every stage can distort what you get scored on. Knowing the chain tells you which problems are your voice and which are your room or your hardware."},

{id:"e.chain.sr",p:"e.chain",n:"Sample rate & window",k:"number",v:"48 kHz, ~2048",
 t:"Audio is sampled around 48,000 times a second. Analysis happens on overlapping windows of roughly 2048 samples — about 43 ms — because pitch needs a few complete cycles to be measurable at all.",
 h:"It is the resolution limit on everything. A 43 ms window means the app cannot see events shorter than that, which is why a stop burst is inferred rather than measured directly."},

{id:"e.chain.nq",p:"e.chain",n:"Nyquist limit",k:"rule",v:"24 kHz",
 t:"You can only faithfully represent frequencies up to half the sample rate. At 48 kHz that is 24 kHz — comfortably above the top of human hearing and well above the /s/ energy the app cares about.",
 h:"It is why sibilant measurement is trustworthy here. If the app ran at 8 kHz like a phone line, half the /s/ energy would simply not exist."},

{id:"e.pitch",p:"eng",n:"Pitch detection",k:"method",
 t:"Finding F0 in a noisy window is genuinely hard. This app uses the McLeod method — a normalised square difference function — with parabolic peak refinement, octave-error correction and median filtering on top.",
 h:"Every pitch number you are scored on comes out of this. It is also where the most embarrassing errors in voice software happen, so it is worth seeing how it is defended."},

{id:"e.pitch.nsdf",p:"e.pitch",n:"The NSDF, plainly",k:"method",
 t:"Slide the waveform against a delayed copy of itself. At a delay equal to one period the two line up and correlation peaks. Normalising by signal energy makes the peak height meaningful rather than volume-dependent.",
 h:"The normalisation is why quiet speech does not score worse than loud speech. Raw autocorrelation would make your pitch reading depend on how close you sat to the mic."},

{id:"e.pitch.par",p:"e.pitch",n:"Parabolic refinement",k:"method",
 t:"The correlation peak lands between two discrete samples. Fitting a parabola through the peak and its two neighbours gives a sub-sample estimate of the true maximum.",
 h:"Without it, pitch resolution would be coarse enough to be jumpy at high F0. This is the difference between a smooth contour line and a staircase."},

{id:"e.pitch.oct",p:"e.pitch",n:"Octave errors",k:"defect",
 t:"The classic failure of every pitch tracker — reporting exactly half or double the true frequency, because a waveform that repeats every period also repeats every two periods.",
 h:"A single octave error injects a 12-semitone spike and destroys your span score for that rep. The app anchors to your calibrated modal pitch and to a running median specifically to kill them."},

{id:"e.pitch.med",p:"e.pitch",n:"Median filtering",k:"method",v:"5-point",
 t:"Each pitch value is replaced by the median of itself and its neighbours. A median ignores outliers entirely, unlike an average, which gets dragged toward them.",
 h:"It removes isolated glitches without smearing real, fast pitch movement — which a smoothing average would flatten, costing you the span you actually produced."},

{id:"e.pitch.bnd",p:"e.pitch",n:"Search bounds from calibration",k:"rule",
 t:"Without a profile, the tracker searches 60 to 900 Hz — the whole human range. After calibration it searches roughly 0.72x your measured low to 1.55x your measured high.",
 h:"Narrowing the search is the single biggest accuracy gain calibration buys you. A smaller haystack means far fewer chances to lock onto the wrong periodicity."},

{id:"e.vad",p:"eng",n:"Voice activity detection",k:"method",
 t:"Deciding which frames are speech. Combines short-term energy against your measured noise floor with periodicity strength, so a fan or a keyboard does not register as voice.",
 h:"Every pause measurement depends on this boundary. If VAD were sloppy, a noisy room would fill your silences and your pause discipline score would be fiction."},

{id:"e.vad.noise",p:"e.vad",n:"Your noise floor",k:"number",
 t:"Measured in calibration step one — a few seconds of you saying nothing. Under about -60 dB is quiet, -50 is workable, above -40 means the room is competing with you.",
 h:"It sets the gate for everything after it. It is also honest feedback: if the app tells you the room is loud, your scores in that room are less trustworthy."},

{id:"e.seg",p:"eng",n:"Segmentation",k:"method",
 t:"Splitting the recording into speech runs and gaps, then classifying gaps by duration — under 200 ms is articulation, 200 to 400 ms a beat, 400 to 700 a sentence boundary, beyond that a deliberate hold.",
 h:"Pause structure is only measurable once the boundaries exist. This is the step that turns a continuous waveform into things that can be counted."},

{id:"e.stat",p:"eng",n:"Derived statistics",k:"concept",
 t:"From the voiced frames: mean pitch, percentile span, terminal movement, dynamic range, final-syllable level, pause counts and durations, syllable rate estimate, and fry proportion.",
 h:"These, and only these, are what gets stored or synced. Not the audio. This node is the complete list of what the app knows about a rep."},

{id:"e.stat.pct",p:"e.stat",n:"Why 80th-percentile span",k:"rule",
 t:"Using the minimum and maximum pitch of an utterance means one glitch defines your entire range. Taking the 10th to 90th percentile instead ignores the extremes and reports the range you actually used.",
 h:"Naive min-max measurement inflates apparent range by 40 to 120%. If the app used it, everyone would score as expressive and the number would mean nothing."},

{id:"e.priv",p:"eng",n:"What never leaves the browser",k:"rule",
 t:"The audio itself. Recording is held in memory for playback and discarded. What syncs to an account is the derived numbers above, plus which drill and when. No waveform, no transcript, no upload.",
 h:"You are being asked to speak honestly into a microphone many times a day. You are owed a precise, checkable statement of where that audio goes, and this is it."},

/* ===================================================================== */
/* DOMAIN 5 — SCORING & FAIRNESS                                         */
/* ===================================================================== */
{id:"s.band",p:"score",n:"Target bands",k:"concept",
 t:"Every tone carries five target numbers: words per minute, pitch span in semitones, terminal movement, dynamic range in dB, and pause behaviour. A rep is scored on distance from each band.",
 h:"It means a score is decomposable. You never get just 68 — you get which of the five cost you, by how much, and in which direction."},

{id:"s.band.src",p:"s.band",n:"Where the numbers come from",k:"rule",
 t:"Published phonetics and speech-science findings, not invention: persuasive rate studies, pitch-variability and perceived-competence work, terminal-contour research, and the perceptual pause literature.",
 h:"It is the difference between a coaching app and a horoscope. If a target seems wrong for you, you can go and read why it is set there and argue with the actual finding."},

{id:"s.part",p:"score",n:"Partial credit",k:"rule",
 t:"Each parameter scores on a curve from its target band, not pass or fail. Just outside costs a little; far outside costs a lot. Hard mode narrows the bands and removes the soft edge on terminals.",
 h:"Binary scoring would make most reps look identical. The curve is what lets you see improvement while you are still outside the band."},

{id:"s.flat",p:"score",n:"Your flat baseline",k:"concept",
 t:"Everyone has a different flat — how they sound with no deliberate emphasis at all. One person's unemphasised voice already travels 6 semitones; another's travels 1.5. Calibration measures three reads: flat, natural, expressive.",
 h:"It is the thing that makes a score honest. Hitting 6 semitones is a shrug for one speaker and a huge stretch for another, and the app should not pretend otherwise."},

{id:"s.head",p:"s.flat",n:"Headroom",k:"number",
 t:"The percentage of your demonstrated travel — flat to expressive ceiling — that a given rep actually used. Independent of the raw score, and shown on every result alongside it.",
 h:"It answers the question the score cannot: not 'was that good', but 'was that anything for you'. A 93 that used 4% of your range is worth knowing about."},

{id:"s.dual",p:"score",n:"Two numbers, on purpose",k:"rule",
 t:"The headline score always uses the fixed research bands so it stays comparable between people. Alongside it, always, is the 'vs your flat' comparison anchored to your own calibration.",
 h:"Comparable and personal are both useful and they conflict. Showing both, always, means neither one has to lie."},

{id:"s.pers",p:"score",n:"Personal Mode",k:"rule",
 t:"An optional toggle, off by default, that moves the scoring itself onto bands stretched from your calibration. Clearly labelled as non-comparable while it is on.",
 h:"More encouraging when you are starting a long way from the standard. But two people's scores stop meaning the same thing, so leave it off if a team is being tracked."},

{id:"s.pers.no",p:"s.pers",n:"What is never personalised",k:"rule",
 t:"Terminal inflection. A 5-semitone fall is a physical event with a fixed perceptual consequence — it either reads as a fall to a listener or it does not. There is no personal version of that.",
 h:"It stops Personal Mode becoming a way to be told you are doing well while sounding uncertain to everyone who hears you."},

{id:"s.fair",p:"score",n:"Fairness flags",k:"method",
 t:"When a tone's target sits outside the range a speaker demonstrated they have, the app logs a flag rather than just marking them down. Those flags collect for review.",
 h:"It is the mechanism for the app being wrong out loud. If a target is systematically unreachable for a kind of voice, the flags are how that gets found and fixed."},

{id:"s.mast",p:"score",n:"Mastery and decay",k:"rule",v:"-1/day after 3",
 t:"Each tone carries a mastery value built from your best and recent scores. After three idle days it decays by a point a day, so a tone you nailed once and abandoned does not stay green forever.",
 h:"It makes the Weak Spots queue honest, and it reflects how motor skills actually behave — they degrade without contact."}
,
/* ===================================================================== */
/* DOMAIN 6 — HOW LISTENERS DECODE YOU                                   */
/* ===================================================================== */
{id:"r.fast",p:"perc",n:"How fast judgement happens",k:"number",v:"~500 ms",
 t:"Listeners form stable impressions of warmth, competence and trustworthiness from around half a second of speech — often a single word. Longer exposure mostly confirms rather than revises.",
 h:"It means your opening syllables are doing disproportionate work. It is also why the first line of any call is worth rehearsing more than the rest of it."},

{id:"r.dual",p:"perc",n:"Warmth and competence",k:"concept",
 t:"Two largely independent axes that account for most of social judgement. Warmth is read first and weighted more heavily. Competence is read second and revised more readily.",
 h:"Most people optimise only for competence and wonder why they are not trusted. The two axes have different vocal signatures, and the tone families here are built along both."},

{id:"r.cue.warm",p:"r.dual",n:"The warmth signature",k:"rule",
 t:"Slightly slower rate, a moderately wide pitch range, gentle falling terminals, breathier quality, and — the strongest single cue — a downward pitch glide at the end of a phrase rather than a flat landing.",
 h:"It is producible on demand. The warmth family in this app is these settings, named and separated so you can reach for them deliberately."},

{id:"r.cue.comp",p:"r.dual",n:"The competence signature",k:"rule",
 t:"Lower mean pitch, decisive falling terminals of 4 to 7 semitones, fewer filled pauses, faster rate, and steady intensity through to the final syllable.",
 h:"Note the overlap and the conflict with warmth: rate goes opposite ways. That tension is why 'just be confident' is useless advice and why specific tones exist instead."},

{id:"r.pitch.j",p:"perc",n:"What pitch signals",k:"rule",
 t:"Lower mean pitch is associated with perceived dominance, size and competence across cultures. Wider pitch variability independently predicts perceived engagement and likeability. Raised mean under stress signals arousal.",
 h:"These are separate findings, which is exactly why low-and-wide is the target combination and why moving both dials together defeats you."},

{id:"r.rate.j",p:"perc",n:"What rate signals",k:"rule",
 t:"Faster speakers are generally rated as more competent, more confident and — up to a point — more persuasive, partly because speed limits the listener's capacity to counter-argue.",
 h:"It is why the persuasive band sits above conversational rate. It also comes with an obvious ethical edge, which the app is explicit about."},

{id:"r.sil.j",p:"perc",n:"What silence signals",k:"rule",
 t:"A speaker who pauses before answering is rated as more thoughtful and more in control. A pause after a question transfers the obligation to speak onto the other person and holds it there.",
 h:"Silence is the single cheapest authority cue available. It costs nothing, needs no skill, and nearly everyone underuses it by hundreds of milliseconds."},

{id:"r.pfc",p:"perc",n:"Post-focus compression",k:"rule",v:"25-30 pp",
 t:"After the focused word, English speakers compress the pitch range and lower the intensity of everything that follows. Listeners use this as a strong cue to where the focus was — worth 25 to 30 percentage points in identification accuracy.",
 h:"It is the half of emphasis nobody teaches. Getting loud on the key word does little if you stay loud afterwards, because the contrast that marks it never appears."},

{id:"r.mono",p:"perc",n:"Why monotone fails",k:"concept",
 t:"Flat pitch removes the boundary and prominence cues a listener uses to parse structure. They have to do the segmentation work themselves, comprehension effort rises, and attention degrades within about a minute.",
 h:"Monotone is not boring because it is unpleasant. It is boring because it is genuinely harder to follow — which is why fixing it improves how much of your content actually lands."},

{id:"r.mism",p:"perc",n:"Content-tone mismatch",k:"rule",
 t:"When words and delivery disagree, listeners weight the delivery. A reassuring sentence in a tight, fast, high voice is decoded as concealment, not reassurance.",
 h:"It is why scripting alone never fixes a call. The tone is the message; the words are a delivery vehicle for it."},

{id:"r.chan",p:"perc",n:"The channel changes the physics",k:"concept",
 t:"Phone lines band-limit to roughly 300 to 3400 Hz, removing the low end that carries authority and the high end that carries /s/ clarity. Video compression adds delay that breaks turn-taking timing.",
 h:"The same delivery is not the same delivery on a phone. It is why pace and pause targets shift by channel and why the Codex has a chapter on it."},

{id:"r.chan.ph",p:"r.chan",n:"On the phone",k:"rule",
 t:"Your fundamental may be partly filtered out, so perceived pitch leans on harmonics. Sibilant clarity drops. There is no visual channel, so all turn-taking runs through timing alone.",
 h:"Practically: slow slightly, widen pitch range to compensate for the lost low end, over-articulate fricatives, and lengthen pauses because the other person has fewer cues about when you are done."},

{id:"r.emo",p:"perc",n:"Vocal emotion is measurable",k:"concept",
 t:"Discrete emotions have reasonably consistent acoustic profiles. Anger: high intensity, fast, wide range, sharp onsets. Sadness: low intensity, slow, narrow range, falling contours. Fear: high mean pitch, fast, irregular.",
 h:"It means emotional delivery is a set of dials rather than a state you have to genuinely feel. That is the entire basis of the colour-wheel tone family."},

/* ===================================================================== */
/* DOMAIN 7 — EMPHASIS & MEANING                                         */
/* ===================================================================== */
{id:"m.nuc",p:"emph",n:"The nucleus",k:"concept",
 t:"Every intonation phrase has exactly one most-prominent syllable — the nucleus. It carries the main pitch movement, and everything before and after it is arranged around it.",
 h:"Choosing the nucleus deliberately is the whole of emphasis. One decision per phrase, and it changes what the sentence claims."},

{id:"m.nsr",p:"emph",n:"The Nuclear Stress Rule",k:"rule",
 t:"By default, English puts the nucleus on the last lexical word of the phrase — the last noun, verb, adjective or adverb, skipping function words like prepositions and articles.",
 h:"It is the baseline the app assumes when it finds your nucleus. Knowing the default is what lets you break it on purpose rather than by accident."},

{id:"m.new",p:"emph",n:"Given versus new",k:"rule",
 t:"Information already in play gets deaccented; new information gets the nucleus. Say 'I bought a CAR', then 'the car was EXPENSIVE' — car has been demoted because it is now given.",
 h:"Failing to deaccent given information is the most common thing that makes a fluent speaker sound like they are reading. It is also instantly fixable once you can hear it."},

{id:"m.con",p:"emph",n:"Contrastive focus",k:"rule",
 t:"Stress moved off the default position to set up a contrast. 'I didn't say HE stole it' implies someone else did. It usually carries a low onglide — a dip before the accented syllable — which is a distinct acoustic signature.",
 h:"Contrastive stress is how you answer an objection without stating it. It is the highest-value emphasis move in a sales conversation and the one that most rewards drilling."},

{id:"m.onglide",p:"m.con",n:"The low onglide",k:"concept",
 t:"Before a contrastively focused word, pitch dips below the surrounding line and then jumps up onto the accented syllable. The dip makes the rise bigger without needing more absolute height.",
 h:"It is why some people's emphasis lands and others' just sounds loud. You get the same prominence for less effort by going down first."},

{id:"m.wide",p:"emph",n:"Broad versus narrow focus",k:"concept",
 t:"Broad focus presents the whole phrase as new — the nucleus falls in the default place. Narrow focus highlights one element and deaccents the rest, marking everything else as already agreed.",
 h:"Narrow focus is an assumption smuggled into delivery. Used carefully it moves a conversation forward; used carelessly it sounds like you did not listen."},

{id:"m.func",p:"emph",n:"Function words",k:"rule",
 t:"Articles, prepositions, auxiliaries and pronouns are normally unstressed and vowel-reduced to a schwa. Stressing one is marked, and always means something specific.",
 h:"'I can do that' versus 'I CAN do that' — the second answers a doubt nobody voiced. Knowing that function-word stress is always marked stops you doing it by accident."},

{id:"m.list",p:"emph",n:"List intonation",k:"rule",
 t:"Items in a list take rising or level terminals, and only the final item takes the fall. The fall is what tells the listener the list is finished.",
 h:"Falling on every item makes each one sound like the last, and the listener keeps thinking you are done. This is one of the most common structural delivery faults."},

{id:"m.par",p:"emph",n:"Parenthetical compression",k:"rule",
 t:"Asides and qualifiers are delivered faster, quieter and in a compressed pitch range, then the main line resumes at its previous level.",
 h:"It lets you include a caveat without giving it weight. Delivered at full prominence, the same caveat reads as the real message."},

{id:"m.chunk",p:"emph",n:"Chunking",k:"concept",
 t:"Speech is delivered in intonation phrases of roughly 5 to 9 words, each with its own contour and nucleus. Boundaries fall at syntactic joints and are marked by pause, final lengthening and pitch reset.",
 h:"Chunk badly and even correct emphasis will not save the sentence. It is the structure the emphasis sits inside."},

/* ===================================================================== */
/* DOMAIN 9 — INFLUENCE & PSYCHOLOGY                                     */
/* ===================================================================== */
{id:"i.status",p:"psych",n:"Status",k:"concept",
 t:"The relative position two people implicitly agree to occupy. Communicated far more by behaviour under pressure — reaction speed, willingness to pause, tolerance of silence — than by anything claimed out loud.",
 h:"Status is negotiated in the first minute and mostly through delivery. If it settles wrong, the content of what you say afterwards matters much less than you would like."},

{id:"i.status.re",p:"i.status",n:"Reactivity",k:"rule",
 t:"The lower-status party in an exchange answers faster, fills silences, matches the other's energy upward, and explains more than was asked.",
 h:"It gives you one concrete lever: slow your response by half a second and stop explaining unasked. That single change moves the perception more than a script rewrite."},

{id:"i.frame",p:"psych",n:"Frame",k:"concept",
 t:"The unstated definition of what a conversation is. Whoever's definition survives sets what counts as a reasonable question, a good outcome, and a fair price.",
 h:"Most conversations are lost at the frame, before any argument happens. Recognising the frame you have been handed is the first move."},

{id:"i.frame.hold",p:"i.frame",n:"Holding a frame",k:"rule",
 t:"You hold a frame by continuing to act as though it is true, not by arguing for it. Arguing concedes that it is up for debate. Delivery does most of the work — calm rate, level terminals, no rush to fill silence.",
 h:"It explains why the quiet, unhurried tones are frame tools rather than mood settings. The tone is the argument."},

{id:"i.recip",p:"psych",n:"Reciprocity",k:"principle",
 t:"People feel obliged to return what they have been given, including concessions. A first request that gets refused makes a smaller second request more likely to succeed.",
 h:"It works and it is easy to abuse. Used honestly it means give first and genuinely; used dishonestly it is a manufactured debt, and people notice eventually."},

{id:"i.commit",p:"psych",n:"Commitment and consistency",k:"principle",
 t:"Once someone has stated a position, especially aloud and voluntarily, they work to stay consistent with it. Small stated commitments predict larger later ones.",
 h:"It is why asking someone to articulate their own problem outperforms describing it for them — and it is the mechanism behind the question-led tone families."},

{id:"i.social",p:"psych",n:"Social proof",k:"principle",
 t:"Under uncertainty, people copy similar others. Similarity matters more than volume — one comparable case beats a large but irrelevant number.",
 h:"Specificity is doing the work. A named, similar example lands where 'thousands of customers' does not."},

{id:"i.loss",p:"psych",n:"Loss aversion",k:"principle",
 t:"Losses weigh roughly twice as heavily as equivalent gains. The same fact framed as something forfeited is more motivating than the same thing framed as something gained.",
 h:"It is powerful and it is where manufactured urgency comes from. The honest version describes a real cost already being paid; the dishonest version invents a deadline."},

{id:"i.anchor",p:"psych",n:"Anchoring",k:"principle",
 t:"The first number in play distorts every judgement after it, even when it is obviously arbitrary and even when people are warned about it.",
 h:"Practically: notice who anchored, and notice that arguing against an anchor still operates inside it. Re-anchoring beats negotiating."},

{id:"i.scarce",p:"psych",n:"Scarcity",k:"principle",
 t:"Perceived limits on availability raise valuation. Genuine scarcity is informative — it tells you something true about supply. Manufactured scarcity is a lie with a short half-life.",
 h:"The distinction is the whole ethical question in miniature. One of them survives the customer finding out."},

{id:"i.auth",p:"psych",n:"Authority",k:"principle",
 t:"Signals of expertise shift compliance sharply, and the signals are often superficial — titles, confidence of delivery, specificity of detail — rather than actual competence.",
 h:"Two uses: earn the real thing, and stay aware that a confident delivery is being read as evidence when it is not evidence at all. That applies to you too."},

{id:"i.eth",p:"psych",n:"Where the line is",k:"rule",
 t:"A workable test: would this still work if the other person could see exactly what you were doing and why? Clarity survives that test. Manufactured urgency, false scarcity and engineered obligation do not.",
 h:"Everything in this domain is dual-use. The test is the thing that decides which use you are making of it, and it is worth applying deliberately rather than by feel."},

{id:"i.counter",p:"psych",n:"Counter-moves",k:"concept",
 t:"Every principle here has a defence. Name the technique silently, delay the decision, ask what changes if you wait, and check whether the number in play was one you brought.",
 h:"You are also on the receiving end of all of this. Learning it as a defence is at least as valuable as learning it as a tool."},

/* ===================================================================== */
/* DOMAIN 10 — LEARNING & PRACTICE                                       */
/* ===================================================================== */
{id:"l.motor",p:"learn",n:"This is a motor skill",k:"concept",
 t:"Speech production is fine motor control on a very short timescale. It obeys motor-learning rules, not knowledge-acquisition rules — which is why understanding a tone perfectly does not let you produce it.",
 h:"It sets your expectations correctly. Reps, not insight, and the gap between knowing and doing is normal rather than a sign you are failing."},

{id:"l.var",p:"learn",n:"Variable practice",k:"rule",
 t:"Practising a skill across varied contexts produces worse performance during practice and markedly better retention and transfer than drilling one fixed version.",
 h:"It is why Tone Roulette and Cold Read exist and why they feel worse than block practice. The discomfort is the mechanism, not a bug."},

{id:"l.space",p:"learn",n:"Spacing",k:"rule",
 t:"The same total practice spread across more sessions beats it massed into fewer. The optimal gap scales with how long you need to retain it.",
 h:"Twenty minutes daily beats two hours weekly by a wide margin. The streak counter and the 90-day path are built on this rather than on motivation."},

{id:"l.inter",p:"learn",n:"Interleaving",k:"rule",
 t:"Mixing several skills within a session outperforms completing one before starting the next, because each switch forces retrieval of the whole motor plan rather than a repeat of the last one.",
 h:"It is why the daily session mixes drill types instead of running one to exhaustion, and why the Gauntlet moves between modes."},

{id:"l.fb",p:"learn",n:"Feedback timing",k:"rule",
 t:"Immediate feedback on every attempt improves practice performance but can impair learning — the learner starts depending on it. Slightly delayed, or summary feedback across a set, retains better.",
 h:"It is why scores appear after the rep rather than live, and why the live numbers readout is a setting you can turn off."},

{id:"l.desire",p:"learn",n:"Desirable difficulty",k:"concept",
 t:"Conditions that slow visible progress often improve durable learning. Fluency during practice is a poor predictor of retention, and frequently an inverse one.",
 h:"If a session feels smooth and your scores are all high, you have probably stopped learning. That is the moment to turn on Hard mode."},

{id:"l.retr",p:"learn",n:"Retrieval over review",k:"rule",
 t:"Producing something from memory strengthens it far more than re-reading it. In a motor domain, attempting the tone beats studying the tone by a wide margin.",
 h:"It is why the Codex is deliberately smaller than the drill set. Read a little, attempt a lot."},

{id:"l.sr",p:"learn",n:"Spaced repetition",k:"method",
 t:"Items are resurfaced as they approach being forgotten. The Weak Spots queue ranks tones by mastery, staleness and whether you have ever attempted them, then serves the worst first.",
 h:"It stops you practising what you already like. Left alone, everyone drills their best tone and avoids their worst — which is exactly backwards."},

{id:"l.plat",p:"learn",n:"Plateaus",k:"concept",
 t:"Motor learning is stepped, not linear. Long flat stretches with no visible gain often precede a jump, as the underlying control is reorganising without producing a measurable output change yet.",
 h:"Most people quit inside a plateau. Knowing they are structural rather than a verdict on you is worth more than any single drill."},

{id:"l.transfer",p:"learn",n:"Transfer to real conversation",k:"concept",
 t:"Skill trained in isolation transfers poorly until it is practised under load — unseen material, time pressure, and no chance to prepare. The gap between drill and live conversation is the last mile.",
 h:"It is why Cold Read and the Gauntlet exist. If everything you practise is rehearsed, none of it will survive a real call."},

{id:"l.aware",p:"learn",n:"You cannot hear yourself",k:"concept",
 t:"Bone conduction means your own voice reaches you differently than it reaches anyone else, and you are hearing your intention as much as your output. Self-assessment of prosody is unreliable in both directions.",
 h:"It is the entire justification for measuring instead of asking. The Ear Training drill exists specifically to close the gap between what you meant and what you produced."}
,
/* ===================================================================== */
/* DOMAIN 8 — THE TONE SYSTEM (authored anchors; families & tones are    */
/* expanded from the live TONES data at build time)                      */
/* ===================================================================== */
{id:"t.what",p:"tone",n:"What a tone actually is here",k:"concept",
 t:"Not a mood. A tone in this app is a reproducible setting of the four prosodic dials, with a measurable acoustic target, a physical cue that produces it reliably, the way it fails when overdone, and the correction.",
 h:"Defining it that way is what makes it trainable. You do not have to feel warm to produce the warmth signature — you have to hit the numbers."},

{id:"t.cue",p:"tone",n:"Why each tone has a physical cue",k:"method",
 t:"Instructions like 'sound more confident' do not reach the motor system. Instructions like 'you are a doctor taking a history' do, because they recruit a whole posture at once rather than five separate parameters.",
 h:"When you cannot hit a target by aiming at the numbers, use the cue instead. It is usually faster, and it is why every tone carries one."},

{id:"t.over",p:"tone",n:"Every tone has an overdone version",k:"concept",
 t:"Push any tone past its band and it inverts. Authority becomes aggression. Warmth becomes condescension. Certainty becomes arrogance. The overdone version is usually worse than not attempting the tone at all.",
 h:"It is why the app scores distance from a band rather than more-is-better, and why every tone in the library names its own failure mode and antidote."},

{id:"t.fams",p:"tone",n:"The ten families",k:"anchor",
 t:"Tones are grouped by what they are for: the core emotional intents, authority, warmth, pressure, curiosity, two named sales systems reconstructed as measurable patterns, an emotional colour wheel, broadcast tones, and a lab of deliberate defects.",
 h:"Families give you a place to start. When you know the moment but not the tone, pick the family first and the shortlist is suddenly five options instead of seventy-two."},

{id:"t.defect",p:"tone",n:"Why defects are a family",k:"concept",
 t:"Uptalk, monotone, trailing off, hedging and fry are in the tone library as things to produce on purpose, with targets, like any other tone.",
 h:"You cannot reliably stop doing something you cannot hear yourself doing. Producing a defect deliberately is the fastest way to gain the ability to detect it."},

/* --- articulation library anchor ------------------------------------- */
{id:"a.racks",p:"artic",n:"The twister racks",k:"anchor",
 t:"Twelve categories, 230 lines, each tagged with the phonemes it targets and the phonetic reason it is hard. Traditional folk material where it is the best available, originals where the classics leave a gap.",
 h:"Browsing by the sound you actually struggle with beats working through a list alphabetically. Every line here tells you what it is training and why it defeats people."},

/* --- codex anchor ----------------------------------------------------- */
{id:"cdx",p:"root",n:"The Codex",k:"anchor",
 t:"Nine written chapters that sit behind the drills — the parameters, the emphasis ruleset, the terminal map, the pause taxonomy, the defect catalogue, the practice protocol, the channel physics, and the ethics.",
 h:"The map you are looking at is the structure. The Codex is the prose version of the same material, for when you want it in paragraphs rather than nodes."},

/* --- advisor anchors --------------------------------------------------- */
{id:"adv",p:"eng",n:"The Custom Prompt advisor",k:"anchor",
 t:"A rules engine, not a language model. You give it the stage of the conversation and the line you are about to say; it scores every tone against stage priors, phrasing triggers found in your text, and modifiers, then explains its reasoning.",
 h:"Because it is rules rather than a black box, it can show you its whole argument — which trigger fired, which prior it started from, and what it nearly picked instead."},

{id:"adv.stage",p:"adv",n:"Stage priors",k:"anchor",
 t:"Fifteen recognised stages of a conversation, each carrying a prior distribution over tones. Opening a call and handling a price objection start from very different places before a single word is analysed.",
 h:"It is the largest single input to the recommendation. Telling the app where you are in the call is most of what makes the answer good."},

{id:"adv.mod",p:"adv",n:"Modifiers",k:"anchor",
 t:"Eleven contextual switches — the channel, how warm the relationship is, how much time is left, whether they are guarded — each pushing some tones up and others down, and some able to veto a tone outright.",
 h:"They are what stop the advisor giving the same answer to a cold phone call and a warm in-person meeting at the same stage."},

{id:"adv.trig",p:"adv",n:"Phrasing triggers",k:"anchor",
 t:"About thirty patterns matched against the actual words you typed. Asking permission, delivering a number, softening, challenging, closing — each shifts the weights and records why it fired.",
 h:"This is why the advisor can point at the exact phrase that made it choose. It also means rewording your line changes the recommendation, which is worth experimenting with."},

{id:"adv.nuc",p:"adv",n:"Nucleus finding",k:"method",
 t:"The advisor applies the Nuclear Stress Rule to your line — strip function words, take the last lexical item — then overrides it when a contrast trigger or a number is present, because those attract focus.",
 h:"It is what lets it tell you which single word to hit, not just which tone to use. That is usually the more actionable half of the answer."},

/* --- emphasis library anchors ------------------------------------------ */
{id:"m.lib",p:"emph",n:"The emphasis sentences",k:"anchor",
 t:"Twenty-five sentences where the stress moves word by word, each position labelled with the meaning it produces. The same words, a different claim each time.",
 h:"Reading about contrastive focus does very little. Saying one sentence nine ways and hearing the meaning change each time does almost all of the work."},

{id:"m.rules",p:"emph",n:"The focus ruleset",k:"anchor",
 t:"Twelve rules covering which word takes the nucleus in a given structure, with a wrong version and a right version for each.",
 h:"When you are unsure where the stress goes in a sentence you have written, this is the lookup table."},

{id:"m.cont",p:"emph",n:"The contour library",k:"anchor",
 t:"Twelve named pitch shapes — the shapes themselves, drawn as target lines you trace with your voice while the app overlays what you actually produced.",
 h:"Contours are hard to describe and easy to imitate. Seeing your line against the target closes the gap faster than any verbal instruction."},

/* --- psychology library anchors ---------------------------------------- */
{id:"i.lib",p:"psych",n:"The principle library",k:"anchor",
 t:"Thirty-nine principles across six chapters — status, frame control, influence, decision biases, reading the room, and self-command. Each paired with the tone that delivers it, how it fails, and the counter-move.",
 h:"Pairing each principle with a tone is the point. A principle you cannot deliver is a fact; a principle with a tone attached is a move."},

{id:"i.inf",p:"psych",n:"The influence reference",k:"anchor",
 t:"Twelve influence techniques, each with its legitimate use and its abuse stated side by side.",
 h:"Listing the abuse next to the use is deliberate. It is the fastest way to notice when one is being run on you."},

{id:"i.frames",p:"psych",n:"The frame rack",k:"anchor",
 t:"Ten common frames you will be handed in a conversation, what each one assumes, a line that re-frames it, and the tone that line needs.",
 h:"Frames arrive fast and get accepted by default. Having ten of them pre-labelled means you recognise one while there is still time to decline it."},

/* --- drill anchor ------------------------------------------------------ */
{id:"l.drills",p:"learn",n:"The drill set",k:"anchor",
 t:"Twenty modes, each isolating one thing. Some measure a single parameter, some combine several under load, and two exist purely to make you produce faults on purpose.",
 h:"Knowing what each drill isolates lets you pick by symptom instead of by mood. That is the difference between training and just using the app."}
,
/* ===================================================================== */
/* SECOND AUTHORED LAYER — deeper mechanism under every domain           */
/* ===================================================================== */

/* --- voice: acoustics of the source ---------------------------------- */
{id:"v.src.harm",p:"v.src",n:"Harmonics",k:"concept",
 t:"The folds do not produce a pure tone. They produce a fundamental plus a stack of whole-number multiples above it — the harmonic series. A 110 Hz voice is also generating 220, 330, 440 and upward.",
 h:"It is why you still hear a deep voice on a phone line that cuts everything below 300 Hz. The fundamental is filtered out and your ear reconstructs it from the harmonics."},

{id:"v.src.tilt",p:"v.src",n:"Spectral tilt",k:"number",
 t:"How fast harmonic energy falls off as you go up. A pressed, energetic voice has a shallow tilt with lots of high-harmonic energy. A breathy or tired voice drops away steeply.",
 h:"It is most of what people mean by a voice sounding bright or dull, and it moves with effort level — which is why you can hear fatigue in someone before they mention it."},

{id:"v.src.jit",p:"v.src",n:"Jitter and shimmer",k:"number",v:"<1% / <3%",
 t:"Cycle-to-cycle variation in period (jitter) and in amplitude (shimmer). Healthy sustained phonation runs under about 1% jitter and 3% shimmer. Elevated values indicate irregular fold vibration.",
 h:"The app uses the same idea to detect vocal fry — high period irregularity at low frequency. It is also a rough proxy for how tired your voice is today."},

{id:"v.src.hnr",p:"v.src",n:"Harmonic-to-noise ratio",k:"number",
 t:"How much of the signal is periodic versus turbulent noise. A clear modal voice runs high; breathiness lowers it because escaping air adds broadband noise between the harmonics.",
 h:"This is the measurable version of 'clear' versus 'breathy'. It gives you a dial for intimacy that is independent of volume and pitch."},

{id:"v.filt.lar",p:"v.filt",n:"Laryngeal height",k:"concept",
 t:"The larynx rides up under tension and drops when relaxed or yawning. Raising it shortens the tract, pushing all formants up and thinning the sound. Lowering it lengthens the tract and darkens it.",
 h:"It is the single biggest lever on perceived authority that is not pitch. The yawn-sigh gets you there in three seconds and you can feel it move."},

{id:"v.filt.jaw",p:"v.filt",n:"Jaw tension",k:"defect",
 t:"A clenched jaw restricts mouth opening, which compresses F1 and collapses the difference between open and close vowels. The result is a muffled, effortful sound with correct consonants.",
 h:"If people ask you to repeat yourself despite crisp articulation, check the jaw before anything else. It is the most common cause and the easiest fix."},

{id:"v.filt.twang",p:"v.filt",n:"Twang",k:"concept",
 t:"Narrowing the aryepiglottic sphincter — a small ring just above the folds — creates a strong resonance around 3 kHz. It adds carrying power with very little extra effort or air.",
 h:"It is how stage performers stay audible for two hours. In speech it is the difference between being heard across a table and having to raise your voice."},

/* --- prosody: deeper ------------------------------------------------- */
{id:"p.pitch.reset",p:"p.pitch",n:"Pitch reset",k:"rule",
 t:"At a major boundary — a new topic, a new paragraph of thought — speakers jump back up to near their starting pitch. It is one of the strongest structural cues a listener has.",
 h:"Without it, everything you say sounds like one continuous sentence. Resetting deliberately is how you signal 'new point' without saying so."},

{id:"p.pitch.key",p:"p.pitch",n:"Key",k:"concept",
 t:"The overall pitch level a whole stretch is delivered in, independent of the movement within it. High key signals a new or contrastive topic; low key signals an aside or something already agreed.",
 h:"It gives you a way to mark importance across a whole passage rather than one word. Dropping key on a caveat is how you include it without giving it weight."},

{id:"p.time.final",p:"p.time",n:"Final lengthening",k:"rule",
 t:"The last syllable before a boundary is physically stretched, often by 30% or more. It happens automatically in fluent speech and its absence is one of the things that makes reading aloud sound like reading.",
 h:"If your delivery sounds flat despite good pitch movement, this is often the missing cue. Stretching the last syllable of a phrase costs nothing and instantly sounds more natural."},

{id:"p.time.turn",p:"p.time",n:"Turn-taking timing",k:"number",v:"~200 ms",
 t:"Gaps between conversational turns average around 200 milliseconds across languages — faster than a simple reaction, which means listeners predict the end of your sentence rather than react to it.",
 h:"It explains why interruptions happen and why video delay wrecks conversation. It also means your terminal contour is a signal others are actively predicting from."},

{id:"p.time.back",p:"p.time",n:"Backchannels",k:"concept",
 t:"The mm-hm, right, yeah that a listener produces without taking the floor. Their absence is read as disengagement or disagreement within seconds, especially on a call with no video.",
 h:"On the phone, silence from you reads as a problem. A short backchannel every few seconds is doing real work that costs you nothing."},

{id:"p.loud.rms",p:"p.loud",n:"Why dB, and why relative",k:"method",
 t:"Loudness is measured as RMS energy converted to decibels — a logarithmic scale, because perception is logarithmic. All values here are relative to your own utterance, never absolute.",
 h:"Absolute level would just measure how close you sat to the microphone. Relative measurement means you can be scored fairly on any hardware in any room."},

{id:"p.loud.jnd",p:"p.loud",n:"Just-noticeable difference",k:"number",v:"~1 dB",
 t:"Listeners can detect roughly a 1 dB change in level under good conditions, and about a 3 dB change is needed for it to be reliably heard as emphasis in running speech.",
 h:"It tells you how small an increment is wasted. Anything under about 3 dB is not landing as emphasis, however deliberate it felt."},

{id:"p.qual.res",p:"p.qual",n:"Forward placement",k:"concept",
 t:"The sensation of vibration in the lips, teeth and the front of the face during voiced sound. Not a real change in where sound is made — it is a proprioceptive cue that reliably correlates with efficient resonance.",
 h:"It is a bad physics description and an excellent instruction. Chasing the buzz produces the right configuration far more reliably than describing the configuration does."},

/* --- articulation: deeper --------------------------------------------- */
{id:"a.coart",p:"artic",n:"Coarticulation",k:"concept",
 t:"Speech sounds are not produced in sequence — they overlap. Your tongue is already moving toward the next vowel while the current consonant is still being made, and the consonant is coloured by it.",
 h:"It is why isolated sounds drilled alone transfer poorly. Twisters work because they train transitions, which is where the actual difficulty lives."},

{id:"a.assim",p:"artic",n:"Assimilation",k:"rule",
 t:"Neighbouring sounds become more alike. 'Ten pounds' comes out as 'tem pounds' because /n/ borrows the lip closure of the following /p/. Completely normal and native.",
 h:"Knowing this is normal stops you over-correcting into stilted, unnaturally precise speech — which reads as worse, not better."},

{id:"a.elis",p:"artic",n:"Elision",k:"rule",
 t:"Sounds dropping entirely in connected speech, especially in clusters. 'Next day' loses its /t/. Native speakers do this constantly and hear the full form as pedantic.",
 h:"The goal of articulation training is not to stop eliding. It is to have the choice — to be able to restore a sound when the line needs it."},

{id:"a.link",p:"artic",n:"Linking",k:"rule",
 t:"Word-final consonants attach to a following vowel, so 'an apple' becomes 'a napple'. In non-rhotic accents an /r/ appears between vowels that never existed in the spelling.",
 h:"Absent linking is one of the strongest markers of a non-native or a read-aloud delivery. Practising it deliberately smooths a delivery more than slowing down does."},

{id:"a.asp",p:"artic",n:"Aspiration",k:"concept",
 t:"The puff of air after voiceless stops at the start of a stressed syllable — the difference you can feel on a hand between 'pin' and 'spin'. It disappears after /s/.",
 h:"It is why the /sp/ versus /p/ contrast is genuinely hard: English speakers produce it unconsciously and cannot easily switch it on and off deliberately."},

{id:"a.syll",p:"artic",n:"Syllable structure",k:"concept",
 t:"Onset, nucleus, coda. English permits up to three consonants in the onset and four in the coda, which is unusually generous and is where its clusters come from.",
 h:"It tells you which part of a hard word to attack. Most cluster failures are coda failures, and codas are the part people practise least."},

{id:"a.sched",p:"artic",n:"How to run a twister",k:"method",
 t:"Slowly and perfectly three times, then step the metronome up one rung. Any slip drops you back a rung. Speed built on a wrong motor pattern encodes the mistake.",
 h:"It is the protocol the Articulation Gym enforces with its speed ladder, and it is why the ladder refuses to advance you on a flawed rep."},

/* --- engine: deeper --------------------------------------------------- */
{id:"e.chain.win",p:"e.chain",n:"The window trade-off",k:"rule",
 t:"A longer analysis window gives better frequency resolution and worse time resolution; a shorter one does the reverse. You cannot have both — it is a hard mathematical limit, not an engineering one.",
 h:"It is why pitch is reported a few times per syllable rather than continuously, and why very fast pitch movements are smoothed slightly no matter how good the tracker is."},

{id:"e.chain.lat",p:"e.chain",n:"Latency",k:"number",
 t:"Between the microphone and a number on screen there is buffering, analysis and drawing — typically tens of milliseconds. Small enough to feel live, large enough to matter for anything beat-locked.",
 h:"It is why live readouts are a coaching aid rather than a scoring mechanism, and why scores are computed on the finished recording instead."},

{id:"e.pitch.unv",p:"e.pitch",n:"Unvoiced frames",k:"rule",
 t:"Whole sounds — /s/, /f/, /t/, /k/ — have no fundamental at all. Roughly a quarter of a typical utterance has no measurable pitch, and reporting a number there would be inventing data.",
 h:"It is why pitch contours have gaps, and why span is computed only over voiced frames. A tracker that fills the gaps is lying to you."},

{id:"e.vad.hang",p:"e.vad",n:"Hangover",k:"method",
 t:"Voice detection holds on briefly after energy drops, so a quiet unvoiced tail is not chopped off and a fast breath mid-phrase is not counted as a pause.",
 h:"Without it every /s/ at the end of a word would register as a silence, and your pause statistics would be nonsense."},

{id:"e.seg.syl",p:"e.seg",n:"Estimating syllables",k:"method",
 t:"Syllable count is estimated from peaks in the smoothed intensity envelope, since each syllable carries an energy peak around its vowel. Accurate to within a few percent over a sentence.",
 h:"It is what makes syllables-per-second available without speech recognition — no transcript, no words leaving the browser, and still an honest rate measure."},

{id:"e.stat.rob",p:"e.stat",n:"Robust statistics",k:"rule",
 t:"Medians and percentiles throughout instead of means and extremes, because speech data is full of legitimate outliers — one creaky syllable should not define your register.",
 h:"It is the difference between a score that reflects your delivery and one that reflects a single glitch in the middle of it."},

/* --- scoring: deeper --------------------------------------------------- */
{id:"s.weight",p:"score",n:"How the five parts are weighted",k:"rule",
 t:"Not equally. Terminal and pitch span carry the most weight because they carry the most perceptual consequence. Pause and dynamics matter but move a listener less per unit of error.",
 h:"It tells you where to spend effort. Fixing a flat terminal moves your score and your effect on people more than shaving ten words per minute off your pace."},

{id:"s.hard",p:"score",n:"What Hard mode changes",k:"rule",
 t:"Narrows every band, and removes partial credit on terminals so a fall under 3 semitones scores zero rather than a fraction. Nothing else changes.",
 h:"Turn it on when you are consistently above 80. Scores that stop moving have stopped being feedback."},

{id:"s.first",p:"score",n:"Why the first score is often high",k:"concept",
 t:"Reading a prepared line into a microphone with no listener is the easiest possible condition. Real conversation adds cognitive load, and load is where prosody degrades first.",
 h:"Do not trust an early high score. It is why Cold Read and the Gauntlet exist and why the 90-day path pushes toward unprepared material."},

{id:"s.rep",p:"score",n:"What one rep records",k:"concept",
 t:"Tone, drill, score, and the acoustic numbers behind it — pace, span, terminal, dynamics, pause. Plus whether personal targets were on, so a personalised score is never silently compared with a standard one.",
 h:"That last flag is what stops the team dashboard being quietly wrong when one person has Personal Mode enabled."},

/* --- perception: deeper ------------------------------------------------ */
{id:"r.entrain",p:"perc",n:"Prosodic entrainment",k:"concept",
 t:"Conversation partners converge on each other's rate, pitch range and loudness within a few turns. Greater convergence predicts higher rapport and better task outcomes.",
 h:"It works in both directions, which makes it a tool: change your own rate deliberately and the other person tends to follow within about thirty seconds."},

{id:"r.entrain.use",p:"r.entrain",n:"Matching then leading",k:"method",
 t:"Match the other person's rate and energy for a short stretch, then move deliberately toward where you want the conversation to sit. Convergence pulls them with you.",
 h:"It is the most reliable way to slow down someone who is agitated. Telling them to calm down does not work; arriving there slowly in front of them usually does."},

{id:"r.first",p:"perc",n:"The primacy of the opening",k:"rule",
 t:"Impressions formed early bias the interpretation of everything after them. Later evidence is read through the frame the first few seconds established rather than weighed independently.",
 h:"It is the argument for rehearsing your first line specifically, rather than treating a call as uniformly important throughout."},

{id:"r.fluent",p:"perc",n:"Processing fluency",k:"concept",
 t:"Information that is easier to process is judged as more true, more familiar and more likeable — independent of content. Clear delivery is read as credible delivery.",
 h:"It means articulation and pacing are not cosmetic. They change how believable identical words are, which is uncomfortable but worth knowing."},

{id:"r.arous",p:"perc",n:"Arousal versus valence",k:"concept",
 t:"Vocal cues separate how activated someone is much better than whether the emotion is positive or negative. Excitement and anger look similar acoustically; context does the disambiguating.",
 h:"It is why enthusiasm can be misread as pressure on a cold call. Adding warmth cues is what resolves the ambiguity in the listener's favour."},

{id:"r.smile",p:"perc",n:"The audible smile",k:"concept",
 t:"Smiling shortens the vocal tract by spreading the lips, raising formants measurably. Listeners detect it on audio alone at well above chance.",
 h:"On the phone it is a real acoustic change, not a motivational poster. It is the cheapest warmth cue available and it needs no skill."},

/* --- emphasis: deeper --------------------------------------------------- */
{id:"m.tag",p:"emph",n:"Tag questions",k:"rule",
 t:"A falling tag asks for agreement you assume you have. A rising tag genuinely asks. The same words do opposite jobs depending only on the terminal.",
 h:"It is the cleanest demonstration that terminal contour carries meaning independently of words, and it is directly usable in a close."},

{id:"m.wh",p:"emph",n:"Question contours",k:"rule",
 t:"Wh-questions in English typically fall. Yes-no questions typically rise. Rising on a wh-question softens it toward tentative or checking; falling on a yes-no question makes it read as a demand.",
 h:"Most people rise on everything with a question mark. Choosing the contour separately from the punctuation is a large, immediate change in how questions land."},

{id:"m.echo",p:"emph",n:"Echo questions",k:"rule",
 t:"Repeating the other person's own word with a rising contour and nothing else. It requests elaboration without asking a question, and it deaccents everything you did not repeat.",
 h:"It is the highest-value low-effort probe there is. One word, one contour, and the other person keeps talking about exactly the thing you selected."},

{id:"m.neg",p:"emph",n:"Scope of negation",k:"rule",
 t:"Stress placement decides what a negative is actually denying. 'I don't think he LEFT' denies the leaving; 'I DON'T think he left' denies the thinking.",
 h:"Ambiguous negation is a common source of misunderstanding in objection handling. Stress is what disambiguates it, and most people leave it to chance."},

{id:"m.num",p:"emph",n:"Delivering a number",k:"rule",
 t:"Numbers attract focus automatically, so an unmarked number takes the nucleus whether you wanted it to or not. To de-emphasise a price, you must actively deaccent it and place the nucleus elsewhere.",
 h:"It is the concrete mechanism behind price delivery. The advisor overrides its default nucleus when it finds a number in your line for exactly this reason."},

/* --- psychology: deeper ------------------------------------------------- */
{id:"i.react",p:"psych",n:"Reactance",k:"principle",
 t:"When people feel their freedom to choose is being removed, they push back — often against their own interest. Pressure produces resistance roughly in proportion to how much pressure is applied.",
 h:"It is the mechanism that makes hard closing backfire. Explicitly restoring the choice — naming that they can say no — reliably reduces it."},

{id:"i.frame.eff",p:"psych",n:"The framing effect",k:"principle",
 t:"Logically identical options are chosen at different rates depending on wording. A 90% success rate and a 10% failure rate are the same fact and do not produce the same decision.",
 h:"Since one framing must be chosen, choosing deliberately is not manipulation by itself. Choosing a framing you would be embarrassed to have explained is."},

{id:"i.avail",p:"psych",n:"Availability",k:"principle",
 t:"People judge how likely something is by how easily an example comes to mind. Vivid, recent or emotionally charged cases dominate over base rates.",
 h:"It is why one specific story outperforms a statistic, and why the story should be true — because the same mechanism makes a false one memorable too."},

{id:"i.endow",p:"psych",n:"Endowment",k:"principle",
 t:"People value what they already possess more than an identical thing they do not. Ownership, even imagined or brief, raises valuation substantially.",
 h:"It is the honest engine behind trials and pilots. Get someone genuinely using something and their reference point moves on its own."},

{id:"i.sunk",p:"psych",n:"Sunk cost",k:"principle",
 t:"Past investment that cannot be recovered still drives decisions, even though rationally it should not. The more someone has put in, the harder it is for them to walk away.",
 h:"Notice it in yourself on a long deal. Exploiting it in others is one of the clearer ethical lines in this whole domain."},

{id:"i.ambig",p:"psych",n:"Ambiguity aversion",k:"principle",
 t:"People prefer known risks to unknown ones and will pay to remove uncertainty, often more than the uncertainty is actually worth.",
 h:"Most objections are ambiguity, not disagreement. Naming exactly what happens next is frequently the entire answer."},

{id:"i.mere",p:"psych",n:"Mere exposure",k:"principle",
 t:"Repeated exposure increases liking on its own, with no new information and often below awareness. It plateaus, and reverses if the exposure is irritating.",
 h:"It is the honest case for patient follow-up, and the reason the irritating version of follow-up actively destroys value rather than being neutral."},

{id:"i.self",p:"psych",n:"Self-command",k:"concept",
 t:"The capacity to not react — to let a silence run, to not answer the first question asked, to leave an insult unaddressed. Almost entirely a function of physiological arousal rather than character.",
 h:"It is trainable through the body, not through resolve. Slower breathing and a lower speaking register measurably lower arousal, and both are things you can do mid-sentence."},

{id:"i.read",p:"psych",n:"Reading the room",k:"concept",
 t:"Attending to what changed rather than what is there. A shift in someone's rate, a pause that got longer, a backchannel that stopped — deltas carry the information, not absolute states.",
 h:"It gives you something concrete to listen for instead of vague intuition, and the changes are usually audible several seconds before anything is said."},

/* --- learning: deeper --------------------------------------------------- */
{id:"l.mental",p:"learn",n:"Mental practice",k:"method",
 t:"Rehearsing a movement in imagination activates much of the same motor circuitry as performing it, and produces real if smaller gains. Most effective combined with physical practice, not instead of it.",
 h:"It means the ten minutes before a call are usable. Running the opening silently, hearing the tone you intend, is not nothing."},

{id:"l.self",p:"learn",n:"Self-modelling",k:"method",
 t:"Reviewing recordings of your own best attempts outperforms watching an expert, because the target stays inside your own range and the motor plan is already partly yours.",
 h:"It is why the app plays your own recordings back rather than showing you a professional. Your best rep is a more useful model than someone else's."},

{id:"l.sleep",p:"learn",n:"Consolidation",k:"concept",
 t:"Motor skills continue to improve for hours after practice stops, with sleep playing a substantial role. Performance the next day is often better than at the end of the session that produced it.",
 h:"It means ending a session while it is still going well is not quitting early. It also means one daily session beats one weekly marathon for reasons beyond willpower."},

{id:"l.block",p:"learn",n:"Blocked practice has a place",k:"rule",
 t:"Repeating one thing is better for acquiring a brand-new pattern; varied practice is better for retaining and transferring one you already roughly have. The correct order is blocked first, then varied.",
 h:"It tells you when to drill one tone repeatedly and when to switch to Roulette. Doing them in the wrong order wastes both."},

{id:"l.ceil",p:"learn",n:"Where the ceiling actually is",k:"concept",
 t:"Fold length, tract length and resonance capacity are fixed. Range, control, consistency, articulation and timing are not, and they account for the overwhelming majority of the difference between speakers.",
 h:"Almost nobody is near their ceiling. The limit people run into is nearly always practice structure, not anatomy."},

{id:"l.noticing",p:"learn",n:"Noticing is the bottleneck",k:"concept",
 t:"You cannot correct what you cannot perceive. In prosody the perceptual skill usually lags the productive one — people produce a correct terminal before they can reliably hear whether they did.",
 h:"It is the whole reason for measurement and for Ear Training. The numbers are a prosthetic for a perception you have not built yet."}
];
</script>
