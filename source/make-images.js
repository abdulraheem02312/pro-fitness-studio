/* Prepares web images from the Google Maps photos in source/maps-photos. Run: node source/make-images.js */
const path = require('path');
const sharp = require('D:/CLAUDE PROJECTS/Tools/bg-remover/node_modules/sharp');
sharp.cache(false);
const SRC = path.join(__dirname, 'maps-photos'), OUT = path.join(__dirname, '..', 'public', 'assets', 'img');

const jobs = [
  // gym floor with the hexagon lights (hero)
  { in: 'photo-3.jpg', out: 'gym-floor.webp', w: 2200 },
  { in: 'photo-3.jpg', out: 'gym-floor-sm.webp', w: 900 },
  { in: 'photo-1.jpg', out: 'gym-machines.webp', w: 1600 },
  { in: 'photo-2.jpg', out: 'gym-reception.webp', w: 1600 },
  // transformations collage from their own poster
  // owner, cropped from the "Mr. Pakistan" poster
  { in: 'photo-7.png', out: 'owner.webp', extract: { left: 1400, top: 400, width: 600, height: 1190 }, w: 600 },
  // the 6 before/after pairs, cut out of the transformations poster (no poster logo or phone number)
  { in: 'photo-6.png', out: 'tf-1.webp', extract: { left: 74, top: 468, width: 704, height: 706 }, w: 760 },
  { in: 'photo-6.png', out: 'tf-2.webp', extract: { left: 842, top: 474, width: 696, height: 700 }, w: 760 },
  { in: 'photo-6.png', out: 'tf-3.webp', extract: { left: 1602, top: 474, width: 708, height: 700 }, w: 760 },
  { in: 'photo-6.png', out: 'tf-4.webp', extract: { left: 72, top: 1216, width: 710, height: 736 }, w: 760 },
  { in: 'photo-6.png', out: 'tf-5.webp', extract: { left: 812, top: 1216, width: 756, height: 736 }, w: 760 },
  { in: 'photo-6.png', out: 'tf-6.webp', extract: { left: 1602, top: 1216, width: 726, height: 736 }, w: 760 },
  // logo square for social preview
  { in: 'photo-5.png', out: 'logo-card.webp', w: 1000 },
];

(async () => {
  for (const j of jobs) {
    let p = sharp(path.join(SRC, j.in));
    if (j.extract) p = p.extract(j.extract);
    await p.resize({ width: j.w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, j.out));
    const m = await sharp(path.join(OUT, j.out)).metadata();
    console.log(j.out, m.width + 'x' + m.height);
  }
  // tf-5 has another brand's "H&H fitness" tag in the top-left corner: blur it out
  {
    const f = path.join(OUT, 'tf-5.webp');
    const box = { left: 0, top: 0, width: 260, height: 70 };
    const patch = await sharp(f).extract(box).blur(14).toBuffer();
    const buf = await sharp(f).composite([{ input: patch, left: 0, top: 0 }]).webp({ quality: 82 }).toBuffer();
    require('fs').writeFileSync(f, buf);
    console.log('tf-5.webp tag blurred');
  }
  // social share image 1200x630 from the gym floor
  await sharp(path.join(SRC, 'photo-3.jpg')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(path.join(OUT, 'og.jpg'));
  console.log('og.jpg 1200x630');
})();
