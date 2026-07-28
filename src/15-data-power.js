<script>
/* ============================================================
   POWER & PSYCHOLOGY
   Original curriculum written for this app. Draws on the
   established persuasion-science literature (Cialdini,
   Kahneman & Tversky, negotiation research, status theory)
   and on the classical strategy tradition, organised into an
   original taxonomy. Every principle is paired with the tone
   that actually delivers it, the way it fails, and the
   counter-move for when it is used on you.
   ============================================================ */
'use strict';

var POWER_INTRO = {
title:'Read this before the rest of it',
body:'Three things, and then the material.\n\n**Most of this is defensive.** These are patterns that reliably move human behaviour. Learning them lets you use some of them. It lets you *notice* all of them. The counter-move at the end of each entry is the more valuable half of the entry, and if you only ever read those you will still come out ahead.\n\n**Every principle here has an honest version and a dishonest one, and the technique is identical in both.** The difference is whether the thing you are saying is true. A takeaway you mean is the strongest move in selling. A takeaway you do not mean is the cheapest trick in it — and people detect the difference in about two seconds, almost always from tone rather than content. That is why this section lives inside a tonality app instead of next to one.\n\n**Strategy decides what you say. Tone decides what it means.** Run any of these with the wrong tone and it inverts: conviction becomes arrogance, candour becomes weakness, scarcity becomes desperation, warmth becomes ingratiation. That is why every entry names a tone and links straight to the mic. Reading this section without drilling it is how people end up with a vocabulary for power and no ability to produce it.'
};

var POWER_CHAPTERS = {
status:  {name:'Status & Position',  c:'var(--vi)', blurb:'Status is not a personality trait. It is a set of behaviours — how fast you respond, how much you explain, who moves first, what you do with silence — and every one of them is trainable. Most people leak status through their voice before they open their mouth about anything substantive.'},
frame:   {name:'Frame Control',      c:'var(--acc)',blurb:'A frame is the unstated agreement about what kind of conversation this is. Whoever sets it controls what counts as a reasonable request, a fair price, and a good outcome. Frames are almost never argued about openly, which is exactly why they decide everything.'},
influence:{name:'The Influence Engine',c:'var(--cy)', blurb:'The reliably-replicated findings on why people say yes. This is the part with the strongest evidence base and the most abuse. Learn the mechanisms so you can build with them — and so you can feel them operating on you in real time.'},
bias:    {name:'How Decisions Break',c:'var(--pk)', blurb:'People do not evaluate options; they evaluate whichever framing arrived first, against whatever reference point they happened to be carrying. Understanding the systematic ways judgement fails is what separates persuasion from luck.'},
reading: {name:'Reading the Room',   c:'var(--ok)', blurb:'Almost all useful information in a conversation arrives in the channel nobody is monitoring — the pause before an answer, which question gets a shorter response, who goes quiet. This chapter is about noticing.'},
self:    {name:'Self-Command',       c:'var(--no)', blurb:'The hardest chapter and the one that decides the others. Every technique in this app fails under emotional dysregulation. Composure is not a temperament; it is a set of specific, drillable behaviours performed under pressure.'}
};

