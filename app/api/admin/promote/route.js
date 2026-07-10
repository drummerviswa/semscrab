import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

const normalizeScopeList = (value) => String(value || '')
  .split(/[\n,]+/)
  .map(item => item.trim())
  .filter(Boolean)
  .join(', ');

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { rollNumber, role, prBranch, prBatch } = await req.json();

    if (!rollNumber || !role) {
      return NextResponse.json({ error: 'Roll number and role are required' }, { status: 400 });
    }

    // Validate target user exists
    const targetUser = await prisma.user.findUnique({
      where: { rollNumber },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    // Update target user
    const updatedUser = await prisma.user.update({
      where: { rollNumber },
      data: {
        role,
        prBranch: role === 'PR' ? normalizeScopeList(prBranch) : null,
        prBatch: role === 'PR' ? prBatch : null,
      },
      select: {
        rollNumber: true,
        name: true,
        role: true,
        prBranch: true,
        prBatch: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: `User ${rollNumber} updated successfully.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Admin promotion error:', error);
    return NextResponse.json({ error: 'An error occurred during promotion' }, { status: 500 });
  }
}
