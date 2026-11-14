# Resource inventory — verified 2026-11-14

Official challenge: https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/?tab=resources

The browser research service initially could not load the official page. The list was first located through the HackAthlone local-event page, then confirmed against the official page's returned HTML. Eight NASA-listed entries and one CSA entry were present. These are a minimum reference inventory, not proof of full content integration. Implementation status is also visible in the in-game Field Codex and `dist/science.js`.

| Resource | Intended use | Current status |
|---|---|---|
| [Design and Develop Science Missions](https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf) | Goals, requirements, mission segments and verification | Read; informs design loop |
| [GMAT](https://software.nasa.gov/software/GSC-19468-1) | Reference trajectory validation | Catalog reviewed; software not integrated |
| [Concept Maturity Levels](https://dataverse.jpl.nasa.gov/dataset.xhtml?persistentId=hdl:2014/44299) | Evidence-based concept reviews | Abstract reviewed; curriculum planned |
| [Mission Design Lab](https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/) | Interdisciplinary design trade studies | Reference for workshop |
| [NASA Mission Viz](https://nasa.github.io/mission-viz/) | Spatial and time-based mission views | Reference only; not embedded |
| [A Learning Game About Telescopes](https://science.nasa.gov/mission/webb/game-build-it-yourself/) | Objectives, wavelength and instrument compatibility | Future telescope campaign |
| [CubeSat 101](https://www3.nasa.gov/sites/default/files/atoms/files/nasa_csli_cubesat_101_508.pdf) | Concept through operations | Guide reviewed as lifecycle reference |
| [Visualize a Space Mission Using Virtual Reality](https://www.spaceappschallenge.org/2023/challenges/visualize-a-space-mission-using-virtual-reality/) | Whole-mission visualization | Confirmed official listed URL; target retrieval failed |
| [CSA Digital Games and Activities](https://www.asc-csa.gc.ca/eng/youth-educators/digital-games-and-activities.asp) | Accessible learning activities | Reference library |

Additional sources: [NASA Basics of Space Flight](https://science.nasa.gov/learn/basics-of-space-flight/) and its [Onboard Systems / power chapter](https://science.nasa.gov/learn/basics-of-space-flight/chapter11-3/). These explain subsystem relationships and power-source considerations.

## Model ledger

- Solar output: ideal inverse-square scaling, `P=P_1AU/r_AU² × illumination`. Ignores temperature, orientation, degradation and detailed dust/radiation models.
- Stored energy: `E_next=clamp(E+(P_generated-P_load)×dt/3600,0,capacity)` in Wh. Electrical time scale is 30 simulated seconds per game second.
- Mass and cost: sum of fictional base and selected hardware parameters; budget credits are not real currency.
- Data: fictional per-site MB and antenna MB/s. Contact schedule is a deterministic gameplay cycle, not a DSN visibility calculation.
- Location solar distances are representative, rounded values, not date-dependent ephemerides. Surface gravity values are informational, not applied to controls.
- Heat, hazard damage, dash energy, player speed and upgrades are gameplay abstractions. None should be presented as an engineering validation result.

Next numerical content work requires a value-level dataset ledger with source, units, uncertainty, applicability, date, model assumptions and tests for every new spacecraft/trajectory parameter.

## Orbital Laboratory (v0.3)

Parameters retrieved on 2026-11-14 from [JPL satellite physical parameters](https://ssd.jpl.nasa.gov/sats/phys_par/sep.html) and [planetary physical parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html):

| Body | GM (km³/s²) | Mean radius (km) | Applicability |
| --- | ---: | ---: | --- |
| Moon | 4902.800 | 1737.4 | Spherical central body; source GM uncertainty ±0.001, radius ±0.1 km |
| Mars | 42828.37362 | 3389.5 | Planet GM, not Mars-system GM; source GM uncertainty ±0.0008 |
| Europa | 3202.71210 | 1560.80 | JUP365 parameters; source GM uncertainty ±0.00181, radius ±0.30 km |

Uncertainties are not propagated; displayed precision is for comparing examples, not navigation. The underlying trajectory context is [NASA Basics of Space Flight, trajectories](https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/). The two-body derivation uses circular speed, Kepler period, vis-viva for two tangential burns and the ideal rocket equation. Starting altitude is 100 km; UI range 100–1200 km. Dry mass reuses the illustrative hardware configuration. Isp 220 s is an illustrative engine assumption; standard gravity is 9.80665 m/s². Only the added orbit-raising propellant is calculated. Surface launch, capture, reserves, atmosphere, plane changes and other bodies are excluded. Europa ignores Jupiter and is not a stable operational mission design. Diagram is not to scale. No claim of running GMAT or NASA Mission Viz.

The standalone lab supports experimentation relevant to mission-design and GMAT learning resources. Existing nine-resource coverage statuses remain unchanged; a citation alone is not a playable lesson or software integration.
