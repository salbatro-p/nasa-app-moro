# MISSIONFORGE — Space Mission Design Game

The submitted game for the NASA Space Apps Challenge 2026, **Space Mission Design Game** challenge. Team Atlas Tech, Sakarya local event.

This folder holds a frozen, self-contained export of the game (`space-mission-design-game.html`, 4.1 MB, all assets inlined). It is recorded here after verification, before any presentation — per the project's delivery rule. The ASTRA FORGE game in `dist/` is untouched.

## This version — v16 (2026-11-15 06:14 Europe/Istanbul)

Camera-follow fix + progression (12 disciplines, robotics endgame, Guide resources), verified with real phone-size screenshots:

- **Camera follow, verified:** after PLAY plus 10+ seconds of movement in several directions with dashes, the avatar stays visible and near the center of every frame, across rooms — the v15 defect (avatar leaving the frame) is fixed. First frame after PLAY: avatar centered in a wide, readable station interior.
- **World:** wide station interior (Among Us-like rooms), walls/corridors as the world, suit lamp + emergency lamps, no black void, no giant sphere, no outdoor diorama. PULSE instrument beam (LIDAR/spectrometer) instead of FIRE; one evolving character.
- **Progression — twelve disciplines in exact order:** the original six (Navigation, Propulsion, Power, Communications, Instruments, Structures & Thermal), then Mechanical Engineering, Materials Science, Electrical Engineering, Biology, Medicine, and finally Robotics Engineering as the gated endgame (locked until all eleven others reach Engineer L2). Each with real engineering numbers visible in the forge before committing, auditable in the debrief.
- **Robotics endgame, verified end-to-end:** at Robotics L1+ the engineer programs robots at the fabricator; they route autonomously across the station, channel field tasks, collect samples (L2+) and bank DSN data (L3+); the debrief carries an Automation audit line.
- **Guide:** the nine Codex Pack 01 challenge resources appear as named, sourced entries 01–09 in order, unlocking one per flight; discoveries in place (Precision Landing on the Moon, Dust-Power Management on Mars, Sample Handling on Bennu, Ice Sounding on Europa, Delay Operations in Deep Space).
- **World grew:** Greenhouse/Biology Lab and a Robotics Bay with fabricator; station now 4200×3400.
- **Untouched:** all v15 content (wide walled interior, suit lamp, PULSE beam, one evolving character, budgets Moon 480 / Mars 605 / Bennu 445 / Europa 645, Echo, CML, grades, FR/AR/EN/TR). Game name in this build is MISSIONFORGE; the MISSIONFORGE 54 title lands in the next edit.
- **Verification:** independent screenshots at 390×844 (first frame + two sustained-movement frames) + zero console/page errors; all 3 inline scripts pass node --check; audit verdict pass.

## Still unverified at this version

No full Moon walk to the reactor and no full victory run in a real browser session were played by the builder — code inspection only. The phone playtest is the real verification.

## How to play

Open `space-mission-design-game.html` in a browser. No server needed. Touch joystick + PULSE/DASH/SCAN on phones; WASD/arrows + mouse on desktop.

## Sources and honesty

Verified numbers kept: TCM 30 m/s, Europa $5.2B with solar allowed, Bennu Δv 1.8, Moon Δv 4.0 from LEO, Voyager signal ~10⁻¹⁶ W, DSN Goldstone/Madrid/Canberra. The 1.42 GHz signal stays deleted. ASTRA FORGE's invented masses/costs and fictional arena framing were not copied — only its verified patterns.
