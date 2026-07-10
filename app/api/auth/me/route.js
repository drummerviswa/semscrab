import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Fetch summaries and counts
    let semesters = [];
    let gradesCount = 0;
    
    semesters = await prisma.semesterSummary.findMany({
      where: { userRollNumber: user.rollNumber },
      orderBy: { semesterNo: 'asc' },
    });

    gradesCount = await prisma.courseGrade.count({
      where: { userRollNumber: user.rollNumber },
    });

    return NextResponse.json({
      authenticated: true,
      user,
      semesters,
      hasGrades: gradesCount > 0,
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'An error occurred fetching session' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shareWithPR } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { rollNumber: user.rollNumber },
      data: {
        shareWithPR: Boolean(shareWithPR),
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
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'An error occurred updating profile' }, { status: 500 });
  }
}
