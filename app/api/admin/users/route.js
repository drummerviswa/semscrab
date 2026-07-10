import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, hashPassword } from '@/lib/auth';

const normalizeScopeList = (value) => String(value || '')
  .split(/[\n,]+/)
  .map(item => item.trim())
  .filter(Boolean)
  .join(', ');

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        rollNumber: true,
        name: true,
        role: true,
        branch: true,
        batch: true,
        shareWithPR: true,
        prBranch: true,
        prBatch: true,
        createdAt: true,
      },
      orderBy: { rollNumber: 'asc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Admin fetch users error:', error);
    return NextResponse.json({ error: 'An error occurred fetching users' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { rollNumber, name, password, role, branch, batch, shareWithPR, prBranch, prBatch } = await req.json();

    if (!rollNumber || !name || !password || !role || !branch || !batch) {
      return NextResponse.json({ error: 'Roll number, name, password, role, branch, and batch are required' }, { status: 400 });
    }

    const cleanRollNumber = rollNumber.trim().toUpperCase();
    const existing = await prisma.user.findUnique({
      where: { rollNumber: cleanRollNumber },
    });

    if (existing) {
      return NextResponse.json({ error: 'User with this roll number already exists' }, { status: 400 });
    }

    const createdUser = await prisma.user.create({
      data: {
        rollNumber: cleanRollNumber,
        name: name.trim(),
        passwordHash: hashPassword(password),
        role,
        branch: branch.trim(),
        batch: batch.trim(),
        shareWithPR: Boolean(shareWithPR),
        prBranch: role === 'PR' ? normalizeScopeList(prBranch || branch) : null,
        prBatch: role === 'PR' ? (prBatch || batch).trim() : null,
      },
      select: {
        id: true,
        rollNumber: true,
        name: true,
        role: true,
        branch: true,
        batch: true,
        shareWithPR: true,
        prBranch: true,
        prBatch: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: createdUser });
  } catch (error) {
    console.error('Admin create user error:', error);
    return NextResponse.json({ error: 'An error occurred creating user' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { rollNumber, name, password, role, branch, batch, shareWithPR, prBranch, prBatch } = await req.json();

    if (!rollNumber || !name || !role || !branch || !batch) {
      return NextResponse.json({ error: 'Roll number, name, role, branch, and batch are required' }, { status: 400 });
    }

    const cleanRollNumber = rollNumber.trim().toUpperCase();
    const targetUser = await prisma.user.findUnique({
      where: { rollNumber: cleanRollNumber },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData = {
      name: name.trim(),
      role,
      branch: branch.trim(),
      batch: batch.trim(),
      shareWithPR: Boolean(shareWithPR),
      prBranch: role === 'PR' ? normalizeScopeList(prBranch || branch) : null,
      prBatch: role === 'PR' ? (prBatch || batch).trim() : null,
    };

    if (password && password.trim()) {
      updateData.passwordHash = hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { rollNumber: cleanRollNumber },
      data: updateData,
      select: {
        id: true,
        rollNumber: true,
        name: true,
        role: true,
        branch: true,
        batch: true,
        shareWithPR: true,
        prBranch: true,
        prBatch: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'An error occurred updating user' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const url = new URL(req.url);
    const rollNumber = url.searchParams.get('rollNumber');

    if (!rollNumber) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }

    const cleanRollNumber = rollNumber.trim().toUpperCase();

    if (cleanRollNumber === user.rollNumber) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { rollNumber: cleanRollNumber },
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json({ error: 'An error occurred deleting user' }, { status: 500 });
  }
}
