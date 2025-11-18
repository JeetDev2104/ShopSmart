import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid query" },
      { status: 400 }
    );
  }

  // Call Python AI search for product names/keywords
  const pyResp = await fetch("http://localhost:8000/ai-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!pyResp.ok) {
    const detail = await pyResp.text();
    return NextResponse.json(
      { error: "AI service error", detail },
      { status: 502 }
    );
  }

  const data = await pyResp.json();
  const names: string[] = Array.isArray(data?.productNames)
    ? data.productNames
    : [];

  // Map names to local product objects (case-insensitive contains match on name)
  const matched = products.filter((p) =>
    names.some((n) => p.name.toLowerCase().includes(String(n).toLowerCase()))
  );

  return NextResponse.json({ products: matched });
}
