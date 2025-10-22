import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, 
  Target, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  Zap, 
  Calendar,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Star,
  Brain
} from 'lucide-react';

interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  subject: string;
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'not-started' | 'in-progress' | 'completed' | 'skipped';
  resources: string[];
  prerequisites: string[];
  learningObjectives: string[];
  assessmentType: 'quiz' | 'assignment' | 'project' | 'test';
}

interface StudentProgress {
  overallProgress: number;
  subjectProgress: Record<string, number>;
  timeSpent: number; // in hours
  streak: number; // days
  lastActivity: Date;
}

const PersonalizedLearningPath: React.FC = () => {
  const [currentNode, setCurrentNode] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Mock learning path data
  const [learningPath, setLearningPath] = useState<LearningPathNode[]>([
    {
      id: '1',
      title: 'Algebra Fundamentals',
      description: 'Master the basics of algebra including variables, expressions, and simple equations',
      subject: 'Mathematics',
      estimatedTime: 45,
      difficulty: 'easy',
      status: 'completed',
      resources: ['Textbook Chapter 1', 'Video Lesson 1', 'Practice Problems'],
      prerequisites: [],
      learningObjectives: [
        'Understand variables and constants',
        'Simplify algebraic expressions',
        'Solve one-step equations'
      ],
      assessmentType: 'quiz'
    },
    {
      id: '2',
      title: 'Linear Equations',
      description: 'Learn to solve and graph linear equations in one and two variables',
      subject: 'Mathematics',
      estimatedTime: 60,
      difficulty: 'medium',
      status: 'completed',
      resources: ['Textbook Chapter 2', 'Video Lesson 2', 'Interactive Graphing Tool'],
      prerequisites: ['1'],
      learningObjectives: [
        'Solve linear equations in one variable',
        'Graph linear equations',
        'Apply linear equations to real-world problems'
      ],
      assessmentType: 'quiz'
    },
    {
      id: '3',
      title: 'Quadratic Equations',
      description: 'Explore quadratic equations, factoring, and the quadratic formula',
      subject: 'Mathematics',
      estimatedTime: 90,
      difficulty: 'medium',
      status: 'in-progress',
      resources: ['Textbook Chapter 3', 'Video Lesson 3', 'Factoring Practice'],
      prerequisites: ['2'],
      learningObjectives: [
        'Factor quadratic expressions',
        'Solve quadratic equations by factoring',
        'Use the quadratic formula'
      ],
      assessmentType: 'quiz'
    },
    {
      id: '4',
      title: 'Functions and Graphs',
      description: 'Understand functions, domain, range, and various types of graphs',
      subject: 'Mathematics',
      estimatedTime: 75,
      difficulty: 'hard',
      status: 'not-started',
      resources: ['Textbook Chapter 4', 'Video Lesson 4', 'Graphing Calculator'],
      prerequisites: ['3'],
      learningObjectives: [
        'Define and identify functions',
        'Determine domain and range',
        'Graph different types of functions'
      ],
      assessmentType: 'assignment'
    },
    {
      id: '5',
      title: 'Trigonometry Basics',
      description: 'Introduction to trigonometric ratios and their applications',
      subject: 'Mathematics',
      estimatedTime: 90,
      difficulty: 'hard',
      status: 'not-started',
      resources: ['Textbook Chapter 5', 'Video Lesson 5', 'Trigonometry Practice'],
      prerequisites: ['4'],
      learningObjectives: [
        'Understand sine, cosine, and tangent ratios',
        'Solve right triangles',
        'Apply trigonometry to real-world problems'
      ],
      assessmentType: 'test'
    }
  ]);
  
  // Mock student progress data
  const [studentProgress, setStudentProgress] = useState<StudentProgress>({
    overallProgress: 40,
    subjectProgress: {
      'Mathematics': 40,
      'Science': 65,
      'English': 80,
      'Social Studies': 55
    },
    timeSpent: 12.5,
    streak: 7,
    lastActivity: new Date()
  });

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isPlaying) {
      setIsPlaying(false);
      // Mark current node as completed
      completeCurrentNode();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeRemaining]);

  const startTimer = () => {
    if (learningPath[currentNode].status !== 'completed') {
      setTimeRemaining(learningPath[currentNode].estimatedTime * 60);
      setIsPlaying(true);
    }
  };

  const pauseTimer = () => {
    setIsPlaying(false);
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setTimeRemaining(learningPath[currentNode].estimatedTime * 60);
  };

  const completeCurrentNode = () => {
    setLearningPath(prev => {
      const updated = [...prev];
      updated[currentNode] = {
        ...updated[currentNode],
        status: 'completed'
      };
      return updated;
    });
    
    // Update overall progress
    setStudentProgress(prev => ({
      ...prev,
      overallProgress: Math.min(100, prev.overallProgress + 20)
    }));
  };

  const skipNode = () => {
    setLearningPath(prev => {
      const updated = [...prev];
      updated[currentNode] = {
        ...updated[currentNode],
        status: 'skipped'
      };
      return updated;
    });
  };

  const navigateToNode = (index: number) => {
    if (index >= 0 && index < learningPath.length) {
      setCurrentNode(index);
      resetTimer();
    }
  };

  const nextNode = () => {
    if (currentNode < learningPath.length - 1) {
      navigateToNode(currentNode + 1);
    }
  };

  const prevNode = () => {
    if (currentNode > 0) {
      navigateToNode(currentNode - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Play className="h-5 w-5 text-blue-500" />;
      case 'skipped': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Map className="h-6 w-6 text-purple-600 mr-2" />
            Personalized Learning Path
          </h1>
          <p className="text-gray-600 mt-1">AI-generated path based on your performance and goals</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <Zap className="h-4 w-4 text-blue-600 mr-1" />
            <span className="text-sm font-medium text-blue-800">{studentProgress.streak} day streak</span>
          </div>
          <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm font-medium text-green-800">{studentProgress.overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-xl font-bold text-gray-900">{studentProgress.overallProgress}%</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${studentProgress.overallProgress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-xl font-bold text-gray-900">{studentProgress.timeSpent}h</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Current Subject</p>
              <p className="text-xl font-bold text-gray-900">Mathematics</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Next Milestone</p>
              <p className="text-xl font-bold text-gray-900">80%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path Visualization */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Journey</h2>
        <div className="relative">
          {/* Path line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 transform translate-x-1/2"></div>
          
          <div className="space-y-6">
            {learningPath.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start"
              >
                {/* Node indicator */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                  node.status === 'completed' ? 'bg-green-500' : 
                  node.status === 'in-progress' ? 'bg-blue-500' : 
                  node.status === 'skipped' ? 'bg-yellow-500' : 'bg-gray-300'
                }`}>
                  {getStatusIcon(node.status)}
                </div>
                
                {/* Node content */}
                <div 
                  className={`ml-6 flex-1 p-4 rounded-xl border ${
                    index === currentNode 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{node.title}</h3>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getDifficultyColor(node.difficulty)}`}>
                          {node.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{node.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{node.estimatedTime} minutes</span>
                        <BookOpen className="h-4 w-4 ml-3 mr-1" />
                        <span>{node.subject}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0 flex space-x-2">
                      <button
                        onClick={() => navigateToNode(index)}
                        className={`px-3 py-1 text-sm rounded-lg ${
                          index === currentNode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {index === currentNode ? 'Current' : 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Node Details */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 text-purple-600 mr-2" />
              {learningPath[currentNode].title}
            </h2>
            <p className="text-gray-600 mt-1">{learningPath[currentNode].description}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(learningPath[currentNode].difficulty)}`}>
              {learningPath[currentNode].difficulty.charAt(0).toUpperCase() + learningPath[currentNode].difficulty.slice(1)}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {learningPath[currentNode].subject}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Objectives */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 text-blue-600 mr-2" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {learningPath[currentNode].learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <BookOpen className="h-4 w-4 text-purple-600 mr-2" />
              Resources
            </h3>
            <ul className="space-y-2">
              {learningPath[currentNode].resources.map((resource, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  {resource}
                </li>
              ))}
            </ul>
          </div>

          {/* Timer and Controls */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 text-amber-600 mr-2" />
              Study Timer
            </h3>
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-gray-900 mb-4">
                {formatTime(timeRemaining)}
              </div>
              <div className="flex justify-center space-x-2">
                {!isPlaying ? (
                  <button
                    onClick={startTimer}
                    disabled={learningPath[currentNode].status === 'completed'}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      learningPath[currentNode].status === 'completed'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
              </div>
              
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={prevNode}
                  disabled={currentNode === 0}
                  className={`p-2 rounded-full ${
                    currentNode === 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextNode}
                  disabled={currentNode === learningPath.length - 1}
                  className={`p-2 rounded-full ${
                    currentNode === learningPath.length - 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={completeCurrentNode}
            disabled={learningPath[currentNode].status === 'completed'}
            className={`flex items-center px-4 py-2 rounded-lg ${
              learningPath[currentNode].status === 'completed'
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Completed
          </button>
          <button
            onClick={skipNode}
            disabled={learningPath[currentNode].status === 'completed'}
            className={`flex items-center px-4 py-2 rounded-lg ${
              learningPath[currentNode].status === 'completed'
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Skip Topic
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <BookOpen className="h-4 w-4 mr-2" />
            Start Learning
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Star className="h-5 w-5 text-amber-600 mr-2" />
          AI Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-gray-900">Performance Insight</h3>
            </div>
            <p className="text-sm text-gray-600">
              You're excelling in algebra concepts. Consider spending more time on geometry topics where your performance is average.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Next Steps</h3>
            </div>
            <p className="text-sm text-gray-600">
              After completing Quadratic Equations, move on to Functions and Graphs for a smooth transition to advanced topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedLearningPath;