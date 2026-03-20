import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(notices);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const notice = await prisma.notice.create({ data: body });
  return NextResponse.json(notice);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const { id, ...data } = body;
  const notice = await prisma.notice.update({ where: { id }, data });
  return NextResponse.json(notice);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { id } = await req.json();
  await prisma.notice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
