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
- Firebase Authentication for login
- Firestore security rules with default-deny access
- No staff passwords or provider API keys committed to source code
- Environment variables for public Firebase configuration
- Server-side AI credentials only
- Role-based authorization enforced by Firestore rules

## Mobile App (PWA)
The platform supports Progressive Web App (PWA) functionality.

## Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: AI integration should use an authenticated server-side endpoint; provider secrets must not be shipped to the browser
- **Deployment**: Vite build system

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see ENVIRONMENT_SETUP.md)
4. Provision staff accounts through Firebase Authentication; do not put credentials in the repository
5. Deploy the Firestore rules in `firestore.rules`
6. Start development server: `npm run dev`

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
Staff authentication is handled by Firebase Authentication plus a role stored in the authenticated user's profile. Credentials must never be documented in the repository.

## Contributing
This is a school management system. Keep student, parent, staff, and AI data protected and never commit credentials or private data.