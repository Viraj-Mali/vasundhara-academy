const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const committees = [
  {
    name: 'Sakhi Savitri Committee',
    description: 'Constituted on 12th July 2025',
    members: [
      { name: 'Mr. Vikram Nawale', designation: 'President', phone: 'President of School Management Committee' },
      { name: 'Mrs. Soniya Nawale', designation: 'Vice President', phone: 'Teacher Representative' },
      { name: 'Prin. Dr. Jayashri Deshmukh', designation: 'Member Secretary', phone: 'Principal of School' },
      { name: 'Mrs. Aarti Jadhav', designation: 'Member', phone: 'Counselor' },
      { name: 'Dr. Vrushali Dhumal', designation: 'Member', phone: 'Doctor' },
      { name: 'Mrs. Shital Talekar', designation: 'Member', phone: 'Pre-School Teacher' },
      { name: 'Ms. Pranali Dhumal', designation: 'Member', phone: 'Police Patil' },
      { name: 'Mrs. Sangita Sapike', designation: 'Member', phone: 'Gramsevak' },
      { name: 'Mrs. Radhika Nawale', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Miss. Akshika Landge', designation: 'Member', phone: 'Student Representative' },
      { name: 'Miss. Disha Dhage', designation: 'Member', phone: 'Student Representative' },
      { name: 'Mast. Advait Gujar', designation: 'Member', phone: 'Student Representative' },
      { name: 'Mast. Taksh Shaha', designation: 'Member', phone: 'Student Representative' },
    ],
  },
  {
    name: 'School Management Committee',
    description: 'Constituted on 12th July 2025 during Parent Teacher Coordination Meeting',
    members: [
      { name: 'Mr. Vikram Nawale', designation: 'President', phone: 'Parent Representative' },
      { name: 'Mr. Sharad Nawale', designation: 'Vice President', phone: 'Local Body Representative' },
      { name: 'Prin. Dr. Jayashri Deshmukh', designation: 'Member Secretary', phone: 'Principal of School' },
      { name: 'Dr. Rahul Wale', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mr. Mayur Rasane', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mr. Sharad Satpute', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mrs. Pournima Kadam', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mr. Ganesh Kale', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Dr. Dipashri Shete', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mr. Sakharam Ware', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mr. Santosh Landge', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mrs. Vrushali Shete', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mrs. Prajakta Netke', designation: 'Member', phone: 'Local Body Representative' },
    ],
  },
  {
    name: 'Student Safety & Physical Facilities Development Committee',
    description: 'Constituted on 12th July 2025',
    members: [
      { name: 'Mr. Sharad Nawale', designation: 'President', phone: 'Councillor (Nagarsevak)' },
      { name: 'Mrs. Shital Vaidya', designation: 'Vice President', phone: 'Local Body Representative' },
      { name: 'Prin. Dr. Jayashri Deshmukh', designation: 'Member Secretary', phone: 'Principal of School' },
      { name: 'Mrs. Radhika Nawale', designation: 'Member', phone: 'Teacher Representative' },
      { name: 'Mrs. Aarti Jadhav', designation: 'Member', phone: 'Counselor' },
      { name: 'Mr. Ashabai Talpade', designation: 'Member', phone: 'Health Worker' },
      { name: 'Mrs. Maya Aher', designation: 'Member', phone: 'Pre-School Teacher' },
      { name: 'Mr. Pranali Dhumal', designation: 'Member', phone: 'Police Patil' },
      { name: 'Dr. Vrushali Dhumal', designation: 'Member', phone: 'Doctor' },
      { name: 'Ad. Sarojini Nehe', designation: 'Member', phone: 'Lawyer' },
      { name: 'Mr. Santosh Landge', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Mr. Amit Mhaskule', designation: 'Member', phone: 'Business Man' },
      { name: 'Mr. Vijay Bhangare', designation: 'Member', phone: 'Kendrapramukh' },
      { name: 'Mr. Mohan Borse', designation: 'Invited Member', phone: 'Police Inspector, Police Station, Akole' },
    ],
  },
  {
    name: "Women's Grievance Redressal / Internal Complaint Committee",
    description: 'Constituted on 30th June 2025',
    members: [
      { name: 'Dr. Jayashri Deshmukh', designation: 'President', phone: 'Principal' },
      { name: 'Mrs. Radhika Nawale', designation: 'Member', phone: 'Teacher Representative' },
      { name: 'Mrs. Soniya Nawale', designation: 'Member', phone: 'Teacher Representative' },
      { name: 'Mrs. Sangita Varpe', designation: 'Member', phone: 'Teacher Representative' },
      { name: 'Ad. Sarojini Nehe', designation: 'Member', phone: 'Legal Advisor' },
      { name: 'Vrushali Shete', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Prajakta Solapure', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Shubhada Nikam', designation: 'Member', phone: 'Parent Representative' },
      { name: 'Megha Naikwadi', designation: 'Member', phone: 'Non-Teaching Staff Representative' },
      { name: 'Jyoti Salunke', designation: 'Member', phone: 'Non-Teaching Staff Representative' },
      { name: 'Kasturi Dipak Raut', designation: 'Member', phone: 'Student Representative' },
      { name: 'Anannya Vikas Wanave', designation: 'Member', phone: 'Student Representative' },
      { name: 'Rajnandini Dipak Shete', designation: 'Member', phone: 'Student Representative' },
    ],
  },
  {
    name: 'School Transport Committee',
    description: 'School Transport Committee of Vasundhara Academy',
    members: [],
  },
];

async function seedCommittees() {
  console.log('🏫 Seeding committee data...\n');

  for (const c of committees) {
    // Check if committee already exists
    let committee = await prisma.committee.findFirst({ where: { name: c.name } });

    if (committee) {
      // Update description
      committee = await prisma.committee.update({
        where: { id: committee.id },
        data: { description: c.description || '' },
      });
      // Delete existing members to re-seed
      await prisma.committeeMember.deleteMany({ where: { committeeId: committee.id } });
      console.log(`✏️  Updated: ${c.name}`);
    } else {
      committee = await prisma.committee.create({
        data: { name: c.name, description: c.description || '' },
      });
      console.log(`✅ Created: ${c.name}`);
    }

    // Add members
    for (let i = 0; i < c.members.length; i++) {
      const m = c.members[i];
      await prisma.committeeMember.create({
        data: {
          name: m.name,
          designation: m.designation,
          phone: m.phone || '',
          committeeId: committee.id,
          order: i + 1,
        },
      });
    }
    console.log(`   → ${c.members.length} members added`);
  }

  console.log('\n✨ All committees seeded successfully!');
}

seedCommittees()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
