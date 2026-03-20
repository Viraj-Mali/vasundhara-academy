import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.event.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json(data);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const data = await prisma.event.create({
    data: { title: body.title, slug: body.slug, description: body.description, date: new Date(body.date), category: body.category || 'event', featured: body.featured || false }
  });
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const data = await prisma.event.update({
    where: { id: body.id },
    data: { title: body.title, description: body.description, date: new Date(body.date), category: body.category }
  });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids');
  if (ids) {
    await prisma.event.deleteMany({ where: { id: { in: ids.split(',') } } });
  } else {
    await prisma.event.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
