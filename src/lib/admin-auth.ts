import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase';
import { createHmac } from 'crypto';

const SESSION_COOKIE = 'gths_admin_session';
const SECRET = process.env.ADMIN_SESSION_SECRET || 'gths-sierra-secret-2026';

// Simple HMAC-based session token (no JWT dependency needed)
export function createSessionToken(email: string): string {
  const payload = `${email}:${Date.now()}`;
  const sig = createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

export function verifySessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 3) return null;
    const sig = parts.pop()!;
    const payload = parts.join(':');
    const expected = createHmac('sha256', SECRET).update(payload).digest('hex');
    if (sig !== expected) return null;
    const email = parts[0];
    // Token valid for 7 days
    const ts = parseInt(parts[1]);
    if (Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return null;
    return email;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{ email: string; name: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const email = verifySessionToken(token);
    if (!email) return null;
    // Verify user still exists in DB
    const { data } = await supabaseAdmin
      .from('admin_users')
      .select('email, name')
      .eq('email', email)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

// Simple bcrypt-compatible password check using Node crypto
// Password is stored as sha256 hash prefixed with "sha256:"
export function hashPassword(password: string): string {
  const hash = createHmac('sha256', SECRET).update(password).digest('hex');
  return `sha256:${hash}`;
}

export function checkPassword(password: string, hash: string): boolean {
  if (hash === 'PENDING_HASH') return false;
  if (hash.startsWith('sha256:')) {
    const expected = createHmac('sha256', SECRET).update(password).digest('hex');
    return hash === `sha256:${expected}`;
  }
  return false;
}

export { SESSION_COOKIE };
