import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';

const categories = new Set(['Achievement', 'Academic', 'Event', 'Sports', 'Cultural', 'Other']);

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseOrder(value, fallback = 0) {
  const order = Number.parseInt(value, 10);
  return Number.isFinite(order) ? order : fallback;
}

function parseBoolean(value, fallback = true) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
}

function validateRequiredFields({ title, description, category, imageUrl }) {
  if (!title?.trim()) return 'Title is required';
  if (!description?.trim()) return 'Description is required';
  if (!categories.has(category)) return 'Please select a valid category';
  if (!imageUrl?.trim()) return 'Image is required';
  return null;
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) return NextResponse.json([]);

  const items = await prisma.storyAchievement.findMany({
    orderBy: [{ displayOrder: 'asc' }, { date: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(items);
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
      description: body.description?.trim(),
      category: body.category,
      imageUrl: body.imageUrl?.trim(),
      date: parseDate(body.date),
      displayOrder: parseOrder(body.displayOrder),
      isActive: parseBoolean(body.isActive, true),
    };
    const validationError = validateRequiredFields(data);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    return NextResponse.json(await prisma.storyAchievement.create({ data }));
  } catch (error) {
    console.error('Story/Achievement create error:', error);
    return NextResponse.json({ error: 'Unable to create story or achievement' }, { status: 400 });
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
    if (!body.id) return NextResponse.json({ error: 'Story/Achievement id is required' }, { status: 400 });

    const existing = await prisma.storyAchievement.findUnique({ where: { id: body.id } });
    if (!existing) return NextResponse.json({ error: 'Story/Achievement not found' }, { status: 404 });

    const data = {
      title: body.title === undefined ? existing.title : body.title?.trim(),
      description: body.description === undefined ? existing.description : body.description?.trim(),
      category: body.category === undefined ? existing.category : body.category,
      imageUrl: body.imageUrl === undefined ? existing.imageUrl : body.imageUrl?.trim(),
      date: body.date === undefined ? existing.date : parseDate(body.date),
      displayOrder: body.displayOrder === undefined ? existing.displayOrder : parseOrder(body.displayOrder, existing.displayOrder),
      isActive: body.isActive === undefined ? existing.isActive : parseBoolean(body.isActive, existing.isActive),
    };
    const validationError = validateRequiredFields(data);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const updated = await prisma.storyAchievement.update({ where: { id: body.id }, data });
    if (data.imageUrl !== existing.imageUrl) await deleteUploadFileByUrl(existing.imageUrl);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Story/Achievement update error:', error);
    return NextResponse.json({ error: 'Unable to update story or achievement' }, { status: 400 });
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
  if (!id) return NextResponse.json({ error: 'Story/Achievement id is required' }, { status: 400 });

  const existing = await prisma.storyAchievement.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ ok: true });

  await prisma.storyAchievement.delete({ where: { id } });
  await deleteUploadFileByUrl(existing.imageUrl);
  return NextResponse.json({ ok: true });
}
