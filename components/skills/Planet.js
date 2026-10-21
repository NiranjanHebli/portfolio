import * as THREE from 'three';
import noise from './shaders/noise.glsl?raw'; import vert from './shaders/body.vert?raw';
import star from './shaders/star.frag?raw'; import rocky from './shaders/rocky.frag?raw'; import gas from './shaders/gas.frag?raw';
import orb from './shaders/orb.frag?raw'; import vision from './shaders/vision.frag?raw'; import cloud from './shaders/cloud.frag?raw'; import ring from './shaders/ring.frag?raw';
import lv from './shaders/line.vert?raw'; import lf from './shaders/line.frag?raw';
const F = { star, rocky, ice: rocky, devops: rocky, gas, orb, vision, cloud }, M = { rocky: 0, ice: 1, devops: 2 }, one = value => ({ value });
export class Planet {
  constructor(b, seg, sun) {
    const t = b.sys.type, c = b.pal.map(x => new THREE.Color(x)); this.b = b;
    this.s = { rim: 0, pulse: 0, scan: 0, hover: 0, bracket: 0, scale: 1, spin: 1, speed: 1 }; // tweened by the timeline
    this.u = {
      uTime: one(0), uA: one(c[0]), uB: one(c[1]), uC: one(c[2]), uSun: one(sun),
      uRim: one(0), uPulse: one(0), uScan: one(0), uSpin: one(1), uMode: one(M[t] ?? 0),
      uShell: one(0), uSpeed: one(1), uSeed: one(b.index * 2.17 + .5)
    };
    const g = this.group = new THREE.Group(); g.position.copy(b.pos);
    const mk = (r, u, f, o = {}) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg), new THREE.ShaderMaterial({ uniforms: u, vertexShader: vert, fragmentShader: noise + f, ...o }));
    this.mesh = mk(b.size, this.u, F[t]); this.mesh.userData.planet = this; this.mesh.renderOrder = 1;
    // Slight axial tilt per planet for a realistic cosmic system feel
    this.mesh.rotation.z = ((b.index % 5) - 2) * .12;
    g.add(this.mesh);
    const shell = (k, f, o) => {
      const m = mk(b.size * k, { ...this.u, uShell: one(1) }, f, { transparent: true, depthWrite: false, ...o });
      m.renderOrder = 2; g.add(m);
    };
    if (t === 'star') shell(1.4, star, { blending: THREE.AdditiveBlending });
    if (t === 'cloud') shell(1.06, cloud);
    if (t === 'gas' || b.ring) {
      const inner = b.size * 1.38, outer = b.size * (t === 'gas' ? 2.35 : 2.05);
      const r = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 96), new THREE.ShaderMaterial({
        uniforms: { uA: this.u.uC, uInner: one(inner), uOuter: one(outer), uTime: this.u.uTime, uSpin: this.u.uSpin },
        vertexShader: vert, fragmentShader: noise + ring, transparent: true, depthWrite: false, side: THREE.DoubleSide
      }));
      r.renderOrder = 2;
      r.rotation.set(Math.PI / 2 - .38 + (b.index % 3) * .1, 0, (b.index % 4) * .28); g.add(r);
    }
  }
  update(time, dt) {
    const s = this.s, u = this.u; u.uTime.value = time; u.uRim.value = Math.max(s.rim, s.hover * .8); u.uPulse.value = s.pulse;
    u.uScan.value = s.scan; u.uSpin.value = s.spin; u.uSpeed.value = s.speed;
    this.group.scale.setScalar(s.scale * (1 + s.hover * .06)); this.mesh.rotation.y += dt * .08;
  }
  dispose() { this.group.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); }); }
}
// Animated dashed energy line between two related skills.
export function buildLink(a, b) {
  const A = a.group.position, B = b.group.position, m = A.clone().add(B).multiplyScalar(.5); m.y += 2.5;
  const pts = new THREE.QuadraticBezierCurve3(A, m, B).getPoints(48), geo = new THREE.BufferGeometry().setFromPoints(pts);
  geo.setAttribute('aU', new THREE.BufferAttribute(Float32Array.from(pts, (_, i) => i / 48), 1));
  const u = { uColor: one(new THREE.Color(0x66f0ff)), uHead: one(2), uFinale: one(1), uDash: one(1), uActive: one(0), uTime: one(0) };
  const l = new THREE.Line(geo, new THREE.ShaderMaterial({ uniforms: u, vertexShader: lv, fragmentShader: lf, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  l.renderOrder = 3; l.u = u; l.at = Math.max(a.b.visit, b.b.visit) + .1; l.frustumCulled = false; return l;
}
