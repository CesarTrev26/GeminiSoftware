/**
 * Gemini Backend - Consolidated Utility Scripts
 * 
 * All maintenance, optimization, and admin scripts in one place:
 * - optimize-images: Convert images to WebP format with Sharp
 * - update-db-images: Update database image paths to WebP
 * - check-projects: Verify project data integrity
 * - check-services: Verify service data integrity
 * - update-project-metrics: Update project results via API
 * - update-services: Batch update service icons and colors
 * - reset-admin: Reset admin user password
 * 
 * Usage: node scripts-consolidated.js <command>
 * Example: node scripts-consolidated.js optimize-images
 */

const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Get command from arguments
const command = process.argv[2];

// API Configuration
const API_BASE = process.env.API_URL || 'https://gemini-backend.fly.dev/api';

// Help text
const helpText = `
🛠️  Gemini Backend - Consolidated Utility Scripts

Available commands:

  📸 Image Management:
    optimize-images        Convert uploaded images to WebP format
    update-db-images       Update database paths to WebP format

  🔍 Data Verification:
    check-projects         Verify project data integrity
    check-services         Verify service data integrity

  📊 Content Updates (API):
    update-project-metrics Update project results array

  🛠️  Database Updates (Direct):
    update-services        Batch update service icons/colors
    reset-admin            Reset admin user password

  ❓ Help:
    help                   Show this help message

Usage:
  node scripts-consolidated.js <command>

Examples:
  node scripts-consolidated.js optimize-images
  node scripts-consolidated.js check-projects
  node scripts-consolidated.js reset-admin
  node scripts-consolidated.js help
`;

// ============================================================================
// API HELPERS
// ============================================================================

async function apiLogin() {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || 'admin@geminisoftware.mx',
      password: process.env.ADMIN_PASSWORD || 'GeminiAdmin2024!'
    })
  });
  const result = await response.json();
  if (!result.success) {
    throw new Error('Login failed: ' + result.message);
  }
  return result.data.token;
}

async function apiUpdateProject(token, id, updates) {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update ${id}: ${response.status} - ${text}`);
  }
  
  return await response.json();
}

// ============================================================================
// IMAGE OPTIMIZATION
// ============================================================================

async function optimizeImages() {
  const uploadsDir = path.join(__dirname, 'uploads', 'projects');
  
  console.log('🔍 Scanning for images to optimize...\n');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('❌ Uploads directory not found:', uploadsDir);
    return;
  }
  
  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  
  if (imageFiles.length === 0) {
    console.log('✅ No images to optimize');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to process:\n`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(uploadsDir, file);
    const outputPath = path.join(uploadsDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    try {
      // Skip if WebP already exists
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipped: ${file} (WebP exists)`);
        continue;
      }
      
      // Get original file size
      const originalSize = fs.statSync(inputPath).size;
      
      // Convert to WebP
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      // Get new file size
      const newSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${file} → ${path.basename(outputPath)}`);
      console.log(`   ${(originalSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB (${savings}% saved)\n`);
      
    } catch (error) {
      console.log(`❌ Failed: ${file} - ${error.message}\n`);
    }
  }
  
  console.log('🎉 Optimization complete!');
}

// ============================================================================
// DATABASE UPDATES
// ============================================================================

async function updateDatabaseImages() {
  console.log('🔄 Updating database image paths...\n');
  
  try {
    // Get all projects
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true
      }
    });
    
    for (const project of projects) {
      let updated = false;
      const updates = {};
      
      // Update thumbnail
      if (project.thumbnail && /\.(jpg|jpeg|png)$/i.test(project.thumbnail)) {
        updates.thumbnail = project.thumbnail.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        updated = true;
      }
      
      // Update images array
      if (Array.isArray(project.images)) {
        const newImages = project.images.map(img => {
          if (typeof img === 'string' && /\.(jpg|jpeg|png)$/i.test(img)) {
            return img.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          }
          return img;
        });
        
        if (JSON.stringify(newImages) !== JSON.stringify(project.images)) {
          updates.images = newImages;
          updated = true;
        }
      }
      
      // Apply updates
      if (updated) {
        await prisma.project.update({
          where: { id: project.id },
          data: updates
        });
        console.log(`✅ Updated: ${project.title}`);
      } else {
        console.log(`⏭️  Skipped: ${project.title} (already WebP)`);
      }
    }
    
    console.log('\n🎉 Database updated successfully!');
    
  } catch (error) {
    console.error('❌ Database update failed:', error.message);
  }
}

