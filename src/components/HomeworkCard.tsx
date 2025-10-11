import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Homework {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: "pending" | "completed";
}

interface HomeworkCardProps {
  homeworkList: Homework[];
}

const HomeworkCard: React.FC<HomeworkCardProps> = ({ homeworkList }) => {
  const pendingCount = homeworkList.filter(hw => hw.status === 'pending').length;
  const completedCount = homeworkList.filter(hw => hw.status === 'completed').length;

  const getStatusIcon = (status: Homework['status']) => {
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <Circle className="h-5 w-5 text-orange-500" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Homework</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingCount}</p>
        </div>
        <div className="bg-green-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
        </div>
      </div>
      
      {homeworkList.length > 0 ? (
        <div className="space-y-4">
          {homeworkList.slice(0, 4).map((homework) => (
            <div 
              key={homework.id} 
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              {getStatusIcon(homework.status)}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{homework.subject}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{homework.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                    Due: {homework.dueDate}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    homework.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                  }`}>
                    {homework.status.charAt(0).toUpperCase() + homework.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">No homework assigned</p>
        </div>
      )}
    </div>
  );
};

export default HomeworkCard;