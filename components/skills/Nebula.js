import * as THREE from 'three';
import noise from './shaders/noise.glsl?raw'; import vs from './shaders/nebula.vert?raw'; import fs from './shaders/nebula.frag?raw';
import { chan } from './layout.js';
export class Nebula {
  constructor(data) {
    this.u = { uTime: { value: 0 }, uFade: { value: 0 }, uWarp: { value: 0 }, uAspect: { value: 1 }, uTint: { value: new THREE.Color() }, uOff: { value: new THREE.Vector3() } };
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: this.u, vertexShader: vs, fragmentShader: noise + fs, depthWrite: false, depthTest: false }));
    this.mesh.frustumCulled = false; this.mesh.renderOrder = -10;
    this.keys = data.systems.flatMap(s => { const c = new THREE.Color(s.tint); return [[s.start, c], [s.end, c]]; });
    this.lerp = (a, b, f) => this._c.copy(a).lerp(b, f); this._c = new THREE.Color();
  }
  update(time, t, cam, warp) { // tint eases between systems, so warps recolour the nebula
    const u = this.u; u.uTime.value = time; u.uWarp.value = warp; u.uTint.value.copy(chan(this.keys, t, this.lerp)); u.uOff.value.copy(cam.position).multiplyScalar(.003);
  }
  dispose() { this.mesh.geometry.dispose(); this.mesh.material.dispose(); }
}
