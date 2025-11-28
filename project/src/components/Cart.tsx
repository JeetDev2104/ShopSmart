import React from 'react';
import { ShoppingCart, X, Plus, Minus, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  totalPrice: number;
}

const Cart: React.FC<CartProps> = ({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totalPrice
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md h-full overflow-y-auto shadow-2xl transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Your cart is empty</h3>
                <p className="text-gray-500 dark:text-gray-500 mt-2">Add some products to get started</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors duration-200"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">₹{item.product.price}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <motion.button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>
                        <span className="font-medium px-2 text-gray-900 dark:text-white">{item.quantity}</span>
                        <motion.button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <motion.button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm mt-1 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <div className="border-t dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{totalPrice.toFixed(2)}</span>
            </div>
            
            <motion.button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Checkout
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Cart;