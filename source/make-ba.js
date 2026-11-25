/* Splits each before/after pair from the transformations poster into two photos for the drag slider.
   Run: node source/make-ba.js */
const path = require('path');
const sharp = require('D:/CLAUDE PROJECTS/Tools/bg-remover/node_modules/sharp');
sharp.cache(false);
const SRC = path.join(__dirname, 'maps-photos', 'photo-6.png'), OUT = path.join(__dirname, '..', 'public', 'assets', 'img');
// [before x0, before x1, after x0, after x1, top, height] in poster pixels
const PAIRS = [
  [74, 424, 432, 778, 468, 706],
  [844, 1252, 1264, 1538, 474, 700],
  [1604, 2002, 2010, 2310, 474, 700],
  [72, 418, 424, 782, 1216, 736],
  [812, 1186, 1194, 1568, 1216, 736],
  [1602, 1958, 1964, 2328, 1216, 736],
];
(async () => {
  for (let i = 0; i < PAIRS.length; i++) {
    const [b0, b1, a0, a1, top, h] = PAIRS[i];
    for (const [tag, x0, x1] of [['before', b0, b1], ['after', a0, a1]]) {
      // pair 6 'after' is a collage: use only its top photo
      const hh = i === 5 && tag === 'after' ? 380 : h;
      const f = path.join(OUT, `ba-${i + 1}-${tag}.webp`);
      await sharp(SRC).extract({ left: x0, top, width: x1 - x0, height: hh })
        .resize(480, 600, { fit: 'cover', position: 'top' }).webp({ quality: 84 }).toFile(f);
    }
    console.log('pair', i + 1);
  }
  // pair 5 had another brand's tag in the corner of the "before" photo: blur it
  const f = path.join(OUT, 'ba-5-before.webp');
  const patch = await sharp(f).extract({ left: 0, top: 0, width: 330, height: 80 }).blur(14).toBuffer();
  require('fs').writeFileSync(f, await sharp(f).composite([{ input: patch, left: 0, top: 0 }]).webp({ quality: 84 }).toBuffer());
  // contact sheet for checking
  const ims = [];
  for (let i = 1; i <= 6; i++) for (const t of ['before', 'after']) ims.push(await sharp(path.join(OUT, `ba-${i}-${t}.webp`)).resize(160, 200).png().toBuffer());
  await sharp({ create: { width: 160 * 6, height: 400, channels: 3, background: '#000' } })
    .composite(ims.map((b, k) => ({ input: b, left: (k % 6) * 160, top: Math.floor(k / 6) * 200 }))).png().toFile(path.join(__dirname, 'ba-sheet.png'));
  console.log('sheet done');
})();
