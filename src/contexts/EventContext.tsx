import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event } from '../types';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  getEventsByMonth: (year: number, month: number) => Event[];
  getEventsByDate: (date: Date) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// Sample events data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Sports Day',
    description: 'Inter-house sports competition with various athletic events',
    date: new Date(2025, 2, 15), // March 15, 2025
    type: 'sports',
    location: 'School Ground'
  },
  {
    id: '2',
    title: 'Mid-term Examinations',
    description: 'Half-yearly examinations for all classes',
    date: new Date(2025, 8, 20), // September 20, 2025
    type: 'exam',
    location: 'All Classrooms'
  },
  {
    id: '3',
    title: 'Cultural Festival',
    description: 'Annual cultural program showcasing student talents',
    date: new Date(2025, 11, 10), // December 10, 2025
    type: 'function',
    location: 'School Auditorium'
  },
  {
    id: '4',
    title: 'Science Exhibition',
    description: 'Student science projects and experiments display',
    date: new Date(2025, 1, 28), // February 28, 2025
    type: 'competition',
    location: 'Science Lab'
  },
  {
    id: '5',
    title: 'Diwali Holiday',
    description: 'Festival of lights celebration break',
    date: new Date(2025, 10, 1), // November 1, 2025
    type: 'holiday'
  }
];

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const getEventsByMonth = (year: number, month: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const getEventsByDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      getEventsByMonth,
      getEventsByDate
    }}>
      {children}
    </EventContext.Provider>
  );
};