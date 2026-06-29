import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';
import { optimizeAndStoreSchoolNewsImage } from '@/lib/schoolNewsImage';

function parseBoolean(value, fallback = true) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
}

function parseNewsDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function validateFields({ title, description, newsDate }) {
  if (!title?.trim()) return 'Title is required';
  if (!description?.trim()) return 'Description is required';
  if (!newsDate) return 'Valid news date is required';
  return null;
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json([]);
  }

  const news = await prisma.schoolNews.findMany({
    orderBy: [{ newsDate: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(news);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get('title')?.trim();
    const description = formData.get('description')?.trim();
    const newsDate = parseNewsDate(formData.get('newsDate'));
    const validationError = validateFields({ title, description, newsDate });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const upload = await optimizeAndStoreSchoolNewsImage(formData.get('image'));
    const news = await prisma.schoolNews.create({
      data: {
        title,
        description,
        newsDate,
        image: upload.url,
        isActive: parseBoolean(formData.get('isActive'), true),
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('School news create error:', error);
    return NextResponse.json({ error: error.message || 'Unable to create school news' }, { status: 400 });
  }
}

export async function PATCH(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const id = formData.get('id');
    if (!id) {
      return NextResponse.json({ error: 'School news id is required' }, { status: 400 });
    }

    const existing = await prisma.schoolNews.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'School news not found' }, { status: 404 });
    }

    const title = formData.get('title')?.trim();
    const description = formData.get('description')?.trim();
    const newsDate = parseNewsDate(formData.get('newsDate'));
    const validationError = validateFields({ title, description, newsDate });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const data = {
      title,
      description,
      newsDate,
      isActive: parseBoolean(formData.get('isActive'), existing.isActive),
    };

    const replacement = formData.get('image');
    if (replacement && typeof replacement !== 'string' && replacement.size > 0) {
      const upload = await optimizeAndStoreSchoolNewsImage(replacement);
      data.image = upload.url;
    }

    const updated = await prisma.schoolNews.update({ where: { id }, data });
    if (data.image && data.image !== existing.image) {
      await deleteUploadFileByUrl(existing.image);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('School news update error:', error);
    return NextResponse.json({ error: error.message || 'Unable to update school news' }, { status: 400 });
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
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'School news id is required' }, { status: 400 });
  }

  const existing = await prisma.schoolNews.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: true });
  }

  await prisma.schoolNews.delete({ where: { id } });
  await deleteUploadFileByUrl(existing.image);

  return NextResponse.json({ ok: true });
}
