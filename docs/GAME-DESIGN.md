# Game direction and expansion plan

## Corrected visual and experience direction — v0.2

The user's intent is a **3D world and characters with 2.5D camera/gameplay**, combined with **pixel-art UI and writing**. Do not return to pixel-rendering the world. The initial Canvas version misunderstood this distinction and has been replaced with a WebGL/Three.js scene.

The experience must combine simulation and adventure, beginning with a compelling, restrained original story. v0.2 adds three mission-specific briefings, a consequential power-mode choice, melee combos, ranged shots, continuous dodging, distinct enemy behavior and a relay guardian. The full browser chapter has been exercised through victory. This establishes a direction; it does not establish equivalence in fun, content or production quality to Hades II.

Resource-driven story content is authored and traceable. CubeSat lifecycle and stored energy inform the lunar reconstruction; NASA onboard power concepts inform the Mars dust scenario; mission-design objectives and distant-solar constraints inform the Europa archive. Other listed resources retain their explicit roadmap/reference status. Never imply a linked reference is already a complete playable curriculum or integrated tool.

## Product promise

Become a mission engineer by making consequential decisions in a responsive 2.5D action game. The desired feeling is fluid movement, readable threats, interesting builds and compelling retries. The game has its own space-science identity, an original 3D world and pixel-art UI. UI should feel quiet, crafted and legible, with restrained color and pixel equipment motifs rather than generic neon dashboard decoration.

## Core loop

1. Accept a scientific question and identify the measurement required.
2. Assemble an instrument, bus, power, propulsion and communications architecture within constraints.
3. Verify feasibility, select a trajectory and launcher, then launch.
4. Operate the mission through playable encounters that test the design.
5. Deliver usable scientific data, diagnose failures, then redesign.

Current implementation covers a small selection of steps 2, 4 and 5. The deployment button enters a training arena; it is not an orbital launch simulation.

## Teaching by doing

Every learning unit must include: an observable phenomenon; a controllable engineering choice; a consequence with units; a concise explanation; a primary source; and a transfer task in a different scenario. Reading a codex entry is not sufficient evidence of mastery. Later progression should unlock through successful transfer, not trivia completion.

| Learning area | Playable decision / consequence | Prototype status |
|---|---|---|
| Scientific requirements | Match instrument to a specific measurable objective | Basic instrument choice; objective matching still needed |
| Systems engineering | Balance capability against coupled mass, cost, power and data | Basic implemented |
| Electrical systems | Size power source and storage for sunlight and shadow | Simplified implemented |
| Payload/data | Trade scan speed, power and data volume | Implemented with fictional values |
| Communications | Deliver data within limited ground contact | Simplified implemented |
| Thermal | Manage operating duty cycle | Abstract heat meter only |
| Structures and launch | Fit mass and later volume/vibration limits | Mass gate only |
| Orbital mechanics | Transfer windows, delta-v, inclination, gravity assists | Planned |
| Propulsion | Thrust, specific impulse, propellant and maneuver duration | Planned |
| Attitude control | Point instruments, solar arrays and antenna | Planned |
| Software and autonomy | State machines, fault protection, delayed commands | Planned |
| Reliability and verification | Test modes and redundancy before flight | Planned |
| Lifecycle | Concept, review, integration, launch, cruise, operations, disposal | Planned |
| Planetary science | Measurements appropriate to atmosphere, geology and ice | Scenario labels only; full lessons planned |
| Earth science and heliophysics | Remote sensing, spectra, magnetic fields, weather | Planned |
| Astrophysics | Telescope wavelength, optics, detector and pointing choices | Planned |

## Campaign scope

Use mission families rather than claiming literal coverage of all NASA knowledge. Proposed families: CubeSat Earth observation; lunar mapping; Mars rover/orbiter; asteroid rendezvous; Europa flyby/orbiter; outer-planet probe; space telescope; solar observatory. A robotic orbiter is the scientifically credible default for distant hazardous destinations. Human or avatar action can occur inside a clearly labeled operations simulator.

## Development stages

1. **Current slice:** establish a complete short run, readable pixel art, controls and resource consequences. Validate fun with player observations before expanding.
2. **Action and visual depth:** commissioned or authored sprite sheets, directional animation, terrain collision, arena routes, enemy patterns, strong effects, accessible difficulty and controller support. Do not call combat balanced until playtested.
3. **Full mission lifecycle:** objective-dependent instrument selection, launch sequence, dimensioned orbit/propulsion models and a time-based mission map. Compare representative trajectories against GMAT outputs.
4. **Curriculum expansion:** implement source-backed missions for each family, teach foundational concepts before advanced engineering, and add Darija/Arabic/French/English localization with RTL layout.
5. **Persistence and collaboration:** versioned campaign saves, shareable loadouts and optional cooperative roles. Browser-local score storage is the only persistence in v0.1.

## Acceptance for a mature educational release

- Every claimed learning outcome has a playable task and assessable transfer task.
- Every engineering number is sourced, derived with units, or visibly labeled as fictional.
- Simulation fidelity and time/length scaling are visible and consistent.
- A failure report identifies causes the player can act on; success requires the scientific objective, not only survival.
- Separate source use, software integration and reference links in the resource ledger.
- Verify keyboard, touch, controller, reduced motion, readability and localization.
- Conduct actual learner and action-game playtests. Do not claim equal fun or production quality to a commercial benchmark based only on implementation.

## v0.4 implemented loop

Science question → instrument requirement → hardware + optional orbit-raising propellant → launch gate → field observations → engineering trade-off → relay recovery → transmission → evidence chart + optional spectral interpretation → JSON report → redesign. The orbital lab retains the separate physical model assumptions while affecting the preflight mass gate. World navigation and contact scheduling remain authored gameplay.
