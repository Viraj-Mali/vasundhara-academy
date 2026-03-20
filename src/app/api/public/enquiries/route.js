import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

// Public API — receives enquiry form from website (no auth needed)
export async function POST(req) {
  try {
    const body = await req.json();
    const data = await prisma.enquiry.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        subject: body.subject || null,
        message: body.message,
      },
    });

    await logActivity('create', 'enquiry', body.name, `New enquiry: ${body.subject || 'General'}`);

    // Email notification log
    try {
      await prisma.activityLog.create({
        data: {
          action: 'create',
          entityType: 'email-alert',
          entityName: `New enquiry: ${body.name}`,
          description: `📧 Email notification for new enquiry from ${body.name} (${body.phone}) — ${body.subject || 'General'}`,
          userId: 'system',
        },
      });
    } catch (e) { /* silent */ }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
