import gsap from 'gsap';
// Single master timeline. state.t is the master clock; everything else is a reversible tween at a data-derived time.
export function buildTimeline({ data, planets, links, ui, state, stars, nebula, trail, shock }) {
  const end = data.systems[data.systems.length - 1].end, total = end + 4;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } }), q = s => ui.h.querySelector(s);
  tl.to(state, { t: total, duration: total }, 0);
  // 00:00-00:05 intro
  ui.scramble(tl, q('.boot'), 'INITIALIZING SKILL GALAXY...', .3, 3.2); tl.to(q('.boot'), { opacity: 0, duration: .4 }, 4.4);
  tl.fromTo(stars.u.uFade, { value: 0 }, { value: 1, duration: 3.5, ease: 'power2.out' }, 0).fromTo(nebula.u.uFade, { value: 0 }, { value: 1, duration: 4.5, ease: 'power2.out' }, 0);
  tl.fromTo(q('.title'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power2.inOut' }, .8).to(q('.title'), { opacity: 0, duration: .5 }, 4.5);
  // Launch: engine ramp + shockwave from the star
  const core = planets[0];
  tl.fromTo(state, { power: 0 }, { power: 1, duration: 7, ease: 'power2.in' }, 5);
  tl.fromTo(shock.material, { opacity: 0 }, { opacity: .9, duration: .15 }, 5.2).to(shock.material, { opacity: 0, duration: 2.2, ease: 'power2.out' }, 5.35)
    .fromTo(shock.scale, { x: 6, y: 6, z: 6 }, { x: 60, y: 60, z: 60, duration: 2.4, ease: 'power2.out' }, 5.2);
  tl.fromTo(core.s, { pulse: 0 }, { pulse: .8, duration: .2 }, 5.2).to(core.s, { pulse: 0, duration: 1.4 }, 5.4);
  // Per-skill reactions at each visit time (extended hold duration at each planet)
  planets.forEach(p => {
    const v = p.b.visit, s = p.s, t = p.b.sys.type;
    tl.to(s, { scale: 1.18, duration: .5, ease: 'back.out(1.4)' }, v - .55).to(s, { scale: 1, duration: .65, ease: 'sine.inOut' }, v + 1.25)
      .to(s, { rim: 1, duration: .45 }, v - .55).to(s, { rim: 0, duration: .85 }, v + 1.15);
    ui.label(tl, p, v);
    if (t === 'gas') tl.to(s, { spin: 5, duration: .6 }, v - .6).to(s, { spin: 1, duration: 1.6 }, v + 1.1);
    if (t === 'orb') tl.to(s, { pulse: 1, duration: .3 }, v - .35).to(s, { pulse: 0, duration: 1.1 }, v + .4);
    if (t === 'cloud') tl.to(s, { speed: 4, duration: .6 }, v - .6).to(s, { speed: 1, duration: 1.6 }, v + 1.1);
    if (t === 'vision') {
      tl.fromTo(s, { scan: 0 }, { scan: 1, duration: 1.5 }, v - .6);
      tl.fromTo(s, { bracket: 0 }, { bracket: 1, duration: .3, ease: 'back.out(2)' }, v - .35).to(s, { bracket: 0, duration: .35 }, v + 1.35);
    }
  });
  links.forEach(l => tl.fromTo(l.u.uActive, { value: 0 }, { value: 1, duration: .7 }, l.at)); // "graph executing"
  ui.panels(tl);
  // Finale
  ui.finale(tl, end); tl.fromTo(trail.u.uFinale, { value: 0 }, { value: 1, duration: 3, ease: 'sine.inOut' }, end);
  return tl;
}
