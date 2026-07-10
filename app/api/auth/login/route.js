import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { rollNumber, password } = await req.json();

    if (!rollNumber || !password) {
      return NextResponse.json({ error: 'Roll number and password are required' }, { status: 400 });
    }

    const cleanRollNumber = rollNumber.trim().toUpperCase();

    const user = await prisma.user.findUnique({
      where: { rollNumber: cleanRollNumber },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid roll number or password' }, { status: 401 });
    }

    // Sign JWT
    const token = signToken({ rollNumber: user.rollNumber, role: user.role });

    const response = NextResponse.json({
      success: true,
      user: {
        rollNumber: user.rollNumber,
        name: user.name,
        role: user.role,
        branch: user.branch,
        batch: user.batch,
        shareWithPR: user.shareWithPR,
        prBranch: user.prBranch,
        prBatch: user.prBatch,
      },
    });

    // Set cookie
    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
