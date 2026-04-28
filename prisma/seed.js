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

  // Create staff
  const staffData = [
    { name: 'Mrs. Savita Awari', designation: 'Principal', qualification: 'M.A., B.Ed.', subject: null, category: 'teaching', order: 1 },
    { name: 'Mr. Ramesh Shinde', designation: 'Vice Principal', qualification: 'M.Sc., B.Ed.', subject: 'Maths', category: 'teaching', order: 2 },
    { name: 'Mr. Sanjay Patil', designation: 'HOD Science', qualification: 'M.Sc. (Physics)', subject: 'Science', category: 'teaching', order: 3 },
    { name: 'Ms. Anjali Deshmukh', designation: 'Senior Teacher', qualification: 'M.A. (English)', subject: 'English', category: 'teaching', order: 4 },
    { name: 'Mr. Vijay Mali', designation: 'Sports Instructor', qualification: 'B.P.Ed.', subject: 'Sports', category: 'teaching', order: 5 },
    { name: 'Mrs. Sunita Gaware', designation: 'Librarian', qualification: 'M.Lib.', subject: null, category: 'non-teaching', order: 6 },
  ];

  for (const s of staffData) {
    await prisma.staff.upsert({
      where: { id: `staff-${s.order}` }, // Unique ID strategy for seeding
      update: s,
      create: { ...s, id: `staff-${s.order}` },
    });
  }
  console.log('✅ Staff details created');

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
