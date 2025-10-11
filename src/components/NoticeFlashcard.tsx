import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, AlertCircle } from 'lucide-react';

interface NoticeFlashcardProps {
  notice: {
    id: string;
    title: string;
    content: string;
    priority: 'normal' | 'important' | 'urgent';
    createdAt: Date;
  };
}

const NoticeFlashcard: React.FC<NoticeFlashcardProps> = ({ notice }) => {
  const getPriorityStyles = () => {
    switch (notice.priority) {
      case 'urgent':
        return {
          container: 'bg-red-50 border-red-200',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          title: 'text-red-800',
          content: 'text-red-700',
          badge: 'bg-red-100 text-red-800'
        };
      case 'important':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          title: 'text-yellow-800',
          content: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: <Bell className="h-5 w-5 text-blue-500" />,
          title: 'text-blue-800',
          content: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-800'
        };
    }
  };

  const styles = getPriorityStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`p-4 rounded-lg border-l-4 ${styles.container} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            {styles.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold ${styles.title}`}>
                {notice.title}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
              </span>
            </div>
            <p className={`text-sm ${styles.content}`}>
              {notice.content}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : 'Unknown date'}
      </div>
    </motion.div>
  );
};

export default NoticeFlashcard;