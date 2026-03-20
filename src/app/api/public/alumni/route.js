import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const data = await prisma.alumni.create({
      data: {
        name: body.name,
        graduateYear: body.graduateYear,
        phone: body.phone || '',
        email: body.email || '',
        occupation: body.occupation || '',
        message: body.message || '',
      }
    });
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
