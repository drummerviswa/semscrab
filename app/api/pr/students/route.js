import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

const isPublishedGrade = (grade) => grade.status !== 'NOT_PUBLISHED';
const isArrearGrade = (grade) => (
  grade.status === 'FAIL' ||
  grade.status === 'RA' ||
  grade.grade === 'RA' ||
  grade.grade === 'U'
);

const getLatestUniqueGrades = (grades) => {
  const latestByCourse = {};
  grades.forEach(g => {
    const code = g.courseCode;
    const existing = latestByCourse[code];
    if (!existing) {
      latestByCourse[code] = g;
    } else {
      const existingIsPass = existing.status === 'PASS' || existing.gradePoints > 0;
      const newIsPass = g.status === 'PASS' || g.gradePoints > 0;
      if (newIsPass && !existingIsPass) {
        latestByCourse[code] = g;
      } else if (!newIsPass && existingIsPass) {
        // Keep the passed attempt
      } else {
        if (g.semesterNo > existing.semesterNo) {
          latestByCourse[code] = g;
        }
      }
    }
  });
  return Object.values(latestByCourse);
};
const parseScopeList = (value) => String(value || '')
  .split(/[\n,]+/)
  .map(item => item.trim())
  .filter(Boolean);

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.role === 'ADMIN';
    const isPR = user.role === 'PR';

    if (!isAdmin && !isPR) {
      return NextResponse.json({ error: 'Unauthorized. PR or Admin access required.' }, { status: 403 });
    }

    // Determine branch and batch filters
    let branchFilter = '';
    let branchFilters = [];
    let batchFilter = '';

    if (isPR) {
      branchFilter = user.prBranch;
      branchFilters = parseScopeList(user.prBranch);
      batchFilter = user.prBatch;

      if (branchFilters.length === 0 || !batchFilter) {
        return NextResponse.json({
          error: 'PR account has no assigned scope. Please contact your administrator.',
          students: []
        }, { status: 400 });
      }
    } else {
      // Admin can view all students or filter by query parameters
      const url = new URL(req.url);
      branchFilter = url.searchParams.get('branch') || '';
      branchFilters = parseScopeList(branchFilter);
      batchFilter = url.searchParams.get('batch') || '';
    }

    // Define search filter
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';

    // Query students who have shared their data
    // PRs only see consenting students; Admins see all students in scope
    const whereClause = {
      branch: branchFilters.length > 1 ? { in: branchFilters } : branchFilters[0] || undefined,
      batch: batchFilter ? batchFilter : undefined,
      role: 'STUDENT',
      shareWithPR: isPR ? true : undefined,
      OR: search ? [
        { name: { contains: search } },
        { rollNumber: { contains: search } },
        { branch: { contains: search } }
      ] : undefined
    };

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        rollNumber: true,
        name: true,
        branch: true,
        batch: true,
        shareWithPR: true,
        grades: {
          select: {
            id: true,
            semesterNo: true,
            courseCode: true,
            courseTitle: true,
            credits: true,
            grade: true,
            gradePoints: true,
            status: true,
          }
        },
        semesters: {
          select: {
            semesterNo: true,
            gpa: true,
            creditsEarned: true,
          },
          orderBy: { semesterNo: 'asc' },
        }
      },
      orderBy: { rollNumber: 'asc' }
    });

    // Format output with computed CGPA
    const formattedStudents = students.map(student => {
      let activeBacklogs = 0;

      const uniqueGrades = getLatestUniqueGrades(student.grades);
      const publishedGrades = uniqueGrades.filter(g => isPublishedGrade(g));

      const gradesBySem = {};
      publishedGrades.forEach(g => {
        if (!gradesBySem[g.semesterNo]) {
          gradesBySem[g.semesterNo] = [];
        }
        gradesBySem[g.semesterNo].push(g);
      });

      const semesterGpas = [];
      let totalCredits = 0;

      Object.keys(gradesBySem).forEach(semNo => {
        const semGrades = gradesBySem[semNo];
        const passedSemGrades = semGrades.filter(g => g.status === 'PASS' || g.gradePoints > 0);
        const semPoints = passedSemGrades.reduce((acc, curr) => acc + (curr.credits * curr.gradePoints), 0);
        const semCredits = passedSemGrades.reduce((acc, curr) => acc + curr.credits, 0);
        if (semCredits > 0) {
          const semGpa = parseFloat((semPoints / semCredits).toFixed(2));
          semesterGpas.push(semGpa);
          totalCredits += semCredits;
        }
      });

      uniqueGrades.forEach(g => {
        if (isPublishedGrade(g) && isArrearGrade(g)) {
          activeBacklogs++;
        }
      });

      const cgpa = semesterGpas.length > 0 
        ? parseFloat((semesterGpas.reduce((acc, val) => acc + val, 0) / semesterGpas.length).toFixed(2)) 
        : 0.0;

      return {
        rollNumber: student.rollNumber,
        name: student.name,
        branch: student.branch,
        batch: student.batch,
        shareWithPR: student.shareWithPR,
        cgpa,
        totalCredits,
        activeBacklogs,
        semesters: student.semesters,
        grades: student.grades,
      };
    });

    return NextResponse.json({
      students: formattedStudents,
      scope: {
        branch: branchFilters.join(', '),
        branches: branchFilters,
        batch: batchFilter,
      }
    });
  } catch (error) {
    console.error('PR students fetch error:', error);
    return NextResponse.json({ error: 'An error occurred fetching student data' }, { status: 500 });
  }
}
