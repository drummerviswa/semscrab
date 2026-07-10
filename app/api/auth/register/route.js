import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { rollNumber, name, password, branch, batch, adminPasscode } = await req.json();

    if (!rollNumber || !name || !password || !branch || !batch) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const cleanRollNumber = rollNumber.trim().toUpperCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { rollNumber: cleanRollNumber },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Student with this roll number already exists' }, { status: 400 });
    }

    // Determine role
    let role = 'STUDENT';
    const envAdminPasscode = process.env.ADMIN_PASSCODE || 'CUIC_ADMIN_2026';
    if (adminPasscode && adminPasscode.trim() === envAdminPasscode.trim()) {
      role = 'ADMIN';
    }

    const passwordHash = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        rollNumber: cleanRollNumber,
        name: name.trim(),
        passwordHash,
        role,
        branch: branch.trim(),
        batch: batch.trim(),
      },
    });

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
      },
    });

    // Set cookie
    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}
