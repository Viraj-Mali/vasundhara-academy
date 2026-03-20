import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const count = await prisma.committeeMember.count({ where: { committeeId: body.committeeId } });
  const data = await prisma.committeeMember.create({
    data: { name: body.name, designation: body.designation, phone: body.phone || '', committeeId: body.committeeId, order: count + 1 }
  });
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const data = await prisma.committeeMember.update({
    where: { id: body.id },
    data: { name: body.name, designation: body.designation, phone: body.phone || '' }
  });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await prisma.committeeMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
