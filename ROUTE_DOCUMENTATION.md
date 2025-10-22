# RHPS Web Portal Route Documentation

## Public Routes (No Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Main landing page with portal access links |
| `/about-us` | AboutUs | Information about RHPS Group |
| `/login` | Login | General login page |
| `/student-login` | StudentLogin | Student-specific login |
| `/student-signup` | StudentSignup | Student registration page |
| `/parent-login` | ParentLogin | Parent-specific login |
| `/parent-signup` | ParentSignup | Parent registration page |
| `/yearly-planner` | YearlyPlanner | Annual school calendar and events |
| `/monthly-planner` | MonthlyPlanner | Monthly school calendar and events |
| `/registration` | Registration | Event registration page |
| `/rules` | Rules | School rules and regulations |
| `/student-council` | StudentCouncil | Information about student council |
| `/smart-marketplace` | SmartMarketplace | E Educational Mall |
| `/chanting` | ChantingPage | Religious chanting activities |
| `/chanting/:religionId` | DeitySelectionPage | Deity selection for chanting |
| `/chanting/:religionId/:deityId` | ChantingCounterPage | Chanting counter page |
| `/chanting-leaderboard` | ChantingLeaderboardPage | Chanting activity leaderboard |

## Protected Routes (Authentication Required)

### Student Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/student-home` | StudentPortalContent | Main student dashboard with sidebar navigation |
| `/student-dashboard` | StudentDashboard | Student dashboard overview |
| `/study-resources` | EnhancedStudyResources | Study materials and resources |
| `/complaints` | Complaints | Submit and view complaints |
| `/homework` | Homework | Homework tracking and submission |
| `/learning-insights` | LearningInsights | AI-powered learning analytics dashboard |
| `/learning-badges` | LearningBadges | Student achievement badges |
| `/quiz` | QuizHome | Quiz system home |
| `/quiz/start` | QuizStart | Quiz start page |
| `/quiz/select-class` | QuizClassSelect | Class selection for quiz |
| `/quiz/select-subject` | QuizSubjectSelect | Subject selection for quiz |
| `/quiz/play` | QuizPlay | Quiz gameplay interface |
| `/quiz/results` | QuizResults | Quiz results display |

### Parent Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/parent-home` | ParentHome | Main parent dashboard |
| `/parent-portal` | ParentPortal | Parent portal with student insights |

### Staff Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/staff-portal` | StaffApp | Staff portal with administrative functions |

## Student Portal Internal Views (Within `/student-home`)

The student portal uses a sidebar navigation system with the following views:

| View ID | Display Name | Component | Description |
|---------|--------------|-----------|-------------|
| `home` | Dashboard | DashboardHome | Main dashboard overview |
| `calendar` | Calendar | CalendarView | Calendar view of events |
| `classes` | My Classes | - | Class schedule and information |
| `shop` | School Shop | - | E Educational Mall access |
| `settings` | Settings | - | User settings and preferences |
| `insights` | Learning Insights | LearningInsights | Learning analytics dashboard |
| `flashcards` | Flashcards | FlashcardCollection | Flashcard management system |
| `streak` | Study Streak | StudyStreak | Study consistency tracking |
| `learning-path` | Learning Path | PersonalizedLearningPath | Personalized learning recommendations |
| `virtual-lab` | Virtual Lab | VirtualLabSimulation | Virtual laboratory simulations |
| `connect` | RHPS Connect | RHPSConnect | Communication platform |
| `premium` | Premium Subscription | PremiumSubscription | Premium features access |

## Component Dependencies

### Main Application (`App.tsx`)
- Uses React Router for navigation
- Implements lazy loading for performance optimization
- Wraps application with multiple context providers:
  - AuthProvider (Authentication)
  - ThemeProvider (Dark/Light mode)
  - ComplaintProvider (Complaint management)
  - EventProvider (Event management)
  - RegistrationProvider (Event registration)
  - StudyResourcesProvider (Study resources)
  - EnhancedStudyResourcesProvider (Enhanced study resources)
  - EventGalleryProvider (Event gallery)
  - AttendanceProvider (Attendance tracking)
  - MessagesProvider (Messaging system)
  - DesignSystemProvider (Design system)

### Student Portal (`StudentPortalContent`)
- Uses UnifiedSidebar for navigation
- Implements view-based routing within a single route
- Protected by ProtectedRoute component requiring student role

## Issues Identified

1. **Inconsistent Navigation**: The student portal uses internal view switching rather than proper routing, which can cause issues with browser history and deep linking.

2. **Duplicate Components**: Some components like [LearningInsights] are accessible both as a standalone route and as an internal view.

3. **Missing Route Protection**: Several routes that should be protected (like study resources) are not properly wrapped in ProtectedRoute components.

4. **Flashcard Overload**: Flashcards are currently displayed directly on the homepage and in the student portal, causing clutter.

5. **Redirect Issues**: Some sidebar navigation items in UnifiedSidebar point to the same route (`/student-home`) instead of specific routes.

## Recommended Improvements

1. **Proper Route Structure**: Convert internal views to actual routes for better navigation and deep linking.

2. **Consistent Protection**: Ensure all student-specific routes are properly protected.

3. **Flashcard Hub**: Move flashcards to a dedicated route instead of embedding them in multiple locations.

4. **Navigation Cleanup**: Fix sidebar navigation to point to correct routes.

5. **Route Organization**: Group related routes under logical categories (Study, Analytics, Communication, etc.)