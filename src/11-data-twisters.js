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
{t:'Speak the peak, peak the speak, speak the peak precisely.',c:'orig',d:4,tg:['/sp/','/p/','/k/','/pr/'],why:'The /sp/-/p/ contrast is aspiration only, which English speakers produce unconsciously and cannot easily control on demand.'}
];
</script>
