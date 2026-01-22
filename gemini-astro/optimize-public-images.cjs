const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicImgDir = path.join(__dirname, 'public', 'img');

async function optimizePublicImages() {
  console.log('🖼️  Optimizing public images...\n');
  
  const files = fs.readdirSync(publicImgDir);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(publicImgDir, file);
    const outputPath = path.join(publicImgDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    
    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${file} (WebP exists)`);
      continue;
    }
    
    const originalStats = fs.statSync(inputPath);
    totalOriginalSize += originalStats.size;
    
    try {
      await sharp(inputPath)
        .resize(1920, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const optimizedStats = fs.statSync(outputPath);
      totalOptimizedSize += optimizedStats.size;
      
      const savings = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
      const sizeMB = (originalStats.size / 1024 / 1024).toFixed(2);
      const newSizeMB = (optimizedStats.size / 1024 / 1024).toFixed(2);
      
      console.log(`✅ ${file}: ${sizeMB} MB → ${newSizeMB} MB (${savings}% smaller)`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  console.log(`\n🎉 Done!`);
  console.log(`📊 Total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB → ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Saved: ${totalSavings}% (${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)} MB)\n`);
}

optimizePublicImages().catch(console.error);
