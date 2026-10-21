// Vision planet with smooth anti-aliased holographic scan-lines (no fwidth/Moire shimmer) and per-planet uSeed terrain.
uniform float uTime,uScan,uRim,uSeed; uniform vec3 uA,uB,uC,uSun; varying vec3 vN,vP,vW; varying vec2 vUv;
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW),L=normalize(uSun-vW),p=normalize(vP);
float d=max(dot(N,L),0.)*.75+.22;
float ter=fbm(p*(2.8+mod(uSeed,2.))+uSeed*2.3);
vec3 base=mix(uA,uB,smoothstep(.3,.75,ter));
float contour=smoothstep(.82,.95,sin(ter*18.));
float edge=pow(clamp(1.-max(dot(N,V),0.),0.,1.),2.4);
float lines=.75+.25*sin(p.y*26.-uTime*2.5+uSeed);
float sweep=smoothstep(.1,0.,abs(p.y-(uScan*2.-1.)))*step(.001,uScan)*step(uScan,.999);
gl_FragColor=vec4((base+uC*contour*.35)*d*lines+uC*edge*(.85+uRim*1.6)+uC*sweep*1.8,1.);}
