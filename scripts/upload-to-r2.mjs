/**
 * Uploads optimized WebP images to R2 with long-lived cache headers.
 *
 * Prerequisites:
 *   npx wrangler login   (one-time, opens browser)
 *
 * Usage:
 *   node scripts/upload-to-r2.mjs YOUR_BUCKET_NAME
 *
 * Your bucket name is visible in: Cloudflare Dashboard → R2 → Object Storage
 */
import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const bucket = process.argv[2];
if (!bucket) {
  console.error('Usage: node scripts/upload-to-r2.mjs YOUR_BUCKET_NAME');
  process.exit(1);
}

const __dir  = dirname(fileURLToPath(import.meta.url));
const OPT    = join(__dir, 'optimized');
const files  = readdirSync(OPT).filter(f => f.endsWith('.webp'));

for (const file of files) {
  const localPath = join(OPT, file);
  const r2Key     = file; // uploads to root of bucket

  process.stdout.write(`Uploading ${file}…`);
  execSync(
    `npx wrangler r2 object put "${bucket}/${r2Key}" ` +
    `--file "${localPath}" ` +
    `--content-type "image/webp" ` +
    `--cache-control "public, max-age=31536000, immutable"`,
    { stdio: 'pipe' }
  );
  console.log(' ✓');
}

console.log(`\n✓ All WebP images uploaded to R2 bucket "${bucket}" with 1-year cache headers.`);
console.log(`  URLs will be: https://pub-b1a4206ab34045348c40722678aec845.r2.dev/<filename>.webp`);
