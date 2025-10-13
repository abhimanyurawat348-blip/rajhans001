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


const sampleEvents: Event[] = [
  
  { id: 'e-2025-04-14', title: 'Investiture Ceremony', description: 'Student leadership investiture ceremony', date: new Date(2025, 3, 14), type: 'function' },
  { id: 'e-2025-05-13', title: "Mother's Day Celebration", description: "Celebrating Mother's Day", date: new Date(2025, 4, 13), type: 'function' },
  { id: 'e-2025-05-20', title: 'School Picnic', description: 'School picnic for students', date: new Date(2025, 4, 20), type: 'activity' },
  { id: 'e-2025-05-24', title: 'Summer Vacation Starts (PG-9 & 11)', description: 'Vacation begins for classes PG to 9th and 11th', date: new Date(2025, 4, 24), type: 'holiday' },
  { id: 'e-2025-05-30', title: 'Summer Vacation Starts (10 & 12)', description: 'Vacation begins for classes 10th and 12th', date: new Date(2025, 4, 30), type: 'holiday' },
  { id: 'e-2025-07-01', title: 'School Reopens', description: 'School reopens after summer vacation', date: new Date(2025, 6, 1), type: 'function' },
  { id: 'e-2025-07-08', title: 'Interhouse Activity', description: 'Interhouse competitions and activities', date: new Date(2025, 6, 8), type: 'activity' },
  { id: 'e-2025-07-13', title: 'Student Activity', description: 'Student activities', date: new Date(2025, 6, 13), type: 'activity' },
  { id: 'e-2025-07-28', title: 'Kargil Vijay Diwas', description: 'Commemoration of Kargil Vijay Diwas', date: new Date(2025, 6, 28), type: 'function' },
  { id: 'e-2025-08-15', title: 'Independence Day Celebration', description: 'Independence Day celebration', date: new Date(2025, 7, 15), type: 'function' },
  { id: 'e-2025-08-28', title: 'Students Extempore', description: 'Students extempore competition', date: new Date(2025, 7, 28), type: 'competition' },
  { id: 'e-2025-09-04', title: "Teachers' Day Celebration", description: "Celebrating Teachers' Day", date: new Date(2025, 8, 4), type: 'function' },
  { id: 'e-2025-09-15', title: 'Half-Yearly Exams Start', description: 'Half-yearly examinations begin', date: new Date(2025, 8, 15), type: 'exam' },
  { id: 'e-2025-09-27', title: 'Half-Yearly Exams Over', description: 'Half-yearly examinations end', date: new Date(2025, 8, 27), type: 'exam' },
  { id: 'e-2025-09-30', title: 'Dussehra Celebration', description: 'Dussehra celebration in school', date: new Date(2025, 8, 30), type: 'function' },
  { id: 'e-2025-10-03', title: 'Gandhi Jayanti Celebration', description: 'Commemoration of Gandhi Jayanti', date: new Date(2025, 9, 3), type: 'function' },
  { id: 'e-2025-10-18', title: 'Diwali Celebrations and Competitions', description: 'Diwali celebrations with competitions', date: new Date(2025, 9, 18), type: 'function' },
  { id: 'e-2025-10-30', title: 'Sports Day', description: 'Annual Sports Day', date: new Date(2025, 9, 30), type: 'sports' },
  { id: 'e-2025-11-09', title: 'Uttarakhand Sthapna Diwas', description: 'State Foundation Day celebration', date: new Date(2025, 10, 9), type: 'function' },
  { id: 'e-2025-11-14', title: "Children's Day Celebration", description: "Celebrating Children's Day", date: new Date(2025, 10, 14), type: 'function' },
  { id: 'e-2025-12-04', title: 'Pre-Board Exams Start', description: 'Pre-board examinations begin', date: new Date(2025, 11, 4), type: 'exam' },
  { id: 'e-2025-12-18', title: 'Pre-Board Exams Over', description: 'Pre-board examinations end', date: new Date(2025, 11, 18), type: 'exam' },
  { id: 'e-2025-12-25', title: 'School Fest', description: 'Annual school fest', date: new Date(2025, 11, 25), type: 'function' },
  { id: 'e-2025-12-26', title: 'School Closes', description: 'School closes for winter break', date: new Date(2025, 11, 26), type: 'holiday' },
  
  { id: 'e-2026-01-26', title: 'Republic Day Celebration', description: 'Republic Day celebration', date: new Date(2026, 0, 26), type: 'function' },
  { id: 'e-2026-01-30', title: 'Farewell', description: 'Farewell ceremony for graduating students', date: new Date(2026, 0, 30), type: 'function' },
  { id: 'e-2026-01-31', title: 'Good Luck Party', description: 'Good luck party for board candidates', date: new Date(2026, 0, 31), type: 'function' },
  { id: 'e-2026-02-13', title: 'Science Exhibition', description: 'Science exhibition', date: new Date(2026, 1, 13), type: 'competition' },
  { id: 'e-2026-02-17', title: 'Board Exams Start', description: 'Board examinations begin', date: new Date(2026, 1, 17), type: 'exam' },
  { id: 'e-2026-02-26', title: 'Final Exams Start', description: 'Final examinations begin', date: new Date(2026, 1, 26), type: 'exam' },
  { id: 'e-2026-03-28', title: 'Final Exam Results Declared', description: 'Results declared for final exams', date: new Date(2026, 2, 28), type: 'function' }
];

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents((prev: Event[]) => [...prev, newEvent]);
  };

  const getEventsByMonth = (year: number, month: number) => {
    return events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const getEventsByDate = (date: Date) => {
    return events.filter((event: Event) => {
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