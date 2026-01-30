const sharp = require('sharp');
const path = require('path');

const optimizeLogo = async () => {
  const logoPath = path.join(__dirname, 'public', 'img', 'white-logo.webp');
  
  console.log('Optimizing white-logo.webp...');
  
  // Get original size
  const originalStats = require('fs').statSync(logoPath);
  console.log(`Original size: ${(originalStats.size / 1024).toFixed(1)} KB`);
  
  // Optimize with lower quality but still good visual result
  await sharp(logoPath)
    .resize(350, null, { // Max width 350px (covers mobile + desktop with 2x DPI)
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({
      quality: 70, // Lower quality for smaller size
      effort: 6 // Higher effort for better compression
    })
    .toFile(logoPath + '.optimized');
  
  console.log('✓ Optimized file created: white-logo.webp.optimized');
  console.log('Please manually replace white-logo.webp with this file when dev server is stopped.');
  
  // Get new size
  const newStats = require('fs').statSync(logoPath + '.optimized');
  console.log(`Optimized size: ${(newStats.size / 1024).toFixed(1)} KB`);
  console.log(`Optimized size: ${(newStats.size / 1024).toFixed(1)} KB`);
  console.log(`Saved: ${((originalStats.size - newStats.size) / 1024).toFixed(1)} KB`);
};

optimizeLogo().catch(console.error);
