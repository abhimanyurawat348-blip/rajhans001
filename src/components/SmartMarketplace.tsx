import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Star, 
  TrendingUp, 
  Award, 
  Package, 
  Truck, 
  Shield, 
  CreditCard,
  Search,
  Filter,
  Heart,
  Share2,
  Tag,
  Percent,
  Zap
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  vendor: string;
  vendorRating: number;
  deliveryTime: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  tags?: string[];
}

interface Vendor {
  id: number;
  name: string;
  rating: number;
  totalSales: number;
  joinedDate: string;
  verified: boolean;
}

const SmartMarketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = [
    { id: 'books', name: 'Books & Stationery', icon: '📚', color: 'from-blue-600 to-blue-400' },
    { id: 'uniforms', name: 'School Uniforms', icon: '👕', color: 'from-red-600 to-red-400' },
    { id: 'merchandise', name: 'Merchandise', icon: '🛍️', color: 'from-green-600 to-green-400' },
    { id: 'footwear', name: 'Footwear', icon: '👟', color: 'from-purple-600 to-purple-400' },
    { id: 'electronics', name: 'Electronics', icon: '💻', color: 'from-amber-600 to-amber-400' },
    { id: 'art', name: 'Art Supplies', icon: '🎨', color: 'from-pink-600 to-pink-400' }
  ];

  const vendors: Vendor[] = [
    { id: 1, name: 'Scholarly Books Pvt. Ltd.', rating: 4.8, totalSales: 1250, joinedDate: '2023-01-15', verified: true },
    { id: 2, name: 'Uniform World', rating: 4.6, totalSales: 890, joinedDate: '2023-03-22', verified: true },
    { id: 3, name: 'Tech Learning Solutions', rating: 4.9, totalSales: 650, joinedDate: '2023-05-10', verified: true },
    { id: 4, name: 'Artisan Crafts', rating: 4.7, totalSales: 420, joinedDate: '2023-07-18', verified: false }
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Mathematics Textbook Class 10',
      price: 350,
      originalPrice: 420,
      image: '📚',
      category: 'books',
      rating: 4.8,
      reviewCount: 124,
      vendor: 'Scholarly Books Pvt. Ltd.',
      vendorRating: 4.8,
      deliveryTime: '2-3 days',
      isOnSale: true,
      tags: ['bestseller', 'exam-prep']
    },
    {
      id: 2,
      name: 'Premium School Uniform Set',
      price: 1200,
      image: '👕',
      category: 'uniforms',
      rating: 4.6,
      reviewCount: 89,
      vendor: 'Uniform World',
      vendorRating: 4.6,
      deliveryTime: '5-7 days',
      isFeatured: true,
      tags: ['new-arrival']
    },
    {
      id: 3,
      name: 'Scientific Calculator FX-991ES',
      price: 850,
      originalPrice: 950,
      image: '💻',
      category: 'electronics',
      rating: 4.9,
      reviewCount: 210,
      vendor: 'Tech Learning Solutions',
      vendorRating: 4.9,
      deliveryTime: '1-2 days',
      isOnSale: true,
      tags: ['bestseller', 'exam-ready']
    },
    {
      id: 4,
      name: 'Art Sketching Kit',
      price: 450,
      image: '🎨',
      category: 'art',
      rating: 4.7,
      reviewCount: 67,
      vendor: 'Artisan Crafts',
      vendorRating: 4.7,
      deliveryTime: '3-5 days',
      tags: ['creative']
    },
    {
      id: 5,
      name: 'School Shoes - Black Leather',
      price: 1350,
      originalPrice: 1500,
      image: '👟',
      category: 'footwear',
      rating: 4.5,
      reviewCount: 142,
      vendor: 'Uniform World',
      vendorRating: 4.6,
      deliveryTime: '4-6 days',
      isOnSale: true,
      tags: ['comfortable']
    },
    {
      id: 6,
      name: 'Chemistry Lab Manual',
      price: 280,
      image: '📚',
      category: 'books',
      rating: 4.4,
      reviewCount: 78,
      vendor: 'Scholarly Books Pvt. Ltd.',
      vendorRating: 4.8,
      deliveryTime: '2-3 days',
      tags: ['practical']
    }
  ];

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with RHPS Logo */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20
          }}
          className="mx-auto mb-6"
        >
          {/* RHPS Logo as a big logo */}
          <div className="w-32 h-32 mx-auto">
            <svg 
              viewBox="0 0 192 192" 
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
              </defs>
              
              {/* Background circle */}
              <circle cx="96" cy="96" r="88" fill="white" stroke="url(#blueGradient)" strokeWidth="2"/>
              
              {/* Interconnected letters with connection lines */}
              <g fill="url(#blueGradient)" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">
                {/* Letter R */}
                <text x="50" y="90" fontSize="48">R</text>
                
                {/* Letter H */}
                <text x="85" y="90" fontSize="48">H</text>
                
                {/* Letter P */}
                <text x="120" y="90" fontSize="48">P</text>
                
                {/* Letter S */}
                <text x="155" y="90" fontSize="48">S</text>
                
                {/* Connection lines between letters */}
                <line x1="65" y1="80" x2="75" y2="80" stroke="url(#neonGradient)" strokeWidth="2" strokeDasharray="2,2"/>
                <line x1="100" y1="80" x2="110" y2="80" stroke="url(#neonGradient)" strokeWidth="2" strokeDasharray="2,2"/>
                <line x1="135" y1="80" x2="145" y2="80" stroke="url(#neonGradient)" strokeWidth="2" strokeDasharray="2,2"/>
              </g>
              
              {/* Open book symbolizing knowledge */}
              <g transform="translate(96, 130)" opacity="0.7">
                <path d="M-20,0 Q-20,-15 0,-15 Q20,-15 20,0 Q20,15 0,15 Q-20,15 -20,0" fill="none" stroke="url(#neonGradient)" strokeWidth="2"/>
                <path d="M0,-15 L0,15" stroke="url(#neonGradient)" strokeWidth="2"/>
              </g>
            </svg>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-6"
        >
          <Zap className="h-5 w-5" />
          <span className="font-semibold">Smart Educational Marketplace</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          RHPS <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Smart</span> Educational Mall
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Discover quality educational products from trusted vendors in our school community.
        </motion.p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-12 border border-purple-200">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                Free Shipping
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                Top Rated
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                On Sale
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                Best Sellers
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            className={`rounded-2xl p-6 shadow-lg border-2 cursor-pointer transition-all ${
              selectedCategory === category.id
                ? `bg-gradient-to-br ${category.color} border-white scale-105`
                : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
            }`}
          >
            <div className="text-3xl mb-3">{category.icon}</div>
            <h3 className="text-lg font-bold text-white text-center">
              {category.name}
            </h3>
          </motion.button>
        ))}
      </div>

      {/* Featured Vendors */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Vendors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <motion.div
              key={vendor.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{vendor.rating}</span>
                    {vendor.verified && (
                      <Shield className="h-4 w-4 text-blue-500 ml-1" />
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Trusted Vendor
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Sales:</span>
                  <span className="font-semibold">{vendor.totalSales}</span>
                </div>
                <div className="flex justify-between">
                  <span>Joined:</span>
                  <span>{new Date(vendor.joinedDate).getFullYear()}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all">
                Shop Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory 
              ? `${categories.find(c => c.id === selectedCategory)?.name} Products` 
              : 'All Products'}
            <span className="text-gray-500 text-lg font-normal ml-2">
              ({sortedProducts.length} items)
            </span>
          </h2>
          
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Clear Filter
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="relative">
                <div className="bg-gray-100 h-48 flex items-center justify-center text-6xl">
                  {product.image}
                </div>
                
                {product.isOnSale && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    SALE
                  </div>
                )}
                
                {product.isFeatured && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    FEATURED
                  </div>
                )}
                
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      favorites.includes(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`} 
                  />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{product.vendor}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-green-600 font-semibold">
                        Save ₹{product.originalPrice - product.price}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>{product.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure</span>
                  </div>
                </div>
                
                {product.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Quality Educational Products</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Discover high-quality educational materials from trusted vendors in our school community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
            View All Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartMarketplace;