const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function resizePublicImages() {
  console.log('📐 Resizing public images to appropriate dimensions...\n');
  
  const imgDir = path.join(__dirname, 'public', 'img');
  
  // Resize Laptop-full.webp to 900px width (displayed at ~424px, 900px covers 2x DPI)
  const laptopPath = path.join(imgDir, 'Laptop-full.webp');
  const laptopStats = await fs.stat(laptopPath);
  console.log(`Laptop-full.webp: ${(laptopStats.size / 1024).toFixed(1)} KB`);
  
  await sharp(laptopPath)
    .resize(900, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(imgDir, 'Laptop-full-new.webp'));
  
  const newStats = await fs.stat(path.join(imgDir, 'Laptop-full-new.webp'));
  console.log(`  → Resized to 900px: ${(newStats.size / 1024).toFixed(1)} KB (${((laptopStats.size - newStats.size) / laptopStats.size * 100).toFixed(1)}% saved)\n`);
  
  await fs.unlink(laptopPath);
  await fs.rename(path.join(imgDir, 'Laptop-full-new.webp'), laptopPath);
  
  // Resize white-logo.webp to 350px width (displayed at ~160px, 350px covers 2x DPI)
  const logoPath = path.join(imgDir, 'white-logo.webp');
  const logoStats = await fs.stat(logoPath);
  console.log(`white-logo.webp: ${(logoStats.size / 1024).toFixed(1)} KB`);
  
  await sharp(logoPath)
    .resize(350, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(imgDir, 'white-logo-new.webp'));
  
  const newLogoStats = await fs.stat(path.join(imgDir, 'white-logo-new.webp'));
  console.log(`  → Resized to 350px: ${(newLogoStats.size / 1024).toFixed(1)} KB (${((logoStats.size - newLogoStats.size) / logoStats.size * 100).toFixed(1)}% saved)\n`);
  
  await fs.unlink(logoPath);
  await fs.rename(path.join(imgDir, 'white-logo-new.webp'), logoPath);
  
  console.log('✅ Public images resized!');
}

resizePublicImages().catch(console.error);
