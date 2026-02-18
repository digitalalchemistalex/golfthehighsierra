import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Email and password (min 8 chars) required' }, { status: 400 });
    }

    // Only allow setup if password is still PENDING_HASH
    const { data: user } = await supabaseAdmin
      .from('admin_users')
      .select('id, password_hash')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.password_hash !== 'PENDING_HASH') {
      return NextResponse.json({ error: 'Password already set. Use /admin/login.' }, { status: 400 });
    }

    const hash = hashPassword(password);
    await supabaseAdmin
      .from('admin_users')
      .update({ password_hash: hash })
      .eq('id', user.id);

    return NextResponse.json({ ok: true, message: 'Password set. You can now log in.' });
  } catch (err) {
    console.error('Setup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
