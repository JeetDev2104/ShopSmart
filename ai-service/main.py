import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv, find_dotenv
from openai import OpenAI

# Load .env from current or parent dirs (so ShopSmart/.env works too)
env_path = find_dotenv(filename=".env", usecwd=True)
load_dotenv(env_path)

app = FastAPI()

# Enable CORS for local dev (Vite:5173, Next:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductQARequest(BaseModel):
    productName: str
    productDescription: str
    userQuestion: str
    category: str | None = None

class ProductQAResponse(BaseModel):
    answer: str
    confidence: float = 0.9
    followUpQuestions: list[str] | None = None

OPENAI_API_KEY = os.getenv("OPEN_AI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPEN_AI_API_KEY")

client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=OPENAI_API_KEY)

@app.post("/product-qa", response_model=ProductQAResponse)
def product_qa(req: ProductQARequest):
    try:
        category = req.category or ""
        prompt = (
            "You are a senior retail product expert. Provide a clear, practical, and actionable answer to the user's product question.\n"
            "Strict rules:\n"
            "- Start directly with the answer in 1-2 sentences (no fluff).\n"
            "- Then add up to 3 bullet points with specifics (features, how-to steps, suitability).\n"
            "- If question is irrelevant to the product, say so and suggest what to ask.\n"
            "- Keep it focused on this product only.\n\n"
            f"Product: {req.productName}\n"
            f"Category: {category}\n"
            f"Details: {req.productDescription}\n"
            f"User question: {req.userQuestion}\n\n"
            "Special handling for cooking/recipes:\n"
            "- If the question asks how to cook, make, or a recipe (e.g., fried rice) and the product is a food ingredient (rice, pantry item, oil, sauce), provide step-by-step instructions using THIS product.\n"
            "- Keep steps concise (4-8 steps), include quantities when obvious, and note tips to avoid sticking/burning.\n\n"
            "Return ONLY the final answer text (no JSON)."
        )
        messages = [
            {"role": "system", "content": "You answer product questions clearly with concise, structured guidance."},
            {"role": "user", "content": prompt},
        ]
        resp = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=messages,
        )
        answer = (resp.choices[0].message.content or "").strip()
        # Generate contextual follow-up questions (2-3)
        fu_messages = [
            {"role": "system", "content": "Generate 2-3 concise follow-up questions a shopper might ask next about THIS product."},
            {"role": "user", "content": (
                f"Product: {req.productName}\nCategory: {category}\nQuestion: {req.userQuestion}\nAnswer: {answer}\n"
                "Return ONLY a JSON array of strings."
            )},
        ]
        followups = []
        try:
            fu_resp = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                response_format={"type": "json_array"},
                messages=fu_messages,
            )
            try:
                import json
                followups = json.loads(fu_resp.choices[0].message.content or "[]")
                if not isinstance(followups, list):
                    followups = []
            except Exception:
                followups = []
        except Exception:
            followups = []
        return ProductQAResponse(answer=answer, confidence=0.9, followUpQuestions=followups)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class AISearchRequest(BaseModel):
    query: str

class AISearchResponse(BaseModel):
    productNames: list[str]


@app.post("/ai-search", response_model=AISearchResponse)
def ai_search(req: AISearchRequest):
    try:
        messages = [
            {"role": "system", "content": (
                "Extract relevant product names or keywords from the user's shopping query. "
                "Return ONLY a JSON object with key 'productNames' as an array of up to 6 strings. No extra text."
            )},
            {"role": "user", "content": req.query},
        ]
        resp = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=messages,
        )
        content = resp.choices[0].message.content or "{}"
        import json
        obj = json.loads(content)
        names = obj.get("productNames") or obj.get("products") or []
        if not isinstance(names, list):
            names = []
        names = [str(x)[:100] for x in names][:6]
        return AISearchResponse(productNames=names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class RecommendRequest(BaseModel):
    cart: list[dict]

class RecommendResponse(BaseModel):
    productNames: list[str]


@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    try:
        cart_desc = ", ".join(
            [f"{(i.get('name') or i.get('productName') or 'item')} ({i.get('category','')})" for i in req.cart]
        ) or "no items"
        prompt = (
            "Suggest up to 5 complementary products (names or keywords) for the user's cart. "
            "Return ONLY a JSON object {\n  'productNames': [strings]\n}. Keep names short.\n"
            f"Cart: {cart_desc}"
        )
        messages = [
            {"role": "system", "content": "You recommend relevant retail products succinctly."},
            {"role": "user", "content": prompt},
        ]
        resp = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=messages,
        )
        import json
        content = resp.choices[0].message.content or "{}"
        obj = json.loads(content)
        names = obj.get("productNames") or []
        if not isinstance(names, list):
            names = []
        names = [str(x)[:100] for x in names][:5]
        return RecommendResponse(productNames=names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
