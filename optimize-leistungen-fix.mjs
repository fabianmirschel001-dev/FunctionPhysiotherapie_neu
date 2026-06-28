import sharp from 'sharp';
import { stat } from 'fs/promises';

// Card aspect-ratio: 3/4 → target canvas 750×1000
// background: var(--white) = #ffffff
const W = 750;
const H = 1000;
const BG = '#ffffff';
const PAD = 0.88; // image fills 88% of canvas → uniform breathing room

const JOBS = [
  { src: 'source-images/Krankengymnastik.jpg', out: 'images/leistung-krankengymnastik.webp', label: 'Krankengymnastik' },
  { src: 'source-images/KG-Geräte.jpg',        out: 'images/leistung-kgg.webp',               label: 'KG-Geräte (KGG)'  },
  { src: 'source-images/KG-ZNS.jpg',           out: 'images/leistung-kg-zns.webp',            label: 'KG-ZNS'            },
];

for (const { src, out, label } of JOBS) {
  // Inner canvas dimensions (padded area)
  const innerW = Math.round(W * PAD);
  const innerH = Math.round(H * PAD);

  // Step 1: resize image to fit inside padded inner area (maintains aspect ratio)
  const { data, info } = await sharp(src)
    .resize({ width: innerW, height: innerH, fit: 'inside', withoutEnlargement: false })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Step 2: center on W×H canvas with background colour
  const padTop    = Math.round((H - info.height) / 2);
  const padBottom = H - info.height - padTop;
  const padLeft   = Math.round((W - info.width)  / 2);
  const padRight  = W - info.width  - padLeft;

  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .extend({ top: padTop, bottom: padBottom, left: padLeft, right: padRight,
              background: BG })
    .webp({ quality: 80 })
    .toFile(out);

  const { size } = await stat(out);
  console.log(`✓ ${label}: image ${info.width}x${info.height} → canvas ${W}x${H}, ${(size/1024).toFixed(1)} KB`);
  console.log(`  padding  T:${padTop} B:${padBottom} L:${padLeft} R:${padRight}`);
}
