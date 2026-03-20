import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Categories excluded from the public gallery page
// These images only appear on their dedicated pages
const EXCLUDED_FROM_GALLERY = [
  // Events page only
  'events', 'sports', 'celebration', 'sports-day', 'annual-day',
  // Staff page only (profile photos)
  'faculty', 'staff', 'teacher',
  // Facilities page only (each facility has its own section)
  'classroom', 'science-lab', 'computer-lab', 'library',
  'hostel', 'counseling', 'healthcare',
  'sports-grounds', 'indoor-games', 'outings', 'assembly', 'transport',
];

// Gallery page shows ONLY: general, campus, achievements, awards
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const includeAll = searchParams.get('all') === 'true';

  const where = {};

  if (category) {
    // Specific category requested (e.g. facilities page asking for 'classroom')
    where.category = category;
  } else if (!includeAll) {
    // Default gallery view: exclude events, faculty, and facility images
    where.NOT = {
      category: { in: EXCLUDED_FROM_GALLERY },
    };
  }

  const data = await prisma.galleryImage.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(data);
}
