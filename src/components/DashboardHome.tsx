import React from 'react';
import ProfileCard from './ProfileCard.tsx';
import ClassScheduleCard from './ClassScheduleCard.tsx';
import AttendanceCard from './AttendanceCard.tsx';
import HomeworkCard from './HomeworkCard.tsx';
import ShopLinksCard from './ShopLinksCard.tsx';

interface StudentProfile {
  name: string;
  studentId: string;
  grade: string;
  section: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface ClassSchedule {
  id: string;
  subject: string;
  time: string;
  teacher: string;
  room: string;
  startHour: number;
  endHour: number;
  status?: "upcoming" | "ongoing" | "completed";
}

interface AttendanceData {
  percentage: number;
  present: number;
  total: number;
  trend: "up" | "down" | "stable";
}

interface Homework {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: "pending" | "completed";
}

interface DashboardHomeProps {
  studentData: StudentProfile;
  todaysClasses: ClassSchedule[];
  attendanceData: AttendanceData;
  homeworkList: Homework[];
}

const DashboardHome: React.FC<DashboardHomeProps> = ({
  studentData,
  todaysClasses,
  attendanceData,
  homeworkList
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <ProfileCard studentData={studentData} />
        <ClassScheduleCard classes={todaysClasses} />
      </div>
      
      <div className="space-y-6">
        <AttendanceCard attendanceData={attendanceData} />
        <HomeworkCard homeworkList={homeworkList} />
        <ShopLinksCard />
      </div>
    </div>
  );
};

export default DashboardHome;