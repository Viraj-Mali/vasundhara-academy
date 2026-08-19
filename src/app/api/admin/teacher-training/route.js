import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';

const categories = new Set([
  'ICT Training',
  'NEP Workshop',
  'Pedagogical Skills',
  'Child Psychology',
  'Inclusive Education',
  'Safety & First Aid',
  'Other',
]);

const includeImages = {
  images: { orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }] },
};

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

function cleanImageUrls(values) {
  return (Array.isArray(values) ? values : [])
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => value.trim());
}

function validateTraining({ title, description, category }) {
  if (!title?.trim()) return 'Training title is required';
  if (!description?.trim()) return 'Short description is required';
  if (!categories.has(category)) return 'Please select a valid category';
  return null;
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) return NextResponse.json([]);

  const trainings = await prisma.teacherTraining.findMany({
    orderBy: [{ displayOrder: 'asc' }, { trainingDate: 'desc' }, { createdAt: 'desc' }],
    include: includeImages,
  });
  return NextResponse.json(trainings);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const imageUrls = cleanImageUrls(body.imageUrls);
    const data = {
      title: body.title?.trim(),
      description: body.description?.trim(),
      category: body.category,
      trainingDate: parseDate(body.trainingDate),
      coverImageUrl: body.coverImageUrl?.trim() || null,
      displayOrder: parseOrder(body.displayOrder),
      isActive: parseBoolean(body.isActive, true),
    };
    const validationError = validateTraining(data);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const training = await prisma.teacherTraining.create({
      data: {
        ...data,
        images: imageUrls.length > 0
          ? { create: imageUrls.map((imageUrl, index) => ({ imageUrl, displayOrder: index + 1 })) }
          : undefined,
      },
      include: includeImages,
    });
    return NextResponse.json(training);
  } catch (error) {
    console.error('Teacher training create error:', error);
    return NextResponse.json({ error: 'Unable to create teacher training card' }, { status: 400 });
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
    if (!body.id) return NextResponse.json({ error: 'Teacher training id is required' }, { status: 400 });

    const existing = await prisma.teacherTraining.findUnique({ where: { id: body.id }, include: includeImages });
    if (!existing) return NextResponse.json({ error: 'Teacher training card not found' }, { status: 404 });

    const newImageUrls = cleanImageUrls(body.newImageUrls);
    const nextImageOrder = existing.images.reduce((max, image) => Math.max(max, image.displayOrder), 0) + 1;
    const data = {
      title: body.title === undefined ? existing.title : body.title?.trim(),
      description: body.description === undefined ? existing.description : body.description?.trim(),
      category: body.category === undefined ? existing.category : body.category,
      trainingDate: body.trainingDate === undefined ? existing.trainingDate : parseDate(body.trainingDate),
      coverImageUrl: body.coverImageUrl === undefined ? existing.coverImageUrl : body.coverImageUrl?.trim() || null,
      displayOrder: body.displayOrder === undefined ? existing.displayOrder : parseOrder(body.displayOrder, existing.displayOrder),
      isActive: body.isActive === undefined ? existing.isActive : parseBoolean(body.isActive, existing.isActive),
      images: newImageUrls.length > 0
        ? { create: newImageUrls.map((imageUrl, index) => ({ imageUrl, displayOrder: nextImageOrder + index })) }
        : undefined,
    };
    const validationError = validateTraining(data);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const updated = await prisma.teacherTraining.update({ where: { id: body.id }, data, include: includeImages });
    if (data.coverImageUrl !== existing.coverImageUrl && existing.coverImageUrl) {
      await deleteUploadFileByUrl(existing.coverImageUrl);
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Teacher training update error:', error);
    return NextResponse.json({ error: 'Unable to update teacher training card' }, { status: 400 });
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

  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get('imageId');
  if (imageId) {
    const image = await prisma.teacherTrainingImage.findUnique({ where: { id: imageId } });
    if (!image) return NextResponse.json({ ok: true });
    await prisma.teacherTrainingImage.delete({ where: { id: imageId } });
    await deleteUploadFileByUrl(image.imageUrl);
    return NextResponse.json({ ok: true });
  }

  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Teacher training id is required' }, { status: 400 });
  const existing = await prisma.teacherTraining.findUnique({ where: { id }, include: includeImages });
  if (!existing) return NextResponse.json({ ok: true });

  await prisma.teacherTraining.delete({ where: { id } });
  await Promise.all([
    existing.coverImageUrl ? deleteUploadFileByUrl(existing.coverImageUrl) : Promise.resolve(),
    ...existing.images.map((image) => deleteUploadFileByUrl(image.imageUrl)),
  ]);
  return NextResponse.json({ ok: true });
}
