import { Product } from '../types';

export const products: Product[] = [
  // Groceries - Rice & Grains
  {
    id: '1',
    name: 'Basmati Rice Premium Grade',
    description: 'Long grain aromatic basmati rice, perfect for biryani and fried rice',
    longDescription: 'Premium quality aged basmati rice with authentic aroma and taste. Each grain cooks to perfection, remaining separate and fluffy. Ideal for Indian, Middle Eastern, and Asian cuisines.',
    price: 1299,
    image: 'https://images.pexels.com/photos/8108170/pexels-photo-8108170.jpeg',
    category: 'Groceries',
    sentiment: {
      positive: 87,
      negative: 13,
      aspects: {
        quality: 92,
        freshness: 89,
        flavor: 85,
      }
    },
    dataAiHint: 'High-quality basmati rice with excellent cooking properties, highly rated for taste and texture',
    tags: ['rice', 'basmati', 'grains', 'cooking', 'biryani', 'indian', 'aromatic'],
    videoUrl: 'https://www.youtube.com/watch?v=1u2k2r2xR20'
  },
  {
    id: '2',
    name: 'Soy Sauce - Premium Dark',
    description: 'Rich, umami-packed soy sauce for authentic Asian flavors',
    longDescription: 'Traditional brewed soy sauce with deep, complex flavors. Perfect for stir-fries, marinades, and dipping sauces. No artificial additives, naturally fermented for authentic taste.',
    price: 449,
    image: 'https://media.istockphoto.com/id/171330314/photo/soy-sauce.jpg?s=1024x1024&w=is&k=20&c=KyjcfZojyelQBhGZqJh20Q57sbnWXZ4YL5SjpCJbR9Q=',
    category: 'Groceries',
    sentiment: {
      positive: 91,
      negative: 9,
      aspects: {
        flavor: 94,
        quality: 88,
        userExperience: 90,
      }
    },
    dataAiHint: 'Authentic soy sauce with excellent flavor profile, essential for Asian cooking',
    tags: ['soy-sauce', 'condiment', 'asian', 'cooking', 'stir-fry', 'marinade', 'umami', 'fried-rice', 'chinese', 'wok'],
    videoUrl: 'https://www.youtube.com/watch?v=1u2k2r2xR20'
  },
  {
    id: '3',
    name: 'Fresh Vegetables',
    description: 'Fresh vegetables - cooking essential, fresh and healthy, perfect for salads and stir-fries',
    longDescription: 'Farm-fresh vegetables with perfect balance of sweetness and sharpness. Ideal for caramelizing, sautéing, or using raw in salads. Hand-selected for quality and freshness.',
    price: 299,
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Groceries',
    sentiment: {
      positive: 84,
      negative: 16,
      aspects: {
        freshness: 88,
        quality: 82,
        flavor: 86,
      }
    },
    dataAiHint: 'Fresh quality onions, versatile cooking ingredient with good shelf life',
    tags: ['onions', 'vegetables', 'cooking', 'fresh', 'fried-rice', 'stir-fry', 'seasoning'],
    videoUrl: 'https://www.youtube.com/watch?v=1u2k2r2xR20'
  },

  // Skincare
  {
    id: '4',
    name: 'SPF 50+ Sunscreen Ultra Protection',
    description: 'Broad spectrum protection for all skin types, and suitable for sensitive skin',
    longDescription: 'Advanced mineral sunscreen with zinc oxide and titanium dioxide. Provides superior protection against UVA and UVB rays. Water-resistant for 80 minutes, non-comedogenic, and suitable for sensitive skin.',
    price: 189,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=60',
    category: 'Skincare',
    sentiment: {
      positive: 89,
      negative: 90,
      aspects: {
        quality: 91,
        userExperience: 87,
        waterproof: 85,
      }
    },
    dataAiHint: 'High-quality sunscreen with excellent protection, suitable for sensitive and oily skin types',
    tags: ['sunscreen', 'spf50', 'skincare', 'protection', 'waterproof', 'sensitive-skin', 'oily-skin', 'mineral']
  },
  {
    id: '5',
    name: 'Gentle Cleansing Face Wash',
    description: 'Oil-free cleanser for oily and combination skin',
    longDescription: 'Dermatologist-tested face wash with salicylic acid and niacinamide. Removes excess oil without over-drying, helps prevent breakouts, and leaves skin feeling clean and refreshed.',
    price: 1249,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80',
    category: 'Skincare',
    sentiment: {
      positive: 85,
      negative: 15,
      aspects: {
        quality: 88,
        userExperience: 84,
        comfort: 86,
      }
    },
    dataAiHint: 'Effective cleanser for oily skin, helps with oil control and acne prevention',
    tags: ['face-wash', 'cleanser', 'oily-skin', 'acne', 'salicylic-acid', 'oil-free', 'gentle']
  },

  // Clothing
  {
    id: '6',
    name: 'Winter Puffer Jacket - Waterproof',
    description: 'Insulated winter jacket with hood, perfect for cold weather',
    longDescription: 'Premium down-filled puffer jacket with waterproof outer shell. Features adjustable hood, multiple pockets, and wind-resistant design. Rated for temperatures down to -20°F.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
    category: 'Clothing',
    sentiment: {
      positive: 92,
      negative: 8,
      aspects: {
        comfort: 90,
        durability: 94,
        waterproof: 89,
        fit: 87,
      }
    },
    dataAiHint: 'High-quality winter jacket with excellent insulation and waterproof features, great for harsh weather',
    tags: ['jacket', 'winter', 'waterproof', 'insulated', 'puffer', 'cold-weather', 'hood', 'warm']
  },
  {
    id: '7',
    name: 'Casual Cotton T-Shirt',
    description: 'Comfortable everyday t-shirt in multiple colors',
    longDescription: '100% organic cotton t-shirt with soft, breathable fabric. Pre-shrunk and color-fast. Available in various sizes and colors. Perfect for layering or wearing on its own.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=60',
    category: 'Clothing',
    sentiment: {
      positive: 88,
      negative: 12,
      aspects: {
        comfort: 92,
        fit: 85,
        quality: 87,
        durability: 84,
      }
    },
    dataAiHint: 'Comfortable cotton t-shirt with good fit and quality, versatile for casual wear',
    tags: ['t-shirt', 'cotton', 'casual', 'comfortable', 'breathable', 'everyday', 'organic']
  },

  // Electronics
  {
    id: '8',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium sound quality with noise cancellation',
    longDescription: 'Advanced wireless headphones with active noise cancellation, 30-hour battery life, and premium drivers. Features quick charge, multipoint connectivity, and comfortable over-ear design.',
    price: 149.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    sentiment: {
      positive: 91,
      negative: 9,
      aspects: {
        quality: 93,
        comfort: 89,
        userExperience: 92,
        durability: 88,
      }
    },
    dataAiHint: 'High-quality wireless headphones with excellent sound and comfort, great for music and calls',
    tags: ['headphones', 'wireless', 'bluetooth', 'noise-cancellation', 'audio', 'music', 'premium']
  },
  {
    id: '9',
    name: 'Smartphone Fast Charger',
    description: '65W USB-C fast charging adapter with cable',
    longDescription: 'Universal fast charger compatible with most smartphones and tablets. Features intelligent charging technology, over-current protection, and compact design. Includes 6ft USB-C cable.',
    price: 249.9,
    image: 'https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    sentiment: {
      positive: 86,
      negative: 14,
      aspects: {
        quality: 88,
        userExperience: 85,
        durability: 84,
      }
    },
    dataAiHint: 'Reliable fast charger with safety features, compatible with multiple devices',
    tags: ['charger', 'fast-charging', 'usb-c', 'smartphone', 'adapter', 'electronics', 'portable']
  },

  {
    id: '10',
    name: 'Fresh Chicken Breast',
    description: 'Premium quality chicken breast, perfect for biryani and curries',
    longDescription: 'Fresh, tender chicken breast cuts from farm-raised poultry. High in protein, low in fat. Ideal for biryani, grilling, roasting, and various Indian and international cuisines. Hand-selected for quality and freshness.',
    price: 89.9,
    image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Groceries',
    sentiment: {
      positive: 88,
      negative: 12,
      aspects: {
        quality: 90,
        freshness: 92,
        flavor: 86,
      }
    },
    dataAiHint: 'High-quality fresh chicken breast, excellent for protein-rich meals and traditional recipes',
    tags: ['chicken', 'meat', 'protein', 'fresh', 'biryani', 'curry', 'grilling', 'poultry']
  },
  {
    id: '11',
    name: 'Jasmine Rice Premium Grade',
    description: 'Fragrant long-grain jasmine rice, perfect for fried rice and Asian dishes',
    longDescription: 'Premium quality jasmine rice with natural floral aroma and soft, sticky texture when cooked. Each grain is carefully selected for consistent quality. Ideal for fried rice, Thai dishes, and Asian cuisines.',
    price: 119.9,
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Groceries',
    sentiment: {
      positive: 86,
      negative: 14,
      aspects: {
        quality: 91,
        freshness: 88,
        flavor: 89,
        aroma: 94
      }
    },
    dataAiHint: 'Aromatic jasmine rice with excellent texture, highly rated for Asian cooking and fried rice',
    tags: ['rice', 'jasmine', 'grains', 'cooking', 'fried-rice', 'asian', 'aromatic', 'thai']
  },
  // Additional Grocery Items
  {
    id: '12',
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed olive oil for cooking and dressing',
    longDescription: 'Premium extra virgin olive oil from Mediterranean olives. Cold-pressed for maximum flavor and nutrition. Perfect for cooking, salad dressings, and finishing dishes.',
    price: 169.9,
    image: 'https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Groceries',
    sentiment: {
      positive: 90,
      negative: 10,
      aspects: {
        quality: 93,
        flavor: 91,
        freshness: 89,
      }
    },
    dataAiHint: 'High-quality olive oil with excellent flavor, versatile for cooking and salads',
    tags: ['olive-oil', 'cooking-oil', 'extra-virgin', 'mediterranean', 'healthy', 'cooking', 'salad']
  }
