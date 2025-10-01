import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '../contexts/EventContext';
import { Calendar, Clock, MapPin, Filter, Search } from 'lucide-react';

const YearlyPlanner: React.FC = () => {
  const { events } = useEvents();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const eventTypes = [
    { value: 'all', label: 'All Events', color: 'bg-gray-500' },
    { value: 'exam', label: 'Examinations', color: 'bg-red-500' },
    { value: 'holiday', label: 'Holidays', color: 'bg-green-500' },
    { value: 'competition', label: 'Competitions', color: 'bg-blue-500' },
    { value: 'function', label: 'Functions', color: 'bg-purple-500' },
    { value: 'sports', label: 'Sports', color: 'bg-orange-500' },
    { value: 'activity', label: 'Activities', color: 'bg-pink-500' }
  ];

  const filteredEvents = events
    .filter(event => selectedType === 'all' || event.type === selectedType)
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(t => t.value === type);
    return eventType?.color || 'bg-gray-500';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthName = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Group events by month
  const eventsByMonth = filteredEvents.reduce((acc, event) => {
    const monthKey = getMonthName(event.date);
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, typeof filteredEvents>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Year Planner</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay organized with our comprehensive yearly overview of all academic events, examinations, and activities.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Event Type Legend */}
          <div className="mt-6 flex flex-wrap gap-3">
            {eventTypes.slice(1).map(type => (
              <div key={type.value} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                <span className="text-sm text-gray-600">{type.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Events Timeline */}
        <div className="space-y-8">
          {Object.entries(eventsByMonth).map(([month, monthEvents], monthIndex) => (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * monthIndex }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <h2 className="text-2xl font-bold">{month}</h2>
                <p className="opacity-90">{monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {monthEvents.map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * eventIndex }}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className={`${getEventTypeColor(event.type)} w-4 h-4 rounded-full mt-2 flex-shrink-0`}></div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-3">{event.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 lg:mt-0 lg:ml-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getEventTypeColor(event.type)}`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default YearlyPlanner;