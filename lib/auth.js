import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'sems-analyzer-secret-key-ceg-integrated-it-9th-sem';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(req) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const parts = cookie.split('=');
      if (parts.length === 2) {
        acc[parts[0].trim()] = parts[1].trim();
      }
      return acc;
    }, {});
    
    const token = cookies['token'];
    if (!token) return null;
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.rollNumber) return null;
    
    const user = await prisma.user.findUnique({
      where: { rollNumber: decoded.rollNumber },
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
    
    return user;
  } catch (error) {
    console.error('Error in getUserFromRequest:', error);
    return null;
  }
}
