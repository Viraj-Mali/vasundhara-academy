import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.committee.findMany({ include: { members: { orderBy: { order: 'asc' } } }, orderBy: { name: 'asc' } });
  return NextResponse.json(data);
}
