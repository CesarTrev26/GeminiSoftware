const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
  const images = await prisma.projectImage.findMany();
  const projects = await prisma.project.findMany({
    include: { images: true },
    orderBy: { order: 'asc' }
  });
  
  console.log('Total images:', images.length);
  console.log('\nProjects with images:');
  projects.forEach(p => {
    console.log(`- ${p.title}: ${p.images.length} images`);
    p.images.forEach(img => console.log(`  * ${img.url}`));
  });
  
  await prisma.$disconnect();
  process.exit(0);
}

checkImages();
