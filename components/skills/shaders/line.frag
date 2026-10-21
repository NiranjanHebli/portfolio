// Trail + energy links. uHead path progress (links use 2), uFinale 0..1 full constellation, uDash dashed energy, uActive on/off, uColor.
uniform vec3 uColor; uniform float uHead,uFinale,uDash,uActive,uTime; varying float vU;
void main(){float tail=mix(smoothstep(uHead-.12,uHead,vU),1.,uFinale)*step(vU,uHead);   // fading exhaust ribbon
float dash=mix(1.,step(.5,fract(vU*18.-uTime*1.5)),uDash);
gl_FragColor=vec4(uColor,tail*dash*uActive*(.4+.6*uFinale));}
