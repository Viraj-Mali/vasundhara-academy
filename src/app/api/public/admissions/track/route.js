import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const admission = await prisma.admission.findUnique({
      where: { id },
      select: {
        id: true,
        studentName: true,
        grade: true,
        status: true,
        createdAt: true,
      }
    });

    if (!admission) {
      return NextResponse.json({ error: 'Application not found. Please check your ID.' }, { status: 404 });
    }

    return NextResponse.json(admission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track application' }, { status: 500 });
  }
}
