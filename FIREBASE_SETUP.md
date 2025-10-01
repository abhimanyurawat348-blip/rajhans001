# Firebase Configuration Required

To complete the setup of this Student/Staff Portal system, you need to configure Firebase with your project credentials.

## Firebase Project Setup

Your Firebase project ID is: **rajhans001-fa156**

## Required Environment Variables

Add the following Firebase credentials to your `.env` file:

```env
# Your existing Supabase credentials
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Firebase Configuration (ADD THESE)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
```

## How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **rajhans001-fa156**
3. Click on the gear icon (Settings) → Project Settings
4. Scroll down to "Your apps" section
5. If you haven't added a web app yet, click "Add app" and select Web
6. Copy the configuration values:
   - `apiKey` → VITE_FIREBASE_API_KEY
   - `messagingSenderId` → VITE_FIREBASE_MESSAGING_SENDER_ID
   - `appId` → VITE_FIREBASE_APP_ID

## Firebase Services to Enable

Make sure the following Firebase services are enabled in your project:

### 1. Authentication
- Go to Authentication → Sign-in method
- Enable **Email/Password** authentication

### 2. Firestore Database
- Go to Firestore Database
- Create database in production mode (or test mode for development)
- The following collections will be created automatically:
  - `users` - Student account information
  - `loginRecords` - Student login tracking with IP and device info
  - `registrations` - Sports and activity registrations
  - `complaints` - Student complaints
  - `staffNotifications` - Notifications for staff portal
  - `meetings` - Staff meeting schedules
  - `notices` - Notice board posts

### 3. Firestore Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Login records - students can create, staff can read
    match /loginRecords/{recordId} {
      allow create: if request.auth != null;
      allow read: if request.auth.token.email == 'rajhans_001@gmail.com';
    }

    // Registrations - students can create, staff can read/update
    match /registrations/{regId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth.token.email == 'rajhans_001@gmail.com';
    }

    // Complaints - students can create, staff can read/update
    match /complaints/{complaintId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth.token.email == 'rajhans_001@gmail.com';
    }

    // Staff notifications - staff can read/update/delete
    match /staffNotifications/{notifId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth.token.email == 'rajhans_001@gmail.com';
    }

    // Meetings - staff only
    match /meetings/{meetingId} {
      allow read, write: if request.auth.token.email == 'rajhans_001@gmail.com';
    }

    // Notices - staff only
    match /notices/{noticeId} {
      allow read, write: if request.auth.token.email == 'rajhans_001@gmail.com';
    }
  }
}
```

## Staff Portal Credentials

**Email:** rajhans_001@gmail.com
**Password:** abhimanyu0304

These credentials are hardcoded in the system as per your requirements.

## Testing the System

After setting up Firebase credentials:

1. Start the development server: `npm run dev`
2. Navigate to Student Dashboard
3. Create a test student account via Sign Up
4. Login as a student and register for activities
5. Submit a complaint
6. Login to Staff Portal to view notifications, students, registrations, and complaints
7. Test the Meeting and Notice Board features in Staff Portal

## Features Implemented

### Student Portal:
- Flashcard-based dashboard with Sign Up / Login options
- Student signup with Firebase Auth
- Student login with IP address and device tracking
- Registration for sports and activities
- Complaint submission
- Study resources with Class 10 Science and Class 12 Physics/Maths HOTS questions

### Staff Portal:
- Secure login (rajhans_001@gmail.com / abhimanyu0304)
- Real-time notifications for student logins, registrations, and complaints
- View all registered students
- Manage activity registrations
- View and manage complaints
- Meeting scheduler
- Notice board
- IP address and device name tracking for student logins

## Notes

- All student data is securely stored in Firebase Firestore
- Passwords are hashed by Firebase Authentication
- Login tracking includes IP address and device information
- Staff receives real-time notifications for all student activities
- The system uses public CBSE question paper links for study resources
