# MISSIONFORGE — Space Mission Design Game

The submitted game for the NASA Space Apps Challenge 2026, **Space Mission Design Game** challenge. Team Atlas Tech, Sakarya local event.

This folder holds a frozen, self-contained export of the game (`space-mission-design-game.html`, 3.9 MB, all assets inlined). It is recorded here after verification, before any presentation — per the project's delivery rule. The ASTRA FORGE game in `dist/` is untouched.

## This version — v13 (2026-11-15 02:39 Europe/Istanbul)

4-eye review fix round + ASTRA FORGE merge, in one game:

- **Movement, measured:** hard velocity clamp, sustained 388.1 px/s, time-to-90% 0.183 s, slide 108.6 px, stop 1.24 s, at a 120 Hz fixed timestep. Canvas aspect restored to 16/10.
- **Tutorial preset verified GO by running calc():** $475M, dry 415 kg, wet 2,075 kg, Δv 5.05 vs 4.0 required, 130 W vs 68 W load.
- **Destinations play differently:** Europa ice-radar + radiation zones, Mars/Opportunity dust brownouts, Bennu drifting sample canisters, Deep Space power-starved runs.
- **Forge choices visible in the run:** laser comms → 2× DSN windows, fission → storm immunity, poly shielding → radiation zones harmless, AI avionics → aim snap with lock diamond, Heavy/Super-Heavy → 4th instrument slot.
- **Thermal is a real system** with load-shedding; battery state of charge in Wh with 30× electrical time.
- **Typed science:** wrong instruments fail preflight with the specific reason; spectral observations return curves, debrief asks for the deepest 1.5 µm dip and explains why that alone does not identify a material (synthetic training data, never presented as NASA data).
- **Orbital Laboratory** on JPL constants (Moon GM 4902.800 / radius 1737.4 km; Mars 42828.37362 / 3389.5; Europa 3202.71210 / 1560.80), two-burn Hohmann, wet-mass gate into the forge. Honestly labelled not-GMAT.
- **World:** real Three.js orthographic 3D station (vendored, no CDN) with a labelled 2D fallback; Arcane-inspired painterly art direction, original art only.
- **Debrief:** JSON mission-report export, telemetry charts, minimum battery, peak demand. Language/sound/best score persist; 4 languages (FR/AR/EN/TR), story in English.
- **Budgets rebalanced** to ~8% above cheapest viable builds: Moon 480, Mars 605, Bennu 445, Europa 645.

## Still unverified at this version

No full Moon walk to the reactor and no full victory run in a real browser session were played by the builder — code inspection only. The phone playtest is the real verification.

## How to play

Open `space-mission-design-game.html` in a browser. No server needed. Touch joystick + FIRE/DASH/SCAN on phones; WASD/arrows + mouse on desktop.

## Sources and honesty

Verified numbers kept: TCM 30 m/s, Europa $5.2B with solar allowed, Bennu Δv 1.8, Moon Δv 4.0 from LEO, Voyager signal ~10⁻¹⁶ W, DSN Goldstone/Madrid/Canberra. The 1.42 GHz signal stays deleted. ASTRA FORGE's invented masses/costs and fictional arena framing were not copied — only its verified patterns.
