// AI provider calls are intentionally not made from the browser.
// Use an authenticated server-side endpoint for Gemini/Cohere so provider
// credentials are never shipped to school users' devices.

export async function dronacharyaChat(
  userMessage: string,
  mode: 'career' | 'stress' = 'stress',
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  return mode === 'career'
    ? generateCareerResponse(userMessage, conversationHistory)
    : generateStressResponse(userMessage);
}

function generateCareerResponse(userMessage: string, conversationHistory: Array<{ role: string; content: string }>): string {
  const questionCount = conversationHistory.filter(msg => msg.role === 'user').length;
  const lowerMsg = userMessage.toLowerCase();

  if (questionCount === 0 || lowerMsg.length < 3) {
    return 'Tell me what subjects, hobbies, or activities you enjoy most. We can use those to explore suitable career areas.';
  }
  if (questionCount === 1) {
    return 'What do you enjoy doing outside school: reading, writing, coding, debating, designing, sports, helping people, or something else?';
  }
  if (questionCount === 2) {
    return 'What are your strongest skills: communication, research, creativity, problem-solving, leadership, or analytical thinking?';
  }
  return 'Based on what you have shared, consider a few career areas that match your interests and strengths. Before choosing one, compare the subjects, qualifications, work style, and opportunities involved.';
}

function generateStressResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('exam') || lowerMsg.includes('test') || lowerMsg.includes('study')) {
    return 'Exams can feel overwhelming. Break your work into small tasks, take regular breaks, and focus on the next useful step rather than the whole syllabus at once.';
  }
  if (lowerMsg.includes('friend') || lowerMsg.includes('relationship') || lowerMsg.includes('lonely')) {
    return 'Feeling left out can be difficult. Try talking to someone you trust and focus on one supportive connection rather than feeling you need to solve everything at once.';
  }
  if (lowerMsg.includes('parent') || lowerMsg.includes('family')) {
    return 'Family situations can be stressful. If it feels safe, choose a calm moment to explain what you are feeling and ask a trusted adult for support.';
  }
  if (lowerMsg.includes('future') || lowerMsg.includes('career') || lowerMsg.includes('confused')) {
    return 'You do not need every future decision figured out now. Pick one small area to explore, learn about it, and adjust as you learn more.';
  }
  return 'I am here to listen. Tell me what is making things difficult, and we can break the problem into smaller, manageable steps.';
}