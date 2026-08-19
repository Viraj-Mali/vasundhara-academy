import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { listLocalGalleryImages } from '@/lib/localGalleryStore';
import {
  EXCLUDED_FROM_PUBLIC_GALLERY,
  excludeHiddenStaticGalleryImages,
  filterGalleryImages,
  getStaticGalleryImages,
  mergeGalleryImages,
  parseHiddenStaticGalleryIds,
  STATIC_GALLERY_HIDDEN_SLUG,
} from '@/lib/staticGallery';
import { listLocalHiddenStaticGalleryIds } from '@/lib/localGalleryStore';

async function getVisibleStaticImages() {
  const staticImages = await getStaticGalleryImages();
  if (isLocalDevWithoutDatabase()) {
    return excludeHiddenStaticGalleryImages(staticImages, await listLocalHiddenStaticGalleryIds());
  }
  if (!process.env.DATABASE_URL) return staticImages;
  const record = await prisma.pageContent.findUnique({
    where: { pageSlug: STATIC_GALLERY_HIDDEN_SLUG },
    select: { content: true },
  });
  return excludeHiddenStaticGalleryImages(staticImages, parseHiddenStaticGalleryIds(record?.content));
}

function mapDisclosureDocument(document) {
  return {
    id: document.id,
    title: document.title || '',
    url: document.fileUrl,
    category: 'mandatory-disclosure',
    order: document.order || 0,
    createdAt: document.createdAt,
    source: 'document',
  };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const includeAll = searchParams.get('all') === 'true';

  const staticImages = await getVisibleStaticImages();

  const where = {};
  if (category) where.category = category;
  else if (!includeAll) where.NOT = { category: { in: EXCLUDED_FROM_PUBLIC_GALLERY } };

  if (isLocalDevWithoutDatabase()) {
    const localImages = await listLocalGalleryImages({ includeAll: true });
    return NextResponse.json(filterGalleryImages(mergeGalleryImages(localImages, staticImages), { category, includeAll }));
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(filterGalleryImages(staticImages, { category, includeAll }));
  }

  const data = await prisma.galleryImage.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  if (category === 'mandatory-disclosure') {
    const documents = await prisma.document.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    const disclosureItems = [
      ...data,
      ...documents.filter((document) => document.fileUrl).map(mapDisclosureDocument),
    ];
    return NextResponse.json(filterGalleryImages(mergeGalleryImages(disclosureItems, staticImages), { category, includeAll }));
  }

  return NextResponse.json(filterGalleryImages(mergeGalleryImages(data, staticImages), { category, includeAll }));
}
