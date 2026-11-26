/* Builds the static pages into public/ (shared header, footer, icons and all page content).
   Run: node source/build.js
   Every fact on the site lives here: phone, hours, programs, trainers, reviews, results. */
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'public');
const V = 15; // asset version, bump to break cache

/* ---------- business facts (only real information) ---------- */
const PHONE = '0309 0503334', TEL = '+923090503334', WA = '923090503334';
const ADDRESS = 'Idress Plaza, 2nd and 3rd floor, 39/2 G Block, near TMA office, Vehari, Pakistan';
const EMAIL = 'profitnessstudio3334@gmail.com';
const SOCIAL = [
  ['tiktok', 'TikTok', '@pro_fitness_studio0', 'https://www.tiktok.com/@pro_fitness_studio0'],
  ['instagram', 'Instagram', '@pro_fitness_studio1', 'https://www.instagram.com/pro_fitness_studio1'],
  ['facebook', 'Facebook', 'Pro Fitness Studio', 'https://www.facebook.com/share/19sQQWEPD9/'],
];
const PLUS = '29R3+PJ Vehari';
const GEO = '30.0417523,72.3540467';
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const WA_JOIN = wa('Hi Pro Fitness Studio! I want to join. Please share the membership details and fees.');
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${GEO}`;
const MAPS = 'https://www.google.com/maps/place/Profitness+Studio/@30.0417523,72.3540467,17z';
const HOURS_TXT = '4 PM to 11 PM';
const LADIES_TXT = ['10:00 to 11:30 AM', '2:00 to 4:00 PM'];

/* ---------- icons ---------- */
const ICONS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-bolt" viewBox="0 0 18 30"><path d="M7.5 0H17l-4.6 11.5H17L3.5 30l3.2-13.6H1.5z" fill="currentColor"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></g></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h3.5l1.5 4.5-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>
  <symbol id="i-wa" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7c-2 0-4-.5-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.9 5.2 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6l-.6-.3z"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3.5 6 8.5 7 8.5-7"/></g></symbol>
  <symbol id="i-tiktok" viewBox="0 0 24 24"><path fill="currentColor" d="M16.6 2h-3.3v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.1a6.3 6.3 0 1 0 5.3 6.2V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.4z"/></symbol>
  <symbol id="i-instagram" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/></g><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></symbol>
  <symbol id="i-facebook" viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.6 1.6-1.6h1.7V3.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.4V13h2.7v8z"/></symbol>
  <symbol id="i-map" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/></g></symbol>
  <symbol id="i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-left" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-right" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
  <symbol id="i-expand" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-redo" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</svg>`;
const ic = (n, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const stars = `<span class="stars" aria-label="5 out of 5 stars">${ic('star').repeat(5)}</span>`;
const LOGO = () => `<a class="logo" href="./" aria-label="Pro Fitness Studio, home"><span class="logo__row">PRO<svg class="logo__bolt" viewBox="0 0 18 30" aria-hidden="true"><path d="M7.5 0H17l-4.6 11.5H17L3.5 30l3.2-13.6H1.5z" fill="#2f7cf6"/></svg>FITNESS</span><span class="logo__sub">STUDIO</span></a>`;
const img = (name, alt, cls = '', eager = false, pos = '') => `<img class="${cls}"${pos ? ` style="object-position:${pos}"` : ''} src="assets/img/${name}.webp" srcset="assets/img/${name}-sm.webp 720w, assets/img/${name}.webp 1400w" sizes="(max-width: 960px) 100vw, 60vw" alt="${alt}"${eager ? '' : ' loading="lazy"'} decoding="async">`;

/* ---------- navigation ---------- */
const NAV = [
  ['./', 'Home'],
  ['programs', 'Programs', [['programs', 'All programs', 'Eight ways to train'], ['programs#planner', 'Workout planner', 'Push, pull, legs and more'], ['programs#membership', 'Membership', 'Build your plan'], ['programs#calculators', 'Calculators', 'BMI and calories'], ['./#quiz', 'Fitness quiz', 'Find your program in 60s']]],
  ['about', 'About', [['about#story', 'Our story', 'Why train here'], ['about#trainers', 'Trainers', 'Meet the coaches'], ['about#gallery', 'Gallery', 'Walk through the gym'], ['about#results', 'Results', 'Member transformations']]],
  ['contact#schedule', 'Schedule'],
  ['contact', 'Contact'],
];

/* ---------- programs (only what the gym offers) ---------- */
const PROGRAMS = [
  { id: 'strength', t: 'Strength training', img: 'a-strength', pos: '50% 30%', lvl: 'All levels', d: 'Machines and free weights, with a coach on your form from day one.', li: ['Machines, benches and a full dumbbell rack', 'Trainer shows you the right form', 'Plan for muscle gain'], msg: 'Strength training' },
  { id: 'loss', t: 'Weight loss', img: 'a-loss', pos: '50% 18%', lvl: 'Beginner friendly', d: 'Workouts, cardio and a diet plan working together.', li: ['Fat loss workouts', 'Diet plan from a dietitian', 'Weight checked every week'], msg: 'Weight loss' },
  { id: 'cardio', t: 'Cardio', img: 'c-cardio', pos: '50% 60%', lvl: 'All levels', d: 'Proper guided cardio sessions for stamina and heart health.', li: ['A separate cardio floor', 'Guided cardio sessions', 'Good for stamina and heart health', 'Can be mixed with weights'], msg: 'Cardio' },
  { id: 'transform', t: 'Body transformation', img: 'c-transform', pos: '50% 22%', lvl: 'Committed', d: 'A full plan for a big change, start to finish.', li: ['Workout and diet plan made for you', 'Progress photos and weight tracking', 'See real member results'], msg: 'Body transformation' },
  { id: 'pt', t: 'Personal training', img: 'a-pt', pos: '45% 28%', lvl: 'Best for beginners', d: 'One-to-one sessions with a trainer next to you.', li: ['Trainer with you the whole session', 'Plan changes as you improve', 'Best for beginners'], msg: 'Personal training' },
  { id: 'diet', t: 'Diet plans', img: 'a-diet', pos: '50% 50%', lvl: 'Add to any program', d: 'Made by a dietitian, with normal home food.', li: ['Normal Pakistani food, no fancy items', 'For weight loss or weight gain', 'Updated as you progress'], msg: 'Diet plan' },
  { id: 'rehab', t: 'Rehab', img: 'a-rehab', pos: '40% 30%', lvl: 'Gentle pace', d: 'Safe exercise after an injury or for back pain.', li: ['Back, knee and shoulder problems', 'Slow, safe exercises', 'Guided by a rehab specialist'], msg: 'Rehab' },
  { id: 'ladies', t: 'Ladies only hours', img: 'a-ladies', pos: '70% 28%', lvl: 'Women only', d: 'Separate time for women, with a female trainer.', li: [`Morning ${LADIES_TXT[0]}`, `Afternoon ${LADIES_TXT[1]}`, 'Female trainer'], msg: 'Ladies only hours' },
];
const progMsg = p => wa(`Hi Pro Fitness Studio! I want to ask about ${p.msg}. What are the fees?`);

const REVIEWS = [
  ['Aleeza Basit', 'Amazing gym and an even better trainer! She\'s so sweet, supportive, and motivating. Love my workout sessions and the positive energy here!'],
  ['Sadia Amjad', 'Excellent experience so far! A dedicated, professional, and highly encouraging trainer. Her guidance and motivating approach make workouts more effective and enjoyable. Highly recommended!'],
  ['Ch Ahmad', 'A very good gym and great training experience. First time a proper cardio and weight loss session in Vehari.'],
];
const BA = [
  { i: 1, from: 130, to: 90, tag: 'Lost 40 kg', ra: 0.509, rb: 0.445 },
  { i: 2, from: 148, to: 100, tag: 'Lost 48 kg', ra: 0.583, rb: 0.386 },
  { i: 3, from: 122, to: 91, tag: 'Lost 31 kg', ra: 0.591, rb: 0.411 },
  { i: 5, from: 58, to: 80, tag: 'Gained 22 kg', ra: 0.515, rb: 0.498 },
  { i: 4, tag: 'Muscle gain', ra: 0.488, rb: 0.504 },
  { i: 6, tag: 'Body shape', ra: 0.498, rb: 0.495 },
];
const KG_LOST = BA.filter(b => b.from > b.to).reduce((s, b) => s + b.from - b.to, 0); // 119

const GALLERY = [
  ['c-wide', 'The main floor under the hexagon lights'],
  ['c-rack', 'Dumbbell rack and adjustable benches'],
  ['c-floor', 'Members training on the floor'],
  ['c-cardio', 'The separate cardio floor'],
  ['c-machines', 'Plate-loaded and cable machines'],
  ['c-hex', 'Hexagon ceiling lights'],
  ['c-backext', 'Back extension and leg machines'],
  ['c-mirrors', 'Mirror wall and screens'],
  ['c-reception', 'Reception and waiting area'],
  ['c-trophies', 'The trophy wall'],
];

/* ---------- small builders ---------- */
const SH = ({ eyebrow, title, p, side = '', row = false, id = '', mark = '' }) => `
    <div class="sh${row ? ' sh--row' : ''}" data-anim="head"${id ? ` id="${id}"` : ''}>
      ${mark ? `<span class="sh__mark" aria-hidden="true">${mark}</span>` : ''}
      <div>
        <span class="eyebrow">${eyebrow}</span>
        <h2 class="h2">${title}</h2>
        ${p ? `<p>${p}</p>` : ''}
      </div>
      ${side}
    </div>`;

function head(title, desc, canon) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#050608">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://abdulraheem02312.github.io/pro-fitness-studio/assets/img/og.jpg">
<meta property="og:type" content="website">
<link rel="canonical" href="https://abdulraheem02312.github.io/pro-fitness-studio/${canon === './' ? '' : canon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;1,700;1,800;1,900&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=${V}">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ExerciseGym', name: 'Pro Fitness Studio', alternateName: 'Profitness Studio',
    telephone: TEL, email: EMAIL, sameAs: SOCIAL.map(s => s[3]), image: 'https://abdulraheem02312.github.io/pro-fitness-studio/assets/img/og.jpg',
    address: { '@type': 'PostalAddress', streetAddress: 'Idress Plaza, 2nd and 3rd floor, 39/2 G Block, near TMA office', addressLocality: 'Vehari', addressCountry: 'PK' },
    geo: { '@type': 'GeoCoordinates', latitude: 30.0417523, longitude: 72.3540467 },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '48' },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '16:00', closes: '23:00' }],
  })}</script>
