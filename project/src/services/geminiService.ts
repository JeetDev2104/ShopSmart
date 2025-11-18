// Mock Gemini AI Service - In production, this would integrate with actual Google Gemini API
export class GeminiService {
  private static instance: GeminiService;
  private baseUrl = "http://localhost:8000"; // Python FastAPI service

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async searchProducts(query: string) {
    const response = await fetch(`${this.baseUrl}/ai-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  async answerProductQuestion(productId: string, userQuestion: string) {
    const { products } = await import("../data/products");
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");
    const response = await fetch(`${this.baseUrl}/product-qa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: product.name,
        productDescription: product.longDescription,
        userQuestion,
        category: product.category,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Product QA failed: ${text}`);
    }
    const data = await response.json();
    return data;
  }

  async generateRecommendations(cartProductIds: string[]) {
    const { products } = await import("../data/products");
    const cart = products
      .filter((p) => cartProductIds.includes(p.id))
      .map((p) => ({ id: p.id, name: p.name, category: p.category }));
    const response = await fetch(`${this.baseUrl}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });
    if (!response.ok) throw new Error("Failed to get recommendations");
    const data = await response.json();
    const names: string[] = Array.isArray(data?.productNames)
      ? data.productNames
      : [];
    const matched = products.filter((p) =>
      names.some((n) => p.name.toLowerCase().includes(String(n).toLowerCase()))
    );
    return matched;
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

  async extractSearchIntent(query: string) {
    // Mock implementation - in production, this would call Gemini API
    const lowerQuery = query.toLowerCase();

    // Recipe detection
    if (
      lowerQuery.includes("cook") ||
      lowerQuery.includes("recipe") ||
      lowerQuery.includes("make")
    ) {
      const recipeKeywords = this.extractRecipeKeywords(lowerQuery);
      return {
        type: "recipe" as const,
        keywords: recipeKeywords,
        ingredients: this.mapToIngredients(recipeKeywords),
        category: "Groceries",
      };
    }

    // Skincare detection
    if (
      lowerQuery.includes("skin") ||
      lowerQuery.includes("face") ||
      lowerQuery.includes("sunscreen") ||
      lowerQuery.includes("oily") ||
      lowerQuery.includes("dry") ||
      lowerQuery.includes("acne")
    ) {
      return {
        type: "skincare" as const,
        keywords: this.extractSkincareKeywords(lowerQuery),
        skinType: this.detectSkinType(lowerQuery),
        category: "Skincare",
      };
    }

    // Clothing detection
    if (
      lowerQuery.includes("jacket") ||
      lowerQuery.includes("shirt") ||
      lowerQuery.includes("wear") ||
      lowerQuery.includes("clothing") ||
      (lowerQuery.includes("under") && lowerQuery.includes("₹"))
    ) {
      return {
        type: "clothing" as const,
        keywords: this.extractClothingKeywords(lowerQuery),
        budget: this.extractBudget(lowerQuery),
        category: "Clothing",
      };
    }

    // Default product search
    return {
      type: "product" as const,
      keywords: lowerQuery.split(" ").filter((word) => word.length > 2),
      budget: this.extractBudget(lowerQuery),
    };
  }

  private extractRecipeKeywords(query: string): string[] {
    const recipeWords = [
      "fried rice",
      "biryani",
      "stir fry",
      "pasta",
      "curry",
      "soup",
    ];
    return recipeWords.filter((word) => query.includes(word));
  }

  private mapToIngredients(recipeKeywords: string[]): string[] {
    const ingredientMap: Record<string, string[]> = {
      "fried rice": [
        "jasmine",
        "soy-sauce",
        "onions",
        "olive-oil",
        "eggs",
        "vegetables",
      ],
      biryani: [
        "basmati",
        "chicken",
        "spices",
        "onions",
        "meat",
        "yogurt",
        "olive-oil",
      ],
      "stir fry": ["vegetables", "soy-sauce", "olive-oil", "garlic", "ginger"],
    };

    return recipeKeywords.flatMap((keyword) => ingredientMap[keyword] || []);
  }

  private extractSkincareKeywords(query: string): string[] {
    const keywords = [];
    if (query.includes("sunscreen") || query.includes("spf"))
      keywords.push("sunscreen");
    if (query.includes("cleanser") || query.includes("face wash"))
      keywords.push("cleanser");
    if (query.includes("moisturizer")) keywords.push("moisturizer");
    return keywords;
  }

  private detectSkinType(query: string): string | undefined {
    if (query.includes("oily")) return "oily";
    if (query.includes("dry")) return "dry";
    if (query.includes("sensitive")) return "sensitive";
    if (query.includes("combination")) return "combination";
    return undefined;
  }

  private extractClothingKeywords(query: string): string[] {
    const keywords = [];
    if (query.includes("jacket")) keywords.push("jacket");
    if (query.includes("shirt")) keywords.push("shirt");
    if (query.includes("winter")) keywords.push("winter");
    if (query.includes("casual")) keywords.push("casual");
    return keywords;
  }

  private extractBudget(query: string): number | undefined {
    const budgetMatch = query.match(/₹(\d+)/);
    if (budgetMatch) {
      return parseInt(budgetMatch[1]);
    }
    return undefined;
  }
}
