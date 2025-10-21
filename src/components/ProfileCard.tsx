import React, { memo } from 'react';
import { Mail, Phone, GraduationCap } from 'lucide-react';

interface StudentProfile {
  name: string;
  studentId: string;
  grade: string;
  section: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface ProfileCardProps {
  studentData: StudentProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = memo(({ studentData }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Profile</h2>
      
      <div className="flex items-center space-x-6 mb-6">
        {studentData.avatar ? (
          <img 
            src={studentData.avatar} 
            alt={studentData.name} 
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            loading="lazy"
          />
        ) : (
          <div 
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg"
            aria-label={`Profile picture for ${studentData.name}`}
          >
            {getInitials(studentData.name)}
          </div>
        )}
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{studentData.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">Student ID: {studentData.studentId}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-gray-600">
          <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Grade & Section</p>
            <p className="font-semibold text-gray-900 dark:text-white">{studentData.grade} - {studentData.section}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-gray-700 rounded-lg transition-colors duration-200 hover:bg-green-100 dark:hover:bg-gray-600">
          <Mail className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-semibold text-gray-900 dark:text-white">{studentData.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-gray-700 rounded-lg transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-gray-600 md:col-span-2">
          <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="font-semibold text-gray-900 dark:text-white">{studentData.phone || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;