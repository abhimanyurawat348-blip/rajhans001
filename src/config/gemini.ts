// Gemini API calls must run on a trusted server, never from the browser.
// This module intentionally contains no API key. Keep AI credentials in server-side
// secrets and expose only a narrow, authenticated backend endpoint to the client.

export const generateMotivationalMessage = async (
  studentName: string,
  activity: string,
  category: string
): Promise<string> => {
  return `Welcome ${studentName}! You've successfully registered for ${activity} in ${category}. Stay consistent and give your best!`;
};