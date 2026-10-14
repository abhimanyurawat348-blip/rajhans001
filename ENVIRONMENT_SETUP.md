# Environment Setup Guide

## Overview
This guide explains how to configure the school management system without committing credentials or provider secrets to the repository.

## Environment Variables
Copy `.env.example` to `.env` locally. Never commit `.env`.

```env
# Firebase web configuration. These values are required at build time.
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id_here
```

Provider secrets such as Gemini/Cohere API keys must NOT be placed in `VITE_*` variables because Vite exposes those variables to browser code. AI provider credentials must live on a trusted server/backend and be accessed through an authenticated endpoint.

## Security Best Practices
- Never commit credentials, API keys, passwords, tokens, or private student data.
- Treat any credential previously committed to Git as compromised and rotate it.
- Use Firebase Authentication for identity and Firestore rules for authorization.
- Keep Firestore rules default-deny for collections that are not explicitly required.
- Restrict Firebase web API keys by application/domain where supported.
- Deploy and test the repository's `firestore.rules` before production use.
- Add scoped Firebase Storage rules before enabling user uploads in production.

## Setup Process

### 1. Firebase Configuration
1. Open the Firebase Console for the project.
2. Copy the web-app configuration values into your local `.env` file.
3. Enable the authentication methods required by the application.
4. Create/provision staff accounts through Firebase Authentication; do not self-assign staff roles from the client.
5. Deploy `firestore.rules` and verify access with the Firebase Rules simulator/emulator.

### 2. AI Configuration
AI provider credentials must be configured only in the server-side environment of the backend endpoint that calls the provider. Do not expose those credentials through `VITE_*` variables.

### 3. Development Server
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access the application locally using the URL printed by Vite.

## Production Deployment
- Set environment variables through the hosting provider's secret/environment configuration.
- Never expose `.env` files in public repositories.
- Deploy Firestore and Storage rules as part of the release process.
- Enable appropriate authentication protections and monitoring.
- Test authorization as an unprivileged user before launch.

## Troubleshooting
- If Firebase initialization fails, verify all required `VITE_FIREBASE_*` variables exist locally.
- If authentication fails, verify the account exists in Firebase Authentication and its profile has the intended role.
- If a Firestore operation is denied, review the explicit collection rule and the user's role/ownership.
- AI requests should be routed through the secure backend rather than directly from browser code.