,
  {
    "id": "31",
    "name": "Sona Masoori Rice",
    "description": "Lightweight and aromatic medium-grain rice.",
    "longDescription": "This is a premium Sona Masoori Rice. Lightweight and aromatic medium-grain rice. It is designed for high quality and customer satisfaction.",
    "price": 15.99,
    "image": "https://images.unsplash.com/photo-1586201375761-83865001e30c?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "32",
    "name": "Brown Basmati Rice",
    "description": "Whole grain goodness with a nutty flavor.",
    "longDescription": "This is a premium Brown Basmati Rice. Whole grain goodness with a nutty flavor. It is designed for high quality and customer satisfaction.",
    "price": 14.99,
    "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "33",
    "name": "Jasmine Rice 10lb",
    "description": "Fragrant long-grain rice for family meals.",
    "longDescription": "This is a premium Jasmine Rice 10lb. Fragrant long-grain rice for family meals. It is designed for high quality and customer satisfaction.",
    "price": 18.99,
    "image": "https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "34",
    "name": "Arborio Rice",
    "description": "Creamy and starchy, perfect for risotto.",
    "longDescription": "This is a premium Arborio Rice. Creamy and starchy, perfect for risotto. It is designed for high quality and customer satisfaction.",
    "price": 8.99,
    "image": "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "35",
    "name": "Sushi Rice",
    "description": "Sticky and short-grain, ideal for sushi rolls.",
    "longDescription": "This is a premium Sushi Rice. Sticky and short-grain, ideal for sushi rolls. It is designed for high quality and customer satisfaction.",
    "price": 9.99,
    "image": "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "36",
    "name": "Wild Rice Mix",
    "description": "Nutty and chewy blend of wild and long-grain rice.",
    "longDescription": "This is a premium Wild Rice Mix. Nutty and chewy blend of wild and long-grain rice. It is designed for high quality and customer satisfaction.",
    "price": 11.99,
    "image": "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "37",
    "name": "Red Cargo Rice",
    "description": "Nutrient-rich unpolished rice with a chewy texture.",
    "longDescription": "This is a premium Red Cargo Rice. Nutrient-rich unpolished rice with a chewy texture. It is designed for high quality and customer satisfaction.",
    "price": 10.99,
    "image": "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "38",
    "name": "Black Rice",
    "description": "Antioxidant-rich 'forbidden rice' with a sweet flavor.",
    "longDescription": "This is a premium Black Rice. Antioxidant-rich 'forbidden rice' with a sweet flavor. It is designed for high quality and customer satisfaction.",
    "price": 12.99,
    "image": "https://images.unsplash.com/photo-1613728913105-294354524339?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "39",
    "name": "Parboiled Rice",
    "description": "Partially boiled in the husk, retains more vitamins.",
    "longDescription": "This is a premium Parboiled Rice. Partially boiled in the husk, retains more vitamins. It is designed for high quality and customer satisfaction.",
    "price": 7.99,
    "image": "https://images.unsplash.com/photo-1568158879083-c42860933ed7?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "40",
    "name": "Sticky Glutinous Rice",
    "description": "Sweet and sticky, great for desserts and dumplings.",
    "longDescription": "This is a premium Sticky Glutinous Rice. Sweet and sticky, great for desserts and dumplings. It is designed for high quality and customer satisfaction.",
    "price": 8.49,
    "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 90,
      "negative": 10,
      "aspects": {
        "quality": 92,
        "taste": 90,
        "freshness": 95
      }
    },
    "dataAiHint": "rice",
    "tags": [
      "ingredient: rice dish",
      "pantry staple"
    ]
  },
  {
    "id": "41",
    "name": "Dark Soy Sauce",
    "description": "Rich and thick soy sauce for coloring and flavor.",
    "longDescription": "This is a premium Dark Soy Sauce. Rich and thick soy sauce for coloring and flavor. It is designed for high quality and customer satisfaction.",
    "price": 4.99,
    "image": "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "soy sauce",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "42",
    "name": "Light Soy Sauce",
    "description": "Salty and thin, essential for seasoning.",
    "longDescription": "This is a premium Light Soy Sauce. Salty and thin, essential for seasoning. It is designed for high quality and customer satisfaction.",
    "price": 3.99,
    "image": "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "soy sauce",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "43",
    "name": "Oyster Sauce",
    "description": "Savory and sweet sauce for stir-fries.",
    "longDescription": "This is a premium Oyster Sauce. Savory and sweet sauce for stir-fries. It is designed for high quality and customer satisfaction.",
    "price": 5.49,
    "image": "https://images.unsplash.com/photo-1607301405846-d002d80b5bb3?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "oyster sauce",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "44",
    "name": "Sesame Oil",
    "description": "Toasted sesame oil for aromatic finishing.",
    "longDescription": "This is a premium Sesame Oil. Toasted sesame oil for aromatic finishing. It is designed for high quality and customer satisfaction.",
    "price": 6.99,
    "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "oil",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "45",
    "name": "Chili Oil",
    "description": "Spicy oil infused with chili flakes.",
    "longDescription": "This is a premium Chili Oil. Spicy oil infused with chili flakes. It is designed for high quality and customer satisfaction.",
    "price": 5.99,
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "oil",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "46",
    "name": "Turmeric Powder",
    "description": "Bright yellow spice with earthy flavor.",
    "longDescription": "This is a premium Turmeric Powder. Bright yellow spice with earthy flavor. It is designed for high quality and customer satisfaction.",
    "price": 3.49,
    "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "spice",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "47",
    "name": "Cumin Seeds",
    "description": "Warm and earthy seeds for tempering.",
    "longDescription": "This is a premium Cumin Seeds. Warm and earthy seeds for tempering. It is designed for high quality and customer satisfaction.",
    "price": 2.99,
    "image": "https://images.unsplash.com/photo-1599940824399-b87987ce0799?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "spice",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "48",
    "name": "Coriander Powder",
    "description": "Citrusy and nutty ground coriander.",
    "longDescription": "This is a premium Coriander Powder. Citrusy and nutty ground coriander. It is designed for high quality and customer satisfaction.",
    "price": 3.29,
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "spice",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "49",
    "name": "Garam Masala",
    "description": "Aromatic blend of warming spices.",
    "longDescription": "This is a premium Garam Masala. Aromatic blend of warming spices. It is designed for high quality and customer satisfaction.",
    "price": 4.49,
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "spice",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "50",
    "name": "Red Chili Powder",
    "description": "Spicy ground chilies for heat.",
    "longDescription": "This is a premium Red Chili Powder. Spicy ground chilies for heat. It is designed for high quality and customer satisfaction.",
    "price": 3.99,
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60",
    "category": "Pantry",
    "sentiment": {
      "positive": 94,
      "negative": 6,
      "aspects": {
        "flavor": 96,
        "quality": 93
      }
    },
    "dataAiHint": "spice",
    "tags": [
      "ingredient: cooking",
      "pantry staple"
    ]
  },
  {
    "id": "51",
    "name": "Arctic Parka",
    "description": "Heavy-duty winter parka with faux fur hood.",
    "longDescription": "This is a premium Arctic Parka. Heavy-duty winter parka with faux fur hood. It is designed for high quality and customer satisfaction.",
    "price": 199.99,
    "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "52",
    "name": "Bomber Jacket",
    "description": "Classic style bomber jacket in olive green.",
    "longDescription": "This is a premium Bomber Jacket. Classic style bomber jacket in olive green. It is designed for high quality and customer satisfaction.",
    "price": 89.99,
    "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "53",
    "name": "Leather Biker Jacket",
    "description": "Genuine leather jacket with asymmetrical zip.",
    "longDescription": "This is a premium Leather Biker Jacket. Genuine leather jacket with asymmetrical zip. It is designed for high quality and customer satisfaction.",
    "price": 249.99,
    "image": "https://images.unsplash.com/photo-1551028919-30164bdc5800?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "54",
    "name": "Windbreaker",
    "description": "Lightweight and colorful windbreaker for sports.",
    "longDescription": "This is a premium Windbreaker. Lightweight and colorful windbreaker for sports. It is designed for high quality and customer satisfaction.",
    "price": 49.99,
    "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "55",
    "name": "Trench Coat",
    "description": "Elegant beige trench coat for rainy days.",
    "longDescription": "This is a premium Trench Coat. Elegant beige trench coat for rainy days. It is designed for high quality and customer satisfaction.",
    "price": 129.99,
    "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "56",
    "name": "Quilted Vest",
    "description": "Warm sleeveless vest for layering.",
    "longDescription": "This is a premium Quilted Vest. Warm sleeveless vest for layering. It is designed for high quality and customer satisfaction.",
    "price": 59.99,
    "image": "https://images.unsplash.com/photo-1613715642502-735a725f522c?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "57",
    "name": "Ski Jacket",
    "description": "Waterproof and insulated jacket for snow sports.",
    "longDescription": "This is a premium Ski Jacket. Waterproof and insulated jacket for snow sports. It is designed for high quality and customer satisfaction.",
    "price": 179.99,
    "image": "https://images.unsplash.com/photo-1608256249259-8367ca9b2c89?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "58",
    "name": "Varsity Jacket",
    "description": "Collegiate style jacket with wool body.",
    "longDescription": "This is a premium Varsity Jacket. Collegiate style jacket with wool body. It is designed for high quality and customer satisfaction.",
    "price": 99.99,
    "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "59",
    "name": "Faux Fur Coat",
    "description": "Luxurious and soft faux fur coat.",
    "longDescription": "This is a premium Faux Fur Coat. Luxurious and soft faux fur coat. It is designed for high quality and customer satisfaction.",
    "price": 149.99,
    "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "60",
    "name": "Rain Poncho",
    "description": "Packable waterproof poncho.",
    "longDescription": "This is a premium Rain Poncho. Packable waterproof poncho. It is designed for high quality and customer satisfaction.",
    "price": 29.99,
    "image": "https://images.unsplash.com/photo-1628427255527-e1c4e1a1a6d2?auto=format&fit=crop&w=800&q=60",
    "category": "Jackets",
    "sentiment": {
      "positive": 92,
      "negative": 8,
      "aspects": {
        "warmth": 95,
        "style": 94,
        "comfort": 90
      }
    },
    "dataAiHint": "jacket",
    "tags": [
      "clothing",
      "outerwear"
    ]
  },
  {
    "id": "61",
    "name": "Noise Cancelling Headphones",
    "description": "Over-ear headphones with active noise cancellation.",
    "longDescription": "This is a premium Noise Cancelling Headphones. Over-ear headphones with active noise cancellation. It is designed for high quality and customer satisfaction.",
    "price": 299.99,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "62",
    "name": "Wireless Earbuds",
    "description": "True wireless earbuds with charging case.",
    "longDescription": "This is a premium Wireless Earbuds. True wireless earbuds with charging case. It is designed for high quality and customer satisfaction.",
    "price": 129.99,
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "63",
    "name": "Smartwatch Series 5",
    "description": "Fitness tracker and smartwatch with heart rate monitor.",
    "longDescription": "This is a premium Smartwatch Series 5. Fitness tracker and smartwatch with heart rate monitor. It is designed for high quality and customer satisfaction.",
    "price": 199.99,
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "64",
    "name": "4K Action Camera",
    "description": "Waterproof action camera for capturing adventures.",
    "longDescription": "This is a premium 4K Action Camera. Waterproof action camera for capturing adventures. It is designed for high quality and customer satisfaction.",
    "price": 149.99,
    "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "65",
    "name": "Bluetooth Speaker",
    "description": "Portable speaker with 360-degree sound.",
    "longDescription": "This is a premium Bluetooth Speaker. Portable speaker with 360-degree sound. It is designed for high quality and customer satisfaction.",
    "price": 79.99,
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "66",
    "name": "Gaming Mouse",
    "description": "Ergonomic mouse with customizable RGB lighting.",
    "longDescription": "This is a premium Gaming Mouse. Ergonomic mouse with customizable RGB lighting. It is designed for high quality and customer satisfaction.",
    "price": 59.99,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "67",
    "name": "Mechanical Keyboard",
    "description": "Tactile mechanical keyboard for typing and gaming.",
    "longDescription": "This is a premium Mechanical Keyboard. Tactile mechanical keyboard for typing and gaming. It is designed for high quality and customer satisfaction.",
    "price": 89.99,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "68",
    "name": "Tablet Pro 11",
    "description": "High-performance tablet for creativity and work.",
    "longDescription": "This is a premium Tablet Pro 11. High-performance tablet for creativity and work. It is designed for high quality and customer satisfaction.",
    "price": 699.99,
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "69",
    "name": "E-Reader",
    "description": "Glare-free display for comfortable reading.",
    "longDescription": "This is a premium E-Reader. Glare-free display for comfortable reading. It is designed for high quality and customer satisfaction.",
    "price": 119.99,
    "image": "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    "id": "70",
    "name": "Smart Home Hub",
    "description": "Voice-controlled hub for smart home devices.",
    "longDescription": "This is a premium Smart Home Hub. Voice-controlled hub for smart home devices. It is designed for high quality and customer satisfaction.",
    "price": 99.99,
    "image": "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=60",
    "category": "Electronics",
    "sentiment": {
      "positive": 95,
      "negative": 5,
      "aspects": {
        "performance": 96,
        "quality": 94,
        "value": 90
      }
    },
    "dataAiHint": "electronics",
    "tags": [
      "gadget",
      "tech"
    ]
  },
  {
    id: '1001',
    name: 'Sushi Rice (5 lb)',
    description: 'Premium short-grain rice for authentic sushi.',
    longDescription: 'High-quality short-grain rice that becomes sticky when cooked, essential for making sushi rolls and nigiri. Also great for rice bowls and pudding.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 95,
      negative: 5,
      aspects: {
        quality: 94,
        texture: 96
      }
    },
    dataAiHint: 'sushi rice',
    tags: ['sushi', 'rice', 'grains', 'sticky-rice']
  },
  {
    id: '1002',
    name: 'Nori Seaweed Sheets (50 ct)',
    description: 'Roasted seaweed sheets for sushi rolls.',
    longDescription: 'Crisp and flavorful roasted seaweed sheets (Nori). Essential for wrapping sushi rolls (maki) and hand rolls (temaki). Rich in vitamins and minerals.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 93,
      negative: 7,
      aspects: {
        flavor: 92,
        quality: 94
      }
    },
    dataAiHint: 'nori seaweed',
    tags: ['sushi', 'seaweed', 'asian', 'cooking']
  },
  {
    id: '1003',
    name: 'Rice Vinegar (12 oz)',
    description: 'Mild and slightly sweet vinegar for sushi rice.',
    longDescription: 'Essential for seasoning sushi rice. This rice vinegar has a mild acidity and a hint of sweetness. Also great for salad dressings and marinades.',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 91,
      negative: 9,
      aspects: {
        flavor: 93,
        quality: 90
      }
    },
    dataAiHint: 'rice vinegar',
    tags: ['sushi', 'vinegar', 'condiment', 'cooking']
  },
  {
    id: '1004',
    name: 'Wasabi Paste (Tube)',
    description: 'Spicy horseradish paste for sushi.',
    longDescription: 'Add a kick to your sushi with this convenient wasabi paste. Made from real horseradish, it provides the characteristic heat and flavor that pairs perfectly with raw fish.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 88,
      negative: 12,
      aspects: {
        flavor: 89,
        spiciness: 95
      }
    },
    dataAiHint: 'wasabi',
    tags: ['sushi', 'wasabi', 'spicy', 'condiment']
  },
  {
    id: '1005',
    name: 'Garam Masala Spice Blend',
    description: 'Aromatic spice blend for Indian cooking.',
    longDescription: 'A traditional blend of ground spices including cinnamon, cardamom, cloves, and cumin. Essential for adding warmth and depth to biryani, curries, and lentil dishes.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 94,
      negative: 6,
      aspects: {
        flavor: 95,
        aroma: 97
      }
    },
    dataAiHint: 'garam masala',
    tags: ['biryani', 'curry', 'spices', 'indian']
  },
  {
    id: '1006',
    name: 'Plain Yogurt (32 oz)',
    description: 'Creamy and tangy plain yogurt.',
    longDescription: 'Rich and creamy plain yogurt with live active cultures. Perfect for making marinades for biryani, raita, or eating on its own with fruit and granola.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1571212515416-f223d6385708?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 92,
      negative: 8,
      aspects: {
        taste: 93,
        freshness: 94
      }
    },
    dataAiHint: 'plain yogurt',
    tags: ['biryani', 'yogurt', 'dairy', 'cooking']
  },
  {
    id: '1007',
    name: 'Fresh Garlic Bulbs (3 pack)',
    description: 'Fresh and aromatic garlic bulbs.',
    longDescription: 'Premium quality fresh garlic bulbs. Essential for adding flavor to stir-fries, curries, and marinades. A staple in almost every cuisine.',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1615485925763-867862f80f18?auto=format&fit=crop&w=800&q=60',
    category: 'Produce',
    sentiment: {
      positive: 96,
      negative: 4,
      aspects: {
        freshness: 97,
        flavor: 95
      }
    },
    dataAiHint: 'garlic',
    tags: ['garlic', 'vegetables', 'fresh', 'cooking', 'seasoning']
  },
  {
    id: '1008',
    name: 'Fresh Ginger Root (0.5 lb)',
    description: 'Spicy and aromatic fresh ginger root.',
    longDescription: 'Fresh ginger root with a zesty, spicy flavor. Perfect for Asian dishes, tea, and baking. Adds a warm kick to stir-fries and curries.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=60',
    category: 'Produce',
    sentiment: {
      positive: 94,
      negative: 6,
      aspects: {
        freshness: 95,
        flavor: 93
      }
    },
    dataAiHint: 'ginger',
    tags: ['ginger', 'vegetables', 'fresh', 'cooking', 'asian']
  },
  {
    id: '1009',
    name: 'Green Chili Peppers (0.5 lb)',
    description: 'Fresh and spicy green chili peppers.',
    longDescription: 'Add heat to your dishes with these fresh green chili peppers. Ideal for curries, salsas, and stir-fries. Handle with care!',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60',
    category: 'Produce',
    sentiment: {
      positive: 92,
      negative: 8,
      aspects: {
        freshness: 94,
        spiciness: 96
      }
    },
    dataAiHint: 'green chili',
    tags: ['chili', 'peppers', 'vegetables', 'fresh', 'spicy']
  },
  {
    id: '1010',
    name: 'Cornstarch (16 oz)',
    description: 'Pure cornstarch for thickening sauces.',
    longDescription: 'Essential for thickening sauces, gravies, and soups. Also great for coating meats for stir-frying to get a crispy texture.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=60',
    category: 'Pantry',
    sentiment: {
      positive: 95,
      negative: 5,
      aspects: {
        quality: 96,
        texture: 94
      }
    },
    dataAiHint: 'cornstarch',
    tags: ['cornstarch', 'baking', 'cooking', 'thickener']
  },
  {
    id: '1011',
    name: 'Idli Rice (5 lb)',
    description: 'Short grain parboiled rice for soft idlis.',
    longDescription: 'Specially processed parboiled rice perfect for making soft and fluffy idlis and crispy dosas. A staple in South Indian kitchens.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 95,
      negative: 5,
      aspects: {
        texture: 96,
        quality: 94
      }
    },
    dataAiHint: 'idli rice',
    tags: ['rice', 'idli', 'dosa', 'south indian', 'grains']
  },
  {
    id: '1012',
    name: 'Urad Dal Whole (2 lb)',
    description: 'Premium whole white urad dal.',
    longDescription: 'Essential for making idli and dosa batter. Adds a unique texture and flavor to South Indian dishes.',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 93,
      negative: 7,
      aspects: {
        quality: 95,
        freshness: 92
      }
    },
    dataAiHint: 'urad dal',
    tags: ['dal', 'lentils', 'idli', 'dosa', 'protein']
  },
  {
    id: '1013',
    name: 'Toor Dal (2 lb)',
    description: 'Split pigeon peas for sambar.',
    longDescription: 'The key ingredient for making authentic Sambar. Rich in protein and cooks to a smooth consistency.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=60',
    category: 'Groceries',
    sentiment: {
      positive: 94,
      negative: 6,
      aspects: {
        taste: 95,
        quality: 93
      }
    },
    dataAiHint: 'toor dal',
    tags: ['dal', 'lentils', 'sambar', 'protein']
  },
  {
    id: '1014',
    name: 'Tamarind Paste (16 oz)',
    description: 'Concentrated tamarind paste.',
    longDescription: 'Adds the signature tanginess to Sambar, Rasam, and chutneys. Convenient and ready to use.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1615485925763-867862f80f18?auto=format&fit=crop&w=800&q=60',
    category: 'Pantry',
    sentiment: {
      positive: 91,
      negative: 9,
      aspects: {
        flavor: 94,
        convenience: 96
      }
    },
    dataAiHint: 'tamarind',
    tags: ['tamarind', 'sour', 'sambar', 'cooking', 'paste']
  },
  {
    id: '1015',
    name: 'Mustard Seeds (3.5 oz)',
    description: 'Black mustard seeds for tempering.',
    longDescription: 'Essential for the "tadka" or tempering in South Indian cooking. Adds a nutty flavor when popped in hot oil.',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=60',
    category: 'Pantry',
    sentiment: {
      positive: 96,
      negative: 4,
      aspects: {
        freshness: 97,
        flavor: 95
      }
    },
    dataAiHint: 'mustard seeds',
    tags: ['spices', 'mustard', 'tempering', 'indian']
  },
  {
    id: '1016',
    name: 'Fresh Curry Leaves (1 bunch)',
    description: 'Aromatic fresh curry leaves.',
    longDescription: 'The soul of South Indian cooking. Adds an unmistakable aroma and flavor to Sambar, chutneys, and curries.',
    price: 1.49,
    image: 'https://images.unsplash.com/photo-1615485925763-867862f80f18?auto=format&fit=crop&w=800&q=60',
    category: 'Produce',
    sentiment: {
      positive: 98,
      negative: 2,
      aspects: {
        freshness: 99,
        aroma: 98
      }
    },
    dataAiHint: 'curry leaves',
    tags: ['herbs', 'fresh', 'aromatic', 'indian', 'produce']
  },
  {
    id: '1017',
    name: 'Sambar Powder (7 oz)',
    description: 'Authentic spice blend for Sambar.',
    longDescription: 'A complex blend of roasted spices including coriander, cumin, fenugreek, and chilies. Makes making Sambar easy and delicious.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=60',
    category: 'Pantry',
    sentiment: {
      positive: 92,
      negative: 8,
      aspects: {
        flavor: 94,
        authenticity: 93
      }
    },
    dataAiHint: 'sambar powder',
    tags: ['spices', 'blend', 'sambar', 'indian']
  },
  {
    id: '1018',
    name: 'Fresh Coconut (1 pc)',
    description: 'Whole fresh coconut.',
    longDescription: 'Fresh coconut for making chutneys and adding richness to curries. Essential for coconut chutney to pair with Idli and Dosa.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=60',
    category: 'Produce',
    sentiment: {
      positive: 90,
      negative: 10,
      aspects: {
        freshness: 92,
        taste: 91
      }
    },
    dataAiHint: 'coconut',
    tags: ['coconut', 'fresh', 'produce', 'chutney']
  },
  {
    id: '1019',
    name: 'Fenugreek Seeds (3.5 oz)',
    description: 'Whole fenugreek seeds (Methi).',
    longDescription: 'Adds a slight bitterness and maple-like aroma. Used in dosa batter fermentation and sambar powder.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=60',
    category: 'Pantry',
    sentiment: {
      positive: 94,
      negative: 6,
      aspects: {
        quality: 95,
        aroma: 93
      }
    },
    dataAiHint: 'fenugreek seeds',
    tags: ['spices', 'fenugreek', 'methi', 'indian']
  },
  {
    id: '1020',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Over-ear headphones with premium sound.',
    longDescription: 'Experience immersive sound with active noise cancellation. 30-hour battery life and comfortable ear cushions for long listening sessions.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    sentiment: {
      positive: 94,
      negative: 6,
      aspects: {
        quality: 92,
        comfort: 90
      }
    },
    dataAiHint: 'headphones',
    tags: ['electronics', 'audio', 'wireless', 'music']
  },
  {
    id: '1021',
    name: 'Classic Denim Jacket',
    description: 'Timeless style for any season.',
    longDescription: 'A wardrobe staple. This classic denim jacket features a comfortable fit, durable fabric, and versatile style that goes with everything.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=60',
    category: 'Clothing',
    sentiment: {
      positive: 92,
      negative: 8,
      aspects: {
        style: 95,
        fit: 90,
        quality: 94
      }
    },
    dataAiHint: 'jacket',
    tags: ['clothing', 'fashion', 'outerwear', 'denim']
  },
  {
    id: '1022',
    name: 'Winter Puffer Jacket',
    description: 'Warm and lightweight insulated jacket.',
    longDescription: 'Stay warm without the bulk. This water-resistant puffer jacket features synthetic insulation to keep you cozy in cold weather.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=60',
    category: 'Clothing',
    sentiment: {
      positive: 95,
      negative: 5,
      aspects: {
        warmth: 98,
        comfort: 96,
        value: 94
      }
    },
    dataAiHint: 'puffer jacket',
    tags: ['clothing', 'winter', 'outerwear', 'warm']
  }
];