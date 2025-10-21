import React, { memo } from 'react';
import ProfileCard from './ProfileCard';
import ClassScheduleCard from './ClassScheduleCard';
import AttendanceCard from './AttendanceCard';
import HomeworkCard from './HomeworkCard';
import ShopLinksCard from './ShopLinksCard';

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

// Memoized components for better performance
const MemoizedProfileCard = memo(ProfileCard);
const MemoizedClassScheduleCard = memo(ClassScheduleCard);
const MemoizedAttendanceCard = memo(AttendanceCard);
const MemoizedHomeworkCard = memo(HomeworkCard);
const MemoizedShopLinksCard = memo(ShopLinksCard);

const DashboardHome: React.FC<DashboardHomeProps> = ({
  studentData,
  todaysClasses,
  attendanceData,
  homeworkList
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <MemoizedProfileCard studentData={studentData} />
        <MemoizedClassScheduleCard classes={todaysClasses} />
      </div>
      
      <div className="space-y-6">
        <MemoizedAttendanceCard attendanceData={attendanceData} />
        <MemoizedHomeworkCard homeworkList={homeworkList} />
        <MemoizedShopLinksCard />
      </div>
    </div>
  );
};

// Add display names for debugging
MemoizedProfileCard.displayName = 'MemoizedProfileCard';
MemoizedClassScheduleCard.displayName = 'MemoizedClassScheduleCard';
MemoizedAttendanceCard.displayName = 'MemoizedAttendanceCard';
MemoizedHomeworkCard.displayName = 'MemoizedHomeworkCard';
MemoizedShopLinksCard.displayName = 'MemoizedShopLinksCard';

export default DashboardHome;