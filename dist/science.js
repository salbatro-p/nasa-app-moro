import {orbitPlan} from './orbits.js';
export const scienceObjectives=[
 {id:'mapping',name:'Surface mapping',instrument:'camera',question:'Where are the surface features?',requirement:'Use the survey camera to record spatial detail at three sites.',target:60},
 {id:'composition',name:'Spectral survey',instrument:'spectrometer',question:'How does reflected light vary with wavelength?',requirement:'Use the spectrometer to compare spectra from three sites.',target:105}
];
export const missions=[
 {id:'moon',name:'Lunar frontier',place:'SHACKLETON / MOON',tag:'01 / FIRST LIGHT',au:1,gravity:1.62,color:'#73edd8',ground:'#18343b',objective:'Map three mineral sites and return 60 MB of measurements.',lesson:'Eclipses stop solar generation. A battery stores energy; it does not generate it.',source:'cubesat',target:60},
 {id:'mars',name:'The red silence',place:'JEZERO / MARS',tag:'02 / DUST & DISTANCE',au:1.52,gravity:3.71,color:'#ffb184',ground:'#4d2b32',objective:'Map three mineral sites and return 60 MB through dust interruptions.',lesson:'Sunlight decreases with the square of distance from the Sun. Dust can reduce it further.',source:'systems',target:60},
 {id:'europa',name:'Beneath the ice',place:'EUROPA / JOVIAN SYSTEM',tag:'03 / DISTANT SUN',au:5.2,gravity:1.315,color:'#afa6ff',ground:'#292e53',objective:'Map three ice sites and return 60 MB in a high-radiation training scenario.',lesson:'At 5.2 AU, the same solar array produces about 3.7% of its 1 AU output.',source:'systems',target:60}
];
// Fictional training hardware. Values are game design parameters, not NASA vehicle specifications.
export const modules={
 power:[{id:'solar',name:'Solar wings',detail:'600 W at 1 AU · light, sunlight-dependent',mass:45,cost:18,watts:600},{id:'rtg',name:'Radioisotope unit',detail:'300 W · steady output, heavier and costly',mass:80,cost:48,watts:300}],
 payload:[{id:'camera',name:'Survey camera',detail:'90 W · 20 MB per site · quick scan',mass:25,cost:16,watts:90,data:20,scan:1.7},{id:'spectrometer',name:'Spectrometer',detail:'180 W · 35 MB per site · more data',mass:60,cost:30,watts:180,data:35,scan:2.5}],
 comms:[{id:'compact',name:'Compact antenna',detail:'4 MB/s in a contact window · 40 W',mass:20,cost:12,watts:40,rate:4},{id:'dish',name:'High-gain dish',detail:'10 MB/s in a contact window · 75 W',mass:45,cost:25,watts:75,rate:10}],
 launcher:[{id:'light',name:'Light launch',detail:'360 kg capacity · 24 credits',mass:0,cost:24,capacity:360},{id:'heavy',name:'Heavy launch',detail:'650 kg capacity · 44 credits',mass:0,cost:44,capacity:650}]
};
export const sources=[
 {id:'instruments',name:'NASA / science instruments ↗',url:'https://science.nasa.gov/learn/basics-of-space-flight/chapter12-1/',use:'Use the spectrometer to compare spectra from three sites.',status:'Science reference'},
 {id:'design',name:'Design and Develop Science Missions',url:'https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf',use:'Mission objectives → requirements → design → verification. Used for the mission assembly and review loop.',status:'Design reference'},
 {id:'gmat',name:'General Mission Analysis Tool (GMAT)',url:'https://software.nasa.gov/software/GSC-19468-1',use:'Trajectory design and navigation. Future validation tool for orbital scenarios; not integrated into this prototype.',status:'Roadmap'},
 {id:'cml',name:'Concept Maturity Levels',url:'https://dataverse.jpl.nasa.gov/dataset.xhtml?persistentId=hdl:2014/44299',use:'Evidence-based concept development. Planned design-review progression; current progression is a game mechanic, not an official CML assessment.',status:'Roadmap'},
 {id:'mdl',name:'Mission Design Lab',url:'https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/',use:'Compare subsystem trade-offs across a complete mission. Informs the assembly screen.',status:'Design reference'},
 {id:'viz',name:'NASA Mission Viz',url:'https://nasa.github.io/mission-viz/',use:'Reference for future time-dependent trajectory visualization; no embedded Mission Viz engine.',status:'Roadmap'},
 {id:'telescope',name:'A Learning Game About Telescopes',url:'https://science.nasa.gov/mission/webb/game-build-it-yourself/',use:'Instrument choice driven by a scientific objective. Future wavelength and telescope campaign.',status:'Roadmap'},
 {id:'cubesat',name:'CubeSat 101',url:'https://www3.nasa.gov/sites/default/files/atoms/files/nasa_csli_cubesat_101_508.pdf',use:'Mission lifecycle, integration, launch and operations. Reference for constraints and preflight checks.',status:'Design reference'},
 {id:'vr',name:'Visualize a Space Mission Using Virtual Reality',url:'https://www.spaceappschallenge.org/2023/challenges/visualize-a-space-mission-using-virtual-reality/',use:'Spatial mission storytelling reference. Listed in the official 2026 challenge; the linked page could not be retrieved during research.',status:'Link only'},
 {id:'csa',name:'CSA Digital Games and Activities',url:'https://www.asc-csa.gc.ca/eng/youth-educators/digital-games-and-activities.asp',use:'Accessible space learning references. Future onboarding and curriculum review.',status:'Reference library'},
 {id:'systems',name:'NASA Basics of Space Flight — Onboard Systems',url:'https://science.nasa.gov/learn/basics-of-space-flight/chapter11-3/',use:'Solar and radioisotope power concepts. Solar output in this game follows an ideal inverse-square model.',status:'Science reference'},
 {id:'basics',name:'NASA Basics of Space Flight',url:'https://science.nasa.gov/learn/basics-of-space-flight/',use:'Further study: mechanics, mission inception, telecommunications, instruments, navigation and operations.',status:'Reference library'}
];
export function solarPower(wattsAtOneAU,au,illumination=1){return wattsAtOneAU/(au*au)*Math.max(0,Math.min(1,illumination));}
export function energyStep(wh,generationW,demandW,seconds,capacityWh){return Math.max(0,Math.min(capacityWh,wh+(generationW-demandW)*seconds/3600));}
export function configure(selection,mission){
 const get=k=>modules[k].find(m=>m.id===selection[k])??modules[k][0];
 const power=get('power'),payload=get('payload'),comms=get('comms'),launcher=get('launcher');
 const dryMass=210+power.mass+payload.mass+comms.mass,cost=30+power.cost+payload.cost+comms.cost+launcher.cost;
 const objective=scienceObjectives.find(o=>o.id===selection.objective)??scienceObjectives[0];
 const orbit=orbitPlan(mission.id,Number(selection.altitude??100),dryMass),mass=orbit.wetMass;
 const generation=power.id==='solar'?solarPower(power.watts,mission.au):power.watts;
 const demand=80+payload.watts+comms.watts;
 return {power,payload,comms,launcher,dryMass,orbit,objective,mass,cost,generation,demand,capacityWh:30,errors:[...(mass>launcher.capacity?['Mass exceeds launch capacity. Choose a heavier launcher or lighter hardware.']:[]),...(cost>165?['Budget exceeds 165 credits. Trade capability for affordability.']:[]),...(objective.instrument!==payload.id?[objective.id==='composition'?'This objective requires wavelength measurements. Select the spectrometer.':'This mapping exercise requires spatial images. Select the survey camera.']:[]) ]};
}
