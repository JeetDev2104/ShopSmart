import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ShoppingCart, Calendar, Flame, Clock, ChefHat, RefreshCw, Plus, Play, Loader2 } from 'lucide-react';
import { Product, RecipeDetails } from '../types';
import { GeminiService } from '../services/geminiService';

interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  calories: number;
  protein: number;
  time: string;
  image: string;
  ingredients: string[]; // Product IDs to add to cart
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

interface MealPlannerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  products: Product[]; // Need products to look up ingredients
}

const MealPlanner: React.FC<MealPlannerProps> = ({ isOpen, onClose, onAddToCart, products }) => {
  const [activeDay, setActiveDay] = useState('Mon');
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Meal | null>(null);
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  const handleViewRecipe = async (meal: Meal) => {
    setViewingRecipe(meal);
    setIsLoadingRecipe(true);
    try {
      const details = await GeminiService.getInstance().getRecipeDetails(meal.name);
      setRecipeDetails(details);
    } catch (error) {
      console.error("Failed to load recipe", error);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const closeRecipe = () => {
    setViewingRecipe(null);
    setRecipeDetails(null);
  };

  // Mock Data - In a real app, this would come from an AI service
  const weeklyPlan: DayPlan[] = [
    {
      day: 'Mon',
      meals: [
        {
          id: 'm1',
          type: 'Breakfast',
          name: 'Oatmeal with Berries',
          calories: 350,
          protein: 12,
          time: '10 min',
          image: 'https://www.pcrm.org/sites/default/files/Oatmeal%20and%20Berries.jpg',
          ingredients: ['1', '2']
        },
        {
          id: 'm2',
          type: 'Lunch',
          name: 'Grilled Chicken Salad',
          calories: 450,
          protein: 40,
          time: '20 min',
          image: 'https://www.eatingbirdfood.com/wp-content/uploads/2023/06/grilled-chicken-salad-hero.jpg',
          ingredients: ['3', '4']
        },
        {
          id: 'm3',
          type: 'Dinner',
          name: 'Salmon with Asparagus',
          calories: 550,
          protein: 35,
          time: '30 min',
          image: 'https://www.eatwell101.com/wp-content/uploads/2019/06/Garlic-Butter-Salmon-with-Lemon-Asparagus-Skillet.jpg',
          ingredients: ['5']
        }
      ]
    },
    {
      day: 'Tue',
      meals: [
        {
          id: 'm4',
          type: 'Breakfast',
          name: 'Avocado Toast',
          calories: 320,
          protein: 10,
          time: '10 min',
          image: 'https://www.spendwithpennies.com/wp-content/uploads/2022/09/Avocado-Toast-SpendWithPennies-1.jpg',
          ingredients: ['6']
        },
        {
          id: 'm5',
          type: 'Lunch',
          name: 'Quinoa Bowl',
          calories: 400,
          protein: 15,
          time: '15 min',
          image: 'https://simplyhomecooked.com/wp-content/uploads/2023/04/quinoa-shrimp-bowl-18.jpg',
          ingredients: ['7']
        },
        {
          id: 'm6',
          type: 'Dinner',
          name: 'Vegetable Stir Fry',
          calories: 380,
          protein: 12,
          time: '25 min',
          image: 'https://kristineskitchenblog.com/wp-content/uploads/2024/01/vegetable-stir-fry-22-3.jpg',
          ingredients: ['1', '2']
        }
      ]
    },
    {
      day: 'Wed',
      meals: [
        {
          id: 'm7',
          type: 'Breakfast',
          name: 'Greek Yogurt Parfait',
          calories: 300,
          protein: 18,
          time: '5 min',
          image: 'https://spicecravings.com/wp-content/uploads/2023/09/Greek-Yogurt-Parfait-Featured.jpg',
          ingredients: ['8', '9']
        },
        {
          id: 'm8',
          type: 'Lunch',
          name: 'Mediterranean Wrap',
          calories: 420,
          protein: 14,
          time: '10 min',
          image: 'https://sailorbailey.com/wp-content/uploads/2024/05/Mediterranean-Chicken-WrapsKey.jpg',
          ingredients: ['10']
        },
        {
          id: 'm9',
          type: 'Dinner',
          name: 'Lemon Herb Chicken',
          calories: 520,
          protein: 45,
          time: '35 min',
          image: 'https://thewholecook.com/wp-content/uploads/2024/04/Lemon-Herb-Marinated-Grilled-Chicken-1-5-500x500.jpg',
          ingredients: ['11']
        }
      ]
    },
    {
      day: 'Thu',
      meals: [
        {
          id: 'm10',
          type: 'Breakfast',
          name: 'Green Smoothie Bowl',
          calories: 280,
          protein: 8,
          time: '10 min',
          image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/7/21/1/HE_Green-Smoothie-Bowl.jpg.rend.hgtvcom.1280.1280.suffix/1437508213013.webp',
          ingredients: ['12']
        },
        {
          id: 'm11',
          type: 'Lunch',
          name: 'Tuna Poke Bowl',
          calories: 480,
          protein: 32,
          time: '15 min',
          image: 'https://thedefineddish.com/wp-content/uploads/2021/03/2021-03-29-07.06.31.jpg',
          ingredients: ['13']
        },
        {
          id: 'm12',
          type: 'Dinner',
          name: 'Shrimp Tacos',
          calories: 450,
          protein: 28,
          time: '20 min',
          image: 'https://peasandcrayons.com/wp-content/uploads/2017/04/spicy-sriracha-shrimp-tacos-cilantro-lime-slaw-recipe-peasandcrayons-blog2-0243.jpg',
          ingredients: ['14']
        }
      ]
    },
    {
      day: 'Fri',
      meals: [
        {
          id: 'm13',
          type: 'Breakfast',
          name: 'Protein Pancakes',
          calories: 400,
          protein: 25,
          time: '20 min',
          image: 'https://images.immediate.co.uk/production/volatile/sites/30/2021/02/Protein-pancakes-b64bd40.jpg',
          ingredients: ['15']
        },
        {
          id: 'm14',
          type: 'Lunch',
          name: 'Caprese Sandwich',
          calories: 380,
          protein: 12,
          time: '10 min',
          image: 'https://pinchofyum.com/wp-content/uploads/Protein-Pancakes-Recipe.jpg',
          ingredients: ['16']
        },
        {
          id: 'm15',
          type: 'Dinner',
          name: 'Healthy Pizza',
          calories: 600,
          protein: 30,
          time: '40 min',
          image: 'https://d2gtpjxvvd720b.cloudfront.net/system/recipe/image/6396/retina_Hungry-Girl-Healthy-Caprese-Pizza-Recipe-20240618-1822-13007-4677.jpg',
          ingredients: ['17']
        }
      ]
    },
    {
      day: 'Sat',
      meals: [
        {
          id: 'm16',
          type: 'Breakfast',
          name: 'Eggs Benedict',
          calories: 550,
          protein: 22,
          time: '25 min',
          image: 'https://www.allrecipes.com/thmb/QVMaPhXnj1HQ70C7Ka9WYtuipHg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/17205-eggs-benedict-DDMFS-4x3-a0042d5ae1da485fac3f468654187db0.jpg',
          ingredients: ['18']
        },
        {
          id: 'm17',
          type: 'Lunch',
          name: 'Turkey Burger',
          calories: 450,
          protein: 35,
          time: '20 min',
          image: 'https://www.herwholesomekitchen.com/wp-content/uploads/2021/04/bestturkeyburger-1-2.jpg',
          ingredients: ['19']
        },
        {
          id: 'm18',
          type: 'Dinner',
          name: 'Steak & Veggies',
          calories: 650,
          protein: 50,
          time: '30 min',
          image: 'https://media.hellofresh.com/f_auto,fl_lossy,q_auto,w_1200/hellofresh_s3/image/juicy-steak-718c991a.jpg',
          ingredients: ['20']
        }
      ]
    },
    {
      day: 'Sun',
      meals: [
        {
          id: 'm19',
          type: 'Breakfast',
          name: 'French Toast',
          calories: 480,
          protein: 14,
          time: '20 min',
          image: 'https://cdn.loveandlemons.com/wp-content/uploads/2024/08/french-toast-recipe.jpg',
          ingredients: ['21']
        },
        {
          id: 'm20',
          type: 'Lunch',
          name: 'Caesar Salad',
          calories: 350,
          protein: 20,
          time: '15 min',
          image: 'https://healthyfitnessmeals.com/wp-content/uploads/2020/05/instagram-In-Stream_Square___Low-carb-Caesar-salad-4.jpg',
          ingredients: ['22']
        },
        {
          id: 'm21',
          type: 'Dinner',
          name: 'Roast Chicken',
          calories: 580,
          protein: 48,
          time: '1 hr',
          image: 'https://hips.hearstapps.com/hmg-prod/images/roast-chicken-recipe-2-66b231ac9a8fb.jpg?crop=0.6666666666666667xw:1xh;center,top&resize=1200:*',
          ingredients: ['23']
        }
      ]
    },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleAddMealToCart = (meal: Meal) => {
    // In a real app, we'd look up the actual products. 
    // For this demo, we'll just find *any* product to simulate adding ingredients.
    const mockProduct = products[0]; 
    if (mockProduct) {
      onAddToCart(mockProduct, 1);
      // Show a small toast or feedback?
    }
  };

  const handleAddDayToCart = (dayPlan: DayPlan) => {
    dayPlan.meals.forEach(meal => handleAddMealToCart(meal));
  };

  if (!isOpen) return null;

  const currentPlan = weeklyPlan.find(p => p.day === activeDay) || { day: activeDay, meals: [] };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Meal Plan</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-Curated for Healthy Living</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors text-gray-700 dark:text-gray-300">
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Days */}
          <div className="w-24 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-800 flex flex-col items-center py-6 gap-4 overflow-y-auto">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  activeDay === day
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xs font-bold">{day}</span>
                {weeklyPlan.find(p => p.day === day)?.meals.length ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                ) : null}
              </button>
            ))}
          </div>

          {/* Main Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {activeDay}'s Menu
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {currentPlan.meals.length} meals planned • ~{currentPlan.meals.reduce((acc, m) => acc + m.calories, 0)} calories
                </p>
              </div>
              
              {currentPlan.meals.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddDayToCart(currentPlan)}
                  className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add All to Cart
                </motion.button>
              )}
            </div>

            {currentPlan.meals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <ChefHat className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No meals planned</h4>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">
                  Take a break or let our AI generate a healthy plan for this day.
                </p>
                <button className="px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                  Generate Plan
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {currentPlan.meals.map((meal, index) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 flex gap-6 group"
                  >
                    {/* Image */}
                    <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={meal.image} 
                        alt={meal.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                          {meal.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" /> {meal.time}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {meal.name}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-red-500" />
                          {meal.calories} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] font-bold">P</span>
                          {meal.protein}g protein
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleAddMealToCart(meal)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Ingredients
                        </button>
                        <button 
                          onClick={() => handleViewRecipe(meal)}
                          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          View Recipe <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {viewingRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={closeRecipe}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Recipe Header */}
              <div className="relative h-48 sm:h-64">
                <img 
                  src={viewingRecipe.image} 
                  alt={viewingRecipe.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button 
                  onClick={closeRecipe}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2 opacity-90">
                    <span className="px-2 py-0.5 bg-white/20 rounded-lg backdrop-blur-sm">{viewingRecipe.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {viewingRecipe.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {viewingRecipe.calories} kcal</span>
                  </div>
                  <h2 className="text-3xl font-bold">{viewingRecipe.name}</h2>
                </div>
              </div>

              {/* Recipe Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoadingRecipe ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-4">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Chef AI is writing your recipe...</p>
                  </div>
                ) : recipeDetails ? (
                  <div className="space-y-8">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                        {recipeDetails.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-8">
                        <a 
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(viewingRecipe.name + " recipe")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/20"
                        >
                          <Play className="w-5 h-5 fill-current" />
                          Watch Video
                        </a>
                        <button 
                          onClick={() => handleAddMealToCart(viewingRecipe)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20"
                        >
                          <Plus className="w-5 h-5" />
                          Add Ingredients
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-xs">1</span>
                          Ingredients
                        </h3>
                        <ul className="space-y-3">
                          {recipeDetails.ingredients.map((ing, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">2</span>
                          Instructions
                        </h3>
                        <div className="space-y-4">
                          {recipeDetails.steps.map((step, i) => (
                            <div key={i} className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm">
                              <span className="font-bold text-gray-400 select-none">{i + 1}.</span>
                              <p>{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Failed to load recipe details. Please try again.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealPlanner;
