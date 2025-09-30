import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'demo-gemini-api-key'; // In production, use environment variable

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateMotivationalMessage = async (
  studentName: string,
  activity: string,
  category: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate a short, motivational message (max 30 words) for a student named ${studentName} who just registered for ${activity} in ${category} category. Make it encouraging and inspiring.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating motivational message:', error);
    return `Welcome ${studentName}! You've successfully registered for ${activity} ${category}. Stay consistent and give your best!`;
  }
};