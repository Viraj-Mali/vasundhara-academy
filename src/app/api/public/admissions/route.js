import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

// Public API — receives admission form from website (no auth needed)
export async function POST(req) {
  try {
    const body = await req.json();
    const data = await prisma.admission.create({
      data: {
        studentName: body.studentName,
        parentName: body.parentName,
        phone: body.phone,
        email: body.email || null,
        grade: body.grade,
        previousSchool: body.previousSchool || null,
        address: body.address || null,
        message: body.message || null,
      },
    });

    await logActivity('create', 'admission', body.studentName, `New admission for Grade ${body.grade}`);

    // Send email notification (non-blocking)
    sendNotificationEmail('admission', body).catch(() => {});

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}

async function sendNotificationEmail(type, data) {
  // Email notification via mailto-style log (works without external service)
  // For production, integrate with services like Resend, SendGrid, or Nodemailer
  try {
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entityType: 'email-alert',
        entityName: `New ${type}: ${data.studentName || data.name}`,
        description: `📧 Email notification would be sent to vasundhara.academy2016@gmail.com for new ${type} from ${data.studentName || data.name} (${data.phone})`,
        userId: 'system',
      },
    });
  } catch (e) { /* silent */ }
}
