import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { cartProductIds } = await req.json();
  if (!Array.isArray(cartProductIds)) {
    return NextResponse.json(
      { error: "cartProductIds must be an array" },
      { status: 400 }
    );
  }

  // Build lightweight cart description to send to Python service
  const cart = products
    .filter((p) => cartProductIds.includes(p.id))
    .map((p) => ({ id: p.id, name: p.name, category: p.category }));

  const pyResp = await fetch("http://localhost:8000/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart }),
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

  // Map names to known products (contains match)
  const matched = products.filter((p) =>
    names.some((n) => p.name.toLowerCase().includes(String(n).toLowerCase()))
  );

  return NextResponse.json({ recommendations: matched });
}
