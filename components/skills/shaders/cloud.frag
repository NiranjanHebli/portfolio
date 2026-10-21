// Cloud planet with per-planet uSeed cyclone bands and dual-tone atmosphere.
uniform float uTime,uShell,uSpeed,uRim,uSeed; uniform vec3 uA,uB,uC,uSun; varying vec3 vN,vP,vW; varying vec2 vUv;
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW),L=normalize(uSun-vW),p=normalize(vP);float t=uTime*uSpeed;
vec3 sp=p*(2.6+mod(uSeed,1.8))+uSeed*1.5;
float c1=fbm(sp+vec3(t*.035,0.,0.)),c2=fbm(sp*2.1-vec3(0.,t*.05,0.));
float cloud=smoothstep(.38,.76,c1*.6+c2*.5);
float d=max(dot(N,L),0.)*.85+.22;
float f=pow(clamp(1.-max(dot(N,V),0.),0.,1.),2.8);
if(uShell>.5){gl_FragColor=vec4(mix(uB,uC,.4)*d+uC*f*.5,cloud*.68*(1.-f*.4));return;}
gl_FragColor=vec4(mix(uA,uB,cloud*.65)*d+uC*f*(.65+uRim*1.6),1.);}
