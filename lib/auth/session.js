import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'super_secret_enterprise_cms_jwt_key_2026'
);
const COOKIE_NAME = 'cms_session';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function encryptToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function decryptToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession(req) {
  let token = null;

  if (req?.cookies?.get) {
    token = req.cookies.get(COOKIE_NAME)?.value;
  } else if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    token = match ? decodeURIComponent(match[1]) : null;
  }

  if (!token) return null;
  return decryptToken(token);
}

export { COOKIE_NAME };
