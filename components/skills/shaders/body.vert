// Shared vertex shader for planets, shells and rings. vN world normal, vP object position, vW world position.
varying vec3 vN,vP,vW; varying vec2 vUv;
void main(){vP=position;vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}
