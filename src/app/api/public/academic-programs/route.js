import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json([], { headers: noStoreHeaders });

    const programs = await prisma.academicProgram.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(programs, { headers: noStoreHeaders });
  } catch (error) {
    console.error('Academic programs public API error:', error);
    return NextResponse.json([], { headers: noStoreHeaders });
  }
}
