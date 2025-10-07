import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { School, Users, FileText, BookOpen, Calendar, ArrowRight, Brain, Heart, Briefcase, ListTodo, MessageCircle, UserCheck, ShoppingCart, Book, Shirt, Zap, Footprints, X } from 'lucide-react';
import CareerGuidanceModal from '../components/CareerGuidanceModal';
import StressReliefModal from '../components/StressReliefModal';
import EnhancedTodoListModal from '../components/EnhancedTodoListModal';
import HomeworkHelpModal from '../components/HomeworkHelpModal';

const Home: React.FC = () => {
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isStressModalOpen, setIsStressModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Product data for each category
  const products = {
    books: [
      { id: 1, name: 'Mathematics Textbook Class 10', price: '₹350', image: '📚' },
      { id: 2, name: 'Science Lab Manual', price: '₹280', image: '🔬' },
      { id: 3, name: 'English Literature Reader', price: '₹320', image: '📖' },
      { id: 4, name: 'Hindi Vyakaran Guide', price: '₹250', image: '📝' },
      { id: 5, name: 'Social Studies Atlas', price: '₹420', image: '🗺️' },
      { id: 6, name: 'Physics Reference Book', price: '₹380', image: '⚛️' },
    ],
    stationery: [
      { id: 1, name: 'Premium Ball Pens Set', price: '₹150', image: '🖊️' },
      { id: 2, name: 'Geometry Box', price: '₹200', image: '📐' },
      { id: 3, name: 'Drawing Notebook', price: '₹120', image: '📘' },
      { id: 4, name: 'Color Pencils Pack', price: '₹180', image: '🎨' },
      { id: 5, name: 'Eraser Set', price: '₹50', image: '🧼' },
      { id: 6, name: 'Sharpener Combo', price: '₹75', image: '✂️' },
    ],
    uniforms: [
      { id: 1, name: 'School Shirt - White', price: '₹450', image: '👕' },
      { id: 2, name: 'School Pants - Navy Blue', price: '₹550', image: '👖' },
      { id: 3, name: 'School Skirt - Navy Blue', price: '₹480', image: '👗' },
      { id: 4, name: 'School Tie - Red & Gold', price: '₹200', image: '🎀' },
      { id: 5, name: 'School Socks - White', price: '₹100', image: '🧦' },
      { id: 6, name: 'School Belt - Brown', price: '₹180', image: '🪢' },
    ],
    merchandise: [
      { id: 1, name: 'School Logo Hoodie', price: '₹850', image: '🧥' },
      { id: 2, name: 'RHPS T-Shirt', price: '₹350', image: '👕' },
      { id: 3, name: 'School Cap - Navy Blue', price: '₹250', image: '🧢' },
      { id: 4, name: 'School Bag - Blue', price: '₹650', image: '🎒' },
      { id: 5, name: 'Water Bottle - 1L', price: '₹300', image: '💧' },
      { id: 6, name: 'Lunch Box - 2 Compartment', price: '₹400', image: '🍱' },
    ],
    footwear: [
      { id: 1, name: 'School Shoes - Black', price: '₹1200', image: '👞' },
      { id: 2, name: 'Sports Shoes - White', price: '₹1500', image: '👟' },
      { id: 3, name: 'Slippers - Brown', price: '₹400', image: '👡' },
      { id: 4, name: 'Rain Boots - Blue', price: '₹800', image: '👢' },
      { id: 5, name: 'Formal Shoes - Black', price: '₹1300', image: '👠' },
      { id: 6, name: 'Canvas Shoes - White', price: '₹600', image: '👟' },
    ],
    posters: [
      { id: 1, name: 'Periodic Table Poster', price: '₹150', image: '⚛️' },
      { id: 2, name: 'World Map', price: '₹200', image: '🗺️' },
      { id: 3, name: 'Motivational Quotes', price: '₹100', image: '💭' },
      { id: 4, name: 'Anatomy Chart', price: '₹250', image: '🧑‍⚕️' },
      { id: 5, name: 'Solar System Poster', price: '₹180', image: '🌌' },
      { id: 6, name: 'Grammar Rules Chart', price: '₹120', image: '✍️' },
    ]
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Quiz Zone',
      description: 'Challenge yourself with interactive quizzes and compete with peers',
      link: '/quiz',
      color: 'bg-gradient-to-r from-pink-500 to-purple-500',
      special: true
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: 'Career Guidance',
      description: 'Get personalized career advice from Dronacharya AI',
      onClick: () => setIsCareerModalOpen(true),
      color: 'bg-gradient-to-r from-amber-500 to-orange-500',
      special: true,
      isNew: true
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Stress Relief',
      description: 'Talk to Dronacharya AI for stress management and support',
      onClick: () => setIsStressModalOpen(true),
      color: 'bg-gradient-to-r from-rose-500 to-pink-500',
      special: true,
      isNew: true
    },
    {
      icon: <ListTodo className="h-8 w-8" />,
      title: 'To-Do List',
      description: 'Organize your tasks and boost your productivity',
      onClick: () => setIsTodoModalOpen(true),
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      special: true,
      isNew: true
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'Homework Help',
      description: 'Need homework help? Talk to Dronacharya AI',
      onClick: () => setIsHomeworkModalOpen(true),
      color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      special: true,
      isNew: true
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Student Council',
      description: 'Meet our inspiring student leaders for 2025-26',
      link: '/student-council',
      color: 'bg-blue-500'
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Planners & Registrations',
      description: 'View school events and register for activities',
      link: '/planners-registrations',
      color: 'bg-indigo-500'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Submit Complaints',
      description: 'Voice your concerns and suggestions',
      link: '/complaints',
      color: 'bg-green-500'
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Study Resources',
      description: 'Download previous year papers and sample papers',
      link: '/study-resources',
      color: 'bg-orange-500'
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'School Rules',
      description: 'Guidelines for a better learning environment',
      link: '/rules',
      color: 'bg-purple-500'
    }
  ];

  // Flashcards for new features & updates
  const flashcards = [
    {
      id: 'parent-portal',
      title: 'Parent Portal',
      description: 'New Parent Portal for tracking your child\'s academic progress, attendance, and homework',
      icon: UserCheck,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      link: '/parent-portal',
      isNew: true,
    },
    {
      id: 'career',
      title: 'Career Guidance',
      description: 'Confused about your future? Discover careers that match your skills and interests.',
      icon: Briefcase,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      onClick: () => setIsCareerModalOpen(true),
      isNew: true,
    },
    {
      id: 'stress',
      title: 'Stress Relief',
      description: 'Feeling stressed? Chat with Dronacharya for support.',
      icon: Heart,
      gradient: 'from-pink-500 to-purple-500',
      bgGradient: 'from-pink-50 to-purple-50',
      onClick: () => setIsStressModalOpen(true),
      isNew: true,
    },
    {
      id: 'todo',
      title: 'To-Do List',
      description: 'Organize your day and take notes.',
      icon: ListTodo,
      gradient: 'from-green-500 to-teal-500',
       bgGradient: 'from-green-50 to-teal-50',
      onClick: () => setIsTodoModalOpen(true),
      isNew: true,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <School className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            RHPS Public School
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-gray-600 mb-4"
          >
            Miyanwala, Dehradun
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
          >
            <p className="text-2xl font-semibold mb-8">
              "Excellence in Education, Character in Life"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/student-dashboard"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Student Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/parent-portal"
              className="inline-flex items-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Parent Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/staff-portal"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Staff Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* New Features & Updates Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              New Features & Updates
            </h2>
            <p className="text-xl text-gray-600">
              Discover the latest additions to our school portal
            </p>
          </motion.div>

          {/* Dronacharya AI Under Development Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border-2 border-amber-200 shadow-md"
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-800">AI Tutor (Dronacharya) Under Development</h3>
                <p className="text-amber-700 mt-1">
                  Exciting new AI-powered learning features are coming soon! Stay tuned for enhanced educational support.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {flashcards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={card.onClick}
                className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 relative overflow-hidden cursor-pointer`}
              >
                {card.isNew && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    NEW
                  </div>
                )}
                <div className={`bg-gradient-to-r ${card.gradient} w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 mx-auto shadow-lg`}>
                  <card.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-center text-sm">
                  {card.description}
                </p>
                <div className="text-center mt-4">
                  {card.link ? (
                    <Link
                      to={card.link}
                      className="inline-flex items-center font-semibold text-sm transition-colors duration-200 text-purple-600 hover:text-purple-700"
                    >
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  ) : (
                    <button className="inline-flex items-center font-semibold text-sm transition-colors duration-200 text-purple-600 hover:text-purple-700">
                      Open Now
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RHPS E Educational Mall Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          {/* Warning Message */}
          <div className="bg-yellow-500 text-black py-3 px-6 rounded-lg mb-8 text-center font-bold text-lg">
            ⚠️ This E Mall is under progress - Features and products are subject to change
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              RHPS E EDUCATIONAL MALL
            </h2>
            <p className="text-2xl text-gray-300">
              Your one-stop shop for all school essentials
            </p>
          </motion.div>

          {/* Category Selection - Large Display Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {/* Books & Stationery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.05 }}
              onClick={() => setSelectedCategory('books')}
              className={`rounded-2xl p-6 shadow-2xl border-2 cursor-pointer ${
                selectedCategory === 'books' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-400 border-blue-300 scale-105' 
                  : 'bg-gradient-to-br from-blue-900 to-blue-700 border-blue-500'
              }`}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3 text-white">
                Books & Stationery
              </h3>
              <p className="text-gray-200 text-center">
                Textbooks, notebooks, pens, and all essential stationery items
              </p>
            </motion.div>

            {/* School Uniforms */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.05 }}
              onClick={() => setSelectedCategory('uniforms')}
              className={`rounded-2xl p-6 shadow-2xl border-2 cursor-pointer ${
                selectedCategory === 'uniforms' 
                  ? 'bg-gradient-to-br from-red-600 to-red-400 border-red-300 scale-105' 
                  : 'bg-gradient-to-br from-red-900 to-red-700 border-red-500'
              }`}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shirt className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3 text-white">
                School Uniforms
              </h3>
              <p className="text-gray-200 text-center">
                Complete uniform sets for all classes and seasons
              </p>
            </motion.div>

            {/* Merchandise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.05 }}
              onClick={() => setSelectedCategory('merchandise')}
              className={`rounded-2xl p-6 shadow-2xl border-2 cursor-pointer ${
                selectedCategory === 'merchandise' 
                  ? 'bg-gradient-to-br from-green-600 to-green-400 border-green-300 scale-105' 
                  : 'bg-gradient-to-br from-green-900 to-green-700 border-green-500'
              }`}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3 text-white">
                Merchandise
              </h3>
              <p className="text-gray-200 text-center">
                Hoodies, jackets, t-shirts, and school accessories
              </p>
            </motion.div>

            {/* Footwear */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.05 }}
              onClick={() => setSelectedCategory('footwear')}
              className={`rounded-2xl p-6 shadow-2xl border-2 cursor-pointer ${
                selectedCategory === 'footwear' 
                  ? 'bg-gradient-to-br from-purple-600 to-purple-400 border-purple-300 scale-105' 
                  : 'bg-gradient-to-br from-purple-900 to-purple-700 border-purple-500'
              }`}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Footprints className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3 text-white">
                Footwear
              </h3>
              <p className="text-gray-200 text-center">
                School shoes and sports footwear
              </p>
            </motion.div>

            {/* Posters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.05 }}
              onClick={() => setSelectedCategory('posters')}
              className={`rounded-2xl p-6 shadow-2xl border-2 cursor-pointer ${
                selectedCategory === 'posters' 
                  ? 'bg-gradient-to-br from-yellow-600 to-yellow-400 border-yellow-300 scale-105' 
                  : 'bg-gradient-to-br from-yellow-900 to-yellow-700 border-yellow-500'
              }`}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-3 text-white">
                Posters & Prints
              </h3>
              <p className="text-gray-200 text-center">
                Educational posters and school memorabilia
              </p>
            </motion.div>
          </div>

          {/* Product Display Section */}
          <div className="bg-gray-800 rounded-2xl p-8 mb-12 border-2 border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-white">
                {selectedCategory 
                  ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` 
                  : 'Featured Products'}
              </h3>
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  Clear Filter <X className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCategory ? (
                products[selectedCategory as keyof typeof products].map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-700 rounded-xl p-6 flex items-center hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-4xl">{product.image}</div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-white font-bold">{product.name}</h4>
                      <p className="text-yellow-400 font-semibold">{product.price}</p>
                    </div>
                    <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all">
                      Add
                    </button>
                  </motion.div>
                ))
              ) : (
                <>
                  <div className="bg-gray-700 rounded-xl p-6 flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h4 className="text-white font-bold">Select a category</h4>
                      <p className="text-gray-300 text-sm">Click on a category above to view products</p>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-xl p-6 flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h4 className="text-white font-bold">Select a category</h4>
                      <p className="text-gray-300 text-sm">Click on a category above to view products</p>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-xl p-6 flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h4 className="text-white font-bold">Select a category</h4>
                      <p className="text-gray-300 text-sm">Click on a category above to view products</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-800 rounded-2xl p-8 mb-12 border-2 border-gray-700">
            <h3 className="text-3xl font-bold text-center text-white mb-6">
              Payment Methods
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-gray-700 rounded-lg p-4 w-32 h-20 flex items-center justify-center">
                <span className="text-white font-bold">Credit Card</span>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 w-32 h-20 flex items-center justify-center">
                <span className="text-white font-bold">Debit Card</span>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 w-32 h-20 flex items-center justify-center">
                <span className="text-white font-bold">UPI</span>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 w-32 h-20 flex items-center justify-center">
                <span className="text-white font-bold">Net Banking</span>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 w-32 h-20 flex items-center justify-center">
                <span className="text-white font-bold">Cash on Delivery</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              School Portal Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for a connected school experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: feature.special ? 1.05 : 1 }}
                onClick={feature.onClick}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  feature.special ? 'border-4 border-purple-300 relative overflow-hidden' : ''
                } ${feature.onClick ? 'cursor-pointer' : ''}`}
              >
                {feature.isNew && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    NEW
                  </div>
                )}
                <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 mx-auto shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-center ${
                  feature.special ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {feature.description}
                </p>
                <div className="text-center">
                  {feature.link ? (
                    <Link
                      to={feature.link}
                      className={`inline-flex items-center font-semibold transition-colors duration-200 ${
                        feature.special
                          ? 'text-purple-600 hover:text-purple-700'
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      {feature.title === 'Quiz Zone' ? 'Start Quiz Now' : 'Learn More'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  ) : (
                    <button
                      className={`inline-flex items-center font-semibold transition-colors duration-200 ${
                        feature.special
                          ? 'text-purple-600 hover:text-purple-700'
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      Open Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-8">Our School Community</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-xl">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-xl">Teachers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-xl">Years of Excellence</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <CareerGuidanceModal isOpen={isCareerModalOpen} onClose={() => setIsCareerModalOpen(false)} />
      <StressReliefModal isOpen={isStressModalOpen} onClose={() => setIsStressModalOpen(false)} />
      <EnhancedTodoListModal isOpen={isTodoModalOpen} onClose={() => setIsTodoModalOpen(false)} />
      <HomeworkHelpModal isOpen={isHomeworkModalOpen} onClose={() => setIsHomeworkModalOpen(false)} />
    </div>
  );
};

export default Home;