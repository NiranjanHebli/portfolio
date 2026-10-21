// Rocky / ice / devops exoplanets with per-planet uSeed pattern variation, swirled continents, bioluminescent veins & atmospheric rim.
uniform float uTime,uRim,uMode,uSeed; uniform vec3 uA,uB,uC,uSun; varying vec3 vN,vP,vW; varying vec2 vUv;
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW),L=normalize(uSun-vW),p=normalize(vP);
vec3 sp=p*(2.4+mod(uSeed,2.2))+vec3(uSeed*1.7,uSeed*.9,-uSeed*1.3);
float warp=fbm(sp*1.6+.5);
float h=fbm(sp+warp*1.2)+.35*fbm(sp*3.2);
float bands=.5+.5*sin(p.y*(5.+mod(uSeed*1.3,6.))+warp*4.);
vec3 col=mix(uA,uB,smoothstep(.32,.72,mix(h,bands,.35)));
float ridge=smoothstep(.76,.92,1.-abs(h-.58)*4.5);
col=mix(col,uC,ridge*.55);
bool ice=uMode>.5&&uMode<1.5;
if(ice){float cr=smoothstep(.45,.82,fbm(sp*2.8));col=mix(col,mix(uC,vec3(.92,.97,1.),.5),cr*.55);}
if(uMode>1.5){vec3 g=abs(fract(sp*3.5)-.5);col+=uC*.45*smoothstep(.44,.49,max(g.x,max(g.y,g.z)));}
float d=max(dot(N,L),0.)*.85+.18;
float nv=clamp(1.-max(dot(N,V),0.),0.,1.);
float f=pow(nv,ice?2.2:2.8);
float specAng=clamp(dot(reflect(-L,N),V),0.,1.);
float spec=pow(specAng,ice?20.:12.)*(ice?.45:.22);
gl_FragColor=vec4(col*d+uC*f*(.65+uRim*1.8)+spec*uC+uC*uRim*.12,1.);}
