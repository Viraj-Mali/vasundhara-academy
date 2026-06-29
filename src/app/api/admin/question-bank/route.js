import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth';
import { deleteUploadFileByUrl } from '@/lib/uploadStorage';
import {
  isValidQuestionBankClass,
  storeQuestionBankPdf,
  validateQuestionBankPdf,
} from '@/lib/questionBankUpload';

function parseBoolean(value, fallback = true) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return fallback;
}

function validateFields({ title, className }) {
  if (!title?.trim()) return 'Title is required';
  if (!isValidQuestionBankClass(className)) return 'Class must be between Class 5 and Class 10';
  return null;
}

export async function GET() {
  const auth = await checkAdminAuth();
  if (auth) return auth;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json([]);
  }

  const data = await prisma.questionBank.findMany({
    orderBy: [{ className: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(data);
}

export async function POST(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get('title')?.trim();
    const className = formData.get('className');
    const pdfFile = formData.get('pdfFile');

    const validationError = validateFields({ title, className }) || validateQuestionBankPdf(pdfFile);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const upload = await storeQuestionBankPdf(pdfFile);
    const item = await prisma.questionBank.create({
      data: {
        title,
        className,
        pdfUrl: upload.url,
        isActive: parseBoolean(formData.get('isActive'), true),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Question Bank create error:', error);
    return NextResponse.json({ error: error.message || 'Unable to create Question Bank PDF' }, { status: 400 });
  }
}

export async function PATCH(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const id = formData.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Question Bank id is required' }, { status: 400 });
    }

    const existing = await prisma.questionBank.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Question Bank PDF not found' }, { status: 404 });
    }

    const title = formData.get('title')?.trim();
    const className = formData.get('className');
    const pdfFile = formData.get('pdfFile');

    const validationError = validateFields({ title, className }) || validateQuestionBankPdf(pdfFile, false);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const data = {
      title,
      className,
      isActive: parseBoolean(formData.get('isActive'), existing.isActive),
    };

    if (pdfFile && typeof pdfFile !== 'string' && pdfFile.size > 0) {
      const upload = await storeQuestionBankPdf(pdfFile);
      data.pdfUrl = upload.url;
    }

    const updated = await prisma.questionBank.update({ where: { id }, data });
    if (data.pdfUrl && data.pdfUrl !== existing.pdfUrl) {
      await deleteUploadFileByUrl(existing.pdfUrl);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Question Bank update error:', error);
    return NextResponse.json({ error: error.message || 'Unable to update Question Bank PDF' }, { status: 400 });
  }
}

export async function PUT(req) {
  return PATCH(req);
}

export async function DELETE(req) {
  const auth = await checkAdminAuth();
  if (auth) return auth;
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Question Bank id is required' }, { status: 400 });
  }

  const existing = await prisma.questionBank.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: true });
  }

  await prisma.questionBank.delete({ where: { id } });
  await deleteUploadFileByUrl(existing.pdfUrl);

  return NextResponse.json({ ok: true });
}
