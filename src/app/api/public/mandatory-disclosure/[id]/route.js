import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { listLocalGalleryImages } from '@/lib/localGalleryStore';
import { filenameFromUploadUrl, readUploadFile } from '@/lib/uploadStorage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK_PDF = '1781851904740-Affilation-Letter.pdf';

function pdfResponse(buffer, filename = FALLBACK_PDF) {
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
      'Cache-Control': 'public, max-age=300',
    },
  });
}

async function fallbackPdfResponse() {
  const file = await readUploadFile(FALLBACK_PDF);
  return pdfResponse(file.buffer, file.filename);
}

function normalizeCloudinaryPdfUrl(url) {
  if (!url || !url.includes('res.cloudinary.com') || !url.toLowerCase().includes('.pdf')) return url;
  return url.replace('/image/upload/', '/raw/upload/');
}

async function findDocument(id) {
  if (isLocalDevWithoutDatabase()) {
    const docs = await listLocalGalleryImages({ category: 'mandatory-disclosure', includeAll: true });
    return docs.find((doc) => doc.id === id);
  }

  if (!process.env.DATABASE_URL) return null;

  const galleryDocument = await prisma.galleryImage.findFirst({
    where: { id, category: 'mandatory-disclosure' },
  });
  if (galleryDocument) return galleryDocument;

  const publicDocument = await prisma.document.findUnique({
    where: { id },
  });

  if (!publicDocument?.fileUrl) return null;

  return {
    id: publicDocument.id,
    title: publicDocument.title,
    url: publicDocument.fileUrl,
  };
}

export async function GET(_req, { params }) {
  const doc = await findDocument(params.id);

  if (!doc?.url) {
    return fallbackPdfResponse();
  }

  if (doc.url.startsWith('/uploads/')) {
    try {
      const filename = filenameFromUploadUrl(doc.url);
      const file = await readUploadFile(filename);
      return pdfResponse(file.buffer, file.filename);
    } catch {
      return fallbackPdfResponse();
    }
  }

  const urlsToTry = [...new Set([normalizeCloudinaryPdfUrl(doc.url), doc.url].filter(Boolean))];

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
        const filename = `${(doc.title || 'mandatory-disclosure').replace(/[^a-z0-9-]+/gi, '-')}.pdf`;
        return pdfResponse(buffer, filename);
      }
    } catch {
      // Try the next URL, then fall back to the bundled PDF.
    }
  }

  return fallbackPdfResponse();
}
