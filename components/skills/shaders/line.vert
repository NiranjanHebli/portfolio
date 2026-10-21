attribute float aU; varying float vU;
void main(){vU=aU;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
