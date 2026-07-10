import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const branches = await prisma.branch.findMany({
      include: {
        degree: true,
        _count: {
          select: { subjects: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ branches });
  } catch (error) {
    console.error('Fetch branches error:', error);
    return NextResponse.json({ error: 'An error occurred fetching branches' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, degreeId, department } = await req.json();

    if (!name || !degreeId || !department || name.trim() === '' || department.trim() === '') {
      return NextResponse.json({ error: 'Name, Degree, and Department are required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedDept = department.trim();

    // Check if branch name already exists for this degree
    const existing = await prisma.branch.findUnique({
      where: {
        degreeId_name: {
          degreeId,
          name: trimmedName
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Branch name already exists for this degree' }, { status: 400 });
    }

    const branch = await prisma.branch.create({
      data: {
        name: trimmedName,
        degreeId,
        department: trimmedDept
      },
      include: {
        degree: true
      }
    });

    return NextResponse.json({ success: true, branch });
  } catch (error) {
    console.error('Create branch error:', error);
    return NextResponse.json({ error: 'An error occurred creating branch' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing branch ID' }, { status: 400 });
    }

    await prisma.branch.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Delete branch error:', error);
    return NextResponse.json({ error: 'An error occurred deleting branch' }, { status: 500 });
  }
}
