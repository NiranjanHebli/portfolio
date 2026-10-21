uniform float uPower; varying float vK;
void main(){gl_FragColor=vec4(mix(vec3(.6,.9,1.),vec3(1.,.45,.1),vK)*2.,(1.-vK)*uPower);}
