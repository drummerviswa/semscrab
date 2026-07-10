import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { parseManualHTML } from '@/lib/scraper';
import prisma from '@/lib/prisma';

// Playwright automated scraping is only available in local/self-hosted environments.
// On Vercel serverless, students must use the "Import via HTML Paste" method instead.
const IS_SERVERLESS = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'STUDENT') return NextResponse.json({ error: 'Only student accounts can trigger SEMS scraping' }, { status: 403 });

    // Automated scraper requires a local browser - not available on Vercel
    if (IS_SERVERLESS) {
      return NextResponse.json({
        error: 'Automated browser scraping is not available in the hosted version. Please use "Import via HTML Paste" instead:\n1. Log into sems.annauniv.edu\n2. Open your results page\n3. Press Ctrl+U to view source\n4. Copy and paste the HTML here.',
        useManualImport: true
      }, { status: 503 });
    }

    console.log(`API trigger: Starting scrape for ${user.rollNumber}...`);
    const { runSEMSScraper } = await import('@/lib/scraper');
    const scrapeResult = await runSEMSScraper(user.rollNumber);

    const [semesters, grades] = await Promise.all([
      prisma.semesterSummary.findMany({ where: { userRollNumber: user.rollNumber }, orderBy: { semesterNo: 'asc' } }),
      prisma.courseGrade.findMany({ where: { userRollNumber: user.rollNumber }, orderBy: [{ semesterNo: 'asc' }, { courseCode: 'asc' }] })
    ]);

    return NextResponse.json({ success: true, message: `Successfully scraped ${scrapeResult.count} courses.`, semesters, grades });
  } catch (error) {
    console.error('API scrape error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during SEMS scraping' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'STUDENT') return NextResponse.json({ error: 'Only student accounts can import grades' }, { status: 403 });

    const { semesterNo, html } = await req.json();
    if (!semesterNo || !html) return NextResponse.json({ error: 'Semester number and HTML source are required' }, { status: 400 });

    const parsedSemNo = parseInt(semesterNo);
    if (isNaN(parsedSemNo)) return NextResponse.json({ error: 'Invalid semester number' }, { status: 400 });

    console.log(`API trigger: Starting manual parse for ${user.rollNumber}, Semester ${parsedSemNo}...`);
    const parseResult = await parseManualHTML(user.rollNumber, parsedSemNo, html);

    const [semesters, grades] = await Promise.all([
      prisma.semesterSummary.findMany({ where: { userRollNumber: user.rollNumber }, orderBy: { semesterNo: 'asc' } }),
      prisma.courseGrade.findMany({ where: { userRollNumber: user.rollNumber }, orderBy: [{ semesterNo: 'asc' }, { courseCode: 'asc' }] })
    ]);

    return NextResponse.json({ success: true, message: `Successfully imported ${parseResult.count} courses for Semester ${parsedSemNo}.`, semesters, grades });
  } catch (error) {
    console.error('API manual parse error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during manual HTML parsing' }, { status: 500 });
  }
}
