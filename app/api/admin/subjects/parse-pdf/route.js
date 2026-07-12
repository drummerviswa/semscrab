import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scriptPath = path.join(process.cwd(), 'scripts', 'parse_syllabus_robust.py');
    
    console.log(`Executing python parser at: ${scriptPath}`);
    try {
      await execPromise(`python "${scriptPath}"`);
    } catch (execError) {
      console.warn('Python script execution failed, falling back to existing JSON file:', execError);
    }

    const jsonPath = path.join(process.cwd(), 'public', 'credits_map.json');
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: 'Syllabus credits database file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    const creditsMap = JSON.parse(fileContent);

    let count = 0;
    
    for (const [code, details] of Object.entries(creditsMap)) {
      // 1. Determine Degree and Branch names dynamically
      let degreeName = 'MSc Integrated';
      let branchName = details.branch || 'Information Technology';
      
      const fullBranch = details.branch || '';
      if (fullBranch.startsWith('MSc Integrated ')) {
        degreeName = 'MSc Integrated';
        branchName = fullBranch.substring('MSc Integrated '.length).trim();
      } else if (fullBranch.startsWith('MSc ')) {
        degreeName = 'MSc';
        branchName = fullBranch.substring('MSc '.length).trim();
      } else if (fullBranch.startsWith('B.E ')) {
        degreeName = 'B.E';
        branchName = fullBranch.substring('B.E '.length).trim();
      } else if (fullBranch.startsWith('B.Tech ')) {
        degreeName = 'B.Tech';
        branchName = fullBranch.substring('B.Tech '.length).trim();
      }

      // 2. Upsert Degree
      const degree = await prisma.degree.upsert({
        where: { name: degreeName },
        update: {},
        create: { name: degreeName }
      });

      // 3. Upsert Branch
      const branch = await prisma.branch.upsert({
        where: {
          degreeId_name: {
            degreeId: degree.id,
            name: branchName
          }
        },
        update: {
          department: branchName.toLowerCase().includes('computer science') ? 'Computer Science' : 'Information Technology'
        },
        create: {
          name: branchName,
          degreeId: degree.id,
          department: branchName.toLowerCase().includes('computer science') ? 'Computer Science' : 'Information Technology'
        }
      });

      // 4. Upsert Regulation
      const regCode = details.regulation || '2019';
      const regulation = await prisma.regulation.upsert({
        where: { code: regCode },
        update: {},
        create: { code: regCode }
      });

      // 5. Upsert Subject
      await prisma.subject.upsert({
        where: { code },
        update: {
          title: details.title,
          credits: details.credits,
          branchId: branch.id,
          regulationId: regulation.id
        },
        create: {
          code,
          title: details.title,
          credits: details.credits,
          branchId: branch.id,
          regulationId: regulation.id
        }
      });
      
      count++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully parsed and synced ${count} subjects into the curriculum database.`,
      count
    });
  } catch (error) {
    console.error('Parse syllabus API error:', error);
    return NextResponse.json({ error: 'An error occurred syncing syllabus subjects' }, { status: 500 });
  }
}
