import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  Star,
  Clock,
  Zap
} from 'lucide-react';
import EnhancedFlashcard from './EnhancedFlashcard';

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isBookmarked: boolean;
}

const FlashcardCollection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock flashcard data
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([
    {
      id: '1',
      front: 'What is photosynthesis?',
      back: 'The process by which plants convert light energy into chemical energy.',
      subject: 'Biology',
      difficulty: 'easy',
      tags: ['plants', 'energy', 'chlorophyll'],
      isBookmarked: false
    },
    {
      id: '2',
      front: 'What is Newton\'s First Law?',
      back: 'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an unbalanced force.',
      subject: 'Physics',
      difficulty: 'medium',
      tags: ['motion', 'force', 'inertia'],
      isBookmarked: true
    },
    {
      id: '3',
      front: 'What is the chemical formula for water?',
      back: 'H2O',
      subject: 'Chemistry',
      difficulty: 'easy',
      tags: ['molecules', 'hydrogen', 'oxygen'],
      isBookmarked: false
    },
    {
      id: '4',
      front: 'What caused World War I?',
      back: 'The assassination of Archduke Franz Ferdinand of Austria-Hungary in 1914.',
      subject: 'History',
      difficulty: 'hard',
      tags: ['war', 'politics', '20th century'],
      isBookmarked: false
    },
    {
      id: '5',
      front: 'What is the Pythagorean theorem?',
      back: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²',
      subject: 'Mathematics',
      difficulty: 'medium',
      tags: ['geometry', 'triangles', 'algebra'],
      isBookmarked: true
    },
    {
      id: '6',
      front: 'What are the three branches of government?',
      back: 'Executive, Legislative, and Judicial',
      subject: 'Civics',
      difficulty: 'easy',
      tags: ['government', 'politics', 'democracy'],
      isBookmarked: false
    }
  ]);

  const subjects = ['all', 'Biology', 'Physics', 'Chemistry', 'History', 'Mathematics', 'Civics'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const toggleBookmark = (id: string) => {
    setFlashcards(prev => prev.map(card => 
      card.id === id ? { ...card, isBookmarked: !card.isBookmarked } : card
    ));
  };

  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.front.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || card.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || card.difficulty === selectedDifficulty;
    const matchesBookmark = !bookmarkedOnly || card.isBookmarked;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesBookmark;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flashcards</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Study smarter with interactive flashcards
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Zap className="h-4 w-4 mr-2" />
            AI Generate
          </button>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <BookOpen className="h-4 w-4 mr-2" />
            Create New
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cards</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{flashcards.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Mastered</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Bookmark className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Bookmarked</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {flashcards.filter(card => card.isBookmarked).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Study Streak</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mt-2 md:mt-0"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Bookmarked Only */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bookmarkedOnly"
                checked={bookmarkedOnly}
                onChange={(e) => setBookmarkedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="bookmarkedOnly" className="ml-2 text-gray-700 dark:text-gray-300">
                Bookmarked Only
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Flashcards Grid */}
      {filteredFlashcards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlashcards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EnhancedFlashcard
                id={card.id}
                front={card.front}
                back={card.back}
                subject={card.subject}
                difficulty={card.difficulty}
                tags={card.tags}
                isBookmarked={card.isBookmarked}
                onBookmark={toggleBookmark}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No flashcards found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardCollection;