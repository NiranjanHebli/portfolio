// uTint active-system colour, uFade intro fade, uWarp radial streak strength, uAspect, uOff camera parallax offset.
uniform float uTime,uFade,uWarp,uAspect; uniform vec3 uTint,uOff; varying vec2 vUv;
void main(){vec2 p=vUv*vec2(uAspect,1.);vec3 q=vec3(p*1.5+uOff.xy,uTime*.02);
float n=fbm(q+fbm(q*1.7+uTime*.03)),n2=fbm(q*2.3-5.);
vec3 col=mix(vec3(.02,.024,.059),uTint,smoothstep(.35,.85,n))*.45+uTint.zxy*.08*n2;
float a=(abs(p.x)<1e-4&&abs(p.y)<1e-4)?0.:atan(p.y,p.x);float r=length(p);
float nw=clamp(noise(vec3(a*30.,uTime*8.,0.)),0.,1.);
col+=vec3(.7,.85,1.)*(nw*nw*nw)*smoothstep(.1,1.2,r)*uWarp*2.;
gl_FragColor=vec4(col*uFade,1.);}
