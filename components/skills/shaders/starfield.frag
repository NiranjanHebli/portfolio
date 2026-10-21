varying float vA,vT;
void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(mix(vec3(.8,.9,1.),vec3(1.,.8,.6),vT),smoothstep(.5,0.,d)*vA);}
