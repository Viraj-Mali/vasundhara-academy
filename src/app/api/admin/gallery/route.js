import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const data = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(data);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { url, title, category } = await req.json();
  const newImage = await prisma.galleryImage.create({
    data: { url, title, category }
  });
  return NextResponse.json(newImage);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids');
  if (ids) {
    await prisma.galleryImage.deleteMany({ where: { id: { in: ids.split(',') } } });
  } else if (id) {
    await prisma.galleryImage.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
