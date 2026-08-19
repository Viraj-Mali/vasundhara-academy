import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';

const categories = new Set([
  'Enrichment',
  'Competitive',
  'Physical',
  'Academic',
  'Co-curricular',
  'Sports',
  'Other',
]);

function parseOrder(value, fallback = 0) {
  const order = Number.parseInt(value, 10);
  return Number.isFinite(order) ? order : fallback;
}

function parseBoolean(value, fallback = true) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
}

function validateProgram({ title, category, description, imageUrl }) {
  if (!title?.trim()) return 'Program title is required';
  if (!categories.has(category)) return 'Please select a valid category';
  if (!description?.trim()) return 'Description is required';
  if (!imageUrl?.trim()) return 'Program image is required';
  return null;
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) return NextResponse.json([]);

  const programs = await prisma.academicProgram.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(programs);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const data = {
      title: body.title?.trim(),
      category: body.category,
      description: body.description?.trim(),
      imageUrl: body.imageUrl?.trim(),
      displayOrder: parseOrder(body.displayOrder),
      isActive: parseBoolean(body.isActive, true),
    };
    const validationError = validateProgram(data);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    return NextResponse.json(await prisma.academicProgram.create({ data }));
  } catch (error) {
    console.error('Academic program create error:', error);
    return NextResponse.json({ error: 'Unable to create academic program' }, { status: 400 });
  }
}

export async function PATCH(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Academic program id is required' }, { status: 400 });

    const existing = await prisma.academicProgram.findUnique({ where: { id: body.id } });
    if (!existing) return NextResponse.json({ error: 'Academic program not found' }, { status: 404 });

    const data = {
      title: body.title === undefined ? existing.title : body.title?.trim(),
      category: body.category === undefined ? existing.category : body.category,
      description: body.description === undefined ? existing.description : body.description?.trim(),
      imageUrl: body.imageUrl === undefined ? existing.imageUrl : body.imageUrl?.trim(),
      displayOrder: body.displayOrder === undefined ? existing.displayOrder : parseOrder(body.displayOrder, existing.displayOrder),
      isActive: body.isActive === undefined ? existing.isActive : parseBoolean(body.isActive, existing.isActive),
    };
    const validationError = validateProgram(data);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const updated = await prisma.academicProgram.update({ where: { id: body.id }, data });
    if (data.imageUrl !== existing.imageUrl) await deleteUploadFileByUrl(existing.imageUrl);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Academic program update error:', error);
    return NextResponse.json({ error: 'Unable to update academic program' }, { status: 400 });
  }
}

export async function PUT(req) {
  return PATCH(req);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Academic program id is required' }, { status: 400 });

  const existing = await prisma.academicProgram.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ ok: true });

  await prisma.academicProgram.delete({ where: { id } });
  await deleteUploadFileByUrl(existing.imageUrl);
  return NextResponse.json({ ok: true });
}