</head>`;
}

function header(active) {
  const base = h => h.split('#')[0] || './';
  const isCur = h => base(h) === active && !h.includes('#');
  const cur = h => (isCur(h) ? ' aria-current="page"' : '');
  const links = NAV.map(([h, n, sub], i) => sub ? `
      <div class="dd" data-dd>
        <a class="nav__a" href="${h}"${cur(h)}>${n}</a><button class="dd__btn" type="button" aria-expanded="false" aria-controls="dd-${i}" aria-label="${n} menu">${ic('chev')}</button>
        <div class="dd__menu" id="dd-${i}">${sub.map(([sh, sn, sd]) => `<a href="${sh}"><b>${sn}</b><small>${sd}</small></a>`).join('')}</div>
      </div>` : `<a class="nav__a" href="${h}"${cur(h)}>${n}</a>`).join('');
  const drawer = NAV.map(([h, n, sub]) => sub ? `
      <div class="dg">
        <button class="dg__btn" type="button" aria-expanded="false">${n}${ic('chev')}</button>
        <div class="dg__list"><div>${sub.map(([sh, sn]) => `<a href="${sh}">${sn}</a>`).join('')}</div></div>
      </div>` : `<a class="dl" href="${h}"${cur(h)}>${n}</a>`).join('');
  return `<body>
<a class="skip" href="#main">Skip to content</a>
${ICONS}
<header class="nav">
  <div class="nav__bar">
    ${LOGO()}
    <nav class="nav__links" aria-label="Main">${links}</nav>
    <span class="status nav__status" data-status><i></i><span>Checking hours</span></span>
    <a class="btn btn--blue btn--sm nav__cta" href="${WA_JOIN}" target="_blank" rel="noopener">Join now</a>
    <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
  </div>
</header>
<div class="drawer" id="drawer" aria-label="Menu" inert>
  <nav class="drawer__nav" aria-label="Mobile">${drawer}</nav>
  <div class="drawer__foot">
    <span class="status" data-status><i></i><span>Checking hours</span></span>
    <a class="btn btn--blue" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join on WhatsApp</a>
    <a class="btn btn--line" href="tel:${TEL}">${ic('phone')}Call ${PHONE}</a>
  </div>
</div>
<main id="main">`;
}

const FINAL_CTA = `
<section class="final">
  <div class="final__bg">${img('c-hex', '', '', false).replace('alt=""', 'alt="" aria-hidden="true"')}</div>
  <div class="wrap final__in" data-anim="up">
    <span class="eyebrow">Pro Fitness Studio, Vehari</span>
    <h2 class="final__h">Your strongest self <span class="slab slab--static">starts here.</span></h2>
    <p>Plans start at Rs 3,000 a month. Walk in any day except Sunday, or message us on WhatsApp.</p>
    <div class="final__btns">
      <a class="btn btn--blue btn--lg" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join the gym</a>
      <a class="btn btn--line btn--lg" href="tel:${TEL}">${ic('phone')}Call ${PHONE}</a>
    </div>
  </div>
</section>`;

function footer() {
  return `
