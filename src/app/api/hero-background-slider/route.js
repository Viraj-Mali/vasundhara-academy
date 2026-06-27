import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const images = await prisma.heroBackgroundSlider.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Hero slider public API error:', error);
    return NextResponse.json([]);
  }
}
