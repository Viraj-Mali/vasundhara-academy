import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const news = await prisma.schoolNews.findMany({
      where: { isActive: true },
      orderBy: [{ newsDate: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('School news public API error:', error);
    return NextResponse.json([]);
  }
}
