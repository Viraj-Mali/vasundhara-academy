import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const [admissions, enquiries, staff, notifications, events, alumni, gallery, committees] = await Promise.all([
    prisma.admission.count(),
    prisma.enquiry.count(),
    prisma.staff.count(),
    prisma.notification.count({ where: { active: true } }),
    prisma.event.count(),
    prisma.alumni.count(),
    prisma.galleryImage.count(),
    prisma.committee.count(),
  ]);

  const recentAdmissions = await prisma.admission.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  const recentEnquiries = await prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  const pendingAdmissions = await prisma.admission.count({ where: { status: 'pending' } });
  const newEnquiries = await prisma.enquiry.count({ where: { status: 'new' } });

  return NextResponse.json({
    stats: { admissions, enquiries, staff, notifications, events, alumni, gallery, committees, pendingAdmissions, newEnquiries },
    recentAdmissions,
    recentEnquiries,
  });
}