</main>
<footer class="foot">
  <svg class="foot__globe" data-globe viewBox="-260 -260 520 520" aria-hidden="true"></svg>
  <button class="foot__top-btn" type="button" data-to-top aria-label="Back to top">
    <svg class="foot__curl" viewBox="0 0 120 60" aria-hidden="true"><path d="M2 30 C 30 30, 40 6, 70 8 S 112 30, 104 44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="104" cy="44" r="4.5" fill="currentColor"/></svg>
    <span class="foot__top-c"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </button>
  <div class="wrap foot__main">
    <div class="foot__lead">
      <h2 class="foot__h2">Stronger. Healthier. <em>Happier.</em></h2>
      <p>Vehari's first professional gym, coached by Mr. Pakistan Hasham Ahmad Siddiqui.</p>
      <div class="foot__contacts">
        <a class="fc" href="${WA_JOIN}" target="_blank" rel="noopener"><span class="fc__ico">${ic('wa')}</span><span><small>Fastest reply</small><b>Chat on WhatsApp</b></span></a>
        <a class="fc" href="tel:${TEL}"><span class="fc__ico fc__ico--line">${ic('phone')}</span><span><small>Call us</small><b>${PHONE}</b></span></a>
        <a class="fc" href="mailto:${EMAIL}"><span class="fc__ico fc__ico--line">${ic('mail')}</span><span><small>Send an email</small><b>${EMAIL}</b></span></a>
      </div>
      <div class="foot__cta">
        <a class="btn btn--blue btn--lg" href="${WA_JOIN}" target="_blank" rel="noopener">Join the gym${ic('arrow')}</a>
        <div class="soc" aria-label="Follow us">${SOCIAL.map(([k, n, , u]) => `<a class="soc__a soc__a--${k}" href="${u}" target="_blank" rel="noopener" aria-label="${n}">${ic(k)}</a>`).join('')}</div>
      </div>
    </div>
    <nav class="foot__cols" aria-label="Footer">
      <div>
        <h3 class="foot__h">Pages</h3>
        <ul><li><a href="./">Home</a></li><li><a href="programs">Programs</a></li><li><a href="about">About</a></li><li><a href="about#gallery">Gallery</a></li><li><a href="contact">Contact</a></li></ul>
      </div>
      <div>
        <h3 class="foot__h">Train</h3>
        <ul><li><a href="programs#membership">Membership plans</a></li><li><a href="programs#planner">Workout planner</a></li><li><a href="programs#calculators">BMI and calories</a></li><li><a href="./#quiz">Fitness quiz</a></li><li><a href="about#trainers">Trainers</a></li></ul>
      </div>
      <div>
        <h3 class="foot__h">Timings</h3>
        <ul class="foot__plain"><li>Mon to Sat, ${HOURS_TXT}</li><li>Ladies, ${LADIES_TXT[0]}</li><li>Ladies, ${LADIES_TXT[1]}</li><li>Sunday closed</li></ul>
      </div>
    </nav>
  </div>
  <div class="wrap">
    <div class="foot__bar">
      ${LOGO()}
      <a class="foot__addr" href="${DIRECTIONS}" target="_blank" rel="noopener">${ic('pin')}${ADDRESS}</a>
      <div class="foot__legal"><span>© <span data-year>2026</span> Pro Fitness Studio</span><a href="privacy">Privacy</a><span>Website by Abdul Raheem</span></div>
    </div>
  </div>
</footer>
<a class="wa-float" href="${WA_JOIN}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ic('wa')}</a>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="assets/js/site.js?v=${V}" defer></script>
</body>
</html>`;
}

/* ---------- sections ---------- */
// hero video: the 9:16 clip on phones and portrait tablets, the 16:9 clip everywhere else (site.js uses the same query)
const TALL_MQ = '(max-width: 960px) and (orientation: portrait)';
const HERO = `
<section class="hero" data-hero>
  <div class="hero__bg" aria-hidden="true">
    <picture>
      <source media="${TALL_MQ}" srcset="assets/video/hero-tall.webp">
      <img src="assets/video/hero-wide.webp" alt="" fetchpriority="high">
    </picture>
    <video class="hero__video" muted loop playsinline autoplay preload="auto" disablepictureinpicture>
      <source media="${TALL_MQ}" src="assets/video/hero-tall.mp4" type="video/mp4">
      <source src="assets/video/hero-wide.mp4" type="video/mp4">
    </video>
  </div>
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <span class="hero__loc">${ic('pin')}G Block Centre, Vehari</span>
      <h1 class="h1 hero__h"><span class="ln"><span>Build</span></span><span class="ln"><span>strength.</span></span><span class="ln"><span class="slab">Break</span> <span>limits.</span></span></h1>
      <p class="lead">Train with purpose under Mr. Pakistan Hasham Ahmad Siddiqui. Coaching, diet plans and rehab in one place, and become the strongest version of yourself.</p>
      <div class="hero__ctas">
        <a class="btn btn--blue btn--lg" href="${WA_JOIN}" target="_blank" rel="noopener">Start your journey${ic('arrow')}</a>
        <a class="btn btn--line btn--lg" href="programs">Explore programs</a>
      </div>
    </div>
  </div>
  <div class="wrap hero__facts">
    <a class="fact" href="${MAPS}" target="_blank" rel="noopener"><small>Google rating</small><b>5.0 ${stars}</b></a>
    <div class="fact"><small>Mon to Sat</small><b>${HOURS_TXT}</b></div>
    <div class="fact"><small>Ladies only</small><b>10 to 11:30 AM, 2 to 4 PM</b></div>
    <div class="fact"><small>Right now</small><b><span class="status" data-status><i></i><span>Checking hours</span></span></b></div>
  </div>
</section>`;

const MARQUEE_WORDS = ['Strength', 'Discipline', 'Performance', 'Consistency', 'Focus', 'Progress'];
const MARQUEE = `
<div class="marquee" aria-label="Strength, discipline, performance, consistency, focus, progress">
  <div class="marquee__track" aria-hidden="true">${[0, 1].map(() => `<div class="marquee__set">${MARQUEE_WORDS.map((w, i) => `<span class="${i % 2 ? 'o' : ''}">${w}</span>${ic('bolt', 'marquee__bolt')}`).join('')}</div>`).join('')}</div>
</div>`;

const STATS = `
<section class="stats" aria-label="Pro Fitness Studio in numbers">
  <div class="wrap stats__grid">
    <div class="stat" data-anim="up"><b><span data-count="5" data-dec="1">5.0</span></b><span>Google rating, from 48 reviews</span></div>
    <div class="stat" data-anim="up"><b><span data-count="${KG_LOST}">${KG_LOST}</span><i>kg</i></b><span>Lost by three members on our results poster</span></div>
    <div class="stat" data-anim="up"><b><span data-count="48">48</span><i>kg</i></b><span>The biggest single loss, 148 down to 100</span></div>
    <div class="stat" data-anim="up"><b><span data-count="6">6</span><i>days</i></b><span>Open every week, Monday to Saturday</span></div>
  </div>
</section>`;

const STORY_STEPS = [
  ['owner', 'Coached by Mr. Pakistan', 'The owner, Hasham Ahmad Siddiqui, is a certified fitness trainer. He plans your training himself and checks your progress.'],
  ['a-diet', 'Your diet is planned too', 'A dietitian plans your food with normal home meals, not just your workout.'],
  ['a-rehab', 'Safe if you have pain', 'A rehab specialist for back, knee, shoulder and old injuries.'],
  ['c-cardio', 'Two floors, own cardio floor', 'Strength on one floor and a separate cardio floor, a first for Vehari.'],
  ['a-ladies', 'Ladies only hours', `Separate time for women with a female trainer: ${LADIES_TXT[0]} and ${LADIES_TXT[1]}.`],
];
const STORY = (id = 'story') => `
<section class="sec story" id="${id}">
  <div class="wrap">
    ${SH({ mark: 'WHY US', eyebrow: 'Why train here', title: 'More than a <span class="hl">gym floor</span>', p: 'Five things you get at Pro Fitness Studio that most gyms in Vehari don\'t give you.' })}
    <div class="bento">
      ${STORY_STEPS.map(([im, t, d], i) => `<article class="bcard bcard--${i + 1}" data-anim="up">
        <div class="bcard__img">${im === 'owner' ? `<img src="assets/img/owner.webp" alt="Hasham Ahmad Siddiqui" loading="lazy" width="600" height="1190">` : img(im, t, '', false, { 'a-ladies': '70% 28%', 'a-rehab': '40% 30%', 'c-cardio': '50% 55%' }[im] || '')}</div>
        <span class="bcard__n" aria-hidden="true">0${i + 1}</span>
        <div class="bcard__body"><h3>${t}</h3><p>${d}</p></div>
      </article>`).join('')}
    </div>
  </div>
