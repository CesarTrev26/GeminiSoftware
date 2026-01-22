const sharp = require('sharp');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const publicImgDir = path.join(__dirname, 'public', 'img');

const RESPONSIVE_SIZES = [
  { width: 400, suffix: '-sm' },
  { width: 800, suffix: '-md' },
  { width: 1200, suffix: '-lg' }
];

async function generateResponsiveVersions(imagePath) {
  const ext = path.extname(imagePath);
  const nameWithoutExt = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);
  
  console.log(`\n📸 Processing: ${nameWithoutExt}${ext}`);
  
  try {
    const metadata = await sharp(imagePath).metadata();
    const originalWidth = metadata.width;
    
    for (const size of RESPONSIVE_SIZES) {
      // Skip if image is already smaller than target size
      if (originalWidth && originalWidth < size.width) {
        console.log(`   ⏭️  Skipping ${size.suffix} (${size.width}px) - image is only ${originalWidth}px wide`);
        continue;
      }
      
      const outputFilename = `${nameWithoutExt}${size.suffix}.webp`;
      const outputPath = path.join(dir, outputFilename);
      
      // Skip if already exists
      if (fsSync.existsSync(outputPath)) {
        console.log(`   ✓  ${outputFilename} already exists`);
        continue;
      }
      
      await sharp(imagePath)
        .resize(size.width, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const stats = await fs.stat(outputPath);
      console.log(`   ✓  Generated ${outputFilename} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function processDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      const hasResponsiveSuffix = /-sm\.webp$|-md\.webp$|-lg\.webp$/.test(entry.name);
      
      // Process WebP images that don't have responsive suffixes
      if (ext === '.webp' && !hasResponsiveSuffix) {
        await generateResponsiveVersions(fullPath);
      }
    }
  }
}

async function main() {
  console.log('🔄 Generating responsive versions for public images...\n');
  console.log('━'.repeat(60));
  
  if (!fsSync.existsSync(publicImgDir)) {
    console.error('❌ public/img directory not found');
    return;
  }
  
  await processDirectory(publicImgDir);
  
  console.log('\n' + '━'.repeat(60));
  console.log('\n✅ Responsive image generation complete!\n');
}

main().catch(console.error);
