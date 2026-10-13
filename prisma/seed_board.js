const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const members = [
    { name: 'Shri.Madhukarrao Laxman Nawale', designation: 'President', order: 1 },
    { name: 'Dr.Sou.Archana Satish Khatal', designation: 'Vice-President', order: 2 },
    { name: 'Shri.Arun Laxman Nawale', designation: 'Vice-President', order: 3 },
    { name: 'Shri.Vikram Madhukar Nawale', designation: 'Secretary', order: 4 },
    { name: 'Smt.Alphonsa Devasi Palisheri', designation: 'Joint Secretary', order: 5 },
    { name: 'Shri.Bhagwat Laxman Nawale', designation: 'Joint Secretary', order: 6 },
    { name: 'Dr.Sou.Jayashri Rajiv Deshmukh', designation: 'Treasurer', order: 7 },
    { name: 'Shri.Laxman Kashiba Nawale', designation: 'Member', order: 8 },
  ];

  for (const m of members) {
    const existing = await prisma.boardMember.findFirst({ where: { name: m.name } });
    if (!existing) {
      await prisma.boardMember.create({ data: m });
    }
  }
  console.log('Board members populated');
}

main().catch(console.error).finally(() => prisma.$disconnect());
