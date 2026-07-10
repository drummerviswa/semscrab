import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const branchId = url.searchParams.get('branchId') || '';
    const regulationId = url.searchParams.get('regulationId') || '';

    const where = {};
    if (branchId && branchId !== '') where.branchId = branchId;
    if (regulationId && regulationId !== '') where.regulationId = regulationId;

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        branch: {
          include: { degree: true }
        },
        regulation: true
      },
      orderBy: { code: 'asc' }
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Fetch subjects error:', error);
    return NextResponse.json({ error: 'An error occurred fetching subjects' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code, title, credits, branchId, regulationId } = await req.json();

    if (!code || !title || isNaN(parseInt(credits)) || !branchId || !regulationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.subject.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (existing) {
      return NextResponse.json({ error: 'Subject code already exists' }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        code: code.toUpperCase().trim(),
        title: title.trim(),
        credits: parseInt(credits),
        branchId,
        regulationId
      },
      include: {
        branch: {
          include: { degree: true }
        },
        regulation: true
      }
    });

    return NextResponse.json({ success: true, subject });
  } catch (error) {
    console.error('Create subject error:', error);
    return NextResponse.json({ error: 'An error occurred creating subject' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, code, title, credits, branchId, regulationId } = await req.json();

    if (!id || !code || !title || isNaN(parseInt(credits)) || !branchId || !regulationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        code: code.toUpperCase().trim(),
        title: title.trim(),
        credits: parseInt(credits),
        branchId,
        regulationId
      },
      include: {
        branch: {
          include: { degree: true }
        },
        regulation: true
      }
    });

    return NextResponse.json({ success: true, subject });
  } catch (error) {
    console.error('Update subject error:', error);
    return NextResponse.json({ error: 'An error occurred updating subject' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing subject ID' }, { status: 400 });
    }

    await prisma.subject.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    return NextResponse.json({ error: 'An error occurred deleting subject' }, { status: 500 });
  }
}