var PRINCIPLES = [
/* ---------------- STATUS ---------------- */
{ch:'status', n:'Status is a behaviour set, not a trait',
 idea:'Watch a room and you can rank it in ninety seconds without hearing a word of content. High status behaviours: slower movement, less explanation, comfort with silence, willingness to be still. Low status behaviours: rapid nodding, rising terminals, over-explaining, filling gaps, apologising for taking time. None of these are personality. All of them are trainable, and voice carries most of them.',
 sales:'The rep who explains their own question ("I was just wondering, and feel free not to answer, but I was curious whether…") has lost the frame before the prospect has said anything. Ask the question. Stop. Wait.',
 tone:'unbothered', toneWhy:'Unbothered. Same pitch, same volume, same pace as your previous line. The absence of change under pressure is what reads as status.',
 fails:'Performed high status. Deliberate slowness with nothing behind it reads as smugness, and it invites someone to test you.',
 counter:'When someone is running high-status behaviours hard, check whether they have the substance to back it. Status behaviours are cheap; the knowledge underneath them is not.'},

{ch:'status', n:'Never outrank the person who has to approve you',
 idea:'Demonstrated competence is an asset right up until it becomes a threat. The moment someone with authority over an outcome suspects you want their position, your ability stops being useful to them and starts being a thing they manage. The skill is being visibly excellent at the work and visibly uninterested in the chair.',
 sales:'The buyer is the authority on their own business; you are the authority on your domain. Confusing the two is the most common way a smart salesperson loses a deal — by winning an argument in front of the person who signs.',
 tone:'sincerity', toneWhy:'Utter Sincerity keeps expertise from reading as superiority. The drop in energy after a confident claim is what makes the competence safe to be near.',
 fails:'Performed modesty. False humility is more insulting than arrogance, because it assumes they cannot detect it.',
 counter:'When someone defers to you conspicuously, ask what they want. Genuine respect does not have to be demonstrated that hard.'},

{ch:'status', n:'Availability sets your price',
 idea:'Unlimited supply of anything drives its perceived value toward zero, and attention is not an exception. Continuous instant availability recalibrates people downward, not because they are calculating but because scarcity is one of the inputs to how value is estimated.',
 sales:'Response time is a signal whether you intend it as one or not. The rep who replies in nine seconds at eleven at night has communicated something about their pipeline.',
 tone:'scarce', toneWhy:'Quiet Scarcity. Voiced, not whispered — keep the fold vibration or you lose every ounce of authority in the line.',
 fails:'Artificial unavailability. Being hard to reach when you demonstrably have nothing on is theatre, and it plays as theatre.',
 counter:'Judge people on responsiveness when it matters, not responsiveness in general. Some of the best are slow at small things.'},

{ch:'status', n:'Whoever chases, concedes',
 idea:'Initiating is not weakness — but *chasing* is, because repeated unreciprocated pursuit prices your own time in public. The dynamic is structural rather than psychological: each additional follow-up transmits that the alternatives are worse than they were the day before.',
 sales:'Two passes at an objection, then a booked follow-up and genuine release. A third pass produces a refund, not a sale. The math on this is unambiguous and every experienced closer knows it.',
 tone:'takeaway', toneWhy:'The Takeaway. Flat, unemotional, low. Only run it when the disqualification is real — a fake one teaches them everything else was technique too.',
 fails:'Passivity dressed as strategy. Waiting is not a plan; it is what you do when you do not have one.',
 counter:'Notice when you are chasing and name it to yourself. Then decide, deliberately, whether the thing is worth the frame cost. Sometimes it is.'},

{ch:'status', n:'Be load-bearing rather than liked',
 idea:'Being liked is pleasant and structurally fragile. Being necessary is uncomfortable to build and extremely durable. The test is whether your absence would register as a change in mood or as a hole in the operation.',
 sales:'The strongest commercial position is not cheapest or best. It is embedded. Once you are inside a workflow, price stops being the conversation.',
 tone:'absolute', toneWhy:'Absolute Certainty — once per conversation, on the single load-bearing claim. Low, narrow, hard-stopped.',
 fails:'Manufacturing dependency by hoarding knowledge. It works for about a year and it is why people eventually leave.',
 counter:'Ask what happens if this person or supplier disappears on Monday. If nobody can answer, you have a concentration risk rather than a partnership.'},

{ch:'status', n:'Say less than you want to',
 idea:'Past a low threshold, volume of speech and perceived authority move in opposite directions. One sentence and a stop reads as settled. Four sentences reads as building a case — which implies the case needed building.',
 sales:'Every additional sentence after a close is a new surface for a new objection. The most expensive habit in selling is answering the question and then continuing past the answer.',
 tone:'sl_close', toneWhy:'No Big Deal, then silence. The flat delivery plus the full stop is the entire mechanism. Neither works without the other.',
 fails:'Brevity without warmth reads as contempt. Short and cold is a different thing from short and settled.',
 counter:'When someone is conspicuously brief, resist filling it. Match their brevity and see who moves first.'},

/* ---------------- FRAME ---------------- */
{ch:'frame', n:'Set the time frame first',
 idea:'Whoever states the duration owns the shape of the interaction. Announcing a limit at the start is the cheapest authority move available, and — counter-intuitively — it is received as respect rather than as control.',
 sales:'"I have got you for about thirty minutes, let us use them properly" does four things at once: sets authority, signals respect, creates mild urgency, and licenses you to redirect later without it being rude.',
 tone:'certainty', toneWhy:'Certainty / Transition. Low mean pitch, wide range, clean falling terminal. Calm, not brisk.',
 fails:'Announcing a limit and then blowing through it. You have now demonstrated that your stated commitments are soft.',
 counter:'When someone sets a tight frame, ask what happens if you need longer. The answer tells you whether it was real or positioning.'},

{ch:'frame', n:'Ask for the licence before you use it',
 idea:'Directness without permission reads as an attack. The identical sentence, after "can I be completely straight with you?", reads as courage. The permission costs four seconds and changes the entire reception of everything afterwards.',
 sales:'Every blunt thing you say at minute forty cashes a cheque written in the first two minutes. Reps who skip the licence and then get direct are heard as aggressive; reps who set it are heard as honest.',
 tone:'invite', toneWhy:'The Reasonable Ask. Rising terminal, light, quick, slightly softened. One rise, then return to falls.',
 fails:'Asking for the licence and then not using it. You have set up a confrontation and delivered a compliment; they notice.',
 counter:'When asked for permission to be blunt, say yes and then hold them to it. Most people flinch.'},

{ch:'frame', n:'Disqualify openly and early',
 idea:'Stating that not everyone is a fit inverts the direction of pursuit. It also makes every subsequent positive claim more credible, because you have already demonstrated a willingness to say no.',
 sales:'"There are people we cannot help, and I would rather find that out in the first ten minutes than the last." This single sentence does more for a conversation than any amount of rapport-building.',
 tone:'takeaway', toneWhy:'The Takeaway, in its honest use. Flat, matter-of-fact, no emotional colour at all.',
 fails:'Disqualification as a move. If you never actually disqualify anyone, the frame is decorative and experienced buyers spot it.',
 counter:'Ask them to describe someone they turned away recently. A real answer arrives immediately and with specifics.'},

{ch:'frame', n:'A reason they give you outranks a reason you give them',
 idea:'A conclusion you supply is a claim they can argue with. A conclusion they supply is a position they now have to defend — to you, and more importantly to themselves. This is the single highest-leverage idea in the entire discipline.',
 sales:'"And why do you feel that way?" is the most valuable question in a close, because whatever comes out of their mouth is the sentence you use for the rest of the conversation. Ask it, then say nothing — adding "because for me the biggest thing is…" contaminates the answer permanently.',
 tone:'probe', toneWhy:'The Gentle Probe. Four words, then silence. The shorter the probe, the more they fill.',
 fails:'Extracting a reason and then arguing with it. You asked; you have to accept the answer or the question was fake.',
 counter:'When you notice you are being asked to build someone else\'s argument, give the honest answer anyway. The technique works because honesty is useful to you too.'},

{ch:'frame', n:'Name inaction as a choice',
 idea:'Most people experience doing nothing as neutral — as the absence of a decision rather than one of the options. Pricing it is what makes the comparison honest, and it is usually the only comparison that matters.',
 sales:'"There is no version of this where you do not decide. Waiting is a decision, it just does not feel like one." Then stop and let the arithmetic happen in their head, not yours.',
 tone:'consequence', toneWhy:'Consequence / Emotional Drop. The lowest, slowest, quietest tone in the system. Underplay it — the content is heavy enough on its own.',
 fails:'Manufacturing consequences that will not occur. It works once and is remembered for years.',
 counter:'Check whether the stated cost of waiting is real or rhetorical. Ask for the number.'},

{ch:'frame', n:'Hold one frame per conversation',
 idea:'Frames are almost never argued about openly — they are established and then either maintained or abandoned. Switching mid-conversation is what people notice, and what they read as either confusion or manipulation.',
 sales:'If you opened as a peer working something out together, you cannot close as a vendor asking for the order. The gear change is audible and it undoes everything the first frame bought you.',
 tone:'nq_neutral', toneWhy:'Detached Neutral is the most sustainable frame because it costs nothing to hold. High-energy frames are expensive and they slip.',
 fails:'Rigidity. Holding a frame that has stopped fitting the situation is worse than switching.',
 counter:'Notice the moment a frame changes. That moment is almost always where the real conversation starts.'},

{ch:'frame', n:'Two yeses beat one whether',
 idea:'A choice presented inside a frame is accepted far more readily than a choice about the frame. "Which of these two" is a materially easier question than "whether at all" — and both produce a decision.',
 sales:'"Paid in full or a plan — which is easier for you?" The most reliable structural move in closing, and it works only after a genuine yes. Before one, it is transparent and it costs you the deal.',
 tone:'sl_presup', toneWhy:'Presupposing. Even, calm, flat-to-falling, unhurried. Any energy at all and it reveals itself as a technique.',
 fails:'The false choice. Two options that are obviously the same insults them.',
 counter:'When you find yourself choosing between options, step back one level and check whether you agreed to the category.'},

/* ---------------- INFLUENCE ---------------- */
{ch:'influence', n:'Reciprocity',
 idea:'People feel a real obligation to return a favour, and it is disproportionate to the favour\'s size. The effect is strongest when the gift is unexpected, personalised and given before anything is asked for. Personalisation matters most of the three.',
 sales:'Give something genuinely useful before any ask — a specific piece of advice they can act on today, not a brochure. The obligation is a side effect; the usefulness has to be real or it inverts.',
 tone:'warm', toneWhy:'Genuine Warmth. Wide melodic range rather than raised register — raising your whole pitch sounds anxious, widening your movement sounds glad.',
 fails:'Manufacturing obligation with something worthless. People price a gift accurately and resent being invoiced for a cheap one.',
 counter:'Accept the gift and make the decision separately. Noticing the obligation is most of the way to neutralising it.'},

{ch:'influence', n:'Commitment and consistency',
 idea:'Once a person states a position they defend it — to others and, more powerfully, to themselves. Commitments that are voluntary, effortful and stated aloud are dramatically stickier than ones that are private or coerced.',
 sales:'The double-confirm — a yes, then "are you sure?" — exists for exactly this reason. It converts a polite agreement into a defended position, which is what survives the drive home and the conversation with a partner.',
 tone:'nq_challenge', toneWhy:'Respectful Pressure. Slow, low, firm, no increase in volume. The tone of someone on their side who is not letting them off the hook.',
 fails:'Trapping someone on a technicality of something they said forty minutes ago. It produces compliance and resentment in the same instant.',
 counter:'Give yourself explicit permission to change your mind. "I said that before I knew X" is a complete and sufficient sentence.'},

{ch:'influence', n:'Social proof',
 idea:'Under uncertainty people look sideways rather than forward. The effect is strongest when the referenced others are *similar* — a peer\'s behaviour outweighs an expert\'s recommendation for most everyday decisions.',
 sales:'Specific and similar beats impressive and distant. Someone in their exact position, three months ago, with a name and a number, beats a wall of enterprise logos.',
 tone:'c_clinical', toneWhy:'Clinical. Level, even, no colour. Proof delivered enthusiastically reads as marketing; delivered flatly it reads as fact.',
 fails:'Fabricated or unrepresentative proof. One phone call destroys it permanently.',
 counter:'Ask about the ones that did not work. A real answer arrives with detail; an absent answer is the answer.'},

{ch:'influence', n:'Liking',
 idea:'We say yes to people we like, and liking is driven by similarity, genuine specific compliments, and cooperation toward a shared goal — roughly in that order of strength.',
 sales:'Find the real similarity rather than the manufactured one, and give one specific compliment about something they *chose* rather than something they were given. Complimenting a decision is flattery that survives scrutiny.',
 tone:'nq_playful', toneWhy:'Playful. Light, quick, slightly raised, usually rising. Use it early and retire it — playfulness in the consequence section is disqualifying.',
 fails:'Mirroring so obviously it becomes mimicry. Prosodic entrainment works because it is unconscious; performed, it reads as mockery.',
 counter:'Notice when you like someone very quickly. It is not necessarily wrong, but it is worth knowing it happened.'},

{ch:'influence', n:'Authority',
 idea:'Credentials, confident delivery and the visual trappings of expertise all shift compliance — and they work largely independently of actual competence. Which is exactly why the counter-move here matters more than the technique.',
 sales:'Establish authority through specificity, not assertion. Someone who knows the precise failure rate, the actual timeline and the real constraint does not have to claim expertise; the numbers do it.',
 tone:'absolute', toneWhy:'Absolute Certainty. Low mean pitch, wide range, hard falling terminals. Most people flatten to sound authoritative, which just sounds dead — range and register are independent.',
 fails:'Borrowed authority. Name-dropping has no load-bearing capacity and collapses under a single follow-up question.',
 counter:'Ask a specific technical question inside their claimed domain. Real expertise answers immediately or says "I do not know" immediately. Only the fake version hedges.'},

{ch:'influence', n:'Scarcity',
 idea:'Losses loom roughly twice as large as equivalent gains. Framing something as about to be lost is measurably more motivating than framing the identical thing as available to be gained.',
 sales:'Only ever state limits you could prove. If you would not put it in writing, do not put it in your voice — buyers now default to assuming deadlines are fake, so a real one has to be delivered flatly enough to be believed.',
 tone:'scarce', toneWhy:'Quiet Scarcity. Dropped, slowed, quiet but fully voiced. Sotto voce, never actual whisper — a true whisper has no pitch and loses all authority.',
 fails:'The manufactured deadline. The single most trust-destroying pattern in commercial communication.',
 counter:'Ask what happens if you miss it. The answer is usually "nothing much", and asking costs nothing.'},

{ch:'influence', n:'Unity',
 idea:'The strongest form of liking. Not "this person is similar to me" but "this person is one of us" — shared identity rather than shared preference. Family, place, having done the same difficult thing.',
 sales:'Find the genuinely shared category and then let it sit there without commenting on it. Naming it out loud converts it into a technique.',
 tone:'c_conspir', toneWhy:'Conspiratorial. Dropped, close, quick, quiet. Only ever share things that reflect well on the absent party — conspiratorial criticism makes them wonder what you say about them.',
 fails:'Claiming an in-group you are not in. Detected immediately by anyone actually in it, and unrecoverable.',
 counter:'Shared identity is real and it is not an argument. You can feel the kinship and still evaluate the offer.'},

{ch:'influence', n:'Concede one real thing',
 idea:'Voluntarily naming a genuine weakness does something no amount of advocacy achieves: it makes everything else more credible. Listeners calibrate on candour — someone who admits one real flaw is assumed to have told the truth about the rest.',
 sales:'Say the bad thing first and plainly. "This is not passive and it does not run itself. If you are not going to do the work, do not join." That sentence sells, precisely because it proves you are willing to lose the deal.',
 tone:'sincerity', toneWhy:'Utter Sincerity. Slower and quieter than the line before it. The drop in energy is what makes it read as true rather than as a move.',
 fails:'The fake flaw. "My weakness is that I care too much" is worse than silence — it demonstrates that you think they are stupid.',
 counter:'Check whether the admitted flaw costs them anything. A concession with no cost is an advertisement.'},

/* ---------------- BIAS ---------------- */
{ch:'bias', n:'Anchoring',
 idea:'The first number mentioned distorts every subsequent judgement — including in people who know about anchoring and are actively trying to resist it. The effect is unusually robust and survives being explained.',
 sales:'Anchor against the cost of the problem rather than against competitors. Comparing your price to another wasted year is a different negotiation from comparing it to another vendor\'s quote.',
 tone:'c_clinical', toneWhy:'Clinical. Numbers delivered as weather. Any emphasis on the figure and you have signalled that you expect a reaction to it.',
 fails:'Absurd anchors, which destroy credibility and reset the negotiation on worse terms than not anchoring at all.',
 counter:'Before entering a negotiation, write your own number down. An anchor you brought with you is much harder to move.'},

{ch:'bias', n:'Loss aversion',
 idea:'The same outcome framed as a loss produces roughly double the behavioural response as framed as a gain. This is the mechanism underneath almost everything called "consequence" work.',
 sales:'Concrete losses only. Not "you could be earning more" but "another twelve months of exactly this, and then this same conversation." The specificity is what makes it land.',
 tone:'consequence', toneWhy:'Consequence / Emotional Drop. Lowest pitch, slowest pace, quietest volume, deep fall into silence.',
 fails:'Fear about things that will not happen. Detected eventually, and it retroactively contaminates everything true you said.',
 counter:'Restate the loss frame as a gain frame and see whether you still care. If the answer changes, the framing was doing the work.'},

{ch:'bias', n:'Framing',
 idea:'Logically identical information produces different decisions depending on presentation. Ninety percent success and ten percent failure are the same fact and are not the same message.',
 sales:'Choose the frame deliberately and then hold it. Frame-switching mid-conversation is the thing people notice, and it costs more than either frame would have.',
 tone:'sl_obvious', toneWhy:'Implied Obviousness. Deaccent the given clause, re-energise on the pivot. Only ever deaccent things they have already accepted.',
 fails:'Framing that conceals a material fact. That is not framing, it is misrepresentation with better vocabulary.',
 counter:'Restate any claim in the opposite frame before deciding. It takes five seconds and it is remarkably clarifying.'},

{ch:'bias', n:'The endowment effect',
 idea:'People value a thing more once they possess it — or even once they merely imagine possessing it. Ownership is largely psychological and it begins well before any transaction.',
 sales:'Get them handling it, describing it, planning around it. "When you are running this in six weeks, the thing you will notice first is…" installs ownership before purchase, and it is not dishonest as long as the six weeks is real.',
 tone:'sl_presup', toneWhy:'Presupposing. Calm, even, unhurried, falling. Never before a genuine yes — presupposition ahead of agreement is the leading cause of late-stage collapse.',
 fails:'Trials engineered to create sunk cost rather than demonstrate value. Buyers can tell the difference and they remember.',
 counter:'Ask what you would pay for it today if you did not already have it. That is the actual number.'},

{ch:'bias', n:'The open loop',
 idea:'Unfinished tasks occupy memory more than completed ones. An open question is uncomfortable and the mind works to close it — which is why unfinished stories are remembered and resolved ones are not.',
 sales:'Open a loop early and close it late. "I will tell you the one variable that actually mattered, but first I have to show you why every obvious answer is wrong." Then deliver — within a couple of minutes, or it becomes irritation.',
 tone:'intrigue', toneWhy:'Mystery & Intrigue. Dropped pitch, slowed pace, elongation on one sonorant in the key word.',
 fails:'Opening loops you never close. This is the mechanism of clickbait and it burns the audience permanently.',
 counter:'Notice when you are still listening only because something was promised. Ask for it directly.'},

{ch:'bias', n:'The concrete beats the abstract',
 idea:'The mind does not act on categories; it acts on images. A statistic is an argument, a scene is an experience, and only one of them survives the drive home.',
 sales:'"Financial freedom" moves nobody. A specific person in a specific house moves everybody. Build a desired future as an inventory of objects and scenes, never as adjectives.',
 tone:'vision', toneWhy:'Vision / Future Pace. Slow, spacious, wide movement, generous silence. Ask, then stop — the picture forms in the gap, not in your description.',
 fails:'Vividness in place of substance. Once it works; twice they check the numbers.',
 counter:'Convert every vivid claim back into a figure and see whether it survives the translation.'},

{ch:'bias', n:'Sunk cost',
 idea:'Money and time already spent are irrelevant to the next decision and are treated as decisive anyway. The pull is strong enough that people will knowingly continue projects they have already concluded will fail.',
 sales:'Never use this against a buyer — it is the most reliably regretted purchase driver there is, and regret becomes refunds. Do use it on yourself, in reverse, to kill your own dying deals faster.',
 tone:'measured', toneWhy:'Measured Correction. Even, unhurried, no emphasis spike. Deaccent the correction and it lands as information rather than as a rebuke.',
 fails:'"You have already invested so much" is the sentence. It closes deals and produces chargebacks.',
 counter:'Ask what you would do if you were arriving at this situation today, fresh, with the same information. Then do that.'},

/* ---------------- READING ---------------- */
{ch:'reading', n:'The pause before the answer',
 idea:'Latency carries more information than content. A question answered instantly was pre-loaded. A question answered after a long gap touched something. A question answered *faster than the others* is the one they had a script for.',
 sales:'Track which questions get short answers. The short answer is almost always the important one, and it is short precisely because it is defended.',
 tone:'probe', toneWhy:'The Gentle Probe. Two to four words, quiet, flat terminal, then wait. "Say more about that" costs nothing and opens everything.',
 fails:'Over-reading. Sometimes a pause is a phone notification.',
 counter:'When you notice yourself pausing before answering, that is worth your own attention too.'},

{ch:'reading', n:'Read the person before choosing the move',
 idea:'The same technique produces opposite outcomes on different people. Direct challenge builds respect with one type and permanently ends the relationship with another. Failing to identify which one is in front of you is the most expensive unforced error available.',
 sales:'The highest-leverage thirty seconds of any conversation is the part where you work out whether this person wants warmth or wants efficiency. Give the wrong one and everything afterwards is uphill.',
 tone:'reflect', toneWhy:'The Mirror. Match their register, then hand their own words back one beat slower. Matching before leading is how you find out who you are speaking to.',
 fails:'Typecasting. People are not four categories, and treating them as such is its own failure of reading.',
 counter:'Watch how someone treats a person who cannot help them. That is the read that matters.'},

{ch:'reading', n:'Silence in a group is a position',
 idea:'Group resistance almost always has a single origin, and it is rarely the person doing the talking. The quiet one in a multi-stakeholder decision is usually holding the actual objection and declining to spend social capital on it publicly.',
 sales:'Find them and give them a private route to state the objection where they do not have to defend it in front of colleagues. That conversation is the deal.',
 tone:'confront', toneWhy:'Direct Confrontation — with permission first. Ask for the licence, then be completely direct. Low, level, no increase in volume.',
 fails:'Targeting the wrong person, which manufactures the opposition you were trying to prevent.',
 counter:'In any group decision, ask explicitly who has not spoken yet. It costs nothing and it changes outcomes.'},

{ch:'reading', n:'Agreement is not engagement',
 idea:'A person who agrees with everything is not close to buying; they are close to leaving. Agreement is free and tells you almost nothing. Disagreement costs something to produce, which is precisely what makes it a signal.',
 sales:'The conversation with no friction is the conversation that ghosts. If nobody has pushed back on anything by the halfway mark, ask something they can disagree with.',
 tone:'skeptic', toneWhy:'Skeptical Disbelief, gently. Rise-fall-rise, unresolved, quiet. Skepticism at volume is contempt; skepticism at low volume is curiosity.',
 fails:'Manufacturing conflict to test engagement. It works, and it costs you the relationship you were testing.',
 counter:'When you notice yourself agreeing with everything, work out whether you actually agree or have simply stopped participating.'},

{ch:'reading', n:'Find the one thing they actually care about',
 idea:'Everyone has a single dominant motivation in any given decision, and it is rarely the one they lead with. Finding it is worth more than every other piece of information combined, because everything else negotiates around it.',
 sales:'"Of everything I have shown you, what is the one piece that actually changes things for you?" That answer tells you which value proposition to defend for the rest of the conversation, and it makes a generic offer specific.',
 tone:'probe', toneWhy:'The Gentle Probe. Short, quiet, flat. Then nothing, for as long as it takes.',
 fails:'Weaponising a vulnerability. There is a bright line between understanding what someone needs and exploiting what they fear, and it is not a subtle one.',
 counter:'Notice when a conversation keeps returning to the same theme. That is usually someone locating your lever.'},

/* ---------------- SELF ---------------- */
{ch:'self', n:'Composure is leverage',
 idea:'In any exchange, whoever reacts has transferred both information and control. Provocation is a test, and the only winning response is a boring one. This is not about suppressing emotion; it is about delaying its expression by one breath.',
 sales:'When an objection arrives with heat, drop your own energy rather than matching it. Prosodic entrainment means they will follow you down within two or three exchanges — you do not have to ask them to calm down, and asking makes it worse.',
 tone:'c_soothe', toneWhy:'Soothing. Slower and quieter than them, with absolutely zero acceleration. Never name their emotion as a problem.',
 fails:'Composure as coldness. Unbothered with a warm face is authority; unbothered with a flat face is contempt.',
 counter:'When you feel a reaction rising, delay it by one full breath. That delay is the entire skill and it is trainable.'},

{ch:'self', n:'Do not join a fight that is not yours',
 idea:'Being pulled into someone else\'s conflict costs the neutrality that made you useful to both parties. Independence has an option value that is hard to see until you have spent it.',
 sales:'Never criticise a competitor. The moment you do, the buyer stops seeing an advisor and starts seeing a combatant with an interest.',
 tone:'measured', toneWhy:'Measured Correction. Even, unhurried, no spike. Deaccent the corrected item so it lands as clarification instead of a swipe.',
 fails:'Neutrality on things that genuinely matter. Refusing to take a position on basic decency is a position, and it is read as one.',
 counter:'Ask what happens to the person recruiting you if you decline. If the answer is "nothing", it was never your fight.'},

{ch:'self', n:'Concentrate the force',
 idea:'Diffuse effort produces diffuse results. Almost every underperformance problem at every scale is a concentration problem rather than an effort problem, and it is consistently misdiagnosed as the second.',
 sales:'One drill per week, not ten. A person changes one behaviour at a time. A coaching session that produces fifteen findings produces zero changes.',
 tone:'command', toneWhy:'Command. Short, complete, no hedges, steepest fall in the system. One per hour gets obeyed; one every four minutes gets ignored.',
 fails:'Concentration on the wrong thing, which is intensified error.',
 counter:'Ask what has been deprioritised. If nothing has, then nothing is concentrated.'},

{ch:'self', n:'Half-commitment is worse than none',
 idea:'Tentative action produces the costs of acting and the results of not acting, and leaves a live problem with a grievance attached. Observers read hesitation as information about the quality of the idea — and they are usually right.',
 sales:'A close delivered apologetically has already failed. The ask should be the most ordinary sentence in the conversation, delivered flat, followed by silence.',
 tone:'sl_close', toneWhy:'No Big Deal. Casual, slightly quick, no emphasis spike, then a complete stop.',
 fails:'Boldness without preparation, which is recklessness with better branding.',
 counter:'Separate confidence about the decision from confidence about the outcome. Only the first is required to act.'},

{ch:'self', n:'You are allowed to rebuild the instrument',
 idea:'Most adults are running an identity assembled by accident before twenty-five, including how they sound. The deliberate revision of that — voice, pace, terminal habits, default tone — is the single most under-used freedom available, and it is the entire premise of this app.',
 sales:'Nobody in the room has a natural gift for this. They learned a skill you have not learned yet. That is the whole difference, and it is the truest and safest sentence in selling.',
 tone:'certainty', toneWhy:'Certainty / Transition. Calm, low, wide, clean fall. Delivered with any hype at all it becomes a motivational poster.',
 fails:'Reinvention as avoidance. Changing the presentation while leaving the behaviour intact fools nobody for long.',
 counter:'Judge a new version on six months of behaviour, not on the announcement of it.'},

{ch:'self', n:'Have no fixed style',
 idea:'The last principle undoes the others. A recognisable pattern is a predictable one, and a predictable one gets defended against. The point of acquiring a set of tools is to stop needing any particular one.',
 sales:'This app contains two contradictory tonal systems — one loud and outcome-attached, one quiet and detached. Both work. Neither works always. The skill is not choosing a philosophy; it is holding both and reading which one the room needs.',
 tone:'neutral', toneWhy:'Neutral / Curious. The tone with no colour is the one you return to between all the others. Having a resting position is what makes range possible.',
 fails:'Formlessness as an excuse for never having learned anything. You cannot transcend techniques you never acquired.',
 counter:'When you cannot predict someone, stop trying to. Deal with what is actually in front of you.'}
];

