/* Cuts the real gym photos (source/maps-photos) into program and facility images, in two sizes.
   Run: node source/make-crops.js   (uses sharp from the bg-remover tool folder) */
const path = require('path');
const sharp = require('D:/CLAUDE PROJECTS/Tools/bg-remover/node_modules/sharp');
const SRC = path.join(__dirname, 'maps-photos');
const OUT = path.join(__dirname, '..', 'public', 'assets', 'img');

// [name, source photo, left, top, width, height] in the 2400x1800 photos
const CROPS = [
  ['c-rack', 'photo-3.jpg', 520, 1180, 1140, 620],      // dumbbell rack and benches
  ['c-floor', 'photo-1.jpg', 620, 640, 1060, 720],       // members training on the floor
  ['c-mirrors', 'photo-3.jpg', 760, 640, 1100, 760],     // TV, mirrors and the back wall
  ['c-bench', 'photo-1.jpg', 0, 1000, 1000, 800],        // benches and dumbbells
  ['c-backext', 'photo-1.jpg', 980, 1100, 900, 700],     // back extension and leg machine
  ['c-reception', 'photo-2.jpg', 380, 760, 1300, 900],   // reception and seating
  ['c-trophies', 'photo-2.jpg', 1180, 600, 860, 860],    // trophy wall
  ['c-hex', 'photo-3.jpg', 1300, 300, 1100, 640],        // hexagon ceiling lights
  ['c-machines', 'photo-3.jpg', 0, 1050, 900, 750],      // machines on the left
  ['c-wide', 'photo-3.jpg', 0, 300, 2400, 1500],         // whole floor
];

(async () => {
  for (const [name, file, left, top, width, height] of CROPS) {
    const base = sharp(path.join(SRC, file)).extract({ left, top, width, height });
    const buf = await base.toBuffer();
    for (const [suffix, w] of [['', 1400], ['-sm', 720]]) {
      await sharp(buf).resize({ width: Math.min(w, width) }).modulate({ saturation: 0.92 })
        .webp({ quality: suffix ? 70 : 74 }).toFile(path.join(OUT, `${name}${suffix}.webp`));
    }
    console.log('made', name);
  }
})();
