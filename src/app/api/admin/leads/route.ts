import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const status = searchParams.get('status');
  const region = searchParams.get('region');

  try {
    let query = supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);
    if (region) query = query.eq('region', region);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ leads: data || [] });
  } catch (err) {
    console.error('Leads list error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, email, phone, party_size, dates, region, budget, source, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({ name, email, phone, party_size, dates, region, budget, source: source || 'admin', notes, status: 'new' })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      action: 'lead_created',
      entity_type: 'lead',
      entity_id: data.id,
      details: { name, email, region },
      created_by: session.email,
    });

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (err) {
    console.error('Lead create error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
