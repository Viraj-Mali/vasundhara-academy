import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([], {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    const news = await prisma.schoolNews.findMany({
      where: { isActive: true },
      orderBy: [{ newsDate: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
      },
    });

    return NextResponse.json(news, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('School news public API error:', error);
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}