</section>`;

const PROG = (all = false) => `
<section class="sec prog-sec" id="${all ? 'all' : 'programs'}">
  <div class="wrap">
    ${SH({ mark: 'PROGRAMS', eyebrow: all ? 'Eight programs' : 'Training programs', title: `What we <span class="hl">offer</span>`, p: 'Pick a program to see what it includes. Every program comes with guidance from a certified trainer.', row: !all, side: all ? '' : `<a class="link" href="programs">All program details ${ic('arrow')}</a>` })}
    <div class="prog" data-prog>
      <div class="prog__list" role="tablist" aria-label="Programs">
        ${PROGRAMS.map((p, i) => `<button class="prog__tab" role="tab" type="button" id="pt-${p.id}" aria-controls="pp-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="prog__n">0${i + 1}</span><span class="prog__t">${p.t}</span><span class="prog__lv">${p.lvl}</span></button>`).join('')}
      </div>
      <div class="prog__stage">
        ${PROGRAMS.map((p, i) => `<article class="prog__panel${i === 0 ? ' on' : ''}" role="tabpanel" id="pp-${p.id}" aria-labelledby="pt-${p.id}"${i === 0 ? '' : ' hidden'}>
          <div class="prog__media" data-tilt>${img(p.img, p.t, '', false, p.pos)}<span class="prog__big" aria-hidden="true">0${i + 1}</span></div>
          <div class="prog__body">
            <span class="tag">${p.lvl}</span>
            <h3>${p.t}</h3>
            <p>${p.d}</p>
            <ul class="ticks">${p.li.map(l => `<li>${ic('check')}${l}</li>`).join('')}</ul>
            <a class="btn btn--blue" href="${progMsg(p)}" target="_blank" rel="noopener">${ic('wa')}Ask about ${p.t.toLowerCase()}</a>
          </div>
        </article>`).join('')}
      </div>
    </div>
  </div>
</section>`;

const QUIZ = `
<section class="sec quiz-sec" id="quiz">
  <div class="wrap quiz">
    <div class="quiz__intro" data-anim="up">
      <span class="sh__mark sh__mark--quiz" aria-hidden="true">QUIZ</span>
      <span class="eyebrow">60-second fitness quiz</span>
      <h2 class="h2">Find your <span class="hl">program</span></h2>
      <p>Five quick questions about your goal, experience and how you like to train. We match you to one of our real programs.</p>
      <div class="quiz__meter" aria-hidden="true"><span data-quiz-bar></span></div>
      <p class="quiz__count" data-quiz-count>Question 1 of 5</p>
      <p class="quiz__note">This is general guidance, not medical advice. A trainer will check you properly on your first visit.</p>
    </div>
    <div class="quiz__card" data-quiz aria-live="polite">
      <noscript><p>The quiz needs JavaScript. You can also <a href="${WA_JOIN}">ask us on WhatsApp</a>.</p></noscript>
    </div>
  </div>
</section>`;

const RESULTS = `
<section class="sec results-sec" id="results">
  <div class="wrap">
    ${SH({ mark: 'RESULTS', eyebrow: 'Member results', title: `Every kilo <span class="hl">counts</span>`, p: 'Real members, trained by Hasham Ahmad Siddiqui. Photos and numbers come from the gym\'s own transformation poster.' })}
  </div>
  <div class="wrap res">
    <div class="res__txt" data-anim="up">
      <h3 class="h3">Six real transformations</h3>
      <p class="muted">Pick a member to see their before and after. They switch on their own every few seconds.</p>
      <div class="res__chips">${BA.map((m, k) => `<button type="button" class="chip${k === 0 ? ' on' : ''}" data-k="${k}" aria-pressed="${k === 0}">${m.from ? `<b>${m.from} → ${m.to} kg</b>` : `<b>${m.tag}</b>`}<small>${m.from ? m.tag : 'Before and after'}</small></button>`).join('')}</div>
    </div>
    <div class="ba2" data-ba data-anim="up">
      <div class="ba2__stage" style="--ra:${BA[0].ra};--rb:${BA[0].rb}">
        <figure class="ba2__side ba2__side--b"><img src="assets/img/ba-${BA[0].i}-before.webp" alt="Member before training" draggable="false"><figcaption>Before</figcaption></figure>
        <figure class="ba2__side ba2__side--a"><img src="assets/img/ba-${BA[0].i}-after.webp" alt="Member after training" draggable="false"><figcaption>After</figcaption></figure>
      </div>
      <div class="ba2__bar">
        <div class="ba2__kg"><b data-kg>${BA[0].from} → ${BA[0].to} kg</b><span data-kgtag>${BA[0].tag}</span></div>
        <div class="ba2__nav"><span class="ba2__count" data-ba-count>1 / ${BA.length}</span><button class="rbtn" type="button" data-ba-prev aria-label="Previous member">${ic('left')}</button><button class="rbtn" type="button" data-ba-next aria-label="Next member">${ic('right')}</button></div>
      </div>
      <span class="ba2__timer" aria-hidden="true"><i></i></span>
    </div>
  </div>
</section>
<script type="application/json" id="ba-data">${JSON.stringify(BA)}</script>`;

const TRAINERS = (id = 'trainers') => `
<section class="sec trainers" id="${id}">
  <div class="wrap">
    ${SH({ mark: 'COACHES', eyebrow: 'Personal trainers', title: `Meet your <span class="hl">coaches</span>`, p: 'Hover or tap a card to read more.' })}
    <div class="tcards">
      <article class="tcard" data-anim="up">
        <button class="tcard__hit" type="button" aria-expanded="false" aria-controls="tc-1"><span class="sr">Show details for Hasham Ahmad Siddiqui</span></button>
        <div class="tcard__img"><img src="assets/img/owner.webp" alt="Hasham Ahmad Siddiqui" loading="lazy" width="600" height="1190"></div>
        <div class="tcard__body">
          <span class="tag">Owner and head trainer</span>
          <h3>Hasham Ahmad Siddiqui</h3>
          <p class="tcard__title">Mr. Pakistan</p>
          <div class="tcard__more" id="tc-1"><div>
            <ul class="ticks">${['Certified fitness trainer', 'Dietitian', 'Rehab specialist'].map(l => `<li>${ic('check')}${l}</li>`).join('')}</ul>
            <p>He plans your workout and your diet himself, and checks your progress.</p>
            <a class="btn btn--blue btn--sm" href="${wa('Hi! I want to train with Hasham Ahmad Siddiqui at Pro Fitness Studio. Please share the details.')}" target="_blank" rel="noopener">${ic('wa')}Book with Hasham</a>
          </div></div>
        </div>
      </article>
      <article class="tcard tcard--mono" data-anim="up">
        <button class="tcard__hit" type="button" aria-expanded="false" aria-controls="tc-2"><span class="sr">Show details for Dr. Mamoona Hasham</span></button>
        <div class="tcard__img tcard__img--mono" aria-hidden="true"><span>M</span></div>
        <div class="tcard__body">
          <span class="tag">Ladies only hours</span>
          <h3>Dr. Mamoona Hasham</h3>
          <p class="tcard__title">Female trainer</p>
          <div class="tcard__more" id="tc-2"><div>
            <ul class="ticks"><li>${ic('check')}Trains the ladies only hours</li><li>${ic('check')}${LADIES_TXT[0]}</li><li>${ic('check')}${LADIES_TXT[1]}</li></ul>
            <p>Members on Google call her supportive and very motivating.</p>
            <a class="btn btn--blue btn--sm" href="${wa('Hi! I want to join the ladies only hours at Pro Fitness Studio. Please share the details.')}" target="_blank" rel="noopener">${ic('wa')}Ask about ladies hours</a>
          </div></div>
        </div>
      </article>
      <aside class="tquote" data-anim="up">
        <span class="eyebrow">From a member</span>
        <blockquote>"A dedicated, professional, and highly encouraging trainer. Her guidance and motivating approach make workouts more effective and enjoyable."</blockquote>
        <p>Sadia Amjad, Google review</p>
      </aside>
    </div>
  </div>
