import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import slugTypeMap from "@/data/slug-type-map.json";

const typeMap = slugTypeMap as Record<string, string>;

const prefixMap: Record<string, string> = {
  course: "/portfolio/c",
  hotel: "/portfolio/h",
  venue: "/portfolio/v",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /portfolio/[slug]/ requests (not /portfolio/c/, /portfolio/h/, /portfolio/v/)
  const match = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();

  const slug = match[1];
  // Skip if already a sub-route
  if (slug === "c" || slug === "h" || slug === "v") return NextResponse.next();

  const type = typeMap[slug];
  if (!type || !prefixMap[type]) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `${prefixMap[type]}/${slug}/`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/portfolio/:slug*/",
};
