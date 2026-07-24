import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Almighty SuperAdmin Accounts...');
  
  // Create / Upsert Global HQ Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'transitintel-hq' },
    update: {
      name: 'TransitIntel Global HQ',
      isActive: true,
    },
    create: {
      name: 'TransitIntel Global HQ',
      slug: 'transitintel-hq',
      email: 'superadmin@transitintel.com',
      phone: '+254740396075',
      country: 'Kenya',
      city: 'Nairobi',
      timezone: 'Africa/Nairobi',
      currency: 'KES',
      isActive: true,
    },
  });

  // Create SuperAdmin 1: superadmin@transitintel.com / SuperAdmin123!
  const superPasswordHash = await bcrypt.hash('SuperAdmin123!', 12);
  
  const superUser = await prisma.user.upsert({
    where: { email: 'superadmin@transitintel.com' },
    update: {
      name: 'Almighty SuperAdmin',
      passwordHash: superPasswordHash,
      role: 'SUPER_ADMIN',
      organizationId: org.id,
      isActive: true,
    },
    create: {
      email: 'superadmin@transitintel.com',
      name: 'Almighty SuperAdmin',
      passwordHash: superPasswordHash,
      role: 'SUPER_ADMIN',
      organizationId: org.id,
      isActive: true,
    },
  });

  // Create SuperAdmin 2: admin@transitintel.com / password123
  const adminPasswordHash = await bcrypt.hash('password123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@transitintel.com' },
    update: {
      name: 'System Admin HQ',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      organizationId: org.id,
      isActive: true,
    },
    create: {
      email: 'admin@transitintel.com',
      name: 'System Admin HQ',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      organizationId: org.id,
      isActive: true,
    },
  });

  console.log('✅ SuperAdmin Accounts created successfully!');
  console.log('----------------------------------------------------');
  console.log('👑 SuperAdmin Account Details (All Almighty Powers):');
  console.log('   Email: superadmin@transitintel.com');
  console.log('   Password: SuperAdmin123!');
  console.log('   Role: SUPER_ADMIN');
  console.log('   Organization: TransitIntel Global HQ');
  console.log('----------------------------------------------------');
  console.log('🔑 Secondary Admin Account Details:');
  console.log('   Email: admin@transitintel.com');
  console.log('   Password: password123');
  console.log('   Role: SUPER_ADMIN');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
