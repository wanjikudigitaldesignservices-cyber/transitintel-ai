import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create an organization
  const org = await prisma.organization.upsert({
    where: { email: 'admin@transitintel.com' },
    update: {},
    create: {
      name: 'TransitIntel HQ',
      email: 'admin@transitintel.com',
      phone: '+254700000000',
      status: 'ACTIVE',
    },
  });

  // Create an admin user
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@transitintel.com' },
    update: {},
    create: {
      email: 'admin@transitintel.com',
      name: 'System Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
      organizationId: org.id,
      isActive: true,
    },
  });

  console.log('Database seeded! You can log in with:');
  console.log('Email: admin@transitintel.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
