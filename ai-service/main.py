import os
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Depends
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPEN_AI_API_KEY")
if not OPENAI_API_KEY:
    # Fallback for development if env var is missing, though it should be there
    print("Warning: OPEN_AI_API_KEY not found in environment variables.")

client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=OPENAI_API_KEY)

# --- Product QA ---

class ProductQARequest(BaseModel):
    query: str
    product: Dict[str, Any]
    history: List[Dict[str, str]] = []

class ProductQAResponse(BaseModel):
    answer: str
    confidence: float = 0.9
    followUpQuestions: List[str] | None = None
    suggestedProduct: Optional[str] = None

@app.post("/product-qa", response_model=ProductQAResponse)
async def product_qa(request: ProductQARequest):
    try:
        # Format history for the prompt
        history_text = ""
        if request.history:
            history_text = "\nPrevious Conversation:\n" + "\n".join(
                [f"{msg['role'].capitalize()}: {msg['content']}" for msg in request.history]
            )

        # Extract product details safely
        p_name = request.product.get('name', 'Unknown Product')
        p_desc = request.product.get('description', '')
        p_price = request.product.get('price', 0)
        p_cat = request.product.get('category', 'General')
        p_long_desc = request.product.get('longDescription', '')
        p_sentiment = json.dumps(request.product.get('sentiment', {}))

        prompt = f"""You are a helpful shopping assistant for WalSmart.
Product: {p_name}
Description: {p_desc}
Price: ${p_price}
Category: {p_cat}
Details: {p_long_desc}
Sentiment: {p_sentiment}
{history_text}

User Question: {request.query}

Answer the user's question about this specific product.
- Be helpful, friendly, and concise.
- Use the product details and sentiment data to provide accurate information.
- If the user asks for a recipe, provide a simple step-by-step guide using this product.
- If the user asks about quality, refer to the sentiment score.
- Format your response with Markdown. Use **bold** for key terms and *italics* for emphasis.
- Use bullet points or numbered lists for steps or features.

CRITICAL: IRRELEVANT QUESTIONS
- If the question is COMPLETELY IRRELEVANT to the product or shopping (e.g., "Who is the president?", "What is the capital of France?", "Solve 2+2"), DO NOT ANSWER IT.
- Instead, politely decline and suggest a specific, real product that might be relevant to the *words* in the query, or just a popular product like "Basmati Rice" or "Running Shoes".
- Return a JSON object with:
  - "answer": The polite refusal message.
  - "suggestedProduct": The name of the product you suggest checking out instead.
- If the question IS relevant, return JSON with:
  - "answer": Your helpful answer.
  - "suggestedProduct": null

Example Irrelevant JSON:
{{
  "answer": "I can only help with questions about this product. However, you might be interested in our fresh groceries!",
  "suggestedProduct": "Fresh Vegetables"
}}
"""

        messages = [
            {"role": "system", "content": "You are a helpful AI shopping assistant. You MUST return JSON."},
            {"role": "user", "content": prompt},
        ]
        
        resp = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=messages,
        )
        content = resp.choices[0].message.content or "{}"
        result = json.loads(content)
        
        answer = result.get("answer", "I'm sorry, I couldn't process that.")
        suggested_product = result.get("suggestedProduct")

        # Generate contextual follow-up questions (2-3) ONLY if relevant
        followups = []
        if not suggested_product:
            fu_messages = [
                {"role": "system", "content": "Generate 2-3 concise follow-up questions a shopper might ask next about THIS product based on the answer provided."},
                {"role": "user", "content": (
                    f"Product: {p_name}\nQuestion: {request.query}\nAnswer: {answer}\n"
                    "Return ONLY a JSON array of strings."
                )},
            ]
            try:
                fu_resp = client.chat.completions.create(
                    model="openai/gpt-4o-mini",
                    response_format={"type": "json_array"},
                    messages=fu_messages,
                )
                followups = json.loads(fu_resp.choices[0].message.content or "[]")
                if not isinstance(followups, list):
                    followups = []
            except Exception:
                followups = []

        return ProductQAResponse(answer=answer, confidence=0.9, followUpQuestions=followups, suggestedProduct=suggested_product)
    except Exception as e:
        print(f"Error in product_qa: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Review Analysis ---

class AnalyzeReviewRequest(BaseModel):
    reviewText: str
    currentSentiment: Dict[str, Any]

class AnalyzeReviewResponse(BaseModel):
    positive: int
    negative: int
    aspects: Dict[str, int]

@app.post("/analyze-review", response_model=AnalyzeReviewResponse)
async def analyze_review(request: AnalyzeReviewRequest):
    try:
        prompt = f"""Analyze this new user review and update the product's sentiment scores.
Current Sentiment: {json.dumps(request.currentSentiment)}
New Review: "{request.reviewText}"

Return the UPDATED sentiment scores based on this new review.
- Adjust 'positive' and 'negative' percentages (must sum to 100).
- Update relevant aspect scores (0-100) if mentioned in the review.
- Return ONLY a JSON object with keys: 'positive', 'negative', 'aspects'.
"""
        messages = [
            {"role": "system", "content": "You are a sentiment analysis AI."},
            {"role": "user", "content": prompt},
        ]

        resp = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=messages,
        )
        
        content = resp.choices[0].message.content or "{}"
        result = json.loads(content)
        
        return AnalyzeReviewResponse(
            positive=result.get('positive', 50),
            negative=result.get('negative', 50),
            aspects=result.get('aspects', {})
        )
    except Exception as e:
        print(f"Error in analyze_review: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- AI Search ---

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
        obj = json.loads(content)
        names = obj.get("productNames") or obj.get("products") or []
        if not isinstance(names, list):
            names = []
        names = [str(x)[:100] for x in names][:6]
        return AISearchResponse(productNames=names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Recommendations ---

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
        content = resp.choices[0].message.content or "{}"
        obj = json.loads(content)
        names = obj.get("productNames") or []
        if not isinstance(names, list):
            names = []
        names = [str(x)[:100] for x in names][:5]
        return RecommendResponse(productNames=names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Intent Detection ---

from sqlalchemy.orm import Session
from database import get_db, engine
import models

models.Base.metadata.create_all(bind=engine)

# ... (existing imports)

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products

class DetectIntentRequest(BaseModel):
    query: str
    # availableProducts is no longer needed from frontend, we use DB
    availableProducts: Optional[List[str]] = [] 

class DetectIntentResponse(BaseModel):
    type: str
    keywords: List[str]
    ingredients: List[str] = []
    priceRange: Optional[Dict[str, int]] = None
    skinType: Optional[str] = None
    category: Optional[str] = None 

# ... (DetectIntentResponse definition)

@app.post("/detect-intent", response_model=DetectIntentResponse)
def detect_intent(req: DetectIntentRequest, db: Session = Depends(get_db)):
    try:
        # Fetch available products from DB
        products = db.query(models.Product).all()
        product_names = [p.name for p in products]
        
        products_context = ""
        if product_names:
            # Limit to 500 to avoid token limits, prioritize by relevance if possible (future improvement)
            products_list = "\n".join(product_names[:500]) 
            products_context = f"\nAVAILABLE PRODUCTS:\n{products_list}\n"

        prompt = f"""Analyze the user's shopping query and extract structured intent.
Query: "{req.query}"
{products_context}
Return ONLY a JSON object with the following keys:
- type: One of ["recipe", "skincare", "clothing", "electronics", "grocery", "product"]
- keywords: List of relevant search keywords (exclude stop words).
- ingredients: List of SPECIFIC PRODUCT NAMES if type is "recipe".
  IMPORTANT: If "AVAILABLE PRODUCTS" are provided above, you MUST choose ingredients from that list that best match the recipe requirements.
  - If the recipe needs chicken, and "Fresh Chicken Breast" is in the list, use "Fresh Chicken Breast".
  - If the recipe needs rice, and "Basmati Rice Premium Grade" is in the list, use that.
  - If a required ingredient is NOT in the available products list, do NOT invent a name. Omit it or find the closest substitute in the list.
- priceRange: Object with 'min' and 'max' integers if mentioned.
- skinType: If skincare, one of ["oily", "dry", "sensitive", "combination"] or null.
- category: Best matching category from: ["Groceries", "Skincare", "Clothing", "Electronics", "Pantry", "Produce"].

Example JSON:
{{
  "type": "recipe",
  "keywords": ["sushi", "roll"],
  "ingredients": ["Sushi Rice", "Nori Seaweed Sheets", "Rice Vinegar", "Soy Sauce - Premium Dark"],
  "priceRange": null,
  "skinType": null,
  "category": "Pantry"
}}
"""
        messages = [
            {"role": "system", "content": "You are a smart shopping intent analyzer."},
            {"role": "user", "content": prompt},
        ]
        resp = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=messages,
        )
        content = resp.choices[0].message.content or "{}"
        obj = json.loads(content)
        
        return DetectIntentResponse(
            type=obj.get("type", "product"),
            keywords=obj.get("keywords", []),
            ingredients=obj.get("ingredients", []),
            priceRange=obj.get("priceRange"),
            skinType=obj.get("skinType"),
            category=obj.get("category")
        )
    except Exception as e:
        print(f"Error in detect_intent: {e}")
        # Fallback to basic product search
        return DetectIntentResponse(type="product", keywords=req.query.split(), ingredients=[])

# --- Recipe Details ---

class RecipeDetailsRequest(BaseModel):
    query: str

class RecipeDetailsResponse(BaseModel):
    name: str
    ingredients: List[str]
    steps: List[str]
    prepTime: str
    servings: int
    description: str

@app.post("/recipe-details", response_model=RecipeDetailsResponse)
def get_recipe_details(req: RecipeDetailsRequest):
    try:
        prompt = f"""Generate a detailed recipe for: "{req.query}"

Return ONLY a JSON object with the following keys:
- name: The recipe name (e.g., "Sushi Rolls", "Vegetable Fried Rice")
- description: A brief 1-sentence description of the dish
- ingredients: List of SPECIFIC ingredients with quantities (e.g., "2 cups Sushi Rice", "1 tbsp Soy Sauce")
- steps: List of detailed cooking instructions (numbered steps)
- prepTime: Estimated preparation and cooking time (e.g., "45 minutes", "1 hour")
- servings: Number of servings (integer)

Make the recipe practical and easy to follow. Use common grocery store product names.

Example JSON:
{{
  "name": "Classic Sushi Rolls",
  "description": "Fresh and delicious homemade sushi rolls with your favorite fillings",
  "ingredients": [
    "2 cups Sushi Rice",
    "3 tbsp Rice Vinegar",
    "4 sheets Nori (seaweed)",
    "2 tbsp Soy Sauce",
    "1 tsp Sesame Oil",
    "Fresh vegetables or fish for filling"
  ],
  "steps": [
    "Rinse the sushi rice thoroughly and cook according to package instructions",
    "Mix rice vinegar with a pinch of sugar and salt, then fold into warm rice",
    "Let the rice cool to room temperature",
    "Place a nori sheet on a bamboo mat, spread rice evenly leaving 1 inch at the top",
    "Add your choice of fillings in a line across the center",
    "Roll tightly using the bamboo mat, seal the edge with a bit of water",
    "Slice into 6-8 pieces with a sharp wet knife",
    "Serve with soy sauce, wasabi, and pickled ginger"
  ],
  "prepTime": "45 minutes",
  "servings": 4
}}
"""
        messages = [
            {"role": "system", "content": "You are a professional chef providing detailed recipes. Return ONLY valid JSON."},
            {"role": "user", "content": prompt},
        ]
        resp = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=messages,
        )
        content = resp.choices[0].message.content or "{}"
        obj = json.loads(content)
        
        return RecipeDetailsResponse(
            name=obj.get("name", "Recipe"),
            ingredients=obj.get("ingredients", []),
            steps=obj.get("steps", []),
            prepTime=obj.get("prepTime", "30 minutes"),
            servings=obj.get("servings", 4),
            description=obj.get("description", "A delicious homemade recipe")
        )
    except Exception as e:
        print(f"Error in get_recipe_details: {e}")
        # Fallback response
        return RecipeDetailsResponse(
            name=req.query.title(),
            ingredients=["Check recipe online for ingredients"],
            steps=["Please search online for detailed instructions"],
            prepTime="30 minutes",
            servings=4,
            description="Recipe details unavailable"
        )
