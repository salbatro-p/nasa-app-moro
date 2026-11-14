// km, seconds, kg. JPL SSD physical parameters, retrieved 2026-11-14.
export const bodies={moon:{radius:1737.4,mu:4902.800},mars:{radius:3389.5,mu:42828.37362},europa:{radius:1560.8,mu:3202.71210}};
export const orbitSources=['https://ssd.jpl.nasa.gov/sats/phys_par/sep.html','https://ssd.jpl.nasa.gov/planets/phys_par.html','https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/'];
export function orbitPlan(bodyId,altitude,dryMass=300,isp=220){
 const body=bodies[bodyId];if(!body||!Number.isFinite(altitude)||altitude<100||altitude>2000||!Number.isFinite(dryMass)||dryMass<=0||!Number.isFinite(isp)||isp<=0)throw new RangeError('Invalid orbital inputs');
 const r1=body.radius+100,r2=body.radius+altitude,a=(r1+r2)/2;
 const speed=Math.sqrt(body.mu/r2),period=2*Math.PI*Math.sqrt(r2**3/body.mu);
 const burn1=Math.sqrt(body.mu/r1)*(Math.sqrt(2*r2/(r1+r2))-1)*1000;
 const burn2=speed*(1-Math.sqrt(2*r1/(r1+r2)))*1000,deltaV=burn1+burn2;
 const propellant=dryMass*Math.expm1(deltaV/(isp*9.80665));
 return{body:bodyId,altitude,speed,period,burn1,burn2,deltaV,propellant,wetMass:dryMass+propellant,coast:altitude===100?0:Math.PI*Math.sqrt(a**3/body.mu),isp,dryMass};
}
