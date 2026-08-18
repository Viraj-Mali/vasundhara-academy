import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { createLocalDocument, deleteLocalDocument, listLocalDocuments, updateLocalDocument } from '@/lib/localDocumentStore';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';
import { appendixDocumentCategories } from '@/lib/publicDisclosureConfig';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };
const pdfMimeTypes = new Set(['application/pdf', 'application/x-pdf']);

function isPdfUrl(fileUrl) {
  return typeof fileUrl === 'string' && fileUrl.trim().toLowerCase().split('?')[0].endsWith('.pdf');
}

function hasPdfExtension(fileName = '') {
  return fileName.toLowerCase().endsWith('.pdf');
}

function isValidPdfMetadata(fileName = '', mimeType = '') {
  const normalizedMimeType = mimeType.toLowerCase();
  if (!hasPdfExtension(fileName)) return false;
  return !normalizedMimeType || pdfMimeTypes.has(normalizedMimeType) || normalizedMimeType === 'application/octet-stream';
}

function isFixedCategory(category = '') {
  return appendixDocumentCategories.includes(category);
}

async function isKnownDocumentUrl(fileUrl) {
  if (!fileUrl) return false;
  if (isLocalDevWithoutDatabase()) {
    const documents = await listLocalDocuments();
    return documents.some((document) => document.fileUrl === fileUrl);
  }
  if (!process.env.DATABASE_URL) return false;
  return Boolean(await prisma.document.findFirst({ where: { fileUrl }, select: { id: true } }));
}

async function validatePdfReference({ fileUrl, fileName, mimeType, unchanged = false }) {
  if (!fileUrl || unchanged || isPdfUrl(fileUrl) || isValidPdfMetadata(fileName, mimeType)) return null;
  if (await isKnownDocumentUrl(fileUrl)) return null;
  return 'Only PDF files are allowed for Public Disclosures';
}

async function deleteUploadIfUnreferenced(fileUrl, excludedId) {
  if (!fileUrl) return;
  if (isLocalDevWithoutDatabase()) {
    const documents = await listLocalDocuments();
    if (documents.some((document) => document.id !== excludedId && document.fileUrl === fileUrl)) return;
  } else if (process.env.DATABASE_URL) {
    const reference = await prisma.document.findFirst({
      where: { fileUrl, ...(excludedId ? { id: { not: excludedId } } : {}) },
      select: { id: true },
    });
    if (reference) return;
  }
  await deleteUploadFileByUrl(fileUrl);
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (isLocalDevWithoutDatabase()) {
    const data = await listLocalDocuments();
    return NextResponse.json(data, { headers: noStoreHeaders });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json([], { headers: noStoreHeaders });
  }
  const data = await prisma.document.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  return NextResponse.json(data, { headers: noStoreHeaders });
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const body = await req.json();
  const title = body.title?.trim();
  const category = body.category || 'affiliation';
  const fileUrl = body.fileUrl?.trim() || '';
  const fileName = body.fileName?.trim();
  const mimeType = body.mimeType?.trim();

  if (!title) {
    return NextResponse.json({ error: 'Document title is required' }, { status: 400 });
  }
  const fixedCategory = isFixedCategory(category);
  if (!fileUrl && !fixedCategory) {
    return NextResponse.json({ error: 'Please upload a document file first' }, { status: 400 });
  }
  const pdfError = await validatePdfReference({ fileUrl, fileName, mimeType });
  if (pdfError) {
    return NextResponse.json({ error: pdfError }, { status: 400 });
  }

  const order = typeof body.order === 'number' ? body.order : parseInt(body.order) || 0;
  const data = { title, category, fileUrl, order };

  if (isLocalDevWithoutDatabase()) {
    if (fixedCategory) {
      const documents = await listLocalDocuments();
      const existing = documents.find((document) => document.category === category);
      if (existing) {
        const document = await updateLocalDocument(existing.id, data);
        return NextResponse.json(document, { headers: noStoreHeaders });
      }
    }
    const document = await createLocalDocument(data);
    return NextResponse.json(document, { headers: noStoreHeaders });
  }

  const existing = fixedCategory
    ? await prisma.document.findFirst({ where: { category }, orderBy: { createdAt: 'desc' } })
    : null;
  const document = existing
    ? await prisma.document.update({ where: { id: existing.id }, data })
    : await prisma.document.create({ data });
  if (existing?.fileUrl && existing.fileUrl !== fileUrl) {
    await deleteUploadIfUnreferenced(existing.fileUrl, existing.id);
  }
  return NextResponse.json(document, { headers: noStoreHeaders });
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const body = await req.json();
  const id = body.id;
  const title = body.title?.trim();
  const category = body.category || 'affiliation';
  const fileUrl = body.fileUrl?.trim() || '';
  const fileName = body.fileName?.trim();
  const mimeType = body.mimeType?.trim();

  if (!id) {
    return NextResponse.json({ error: 'Document id is required' }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: 'Document title is required' }, { status: 400 });
  }
  const fixedCategory = isFixedCategory(category);
  if (!fileUrl && !fixedCategory) {
    return NextResponse.json({ error: 'Please upload a document file first' }, { status: 400 });
  }

  const order = typeof body.order === 'number' ? body.order : parseInt(body.order) || 0;

  if (isLocalDevWithoutDatabase()) {
    const docs = await listLocalDocuments();
    const oldDocument = docs.find((doc) => doc.id === id);
    const pdfError = await validatePdfReference({
      fileUrl,
      fileName,
      mimeType,
      unchanged: oldDocument?.fileUrl === fileUrl,
    });
    if (pdfError) return NextResponse.json({ error: pdfError }, { status: 400 });
    const document = await updateLocalDocument(id, { title, category, fileUrl, order });
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    if (oldDocument?.fileUrl && oldDocument.fileUrl !== fileUrl) {
      await deleteUploadIfUnreferenced(oldDocument.fileUrl, id);
    }
    return NextResponse.json(document, { headers: noStoreHeaders });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ id, title, category, fileUrl, order }, { headers: noStoreHeaders });
  }

  const oldDocument = await prisma.document.findUnique({ where: { id } });
  const pdfError = await validatePdfReference({
    fileUrl,
    fileName,
    mimeType,
    unchanged: oldDocument?.fileUrl === fileUrl,
  });
  if (pdfError) return NextResponse.json({ error: pdfError }, { status: 400 });
  const document = await prisma.document.update({
    where: { id },
    data: { title, category, fileUrl, order },
  });
  if (oldDocument?.fileUrl && oldDocument.fileUrl !== fileUrl) {
    await deleteUploadIfUnreferenced(oldDocument.fileUrl, id);
  }
  return NextResponse.json(document, { headers: noStoreHeaders });
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Document id is required' }, { status: 400 });
  }
  if (isLocalDevWithoutDatabase()) {
    const docs = await listLocalDocuments();
    const oldDocument = docs.find((doc) => doc.id === id);
    await deleteLocalDocument(id);
    if (oldDocument?.fileUrl) {
      await deleteUploadIfUnreferenced(oldDocument.fileUrl, id);
    }
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
  }
  const oldDocument = await prisma.document.findUnique({ where: { id } });
  await prisma.document.delete({ where: { id } });
  if (oldDocument?.fileUrl) {
    await deleteUploadIfUnreferenced(oldDocument.fileUrl, id);
  }
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
}
