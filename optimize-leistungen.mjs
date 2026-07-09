import sharp from 'sharp';
import { stat } from 'fs/promises';

const JOBS = [
  { src: 'source-images/MT_Leistungen_2.jpg',    out: 'images/leistung-manuelle-therapie.webp' },
  { src: 'source-images/Krankengymnastik.jpg',    out: 'images/leistung-krankengymnastik.webp'  },
  { src: 'source-images/KG-Geräte.jpg',           out: 'images/leistung-kgg.webp'               },
  { src: 'source-images/KG-ZNS.jpg',              out: 'images/leistung-kg-zns.webp'            },
  { src: 'source-images/MLD.jpg',                 out: 'images/leistung-mld.webp'               },
  { src: 'source-images/Personal_Training.jpg',   out: 'images/leistung-personal-training.webp' },
];

async function build(src, outPath, quality) {
  await sharp(src)
    .resize({ width: 800, withoutEnlargement: true })
    .withMetadata(false)
    .webp({ quality })
    .toFile(outPath);
  const { size } = await stat(outPath);
  const meta = await sharp(outPath).metadata();
  return { size, meta };
}

console.log('Optimising 6 Leistungs-Fotos…\n');
const results = [];

for (const { src, out } of JOBS) {
  let q = 80;
  let { size, meta } = await build(src, out, q);

  while (size > 150 * 1024 && q > 70) {
    q -= 3;
    console.log(`  ${out} > 150 KB – retrying at q${q}…`);
    ({ size, meta } = await build(src, out, q));
  }

  results.push({ out, size, meta, q });
  console.log(`✓ ${out}: ${meta.width}x${meta.height}, ${(size / 1024).toFixed(1)} KB (q${q})`);
}

console.log('\nFinal sizes:');
for (const { out, size } of results) {
  console.log(`  ${out.split('/').pop()}: ${(size / 1024).toFixed(1)} KB`);
}
