# ASTRA FORGE — Mission Zero

An original browser-based 2.5D pixel-art mission-engineering action prototype for the NASA Space Apps **Space Mission Design Game** challenge. Fast movement, dash, defensive pulse, field upgrades and repeatable runs support learning through decisions and consequences. This is an early playable slice, not a finished Hades II-scale game or an exhaustive NASA curriculum.

## Run

Requires Node.js 22+ (verified on 24). No runtime dependencies or build step.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:4173. Deployable static files are in `dist/`.

WASD/arrows move; Space dashes; E scans nearby sites while held; Q emits a defensive pulse; P/Escape pauses. Touch controls appear on coarse-pointer devices. Design a launchable spacecraft, scan three sites, and return all collected data to the uplink beacon. Sound starts off. Best successful mission scores persist in browser-local storage.

## Implemented

- Original procedural pixel-art terrain, avatar, drones and equipment; calm slate, sage and sand interface palette.
- Moon, Mars and Europa training scenarios with different solar distances.
- Power source, payload, antenna and fictional launcher selection; mass and budget validation.
- Ideal inverse-square solar generation and energy accounting in Wh, with explicit electrical time acceleration.
- Scanning, data storage, downlink contact windows, hazards, defensive mechanics and a subsystem improvement choice.
- Win/loss debrief explaining resource outcomes; source-linked Field Codex.
- All nine official challenge resources indexed with transparent use/integration status.

## Verification

```sh
npm test
npm run check
# With the dev server running and Microsoft Edge installed:
node scripts/browser-check.mjs <screenshot-output-directory>
```

Playwright is a development dependency only. Browser test covers launch gating, movement, all three scans, upgrade choice, successful downlink, codex, pause and narrow-screen layout.

## Scientific boundaries

This is a fictional training environment. It does not simulate an actual crewed trip to Europa. Opposing drones, instant upgrades, terrain geometry and hazard patterns are game abstractions. Module masses, costs, power ratings and launcher capacities are invented balancing values, not NASA vehicle specifications. One play second equals 30 seconds only in the electrical accounting model; travel and contact periods are compressed gameplay timings. Gravity is displayed as context and is not applied to motion. Heat is a gameplay meter, not a thermal analysis. There is no GMAT integration, real orbital propagation, real launch simulation, multiplayer or live NASA data service yet.

The first version teaches constrained design, power versus energy, solar distance, instrument demand, data return and iterative review. It does **not** yet meet the full ambition of teaching every engineering discipline or providing a complete mission lifecycle. See `docs/GAME-DESIGN.md` for the broader plan and `docs/RESOURCES.md` for the verified resource inventory.

Fonts: Google Fonts Pixelify Sans, DM Sans and Barlow Condensed, with local fallbacks. No Hades art, music, characters or code is used. NASA/CSA links are educational sources, not an endorsement.
