import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Golf the High Sierra',
  description: 'The page you are looking for could not be found. Browse our golf courses, hotels, and packages across Reno, Lake Tahoe, and Carson Valley.',
  robots: { index: false, follow: true },
};

const POPULAR = [
  { title: 'Golf Courses', desc: '20+ championship courses across 4 regions', href: '/best-golf-courses-reno/', icon: '⛳' },
  { title: 'Accommodations', desc: 'Casino resorts, mountain lodges & villas', href: '/accommodations-in-reno-tahoe/', icon: '🏨' },
  { title: 'Group Packages', desc: 'Custom stay-and-play for 4 to 400', href: '/group-golf-reno-tahoe/', icon: '📋' },
  { title: 'Request a Quote', desc: 'Free custom quote in 24 hours', href: '/contact-custom-golf-package/', icon: '📞' },
];

const COURSES = [
  { name: 'Edgewood Tahoe', href: '/portfolio/edgewood-tahoe-golf-course/' },
  { name: 'Wolf Run Golf Club', href: '/portfolio/wolf-run-golf-club/' },
  { name: 'LakeRidge Golf Course', href: '/portfolio/lakeridge-golf-course/' },
  { name: 'ArrowCreek Golf Course', href: '/portfolio/arrowcreek-golf-course/' },
  { name: 'Old Greenwood', href: '/portfolio/old-greenwood-golf-course/' },
  { name: 'Coyote Moon', href: '/portfolio/coyote-moon-golf-course/' },
];

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: '#FAFAF7' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 600, marginBottom: 48 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>⛳</div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, color: '#1E3A2F', lineHeight: 1.1, marginBottom: 12 }}>
          This Hole Doesn&apos;t Exist
        </h1>
        <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.6, marginBottom: 24 }}>
          Looks like this page went out of bounds. But don&apos;t worry — we&apos;ve got 20+ courses, 23 hotels, and 65 venues waiting for you.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #C9A24D, #D4B76A)', color: '#1E3A2F', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 100, textDecoration: 'none', boxShadow: '0 0 16px rgba(201,162,77,0.4)' }}>
            ← Back to Home
          </Link>
          <Link href="/contact-custom-golf-package/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1E3A2F', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 100, textDecoration: 'none' }}>
            Get a Free Quote
          </Link>
        </div>
      </div>

      {/* Popular Pages Grid */}
      <div style={{ maxWidth: 800, width: '100%', marginBottom: 48 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#B8963E', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 20 }}>Popular Pages</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {POPULAR.map((p) => (
            <Link key={p.href} href={p.href} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', textDecoration: 'none', transition: 'all 0.3s' }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1E3A2F', marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{p.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Course Links */}
      <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 12 }}>Top Courses</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {COURSES.map((c) => (
            <Link key={c.href} href={c.href} style={{ fontSize: 13, color: '#1E3A2F', background: '#fff', border: '1px solid #E5E7EB', padding: '6px 14px', borderRadius: 100, textDecoration: 'none', fontWeight: 500 }}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Phone CTA */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 8 }}>Need help? Call us directly</p>
        <a href="tel:+18885848232" style={{ fontSize: 20, fontWeight: 700, color: '#1E3A2F', textDecoration: 'none' }}>
          (888) 584-8232
        </a>
      </div>
    </div>
  );
}
