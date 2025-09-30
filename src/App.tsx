import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { EventProvider } from './contexts/EventContext';
import { RegistrationProvider } from './contexts/RegistrationContext';
import { StudyResourcesProvider } from './contexts/StudyResourcesContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Complaints from './pages/Complaints';
import StaffPortal from './pages/StaffPortal';
import StudyResources from './pages/StudyResources';
import Rules from './pages/Rules';
import StudentCouncil from './pages/StudentCouncil';
import YearlyPlanner from './pages/YearlyPlanner';
import MonthlyPlanner from './pages/MonthlyPlanner';
import Registration from './pages/Registration';

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
                    <Route path="/rules" element={<Rules />} />
                    <Route path="/student-council" element={<StudentCouncil />} />
                    <Route path="/yearly-planner" element={<YearlyPlanner />} />
                    <Route path="/monthly-planner" element={<MonthlyPlanner />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/staff-portal" element={<StaffPortal />} />
                    <Route 
                      path="/complaints" 
                      element={
                        <ProtectedRoute requiredRole="student">
                          <Complaints />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/study-resources" 
                      element={
                        <ProtectedRoute requiredRole="student">
                          <StudyResources />
                        </ProtectedRoute>
                      } 
                    />
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