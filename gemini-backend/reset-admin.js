// Reset admin user password in production
// Usage: node reset-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    // Get admin email from environment or use default
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@geminisoftware.mx';
    const adminPassword = process.env.ADMIN_PASSWORD || 'GeminiAdmin2024!';
    
    console.log('🔍 Checking for admin user:', adminEmail);
    
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user found:', existingAdmin.email);
      console.log('   ID:', existingAdmin.id);
      console.log('   Name:', existingAdmin.name);
      console.log('   Role:', existingAdmin.role);
      console.log('   Created:', existingAdmin.createdAt);
      
      // Update password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await prisma.user.update({
        where: { email: adminEmail },
        data: { password: hashedPassword },
      });
      
      console.log('✅ Password updated successfully!');
      console.log('\nLogin credentials:');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    } else {
      console.log('❌ Admin user not found, creating new one...');
      
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
      console.log('   ID:', newAdmin.id);
      console.log('   Email:', newAdmin.email);
      console.log('\nLogin credentials:');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    }
    
    // List all users
    console.log('\n📋 All users in database:');
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
      console.log(`  - ${user.email} (${user.role}) - Created: ${user.createdAt}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();
