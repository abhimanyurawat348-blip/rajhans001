# Parent Portal Documentation

## Overview
The Parent Portal is a secure section of the school management system that allows parents to monitor their child's academic progress, attendance, homework, and communicate with teachers.

## Features
- **Student Validation**: Parents must register with their email and their child's student email for validation
- **Academic Performance**: View marksheets and grades across subjects
- **Attendance Tracking**: Monitor daily attendance records
- **Homework Management**: View assigned homework and submission status
- **Parent-Teacher Meetings**: Access scheduled meetings and details
- **Fee Reminders**: (Future feature) View fee payment status and reminders

## Registration Process
1. Navigate to the Parent Portal from the home page
2. Click "Sign Up" to create a new account
3. Enter parent email address
4. Enter student's registered email address (for validation)
5. Create a secure password
6. Submit the registration form
7. Login with your credentials after registration

## Security
- All data is securely stored in Firebase Firestore
- Parents can only access data for their validated child
- Passwords are encrypted using Firebase Authentication
- Real-time data synchronization across all portals

## Technical Implementation
The Parent Portal is built as a React component using:
- Firebase Authentication for secure login
- Firestore for data storage and retrieval
- Real-time listeners for instant updates
- Responsive design for mobile and desktop access

## Firestore Collections Used
- `users`: Parent and student account information
- `marks`: Academic performance data
- `attendance`: Daily attendance records
- `homework`: Assigned homework and submission status
- `parentTeacherMeetings`: Scheduled meeting information