"use client";

import { useState } from "react";

const EMAIL_URL = "https://golfthehighsierra.com/trips-caddie/api/api-send-email.php";

export interface QuoteTrip {
  id?: string; groupName?: string; groupSize?: number; nights?: number; rounds?: number;
  courses?: string[]; lodging?: string; pricePerPerson?: number; pricePerPersonEstimate?: number;
  vibe?: string;
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
    const to = "info@golfthehighsierra.com";
    const subject = `Trip Caddie Quote Request: ${trip.groupName} - ${name}`;
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <div style="background:#065f46;color:white;padding:20px 24px">
          <h2 style="margin:0;font-size:18px">⛳ Trip Caddie Quote Request</h2>
        </div>
        <div style="padding:24px">
          <h3 style="margin:0 0 4px;color:#1e293b">${trip.groupName}</h3>
          <p style="margin:0 0 16px;color:#64748b;font-size:14px">${trip.groupSize} golfers · ${trip.nights} nights · ${trip.rounds || trip.courses?.length || 0} rounds · $${Math.round(price)}/person</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px">
            <tr><td style="padding:8px 0;color:#64748b;width:120px">Customer</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Phone</td><td style="padding:8px 0"><a href="tel:${phone}">${phone}</a></td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:#64748b">Company</td><td style="padding:8px 0">${company}</td></tr>` : ""}
          </table>
          <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:16px">
            <strong style="font-size:12px;color:#64748b;text-transform:uppercase">Courses:</strong>
            <p style="margin:4px 0 0">${trip.courses?.join(", ") || "TBD"}</p>
          </div>
          <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:16px">
            <strong style="font-size:12px;color:#64748b;text-transform:uppercase">Lodging:</strong>
            <p style="margin:4px 0 0">${trip.lodging || "TBD"}</p>
          </div>
          <div style="background:#fffbeb;padding:16px;border-radius:8px;border:1px solid #fde68a">
            <strong style="font-size:12px;color:#92400e;text-transform:uppercase">Specific Requests / Changes</strong>
            <p style="margin:4px 0 0">${changes}</p>
          </div>
        </div>
        <div style="background:#f8fafc;padding:16px 24px;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0;color:#94a3b8;font-size:12px">Sent via Golf the High Sierra · Trip Caddie</p>
        </div>
      </div>`;
    try {
      const resp = await fetch(EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html }),
      });
      if (resp.ok) {
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
