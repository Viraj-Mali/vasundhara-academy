import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json([], { headers: noStoreHeaders });

    const trainings = await prisma.teacherTraining.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { trainingDate: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        trainingDate: true,
        coverImageUrl: true,
        images: {
          orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
          select: { id: true },
        },
      },
    });
    return NextResponse.json(trainings, { headers: noStoreHeaders });
  } catch (error) {
    console.error('Teacher training public API error:', error);
    return NextResponse.json([], { headers: noStoreHeaders });
  }
}
