// playwright is only imported dynamically inside runSEMSScraper() — never on Vercel
import prisma from './prisma';
import fs from 'fs';
import path from 'path';

// Try to load generated PDF credits map
let pdfCreditsMap = {};
try {
  const filePath = path.join(process.cwd(), 'public', 'credits_map.json');
  if (fs.existsSync(filePath)) {
    pdfCreditsMap = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Loaded ${Object.keys(pdfCreditsMap).length} credits from public/credits_map.json`);
  }
} catch (e) {
  console.error('Error loading public/credits_map.json:', e);
}

export function getGradePoints(grade) {
  const g = (grade || '').trim().toUpperCase();
  switch (g) {
    case 'O': return 10;
    case 'A+': return 9;
    case 'A': return 8;
    case 'B+': return 7;
    case 'B': return 6;
    case 'C': return 5;
    default: return 0;
  }
}

const STATIC_CREDITS = {
  "HS5152": 3,
  "MA5151": 4,
  "PH5152": 4,
  "HS5161": 2,
  "CY5253": 4,
  "HS5252": 3,
  "MA5251": 4,
  "XC5151": 4,
  "XC5152": 3,
  "XC5161": 2,
  "XC5251": 4,
  "XC5252": 3,
  "XC5253": 3,
  "XC5261": 2,
  "MA5351": 4,
  "XC5351": 4,
  "XC5352": 4,
  "XC5353": 3
};

export async function estimateCredits(courseCode, courseTitle) {
  const code = (courseCode || '').toUpperCase().trim();
  
  // 1. Check database master subject table
  try {
    const dbSubject = await prisma.subject.findUnique({ where: { code } });
    if (dbSubject) return dbSubject.credits;
  } catch (dbError) {
    console.error(`Database credits lookup failed for ${code}:`, dbError);
  }

  // 2. Check generated PDF credits map
  if (pdfCreditsMap[code] && pdfCreditsMap[code].credits) {
    return pdfCreditsMap[code].credits;
  }

  // 3. Check senior's static credit dictionary
  if (STATIC_CREDITS[code] !== undefined) {
    return STATIC_CREDITS[code];
  }

  const title = (courseTitle || '').toLowerCase().trim();
  
  // 2. Projects and Dissertations
  if (title.includes('project') || title.includes('dissertation') || title.includes('thesis') || title.includes('internship')) {
    if (title.includes('mini')) return 2;
    return 6;
  }
  
  // 3. Labs / Practical courses
  if (title.includes('laboratory') || title.includes('lab') || title.includes('practical') || title.includes('workshop') || title.includes('seminar')) {
    if (title.includes('communication') || title.includes('physics') || title.includes('chemistry')) {
      return 1;
    }
    return 2;
  }
  
  // 4. Math courses
  if (title.includes('calculus') || title.includes('mathematics') || title.includes('algebra') || title.includes('probability') || title.includes('statistics') || title.includes('numerical methods')) {
    return 4;
  }
  
  // 5. Default theory course credits
  return 3;
}

export async function runSEMSScraper(rollNumber) {
  let browser;
  let page;
  try {
    console.log(`Starting scraper for roll number: ${rollNumber}`);
    
    // Lazy-load playwright so it is not imported on Vercel production environment
    const { chromium } = await import('playwright');
    
    // Launch headed browser so the user can enter credentials and CAPTCHA
    browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();
    page.setDefaultTimeout(180000); // 3 minutes global action timeout
    await page.goto('https://acoe.annauniv.edu/sems/login/student');

    console.log('Browser opened. Waiting for user to complete login...');

    // Wait for the user to log in. We check if the URL changes away from the login page
    // and contains '/sems/student' which indicates dashboard entry.
    // Timeout of 3 minutes.
    await page.waitForFunction(() => {
      const url = window.location.href;
      return url.includes('/sems/student') && !url.includes('/login/student');
    }, undefined, { timeout: 180000 });

    console.log('Login detected! Automatically locating Attendance & Marks link...');

    // Locate and click the "Attendance & Marks" menu link dynamically
    const marksLinkHandle = await page.evaluateHandle(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.find(l => {
        const text = l.textContent.toLowerCase();
        const href = l.getAttribute('href') || '';
        return href.includes('student/mark') || 
               href.includes('student/attendance') || 
               text.includes('marks') || 
               text.includes('attendance');
      });
    });

    const marksLink = marksLinkHandle.asElement();
    if (marksLink) {
      console.log('Found Attendance & Marks menu link on dashboard. Clicking it...');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {
          console.log('Navigation timeout after click, proceeding...');
        }),
        marksLink.click()
      ]);
    } else {
      console.log('Could not find dashboard link. Attempting direct page navigation...');
      await page.goto('https://acoe.annauniv.edu/sems/student/mark').catch(e => {
        console.log('Direct navigation warning:', e.message);
      });
    }

    // Wait for the dropdown options to be asynchronously loaded
    console.log('Waiting for semester select dropdown to populate...');
    try {
      await page.waitForSelector('select option', { timeout: 15000 });
    } catch (e) {
      console.log('Warning: Timeout waiting for select options. Proceeding to scan...');
    }
    await page.waitForLoadState('networkidle');

    // Find the semester select dropdown by searching all select elements for the one containing options representing academic terms
    const selectElements = await page.$$('select');
    let semesterSelect = null;
    let options = [];

    for (const sel of selectElements) {
      const opts = await sel.$$eval('option', elements => 
        elements
          .map(el => ({ value: el.value, text: el.textContent.trim() }))
          .filter(o => o.value && o.value !== '' && o.value !== '0')
      );
      
      // The semester select dropdown is usually the one with the most non-empty options on this page
      if (opts.length > options.length) {
        options = opts;
        semesterSelect = sel;
      }
    }

    if (!semesterSelect || options.length === 0) {
      throw new Error('Could not find semester selection dropdown on marks page.');
    }

    // Determine the index of the semester select element among all selects to prevent stale reference errors on page reload
    const selectIndex = await page.evaluate((el) => {
      const selects = Array.from(document.querySelectorAll('select'));
      return selects.indexOf(el);
    }, semesterSelect);

    // Sort options chronologically (oldest first) so we can map indices to semesters as a fallback
    const sortedOptions = [...options].sort((a, b) => {
      const yearA = parseInt(a.text.match(/\d{4}/)?.[0] || '0');
      const yearB = parseInt(b.text.match(/\d{4}/)?.[0] || '0');
      if (yearA !== yearB) return yearA - yearB;
      const isEvenA = a.text.toLowerCase().includes('even') || a.text.toLowerCase().includes('apr') || a.text.toLowerCase().includes('may');
      const isEvenB = b.text.toLowerCase().includes('even') || b.text.toLowerCase().includes('apr') || b.text.toLowerCase().includes('may');
      if (isEvenA && !isEvenB) return 1;
      if (!isEvenA && isEvenB) return -1;
      return 0;
    });

    console.log(`Found ${sortedOptions.length} semester options to scrape.`);

    const scrapedData = [];

    for (let i = 0; i < sortedOptions.length; i++) {
      const option = sortedOptions[i];
      console.log(`Selecting session option: "${option.text}" (value: ${option.value.substring(0, 15)}...)...`);

      // Refetch the select element to avoid stale element reference after page reloads
      const selects = await page.$$('select');
      const currentSelect = selects[selectIndex];
      
      if (!currentSelect) {
        throw new Error(`Semester dropdown was lost after loading option ${option.text}`);
      }

      // Select option
      await currentSelect.selectOption(option.value);
      
      // Click Go/Submit if it exists, otherwise wait for navigation to complete
      const submitBtn = await page.$('input[type="submit"], button[type="submit"]');
      if (submitBtn) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'load', timeout: 25000 }).catch(() => {
            console.log("Navigation timeout after click, proceeding...");
          }),
          submitBtn.click()
        ]);
        // Wait for network to settle after load
        await page.waitForLoadState('networkidle').catch(() => {});
      } else {
        await page.waitForTimeout(2500); // Fallback wait for AJAX
      }

      // Once the page loads, extract the actual semester number from the student info panel
      const semesterNo = await page.evaluate(() => {
        // Method 1: Find by label text next to it
        const tds = Array.from(document.querySelectorAll('td, th, div, label, span'));
        for (const td of tds) {
          const text = td.textContent.trim().toLowerCase();
          if (text === 'semester' || text === 'semester:') {
            const parent = td.parentElement;
            if (parent) {
              const siblingInputs = Array.from(parent.querySelectorAll('input'));
              for (const input of siblingInputs) {
                const val = input.value ? input.value.trim() : '';
                if (val && !isNaN(parseInt(val))) return parseInt(val);
              }
              // sibling children
              const adjacent = Array.from(parent.children);
              const myIdx = adjacent.indexOf(td);
              if (myIdx !== -1 && myIdx + 1 < adjacent.length) {
                const siblingText = adjacent[myIdx + 1].textContent.trim() || adjacent[myIdx + 1].value;
                if (siblingText && !isNaN(parseInt(siblingText))) return parseInt(siblingText);
              }
            }
          }
        }
        
        // Method 2: Fallback search of all inputs
        const inputs = Array.from(document.querySelectorAll('input'));
        for (const input of inputs) {
          const val = input.value ? input.value.trim() : '';
          if (val && !isNaN(parseInt(val))) {
            const num = parseInt(val);
            if (num >= 1 && num <= 10 && val.length <= 2) {
              return num;
            }
          }
        }
        return null;
      });

      if (!semesterNo) {
        semesterNo = i + 1;
        console.log(`Could not determine semester number from page for "${option.text}". Falling back to option sequence: Semester ${semesterNo}`);
      }

      console.log(`Semester resolved as: ${semesterNo}`);

      // Check if table exists
      const tableExists = await page.$('table');
      if (!tableExists) {
        console.log(`No table found for semester ${semesterNo}, skipping...`);
        continue;
      }

      // Extract legend colors and table data in one evaluation
      const scrapResults = await page.evaluate(() => {
        const getCellColor = (cell) => {
          if (!cell) return '';
          
          // 1. Check bgcolor attribute (legacy HTML)
          const bgcolor = cell.getAttribute('bgcolor');
          if (bgcolor) return bgcolor.toLowerCase().trim();
          
          // 2. Check inline style
          const styleAttr = cell.getAttribute('style') || '';
          if (styleAttr.includes('background-color') || styleAttr.includes('background')) {
            const inlineBg = cell.style.backgroundColor;
            if (inlineBg) return inlineBg.toLowerCase().trim();
          }
          
          // 3. Check computed style
          const computed = window.getComputedStyle(cell).backgroundColor;
          if (computed && computed !== 'rgba(0, 0, 0, 0)' && computed !== 'transparent') {
            return computed.toLowerCase().trim();
          }
          return '';
        };

        const allTables = Array.from(document.querySelectorAll('table'));
        
        // 1. Find legend table to extract colors
        const legendTable = allTables.find(t => {
          const text = t.textContent.toLowerCase();
          return text.includes('grade representation') && text.includes('not published');
        });
        
        let notPublishedColor = '';
        if (legendTable) {
          const headers = Array.from(legendTable.querySelectorAll('tr'))
            .flatMap(tr => Array.from(tr.querySelectorAll('td, th')))
            .map(cell => cell.textContent.trim().toLowerCase());
          
          let notPublishedCol = -1;
          headers.forEach((h, idx) => {
            if (h.includes('not published')) notPublishedCol = idx;
          });
          
          const rows = Array.from(legendTable.querySelectorAll('tr'));
          for (const row of rows) {
            const cells = Array.from(row.querySelectorAll('td'));
            const isColorRow = row.textContent.toLowerCase().includes('color') || 
                               cells.some(c => c.getAttribute('style') || c.getAttribute('bgcolor'));
            if (isColorRow && notPublishedCol !== -1 && notPublishedCol < cells.length) {
              notPublishedColor = getCellColor(cells[notPublishedCol]);
              break;
            }
          }
        }
        
        // 2. Find target marks table
        const targetTable = allTables.find(t => {
          const html = t.innerHTML.toLowerCase();
          return html.includes('code') || html.includes('grade') || html.includes('subject');
        }) || allTables[0];
        
        if (!targetTable) return null;
        
        const rows = Array.from(targetTable.querySelectorAll('tr'));
        if (rows.length === 0) return null;
        
        const headers = Array.from(rows[0].querySelectorAll('th, td')).map(cell => cell.textContent.trim());
        
        // Find Grade column index dynamically
        let gradeIdx = -1;
        headers.forEach((h, idx) => {
          if (h.toLowerCase().includes('grade')) {
            gradeIdx = idx;
          }
        });
        if (gradeIdx === -1) gradeIdx = 11; // Fallback
        
        const dataRows = rows.slice(1).map(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          const data = cells.map(cell => cell.textContent.trim());
          
          let gradeCellColor = '';
          if (gradeIdx < cells.length) {
            gradeCellColor = getCellColor(cells[gradeIdx]);
          }
          return { data, gradeCellColor };
        });
        
        return { headers, dataRows, notPublishedColor };
      });

      if (!scrapResults || !scrapResults.dataRows || scrapResults.dataRows.length === 0) {
        console.log(`Could not extract table rows for semester ${semesterNo}`);
        continue;
      }

      console.log(`[Color Debug] Semester ${semesterNo} - notPublishedColor: "${scrapResults.notPublishedColor}", Sample row color: "${scrapResults.dataRows[0]?.gradeCellColor}"`);

      // Map headers to indexes
      const headers = scrapResults.headers;
      let codeIdx = -1;
      let titleIdx = -1;
      let creditsIdx = -1;
      let gradeIdx = -1;
      let statusIdx = -1;

      headers.forEach((h, idx) => {
        const text = h.toLowerCase();
        if (text.includes('code') || text.includes('subject id') || text.includes('course id')) {
          codeIdx = idx;
        } else if (text.includes('title') || text.includes('name') || text.includes('subject')) {
          if (text.includes('title') || text.includes('name')) {
            titleIdx = idx;
          } else if (titleIdx === -1) {
            titleIdx = idx;
          }
        } else if (text.includes('credit')) {
          creditsIdx = idx;
        } else if (text.includes('grade')) {
          gradeIdx = idx;
        } else if (text.includes('result') || text.includes('status') || text.includes('remarks') || text.includes('outcome')) {
          statusIdx = idx;
        }
      });

      // Safety fallbacks if auto-detection failed
      if (codeIdx === -1) codeIdx = 1;
      if (titleIdx === -1) titleIdx = 2;
      if (gradeIdx === -1) gradeIdx = 11;
      if (statusIdx === -1) statusIdx = 5;

      console.log(`Column Mapping - Code: ${codeIdx}, Title: ${titleIdx}, Credits (Idx): ${creditsIdx}, Grade: ${gradeIdx}, Status: ${statusIdx}`);

      const semesterGrades = [];

      for (const row of scrapResults.dataRows) {
        // Skip empty rows or rows that don't look like data (e.g. summary/GPA rows)
        if (row.data.length <= Math.max(codeIdx, titleIdx, gradeIdx)) continue;
        
        const code = row.data[codeIdx];
        const title = row.data[titleIdx];
        const grade = row.data[gradeIdx];
        const rawStatus = statusIdx < row.data.length ? row.data[statusIdx] : 'PASS';

        // Validate course code exists
        if (!code || code.trim() === '' || code.trim().length < 3) continue;

        let credits = 3; // Default fallback
        if (creditsIdx !== -1 && creditsIdx < row.data.length) {
          const parsedVal = parseInt(row.data[creditsIdx]);
          if (!isNaN(parsedVal)) {
            credits = parsedVal;
          }
        } else {
          // Estimate credits based on course code and title
          credits = await estimateCredits(code, title);
        }

        // Determine actual status based on colors
        let status = 'PASS';
        const cellColor = (row.gradeCellColor || '').toLowerCase().replace(/\s+/g, '');
        const isNotPublished = cellColor === 'rgb(89,70,67)' || cellColor === '#594643';
        
        if (isNotPublished) {
          status = 'NOT_PUBLISHED';
        } else if (grade === 'U' || grade === 'RA' || grade === 'SA') {
          status = 'FAIL';
        } else if (rawStatus && rawStatus.toUpperCase().includes('FAIL')) {
          status = 'FAIL';
        }

        semesterGrades.push({
          semesterNo,
          courseCode: code.trim(),
          courseTitle: title ? title.trim() : 'Unknown Course',
          credits,
          grade: grade ? grade.trim().toUpperCase() : 'U',
          gradePoints: status === 'NOT_PUBLISHED' ? 0 : getGradePoints(grade || 'U'),
          status
        });
      }

      console.log(`Semester ${semesterNo} Scraped: Found ${semesterGrades.length} valid subjects.`);
      scrapedData.push(...semesterGrades);
    }

    if (scrapedData.length === 0) {
      throw new Error('No grades or subjects could be scraped from the portal.');
    }

    console.log(`Total scraped subjects: ${scrapedData.length}. Updating database...`);

    // Perform DB transactions
    await prisma.$transaction(async (tx) => {
      // 1. Delete old grades for this user
      await tx.courseGrade.deleteMany({
        where: { userRollNumber: rollNumber }
      });

      // 2. Delete old semester summaries
      await tx.semesterSummary.deleteMany({
        where: { userRollNumber: rollNumber }
      });

      // 3. Insert new grades
      await tx.courseGrade.createMany({
        data: scrapedData.map(g => ({
          userRollNumber: rollNumber,
          semesterNo: g.semesterNo,
          courseCode: g.courseCode,
          courseTitle: g.courseTitle,
          credits: g.credits,
          grade: g.grade,
          gradePoints: g.gradePoints,
          status: g.status
        }))
      });

      // 4. Calculate semester GPAs
      // Group grades by semester
      const semMap = {};
      
      // Initialize semMap for all semester numbers in scrapedData
      scrapedData.forEach(g => {
        if (!semMap[g.semesterNo]) {
          semMap[g.semesterNo] = { totalPoints: 0, totalCredits: 0, creditsEarned: 0 };
        }
      });

      // Accumulate points, GPA credits, and earned credits only for published courses
      scrapedData.forEach(g => {
        if (g.status !== 'NOT_PUBLISHED') {
          semMap[g.semesterNo].totalPoints += g.credits * g.gradePoints;
          semMap[g.semesterNo].totalCredits += g.credits;
          if (g.status === 'PASS') {
            semMap[g.semesterNo].creditsEarned += g.credits;
          }
        }
      });

      // Create summaries
      const summaries = Object.keys(semMap).map(sem => {
        const semNo = parseInt(sem);
        const { totalPoints, totalCredits, creditsEarned } = semMap[sem];
        const gpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(3)) : 0.0;
        
        return {
          userRollNumber: rollNumber,
          semesterNo: semNo,
          gpa,
          creditsEarned
        };
      });

      await tx.semesterSummary.createMany({
        data: summaries
      });
    });

    console.log('Database sync complete!');
    await browser.close();
    
    return { success: true, count: scrapedData.length };
  } catch (error) {
    console.error('SEMS Scraper error:', error);
    if (browser && page) {
      try {
        console.log('--- SCRAPER ERROR DIAGNOSTICS ---');
        console.log('Current Page URL:', page.url());
        console.log('Current Page Title:', await page.title());
        
        const frames = page.frames();
        console.log('Total Frames on Page:', frames.length);
        frames.forEach((f, idx) => {
          console.log(`  Frame ${idx}: Name="${f.name()}", URL="${f.url()}"`);
        });

        const screenshotPath = 'C:\\Users\\drumm\\.gemini\\antigravity\\brain\\206b08bb-9ad9-401d-933e-5859334a48f3\\screenshot.png';
        await page.screenshot({ path: screenshotPath });
        console.log('Screenshot saved to:', screenshotPath);
        console.log('---------------------------------');
      } catch (diagErr) {
        console.error('Error running diagnostics:', diagErr);
      }
      await browser.close();
    } else if (browser) {
      await browser.close();
    }
    throw error;
  }
}

export async function parseManualHTML(rollNumber, semesterNo, htmlString) {
  try {
    console.log(`Manually parsing HTML for roll number ${rollNumber}, Semester ${semesterNo}`);
    
    // Pure JS regex parser to extract tables without launching Chromium (which fails on Vercel)
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

    const tables = [];
    let match;
    while ((match = tableRegex.exec(htmlString)) !== null) {
      tables.push(match[1]);
    }

    if (tables.length === 0) {
      throw new Error('No table element found in the pasted HTML.');
    }

    // Find the target table containing 'code', 'grade' or 'subject'
    const targetTableHTML = tables.find(t => {
      const lower = t.toLowerCase();
      return lower.includes('code') || lower.includes('grade') || lower.includes('subject');
    }) || tables[0];

    const rows = [];
    let rowMatch;
    while ((rowMatch = rowRegex.exec(targetTableHTML)) !== null) {
      rows.push(rowMatch[1]);
    }

    if (rows.length === 0) {
      throw new Error('Could not extract table rows from the pasted HTML.');
    }

    // Helper to strip HTML tags and decode basic entities
    const cleanText = (html) => {
      return html
        .replace(/<[^>]*>/g, '') // strip tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
    };

    const dataRows = [];
    for (const rowHTML of rows) {
      const cells = [];
      let cellMatch;
      cellRegex.lastIndex = 0; // reset
      while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
        cells.push(cleanText(cellMatch[1]));
      }
      if (cells.length > 0) {
        dataRows.push(cells);
      }
    }

    if (dataRows.length === 0) {
      throw new Error('Could not extract any cells from table rows.');
    }

    const headers = dataRows[0];
    const tableDataRows = dataRows.slice(1);

    const tableData = { headers, dataRows: tableDataRows };

    const headersList = tableData.headers;
    let codeIdx = -1;
    let titleIdx = -1;
    let creditsIdx = -1;
    let gradeIdx = -1;
    let statusIdx = -1;

    headersList.forEach((h, idx) => {
      const text = h.toLowerCase();
      if (text.includes('code') || text.includes('subject id') || text.includes('course id')) {
        codeIdx = idx;
      } else if (text.includes('title') || text.includes('name') || text.includes('subject')) {
        if (text.includes('title') || text.includes('name')) {
          titleIdx = idx;
        } else if (titleIdx === -1) {
          titleIdx = idx;
        }
      } else if (text.includes('credit')) {
        creditsIdx = idx;
      } else if (text.includes('grade')) {
        gradeIdx = idx;
      } else if (text.includes('result') || text.includes('status') || text.includes('remarks') || text.includes('outcome')) {
        statusIdx = idx;
      }
    });

    // Safety fallbacks
    if (codeIdx === -1) codeIdx = 1;
    if (titleIdx === -1) titleIdx = 2;
    if (creditsIdx === -1) creditsIdx = 3;
    if (gradeIdx === -1) gradeIdx = 4;
    if (statusIdx === -1) statusIdx = 5;

    const semesterGrades = [];

    for (const row of tableData.dataRows) {
      if (row.length <= Math.max(codeIdx, titleIdx, creditsIdx, gradeIdx)) continue;
      
      const code = row[codeIdx];
      const title = row[titleIdx];
      const creditsRaw = row[creditsIdx];
      const grade = row[gradeIdx];
      const status = statusIdx < row.length ? row[statusIdx] : 'PASS';

      if (!code || code.trim() === '' || code.trim().length < 3) continue;

      const credits = parseInt(creditsRaw);
      if (isNaN(credits)) continue;

      semesterGrades.push({
        semesterNo,
        courseCode: code.trim(),
        courseTitle: title ? title.trim() : 'Unknown Course',
        credits,
        grade: grade ? grade.trim().toUpperCase() : 'U',
        gradePoints: getGradePoints(grade || 'U'),
        status: status ? status.trim().toUpperCase() : 'PASS'
      });
    }

    if (semesterGrades.length === 0) {
      throw new Error('No valid subjects could be extracted from the table.');
    }

    console.log(`Extracted ${semesterGrades.length} subjects. Syncing to database...`);

    // Perform database transaction for this single semester
    await prisma.$transaction(async (tx) => {
      // 1. Delete old grades for this user and this semester
      await tx.courseGrade.deleteMany({
        where: { userRollNumber: rollNumber, semesterNo }
      });

      // 2. Delete old semester summary for this semester
      await tx.semesterSummary.deleteMany({
        where: { userRollNumber: rollNumber, semesterNo }
      });

      // 3. Insert new grades
      await tx.courseGrade.createMany({
        data: semesterGrades.map(g => ({
          userRollNumber: rollNumber,
          semesterNo: g.semesterNo,
          courseCode: g.courseCode,
          courseTitle: g.courseTitle,
          credits: g.credits,
          grade: g.grade,
          gradePoints: g.gradePoints,
          status: g.status
        }))
      });

      // 4. Recalculate summary for this semester
      let totalPoints = 0;
      let totalCredits = 0;
      semesterGrades.forEach(g => {
        totalPoints += g.credits * g.gradePoints;
        totalCredits += g.credits;
      });

      const gpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(3)) : 0.0;

      await tx.semesterSummary.create({
        data: {
          userRollNumber: rollNumber,
          semesterNo,
          gpa,
          creditsEarned: totalCredits
        }
      });
    });

    console.log(`Semester ${semesterNo} manual import complete.`);
    return { success: true, count: semesterGrades.length };
  } catch (error) {
    console.error('Manual HTML parse error:', error);
    throw error;
  }
}
