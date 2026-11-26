/* Cuts every before/after photo from the hi-res transformations poster (4086 px), full body, no forced crop.
   Coordinates are in 2000 px poster units. Run: node source/make-ba2.js */
const path = require('path');
const sharp = require('D:/CLAUDE PROJECTS/Tools/bg-remover/node_modules/sharp');
const SRC = path.join(__dirname, 'maps-photos', 'transformations-hires.png');
const OUT = path.join(__dirname, '..', 'public', 'assets', 'img');
const K = 4086 / 2000;
// [member, [before x0, x1], [after x0, x1], y0, y1]
const PAIRS = [
  [1, [66, 362], [372, 631], 394, 976],
  [2, [712, 1039], [1057, 1274], 407, 968],
  [3, [1333, 1673], [1685, 1922], 400, 976],
  [4, [60, 348], [354, 651], 1034, 1624],
  [5, [680, 991], [997, 1298], 1020, 1624],
  [6, [1332, 1633], [1639, 1938], 1020, 1624],
];
(async () => {
  for (const [i, b, a, y0, y1] of PAIRS) {
    for (const [side, [x0, x1]] of [['before', b], ['after', a]]) {
      const ex = { left: Math.round(x0 * K), top: Math.round(y0 * K), width: Math.round((x1 - x0) * K), height: Math.round((y1 - y0) * K) };
      const buf = await sharp(SRC).extract(ex).toBuffer();
      await sharp(buf).resize({ height: 1100, withoutEnlargement: true }).sharpen({ sigma: .5 }).webp({ quality: 82 }).toFile(path.join(OUT, `ba-${i}-${side}.webp`));
      const m = await sharp(path.join(OUT, `ba-${i}-${side}.webp`)).metadata();
      console.log(`ba-${i}-${side}`, m.width + 'x' + m.height);
    }
  }
})();
