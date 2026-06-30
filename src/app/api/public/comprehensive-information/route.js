import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { listLocalDocuments } from '@/lib/localDocumentStore';
import { mapComprehensiveRows } from '@/lib/comprehensiveInformationConfig';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET() {
  if (isLocalDevWithoutDatabase()) {
    const documents = await listLocalDocuments();
    return NextResponse.json({ rows: mapComprehensiveRows(documents) }, { headers: noStoreHeaders });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ rows: mapComprehensiveRows([]) }, { headers: noStoreHeaders });
  }

  const documents = await prisma.document.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ rows: mapComprehensiveRows(documents) }, { headers: noStoreHeaders });
}
