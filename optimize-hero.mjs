import sharp from 'sharp';
import { stat } from 'fs/promises';

const SRC = 'source-images/hero.jpg';

async function build(outPath, width, quality) {
  await sharp(SRC)
    .resize({ width, withoutEnlargement: true })
    .withMetadata(false)
    .webp({ quality })
    .toFile(outPath);
  const { size } = await stat(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`${outPath}: ${meta.width}x${meta.height}, ${(size / 1024).toFixed(0)} KB (q${quality})`);
  return size;
}

const { size: srcSize } = await stat(SRC);
console.log(`Source: ${(srcSize / 1024 / 1024).toFixed(1)} MB\n`);

// Desktop: max 2560px, target ≤ 450 KB
let deskSize = await build('images/hero-desktop.webp', 2560, 82);
for (let q = 79; deskSize > 450 * 1024 && q >= 70; q -= 3) {
  console.log(`  hero-desktop.webp > 450 KB – retrying at q${q}…`);
  deskSize = await build('images/hero-desktop.webp', 2560, q);
}

// Mobile: max 1400px, target ≤ 250 KB
let mobSize = await build('images/hero-mobile.webp', 1400, 80);
for (let q = 77; mobSize > 250 * 1024 && q >= 70; q -= 3) {
  console.log(`  hero-mobile.webp > 250 KB – retrying at q${q}…`);
  mobSize = await build('images/hero-mobile.webp', 1400, q);
}

console.log(`\nFinal sizes:`);
console.log(`  hero-desktop.webp: ${(deskSize / 1024).toFixed(0)} KB`);
console.log(`  hero-mobile.webp:  ${(mobSize / 1024).toFixed(0)} KB`);
console.log(`  Original: ${(srcSize / 1024 / 1024).toFixed(1)} MB → saved ${((1 - (deskSize + mobSize) / srcSize) * 100).toFixed(0)}%`);
