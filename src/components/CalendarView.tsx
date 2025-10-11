import React, { useState } from 'react';

interface CalendarEvent {
  date: number;
  subject: string;
  time: string;
  teacher: string;
  room: string;
  type: "class" | "exam" | "assignment";
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Get the first day of the month to align the calendar
  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  };

  // Get the number of days in the month
  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  // Get the days of the month
  const getDaysArray = () => {
    const days = [];
    const firstDay = getFirstDayOfMonth();
    const daysInMonth = getDaysInMonth();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Check if a date is today
  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Get events for a specific date
  const getEventsForDate = (day: number | null): CalendarEvent[] => {
    if (!day) return [];
    
    // Mock data for demonstration
    const mockEvents: CalendarEvent[] = [
      {
        date: 11,
        subject: "Mathematics",
        time: "9:00 AM - 10:00 AM",
        teacher: "Mr. Sharma",
        room: "Room 101",
        type: "class"
      },
      {
        date: 11,
        subject: "Science Exam",
        time: "11:00 AM - 12:30 PM",
        teacher: "Dr. Patel",
        room: "Lab 2",
        type: "exam"
      },
      {
        date: 15,
        subject: "English Assignment",
        time: "All Day",
        teacher: "Ms. Gupta",
        room: "Online",
        type: "assignment"
      }
    ];

    return mockEvents.filter(event => event.date === day);
  };

  // Get event dot color based on type
  const getEventDotColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-500';
      case 'exam': return 'bg-red-500';
      case 'assignment': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().getDate());
  };

  const daysArray = getDaysArray();
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={goToToday}
            className="px-3 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((day, index) => (
          <div
            key={index}
            onClick={() => day && setSelectedDate(day)}
            className={`
              min-h-20 p-1 border border-gray-200 dark:border-gray-700 rounded-lg
              ${day ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
              ${selectedDate === day ? 'ring-2 ring-blue-500' : ''}
              ${isToday(day) ? 'border-2 border-blue-500' : ''}
            `}
          >
            {day && (
              <>
                <div className={`text-center text-sm font-medium ${
                  isToday(day) 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {day}
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {getEventsForDate(day).slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`w-2 h-2 rounded-full ${getEventDotColor(event.type)}`}
                      title={`${event.subject} - ${event.time}`}
                    ></div>
                  ))}
                  {getEventsForDate(day).length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">+{getEventsForDate(day).length - 3}</div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedDate && selectedDateEvents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Events on {currentDate.toLocaleString('default', { month: 'long' })} {selectedDate}, {currentDate.getFullYear()}
          </h3>
          <div className="space-y-3">
            {selectedDateEvents.map((event, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{event.subject}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{event.teacher} • {event.room}</p>
                  </div>
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${event.type === 'class' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                    ${event.type === 'exam' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                    ${event.type === 'assignment' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : ''}
                  `}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{event.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;