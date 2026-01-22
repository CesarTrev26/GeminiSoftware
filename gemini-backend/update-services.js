const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateServices() {
  try {
    // Update each service with correct icon and color
    const updates = [
      {
        slug: 'desarrollo-web',
        icon: 'code',
        color: 'cyan'
      },
      {
        slug: 'apps-moviles',
        icon: 'mobile',
        color: 'cyan'
      },
      {
        slug: 'software-empresarial',
        icon: 'software',
        color: 'blue'
      },
      {
        slug: 'e-commerce',
        icon: 'marketing',
        color: 'cyan'
      },
      {
        slug: 'marketing-digital',
        icon: 'marketing',
        color: 'cyan'
      },
      {
        slug: 'diseno-ui-ux',
        icon: 'design',
        color: 'blue'
      }
    ];

    for (const update of updates) {
      await prisma.service.update({
        where: { slug: update.slug },
        data: {
          icon: update.icon,
          color: update.color
        }
      });
      console.log(`✓ Updated ${update.slug}`);
    }

    console.log('\n✓ All services updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateServices();
