const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@vasundharaacademy.edu.in' },
    update: {},
    create: {
      email: 'admin@vasundharaacademy.edu.in',
      password: hashedPassword,
      name: 'Admin',
    },
  });
  console.log('✅ Admin user created');

  // Create committees
  const committees = [
    'Sakhi Savitri Committee',
    'School Transport Committee',
    'Student Safety & Physical Facilities Development Committee',
    'Women Grievance Redressal Committee',
    'School Management Committee',
  ];

  for (const name of committees) {
    await prisma.committee.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} of Vasundhara Academy` },
    });
  }
  console.log('✅ Committees created');

  // Create sample notification
  await prisma.notification.create({
    data: {
      title: 'Admissions Open for 2026-27',
      content: 'Applications are now open for Grade 1 to 10. Apply now!',
      type: 'announcement',
      active: true,
    },
  });
  console.log('✅ Sample notification created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
