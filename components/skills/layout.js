import * as THREE from 'three';
export const sm = x => x * x * (3 - 2 * x), cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
// Sample a [[time,value],...] channel with smoothstep between keys (custom lerp for colours).
export function chan(k, t, lerp = (a, b, f) => a + (b - a) * f) {
  if (t <= k[0][0]) return k[0][1];
  for (let j = 1; j < k.length; j++) if (t <= k[j][0]) return lerp(k[j - 1][1], k[j][1], sm(cl((t - k[j - 1][0]) / Math.max(1e-6, k[j][0] - k[j - 1][0]))));
  return k[k.length - 1][1];
}
// skills.json -> body positions, visit times, collision-free spline path and time->path mapping.
export function buildLayout(data) {
  const V = THREE.Vector3, bodies = [], raw = [[5, new V(7.5, 1.5, 6)], [9, new V(14, 6, 8)]];
  data.systems.forEach((sys, si) => {
    const n = sys.skills.length, c = new V(...sys.center), dur = sys.end - sys.start, pad = sys.type === 'star' ? 0 : Math.min(.7, dur * .06);
    sys.skills.forEach((sk, k) => {
      const a = (sys.phase || 0) + k * (sys.arc || 0) / Math.max(n - 1, 1);
      const y = sys.climb ? (k - (n - 1) / 2) * sys.climb : Math.sin(k * 1.7) * (sys.yvar || 0);
      const pos = sys.radius ? new V(Math.cos(a) * sys.radius, y, Math.sin(a) * sys.radius).add(c) : c.clone();
      const visit = sys.start + pad + (k + .5) / n * (dur - pad * 2);
      bodies.push({ ...sk, sys, si, k, n, pos, visit, pal: sk.pal || sys.palettes[k % sys.palettes.length], index: bodies.length });
      if (sys.type !== 'star') {
        const clear = (sys.type === 'gas' ? sk.size * 2.55 : sk.size * (sys.pass || 1.9)) + 2.4;
        const off = new V(Math.cos(a), .35, Math.sin(a)).normalize().multiplyScalar(clear);
        raw.push([visit, pos.clone().add(off)]);
      }
    });
  });
  const end = data.systems[data.systems.length - 1].end, total = end + 4, last = raw[raw.length - 1][1];
  raw.push([end + .3, last.clone().add(new V(3, 2.5, 3))], [total, last.clone().add(new V(3, 2.8, 3))]);

  // Ensure no waypoint or segment ever passes through any planet sphere
  const safeR = b => (b.sys.type === 'gas' ? b.size * 2.45 : b.size * 1.65) + 2.0;
  const pushPoint = p => {
    for (const b of bodies) {
      const d = p.clone().sub(b.pos), len = d.length(), minD = safeR(b);
      if (len < minD) { if (len < 1e-4) d.set(0, 1, 0); p.copy(b.pos).add(d.normalize().multiplyScalar(minD)); }
    }
    return p;
  };
  raw.forEach(([, p]) => pushPoint(p));
  const pts = [], keys = [];
  for (let i = 0; i < raw.length; i++) {
    if (i > 0) {
      const [t0, p0] = raw[i - 1], [t1, p1] = raw[i], mid = p0.clone().lerp(p1, .5);
      let hit = false;
      for (const b of bodies) if (mid.distanceTo(b.pos) < safeR(b)) { hit = true; break; }
      if (hit) { mid.y += 2.5; pushPoint(mid); keys.push([(t0 + t1) * .5, pts.length]); pts.push(mid); }
    }
    keys.push([raw[i][0], pts.length]); pts.push(raw[i][1]);
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  function uAt(t) {
    if (t <= keys[0][0]) return 0;
    for (let j = 1; j < keys.length; j++) if (t <= keys[j][0]) {
      const [t0, i0] = keys[j - 1], [t1, i1] = keys[j]; let f = (t - t0) / (t1 - t0);
      f += (sm(sm(f)) - f) * .5; // gentle dwell slow-down at each planet waypoint
      return (i0 + (i1 - i0) * f) / (pts.length - 1);
    }
    return 1;
  }
  return { bodies, curve, uAt, end, total };
}
