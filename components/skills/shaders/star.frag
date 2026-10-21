// Core star. uA/uB hot/cool surface, uC corona, uPulse shockwave boost, uShell=1 renders the additive glow shell.
uniform float uTime,uPulse,uShell; uniform vec3 uA,uB,uC; varying vec3 vN,vP,vW; varying vec2 vUv;
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW);
float fr=clamp(1.-max(dot(N,V),0.),0.,1.);
if(uShell>.5){float a=pow(fr,2.5)*(1.2+.3*sin(uTime*1.7)+uPulse);gl_FragColor=vec4(uC*a*1.5,a);return;}
vec3 p=normalize(vP);
float n=fbm(p*3.+uTime*.1+fbm(p*4.-uTime*.2)*1.5);
float turb=abs(fbm(p*6.+uTime*.25)-.5)*2.;
vec3 col=mix(uB,uA,smoothstep(.2,.8,n))*(1.4+turb)+uC*pow(fr,3.)*1.5;
col*=1.+.15*sin(uTime*2.)+uPulse;gl_FragColor=vec4(col,1.);}
