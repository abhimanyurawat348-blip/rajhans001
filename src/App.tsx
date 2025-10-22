import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { EventProvider } from './contexts/EventContext';
import { RegistrationProvider } from './contexts/RegistrationContext';
import { StudyResourcesProvider } from './contexts/StudyResourcesContext';
import { EnhancedStudyResourcesProvider } from './contexts/EnhancedStudyResourcesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EventGalleryProvider } from './contexts/EventGalleryContext';
import { AttendanceProvider } from './contexts/AttendanceContext';
import { MessagesProvider } from './contexts/MessagesContext';
import { DesignSystemProvider } from './contexts/DesignSystemContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import NewStaffPortal from './pages/NewStaffPortal';
import ProtectedRoute from './components/ProtectedRoute';
import SettingsDialog from './components/SettingsDialog';
import DashboardHome from './components/DashboardHome';
import CalendarView from './components/CalendarView';
import StaffApp from './StaffApp';
import AIMentorChat from './components/AIMentorChat';
// SmartMarketplace is imported as a page component
import LearningBadges from './components/LearningBadges';
import UnifiedSidebar from './components/UnifiedSidebar';
import FlashcardCollection from './components/FlashcardCollection';
import StudyStreak from './components/StudyStreak';
import PersonalizedLearningPath from './components/PersonalizedLearningPath';
import VirtualLabSimulation from './components/VirtualLabSimulation';
import RHPSConnect from './components/RHPSConnect';
import PremiumSubscription from './components/PremiumSubscription';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Complaints = lazy(() => import('./pages/Complaints'));
const StudyResources = lazy(() => import('./pages/StudyResources'));
const EnhancedStudyResources = lazy(() => import('./pages/EnhancedStudyResources'));
const Rules = lazy(() => import('./pages/Rules'));
const StudentCouncil = lazy(() => import('./pages/StudentCouncil'));
const YearlyPlanner = lazy(() => import('./pages/YearlyPlanner'));
const MonthlyPlanner = lazy(() => import('./pages/MonthlyPlanner'));
const Registration = lazy(() => import('./pages/Registration'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const PlannersRegistrations = lazy(() => import('./pages/PlannersRegistrations'));
const StudentSignup = lazy(() => import('./pages/StudentSignup'));
const StudentLogin = lazy(() => import('./pages/StudentLogin'));
const StudentHome = lazy(() => import('./pages/StudentHome'));
const QuizHome = lazy(() => import('./pages/QuizHome'));
const QuizStart = lazy(() => import('./pages/QuizStart'));
const QuizClassSelect = lazy(() => import('./pages/QuizClassSelect'));
const QuizSubjectSelect = lazy(() => import('./pages/QuizSubjectSelect'));
const QuizPlay = lazy(() => import('./pages/QuizPlay'));
const QuizResults = lazy(() => import('./pages/QuizResults'));
const ParentPortal = lazy(() => import('./pages/ParentPortal'));
const ParentSignup = lazy(() => import('./pages/ParentSignup'));
const ParentLogin = lazy(() => import('./pages/ParentLogin'));
const ParentHome = lazy(() => import('./pages/ParentHome'));
const Homework = lazy(() => import('./pages/Homework'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ChantingPage = lazy(() => import('./pages/ChantingPage'));
const DeitySelectionPage = lazy(() => import('./pages/DeitySelectionPage'));
const ChantingCounterPage = lazy(() => import('./pages/ChantingCounterPage'));
const ChantingLeaderboardPage = lazy(() => import('./pages/ChantingLeaderboardPage'));
const LearningInsights = lazy(() => import('./pages/LearningInsights'));
const SmartMarketplace = lazy(() => import('./components/SmartMarketplace'));

// New pages for proper routing
const FlashcardsHub = lazy(() => import('./pages/FlashcardsHub'));
const Results = lazy(() => import('./pages/Results'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Settings = lazy(() => import('./pages/Settings'));
const LearningPath = lazy(() => import('./pages/LearningPath'));
const VirtualLab = lazy(() => import('./pages/VirtualLab'));
const Connect = lazy(() => import('./pages/Connect'));
const Premium = lazy(() => import('./pages/Premium'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
    </div>
  </div>
);

type ViewType = "home" | "calendar" | "classes" | "shop" | "settings" | "insights" | "flashcards" | "streak" | "learning-path" | "virtual-lab" | "connect" | "premium";

function getClassStatus(startHour: number, endHour: number, currentTime: Date) {
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  
  if (currentHour < startHour) {
    return "upcoming";
  } else if (currentHour >= startHour && currentHour < endHour) {
    return "ongoing";
  } else {
    return "completed";
  }
}

// Add the LearningInsights icon import
import { BarChart3 as LearningInsightsIcon, Trophy } from 'lucide-react';

// Create a separate component for the student portal content to ensure it's within AuthProvider
const StudentPortalContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Memoize classes data to prevent unnecessary re-renders
  const classes = useMemo(() => [
    {
      id: "1",
      subject: "Mathematics",
      time: "9:00 AM - 10:00 AM",
      teacher: "Mr. Sharma",
      room: "Room 101",
      startHour: 9,
      endHour: 10,
      status: "completed" as "upcoming" | "ongoing" | "completed"
    },
    {
      id: "2",
      subject: "Physics",
      time: "10:30 AM - 11:30 AM",
      teacher: "Dr. Patel",
      room: "Lab 2",
      startHour: 10.5,
      endHour: 11.5,
      status: "ongoing" as "upcoming" | "ongoing" | "completed"
    },
    {
      id: "3",
      subject: "Chemistry",
      time: "1:00 PM - 2:00 PM",
      teacher: "Ms. Gupta",
      room: "Lab 1",
      startHour: 13,
      endHour: 14,
      status: "upcoming" as "upcoming" | "ongoing" | "completed"
    }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex">
      <UnifiedSidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentView === "home" && "Dashboard"}
              {currentView === "calendar" && "Calendar"}
              {currentView === "classes" && "My Classes"}
              {currentView === "shop" && "School Shop"}
              {currentView === "settings" && "Settings"}
              {currentView === "insights" && "Learning Insights"}
              {currentView === "flashcards" && "Flashcards"}
              {currentView === "streak" && "Study Streak"}
              {currentView === "learning-path" && "Learning Path"}
              {currentView === "virtual-lab" && "Virtual Lab"}
              {currentView === "connect" && "RHPS Connect"}
              {currentView === "premium" && "Premium Subscription"}
            </h1>
            <div className="hidden md:block text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          
          {currentView === "home" && (
            <DashboardHome 
              studentData={{
                name: "Student User",
                studentId: "RHPS2025001",
                grade: "12",
                section: "A",
                email: "student@example.com",
                phone: ""
              }}
              todaysClasses={classes.map(classItem => ({
                ...classItem,
                status: getClassStatus(classItem.startHour, classItem.endHour, currentTime)
              }))}
              attendanceData={{
                percentage: 92,
                present: 46,
                total: 50,
                trend: "up"
              }}
              homeworkList={[
                {
                  id: "1",
                  subject: "Mathematics",
                  title: "Chapter 5 Exercises",
                  dueDate: "Oct 15, 2025",
                  status: "pending"
                },
                {
                  id: "2",
                  subject: "Physics",
                  title: "Lab Report Submission",
                  dueDate: "Oct 12, 2025",
                  status: "completed"
                }
              ]}
            />
          )}
          
          {currentView === "calendar" && <CalendarView />}
          
          {currentView === "classes" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Classes</h2>
              <p className="text-gray-600 dark:text-gray-300">Detailed class information will be available here.</p>
            </div>
          )}
          
          {currentView === "shop" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">School Shop</h2>
              <p className="text-gray-600 dark:text-gray-300">Purchase books, uniforms, and stationery here.</p>
            </div>
          )}
          
          {currentView === "insights" && (
            <div className="transition-all duration-300">
              <LearningInsights />
            </div>
          )}
          
          {currentView === "flashcards" && (
            <div className="transition-all duration-300">
              <FlashcardCollection />
            </div>
          )}
          
          {currentView === "streak" && (
            <div className="transition-all duration-300">
              <StudyStreak />
            </div>
          )}
          
          {currentView === "learning-path" && (
            <div className="transition-all duration-300">
              <PersonalizedLearningPath />
            </div>
          )}
          
          {currentView === "virtual-lab" && (
            <div className="transition-all duration-300">
              <VirtualLabSimulation />
            </div>
          )}
          
          {currentView === "connect" && (
            <div className="transition-all duration-300">
              <RHPSConnect />
            </div>
          )}
          
          {currentView === "premium" && (
            <div className="transition-all duration-300">
              <PremiumSubscription />
            </div>
          )}
          
        </div>
      </div>
      
      <SettingsDialog 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
      <AIMentorChat />
    </div>
  );
};

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ErrorBoundary>
      <DesignSystemProvider>
        <ThemeProvider>
          <AuthProvider>
            <ComplaintProvider>
              <EventProvider>
                <RegistrationProvider>
                  <StudyResourcesProvider>
                    <EnhancedStudyResourcesProvider>
                      <EventGalleryProvider>
                        <AttendanceProvider>
                          <MessagesProvider>
                            <Router>
                              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                                <Navbar />
                                <Suspense fallback={<LoadingFallback />}>
                                <Routes>
                                  <Route path="/" element={<Home />} />
                                  <Route path="/about-us" element={<AboutUs />} />
                                  <Route path="/login" element={<Login />} />
                                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                                  <Route path="/student-signup" element={<StudentSignup />} />
                                  <Route path="/student-login" element={<StudentLogin />} />
                                  <Route path="/student-home" element={
                                    <ProtectedRoute requiredRole="student">
                                      <StudentHome />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/rules" element={<Rules />} />
                                  <Route path="/student-council" element={<StudentCouncil />} />
                                  <Route path="/yearly-planner" element={<YearlyPlanner />} />
                                  <Route path="/planners-registrations" element={<PlannersRegistrations />} />
                                  <Route path="/monthly-planner" element={<MonthlyPlanner />} />
                                  <Route path="/registration" element={<Registration />} />
                                  <Route path="/staff-portal" element={<StaffApp />} />
                                  <Route path="/complaints" element={
                                    <ProtectedRoute requiredRole="student">
                                      <Complaints />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/study-resources" element={
                                    <ProtectedRoute requiredRole="student">
                                      <EnhancedStudyResources />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/parent-portal" element={<ParentPortal />} />
                                  <Route path="/parent-signup" element={<ParentSignup />} />
                                  <Route path="/parent-login" element={<ParentLogin />} />
                                  <Route path="/parent-home" element={<ParentHome />} />
                                  <Route path="/quiz" element={<QuizHome />} />
                                  <Route path="/quiz/start" element={<QuizStart />} />
                                  <Route path="/quiz/select-class" element={<QuizClassSelect />} />
                                  <Route path="/quiz/select-subject" element={<QuizSubjectSelect />} />
                                  <Route path="/quiz/play" element={<QuizPlay />} />
                                  <Route path="/quiz/results" element={<QuizResults />} />
                                  <Route path="/homework" element={
                                    <ProtectedRoute requiredRole="student">
                                      <Homework />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/chanting" element={<ChantingPage />} />
                                  <Route path="/chanting/:religionId" element={<DeitySelectionPage />} />
                                  <Route path="/chanting/:religionId/:deityId" element={<ChantingCounterPage />} />
                                  <Route path="/chanting-leaderboard" element={<ChantingLeaderboardPage />} />
                                  <Route path="/learning-insights" element={
                                    <ProtectedRoute requiredRole="student">
                                      <LearningInsights />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/smart-marketplace" element={<SmartMarketplace />} />
                                  <Route path="/learning-badges" element={<LearningBadges />} />
                                  
                                  {/* New proper routes for student portal sections */}
                                  <Route path="/flashcards" element={
                                    <ProtectedRoute requiredRole="student">
                                      <FlashcardsHub />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/results" element={
                                    <ProtectedRoute requiredRole="student">
                                      <Results />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/attendance" element={
                                    <ProtectedRoute requiredRole="student">
                                      <Attendance />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/settings" element={
                                    <ProtectedRoute requiredRole="student">
                                      <Settings />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/learning-path" element={
                                    <ProtectedRoute requiredRole="student">
                                      <LearningPath />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/virtual-lab" element={
                                    <ProtectedRoute requiredRole="student">
                                      <VirtualLab />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/connect" element={
                                    <ProtectedRoute requiredRole="student">
                                      <Connect />
                                    </ProtectedRoute>
                                  } />
                                  <Route path="/premium" element={
                                    <ProtectedRoute requiredRole="student">
                                      <Premium />
                                    </ProtectedRoute>
                                  } />
                                </Routes>
                              </Suspense>
                            </div>
                          </Router>
                        </MessagesProvider>
                      </AttendanceProvider>
                    </EventGalleryProvider>
                  </EnhancedStudyResourcesProvider>
                </StudyResourcesProvider>
                </RegistrationProvider>
              </EventProvider>
            </ComplaintProvider>
          </AuthProvider>
        </ThemeProvider>
      </DesignSystemProvider>
    </ErrorBoundary>
  );
}

export default App;