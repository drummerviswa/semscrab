import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const grades = await prisma.courseGrade.findMany({
      where: { userRollNumber: user.rollNumber },
      orderBy: [
        { semesterNo: 'asc' },
        { courseCode: 'asc' }
      ]
    });

    return NextResponse.json({ grades });
  } catch (error) {
    console.error('Fetch student grades error:', error);
    return NextResponse.json({ error: 'An error occurred fetching grades' }, { status: 500 });
  }
}
