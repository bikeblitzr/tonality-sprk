# The Tonality Gym

An endless training system for voice, tone, emphasis, articulation and the psychology behind them. It listens to you through the microphone and grades what you actually produce against measurable acoustic targets.

Single self-contained HTML file. No build step required to run it, no dependencies, no analytics. All audio is processed locally in the browser using the Web Audio API — **no audio is ever uploaded, stored on a server, or sent anywhere.** Progress lives in `localStorage` and can be exported as JSON.

An optional Supabase backend adds accounts, cross-device sync and a team dashboard. It is genuinely optional: with no account, and with the backend unreachable, every drill still runs and everything still saves locally.

---

## What's in it

**20 drill modes**

| Mode | What it measures |
|---|---|
| Calibration | Seven steps, nothing scored — noise floor, register, usable range, sibilant separation, and your **flat** baseline |
| Custom Prompt | You give it the call stage and what you are about to say; it names the tone, the nucleus word and the contour, then drills it |
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

## See how this works — the map

A 3D, navigable map of the entire engine, in the rail under *Under the hood*. Roughly **960 nodes** across ten domains, split into two lobes: how a voice is physically produced and measured on one side, how a listener decodes it on the other.

Two layers, merged at runtime:

- an authored knowledge spine — mechanisms, figures from the phonetics and prosody literature, and the rules this app actually applies
- every live dataset in the product, expanded into the same graph: all 72 tones with their recipe, their five target numbers and their failure mode, all 230 twisters with the phonetic reason each is hard, the 39 principles, the codex chapters, the advisor's stages, modifiers and phrasing triggers, the emphasis tables and the drill set

Because the second layer is generated from the same arrays the app runs on, the map cannot drift out of date. Add a tone and it appears in the brain.

Every node carries two things: **what it is**, and **how it helps you**. Click to expand into children, drag to turn, scroll to zoom, search to jump.

Rendered in raw canvas 2D — hand-rolled perspective projection, depth sorting, label collision avoidance and hit testing. No WebGL library, no CDN, no dependency; it works offline and over `file://` like the rest of the app, and holds 60 fps with the full cloud on screen.

---

## Calibration and the flat baseline

Everyone has a different *flat* — the way they sound with no deliberate emphasis at all. A speaker whose unemphasised voice already moves 6 semitones is doing nothing special when a drill measures 6; a speaker whose flat is 1.5 has just travelled four times as far for the same number.

Calibration measures three separate reads — flat, natural, expressive — and stores the distance between them. After that, every result shows two things:

- **The score**, always against the fixed research-backed bands, so numbers stay comparable between people
- **vs your flat**, with a headroom bar showing how far you actually travelled out of the range you demonstrated you have

There is also a **Personal Mode** toggle (off by default, clearly labelled non-comparable) which switches the scoring itself onto bands anchored to your own flat. Terminal inflection is never personalised — a falling terminal is a physical event, not a relative one.

Calibration also narrows the pitch tracker from the full human range down to yours, which is what makes octave errors rare rather than occasional.

---

## Accounts, sync and the team dashboard

Optional, and off until someone signs up. Sign-up takes a username, name, email, phone and a 6-digit PIN — no email verification, no 2FA.

- **Sync** — progress and voice profile upload on a debounce and merge on pull. The merge takes the maximum per counter and per mastery field, so training on a second device can never wipe the first.
- **Telemetry** — one row per rep: tone, drill, score, and the acoustic numbers behind it. Plus fairness flags (when a target looks unreachable for that speaker's measured range) and advisor misses (when someone rejects the tone the Custom Prompt picked). No audio, no transcripts — derived numbers only.
- **Feedback** — a button in the rail writes straight to the account, and falls back to local storage when offline.
- **Admin view** — a student/admin toggle in the header. Admin shows who is active, reps and time per person, the tones the team is weakest at, fairness flags and advisor misses. Row-level security means a non-admin account cannot read another person's rows even if they try.

Schema, policies and the signup trigger are in [`supabase/schema.sql`](supabase/schema.sql).

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

To point it at your own backend, run `supabase/schema.sql` in the Supabase SQL editor and set `CLOUD_CONFIG` at the top of `src/25-cloud.js` to your project URL and **publishable** key. The secret key is never used and must never be put in this file — every query runs client-side under row-level security. Leave `CLOUD_CONFIG` blank and the app runs fully local.

Promote yourself to admin once, after signing up:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Admin accounts get a **Demo controls** section in Settings — unlock every tier regardless of level, set your level directly, or add XP — for showing the whole app to a room without grinding to level 16 first. Level gating is pacing, not security: what actually protects data is row-level security in Postgres, which these controls do not touch. A `DEMO` badge replaces your rank in the HUD while unlock-everything is on, so a demo level is never mistaken for a real one.

## Editing it

`index.html` is generated. Edit the parts in `src/` and run `node build.mjs` — files are concatenated in filename order.

```
src/
  00-head.html          doctype, meta, full stylesheet
  01-body.html          shell markup
  10-data-tones.js      72 tones with acoustic targets
  11-data-twisters.js   230 twisters
  12-data-lines.js      emphasis tables, focus rules, pause drills, contours, line pools, scripts
  13-data-advisor.js    Custom Prompt rules engine — stages, modifiers, triggers, nucleus finder
  14-data-codex.js      theory chapters
  15-data-power.js      psychology principles, influence reference, frame rack
  16-data-curriculum.js levels, ranks, achievements, 90-day path
  17-data-brain.js      the authored knowledge spine behind the map
  20-audio.js           mic capture, pitch tracking, VAD, calibration, scoring
  25-cloud.js           Supabase client — auth, sync, telemetry queue, time tracking
  30-state.js           persistence, XP, mastery decay, spaced repetition, remote merge
  40-ui-core.js         router, shell, canvases, modal, toasts, student/admin toggle
  50-drill.js           the stage — all 20 drill modes
  60-views.js           all pages
  62-views-cloud.js     account, admin dashboard, per-person drill-down
  70-brain.js           the map — graph assembly, 3D layout, canvas renderer
  90-boot.js            boot + first-run

supabase/
  schema.sql            tables, RLS policies, signup trigger, team views
```

---

## Notes

The training material is original. It draws on the published phonetics and prosody literature for the acoustic targets, on the standard actor/broadcaster warmup tradition and public-domain folk tongue twisters for the articulation gym, and on the established persuasion-science findings for the psychology chapters. The two named sales tonality systems are described as techniques and reconstructed as measurable patterns — all drill lines and commentary are written for this app.