</section>`;

const GALLERY_SEC = (id = 'gallery') => `
<section class="gal" id="${id}" data-gal>
  <div class="gal__pin">
    <div class="wrap">
      ${SH({ mark: 'FACILITY', eyebrow: 'Facility', title: `Walk through <span class="hl">the gym</span>`, p: 'Real photos from our floor in G Block Centre. Tap any photo to see it full screen.', row: true, side: `<div class="gal__ctrl"><button class="rbtn" type="button" data-gal-prev aria-label="Previous photos">${ic('left')}</button><button class="rbtn" type="button" data-gal-next aria-label="Next photos">${ic('right')}</button></div>` })}
    </div>
    <div class="gal__track" data-gal-track>
      ${GALLERY.map(([im, cap], i) => `<figure class="gal__item"><button type="button" class="gal__btn" data-lb="${i}" aria-label="Open photo: ${cap}">${img(im, cap)}<span class="gal__zoom">${ic('expand')}</span></button><figcaption><span>0${i + 1}</span>${cap}</figcaption></figure>`).join('')}
    </div>
  </div>
</section>
<dialog class="lb" data-lb-dialog aria-label="Photo viewer">
  <div class="lb__in">
    <img data-lb-img src="" alt="">
    <p data-lb-cap></p>
    <button class="rbtn lb__x" type="button" data-lb-close aria-label="Close">${ic('x')}</button>
    <button class="rbtn lb__p" type="button" data-lb-prev aria-label="Previous photo">${ic('left')}</button>
    <button class="rbtn lb__n" type="button" data-lb-next aria-label="Next photo">${ic('right')}</button>
  </div>
</dialog>
<script type="application/json" id="gal-data">${JSON.stringify(GALLERY)}</script>`;

const REVIEW_SEC = `
<section class="sec reviews-sec">
  <div class="wrap">
    ${SH({ mark: 'REVIEWS', eyebrow: 'Reviews', title: `What members <span class="hl">say</span>`, row: true, side: `<a class="gscore" href="${MAPS}" target="_blank" rel="noopener"><strong>5.0</strong><span>${stars}<small>48 reviews on Google</small></span></a>` })}
    <div class="revs" data-revs>
      <div class="revs__track" data-revs-track tabindex="0" aria-label="Reviews, scroll sideways">
        ${REVIEWS.map(([n, q], i) => `<figure class="rev">
          <span class="rev__q" aria-hidden="true">“</span>
          <blockquote>${q}</blockquote>
          <figcaption>${stars}<b>${n}</b><small>Google review</small></figcaption>
        </figure>`).join('')}
        <a class="rev rev--more" href="${MAPS}" target="_blank" rel="noopener"><b>Read all 48 reviews</b><span>On Google Maps ${ic('arrow')}</span></a>
      </div>
      <div class="revs__ctrl"><button class="rbtn" type="button" data-revs-prev aria-label="Previous review">${ic('left')}</button><button class="rbtn" type="button" data-revs-next aria-label="Next review">${ic('right')}</button></div>
    </div>
  </div>
</section>`;

const DAYS = [['Mon', 'Monday', 1], ['Tue', 'Tuesday', 2], ['Wed', 'Wednesday', 3], ['Thu', 'Thursday', 4], ['Fri', 'Friday', 5], ['Sat', 'Saturday', 6], ['Sun', 'Sunday', 0]];
const SLOTS = [
  { k: 'ladies', t: 'Ladies only', when: 'Morning', s: 10, e: 11.5, time: '10:00 to 11:30 AM', who: 'Women only, with a female trainer' },
  { k: 'ladies', t: 'Ladies only', when: 'Afternoon', s: 14, e: 16, time: '2:00 to 4:00 PM', who: 'Women only, with a female trainer' },
  { k: 'all', t: 'Co-ed hours', when: 'Evening', s: 16, e: 23, time: '4:00 to 11:00 PM', who: 'Everyone, men and women' },
];
const G0 = 9, G1 = 23; // timeline from 9 AM to 11 PM
const pct = h => ((h - G0) / (G1 - G0) * 100).toFixed(3) + '%';
const slotMsg = s => wa(`Hi Pro Fitness Studio! I want to ask about the ${s.when.toLowerCase()} ${s.t.toLowerCase()} slot (${s.time}). Please share the details.`);
const SCHEDULE = `
<section class="sec sched-sec" id="schedule">
  <div class="wrap">
    ${SH({ mark: 'SCHEDULE', eyebrow: 'Class schedule', title: `When we're <span class="hl">open</span>`, p: 'Same timings every day, Monday to Saturday. There are no set classes: you train on the floor with a trainer guiding you.', row: true, side: '<span class="status" data-status><i></i><span>Checking hours</span></span>' })}
    <div class="sched2" data-anim="up">
      <div class="wk" aria-label="Days open">
        ${DAYS.map(([s, n, d]) => `<div class="wk__d${d === 0 ? ' off' : ''}" data-d="${d}"><b>${s}</b><small>${d === 0 ? 'Closed' : 'Open'}</small></div>`).join('')}
      </div>
      <div class="tl" aria-label="Today's timings">
        <div class="tl__head"><b data-tl-title>Today</b><span class="tl__key"><i class="k-ladies"></i>Ladies only <i class="k-all"></i>Co-ed</span></div>
        <div class="tl__bar">
          ${SLOTS.map(sl => `<span class="tl__seg tl__seg--${sl.k}" style="left:${pct(sl.s)};width:${pct(G0 + sl.e - sl.s)}"><em>${sl.when}</em></span>`).join('')}
          <span class="tl__now" data-tl-now hidden><b>Now</b></span>
        </div>
        <div class="tl__ticks" aria-hidden="true">${[9, 11, 13, 15, 17, 19, 21, 23].map(h => `<span style="left:${pct(h)}">${(h % 12) || 12} ${h < 12 ? 'AM' : 'PM'}</span>`).join('')}</div>
      </div>
      <div class="scards">
        ${SLOTS.map((sl, i) => `<article class="scard scard--${sl.k}" data-slot="${i}" data-s="${sl.s}" data-e="${sl.e}">
          <div class="scard__top"><span class="scard__when">${sl.when}</span><span class="scard__st" data-slot-st>&nbsp;</span></div>
          <h3>${sl.time}</h3>
          <p><b>${sl.t}</b> · ${sl.who}</p>
          <a class="link" href="${slotMsg(sl)}" target="_blank" rel="noopener">Ask about this slot ${ic('arrow')}</a>
        </article>`).join('')}
      </div>
    </div>
  </div>
