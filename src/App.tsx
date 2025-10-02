import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { EventProvider } from './contexts/EventContext';
import { RegistrationProvider } from './contexts/RegistrationContext';
import { StudyResourcesProvider } from './contexts/StudyResourcesContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Complaints from './pages/Complaints';
import NewStaffPortal from './pages/NewStaffPortal';
import StudyResources from './pages/StudyResources';
import Rules from './pages/Rules';
import StudentCouncil from './pages/StudentCouncil';
import YearlyPlanner from './pages/YearlyPlanner';
import MonthlyPlanner from './pages/MonthlyPlanner';
import Registration from './pages/Registration';
import StudentDashboard from './pages/StudentDashboard';
import PlannersRegistrations from './pages/PlannersRegistrations';
import StudentSignup from './pages/StudentSignup';
import StudentLogin from './pages/StudentLogin';
import QuizHome from './pages/QuizHome';
import QuizStart from './pages/QuizStart';
import QuizClassSelect from './pages/QuizClassSelect';
import QuizSubjectSelect from './pages/QuizSubjectSelect';
import QuizPlay from './pages/QuizPlay';
import QuizResults from './pages/QuizResults';

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <EventProvider>
          <RegistrationProvider>
            <StudyResourcesProvider>
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/student-signup" element={<StudentSignup />} />
                    <Route path="/student-login" element={<StudentLogin />} />
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
                </div>
              </Router>
            </StudyResourcesProvider>
          </RegistrationProvider>
        </EventProvider>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;