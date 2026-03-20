import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

// Public contact form — saves to DB + logs activity
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Name, phone, and message are required' }, { status: 400 });
    }

    const data = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email: email || null,
        subject: subject || 'Contact Form',
        message,
      },
    });

    await logActivity('create', 'enquiry', name, `Contact form submission: ${subject || 'General'}`);

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
