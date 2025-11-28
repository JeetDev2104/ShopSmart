import React, { useState } from 'react';
import { ChefHat, ShoppingCart, Plus, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';

interface RecipeShoppingListProps {
  recipeName: string;
  ingredients: Product[];
  onAddToCart: (product: Product) => void;
  onAddAllToCart: () => void;
  recipeInstructions?: {
    steps: string[];
    prepTime: string;
    servings: number;
    description?: string;
  };
}

const RecipeShoppingList: React.FC<RecipeShoppingListProps> = ({
  recipeName,
  ingredients,
  onAddToCart,
  onAddAllToCart,
  recipeInstructions
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const totalPrice = ingredients.reduce((sum, product) => sum + product.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-orange-200 dark:border-gray-700 mb-8 transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-orange-600 dark:text-orange-500" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recipe Shopping List</h3>
        </div>

        {/* Watch Recipe Video Button */}
        <motion.a
          href={`https://www.youtube.com/results?search_query=how+to+cook+${encodeURIComponent(recipeName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 rounded-full font-medium text-sm hover:from-red-700 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          Watch Recipe Video
        </motion.a>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Perfect ingredients for making <span className="font-semibold text-orange-700 dark:text-orange-400">{recipeName}</span>
      </p>

      {recipeInstructions && (
        <div className="mb-6 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{recipeInstructions.prepTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{recipeInstructions.servings} servings</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {ingredients.map((ingredient, index) => (
          <motion.div
            key={ingredient.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{ingredient.name}</h4>
                <p className="text-orange-600 dark:text-orange-400 font-bold">₹{ingredient.price}</p>
              </div>
              <motion.button
                onClick={() => onAddToCart(ingredient)}
                className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-orange-200 dark:border-gray-700 mb-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Total for recipe ingredients:</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{totalPrice.toFixed(2)}</p>
        </div>
        <motion.button
          onClick={onAddAllToCart}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-5 h-5" />
          Add All to Cart
        </motion.button>
      </div>

      {recipeInstructions && recipeInstructions.steps.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-gray-700">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full flex items-center justify-between text-left"
          >
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              Cooking Instructions
            </h4>
            {showInstructions ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {recipeInstructions.description && (
                  <p className="text-gray-600 mt-4 mb-4 italic">
                    {recipeInstructions.description}
                  </p>
                )}
                <ol className="mt-4 space-y-3">
                  {recipeInstructions.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 flex-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default RecipeShoppingList;