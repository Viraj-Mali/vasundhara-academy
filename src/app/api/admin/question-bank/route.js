import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const PAGE_SLUG = 'question-bank-drive-links';

function emptyGradeLinks() {
  return Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [`grade${index + 1}`, ''])
  );
}

function normalizeLinks(links = {}) {
  return Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => {
      const key = `grade${index + 1}`;
      return [key, typeof links[key] === 'string' ? links[key].trim() : ''];
    })
  );
}

function parseLinks(content) {
  try {
    return normalizeLinks(JSON.parse(content || '{}'));
  } catch {
    return emptyGradeLinks();
  }
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;

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
}

export async function PATCH(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const links = normalizeLinks(body.links || body);

  const page = await prisma.pageContent.upsert({
    where: { pageSlug: PAGE_SLUG },
    update: {
      title: 'Question Bank Drive Links',
      content: JSON.stringify(links),
    },
    create: {
      pageSlug: PAGE_SLUG,
      title: 'Question Bank Drive Links',
      content: JSON.stringify(links),
    },
  });

  return NextResponse.json(parseLinks(page.content), {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

export async function PUT(req) {
  return PATCH(req);
}
