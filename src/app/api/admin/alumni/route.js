import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.alumni.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids');
  if (ids) {
    await prisma.alumni.deleteMany({ where: { id: { in: ids.split(',') } } });
  } else if (id) {
    await prisma.alumni.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
