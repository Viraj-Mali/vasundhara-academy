import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const PAGE_SLUG = 'question-bank-drive-links';

function emptyGradeLinks() {
  return Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [`grade${index + 1}`, ''])
  );
}

function parseLinks(content) {
  try {
    return { ...emptyGradeLinks(), ...JSON.parse(content || '{}') };
  } catch {
    return emptyGradeLinks();
  }
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(emptyGradeLinks(), {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    const page = await prisma.pageContent.findUnique({
      where: { pageSlug: PAGE_SLUG },
    });

    return NextResponse.json(parseLinks(page?.content), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Question Bank Drive links public API error:', error);
    return NextResponse.json(emptyGradeLinks(), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}
