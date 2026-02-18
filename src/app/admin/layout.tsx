import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GTHS Admin',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0f1a14', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
