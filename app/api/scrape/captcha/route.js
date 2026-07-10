import { NextResponse } from 'next/server';
import https from 'https';

// Helper to make a secure/insecure HTTPS GET request
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      rejectUnauthorized: false, // bypass SSL cert errors on server environments
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

export async function GET() {
  try {
    // 1. Fetch SEMS student login page to initiate a session and get the cookie
    const pageRes = await httpsGet('https://acoe.annauniv.edu/sems/login/student');
    const setCookie = pageRes.headers['set-cookie'];
    if (!setCookie || setCookie.length === 0) {
      throw new Error('No session cookie returned from SEMS portal.');
    }

    // Extract ci_session cookie value
    const cookieStr = Array.isArray(setCookie) ? setCookie[0] : setCookie;
    const match = cookieStr.match(/ci_session=([^;]+)/);
    if (!match) {
      throw new Error('Could not parse session ID from cookies.');
    }
    const sessId = match[1];

    // 2. Fetch Captcha image using the same session cookie
    const captchaRes = await httpsGet('https://acoe.annauniv.edu/sems/Login/captcha', {
      'Cookie': `ci_session=${sessId}`
    });

    const base64Img = captchaRes.body.toString('base64');

    return NextResponse.json({
      success: true,
      captchaImg: `data:image/jpeg;base64,${base64Img}`,
      sessionCookie: sessId
    });
  } catch (error) {
    console.error('SEMS Captcha fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch Captcha image from SEMS portal.'
    }, { status: 500 });
  }
}
