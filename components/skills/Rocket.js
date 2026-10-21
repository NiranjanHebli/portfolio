import * as THREE from 'three';
import noise from './shaders/noise.glsl?raw'; import fv from './shaders/flame.vert?raw'; import ff from './shaders/flame.frag?raw';
import lv from './shaders/line.vert?raw'; import lf from './shaders/line.frag?raw';
export class Rocket {
  constructor() {
    const g = this.group = new THREE.Group(), b = this.body = new THREE.Group(); g.add(b); this._v = new THREE.Vector3();
    const red = new THREE.MeshStandardMaterial({ color: 0xff4d6d, metalness: .3, roughness: .4 });
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(.28, .34, 1.3, 14).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xe9edff, metalness: .5, roughness: .35 }));
    const nose = new THREE.Mesh(new THREE.ConeGeometry(.28, .7, 14).rotateX(Math.PI / 2), red); nose.position.z = 1;
    const win = new THREE.Mesh(new THREE.SphereGeometry(.14, 12, 12), new THREE.MeshBasicMaterial({ color: 0x66f0ff })); win.position.set(0, .24, .45);
    b.add(hull, nose, win);
    for (let i = 0; i < 3; i++) { const f = new THREE.Group(); f.rotation.z = i * Math.PI * 2 / 3; const fin = new THREE.Mesh(new THREE.BoxGeometry(.05, .5, .45), red); fin.position.set(0, .4, -.5); f.add(fin); b.add(f); }
    this.fu = { uTime: { value: 0 }, uPower: { value: 0 } };
    this.flame = new THREE.Mesh(new THREE.ConeGeometry(.22, 1.2, 14, 8, true).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({ uniforms: this.fu, vertexShader: noise + fv, fragmentShader: ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    this.flame.position.z = -1.25; b.add(this.flame); g.scale.setScalar(.8);
  }
  // Orient along path tangent t1, bank from tangent change (t0 = slightly earlier tangent).
  pose(p, t1, t0, time, power) {
    this.group.position.copy(p); this.group.lookAt(this._v.copy(p).add(t1));
    this.body.rotation.z = Math.max(-.8, Math.min(.8, (t0.z * t1.x - t0.x * t1.z) * 14)); this.flame_(time, power);
  }
  flame_(time, power) { this.fu.uTime.value = time; this.fu.uPower.value = power * (.9 + .1 * Math.sin(time * 40)); }
  dispose() { this.group.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); }); }
}
// Glowing exhaust trail: fades behind the rocket, then brightens into a single constellation line at the finale.
export function buildTrail(curve, n = 900) {
  const pts = curve.getPoints(n), geo = new THREE.BufferGeometry().setFromPoints(pts);
  geo.setAttribute('aU', new THREE.BufferAttribute(Float32Array.from(pts, (_, i) => i / n), 1));
  const o = v => ({ value: v }), u = { uColor: o(new THREE.Color(0x66f0ff)), uHead: o(0), uFinale: o(0), uDash: o(0), uActive: o(1), uTime: o(0) };
  const l = new THREE.Line(geo, new THREE.ShaderMaterial({ uniforms: u, vertexShader: lv, fragmentShader: lf, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  l.u = u; l.frustumCulled = false; return l;
}
