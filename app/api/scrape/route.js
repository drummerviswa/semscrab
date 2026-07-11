import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import https from 'https';
import fs from 'fs';
import path from 'path';

// Helper to make a secure/insecure HTTPS GET request
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...headers
      }
    };
    https.get(url, options, (res) => {
      let data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data)
        });
      });
    }).on('error', reject);
  });
}

// Helper to make a secure/insecure HTTPS POST request
function httpsPost(url, bodyString, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      method: 'POST',
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(bodyString),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...headers
      }
    };
    const req = https.request(options, (res) => {
      let data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data)
        });
      });
    });
    req.on('error', reject);
    req.write(bodyString);
    req.end();
  });
}

function extractHiddenInputs(html) {
  const inputs = [];
  const inputRegex = /<input([^>]+)>/gi;
  let match;
  while ((match = inputRegex.exec(html)) !== null) {
    const attrsStr = match[1];
    if (attrsStr.toLowerCase().includes('type="hidden"') || attrsStr.toLowerCase().includes("type='hidden'")) {
      const nameMatch = attrsStr.match(/name=["']([^"']+)["']/i);
      const valueMatch = attrsStr.match(/value=["']([^"']*)["']/i);
      if (nameMatch) {
        inputs.push({
          name: nameMatch[1],
          value: valueMatch ? valueMatch[1] : ''
        });
      }
    }
  }
  return inputs;
}

