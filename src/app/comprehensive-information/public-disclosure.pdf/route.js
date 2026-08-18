import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { listLocalDocuments } from '@/lib/localDocumentStore';
import { readLocalPublicDisclosureInfo } from '@/lib/localPublicDisclosureInfoStore';
import {
  PUBLIC_DISCLOSURE_INFO_SLUG,
  normalizePublicDisclosureInfo,
} from '@/lib/publicDisclosureConfig';
import { buildPublicDisclosurePdf } from '@/lib/publicDisclosurePdf';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function readInfo() {
  if (isLocalDevWithoutDatabase()) return readLocalPublicDisclosureInfo();
  if (!process.env.DATABASE_URL) return normalizePublicDisclosureInfo();
  const record = await prisma.pageContent.findUnique({ where: { pageSlug: PUBLIC_DISCLOSURE_INFO_SLUG } });
  if (!record?.content) return normalizePublicDisclosureInfo();
  try {
    return normalizePublicDisclosureInfo(JSON.parse(record.content));
  } catch {
    return normalizePublicDisclosureInfo();
  }
}

async function readDocuments() {
  if (isLocalDevWithoutDatabase()) return listLocalDocuments();
  if (!process.env.DATABASE_URL) return [];
  return prisma.document.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
}

export async function GET(request) {
  try {
    const [info, documents] = await Promise.all([readInfo(), readDocuments()]);
    const pdf = await buildPublicDisclosurePdf({
      info,
      documents,
      origin: new URL(request.url).origin,
    });
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="public-disclosure.pdf"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
      },
    });
  } catch (error) {
    console.error('Public Disclosure PDF generation failed:', error);
    return NextResponse.json({ error: 'Unable to generate Public Disclosures PDF' }, { status: 500 });
  }
}
