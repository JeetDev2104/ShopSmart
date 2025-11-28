// Mock Gemini AI Service - In production, this would integrate with actual Google Gemini API
export class GeminiService {
  private static instance: GeminiService;
  private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"; // Python FastAPI service

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async getProducts() {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  }

  async searchProducts(query: string) {
    const response = await fetch(`${this.baseUrl}/ai-search`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) throw new Error("Failed to search products");
    const data = await response.json();
    const names: string[] = Array.isArray(data?.productNames)
      ? data.productNames
      : [];
    const { products } = await import("../data/products");
    const matched = products.filter((p) =>
      names.some((n) => p.name.toLowerCase().includes(String(n).toLowerCase()))
    );
    return matched;
  }

  async answerProductQuestion(productId: string, userQuestion: string, history: { role: string; content: string }[] = []) {
    const { products } = await import("../data/products");
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");
    
    const response = await fetch(`${this.baseUrl}/product-qa`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({
        query: userQuestion,
        product: {
          name: product.name,
          description: product.description,
          longDescription: product.longDescription,
          price: product.price,
          category: product.category,
          sentiment: product.sentiment
        },
        history: history
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Product QA failed: ${text}`);
    }
    const data = await response.json();
    return {
      answer: data.answer,
      confidence: data.confidence,
      followUpQuestions: data.followUpQuestions,
      suggestedProduct: data.suggestedProduct
    };
  }

  async analyzeReview(reviewText: string, currentSentiment: any) {
    const response = await fetch(`${this.baseUrl}/analyze-review`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({ reviewText, currentSentiment }),
    });
    if (!response.ok) throw new Error("Failed to analyze review");
    return await response.json();
  }

  async generateRecommendations(context: any) {
    const { products } = await import("../data/products");
    
    // Mock recommendation logic based on context
    // In production, this would send the context to the Python backend
    
    let recommended = products;

    // Filter by category if present in context
    if (context.category) {
      recommended = recommended.filter(p => p.category === context.category);
    }

    // Filter by budget if present
    if (context.budget) {
      recommended = recommended.filter(p => p.price <= context.budget);
    }

    // Filter based on search history (simple keyword matching)
    if (context.searchHistory && context.searchHistory.length > 0) {
      const lastSearch = context.searchHistory[context.searchHistory.length - 1].toLowerCase();
      recommended = recommended.filter(p => 
        p.name.toLowerCase().includes(lastSearch) || 
        p.description.toLowerCase().includes(lastSearch) ||
        p.category.toLowerCase().includes(lastSearch)
      );
    }
    
    // If we have cart items, try to find complementary products
    if (context.currentCart && context.currentCart.length > 0) {
       // Simple logic: if cart has "rice", recommend "sauce" or "spices"
       const cartCategories = context.currentCart.map((item: any) => item.product.category);
       if (cartCategories.includes('Pantry')) {
         recommended = products.filter(p => p.category === 'Pantry' && !context.currentCart.some((i: any) => i.product.id === p.id));
       }
    }

    // Randomize and limit
    return recommended.sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  async getProductSentiment(productId: string) {
    const response = await fetch("/api/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) throw new Error("Failed to get sentiment");
    return await response.json();
  }

  async extractSearchIntent(query: string, availableProducts: string[] = []): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/detect-intent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ 
          query,
          availableProducts 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to detect intent");
      }

      const data = await response.json();
      
      return {
        type: data.type,
        keywords: data.keywords,
        ingredients: data.ingredients,
        priceRange: data.priceRange,
        skinType: data.skinType,
        category: data.category || "General"
      };
    } catch (error) {
      console.error("Intent detection failed, falling back to basic search", error);
      return {
        type: "product",
        keywords: query.split(" ").filter((word) => word.length > 2),
        priceRange: undefined,
      };
    }
  }

  async getRecipeDetails(query: string) {
    try {
      const response = await fetch(`${this.baseUrl}/recipe-details`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recipe details");
      }

      const data = await response.json();
      return {
        name: data.name,
        ingredients: data.ingredients,
        steps: data.steps,
        prepTime: data.prepTime,
        servings: data.servings,
        description: data.description
      };
    } catch (error) {
      console.error("Recipe details fetch failed", error);
      return {
        name: query,
        ingredients: [],
        steps: ["Recipe details unavailable. Please search online for instructions."],
        prepTime: "Unknown",
        servings: 4,
        description: "Recipe details could not be loaded."
      };
    }
  }
}
