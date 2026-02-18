'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function MarketingLayoutInner({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const embed = params.get('embed') === 'true';

  if (embed) return <main className="gths-embed">{children}</main>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<><Header /><main>{children}</main><Footer /></>}>
      <MarketingLayoutInner>{children}</MarketingLayoutInner>
    </Suspense>
  );
}
