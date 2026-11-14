# ASTRA FORGE — Mission Zero

An original browser-based simulation/adventure for the NASA Space Apps **Space Mission Design Game** challenge. The world and characters are real 3D, viewed through a fixed oblique orthographic camera for 2.5D play. Pixel art belongs to the interface and typography, not the world renderer. The current chapter includes an original mission-specific story, melee combos, ranged attacks, a dodge, three enemy behaviors, a guardian encounter and consequential engineering choices. This is an early playable slice, not a finished Hades II-scale game or an exhaustive NASA curriculum.

## Run

Requires Node.js 22+ (verified on 24) for the local server, and a browser with WebGL 2. Three.js 0.187.0 is vendored with its MIT license in `dist/vendor/`, so runtime JavaScript does not depend on a third-party CDN. No build step is needed.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:4173. Deployable static files are in `dist/`.

WASD/arrows move relative to the screen; mouse aims; left click/J chains three melee strikes; right click/K fires a bolt; Space dodges; E scans while held; Q emits a defensive pulse; P/Escape pauses. J/K use assisted targeting when the mouse is not aiming. Touch controls appear on coarse-pointer devices. Design a spacecraft, follow or skip the three-part story, scan three sites, make an energy decision, select a training improvement, defeat the guardian, and transmit all collected data. Sound starts off. Best successful scores persist locally.

The compact language selector in the header supports English, Français, العربية and Türkçe. The choice persists locally, updates interface and gameplay text without restarting a run, and switches Arabic to right-to-left layout. External NASA/CSA pages remain in their original languages. Translation strings live in `dist/translations.js`; text nodes are localized in place to preserve gameplay state and event listeners.

## Implemented

- Original procedural 3D terrain, rigged avatar, lighting, shadows, drones, relay and guardian; pixel-styled interface with a calm palette.
- Moon, Mars and Europa scenarios with different solar distances and mission-specific opening stories. These share a first-chapter arena structure, not three full campaigns.
- Continuous dodge with brief immunity, three-hit melee chain, ranged attacks, pulse, telegraphed scout/sentry/charger attacks and a two-phase guardian.
- First-site story decision: 45 W idle demand and 50% longer scans, or 80 W idle demand and normal scan speed. The debrief explains the selected consequence.
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
node scripts/language-check.mjs <screenshot-output-directory>
```

Playwright is a development dependency only. Browser checks cover real WebGL rendering, narrative navigation, movement, attacks, dodge, all three scans, energy choice, upgrade, guardian defeat, successful downlink, codex, pause, localization and mobile layout. Unit tests cover combat geometry and mission-state progression as well as energy and launch limits. Performance and fun still need testing with actual players and lower-powered devices.

## Scientific boundaries

This is a fictional training environment. It does not simulate an actual crewed trip to Europa. Opposing drones, instant upgrades, terrain geometry and hazard patterns are game abstractions. Module masses, costs, power ratings and launcher capacities are invented balancing values, not NASA vehicle specifications. One play second equals 30 seconds only in the electrical accounting model; travel and contact periods are compressed gameplay timings. Gravity is displayed as context and is not applied to motion. Heat is a gameplay meter, not a thermal analysis. There is no GMAT integration, real orbital propagation, real launch simulation, multiplayer or live NASA data service yet.

The first version teaches constrained design, power versus energy, solar distance, instrument demand, data return and iterative review. It does **not** yet meet the full ambition of teaching every engineering discipline or providing a complete mission lifecycle. See `docs/GAME-DESIGN.md` for the broader plan and `docs/RESOURCES.md` for the verified resource inventory.

Fonts: Google Fonts Pixelify Sans, DM Sans and Barlow Condensed, with local fallbacks and legible Arabic typography. No Hades art, music, characters or code is used. NASA/CSA links are educational sources, not an endorsement. The opening story is original fiction, not a historical NASA event.

## Version 0.3 — movement and orbital experiments

- Locomotion uses exponential acceleration and braking; simulation advances in 120 Hz steps (catch-up capped at 100 ms after stalls). The renderer uses distance-driven strides, knee and elbow joints, directional lean, distinct alternating melee swings, dash poses and trails. Camera shake respects reduced-motion settings. Strikes, bolts and pulses buffer quick taps for 140 ms. Telemetry refreshes at 10 Hz.
- The workshop opens a four-language Orbital Laboratory. Change altitude, retain a comparison case, inspect two-burn transfer cost and propellant, and check wet mass against the selected launcher. This separate educational experiment does not change the surface adventure; it is not GMAT integration.
- Debrief exports a JSON mission report with loadout, result, power decision, equations, assumptions and resource links. It is a local download, not an online competition submission or leaderboard.
- Validation: 14 unit tests; WebGL browser tests; complete playable mission through victory; report-download validation; lab comparisons, failed mass constraints, destination switching, French/Arabic/Turkish and mobile RTL.

The prototype still needs authored animation/assets, broader mission campaigns, objective-specific instrumentation, operational communication geometry, real trajectory validation, accessibility playtesting and external learning evaluation before making a strong competition-readiness claim. It does not cover every topic in the nine linked resources.

## Version 0.4 — science requirements and mission evidence

The player now chooses surface mapping (camera, 60 MB) or a spectral survey (spectrometer, 105 MB). An incompatible instrument fails preflight with a specific explanation. These are requirements for these teaching exercises, not a general claim that cameras cannot constrain composition or that imaging spectrometers cannot map terrain.

An applied orbital experiment now persists its altitude and adds the ideal local-transfer propellant to dry mass for the launch-capacity check. The default is the existing 100 km circular orbit (no raising maneuver). It still does not model getting there from Earth, landing, capture or reserves. Surface contact windows and combat stay separate gameplay models.

Successful spectral observations record authored reflectance curves. The debrief compares all three, asks the player to identify the deepest 1.5 μm dip, and explains why that alone does not identify a material. No synthetic spectrum is presented as NASA data or evidence of water. The science report includes those arrays and the interpretation context is shown in the UI.

The debrief also charts actual gameplay battery and returned data, records minimum battery and measured peak demand, and exports the history and selected flight plan. Sampling is at most twice per play second plus a final sample; history is bounded to 1200 records, preserving the first record and recent data. Scores normalize science return to the chosen goal; v0.4 local records use a separate storage key because the scoring basis changed. No online rankings or education-impact claims are made.

Validation: 18 unit tests; design/launch gating, four-language and mobile checks; complete camera and spectrometer browser journeys; JSON export and spectral interpretation checks. Enemy windups now show direction markers; charge poses and a temporary shield ring make combat states more legible.