// ============================================================================
// DATA VERIFICATION
// ============================================================================

async function checkProjects() {
  console.log('🔍 Checking projects data...\n');
  
  try {
    const projects = await prisma.project.findMany();
    
    console.log(`Found ${projects.length} projects:\n`);
    
    projects.forEach(project => {
      console.log(`📁 ${project.title} (${project.slug})`);
      console.log(`   ID: ${project.id}`);
      console.log(`   Category: ${project.category}`);
      console.log(`   Featured: ${project.featured ? '⭐' : '❌'}`);
      console.log(`   Thumbnail: ${project.thumbnail || '❌ missing'}`);
      console.log(`   Images: ${Array.isArray(project.images) ? project.images.length : 0}`);
      console.log(`   Results: ${Array.isArray(project.results) ? project.results.length : 0}`);
      console.log(`   Technologies: ${Array.isArray(project.technologies) ? project.technologies.length : 0}`);
      console.log(`   Created: ${project.createdAt.toLocaleDateString()}`);
      console.log();
    });
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

async function checkServices() {
  console.log('🔍 Checking services data...\n');
  
  try {
    const services = await prisma.service.findMany();
    
    console.log(`Found ${services.length} services:\n`);
    
    services.forEach(service => {
      console.log(`🛠️  ${service.title} (${service.slug})`);
      console.log(`   ID: ${service.id}`);
      console.log(`   Icon: ${service.icon || '❌ missing'}`);
      console.log(`   Order: ${service.order}`);
      console.log(`   Featured: ${service.featured ? '⭐' : '❌'}`);
      console.log(`   Features: ${Array.isArray(service.features) ? service.features.length : 0}`);
      console.log(`   Created: ${service.createdAt.toLocaleDateString()}`);
      console.log();
    });
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

// ============================================================================
// PROJECT METRICS UPDATE (API)
// ============================================================================

async function updateProjectMetrics() {
  console.log('📊 Updating project metrics...\n');
  
  const projectMetrics = {
    '89f9371f-46c3-459d-a8fd-40dc5cbcb895': {
      name: 'ANIDA',
      results: [
        { value: '95+', label: 'Lighthouse Score' },
        { value: '8', label: 'Secciones' },
        { value: 'Recorridos 3D', label: 'Feature' },
        { value: '3 meses', label: 'Desarrollo' }
      ]
    },
    '6481e562-8fc0-47cc-930f-bdc411e5e1eb': {
      name: 'WE2T',
      results: [
        { value: '12', label: 'Tipologías' },
        { value: 'GSAP', label: 'Animaciones' },
        { value: 'Zapier', label: 'Integración' },
        { value: '2 meses', label: 'Desarrollo' }
      ]
    },
    '62ae6918-74f9-4eac-a425-9a417c6ab647': {
      name: 'NEST',
      results: [
        { value: '98/100', label: 'Performance' },
        { value: '25+', label: 'Páginas' },
        { value: 'Contentful', label: 'CMS' },
        { value: '4 meses', label: 'Desarrollo' }
      ]
    },
    'c6d50490-b05c-416d-ab60-ad642be60130': {
      name: 'Sistema Entregas',
      results: [
        { value: '8+', label: 'Módulos' },
        { value: '500+', label: 'Departamentos' },
        { value: 'PHP MVC', label: 'Arquitectura' },
        { value: '5 meses', label: 'Desarrollo' }
      ]
    },
    '3b4b46a7-1a7a-4671-b97c-0e6e06e63857': {
      name: 'Nature\'s Factory',
      results: [
        { value: '200+', label: 'Productos' },
        { value: 'Shopify', label: 'Plataforma' },
        { value: 'Liquid', label: 'Personalización' },
        { value: '2+ años', label: 'Mantenimiento' }
      ]
    },
    '66f936a1-e2fb-4e44-aa24-7c8beb322247': {
      name: 'RISE TOWER',
      results: [
        { value: '6', label: 'Secciones' },
        { value: 'Swiper.js', label: 'Carrusel' },
        { value: 'AOS', label: 'Animaciones' },
        { value: '1.5 meses', label: 'Desarrollo' }
      ]
    },
    '0f98e210-aceb-4bb9-acd9-63ba9b6db7fa': {
      name: 'W3ST',
      results: [
        { value: '5', label: 'Tipologías' },
        { value: 'reCAPTCHA', label: 'Seguridad' },
        { value: 'SendGrid', label: 'Email' },
        { value: '2.5 meses', label: 'Desarrollo' }
      ]
    },
    'e66598ac-f774-4108-81ee-2bb4d9c4710a': {
      name: 'CRM Ventas',
      results: [
        { value: '50+', label: 'Usuarios' },
        { value: '15+', label: 'Proyectos' },
        { value: 'React + Node', label: 'Stack' },
        { value: '6 meses', label: 'Desarrollo' }
      ]
    }
  };
  
  try {
    console.log('🔐 Logging in...');
    const token = await apiLogin();
    console.log('✅ Authenticated\n');
    
    for (const [id, data] of Object.entries(projectMetrics)) {
      try {
        await apiUpdateProject(token, id, { results: data.results });
        console.log(`✅ Updated: ${data.name}`);
        console.log(`   Metrics: ${data.results.map(r => `${r.value} ${r.label}`).join(' | ')}`);
      } catch (error) {
        console.error(`❌ Failed: ${data.name} - ${error.message}`);
      }
    }
    
    console.log('\n🎉 All project metrics updated!');
  } catch (error) {
    console.error('❌ Update failed:', error.message);
  }
}

// ============================================================================
// UPDATE SERVICES (DIRECT DB)
// ============================================================================

async function updateServices() {
  console.log('🛠️  Updating services data...\n');
  
  const serviceUpdates = [
    { slug: 'diseno-web-responsivo', icon: 'Monitor', color: '#00D3FF' },
    { slug: 'desarrollo-ecommerce', icon: 'ShoppingCart', color: '#7C3AED' },
    { slug: 'aplicaciones-web', icon: 'Code', color: '#10B981' },
    { slug: 'seo-marketing-digital', icon: 'TrendingUp', color: '#F59E0B' },
    { slug: 'mantenimiento-soporte', icon: 'Settings', color: '#EF4444' },
    { slug: 'consultoria-tecnologica', icon: 'Lightbulb', color: '#8B5CF6' }
  ];
  
  try {
    for (const update of serviceUpdates) {
      const service = await prisma.service.findUnique({
        where: { slug: update.slug }
      });
      
      if (service) {
        await prisma.service.update({
          where: { slug: update.slug },
          data: {
            icon: update.icon,
            color: update.color
          }
        });
        console.log(`✅ Updated: ${service.title} → ${update.icon} (${update.color})`);
      } else {
        console.log(`⚠️  Not found: ${update.slug}`);
      }
    }
    
    console.log('\n🎉 Services updated successfully!');
  } catch (error) {
    console.error('❌ Update failed:', error.message);
  }
}

// ============================================================================
// RESET ADMIN PASSWORD
// ============================================================================

async function resetAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@geminisoftware.mx';
  const adminPassword = process.env.ADMIN_PASSWORD || 'GeminiAdmin2024!';
  
  console.log('🔐 Resetting admin user...\n');
  console.log('🔍 Checking for:', adminEmail);
  
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user found');
      console.log(`   ID: ${existingAdmin.id}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Created: ${existingAdmin.createdAt.toLocaleString()}\n`);
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await prisma.user.update({
        where: { email: adminEmail },
        data: { password: hashedPassword },
      });
      
      console.log('✅ Password updated successfully!');
    } else {
      console.log('❌ Admin user not found, creating new one...\n');
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const newAdmin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Administrador',
          role: 'ADMIN',
        },
      });
      
      console.log('✅ Admin user created successfully!');
      console.log(`   ID: ${newAdmin.id}`);
      console.log(`   Email: ${newAdmin.email}`);
    }
    
    console.log('\n📋 Login credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    
    // List all users
    console.log('\n👥 All users in database:');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    
    allUsers.forEach(user => {
      console.log(`   • ${user.email} (${user.role}) - ${user.createdAt.toLocaleDateString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============================================================================
// COMMAND ROUTER
// ============================================================================

async function main() {
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
      
    case 'update-project-metrics':
      await updateProjectMetrics();
      break;
      
    case 'update-services':
      await updateServices();
      break;
      
    case 'reset-admin':
      await resetAdmin();
      break;
      
    case 'help':
    case undefined:
      console.log(helpText);
      break;
      
    default:
      console.log(`❌ Unknown command: ${command}`);
      console.log(helpText);
      process.exit(1);
  }
  
  await prisma.$disconnect();
}

// Run main function
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
