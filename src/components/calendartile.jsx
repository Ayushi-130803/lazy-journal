import React from 'react';

const CalendarTile = ({ day, moodData, isToday, hasEntry, isMissed, isDarkMode }) => {
  const getMoodColorClass = () => {
    if (!moodData) return '';
    switch (moodData.mood) {
      case 'happy':
        return isDarkMode ? 'bg-green-600' : 'bg-green-400';
      case 'sad':
        return isDarkMode ? 'bg-red-600' : 'bg-red-400';
      case 'angry':
        return isDarkMode ? 'bg-red-800' : 'bg-red-600';
      case 'calm':
        return isDarkMode ? 'bg-blue-600' : 'bg-blue-400';
      case 'anxious':
        return isDarkMode ? 'bg-yellow-600' : 'bg-yellow-400';
      default:
        return isDarkMode ? 'bg-gray-500' : 'bg-gray-300';
    }
  };

  const tileClasses = `
    w-full h-16 rounded-md flex flex-col justify-center items-center text-xs font-medium relative transition-colors duration-200
    ${day ? '' : 'invisible'}
    ${isToday ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white') : ''}
    ${hasEntry && !isToday ? getMoodColorClass() + ' text-white' : ''}
    ${isMissed ? 'border-2 border-red-500' : ''}
    ${hasEntry && !isToday ? 'hover:scale-105 transform' : ''}
    ${!isToday && !hasEntry ? (isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-800') : ''}
  `;

  return (
    <div className={tileClasses}>
      {day}
    </div>
  );
};

export default CalendarTile;