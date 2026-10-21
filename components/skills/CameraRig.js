import * as THREE from 'three';
import gsap from 'gsap';
import { chan, cl, sm } from './layout.js';
const e2 = gsap.parseEase('power2.inOut');
// Deterministic camera: a pure function of tour time t (safe for scroll-scrubbing).
export class CameraRig {
  constructor(cam, L, data) {
    const V = THREE.Vector3, S = data.systems; this.cam = cam; this.L = L; this.s0End = S[0].end;
    this.pos = new V(); this.look = new V(); this.la = new V(); this.tg = new V(); this.ch = new V(); this.v = new V();
    this.dist = S.flatMap(s => [[s.start, s.camDist || 6], [s.end, s.camDist || 6]]);
    this.drift = S.flatMap(s => [[s.start, s.drift ? 1 : 0], [s.end, s.drift ? 1 : 0]]);
    this.warps = []; for (let i = 1; i < S.length; i++) if (S[i].start > S[i - 1].end) this.warps.push([S[i - 1].end, S[i].start]);
    const b = new THREE.Box3(); L.bodies.forEach(x => b.expandByPoint(x.pos));
    this.center = b.getCenter(new V()); this.over = this.center.clone().add(new V(.3, .5, 1).normalize().multiplyScalar(b.getSize(new V()).length() * .82));
  }
  warp(t) { let w = 0; for (const [a, b] of this.warps) if (t >= a && t <= b) w = Math.sin(Math.PI * (t - a) / (b - a)); return w; }
  update(t, time, P) {
    const { cam: c, L, pos, look, ch, v, s0End } = this, u = L.uAt(t);
    L.curve.getTangent(u, this.tg); L.curve.getPoint(Math.min(1, u + .014), this.la); // look-ahead
    const d = chan(this.dist, t), dr = chan(this.drift, t);
    ch.copy(P).addScaledVector(this.tg, -d); ch.y += 1.9 + d * .12;
    ch.x += (Math.sin(time * .9) * .4 + Math.sin(time * 2.3) * .15) * dr; ch.y += Math.cos(time * .7) * .3 * dr; // handheld drift
    pos.copy(ch); look.copy(this.la);
    if (t < 5) { pos.set(0, 60, 260).lerp(v.set(0, 9.5, 38), e2(t / 5)); look.set(0, 0, 0); }           // intro dolly
    else if (t < s0End) {                                                                               // 90 deg orbit then lock behind rocket
      const a = e2(cl((t - 5) / (s0End - 7))) * Math.PI / 2; v.set(Math.sin(a) * 38, 9.5, Math.cos(a) * 38);
      pos.copy(v).lerp(ch, sm(cl((t - (s0End - 2.5)) / 2.5))); look.set(0, 0, 0).lerp(this.la, sm(cl((t - 6) / (s0End - 6))));
    } else if (t > L.end) { const f = e2(cl((t - L.end) / 4)); pos.copy(ch).lerp(this.over, f); look.copy(this.la).lerp(this.center, f); } // finale pull-back
    if (pos.distanceTo(look) > 0.05) { c.position.copy(pos); c.lookAt(look); }
    const fov = 55 + 30 * this.warp(t); if (Math.abs(c.fov - fov) > .01) { c.fov = fov; c.updateProjectionMatrix(); }
  }
}
