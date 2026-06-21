import sharp from 'sharp';
import { stat } from 'fs/promises';

const src = 'source-images/hero-original.jpg';

async function build(outPath, width, quality) {
  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outPath);
  const { size } = await stat(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`${outPath}: ${meta.width}x${meta.height}, ${(size/1024).toFixed(0)} KB (quality ${quality})`);
  return size;
}

const desktopSize = await build('images/hero.webp', 2560, 80);
if (desktopSize > 400 * 1024) {
  console.log('hero.webp > 400 KB – retrying at quality 75…');
  await build('images/hero.webp', 2560, 75);
}

await build('images/hero-mobile.webp', 1280, 80);

const { size: srcSize } = await stat(src);
console.log(`\nOriginal: ${(srcSize/1024/1024).toFixed(1)} MB`);
