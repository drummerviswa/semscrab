import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [degrees, branches] = await Promise.all([
      prisma.degree.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.branch.findMany({
        include: {
          degree: true,
        },
        orderBy: [
          { degree: { name: 'asc' } },
          { name: 'asc' },
        ],
      }),
    ]);

    return NextResponse.json({ degrees, branches });
  } catch (error) {
    console.error('Fetch public catalog error:', error);
    return NextResponse.json({ error: 'An error occurred fetching catalog data' }, { status: 500 });
  }
}
