import sharp from 'sharp';
import { stat } from 'fs/promises';

async function build(src, outPath, opts = {}) {
  const { width = 500, palette = true } = opts;
  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .png({ palette, colors: 256 })
    .toFile(outPath);
  const { size } = await stat(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`${outPath}: ${meta.width}x${meta.height}, ${(size / 1024).toFixed(1)} KB`);
}

async function buildFavicon(src, outPath, size) {
  await sharp(src)
    .resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ palette: true, colors: 256 })
    .toFile(outPath);
  const { size: fileSize } = await stat(outPath);
  console.log(`${outPath}: ${size}x${size}, ${(fileSize / 1024).toFixed(1)} KB`);
}

// Optimized logos (max 500px wide)
await build('source-images/Logo-farbig.png', 'images/logo-farbig.png');
await build('source-images/Logo-schwarz.png', 'images/logo-schwarz.png');
await build('source-images/Logo-weiß.png', 'images/logo-weiss.png');

// Favicons from colored logo
await buildFavicon('source-images/Logo-farbig.png', 'images/favicon-32.png', 32);
await buildFavicon('source-images/Logo-farbig.png', 'images/apple-touch-icon.png', 180);

console.log('\nDone.');
