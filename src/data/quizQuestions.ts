import { QuizQuestion } from '../types/quiz';

export const quizData: { [key: string]: { [key: string]: QuizQuestion[] } } = {
  '9': {
    'Maths': [
      {
        id: '9m1',
        question: 'What is the value of √144?',
        options: ['10', '11', '12', '13'],
        correctAnswer: 2
      },
      {
        id: '9m2',
        question: 'If x + 5 = 12, what is x?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2
      },
      {
        id: '9m3',
        question: 'What is the area of a circle with radius 7 cm? (Use π = 22/7)',
        options: ['144 cm²', '154 cm²', '164 cm²', '174 cm²'],
        correctAnswer: 1
      },
      {
        id: '9m4',
        question: 'What is the sum of angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correctAnswer: 1
      },
      {
        id: '9m5',
        question: 'If 2x + 3 = 11, what is x?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 2
      },
      {
        id: '9m6',
        question: 'What is 15% of 200?',
        options: ['20', '25', '30', '35'],
        correctAnswer: 2
      },
      {
        id: '9m7',
        question: 'What is the perimeter of a square with side 8 cm?',
        options: ['24 cm', '32 cm', '40 cm', '48 cm'],
        correctAnswer: 1
      },
      {
        id: '9m8',
        question: 'Which of the following is a prime number?',
        options: ['15', '17', '18', '21'],
        correctAnswer: 1
      },
      {
        id: '9m9',
        question: 'What is 7³?',
        options: ['243', '343', '443', '543'],
        correctAnswer: 1
      },
      {
        id: '9m10',
        question: 'What is the HCF of 12 and 18?',
        options: ['3', '6', '9', '12'],
        correctAnswer: 1
      }
    ],
    'Science': [
      {
        id: '9s1',
        question: 'What is the SI unit of force?',
        options: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctAnswer: 1
      },
      {
        id: '9s2',
        question: 'Which gas is most abundant in Earth\'s atmosphere?',
        options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 2
      },
      {
        id: '9s3',
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'],
        correctAnswer: 2
      },
      {
        id: '9s4',
        question: 'What is the chemical formula of water?',
        options: ['H₂O', 'CO₂', 'O₂', 'H₂O₂'],
        correctAnswer: 0
      },
      {
        id: '9s5',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1
      },
      {
        id: '9s6',
        question: 'What is the speed of light in vacuum?',
        options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁷ m/s', '3 × 10⁵ m/s'],
        correctAnswer: 0
      },
      {
        id: '9s7',
        question: 'Which acid is found in the stomach?',
        options: ['Sulfuric acid', 'Nitric acid', 'Hydrochloric acid', 'Acetic acid'],
        correctAnswer: 2
      },
      {
        id: '9s8',
        question: 'What is the atomic number of carbon?',
        options: ['4', '6', '8', '12'],
        correctAnswer: 1
      },
      {
        id: '9s9',
        question: 'Which organ pumps blood in the human body?',
        options: ['Liver', 'Kidney', 'Heart', 'Lungs'],
        correctAnswer: 2
      },
      {
        id: '9s10',
        question: 'What type of energy is stored in a battery?',
        options: ['Kinetic', 'Chemical', 'Nuclear', 'Thermal'],
        correctAnswer: 1
      }
    ],
    'SST': [
      {
        id: '9sst1',
        question: 'Who was the first Prime Minister of India?',
        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Dr. Rajendra Prasad'],
        correctAnswer: 1
      },
      {
        id: '9sst2',
        question: 'In which year did India gain independence?',
        options: ['1945', '1946', '1947', '1948'],
        correctAnswer: 2
      },
      {
        id: '9sst3',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Rome'],
        correctAnswer: 2
      },
      {
        id: '9sst4',
        question: 'Which river is known as the Ganga of the South?',
        options: ['Krishna', 'Godavari', 'Kaveri', 'Narmada'],
        correctAnswer: 2
      },
      {
        id: '9sst5',
        question: 'Who wrote the Indian National Anthem?',
        options: ['Rabindranath Tagore', 'Bankim Chandra', 'Sarojini Naidu', 'Subhash Chandra Bose'],
        correctAnswer: 0
      },
      {
        id: '9sst6',
        question: 'Which is the longest river in the world?',
        options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
        correctAnswer: 1
      },
      {
        id: '9sst7',
        question: 'What is the currency of Japan?',
        options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
        correctAnswer: 2
      },
      {
        id: '9sst8',
        question: 'Which Mughal emperor built the Taj Mahal?',
        options: ['Akbar', 'Shah Jahan', 'Aurangzeb', 'Jahangir'],
        correctAnswer: 1
      },
      {
        id: '9sst9',
        question: 'What is the largest continent?',
        options: ['Africa', 'Europe', 'Asia', 'North America'],
        correctAnswer: 2
      },
      {
        id: '9sst10',
        question: 'When did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2
      }
    ]
  },
  '10': {
    'Maths': [
      {
        id: '10m1',
        question: 'What is the discriminant of the quadratic equation ax² + bx + c = 0?',
        options: ['b² + 4ac', 'b² - 4ac', 'b² + 2ac', 'b² - 2ac'],
        correctAnswer: 1
      },
      {
        id: '10m2',
        question: 'What is sin 90°?',
        options: ['0', '1', '√3/2', '1/2'],
        correctAnswer: 1
      },
      {
        id: '10m3',
        question: 'What is the sum of first 10 natural numbers?',
        options: ['45', '50', '55', '60'],
        correctAnswer: 2
      },
      {
        id: '10m4',
        question: 'If the roots of a quadratic equation are equal, what is the discriminant?',
        options: ['-1', '0', '1', '2'],
        correctAnswer: 1
      },
      {
        id: '10m5',
        question: 'What is the value of π (pi) approximately?',
        options: ['3.14', '2.71', '1.61', '4.14'],
        correctAnswer: 0
      },
      {
        id: '10m6',
        question: 'What is tan 45°?',
        options: ['0', '1', '√3', '1/√3'],
        correctAnswer: 1
      },
      {
        id: '10m7',
        question: 'What is the LCM of 12 and 15?',
        options: ['30', '45', '60', '75'],
        correctAnswer: 2
      },
      {
        id: '10m8',
        question: 'What is the volume of a cube with side 5 cm?',
        options: ['100 cm³', '125 cm³', '150 cm³', '175 cm³'],
        correctAnswer: 1
      },
      {
        id: '10m9',
        question: 'In an AP, if a = 2 and d = 3, what is the 5th term?',
        options: ['12', '14', '16', '18'],
        correctAnswer: 1
      },
      {
        id: '10m10',
        question: 'What is cos 0°?',
        options: ['0', '1', '-1', '1/2'],
        correctAnswer: 1
      }
    ],
    'Science': [
      {
        id: '10s1',
        question: 'What is the valency of oxygen?',
        options: ['1', '2', '3', '4'],
        correctAnswer: 1
      },
      {
        id: '10s2',
        question: 'Which metal is liquid at room temperature?',
        options: ['Iron', 'Mercury', 'Gold', 'Silver'],
        correctAnswer: 1
      },
      {
        id: '10s3',
        question: 'What is Ohm\'s Law?',
        options: ['V = IR', 'I = VR', 'R = VI', 'V = I/R'],
        correctAnswer: 0
      },
      {
        id: '10s4',
        question: 'Which gas is used in photosynthesis?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
        correctAnswer: 2
      },
      {
        id: '10s5',
        question: 'What is the chemical formula of common salt?',
        options: ['NaCl', 'KCl', 'CaCl₂', 'MgCl₂'],
        correctAnswer: 0
      },
      {
        id: '10s6',
        question: 'Which lens is used to correct myopia?',
        options: ['Convex', 'Concave', 'Cylindrical', 'Bifocal'],
        correctAnswer: 1
      },
      {
        id: '10s7',
        question: 'What is the main component of natural gas?',
        options: ['Ethane', 'Propane', 'Methane', 'Butane'],
        correctAnswer: 2
      },
      {
        id: '10s8',
        question: 'Which hormone regulates blood sugar?',
        options: ['Thyroxine', 'Insulin', 'Adrenaline', 'Estrogen'],
        correctAnswer: 1
      },
      {
        id: '10s9',
        question: 'What is the unit of electric current?',
        options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
        correctAnswer: 1
      },
      {
        id: '10s10',
        question: 'Which part of the plant conducts photosynthesis?',
        options: ['Root', 'Stem', 'Leaf', 'Flower'],
        correctAnswer: 2
      }
    ],
    'SST': [
      {
        id: '10sst1',
        question: 'Who led the Salt March (Dandi March)?',
        options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Subhash Chandra Bose', 'Bhagat Singh'],
        correctAnswer: 1
      },
      {
        id: '10sst2',
        question: 'When was the Indian Constitution adopted?',
        options: ['15 Aug 1947', '26 Jan 1950', '26 Nov 1949', '15 Aug 1950'],
        correctAnswer: 2
      },
      {
        id: '10sst3',
        question: 'Which country is known as the Land of the Rising Sun?',
        options: ['China', 'Japan', 'Thailand', 'South Korea'],
        correctAnswer: 1
      },
      {
        id: '10sst4',
        question: 'Who was the first President of India?',
        options: ['Jawaharlal Nehru', 'Dr. Rajendra Prasad', 'Sardar Patel', 'Dr. S. Radhakrishnan'],
        correctAnswer: 1
      },
      {
        id: '10sst5',
        question: 'Which is the highest civilian award in India?',
        options: ['Padma Vibhushan', 'Padma Bhushan', 'Bharat Ratna', 'Padma Shri'],
        correctAnswer: 2
      },
      {
        id: '10sst6',
        question: 'Where is the headquarters of the United Nations?',
        options: ['Geneva', 'New York', 'Paris', 'London'],
        correctAnswer: 1
      },
      {
        id: '10sst7',
        question: 'Which mountain range separates Europe and Asia?',
        options: ['Himalayas', 'Alps', 'Ural', 'Andes'],
        correctAnswer: 2
      },
      {
        id: '10sst8',
        question: 'When did the Quit India Movement start?',
        options: ['1940', '1942', '1944', '1946'],
        correctAnswer: 1
      },
      {
        id: '10sst9',
        question: 'What is the financial capital of India?',
        options: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
        correctAnswer: 1
      },
      {
        id: '10sst10',
        question: 'Which ocean is the largest?',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correctAnswer: 3
      }
    ]
  }
};

export const subjects = {
  '9': [
    { name: 'Maths', color: 'from-blue-500 to-blue-600', icon: '📐' },
    { name: 'Science', color: 'from-green-500 to-green-600', icon: '🔬' },
    { name: 'SST', color: 'from-orange-500 to-orange-600', icon: '🌍' }
  ],
  '10': [
    { name: 'Maths', color: 'from-purple-500 to-purple-600', icon: '📊' },
    { name: 'Science', color: 'from-teal-500 to-teal-600', icon: '⚗️' },
    { name: 'SST', color: 'from-red-500 to-red-600', icon: '📚' }
  ]
};
