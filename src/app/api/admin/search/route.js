import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';

export async function GET(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all'; // all, staff, events, admissions, enquiries, blog, notices

  if (!q) return NextResponse.json([]);

  const results = [];
  const search = { contains: q };

  if (type === 'all' || type === 'staff') {
    const staff = await prisma.staff.findMany({ where: { OR: [{ name: search }, { designation: search }] }, take: 5 });
    results.push(...staff.map(s => ({ type: 'staff', id: s.id, title: s.name, subtitle: s.designation, icon: 'fas fa-user' })));
  }
  if (type === 'all' || type === 'admissions') {
    const admissions = await prisma.admission.findMany({ where: { OR: [{ studentName: search }, { parentName: search }, { phone: search }] }, take: 5 });
    results.push(...admissions.map(a => ({ type: 'admission', id: a.id, title: a.studentName, subtitle: `Grade ${a.grade} — ${a.status}`, icon: 'fas fa-user-graduate' })));
  }
  if (type === 'all' || type === 'enquiries') {
    const enquiries = await prisma.enquiry.findMany({ where: { OR: [{ name: search }, { phone: search }, { subject: search }] }, take: 5 });
    results.push(...enquiries.map(e => ({ type: 'enquiry', id: e.id, title: e.name, subtitle: e.subject || 'Enquiry', icon: 'fas fa-question-circle' })));
  }
  if (type === 'all' || type === 'events') {
    const events = await prisma.event.findMany({ where: { OR: [{ title: search }, { description: search }] }, take: 5 });
    results.push(...events.map(e => ({ type: 'event', id: e.id, title: e.title, subtitle: e.category, icon: 'fas fa-calendar' })));
  }
  if (type === 'all' || type === 'blog') {
    const posts = await prisma.blogPost.findMany({ where: { OR: [{ title: search }, { content: search }] }, take: 5 });
    results.push(...posts.map(p => ({ type: 'blog', id: p.id, title: p.title, subtitle: p.category, icon: 'fas fa-newspaper' })));
  }

  return NextResponse.json(results.slice(0, 20));
}
