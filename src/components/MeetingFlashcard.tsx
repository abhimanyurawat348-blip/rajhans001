import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';

interface MeetingFlashcardProps {
  meeting: {
    id: string;
    topic: string;
    date: string;
    time: string;
    url?: string;
    description?: string;
    createdAt: Date;
  };
}

const MeetingFlashcard: React.FC<MeetingFlashcardProps> = ({ meeting }) => {
  // Defensive check for meeting data
  if (!meeting) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="p-4 rounded-lg border-l-4 border-purple-200 bg-purple-50 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-purple-800 mb-1">
              {meeting.topic || 'Untitled Meeting'}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-purple-700 mb-2">
              <span>{meeting.date ? new Date(meeting.date).toLocaleDateString() : 'Unknown date'}</span>
              <span>•</span>
              <span>{meeting.time || 'Unknown time'}</span>
            </div>
            {meeting.description && (
              <p className="text-sm text-purple-700 mb-2">
                {meeting.description}
              </p>
            )}
            {meeting.url && (
              <a 
                href={meeting.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                Join Meeting
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Scheduled on {meeting.createdAt ? new Date(meeting.createdAt).toLocaleDateString() : 'Unknown date'}
      </div>
    </motion.div>
  );
};

export default MeetingFlashcard;