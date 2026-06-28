import sharp from 'sharp';
import { stat } from 'fs/promises';

const SRC = 'source-images/Konzept.jpg';
const OUT = 'images/konzept.webp';

const { size: srcSize } = await stat(SRC);
console.log(`Source: ${(srcSize / 1024 / 1024).toFixed(1)} MB\n`);

async function build(quality) {
  // Portrait → limit by height
  await sharp(SRC)
    .resize({ height: 1200, withoutEnlargement: true })
    .withMetadata(false)
    .webp({ quality })
    .toFile(OUT);
  const { size } = await stat(OUT);
  const meta = await sharp(OUT).metadata();
  console.log(`${OUT}: ${meta.width}x${meta.height}, ${(size / 1024).toFixed(1)} KB (q${quality})`);
  return size;
}

let size = await build(82);
for (let q = 79; size > 200 * 1024 && q >= 72; q -= 3) {
  console.log(`  > 200 KB – retrying at q${q}…`);
  size = await build(q);
}

console.log(`\nFinal: ${(size / 1024).toFixed(1)} KB  (source was ${(srcSize / 1024 / 1024).toFixed(1)} MB)`);
