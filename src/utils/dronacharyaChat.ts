import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_AI_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function dronacharyaChat(
  userMessage: string,
  mode: 'career' | 'stress' = 'stress',
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('API key not configured');
    }

    const systemPrompt =
      mode === 'career'
        ? 'You are Dronacharya, a wise but slightly savage ancient Indian warrior-sage mentor. Ask students career-related questions about their hobbies, skills, favorite subjects, and interests. After gathering information, suggest 2-3 suitable career options with brief explanations. Support Hindi, English, and Hinglish. Keep responses conversational and engaging. Keep responses under 250 words.'
        : 'You are Dronacharya, a savage but supportive ancient Indian warrior-sage mentor for stress relief. Listen to students problems and provide helpful, slightly humorous advice to lighten their mood. Support Hindi, English, and Hinglish. Be casual, supportive, and a bit witty to keep students engaged. Keep responses under 250 words.';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.95,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    const aiResponse = response.data?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      throw new Error('Invalid response format from API');
    }

    return aiResponse;

  } catch (err: any) {
    console.error('Dronacharya Chat Error:', err);
    console.error('Error details:', err.response?.data);

    if (err.response?.status === 429) {
      return "Dronacharya AI is resting. Please try again in a moment.";
    }

    if (err.response?.status === 401) {
      return "Dronacharya AI needs to be configured. Please contact support.";
    }

    if (err.message === 'API key not configured') {
      return "Dronacharya AI is not yet configured. Please try again later.";
    }

    if (mode === 'career') {
      return generateCareerResponse(userMessage, conversationHistory);
    } else {
      return generateStressResponse(userMessage);
    }
  }
}

function generateCareerResponse(userMessage: string, conversationHistory: Array<{ role: string; content: string }>): string {
  const questionCount = conversationHistory.filter(msg => msg.role === 'user').length;

  const lowerMsg = userMessage.toLowerCase();

  if (questionCount === 0 || lowerMsg.length < 3) {
    return "Excellent! History is a fascinating subject. It teaches us about the past and helps us understand the present. Tell me, what aspects of history interest you the most? Ancient civilizations, wars, cultural developments, or political movements?";
  }

  if (questionCount === 1) {
    return "That's great to know! Besides history, what are some of your hobbies or activities you enjoy in your free time? Do you like reading, writing, debating, or maybe creative arts?";
  }

  if (questionCount === 2) {
    return "Interesting! And what are your strengths? Are you good at research, public speaking, critical thinking, or maybe you have strong analytical skills?";
  }

  if (questionCount >= 3) {
    return `Based on our conversation, here are some career paths that might suit you:

1. **Historian/Researcher** - Your interest in history makes this a natural fit. You can work in universities, museums, or research institutions, studying and preserving historical knowledge.

2. **Teacher/Professor** - Share your passion for history by educating the next generation. You can teach at schools or colleges and inspire students.

3. **Museum Curator/Archaeologist** - Combine your love for history with hands-on work, managing collections or discovering historical artifacts.

Each of these paths offers unique opportunities to work with what you love. Would you like to know more about any of these options?`;
  }

  return "That's helpful to know! Tell me more about your interests and goals.";
}

function generateStressResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('stress') || lowerMsg.includes('anxious') || lowerMsg.includes('worried')) {
    return "Hey, I hear you! Stress is like that unwanted guest who shows up uninvited. But remember, even the mighty warriors needed rest between battles. Take a deep breath. What's specifically bothering you right now? Let's tackle it together!";
  }

  if (lowerMsg.includes('exam') || lowerMsg.includes('test') || lowerMsg.includes('study')) {
    return "Ah, exams! The ultimate test of patience, not just knowledge. Listen, you've prepared for this. Break it down - small chunks, regular breaks. And remember, one exam doesn't define your worth. You're more than a grade sheet! What subject is giving you trouble?";
  }

  if (lowerMsg.includes('friend') || lowerMsg.includes('relationship') || lowerMsg.includes('lonely')) {
    return "Relationships can be tricky, I get it. Even in the Mahabharata, we had our share of drama! Remember, true friends accept you as you are. Focus on those who lift you up. And hey, sometimes being alone helps you grow stronger. What's going on?";
  }

  if (lowerMsg.includes('parent') || lowerMsg.includes('family')) {
    return "Family dynamics, huh? Classic! Parents mean well, even when it feels like they're from another planet. Try talking to them calmly about how you feel. They might surprise you! And remember, they're learning too. What's the situation?";
  }

  if (lowerMsg.includes('future') || lowerMsg.includes('career') || lowerMsg.includes('confused')) {
    return "Feeling confused about the future is totally normal! Even Arjuna had his moment of doubt before the big battle. The key is taking one step at a time. You don't need to have it all figured out right now. What's making you feel uncertain?";
  }

  return "I'm here to listen! Life can be overwhelming sometimes, but remember - you're stronger than you think. Tell me more about what's on your mind, and let's work through it together. Whether it's in Hindi, English, or Hinglish, I'm all ears!";
}
