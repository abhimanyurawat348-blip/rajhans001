import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Complaints from './pages/Complaints';
import StaffPortal from './pages/StaffPortal';
import Rules from './pages/Rules';
import StudentCouncil from './pages/StudentCouncil';

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/student-council" element={<StudentCouncil />} />
              <Route 
                path="/complaints" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Complaints />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff-portal" 
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <StaffPortal />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;