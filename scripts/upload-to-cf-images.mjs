/**
 * Upload R2 images to Cloudflare Images and print the new delivery URLs.
 *
 * Prerequisites:
 *   1. npm install node-fetch (or Node 18+ — fetch is built in)
 *   2. Set env vars:
 *        CF_ACCOUNT_ID   — your Cloudflare account ID (Dashboard → top-right)
 *        CF_API_TOKEN    — API token with "Cloudflare Images: Edit" permission
 *
 * Run:
 *   CF_ACCOUNT_ID=xxx CF_API_TOKEN=yyy node scripts/upload-to-cf-images.mjs
 */

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const API_TOKEN  = process.env.CF_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('Set CF_ACCOUNT_ID and CF_API_TOKEN environment variables.');
  process.exit(1);
}

const IMAGES = [
  {
    id:  'ryan_on_the_phone',
    url: 'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/ryan_on_the_phone.png',
    note: 'LCP hero — home page',
  },
  {
    id:  'ryan_using_his_laptop',
    url: 'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/ryan%20using%20his%20laptop.jpg',
    note: 'Secondary hero — home page',
  },
  {
    id:  'expanded_ryan',
    url: 'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/expanded%20ryan%20.png',
    note: 'Hero — Business Acquisition & Strategic Guidance',
  },
  {
    id:  'ryan_kroge_80',
    url: 'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/Ryan_Kroge-80.jpg',
    note: 'Hero fade — Business Acquisition',
  },
  {
    id:  'ryan_kroge_21_bw',
    url: 'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/Ryan_Kroge-21%20BW-2.jpg',
    note: 'Split screen — Strategic Guidance',
  },
  {
    id:  'ryan_kroge_53_bw',
    url: 'https://pub-b1a4206ab34045348c40722678aec845.r2.dev/Ryan_Kroge-53%20BW.jpg',
    note: 'Mission section — Strategic Guidance',
  },
];

async function uploadImage({ id, url, note }) {
  const body = new FormData();
  body.append('url', url);
  body.append('id', id);

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      body,
    }
  );

  const data = await res.json();

  if (!data.success) {
    // If image already exists, skip gracefully
    const alreadyExists = data.errors?.some(e => e.code === 5409);
    if (alreadyExists) {
      console.log(`⚠️  ${id} — already uploaded, skipping`);
      return { id, skipped: true };
    }
    console.error(`✗  ${id} — upload failed:`, data.errors);
    return { id, error: data.errors };
  }

  const deliveryUrl = data.result.variants[0];
  console.log(`✓  ${id} (${note})`);
  console.log(`   delivery: ${deliveryUrl}\n`);
  return { id, deliveryUrl };
}

console.log('Uploading images to Cloudflare Images…\n');

const results = [];
for (const img of IMAGES) {
  results.push(await uploadImage(img));
}

console.log('\n─────────────────────────────────────────────');
console.log('Copy these into your source code:\n');

for (const r of results) {
  if (r.deliveryUrl) {
    // Strip the trailing variant slug so you can append /public, /w=800, etc.
    const base = r.deliveryUrl.replace(/\/[^/]+$/, '');
    console.log(`${r.id}:`);
    console.log(`  ${base}/public          ← default (auto WebP/AVIF, cached)`);
    console.log(`  ${base}/w=1200          ← 1200px wide variant (if configured)`);
  }
}

console.log('\nOnce done, update the image URLs in:');
console.log('  src/pages/Home.tsx                    (ryan_on_the_phone, ryan_using_his_laptop)');
console.log('  src/pages/BusinessAcquisition.tsx     (expanded_ryan, ryan_kroge_80)');
console.log('  src/pages/StrategicFinancialGuidance.tsx (expanded_ryan, ryan_kroge_21_bw, ryan_kroge_53_bw)');
console.log('  index.html                            (<link rel="preload"> for LCP image)');
console.log('  src/components/SEO.tsx                (expanded_ryan OG image)');
