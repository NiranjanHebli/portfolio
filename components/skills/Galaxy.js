import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '@/data/skills-galaxy.json';
import { buildLayout, cl } from './layout.js';
import { Planet, buildLink } from './Planet.js';
import { Rocket, buildTrail } from './Rocket.js';
import { StarField } from './StarField.js'; import { Nebula } from './Nebula.js'; import { CameraRig } from './CameraRig.js';
import { UI } from './UI.js'; import { createPost } from './postprocessing.js'; import { buildTimeline } from './TourTimeline.js';
gsap.registerPlugin(ScrollTrigger);

const hasGL = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } };
function buildList(root, pick) { // accessible HTML skill list (screen readers, no-WebGL, reduced motion)
  const box = document.createElement('div'); box.className = 'list'; box.setAttribute('aria-label', 'Skills');
  data.systems.forEach(s => {
    const h = document.createElement('h3'), ul = document.createElement('ul'); h.textContent = s.name;
    s.skills.forEach(k => { const li = document.createElement('li'), b = document.createElement('button'); b.textContent = k.name + (k.desc ? ' - ' + k.desc : ''); b.onclick = () => pick?.(k.name); li.append(b); ul.append(li); });
    box.append(h, ul);
  });
  root.append(box); return box;
}

export function mountGalaxy(root, opts = {}) {
  const V = THREE.Vector3, params = new URLSearchParams(location.search), debug = params.has('debug');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, mobile = matchMedia('(max-width:768px)').matches || /Mobi/i.test(navigator.userAgent);
  root.classList.add('sg');
  let pickByName = () => {}; const list = buildList(root, n => pickByName(n));
  if (!hasGL()) { root.classList.add('nogl'); return { dispose() { list.remove(); root.classList.remove('sg', 'nogl'); } }; }
  if (reduce) root.classList.add('reduced');

  const L = buildLayout(data), count = L.bodies.length;
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  let dpr = Math.min(devicePixelRatio, mobile ? 1.5 : 2); renderer.setPixelRatio(dpr); renderer.setClearColor(0x05060f);
  const canvas = renderer.domElement; canvas.setAttribute('aria-hidden', 'true'); root.prepend(canvas);
  // Tighter near/far frustum (0.8..1200) prevents depth-buffer Z-fighting flicker across distant galaxy systems
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, 1, .5, 2000), sunPos = new V();
  scene.add(new THREE.AmbientLight(0x9098ff, 1.25), new THREE.PointLight(0xffd9a0, 3, 0, 0));

  const planets = L.bodies.map(b => new Planet(b, mobile ? 32 : 64, sunPos)); planets.forEach(p => scene.add(p.group));
  const byName = new Map(planets.map(p => [p.b.name, p]));
  const links = data.systems.flatMap(s => s.links || []).map(([a, b]) => buildLink(byName.get(a), byName.get(b))); links.forEach(l => scene.add(l));
  const rig = new CameraRig(cam, L, data), stars = new StarField(mobile ? 6000 : 16000, rig.center), nebula = new Nebula(data);
  stars.points.renderOrder = -5;
  const rocket = new Rocket(), trail = buildTrail(L.curve); trail.renderOrder = 3;
  const shock = new THREE.Mesh(new THREE.RingGeometry(.96, 1, 64), new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  shock.rotation.x = -Math.PI / 2 + .25; shock.renderOrder = 2;
  scene.add(stars.points, nebula.mesh, rocket.group, trail, shock);
  const post = createPost(renderer, scene, cam, { mobile }); if (mobile) post.low();

  const state = { t: 0, power: 0 }, free = { on: false, focused: null, flying: false, rp: new V(), cp: new V(), look: new V() };
  const ui = new UI(root, data, planets, count), tl = buildTimeline({ data, planets, links, ui, state, stars, nebula, trail, shock });
  let st = null; if ((opts.mode || params.get('mode')) === 'scrub' && !reduce) st = ScrollTrigger.create({ trigger: root, start: 'top top', end: '+=8400', pin: true, scrub: 1, animation: tl });

  // ---- sizing / visibility
  let W = 0, H = 0, vis = !!reduce;
  const resize = () => {
    const nextW = root.clientWidth || 1, nextH = root.clientHeight || 1;
    if (nextW === W && nextH === H) return;
    W = nextW; H = nextH;
    post.setSize(W, H);
    cam.aspect = W / H;
    cam.updateProjectionMatrix();
    nebula.u.uAspect.value = W / H;
  };
  const ro = new ResizeObserver(resize); ro.observe(root); resize();
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting || reduce; if (vis) { clock.getDelta(); if (!st && !reduce && tl.progress() < 1) tl.play(); } else tl.pause(); }, { threshold: .35 }); io.observe(root);

  // ---- tour pose + free explore + full-view reset
  const P = new V(), T1 = new V(), T0 = new V(), clock = new THREE.Clock(), endRocketPos = L.curve.getPoint(1);
  function stepTour(t, time) {
    const u = L.uAt(t); L.curve.getPoint(u, P); L.curve.getTangent(u, T1); L.curve.getTangent(Math.max(0, u - .004), T0);
    P.y += Math.sin(time * 1.2) * .15 * cl(t - L.end); rocket.pose(P, T1, T0, time, state.power); rig.update(t, time, P); trail.u.uHead.value = u;
  }
  const freeInit = () => { free.rp.copy(rocket.group.position); free.cp.copy(cam.position); free.look.copy(rig.look); free.on = true; };
  function resetFullView() {
    if (!free.on) initStatic();
    const d = reduce ? 0 : .95;
    free.focused = null; free.flying = true;
    ui.hideCard(); ui.tip(null, 0, 0);
    gsap.killTweensOf([free.rp, free.cp, free.look]);
    gsap.to(free.rp, { x: endRocketPos.x, y: endRocketPos.y, z: endRocketPos.z, duration: d, ease: 'power2.inOut' });
    gsap.to(free.cp, { x: rig.over.x, y: rig.over.y, z: rig.over.z, duration: d, ease: 'power2.inOut', onComplete: () => { free.flying = false; } });
    gsap.to(free.look, { x: rig.center.x, y: rig.center.y, z: rig.center.z, duration: d, ease: 'power2.inOut' });
  }
  function flyTo(p) {
    if (!free.on) { freeInit(); if (state.t < L.total - .5) tl.progress(1).pause(); }
    free.focused = p; free.flying = true; ui.tip(null, 0, 0);
    const pos = p.group.position, dir = cam.position.clone().sub(pos).normalize(), d = reduce ? 0 : 1, s = p.b.size;
    const rt = pos.clone().addScaledVector(dir, s + 3), ct = pos.clone().addScaledVector(dir.clone().applyAxisAngle(new V(0, 1, 0), .7), s + 10); ct.y += s * .6 + 2;
    gsap.killTweensOf([free.rp, free.cp, free.look]);
    gsap.to(free.rp, { x: rt.x, y: rt.y, z: rt.z, duration: d, ease: 'power2.inOut' });
    gsap.to(free.cp, { x: ct.x, y: ct.y, z: ct.z, duration: d, ease: 'power2.inOut', onComplete: () => { free.flying = false; } });
    gsap.to(free.look, { x: pos.x, y: pos.y, z: pos.z, duration: d, ease: 'power2.inOut' });
    ui.card(p.b, resetFullView);
  }
  pickByName = n => { const p = byName.get(n); if (p) { if (reduce && !free.on) initStatic(); flyTo(p); } };
  function initStatic() { tl.progress(1).pause(); stepTour(L.total, 0); freeInit(); free.focused = null; free.flying = false; }
  ui.actEl.onclick = () => { if (free.on || state.t >= L.total - .5) { free.on = false; free.focused = null; free.flying = false; ui.hideCard(); tl.restart(); } else initStatic(); };
  ui.backEl.onclick = () => resetFullView();
  const onKey = e => { if (e.key === 'Escape' && free.focused) resetFullView(); };
  window.addEventListener('keydown', onKey);

  // ---- hover / click
  const ray = new THREE.Raycaster(), ndc = new V(), meshes = planets.map(p => p.mesh); let hov = null;
  const pick = e => { const r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1, 0); ray.setFromCamera(ndc, cam); const h = ray.intersectObjects(meshes, false)[0]; return h ? h.object.userData.planet : null; };
  const onMove = e => {
    if (free.flying) return;
    const p = pick(e), r = root.getBoundingClientRect();
    if (p !== hov) { hov && gsap.to(hov.s, { hover: 0, duration: .3 }); p && gsap.to(p.s, { hover: 1, duration: .3 }); hov = p; }
    canvas.style.cursor = p ? 'pointer' : 'default'; ui.tip(p, e.clientX - r.left, e.clientY - r.top);
  };
  const onClick = e => { const p = pick(e); if (p) flyTo(p); };
  canvas.addEventListener('pointermove', onMove); canvas.addEventListener('click', onClick);

  // ---- debug + adaptive quality
  let dbg = null; if (debug) { dbg = document.createElement('div'); dbg.className = 'dbg'; dbg.innerHTML = `<div></div><input type="range" min="0" max="${L.total}" step="0.01" value="0" aria-label="Timeline">`; root.append(dbg); dbg.querySelector('input').oninput = e => { tl.pause().time(+e.target.value); }; }
  let acc = 0, nf = 0, lvl = 0, fps = 60;
  const tick = dt => { acc += dt; nf++; if (acc > 1.5) { fps = nf / acc; acc = nf = 0; if (fps < 40 && lvl < 2) { if (++lvl === 1) { dpr = 1; renderer.setPixelRatio(1); post.low(); resize(); } else stars.setCount(5000); } } };

  if (reduce) initStatic();
  const initSkill = opts.skill || params.get('skill'); if (initSkill) pickByName(initSkill);
  let raf = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame); if (!vis) return;
    const dt = Math.min(clock.getDelta(), .1), time = clock.elapsedTime, t = state.t; tick(dt);
    let w = 0;
    if (free.on) {
      rocket.group.position.copy(free.rp); rocket.group.position.y += Math.sin(time * 1.2) * .12; rocket.group.lookAt(free.look); rocket.body.rotation.z = 0; rocket.flame_(time, .5);
      cam.position.copy(free.cp); cam.lookAt(free.look); if (cam.fov !== 55) { cam.fov = 55; cam.updateProjectionMatrix(); }
    } else { stepTour(t, time); w = rig.warp(t); }
    post.warp(w); nebula.update(time, t, cam, w); stars.update(time, dpr);
    planets.forEach(p => p.update(time, dt)); links.forEach(l => { l.u.uTime.value = time; }); trail.u.uTime.value = time;
    ui.update(t, cam, W, H, free.on, free.focused);
    if (dbg) { dbg.firstChild.textContent = `${fps.toFixed(0)} fps | t=${t.toFixed(1)}s | ${ui.sysEl.textContent}`; dbg.querySelector('input').value = t; }
    post.render(dt);
  };
  frame();

  return {
    dispose() { // no leaks on re-mount
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('click', onClick); window.removeEventListener('keydown', onKey);
      st?.kill(); tl.kill(); gsap.killTweensOf([free.rp, free.cp, free.look, ...planets.map(p => p.s)]);
      planets.forEach(p => p.dispose()); links.forEach(l => { l.geometry.dispose(); l.material.dispose(); }); trail.geometry.dispose(); trail.material.dispose();
      shock.geometry.dispose(); shock.material.dispose(); stars.dispose(); nebula.dispose(); rocket.dispose(); post.dispose(); ui.dispose();
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); list.remove(); dbg?.remove(); root.classList.remove('sg', 'reduced', 'nogl');
    },
  };
}
