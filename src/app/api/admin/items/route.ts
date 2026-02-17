import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.GITHUB_TOKEN || "";
const REPO = process.env.GITHUB_REPO || "digitalalchemistalex/golfthehighsierra";
const API = `https://api.github.com/repos/${REPO}`;

async function ghFetch(url: string, opts?: RequestInit) {
  return fetch(url, {
    ...opts,
    headers: { Authorization: `token ${TOKEN}`, "Content-Type": "application/json", ...opts?.headers },
  });
}

function dataPath(type: string): string {
  if (type === "courses") return "src/data/courses";
  if (type === "hotels") return "src/data/hotels";
  if (type === "venues") return "src/data/venues";
  return "src/data/venues";
}

/* GET: List items or get single item */
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "courses";
  const slug = req.nextUrl.searchParams.get("slug");

  try {
    if (slug) {
      // Get single item
      const res = await ghFetch(`${API}/contents/${dataPath(type)}/${slug}.json`);
      if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const data = await res.json();
      const content = JSON.parse(Buffer.from(data.content, "base64").toString());
      return NextResponse.json(content);
    }

    // List all items
    const res = await ghFetch(`${API}/contents/${dataPath(type)}`);
    if (!res.ok) return NextResponse.json({ items: [] });
    const files = await res.json();

    // Fetch each file to get name, region, heroImage
    const items = await Promise.all(
      files
        .filter((f: any) => f.name.endsWith(".json"))
        .map(async (f: any) => {
          try {
            const r = await ghFetch(f.url);
            const d = await r.json();
            const item = JSON.parse(Buffer.from(d.content, "base64").toString());
            return {
              slug: item.slug || f.name.replace(".json", ""),
              name: item.name || item.title || f.name,
              type: item.type || type,
              region: item.region || item.regionLabel || "",
              heroImage: item.heroImage || "",
            };
          } catch {
            return { slug: f.name.replace(".json", ""), name: f.name, type, region: "", heroImage: "" };
          }
        })
    );

    return NextResponse.json({ items: items.sort((a: any, b: any) => a.name.localeCompare(b.name)) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/* PUT: Update an item — commits to GitHub */
export async function PUT(req: NextRequest) {
  try {
    const { type, slug, data } = await req.json();
    const path = `${dataPath(type)}/${slug}.json`;
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    // Get current file SHA (needed for update)
    const existing = await ghFetch(`${API}/contents/${path}`);
    let sha: string | undefined;
    if (existing.ok) {
      const ex = await existing.json();
      sha = ex.sha;
    }

    // Commit the update
    const res = await ghFetch(`${API}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Admin: Update ${data.name || slug}`,
        content,
        sha,
        branch: "main",
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }
    const err = await res.json();
    return NextResponse.json({ error: err.message }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/* POST: Create a new item */
export async function POST(req: NextRequest) {
  try {
    const { type, slug, data } = await req.json();
    const path = `${dataPath(type)}/${slug}.json`;
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    // Check if already exists
    const existing = await ghFetch(`${API}/contents/${path}`);
    if (existing.ok) {
      return NextResponse.json({ error: "Item already exists. Use PUT to update." }, { status: 409 });
    }

    const res = await ghFetch(`${API}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Admin: Create ${data.name || slug}`,
        content,
        branch: "main",
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }
    const err = await res.json();
    return NextResponse.json({ error: err.message }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
