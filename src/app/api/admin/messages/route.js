import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.message.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(data);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const data = await prisma.message.create({
    data: { role: body.role, name: body.name, title: body.title || '', message: body.message, photo: body.photo || null }
  });
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const updateData = { role: body.role, name: body.name, title: body.title || '', message: body.message };
  if (body.photo !== undefined) updateData.photo = body.photo || null;
  const data = await prisma.message.update({ where: { id: body.id }, data: updateData });
  return NextResponse.json(data);
}