</section>`;

const OWNER_FEATURE = `
<section class="founder">
  <div class="founder__marq" aria-hidden="true"><div>${'MR. PAKISTAN · HEAD COACH · PRO FITNESS STUDIO · '.repeat(6)}</div></div>
  <div class="wrap founder__grid">
    <div class="founder__img" data-anim="wipe"><img src="assets/img/owner.webp" alt="Hasham Ahmad Siddiqui" loading="lazy" width="600" height="1190"></div>
    <div class="founder__txt" data-anim="up">
      <span class="eyebrow">Meet the founder</span>
      <h2 class="h2">Hasham Ahmad <span class="hl">Siddiqui</span></h2>
      <div class="founder__facts">
        <div><b>Mr. Pakistan</b><span>The title he trains under</span></div>
        <div><b>Certified</b><span>Fitness trainer</span></div>
        <div><b>Dietitian</b><span>Plans your food too</span></div>
        <div><b>Rehab</b><span>Specialist for pain and injuries</span></div>
      </div>
      <p>He plans your workout and your diet himself, and checks your progress. Every member on our results poster was trained by him.</p>
      <a class="btn btn--blue" href="${wa('Hi! I want to train with Hasham Ahmad Siddiqui at Pro Fitness Studio. Please share the details.')}" target="_blank" rel="noopener">${ic('wa')}Train with Hasham</a>
    </div>
  </div>
</section>`;

/* ---------- programs page tools ---------- */
const PLANNER = `
<section class="sec planner-sec" id="planner">
  <div class="wrap">
    ${SH({ mark: 'PLANNER', eyebrow: 'Workout planner', title: `Plan your <span class="hl">training day</span>`, p: 'Pick a day type and your level to see an example session. Then pick how many days you can train.' })}
    <div class="planner" data-planner>
      <div class="planner__bar">
        <div class="planner__types" role="tablist" aria-label="Day type">
          ${['Push', 'Pull', 'Legs', 'Full body', 'Cardio'].map((t, i) => `<button type="button" role="tab" data-type="${t.toLowerCase().replace(' ', '')}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t}</button>`).join('')}
        </div>
        <div class="seg" role="group" aria-label="Level">
          <button type="button" class="on" data-lvl="b" aria-pressed="true">Beginner</button>
          <button type="button" data-lvl="i" aria-pressed="false">Intermediate</button>
        </div>
      </div>
      <div class="planner__panel" role="tabpanel">
        <div class="planner__media"><img data-pl-img src="assets/img/a-strength.webp" alt="" loading="lazy"><div class="planner__muscles" data-pl-muscles></div></div>
        <div class="planner__body">
          <h3 data-pl-title>Push day</h3>
          <p data-pl-desc></p>
          <div class="planner__meta"><span><small>Time</small><b data-pl-time></b></span><span><small>Effort</small><b data-pl-effort></b></span></div>
          <ol class="planner__list" data-pl-list></ol>
        </div>
      </div>
      <div class="planner__week">
        <div class="planner__weekhead">
          <label for="pl-days"><b>Days a week you can train</b><span><output data-pl-days for="pl-days">3</output> days</span></label>
          <input id="pl-days" type="range" min="2" max="6" value="3" step="1">
        </div>
        <div class="planner__days" data-pl-week></div>
      </div>
      <p class="fine">Example sessions for healthy adults. Warm up first, and ask a trainer to check your form. If you have an injury or a health condition, see a doctor before you start.</p>
    </div>
  </div>
</section>`;

const PLANS = [
  { id: 'standard', t: 'Standard plan', sub: 'Everything you need to train', price: [3000, 5500, 16000],
    yes: ['Strength training zone', 'Secure locker access', 'General diet plan', 'General guideline'], no: ['Crossfit zone', 'Cardio zone with electric machines'] },
  { id: 'premium', t: 'Premium plan', sub: 'Full access to every zone', price: [5000, 9500, 26000],
    yes: ['Strength training zone', 'Crossfit zone', 'Cardio zone with electric machines', 'Locker access', 'General diet plan', 'General guideline'], no: [] },
];
const DUR = [['1 month', 1], ['2 months', 2], ['6 months', 6]];
const rs = n => 'Rs ' + n.toLocaleString('en-US');
const planMsg = (p, d) => wa(`Hi Pro Fitness Studio! I want to join the ${p.t} for ${DUR[d][0]} (${rs(p.price[d])}, plus the ${rs(JOIN_FEE)} membership fee in the first month). Please confirm.`);
const JOIN_FEE = 2000;
const MEMBERSHIP = `
<section class="sec member-sec" id="membership">
  <div class="wrap">
    ${SH({ mark: 'PLANS', eyebrow: 'Membership plans', title: `Pick your <span class="hl">plan</span>`, p: 'Prices from the gym\'s own fee card. Pick a duration to compare.', row: true, side: `<div class="seg seg--dur" role="group" aria-label="Duration">${DUR.map(([n], i) => `<button type="button" data-dur="${i}" class="${i === 0 ? 'on' : ''}" aria-pressed="${i === 0}">${n}</button>`).join('')}</div>` })}
    <div class="plans" data-plans>
      ${PLANS.map(p => `<article class="plan plan--${p.id}" data-anim="up">
        <div class="plan__top">
          <span class="tag">${p.t}</span>
          <p class="plan__sub">${p.sub}</p>
          <div class="plan__price"><b data-price='${JSON.stringify(p.price)}'>${rs(p.price[0])}</b><span data-per>for 1 month</span></div>
          <p class="plan__save" data-save></p>
        </div>
        <ul class="plan__list">${p.yes.map(l => `<li>${ic('check')}${l}</li>`).join('')}${p.no.map(l => `<li class="no">${ic('x')}${l}</li>`).join('')}</ul>
        <a class="btn ${p.id === 'premium' ? 'btn--blue' : 'btn--line'} btn--block" data-join='${JSON.stringify(PLANS.indexOf(p))}' href="${planMsg(p, 0)}" target="_blank" rel="noopener">${ic('wa')}Join ${p.t.replace(' plan', '')}</a>
      </article>`).join('')}
      <aside class="plan plan--info" data-anim="up">
        <span class="eyebrow">Good to know</span>
        <div class="plan__fee"><small>Membership fee</small><b>${rs(JOIN_FEE)}</b><span>Paid in the first month only</span></div>
        <ul class="ticks">
          <li>${ic('check')}Personal training and rehab: ask us for the fee</li>
        </ul>
        <a class="link" href="${wa('Hi Pro Fitness Studio! I want to ask about personal training and rehab fees.')}" target="_blank" rel="noopener">Ask on WhatsApp ${ic('arrow')}</a>
      </aside>
    </div>
  </div>
</section>`;

const GAUGE = (() => {
  const arc = (a0, a1, R) => { const p = a => [170 + R * Math.sin(a * Math.PI / 180), 170 - R * Math.cos(a * Math.PI / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  const ang = v => -90 + (v - 12) / 28 * 180;
  return `<svg class="gauge" viewBox="0 0 340 196" aria-hidden="true">
  <path d="${arc(-90, 90, 140)}" stroke="#16191f" stroke-width="22" fill="none"/>
  ${[[12, 18.5, '#5b6475'], [18.5, 25, '#2f7cf6'], [25, 30, '#8fb9ff'], [30, 40, '#ffffff']].map(([a, b, c]) => `<path d="${arc(ang(a) + 1, ang(b) - 1, 140)}" stroke="${c}" stroke-width="16" fill="none"/>`).join('')}
  <g id="bmi-needle" class="needle" style="transform:rotate(-90deg)"><path d="M170 62 175 170h-10z" fill="#fff"/></g>
  <circle cx="170" cy="170" r="12" fill="#fff"/><circle cx="170" cy="170" r="5" fill="#2f7cf6"/>
