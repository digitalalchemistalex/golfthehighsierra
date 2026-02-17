/**
 * Server-side blur placeholder lookup.
 * Import the full map once at build time; extract only what each page needs.
 */
import blurMap from "@/data/blur-map.json";

const map = blurMap as Record<string, string>;

/** Get blur data URL for a single image path (e.g. "/images/courses/foo/hero.jpg") */
export function getBlur(src: string): string | undefined {
  return map[src];
}

/** Get a subset blur map for an array of image paths. Only includes entries that exist. */
export function getBlurs(paths: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const p of paths) {
    if (p && map[p]) result[p] = map[p];
  }
  return result;
}
