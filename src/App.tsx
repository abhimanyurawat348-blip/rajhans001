import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { EventProvider } from './contexts/EventContext';
import { RegistrationProvider } from './contexts/RegistrationContext';
import { StudyResourcesProvider } from './contexts/StudyResourcesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EventGalleryProvider } from './contexts/EventGalleryContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import NewStaffPortal from './pages/NewStaffPortal';
import ProtectedRoute from './components/ProtectedRoute';
import SettingsDialog from './components/SettingsDialog';
import DashboardHome from './components/DashboardHome';
import CalendarView from './components/CalendarView';
import StaffApp from './StaffApp';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Complaints = lazy(() => import('./pages/Complaints'));
const StudyResources = lazy(() => import('./pages/StudyResources'));
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

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
);

// Add type definitions
type ViewType = "home" | "calendar" | "classes" | "shop" | "settings";

// Function to calculate class status based on current time
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

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [classes, setClasses] = useState([
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
  ]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
      
      // Update class statuses based on current time
      setClasses(prevClasses => 
        prevClasses.map(classItem => ({
          ...classItem,
          status: getClassStatus(classItem.startHour, classItem.endHour, newTime)
        }))
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Theme effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ComplaintProvider>
            <EventProvider>
              <RegistrationProvider>
                <StudyResourcesProvider>
                  <EventGalleryProvider>
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
                                <div className="flex">
                                  {/* Sidebar Navigation */}
                                  <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen sticky top-0 hidden md:block">
                                    <div className="p-6">
                                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Portal</h2>
                                    </div>
                                    <nav className="mt-6">
                                      <button
                                        onClick={() => setCurrentView("home")}
                                        className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors duration-200 ${
                                          currentView === "home"
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        <span>Home</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => setCurrentView("classes")}
                                        className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors duration-200 ${
                                          currentView === "classes"
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                        <span>My Classes</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => setCurrentView("calendar")}
                                        className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors duration-200 ${
                                          currentView === "calendar"
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Calendar</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => setCurrentView("shop")}
                                        className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors duration-200 ${
                                          currentView === "shop"
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                        </svg>
                                        <span>Shop</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          setCurrentView("settings");
                                          setSettingsOpen(true);
                                        }}
                                        className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors duration-200 ${
                                          currentView === "settings"
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Settings</span>
                                      </button>
                                    </nav>
                                  </div>
                                  
                                  {/* Main Content */}
                                  <div className="flex-1 p-6">
                                    <div className="max-w-7xl mx-auto">
                                      {/* Header with Clock */}
                                      <div className="flex justify-between items-center mb-8">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                          {currentView === "home" && "Dashboard"}
                                          {currentView === "calendar" && "Calendar"}
                                          {currentView === "classes" && "My Classes"}
                                          {currentView === "shop" && "School Shop"}
                                          {currentView === "settings" && "Settings"}
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
                                      
                                      {/* View Content */}
                                      {currentView === "home" && (
                                        <DashboardHome 
                                          studentData={{
                                            name: "John Doe",
                                            studentId: "RHPS2025001",
                                            grade: "12",
                                            section: "A",
                                            email: "john.doe@gmail.com",
                                            phone: "+91 9876543210"
                                          }}
                                          todaysClasses={classes}
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
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Classes</h2>
                                          <p className="text-gray-600 dark:text-gray-300">Detailed class information will be available here.</p>
                                        </div>
                                      )}
                                      
                                      {currentView === "shop" && (
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">School Shop</h2>
                                          <p className="text-gray-600 dark:text-gray-300">Purchase books, uniforms, and stationery here.</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <SettingsDialog 
                                  isOpen={settingsOpen} 
                                  onClose={() => setSettingsOpen(false)} 
                                />
                              </ProtectedRoute>
                            } />
                            <Route path="/rules" element={<Rules />} />
                            <Route path="/student-council" element={<StudentCouncil />} />
                            <Route path="/yearly-planner" element={<YearlyPlanner />} />
                            <Route path="/planners-registrations" element={<PlannersRegistrations />} />
                            <Route path="/monthly-planner" element={<MonthlyPlanner />} />
                            <Route path="/registration" element={<Registration />} />
                            <Route path="/staff-portal" element={<StaffApp />} />
                            <Route path="/complaints" element={<Complaints />} />
                            <Route path="/study-resources" element={<StudyResources />} />
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
                            <Route path="/homework" element={<Homework />} />
                            <Route path="/chanting" element={<ChantingPage />} />
                            <Route path="/chanting/:religionId" element={<DeitySelectionPage />} />
                            <Route path="/chanting/:religionId/:deityId" element={<ChantingCounterPage />} />
                            <Route path="/chanting-leaderboard" element={<ChantingLeaderboardPage />} />
                          </Routes>
                        </Suspense>
                      </div>
                    </Router>
                  </EventGalleryProvider>
                </StudyResourcesProvider>
              </RegistrationProvider>
            </EventProvider>
          </ComplaintProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;