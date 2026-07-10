import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const degrees = await prisma.degree.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ degrees });
  } catch (error) {
    console.error('Fetch degrees error:', error);
    return NextResponse.json({ error: 'An error occurred fetching degrees' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Degree name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if duplicate
    const existing = await prisma.degree.findUnique({
      where: { name: trimmedName }
    });

    if (existing) {
      return NextResponse.json({ error: 'Degree already exists' }, { status: 400 });
    }

    const degree = await prisma.degree.create({
      data: { name: trimmedName }
    });

    return NextResponse.json({ success: true, degree });
  } catch (error) {
    console.error('Create degree error:', error);
    return NextResponse.json({ error: 'An error occurred creating degree' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing degree ID' }, { status: 400 });
    }

    await prisma.degree.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Degree deleted successfully' });
  } catch (error) {
    console.error('Delete degree error:', error);
    return NextResponse.json({ error: 'An error occurred deleting degree' }, { status: 500 });
  }
}
