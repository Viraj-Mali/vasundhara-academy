import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

// Returns unread/pending counts for sidebar badges
export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const [pendingAdmissions, newEnquiries, activeNotifications, totalStaff, totalEvents, totalGallery] = await Promise.all([
    prisma.admission.count({ where: { status: 'pending' } }),
    prisma.enquiry.count({ where: { status: 'new' } }),
    prisma.notification.count({ where: { active: true } }),
    prisma.staff.count(),
    prisma.event.count(),
    prisma.galleryImage.count(),
  ]);

  return NextResponse.json({
    admissions: pendingAdmissions,
    enquiries: newEnquiries,
    notifications: activeNotifications,
    staff: totalStaff,
    events: totalEvents,
    gallery: totalGallery,
  });
}
