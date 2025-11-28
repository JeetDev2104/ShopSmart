import React, { useState } from 'react';
import { Star, ShoppingCart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import SentimentPanel from './SentimentPanel';
import ProductQA from './ProductQA';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick }) => {
  const [showSentiment, setShowSentiment] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [isAnimatingToChat, setIsAnimatingToChat] = useState(false);

  const sentimentScore = Math.round((product.sentiment.positive / (product.sentiment.positive + product.sentiment.negative)) * 100);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onProductClick(product);
  };

  const handleKnowMeMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimatingToChat(true);
    
    // Delay opening the chat to allow animation to complete
    setTimeout(() => {
      setShowQA(true);
      setIsAnimatingToChat(false);
    }, 800);
  };

  return (
    <>
      <motion.div
        layout
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
          isAnimatingToChat ? 'z-50' : ''
        }`}
        whileHover={!isAnimatingToChat ? { y: -5 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={isAnimatingToChat ? {
          opacity: 1,
          scale: 1.1,
          x: '50vw',
          y: '50vh',
          position: 'fixed',
          zIndex: 9999,
          transformOrigin: 'center center'
        } : { opacity: 1, y: 0 }}
        transition={isAnimatingToChat ? {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        } : {}}
        onClick={handleCardClick}
        style={isAnimatingToChat ? {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.1)',
          zIndex: 9999
        } : {}}
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{(sentimentScore / 20).toFixed(1)}</span>
          </div>
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {sentimentScore}% positive
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{product.description}</p>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{product.price}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags?.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isAnimatingToChat}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
            
            <motion.button
              onClick={handleKnowMeMoreClick}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isAnimatingToChat}
            >
              <MessageCircle className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Animated overlay during transition */}
        <AnimatePresence>
          {isAnimatingToChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showSentiment && (
          <SentimentPanel
            product={product}
            onClose={() => setShowSentiment(false)}
          />
        )}
        {showQA && (
          <ProductQA
            product={product}
            onClose={() => setShowQA(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;