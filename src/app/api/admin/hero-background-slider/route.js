import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';
import { optimizeAndStoreHeroSliderImage } from '@/lib/heroSliderImage';

function parseBoolean(value, fallback = true) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
}

function parseOrder(value) {
  const order = Number.parseInt(value, 10);
  return Number.isFinite(order) ? order : 0;
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json([]);
  }

  const images = await prisma.heroBackgroundSlider.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(images);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const upload = await optimizeAndStoreHeroSliderImage(file);

    const image = await prisma.heroBackgroundSlider.create({
      data: {
        image: upload.url,
        displayOrder: parseOrder(formData.get('displayOrder')),
        isActive: parseBoolean(formData.get('isActive'), true),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Hero slider create error:', error);
    return NextResponse.json({ error: error.message || 'Unable to create slider image' }, { status: 400 });
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
      return NextResponse.json({ error: 'Slider image id is required' }, { status: 400 });
    }

    const existing = await prisma.heroBackgroundSlider.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Slider image not found' }, { status: 404 });
    }

    const data = {
      displayOrder: parseOrder(formData.get('displayOrder') ?? existing.displayOrder),
      isActive: parseBoolean(formData.get('isActive'), existing.isActive),
    };

    const replacement = formData.get('image');
    if (replacement && replacement.size > 0) {
      const upload = await optimizeAndStoreHeroSliderImage(replacement);
      data.image = upload.url;
    }

    const updated = await prisma.heroBackgroundSlider.update({
      where: { id },
      data,
    });

    if (data.image && existing.image !== data.image) {
      await deleteUploadFileByUrl(existing.image);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Hero slider update error:', error);
    return NextResponse.json({ error: error.message || 'Unable to update slider image' }, { status: 400 });
  }
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
    return NextResponse.json({ error: 'Slider image id is required' }, { status: 400 });
  }

  const existing = await prisma.heroBackgroundSlider.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: true });
  }

  await prisma.heroBackgroundSlider.delete({ where: { id } });
  await deleteUploadFileByUrl(existing.image);

  return NextResponse.json({ ok: true });
}
