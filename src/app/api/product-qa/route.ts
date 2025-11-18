import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const { productId, userQuestion, sessionId } = await req.json();

    // Comprehensive input validation
    if (!productId || !userQuestion) {
      return NextResponse.json(
        { error: "Missing productId or userQuestion" },
        { status: 400 }
      );
    }

    if (typeof productId !== "string" || typeof userQuestion !== "string") {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400 }
      );
    }

    if (userQuestion.trim().length === 0) {
      return NextResponse.json(
        { error: "Question cannot be empty" },
        { status: 400 }
      );
    }

    console.log("🔗 API Route: Processing request for", {
      productId,
      userQuestion: userQuestion.substring(0, 50) + "...",
      sessionId,
      timestamp: new Date().toISOString(),
    });

    // Look up product details locally
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Call Python AI service
    const pyResp = await fetch("http://localhost:8000/product-qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: product.name,
        productDescription: product.longDescription,
        userQuestion: userQuestion.trim(),
      }),
    });

    if (!pyResp.ok) {
      const detail = await pyResp.text();
      return NextResponse.json(
        { error: "AI service error", detail },
        { status: 502 }
      );
    }

    const data = await pyResp.json();
    if (!data || !data.answer) {
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      );
    }

    console.log(
      "✅ API Route: Successful response for product",
      productId,
      "with answer length:",
      data.answer.length
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API Route: Error processing request:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
