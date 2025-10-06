# Enhanced Staff Portal Documentation

## Overview
The Enhanced Staff Portal provides teachers and administrators with comprehensive tools to manage students, parents, academic records, and school communications.

## Features
- **Student Management**: View, add, and remove students
- **Parent Management**: View, add, and remove parents
- **Marksheet Upload**: Upload and manage student grades by class and subject
- **Homework Tracking**: Monitor homework submissions and performance
- **Complaint Management**: Handle student complaints and feedback
- **Activity Registrations**: Manage student activity registrations
- **Meeting Scheduler**: Schedule and manage parent-teacher meetings
- **Notice Board**: Post important announcements and notices

## Authentication
- Access restricted to authorized staff only
- Login with credentials: rajhans_001@gmail.com / abhimanyu0304
- All actions are logged for security and accountability

## Marksheet Upload Process
1. Navigate to the "Marksheets" section
2. Click "Upload Marksheet"
3. Select class and section
4. Enter subject name and exam type
5. Enter marks for each student in the class
6. Submit the marksheet

## Technical Implementation
The Staff Portal is built as a React component using:
- Firebase Authentication for secure access
- Firestore for data storage and retrieval
- Real-time listeners for instant updates
- Responsive design for mobile and desktop access

## Firestore Collections Used
- `users`: Student and parent account information
- `marks`: Academic performance data
- `attendance`: Daily attendance records
- `homework`: Assigned homework and submission status
- `complaints`: Student complaints and feedback
- `registrations`: Activity registrations
- `meetings`: Scheduled meetings
- `notices`: School announcements
- `staffNotifications`: Staff alerts and notifications
- `loginRecords`: Student login tracking