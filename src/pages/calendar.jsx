import React, { useState } from 'react';
import CalendarTile from '../components/calendartile';

function Calendar({ journalEntries, isDarkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const entriesForMonth = journalEntries.reduce((acc, entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
      const day = entryDate.getDate();
      const emotionalStateEntry = entry.entryDetails.find(detail => detail.promptId === 'emotionalState');
      const moodValue = emotionalStateEntry ? emotionalStateEntry.moodValue : 50;
      const moodText = emotionalStateEntry ? emotionalStateEntry.entryText : '';

      let moodCategory = 'neutral';
      const lowerCaseText = moodText.toLowerCase();

      if (lowerCaseText.includes('happy') || lowerCaseText.includes('joy') || lowerCaseText.includes('great') || lowerCaseText.includes('good') || lowerCaseText.includes('excited')) {
        moodCategory = 'happy';
      } else if (lowerCaseText.includes('sad') || lowerCaseText.includes('down') || lowerCaseText.includes('unhappy') || lowerCaseText.includes('lonely')) {
        moodCategory = 'sad';
      } else if (lowerCaseText.includes('angry') || lowerCaseText.includes('frustrated') || lowerCaseText.includes('annoyed')) {
        moodCategory = 'angry';
      } else if (lowerCaseText.includes('calm') || lowerCaseText.includes('peaceful') || lowerCaseText.includes('relaxed')) {
        moodCategory = 'calm';
      } else if (lowerCaseText.includes('anxious') || lowerCaseText.includes('stressed') || lowerCaseText.includes('worried')) {
        moodCategory = 'anxious';
      }

      acc[day] = { mood: moodCategory, intensity: moodValue };
    }
    return acc;
  }, {});
  
  const getMoodForDate = (day) => {
    return entriesForMonth[day] || null;
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-xl mx-auto font-sans">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 min-h-[70vh] transition-all duration-300">
        <h2 className="text-lg font-bold mb-2 text-center text-gray-800 dark:text-gray-200">
          <span role="img" aria-label="calendar icon" className="mr-2">
            📅
          </span>
          Mood Calendar
        </h2>

        <div className="flex justify-between items-center mb-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            &lt;
          </button>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            {getMonthName(currentDate)} {year}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((dayName) => (
            <div key={dayName} className="text-center font-medium text-gray-600 dark:text-gray-400 text-xs">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 h-full">
          {days.map((day, index) => {
            const moodData = day ? getMoodForDate(day) : null;
            const today = new Date();
            const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
            const isPastDay = day && isCurrentMonth && day < today.getDate();
            const hasEntry = !!moodData;
            const isMissed = day && isPastDay && !hasEntry;

            return (
              <CalendarTile
                key={index}
                day={day}
                moodData={moodData}
                isToday={day && isCurrentMonth && day === today.getDate()}
                isMissed={isMissed}
                hasEntry={hasEntry}
                isDarkMode={isDarkMode}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;