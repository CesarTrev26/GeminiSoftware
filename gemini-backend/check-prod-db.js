const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProjects() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      order: true,
      carouselImages: true
    },
    orderBy: { order: 'asc' }
  });
  
  console.log(JSON.stringify(projects, null, 2));
  await prisma.$disconnect();
}

checkProjects();
