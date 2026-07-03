import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { createLocalDocument, deleteLocalDocument, listLocalDocuments, updateLocalDocument } from '@/lib/localDocumentStore';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';
import {
  categoryForComprehensiveRow,
  isPdfUrl,
  mapComprehensiveRows,
  rowForComprehensiveKey,
} from '@/lib/comprehensiveInformationConfig';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const pdfMimeTypes = new Set(['application/pdf', 'application/x-pdf']);

function hasPdfExtension(fileName = '') {
  return fileName.toLowerCase().endsWith('.pdf');
}

function isValidPdfMetadata(fileName = '', mimeType = '') {
  const normalizedMimeType = mimeType.toLowerCase();
  if (!hasPdfExtension(fileName)) return false;
  return !normalizedMimeType || pdfMimeTypes.has(normalizedMimeType) || normalizedMimeType === 'application/octet-stream';
}

async function listDocuments() {
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

async function findDocumentForRow(rowKey) {
  const category = categoryForComprehensiveRow(rowKey);
  const documents = await listDocuments();
  return documents.find((doc) => doc.category === category) || null;
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const documents = await listDocuments();
  return NextResponse.json({ rows: mapComprehensiveRows(documents) }, { headers: noStoreHeaders });
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const body = await req.json().catch(() => ({}));
  const rowKey = body.rowKey;
  const fileUrl = body.fileUrl?.trim();
  const fileName = body.fileName?.trim();
  const mimeType = body.mimeType?.trim();
  const row = rowForComprehensiveKey(rowKey);

  if (!row) {
    return NextResponse.json({ error: 'Invalid comprehensive information row' }, { status: 400 });
  }
  if (!fileUrl) {
    return NextResponse.json({ error: 'Please upload a PDF file first' }, { status: 400 });
  }
  if (!isPdfUrl(fileUrl) && !isValidPdfMetadata(fileName, mimeType)) {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
  }

  const category = categoryForComprehensiveRow(rowKey);
  const existing = await findDocumentForRow(rowKey);
  const data = {
    title: row.title,
    category,
    fileUrl,
  };

  if (isLocalDevWithoutDatabase()) {
    const document = existing
      ? await updateLocalDocument(existing.id, data)
      : await createLocalDocument(data);
    if (existing?.fileUrl && existing.fileUrl !== fileUrl) {
      await deleteUploadFileByUrl(existing.fileUrl);
    }
    const rows = mapComprehensiveRows(await listLocalDocuments());
    return NextResponse.json({ document, rows }, { headers: noStoreHeaders });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ document: data, rows: mapComprehensiveRows([data]) }, { headers: noStoreHeaders });
  }

  const document = existing
    ? await prisma.document.update({ where: { id: existing.id }, data })
    : await prisma.document.create({ data });

  if (existing?.fileUrl && existing.fileUrl !== fileUrl) {
    await deleteUploadFileByUrl(existing.fileUrl);
  }

  const rows = mapComprehensiveRows(await listDocuments());
  return NextResponse.json({ document, rows }, { headers: noStoreHeaders });
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const { searchParams } = new URL(req.url);
  const rowKey = searchParams.get('rowKey');
  const row = rowForComprehensiveKey(rowKey);

  if (!row) {
    return NextResponse.json({ error: 'Invalid comprehensive information row' }, { status: 400 });
  }

  const existing = await findDocumentForRow(rowKey);
  if (!existing) {
    const rows = mapComprehensiveRows(await listDocuments());
    return NextResponse.json({ ok: true, rows }, { headers: noStoreHeaders });
  }

  if (isLocalDevWithoutDatabase()) {
    await deleteLocalDocument(existing.id);
    if (existing.fileUrl) {
      await deleteUploadFileByUrl(existing.fileUrl);
    }
    const rows = mapComprehensiveRows(await listLocalDocuments());
    return NextResponse.json({ ok: true, rows }, { headers: noStoreHeaders });
  }

  if (process.env.DATABASE_URL) {
    await prisma.document.delete({ where: { id: existing.id } });
    if (existing.fileUrl) {
      await deleteUploadFileByUrl(existing.fileUrl);
    }
  }

  const rows = mapComprehensiveRows(await listDocuments());
  return NextResponse.json({ ok: true, rows }, { headers: noStoreHeaders });
}
