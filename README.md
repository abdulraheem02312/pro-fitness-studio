# Pro Fitness Studio Website (Vehari)

Website for Pro Fitness Studio (Google Maps name: Profitness Studio), Baldia Street, G Block Centre, Vehari.

## Run

```
node server.js
```

Open http://localhost:6200. Clean URLs: /, /programs, /about, /contact (no `.html` in any link).

## Change content

Edit `source/build.js` (all text, timings, phone, programs, reviews), then run:

```
node source/build.js
```

## Files

- `public/`: the finished site (HTML pages, `assets/css/style.css`, `assets/js/site.js`, `assets/img/`)
- `source/build.js`: builds the pages with the shared header, footer and icons
- `source/make-images.js`: makes the web images from `source/maps-photos`
- `source/make-ba.js`: splits the transformations poster into before/after photos for the drag slider
- `source/maps-photos/`: the 7 photos from the gym's Google Maps listing
