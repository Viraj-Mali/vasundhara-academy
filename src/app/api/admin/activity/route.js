import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const page = parseInt(searchParams.get('page') || '1');

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.activityLog.count(),
  ]);

  return NextResponse.json({ logs, total, page, limit });
}
