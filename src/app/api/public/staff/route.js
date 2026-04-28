import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.staff.findMany({ orderBy: { order: 'asc' } });
  
  // Clean up subjects that shouldn't be displayed as a badge (e.g., 'Admin', 'Library')
  const cleanedData = data.map(staff => {
    if (staff.designation === 'Principal' || staff.designation === 'Librarian') {
      return { ...staff, subject: null };
    }
    return staff;
  });

  return NextResponse.json(cleanedData);
}
