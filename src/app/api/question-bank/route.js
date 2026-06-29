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

    const data = await prisma.questionBank.findMany({
      where: { isActive: true },
      orderBy: [{ className: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Question Bank public API error:', error);
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}
