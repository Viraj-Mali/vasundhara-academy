import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isLocalDevWithoutDatabase } from '@/lib/localDev';
import { listLocalDocuments } from '@/lib/localDocumentStore';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

export async function GET() {
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
