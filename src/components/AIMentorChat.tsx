import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, BookOpen, Calculator, Beaker, Globe, Zap, MessageCircle, Brain, Lightbulb, Target, Trophy, Book, FileText, BarChart3, Users, Award } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  subject?: string;
  type?: 'response' | 'suggestion' | 'resource' | 'quiz' | 'study-plan';
}

interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  topics: string[];
  classes: number[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  resources: string[];
}

const AIMentorChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Dronacharya 2.0, your AI mentor trained on NCERT/CBSE curriculum for classes 6-12. How can I help you with your studies today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuizQuestions, setTotalQuizQuestions] = useState(0);
  const [studyPlanMode, setStudyPlanMode] = useState(false);
  const [currentStudyPlan, setCurrentStudyPlan] = useState<StudyPlan | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subjects: Subject[] = [
    { 
      id: 'math', 
      name: 'Mathematics', 
      icon: Calculator, 
      color: 'bg-blue-500',
      topics: [
        'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Probability',
        'Number Systems', 'Mensuration', 'Coordinate Geometry', 'Linear Equations',
        'Quadratic Equations', 'Polynomials', 'Sets', 'Relations and Functions'
      ],
      classes: [6, 7, 8, 9, 10, 11, 12]
    },
    { 
      id: 'science', 
      name: 'Science', 
      icon: Beaker, 
      color: 'bg-green-500',
      topics: [
        'Physics', 'Chemistry', 'Biology', 'Environmental Science',
        'Matter', 'Atoms and Molecules', 'Structure of Atom', 'Cell',
        'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy',
        'Sound', 'Light', 'Electricity', 'Magnetic Effects of Electric Current'
      ],
      classes: [6, 7, 8, 9, 10, 11, 12]
    },
    { 
      id: 'english', 
      name: 'English', 
      icon: BookOpen, 
      color: 'bg-purple-500',
      topics: [
        'Grammar', 'Literature', 'Writing Skills', 'Comprehension',
        'Tenses', 'Active and Passive Voice', 'Direct and Indirect Speech',
        'Prepositions', 'Conjunctions', 'Articles', 'Modals',
        'Poetry', 'Prose', 'Drama', 'Novel'
      ],
      classes: [6, 7, 8, 9, 10, 11, 12]
    },
    { 
      id: 'social', 
      name: 'Social Studies', 
      icon: Globe, 
      color: 'bg-amber-500',
      topics: [
        'History', 'Geography', 'Civics', 'Economics',
        'Ancient India', 'Medieval India', 'Modern India',
        'Resources and Development', 'Agriculture', 'Industry',
        'Democracy', 'Federalism', 'Constitution', 'Local Government',
        'Development', 'Sectors of Economy', 'Money and Credit'
      ],
      classes: [6, 7, 8, 9, 10, 11, 12]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText, selectedSubject),
        sender: 'ai',
        timestamp: new Date(),
        subject: selectedSubject || undefined
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, subject: string | null): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (subject === 'math') {
      if (lowerInput.includes('quadratic') || lowerInput.includes('equation')) {
        return "A quadratic equation is in the form ax² + bx + c = 0 where a ≠ 0. You can solve it using:\n\n1. Factorization method\n2. Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)\n3. Completing the square method\n\nThe discriminant (b² - 4ac) determines the nature of roots:\n- If > 0: Two distinct real roots\n- If = 0: Two equal real roots\n- If < 0: No real roots\n\nWould you like me to solve an example?";
      }
      if (lowerInput.includes('algebra') || lowerInput.includes('factor')) {
        return "Algebra involves using symbols to represent numbers in equations. Key concepts include:\n\n1. Polynomials: Expressions with variables and coefficients\n2. Factorization: Breaking expressions into simpler components\n3. Linear equations: ax + b = 0\n4. Quadratic equations: ax² + bx + c = 0\n\nExample: x² - 9 = (x + 3)(x - 3) is factorization using the difference of squares formula.\n\nWhat specific algebra concept would you like to explore?";
      }
      if (lowerInput.includes('trigonometry')) {
        return "Trigonometry deals with relationships between angles and sides of triangles. Key ratios:\n\n1. sin θ = opposite/hypotenuse\n2. cos θ = adjacent/hypotenuse\n3. tan θ = opposite/adjacent\n\nImportant identities:\n- sin²θ + cos²θ = 1\n- 1 + tan²θ = sec²θ\n- 1 + cot²θ = cosec²θ\n\nApplications include height and distance problems. Would you like to solve a trigonometry problem?";
      }
      if (lowerInput.includes('calculus')) {
        return "Calculus is the mathematical study of continuous change. It has two main branches:\n\n1. Differential Calculus: Studies rates at which quantities change\n   - Derivative: Rate of change of a function\n   - Applications: Velocity, acceleration, optimization\n\n2. Integral Calculus: Studies accumulation of quantities\n   - Integration: Finding area under curves\n   - Applications: Work, energy, displacement\n\nKey concepts:\n- Limits and Continuity\n- Differentiation rules\n- Integration techniques\n- Applications in real life\n\nWhat specific calculus topic would you like to explore?";
      }
      return "I see you're asking about math! I can help with algebra, geometry, trigonometry, calculus, and more. Could you be more specific about what you need help with?";
    }
    
    if (subject === 'science') {
      if (lowerInput.includes('photosynthesis')) {
        return "Photosynthesis is the process by which plants convert light energy into chemical energy. The balanced equation is:\n\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nKey points:\n1. Occurs in chloroplasts containing chlorophyll\n2. Two stages: Light-dependent reactions and Calvin cycle\n3. Produces glucose (food) and oxygen\n4. Essential for life on Earth\n\nWould you like to know more about the stages or factors affecting photosynthesis?";
      }
      if (lowerInput.includes('gravity') || lowerInput.includes('newton')) {
        return "Newton's law of universal gravitation states that every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between them:\n\nF = G(m₁m₂)/r²\n\nWhere:\n- F = Gravitational force\n- G = Universal gravitational constant (6.67 × 10⁻¹¹ Nm²/kg²)\n- m₁, m₂ = Masses of objects\n- r = Distance between centers\n\nThis explains planetary motion, tides, and weight. How can I help you understand this better?";
      }
      if (lowerInput.includes('cell')) {
        return "A cell is the basic structural and functional unit of life. Types:\n\n1. Prokaryotic cells (bacteria) - No nucleus\n2. Eukaryotic cells (plants, animals) - Have nucleus\n\nKey organelles:\n- Nucleus: Control center with genetic material\n- Mitochondria: Powerhouse (ATP production)\n- Chloroplasts: Photosynthesis in plant cells\n- Endoplasmic reticulum: Protein/lipid synthesis\n- Golgi apparatus: Packaging and transport\n\nWould you like to explore a specific organelle or cell process?";
      }
      if (lowerInput.includes('matter')) {
        return "Matter is anything that has mass and occupies space. States of matter:\n\n1. Solid: Definite shape and volume\n2. Liquid: Definite volume, no definite shape\n3. Gas: No definite shape or volume\n4. Plasma: Ionized gas (found in stars)\n\nChanges of state:\n- Melting (solid → liquid)\n- Freezing (liquid → solid)\n- Evaporation (liquid → gas)\n- Condensation (gas → liquid)\n- Sublimation (solid → gas)\n- Deposition (gas → solid)\n\nWhat specific aspect of matter would you like to explore?";
      }
      return "Science is fascinating! I can help with physics, chemistry, biology, and more. What specific topic would you like to explore?";
    }
    
    if (subject === 'english') {
      if (lowerInput.includes('metaphor') || lowerInput.includes('figure of speech')) {
        return "A metaphor is a figure of speech that directly compares two unrelated subjects by stating one is the other. Examples:\n\n1. 'Time is money' - Suggests time is as valuable as money\n2. 'Life is a journey' - Compares life experiences to travel\n3. 'Her voice is music to my ears' - Her voice is as pleasant as music\n\nUnlike similes, metaphors don't use 'like' or 'as'. They create vivid imagery and deeper meaning. Would you like to analyze some examples from literature?";
      }
      if (lowerInput.includes('essay') || lowerInput.includes('write')) {
        return "A good essay has three parts:\n\n1. Introduction:\n   - Hook to grab attention\n   - Background information\n   - Clear thesis statement\n\n2. Body paragraphs:\n   - Topic sentence\n   - Supporting evidence/examples\n   - Analysis and explanation\n   - Transition to next paragraph\n\n3. Conclusion:\n   - Restate thesis\n   - Summarize main points\n   - Closing thought\n\nStart with an outline to organize your thoughts. What topic are you writing about?";
      }
      if (lowerInput.includes('tenses')) {
        return "English has three main tenses with four forms each:\n\n1. Present: Simple, Continuous, Perfect, Perfect Continuous\n2. Past: Simple, Continuous, Perfect, Perfect Continuous\n3. Future: Simple, Continuous, Perfect, Perfect Continuous\n\nExamples:\n- Simple Present: I work\n- Present Continuous: I am working\n- Present Perfect: I have worked\n- Present Perfect Continuous: I have been working\n\nEach tense conveys different time relationships and aspects of actions. Would you like practice exercises?";
      }
      if (lowerInput.includes('literature')) {
        return "Literature is written work valued for its artistic merit. Types include:\n\n1. Poetry: Expresses emotions and ideas through rhythm and imagery\n2. Prose: Ordinary language without metrical structure\n3. Drama: Written to be performed\n4. Fiction: Imaginative narratives\n\nLiterary elements:\n- Theme: Central idea or message\n- Character: People in the story\n- Plot: Sequence of events\n- Setting: Time and place\n- Point of view: Perspective from which story is told\n\nWhat specific literary work or concept would you like to discuss?";
      }
      return "I can help with grammar, literature analysis, creative writing, and more! What aspect of English would you like assistance with?";
    }
    
    if (subject === 'social') {
      if (lowerInput.includes('constitution') || lowerInput.includes('india')) {
        return "The Indian Constitution came into effect on January 26, 1950. Key features:\n\n1. Lengthiest written constitution (448 articles originally)\n2. Federal system with unitary bias\n3. Parliamentary form of government\n4. Fundamental Rights (Articles 12-35)\n5. Directive Principles of State Policy (Articles 36-51)\n6. Fundamental Duties (Article 51A)\n\nIt establishes India as a sovereign, socialist, secular, democratic republic. Which aspect would you like to know more about?";
      }
      if (lowerInput.includes('industrial') || lowerInput.includes('revolution')) {
        return "The Industrial Revolution (1760-1840) transformed economies from agricultural to manufacturing:\n\nCauses:\n1. Agricultural improvements\n2. Population growth\n3. Capital accumulation\n4. Technological innovations\n\nEffects:\n1. Urbanization\n2. Factory system\n3. Social changes\n4. Global impact\n\nKey inventions: Steam engine, spinning jenny, power loom. What specific impact interests you?";
      }
      if (lowerInput.includes('resources')) {
        return "Natural resources are materials from the environment used to satisfy human needs:\n\nClassification:\n1. Renewable: Solar, wind, forests, water\n2. Non-renewable: Minerals, fossil fuels\n3. Potential: Not yet utilized (e.g., tidal energy)\n4. Developed: Currently used (e.g., coal, iron ore)\n5. Stock: Present but not usable due to lack of technology\n\nSustainable development ensures resources for future generations. Would you like examples of resource conservation?";
      }
      if (lowerInput.includes('democracy')) {
        return "Democracy is a form of government where power is vested in the people. Features of Indian democracy:\n\n1. Representative democracy: People elect representatives\n2. Universal adult franchise: All citizens above 18 can vote\n3. Rule of law: Equal treatment under law\n4. Independent judiciary: Separation of powers\n5. Fundamental rights: Protection of individual liberties\n\nChallenges: Corruption, inequality, communalism, regionalism\n\nWhat specific aspect of democracy would you like to explore?";
      }
      return "Social studies covers history, geography, economics, and civics. What topic would you like to explore?";
    }
    
    // Quiz initiation
    if (lowerInput.includes('quiz') || lowerInput.includes('test') || lowerInput.includes('challenge')) {
      return "I can create a personalized quiz for you! Just tell me which subject and topic you'd like to test your knowledge on. For example, say 'Math quiz on algebra' or 'Science quiz on photosynthesis'.";
    }
    
    // Study plan suggestion
    if (lowerInput.includes('study') || lowerInput.includes('plan') || lowerInput.includes('schedule')) {
      return "I can help create a personalized study plan! Tell me:\n1. Which subjects you're studying\n2. Your target exams (board exams, competitive exams, etc.)\n3. Your available study time per day\n4. Your current strengths and weaknesses\n\nWith this information, I can suggest an effective study schedule.";
    }
    
    // General responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello there! I'm Dronacharya 2.0, your AI mentor powered by NCERT/CBSE curriculum. I can help with Mathematics, Science, English, and Social Studies for classes 6-12. Which subject would you like to focus on today?";
    }
    
    if (lowerInput.includes('thank')) {
      return "You're welcome! I'm here to help you succeed academically. Is there anything else I can assist you with? Remember, consistent practice and curiosity are keys to academic success!";
    }
    
    return "I'm Dronacharya 2.0, your AI mentor trained on NCERT/CBSE curriculum for classes 6-12. I can help with:\n\n📚 Mathematics (Algebra, Geometry, Trigonometry, Calculus)\n🔬 Science (Physics, Chemistry, Biology)\n📖 English (Grammar, Literature, Writing)\n🌍 Social Studies (History, Geography, Civics, Economics)\n\nWhat specific topic or question would you like help with today?";
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    
    const subject = subjects.find(s => s.id === subjectId);
    const aiResponse: Message = {
      id: Date.now().toString(),
      text: `Great! I'll focus on ${subject?.name}. I can help with topics like: ${subject?.topics.slice(0, 5).join(', ')} and more. What specific concept would you like to explore?`,
      sender: 'ai',
      timestamp: new Date(),
      subject: subjectId
    };
    
    setMessages(prev => [...prev, aiResponse]);
  };

  const startQuiz = (subject: string, topic: string) => {
    setQuizMode(true);
    setQuizScore(0);
    setTotalQuizQuestions(5);
    
    // Generate a sample quiz question based on subject and topic
    const sampleQuestions: Record<string, QuizQuestion[]> = {
      math: [
        {
          id: '1',
          question: "What is the value of x in the equation 2x + 5 = 15?",
          options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 20'],
          correctAnswer: 'x = 5',
          explanation: "Subtract 5 from both sides: 2x = 10. Then divide by 2: x = 5.",
          difficulty: 'easy'
        },
        {
          id: '2',
          question: "What is the derivative of x²?",
          options: ['2x', 'x', '2x²', 'x³/3'],
          correctAnswer: '2x',
          explanation: "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x²) = 2x.",
          difficulty: 'medium'
        }
      ],
      science: [
        {
          id: '1',
          question: "Which gas is released during photosynthesis?",
          options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
          correctAnswer: 'Oxygen',
          explanation: "During photosynthesis, plants use carbon dioxide and water in the presence of sunlight to produce glucose and oxygen. Oxygen is released as a byproduct.",
          difficulty: 'easy'
        },
        {
          id: '2',
          question: "What is the chemical formula for water?",
          options: ['H2O', 'CO2', 'NaCl', 'O2'],
          correctAnswer: 'H2O',
          explanation: "Water consists of two hydrogen atoms and one oxygen atom, hence H2O.",
          difficulty: 'easy'
        }
      ],
      english: [
        {
          id: '1',
          question: "Which tense is used in the sentence: 'She is reading a book'?",
          options: ['Present Simple', 'Present Continuous', 'Past Perfect', 'Future Simple'],
          correctAnswer: 'Present Continuous',
          explanation: "The present continuous tense is formed with 'is/am/are + verb-ing'. 'She is reading' indicates an action happening now.",
          difficulty: 'medium'
        }
      ],
      social: [
        {
          id: '1',
          question: "When did the Indian Constitution come into effect?",
          options: ['January 26, 1950', 'August 15, 1947', 'November 26, 1949', 'October 2, 1950'],
          correctAnswer: 'January 26, 1950',
          explanation: "The Indian Constitution was adopted on November 26, 1949, and came into effect on January 26, 1950, which is celebrated as Republic Day.",
          difficulty: 'easy'
        }
      ]
    };
    
    const questions = sampleQuestions[subject as keyof typeof sampleQuestions] || sampleQuestions.math;
    setCurrentQuiz(questions[0]);
    
    const aiResponse: Message = {
      id: Date.now().toString(),
      text: `Starting quiz on ${topic}! Here's your first question:\n\n${questions[0].question}\n\nOptions:\n${questions[0].options.map((opt, i) => `${i+1}. ${opt}`).join('\n')}`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'quiz'
    };
    
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleQuizAnswer = (answer: string) => {
    if (!currentQuiz) return;
    
    // Add user's answer
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `My answer: ${answer}`,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Check if answer is correct
    const isCorrect = answer === currentQuiz.correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    // Provide explanation
    setTimeout(() => {
      const explanationMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}

Explanation: ${currentQuiz.explanation}

${isCorrect ? 'Great job!' : 'Keep practicing!'}`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'response'
      };
      
      setMessages(prev => [...prev, explanationMessage]);
      
      // End quiz or continue to next question
      setTimeout(() => {
        const endMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `Quiz completed! Your score: ${quizScore + (isCorrect ? 1 : 0)}/${totalQuizQuestions}\n\nWould you like to try another quiz or explore a different topic?`,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, endMessage]);
        setQuizMode(false);
        setCurrentQuiz(null);
      }, 2000);
    }, 1000);
  };

  const generateStudyPlan = (subject: string, topics: string[], duration: string) => {
    setStudyPlanMode(true);
    
    const samplePlans: Record<string, StudyPlan> = {
      math: {
        id: '1',
        title: 'Mathematics Study Plan',
        description: 'A comprehensive plan to master key mathematical concepts',
        duration: '4 weeks',
        topics: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus Basics'],
        resources: ['NCERT Textbook', 'RD Sharma', 'Online Video Lectures', 'Practice Worksheets']
      },
      science: {
        id: '2',
        title: 'Science Mastery Plan',
        description: 'Build strong foundation in Physics, Chemistry, and Biology',
        duration: '6 weeks',
        topics: ['Matter', 'Motion', 'Chemical Reactions', 'Cell Structure', 'Ecosystems'],
        resources: ['NCERT Textbook', 'Science Lab Manual', 'Educational Apps', 'Model Papers']
      }
    };
    
    const plan = samplePlans[subject] || samplePlans.math;
    setCurrentStudyPlan(plan);
    
    const aiResponse: Message = {
      id: Date.now().toString(),
      text: `Here's your personalized study plan for ${subject}:\n\n🎯 Title: ${plan.title}\n📝 Description: ${plan.description}\n⏱️ Duration: ${plan.duration}\n\n📚 Topics to Cover:\n${plan.topics.map(topic => `• ${topic}`).join('\n')}\n\n📖 Recommended Resources:\n${plan.resources.map(resource => `• ${resource}`).join('\n')}\n\nWould you like me to break this down into a weekly schedule?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'study-plan'
    };
    
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (quizMode && currentQuiz) {
        // Handle quiz answer submission
        handleQuizAnswer(inputText);
        setInputText('');
      } else {
        handleSend();
      }
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 z-40 w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transition-all border-4 border-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full animate-ping opacity-20"></div>
        <MessageCircle className="h-6 w-6 text-white relative z-10" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          AI
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col border-4 border-purple-400"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Dronacharya 2.0 AI Mentor</h2>
                    <p className="text-purple-200 text-sm">NCERT/CBSE Curriculum for Classes 6-12</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                {!selectedSubject && messages.length === 1 && (
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-b">
                    <h3 className="font-bold text-gray-800 mb-3">Select a Subject to Get Started:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {subjects.map((subject) => {
                        const Icon = subject.icon;
                        return (
                          <motion.button
                            key={subject.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSubjectSelect(subject.id)}
                            className={`${subject.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-md hover:shadow-lg transition-all`}
                          >
                            <Icon className="h-8 w-8" />
                            <span className="font-semibold">{subject.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                        <Lightbulb className="h-5 w-5" />
                        Pro Tip
                      </h4>
                      <p className="text-blue-700 text-sm">
                        Ask me to create a study plan, generate practice quizzes, or explain complex concepts 
                        with real-world examples aligned to NCERT/CBSE curriculum.
                      </p>
                    </div>
                  </div>
                )}
                
                {quizMode && currentQuiz && (
                  <div className="p-4 bg-amber-50 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-amber-800">Quiz Mode</h3>
                      <div className="text-sm font-medium text-amber-700">
                        Question 1 of 1
                      </div>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                )}
                
                {studyPlanMode && currentStudyPlan && (
                  <div className="p-4 bg-green-50 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-green-800">Study Plan Mode</h3>
                      <div className="text-sm font-medium text-green-700">
                        Personalized Plan
                      </div>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none shadow-md border'
                        }`}
                      >
                        {message.subject && message.sender === 'ai' && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${
                              message.subject === 'math' ? 'bg-blue-500' :
                              message.subject === 'science' ? 'bg-green-500' :
                              message.subject === 'english' ? 'bg-purple-500' :
                              'bg-amber-500'
                            }`}></div>
                            <span className="text-xs font-semibold">
                              {subjects.find(s => s.id === message.subject)?.name}
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-md border p-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={quizMode ? "Enter your answer..." : "Ask Dronacharya anything..."}
                      className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={quizMode && !currentQuiz}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={quizMode && currentQuiz ? () => handleQuizAnswer(inputText) : handleSend}
                      disabled={(quizMode && !currentQuiz) || inputText.trim() === ''}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full p-3 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => startQuiz(selectedSubject || 'math', 'General')}
                      className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full hover:bg-amber-200"
                    >
                      🧠 Quick Quiz
                    </button>
                    <button
                      onClick={() => generateStudyPlan(selectedSubject || 'math', [], '4 weeks')}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full hover:bg-green-200"
                    >
                      📅 Study Plan
                    </button>
                    <button
                      onClick={() => {
                        const aiResponse: Message = {
                          id: Date.now().toString(),
                          text: "I can help you with:\n\n1. 📚 Subject explanations (Math, Science, English, Social Studies)\n2. 🧠 Practice quizzes on any topic\n3. 📅 Personalized study plans\n4. 📊 Performance analysis\n5. 🎯 Exam preparation strategies\n\nWhat would you like to focus on today?",
                          sender: 'ai',
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, aiResponse]);
                      }}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
                    >
                      💡 Help
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Dronacharya 2.0 AI can make mistakes. Verify important information with your textbooks.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMentorChat;