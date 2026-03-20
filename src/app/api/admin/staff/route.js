import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.staff.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(data);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const count = await prisma.staff.count();
  const data = await prisma.staff.create({
    data: { name: body.name, designation: body.designation, qualification: body.qualification || '', subject: body.subject || '', photo: body.photo || null, category: body.category || 'teaching', order: count + 1 }
  });
  await logActivity('create', 'staff', body.name, `Added as ${body.designation}`);
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const updateData = { name: body.name, designation: body.designation, qualification: body.qualification || '', subject: body.subject || '', category: body.category || 'teaching' };
  if (body.photo !== undefined) updateData.photo = body.photo || null;
  if (body.order !== undefined) updateData.order = body.order;
  const data = await prisma.staff.update({ where: { id: body.id }, data: updateData });
  await logActivity('update', 'staff', body.name);
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
    await prisma.staff.deleteMany({ where: { id: { in: items } } });
    await logActivity('delete', 'staff', `${items.length} staff members`, 'Bulk delete');
  } else {
    const item = await prisma.staff.findUnique({ where: { id } });
    await prisma.staff.delete({ where: { id } });
    await logActivity('delete', 'staff', item?.name || id);
  }
  return NextResponse.json({ ok: true });
}
