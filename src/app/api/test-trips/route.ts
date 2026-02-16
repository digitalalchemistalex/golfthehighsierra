import { NextResponse } from "next/server";

const TRIPS_API = "https://golfthehighsierra.com/trips-caddie/api/api-recaps.php";

export async function GET() {
  try {
    const res = await fetch(`${TRIPS_API}?t=${Date.now()}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GTHS-NextJS/1.0)",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    // Check if we got captcha HTML instead of JSON
    if (text.includes("sgcaptcha") || text.includes("<html")) {
      return NextResponse.json({
        status: "blocked",
        httpStatus: res.status,
        contentType,
        message: "SiteGround captcha is blocking. Need to whitelist Vercel IPs.",
        responsePreview: text.substring(0, 200),
      });
    }

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return NextResponse.json({
        status: "success",
        tripCount: Array.isArray(data) ? data.length : "not-array",
        sampleTrip: Array.isArray(data) && data[0] ? {
          id: data[0].id,
          groupName: data[0].groupName,
          courses: data[0].courses,
          lodging: data[0].lodging,
          region: data[0].region,
          vibe: data[0].vibe,
          pricePerPerson: data[0].pricePerPerson,
          groupSize: data[0].groupSize,
          nights: data[0].nights,
          rounds: data[0].rounds,
        } : null,
        allFields: Array.isArray(data) && data[0] ? Object.keys(data[0]) : [],
      });
    } catch {
      return NextResponse.json({
        status: "parse-error",
        httpStatus: res.status,
        contentType,
        responsePreview: text.substring(0, 500),
      });
    }
  } catch (err: unknown) {
    return NextResponse.json({
      status: "fetch-error",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
