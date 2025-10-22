import React from 'react';
import { motion } from 'framer-motion';
import ModernDashboard from './ModernDashboard';

interface StudentData {
  name: string;
  studentId: string;
  grade: string;
  section: string;
  email: string;
  phone: string;
}

interface Class {
  id: string;
  subject: string;
  time: string;
  teacher: string;
  room: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface AttendanceData {
  percentage: number;
  present: number;
  total: number;
  trend: 'up' | 'down' | 'stable';
}

interface Homework {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

interface DashboardHomeProps {
  studentData: StudentData;
  todaysClasses: Class[];
  attendanceData: AttendanceData;
  homeworkList: Homework[];
}

const DashboardHome: React.FC<DashboardHomeProps> = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <ModernDashboard />
    </motion.div>
  );
};

export default DashboardHome;