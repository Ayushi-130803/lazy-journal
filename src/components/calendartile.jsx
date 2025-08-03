import React from 'react';

function CalendarTile({ day, moodData, isToday, isMissed, hasEntry, isDarkMode }) {
  const baseBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  const emptyTileBgClass = 'bg-transparent';

  let moodBgClass = '';
  let moodTextColorClass = '';
  let moodIndicator = null;

  if (hasEntry && moodData) {
    if (moodData.mood === 'happy') {
      moodBgClass = 'bg-green-600/60 dark:bg-green-700/60';
      moodTextColorClass = 'text-white';
      moodIndicator = <div className="flex justify-center mt-1">
        <span className="h-2 w-2 rounded-full bg-green-300 mx-0.5"></span>
      </div>;
    } else if (moodData.mood === 'sad') {
      moodBgClass = 'bg-blue-600/60 dark:bg-blue-700/60';
      moodTextColorClass = 'text-white';
      moodIndicator = <div className="flex justify-center mt-1">
        <span className="h-2 w-2 rounded-full bg-blue-300 mx-0.5"></span>
      </div>;
    } else if (moodData.mood === 'angry') {
      moodBgClass = 'bg-red-600/60 dark:bg-red-700/60';
      moodTextColorClass = 'text-white';
      moodIndicator = <div className="flex justify-center mt-1">
        <span className="h-2 w-2 rounded-full bg-red-300 mx-0.5"></span>
      </div>;
    } else {
      moodBgClass = 'bg-gray-500/60 dark:bg-gray-600/60';
      moodTextColorClass = 'text-white';
      moodIndicator = <div className="flex justify-center mt-1">
        <span className="h-2 w-2 rounded-full bg-gray-300 mx-0.5"></span>
      </div>;
    }
  }

  const tileClasses = `
    relative
    flex flex-col items-center justify-center
    p-1
    rounded-lg
    aspect-square
    transition-all duration-300
    ${day ? 'cursor-pointer' : 'pointer-events-none'}
    ${day ? (hasEntry ? moodBgClass : `${baseBgClass}/50 backdrop-blur-sm`) : emptyTileBgClass}
    ${day ? (hasEntry ? moodTextColorClass : isDarkMode ? 'text-white' : 'text-gray-800') : 'text-transparent'}
    ${isToday ? 'border-2 border-indigo-500 ring-2 ring-indigo-500' : ''}
    ${isMissed ? 'bg-red-900/30 text-red-300 border border-red-700' : ''}
    ${day ? 'hover:scale-105 hover:shadow-lg' : ''}
  `;

  return (
    <div className={tileClasses}>
      {day && (
        <>
          <span className="text-sm font-semibold">{day}</span>
          {moodIndicator}
        </>
      )}
    </div>
  );
}

export default CalendarTile;