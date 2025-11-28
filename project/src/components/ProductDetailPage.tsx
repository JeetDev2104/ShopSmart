import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Star, ThumbsUp, ThumbsDown, MessageCircle, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import ProductQA from './ProductQA';
import { GeminiService } from '../services/geminiService';

interface ProductDetailPageProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  const [showQA, setShowQA] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState(product.sentiment);

  const sentimentScore = Math.round((currentSentiment.positive / (currentSentiment.positive + currentSentiment.negative)) * 100);

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await GeminiService.getInstance().analyzeReview(reviewText, currentSentiment);
      setCurrentSentiment(result);
      setReviewText("");
    } catch (error) {
      console.error("Review analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto transition-colors duration-200"
    >
      {/* Header */}
      <div className="sticky top-0 bg-blue-600 dark:bg-blue-800 border-b dark:border-blue-700 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              onClick={onClose}
              className="flex items-center gap-2 text-white hover:text-white-900 transition-colors"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </motion.button>
            
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-white">{(sentimentScore / 20).toFixed(1)}</span>
              <span className="text-white/80">({currentSentiment.positive + currentSentiment.negative} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags?.slice(0, 6).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">₹{product.price}</p>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.longDescription}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Buy Now Button */}
              <motion.button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-6 h-6" />
                Buy Now - ₹{(product.price * quantity).toFixed(2)}
              </motion.button>

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 border-2 border-amber-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>

              {/* Know Me More Button - Smaller */}
              <motion.button
                onClick={() => setShowQA(true)}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-4 rounded-full font-medium text-sm hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="w-4 h-4" />
                Know Me More
                <Sparkles className="w-3 h-3" />
              </motion.button>

              {/* Watch Video Button */}
              {product.videoUrl && (
                <motion.a
                  href={product.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 rounded-full font-medium text-sm hover:from-red-700 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md mt-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                  Watch Recipe Video
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Sentiment Analysis & Reviews - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sticky top-24 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sentiment Summary</h2>
              
              {/* Overall Sentiment */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-600 dark:text-green-400">Positive</span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">{currentSentiment.positive}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-semibold text-red-600 dark:text-red-400">Negative</span>
                  </div>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">{currentSentiment.negative}%</span>
                </div>
              </div>

              {/* Aspect Ratings */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">Detailed Ratings</h3>
                {Object.entries(currentSentiment.aspects).map(([aspect, score]) => (
                  <div key={aspect} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize text-sm">{aspect}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 0.6, duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Insight */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">AI Insights</h3>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{product.dataAiHint}</p>
              </div>

              {/* Write a Review Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Write a Review</h3>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm mb-3 placeholder-gray-400 dark:placeholder-gray-500"
                  rows={3}
                />
                <button
                  onClick={handleReviewSubmit}
                  disabled={isAnalyzing || !reviewText.trim()}
                  className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Q&A Modal */}
      <AnimatePresence>
        {showQA && (
          <ProductQA
            product={product}
            onClose={() => setShowQA(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetailPage;