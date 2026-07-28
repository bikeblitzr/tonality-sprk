<script>
/* ============================================================
   ARTICULATION GYM — tongue twisters & warmups
   Traditional folk material plus originals written for this app.
   d = difficulty 1-5 · tg = target phonemes · why = the phonetic reason it's hard
   ============================================================ */
'use strict';

var TWISTER_CATS = {
  warmup:  {name:'The Warmup Rack',      c:'var(--ok)',  blurb:'What every actor and broadcaster runs before they speak. Six minutes, in order. These are not tongue twisters — they are calibration. Do them before every session in this app.'},
  sib:     {name:'Sibilants  /s/ /ʃ/ /z/',c:'var(--cy)', blurb:'The hardest family in English, because /s/ and /ʃ/ differ only in tongue-blade position by a few millimetres. A lisp, a whistle, or a hiss lives here. So does most microphone unpleasantness.'},
  plos:    {name:'Plosives  /p/ /b/ /t/ /d/ /k/ /g/',c:'var(--acc)', blurb:'Stop consonants. Where crispness comes from and where mumbling starts. Alternating place of articulation — lips, then ridge, then soft palate — is what makes these hard.'},
  liquid:  {name:'Liquids  /r/ /l/',      c:'var(--vi)', blurb:'The two sounds that require the most precise tongue shaping in English, and the pair that non-native speakers and tired speakers collapse together first.'},
  fric:    {name:'Fricatives  /f/ /v/ /θ/ /ð/ /h/',c:'var(--pk)', blurb:'The th sounds do not exist in most of the world\'s languages, and they sit adjacent to /f/, /v/, /s/ and /d/. Sustained airflow with precise obstruction — the least forgiving articulation in English.'},
  nasal:   {name:'Nasals & Glides  /m/ /n/ /ŋ/ /w/ /j/',c:'var(--ok)', blurb:'Resonance work disguised as articulation. These build the forward placement that makes a voice carry without volume.'},
  vowel:   {name:'Vowel Gymnastics',      c:'var(--cy)', blurb:'Jaw, lip and tongue-height range. Vowels carry most of the acoustic energy in speech — a speaker with collapsed vowels sounds muffled no matter how crisp the consonants are.'},
  cluster: {name:'Consonant Clusters',    c:'var(--acc)', blurb:'Three and four consonants with no vowel between them. English allows some of the densest clusters of any major language, and they are the first thing that breaks under speed.'},
  long:    {name:'Long-Form Classics',    c:'var(--vi)', blurb:'The full-length traditional pieces. These train sustained articulation under breath pressure — very different from the two-second snap of a short twister.'},
  brutal:  {name:'The Brutal Rack',       c:'var(--no)', blurb:'The ones that break people. Minimal-pair alternation at maximum density. Nobody says these clean at speed on a first attempt. That is the point.'},
  world:   {name:'Around the World',      c:'var(--pk)', blurb:'Twisters from other languages, with pronunciation notes. Every one trains a contrast English does not have — which is exactly why they stretch you.'},
  orig:    {name:'The Originals',         c:'var(--ok)', blurb:'Written for this app, targeting the specific contrasts the classics miss.'}
};

var TWISTERS = [
/* ============ WARMUP RACK (do these first, in order) ============ */
{t:'Mmmmm — hum on a comfortable note, lips gently closed, feel the buzz in your lips and nose. 30 seconds.',c:'warmup',d:1,tg:['/m/'],why:'Semi-occluded vocal tract. Back-pressure balances fold closure and warms the voice with almost no strain. Always the first thing you do.'},
{t:'Mah — may — mee — moh — moo. Slide from the hum straight into the vowel without breaking the tone.',c:'warmup',d:1,tg:['/m/','vowels'],why:'Carries the resonance you just built in the hum forward into open vowels. Bridges humming to speech.'},
{t:'The tip of the tongue, the teeth, the lips. The tip of the tongue, the teeth, the lips.',c:'warmup',d:1,tg:['/t/','/ð/','/l/','/p/'],why:'The classic articulator roll-call. Cycles the three main points of contact in one short phrase.'},
{t:'Red leather, yellow leather.',c:'warmup',d:2,tg:['/r/','/l/','/ð/'],why:'The single most-used broadcast warmup. Forces the tongue between /r/, /l/ and /ð/ — three different shapes at nearly the same place.'},
{t:'Unique New York, unique New York, you know you need unique New York.',c:'warmup',d:2,tg:['/j/','/n/','/k/'],why:'The /juː/ glide followed by velar and alveolar nasals. Trains the back of the tongue independently of the front.'},
{t:'Bilabial plosive: puh puh puh puh puh. Then buh buh buh buh buh.',c:'warmup',d:1,tg:['/p/','/b/'],why:'Diadochokinetic drill. Target five to seven per second, clean. This is a measurable articulatory-speed benchmark.'},
{t:'Alveolar: tuh tuh tuh tuh tuh. Then duh duh duh duh duh.',c:'warmup',d:1,tg:['/t/','/d/'],why:'Second DDK position. Tongue tip only — the jaw should not move at all.'},
{t:'Velar: kuh kuh kuh kuh kuh. Then guh guh guh guh guh.',c:'warmup',d:1,tg:['/k/','/g/'],why:'Third DDK position, back of the tongue. Usually the slowest of the three and the one people neglect.'},
{t:'Now all three: puh-tuh-kuh, puh-tuh-kuh, puh-tuh-kuh. Fast as you can stay clean.',c:'warmup',d:3,tg:['/p/','/t/','/k/'],why:'Sequential DDK — front, middle, back. The gold-standard articulatory-agility test. Target one and a half to two and a half full sequences per second.'},
{t:'Aaah — sustain one comfortable note for as long as you can on one breath.',c:'warmup',d:1,tg:['support'],why:'Maximum phonation time. A useful weekly benchmark: fifteen seconds and up indicates decent breath support; twenty-plus is strong.'},
{t:'Lip trill (brrrrr) sliding from your lowest comfortable note to your highest and back.',c:'warmup',d:2,tg:['range'],why:'Semi-occluded pitch glide. Stretches the range with the folds protected by back-pressure. Do this before any range work.'},
{t:'Straw phonation: hum through a straw for thirty seconds, then speak.',c:'warmup',d:1,tg:['support'],why:'The most evidence-backed vocal warmup there is. The narrow tube raises back-pressure, which improves fold closure efficiency for several minutes afterwards.'},
{t:'Yawn-sigh: fake a yawn, then sigh out on an open "haaah" from high to low.',c:'warmup',d:1,tg:['resonance'],why:'Drops the larynx and opens the pharynx. Instantly widens resonance — the fastest way to a fuller-sounding voice.'},
{t:'Count from one to twenty on a single breath, keeping the last number as loud as the first.',c:'warmup',d:2,tg:['support'],why:'Breath economy plus anti-trailing-off. Most people lose eight or more dB by number fifteen. Target: within four dB from one to twenty.'},

/* ============ SIBILANTS ============ */
{t:'She sells seashells by the seashore. The shells she sells are surely seashells.',c:'sib',d:2,tg:['/s/','/ʃ/'],why:'The canonical /s/-/ʃ/ alternation. Two fricatives separated by about a centimetre of tongue-blade position — the brain keeps grabbing the wrong one.'},
{t:'Six sick sea serpents swam the seven seas.',c:'sib',d:2,tg:['/s/'],why:'Repeated /s/ with varying following vowels. Trains a stable groove position across changing tongue heights.'},
{t:'Sixth sick sheikh\'s sixth sheep\'s sick.',c:'sib',d:5,tg:['/s/','/ʃ/','/ks/','/θ/'],why:'Frequently nominated the hardest short twister in English. Combines /s/, /ʃ/ and /θ/ with the /ksθ/ cluster in "sixth" — three near-identical tongue positions in immediate succession.'},
{t:'Sally sells sea shells and Sheila sells shiny shoes.',c:'sib',d:3,tg:['/s/','/ʃ/'],why:'Alternating onsets across word boundaries. The similar-onset effect is at maximum here.'},
{t:'Suzy sees sixty scissors on the seashore shining.',c:'sib',d:3,tg:['/s/','/z/','/ʃ/'],why:'Adds voiced /z/ to the /s/-/ʃ/ pair. Now three sibilants, differing in voicing and place.'},
{t:'Cinnamon aluminium linoleum. Cinnamon aluminium linoleum.',c:'sib',d:4,tg:['/s/','/l/','/n/','/m/'],why:'Three polysyllables with rotating nasal and lateral patterns. Stress placement collapses before articulation does.'},
{t:'The soothsayer\'s seventh sister sewed sixty-six silk shirts.',c:'sib',d:4,tg:['/s/','/θ/','/ð/','/ʃ/'],why:'Four different fricatives in the same phrase, all made within two centimetres of each other.'},
{t:'Shy Shelly says she shall sew sheets.',c:'sib',d:3,tg:['/ʃ/','/s/'],why:'Almost pure /ʃ/ with two /s/ intruders. Trains resisting assimilation.'},
{t:'Sunshine city, seaside city, sunshine seaside city sights.',c:'sib',d:3,tg:['/s/','/ʃ/','/t/'],why:'Compound repetition with the /ns/ and /ts/ clusters embedded.'},
{t:'Which wristwatches are Swiss wristwatches?',c:'sib',d:4,tg:['/w/','/r/','/tʃ/','/s/'],why:'The /stw/ cluster in "wristwatches" is one of the least common in English and the tongue has no motor pattern for it.'},
{t:'Sixty-six sick chicks sat on six slick bricks.',c:'sib',d:4,tg:['/s/','/tʃ/','/k/','/kl/'],why:'Adds the affricate /tʃ/ to the sibilant set and drops in two clusters.'},
{t:'Sasha sews sashes and Sasha\'s sister sorts them.',c:'sib',d:3,tg:['/s/','/ʃ/','/z/'],why:'Name repetition forces the same alternation four times without letting the tongue reset.'},

/* ============ PLOSIVES ============ */
{t:'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.',c:'plos',d:2,tg:['/p/','/k/'],why:'The most famous twister in English. Alternates bilabial /p/ with velar /k/ — the two furthest-apart stop positions in the mouth.'},
{t:'Betty Botter bought some butter, but she said the butter\'s bitter.',c:'plos',d:3,tg:['/b/','/t/'],why:'Bilabial and alveolar alternation with almost identical vowels. The vowels being similar is what makes the consonants slip.'},
{t:'A proper copper coffee pot.',c:'plos',d:3,tg:['/p/','/k/','/f/'],why:'Short, dense, and famously deceptive. Three /p/-/k/ swaps in six syllables.'},
{t:'Big black bug bit a big black bear.',c:'plos',d:2,tg:['/b/','/g/','/bl/'],why:'Voiced stops at two places plus the /bl/ cluster. Good early-level plosive work.'},
{t:'Blake\'s black bike\'s back brake bracket block broke.',c:'plos',d:5,tg:['/bl/','/br/','/bk/','/k/'],why:'Seven consecutive words with /b/ onsets and alternating /l/ and /r/ following. Near-total phonemic similarity — the hardest kind.'},
{t:'Pad kid poured curd pulled cod.',c:'brutal',d:5,tg:['/p/','/k/','/d/'],why:'Developed in a psycholinguistics lab as a deliberate maximum-difficulty sequence. Test subjects could not complete it at speed; some stopped speaking entirely. The alternation defeats the motor planning system rather than the tongue.'},
{t:'Kitty caught the kitten in the kitchen.',c:'plos',d:2,tg:['/k/','/t/','/tʃ/'],why:'Velar-alveolar alternation with an affricate at the end.'},
{t:'Tim, the thin twin tinsmith.',c:'plos',d:4,tg:['/t/','/θ/','/tw/','/n/'],why:'/t/ and /θ/ are separated by a few millimetres of tongue-tip position. Adding the /tw/ cluster makes it brutal for a five-word phrase.'},
{t:'Good blood, bad blood.',c:'plos',d:4,tg:['/bl/','/d/','/g/'],why:'Deceptively short. The /d/-/bl/ transition requires the tongue tip to release and the lips to close in overlapping time — repeat it five times fast and the words fuse.'},
{t:'Two toads, totally tired, tried to trot to Tewkesbury.',c:'plos',d:4,tg:['/t/','/tr/','/d/'],why:'/t/ onset on almost every word, with /tr/ clusters breaking the pattern at unpredictable points.'},
{t:'A tutor who tooted the flute tried to tutor two tooters to toot.',c:'plos',d:4,tg:['/t/','/fl/','/uː/'],why:'Extended /t/ plus /uː/ with a flute-related cluster. Trains lip rounding held constant across changing tongue positions.'},
{t:'Cooks cook cupcakes quickly.',c:'plos',d:3,tg:['/k/','/kw/'],why:'Almost pure velar. Good isolation drill for the back of the tongue.'},
{t:'Twelve twins twirled twelve twigs.',c:'plos',d:4,tg:['/tw/','/l/','/v/'],why:'The /tw/ cluster five times with /l/ and /v/ interference. English rarely repeats /tw/ and the motor pattern is weak.'},
{t:'Brisk brave brigadiers brandished broad bright blades.',c:'plos',d:4,tg:['/br/','/bl/','/br/'],why:'Alternating /br/ and /bl/. The only difference is the liquid, and it is the classic minimal-pair trap.'},

/* ============ LIQUIDS ============ */
{t:'Red lorry, yellow lorry. Red lorry, yellow lorry.',c:'liquid',d:3,tg:['/r/','/l/'],why:'The definitive /r/-/l/ discrimination drill. Both are liquids made in almost the same region; the tongue keeps compromising into something between the two.'},
{t:'Really rural. Really rural. Really rural.',c:'liquid',d:5,tg:['/r/','/l/'],why:'Two words, and one of the hardest sequences in English. The /r/-/l/-/r/-/r/-/l/ chain with no consonant break to reset the tongue.'},
{t:'Rural juror. Rural juror. Rural juror.',c:'brutal',d:5,tg:['/r/','/l/','/dʒ/'],why:'Adds an affricate to "really rural". Three consecutive /r/ approximants in different syllabic positions. Widely considered unsayable at speed.'},
{t:'Larry sent the latter letter later.',c:'liquid',d:3,tg:['/l/','/r/','/t/'],why:'Flap-t plus /l/ and /r/ alternation. In most American accents the medial /t/ becomes a flap, which is articulatorily adjacent to /r/ — that is the trap.'},
{t:'Lovely lemon liniment.',c:'liquid',d:3,tg:['/l/','/m/','/n/'],why:'Pure /l/ with nasal interference. Trains a clean lateral release.'},
{t:'Round and round the rugged rock the ragged rascal ran.',c:'liquid',d:3,tg:['/r/'],why:'Sustained /r/ across changing vowels. Trains tongue-root stability.'},
{t:'Truly rural jewellery.',c:'liquid',d:5,tg:['/r/','/l/','/uː/','/dʒ/'],why:'Compounds every /r/-/l/ trap with the /uːəl/ sequence in "jewellery", which most speakers cannot articulate slowly, let alone fast.'},
{t:'Eleven benevolent elephants.',c:'liquid',d:4,tg:['/l/','/v/','/n/'],why:'Alternating /l/, /v/ and /n/ across three polysyllables. Stress pattern is what breaks first.'},
{t:'Willy\'s really weary.',c:'liquid',d:4,tg:['/w/','/r/','/l/'],why:'Three approximants — /w/, /r/, /l/ — in a four-word phrase. All three are made without full contact, so there is no crisp landmark to aim at.'},
{t:'The lips, the teeth, the tip of the tongue, the tip of the tongue, the teeth, the lips.',c:'liquid',d:3,tg:['/l/','/θ/','/t/','/ð/'],why:'The reversed version of the warmup. Reversing the order defeats the motor pattern you just built.'},
{t:'Lily ladles little Letty\'s lentil soup.',c:'liquid',d:3,tg:['/l/','/t/','/d/'],why:'Five /l/ onsets with alveolar stops between them.'},
{t:'Rory\'s lawn rake rarely rakes really right.',c:'liquid',d:5,tg:['/r/','/l/','/k/'],why:'/r/ in onset, coda and intervocalic position, all in one line, with /l/ intruders.'},

/* ============ FRICATIVES ============ */
{t:'Fresh fried fish, fish fresh fried, fried fish fresh, fish fried fresh.',c:'fric',d:4,tg:['/f/','/r/','/ʃ/'],why:'Word-order permutation with identical phonemes. The motor sequence has to be rebuilt every phrase — this is planning load, not articulation load.'},
{t:'Three free throws. Three free throws. Three free throws.',c:'fric',d:4,tg:['/θ/','/r/','/f/'],why:'The /θr/ cluster is rare and difficult; adding /fr/ next to it means the tongue tip and lower lip compete for the same timing slot.'},
{t:'The thirty-three thieves thought that they thrilled the throne throughout Thursday.',c:'fric',d:5,tg:['/θ/','/ð/','/θr/'],why:'Voiced /ð/ and voiceless /θ/ alternating, plus four /θr/ clusters. The voicing switch is the hard part, not the place.'},
{t:'Freshly fried flying fish.',c:'fric',d:3,tg:['/f/','/fl/','/fr/'],why:'/fr/ and /fl/ alternation — again, only the liquid differs.'},
{t:'Vincent vowed vengeance very vehemently.',c:'fric',d:3,tg:['/v/','/n/'],why:'Sustained /v/, which English uses less than /f/ and which many speakers under-voice.'},
{t:'Of all the felt I ever felt, I never felt a piece of felt which felt as fine as that felt felt.',c:'fric',d:4,tg:['/f/','/l/','/t/'],why:'Repetition of a single word in different syntactic roles. Comprehension collapses before articulation does.'},
{t:'Whether the weather be fine, or whether the weather be not, we\'ll weather the weather whatever the weather, whether we like it or not.',c:'fric',d:4,tg:['/w/','/ð/','/θ/'],why:'The /w/-/ð/ pairing repeated eight times. Trains sustaining a voiced dental fricative under speed, which is where most people substitute /d/ or /v/.'},
{t:'Thin sticks, thick bricks.',c:'fric',d:4,tg:['/θ/','/s/','/k/','/br/'],why:'/θ/ and /s/ are near-neighbours; the tongue tip has to move about four millimetres and the brain keeps rounding it off.'},
{t:'He threw three free throws.',c:'fric',d:5,tg:['/θr/','/fr/','/h/'],why:'The shortest sentence in English that reliably defeats trained speakers. /θr/ and /fr/ in immediate alternation.'},
{t:'Five very fine vivid vines.',c:'fric',d:3,tg:['/f/','/v/'],why:'Pure /f/-/v/ voicing contrast. Same articulation, voicing only.'},
{t:'This thistle seems like that thistle.',c:'fric',d:4,tg:['/ð/','/θ/','/s/','/sl/'],why:'Voiced and voiceless th plus the /sl/ cluster and the /stl/ sequence in "thistle".'},
{t:'Something in a thirty-acre thermal thicket of thorns and thistles thumped and thundered.',c:'fric',d:5,tg:['/θ/','/θr/','/ð/'],why:'Sustained /θ/ across a long phrase. Breath support fails before articulation does — which is the real lesson.'},

/* ============ NASALS & GLIDES ============ */
{t:'Mommy made me mash my M&Ms.',c:'nasal',d:2,tg:['/m/','/ʃ/'],why:'Sustained bilabial nasal. Excellent forward-resonance builder disguised as a twister.'},
{t:'Many an anemone sees an enemy anemone.',c:'nasal',d:4,tg:['/n/','/m/','/ə/'],why:'Near-identical polysyllables differing by one segment. The vowel reduction pattern is what collapses.'},
{t:'Nine nice night nurses nursing nicely.',c:'nasal',d:3,tg:['/n/','/naɪ/'],why:'Repeated /n/ onset with the same diphthong. Trains the tongue tip to release cleanly rather than smearing.'},
{t:'Ken Dodd\'s dad\'s dog\'s dead.',c:'nasal',d:4,tg:['/d/','/n/','/z/'],why:'Four possessives in a row means four /z/ or /s/ endings colliding with /d/ onsets.'},
{t:'A noisy noise annoys an oyster.',c:'nasal',d:3,tg:['/n/','/ɔɪ/','/z/'],why:'The /nɔɪz/ sequence repeated with shifting word boundaries — "an oyster" versus "a noisy".'},
{t:'Yellow yo-yos, young yaks yodel.',c:'nasal',d:3,tg:['/j/','/l/'],why:'The palatal glide /j/, which English speakers produce lazily. Forces genuine tongue-body raising.'},
{t:'We surely shall see the sun shine soon.',c:'nasal',d:3,tg:['/w/','/ʃ/','/s/'],why:'Glide plus sibilant alternation.'},
{t:'Which witch wished which wicked wish?',c:'nasal',d:4,tg:['/w/','/tʃ/','/ʃ/'],why:'Homophone confusion plus /tʃ/-/ʃ/ alternation. Semantic interference on top of phonetic.'},
{t:'Wayne went to Wales to watch walruses.',c:'nasal',d:2,tg:['/w/'],why:'Sustained /w/. A simple lip-rounding endurance drill.'},
{t:'Nick knits nine knotted knapsacks nightly.',c:'nasal',d:3,tg:['/n/','/k/','/kn/'],why:'Silent-k words force the reader past orthography into pure sound — useful for cold-read training.'},

/* ============ VOWELS ============ */
{t:'How now brown cow.',c:'vowel',d:2,tg:['/aʊ/'],why:'The classic diphthong drill. Trains full jaw travel from open to rounded.'},
{t:'A e i o u — say each one at full extension, exaggerating the lip and jaw shape.',c:'vowel',d:1,tg:['vowels'],why:'Baseline vowel-space calibration. Most people use about sixty percent of their available vowel space in normal speech.'},
{t:'Bee, bay, bah, bore, boo. Then reverse: boo, bore, bah, bay, bee.',c:'vowel',d:2,tg:['vowels'],why:'Front-to-back tongue travel with a fixed consonant. Isolates vowel movement from consonant movement.'},
{t:'Eleven elves licked eleven little liquorice lollipops.',c:'vowel',d:4,tg:['/ɛ/','/ɪ/','/l/'],why:'The /ɛ/-/ɪ/ contrast, which is one of the smallest vowel distinctions in English, repeated with /l/ interference.'},
{t:'The ochre ogre ogled the poker.',c:'vowel',d:4,tg:['/oʊ/','/g/','/k/'],why:'Nearly identical vowel with alternating velar stops.'},
{t:'I scream, you scream, we all scream for ice cream.',c:'vowel',d:2,tg:['/aɪ/','/skr/'],why:'The word-boundary trap — "I scream" and "ice cream" are the same phoneme string with different junctures. Trains juncture control.'},
{t:'Around the rugged rocks the ragged rascals rudely ran.',c:'vowel',d:3,tg:['/r/','/æ/','/ʌ/'],why:'The /æ/-/ʌ/ contrast, which collapses in many accents, with /r/ everywhere.'},
{t:'Purple paper people, purple paper people.',c:'vowel',d:3,tg:['/ɜr/','/eɪ/','/p/'],why:'Bilabial plosives with an r-coloured vowel — a combination that requires the tongue and lips to work independently.'},
{t:'Ed had edited it.',c:'vowel',d:4,tg:['/ɛ/','/d/','/ɪ/'],why:'Four words, almost all schwa and /d/. Deceptively difficult because there are no landmarks.'},
{t:'Toy boat. Toy boat. Toy boat. Toy boat.',c:'brutal',d:5,tg:['/ɔɪ/','/oʊ/','/t/','/b/'],why:'Two syllables. Almost nobody manages ten repetitions. The two diphthongs both end in a high glide and the tongue cannot reset between them fast enough.'},

/* ============ CLUSTERS ============ */
{t:'Strong strange strings stretched straight.',c:'cluster',d:5,tg:['/str/'],why:'The /str/ cluster five times. English allows it, but repeating it prevents the tongue from resetting, and it degrades toward /ʃtr/.'},
{t:'Sixths, twelfths, and thousandths.',c:'cluster',d:5,tg:['/ksθs/','/lfθs/','/ndθs/'],why:'Three of the densest consonant clusters in the entire language. Four consonants with no vowel. Say them slowly first — many speakers cannot produce them at all.'},
{t:'The sixth sheikh\'s sixth sheep\'s sick, and the sixth sheikh\'s sixth sheep\'s sixth shepherd\'s sick too.',c:'brutal',d:5,tg:['/ksθ/','/ʃ/','/s/'],why:'The extended version. Adds another /ʃ/ layer and pushes the phrase past comfortable breath length.'},
{t:'Splendid sprinting sprites splashed spritely.',c:'cluster',d:4,tg:['/spl/','/spr/'],why:'The /spl/-/spr/ pair. Only the liquid differs, and both are three-consonant onsets.'},
{t:'Crisp crusts crackle and crunch.',c:'cluster',d:4,tg:['/kr/','/sp/','/st/','/ntʃ/'],why:'Onset and coda clusters in the same words. Trains cluster release without vowel insertion.'},
{t:'Glowing globes gleamed and glinted.',c:'cluster',d:3,tg:['/gl/'],why:'Sustained /gl/ — voiced velar into lateral, a difficult transition to keep clean.'},
{t:'The scientists\' strict scripts stressed sixths.',c:'cluster',d:5,tg:['/str/','/skr/','/ksθs/'],why:'Written to combine the three hardest cluster types in English into one phrase.'},
{t:'Twin-screw steel cruiser.',c:'cluster',d:5,tg:['/tw/','/skr/','/st/','/kr/'],why:'A traditional Royal Navy drill. Four clusters, four words. Notorious.'},
{t:'Prompt promptly, prompt promptly, prompt promptly.',c:'cluster',d:4,tg:['/pr/','/mpt/','/ptl/'],why:'The /mptl/ sequence is one of the longest consonant runs English permits.'},
{t:'Black background, brown background.',c:'cluster',d:5,tg:['/bl/','/br/','/kgr/','/nd/'],why:'The /kgr/ juncture across the word boundary in "back-ground" has no motor pattern, and swapping /bl/ for /br/ each time defeats prediction.'},

/* ============ LONG-FORM CLASSICS ============ */
{t:'How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood.',c:'long',d:4,tg:['/w/','/tʃ/','/k/','/d/'],why:'Sustained /w/ and /tʃ/ over a long phrase with heavy repetition. Breath management is the real challenge — plan your inhalations at the clause boundaries.'},
{t:'Betty Botter bought some butter, but she said the butter\'s bitter. If I put it in my batter it will make my batter bitter. But a bit of better butter will make my batter better. So she bought a bit of butter, better than her bitter butter, and she put it in her batter and the batter was not bitter. So it was better Betty Botter bought a bit of better butter.',c:'long',d:5,tg:['/b/','/t/','/ɪ/','/ʌ/','/ɛ/'],why:'The longest of the classics. Bilabial and alveolar stops with three near-identical vowels, sustained past comfortable breath length. Trains everything at once.'},
{t:'Theophilus Thistle, the successful thistle sifter, in sifting a sieve full of unsifted thistles, thrust three thousand thistles through the thick of his thumb.',c:'long',d:5,tg:['/θ/','/s/','/f/','/θr/'],why:'The most demanding /θ/ piece in English. Voiceless dental fricative sustained across a long, breath-hungry phrase with /s/ and /f/ competitors throughout.'},
{t:'A swan swam over the sea. Swim, swan, swim. Swan swam back again. Well swum, swan.',c:'long',d:4,tg:['/sw/','/m/','/n/'],why:'The /sw/ cluster with nasal codas. Deceptively simple to read, difficult to say cleanly at speed.'},
{t:'Moses supposes his toeses are roses, but Moses supposes erroneously. For nobody\'s toeses are posies of roses as Moses supposes his toeses to be.',c:'long',d:4,tg:['/z/','/s/','/oʊ/','/r/'],why:'Voiced and voiceless sibilants alternating with a fixed vowel. Trains voicing control.'},
{t:'Amidst the mists and coldest frosts, with barest wrists and stoutest boasts, he thrusts his fists against the posts and still insists he sees the ghosts.',c:'long',d:5,tg:['/sts/','/st/','/θr/'],why:'Eight /sts/ codas. The tongue must release /s/, stop for /t/, and release /s/ again — three gestures in the space usually given to one.'},
{t:'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where\'s the peck of pickled peppers Peter Piper picked?',c:'long',d:3,tg:['/p/','/k/'],why:'The full version. Four permutations of the same phoneme set — a planning drill more than an articulation one.'},
{t:'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn\'t very fuzzy, was he?',c:'long',d:3,tg:['/f/','/z/','/w/'],why:'The /z/-/w/ transition repeated. Voiced fricative into glide, which tends to smear.'},
{t:'If a dog chews shoes, whose shoes does he choose? He chews shoes he can chew, but he never chews shoes that a shoe-chewer chews.',c:'long',d:4,tg:['/tʃ/','/ʃ/','/z/','/uː/'],why:'The /tʃ/-/ʃ/ pair with a fixed rounded vowel throughout. Lip position constant, tongue position alternating.'},
{t:'One-one was a racehorse. Two-two was one too. One-one won one race. Two-two won one too.',c:'long',d:4,tg:['/w/','/n/','/t/','/uː/'],why:'Homophone density. Nothing is phonetically hard; the difficulty is entirely lexical retrieval under identical sound.'},
{t:'Denise sees the fleece, Denise sees the fleas. At least Denise could sneeze and feed and freeze the fleas.',c:'long',d:4,tg:['/s/','/z/','/fl/','/fr/'],why:'/s/-/z/ voicing with /fl/-/fr/ liquid alternation. Two independent contrasts running simultaneously.'},
{t:'I wish to wish the wish you wish to wish, but if you wish the wish the witch wishes, I won\'t wish the wish you wish to wish.',c:'long',d:5,tg:['/w/','/ʃ/','/tʃ/'],why:'The /wɪʃ/ syllable eleven times with tiny variations. Semantic tracking fails long before articulation does.'},

/* ============ BRUTAL RACK ============ */
{t:'Irish wristwatch, Swiss wristwatch.',c:'brutal',d:5,tg:['/ʃr/','/stw/','/tʃ/','/sw/'],why:'Widely nominated the hardest two-phrase twister in English. The /ʃr/ and /stw/ clusters do not occur adjacently anywhere else in the language.'},
{t:'Pleasant mother pheasant plucker, I\'m not the pleasant mother pheasant plucker, I\'m the pleasant mother pheasant plucker\'s son.',c:'brutal',d:5,tg:['/pl/','/f/','/ð/','/pk/'],why:'A traditional trap. The /pl/ and /f/ onsets plus the risk of transposition make this one of the most-failed pieces in performance training.'},
{t:'The seething sea ceaseth and thus the seething sea sufficeth us.',c:'brutal',d:5,tg:['/s/','/θ/','/ð/','/ˈsiːθ/'],why:'Alternating /s/ and /θ/ within nearly identical syllables. There is almost no acoustic landmark to steer by.'},
{t:'Six slippery snails slid silently seaward.',c:'brutal',d:4,tg:['/s/','/sl/','/l/'],why:'Five /s/-initial words, four with a following liquid. Maximum onset similarity.'},
{t:'A skunk sat on a stump and thunk the stump stunk, but the stump thunk the skunk stunk.',c:'brutal',d:5,tg:['/sk/','/st/','/θ/','/ŋk/'],why:'The /ŋk/ coda repeated with alternating /sk/, /st/ and /θ/ onsets. Semantic interference makes it worse.'},
{t:'Lesser leather never weathered wetter weather better.',c:'brutal',d:5,tg:['/l/','/ð/','/w/','/ɛ/'],why:'Every word ends in an r-coloured schwa and contains /ɛ/. There is no vowel variation to steer by at all.'},
{t:'Brad\'s big black bath brush broke.',c:'brutal',d:5,tg:['/br/','/bl/','/b/','/ʃ/'],why:'Six /b/ onsets with alternating liquids and a /ʃ/ finish.'},
{t:'Send toast ten steps to a stern stone-deaf stenographer.',c:'brutal',d:5,tg:['/st/','/ts/','/nd/','/nθ/'],why:'/st/ and /ts/ are mirror images and the tongue keeps swapping them. Eight cluster events in nine words.'},
{t:'She stood on the balcony inexplicably mimicking him hiccupping and amicably welcoming him in.',c:'brutal',d:5,tg:['/m/','/k/','/ŋ/','/ɪ/'],why:'Nine syllables of alternating nasals and velars with almost no vowel variation. A theatre-school standard.'},
{t:'Imagine an imaginary menagerie manager imagining managing an imaginary menagerie.',c:'brutal',d:5,tg:['/m/','/n/','/dʒ/','/ɪ/'],why:'Four polysyllables built from the same phoneme inventory in different orders. Lexical retrieval collapses immediately.'},

/* ============ WORLD ============ */
{t:'Trentatré trentini entrarono a Trento, tutti e trentatré trotterellando.  (Italian: thirty-three Trentonians entered Trento, all thirty-three trotting.)',c:'world',d:4,tg:['trilled /r/','/tr/'],why:'The Italian trilled /r/ inside a /tr/ cluster. Trains tongue-tip flexibility English never demands.'},
{t:'Tres tristes tigres tragaban trigo en un trigal.  (Spanish: three sad tigers swallowed wheat in a wheat field.)',c:'world',d:4,tg:['/tr/','trilled /r/'],why:'The most famous Spanish twister. Six /tr/ clusters with a trill. Excellent for English speakers because it demands a tongue gesture we have no habit for.'},
{t:'Fischers Fritz fischt frische Fische; frische Fische fischt Fischers Fritz.  (German: Fischer\'s Fritz fishes fresh fish.)',c:'world',d:4,tg:['/fʃ/','/fr/','/ʃ/'],why:'The /fʃ/ sequence does not occur in English. Trains independent lip and tongue-blade timing.'},
{t:'Un chasseur sachant chasser doit savoir chasser sans son chien.  (French: a hunter who knows how to hunt must know how to hunt without his dog.)',c:'world',d:4,tg:['/ʃ/','/s/','nasal vowels'],why:'/ʃ/-/s/ alternation plus French nasal vowels. Trains soft-palate control, which English speakers rarely exercise deliberately.'},
{t:'Konstantinopolitanischerdudelsackpfeifenmachersgeselle.  (German: apprentice to a Constantinopolitan bagpipe maker.)',c:'world',d:5,tg:['compounds','/pf/'],why:'A single word with the /pf/ affricate. Trains sustained articulation over an extreme syllable count on one breath.'},
{t:'Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura.  (Italian: read for legato vowel flow, not speed.)',c:'world',d:3,tg:['vowels','legato'],why:'Italian is a syllable-timed language with pure vowels. Reading it trains even syllable duration — the opposite of English stress-timing, and a genuine ear-opener.'},
{t:'Stół z powyłamywanymi nogami.  (Polish: a table with broken-off legs.)',c:'world',d:5,tg:['/w/','/ɨ/','clusters'],why:'Polish vowel /ɨ/ and consonant density. Almost impossible for an English mouth on first attempt, which is exactly why it stretches.'},
{t:'Nam kok kok, kok kok nam.  (Thai-style tonal pattern: say each syllable on a distinct pitch — low, mid, high, mid, low.)',c:'world',d:4,tg:['tone','pitch control'],why:'Not an articulation drill — a pitch-precision drill. Assigning discrete pitches to syllables trains exactly the F0 control this app measures.'},

/* ============ ORIGINALS ============ */
{t:'Certain sceptics sanction certain scripted sales.',c:'orig',d:4,tg:['/s/','/sk/','/skr/','/ʃ/'],why:'Written to alternate /s/, /sk/ and /skr/ — the three sibilant-cluster densities — inside one breath.'},
{t:'The tonal control cost Colin all control.',c:'orig',d:4,tg:['/t/','/k/','/l/','/oʊ/'],why:'Velar and alveolar stops around a fixed vowel with /l/ codas throughout. No vowel landmark to steer by.'},
{t:'Quiet quotes quell quick quarrels quietly.',c:'orig',d:4,tg:['/kw/'],why:'Five /kw/ onsets. English uses this cluster rarely enough that the motor pattern is under-trained in most speakers.'},
{t:'Practised pacing places pauses precisely.',c:'orig',d:4,tg:['/pr/','/p/','/s/','/z/'],why:'Bilabial onsets with sibilant codas — the two ends of the mouth working in opposite directions.'},
{t:'Drop the drawl, draw the drill, dwell on the detail.',c:'orig',d:4,tg:['/dr/','/dw/','/d/'],why:'The /dw/ cluster is one of the rarest in English. Placed next to /dr/ it exposes exactly how weak the motor pattern is.'},
{t:'Thrust the third thrilling thought through.',c:'orig',d:5,tg:['/θr/','/θ/','/ð/'],why:'Four /θr/ clusters with a voiced /ð/ intruder. Written as the maximum-density dental drill.'},
{t:'Whispered wisdom wins where wild words won\'t.',c:'orig',d:4,tg:['/w/','/wɪ/','/z/','/d/'],why:'Seven /w/ onsets with alternating following vowels. Lip-rounding endurance.'},
{t:'Flat black plastic packs stack fast.',c:'orig',d:5,tg:['/fl/','/bl/','/pl/','/st/','/kst/'],why:'Three different liquid clusters plus two coda clusters, all inside six words.'},
{t:'Measure the pleasure, treasure the leisure.',c:'orig',d:3,tg:['/ʒ/','/ʒər/','/tr/','/l/'],why:'The /ʒ/ phoneme is the rarest consonant in English. Four of them in one line builds a sound most speakers barely produce.'},
{t:'Chuck\'s cheap chalk choked the church clock.',c:'orig',d:4,tg:['/tʃ/','/k/','/tʃ/','/kl/'],why:'Affricate and velar stop alternation, which is the pairing most likely to collapse into a single articulation under speed.'},
{t:'Sell shells, shell cells, sell shelled cells.',c:'orig',d:5,tg:['/s/','/ʃ/','/l/','/lz/'],why:'A deliberately maximal /s/-/ʃ/ minimal-pair sequence with /ld/ and /lz/ codas.'},
{t:'Bright light, right night, night light bright.',c:'orig',d:4,tg:['/br/','/r/','/l/','/aɪt/'],why:'Fixed rhyme with rotating onsets — /br/, /r/, /l/, /n/. Rhyme removes the vowel cue, so only onsets differ.'},
{t:'Gregg\'s grey glove grabbed Greg\'s green glass.',c:'orig',d:5,tg:['/gr/','/gl/','/g/'],why:'/gr/ and /gl/ alternating six times. The classic liquid-swap trap at the velar place.'},
{t:'Nine fine wines shine behind the blind.',c:'orig',d:3,tg:['/n/','/aɪn/','/bl/','/ʃ/'],why:'Fixed rhyme with rotating onsets, gentler than the bright-light drill. Good intermediate step.'},
{t:'The pitch shifts swiftly, the shift pitches swiftly.',c:'orig',d:5,tg:['/tʃ/','/ʃ/','/ft/','/fts/','/sw/'],why:'The /fts/ coda plus /tʃ/-/ʃ/ alternation plus word-class reversal. Written as a final-boss original.'},
{t:'Speak the peak, peak the speak, speak the peak precisely.',c:'orig',d:4,tg:['/sp/','/p/','/k/','/pr/'],why:'The /sp/-/p/ contrast is aspiration only, which English speakers produce unconsciously and cannot easily control on demand.'},

/* ============ SIBILANTS — second rack ============ */
{t:'Six shimmering sharks sharply sheared three shabby sheep.',c:'sib',d:4,tg:['/ʃ/','/s/','/θr/'],why:'Six /ʃ/ onsets interrupted by /s/ and a /θr/ cluster. The blade has to leave the palatal position and land precisely on the ridge, twice, mid-phrase.'},
{t:'Seth at the shop sells thick socks and six thin sacks.',c:'sib',d:5,tg:['/s/','/θ/','/ʃ/'],why:'The /s/-/θ/ contrast is the single most common lisp confusion in English. Nine alternations in one line makes it audible to you in real time.'},
{t:'Cheryl\'s chilly cheap chip shop sells cheap chips.',c:'sib',d:4,tg:['/tʃ/','/ʃ/','/p/'],why:'Affricate /tʃ/ against pure fricative /ʃ/. They share tongue position and differ only in whether the airflow starts with a stop — which is exactly what collapses at speed.'},
{t:'Ships sail south while sheep sleep soundly.',c:'sib',d:3,tg:['/ʃ/','/s/','/sl/'],why:'Clean alternating pattern with no clusters to hide behind. A good diagnostic line: if your /ʃ/ and /s/ sound alike here, start the whole sibilant rack from the top.'},
{t:'Zithers slither, scissors shear, zebras seize.',c:'sib',d:4,tg:['/z/','/s/','/ʃ/','/ð/'],why:'Adds voicing to the sibilant problem. /z/ and /s/ are the same gesture with the folds on or off, and most speakers under-voice /z/ without noticing.'},
{t:'She shrewdly showed seven shoppers several sheer shawls.',c:'sib',d:5,tg:['/ʃ/','/ʃr/','/s/','/v/'],why:'The /ʃr/ cluster is rare and unstable — English speakers routinely produce it as /sr/ or /ʃər/. Seven surrounding /ʃ/ onsets stop you cheating it.'},
{t:'Sixteen slim sleek saplings swayed silently.',c:'sib',d:3,tg:['/s/','/sl/','/sw/'],why:'Sustained /s/ endurance with three different following consonants. Tests whether your /s/ stays stable when what comes after it changes.'},
{t:'Persistent pheasants pester patient shepherds.',c:'sib',d:4,tg:['/s/','/z/','/ʃ/','/p/'],why:'Sibilants embedded between plosives rather than sitting at word onsets. Much harder, because the tongue has to arrive in position from a stop rather than from rest.'},

/* ============ PLOSIVES — second rack ============ */
{t:'Bobby Bippy bought a bat, then Bobby Bippy bought a ball.',c:'plos',d:3,tg:['/b/','/p/','/t/'],why:'Voiced and unvoiced bilabials alternating inside the same word. /b/ and /p/ differ only by voice-onset time — about 30 milliseconds of control.'},
{t:'Ted fed Ned bread and Ned fed Ted bread.',c:'plos',d:3,tg:['/t/','/d/','/n/','/br/'],why:'Three sounds made at the identical place — /t/, /d/, /n/ are all alveolar — differing only in voicing and nasality. Precision without movement.'},
{t:'Cricket critics picked the quickest ticket.',c:'plos',d:4,tg:['/kr/','/k/','/t/','/kw/'],why:'Velar-to-alveolar leaps, six times, with a /kw/ thrown in. The back of the tongue and the tip have to work independently and fast.'},
{t:'Deep dark ditches, daily dug, drain deeply.',c:'plos',d:4,tg:['/d/','/dr/','/k/','/g/'],why:'Voiced stops only. Voiced plosives require simultaneous fold vibration and full oral closure, which fights itself aerodynamically — this is why they devoice when you tire.'},
{t:'Pick a packet, pack the packet, put the packed packet back.',c:'plos',d:4,tg:['/p/','/k/','/kt/','/kst/'],why:'Word-final /kt/ clusters are the first thing dropped in casual speech. This line makes every one of them load-bearing.'},
{t:'Gobbling gargoyles gobbled gobbling goblins.',c:'plos',d:4,tg:['/g/','/gl/','/b/'],why:'Voiced velar /g/ is the slowest of the six English stops to release cleanly. Nine of them, with /bl/ and /gl/ interference.'},
{t:'Tie a tight knot, tie a tight knot, tie a tight tight knot.',c:'plos',d:3,tg:['/t/','/n/','/aɪ/'],why:'Repeated /t/ with a silent-k /n/ onset. Watch for the /t/ turning into a glottal stop by the third repetition — that is the fault this drill exposes.'},
{t:'Bake big batches of buttered biscuits, Becky.',c:'plos',d:3,tg:['/b/','/k/','/tʃ/','/t/'],why:'Bilabial to velar and back, seven times, with an intervocalic /t/ that American speakers flap and British speakers glottalise. Choose one and hold it.'},

/* ============ LIQUIDS — second rack ============ */
{t:'Roland the rambler rarely rolled rightward.',c:'liquid',d:4,tg:['/r/','/l/','/rl/'],why:'The /rl/ sequence inside "Roland" requires the tongue to move from a bunched or retroflex /r/ to a lateral /l/ with no vowel to travel through.'},
{t:'Literally literary, literary literally.',c:'liquid',d:5,tg:['/l/','/r/','/t/'],why:'Two four-syllable words with nearly identical segments in different order. The brain reaches for the wrong one, and the tongue follows. Pure sequencing.'},
{t:'The rear wheel really reels.',c:'liquid',d:3,tg:['/r/','/l/','/w/','/iə/'],why:'Short but nasty: /r/, /w/ and dark /l/ all involve lip or tongue-body rounding, so they blur into each other when the mouth stops resetting between words.'},
{t:'Laura loathes lowly lawyers loudly.',c:'liquid',d:4,tg:['/l/','/ð/','/r/'],why:'Five /l/ onsets with a /ð/ ambush. Light /l/ at word start and dark /l/ at word end are different sounds — this line makes you produce both repeatedly.'},
{t:'Reluctant rural lorry rally.',c:'liquid',d:5,tg:['/r/','/l/','/rl/','/lr/'],why:'"Rural" alone defeats most speakers. Putting it between two /l/-heavy words removes the reset time the tongue normally gets.'},
{t:'Lucy\'s lorry rolled reluctantly rearward.',c:'liquid',d:4,tg:['/l/','/r/','/rl/'],why:'Long-form /r/-/l/ alternation, which trains endurance rather than the snap of a short twister. Fatigue is the point.'},
{t:'Eleven elderly earls ran rearward.',c:'liquid',d:4,tg:['/l/','/r/','/ɜː/'],why:'The r-coloured vowel in "earls" sits between a lateral and a rhotic, which is the exact context where non-rhotic and rhotic accents diverge most.'},
{t:'Rolling red wagons rarely rattle rightly.',c:'liquid',d:3,tg:['/r/','/l/','/w/'],why:'Gentler entry point to the /r/-/l/ family. Use it as the warmup before "reluctant rural lorry rally".'},

/* ============ FRICATIVES — second rack ============ */
{t:'The father\'s feather, the feather\'s father.',c:'fric',d:5,tg:['/ð/','/f/','/θ/'],why:'Voiced /ð/ and unvoiced /f/ sit adjacent in both place and manner. Reversing the two words removes every contextual cue and leaves only articulation.'},
{t:'Thieves seize skis.',c:'fric',d:5,tg:['/θ/','/z/','/s/','/sk/'],why:'Three words, three different fricative pairings, all voiced-unvoiced minimal contrasts. One of the shortest genuinely hard twisters in English.'},
{t:'Faith fought for further faith.',c:'fric',d:4,tg:['/f/','/θ/','/ð/','/r/'],why:'Word-final /θ/ after a diphthong is where the tongue tends to stop short of the teeth. Repeating it four times makes the shortfall audible.'},
{t:'Their thirty-third birthday, the third of the month.',c:'fric',d:4,tg:['/ð/','/θ/','/rθ/','/rd/'],why:'The /rθ/ coda in "birth" is one of the hardest sequences in English — a rhotic immediately followed by an interdental, with no vowel between them.'},
{t:'Have half of Van\'s halved veal.',c:'fric',d:5,tg:['/v/','/f/','/h/','/vd/'],why:'/v/ and /f/ alternating five times, including the /vd/ coda in "halved" which almost every speaker devoices to /ft/ without hearing it.'},
{t:'Both boats float. Both float boats.',c:'fric',d:3,tg:['/θ/','/b/','/fl/','/t/'],why:'Word-final /θ/ against word-initial /b/ and /fl/. Good first step before the harder /θ/ material.'},
{t:'The fifth fifth of the fifth.',c:'fric',d:5,tg:['/fθ/','/fθs/'],why:'The /fθ/ coda is a labiodental immediately followed by an interdental — two fricatives, two different places, no vowel. Almost universally simplified to /ft/ or /θ/.'},
{t:'Whither the withered weather, and whether it wearies.',c:'fric',d:4,tg:['/w/','/ð/','/hw/'],why:'Tests whether you distinguish /w/ from /hw/ at all, and forces /ð/ into three different vowel environments.'},

/* ============ NASALS & GLIDES — second rack ============ */
{t:'Nine numb nannies nodded numbly.',c:'nasal',d:4,tg:['/n/','/m/','/mb/'],why:'Alveolar /n/ against bilabial /m/, plus the silent-b /mb/ coda. Nasals need the soft palate down — if it lags, the vowels go nasal too.'},
{t:'Singing, ringing, banging, hanging, longing.',c:'nasal',d:3,tg:['/ŋ/','/ŋg/','/r/'],why:'Velar nasal endurance. English never allows /ŋ/ at word start, so speakers have poor conscious control of it — this builds it.'},
{t:'My mama makes many mammoth muffins.',c:'nasal',d:3,tg:['/m/','/n/','/f/'],why:'Ten bilabial nasals. Excellent forward-placement work: if you feel the buzz in your lips and the bridge of your nose, your resonance is where it should be.'},
{t:'Young yeomen yearn for yellow yams.',c:'nasal',d:4,tg:['/j/','/n/','/l/','/ɜː/'],why:'The palatal glide /j/ five times, including before the r-coloured vowel in "yearn" — a combination that reliably collapses into a schwa.'},
{t:'The moaning man made mounting moans.',c:'nasal',d:3,tg:['/m/','/n/','/aʊ/'],why:'Nasal onsets with a wide diphthong between them. Trains you to open the vowel fully rather than letting the nasal resonance smear across it.'},
{t:'Willy wound the wire while Wally wound the wool.',c:'nasal',d:4,tg:['/w/','/l/','/aɪ/','/ʊ/'],why:'Labiovelar /w/ against dark /l/ — both use lip rounding and tongue-body raising, and both are produced lazily by tired speakers.'},
{t:'Hang on. Long song. Wrong gong. Sing along.',c:'nasal',d:3,tg:['/ŋ/','/ŋg/','/s/','/r/'],why:'Whether "long" ends in /ŋ/ or /ŋg/ is an accent feature. Pick one and hold it across all four phrases — consistency is the drill.'},
{t:'Nimble Ned nimbly named nine numbers.',c:'nasal',d:4,tg:['/n/','/m/','/mb/','/md/'],why:'Alternating nasals with two different clusters. The soft palate has to move on every syllable while the tongue tip does something different.'},

/* ============ VOWEL GYMNASTICS — second rack ============ */
{t:'Oo — ah — oo — ah — oo — ah. Move only your lips. Keep the jaw completely still.',c:'vowel',d:2,tg:['lips'],why:'Isolates lip rounding from jaw movement. Most speakers cannot do this at first, which is precisely why their vowels are muddy — everything moves together.'},
{t:'Ee — ah — ee — ah — ee — ah. Move only your tongue. Keep the lips completely still.',c:'vowel',d:2,tg:['tongue'],why:'The mirror drill. Isolates tongue height from lip posture. Together with the lip drill above, this is the whole basis of vowel clarity.'},
{t:'Who would? Who could? Who should? Who stood?',c:'vowel',d:3,tg:['/uː/','/ʊ/'],why:'Long /uː/ against short /ʊ/ — a length and tenseness contrast that carries real meaning in English and that most speakers under-produce.'},
{t:'Ate eight apples at eight, and Ed ate eight as well.',c:'vowel',d:3,tg:['/eɪ/','/æ/','/e/'],why:'Three front vowels at three different heights with almost no consonant support. Nowhere to hide — the vowel is the entire word.'},
{t:'Pool, pull, pole, pal, pail, peel, Paul.',c:'vowel',d:4,tg:['/uː/','/ʊ/','/əʊ/','/æ/','/eɪ/','/iː/','/ɔː/'],why:'Seven vowels inside one fixed consonant frame. This is the cleanest possible vowel-space map — if any two sound the same, that is a merger to work on.'},
{t:'Cot, caught, coat, cut, curt, kit, Kate.',c:'vowel',d:5,tg:['/ɒ/','/ɔː/','/əʊ/','/ʌ/','/ɜː/','/ɪ/','/eɪ/'],why:'The back-vowel version of the same frame, including the cot-caught pair that is merged in much of North America. Say them as seven distinct sounds regardless of your accent.'},
{t:'A loyal royal oil boil.',c:'vowel',d:5,tg:['/ɔɪ/','/l/','/r/'],why:'The /ɔɪ/ diphthong immediately followed by /l/, four times. The tongue has to complete the glide before the lateral, and almost nobody does — it comes out as "oyull".'},
{t:'The owl howls; our hours are ours.',c:'vowel',d:4,tg:['/aʊ/','/aʊə/','/r/','/l/'],why:'A triphthong — /aʊə/ — which is the longest single vowel gesture in English. Three of them in a row with liquids attached.'},

/* ============ CONSONANT CLUSTERS — second rack ============ */
{t:'Strict strong Stephen stretched sixty thick thistle sticks.',c:'cluster',d:5,tg:['/str/','/st/','/θ/','/kst/'],why:'Four /str/ onsets — the densest common cluster in English — plus interdentals and a /kst/ coda. Written as a cluster stress test.'},
{t:'He sprints, she splits, they sprawl, we scrawl.',c:'cluster',d:4,tg:['/spr/','/spl/','/skr/'],why:'The three /s/-plus-plosive-plus-liquid onsets, rotated. They differ by one segment each, so the tongue keeps landing in the neighbouring shape.'},
{t:'Twelfths, sixths, fifths, twentieths.',c:'cluster',d:5,tg:['/lfθs/','/ksθs/','/fθs/','/θs/'],why:'Four-consonant codas. /lfθs/ in "twelfths" is the longest coda English permits and is simplified by essentially every native speaker in ordinary conversation.'},
{t:'Texts, tests, twists, trysts.',c:'cluster',d:5,tg:['/ksts/','/sts/','/sts/','/tr/'],why:'The /ksts/ coda requires velar stop, fricative, alveolar stop, fricative — four articulations with no vowel. Say all four words without dropping a single segment.'},
{t:'Scrunched, sprained, splintered, screwed.',c:'cluster',d:5,tg:['/skr/','/spr/','/spl/','/ntʃt/'],why:'Three-consonant onsets paired with three-consonant codas in the same word. Both ends of the syllable loaded at once.'},
{t:'Bland brands blend; blended brands bland.',c:'cluster',d:4,tg:['/bl/','/br/','/nd/','/ndz/'],why:'/bl/ against /br/ is the liquid-swap trap at the bilabial place, and every word ends in a nasal-plus-stop coda.'},
{t:'He glimpsed the glimpse he had glimpsed.',c:'cluster',d:5,tg:['/gl/','/mpst/'],why:'/mpst/ is the four-consonant coda of "glimpsed" — nasal, stop, fricative, stop — and it is the single most commonly reduced cluster in English.'},
{t:'Angsts, midsts, whilsts. Three times each, nothing dropped.',c:'cluster',d:5,tg:['/ŋksts/','/dsts/','/lsts/'],why:'Deliberately absurd. These forms barely occur in real speech, which is exactly why saying them cleanly builds coda control that ordinary speech never demands.'},
{t:'Crushed thrushes thrust through the brush.',c:'cluster',d:5,tg:['/kr/','/θr/','/ʃt/','/br/'],why:'The /θr/ cluster twice, with /ʃt/ codas between. /θr/ is unstable in English and drifts toward /fr/ or /tr/ under any speed pressure.'},

/* ============ LONG-FORM — second rack ============ */
{t:'If you notice this notice, you will notice that this notice is not worth noticing.',c:'long',d:3,tg:['/n/','/t/','/s/','/aɪ/'],why:'Traditional. The repeated "notice" with shifting grammatical roles trains sustained precision on an intervocalic /t/ — the sound most likely to flap or drop.'},
{t:'A tree toad loved a she-toad who lived up in a tree. He was a two-toed tree toad but a three-toed toad was she. The two-toed tree toad tried to win the three-toed she-toad\'s heart, for the two-toed tree toad loved the ground the three-toed toad trod.',c:'long',d:5,tg:['/tr/','/θr/','/t/','/d/','/əʊ/'],why:'Traditional. The definitive /tr/-/θr/ endurance piece. Sixty seconds of alternating tongue-tip clusters with almost no rest, under continuous breath pressure.'},
{t:'Mr. See owned a saw and Mr. Soar owned a seesaw. Now See\'s saw sawed Soar\'s seesaw before Soar saw See, which made Soar sore.',c:'long',d:5,tg:['/s/','/z/','/ɔː/','/sɔː/'],why:'Traditional. Near-identical syllables distinguished only by voicing and stress. Sustained sibilant control with the meaning shifting under you.'},
{t:'I thought a thought. But the thought I thought wasn\'t the thought I thought I thought. If the thought I thought I thought had been the thought I thought, I wouldn\'t have thought so much.',c:'long',d:5,tg:['/θ/','/t/','/ɔː/'],why:'Traditional. Twelve /θ/ onsets in a nested clause structure. Two drills at once — the interdental, and holding a sentence together while its grammar recurses.'},
{t:'Can you can a can as a canner can can a can?',c:'long',d:3,tg:['/k/','/n/','/æ/'],why:'Traditional. Identical syllables in different grammatical roles. The only way to make it intelligible is stress placement — which makes it an emphasis drill disguised as articulation.'},
{t:'Silly Sally swiftly shooed seven silly sheep. The seven silly sheep Silly Sally shooed shilly-shallied south. These sheep shouldn\'t sleep in a shack; sheep should sleep in a shed.',c:'long',d:5,tg:['/s/','/ʃ/','/sl/','/sw/'],why:'Traditional. The longest sustained /s/-/ʃ/ alternation in the standard repertoire. If a lisp exists anywhere in your speech, thirty seconds of this will surface it.'},

/* ============ THE BRUTAL RACK — second rack ============ */
{t:'Peggy Babcock. Peggy Babcock. Peggy Babcock.',c:'brutal',d:5,tg:['/p/','/g/','/b/','/k/'],why:'Two words. Considered by voice coaches to be among the hardest repeats in English — bilabial and velar stops alternating with voicing flipping on nearly every segment.'},
{t:'Shredded Swiss cheese. Shredded Swiss cheese. Shredded Swiss cheese.',c:'brutal',d:5,tg:['/ʃr/','/sw/','/s/','/tʃ/'],why:'The /ʃr/ onset followed immediately by /sw/ and then /tʃ/ — three different tongue postures in three syllables, repeated until one of them fails.'},
{t:'Freshly-fried flesh of a freshly-fried fly.',c:'brutal',d:5,tg:['/fr/','/fl/','/ʃ/','/ʃl/'],why:'/fr/ against /fl/ is the liquid-swap trap at the labiodental place, and /ʃl/ inside "freshly" is a sequence English almost never asks for.'},
{t:'Selfish shellfish. Selfish shellfish. Selfish shellfish.',c:'brutal',d:5,tg:['/s/','/ʃ/','/lf/','/ʃ/'],why:'Two words that are near-anagrams of each other in sound. The /lf/ coda between two sibilants gives the tongue no time to reset.'},
{t:'Six sticky skeletons. Six sticky skeletons. Six sticky skeletons.',c:'brutal',d:5,tg:['/ks/','/st/','/sk/'],why:'Three different /s/-plus-stop combinations per repetition. The /ks/ coda of "six" running straight into the /st/ onset of "sticky" is the failure point.'},
{t:'Green glass globes glow greenly.',c:'brutal',d:5,tg:['/gr/','/gl/','/g/'],why:'/gr/ and /gl/ alternating five times with no other consonant to break the pattern. Voiced velar plus liquid is the slowest onset in English to release cleanly.'},
{t:'Thin thick, thin thick, thin thick — ten times, no slips.',c:'brutal',d:5,tg:['/θɪn/','/θɪk/','/n/','/k/'],why:'The two words differ by exactly one segment, at opposite ends of the mouth. Under repetition the coda blends and both become an indistinct middle sound.'},
{t:'Willie\'s really weary. Willie\'s really weary. Willie\'s really weary.',c:'brutal',d:4,tg:['/w/','/l/','/r/','/iə/'],why:'All three English approximants — /w/, /l/, /r/ — in one short phrase, repeated. They are the three sounds most prone to merging when the mouth stops fully resetting.'},

/* ============ AROUND THE WORLD — second rack ============ */
{t:'Strč prst skrz krk.  (Czech: stick a finger through your throat — a complete sentence with no vowels at all)',c:'world',d:5,tg:['/str/','/rst/','/skr/','/rk/'],why:'Czech uses /r/ as a syllable nucleus, which English never does. Producing four vowel-free syllables forces genuine independent control of the tongue tip.'},
{t:'Nama mugi, nama gome, nama tamago.  (Japanese: raw wheat, raw rice, raw egg)',c:'world',d:3,tg:['/m/','/g/','/n/','/t/'],why:'Japanese moras are near-equal in length, unlike English stress-timing. Saying this with even timing retrains your rhythm and slows a rushed delivery.'},
{t:'Karl u Klary ukral korally, a Klara u Karla ukrala klarnet.  (Russian: Karl stole corals from Clara, and Clara stole Karl\'s clarinet)',c:'world',d:4,tg:['/kl/','/kr/','trilled /r/'],why:'The trilled /r/ against /kl/ and /kr/ onsets. Even approximated with an English /r/, the alternation is punishing.'},
{t:'Sju sjösjuka sjömän sköttes av sju sköna sjuksköterskor.  (Swedish: seven seasick sailors were tended by seven beautiful nurses)',c:'world',d:5,tg:['/ɧ/','/ʃ/','/ʂ/'],why:'Swedish has a fricative — the sj-sound — produced with simultaneous constriction at two places at once. There is no English equivalent, and reaching for it stretches the whole sibilant family.'},
{t:'De kat krabt de krullen van de trap.  (Dutch: the cat scratches the curls off the stairs)',c:'world',d:4,tg:['/kr/','/kl/','/tr/','/x/'],why:'Three velar-initial clusters in one short line, plus Dutch\'s guttural fricative if you attempt it properly. Trains the back of the tongue hard.'},
{t:'El perro de San Roque no tiene rabo porque Ramón Ramírez se lo ha cortado.  (Spanish: San Roque\'s dog has no tail, because Ramón Ramírez cut it off)',c:'world',d:4,tg:['trilled /r/','/rr/','/r/'],why:'Spanish distinguishes a tapped /r/ from a trilled /rr/ as separate phonemes. Six trills in one sentence is the standard Spanish diction exercise.'},
{t:'O rato roeu a roupa do rei de Roma.  (Portuguese: the rat gnawed the clothes of the king of Rome)',c:'world',d:3,tg:['/ʁ/','/r/','/oʊ/'],why:'Portuguese initial r is a back fricative closer to a French r than an English one. Producing it moves your articulation to a place English never uses.'},
{t:'Kachcha papad, pakka papad.  (Hindi: raw poppadom, cooked poppadom)',c:'world',d:4,tg:['/tʃtʃ/','/kk/','/p/','/ɖ/'],why:'Hindi contrasts geminate consonants — held twice as long — which English does not. Holding the double /kk/ and /tʃtʃ/ builds deliberate stop-duration control.'},
{t:'Sì shì sì, shí shì shí, shísì shì shísì, sìshí shì sìshí.  (Mandarin: four is four, ten is ten, fourteen is fourteen, forty is forty)',c:'world',d:5,tg:['/s/','/ʂ/','tone'],why:'Alveolar /s/ against retroflex /ʂ/, across four different tones. The most famous Mandarin twister, and unusually direct training for the /s/-/ʃ/ problem in English.'},
{t:'Appilan pappilan apupapin papupata.  (Finnish: the bean pot of the assistant vicar of Appila vicarage)',c:'world',d:4,tg:['/p/','/pp/','/l/'],why:'Finnish geminates plus fixed first-syllable stress. Trains you to hold a stop closure deliberately instead of releasing it the instant it forms.'},
{t:'Bir berber bir berbere gel beraber bir berber dükkânı açalım demiş.  (Turkish: a barber said to a barber, come, let us open a barber shop together)',c:'world',d:5,tg:['/b/','/r/','/berber/'],why:'Turkish vowel harmony makes every syllable of this near-identical. With almost no segmental contrast to hold on to, only rhythm keeps it intelligible.'},
{t:'Ta tap tap tap, da dap dap dap — alternate unvoiced and voiced ten times.  (Universal voicing drill)',c:'world',d:3,tg:['/t/','/d/','VOT'],why:'Voice-onset time is the only difference between /t/ and /d/, and it is measured in tens of milliseconds. Alternating deliberately is how you gain conscious control of it.'},

/* ============ THE ORIGINALS — second rack ============ */
{t:'State the stakes, stake the state, then state the stated stakes.',c:'orig',d:5,tg:['/st/','/steɪ/','/kt/','/ts/'],why:'Six /st/ onsets with the word class rotating underneath. The grammar shifts faster than the mouth wants to, which is the actual difficulty.'},
{t:'Clear the cluttered clause, close the clumsy clash.',c:'orig',d:4,tg:['/kl/','/kr/','/z/','/ʃ/'],why:'Five /kl/ onsets ending on three different codas. Trains the velar-plus-lateral onset in isolation from its usual /kr/ neighbour.'},
{t:'Vivid vocal value, verified and varied.',c:'orig',d:4,tg:['/v/','/f/','/d/','/r/'],why:'/v/ is a voiced labiodental — the folds vibrate while the lip and teeth stay in light contact. Seven of them builds a sound most speakers produce weakly.'},
{t:'Threaded thoughts thread through thickening thickets.',c:'orig',d:5,tg:['/θr/','/θ/','/ð/','/kt/'],why:'Written specifically for /θr/, which the classic repertoire under-trains. Six instances with no /s/ nearby to lean on.'},
{t:'Precise pauses persuade; padded pauses provoke.',c:'orig',d:4,tg:['/pr/','/p/','/z/','/s/'],why:'Doubles as a meaning drill — the sentence describes what this app measures. /pr/ and /p/ alternating with sibilant codas throughout.'},
{t:'Drop the drone, drive the drum, draw the drawn-out drawl down.',c:'orig',d:5,tg:['/dr/','/d/','/n/','/l/'],why:'Seven /dr/ onsets. The voiced alveolar stop plus rhotic is aerodynamically awkward and is the first cluster to blur when a speaker is tired.'},
{t:'Low tone, slow tone, whole tone — hold the whole low slow tone.',c:'orig',d:4,tg:['/l/','/t/','/əʊ/','/sl/','/hw/'],why:'Dark /l/ before and after the same vowel, seven times. Doubles as a pitch drill: say it on one held note and the articulation problem separates cleanly from the pitch problem.'}
];
</script>
