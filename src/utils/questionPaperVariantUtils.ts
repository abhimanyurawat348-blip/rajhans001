import { GeneratedQuestionPaper, Question } from '../types';

/**
 * Generate variants of a question paper by randomizing values and wording
 * @param paper The base question paper
 * @param numberOfVariants Number of variants to generate
 * @returns Array of variant papers
 */
export const generatePaperVariants = (
  paper: GeneratedQuestionPaper,
  numberOfVariants: number
): GeneratedQuestionPaper[] => {
  const variants: GeneratedQuestionPaper[] = [];
  
  for (let i = 1; i <= numberOfVariants; i++) {
    const variant: GeneratedQuestionPaper = {
      ...paper,
      id: `${paper.id}-variant-${i}`,
      variant: i,
      title: `${paper.title} - Variant ${i}`,
      questions: randomizeQuestions(paper.questions, i)
    };
    
    variants.push(variant);
  }
  
  return variants;
};

/**
 * Randomize questions for a variant
 * @param questions Base questions
 * @param seed Randomization seed
 * @returns Randomized questions
 */
const randomizeQuestions = (questions: Question[], seed: number): Question[] => {
  return questions.map((question, index) => {
    // Create a copy of the question
    const randomizedQuestion: Question = { ...question };
    
    // Randomize numeric values in the question text
    randomizedQuestion.text = randomizeNumericValues(question.text, seed + index);
    
    // For MCQs, shuffle options
    if (question.options && question.options.length > 0) {
      randomizedQuestion.options = shuffleArray([...question.options], seed + index);
      
      // Update correct answer if it's an index-based answer
      if (question.correct_answer && /^\d+$/.test(question.correct_answer)) {
        const originalIndex = parseInt(question.correct_answer);
        const newIndex = question.options.indexOf(question.options[originalIndex]);
        randomizedQuestion.correct_answer = newIndex.toString();
      }
    }
    
    // Randomize estimated time (±20%)
    // Create a pseudo-random variation based on seed
    const randomValue = ((seed + index) * 9301 + 49297) % 233280;
    const timeVariation = 0.8 + (randomValue / 233280 * 0.4); // 0.8 to 1.2
    randomizedQuestion.estimated_time = Math.round(question.estimated_time * timeVariation);
    
    return randomizedQuestion;
  });
};

/**
 * Randomize numeric values in text
 * @param text Original text
 * @param seed Randomization seed
 * @returns Text with randomized numeric values
 */
const randomizeNumericValues = (text: string, seed: number): string => {
  // Find all numeric values in the text
  let counter = 0;
  return text.replace(/\b\d+(\.\d+)?\b/g, (match) => {
    const num = parseFloat(match);
    // Create a pseudo-random variation based on seed
    const randomValue = ((seed + counter++) * 9301 + 49297) % 233280;
    // Randomize by ±30%
    const variation = 0.7 + (randomValue / 233280 * 0.6); // 0.7 to 1.3
    return (num * variation).toFixed(2).replace(/\.?0+$/, '');
  });
};

/**
 * Shuffle array using Fisher-Yates algorithm with seed
 * @param array Array to shuffle
 * @param seed Randomization seed
 * @returns Shuffled array
 */
const shuffleArray = <T>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Use seed to determine random index
    const randomValue = ((seed + i) * 9301 + 49297) % 233280;
    const j = Math.floor(randomValue / 233280 * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Paraphrase question text using simple word substitution
 * @param text Original text
 * @param seed Randomization seed
 * @returns Paraphrased text
 */
export const paraphraseQuestionText = (text: string, seed: number): string => {
  // Simple word substitution dictionary
  const substitutions: { [key: string]: string[] } = {
    'calculate': ['compute', 'determine', 'find', 'evaluate'],
    'find': ['determine', 'calculate', 'compute', 'identify'],
    'show': ['demonstrate', 'prove', 'illustrate', 'verify'],
    'explain': ['describe', 'elaborate', 'clarify', 'detail'],
    'solve': ['resolve', 'work out', 'figure out', 'answer'],
    'what': ['which', 'identify', 'determine'],
    'how': ['in what way', 'by what method'],
    'why': ['for what reason', 'what is the cause'],
    'if': ['assuming that', 'given that', 'supposing that'],
    'then': ['therefore', 'thus', 'consequently', 'as a result'],
    'sum': ['total', 'addition', 'aggregate'],
    'product': ['multiplication', 'result'],
    'difference': ['subtraction', 'remainder'],
    'quotient': ['division result', 'result of division'],
    'area': ['surface', 'region', 'space'],
    'volume': ['capacity', 'space', 'amount'],
    'perimeter': ['boundary', 'outline', 'circumference'],
    'angle': ['corner', 'degree', 'inclination'],
    'triangle': ['three-sided figure', 'trilateral'],
    'rectangle': ['four-sided figure', 'quadrilateral'],
    'circle': ['round shape', 'circular figure'],
    'square': ['four-sided equal figure', 'equilateral quadrilateral']
  };
  
  // Split text into words
  const words = text.split(/\b/);
  
  // Apply substitutions
  const paraphrasedWords = words.map((word, index) => {
    const lowerWord = word.toLowerCase();
    if (substitutions[lowerWord]) {
      // Use seed to select substitution
      const randomValue = ((seed + index) * 9301 + 49297) % 233280;
      const substitutionIndex = Math.floor(randomValue / 233280 * substitutions[lowerWord].length);
      const substitution = substitutions[lowerWord][substitutionIndex];
      
      // Preserve original capitalization
      if (word === word.toUpperCase()) {
        return substitution.toUpperCase();
      } else if (word === word.charAt(0).toUpperCase() + word.slice(1)) {
        return substitution.charAt(0).toUpperCase() + substitution.slice(1);
      } else {
        return substitution;
      }
    }
    return word;
  });
  
  return paraphrasedWords.join('');
};

export default {
  generatePaperVariants,
  paraphraseQuestionText
};