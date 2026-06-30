import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import {
  PUBLIC_DISCLOSURE_INFO_SLUG,
  normalizePublicDisclosureInfo,
} from '@/lib/publicDisclosureConfig';
import {
  readLocalPublicDisclosureInfo,
  writeLocalPublicDisclosureInfo,
} from '@/lib/localPublicDisclosureInfoStore';

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

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const info = await readInfo();
  return NextResponse.json({ info }, { headers: noStoreHeaders });
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const body = await req.json().catch(() => ({}));
  const info = normalizePublicDisclosureInfo(body.info || body);

  if (isLocalDevWithoutDatabase()) {
    const saved = await writeLocalPublicDisclosureInfo(info);
    return NextResponse.json({ info: saved }, { headers: noStoreHeaders });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ info }, { headers: noStoreHeaders });
  }

  await prisma.pageContent.upsert({
    where: { pageSlug: PUBLIC_DISCLOSURE_INFO_SLUG },
    update: {
      title: 'Public Disclosures',
      content: JSON.stringify(info),
    },
    create: {
      pageSlug: PUBLIC_DISCLOSURE_INFO_SLUG,
      title: 'Public Disclosures',
      content: JSON.stringify(info),
    },
  });

  return NextResponse.json({ info }, { headers: noStoreHeaders });
}
