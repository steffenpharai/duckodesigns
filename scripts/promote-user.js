// Script to promote user to ADMIN role
// Usage: node scripts/promote-user.js <email>
// Requires DATABASE_URL environment variable

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteUser() {
  const userEmail = process.argv[2];
  
  if (!userEmail) {
    console.error('Error: Email address is required');
    console.log('Usage: node scripts/promote-user.js <email>');
    console.log('Example: node scripts/promote-user.js pharaisteffen@gmail.com');
    process.exit(1);
  }
  
  try {
    console.log(`Updating user role for: ${userEmail}`);
    
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    
    console.log('\n✅ User role updated successfully!');
    console.log('User details:', JSON.stringify(user, null, 2));
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`\n❌ Error: User with email "${userEmail}" not found`);
      console.log('Make sure you have signed in at least once to create the user account.');
    } else {
      console.error('\n❌ Error updating user role:', error.message);
      if (error.code) {
        console.error('Error code:', error.code);
      }
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

promoteUser();

