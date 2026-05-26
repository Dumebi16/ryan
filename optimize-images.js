import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'photos', 'Ryan Kroge pics');

async function optimizeImages() {
  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(directoryPath, file);
        const parsedPath = path.parse(inputPath);
        const outputPath = path.join(directoryPath, `${parsedPath.name}.webp`);

        console.log(`Processing: ${file}`);

        await sharp(inputPath)
          .resize({ width: 1920, withoutEnlargement: true }) // Resize if larger than 1920px wide
          .webp({ quality: 80 }) // Convert to WebP with good quality
          .toFile(outputPath);

        console.log(`Saved optimized image: ${parsedPath.name}.webp`);
        
        // Optionally, we'll delete the original later manually or here
        // fs.unlinkSync(inputPath); 
      }
    }
    console.log('All images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
