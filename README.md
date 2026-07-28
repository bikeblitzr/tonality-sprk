# The Tonality Gym

An endless training system for voice, tone, emphasis, articulation and the psychology behind them. It listens to you through the microphone and grades what you actually produce against measurable acoustic targets.

Single self-contained HTML file. No build step required to run it, no dependencies, no backend, no analytics. Everything is processed locally in the browser using the Web Audio API — **no audio is ever uploaded, stored on a server, or sent anywhere.** Progress lives in `localStorage` and can be exported as JSON.

---

## What's in it

**18 drill modes**

| Mode | What it measures |
|---|---|
| The Warmup | 14-step mechanical routine — straw phonation, lip trills, DDK racks, breath benchmark |
| Tone Lab | Full acoustic grade against a tone's target profile: pace, range, terminal, dynamics, silence |
| Terminal Trainer | Pitch move over the final syllables, in semitones. Fall / rise / level on command |
| Monotone Killer | 80th-percentile pitch span in semitones, with the mean pitch held down |
| Pace Gym | Words per minute against a target band, with a live pacer |
| Pause Discipline | Marked pause points measured to the millisecond |
| Volume Floor | Final-syllable intensity vs utterance average — the anti-trailing-off drill |
| Articulation Gym | 230 tongue twisters by target phoneme, with a metronome speed ladder |
| Emphasis Shift | One sentence, stress moves word by word, meaning changes each time |
| Contour Tracer | Draw a target pitch shape; match it with your voice and see your line overlaid |
| Script Runner | Full annotated scripts in teleprompter mode, graded line by line |
| Tone Roulette | Random line, random tone, no preparation |
| A/B Compare | Same sentence, two tones, played back to back |
| Ear Training | The app plays your own recordings back and asks which tone you produced |
| The Defect Lab | Produce uptalk, monotone, trailing off, hedging and fry *deliberately*, then the correction |
| Cold Read | Unseen text, random tone, 60 seconds |
| Weak Spots | Spaced-repetition queue over your lowest and stalest tone masteries |
| The Gauntlet | 12 mixed-mode challenges, one attempt each, one score |

**72 tones across 10 families** — the seven core emotional intents, authority, warmth, pressure, curiosity, the Straight Line system, the quiet/NEPQ system, a 20-tone emotional colour wheel, broadcast tones, and a defect lab. Each carries a measurable acoustic target, a physical cue that produces it reliably, the way it fails when overdone, the antidote, and its own line pool.

**230 tongue twisters** in 12 categories by target phoneme, each with the phonetic reason it is hard.

**The Codex** — nine theory chapters: the eight parameters, the complete emphasis ruleset, the terminal map, the pause taxonomy, the defect catalogue, practice protocol, how the channel changes the physics, and where the ethical line sits.

**Power & Psychology** — 39 principles across six chapters (status, frame control, influence, decision biases, reading the room, self-command). Every one paired with the tone that delivers it, how it fails, and the counter-move for when it is used on you.

**Progression** — 50 levels, per-tone mastery with time decay, streaks, 27 achievements, and a 90-day path.

---

## The measurement layer

Scoring is against figures from the phonetics and speech-science literature rather than invented ones:

- **Pace** — 148–174 wpm persuasive band; rushing flagged above 6.5 syll/s with pause fraction under 10%
- **Pitch span** — 80th-percentile span in semitones. Under 4 st = monotone, 6–10 = engaged, over 14 = theatrical. Percentile spans, never min/max, because naive measurement inflates range by 40–120%
- **Terminal** — a confident declarative falls 4–7 st from nuclear peak to phrase-final baseline; must exceed 3 st to be heard as a fall at all
- **Pause** — 200 ms perceptual floor, 400–700 ms sentence, ≥1500 ms after asking a question
- **Dynamics** — target 8–12 dB phrase-level range; under 4 dB flagged flat
- **Volume floor** — final syllable within 4 dB of utterance mean (this is what separates a correct falling terminal from trailing off)

Pitch tracking uses the McLeod / normalised-square-difference method with parabolic peak refinement, octave-error correction against a running median, and a 5-point median filter. All pitch metrics are speaker-normalised to semitones, so the targets are identical regardless of natural register.

---

## Running it

Open `index.html`. That's it.

Microphone access requires a secure context — `https://` or `localhost`. Opening the file directly from disk works in Chrome but not reliably in Safari.

```bash
npm run dev     # rebuild + serve locally
npm run build   # concatenate src/ into index.html
```

## Editing it

`index.html` is generated. Edit the parts in `src/` and run `node build.mjs` — files are concatenated in filename order.

```
src/
  00-head.html          doctype, meta, full stylesheet
  01-body.html          shell markup
  10-data-tones.js      72 tones with acoustic targets
  11-data-twisters.js   230 twisters
  12-data-lines.js      emphasis tables, focus rules, pause drills, contours, line pools, scripts
  14-data-codex.js      theory chapters
  15-data-power.js      psychology principles, influence reference, frame rack
  16-data-curriculum.js levels, ranks, achievements, 90-day path
  20-audio.js           mic capture, pitch tracking, VAD, scoring
  30-state.js           persistence, XP, mastery decay, spaced repetition
  40-ui-core.js         router, shell, canvases, modal, toasts
  50-drill.js           the stage — all 18 drill modes
  60-views.js           all pages
  90-boot.js            boot + first-run
```

---

## Notes

The training material is original. It draws on the published phonetics and prosody literature for the acoustic targets, on the standard actor/broadcaster warmup tradition and public-domain folk tongue twisters for the articulation gym, and on the established persuasion-science findings for the psychology chapters. The two named sales tonality systems are described as techniques and reconstructed as measurable patterns — all drill lines and commentary are written for this app.