async function httpsGetFollowRedirect(url, initialCookie) {
  let currentUrl = url;
  let activeCookie = initialCookie;
  let redirectCount = 0;
  const maxRedirects = 5;

  while (redirectCount < maxRedirects) {
    console.log(`HTTP Scraper: Fetching (Redirect ${redirectCount}): ${currentUrl}`);
    const res = await httpsGet(currentUrl, {
      'Cookie': `ci_session=${activeCookie}`,
      'Referer': 'https://acoe.annauniv.edu/sems/login/student'
    });

    const newCookies = res.headers['set-cookie'];
    if (newCookies && newCookies.length > 0) {
      const cookieStr = Array.isArray(newCookies) ? newCookies[0] : newCookies;
      const match = cookieStr.match(/ci_session=([^;]+)/);
      if (match) {
        activeCookie = match[1];
        console.log(`HTTP Scraper: Cookie updated to: ${activeCookie}`);
      }
    }

    const statusCode = res.statusCode;
    const location = res.headers['location'];
    const bodyText = res.body.toString('utf-8');

    // Check if the response contains the logout confirmation page form
    if (bodyText.includes('logout_all_machine') && bodyText.includes('<form')) {
      console.log(`HTTP Scraper: Found logout confirmation form. Simulating form submission...`);
      
      const actionMatch = bodyText.match(/<form[^>]+action="([^"]+)"/i);
      let actionUrl = actionMatch ? actionMatch[1] : '/sems/login/logout_all_machine';
      if (actionUrl.startsWith('/')) {
        actionUrl = `https://acoe.annauniv.edu${actionUrl}`;
      }
      
      const hiddenInputs = extractHiddenInputs(bodyText);
      const formParams = new URLSearchParams();
      hiddenInputs.forEach(input => {
        formParams.append(input.name, input.value);
      });
      // Add submit button value
      formParams.append('submit', 'Login');

      console.log(`HTTP Scraper: Submitting POST to ${actionUrl} with parameters: ${formParams.toString()}`);
      
      const postRes = await httpsPost(actionUrl, formParams.toString(), {
        'Cookie': `ci_session=${activeCookie}`,
        'Referer': currentUrl,
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      
      const postCookies = postRes.headers['set-cookie'];
      if (postCookies && postCookies.length > 0) {
        const cookieStr = Array.isArray(postCookies) ? postCookies[0] : postCookies;
        const match = cookieStr.match(/ci_session=([^;]+)/);
        if (match) {
          activeCookie = match[1];
          console.log(`HTTP Scraper: Cookie updated after form submission: ${activeCookie}`);
        }
      }
      
      const postLocation = postRes.headers['location'];
      if (postRes.statusCode >= 300 && postRes.statusCode < 400 && postLocation) {
        if (postLocation.startsWith('/')) {
          currentUrl = `https://acoe.annauniv.edu${postLocation}`;
        } else {
          currentUrl = postLocation;
        }
        redirectCount++;
        continue;
      } else {
        return {
          statusCode: postRes.statusCode,
          headers: postRes.headers,
          body: postRes.body,
          cookie: activeCookie
        };
      }
    }

    if ((statusCode >= 300 && statusCode < 400) && location) {
      if (location.startsWith('/')) {
        currentUrl = `https://acoe.annauniv.edu${location}`;
      } else {
        currentUrl = location;
      }
      redirectCount++;
    } else {
      return {
        statusCode,
        headers: res.headers,
        body: res.body,
        cookie: activeCookie
      };
    }
  }
  throw new Error('Too many redirects');
}

function getGradePoints(grade) {
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

// Scrape helper: Extract semester number from HTML content
function extractSemesterNo(html) {
  const cleanText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const match = cleanText.match(/Semester\s*[:\-]?\s*([0-9]+)/i);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
}

// Scrape helper: Extract grades from SEMS marks table
function extractGradesFromHTML(html, semesterNo, creditsMap = {}) {
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  const tables = [];
  let match;
  while ((match = tableRegex.exec(html)) !== null) {
    tables.push(match[1]);
  }

  if (tables.length === 0) return [];

  const targetTableHTML = tables.find(t => {
    const lower = t.toLowerCase();
    return lower.includes('code') || lower.includes('grade') || lower.includes('subject');
  }) || tables[0];

  const rows = [];
  let rowMatch;
  while ((rowMatch = rowRegex.exec(targetTableHTML)) !== null) {
    rows.push(rowMatch[1]);
  }

  if (rows.length === 0) return [];

  const cleanText = (h) => {
    return h
      .replace(/<[^>]*>/g, '')
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
    cellRegex.lastIndex = 0;
    while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
      cells.push(cleanText(cellMatch[1]));
    }
    if (cells.length > 0) {
      dataRows.push(cells);
    }
  }

  if (dataRows.length === 0) return [];

  const headers = dataRows[0];
  const tableDataRows = dataRows.slice(1);

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

  if (codeIdx === -1) codeIdx = 1;
  if (titleIdx === -1) titleIdx = 2;
  if (creditsIdx === -1) creditsIdx = 3;
  if (gradeIdx === -1) gradeIdx = 4;
  if (statusIdx === -1) statusIdx = 5;

  const semesterGrades = [];

  for (const row of tableDataRows) {
    if (row.length <= Math.max(codeIdx, titleIdx, gradeIdx)) continue;
    
    const code = (row[codeIdx] || '').trim();
    const title = row[titleIdx];
    const grade = row[gradeIdx];
    const status = statusIdx < row.length ? row[statusIdx] : 'PASS';

    if (!code || code.length < 3) continue;

    // Resolve credits: check table first, then lookup from the credits map, fallback to 3
    let credits = 3;
    if (creditsIdx !== -1 && creditsIdx < row.length) {
      const parsed = parseInt(row[creditsIdx]);
      if (!isNaN(parsed)) {
        credits = parsed;
      } else if (creditsMap[code]) {
        credits = creditsMap[code];
      }
    } else if (creditsMap[code]) {
      credits = creditsMap[code];
    }

    semesterGrades.push({
      semesterNo,
      courseCode: code,
      courseTitle: title ? title.trim() : 'Unknown Course',
      credits,
      grade: grade ? grade.trim().toUpperCase() : 'U',
      gradePoints: getGradePoints(grade || 'U'),
      status: status ? status.trim().toUpperCase() : 'PASS'
    });
  }

  return semesterGrades;
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'STUDENT') return NextResponse.json({ error: 'Only student accounts can trigger SEMS scraping' }, { status: 403 });

    // Parse the body if available
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // Empty or non-JSON request body
    }

    const { semsPassword, captchaCode, sessionCookie } = body;

    // IF semsPassword is not provided -> trigger the local Playwright browser scraper
    if (!semsPassword) {
      const IS_SERVERLESS = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
      if (IS_SERVERLESS) {
        return NextResponse.json({
          error: 'Automated browser scraping is not available in the hosted version. Please use the CAPTCHA login instead.',
          useCaptchaModal: true
        }, { status: 503 });
      }

      console.log(`API trigger (Local Playwright): Starting headed browser scrape for ${user.rollNumber}...`);
      const { runSEMSScraper } = await import('@/lib/scraper');
      const scrapeResult = await runSEMSScraper(user.rollNumber);

      const [semesters, grades] = await Promise.all([
        prisma.semesterSummary.findMany({ where: { userRollNumber: user.rollNumber }, orderBy: { semesterNo: 'asc' } }),
        prisma.courseGrade.findMany({ where: { userRollNumber: user.rollNumber }, orderBy: [{ semesterNo: 'asc' }, { courseCode: 'asc' }] })
      ]);

      return NextResponse.json({ 
        success: true, 
        message: `Successfully scraped ${scrapeResult.count} courses.`, 
        semesters, 
        grades 
      });
    }

    // IF semsPassword is provided -> trigger the HTTP CAPTCHA scraper (works on Vercel)
    console.log(`API trigger (HTTP Scraper): Authenticating roll number ${user.rollNumber}...`);

    // 1. Submit login POST request to SEMS portal
    // SEMS portal expects the password to be hashed client-side with SHA-512 before submission
    const hashedPassword = crypto.createHash('sha512').update(semsPassword).digest('hex');

    const loginParams = new URLSearchParams();
    loginParams.append('username', user.rollNumber);
    loginParams.append('password', hashedPassword);
    loginParams.append('captcha_code', captchaCode);
    const postBody = loginParams.toString();

    const loginRes = await httpsPost('https://acoe.annauniv.edu/sems/login/student', postBody, {
      'Cookie': `ci_session=${sessionCookie}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://acoe.annauniv.edu/sems/login/student',
      'Origin': 'https://acoe.annauniv.edu',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
    });

    // Check if session ID gets regenerated
    let activeCookie = sessionCookie;
    const newCookies = loginRes.headers['set-cookie'];
    if (newCookies && newCookies.length > 0) {
      const cookieStr = Array.isArray(newCookies) ? newCookies[0] : newCookies;
      const match = cookieStr.match(/ci_session=([^;]+)/);
      if (match) {
        activeCookie = match[1];
      }
    }

    // Follow redirect chains if login resulted in a redirect (handles logout_all_machine, etc.)
    let redirectUrl = loginRes.headers['location'];
    if (loginRes.statusCode >= 300 && loginRes.statusCode < 400 && redirectUrl) {
      if (redirectUrl.startsWith('/')) {
        redirectUrl = `https://acoe.annauniv.edu${redirectUrl}`;
      }
      console.log(`HTTP Scraper: Redirecting to: ${redirectUrl}`);
      try {
        const followRes = await httpsGetFollowRedirect(redirectUrl, activeCookie);
        activeCookie = followRes.cookie;
      } catch (err) {
        console.error('HTTP Scraper: Redirect following error:', err);
      }
    }

    // 2. Fetch marks page to verify login was successful
    console.log(`HTTP Scraper: Loading SEMS marks page...`);
    const marksRes = await httpsGet('https://acoe.annauniv.edu/sems/student/mark', {
      'Cookie': `ci_session=${activeCookie}`
    });

    const marksHtml = marksRes.body.toString('utf-8');

    console.log("=== HTTP SCRAPER LOGIN RESPONSE DEBUG ===");
    console.log("Login POST Status Code:", loginRes.statusCode);
    console.log("Login POST Response Headers:", JSON.stringify(loginRes.headers, null, 2));
    console.log("Verification Page Status Code:", marksRes.statusCode);
    console.log("Verification Page HTML Length:", marksHtml.length);
    const cleanVerificationText = marksHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log("Verification Page Text Snippet (1000 chars):", cleanVerificationText.substring(0, 1000));
    console.log("=========================================");

    if (marksHtml.includes('name="username"') || marksHtml.includes('id="password"') || !marksHtml.includes('<select')) {
      return NextResponse.json({ 
        error: 'Login failed. Please verify your SEMS roll number, password, and captcha code.' 
      }, { status: 401 });
    }

    // 3. Find select element and option tags
    const selectMatch = marksHtml.match(/<select[^>]+name="([^"]+)"/i);
    if (!selectMatch) {
      return NextResponse.json({ error: 'Could not find semester selection form on SEMS marks page.' }, { status: 500 });
    }
    const selectName = selectMatch[1];

    // Find all option values inside the select element
    const selectBlockMatch = marksHtml.match(/<select[\s\S]*?<\/select>/i);
    const selectBlock = selectBlockMatch ? selectBlockMatch[0] : marksHtml;
    
    const optionRegex = /<option[^>]+value="([^"]+)"[^>]*>([\s\S]*?)<\/option>/gi;
    const options = [];
    let optionMatch;
    while ((optionMatch = optionRegex.exec(selectBlock)) !== null) {
      const val = optionMatch[1].trim();
      const text = optionMatch[2].replace(/<[^>]*>/g, '').trim();
      if (val && val !== '0') {
        options.push({ value: val, text });
      }
    }

    if (options.length === 0) {
      return NextResponse.json({ error: 'No semesters found to scrape.' }, { status: 404 });
    }

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

    console.log(`HTTP Scraper: Found ${sortedOptions.length} sessions to scrape. Commencing sync...`);

    // Load credits mapping
    let creditsMap = {};
    try {
      const creditsMapPath = path.join(process.cwd(), 'public', 'credits_map.json');
      if (fs.existsSync(creditsMapPath)) {
        creditsMap = JSON.parse(fs.readFileSync(creditsMapPath, 'utf8'));
        console.log(`HTTP Scraper: Loaded ${Object.keys(creditsMap).length} credits from public/credits_map.json`);
      }
    } catch (err) {
      console.error('HTTP Scraper: Failed to load credits map:', err);
    }

    const allSemesterGrades = [];

    // 4. Loop through options and fetch marks for each session
    for (let i = 0; i < sortedOptions.length; i++) {
      const opt = sortedOptions[i];
      console.log(`HTTP Scraper: Fetching marks for ${opt.text}...`);
      
      const optParams = new URLSearchParams();
      optParams.append(selectName, opt.value);
      const optPostBody = optParams.toString();

      const optRes = await httpsPost('https://acoe.annauniv.edu/sems/student/mark', optPostBody, {
        'Cookie': `ci_session=${activeCookie}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://acoe.annauniv.edu/sems/student/mark'
      });

      const optHtml = optRes.body.toString('utf-8');
      
      // Determine semester number from page
      let semesterNo = extractSemesterNo(optHtml);
      if (!semesterNo) {
        semesterNo = i + 1;
        console.log(`HTTP Scraper: Could not determine semester number from page for session ${opt.text}. Falling back to option sequence: Semester ${semesterNo}`);
      }

      // Extract course grades from HTML table
      const grades = extractGradesFromHTML(optHtml, semesterNo, creditsMap);
      if (grades.length > 0) {
        allSemesterGrades.push(...grades);
        console.log(`HTTP Scraper: Scraped ${grades.length} grades for Semester ${semesterNo}.`);
      }
    }

    if (allSemesterGrades.length === 0) {
      return NextResponse.json({ error: 'Could not extract academic data for any semester.' }, { status: 404 });
    }

    console.log(`HTTP Scraper: Syncing ${allSemesterGrades.length} courses to database...`);

    // Group grades by semester for summaries
    const gradesBySemester = {};
    allSemesterGrades.forEach(g => {
      if (!gradesBySemester[g.semesterNo]) {
        gradesBySemester[g.semesterNo] = [];
      }
      gradesBySemester[g.semesterNo].push(g);
    });

    // 5. Update database inside a single transaction
    await prisma.$transaction(async (tx) => {
      // Delete old grades and summaries for this student
      await tx.courseGrade.deleteMany({ where: { userRollNumber: user.rollNumber } });
      await tx.semesterSummary.deleteMany({ where: { userRollNumber: user.rollNumber } });

      // Insert new grades
      await tx.courseGrade.createMany({
        data: allSemesterGrades.map(g => ({
          userRollNumber: user.rollNumber,
          semesterNo: g.semesterNo,
          courseCode: g.courseCode,
          courseTitle: g.courseTitle,
          credits: g.credits,
          grade: g.grade,
          gradePoints: g.gradePoints,
          status: g.status
        }))
      });

      // Insert semester summaries
      for (const semNoStr of Object.keys(gradesBySemester)) {
        const semNo = parseInt(semNoStr);
        const semGrades = gradesBySemester[semNoStr];

        let totalPoints = 0;
        let totalCredits = 0;
        semGrades.forEach(g => {
          totalPoints += g.credits * g.gradePoints;
          totalCredits += g.credits;
        });

        const gpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(3)) : 0.0;

        await tx.semesterSummary.create({
          data: {
            userRollNumber: user.rollNumber,
            semesterNo: semNo,
            gpa,
            creditsEarned: totalCredits
          }
        });
      }
    });

    console.log(`HTTP Scraper: Successfully synchronized ${allSemesterGrades.length} courses for ${user.rollNumber}.`);

    // Fetch refreshed summaries and grades
    const [refreshedSemesters, refreshedGrades] = await Promise.all([
      prisma.semesterSummary.findMany({ where: { userRollNumber: user.rollNumber }, orderBy: { semesterNo: 'asc' } }),
      prisma.courseGrade.findMany({ where: { userRollNumber: user.rollNumber }, orderBy: [{ semesterNo: 'asc' }, { courseCode: 'asc' }] })
    ]);

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${allSemesterGrades.length} course grades from SEMS portal.`,
      semesters: refreshedSemesters,
      grades: refreshedGrades
    });
  } catch (error) {
    console.error('API HTTP scrape error:', error);
    return NextResponse.json({ 
      error: error.message || 'An error occurred during SEMS synchronization.' 
    }, { status: 500 });
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
