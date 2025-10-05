import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { EventProvider } from './contexts/EventContext';
import { RegistrationProvider } from './contexts/RegistrationContext';
import { StudyResourcesProvider } from './contexts/StudyResourcesContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Complaints = lazy(() => import('./pages/Complaints'));
const NewStaffPortal = lazy(() => import('./pages/NewStaffPortal'));
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

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ComplaintProvider>
          <EventProvider>
            <RegistrationProvider>
              <StudyResourcesProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/student-dashboard" element={<StudentDashboard />} />
                        <Route path="/student-signup" element={<StudentSignup />} />
                        <Route path="/student-login" element={<StudentLogin />} />
                        <Route path="/student-home" element={<StudentHome />} />
                        <Route path="/rules" element={<Rules />} />
                        <Route path="/student-council" element={<StudentCouncil />} />
                        <Route path="/yearly-planner" element={<YearlyPlanner />} />
                        <Route path="/planners-registrations" element={<PlannersRegistrations />} />
                        <Route path="/monthly-planner" element={<MonthlyPlanner />} />
                        <Route path="/registration" element={<Registration />} />
                        <Route path="/staff-portal" element={<NewStaffPortal />} />
                        <Route path="/complaints" element={<Complaints />} />
                        <Route path="/study-resources" element={<StudyResources />} />
                        <Route path="/quiz" element={<QuizHome />} />
                        <Route path="/quiz/start" element={<QuizStart />} />
                        <Route path="/quiz/select-class" element={<QuizClassSelect />} />
                        <Route path="/quiz/select-subject" element={<QuizSubjectSelect />} />
                        <Route path="/quiz/play" element={<QuizPlay />} />
                        <Route path="/quiz/results" element={<QuizResults />} />
                      </Routes>
                    </Suspense>
                  </div>
                </Router>
              </StudyResourcesProvider>
            </RegistrationProvider>
          </EventProvider>
        </ComplaintProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;