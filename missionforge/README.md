# MISSIONFORGE 54 — Space Mission Design Game

The submitted game for the NASA Space Apps Challenge 2026, **Space Mission Design Game** challenge. Team Atlas Tech, Sakarya local event.

This folder holds a frozen, self-contained export of the game (`space-mission-design-game.html`, 5.3 MB, all assets inlined). It is recorded here after verification, before any presentation — per the project's delivery rule. The ASTRA FORGE game in `dist/` is untouched.

## This version — v18 (2026-11-15 07:24 Europe/Istanbul)

The opening cinematic is now the user's real AI-generated video clip (Gemini, prompt #1 "THE DOCKING") instead of the drawn station scene:

- **Clip:** capsule + Anfa in the window + lamp beam + station + Earth, trimmed to exactly 5.000 s, audio stripped (silent), 1280×720 h264, 891,647 bytes, loaded at runtime from a base64 text asset in this repo (`missionforge/cine-01-docking.mp4.b64`, fetched from the raw file URL, decoded to a blob) — the clip is stored as text because the GitHub connector only accepts UTF-8 files (binary push is rejected). If the asset cannot load, the drawn intro is the fallback. The trimmed source mp4 (`cine-01-docking.mp4`) is kept with the project locally.
- **Wiring:** `<video id="cine54Video" muted playsinline preload="auto">` full-frame under the existing overlay (tag "MISSIONFORGE 54 — OPENING", title "THE DOCKING", Vera's guest line, "TAP ANYWHERE TO SKIP ▸▸"). Only the intro uses the video; milestone beats are unchanged. 900 ms skip-grace, 5 s timer, tap-anywhere-to-skip, and the `mf54_cine_intro` once-ever gate all kept.
- **Fallback:** if the video errors, its `play()` rejects, or it is not playing within 2 s, the drawn station intro is restored (handlers + timer verified in source; drawn SVG intact). The intro still ends into the live prologue on its own.
- **Verification (independent screenshots, my own eyes):** happy path — the game fetches the `.b64` asset, decodes it to a blob and plays it (blob URL, `currentTime` advancing, `paused` false, `readyState` 4, 1280 wide, muted); frame ~1.5 s after PLAY shows the real video playing with the overlay readable; tap-to-skip lands on the run screen; video ends at 5 s and the game advances on its own; once-ever gate confirmed (second PLAY after reload goes straight to the run screen); run screen renders with a live HUD; zero console/page errors. Failure path — with the asset request aborted, the drawn station intro renders and completes and the game proceeds (only the injected-failure errors). All 3 inline scripts pass node --check. Export 4,157,307 bytes. Note: the first v18 build embedded the clip as a data URI (export 5,344,742 bytes) and its GitHub push was rejected with HTTP 413 (request body too large); the separate-asset rework is the fix, with no quality loss.
- **Caveat:** movement keys showed no visible avatar displacement in one swiftshader-slow probe frame (most plausibly the software renderer crawling, since HUD clocks ticked). Camera follow was proven in v17 and v18 did not touch movement code. Milestone-beat videos (Moon/Mars/Bennu/Europa/Deep Space/Guardian/Echo) are still the drawn beats — only the intro is a real clip so far.

## Previous version — v17, repaired (2026-11-15 06:48 Europe/Istanbul)

Title MISSIONFORGE 54 + Anfa's story, cinematics, recurring problems, gamer-grade movement:

- **Title/hero:** wordmark MISSIONFORGE 54, "Design · Fly · Survive", "ANFA — relief Flight Dynamics Engineer · the only soul aboard"; debrief/export carry "Pilot: ANFA".
- **Story, one event everywhere:** Vera's opening lines, four short crew logs (archived in the Guide, record ending 09:00), and the epilogue all agree — the last crew left on an exploration burn and never came back; completing Deep Space (all five destinations mastered) reveals their fate in the "GUARDIAN" ending, with a condensed version in the Deep Space debrief and the Guide's "Story So Far". Vera is the only voice; her banner appears and auto-hides. Europa echo framed as a candidate, never a beacon. Story in English only, minimal text.
- **Character grows WITH the story:** each chapter/milestone grows Anfa — the next discipline rank/ability unlocks in the story, at the place he learns it; the story IS the growth.
- **Cinematics:** a ≤5 s skippable docking intro on first PLAY only, auto-finishing into the live prologue; one growth beat per first Moon/Mars/Bennu/Europa completion and a Deep Space unlock beat, robotic spacecraft only. Milestone beats verified by wiring + the shared renderer (a full mission-completion playthrough was not driven in the probe).
- **Recurring problems:** a rotating in-run event system — power, O₂ as a life-support fault (O₂ drains only in EVA or when life support is down), thermal, sample seals, dust, comms delay, radiation, trajectory dispersion — one at a time, minutes apart, never in the first 60 s of a first run or during critical moments, solved by doing at the right console, logged in the Guide with a solved count in the debrief.
- **Movement, gamer-grade, measured:** 90% speed in 0.175 s, slide 19.4 px, full stop 0.208 s, motion within 2 frames; short taps move Anfa noticeably (step-out impulse on the input's rising edge). PLAY hardened (re-entry guard, fail-safe start, button box stable).
- **Specialist review (spec + build):** Voyager power corrected — 23 W is the TRANSMITTER's radio power only; the three RTGs made ~470 W at launch, ~220 W now; show "transmitter 23 W; RTGs ~220 W; signal at Earth ~10⁻¹⁶ W; 160 bps". "Dispersion" renamed to trajectory dispersion. O₂ invariant respected. One crew-fate event. Logs archival, Echo machines never speak.
- **Untouched in v17:** all v16 (camera follow, wide walled interior, PULSE beam, 12 disciplines in order, robotics endgame, Guide resources 01–09, budgets Moon 480 / Mars 605 / Bennu 445 / Europa 645, Echo, CML, grades, FR/AR/EN/TR).

## Still unverified at this version

No full Moon walk to the reactor and no full victory run in a real browser session were played by the builder — code inspection only. The phone playtest is the real verification.

## How to play

Open `space-mission-design-game.html` in a browser. No server needed. Touch joystick + PULSE/DASH/SCAN on phones; WASD/arrows + mouse on desktop.

## Sources and honesty

Verified numbers kept: TCM 30 m/s, Europa $5.2B with solar allowed, Bennu Δv 1.8, Moon Δv 4.0 from LEO, Voyager signal ~10⁻¹⁶ W (transmitter 23 W; RTGs ~220 W now), DSN Goldstone/Madrid/Canberra. The 1.42 GHz signal stays deleted. ASTRA FORGE's invented masses/costs and fictional arena framing were not copied — only its verified patterns.
