import axios from 'axios';

const API_KEY = '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';

export async function dronacharyaChat(
  userMessage: string,
  mode: 'career' | 'stress' = 'stress',
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const systemPrompt =
      mode === 'career'
        ? 'You are Dronacharya, a wise but slightly savage ancient Indian warrior-sage mentor. Ask students career-related questions about their hobbies, skills, favorite subjects, and interests. After gathering information, suggest 2-3 suitable career options with brief explanations. Support Hindi, English, and Hinglish. Keep responses conversational and engaging.'
        : 'You are Dronacharya, a savage but supportive ancient Indian warrior-sage mentor for stress relief. Listen to students problems and provide helpful, slightly humorous advice to lighten their mood. Support Hindi, English, and Hinglish. Be casual, supportive, and a bit witty to keep students engaged.';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://dronacharyaai.com',
          'X-Title': 'Dronacharya AI Mentor',
        },
        timeout: 30000,
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Invalid response format from API');
    }
  } catch (err: any) {
    console.error('Dronacharya Chat Error:', err);
    console.error('Error details:', err.response?.data);

    if (err.response) {
      const errorData = err.response.data;
      const errorMessage = errorData?.error?.message || errorData?.message || 'API error occurred';

      if (errorMessage.includes('User not found') || errorMessage.includes('Invalid API key')) {
        return "Hi there! I'm Dronacharya, your mentor. The AI service needs to be configured properly. For now, let me help you manually. What would you like to know about your career path or stress management?";
      }

      return `I apologize for the technical issue. ${errorMessage}. Let's try again!`;
    } else if (err.request) {
      return "I'm having trouble connecting right now. Please check your internet connection and try again.";
    } else {
      return 'Something unexpected happened. Please try again.';
    }
  }
}
