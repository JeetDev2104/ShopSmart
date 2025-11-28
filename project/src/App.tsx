import { useState, useEffect } from "react";
import { ShoppingCart, Sparkles } from "lucide-react";
//import { FaStore } from "react-icons/fa";
import { TbBrandWalmart } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import TextAnimation from "./components/TextAnimation";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import ProductDetailPage from "./components/ProductDetailPage";
import Cart from "./components/Cart";
import CheckoutFlow from "./components/CheckoutFlow";
import RecommendationPanel from "./components/RecommendationPanel";
import RecipeShoppingList from "./components/RecipeShoppingList";
import AISearchLoader from "./components/AISearchLoader";
import AgenticPopup from "./components/AgenticPopup";
import MealPlanner from "./components/MealPlanner";
import { useCart } from "./hooks/useCart";
// import { products } from "./data/products"; // Removed static import
import { Product, SearchIntent, RecipeDetails } from "./types";
import { GeminiService } from "./services/geminiService";

import NotFoundState from "./components/NotFoundState";

function App() {
  const [products, setProducts] = useState<Product[]>([]); // Added products state
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [relatedResults, setRelatedResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [searchIntent, setSearchIntent] = useState<SearchIntent | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Indicates whether the user has performed at least one search during the current session
  const [hasSearched, setHasSearched] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(null);
  const [isMealPlannerOpen, setIsMealPlannerOpen] = useState(false);
  
  // Agentic Workflow State
  const [showAgenticPopup, setShowAgenticPopup] = useState(false);
  const [isAgenticMode, setIsAgenticMode] = useState(false);

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
    isCheckoutOpen,
    openCheckout,
    closeCheckout,
  } = useCart();

  const geminiService = GeminiService.getInstance();

  useEffect(() => {
    // Fetch products on mount
    const fetchProducts = async () => {
      const fetchedProducts = await geminiService.getProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();

    // Show welcome screen briefly
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Generate recommendations when cart changes
    if (cartItems.length > 0) {
      generateRecommendations();
    }
  }, [cartItems]);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (query: string) => {
    setCurrentSearchQuery(query);
    setIsSearching(true);
    setHasSearched(true);
    setSearchHistory(prev => [...prev, query]);
    setShowAgenticPopup(false); // Reset popup state

    try {
      // Show loading for at least 4 seconds to display the full animation
      const searchPromise = (async () => {
        const productNames = products.map(p => p.name);
        const intent = await geminiService.extractSearchIntent(query, productNames);
        setSearchIntent(intent);

        // Fetch recipe details if this is a recipe search
        if (intent.type === "recipe") {
          const details = await geminiService.getRecipeDetails(query);
          setRecipeDetails(details);
          
          // Trigger Agentic Popup for recipe searches
          setTimeout(() => {
            setShowAgenticPopup(true);
          }, 2000);
        } else {
          setRecipeDetails(null);
        }

        const { strictResults, relatedResults } = searchProducts(intent);
        setSearchResults(strictResults);
        setRelatedResults(relatedResults);

        // Generate contextual recommendations
        await generateRecommendations(intent);
      })();

      const minLoadingTime = new Promise((resolve) =>
        setTimeout(resolve, 4000)
      );

      await Promise.all([searchPromise, minLoadingTime]);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
      // Keep the query to display in the UI
    }
  };

  const searchProducts = (
    intent: SearchIntent
  ): { strictResults: Product[]; relatedResults: Product[] } => {
    let filtered = products;

    // Extract price range from search intent if present
    const priceRange = intent.priceRange;

    // Strict filtering
    // 1. By price range if specified
    if (priceRange) {
      if (priceRange.max !== undefined) {
        filtered = filtered.filter((product) => product.price <= priceRange.max!);
      }
      if (priceRange.min !== undefined) {
        filtered = filtered.filter((product) => product.price >= priceRange.min!);
      }
    }

    // 2. By category (skip for recipe searches as ingredients come from multiple categories)
    if (intent.category && intent.type !== "recipe") {
      filtered = filtered.filter((product) => {
        const productCat = product.category.toLowerCase();
        const intentCat = intent.category!.toLowerCase();
        return productCat.includes(intentCat) || intentCat.includes(productCat);
      });
    }

    // 3. By keywords/tags (skip for recipe searches as they use ingredients)
    if (intent.keywords.length > 0 && intent.type !== "recipe") {
      filtered = filtered.filter((product) => {
        const searchText = `${product.name} ${
          product.description
        } ${product.tags?.join(" ")} ${product.dataAiHint}`.toLowerCase();
        
        return intent.keywords.some((keyword) => {
          const lowerKeyword = keyword.toLowerCase();
          // Check exact match
          if (searchText.includes(lowerKeyword)) return true;
          
          // Check singular form if plural
          if (lowerKeyword.endsWith('s')) {
            const singular = lowerKeyword.slice(0, -1);
            if (searchText.includes(singular)) return true;
          }
          
          // Check plural form if singular (simple check)
          if (searchText.includes(lowerKeyword + 's')) return true;
          
          return false;
        });
      });
    }

    // 4. By ingredients for recipes - use strict matching
    if (intent.ingredients && intent.ingredients.length > 0) {
      filtered = filtered.filter((product) => {
        const productText = `${product.name} ${product.dataAiHint} ${product.tags?.join(" ") || ""}`.toLowerCase();
        return intent.ingredients?.some((ingredient) => {
          const ingredientLower = ingredient.toLowerCase();
          
          // Try exact phrase match first
          if (productText.includes(ingredientLower)) return true;

          // Strict matching: Require ALL significant words to be present
          // This prevents "Sushi Rice" from matching "Basmati Rice" (which has "Rice" but not "Sushi")
          const words = ingredientLower.split(" ").filter(w => w.length > 2);
          
          if (words.length > 0) {
             return words.every(word => productText.includes(word));
          }
          
          return false;
        });
      });
    }

    // Sort both by relevance (sentiment score)
    const sortFn = (a: Product, b: Product) => {
      return b.sentiment.positive - a.sentiment.positive;
    };

    // Strict results are those matching all criteria
    const strictResults = [...filtered].sort(sortFn);

    // Related results are those matching some criteria (like same category or keywords)
    // If we have price range, prioritize showing items within that range first
    let relatedResults: Product[] = [];

    if (priceRange) {
      // Show same category items within price range first
      relatedResults = products
        .filter((p) => {
          const matchesMax = priceRange.max !== undefined ? p.price <= priceRange.max : true;
          const matchesMin = priceRange.min !== undefined ? p.price >= priceRange.min : true;
          return matchesMax && matchesMin;
        })
        .sort(sortFn);

      // Then show same category items regardless of price
      relatedResults = [
        ...relatedResults,
        ...products
          .filter(
            (p) =>
              intent.category &&
              p.category.toLowerCase() === intent.category.toLowerCase()
          )
          .sort(sortFn),
      ];

      // Remove duplicates and already shown strict results
      relatedResults = relatedResults.filter(
        (p, i, self) =>
          self.findIndex((pp) => pp.id === p.id) === i &&
          !strictResults.some((sp) => sp.id === p.id)
      );
    } else {
      // Original related results logic
      relatedResults = products
        .filter(
          (p) =>
            (intent.category &&
              p.category.toLowerCase() === intent.category.toLowerCase()) ||
            (intent.keywords.length > 0 &&
              intent.keywords.some((kw) => {
                const keyword = kw.toLowerCase();
                return (
                  p.name.toLowerCase().includes(keyword) ||
                  p.description.toLowerCase().includes(keyword) ||
                  p.tags?.some((t) => t.toLowerCase().includes(keyword))
                );
              }))
        )
        .sort(sortFn)
        .filter((p) => !strictResults.some((sp) => sp.id === p.id));
    }

    return { strictResults, relatedResults };
  };

  const generateRecommendations = async (currentIntent?: SearchIntent) => {
    try {
      const context = {
        currentCart: cartItems,
        searchHistory: searchHistory,
        category: currentIntent?.category,
        budget: currentIntent?.priceRange?.max,
      };

      const recommended = await geminiService.generateRecommendations(context);
      setRecommendations(recommended);
    } catch (error) {
      console.error("Recommendation error:", error);
    }
  };

  const handleAddAllToCart = () => {
    if (searchIntent?.type === "recipe" && searchResults.length > 0) {
      searchResults.forEach((product) => addToCart(product, 1));
    }
  };

  const handleOrderComplete = () => {
    clearCart();
    setSearchResults([]);
    setRelatedResults([]); // Fix: Clear related results to ensure homepage shows
    setSearchIntent(null);
    setRecommendations([]);
    setSelectedProduct(null); // Ensure no product detail is open
    setCurrentSearchQuery(""); // Reset the search box and state
    setHasSearched(false); // Redirect to home by resetting search state
    setIsAgenticMode(false); // Reset agentic mode
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    // Add product to cart
    addToCart(product, quantity);
    // Close product detail page
    setSelectedProduct(null);
    // Open checkout directly
    openCheckout();
  };

  const [darkMode, setDarkMode] = useState(false);



  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSmartReorder = () => {
    // Mock reordering logic
    const essentials = products.filter(p => ['1', '2', '3'].includes(p.id)); // Rice, Soy Sauce, Veggies
    essentials.forEach(p => addToCart(p, 1));
    alert("Reordered your weekly essentials! 🛒");
  };

  const handleMealPlan = () => {
    setIsMealPlannerOpen(true);
  };

  // Agentic Workflow Handlers
  const handleAgenticStart = async (alternativeProduct?: Product) => {
    setIsAgenticMode(true);
    setShowAgenticPopup(false);
    
    // Add all found items to cart
    if (searchResults.length > 0) {
      searchResults.forEach((product) => addToCart(product, 1));
    }

    // Add alternative if provided
    if (alternativeProduct) {
      addToCart(alternativeProduct, 1);
    }
    
    // Open checkout immediately
    openCheckout();
  };

  const handleFindAlternative = async (missingItem: string): Promise<Product | null> => {
    try {
      // Search for alternatives using the missing item name
      const results = await geminiService.searchProducts(missingItem);
      // Filter out items that are definitely not the right category if possible, 
      // but for now just return the top result that isn't already in the search results
      const validResults = results.filter(r => !searchResults.some(s => s.id === r.id));
      return validResults.length > 0 ? validResults[0] : results[0] || null;
    } catch (error) {
      console.error("Error finding alternative:", error);
      return null;
    }
  };

  const handleAgenticCancel = () => {
    setShowAgenticPopup(false);
  };

  // Show AI Search Loading
  if (isSearching) {
    return <AISearchLoader query={currentSearchQuery} />;
  }

  if (showWelcome) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-600 via-purple- to-blue-800 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="text-center text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Sparkles className="w-16 h-16 mx-auto" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">WalSmart AI</h1>
          <p className="text-xl opacity-90">
            Your Intelligent Shopping Assistant
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // Show Product Detail Page
  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onClose={handleCloseProductDetail}
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
      />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-[#0071dc] dark:bg-gray-800 text-white sticky top-0 z-40 shadow-sm transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => {
                  setSearchResults([]);
                  setRelatedResults([]);
                  setSearchIntent(null);
                  setSelectedProduct(null);
                  setCurrentSearchQuery("");
                  setHasSearched(false);
                  setShowAgenticPopup(false);
                }}
                className="hover:opacity-80 transition-opacity"
                aria-label="Return to home"
              >
                <TbBrandWalmart className="w-8 h-8 text-yellow-500" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">WalSmart AI</h1>
                <p className="text-xs text-blue-100">
                  Intelligent Shopping Website
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              {/* New Feature Buttons */}
              <button onClick={handleSmartReorder} className="text-sm font-medium hover:text-yellow-300 hidden md:block" title="Smart Reorder">
                🔄 Reorder
              </button>
              <button onClick={handleMealPlan} className="text-sm font-medium hover:text-yellow-300 hidden md:block" title="Meal Planner">
                📅 Meal Plan
              </button>
              
              {/* Dark Mode Toggle */}
              <button onClick={toggleDarkMode} className="p-2 hover:bg-white/10 rounded-full" title="Toggle Dark Mode">
                {darkMode ? '☀️' : '🌙'}
              </button>

              <motion.button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-transparent hover:bg-blue-600 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Cart</span>
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <TextAnimation />
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Ask me anything - from recipes to skincare, I'll find exactly what
            you need
          </p>

          <SearchBar
            onSearch={handleSearch}
            isLoading={isSearching}

          />
        </motion.div>

        {/* Recipe Shopping List */}
        <AnimatePresence>
          {searchIntent?.type === "recipe" && searchResults.length > 0 && (
            <RecipeShoppingList
              recipeName={searchIntent.keywords.join(" ")}
              ingredients={searchResults}
              onAddToCart={addToCart}
              onAddAllToCart={handleAddAllToCart}
              recipeInstructions={recipeDetails ? {
                steps: recipeDetails.steps,
                prepTime: recipeDetails.prepTime,
                servings: recipeDetails.servings,
                description: recipeDetails.description
              } : undefined}
            />
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {searchIntent?.type === "recipe"
                      ? "Recipe Ingredients"
                      : "Search Results"}
                  </h3>
                  <p className="text-gray-600">
                    Found {searchResults.length} products
                  </p>
                </div>

                {searchIntent && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                      {searchIntent.type} Search
                    </span>
                  </div>
                )}
              </div>

              {/* Debug Info - Remove in production */}
              <div className="mb-4 p-4 bg-gray-100 rounded text-xs font-mono">
                <p>Type: {searchIntent?.type}</p>
                <p>Category: {searchIntent?.category}</p>
                <p>Ingredients: {searchIntent?.ingredients?.join(", ")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* If no strict results but there are related results, show Oops message and related products */}
          {/* Only show the Oops message if a search was actually performed (not on initial load) */}
          {searchResults.length === 0 &&
            relatedResults.length > 0 &&
            hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">😔</span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Oops, this product is yet not available
                  </h3>
                </div>
                <div className="mb-4 text-gray-700">
                  However, you might be interested in these related products:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {relatedResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          {/* If no results at all, show a different message */}
          {searchResults.length === 0 &&
            relatedResults.length === 0 &&
            hasSearched && (
              <NotFoundState type="general" query={currentSearchQuery} />
            )}
        </AnimatePresence>

        {/* Recommendations */}
        <RecommendationPanel
          recommendations={recommendations}
          onAddToCart={addToCart}
          onProductClick={handleProductClick}
        />

        {/* Featured Products (when no search) */}
        {searchResults.length === 0 &&
          relatedResults.length === 0 &&
          !hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Featured Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.slice(0, 40).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </motion.div>
          )}
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <Cart
            items={cartItems}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => {
              setIsCartOpen(false);
              openCheckout();
            }}
            totalPrice={getTotalPrice()}
          />
        )}
      </AnimatePresence>

      {/* Checkout Flow */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutFlow
            isOpen={isCheckoutOpen}
            onClose={() => {
              closeCheckout();
              setIsAgenticMode(false);
            }}
            items={cartItems}
            totalPrice={getTotalPrice()}
            onOrderComplete={handleOrderComplete}
            isAgentic={isAgenticMode}
          />
        )}
      </AnimatePresence>

      {/* Agentic Popup */}
      <AgenticPopup
        isOpen={showAgenticPopup}
        onConfirm={handleAgenticStart}
        onCancel={handleAgenticCancel}
        recipeIngredients={recipeDetails?.ingredients || []}
        foundProducts={searchResults.map(p => p.name)}
        onFindAlternative={handleFindAlternative}
      />

      {/* Meal Planner Modal */}
      <AnimatePresence>
        {isMealPlannerOpen && (
          <MealPlanner
            isOpen={isMealPlannerOpen}
            onClose={() => setIsMealPlannerOpen(false)}
            onAddToCart={addToCart}
            products={products}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
