# Parent-Teacher Meeting (PTM) Feature Documentation

## Overview
The Parent-Teacher Meeting (PTM) feature enables staff to schedule and manage parent-teacher meetings, with integration to Zoho Meeting for virtual sessions. Parents can view their scheduled meetings and join them directly from the portal.

## Features

### Staff Portal PTM Section
- **Schedule PTM**: Staff can create new PTM sessions with:
  - Date and time (Indian Standard Time)
  - Meeting title and description
  - Student roll numbers (range or comma-separated)
  - Automatic parent identification based on student roll numbers
  - Zoho Meeting link generation

- **Manage PTM**: Staff can:
  - View all scheduled PTMs
  - Edit existing PTM details
  - Delete PTM sessions
  - See participant counts (students and parents)

### Parent Portal PTM Display
- **View Scheduled Meetings**: Parents can see:
  - Meeting title and description
  - Date and time in IST format
  - Direct link to join the Zoho meeting
  - Visual indication of upcoming meetings

### Home Dashboard Notification
- **Dronacharya AI Status**: Display message about AI features being under development
- **PTM Visibility**: Parents see relevant PTMs in their dashboard

## Technical Implementation

### Firestore Collections
1. **`ptm_schedule`**: Stores all PTM meeting information
   - `date`: Meeting date
   - `time`: Meeting time
   - `teacherIds`: Array of teacher IDs
   - `parentIds`: Array of parent IDs
   - `studentIds`: Array of student IDs
   - `zohoMeetingLink`: Generated Zoho meeting URL
   - `title`: Meeting title
   - `description`: Meeting description (optional)
   - `createdAt`: Timestamp of creation

2. **`users`**: Used to identify parents based on student roll numbers
   - Cross-referenced to map students to their parents

### Zoho Meeting Integration
- **Link Generation**: Simulated Zoho meeting link generation
- **Security**: Meeting links stored securely in Firestore
- **Access Control**: Only invited parents can access meeting links

### Time Zone Handling
- **IST Format**: All meeting times displayed in Indian Standard Time
- **Consistent Formatting**: Uniform date/time display across the platform

## Security & Access Control

### Staff Access
- Only authenticated staff can:
  - Create/edit/delete PTM schedules
  - View all PTM details
  - Manage participant lists

### Parent Access
- Parents can only:
  - View PTMs assigned to their child
  - Access meeting links for their PTMs
  - Join meetings they're invited to

### Data Protection
- Meeting links are not exposed to unauthorized users
- Parent-student relationships are verified before granting access
- All data stored in secure Firestore collections

## UI/UX Design

### Staff Portal
- **Tab Navigation**: Dedicated "PTM Schedule" tab
- **Form Interface**: Intuitive form for scheduling meetings
- **List View**: Clear display of all scheduled PTMs
- **Action Buttons**: Easy access to join, edit, or delete meetings

### Parent Portal
- **Dedicated Section**: Clear "Parent-Teacher Meetings" section
- **Visual Cards**: Attractive meeting cards with key information
- **Direct Links**: One-click access to Zoho meetings
- **Responsive Design**: Works on all device sizes

### Home Dashboard
- **Prominent Display**: Clear message about Dronacharya AI development status
- **Consistent Styling**: Matches overall portal design language

## Implementation Files

### New Files
1. `src/utils/zohoMeeting.ts`: Utility functions for Zoho meeting integration
2. `PTM_FEATURE.md`: This documentation file

### Modified Files
1. `src/pages/EnhancedStaffPortal.tsx`: Added PTM scheduling and management
2. `src/pages/ParentPortal.tsx`: Added PTM display for parents
3. `src/pages/Home.tsx`: Added Dronacharya AI status message

## Future Enhancements

### Zoho API Integration
- Direct integration with Zoho Meeting API
- Real meeting creation with proper authentication
- Meeting recording and analytics features

### Advanced Scheduling
- Recurring meeting support
- Calendar integration
- Automated reminders for participants

### Enhanced Parent Features
- Meeting preparation materials
- Post-meeting feedback collection
- Meeting notes and action items

### Staff Management Tools
- Meeting analytics and reporting
- Participant attendance tracking
- Resource sharing capabilities

## Testing

### Functionality Tests
- ✅ PTM scheduling in Staff Portal
- ✅ Parent access control for PTMs
- ✅ Zoho meeting link generation
- ✅ Time zone conversion to IST
- ✅ Data persistence in Firestore

### Security Tests
- ✅ Unauthorized access prevention
- ✅ Data encryption in transit
- ✅ Meeting link protection
- ✅ Role-based access control

### UI/UX Tests
- ✅ Responsive design on all devices
- ✅ Consistent styling with portal
- ✅ Clear navigation and actions
- ✅ Accessible interface elements

## Deployment

### Requirements
- Firebase Firestore database
- Zoho Meeting account (for production)
- Proper security rules for collections

### Configuration
- Environment variables for API keys
- Firestore security rules for access control
- Time zone settings for IST display

## Maintenance

### Monitoring
- Regular checks of meeting link functionality
- Monitoring of Firestore usage and costs
- User feedback collection for improvements

### Updates
- Periodic review of security measures
- UI/UX improvements based on user feedback
- Integration enhancements for better features