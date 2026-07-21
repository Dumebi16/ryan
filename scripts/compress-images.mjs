/**
 * Downloads all R2 images, converts to WebP, saves to scripts/optimized/
 * After running this, upload with: node scripts/upload-to-r2.mjs YOUR_BUCKET_NAME
 */
import sharp from 'sharp';
import { mkdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, 'optimized');
mkdirSync(OUT, { recursive: true });

const IMAGES = [
  {
    name:    'ryan_on_the_phone',
    url:     'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/ryan_on_the_phone.png',
    width:   1200,
    quality: 55,
  },
  {
    name:    'ryan_using_his_laptop',
    url:     'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/ryan%20using%20his%20laptop.jpg',
    width:   1200,
    quality: 72,
  },
  {
    name:    'expanded_ryan',
    url:     'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/expanded%20ryan%20.png',
    width:   1400,
    quality: 75,
  },
  {
    name:    'Ryan_Kroge-80',
    url:     'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/Ryan_Kroge-80.jpg',
    width:   1200,
    quality: 75,
  },
  {
    name:    'Ryan_Kroge-21_BW',
    url:     'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/Ryan_Kroge-21%20BW-2.jpg',
    width:   1200,
    quality: 72,
  },
  {
    name:    'Ryan_Kroge-53_BW',
    url:     'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/Ryan_Kroge-53%20BW.jpg',
    width:   1200,
    quality: 72,
  },
];

for (const img of IMAGES) {
  process.stdout.write(`Downloading ${img.name}…`);
  const res = await fetch(img.url);
  if (!res.ok) { console.log(` FAILED (${res.status})`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const originalKB = Math.round(buf.length / 1024);

  const outPath = join(OUT, `${img.name}.webp`);
  await sharp(buf)
    .resize({ width: img.width, withoutEnlargement: true })
    .webp({ quality: img.quality, effort: 6 })
    .toFile(outPath);

  const { size } = statSync(outPath);
  const saving = Math.round((1 - size / buf.length) * 100);
  console.log(` ${originalKB}KB → ${Math.round(size / 1024)}KB (−${saving}%)`);
}

console.log(`\n✓ All images saved to scripts/optimized/`);
console.log(`  Next: node scripts/upload-to-r2.mjs YOUR_R2_BUCKET_NAME`);