</svg>`;
})();
const heightField = (id) => `
  <div class="field"><span class="flabel" id="${id}-hl">Height</span>
    <div class="hunit" data-hunit>
      <div class="seg seg--sm" role="group" aria-label="Height unit"><button class="on" data-u="ft" type="button" aria-pressed="true">ft / in</button><button data-u="cm" type="button" aria-pressed="false">cm</button></div>
      <div class="row" data-ft><div class="input-unit"><input class="input" id="${id}-ft" type="number" inputmode="numeric" placeholder="5" min="3" max="8" aria-labelledby="${id}-hl" aria-label="Height feet"><span>ft</span></div><div class="input-unit"><input class="input" id="${id}-in" type="number" inputmode="numeric" placeholder="8" min="0" max="11" aria-label="Height inches"><span>in</span></div></div>
      <div class="input-unit" data-cm hidden><input class="input" id="${id}-cm" type="number" inputmode="numeric" placeholder="172" min="100" max="250" aria-label="Height in centimetres"><span>cm</span></div>
    </div>
  </div>`;
const CALCS = `
<section class="sec calc-sec" id="calculators">
  <div class="wrap">
    ${SH({ mark: 'NUMBERS', eyebrow: 'Fitness calculators', title: `Know your <span class="hl">numbers</span>`, p: 'Quick estimates to start with. A trainer checks you properly when you visit.' })}
    <div class="calc">
      <div class="calc__tabs" role="tablist" aria-label="Calculator">
        <button type="button" role="tab" id="ct-bmi" aria-controls="cp-bmi" aria-selected="true">BMI</button>
        <button type="button" role="tab" id="ct-cal" aria-controls="cp-cal" aria-selected="false" tabindex="-1">Daily calories</button>
      </div>
      <div class="calc__panel bmi" id="cp-bmi" role="tabpanel" aria-labelledby="ct-bmi">
        <div class="calc__form">
          <div class="field"><label for="bmi-w">Weight</label><div class="input-unit"><input class="input" id="bmi-w" type="number" inputmode="decimal" placeholder="70" min="20" max="300"><span>kg</span></div></div>
          ${heightField('bmi')}
          <p class="fine" data-err="bmi" role="alert"></p>
          <p class="fine">BMI does not see muscle, so very muscular people can show as overweight. Not for children or pregnancy.</p>
        </div>
        <div class="calc__out" aria-live="polite">
          ${GAUGE}
          <div class="bmi__val" id="bmi-val">--</div>
          <div class="bmi__cat" id="bmi-cat">Enter your details</div>
          <p class="bmi__tip" id="bmi-tip">Your result will show here.</p>
          <a class="btn btn--blue" id="bmi-cta" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Ask for a plan</a>
        </div>
      </div>
      <div class="calc__panel" id="cp-cal" role="tabpanel" aria-labelledby="ct-cal" hidden>
        <div class="calc__form" data-cal>
          <div class="field"><span class="flabel">Sex</span><div class="seg" role="group" aria-label="Sex"><button class="on" type="button" data-sex="m" aria-pressed="true">Male</button><button type="button" data-sex="f" aria-pressed="false">Female</button></div></div>
          <div class="row2">
            <div class="field"><label for="cal-age">Age</label><div class="input-unit"><input class="input" id="cal-age" type="number" inputmode="numeric" placeholder="25" min="18" max="80"><span>years</span></div></div>
            <div class="field"><label for="cal-w">Weight</label><div class="input-unit"><input class="input" id="cal-w" type="number" inputmode="decimal" placeholder="70" min="30" max="300"><span>kg</span></div></div>
          </div>
          ${heightField('cal')}
          <div class="field"><label for="cal-act">How active are you?</label>
            <select class="input" id="cal-act">
              <option value="1.2">Little or no exercise</option>
              <option value="1.375">Light: exercise 1 to 3 days a week</option>
              <option value="1.55" selected>Moderate: exercise 3 to 5 days a week</option>
              <option value="1.725">Hard: exercise 6 to 7 days a week</option>
            </select></div>
          <p class="fine" data-err="cal" role="alert"></p>
        </div>
        <div class="calc__out calc__out--cal" aria-live="polite">
          <div class="kcal"><small>To keep your weight</small><b data-kcal="keep">--</b><span>kcal a day</span></div>
          <div class="kcal__row">
            <div class="kcal kcal--sm"><small>To lose weight</small><b data-kcal="lose">--</b><span>kcal a day</span></div>
            <div class="kcal kcal--sm"><small>To gain weight</small><b data-kcal="gain">--</b><span>kcal a day</span></div>
          </div>
          <p class="fine">Uses the Mifflin-St Jeor formula. Real needs can differ by about 10%. For adults 18 to 80, not for pregnancy or medical conditions. Lose is about 500 kcal under, gain about 300 over, never below 1,200 (women) or 1,500 (men).</p>
          <a class="btn btn--blue" data-kcal-cta href="${wa('Hi Pro Fitness Studio! I want a diet plan. Please share the details.')}" target="_blank" rel="noopener">${ic('wa')}Get a diet plan</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

