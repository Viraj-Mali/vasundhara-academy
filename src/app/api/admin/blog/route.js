import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const post = await prisma.blogPost.create({
    data: { ...body, slug: `${slug}-${Date.now()}` },
  });
  return NextResponse.json(post);
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const body = await req.json();
  const { id, ...data } = body;
  const post = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json(post);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { id } = await req.json();
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
