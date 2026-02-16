"use client";

import { useState } from "react";

const EMAIL_URL = "https://golfthehighsierra.com/trips-caddie/api/api-send-email.php";

interface DayItem { day?: number; date?: string; time?: string; activity?: string; location?: string; notes?: string; }
interface Logistics { transportType?: string; passengerCount?: number; specialRequests?: string[]; }

export interface QuoteTrip {
  id?: string; groupName?: string; groupSize?: number; nights?: number; rounds?: number;
  courses?: string[]; lodging?: string; pricePerPerson?: number; pricePerPersonEstimate?: number;
  vibe?: string; synopsis?: string; whyItWorked?: string; highlights?: string[];
  dailyItinerary?: DayItem[]; logistics?: Logistics;
  month?: string; year?: number;
}

export default function QuoteModal({ trip, onClose }: { trip: QuoteTrip; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [changes, setChanges] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaA] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaB] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const send = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !changes.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    if (parseInt(captchaAnswer) !== captchaA + captchaB) {
      alert("Incorrect security answer. Please try again.");
      return;
    }
    setSending(true);
    const price = trip.pricePerPerson || trip.pricePerPersonEstimate || 0;
    const pricingNote = `<div style="background:#fef3c7;padding:12px 16px;border-radius:8px;border:1px solid #fcd34d;margin-bottom:16px"><p style="margin:0;font-size:13px;color:#92400e;line-height:1.5"><strong>⚠️ Pricing Note:</strong> The price shown ($${Math.round(price)}/person) reflects what a previous group paid. Your custom quote will be based on current rates, group size, dates, and availability — final pricing may differ.</p></div>`;

    /* ── Itinerary HTML (shared by both emails) ── */
    const itineraryHtml = trip.dailyItinerary && trip.dailyItinerary.length > 0 ? `
      <div style="margin-bottom:24px">
        <h3 style="color:#475569;font-size:14px;text-transform:uppercase;border-bottom:2px solid #e2e8f0;padding-bottom:5px">Itinerary Summary</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          ${trip.dailyItinerary.map((d, i) => `
            <tr style="border-bottom:1px solid #f1f5f9;background-color:${i % 2 === 0 ? "#ffffff" : "#f8fafc"}">
              <td style="padding:10px;font-weight:bold;width:60px;vertical-align:top;color:#059669">Day ${d.day || i + 1}</td>
              <td style="padding:10px;vertical-align:top">
                <div style="font-weight:700;color:#0f172a;margin-bottom:2px">${d.activity || ""}</div>
                <div style="color:#64748b">${d.time || ""} ${d.location ? "@ " + d.location : ""}</div>
                ${d.notes ? `<div style="color:#94a3b8;font-style:italic;font-size:12px;margin-top:2px">"${d.notes}"</div>` : ""}
              </td>
            </tr>
          `).join("")}
        </table>
      </div>` : "";

    /* ── Special requests HTML ── */
    const specialReqHtml = trip.logistics?.specialRequests && trip.logistics.specialRequests.length > 0 ? `
      <div style="background:#fff1f2;border:1px solid #fecdd3;padding:16px;border-radius:8px;margin-bottom:24px">
        <h3 style="margin:0 0 8px;color:#9f1239;font-size:13px;text-transform:uppercase">Special Requests (Original Trip)</h3>
        <ul style="margin:0;padding-left:18px;color:#881337;font-size:13px">${trip.logistics.specialRequests.map(r => `<li style="margin-bottom:4px">${r}</li>`).join("")}</ul>
      </div>` : "";

    /* ── Highlights HTML ── */
    const highlightsHtml = trip.highlights && trip.highlights.length > 0 ? `
      <div style="margin-bottom:16px">
        <strong style="font-size:12px;color:#64748b;text-transform:uppercase">Highlights:</strong>
        <p style="margin:4px 0 0;font-size:14px">${trip.highlights.join(" · ")}</p>
      </div>` : "";

    /* ═══ ADMIN EMAIL ═══ */
    const adminSubject = `Trip Caddie Quote Request: ${trip.groupName} - ${name}`;
    const adminHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#334155;line-height:1.5">
        <h2 style="color:#064e3b;border-bottom:2px solid #059669;padding-bottom:10px;font-size:20px">⛳ Trip Caddie Quote Request</h2>

        <div style="background:#f8fafc;padding:20px;border-radius:8px;margin-bottom:24px;border:1px solid #e2e8f0">
          <h3 style="margin-top:0;color:#475569;font-size:14px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #cbd5e1;padding-bottom:5px;margin-bottom:10px">Customer Details</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:4px 0;width:100px;color:#64748b;font-size:14px">Name:</td><td style="padding:4px 0;font-weight:600;color:#0f172a">${name}</td></tr>
            <tr><td style="padding:4px 0;width:100px;color:#64748b;font-size:14px">Email:</td><td style="padding:4px 0;font-weight:600"><a href="mailto:${email}" style="color:#059669;text-decoration:none">${email}</a></td></tr>
            <tr><td style="padding:4px 0;width:100px;color:#64748b;font-size:14px">Phone:</td><td style="padding:4px 0;font-weight:600"><a href="tel:${phone}" style="color:#059669;text-decoration:none">${phone}</a></td></tr>
            ${company ? `<tr><td style="padding:4px 0;width:100px;color:#64748b;font-size:14px">Company:</td><td style="padding:4px 0;font-weight:600">${company}</td></tr>` : ""}
          </table>
        </div>

        <div style="margin-bottom:24px">
          <h3 style="background:#0f172a;color:#fff;font-size:14px;padding:8px 12px;border-radius:6px 6px 0 0;margin-bottom:0">Trip Reference: ${trip.groupName}</h3>
          <div style="border:1px solid #e2e8f0;border-top:none;padding:15px;border-radius:0 0 6px 6px">
            <ul style="list-style:none;padding:0;margin:0">
              <li style="margin-bottom:8px;font-size:14px"><strong>📅 Date:</strong> ${trip.month || "N/A"} ${trip.year || ""}</li>
              <li style="margin-bottom:8px;font-size:14px"><strong>👥 Pax:</strong> ${trip.groupSize || "TBD"}</li>
              <li style="margin-bottom:8px;font-size:14px"><strong>🌙 Nights:</strong> ${trip.nights || "TBD"}</li>
              <li style="margin-bottom:8px;font-size:14px"><strong>⛳ Rounds:</strong> ${trip.rounds || trip.courses?.length || 0}</li>
              <li style="margin-bottom:8px;font-size:14px"><strong>💰 Reference Price:</strong> $${Math.round(price)}/pp (historical)</li>
              <li style="margin-bottom:8px;font-size:14px"><strong>🎯 Vibe:</strong> ${trip.vibe || "N/A"}</li>
              <li style="margin-bottom:8px;font-size:14px"><strong>🏨 Lodging:</strong> ${trip.lodging || "TBD"}</li>
              <li style="margin-bottom:8px;font-size:14px"><strong>⛳ Courses:</strong> ${trip.courses?.join(", ") || "TBD"}</li>
              <li style="margin-bottom:8px;font-size:14px"><strong>🚌 Transport:</strong> ${trip.logistics?.transportType || "N/A"}</li>
            </ul>
          </div>
        </div>

        ${highlightsHtml}

        <div style="background:#fff7ed;border:1px solid #fed7aa;padding:20px;border-radius:8px;margin-bottom:24px">
          <h3 style="margin-top:0;color:#9a3412;font-size:14px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Specific Requests / Changes</h3>
          <p style="margin:0;white-space:pre-wrap;color:#431407;font-size:14px">${changes}</p>
        </div>

        ${itineraryHtml}
        ${specialReqHtml}

        ${trip.whyItWorked ? `<div style="background:#f0fdf4;padding:16px;border-radius:8px;border:1px solid #bbf7d0;margin-bottom:24px"><strong style="font-size:12px;color:#166534;text-transform:uppercase">💡 Pro Tip (from original trip):</strong><p style="margin:6px 0 0;font-size:13px;color:#14532d;font-style:italic">"${trip.whyItWorked}"</p></div>` : ""}

        <div style="font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:20px;text-align:center">
          Sent via <strong>Trip Caddie</strong> on golfthehighsierra.com<br/>
          Trip ID: ${trip.id || "N/A"} • ${new Date().toLocaleString()}
        </div>
      </div>`;

    /* ═══ CUSTOMER CONFIRMATION EMAIL ═══ */
    const custSubject = `Your Golf Trip Quote Request — ${trip.groupName}`;
    const custHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#334155;line-height:1.5">
        <div style="background:#065f46;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h2 style="margin:0;font-size:20px">⛳ Thanks for Your Quote Request!</h2>
          <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,.7)">We'll get back to you within 24 hours with a custom quote.</p>
        </div>
        <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
          <p style="margin:0 0 16px;font-size:15px;color:#1e293b">Hi <strong>${name}</strong>, we received your request for a trip based on <strong>${trip.groupName}</strong>.</p>

          ${pricingNote}

          <div style="margin-bottom:24px">
            <h3 style="background:#0f172a;color:#fff;font-size:14px;padding:8px 12px;border-radius:6px 6px 0 0;margin-bottom:0">Your Trip Reference: ${trip.groupName}</h3>
            <div style="border:1px solid #e2e8f0;border-top:none;padding:15px;border-radius:0 0 6px 6px">
              <ul style="list-style:none;padding:0;margin:0">
                <li style="margin-bottom:8px;font-size:14px"><strong>📅 Date:</strong> ${trip.month || "N/A"} ${trip.year || ""}</li>
                <li style="margin-bottom:8px;font-size:14px"><strong>👥 Group Size:</strong> ${trip.groupSize || "TBD"}</li>
                <li style="margin-bottom:8px;font-size:14px"><strong>🌙 Nights:</strong> ${trip.nights || "TBD"}</li>
                <li style="margin-bottom:8px;font-size:14px"><strong>⛳ Courses:</strong> ${trip.courses?.join(", ") || "TBD"}</li>
                <li style="margin-bottom:8px;font-size:14px"><strong>🏨 Lodging:</strong> ${trip.lodging || "TBD"}</li>
                <li style="margin-bottom:8px;font-size:14px"><strong>💰 Reference Price:</strong> $${Math.round(price)}/person <em style="color:#92400e">(historical — your quote may differ)</em></li>
              </ul>
            </div>
          </div>

          ${itineraryHtml}

          <div style="background:#fff7ed;border:1px solid #fed7aa;padding:16px;border-radius:8px;margin-bottom:24px">
            <h3 style="margin-top:0;color:#9a3412;font-size:13px;text-transform:uppercase;margin-bottom:6px">Your Requests / Changes</h3>
            <p style="margin:0;white-space:pre-wrap;color:#431407;font-size:14px">${changes}</p>
          </div>

          <div style="background:#f0fdf4;padding:16px;border-radius:8px;border:1px solid #bbf7d0;margin-bottom:24px;text-align:center">
            <p style="margin:0;font-size:14px;color:#166534"><strong>What happens next?</strong></p>
            <p style="margin:6px 0 0;font-size:13px;color:#14532d">Our team will review your request and build a custom quote based on current availability and rates. Expect to hear from us within 24 hours.</p>
          </div>

          <p style="margin:0;font-size:14px;color:#64748b;text-align:center;line-height:1.6">Need something sooner? Call us at <a href="tel:+18885848232" style="color:#065f46;font-weight:600">(888) 584-8232</a></p>
        </div>
        <div style="padding:16px;text-align:center">
          <p style="margin:0;color:#94a3b8;font-size:11px">Golf the High Sierra · Expert Group Golf Trip Planners · 20+ Years</p>
        </div>
      </div>`;

    try {
      const adminResp = await fetch(EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: "info@golfthehighsierra.com", subject: adminSubject, html: adminHtml }),
      });
      await fetch(EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, subject: custSubject, html: custHtml }),
      });
      if (adminResp.ok) {
        setSent(true);
        setTimeout(() => onClose(), 2500);
      } else {
        alert("Failed to send. Please call (888) 584-8232 instead.");
      }
    } catch {
      alert("Network error. Please call (888) 584-8232 instead.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Quote Request Sent!</h3>
          <p className="text-sm text-slate-500">We&apos;ll get back to you within 24 hours with a custom quote.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h3 className="font-bold text-slate-800">Custom Quote</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto">
          <p className="text-sm text-slate-500">Request a custom quote based on <strong>{trip.groupName}</strong>. Tell us what you&apos;d change.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
            <strong>⚠️ Pricing Note:</strong> The prices shown reflect what a previous group actually paid. Your custom quote will be based on current rates, your group size, dates, and availability — final pricing may differ.
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name <span className="text-rose-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email <span className="text-rose-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" placeholder="name@domain.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone <span className="text-rose-500">*</span></label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" placeholder="(555) 123-4567" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-500 uppercase">Company (Optional)</label>
              <span className="text-[10px] text-slate-400 italic">Useful for corporate billing</span>
            </div>
            <input value={company} onChange={e => setCompany(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" placeholder="Acme Corp" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specific Requests / Changes <span className="text-rose-500">*</span></label>
            <textarea value={changes} onChange={e => setChanges(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white h-24 resize-none transition-all" placeholder="E.g. We need 12 golfers instead of 8, add an extra day for Lake Tahoe..." />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">🔒 Security Check</label>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-slate-700 bg-white px-3 py-2 rounded border border-slate-300">{captchaA} + {captchaB} = ?</span>
              <input type="number" value={captchaAnswer} onChange={e => setCaptchaAnswer(e.target.value)} className="w-20 p-2 border border-slate-300 rounded text-center font-mono text-sm outline-none focus:border-emerald-500" placeholder="?" />
            </div>
          </div>
          <button onClick={send} disabled={sending} className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all ${sending ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 hover:shadow-lg"}`}>
            {sending ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
