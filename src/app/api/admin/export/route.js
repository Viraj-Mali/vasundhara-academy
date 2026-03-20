import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'admissions';

  let data;
  if (type === 'admissions') {
    data = await prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });
  } else if (type === 'enquiries') {
    data = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } });
  } else if (type === 'alumni') {
    data = await prisma.alumni.findMany({ orderBy: { createdAt: 'desc' } });
  } else if (type === 'staff') {
    data = await prisma.staff.findMany({ orderBy: { order: 'asc' } });
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  // Convert to CSV
  if (!data.length) return new Response('No data', { status: 200, headers: { 'Content-Type': 'text/plain' } });

  const headers = Object.keys(data[0]).filter(k => k !== 'id');
  const csvRows = [headers.join(',')];
  data.forEach(row => {
    const vals = headers.map(h => {
      let v = row[h] ?? '';
      v = String(v).replace(/"/g, '""');
      if (v.includes(',') || v.includes('"') || v.includes('\n')) v = `"${v}"`;
      return v;
    });
    csvRows.push(vals.join(','));
  });

  return new Response(csvRows.join('\n'), {
    status: 200,
    headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="${type}-export.csv"` },
  });
}
