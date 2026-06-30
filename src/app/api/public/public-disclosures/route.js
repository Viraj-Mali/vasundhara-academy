import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { listLocalDocuments } from '@/lib/localDocumentStore';
import {
  PUBLIC_DISCLOSURE_INFO_SLUG,
  normalizePublicDisclosureInfo,
} from '@/lib/publicDisclosureConfig';
import { readLocalPublicDisclosureInfo } from '@/lib/localPublicDisclosureInfoStore';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

async function readInfo() {
  if (isLocalDevWithoutDatabase()) {
    return readLocalPublicDisclosureInfo();
  }

  if (!process.env.DATABASE_URL) {
    return normalizePublicDisclosureInfo();
  }

  const record = await prisma.pageContent.findUnique({
    where: { pageSlug: PUBLIC_DISCLOSURE_INFO_SLUG },
  });

  if (!record?.content) return normalizePublicDisclosureInfo();

  try {
    return normalizePublicDisclosureInfo(JSON.parse(record.content));
  } catch {
    return normalizePublicDisclosureInfo();
  }
}

async function readDocuments() {
  if (isLocalDevWithoutDatabase()) {
    return listLocalDocuments();
  }

  if (!process.env.DATABASE_URL) {
    return [];
  }

  return prisma.document.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function GET() {
  const [info, documents] = await Promise.all([readInfo(), readDocuments()]);
  return NextResponse.json({ info, documents }, { headers: noStoreHeaders });
}
