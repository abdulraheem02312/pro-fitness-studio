/* Pro Fitness Studio: navigation, open-now status, reveals, counters, story, programs, quiz, results,
   trainers, gallery, reviews, schedule, workout planner, membership builder, calculators, contact form. */
(function () {
  const WA = '923090503334';
  const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = matchMedia('(min-width: 961px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Nav: sticky state, dropdowns, drawer ---------- */
  const nav = $('.nav');
  $$('[data-dd]').forEach(dd => {
    const btn = $('.dd__btn', dd), menu = $('.dd__menu', dd);
    let timer;
    const set = open => { dd.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', () => set(!dd.classList.contains('open')));
    if (finePointer) {
      dd.addEventListener('mouseenter', () => { clearTimeout(timer); $$('[data-dd]').forEach(o => o !== dd && o.classList.remove('open')); set(true); });
      dd.addEventListener('mouseleave', () => { timer = setTimeout(() => set(false), 180); });
    }
    dd.addEventListener('keydown', e => {
      const items = $$('a', menu);
      if (e.key === 'Escape') { set(false); btn.focus(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); set(true); const i = items.indexOf(document.activeElement); items[(i + 1) % items.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); const i = items.indexOf(document.activeElement); if (i > 0) items[i - 1].focus(); }
    });
    dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget)) set(false); });
  });
  document.addEventListener('click', e => $$('[data-dd].open').forEach(dd => { if (!dd.contains(e.target)) { dd.classList.remove('open'); $('.dd__btn', dd).setAttribute('aria-expanded', 'false'); } }));

  const burger = $('.burger'), drawer = $('.drawer');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { drawer.removeAttribute('inert'); setTimeout(() => $('.dl, .dg__btn', drawer)?.focus(), 250); }
    else drawer.setAttribute('inert', '');
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  }
  if (burger) {
    burger.addEventListener('click', () => setMenu(!drawer.classList.contains('is-open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
    $$('a', drawer).forEach(a => a.addEventListener('click', () => setMenu(false)));
    $$('.dg__btn', drawer).forEach(b => b.addEventListener('click', () => b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true')));
    desktop.addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

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
    // schedule: today's day, a live "now" marker on the 9 AM to 11 PM timeline, and a status on each slot
    const NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $$('.wk__d').forEach(d => d.classList.toggle('today', +d.dataset.d === day));
    $$('[data-tl-title]').forEach(t => { t.textContent = day === 0 ? 'Today: Sunday, closed' : `Today: ${NAMES[day]}`; });
    const h = Math.floor(min / 60), clock = `${(h % 12) || 12}:${String(min % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
    $$('[data-tl-now]').forEach(n => {
      const on = day !== 0 && min >= 540 && min <= 1380;
      n.hidden = !on;
      if (!on) return;
      const p = (min - 540) / 840 * 100;
      n.style.left = p + '%';
      const b = n.querySelector('b'); b.textContent = 'Now ' + clock;
      b.style.transform = p < 8 ? 'translateX(-12%)' : p > 92 ? 'translateX(-88%)' : '';
    });
    const span = m => m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? (m % 60) + 'm' : ''}`.trim() : `${m}m`;
    $$('[data-slot]').forEach(c => {
      const s = +c.dataset.s * 60, e = +c.dataset.e * 60, st = c.querySelector('[data-slot-st]');
      let txt, live = false;
      if (day === 0) txt = 'Closed today';
      else if (min >= s && min < e) { txt = `Open now, ${span(e - min)} left`; live = true; }
      else if (min < s) txt = `Starts in ${span(s - min)}`;
      else txt = day === 6 ? 'Next on Monday' : 'Done for today';
      st.textContent = txt; c.classList.toggle('live', live);
    });
  }
  status(); setInterval(status, 30000);
  $$('[data-year]').forEach(e => { e.textContent = new Date().getFullYear(); });

  /* ---------- Scroll reveals + counters ---------- */
  function countUp(el) {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    const t0 = performance.now(), d = 1600;
    const step = now => {
      const p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const animEls = $$('[data-anim]');
  if (reduce || !('IntersectionObserver' in window)) {
    animEls.forEach(e => e.classList.add('in'));
  } else {
    $$('[data-count]').forEach(el => { el.textContent = (0).toFixed(+(el.dataset.dec || 0)); });
    // a fully clipped element (the "wipe" reveal) never counts as visible, so watch its parent instead
    const owner = new Map();
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = owner.get(en.target) || en.target;
      el.classList.add('in');
      $$('[data-count]', el).forEach(countUp);
      io.unobserve(en.target);
    }), { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    animEls.forEach(e => {
      if (e.dataset.anim !== 'wipe') return io.observe(e);
      owner.set(e.parentElement, e); io.observe(e.parentElement);
    });
  }

  /* ---------- Hexagon lights (like the gym ceiling) ---------- */
  function hexLights(svg) {
    const W = 1600, H = 900, r = 46, w = Math.sqrt(3) * r;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'defs');
    defs.innerHTML = '<filter id="hexglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    svg.appendChild(defs);
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', 'translate(700 120) scale(1 .5) skewX(-12)');
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
  const cells = hexSvg && desktop.matches ? hexLights(hexSvg) : [];

  /* ---------- Hero intro + smooth scroll (GSAP and Lenis load deferred) ---------- */
  const hero = $('.hero');
  const ready = () => document.body.classList.add('is-ready');
  if (hero && !reduce) {
    const flick = document.createElement('div');
    flick.className = 'flick';
    $('.hero__bg', hero).after(flick);
    flick.addEventListener('animationend', () => flick.remove());
  }
  function intro() {
    const hasGsap = window.gsap && !reduce;
    if (!hasGsap) { cells.forEach(c => { c.p.style.opacity = .85; }); ready(); return; }
    if (window.Lenis) {
      const lenis = new Lenis({ lerp: .11, smoothWheel: true });
      window.__lenis = lenis;
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); } }));
      if (location.hash) { const t = $(location.hash); if (t) setTimeout(() => lenis.scrollTo(t, { offset: -80, immediate: true }), 60); }
    }
    const tl = gsap.timeline();
    if (hero) {
      cells.sort((a, b) => a.d - b.d).forEach((c, i) => {
        const t0 = .2 + i * .028;
        tl.to(c.p, { opacity: .9, duration: .04 }, t0).to(c.p, { opacity: .15, duration: .04 }, t0 + .06).to(c.p, { opacity: .95, duration: .1 }, t0 + .12);
      });
      if (cells.length) gsap.to(cells.map(c => c.p), { opacity: .6, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: .1, from: 'random' }, delay: 2.6 });
      tl.from('.hero__h .ln > span', { yPercent: 110, duration: .9, ease: 'expo.out', stagger: .09 }, .75)
        .add(ready, 1.15)
        .from('.hero__loc', { opacity: 0, x: -14, duration: .6, ease: 'power2.out' }, .9)
        .from('.hero .lead, .hero__ctas', { opacity: 0, y: 16, duration: .7, ease: 'power2.out', stagger: .08 }, 1.2)
        .from('.hero__facts > *', { opacity: 0, y: 12, duration: .6, ease: 'power2.out', stagger: .07 }, 1.4);
    } else ready();
    if ($('.phero')) {
      tl.from('.phero__h', { yPercent: 40, opacity: 0, duration: .9, ease: 'expo.out' }, .1)
        .from('.phero .crumbs, .phero .eyebrow, .phero .lead', { opacity: 0, y: 12, duration: .6, ease: 'power2.out', stagger: .07 }, .3);
    }
  }
  if (document.readyState === 'complete') intro(); else addEventListener('load', intro, { once: true });

  /* ---------- Hero video: muted loop, fades in when it plays, pauses off screen ---------- */
  const vid = $('.hero__video');
  if (vid) {
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) vid.remove(); // the poster image stays
    else {
      const show = () => vid.classList.add('on');
      if (vid.readyState >= 3) show(); else vid.addEventListener('playing', show, { once: true });
      const tryPlay = () => { const p = vid.play(); if (p) p.catch(() => {}); };
      // the 9:16 clip is picked by <source media>, so reload it when the screen flips between portrait and wide
      const tall = matchMedia('(max-width: 960px) and (orientation: portrait)');
      tall.addEventListener('change', () => { vid.classList.remove('on'); vid.load(); vid.addEventListener('playing', show, { once: true }); tryPlay(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { if (e.isIntersecting) tryPlay(); else vid.pause(); }).observe(vid);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
    }
  }

  /* ---------- One scroll loop for every scroll-linked effect ---------- */
  const gal = $('[data-gal]'), galTrack = $('[data-gal-track]');
  const heroBg = $('.hero__bg');
  const marks = $$('.sh__mark');
  let galMax = 0;
  function layoutGallery() {
    if (!gal) return;
    const pin = desktop.matches && !reduce;
    gal.classList.toggle('gal--pinned', pin);
    galTrack.style.transform = '';
    if (pin) {
      galMax = Math.max(0, galTrack.scrollWidth - innerWidth);
      gal.style.height = (galMax + innerHeight) + 'px';
    } else { gal.style.height = ''; galMax = 0; }
  }
  function onScroll() {
    const y = scrollY, vh = innerHeight;
    nav && nav.classList.toggle('is-scrolled', y > 30);
    if (heroBg && !reduce && y < vh * 1.2) heroBg.style.transform = `translate3d(0, ${y * .18}px, 0)`;
    // heading watermarks drift sideways as their section passes through the screen
    if (!reduce) marks.forEach(m => { const r = m.getBoundingClientRect(); if (r.bottom > -200 && r.top < vh + 200) m.style.setProperty('--mx', ((r.top - vh / 2) * -.12).toFixed(1) + 'px'); });
    if (gal && galMax) {
      const r = gal.getBoundingClientRect();
      const p = clamp(-r.top / (gal.offsetHeight - vh), 0, 1);
      galTrack.style.transform = `translate3d(${-p * galMax}px,0,0)`;
      $$('.gal__btn img', galTrack).forEach((im, i) => im.style.setProperty('--px', ((p - i / 9) * -30).toFixed(1) + 'px'));
    }
  }
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
  addEventListener('resize', () => { layoutGallery(); onScroll(); });
  addEventListener('load', () => { layoutGallery(); onScroll(); });
  layoutGallery(); onScroll();

  /* ---------- Generic tabs (programs, planner types, calculators) ---------- */
  function tabs(list, onSelect) {
    const btns = $$('[role="tab"]', list);
    const select = (b, focus) => {
      btns.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
      if (focus) b.focus();
      onSelect(b);
    };
    btns.forEach(b => b.addEventListener('click', () => select(b)));
    list.addEventListener('keydown', e => {
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); select(btns[(i + k + btns.length) % btns.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(btns[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(btns[btns.length - 1], true); }
    });
  }

  /* ---------- Programs: index list + stage with mask transitions and tilt ---------- */
  $$('[data-prog]').forEach(prog => {
    const list = $('.prog__list', prog);
    tabs(list, b => {
      const panel = $('#' + b.getAttribute('aria-controls'));
      $$('.prog__panel', prog).forEach(p => { const on = p === panel; p.hidden = !on; p.classList.toggle('on', on); p.classList.remove('enter'); });
      void panel.offsetWidth; panel.classList.add('enter');
      if (!desktop.matches) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    });
    if (finePointer && !reduce) $$('.prog__tab', prog).forEach(b => b.addEventListener('mouseenter', () => { if (b.getAttribute('aria-selected') !== 'true') b.click(); }));
  });
  if (finePointer && !reduce) $$('[data-tilt]').forEach(m => {
    const im = $('img', m);
    m.addEventListener('pointermove', e => {
      const r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      im.style.transform = `scale(1.08) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translate(${x * -14}px, ${y * -14}px)`;
    });
    m.addEventListener('pointerleave', () => { im.style.transform = ''; });
  });

  /* ---------- Fitness quiz: five questions, scored against real programs ---------- */
  const quizEl = $('[data-quiz]');
  const progData = (() => { try { return JSON.parse($('#prog-data').textContent); } catch { return []; } })();
  const P = id => progData.find(p => p.id === id);
  const Q = [
    { k: 'goal', q: 'What is your main goal?', o: [
      ['lose', 'Lose weight', 'Burn fat and feel lighter', { loss: 3, diet: 1, cardio: 1 }],
      ['muscle', 'Build muscle', 'Gain size and shape', { strength: 2, transform: 2, diet: 1 }],
      ['strong', 'Get stronger', 'Lift more, move better', { strength: 3 }],
      ['fit', 'Fitness and stamina', 'More energy, better heart health', { cardio: 3, loss: 1 }],
      ['pain', 'Train around pain', 'Back, knee or an old injury', { rehab: 4, pt: 1 }]] },
    { k: 'exp', q: 'How much have you trained before?', o: [
      ['new', 'Brand new', 'Never trained in a gym', { pt: 3 }],
      ['some', 'Some experience', 'Trained before, on and off', { strength: 1 }],
      ['reg', 'I train regularly', 'Consistent for 6 months or more', { transform: 2, strength: 1 }]] },
    { k: 'days', q: 'How many days a week can you train?', o: [
      ['2', '2 to 3 days', 'A steady start', { pt: 1 }],
      ['4', '4 to 5 days', 'Serious progress', { transform: 1 }],
      ['6', '6 days', 'Every day we are open', { transform: 2 }]] },
    { k: 'style', q: 'How do you like to train?', o: [
      ['weights', 'Weights and machines', 'Lifting and building', { strength: 2 }],
      ['cardio', 'Cardio and circuits', 'Moving and sweating', { cardio: 2, loss: 1 }],
      ['mix', 'A mix of both', 'Some of everything', { loss: 1, transform: 1 }],
      ['gentle', 'Slow and gentle', 'Careful, safe movement', { rehab: 2, pt: 1 }]] },
    { k: 'coach', q: 'What kind of coaching do you want?', o: [
      ['pt', 'One-to-one coaching', 'A trainer with me every session', { pt: 3 }],
      ['guide', 'Guidance when I need it', 'A plan from a coach, I train myself', {}],
      ['ladies', 'Women only', 'Ladies only hours with a female trainer', { ladies: 3 }],
      ['diet', 'Help with my food', 'A diet plan matters most to me', { diet: 2, loss: 1 }]] },
  ];
  if (quizEl && progData.length) {
    let step = 0, ans = {};
    const bar = $('[data-quiz-bar]'), count = $('[data-quiz-count]');
    const meter = () => { bar.style.width = (Math.min(step, 5) / 5 * 100) + '%'; count.textContent = step < 5 ? `Question ${step + 1} of 5` : 'Your match is ready'; };
    function swap(html, back) {
      const old = $('.qstep', quizEl);
      const put = () => { quizEl.innerHTML = html; const n = $('.qstep', quizEl); if (back) n.classList.add('back'); meter(); const f = $('.qopt[aria-pressed="true"], .qopt, h3', n); if (f && document.activeElement && quizEl.contains(document.activeElement)) f.focus({ preventScroll: true }); };
      if (old && !reduce) { old.classList.add('out'); setTimeout(put, 240); } else put();
    }
    function render(back) {
      if (step >= Q.length) return result();
      const q = Q[step];
      swap(`<div class="qstep">
        <h3 tabindex="-1">${q.q}</h3>
        <div class="qopts">${q.o.map(([v, t, s]) => `<button type="button" class="qopt" data-v="${v}" aria-pressed="${ans[q.k] === v}"><b>${t}</b><small>${s}</small></button>`).join('')}</div>
        <div class="qnav">${step ? `<button type="button" class="qback" data-back><svg aria-hidden="true"><use href="#i-left"/></svg>Back</button>` : '<span></span>'}<span class="fine">Tap an answer to continue</span></div>
      </div>`, back);
    }
    quizEl.addEventListener('click', e => {
      const opt = e.target.closest('.qopt');
      if (opt) {
        ans[Q[step].k] = opt.dataset.v;
        $$('.qopt', quizEl).forEach(o => o.setAttribute('aria-pressed', o === opt));
        step++; setTimeout(() => render(), reduce ? 0 : 220); return;
      }
      if (e.target.closest('[data-back]')) { step = Math.max(0, step - 1); render(true); return; }
      if (e.target.closest('[data-restart]')) { step = 0; ans = {}; render(true); }
    });
    function result() {
      const score = {};
      Q.forEach(q => { const o = q.o.find(x => x[0] === ans[q.k]); Object.entries(o[3]).forEach(([id, v]) => { score[id] = (score[id] || 0) + v; }); });
      const order = progData.map(p => p.id).filter(id => id !== 'ladies');
      const ranked = order.slice().sort((a, b) => (score[b] || 0) - (score[a] || 0) || order.indexOf(a) - order.indexOf(b));
      const top = P(ranked[0]), second = P(ranked[1]);
      const lbl = k => Q.find(q => q.k === k).o.find(o => o[0] === ans[k])[1];
      const ladies = ans.coach === 'ladies';
      const split = { 2: 'Full body, 2 to 3 times a week', 4: 'Push, pull, legs, plus a full body or cardio day', 6: 'Push, pull and legs, twice a week' }[ans.days];
      const why = [
        `Your goal: ${lbl('goal').toLowerCase()}`,
        ans.exp === 'new' ? 'You are new, so a trainer starts you with the basics and safe form' : ans.exp === 'reg' ? 'You already train, so the plan can push harder' : 'You have some experience, so you start at a steady level',
        `Your week: ${split}`,
        ladies ? 'Train in the ladies only hours (10 to 11:30 AM or 2 to 4 PM) with a female trainer' : 'Train in the co-ed hours, Monday to Saturday, 4 to 11 PM',
      ];
      const msg = `Hi Pro Fitness Studio! I took the fitness quiz on your website.\nGoal: ${lbl('goal')}\nExperience: ${lbl('exp')}\nDays: ${lbl('days')}\nStyle: ${lbl('style')}\nCoaching: ${lbl('coach')}\nSuggested program: ${top.t}\nPlease share the details and fees.`;
      swap(`<div class="qstep qres">
        <div class="qres__img"><img src="assets/img/${top.img}-sm.webp" alt="" style="object-position:${top.pos || '50% 50%'}"></div>
        <div class="qres__body">
          <span class="tag">Your best match</span>
          <h3 tabindex="-1">${top.t}</h3>
          <p>${top.d}</p>
          <ul class="ticks qres__why">${why.map(w => `<li><svg aria-hidden="true"><use href="#i-check"/></svg>${w}</li>`).join('')}</ul>
          <p class="qres__also">Also worth a look: <b>${second.t}</b>. ${ans.days !== '2' || ans.exp === 'new' ? 'See example sessions in the <a class="link" href="programs#planner">workout planner</a>.' : ''}</p>
          <div class="qres__btns">
            <a class="btn btn--blue" href="${waLink(msg)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Book a consultation</a>
            <a class="btn btn--line" href="programs#all">Explore programs</a>
            <button type="button" class="qback" data-restart><svg aria-hidden="true"><use href="#i-redo"/></svg>Restart quiz</button>
          </div>
        </div>
      </div>`);
    }
    render();
  }

  /* ---------- Trainers: tap to show details on touch screens ---------- */
  $$('.tcard').forEach(c => {
    const hit = $('.tcard__hit', c);
    hit.addEventListener('click', () => { const open = !c.classList.contains('open'); c.classList.toggle('open', open); hit.setAttribute('aria-expanded', open); });
  });

  /* ---------- Before / after: full-body photos side by side, auto switching between members ---------- */
  const ba = $('[data-ba]');
  if (ba) {
    const list = JSON.parse($('#ba-data').textContent);
    const stage = $('.ba2__stage', ba), imgB = $('.ba2__side--b img', ba), imgA = $('.ba2__side--a img', ba);
    const kg = $('[data-kg]', ba), kgTag = $('[data-kgtag]', ba), count = $('[data-ba-count]', ba);
    const chips = $$('.res__chips .chip');
    const DUR = 5000;
    let cur = 0, timer = 0, auto = !reduce, visible = false, kgAnim = 0;
    ba.style.setProperty('--dur', DUR + 'ms');
    function countKg(m) {
      cancelAnimationFrame(kgAnim);
      if (m.from == null) { kg.textContent = m.tag; kgTag.textContent = 'Before and after'; return; }
      kgTag.textContent = m.tag;
      const t0 = performance.now(), d = reduce ? 1 : 900;
      const step = now => {
        const p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3);
        kg.textContent = `${m.from} → ${Math.round(m.from + (m.to - m.from) * e)} kg`;
        if (p < 1) kgAnim = requestAnimationFrame(step);
      };
      kgAnim = requestAnimationFrame(step);
    }
    function show(k) {
      cur = (k + list.length) % list.length;
      const m = list[cur];
      stage.style.setProperty('--ra', m.ra); stage.style.setProperty('--rb', m.rb);
      imgB.src = `assets/img/ba-${m.i}-before.webp`; imgA.src = `assets/img/ba-${m.i}-after.webp`;
      ba.classList.remove('swap'); void ba.offsetWidth; ba.classList.add('swap');
      chips.forEach((c, j) => { c.classList.toggle('on', j === cur); c.setAttribute('aria-pressed', j === cur); });
      if (count) count.textContent = `${cur + 1} / ${list.length}`;
      countKg(m);
      restart();
    }
    function restart() {
      clearTimeout(timer);
      ba.classList.remove('playing'); void ba.offsetWidth;
      if (auto && visible) { ba.classList.add('playing'); timer = setTimeout(() => show(cur + 1), DUR); }
    }
    const pick = k => { auto = false; show(k); };
    chips.forEach((c, j) => c.addEventListener('click', () => pick(j)));
    $('[data-ba-prev]', ba).addEventListener('click', () => pick(cur - 1));
    $('[data-ba-next]', ba).addEventListener('click', () => pick(cur + 1));
    let sx = 0;
    stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) pick(cur + (dx < 0 ? 1 : -1)); });
    // preload every pair so switching is instant
    list.forEach(m => ['before', 'after'].forEach(t => { const im = new Image(); im.src = `assets/img/ba-${m.i}-${t}.webp`; }));
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); }, { threshold: .35 }).observe(ba);
  }

  /* ---------- Gallery: buttons (when not pinned) and the full-screen viewer ---------- */
  if (gal) {
    const step = dir => galTrack.scrollBy({ left: dir * (galTrack.clientWidth * .8), behavior: reduce ? 'auto' : 'smooth' });
    $('[data-gal-prev]')?.addEventListener('click', () => step(-1));
    $('[data-gal-next]')?.addEventListener('click', () => step(1));
    const list = JSON.parse($('#gal-data').textContent);
    const dlg = $('[data-lb-dialog]'), lbImg = $('[data-lb-img]'), lbCap = $('[data-lb-cap]');
    let cur = 0, opener = null;
    const show = i => { cur = (i + list.length) % list.length; lbImg.src = `assets/img/${list[cur][0]}.webp`; lbImg.alt = list[cur][1]; lbCap.textContent = `${cur + 1} / ${list.length}  ·  ${list[cur][1]}`; lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = ''; };
    $$('[data-lb]').forEach(b => b.addEventListener('click', () => { opener = b; show(+b.dataset.lb); dlg.showModal(); window.__lenis?.stop(); }));
    $('[data-lb-close]').addEventListener('click', () => dlg.close());
    $('[data-lb-prev]').addEventListener('click', () => show(cur - 1));
    $('[data-lb-next]').addEventListener('click', () => show(cur + 1));
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.classList.contains('lb__in')) dlg.close(); });
    dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
    dlg.addEventListener('close', () => { window.__lenis?.start(); opener?.focus(); });
    let sx = 0;
    dlg.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
  }

  /* ---------- Reviews: arrows + mouse drag ---------- */
  const revT = $('[data-revs-track]');
  if (revT) {
    const card = () => ($('.rev', revT)?.offsetWidth || 300) + 20;
    $('[data-revs-prev]').addEventListener('click', () => revT.scrollBy({ left: -card(), behavior: 'smooth' }));
    $('[data-revs-next]').addEventListener('click', () => revT.scrollBy({ left: card(), behavior: 'smooth' }));
    let down = false, x0 = 0, s0 = 0, moved = false;
    revT.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; x0 = e.clientX; s0 = revT.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) { moved = true; revT.classList.add('drag'); } revT.scrollLeft = s0 - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; revT.classList.remove('drag'); });
    revT.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
    revT.addEventListener('keydown', e => { if (e.key === 'ArrowRight') revT.scrollBy({ left: card(), behavior: 'smooth' }); if (e.key === 'ArrowLeft') revT.scrollBy({ left: -card(), behavior: 'smooth' }); });
  }

  /* ---------- Workout planner ---------- */
  const PLAN = {
    push: { t: 'Push day', img: 'a-strength', m: ['Chest', 'Shoulders', 'Triceps'], d: 'Pressing movements for the chest, shoulders and the back of the arms.',
      b: { time: 'About 50 min', eff: 'Stop 2 to 3 reps before failure', ex: [['Chest press machine', 'Learn the press path safely', '3 × 10 to 12'], ['Seated dumbbell shoulder press', 'Back against the bench', '3 × 10 to 12'], ['Pec deck', 'Slow squeeze', '2 × 12 to 15'], ['Cable triceps pushdown', 'Elbows by your sides', '3 × 12'], ['Dumbbell lateral raise', 'Light weight, no swinging', '2 × 12 to 15']] },
      i: { time: 'About 65 min', eff: 'Last set close to failure', ex: [['Barbell bench press', 'Use a spotter on heavy sets', '4 × 6 to 8'], ['Incline dumbbell press', 'Upper chest', '3 × 8 to 10'], ['Standing overhead press', 'Brace your core', '3 × 6 to 8'], ['Cable fly', 'Stretch and squeeze', '3 × 12'], ['Dumbbell lateral raise', 'Strict form', '3 × 12 to 15'], ['Overhead triceps extension', 'Full stretch', '3 × 10 to 12']] } },
    pull: { t: 'Pull day', img: 'a-pull', m: ['Back', 'Biceps', 'Rear shoulders'], d: 'Pulling movements for a wide, strong back and arms.',
      b: { time: 'About 50 min', eff: 'Stop 2 to 3 reps before failure', ex: [['Lat pulldown', 'Pull to the upper chest', '3 × 10 to 12'], ['Seated cable row', 'Chest up, squeeze the back', '3 × 10 to 12'], ['Back extension', 'Slow and controlled', '2 × 12'], ['Face pull', 'For healthy shoulders', '2 × 15'], ['Dumbbell curl', 'No swinging', '2 × 12']] },
      i: { time: 'About 65 min', eff: 'Last set close to failure', ex: [['Deadlift', 'Flat back, bar close to legs', '3 × 5'], ['Pull-up (or assisted)', 'Full range', '4 × 6 to 8'], ['Bent-over barbell row', 'Hinge at the hips', '3 × 8'], ['Single-arm dumbbell row', 'Pull to the hip', '3 × 10'], ['Face pull', 'Shoulder health', '3 × 15'], ['Barbell curl', 'Strict', '3 × 10']] } },
    legs: { t: 'Leg day', img: 'a-pt', m: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], d: 'The biggest muscles in your body. Heavy work, long rest.',
      b: { time: 'About 50 min', eff: 'Stop 2 to 3 reps before failure', ex: [['Leg press', 'Do not lock the knees', '3 × 10 to 12'], ['Goblet squat', 'Dumbbell at the chest', '3 × 10'], ['Leg extension', 'Pause at the top', '2 × 12 to 15'], ['Lying leg curl', 'Slow on the way down', '2 × 12'], ['Calf raise', 'Full stretch', '3 × 15']] },
      i: { time: 'About 70 min', eff: 'Last set close to failure', ex: [['Back squat', 'Depth you can control', '4 × 5 to 8'], ['Romanian deadlift', 'Hips back, soft knees', '3 × 8'], ['Walking lunge', 'Each leg', '3 × 10'], ['Leg press', 'Full range', '3 × 12'], ['Leg curl', 'Squeeze', '3 × 12'], ['Standing calf raise', 'Pause at the bottom', '4 × 12 to 15']] } },
    fullbody: { t: 'Full body', img: 'a-fullbody', m: ['Legs', 'Chest', 'Back', 'Shoulders', 'Core'], d: 'Every major muscle in one session. Best when you train 2 or 3 days a week.',
      b: { time: 'About 55 min', eff: 'Stop 2 to 3 reps before failure', ex: [['Leg press', 'Legs', '3 × 10'], ['Chest press machine', 'Chest', '3 × 10'], ['Lat pulldown', 'Back', '3 × 10'], ['Seated dumbbell shoulder press', 'Shoulders', '2 × 12'], ['Plank', 'Core, keep the hips level', '3 × 20 to 30 sec']] },
      i: { time: 'About 70 min', eff: 'Last set close to failure', ex: [['Back squat', 'Legs', '4 × 6'], ['Barbell bench press', 'Chest', '4 × 6 to 8'], ['Bent-over barbell row', 'Back', '3 × 8'], ['Romanian deadlift', 'Hamstrings', '3 × 8'], ['Standing overhead press', 'Shoulders', '3 × 8'], ['Hanging knee raise', 'Core', '3 × 12']] } },
    cardio: { t: 'Cardio day', img: 'a-cardio', m: ['Heart and lungs', 'Legs', 'Full body'], d: 'Stamina work. Easy days build the base, interval days build the engine.',
      b: { time: 'About 40 min', eff: 'You can still talk in short sentences', ex: [['Warm-up', 'Easy pace, loosen up', '5 min'], ['Steady cardio on any machine', 'Comfortable, steady pace', '15 to 20 min'], ['Bodyweight circuit: squats, step-ups, wall push-ups', '30 sec work, 30 sec rest', '3 rounds'], ['Cool-down and stretching', 'Slow down gradually', '5 to 10 min']] },
      i: { time: 'About 45 min', eff: 'Hard intervals, full recovery between', ex: [['Warm-up', 'Build up the pace', '8 min'], ['Intervals on any cardio machine', '30 sec hard, 90 sec easy', '8 rounds'], ['Circuit: goblet squat, push-up, dumbbell row, mountain climbers', '40 sec work, 20 sec rest', '3 rounds'], ['Cool-down and stretching', 'Breathe and stretch', '8 min']] } },
  };
  const WEEK = { 2: ['fullbody', 0, 0, 'fullbody', 0, 0], 3: ['fullbody', 0, 'fullbody', 0, 'fullbody', 0], 4: ['push', 'legs', 0, 'pull', 'fullbody', 0], 5: ['push', 'pull', 'legs', 0, 'fullbody', 'cardio'], 6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'] };
  const planner = $('[data-planner]');
  if (planner) {
    let type = 'push', lvl = 'b';
    const imgEl = $('[data-pl-img]'), dayIn = $('#pl-days');
    function draw(newImg) {
      const p = PLAN[type], L = p[lvl];
      $('[data-pl-title]').textContent = p.t;
      $('[data-pl-desc]').textContent = p.d;
      $('[data-pl-time]').textContent = L.time;
      $('[data-pl-effort]').textContent = L.eff;
      $('[data-pl-muscles]').innerHTML = p.m.map((m, i) => `<span style="animation-delay:${i * .05}s">${m}</span>`).join('');
      $('[data-pl-list]').innerHTML = L.ex.map(([n, s, r], i) => `<li style="animation-delay:${i * .04}s"><span><b>${n}</b><small>${s}</small></span><span class="sets">${r}</span></li>`).join('');
      if (newImg) { imgEl.src = `assets/img/${p.img}.webp`; imgEl.alt = `${p.t} at Pro Fitness Studio`; imgEl.classList.remove('swap'); void imgEl.offsetWidth; imgEl.classList.add('swap'); }
    }
    tabs($('.planner__types', planner), b => { type = b.dataset.type; draw(true); });
    $$('[data-lvl]', planner).forEach(b => b.addEventListener('click', () => {
      lvl = b.dataset.lvl;
      $$('[data-lvl]', planner).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      draw(false);
    }));
    const SHORT = { push: 'Push', pull: 'Pull', legs: 'Legs', fullbody: 'Full body', cardio: 'Cardio' };
    const NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    function week() {
      const n = +dayIn.value;
      $('[data-pl-days]').textContent = n;
      dayIn.style.setProperty('--fill', ((n - 2) / 4 * 100) + '%');
      const plan = WEEK[n].concat([null]);
      $('[data-pl-week]').innerHTML = plan.map((t, i) => `<div class="pday ${t ? 'train' : 'rest'}"><small>${NAMES[i]}</small><b>${i === 6 ? 'Closed' : t ? SHORT[t] : 'Rest'}</b></div>`).join('');
    }
    dayIn.addEventListener('input', week);
    draw(true); week();
  }

  /* ---------- Membership plans: duration toggle updates prices, savings and the WhatsApp message ---------- */
  const plans = $('[data-plans]');
  if (plans) {
    const DUR = [['1 month', 1], ['2 months', 2], ['6 months', 6]];
    const NAMES = ['Standard plan', 'Premium plan'];
    const rs = n => 'Rs ' + Math.round(n).toLocaleString('en-US');
    const durBtns = $$('[data-dur]');
    function setDur(d) {
      durBtns.forEach(b => { const on = +b.dataset.dur === d; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      $$('.plan', plans).forEach(card => {
        const priceEl = $('[data-price]', card);
        if (!priceEl) return;
        const p = JSON.parse(priceEl.dataset.price), months = DUR[d][1];
        priceEl.textContent = rs(p[d]);
        priceEl.classList.remove('tick'); void priceEl.offsetWidth; priceEl.classList.add('tick');
        $('[data-per]', card).textContent = months === 1 ? 'for 1 month' : `for ${months} months, about ${rs(p[d] / months)} a month`;
        const save = p[0] * months - p[d];
        $('[data-save]', card).textContent = save > 0 ? `You save ${rs(save)} against paying monthly` : '';
        const j = $('[data-join]', card), name = NAMES[+j.dataset.join];
        j.href = waLink(`Hi Pro Fitness Studio! I want to join the ${name} for ${DUR[d][0]} (${rs(p[d])}, plus the Rs 2,000 membership fee in the first month). Please confirm.`);
      });
    }
    durBtns.forEach(b => b.addEventListener('click', () => setDur(+b.dataset.dur)));
  }

  /* ---------- Calculators ---------- */
  const calcTabs = $('.calc__tabs');
  if (calcTabs) tabs(calcTabs, b => { $$('.calc__panel').forEach(p => { p.hidden = p.id !== b.getAttribute('aria-controls'); }); });
  function heightOf(scope) {
    const h = $('[data-hunit]', scope), unit = $('.seg .on', h).dataset.u;
    if (unit === 'cm') return (parseFloat($('[data-cm] input', h).value) || 0) / 100;
    const [ft, inch] = $$('[data-ft] input', h).map(i => parseFloat(i.value) || 0);
    return (ft * 30.48 + inch * 2.54) / 100;
  }
  $$('[data-hunit]').forEach(h => $$('.seg button', h).forEach(b => b.addEventListener('click', () => {
    $$('.seg button', h).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    $('[data-ft]', h).hidden = b.dataset.u !== 'ft'; $('[data-cm]', h).hidden = b.dataset.u !== 'cm';
    h.dispatchEvent(new Event('input', { bubbles: true }));
  })));
  const bmiP = $('#cp-bmi');
  if (bmiP) {
    const CATS = [
      [18.5, 'Underweight', '#9a9ea8', 'You are under the healthy range. A weight gain diet with strength training will help.', 'Strength training and a diet plan'],
      [25, 'Healthy weight', '#6aa8ff', 'You are in the healthy range. Keep it that way with regular training.', 'Strength and cardio'],
      [30, 'Overweight', '#ffffff', 'A bit above the healthy range. Cardio with a diet plan is the usual fix.', 'Weight loss program'],
      [99, 'Obese', '#ffffff', 'Well above the healthy range. Start with a guided weight loss plan and see a doctor if you have health problems.', 'Guided weight loss'],
    ];
    const err = $('[data-err="bmi"]');
    function calc() {
      const w = $('#bmi-w'), kg = parseFloat(w.value), m = heightOf(bmiP);
      const out = $('#bmi-val'), cat = $('#bmi-cat'), tip = $('#bmi-tip'), needle = $('#bmi-needle'), cta = $('#bmi-cta');
      const touched = w.value || m > 0;
      const bad = [];
      if (w.value && !(kg >= 20 && kg <= 300)) bad.push('weight between 20 and 300 kg');
      if (m > 0 && !(m >= 1 && m <= 2.5)) bad.push('height between 100 and 250 cm (3 ft 4 in to 8 ft)');
      err.textContent = bad.length ? 'Please enter a ' + bad.join(' and a ') + '.' : '';
      if (bad.length || !(kg && m)) { out.textContent = '--'; cat.textContent = touched ? 'Fill in both fields' : 'Enter your details'; cat.style.color = ''; tip.textContent = 'Your result will show here.'; needle.style.transform = 'rotate(-90deg)'; return; }
      const v = kg / (m * m), c = CATS.find(x => v < x[0]);
      out.textContent = v.toFixed(1);
      cat.textContent = c[1]; cat.style.color = c[2];
      tip.textContent = c[3];
      needle.style.transform = `rotate(${-90 + clamp((v - 12) / 28, 0, 1) * 180}deg)`;
      cta.href = waLink(`Hi Pro Fitness Studio! My BMI is ${v.toFixed(1)} (${c[1]}). I am interested in: ${c[4]}. Please share the details.`);
    }
    bmiP.addEventListener('input', calc);
    calc();
  }
  const calP = $('[data-cal]');
  if (calP) {
    let sex = 'm';
    $$('[data-sex]', calP).forEach(b => b.addEventListener('click', () => { sex = b.dataset.sex; $$('[data-sex]', calP).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); calc(); }));
    const err = $('[data-err="cal"]'), out = k => $(`[data-kcal="${k}"]`);
    const r10 = v => Math.round(v / 10) * 10;
    function calc() {
      const age = parseFloat($('#cal-age').value), kg = parseFloat($('#cal-w').value), m = heightOf(calP), act = parseFloat($('#cal-act').value);
      const bad = [];
      if ($('#cal-age').value && !(age >= 18 && age <= 80)) bad.push('This estimate is for adults aged 18 to 80. Under 18? Ask a trainer for advice instead.');
      if ($('#cal-w').value && !(kg >= 30 && kg <= 300)) bad.push('Enter a weight between 30 and 300 kg.');
      if (m > 0 && !(m >= 1 && m <= 2.5)) bad.push('Enter a height between 100 and 250 cm.');
      err.textContent = bad.join(' ');
      if (bad.length || !(age && kg && m)) { ['keep', 'lose', 'gain'].forEach(k => { out(k).textContent = '--'; }); return; }
      const bmr = 10 * kg + 6.25 * m * 100 - 5 * age + (sex === 'm' ? 5 : -161);
      const keep = bmr * act, floor = sex === 'm' ? 1500 : 1200;
      out('keep').textContent = r10(keep).toLocaleString('en-US');
      out('lose').textContent = r10(Math.max(floor, keep - 500)).toLocaleString('en-US');
      out('gain').textContent = r10(keep + 300).toLocaleString('en-US');
      $('[data-kcal-cta]').href = waLink(`Hi Pro Fitness Studio! The calculator on your website says I need about ${r10(keep)} kcal a day to keep my weight. I want a diet plan. Please share the details.`);
    }
    calP.addEventListener('input', calc);
    calP.addEventListener('change', calc);
  }

  /* ---------- Contact form: validates, then opens WhatsApp with the message ready ---------- */
  const form = $('#join-form');
  if (form) {
    const okBox = $('.form-ok', form), btn = $('button[type="submit"]', form);
    const fields = {
      name: [$('#f-name'), v => v.trim().length >= 2 ? '' : 'Please enter your name.'],
      phone: [$('#f-phone'), v => /^(\+92|0092|92|0)3\d{9}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Enter a Pakistani mobile number, like 0300 1234567.'],
    };
    const check = k => { const [el, fn] = fields[k], msg = fn(el.value); el.setAttribute('aria-invalid', !!msg); $('#e-' + k).textContent = msg; return !msg; };
    Object.keys(fields).forEach(k => fields[k][0].addEventListener('blur', () => { if (fields[k][0].value) check(k); }));
    Object.keys(fields).forEach(k => fields[k][0].addEventListener('input', () => { if (fields[k][0].getAttribute('aria-invalid') === 'true') check(k); }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = Object.keys(fields).map(check).every(Boolean);
      if (!ok) { Object.values(fields).find(([el]) => el.getAttribute('aria-invalid') === 'true')[0].focus(); return; }
      const f = new FormData(form);
      const lines = [
        `Hi Pro Fitness Studio! I want to: ${f.get('type').toLowerCase()}.`,
        `Name: ${f.get('name').trim()}`,
        `Phone: ${f.get('phone').trim()}`,
        `Goal: ${f.get('goal')}`,
        `Preferred time: ${f.get('time')}`,
        f.get('msg').trim() ? `Message: ${f.get('msg').trim()}` : '',
      ].filter(Boolean);
      const url = waLink(lines.join('\n'));
      btn.classList.add('is-busy'); btn.disabled = true;
      setTimeout(() => {
        window.open(url, '_blank', 'noopener');
        btn.classList.remove('is-busy'); btn.disabled = false;
        $('[data-reopen]', form).href = url;
        okBox.hidden = false;
        okBox.focus();
      }, 500);
    });
    $('[data-newmsg]', form).addEventListener('click', () => { okBox.hidden = true; form.reset(); $('#f-name').focus(); });
  }

  /* ---------- Footer: rotating wireframe globe + back to top ---------- */
  const globe = $('[data-globe]'), foot = $('.foot');
  if (globe) {
    const ns = 'http://www.w3.org/2000/svg', R = 240, TILT = 18 * Math.PI / 180;
    const el = (tag, attrs) => { const e = document.createElementNS(ns, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); globe.appendChild(e); return e; };
    // latitude rings, seen slightly from above
    for (let lat = -75; lat <= 75; lat += 15) {
      const a = lat * Math.PI / 180, r = R * Math.cos(a);
      el('ellipse', { cx: 0, cy: (-R * Math.sin(a) * Math.cos(TILT)).toFixed(1), rx: r.toFixed(1), ry: Math.max(.5, r * Math.sin(TILT)).toFixed(1) });
    }
    // meridians: their width follows the rotation angle, which makes the globe turn
    const mer = Array.from({ length: 12 }, () => el('ellipse', { cx: 0, cy: 0, rx: 0, ry: R }));
    el('circle', { cx: 0, cy: 0, r: R, class: 'rim' });
    let phase = 0, last = performance.now(), on = false, raf = 0;
    const draw = () => mer.forEach((m, i) => m.setAttribute('rx', Math.abs(R * Math.sin(phase + i * Math.PI / 12)).toFixed(1)));
    const tick = now => { phase += Math.min(50, now - last) / 1000 * .22; last = now; draw(); if (on) raf = requestAnimationFrame(tick); };
    draw();
    if (!reduce && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => {
      on = e.isIntersecting; foot.classList.toggle('in', on || foot.classList.contains('in'));
      if (on) { last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
    }).observe(foot);
    else foot.classList.add('in');
  }
  $('[data-to-top]')?.addEventListener('click', () => { if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 }); else scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
})();
