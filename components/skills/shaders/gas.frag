// Gas giant with per-planet uSeed band frequency, turbulent vortex storms and multi-hue atmospheric glow.
uniform float uTime,uSpin,uRim,uSeed; uniform vec3 uA,uB,uC,uSun; varying vec3 vN,vP,vW; varying vec2 vUv;
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW),L=normalize(uSun-vW),p=normalize(vP);
float ang=uTime*.04*uSpin*(1.-p.y*p.y)+uSeed;float cs=cos(ang),sn=sin(ang);p.xz=mat2(cs,-sn,sn,cs)*p.xz;
vec3 q=p*vec3(2.,4.2+mod(uSeed,3.),2.)+uSeed*2.1;q+=fbm(q*1.8+uTime*.015)*1.35;
float b=.5+.5*sin(p.y*(9.+mod(uSeed*2.,7.))+fbm(q)*5.5);
float storm=smoothstep(.58,.88,fbm(q*2.2+vec3(0.,uSeed,0.)));
vec3 col=mix(uA,uB,b);col=mix(col,uC,storm*.65);
float d=max(dot(N,L),0.)*.85+.18;
float nv=clamp(1.-max(dot(N,V),0.),0.,1.);
float f=pow(nv,2.5);
gl_FragColor=vec4(col*d+uC*f*(.65+uRim*1.6),1.);}
