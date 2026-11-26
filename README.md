# Pro Fitness Studio Website (Vehari)

Website for Pro Fitness Studio (Google Maps name: Profitness Studio), Baldia Street, G Block Centre, Vehari.

## Run

```
node server.js
```

Open http://localhost:6200. Clean URLs: /, /programs, /about, /contact, /privacy (no `.html` in any link).

## Change content

Edit `source/build.js` (all text, timings, phone, programs, trainers, reviews, results), then run:

```
node source/build.js
```

Quiz questions and scoring, and the workout planner sessions, live in `public/assets/js/site.js` (search for `const Q =` and `const PLAN =`).

## Deploy (GitHub Pages)

```
node source/build.js
git add -A
git commit -m "..."
git push
git subtree push --prefix public origin gh-pages
```

## Files

- `public/`: the finished site (HTML pages, `assets/css/style.css`, `assets/js/site.js`, `assets/img/`, `assets/video/`)
- `public/assets/js/site.js`: nav and dropdowns, open-now status, reveals, counters, programs tabs, fitness quiz, results slider, gallery and viewer, reviews, schedule, workout planner, membership builder, BMI and calorie calculators, contact form
- `public/assets/video/`: hero background videos made in Google Flow, muted, with a 1 second dissolve so the loop has no jump. `hero-wide.mp4` (16:9) plays on desktop and landscape screens, `hero-tall.mp4` (9:16) on phones and portrait tablets. The `.webp` files are the still images shown while loading and to people who turn motion off, built with Three.js from code (no model files). Loads from jsDelivr; without WebGL the page falls back to its static layout
- `source/build.js`: builds every page with the shared header, footer and icons
- `source/make-crops.js`: cuts the real gym photos into program and gallery images (`c-*.webp`, two sizes)
- `source/make-images.js`: makes the earlier web images from `source/maps-photos`
- `source/make-ba.js`: splits the transformations poster into before/after photos for the drag slider
- `source/maps-photos/`: the photos from the gym's Google Maps listing (not in git)

## Images

- `c-*.webp`: real photos of the gym (Google Maps listing and the owner's WhatsApp photos). Only these are used in the gallery and story.
- `a-*.webp`: AI images made in ChatGPT (originals in `source/ai-images/`, not in git). Used only on program cards, the workout planner and quiz results, never as photos of the gym.
- `ba-*.webp` / `tf-*.webp`: real member transformations, cut from the gym's poster. Never edited with AI.

Fees come from the gym's printed fee card (Nov 2026): membership fee Rs 2,000 in the first month; Standard 3,000 / 5,500 / 16,000 and Premium 5,000 / 9,500 / 26,000 for 1 / 2 / 6 months. They live in `PLANS` in `source/build.js`.

`public/showcase.html` (/showcase) shows the site on five device sizes at once. It is in `.gitignore`, so it never goes live.

## Not on the site yet (needs the gym)

- Class timetable (there are no set classes, so the schedule shows the real open hours)
- A photo of the female trainer, and confirmation of her name spelling
- Personal training and rehab fees
- Higher resolution originals of the transformation photos
