import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay,
  parseISO 
} from 'date-fns';

const EventCalendar = ({ events, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = getEventsForDate(day);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day}
            onClick={() => onDateSelect(cloneDay)}
            className={`min-h-[80px] p-2 border border-gray-200 cursor-pointer transition-colors ${
              !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-blue-50'
            } ${isSelected ? 'bg-blue-100 border-blue-500' : ''} ${
              isToday ? 'border-2 border-indigo-600' : ''
            }`}
          >
            <div className={`text-sm font-semibold ${isToday ? 'text-indigo-600' : ''}`}>
              {format(day, 'd')}
            </div>
            {dayEvents.length > 0 && (
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event, index) => (
                  <div
                    key={index}
                    className="text-xs bg-indigo-600 text-white rounded px-1 py-0.5 truncate"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-600">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-2">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default EventCalendar;

