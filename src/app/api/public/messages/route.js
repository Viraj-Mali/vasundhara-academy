import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const where = role ? { role } : {};
  const data = await prisma.message.findMany({ where, orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(data);
}