/* ---------- contact ---------- */
const CONTACT = `
<section class="sec contact-sec">
  <div class="wrap contact">
    <div class="cbox" data-anim="up">
      <h2 class="h3">Send us a message</h2>
      <p class="muted">The form opens WhatsApp with your message ready. You press send, and we reply there.</p>
      <form id="join-form" novalidate>
        <div class="field"><label for="f-type">I want to</label>
          <select class="input" id="f-type" name="type"><option>Join the gym</option><option>Book a consultation</option><option>Visit the gym first</option><option>Ask about fees</option><option>Ask something else</option></select></div>
        <div class="row2">
          <div class="field"><label for="f-name">Your name</label><input class="input" id="f-name" name="name" required minlength="2" autocomplete="name" placeholder="Ali Khan" aria-describedby="e-name"><span class="ferr" id="e-name"></span></div>
          <div class="field"><label for="f-phone">Phone</label><input class="input" id="f-phone" name="phone" type="tel" required autocomplete="tel" placeholder="03xx xxxxxxx" aria-describedby="e-phone"><span class="ferr" id="e-phone"></span></div>
        </div>
        <div class="row2">
          <div class="field"><label for="f-goal">Your goal</label>
            <select class="input" id="f-goal" name="goal">${PROGRAMS.map(p => `<option>${p.t}</option>`).join('')}<option>Not sure yet</option></select></div>
          <div class="field"><label for="f-time">Preferred time</label>
            <select class="input" id="f-time" name="time"><option>Evening (4 to 8 PM)</option><option>Night (8 to 11 PM)</option><option>Ladies only (10 to 11:30 AM)</option><option>Ladies only (2 to 4 PM)</option></select></div>
        </div>
        <div class="field"><label for="f-msg">Message (optional)</label><textarea class="input" id="f-msg" name="msg" maxlength="600" placeholder="Anything we should know? Injuries, questions, best time to call."></textarea></div>
        <button class="btn btn--blue btn--block" type="submit"><span class="btn__label">${ic('wa')}Send on WhatsApp</span><span class="btn__busy" aria-hidden="true">Opening WhatsApp</span></button>
        <div class="form-ok" hidden tabindex="-1">
          <b>WhatsApp should now be open with your message.</b>
          <p>Press send in WhatsApp to reach us. Nothing is sent until you do.</p>
          <div class="form-ok__btns"><a class="btn btn--line btn--sm" data-reopen href="#" target="_blank" rel="noopener">Open WhatsApp again</a><button class="btn btn--line btn--sm" type="button" data-newmsg>Write a new message</button></div>
        </div>
      </form>
    </div>
    <div class="cside" data-anim="up">
      <div class="info">
        <a href="${WA_JOIN}" target="_blank" rel="noopener"><span class="ico">${ic('wa')}</span><span><small>WhatsApp</small><b>${PHONE}</b></span></a>
        <a href="tel:${TEL}"><span class="ico">${ic('phone')}</span><span><small>Call</small><b>${PHONE}</b></span></a>
        <a href="mailto:${EMAIL}"><span class="ico">${ic('mail')}</span><span><small>Email</small><b>${EMAIL}</b></span></a>
        <a href="${DIRECTIONS}" target="_blank" rel="noopener"><span class="ico">${ic('pin')}</span><span><small>Address</small><b>${ADDRESS}</b></span></a>
${SOCIAL.map(([k, n, h, u]) => `        <a href="${u}" target="_blank" rel="noopener" class="info__soc info__soc--${k}"><span class="ico">${ic(k)}</span><span><small>${n}</small><b>${h}</b></span></a>`).join('\n')}
        <div><span class="ico">${ic('map')}</span><span><small>Plus code</small><b>${PLUS}</b></span></div>
        <div><span class="ico">${ic('clock')}</span><span><small>Mon to Sat, Sunday closed</small><b>${HOURS_TXT}</b></span></div>
      </div>
      <div class="map"><iframe src="https://www.google.com/maps?q=${GEO}&z=17&output=embed" title="Pro Fitness Studio on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
  </div>
</section>`;

const pageHero = (eyebrow, title, lead, crumb, im) => `
<section class="phero">
  <div class="phero__bg">${img(im, '', '', true).replace('alt=""', 'alt="" aria-hidden="true"')}</div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="./">Home</a><span aria-hidden="true">/</span><span aria-current="page">${crumb}</span></nav>
    <span class="eyebrow">${eyebrow}</span>
    <h1 class="h1 phero__h">${title}</h1>
    <p class="lead">${lead}</p>
  </div>
</section>`;

/* ---------- pages ---------- */
const home = `
${HERO}
${MARQUEE}
${STATS}
${STORY()}
${PROG()}
${QUIZ}
${RESULTS}
${TRAINERS()}
${GALLERY_SEC()}
${REVIEW_SEC}
${SCHEDULE}
${FINAL_CTA}`;

const programs = `
${pageHero('Programs', 'Train with <span class="hl">purpose</span>', 'Eight programs, a workout planner, membership builder and calculators. Every program comes with guidance from a certified trainer.', 'Programs', 'c-rack')}
${PROG(true)}
${PLANNER}
${MARQUEE}
${MEMBERSHIP}
${CALCS}
${FINAL_CTA}`;

const about = `
${pageHero('About us', 'Built by <span class="hl">Mr. Pakistan</span>', 'A gym in G Block Centre, Vehari, run by a certified fitness trainer, dietitian and rehab specialist.', 'About', 'c-trophies')}
${OWNER_FEATURE}
${STORY('story')}
${TRAINERS()}
${GALLERY_SEC()}
${RESULTS}
${REVIEW_SEC}
${FINAL_CTA}`;

const contact = `
${pageHero('Contact', 'Get in <span class="hl">touch</span>', 'Join, book a consultation, or come and see the gym first. Message us on WhatsApp or just call.', 'Contact', 'c-reception')}
${CONTACT}
${SCHEDULE}`;

const privacy = `
${pageHero('Legal', 'Privacy', 'What this website does with your information. Short version: we don\'t collect it.', 'Privacy', 'c-mirrors')}
<section class="sec">
  <div class="wrap prose">
    <h2 class="h3">What we collect</h2>
    <p>Nothing is stored by this website. There are no accounts, no tracking and no advertising cookies.</p>
    <h2 class="h3">Forms and WhatsApp</h2>
    <p>The contact form, membership builder, quiz and calculators run only in your browser. When you press a WhatsApp button, WhatsApp opens with a message ready. Nothing is sent until you press send in WhatsApp yourself. After that, WhatsApp's own privacy policy applies.</p>
    <h2 class="h3">Other services this site loads</h2>
    <p>Fonts come from Google Fonts, the map on the contact page comes from Google Maps, and animation code loads from public code servers (cdnjs, unpkg and jsDelivr). These services can see your IP address when they send the files, like any website.</p>
    <h2 class="h3">Questions</h2>
    <p>Call or WhatsApp us on <a href="tel:${TEL}">${PHONE}</a>.</p>
  </div>
</section>`;

const notFound = `
<section class="nf">
  <div>
    <h1 class="h1">404</h1>
    <p class="lead">This page doesn't exist. Let's get you back on track.</p>
    <a class="btn btn--blue" href="./">Back to home</a>
  </div>
</section>`;

/* ---------- quiz and planner data for site.js ---------- */
const DATA = `<script type="application/json" id="prog-data">${JSON.stringify(PROGRAMS.map(({ id, t, d, img: im, pos }) => ({ id, t, d, img: im, pos, href: progMsg(PROGRAMS.find(p => p.id === id)) })))}</script>`;

const DESC = 'Pro Fitness Studio, G Block Centre, Vehari. Strength, weight loss, personal training, diet plans, rehab and ladies only hours with Mr. Pakistan Hasham Ahmad Siddiqui. Call or WhatsApp 0309 0503334.';
const build = [
  ['index.html', './', 'Pro Fitness Studio | Gym in Vehari', home],
  ['programs.html', 'programs', 'Programs, Membership and Workout Planner | Pro Fitness Studio Vehari', programs, false],
  ['about.html', 'about', 'About, Trainers and Gallery | Pro Fitness Studio Vehari', about, true],
  ['contact.html', 'contact', 'Contact and Schedule | Pro Fitness Studio Vehari', contact, false],
  ['privacy.html', 'privacy', 'Privacy | Pro Fitness Studio Vehari', privacy, false],
  ['404.html', '', 'Page not found | Pro Fitness Studio', notFound, false],
];
for (const [file, url, title, body] of build) {
  let html = head(title, DESC, url) + '\n' + header(url) + body + DATA + footer();
  // GitHub Pages can show the 404 page at any depth, so give it a base for its links and assets
  if (file === '404.html') html = html.replace('<head>', '<head>\n<base href="/pro-fitness-studio/">').replace(/<link rel="canonical"[^>]*>\n/, '');
  fs.writeFileSync(path.join(OUT, file), html);
  console.log('built', file);
}
fs.writeFileSync(path.join(OUT, 'assets', 'img', 'favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#050608"/><path d="M38 6 14 37h13l-5 21 28-34H36.5L44 6z" fill="#2f7cf6"/></svg>');
console.log('built favicon.svg');
