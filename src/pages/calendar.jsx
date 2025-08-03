import React, { useState } from 'react';
import CalendarTile from '../components/CalendarTile';

function Calendar({ journalEntries, isDarkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Get first day of the month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Get number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map journal entries to a quick lookup object for the current month
  const entriesForMonth = journalEntries.reduce((acc, entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
      const day = entryDate.getDate();
      const emotionalStateEntry = entry.entryDetails.find(detail => detail.promptId === 'emotionalState');
      const moodValue = emotionalStateEntry ? emotionalStateEntry.moodValue : 50;
      const moodText = emotionalStateEntry ? emotionalStateEntry.entryText : '';

      // Simple categorization based on keywords for the calendar tile
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

  // Helper to get mood data for a specific date
  const getMoodForDate = (day) => {
    return entriesForMonth[day] || null;
  };

  // Function to get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  // Generate an array of days for the calendar grid
  const days = [];
  // Add leading blank tiles for the days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Add actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        <span role="img" aria-label="calendar icon" className="mr-2">
          📅
        </span>
        Mood Calendar
      </h2>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
        >
          &lt;
        </button>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {getMonthName(currentDate)} {year}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
        >
          &gt;
        </button>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center font-medium text-gray-600 dark:text-gray-400">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const moodData = day ? getMoodForDate(day) : null;
          const today = new Date();
          const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
          const isPastDay = day && isCurrentMonth && day < today.getDate();
          const hasEntry = !!moodData;
          const isMissed = day && isPastDay && !hasEntry; // A day is missed if it's in the past and has no entry

          return (
            <CalendarTile
              key={index}
              day={day}
              moodData={moodData}
              isToday={day && isCurrentMonth && day === today.getDate()}
              isMissed={isMissed}
              hasEntry={hasEntry} // Explicitly pass hasEntry
              isDarkMode={isDarkMode} // Pass isDarkMode for consistent styling
            />
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;