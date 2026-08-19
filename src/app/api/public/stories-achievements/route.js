import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([], { headers: noStoreHeaders });
    }

    const items = await prisma.storyAchievement.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { date: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        imageUrl: true,
        date: true,
      },
    });
    return NextResponse.json(items, { headers: noStoreHeaders });
  } catch (error) {
    console.error('Stories & Achievements public API error:', error);
    return NextResponse.json([], { headers: noStoreHeaders });
  }
}
