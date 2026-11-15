# MISSIONFORGE 54 — Space Mission Design Game

The submitted game for the NASA Space Apps Challenge 2026, **Space Mission Design Game** challenge. Team Atlas Tech, Sakarya local event.

This folder holds a frozen, self-contained export of the game (`space-mission-design-game.html`, 4.2 MB, all assets inlined). It is recorded here after verification, before any presentation — per the project's delivery rule. The ASTRA FORGE game in `dist/` is untouched.

## This version — v17, repaired (2026-11-15 06:48 Europe/Istanbul)

Title MISSIONFORGE 54 + Anfa's story, cinematics, recurring problems, gamer-grade movement — verified with real phone-size screenshots (intro visible ~2 s after PLAY + skip visible + camera follow + no errors):

- **Title/hero:** wordmark MISSIONFORGE 54, "Design · Fly · Survive", "ANFA — relief Flight Dynamics Engineer · the only soul aboard"; debrief/export carry "Pilot: ANFA".
- **Story, one event everywhere:** Vera's opening lines, four short crew logs (archived in the Guide, record ending 09:00), and the epilogue all agree — the last crew left on an exploration burn and never came back; completing Deep Space (all five destinations mastered) reveals their fate in the "GUARDIAN" ending, with a condensed version in the Deep Space debrief and the Guide's "Story So Far". Vera is the only voice; her banner appears and auto-hides. Europa echo framed as a candidate, never a beacon. Story in English only, minimal text.
- **Character grows WITH the story:** each chapter/milestone grows Anfa — the next discipline rank/ability unlocks in the story, at the place he learns it; the story IS the growth.
- **Cinematics:** a ≤5 s skippable docking intro on first PLAY only (station, capsule, letterbox, Vera's guest line, "TAP ANYWHERE TO SKIP ▸▸" rendered and readable), auto-finishing into the live prologue; one growth beat per first Moon/Mars/Bennu/Europa completion and a Deep Space unlock beat, robotic spacecraft only. Milestone beats verified by wiring + the shared renderer (a full mission-completion playthrough was not driven in the probe).
- **Recurring problems:** a rotating in-run event system — power, O₂ as a life-support fault (O₂ drains only in EVA or when life support is down), thermal, sample seals, dust, comms delay, radiation, trajectory dispersion — one at a time, minutes apart, never in the first 60 s of a first run or during critical moments, solved by doing at the right console, logged in the Guide with a solved count in the debrief.
- **Movement, gamer-grade, measured:** 90% speed in 0.175 s, slide 19.4 px, full stop 0.208 s, motion within 2 frames (targets: ≤0.20 s / ≤~30 px / ≤0.25 s / ≤2 frames); short taps now move Anfa noticeably (step-out impulse on the input's rising edge). PLAY hardened (re-entry guard, fail-safe start, button box stable).
- **Specialist review (spec + build):** Voyager power corrected — 23 W is the TRANSMITTER's radio power only; the three RTGs made ~470 W at launch, ~220 W now; show "transmitter 23 W; RTGs ~220 W; signal at Earth ~10⁻¹⁶ W; 160 bps". "Dispersion" renamed to trajectory dispersion. O₂ invariant respected. One crew-fate event. Logs archival, Echo machines never speak.
- **Untouched:** all v16 (camera follow, wide walled interior, PULSE beam, 12 disciplines in order, robotics endgame, Guide resources 01–09, budgets Moon 480 / Mars 605 / Bennu 445 / Europa 645, Echo, CML, grades, FR/AR/EN/TR).
- **Verification:** independent screenshots at 390×844 (title, intro at ~2 s and ~5 s, first gameplay frame, sustained-movement frame in a different room, short-tap frame) + zero console/page errors; all 3 inline scripts pass node --check. The first v17 build (06:32) FAILED verification — the intro did not render at all — and was sent back; this repaired build (06:48) passed.

## Still unverified at this version

No full Moon walk to the reactor and no full victory run in a real browser session were played by the builder — code inspection only. The phone playtest is the real verification.

## How to play

Open `space-mission-design-game.html` in a browser. No server needed. Touch joystick + PULSE/DASH/SCAN on phones; WASD/arrows + mouse on desktop.

## Sources and honesty

Verified numbers kept: TCM 30 m/s, Europa $5.2B with solar allowed, Bennu Δv 1.8, Moon Δv 4.0 from LEO, Voyager signal ~10⁻¹⁶ W (transmitter 23 W; RTGs ~220 W now), DSN Goldstone/Madrid/Canberra. The 1.42 GHz signal stays deleted. ASTRA FORGE's invented masses/costs and fictional arena framing were not copied — only its verified patterns.
