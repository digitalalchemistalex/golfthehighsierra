"use client";
import { useState, useEffect } from "react";

/* ═══ Types ═══ */
interface Item { slug: string; name: string; type: string; region?: string; heroImage?: string; }

/* ═══ Admin Dashboard ═══ */
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"courses"|"hotels"|"venues"|"blog"|"settings">("courses");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("gths-admin")) setAuthed(true);
  }, []);

  const login = async () => {
    setError("");
    const res = await fetch("/api/admin/auth/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (res.ok) { sessionStorage.setItem("gths-admin", "1"); setAuthed(true); }
    else setError("Invalid password");
  };

  const loadItems = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/items/?type=${type}`);
      if (res.ok) { const data = await res.json(); setItems(data.items || []); }
    } catch { }
    setLoading(false);
  };

  const loadItem = async (type: string, slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/items/?type=${type}&slug=${slug}`);
      if (res.ok) { const data = await res.json(); setEditing(data); }
    } catch { }
    setLoading(false);
  };

  const saveItem = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const type = tab === "blog" ? "blog" : tab;
      const res = await fetch("/api/admin/items/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug: editing.slug, data: editing })
      });
      if (res.ok) {
        setToast(`✅ Saved ${editing.name || editing.title}. Site rebuilding...`);
        setTimeout(() => setToast(""), 4000);
        setEditing(null);
        loadItems(type);
      } else {
        setToast("❌ Save failed");
        setTimeout(() => setToast(""), 4000);
      }
    } catch { setToast("❌ Network error"); setTimeout(() => setToast(""), 4000); }
    setSaving(false);
  };

  useEffect(() => { if (authed && tab !== "settings") loadItems(tab); }, [authed, tab]);

  const showToast = toast && <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.startsWith("✅") ? "#1E3A2F" : "#C0392B", color: "#fff", padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,.2)" }}>{toast}</div>;

  /* ═══ LOGIN SCREEN ═══ */
  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0a1810, #1E3A2F)" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⛳</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E3A2F", margin: 0 }}>GTHS Admin</h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Golf the High Sierra Content Manager</p>
        </div>
        <input type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
        {error && <p style={{ color: "#C0392B", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
        <button onClick={login} style={{ width: "100%", padding: "12px 0", background: "#C9A24D", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Sign In</button>
      </div>
    </div>
  );

  const filtered = items.filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.slug?.includes(search.toLowerCase()));

  /* ═══ EDIT FORM ═══ */
  if (editing) {
    const fields = Object.keys(editing).filter(k => !["testimonials","relatedCourses","relatedHotels","contentParagraphs"].includes(k));
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f0" }}>
        <header style={{ background: "#1E3A2F", color: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setEditing(null)} style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>← Back</button>
            <h2 style={{ margin: 0, fontSize: 18 }}>{editing.name || editing.title || editing.slug}</h2>
          </div>
          <button onClick={saveItem} disabled={saving} style={{ background: "#C9A24D", border: "none", color: "#fff", padding: "10px 28px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, opacity: saving ? .6 : 1 }}>
            {saving ? "Saving..." : "💾 Save & Publish"}
          </button>
        </header>
        <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 24px" }}>
          {fields.map(key => {
            const val = editing[key];
            if (val === null || val === undefined) return null;
            if (typeof val === "object" && !Array.isArray(val)) {
              return (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#1E3A2F", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{key}</label>
                  <textarea value={JSON.stringify(val, null, 2)} onChange={e => { try { setEditing({ ...editing, [key]: JSON.parse(e.target.value) }); } catch {} }}
                    style={{ width: "100%", minHeight: 100, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontFamily: "monospace", fontSize: 12, boxSizing: "border-box" }} />
                </div>
              );
            }
            if (Array.isArray(val)) {
              if (val.length > 0 && typeof val[0] === "object") {
                return (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#1E3A2F", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{key} ({val.length} items)</label>
                    <textarea value={JSON.stringify(val, null, 2)} onChange={e => { try { setEditing({ ...editing, [key]: JSON.parse(e.target.value) }); } catch {} }}
                      style={{ width: "100%", minHeight: 120, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontFamily: "monospace", fontSize: 12, boxSizing: "border-box" }} />
                  </div>
                );
              }
              return (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#1E3A2F", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{key}</label>
                  <textarea value={val.join("\n")} onChange={e => setEditing({ ...editing, [key]: e.target.value.split("\n").filter(Boolean) })}
                    style={{ width: "100%", minHeight: 60, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box" }} />
                  <span style={{ fontSize: 11, color: "#999" }}>One per line</span>
                </div>
              );
            }
            const isLong = typeof val === "string" && (val.length > 100 || key === "description" || key === "bodyText" || key === "shortDescription");
            return (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#1E3A2F", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{key}</label>
                {isLong ? (
                  <textarea value={val} onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                    style={{ width: "100%", minHeight: 100, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, lineHeight: 1.6, boxSizing: "border-box" }} />
                ) : (
                  <input type={typeof val === "number" ? "number" : "text"} value={val ?? ""} onChange={e => setEditing({ ...editing, [key]: typeof val === "number" ? Number(e.target.value) : e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box" }} />
                )}
              </div>
            );
          })}
        </div>
        {showToast}
      </div>
    );
  }

  /* ═══ MAIN DASHBOARD ═══ */
  const tabs = [
    { key: "courses" as const, label: "Golf Courses", icon: "⛳", count: tab === "courses" ? items.length : 0 },
    { key: "hotels" as const, label: "Hotels", icon: "🏨", count: tab === "hotels" ? items.length : 0 },
    { key: "venues" as const, label: "Venues", icon: "🍽", count: tab === "venues" ? items.length : 0 },
    { key: "blog" as const, label: "Blog", icon: "📝", count: tab === "blog" ? items.length : 0 },
    { key: "settings" as const, label: "Settings", icon: "⚙️", count: 0 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f0" }}>
      {/* Header */}
      <header style={{ background: "#1E3A2F", color: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>⛳</span>
          <div><h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>GTHS Admin</h1><p style={{ margin: 0, fontSize: 11, opacity: .6 }}>Golf the High Sierra</p></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" target="_blank" style={{ color: "rgba(255,255,255,.6)", fontSize: 13, textDecoration: "none" }}>View Site →</a>
          <button onClick={() => { sessionStorage.removeItem("gths-admin"); setAuthed(false); }} style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Logout</button>
        </div>
      </header>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <nav style={{ width: 220, background: "#fff", borderRight: "1px solid #e5e5e0", minHeight: "calc(100vh - 60px)", padding: "16px 0" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSearch(""); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 20px", border: "none", background: tab === t.key ? "#f0ede5" : "transparent", cursor: "pointer", fontSize: 14, fontWeight: tab === t.key ? 600 : 400, color: tab === t.key ? "#1E3A2F" : "#666", borderLeft: tab === t.key ? "3px solid #C9A24D" : "3px solid transparent" }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main style={{ flex: 1, padding: 32 }}>
          {tab === "settings" ? (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1E3A2F", marginBottom: 16 }}>Site Settings</h2>
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e5e5e0" }}>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
                  <strong>How it works:</strong> When you edit and save any item, it commits the change to GitHub and Vercel automatically rebuilds the site. Changes go live in ~60 seconds.
                </p>
                <div style={{ marginTop: 16, padding: 16, background: "#f9f7f2", borderRadius: 8, fontSize: 13, color: "#555" }}>
                  <div><strong>Pages Live:</strong> 149</div>
                  <div><strong>Courses:</strong> 26 | <strong>Hotels:</strong> 23 | <strong>Venues:</strong> 65</div>
                  <div><strong>Redirects:</strong> 204</div>
                  <div><strong>Last Deploy:</strong> Check Vercel dashboard</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1E3A2F", margin: 0 }}>
                  {tabs.find(t => t.key === tab)?.icon} {tabs.find(t => t.key === tab)?.label} <span style={{ fontSize: 14, fontWeight: 400, color: "#999" }}>({filtered.length})</span>
                </h2>
                <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, width: 220 }} />
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: 60, color: "#999" }}>Loading...</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {filtered.map(item => (
                    <div key={item.slug} onClick={() => loadItem(tab, item.slug)}
                      style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e5e0", overflow: "hidden", cursor: "pointer", transition: "all .2s" }}
                      className="hover:shadow-lg">
                      {item.heroImage && (
                        <div style={{ height: 140, overflow: "hidden", background: "#1E3A2F" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.heroImage} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ padding: 16 }}>
                        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "#1E3A2F" }}>{item.name}</h3>
                        <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#999" }}>
                          {item.region && <span style={{ background: "#f0ede5", padding: "2px 8px", borderRadius: 4 }}>{item.region}</span>}
                          {item.type && <span style={{ background: "#f0ede5", padding: "2px 8px", borderRadius: 4 }}>{item.type}</span>}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: "#C9A24D", fontWeight: 600 }}>Click to edit →</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      {showToast}
    </div>
  );
}
