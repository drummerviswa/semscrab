const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── DEGREES ────────────────────────────────────────────────────────────────
  const degrees = [
    { name: 'MSc Integrated' },
    { name: 'B.E' },
    { name: 'B.Tech' },
    { name: 'M.E' },
    { name: 'M.Tech' },
    { name: 'MCA' },
    { name: 'MBA' },
  ];

  const degreeRecords = {};
  for (const d of degrees) {
    const record = await prisma.degree.upsert({
      where: { name: d.name },
      update: {},
      create: { name: d.name },
    });
    degreeRecords[d.name] = record;
    console.log(`  Degree: ${record.name}`);
  }

  // ─── REGULATIONS ────────────────────────────────────────────────────────────
  const regulations = ['2019', '2021', '2023', '2017', '2013'];
  const regulationRecords = {};
  for (const code of regulations) {
    const record = await prisma.regulation.upsert({
      where: { code },
      update: {},
      create: { code },
    });
    regulationRecords[code] = record;
    console.log(`  Regulation: R${record.code}`);
  }

  // ─── BRANCHES ────────────────────────────────────────────────────────────────
  const branches = [
    // MSc Integrated
    { degree: 'MSc Integrated', name: 'Information Technology',          department: 'Department of Information Technology' },
    { degree: 'MSc Integrated', name: 'Computer Science',                department: 'Department of Computer Science and Engineering' },
    { degree: 'MSc Integrated', name: 'Software Engineering',            department: 'Department of Computer Science and Engineering' },

    // B.E
    { degree: 'B.E', name: 'Computer Science and Engineering',           department: 'Department of Computer Science and Engineering' },
    { degree: 'B.E', name: 'Electronics and Communication Engineering',  department: 'Department of ECE' },
    { degree: 'B.E', name: 'Electrical and Electronics Engineering',     department: 'Department of EEE' },
    { degree: 'B.E', name: 'Mechanical Engineering',                     department: 'Department of Mechanical Engineering' },
    { degree: 'B.E', name: 'Civil Engineering',                          department: 'Department of Civil Engineering' },
    { degree: 'B.E', name: 'Aeronautical Engineering',                   department: 'Department of Aeronautical Engineering' },
    { degree: 'B.E', name: 'Chemical Engineering',                       department: 'Department of Chemical Engineering' },

    // B.Tech
    { degree: 'B.Tech', name: 'Information Technology',                  department: 'Department of Information Technology' },
    { degree: 'B.Tech', name: 'Artificial Intelligence and Data Science',department: 'Department of AI & DS' },
    { degree: 'B.Tech', name: 'Biotechnology',                           department: 'Department of Biotechnology' },

    // M.E
    { degree: 'M.E', name: 'Computer Science and Engineering',           department: 'Department of Computer Science and Engineering' },
    { degree: 'M.E', name: 'VLSI Design',                                department: 'Department of ECE' },
    { degree: 'M.E', name: 'Structural Engineering',                     department: 'Department of Civil Engineering' },

    // M.Tech
    { degree: 'M.Tech', name: 'Information Technology',                  department: 'Department of Information Technology' },
    { degree: 'M.Tech', name: 'Software Engineering',                    department: 'Department of Computer Science and Engineering' },

    // MCA
    { degree: 'MCA', name: 'Master of Computer Applications',            department: 'Department of Computer Applications' },

    // MBA
    { degree: 'MBA', name: 'Business Administration',                    department: 'Department of Management Studies' },
  ];

  for (const b of branches) {
    const deg = degreeRecords[b.degree];
    if (!deg) continue;
    const record = await prisma.branch.upsert({
      where: { degreeId_name: { degreeId: deg.id, name: b.name } },
      update: { department: b.department },
      create: { name: b.name, department: b.department, degreeId: deg.id },
    });
    console.log(`  Branch: ${b.degree} > ${record.name}`);
  }

  console.log('\nSeed complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
