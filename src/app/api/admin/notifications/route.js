import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(data);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const data = await prisma.notification.create({ data: { title: body.title, content: body.content || '', type: body.type || 'announcement', active: body.active !== false } });
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const data = await prisma.notification.update({ where: { id: body.id }, data: { active: body.active } });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids'); // bulk delete
  if (ids) {
    await prisma.notification.deleteMany({ where: { id: { in: ids.split(',') } } });
  } else {
    await prisma.notification.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
