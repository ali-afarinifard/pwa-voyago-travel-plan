import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const base = request.nextUrl.searchParams.get("from") ?? "USD";

  try {
    const res = await fetch(`https://api.frankfurter.dev/v1/latest?from=${encodeURIComponent(base)}`, {
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch rates" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Exchange rate service unavailable" }, { status: 503 });
  }
}