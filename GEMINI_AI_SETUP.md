# Google Gemini AI Setup Guide

## Overview
This guide explains how to set up the Google Gemini API as a replacement for the Groq API in the Dronacharya AI system.

## Prerequisites
1. A Google Account
2. Node.js and npm installed
3. This project repository

## Setup Instructions

### Step 1: Get Your Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (you'll need it in Step 2)

### Step 2: Configure Environment Variables
The application requires an environment variable `VITE_GEMINI_API_KEY` to be set with your Google Gemini API key.

Update your `.env` file in the project root with the following content:

```
VITE_GEMINI_API_KEY=your_actual_google_gemini_api_key_here
```

Replace `your_actual_google_gemini_api_key_here` with your actual Google Gemini API key.

### Step 3: Install Dependencies
If you haven't already installed the project dependencies:

```bash
npm install
```

### Step 4: Start the Development Server
```bash
npm run dev
```

## Free Tier Information
Google Gemini API offers a generous free tier:
- Free quota: 60 requests per minute
- No credit card required for the free tier
- Access to Gemini Pro model

## Troubleshooting

### Issue: Dronacharya AI shows "API key not configured"
**Solution**: Make sure you have created a `.env` file in the project root with your Google Gemini API key:
```
VITE_GEMINI_API_KEY=your_actual_google_gemini_api_key_here
```

### Issue: Dronacharya AI shows static responses instead of AI-generated ones
**Solution**: This happens when the API key is invalid or there's a network issue. Check:
1. That your API key is correct in the `.env` file
2. That you have internet connectivity
3. That your Google AI Studio account is in good standing

### Issue: Rate limiting messages
**Solution**: The free tier has rate limits. If you see rate limit errors, wait a moment and try again.

## How It Works
The Dronacharya AI system now uses:
- **Google Gemini API** for AI inference
- **Gemini Pro** model for high-quality responses
- **Three specialized modes** with different system prompts
- **Fallback responses** when API is unavailable

## Security Notes
- The API key is stored in `.env` which should never be committed to version control
- The key is only accessible during build time and is not exposed to the client
- All API communication happens through the Google Generative AI client library

## Customization
You can modify the AI behavior by editing the system prompts in [src/utils/dronacharyaChat.ts](file:///c:/Users/Ankush/OneDrive/Desktop/AYUSH%20FOLDER/rajhans001/src/utils/dronacharyaChat.ts):
- Career guidance prompt (line 17-18)
- Stress relief prompt (line 19-20)

## Support
If you continue to experience issues:
1. Check that your API key is valid and active in the Google AI Studio console
2. Ensure you haven't exceeded rate limits
3. Check the browser console for error messages
4. Verify your internet connection