/* ---------------- influence quick-reference ---------------- */
var INFLUENCE = [
{n:'Reciprocity',
 use:'Give something genuinely useful before any ask — a specific piece of advice they can act on today, not a brochure. The obligation is a side effect; the usefulness has to be real.',
 abuse:'Manufacturing obligation with something worthless. People price a gift accurately and resent being invoiced for a cheap one.'},
{n:'Commitment & consistency',
 use:'Get the small yes first, and get it in their own words. Voluntary, effortful, spoken-aloud commitments are dramatically stickier than private ones.',
 abuse:'Trapping someone on a technicality of something they said forty minutes ago. Produces compliance and resentment simultaneously.'},
{n:'Social proof',
 use:'Specific and similar beats impressive and distant. A peer three months ahead of them outweighs a wall of enterprise logos.',
 abuse:'Fabricated or unrepresentative proof. One phone call destroys it permanently.'},
{n:'Liking',
 use:'Find the real similarity, and compliment something they chose rather than something they were given. Complimenting a decision survives scrutiny.',
 abuse:'Mirroring so obviously it becomes mimicry. Entrainment works because it is unconscious.'},
{n:'Authority',
 use:'Establish it through specificity rather than assertion. Someone who knows the precise failure rate does not have to claim expertise.',
 abuse:'Borrowed authority. Name-dropping collapses under one follow-up question.'},
{n:'Scarcity',
 use:'Only limits you could prove in writing. Real capacity, real windows, stated flatly and quietly.',
 abuse:'The manufactured deadline — the most trust-destroying pattern in commercial communication.'},
{n:'Unity',
 use:'Find the genuinely shared category and let it sit there without naming it. Naming it converts it into a technique.',
 abuse:'Claiming an in-group you are not in. Detected instantly by anyone actually in it.'},
{n:'Loss aversion',
 use:'Concrete losses only. "Another twelve months of exactly this" rather than "you could be earning more".',
 abuse:'Fear about things that will not happen. Retroactively contaminates everything true you said.'},
{n:'The endowment effect',
 use:'Get them handling it, describing it, planning around it. Ownership begins well before the transaction.',
 abuse:'Trials engineered to create sunk cost rather than demonstrate value.'},
{n:'Anchoring',
 use:'Anchor against the cost of the problem, not against a competitor\'s quote. Different negotiation entirely.',
 abuse:'Absurd anchors, which reset the negotiation on worse terms than not anchoring at all.'},
{n:'Framing',
 use:'Choose the frame deliberately and hold it. Ninety percent success and ten percent failure are the same fact and not the same message.',
 abuse:'Framing that conceals a material fact. That is misrepresentation with better vocabulary.'},
{n:'The open loop',
 use:'Open early, close late, deliver within a couple of minutes. Unfinished business occupies memory; finished business does not.',
 abuse:'Loops you never close. The mechanism of clickbait, and it burns the audience.'}
];

