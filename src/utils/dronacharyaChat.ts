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
        model: 'google/gemini-2.0-flash-exp:free',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Dronacharya AI Mentor',
        },
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Invalid response format from API');
    }
  } catch (err: any) {
    console.error('Dronacharya Chat Error:', err);

    if (err.response) {
      const errorMessage = err.response.data?.error?.message || 'API error occurred';
      return `I apologize, but I encountered an issue: ${errorMessage}. Please try again in a moment.`;
    } else if (err.request) {
      return "I'm having trouble connecting right now. Please check your internet connection and try again.";
    } else {
      return 'Something unexpected happened. Please try again.';
    }
  }
}
