// Planet ring (object-space XY plane). uA colour, uInner/uOuter radii, uSpin band drift speed.
uniform float uInner,uOuter,uTime,uSpin; uniform vec3 uA; varying vec3 vP;
void main(){float span=max(uOuter-uInner,0.001);
float t=clamp((length(vP.xy)-uInner)/span,0.,1.);
float a=smoothstep(0.,.2,t)*smoothstep(1.,.6,t);
float b=.55+.45*noise(vec3(t*40.,uTime*.05*uSpin,0.));
gl_FragColor=vec4(uA*b*1.2,a*b*.8);}
