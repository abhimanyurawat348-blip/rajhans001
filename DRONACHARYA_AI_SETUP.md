# Dronacharya AI Setup Guide

## Overview
Dronacharya AI is an educational AI assistant integrated into the RHPS Public School Portal. It provides three specialized modes:
1. Career Guidance
2. Stress Relief
3. Homework Help

The AI is powered by the Groq API using the Mixtral-8x7b-32768 model.

## Prerequisites
1. A Groq API key (free to obtain)
2. Node.js and npm installed
3. This project repository

## Setup Instructions

### Step 1: Get Your Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (you'll need it in Step 2)

### Step 2: Configure Environment Variables
The application requires an environment variable `VITE_AI_KEY` to be set with your Groq API key.

If you don't already have a `.env` file in the project root, create one with the following content:

```
VITE_AI_KEY=your_actual_groq_api_key_here
```

Replace `your_actual_groq_api_key_here` with your actual Groq API key.

### Step 3: Install Dependencies
If you haven't already installed the project dependencies:

```bash
npm install
```

### Step 4: Start the Development Server
```bash
npm run dev
```

## Troubleshooting

### Issue: Dronacharya AI shows "API key not configured"
**Solution**: Make sure you have created a `.env` file in the project root with your Groq API key:
```
VITE_AI_KEY=your_actual_groq_api_key_here
```

### Issue: Dronacharya AI shows static responses instead of AI-generated ones
**Solution**: This happens when the API key is invalid or there's a network issue. Check:
1. That your API key is correct in the `.env` file
2. That you have internet connectivity
3. That your Groq account is in good standing

### Issue: Rate limiting messages
**Solution**: The free tier of Groq has rate limits. If you see "Dronacharya AI is resting. Please try again in a moment," wait a minute and try again.

## How It Works
The Dronacharya AI system uses:
- **Groq API** for fast inference
- **Mixtral-8x7b-32768** model for high-quality responses
- **Three specialized modes** with different system prompts
- **Fallback responses** when API is unavailable

## Security Notes
- The API key is stored in `.env` which should never be committed to version control
- The key is only accessible during build time and is not exposed to the client
- All API communication happens server-side through the Vite build process

## Customization
You can modify the AI behavior by editing the system prompts in [src/utils/dronacharyaChat.ts](file:///c:/Users/Ankush/OneDrive/Desktop/AYUSH%20FOLDER/rajhans001/src/utils/dronacharyaChat.ts):
- Career guidance prompt (line 17-18)
- Stress relief prompt (line 19-20)

## Support
If you continue to experience issues:
1. Check that your API key is valid and active in the Groq console
2. Ensure you haven't exceeded rate limits
3. Check the browser console for error messages
4. Verify your internet connection