import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { createLocalDocument, deleteLocalDocument, listLocalDocuments, updateLocalDocument } from '@/lib/localDocumentStore';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

function isPdfUrl(fileUrl) {
  return typeof fileUrl === 'string' && fileUrl.trim().toLowerCase().split('?')[0].endsWith('.pdf');
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
  const fileUrl = body.fileUrl?.trim();

  if (!title) {
    return NextResponse.json({ error: 'Document title is required' }, { status: 400 });
  }
  if (!fileUrl) {
    return NextResponse.json({ error: 'Please upload a document file first' }, { status: 400 });
  }
  if (!isPdfUrl(fileUrl)) {
    return NextResponse.json({ error: 'Only PDF files are allowed for Public Disclosures' }, { status: 400 });
  }

  const data = { title, category, fileUrl };

  if (isLocalDevWithoutDatabase()) {
    const document = await createLocalDocument(data);
    return NextResponse.json(document, { headers: noStoreHeaders });
  }

  const document = await prisma.document.create({ data });
  return NextResponse.json(document, { headers: noStoreHeaders });
}

export async function PUT(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const body = await req.json();
  const id = body.id;
  const title = body.title?.trim();
  const category = body.category || 'affiliation';
  const fileUrl = body.fileUrl?.trim();

  if (!id) {
    return NextResponse.json({ error: 'Document id is required' }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: 'Document title is required' }, { status: 400 });
  }
  if (!fileUrl) {
    return NextResponse.json({ error: 'Please upload a document file first' }, { status: 400 });
  }
  if (!isPdfUrl(fileUrl)) {
    return NextResponse.json({ error: 'Only PDF files are allowed for Public Disclosures' }, { status: 400 });
  }

  if (isLocalDevWithoutDatabase()) {
    const docs = await listLocalDocuments();
    const oldDocument = docs.find((doc) => doc.id === id);
    const document = await updateLocalDocument(id, { title, category, fileUrl });
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    if (oldDocument?.fileUrl && oldDocument.fileUrl !== fileUrl) {
      await deleteUploadFileByUrl(oldDocument.fileUrl);
    }
    return NextResponse.json(document, { headers: noStoreHeaders });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ id, title, category, fileUrl }, { headers: noStoreHeaders });
  }

  const oldDocument = await prisma.document.findUnique({ where: { id } });
  const document = await prisma.document.update({
    where: { id },
    data: { title, category, fileUrl },
  });
  if (oldDocument?.fileUrl && oldDocument.fileUrl !== fileUrl) {
    await deleteUploadFileByUrl(oldDocument.fileUrl);
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
      await deleteUploadFileByUrl(oldDocument.fileUrl);
    }
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
  }
  const oldDocument = await prisma.document.findUnique({ where: { id } });
  await prisma.document.delete({ where: { id } });
  if (oldDocument?.fileUrl) {
    await deleteUploadFileByUrl(oldDocument.fileUrl);
  }
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
}
