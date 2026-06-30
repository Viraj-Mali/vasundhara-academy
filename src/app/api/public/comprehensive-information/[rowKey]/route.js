import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { listLocalDocuments } from '@/lib/localDocumentStore';
import { filenameFromUploadUrl, readUploadFile } from '@/lib/uploadStorage';
import {
  categoryForComprehensiveRow,
  rowForComprehensiveKey,
} from '@/lib/comprehensiveInformationConfig';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function pdfResponse(buffer, filename = 'comprehensive-information.pdf') {
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename.replace(/"/g, '')}"`,
      'Cache-Control': 'public, max-age=300',
    },
  });
}

function normalizeCloudinaryPdfUrl(url) {
  if (!url || !url.includes('res.cloudinary.com') || !url.toLowerCase().includes('.pdf')) return url;
  return url.replace('/image/upload/', '/raw/upload/');
}

async function findDocument(rowKey) {
  const row = rowForComprehensiveKey(rowKey);
  if (!row) return null;

  const category = categoryForComprehensiveRow(rowKey);

  if (isLocalDevWithoutDatabase()) {
    const documents = await listLocalDocuments();
    return documents.find((doc) => doc.category === category) || null;
  }

  if (!process.env.DATABASE_URL) return null;

  return prisma.document.findFirst({
    where: { category },
    orderBy: { createdAt: 'desc' },
  });
}

export async function GET(_req, { params }) {
  const doc = await findDocument(params.rowKey);

  if (!doc?.fileUrl) {
    return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
  }

  if (doc.fileUrl.startsWith('/uploads/')) {
    const filename = filenameFromUploadUrl(doc.fileUrl);
    const file = await readUploadFile(filename);
    return pdfResponse(file.buffer, file.filename);
  }

  const urlsToTry = [...new Set([normalizeCloudinaryPdfUrl(doc.fileUrl), doc.fileUrl].filter(Boolean))];

  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      const contentType = response.headers.get('content-type') || '';
      const isPdfLike =
        contentType.toLowerCase().includes('pdf') ||
        url.toLowerCase().includes('/raw/upload/') ||
        url.toLowerCase().endsWith('.pdf');
      if (response.ok && isPdfLike) {
        const buffer = Buffer.from(await response.arrayBuffer());
        const filename = `${(doc.title || 'comprehensive-information').replace(/[^a-z0-9-]+/gi, '-')}.pdf`;
        return pdfResponse(buffer, filename);
      }
    } catch {
      // Try the next candidate URL.
    }
  }

  return NextResponse.json({ error: 'PDF could not be opened' }, { status: 404 });
}
