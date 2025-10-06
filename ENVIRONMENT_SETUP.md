# Environment Setup Guide

## Overview
This guide explains how to set up the development environment for the school management system, including API keys and security configurations.

## Environment Variables
The system uses environment variables to securely store API keys and configuration settings. These are stored in the `.env` file at the root of the project.

### Required Environment Variables

```env
# Dronacharya AI Configuration
# Get your API key from https://aistudio.google.com/
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyB4Lcm36gvIon6hM93f_O4vBFubDe7PB5U
VITE_FIREBASE_AUTH_DOMAIN=rajhans001-fa156.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rajhans001-fa156
VITE_FIREBASE_STORAGE_BUCKET=rajhans001-fa156.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=372023550449
VITE_FIREBASE_APP_ID=1:372023550449:web:4410d181e6315ed9976450
VITE_FIREBASE_MEASUREMENT_ID=G-Y2YY37ET32
```

## Security Best Practices

### API Key Protection
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Restrict API key usage by domain/IP when possible

### Firebase Security
- Implement Firestore security rules to control data access
- Use Firebase Authentication for user management
- Enable email/password authentication only
- Regularly audit security rules

## Setup Process

### 1. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **rajhans001-fa156**
3. Click on the gear icon (Settings) → Project Settings
4. Copy the configuration values to your `.env` file

### 2. Google AI Configuration
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the key to your `.env` file

### 3. Development Server
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access the application at `http://localhost:5173`

## Production Deployment
- Ensure all environment variables are set in the production environment
- Never expose `.env` files in public repositories
- Use CI/CD pipelines to manage environment variables securely
- Test all functionality after deployment

## Troubleshooting
- If API calls fail, verify your API keys are correct
- If Firebase connections fail, check your configuration values
- For authentication issues, ensure Firebase Auth is enabled