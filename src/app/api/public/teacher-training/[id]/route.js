import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET(_req, { params }) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Teacher training not found' }, { status: 404, headers: noStoreHeaders });
    }

    const training = await prisma.teacherTraining.findFirst({
      where: { id: params.id, isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        trainingDate: true,
        coverImageUrl: true,
        images: {
          orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
          select: { id: true, imageUrl: true },
        },
      },
    });
    if (!training) {
      return NextResponse.json({ error: 'Teacher training not found' }, { status: 404, headers: noStoreHeaders });
    }
    return NextResponse.json(training, { headers: noStoreHeaders });
  } catch (error) {
    console.error('Teacher training detail API error:', error);
    return NextResponse.json({ error: 'Unable to load teacher training' }, { status: 500, headers: noStoreHeaders });
  }
}
