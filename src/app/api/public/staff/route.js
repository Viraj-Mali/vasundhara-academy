import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.staff.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(data);
}