/* ---------------- the frame rack ---------------- */
var FRAMES = [
{n:'The Time Frame', d:'Whoever states the duration owns the shape of the interaction. The cheapest authority move available, and it is received as respect rather than control.',
 line:'I have got you for about thirty minutes. Let us use them properly.', tone:'certainty'},
{n:'The Permission Frame', d:'Directness without permission reads as an attack. The same sentence, four seconds after asking for the licence, reads as courage.',
 line:'Can I be completely straight with you about something?', tone:'invite'},
{n:'The Disqualification Frame', d:'Stating openly that not everyone is a fit inverts the pursuit, and makes every subsequent positive claim more credible.',
 line:'There are people we cannot help, and I would rather find that out in the first ten minutes than the last.', tone:'takeaway'},
{n:'The Conditional Frame', d:'Making the next stage contingent rather than assumed removes pressure and, paradoxically, increases the rate at which people proceed to it.',
 line:'If it turns out we can help, I will show you exactly how. If not, I will tell you that too.', tone:'nq_neutral'},
{n:'The Expert Frame', d:'Held through specificity, never through assertion. Numbers do the work that adjectives cannot.',
 line:'About sixty-one percent of them work. The rest fail for one of three reasons, and I can tell you which one applies to you.', tone:'c_clinical'},
{n:'The Peer Frame', d:'Deliberately declining the vendor position. Not below them, not above them — two professionals working out whether a thing makes sense.',
 line:'Let us work out together whether this is worth doing.', tone:'nq_neutral'},
{n:'The Reversal Frame', d:'Handing the evaluation back. Powerful, and the easiest one to overplay into arrogance.',
 line:'What makes you think this is right for you?', tone:'skeptic'},
{n:'The Cost-of-Inaction Frame', d:'Most people experience doing nothing as neutral. Naming its price is what makes the comparison honest.',
 line:'There is no version of this where you do not decide. Waiting is a decision, it just does not feel like one.', tone:'consequence'},
{n:'The Both-Doors Frame', d:'Two clearly-drawn futures, and they choose. Forces the comparison into the open instead of leaving it a vague feeling.',
 line:'Both of those are available to you. You only get one. Which do you want?', tone:'vision'},
{n:'The Ownership Frame', d:'Assigning responsibility without accusation. They must name it — a reframe you deliver is a claim they can argue with.',
 line:'So who is actually responsible for that not changing?', tone:'challenge'}
];
</script>
