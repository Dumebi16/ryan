import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImage = '/Users/hughanetoh/.gemini/antigravity-ide/brain/ac6f3ab3-d430-402e-9a92-4cdc3f4a97f8/media__1784640893191.png';
const publicDir = path.resolve('public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateFavicons() {
  console.log('Generating favicons from:', sourceImage);

  // 1. favicon.ico (using 32x32 PNG container or 32x32 ico)
  await sharp(sourceImage)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .toFile(path.join(publicDir, 'favicon.ico'));

  // 2. favicon-96x96.png
  await sharp(sourceImage)
    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .toFile(path.join(publicDir, 'favicon-96x96.png'));

  // 3. apple-touch-icon.png (180x180)
  await sharp(sourceImage)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 4. web-app-manifest-192x192.png
  await sharp(sourceImage)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .toFile(path.join(publicDir, 'web-app-manifest-192x192.png'));

  // 5. web-app-manifest-512x512.png
  await sharp(sourceImage)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .toFile(path.join(publicDir, 'web-app-manifest-512x512.png'));

  // 6. site.webmanifest
  const manifest = {
    name: "Ryan Kroge | SBA Loan Specialist",
    short_name: "Ryan Kroge",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    theme_color: "#000000",
    background_color: "#000000",
    display: "standalone"
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('Favicons and site.webmanifest generated successfully in public/');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
