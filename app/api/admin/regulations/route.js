import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const regulations = await prisma.regulation.findMany({
      orderBy: { code: 'asc' }
    });

    return NextResponse.json({ regulations });
  } catch (error) {
    console.error('Fetch regulations error:', error);
    return NextResponse.json({ error: 'An error occurred fetching regulations' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code || code.trim() === '') {
      return NextResponse.json({ error: 'Regulation code is required' }, { status: 400 });
    }

    const trimmedCode = code.trim();

    // Check if duplicate
    const existing = await prisma.regulation.findUnique({
      where: { code: trimmedCode }
    });

    if (existing) {
      return NextResponse.json({ error: 'Regulation code already exists' }, { status: 400 });
    }

    const regulation = await prisma.regulation.create({
      data: { code: trimmedCode }
    });

    return NextResponse.json({ success: true, regulation });
  } catch (error) {
    console.error('Create regulation error:', error);
    return NextResponse.json({ error: 'An error occurred creating regulation' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing regulation ID' }, { status: 400 });
    }

    await prisma.regulation.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Regulation deleted successfully' });
  } catch (error) {
    console.error('Delete regulation error:', error);
    return NextResponse.json({ error: 'An error occurred deleting regulation' }, { status: 500 });
  }
}
