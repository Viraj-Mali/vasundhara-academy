import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import {
  createLocalGalleryImage,
  deleteLocalGalleryImages,
  hideLocalStaticGalleryImages,
  listLocalGalleryImages,
  listLocalHiddenStaticGalleryIds,
} from '@/lib/localGalleryStore';
import {
  excludeHiddenStaticGalleryImages,
  getStaticGalleryImages,
  mergeGalleryImages,
  parseHiddenStaticGalleryIds,
  STATIC_GALLERY_HIDDEN_SLUG,
} from '@/lib/staticGallery';

async function getHiddenStaticIds() {
  if (isLocalDevWithoutDatabase()) {
    return new Set(await listLocalHiddenStaticGalleryIds());
  }
  if (!process.env.DATABASE_URL) return new Set();
  const record = await prisma.pageContent.findUnique({
    where: { pageSlug: STATIC_GALLERY_HIDDEN_SLUG },
    select: { content: true },
  });
  return parseHiddenStaticGalleryIds(record?.content);
}

async function hideStaticImages(ids) {
  if (ids.length === 0) return;
  if (isLocalDevWithoutDatabase()) {
    await hideLocalStaticGalleryImages(ids);
    return;
  }
  if (!process.env.DATABASE_URL) return;
  const hiddenIds = await getHiddenStaticIds();
  ids.forEach((id) => hiddenIds.add(String(id)));
  await prisma.pageContent.upsert({
    where: { pageSlug: STATIC_GALLERY_HIDDEN_SLUG },
    create: {
      pageSlug: STATIC_GALLERY_HIDDEN_SLUG,
      title: 'Hidden static gallery images',
      content: JSON.stringify({ ids: [...hiddenIds] }),
    },
    update: { content: JSON.stringify({ ids: [...hiddenIds] }) },
  });
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const [allStaticImages, hiddenStaticIds] = await Promise.all([
    getStaticGalleryImages(),
    getHiddenStaticIds(),
  ]);
  const staticImages = excludeHiddenStaticGalleryImages(allStaticImages, hiddenStaticIds);
  if (isLocalDevWithoutDatabase()) {
    const data = await listLocalGalleryImages({ includeAll: true });
    return NextResponse.json(mergeGalleryImages(data, staticImages));
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(staticImages);
  }
  const data = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(mergeGalleryImages(data, staticImages));
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { url, title, category } = await req.json();
  if (isLocalDevWithoutDatabase()) {
    const newImage = await createLocalGalleryImage({ url, title, category });
    return NextResponse.json(newImage);
  }
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
  const requestedIds = (ids ? ids.split(',') : id ? [id] : []).filter(Boolean);
  const staticIds = requestedIds.filter((itemId) => itemId.startsWith('static-'));
  const deletableIds = requestedIds.filter((itemId) => !itemId.startsWith('static-'));
  if (isLocalDevWithoutDatabase()) {
    await Promise.all([
      hideStaticImages(staticIds),
      deleteLocalGalleryImages({ id: deletableIds[0] || null, ids: deletableIds.length > 1 ? deletableIds : null }),
    ]);
    return NextResponse.json({ ok: true });
  }
  await Promise.all([
    hideStaticImages(staticIds),
    deletableIds.length > 0
      ? prisma.galleryImage.deleteMany({ where: { id: { in: deletableIds } } })
      : Promise.resolve(),
  ]);
  return NextResponse.json({ ok: true });
}
