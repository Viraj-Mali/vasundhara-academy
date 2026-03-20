import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.boardMember.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(data);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const count = await prisma.boardMember.count();
  const data = await prisma.boardMember.create({
    data: { name: body.name, designation: body.designation, photo: body.photo || null, order: count + 1 }
  });
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const updateData = { name: body.name, designation: body.designation };
  if (body.photo !== undefined) updateData.photo = body.photo || null;
  if (body.order !== undefined) updateData.order = body.order;
  const data = await prisma.boardMember.update({ where: { id: body.id }, data: updateData });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids');
  if (ids) {
    await prisma.boardMember.deleteMany({ where: { id: { in: ids.split(',') } } });
  } else {
    await prisma.boardMember.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
