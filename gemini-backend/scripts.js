/**
 * Gemini Backend Utility Scripts
 * 
 * Usage: node scripts.js [command]
 * 
 * Available commands:
 *   optimize-images    - Convert PNG images to WebP (uploads/projects folder)
 *   update-db-images   - Update database to use WebP URLs for project images
 *   check-projects     - Display all projects and their image information
 *   check-services     - Display all services
 *   help               - Show this help message
 */

const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// ============================================
// OPTIMIZE IMAGES: Convert PNG to WebP
// ============================================
async function optimizeImages() {
  console.log('🖼️  Optimizing Images: PNG → WebP\n');
  console.log('━'.repeat(60));
  
  const projectsDir = path.join(__dirname, 'uploads', 'projects');
  
  if (!fsSync.existsSync(projectsDir)) {
    console.log('❌ uploads/projects directory not found');
    return;
  }
  
  const files = await fs.readdir(projectsDir);
  const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
  
  if (pngFiles.length === 0) {
    console.log('✅ No PNG files found - all images already optimized!');
    return;
  }
  
  console.log(`Found ${pngFiles.length} PNG files to optimize\n`);
  
  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let converted = 0;
  
  for (const file of pngFiles) {
    const inputPath = path.join(projectsDir, file);
    const outputPath = path.join(projectsDir, file.replace('.png', '.webp'));
    
    // Skip if WebP already exists
    if (fsSync.existsSync(outputPath)) {
      continue;
    }
    
    try {
      const stats = await fs.stat(inputPath);
      const originalSize = stats.size;
      
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const webpStats = await fs.stat(outputPath);
      const webpSize = webpStats.size;
      const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
      
      totalOriginalSize += originalSize;
      totalWebpSize += webpSize;
      converted++;
      
      console.log(`✓ ${file}`);
      console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(webpSize / 1024 / 1024).toFixed(2)} MB (${savings}% savings)\n`);
      
    } catch (error) {
      console.error(`✗ Failed to convert ${file}:`, error.message);
    }
  }
  
  if (converted > 0) {
    const totalSavings = ((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(1);
    console.log('━'.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   Converted: ${converted} files`);
    console.log(`   Original:  ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP:      ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Saved:     ${(totalSavings)}% (${((totalOriginalSize - totalWebpSize) / 1024 / 1024).toFixed(2)} MB)\n`);
  }
}

// ============================================
// UPDATE DATABASE: PNG URLs → WebP URLs
// ============================================
async function updateDatabaseImages() {
  console.log('🔄 Updating Database: PNG URLs → WebP URLs\n');
  console.log('━'.repeat(60));
  
  const projectImages = await prisma.projectImage.findMany({
    include: {
      project: {
        select: { title: true }
      }
    }
  });
  
  if (projectImages.length === 0) {
    console.log('ℹ️  No project images found in database');
    return;
  }
  
  console.log(`Found ${projectImages.length} project images\n`);
  
  let updated = 0;
  const projectsDir = path.join(__dirname, 'uploads', 'projects');
  
  for (const image of projectImages) {
    if (image.url.endsWith('.png')) {
      const webpUrl = image.url.replace('.png', '.webp');
      const filename = path.basename(webpUrl);
      const webpPath = path.join(projectsDir, filename);
      
      // Only update if WebP file exists
      if (fsSync.existsSync(webpPath)) {
        await prisma.projectImage.update({
          where: { id: image.id },
          data: { url: webpUrl }
        });
        
        console.log(`✓ ${image.project.title}`);
        console.log(`  ${path.basename(image.url)} → ${path.basename(webpUrl)}\n`);
        updated++;
      }
    }
  }
  
  console.log('━'.repeat(60));
  console.log(`\n✅ Updated ${updated} image URL(s) to WebP\n`);
}

// ============================================
// CHECK PROJECTS: Display project information
// ============================================
async function checkProjects() {
  console.log('📋 Project Information\n');
  console.log('━'.repeat(60));
  
  const projects = await prisma.project.findMany({
    include: {
      images: {
        orderBy: { order: 'asc' }
      }
    }
  });
  
  if (projects.length === 0) {
    console.log('ℹ️  No projects found');
    return;
  }
  
  for (const project of projects) {
    console.log(`\n📁 ${project.title}`);
    console.log(`   ID: ${project.id}`);
    console.log(`   Category: ${project.category}`);
    console.log(`   Published: ${project.published ? 'Yes' : 'No'}`);
    console.log(`   Featured: ${project.featured ? 'Yes' : 'No'}`);
    
    if (project.thumbnail) {
      const ext = path.extname(project.thumbnail);
      console.log(`   Thumbnail: ${path.basename(project.thumbnail)} ${ext === '.webp' ? '✓' : '⚠️ (PNG)'}`);
    } else {
      console.log(`   Thumbnail: None`);
    }
    
    if (project.images.length > 0) {
      console.log(`   Gallery: ${project.images.length} images`);
      project.images.forEach((img, i) => {
        const ext = path.extname(img.url);
        const format = ext === '.webp' ? '✓ WebP' : '⚠️  PNG';
        console.log(`     ${i + 1}. ${path.basename(img.url)} ${format}`);
      });
    } else {
      console.log(`   Gallery: Empty`);
    }
  }
  
  console.log('\n' + '━'.repeat(60));
  console.log(`\nTotal Projects: ${projects.length}\n`);
}

// ============================================
// CHECK SERVICES: Display service information
// ============================================
async function checkServices() {
  console.log('📋 Services Information\n');
  console.log('━'.repeat(60));
  
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' }
  });
  
  if (services.length === 0) {
    console.log('ℹ️  No services found');
    return;
  }
  
  for (const service of services) {
    console.log(`\n📌 ${service.title}`);
    console.log(`   ID: ${service.id}`);
    console.log(`   Slug: ${service.slug}`);
    console.log(`   Category: ${service.category}`);
    console.log(`   Published: ${service.published ? 'Yes' : 'No'}`);
    console.log(`   Order: ${service.order}`);
    
    if (service.icon) {
      console.log(`   Icon: ${service.icon}`);
    }
  }
  
  console.log('\n' + '━'.repeat(60));
  console.log(`\nTotal Services: ${services.length}\n`);
}

// ============================================
// HELP: Show available commands
// ============================================
function showHelp() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║        Gemini Backend Utility Scripts                    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  console.log('Usage: node scripts.js [command]\n');
  console.log('Available commands:\n');
  console.log('  optimize-images    Convert PNG images to WebP format');
  console.log('                     (processes uploads/projects folder)\n');
  console.log('  update-db-images   Update database records to use WebP URLs');
  console.log('                     (updates ProjectImage table)\n');
  console.log('  check-projects     Display all projects with image info');
  console.log('                     (shows thumbnails and gallery images)\n');
  console.log('  check-services     Display all services\n');
  console.log('  help               Show this help message\n');
  console.log('Examples:');
  console.log('  node scripts.js optimize-images');
  console.log('  node scripts.js check-projects\n');
}

// ============================================
// MAIN: Command router
// ============================================
async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'optimize-images':
        await optimizeImages();
        break;
      
      case 'update-db-images':
        await updateDatabaseImages();
        break;
      
      case 'check-projects':
        await checkProjects();
        break;
      
      case 'check-services':
        await checkServices();
        break;
      
      case 'help':
      case undefined:
        showHelp();
        break;
      
      default:
        console.log(`\n❌ Unknown command: ${command}\n`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
