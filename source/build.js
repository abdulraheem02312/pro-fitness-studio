/* Builds the static pages into public/ (shared header, footer and icons). Run: node source/build.js */
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'public');
const V = 5; // asset version, bump to break cache

const PHONE = '0309 0503334', TEL = '+923090503334', WA = '923090503334';
const ADDRESS = 'Baldia Street, near Zahid, G Block Centre, Vehari, 61100, Pakistan';
const PLUS = '29R3+PJ Vehari';
const GEO = '30.0417523,72.3540467';
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const WA_JOIN = wa('Hi Pro Fitness Studio! I want to join. Please share the membership details and fees.');
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${GEO}`;
const MAPS = 'https://www.google.com/maps/place/Profitness+Studio/@30.0417523,72.3540467,17z';

/* ---------- icons ---------- */
const ICONS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-bolt" viewBox="0 0 18 30"><path d="M7.5 0H17l-4.6 11.5H17L3.5 30l3.2-13.6H1.5z" fill="currentColor"/></symbol>
  <symbol id="i-dumbbell" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></g></symbol>
  <symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.6.2 1.6 1 2.6 2 3 .3-3 .3-5.6.8-8.4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>
  <symbol id="i-pulse" viewBox="0 0 24 24"><path d="M3 12h4l2.5-6 4 12 2.5-6H21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-trophy" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6"/></g></symbol>
  <symbol id="i-coach" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3.5"/><path d="M5 21c.6-4 3.3-6.5 7-6.5s6.4 2.5 7 6.5M9 14.5l3 3 3-3"/></g></symbol>
  <symbol id="i-diet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7c-3-2.5-8-1-8 4.5C4 17 8 21 10.5 21c.8 0 1-.5 1.5-.5s.7.5 1.5.5C16 21 20 17 20 11.5 20 6 15 4.5 12 7z"/><path d="M12 7c0-2 1-3.5 3-4"/></g></symbol>
  <symbol id="i-rehab" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="M10.5 10.5h.01M13.5 13.5h.01M13.5 10.5h.01M10.5 13.5h.01"/></g></symbol>
  <symbol id="i-female" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/></g></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></g></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h3.5l1.5 4.5-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>
  <symbol id="i-wa" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7c-2 0-4-.5-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.9 5.2 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6l-.6-.3z"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></symbol>
  <symbol id="i-map" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/></g></symbol>
</svg>`;
const ic = (n, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const stars = `<span class="stars" aria-label="5 out of 5 stars">${ic('star').repeat(5)}</span>`;
const LOGO = (lg = false) => `<a class="logo${lg ? ' logo--lg' : ''}" href="./" aria-label="Pro Fitness Studio, home"><span class="logo__row">PRO<svg class="logo__bolt" viewBox="0 0 18 30" aria-hidden="true"><path d="M7.5 0H17l-4.6 11.5H17L3.5 30l3.2-13.6H1.5z" fill="#2f7cf6"/></svg>FITNESS</span><span class="logo__sub">STUDIO</span></a>`;

const PAGES = [['./', 'Home'], ['programs', 'Programs'], ['about', 'About'], ['contact', 'Contact']];
const HOURS_TXT = '4 PM to 11 PM';

function head(title, desc) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#07090f">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="assets/img/og.jpg">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;1,700;1,800&family=Barlow:wght@400;500;600;700&family=Noto+Nastaliq+Urdu&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=${V}">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ExerciseGym', name: 'Pro Fitness Studio', alternateName: 'Profitness Studio',
    telephone: TEL, image: 'assets/img/og.jpg',
    address: { '@type': 'PostalAddress', streetAddress: 'Baldia Street, near Zahid, G Block Centre', addressLocality: 'Vehari', postalCode: '61100', addressCountry: 'PK' },
    geo: { '@type': 'GeoCoordinates', latitude: 30.0417523, longitude: 72.3540467 },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '16:00', closes: '23:00' }],
  })}</script>
