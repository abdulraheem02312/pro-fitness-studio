/* Pro Fitness Studio: nav, open-now status, hexagon lights, scroll animations, BMI calculator, WhatsApp form. */
(function () {
  const WA = '923090503334';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav ---------- */
  const nav = $('.nav');
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('.burger'), drawer = $('.drawer');
  if (burger) burger.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  $$('.drawer a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); drawer.classList.remove('is-open'); }));

  /* ---------- Open now (Pakistan time) ---------- */
  // Mon to Sat 4 PM to 11 PM, Sunday closed. Ladies-only slots (from their timings poster) come earlier in the day.
  const HOURS = { open: 16 * 60, close: 23 * 60 };
  const LADIES = [[10 * 60, 11 * 60 + 30], [14 * 60, 16 * 60]];
  function pkNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const g = t => parts.find(p => p.type === t).value;
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[g('weekday')], min: (+g('hour') % 24) * 60 + +g('minute') };
  }
  function status() {
    const { day, min } = pkNow();
    const ladies = day !== 0 && LADIES.some(([a, b]) => min >= a && min < b);
    const main = day !== 0 && min >= HOURS.open && min < HOURS.close;
    const open = ladies || main;
    let text;
    if (ladies) text = 'Open now · Ladies only';
    else if (main) text = 'Open now · till 11 PM';
    else if (day === 0 || (day === 6 && min >= HOURS.close)) text = 'Closed · Opens Monday';
    else if (min >= HOURS.close) text = 'Closed · Opens tomorrow';
    else if (min < LADIES[0][0]) text = 'Closed · Ladies at 10 AM, all at 4 PM';
    else text = 'Closed · Ladies at 2 PM, all at 4 PM';
    $$('[data-status]').forEach(el => {
      el.classList.toggle('is-open', open); el.classList.toggle('is-closed', !open);
      const s = el.querySelector('span'); if (s) s.textContent = text;
    });
    $$('.day').forEach(d => d.classList.toggle('is-today', +d.dataset.d === day));
  }
  status(); setInterval(status, 30000);

  /* ---------- Programs accordion: slide open and closed instead of jumping ---------- */
  $$('.acc details').forEach(d => {
    const sum = d.querySelector('summary'), body = d.querySelector('.acc__body');
    let anim = null;
    sum.addEventListener('click', e => {
      e.preventDefault();
      if (reduce || !body.animate) { d.open = !d.open; return; }
      if (anim) anim.cancel();
      const opening = !d.open || d.classList.contains('closing');
      d.classList.remove('closing');
      if (opening) {
        d.open = true;
        const h = body.scrollHeight;
        anim = body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,.7,.3,1)' });
      } else {
        d.classList.add('closing');
        const h = body.offsetHeight;
        anim = body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'ease-in' });
        anim.onfinish = () => { d.open = false; d.classList.remove('closing'); };
      }
    });
  });

  /* ---------- Year ---------- */
  $$('[data-year]').forEach(e => { e.textContent = new Date().getFullYear(); });

  /* ---------- Hexagon lights (like the gym ceiling) ---------- */
  function hexLights(svg) {
    const W = 1600, H = 900, r = 46, w = Math.sqrt(3) * r;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'defs');
    defs.innerHTML = '<filter id="hexglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    svg.appendChild(defs);
    const g = document.createElementNS(ns, 'g');
    // a honeycomb cluster up in the top right, perspective-squashed like a ceiling
    g.setAttribute('transform', 'translate(860 150) scale(1 .55) skewX(-12)');
    const cells = [];
    for (let row = 0; row < 6; row++) for (let col = 0; col < 9; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0), cy = row * r * 1.5;
      const d = Math.hypot(col - 4.5, (row - 2.5) * 1.2);
      if (d > 4.6) continue;
      const pts = [];
      for (let k = 0; k < 6; k++) { const a = Math.PI / 180 * (60 * k - 30); pts.push((cx + (r - 3) * Math.cos(a)).toFixed(1) + ',' + (cy + (r - 3) * Math.sin(a)).toFixed(1)); }
      const p = document.createElementNS(ns, 'path');
      p.setAttribute('d', 'M' + pts.join('L') + 'Z');
      g.appendChild(p); cells.push({ p, d });
    }
    svg.appendChild(g);
    return cells;
  }
  const hexSvg = $('.hexlights');
  const cells = hexSvg ? hexLights(hexSvg) : [];

  /* ---------- Scroll reveals (CSS does the motion, this only adds .in) ---------- */
  const animEls = $$('[data-anim], .tline');
  if (reduce || !('IntersectionObserver' in window)) {
    animEls.forEach(e => e.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    animEls.forEach(e => io.observe(e));
  }

  /* ---------- Hero intro: tube lights flicker on, then the headline lands ---------- */
  const hero = $('.hero');
  const ready = () => document.body.classList.add('is-ready');
  if (hero && !reduce) {
    const flick = document.createElement('div');
    flick.className = 'flick';
    hero.querySelector('.hero__bg').after(flick);
    flick.addEventListener('animationend', () => flick.remove());
  }
  const hasGsap = window.gsap && !reduce;
  if (!hasGsap) {
    cells.forEach(c => { c.p.style.opacity = .85; });
    ready();
  } else {
    if (window.Lenis) {
      const lenis = new Lenis({ lerp: .1 });
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); } }));
    }
    const tl = gsap.timeline();
    if (hero) {
      // the hexagon ceiling lights come on cell by cell (desktop only, hidden on phones by CSS)
      cells.sort((a, b) => a.d - b.d).forEach((c, i) => {
        const t0 = .2 + i * .03;
        tl.to(c.p, { opacity: .9, duration: .04 }, t0).to(c.p, { opacity: .15, duration: .04 }, t0 + .06).to(c.p, { opacity: .95, duration: .1 }, t0 + .12);
      });
      if (cells.length) gsap.to(cells.map(c => c.p), { opacity: .65, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: .1, from: 'random' }, delay: 2.6 });
      // headline words slam in like a poster stamp, one after another
      tl.from('.hero h1 .ln > span', { scale: 1.45, opacity: 0, transformOrigin: '0% 100%', duration: .32, ease: 'power4.in', stagger: .16 }, .95)
        .to('.hero .wrap', { x: 5, duration: .04, yoyo: true, repeat: 3, ease: 'none' }, 1.6)
        .add(ready, 1.55)
        .from('.hero__loc', { opacity: 0, x: -14, duration: .5, ease: 'power2.out' }, 1.3)
        .from('.hero .lead, .hero__ctas', { opacity: 0, y: 14, duration: .6, ease: 'power2.out', stagger: .08 }, 1.75)
        .from('.hero__facts .fact', { opacity: 0, y: 10, duration: .5, ease: 'power2.out', stagger: .07 }, 1.95);
    } else ready();
    if ($('.phero')) {
      tl.from('.phero .h1', { scale: 1.3, opacity: 0, transformOrigin: '0% 100%', duration: .32, ease: 'power4.in' }, .15)
        .from('.phero .crumbs, .phero .lead', { opacity: 0, y: 12, duration: .5, ease: 'power2.out', stagger: .08 }, .45);
    }
  }

  /* ---------- Before / after drag slider ---------- */
  const ba = $('.ba');
  if (ba) {
    const range = $('.ba__range', ba), kg = $('[data-kg]', ba), kgTag = $('[data-kgtag]', ba);
    const imgA = $('.ba__after', ba), imgB = $('.ba__before img', ba);
    const set = v => { ba.style.setProperty('--x', v + '%'); range.value = v; };
    range.addEventListener('input', () => set(+range.value));
    // weight number counts from the "before" to the "after" value
    let kgAnim = 0;
    function countKg(from, to) {
      cancelAnimationFrame(kgAnim);
      if (from == null) { kg.textContent = 'Before → After'; return; }
      const t0 = performance.now(), d = 900;
      const step = now => {
        const p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3);
        kg.textContent = `${from} → ${Math.round(from + (to - from) * e)} kg`;
        if (p < 1) kgAnim = requestAnimationFrame(step);
      };
      kgAnim = requestAnimationFrame(step);
    }
    // gentle sweep so people see it can be dragged
    function sweep() {
      if (reduce) return set(50);
      const t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / 1400);
        const v = p < .5 ? 50 + 35 * Math.sin(p * 2 * Math.PI) : 50 - 25 * Math.sin((p - .5) * 2 * Math.PI) * (1 - p);
        set(v);
        if (p < 1) requestAnimationFrame(step); else set(50);
      };
      requestAnimationFrame(step);
    }
    function show(chip) {
      $$('.chip').forEach(c => c.classList.toggle('on', c === chip));
      const i = chip.dataset.i;
      imgA.src = `assets/img/ba-${i}-after.webp`;
      imgB.src = `assets/img/ba-${i}-before.webp`;
      ba.classList.remove('swap'); void ba.offsetWidth; ba.classList.add('swap');
      kgTag.textContent = chip.dataset.tag;
      kgTag.style.color = chip.dataset.tag.startsWith('Lost') ? '' : '#9cc6ff';
      countKg(chip.dataset.from ? +chip.dataset.from : null, chip.dataset.to ? +chip.dataset.to : null);
      set(50);
    }
    $$('.chip').forEach(c => c.addEventListener('click', () => show(c)));
    // preload all pairs so switching is instant
    $$('.chip').forEach(c => ['before', 'after'].forEach(t => { const im = new Image(); im.src = `assets/img/ba-${c.dataset.i}-${t}.webp`; }));
    if ('IntersectionObserver' in window) {
      const o = new IntersectionObserver(en => { if (en[0].isIntersecting) { o.disconnect(); setTimeout(() => { sweep(); countKg(130, 90); }, 700); } }, { threshold: .5 });
      o.observe(ba);
    }
  }

  /* ---------- Today's timeline: "now" marker (8 AM to 12 AM scale) ---------- */
  const now = $('.tline__now');
  function placeNow() {
    if (!now) return;
    const { day, min } = pkNow();
    const pct = (min - 8 * 60) / (16 * 60) * 100;
    const b = now.querySelector('b');
    if (day === 0) { now.hidden = false; now.style.left = '50%'; b.textContent = 'Closed today'; return; }
    if (pct < 0 || pct > 100) { now.hidden = true; return; }
    now.hidden = false;
    now.style.left = pct + '%';
    const h = Math.floor(min / 60), m = String(min % 60).padStart(2, '0');
    b.textContent = `Now ${(h % 12) || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
    b.style.transform = pct < 8 ? 'translateX(-10%)' : pct > 92 ? 'translateX(-90%)' : '';
  }
  placeNow(); setInterval(placeNow, 30000);

  /* ---------- BMI calculator ---------- */
  const bmi = $('#bmi');
  if (bmi) {
    let unit = 'ft';
    const w = $('#bmi-w'), ft = $('#bmi-ft'), inch = $('#bmi-in'), cm = $('#bmi-cm');
    const ftRow = $('#bmi-ftrow'), cmRow = $('#bmi-cmrow');
    $$('.seg button', bmi).forEach(b => b.addEventListener('click', () => {
      unit = b.dataset.u;
      $$('.seg button', bmi).forEach(x => x.classList.toggle('on', x === b));
      ftRow.hidden = unit !== 'ft'; cmRow.hidden = unit !== 'cm';
      calc();
    }));
    const CATS = [
      [18.5, 'Underweight', '#5aa8ff', 'You are under the healthy range. A weight gain diet with strength training will help.', 'Strength and diet plan'],
      [25, 'Healthy weight', '#2bd67b', 'You are in the healthy range. Keep it that way with regular training.', 'Strength and cardio'],
      [30, 'Overweight', '#ffb648', 'A bit above the healthy range. Cardio with a diet plan is the usual fix.', 'Weight loss program'],
      [99, 'Obese', '#ff5a6a', 'Well above the healthy range. Start with a guided weight loss plan.', 'Guided weight loss'],
    ];
    function calc() {
      const kg = parseFloat(w.value);
      const m = unit === 'ft' ? ((parseFloat(ft.value) || 0) * 30.48 + (parseFloat(inch.value) || 0) * 2.54) / 100 : (parseFloat(cm.value) || 0) / 100;
      const out = $('#bmi-val'), cat = $('#bmi-cat'), tip = $('#bmi-tip'), needle = $('#bmi-needle'), cta = $('#bmi-cta');
      if (!(kg > 20 && kg < 300 && m > 1 && m < 2.5)) { out.textContent = '--'; cat.textContent = 'Enter your details'; cat.style.color = ''; tip.textContent = 'Your result will show here.'; needle.style.transform = 'rotate(-90deg)'; return; }
      const v = kg / (m * m), c = CATS.find(x => v < x[0]);
      out.textContent = v.toFixed(1);
      cat.textContent = c[1]; cat.style.color = c[2];
      tip.textContent = c[3];
      const ang = -90 + Math.max(0, Math.min(1, (v - 12) / 28)) * 180;
      needle.style.transform = `rotate(${ang}deg)`;
      cta.href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi Pro Fitness Studio! My BMI is ${v.toFixed(1)} (${c[1]}). I am interested in: ${c[4]}. Please share the details.`)}`;
    }
    [w, ft, inch, cm].forEach(i => i.addEventListener('input', calc));
    calc();
  }

  /* ---------- Contact form: opens WhatsApp with the message ready ---------- */
  const form = $('#join-form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const lines = [
      'Hi Pro Fitness Studio! I want to join.',
      `Name: ${f.get('name')}`,
      f.get('phone') ? `Phone: ${f.get('phone')}` : '',
      `Goal: ${f.get('goal')}`,
      `Preferred time: ${f.get('time')}`,
      f.get('msg') ? `Message: ${f.get('msg')}` : '',
    ].filter(Boolean);
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
})();
