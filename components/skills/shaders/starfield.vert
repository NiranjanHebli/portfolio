// aData: x size, y phase, z tint. uTime, uPx pixel ratio, uFade intro fade.
attribute vec3 aData; uniform float uTime,uPx,uFade; varying float vA,vT;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
float tw=.6+.4*sin(uTime*(1.+aData.y)+aData.y*40.);
float dist=max(-mv.z,0.5);
gl_PointSize=aData.x*uPx*tw*clamp(300./dist,.6,4.);
vA=(mv.z<-0.5)?uFade*tw:0.;vT=aData.z;}
