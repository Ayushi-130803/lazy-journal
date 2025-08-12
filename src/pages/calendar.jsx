import React, { useState } from 'react';
import CalendarTile from '../components/Calendartile';

function Calendar({ journalEntries, isDarkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Helper function to map mood words to base colors, assuming a simple data structure
  const getMoodColor = (moodWord) => {
    switch (moodWord.toLowerCase()) {
      case 'happy': return 'green';
      case 'joyful': return 'green';
      case 'excited': return 'green';
      case 'sad': return 'red';
      case 'down': return 'red';
      case 'unhappy': return 'red';
      case 'angry': return 'red';
      case 'frustrated': return 'red';
      case 'anxious': return 'orange';
      case 'stressed': return 'orange';
      case 'calm': return 'blue';
      case 'peaceful': return 'blue';
      case 'relaxed': return 'blue';
      default: return 'gray';
    }
  };

  const entriesForMonth = journalEntries.reduce((acc, entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
      const day = entryDate.getDate();
      
      // Filter for all emotional state entries for this day
      const emotionalStateEntries = entry.entryDetails.filter(detail => detail.promptId === 'emotionalState');

      if (emotionalStateEntries.length > 0) {
        // Collect all mood data and calculate the total intensity
        let totalIntensity = 0;
        const moodsWithIntensity = emotionalStateEntries.map(detail => {
          const moodValue = detail.moodValue || 50; // Use a default if not present
          totalIntensity += moodValue;
          return {
            mood: detail.mood, // This should be the mood word (e.g., 'joyful')
            intensity: moodValue
          };
        });

        // Calculate the percentage for each mood
        const moodsWithPercentage = moodsWithIntensity.map(mood => ({
          mood: mood.mood,
          color: getMoodColor(mood.mood),
          percentage: totalIntensity > 0 ? (mood.intensity / totalIntensity) * 100 : 0
        }));

        acc[day] = moodsWithPercentage;
      }
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
            const hasEntry = !!moodData && moodData.length > 0;
            const isMissed = day && isPastDay && !hasEntry;

            return (
              <CalendarTile
                key={index}
                day={day}
                moodData={moodData} // This is now an array of moods and percentages
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