import React, { useState, useEffect } from "react";
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
import { useCart } from "./hooks/useCart";
import { products } from "./data/products";
import { Product, SearchIntent } from "./types";
import { GeminiService } from "./services/geminiService";

function App() {
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

  const handleSearch = async (query: string) => {
    setCurrentSearchQuery(query);
    setIsSearching(true);
    setHasSearched(true);

    try {
      // Show loading for at least 4 seconds to display the full animation
      const searchPromise = (async () => {
        const intent = await geminiService.extractSearchIntent(query);
        setSearchIntent(intent);

        const { strictResults, relatedResults } = searchProducts(intent);
        setSearchResults(strictResults);
        setRelatedResults(relatedResults);

        // Generate contextual recommendations
        await generateRecommendations();
      })();

      const minLoadingTime = new Promise((resolve) =>
        setTimeout(resolve, 4000)
      );

      await Promise.all([searchPromise, minLoadingTime]);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
      setCurrentSearchQuery("");
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
      filtered = filtered.filter(
        (product) =>
          product.price <= priceRange.max && product.price >= priceRange.min
      );
    }

    // 2. By category
    if (intent.category) {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === intent.category?.toLowerCase()
      );
    }

    // 3. By keywords/tags (skip for recipe searches as they use ingredients)
    if (intent.keywords.length > 0 && intent.type !== "recipe") {
      filtered = filtered.filter((product) => {
        const searchText = `${product.name} ${
          product.description
        } ${product.tags?.join(" ")} ${product.dataAiHint}`.toLowerCase();
        return intent.keywords.some((keyword) =>
          searchText.includes(keyword.toLowerCase())
        );
      });
    }

    // 4. By ingredients for recipes
    if (intent.ingredients && intent.ingredients.length > 0) {
      filtered = filtered.filter((product) =>
        intent.ingredients?.some((ingredient) =>
          product.tags?.includes(ingredient.toLowerCase())
        )
      );
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
        .filter((p) => p.price <= priceRange.max && p.price >= priceRange.min)
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
              intent.keywords.some((kw) =>
                p.tags?.some((t) => t.includes(kw.toLowerCase()))
              ))
        )
        .sort(sortFn)
        .filter((p) => !strictResults.some((sp) => sp.id === p.id));
    }

    return { strictResults, relatedResults };
  };

  const generateRecommendations = async () => {
    try {
      const context = {
        currentCart: cartItems,
        searchHistory: [],
        category: searchIntent?.category,
        budget: searchIntent?.budget,
      };

      // Simple recommendation logic based on categories and sentiment
      let recommended = products.filter((product) => {
        // Don't recommend items already in cart
        if (cartItems.some((item) => item.product.id === product.id))
          return false;

        // Recommend based on cart categories
        const cartCategories = cartItems.map((item) => item.product.category);
        if (
          cartCategories.length > 0 &&
          cartCategories.includes(product.category)
        ) {
          return true;
        }

        // Recommend high-sentiment products
        const sentimentScore =
          product.sentiment.positive - product.sentiment.negative;
        return sentimentScore > 70;
      });

      // Limit to 4 recommendations
      recommended = recommended.slice(0, 4);
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
    setSearchIntent(null);
    setRecommendations([]);
    setSelectedProduct(null); // Ensure no product detail is open
    setCurrentSearchQuery(""); // Reset the search box and state
    setHasSearched(false); // Redirect to home by resetting search state
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-[#0071dc] text-white sticky top-0 z-40 shadow-sm"
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

            <motion.button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-transparent hover:bg-blue-600 rounded-md transition-colors flex items-center gap-1"
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">😕</span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Oops, we couldn't find any matching products
                  </h3>
                </div>
                <div className="mb-4 text-gray-700">
                  Try searching for something else or browse our featured
                  products below:
                </div>
              </motion.div>
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
                {products.slice(0, 8).map((product) => (
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
            onClose={closeCheckout}
            items={cartItems}
            totalPrice={getTotalPrice()}
            onOrderComplete={handleOrderComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
