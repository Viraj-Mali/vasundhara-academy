import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const data = await prisma.enquiry.update({ where: { id: body.id }, data: { status: body.status } });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids');
  if (ids) {
    await prisma.enquiry.deleteMany({ where: { id: { in: ids.split(',') } } });
  } else if (id) {
    await prisma.enquiry.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
