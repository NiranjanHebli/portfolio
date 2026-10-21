import gsap from 'gsap';
const CH = '<>/\\|{}[]#$%&*+=_-0123456789';
const scr = (s, p) => [...s].map((c, i) => c === ' ' || i < p * s.length ? c : CH[(Math.random() * CH.length) | 0]).join('');
const el = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };
const fmt = b => b.sys.type === 'ice' ? `<${b.name} />` : b.sys.type === 'devops' ? `$ ${b.name}` : b.name;
const NODES = [[10, 30], [40, 12], [40, 48], [80, 12], [80, 48], [110, 30]], EDGES = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]];
export class UI {
  constructor(root, data, planets) {
    this.data = data; this.planets = planets; this.root = root;
    this.end = data.systems[data.systems.length - 1].end; this.total = this.end + 4;
    const g = EDGES.map(([a, b]) => `<line x1="${NODES[a][0]}" y1="${NODES[a][1]}" x2="${NODES[b][0]}" y2="${NODES[b][1]}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`).join('') + NODES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" opacity="0"/>`).join('');
    const h = this.h = el(`<div class="hud" aria-hidden="true"><div class="boot"></div><h1 class="title">SKILLS</h1><div class="sys"></div>
<div class="ctrls"><button type="button" class="back" hidden>&lt;- BACK TO FULL VIEW</button><button type="button" class="act">SKIP TOUR</button></div>
<div class="bar"><i></i></div>
<div class="panel loss"><span>LOSS</span><svg viewBox="0 0 120 60"><path d="M2 8C20 10 25 40 50 44S90 54 118 52" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></div>
<div class="panel graph"><span>AGENT GRAPH</span><svg viewBox="0 0 120 60">${g}</svg></div>
<p class="hint">Click any planet to explore</p><div class="tip"></div></div>`);
    root.append(h); const q = s => h.querySelector(s);
    this.sysEl = q('.sys'); this.actEl = q('.act'); this.backEl = q('.back'); this.hintEl = q('.hint');
    this.bar = q('.bar i'); this.tipEl = q('.tip'); this._v = null;
    this.cardEl = el('<aside class="card" role="dialog" aria-live="polite"></aside>'); root.append(this.cardEl);
    planets.forEach(p => {
      p.s.lblOn = 0;
      const b = p.b, wrap = p.labelWrap = el('<div class="lbl-pos"><div class="lbl"><i class="ln"></i><b></b><span></span><u class="pr"><em></em></u></div></div>');
      const l = p.label = wrap.firstChild;
      l.querySelector('b').textContent = fmt(b); l.querySelector('span').textContent = b.sys.name + (b.sys.type === 'star' ? ' // FOUNDATION' : '');
      l.querySelector('em').style.width = (b.prof ?? .8) * 100 + '%'; h.append(wrap);
      if (b.sys.type === 'vision') { p.br = el('<div class="br"><span></span></div>'); p.br.firstChild.textContent = b.name + ' | confidence 0.98'; h.append(p.br); }
    });
  }
  scramble(tl, node, text, at, dur) { // reversible text-scramble reveal
    const o = { p: 0 }; tl.fromTo(o, { p: 0 }, { p: 1, duration: dur, ease: 'none', onUpdate: () => { node.textContent = scr(text, o.p); } }, at);
  }
  label(tl, p, v) {
    const l = p.label, b = l.querySelector('b');
    tl.fromTo(p.s, { lblOn: 0 }, { lblOn: 1, duration: .01 }, v - .55)
      .fromTo(l, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .42, ease: 'expo.out' }, v - .5)
      .fromTo(l.querySelector('.ln'), { scaleX: 0 }, { scaleX: 1, duration: .4, ease: 'expo.out' }, v - .5)
      .to(l, { opacity: 0, y: -10, duration: .35, ease: 'power1.in' }, v + 1.25)
      .to(p.s, { lblOn: 0, duration: .01 }, v + 1.65);
    if (p.b.sys.type === 'star') this.scramble(tl, b, b.textContent, v - .5, .85);
  }
  panels(tl) {
    const S = id => this.data.systems.find(s => s.id === id), q = s => this.h.querySelector(s);
    const ml = S('ml'), ag = S('agentic');
    tl.fromTo(q('.loss'), { opacity: 0 }, { opacity: 1, duration: .4 }, ml.start + .2)
      .fromTo(q('.loss path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: ml.end - ml.start - 1.5, ease: 'power1.out' }, ml.start + .6)
      .to(q('.loss'), { opacity: 0, duration: .4 }, ml.end - .3);
    const g = q('.graph'), d = ag.end - ag.start;
    tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: .4 }, ag.start + .2).to(g, { opacity: 0, duration: .4 }, ag.end - .4);
    g.querySelectorAll('circle').forEach((c, i) => tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: .3 }, ag.start + .5 + i * d / 7));
    g.querySelectorAll('line').forEach((l, i) => tl.fromTo(l, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .6 }, ag.start + .8 + i * d / 7));
  }
  finale(tl, t) {
    const q = s => this.h.querySelector(s);
    tl.fromTo(q('.hint'), { opacity: 0 }, { opacity: 1, duration: .8 }, t + 1.2);
  }
  update(t, cam, w, h, freeOn, focused) {
    const S = this.data.systems; let i = -1; S.forEach((x, k) => { if (t >= x.start && t < x.end) i = k; });
    this.sysEl.textContent = focused ? `FOCUS // ${focused.b.name.toUpperCase()}` : freeOn ? 'GALAXY // FREE EXPLORE' : t < 5 ? 'BOOT' : t >= this.end ? 'GALAXY // FREE EXPLORE' : i >= 0 ? `SYS ${String(i + 1).padStart(2, '0')} // ${S[i].name}` : '>> WARP';
    if (this.actEl) this.actEl.textContent = (freeOn || t >= this.total - .5) ? 'REPLAY TOUR' : 'SKIP TOUR';
    if (this.backEl) this.backEl.hidden = !focused;
    if (this.hintEl && (freeOn || t >= this.end)) {
      this.hintEl.style.opacity = focused ? '0' : '1';
    }
    this.bar.style.transform = `scaleX(${Math.min(1, t / this.total)})`;
    const tan = Math.tan(cam.fov * Math.PI / 360), v = this._v ||= cam.position.clone();
    for (const p of this.planets) {
      const showLbl = !freeOn && p.s.lblOn > .5;
      const showBr = !freeOn && p.br && p.s.bracket > .01;
      if (!showLbl && !showBr) {
        if (p.labelWrap.style.visibility !== 'hidden') p.labelWrap.style.visibility = 'hidden';
        if (p.br && p.br.style.opacity !== '0') p.br.style.opacity = '0';
        continue;
      }
      v.copy(p.group.position).project(cam);
      const distToPlanet = Math.max(cam.position.distanceTo(p.group.position), 0.1);
      const r = p.b.size * p.s.scale / (distToPlanet * tan) * h / 2, x = (v.x * .5 + .5) * w, y = (-v.y * .5 + .5) * h, on = v.z < 1;
      if (showLbl && on && !isNaN(x) && !isNaN(y)) {
        const ws = p.labelWrap.style; ws.visibility = 'visible';
        const lx = Math.min(Math.max(12, x + r + 16), Math.max(12, w - 340));
        const ly = Math.min(Math.max(12, y - r - 28), Math.max(12, h - 120));
        ws.transform = `translate3d(${lx.toFixed(1)}px,${ly.toFixed(1)}px,0)`;
      } else if (showLbl) {
        p.labelWrap.style.visibility = 'hidden';
      }
      if (showBr && on && !isNaN(x) && !isNaN(y)) {
        const s = r * 2.6, bs = p.br.style;
        bs.width = `${s.toFixed(1)}px`; bs.height = `${s.toFixed(1)}px`;
        bs.opacity = String(p.s.bracket);
        bs.transform = `translate3d(${(x - s / 2).toFixed(1)}px,${(y - s / 2).toFixed(1)}px,0) scale(${(2 - p.s.bracket).toFixed(2)})`;
      } else if (showBr) {
        p.br.style.opacity = '0';
      }
    }
  }
  tip(p, x, y) {
    const s = this.tipEl;
    if (!p) { s.style.opacity = '0'; return; }
    s.textContent = `${p.b.name} - ${p.b.sys.name}`;
    s.style.opacity = '1';
    s.style.transform = `translate3d(${(x + 14).toFixed(1)}px,${(y + 14).toFixed(1)}px,0)`;
  }
  card(b, onBackToFullView) {
    const c = this.cardEl;
    c.innerHTML = '<button type="button" class="x" aria-label="Close and return to full galaxy view" title="Return to full galaxy view">X</button><small></small><h3></h3><p></p><u class="pr"><em></em></u><button type="button" class="back-btn">&lt;- Back to Full Galaxy View</button>';
    c.querySelector('small').textContent = b.sys.name;
    c.querySelector('h3').textContent = b.name;
    c.querySelector('p').textContent = (b.desc || '') + (b.prof != null ? ` (Proficiency ${Math.round(b.prof * 100)}%)` : '');
    c.querySelector('em').style.width = (b.prof ?? .8) * 100 + '%';
    c.querySelector('.x').onclick = onBackToFullView;
    c.querySelector('.back-btn').onclick = onBackToFullView;
    c.classList.add('on');
  }
  hideCard() { this.cardEl.classList.remove('on'); }
  dispose() { this.h.remove(); this.cardEl.remove(); }
}
