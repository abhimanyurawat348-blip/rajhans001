import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '../contexts/EventContext';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, X } from 'lucide-react';

const MonthlyPlanner: React.FC = () => {
  const { getEventsByDate } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      const dayEvents = getEventsByDate(date);
      if (dayEvents.length > 0) {
        setShowEventModal(true);
      }
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-500';
      case 'holiday': return 'bg-green-500';
      case 'competition': return 'bg-blue-500';
      case 'function': return 'bg-purple-500';
      case 'sports': return 'bg-orange-500';
      case 'activity': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasEvents = (date: Date | null) => {
    if (!date) return false;
    return getEventsByDate(date).length > 0;
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsByDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <CalendarDays className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Monthly Planner</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive calendar view to explore monthly activities and events. Click on any date to see scheduled activities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <h2 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          {}
          <div className="grid grid-cols-7 bg-gray-50">
            {daysOfWeek.map(day => (
              <div key={day} className="p-4 text-center font-semibold text-gray-700 border-b border-gray-200">
                {day}
              </div>
            ))}
          </div>

          {}
          <div className="grid grid-cols-7">
            {days.map((date, index) => (
              <motion.div
                key={`day-${index}`}
                whileHover={date ? { scale: 1.05 } : {}}
                onClick={() => handleDateClick(date)}
                className={`
                  min-h-[120px] p-2 border-b border-r border-gray-200 cursor-pointer transition-all duration-200
                  ${date ? 'hover:bg-blue-50' : 'bg-gray-50'}
                  ${isToday(date) ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
                  ${hasEvents(date) ? 'bg-gradient-to-br from-purple-50 to-blue-50' : ''}
                `}
              >
                {date && (
                  <>
                    <div className={`
                      text-sm font-semibold mb-2
                      ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}
                    `}>
                      {date.getDate()}
                    </div>
                    
                    {}
                    <div className="space-y-1">
                      {getEventsByDate(date).slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`
                            text-xs px-2 py-1 rounded text-white truncate
                            ${getEventTypeColor(event.type)}
                          `}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {getEventsByDate(date).length > 3 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{getEventsByDate(date).length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { type: 'exam', label: 'Examinations' },
              { type: 'holiday', label: 'Holidays' },
              { type: 'competition', label: 'Competitions' },
              { type: 'function', label: 'Functions' },
              { type: 'sports', label: 'Sports' },
              { type: 'activity', label: 'Activities' }
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${getEventTypeColor(type)}`}></div>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {}
        {showEventModal && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-4 h-4 rounded-full mt-2 ${getEventTypeColor(event.type)}`}></div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h4>
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>All Day</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getEventTypeColor(event.type)}`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MonthlyPlanner;