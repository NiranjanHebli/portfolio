// Agentic nebula orb with per-planet uSeed plasma swirls, glowing neural filaments and vibrant core gradient.
uniform float uTime,uPulse,uRim,uSeed; uniform vec3 uA,uB,uC; varying vec3 vN,vP,vW; varying vec2 vUv;
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW),p=normalize(vP);
float fr=clamp(1.-max(dot(N,V),0.),0.,1.);
vec3 sp=p*(3.2+mod(uSeed,2.))+vec3(uSeed*1.9,-uSeed*1.1,uTime*.22);
float fil=smoothstep(.52,.88,1.-abs(fbm(sp)-.5)*2.2);
float core=smoothstep(.35,.8,fbm(sp*.7-uTime*.12));
vec3 col=mix(uA,uB,clamp(fr+.35*core,0.,1.))*.85+uC*fil*1.1+uC*pow(fr,2.2)*1.3;
col*=1.+.15*sin(uTime*2.2+uSeed)+uPulse*1.1+uRim*.8;gl_FragColor=vec4(col,1.);}
