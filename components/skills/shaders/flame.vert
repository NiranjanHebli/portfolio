// Engine flame (cone pointing -Z). uTime, uPower 0..1 (length + intensity). Noise-driven vertex displacement.
uniform float uTime,uPower; varying float vK;
void main(){vec3 p=position;float k=(.6-p.z)/1.2;vK=k;
p.z=.6-(.6-p.z)*max(uPower,.02);
p.xy+=normal.xy*(noise(vec3(p.z*5.,uTime*18.,p.x*4.))-.5)*.3*k;
gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}
