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

  const handleCreateNew = () => {
    // In a real implementation, this would open a modal or navigate to a create page
    alert('Create new flashcard functionality would be implemented here');
  };

  const handleAIGenerate = () => {
    // In a real implementation, this would generate flashcards using AI
    alert('AI flashcard generation functionality would be implemented here');
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
          <h1 className="text-2xl font-bold text-primary">Flashcards</h1>
          <p className="text-sm text-tertiary mt-1">
            Study smarter with interactive flashcards
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            onClick={handleAIGenerate}
            className="btn btn-primary btn-md"
          >
            <Zap className="h-4 w-4 mr-2" />
            AI Generate
          </button>
          <button 
            onClick={handleCreateNew}
            className="btn btn-outline btn-md"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Create New
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="p-md flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-tertiary">Total Cards</p>
              <p className="text-xl font-bold text-primary">{flashcards.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-md flex items-center">
            <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
              <Star className="h-5 w-5 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-tertiary">Mastered</p>
              <p className="text-xl font-bold text-primary">24</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-md flex items-center">
            <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
              <Bookmark className="h-5 w-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-tertiary">Bookmarked</p>
              <p className="text-xl font-bold text-primary">
                {flashcards.filter(card => card.isBookmarked).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-md flex items-center">
            <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
              <Clock className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-tertiary">Study Streak</p>
              <p className="text-xl font-bold text-primary">7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header flex-between">
          <h2 className="text-lg font-semibold text-primary">Filters</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-tertiary hover:text-secondary"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="card-body grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            
            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="select"
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
                className="select"
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
                className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="bookmarkedOnly" className="ml-2 text-secondary">
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
        <div className="text-center py-12 card">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-primary">No flashcards found</h3>
          <p className="mt-1 text-tertiary">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardCollection;