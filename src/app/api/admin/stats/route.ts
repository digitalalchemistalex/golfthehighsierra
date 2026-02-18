import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [allLeads, recentLeads, bookedLeads, activeTrips] = await Promise.all([
      supabaseAdmin.from('leads').select('id, status, region, created_at'),
      supabaseAdmin.from('leads').select('id').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabaseAdmin.from('leads').select('id').eq('status', 'booked'),
      supabaseAdmin.from('trips').select('id').eq('status', 'active'),
    ]);

    const leads = allLeads.data || [];

    // Count by status
    const by_status: Record<string, number> = {};
    const by_region: Record<string, number> = {};
    for (const lead of leads) {
      by_status[lead.status] = (by_status[lead.status] || 0) + 1;
      if (lead.region) by_region[lead.region] = (by_region[lead.region] || 0) + 1;
    }

    return NextResponse.json({
      total: leads.length,
      new_7d: recentLeads.data?.length ?? 0,
      booked: bookedLeads.data?.length ?? 0,
      active: activeTrips.data?.length ?? 0,
      by_status,
      by_region,
    });
  } catch (err) {
    console.error('Stats error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