</head>`;
}

function header(active) {
  const cur = h => (h === active ? ' aria-current="page"' : '');
  return `<body>
${ICONS}
<header class="nav">
  <div class="nav__bar">
    ${LOGO()}
    <nav class="nav__links" aria-label="Main">${PAGES.map(([h, n]) => `<a href="${h}"${cur(h)}>${n}</a>`).join('')}</nav>
    <span class="status" data-status><i></i><span>Checking hours</span></span>
    <a class="btn btn--blue btn--sm nav__cta" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join now</a>
    <button class="burger" aria-label="Open menu" aria-expanded="false"><span></span></button>
  </div>
</header>
<div class="drawer" aria-label="Menu">
  ${PAGES.map(([h, n]) => `<a class="dl" href="${h}"${cur(h)}>${n}</a>`).join('')}
  <div class="drawer__foot">
    <span class="status" data-status><i></i><span>Checking hours</span></span>
    <a class="btn btn--wa" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join on WhatsApp</a>
    <a class="btn btn--line" href="tel:${TEL}">${ic('phone')}Call ${PHONE}</a>
  </div>
</div>
<main>`;
}

const FOOTER = `
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div class="foot__about">
        ${LOGO()}
        <p>Gym in G Block Centre, Vehari. Training, diet plans and rehab with a certified trainer.</p>
      </div>
      <div>
        <h4>Pages</h4>
        <ul>${PAGES.map(([h, n]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h4>Timings</h4>
        <ul><li>Mon to Sat</li><li>${HOURS_TXT}</li><li>Sunday closed</li></ul>
      </div>
      <div class="foot__visit">
        <h4>Address</h4>
        <ul>
          <li><a href="${DIRECTIONS}" target="_blank" rel="noopener">${ADDRESS}</a></li>
          <li><a href="tel:${TEL}">${PHONE}</a> (call or WhatsApp)</li>
        </ul>
      </div>
    </div>
    <div class="foot__bottom">
      <span>© <span data-year>2026</span> Pro Fitness Studio, Vehari</span>
      <span>Website by Abdul Raheem</span>
    </div>
  </div>
</footer>
<a class="wa-float" href="${WA_JOIN}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ic('wa')}</a>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="assets/js/site.js?v=${V}"></script>
</body>
</html>`;

const HINT = `<div class="swipe-hint">Swipe to see more ${ic('arrow')}</div>`;

/* ---------- data ---------- */
const PROGRAMS = [
  { ic: 'dumbbell', t: 'Strength training', d: 'Machines and free weights, with help on form.', li: ['Machines, benches and free weights', 'Trainer shows you the right form', 'Plan for muscle gain'], msg: 'Strength training' },
  { ic: 'flame', t: 'Weight loss', d: 'Cardio, workouts and a diet plan together.', li: ['Fat loss workouts', 'Diet plan from a dietitian', 'Weight checked every week'], msg: 'Weight loss' },
  { ic: 'pulse', t: 'Cardio', d: 'Proper cardio sessions for stamina.', li: ['Guided cardio sessions', 'Good for stamina and heart health', 'Can be mixed with weights'], msg: 'Cardio' },
  { ic: 'trophy', t: 'Body transformation', d: 'Full plan for a big change, start to finish.', li: ['Workout and diet plan made for you', 'Progress photos and weight tracking', 'See real results below'], msg: 'Body transformation' },
  { ic: 'coach', t: 'Personal training', d: 'One-to-one sessions with a trainer.', li: ['Trainer with you the whole session', 'Plan changes as you improve', 'Best for beginners'], msg: 'Personal training' },
  { ic: 'diet', t: 'Diet plans', d: 'Made by a dietitian, with normal home food.', li: ['Normal Pakistani food, no fancy items', 'For weight loss or weight gain', 'Updated as you progress'], msg: 'Diet plan' },
  { ic: 'rehab', t: 'Rehab', d: 'Safe exercise after an injury or for back pain.', li: ['Back, knee and shoulder problems', 'Slow, safe exercises', 'Guided by a rehab specialist'], msg: 'Rehab' },
  { ic: 'female', t: 'Ladies only hours', d: 'Separate time for women, with a female trainer.', li: ['Morning 10:00 to 11:30 AM', 'Afternoon 2:00 to 4:00 PM', 'Female trainer'], msg: 'Ladies only hours' },
];
const progMsg = p => wa(`Hi Pro Fitness Studio! I want to ask about ${p.msg}. What are the fees?`);
const progRow = p => `<a class="prow" href="${progMsg(p)}" target="_blank" rel="noopener"><span class="ico">${ic(p.ic)}</span><span><b>${p.t}</b><small>${p.d}</small></span>${ic('arrow')}</a>`;

const TF = [
  ['tf-1', '130 kg', '90 kg', 'Lost 40 kg', 'loss'],
  ['tf-2', '148 kg', '100 kg', 'Lost 48 kg', 'loss'],
  ['tf-3', '122 kg', '91 kg', 'Lost 31 kg', 'loss'],
  ['tf-5', '58 kg', '80 kg', 'Gained 22 kg', 'gain'],
  ['tf-4', 'Before', 'After', 'Muscle gain', 'gain'],
  ['tf-6', 'Before', 'After', 'Body shape', 'gain'],
];
const REVIEWS = [
  ['Aleeza Basit', 'Amazing gym and an even better trainer! She\'s so sweet, supportive, and motivating. Love my workout sessions and the positive energy here!'],
  ['Sadia Amjad', 'Excellent experience so far! A dedicated, professional, and highly encouraging trainer. Her guidance and motivating approach make workouts more effective and enjoyable. Highly recommended!'],
  ['Ch Ahmad', 'A very good gym and great training experience. First time a proper cardio and weight loss session in Vehari.'],
];
const DAYS = [['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], ['Thursday', 4], ['Friday', 5], ['Saturday', 6], ['Sunday', 0]];

/* ---------- sections ---------- */
const WHY = `
<section class="sec">
  <div class="wrap why">
    <div class="why__photo" data-anim="wipe"><img src="assets/img/gym-machines.webp" alt="Machines and benches at Pro Fitness Studio" loading="lazy"></div>
    <div data-anim="up">
      
      <h2 class="h2">Why train <span class="hl">here</span></h2><span class="ur" lang="ur" dir="rtl">یہاں ٹریننگ کیوں کریں</span>
      <ul class="why__list">
        <li><span class="ico">${ic('trophy')}</span><span><b>Trained by Mr. Pakistan</b><small>The owner, Hasham Ahmad Siddiqui, is a certified fitness trainer.</small></span></li>
        <li><span class="ico">${ic('diet')}</span><span><b>Diet plan included</b><small>A dietitian plans your food, not just your workout.</small></span></li>
        <li><span class="ico">${ic('rehab')}</span><span><b>Safe if you have pain</b><small>Rehab specialist for back, knee and old injuries.</small></span></li>
        <li><span class="ico">${ic('female')}</span><span><b>Ladies only hours</b><small>Separate time for women, with a female trainer.</small></span></li>
      </ul>
    </div>
  </div>
</section>`;

const PROGRAMS_SHORT = `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="head head--row" data-anim="head">
      <div><h2 class="h2">What we <span class="hl">offer</span></h2><span class="ur" lang="ur" dir="rtl">ہمارے پروگرام</span><p>Tap any program to ask about it on WhatsApp.</p></div>
      <a class="link" href="programs">All programs ${ic('arrow')}</a>
    </div>
    <div class="plist" data-anim="up">${PROGRAMS.slice(0, 6).map(progRow).join('')}</div>
  </div>
</section>`;

const GALLERY = `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="head" data-anim="head"><h2 class="h2">Inside the <span class="hl">gym</span></h2><span class="ur" lang="ur" dir="rtl">جم کی تصاویر</span></div>
    <div class="gallery swipe" data-anim="up">
      <figure><img src="assets/img/gym-floor.webp" alt="Gym floor with hexagon lights" loading="lazy"><figcaption>Main floor</figcaption></figure>
      <figure><img src="assets/img/gym-machines.webp" alt="Machines and benches" loading="lazy"><figcaption>Machines</figcaption></figure>
      <figure><img src="assets/img/gym-reception.webp" alt="Reception with trophies" loading="lazy"><figcaption>Reception</figcaption></figure>
    </div>
    ${HINT}
  </div>
</section>`;

const OWNER = `
<section class="sec tex">
  <div class="wrap owner">
    <div class="owner__img" data-anim="wipe"><img src="assets/img/owner.webp" alt="Hasham Ahmad Siddiqui, owner of Pro Fitness Studio" loading="lazy" width="600" height="1190"></div>
    <div data-anim="up">
      
      <h2 class="h2">Hasham Ahmad <span class="hl">Siddiqui</span></h2><span class="ur" lang="ur" dir="rtl">مالک اور ہیڈ ٹرینر</span>
      <div class="owner__name">Mr. Pakistan</div>
      <ul class="owner__creds">
        <li>${ic('check')}Certified fitness trainer</li>
        <li>${ic('check')}Dietitian</li>
        <li>${ic('check')}Rehab specialist</li>
      </ul>
      <p class="muted" style="margin:0 0 22px">He plans your workout and your diet himself, and checks your progress.</p>
      <a class="btn btn--blue" href="${wa('Hi! I want to train with Hasham Ahmad Siddiqui at Pro Fitness Studio. Please share the details.')}" target="_blank" rel="noopener">${ic('wa')}Message on WhatsApp</a>
    </div>
  </div>
</section>`;

const BA = [
  { i: 1, from: 130, to: 90, tag: 'Lost 40 kg' },
  { i: 2, from: 148, to: 100, tag: 'Lost 48 kg' },
  { i: 3, from: 122, to: 91, tag: 'Lost 31 kg' },
  { i: 5, from: 58, to: 80, tag: 'Gained 22 kg' },
  { i: 4, tag: 'Muscle gain' },
  { i: 6, tag: 'Body shape' },
];
const RESULTS = `
<section class="sec" id="results">
  <div class="wrap res">
    <div class="res__txt">
      <div class="head" data-anim="head"><h2 class="h2">Member <span class="hl">results</span></h2><span class="ur" lang="ur" dir="rtl">ممبرز کے نتائج</span><p>Drag the line to compare before and after. Every member here was trained by Hasham Ahmad Siddiqui.</p></div>
      <div class="res__chips" data-anim="up">${BA.map((m, k) => `<button type="button" class="chip${k === 0 ? ' on' : ''}" data-i="${m.i}" ${m.from ? `data-from="${m.from}" data-to="${m.to}"` : ''} data-tag="${m.tag}">${m.from ? `<b>${m.from} → ${m.to} kg</b>` : `<b>${m.tag}</b>`}<small>${m.from ? m.tag : 'Before and after'}</small></button>`).join('')}</div>
    </div>
    <div class="ba" data-anim="wipe" style="--x:50%">
      <img class="ba__after" src="assets/img/ba-1-after.webp" alt="After" width="480" height="600" draggable="false">
      <div class="ba__before"><img src="assets/img/ba-1-before.webp" alt="Before" width="480" height="600" draggable="false"></div>
      <span class="ba__tag ba__tag--b">Before</span><span class="ba__tag ba__tag--a">After</span>
      <div class="ba__line"><span class="ba__knob"><svg viewBox="0 0 18 30" aria-hidden="true"><path d="M7.5 0H17l-4.6 11.5H17L3.5 30l3.2-13.6H1.5z" fill="currentColor"/></svg></span></div>
      <div class="ba__kg"><b data-kg>130 → 90</b><span data-kgtag>Lost 40 kg</span></div>
      <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Compare before and after">
    </div>
  </div>
</section>`;

function arc(a0, a1, R) {
  const p = a => [170 + R * Math.sin(a * Math.PI / 180), 170 - R * Math.cos(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}
const ang = v => -90 + (v - 12) / 28 * 180;
const GAUGE = `<svg class="gauge" viewBox="0 0 340 200" aria-hidden="true">
  <path d="${arc(-90, 90, 140)}" stroke="#1c2740" stroke-width="22" fill="none"/>
  ${[[12, 18.5, '#5aa8ff'], [18.5, 25, '#2bd67b'], [25, 30, '#ffb648'], [30, 40, '#ff5a6a']].map(([a, b, c]) => `<path d="${arc(ang(a) + 1, ang(b) - 1, 140)}" stroke="${c}" stroke-width="18" fill="none"/>`).join('')}
  <g id="bmi-needle" class="needle" style="transform:rotate(-90deg)"><path d="M170 62 175 170h-10z" fill="#fff"/></g>
  <circle cx="170" cy="170" r="12" fill="#fff"/><circle cx="170" cy="170" r="5" fill="#2f7cf6"/>
</svg>`;
const BMI = `
<section class="sec sec--tight" id="bmi-sec">
  <div class="wrap">
    <div class="head" data-anim="head"><h2 class="h2">BMI <span class="hl">calculator</span></h2><span class="ur" lang="ur" dir="rtl">اپنا بی ایم آئی معلوم کریں</span><p>Enter your weight and height to see your BMI and which program suits you.</p></div>
    <div class="bmi" id="bmi" data-anim="up">
      <div class="bmi__form">
        <div class="seg" role="group" aria-label="Height unit"><button class="on" data-u="ft" type="button">Feet / inches</button><button data-u="cm" type="button">Centimetres</button></div>
        <div class="field"><label for="bmi-w">Weight</label><div class="input-unit"><input class="input" id="bmi-w" type="number" inputmode="decimal" placeholder="70" min="20" max="300"><span>kg</span></div></div>
        <div class="field" id="bmi-ftrow"><label for="bmi-ft">Height</label><div class="row"><div class="input-unit"><input class="input" id="bmi-ft" type="number" inputmode="numeric" placeholder="5" min="3" max="8"><span>ft</span></div><div class="input-unit"><input class="input" id="bmi-in" type="number" inputmode="numeric" placeholder="8" min="0" max="11"><span>in</span></div></div></div>
        <div class="field" id="bmi-cmrow" hidden><label for="bmi-cm">Height</label><div class="input-unit"><input class="input" id="bmi-cm" type="number" inputmode="numeric" placeholder="172" min="100" max="250"><span>cm</span></div></div>
        <p class="muted" style="margin:0;font-size:14px">BMI is only a rough guide. The trainer will check properly when you visit.</p>
      </div>
      <div class="bmi__out" aria-live="polite">
        ${GAUGE}
        <div class="bmi__val" id="bmi-val">--</div>
        <div class="bmi__cat" id="bmi-cat">Enter your details</div>
        <p class="bmi__tip" id="bmi-tip">Your result will show here.</p>
        <a class="btn btn--wa" id="bmi-cta" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Ask for a plan</a>
      </div>
    </div>
  </div>
</section>`;

const TIMINGS = `
<section class="sec sec--tight" id="timings">
  <div class="wrap">
    <div class="head head--row" data-anim="head">
      <div><h2 class="h2">When we're <span class="hl">open</span></h2><span class="ur" lang="ur" dir="rtl">اوقاتِ کار</span></div>
      <span class="status" data-status><i></i><span>Checking hours</span></span>
    </div>

    <div class="tline" data-anim="up">
      <div class="tline__bar">
        <span class="tline__seg tline__seg--l" style="left:12.5%;width:9.375%"></span>
        <span class="tline__seg tline__seg--l" style="left:37.5%;width:12.5%"></span>
        <span class="tline__seg tline__seg--a" style="left:50%;width:43.75%"></span>
        <span class="tline__now" hidden><b>Now</b></span>
      </div>
      <div class="tline__ticks"><span style="left:0">8 AM</span><span style="left:25%">12 PM</span><span style="left:50%">4 PM</span><span style="left:75%">8 PM</span><span style="left:100%">12 AM</span></div>
      <div class="tline__key"><span><i class="l"></i>Ladies only</span><span><i class="a"></i>Everyone</span></div>
    </div>
    <div class="times">
      <div class="week" data-anim="up">
        ${DAYS.map(([n, d]) => `<div class="day${d === 0 ? ' off' : ''}" data-d="${d}"><span>${n}</span><b>${d === 0 ? 'Closed' : HOURS_TXT}</b></div>`).join('')}
      </div>
      <div class="ladies" data-anim="up">
        <h3>Ladies only hours</h3>
        <div class="slot">Morning <span>10:00 to 11:30 AM</span></div>
        <div class="slot">Afternoon <span>2:00 to 4:00 PM</span></div>
        <p>Only women during these hours, with a female trainer.</p>
      </div>
    </div>
  </div>
</section>`;

const REVIEW_SEC = `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="head head--row" data-anim="head">
      <div><h2 class="h2">What members <span class="hl">say</span></h2><span class="ur" lang="ur" dir="rtl">ممبرز کی رائے</span></div>
      <a class="gscore" href="${MAPS}" target="_blank" rel="noopener"><strong>5.0</strong><span>${stars}<small>48 reviews on Google</small></span></a>
    </div>
    <div class="reviews swipe" data-anim="up">${REVIEWS.map(([n, q]) => `
      <figure class="rev">
        ${stars}
        <blockquote>${q}</blockquote>
        <figcaption class="rev__who"><span class="rev__av">${n[0]}</span><span><b>${n}</b><small>Google review</small></span></figcaption>
      </figure>`).join('')}
    </div>
    ${HINT}
  </div>
</section>`;

const VISIT = `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="visit" data-anim="up">
      <div class="visit__txt tex tex--b">
        <h2 class="h2">Come and see <span class="hl">the gym</span></h2><span class="ur" lang="ur" dir="rtl">ایک بار جم ضرور آئیں</span>
        <p>Walk in any day except Sunday, or send us a WhatsApp message for fees and timings.</p>
        <div class="visit__btns">
          <a class="btn btn--wa" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}WhatsApp us</a>
          <a class="btn btn--line" href="${DIRECTIONS}" target="_blank" rel="noopener">${ic('pin')}Get directions</a>
        </div>
      </div>
      <div class="visit__img"><img src="assets/img/gym-reception.webp" alt="Reception at Pro Fitness Studio" loading="lazy"></div>
    </div>
  </div>
</section>`;

const pageHero = (kicker, title, lead, crumb, img) => `
<section class="phero tex">
  <div class="wrap">
    <div class="crumbs"><a href="./">Home</a><span>/</span><span>${crumb}</span></div>
    
    <h1 class="h1">${title}</h1>
    <p class="lead">${lead}</p>
  </div>
</section>`;

/* ---------- pages ---------- */
const home = `
<section class="hero">
  <div class="hero__bg"><img src="assets/img/gym-floor.webp" alt="Inside Pro Fitness Studio, Vehari" fetchpriority="high"></div>
  <svg class="hexlights" aria-hidden="true"></svg>
  <div class="wrap">
    <span class="hero__loc">${ic('pin')}G Block Centre, Vehari</span>
    <h1 class="h1"><span class="ln"><span>Stronger.</span></span><span class="ln"><span class="slab">Healthier.</span></span><span class="ln"><span>Happier.</span></span></h1>
    <p class="lead">Vehari's first professional gym. Training, diet plans and rehab in one place, run by Mr. Pakistan Hasham Ahmad Siddiqui.</p>
    <div class="hero__ctas">
      <a class="btn btn--blue" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join on WhatsApp</a>
      <a class="btn btn--line" href="tel:${TEL}">${ic('phone')}Call now</a>
    </div>
    <div class="hero__facts">
      <div class="fact"><small>Google rating</small><b>5.0 ${stars}</b></div>
      <div class="fact"><small>Mon to Sat</small><b>${HOURS_TXT}</b></div>
      <div class="fact"><small>Right now</small><b><span class="status" data-status><i></i><span>Checking hours</span></span></b></div>
    </div>
  </div>
</section>
${WHY}
${PROGRAMS_SHORT}
${GALLERY}
${OWNER}
${RESULTS}
${BMI}
${TIMINGS}
${REVIEW_SEC}
${VISIT}`;

const programs = `
${pageHero('Programs', 'Our <span class="hl">programs</span>', 'Every program comes with guidance from a certified trainer. Tap one to see the details.', 'Programs', 'gym-floor-sm')}
<section class="sec">
  <div class="wrap">
    <div class="acc" data-anim="up">${PROGRAMS.map((p, i) => `
      <details${i === 0 ? ' open' : ''}>
        <summary><span class="ico">${ic(p.ic)}</span><span><b>${p.t}</b><small>${p.d}</small></span><span class="plus" aria-hidden="true"></span></summary>
        <div class="acc__body"><div class="acc__in"><ul>${p.li.map(l => `<li>${l}</li>`).join('')}</ul><a class="btn btn--line btn--sm" href="${progMsg(p)}" target="_blank" rel="noopener">${ic('wa')}Ask about this</a></div></div>
      </details>`).join('')}
    </div>
    <p class="muted" style="margin-top:22px">Fees depend on the program. Send us a message on WhatsApp and we'll tell you the current fees.</p>
  </div>
</section>
${BMI}
${TIMINGS}
${VISIT}`;

const about = `
${pageHero('About', 'About the <span class="hl">gym</span>', 'A gym in G Block Centre, Vehari, run by a certified fitness trainer, dietitian and rehab specialist.', 'About', 'gym-reception')}
${WHY}
${OWNER}
<section class="sec">
  <div class="wrap">
    <div class="head" data-anim="head"><h2 class="h2">Our <span class="hl">trainers</span></h2><span class="ur" lang="ur" dir="rtl">ہمارے ٹرینرز</span></div>
    <ul class="why__list" style="margin:0" data-anim="up">
      <li><span class="ico">${ic('trophy')}</span><span><b>Hasham Ahmad Siddiqui</b><small>Owner and head trainer. Mr. Pakistan, certified fitness trainer, dietitian and rehab specialist.</small></span></li>
      <li><span class="ico">${ic('female')}</span><span><b>Dr. Mamoona Hasham</b><small>Trainer for the ladies hours. Members on Google call her supportive and very motivating.</small></span></li>
    </ul>
  </div>
</section>
${GALLERY}
${RESULTS}
${REVIEW_SEC}
${VISIT}`;

const contact = `
${pageHero('Contact', 'Get in <span class="hl">touch</span>', 'Fill the form and WhatsApp will open with your message ready. Or just call us.', 'Contact', 'gym-machines')}
<section class="sec">
  <div class="wrap contact">
    <div class="cbox" data-anim="up">
      <h2 class="h3" style="margin-bottom:6px">Join the gym</h2>
      <p class="muted" style="margin:0 0 20px">We reply on WhatsApp.</p>
      <form id="join-form">
        <div class="field"><label for="f-name">Your name</label><input class="input" id="f-name" name="name" required autocomplete="name" placeholder="Ali Khan"></div>
        <div class="field"><label for="f-phone">Phone (optional)</label><input class="input" id="f-phone" name="phone" type="tel" autocomplete="tel" placeholder="03xx xxxxxxx"></div>
        <div class="field"><label for="f-goal">Your goal</label>
          <select class="input" id="f-goal" name="goal">${PROGRAMS.map(p => `<option>${p.t}</option>`).join('')}<option>Not sure yet</option></select></div>
        <div class="field"><label for="f-time">Preferred time</label>
          <select class="input" id="f-time" name="time"><option>Ladies only (10 to 11:30 AM)</option><option>Ladies only (2 to 4 PM)</option><option>Evening (4 to 8 PM)</option><option>Night (8 to 11 PM)</option></select></div>
        <div class="field"><label for="f-msg">Message (optional)</label><textarea class="input" id="f-msg" name="msg" placeholder="Anything we should know?"></textarea></div>
        <button class="btn btn--wa" type="submit">${ic('wa')}Send on WhatsApp</button>
      </form>
    </div>
    <div data-anim="up">
      <div class="info">
        <a href="${WA_JOIN}" target="_blank" rel="noopener"><span class="ico" style="color:#25d366;background:#0f2a1c">${ic('wa')}</span><span><small>WhatsApp</small><b>${PHONE}</b></span></a>
        <a href="tel:${TEL}"><span class="ico">${ic('phone')}</span><span><small>Call</small><b>${PHONE}</b></span></a>
        <a href="${DIRECTIONS}" target="_blank" rel="noopener"><span class="ico">${ic('pin')}</span><span><small>Address</small><b>${ADDRESS}</b></span></a>
        <div><span class="ico">${ic('map')}</span><span><small>Plus code</small><b>${PLUS}</b></span></div>
        <div><span class="ico">${ic('clock')}</span><span><small>Mon to Sat (Sunday closed)</small><b>${HOURS_TXT}</b></span></div>
      </div>
      <div class="map"><iframe src="https://www.google.com/maps?q=${GEO}&z=17&output=embed" title="Pro Fitness Studio on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
  </div>
</section>
${TIMINGS}`;

const notFound = `
<section class="nf">
  <div>
    <h1 class="h1">404</h1>
    <p class="lead" style="margin:10px auto 26px">This page doesn't exist.</p>
    <a class="btn btn--blue" href="./">Back to home</a>
  </div>
</section>`;

const DESC = 'Pro Fitness Studio, G Block Centre, Vehari. Training, diet plans, rehab and ladies only hours with Mr. Pakistan Hasham Ahmad Siddiqui. Call or WhatsApp 0309 0503334.';
const build = [
  ['index.html', './', 'Pro Fitness Studio | Gym in Vehari', home],
  ['programs.html', 'programs', 'Programs | Pro Fitness Studio Vehari', programs],
  ['about.html', 'about', 'About | Pro Fitness Studio Vehari', about],
  ['contact.html', 'contact', 'Contact | Pro Fitness Studio Vehari', contact],
  ['404.html', '', 'Page not found | Pro Fitness Studio', notFound],
];
for (const [file, url, title, body] of build) {
  let html = head(title, DESC) + '\n' + header(url) + body + FOOTER;
  // GitHub Pages can show the 404 page at any depth, so give it a base for its links and assets
  if (file === '404.html') html = html.replace('<head>', '<head>\n<base href="/pro-fitness-studio/">');
  fs.writeFileSync(path.join(OUT, file), html);
  console.log('built', file);
}
fs.writeFileSync(path.join(OUT, 'assets', 'img', 'favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0b1630"/><path d="M38 6 14 37h13l-5 21 28-34H36.5L44 6z" fill="#2f7cf6"/></svg>');
console.log('built favicon.svg');
