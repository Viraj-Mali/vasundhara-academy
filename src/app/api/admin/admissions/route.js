import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const data = await prisma.admission.update({ where: { id: body.id }, data: { status: body.status } });
  await logActivity('update', 'admission', data.studentName, `Status → ${body.status}`);
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids');
  if (ids) {
    const items = ids.split(',');
    await prisma.admission.deleteMany({ where: { id: { in: items } } });
    await logActivity('delete', 'admission', `${items.length} applications`, 'Bulk delete');
  } else if (id) {
    const item = await prisma.admission.findUnique({ where: { id } });
    await prisma.admission.delete({ where: { id } });
    await logActivity('delete', 'admission', item?.studentName || id);
  }
  return NextResponse.json({ ok: true });
}
