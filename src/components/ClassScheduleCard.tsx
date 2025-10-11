import React from 'react';

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

interface ClassScheduleCardProps {
  classes: ClassSchedule[];
}

const ClassScheduleCard: React.FC<ClassScheduleCardProps> = ({ classes }) => {
  const getStatusBadge = (status: ClassSchedule['status']) => {
    switch (status) {
      case 'ongoing':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Ongoing</span>;
      case 'upcoming':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Upcoming</span>;
      case 'completed':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">Unknown</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Today's Schedule</h2>
      
      {classes.length > 0 ? (
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div 
              key={classItem.id} 
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white">{classItem.subject}</h3>
                  {getStatusBadge(classItem.status)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{classItem.time}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Teacher: {classItem.teacher}</span>
                  <span>Room: {classItem.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No classes scheduled for today</p>
        </div>
      )}
    </div>
  );
};

export default ClassScheduleCard;