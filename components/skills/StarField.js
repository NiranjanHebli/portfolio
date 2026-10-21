import * as THREE from 'three';
import vs from './shaders/starfield.vert?raw'; import fs from './shaders/starfield.frag?raw';
export class StarField {
  constructor(n, c) {
    const pos = new Float32Array(n * 3), d = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 60 + 560 * Math.pow(Math.random(), .7), th = Math.random() * 6.2832, ph = Math.acos(2 * Math.random() - 1);
      pos.set([c.x + r * Math.sin(ph) * Math.cos(th), c.y + r * Math.cos(ph), c.z + r * Math.sin(ph) * Math.sin(th)], i * 3);
      d.set([.8 + Math.random() * 2.2, Math.random(), Math.random()], i * 3);
    }
    this.geo = new THREE.BufferGeometry(); this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); this.geo.setAttribute('aData', new THREE.BufferAttribute(d, 3));
    this.u = { uTime: { value: 0 }, uPx: { value: 1 }, uFade: { value: 0 } };
    this.points = new THREE.Points(this.geo, new THREE.ShaderMaterial({ uniforms: this.u, vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.points.frustumCulled = false;
  }
  setCount(n) { this.geo.setDrawRange(0, n); }
  update(time, px) { this.u.uTime.value = time; this.u.uPx.value = px; }
  dispose() { this.geo.dispose(); this.points.material.dispose(); }
}
