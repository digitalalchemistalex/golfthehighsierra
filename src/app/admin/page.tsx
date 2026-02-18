'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const REGIONS = [
  { key: 'reno', label: 'Reno', color: '#C9A24D', courses: 8, hotels: 10 },
  { key: 'north-lake', label: 'N. Lake / Truckee', color: '#6B8E7F', courses: 6, hotels: 5 },
  { key: 'south-lake', label: 'S. Lake Tahoe', color: '#4A7C6F', courses: 4, hotels: 5 },
  { key: 'carson', label: 'Carson Valley', color: '#8B7355', courses: 3, hotels: 2 },
  { key: 'graeagle', label: 'Graeagle', color: '#5B7A4A', courses: 5, hotels: 2 },
];

const STAGES = ['new','contacted','building','quoted','negotiating','booked','active','completed','lost'];
const STAGE_COLORS: Record<string, string> = {
  new: '#3B82F6', contacted: '#8B5CF6', building: '#F59E0B',
  quoted: '#EF4444', negotiating: '#EC4899', booked: '#10B981',
  active: '#06B6D4', completed: '#6B7280', lost: '#374151',
};

interface Lead {
  id: string; name: string; email: string; phone?: string;
  party_size?: number; dates?: string; region?: string;
  budget?: string; source?: string; status: string;
  notes?: string; created_at: string;
}

interface Stats {
  total: number; new_7d: number; booked: number; active: number;
  by_status: Record<string, number>; by_region: Record<string, number>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [meRes, leadsRes, statsRes] = await Promise.all([
        fetch('/api/admin/me'),
        fetch('/api/admin/leads?limit=10&order=created_at.desc'),
        fetch('/api/admin/stats'),
      ]);
      if (!meRes.ok) { router.replace('/admin/login'); return; }
      const meData = await meRes.json();
      setUser(meData.user);
      if (leadsRes.ok) { const d = await leadsRes.json(); setLeads(d.leads || []); }
      if (statsRes.ok) { const d = await statsRes.json(); setStats(d); }
    } catch { router.replace('/admin/login'); }
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  const filteredLeads = activeRegion
    ? leads.filter(l => l.region === activeRegion)
    : leads;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1a14' }}>
      <div style={{ color: '#C9A24D', fontSize: 16 }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f1a14', color: '#fff' }}>

      {/* ── Top Nav ── */}
      <header style={{
        background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>⛳</span>
          <span style={{ fontWeight: 700, color: '#C9A24D', fontSize: 15 }}>GTHS Admin</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Command Center</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/admin/leads" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>Leads</a>
          <a href="/admin/trips" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>Trips</a>
          <a href="/admin/vendors" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>Vendors</a>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{user?.name}</span>
          <button onClick={logout} style={{
            padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer',
          }}>Sign Out</button>
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Leads', value: stats?.total ?? 0, icon: '👥', color: '#3B82F6' },
            { label: 'New (7 days)', value: stats?.new_7d ?? 0, icon: '🆕', color: '#C9A24D' },
            { label: 'Booked', value: stats?.booked ?? 0, icon: '✅', color: '#10B981' },
            { label: 'Active Trips', value: stats?.active ?? 0, icon: '⛳', color: '#06B6D4' },
          ].map(card => (
            <div key={card.label} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '20px 24px',
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: card.color }}>{card.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{card.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

          {/* ── 5-Region Heatmap ── */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Lead Volume by Region</h3>
              {activeRegion && (
                <button onClick={() => setActiveRegion(null)} style={{ background: 'none', border: 'none', color: '#C9A24D', cursor: 'pointer', fontSize: 12 }}>
                  Clear filter ×
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {REGIONS.map(r => {
                const count = stats?.by_region?.[r.key] ?? 0;
                const max = Math.max(...REGIONS.map(x => stats?.by_region?.[x.key] ?? 0), 1);
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={r.key} onClick={() => setActiveRegion(activeRegion === r.key ? null : r.key)}
                    style={{ cursor: 'pointer', opacity: activeRegion && activeRegion !== r.key ? 0.4 : 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                      <span style={{ color: activeRegion === r.key ? r.color : 'rgba(255,255,255,0.7)' }}>{r.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{count} leads</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Pipeline Status ── */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>Pipeline Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {STAGES.map(stage => {
                const count = stats?.by_status?.[stage] ?? 0;
                return (
                  <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: STAGE_COLORS[stage], flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', width: 100, textTransform: 'capitalize' }}>{stage}</span>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: count > 0 ? `${Math.min(count * 20, 100)}%` : '0%', background: STAGE_COLORS[stage], borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', width: 24, textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Recent Leads ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
              Recent Leads {activeRegion && <span style={{ color: '#C9A24D', fontSize: 13 }}>— {activeRegion}</span>}
            </h3>
            <a href="/admin/leads" style={{ color: '#C9A24D', fontSize: 13, textDecoration: 'none' }}>View all →</a>
          </div>

          {filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              No leads yet. They&apos;ll appear here when the contact form is connected.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Name', 'Contact', 'Region', 'Group', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}>
                    <td style={{ padding: '12px', fontSize: 14, fontWeight: 500 }}>{lead.name}</td>
                    <td style={{ padding: '12px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                      <div>{lead.email}</div>
                      {lead.phone && <div style={{ fontSize: 12 }}>{lead.phone}</div>}
                    </td>
                    <td style={{ padding: '12px', fontSize: 13, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{lead.region || '—'}</td>
                    <td style={{ padding: '12px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{lead.party_size ? `${lead.party_size} people` : '—'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                        background: `${STAGE_COLORS[lead.status] || '#374151'}22`,
                        color: STAGE_COLORS[lead.status] || '#9CA3AF',
                        border: `1px solid ${STAGE_COLORS[lead.status] || '#374151'}44`,
                        textTransform: 'capitalize',
                      }}>{lead.status}</span>
                    </td>
                    <td style={{ padding: '12px', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
          {[
            { label: 'Add Lead', icon: '➕', href: '/admin/leads/new' },
            { label: 'New Trip', icon: '🗺', href: '/admin/trips/new' },
            { label: 'View Leads', icon: '👥', href: '/admin/leads' },
            { label: 'Public Site', icon: '🌐', href: 'https://golfthehighsierra.vercel.app', external: true },
          ].map(action => (
            <a key={action.label} href={action.href} target={action.external ? '_blank' : undefined} rel={action.external ? 'noreferrer' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, textDecoration: 'none', color: 'rgba(255,255,255,0.7)',
                fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
              }}>
              <span style={{ fontSize: 18 }}>{action.icon}</span>
              {action.label}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
