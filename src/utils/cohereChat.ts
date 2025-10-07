import { CohereClient } from 'cohere-ai';

// Get the API key from environment variables
const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY || '';

let cohere: CohereClient | null = null;

// Initialize Cohere client only if API key is present
if (COHERE_API_KEY) {
  try {
    cohere = new CohereClient({
      token: COHERE_API_KEY,
    });
  } catch (error) {
    console.error('Failed to initialize Cohere client:', error);
  }
}

export async function cohereChat(
  userMessage: string,
  mode: 'career' | 'stress' | 'homework' = 'stress',
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    console.log('Attempting to use Cohere API with key:', COHERE_API_KEY ? 'Key present' : 'Key missing');
    
    if (!COHERE_API_KEY) {
      throw new Error('API key not configured');
    }

    if (!cohere) {
      throw new Error('Cohere client not initialized');
    }

    // Create system prompt based on mode
    let systemPrompt = '';
    switch (mode) {
      case 'career':
        systemPrompt = 'You are Dronacharya, a wise but slightly savage ancient Indian warrior-sage mentor. Ask students career-related questions about their hobbies, skills, favorite subjects, and interests. After gathering information, suggest 2-3 suitable career options with brief explanations. Support Hindi, English, and Hinglish. Keep responses conversational and engaging. Keep responses under 250 words.';
        break;
      case 'stress':
        systemPrompt = 'You are Dronacharya, a savage but supportive ancient Indian warrior-sage mentor for stress relief. Listen to students problems and provide helpful, slightly humorous advice to lighten their mood. Support Hindi, English, and Hinglish. Be casual, supportive, and a bit witty to keep students engaged. Keep responses under 250 words.';
        break;
      case 'homework':
        systemPrompt = 'You are Dronacharya, a wise teacher helping a student with their homework. Provide a clear, educational response that guides them to understand the concept rather than just giving the answer. Support Hindi, English, and Hinglish. Keep it encouraging and educational. Keep responses under 250 words.';
        break;
      default:
        systemPrompt = 'You are Dronacharya, a helpful educational assistant. Provide concise, accurate, and supportive responses to students. Keep responses under 250 words.';
    }

    // Format conversation history for Cohere
    const chatHistory = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'CHATBOT' as const : 'USER' as const,
      message: msg.content,
    }));

    console.log('Making request to Cohere API with message:', userMessage);
    console.log('System prompt:', systemPrompt);
    console.log('Chat history length:', chatHistory.length);

    // Make the API call to Cohere
    const response = await cohere.chat({
      message: userMessage,
      preamble: systemPrompt,
      chatHistory: chatHistory,
      model: 'command-r-plus', // Using Cohere's latest model
      temperature: 0.7,
      maxTokens: 500,
    });

    const aiResponse = response.text?.trim() || '';

    console.log('Full API response:', aiResponse);

    if (!aiResponse) {
      throw new Error('Empty response from Cohere API');
    }

    return aiResponse;

  } catch (err: any) {
    console.error('Cohere Chat Error:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    
    // For Cohere API errors
    if (err.message && typeof err.message === 'string') {
      console.error('Error details:', err.message);
    }
    
    console.error('Stack trace:', err.stack);

    // More specific error handling
    if (err.message && (err.message.includes('invalid_api_key') || err.message.includes('API key'))) {
      return "Dronacharya AI needs a valid API key. Please contact support.";
    }

    if (err.message === 'API key not configured' || err.message === 'Cohere client not initialized') {
      return "Dronacharya AI is not yet configured. Please check the API key configuration.";
    }

    // Handle network errors
    if (err.message && (err.message.includes('network') || err.message.includes('fetch') || err.message.includes('connection'))) {
      return "Having trouble connecting to the AI service. Please check your internet connection and try again.";
    }

    // Return fallback responses based on mode
    switch (mode) {
      case 'career':
        return generateCareerResponse(userMessage, conversationHistory);
      case 'stress':
        return generateStressResponse(userMessage);
      case 'homework':
        return generateHomeworkResponse(userMessage);
      default:
        return "I'm having trouble connecting to the AI right now. Please try again later.";
    }
  }
}

// Fallback response generators
function generateCareerResponse(userMessage: string, conversationHistory: Array<{ role: string; content: string }>): string {
  const responses = [
    "I'd love to help you find the perfect career path! Tell me about your interests, hobbies, and favorite subjects at school.",
    "Career guidance is important! What subjects do you enjoy the most? Are you more interested in science, arts, or commerce?",
    "Based on what you've shared, here are some career options to consider: 1) Software Developer - for those who enjoy technology and problem-solving, 2) Data Analyst - for those who like working with numbers and insights, 3) UX Designer - for those who are creative and enjoy understanding user needs.",
    "Great question! Based on your interests in technology and problem-solving, I'd suggest considering careers in software development, data science, or cybersecurity. Each offers excellent growth opportunities and aligns with your strengths.",
  ];
  
  // Simple logic to rotate responses based on conversation length
  const index = conversationHistory.length % responses.length;
  return responses[index];
}

function generateStressResponse(userMessage: string): string {
  const responses = [
    "I understand exams and studies can be stressful. Remember, consistency is more important than perfection. Take breaks, stay hydrated, and maintain a balanced routine.",
    "Feeling stressed is normal! Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7, exhale for 8. It helps calm your mind.",
    "Don't let stress overwhelm you! Break your tasks into smaller chunks and celebrate small wins. You're doing better than you think!",
    "Stress is just your mind's way of telling you it cares! Channel that energy into focused study sessions and reward yourself afterward.",
  ];
  
  // Simple random selection
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

function generateHomeworkResponse(userMessage: string): string {
  const responses = [
    "I can help you understand your homework better! Try explaining the problem in your own words first, then break it down into smaller steps.",
    "For homework help, I recommend starting with what you know and identifying exactly what you're stuck on. That makes it easier to find the right approach.",
    "Great homework question! Remember to show your work and check each step. Learning the process is more important than just getting the right answer.",
    "When tackling homework, try the Pomodoro Technique: 25 minutes focused work, then a 5-minute break. It helps maintain concentration!",
  ];
  
  // Simple random selection
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}