# RHPS School Management System

## Overview
A comprehensive school management system for RHPS Public School with portals for students, parents, and staff. Built with React, TypeScript, Firebase, and modern web technologies.

## Features

### Student Portal
- Interactive dashboard with flashcards for quick access
- Career guidance and stress relief AI chatbot (Dronacharya)
- Homework management with real-time updates
- Quiz system for self-assessment
- Activity registration and complaint submission
- AI Mentor Chat for personalized academic support
- Gamified Learning Badges and Leaderboard
- Smart Educational Marketplace access

### Parent Portal
- Secure registration with student validation
- Real-time access to child's academic performance
- Attendance tracking and homework monitoring
- Parent-teacher meeting schedules
- Automated Performance Digest reports
- Responsive design for mobile and desktop

### Staff Portal
- Comprehensive student and parent management
- Marksheet upload by class, section, and subject
- Homework tracking and performance monitoring
- Complaint management system
- Meeting scheduler and notice board
- Performance Entry and Analytics dashboard
- Real-time notifications for all activities

### Security & Best Practices
- Firebase Authentication for secure login
- Firestore security rules for data protection
- Environment variables for API key management
- Real-time data synchronization across all portals
- Input validation to prevent unauthorized access

## Mobile App (PWA)
The platform now supports Progressive Web App (PWA) functionality, allowing users to:
- Install the platform on mobile devices like a native app
- Access all features offline
- Receive push notifications
- Experience app-like performance

To install as an app:
1. Open the website in a modern browser (Chrome, Safari, Edge)
2. Look for the install prompt or "Add to Home Screen" option
3. Click to install and use like any mobile app

## Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google Gemini for chatbot functionality
- **Deployment**: Vite build system

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see ENVIRONMENT_SETUP.md)
4. Start development server: `npm run dev`

## Documentation
- [Parent Portal Guide](PARENT_PORTAL.md)
- [Staff Portal Guide](STAFF_PORTAL.md)
- [Real-time Synchronization](REALTIME_SYNC.md)
- [Environment Setup](ENVIRONMENT_SETUP.md)
- [Firebase Setup](FIREBASE_SETUP.md)
- [AI Setup](DRONACHARYA_AI_SETUP.md)

## Portals
- **Student Portal**: `/student-dashboard`
- **Parent Portal**: `/parent-portal`
- **Staff Portal**: `/staff-portal`

## Authentication
- **Staff Login**: rajhans_001@gmail.com / abhimanyu0304
- **Student Login**: Create account via student signup
- **Parent Login**: Register with student validation

## Contributing
This is a private school management system. Please contact the administration for contribution guidelines.