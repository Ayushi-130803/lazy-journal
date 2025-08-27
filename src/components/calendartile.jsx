import React from 'react';
import { getMoodBgColorClass, getRgbValueFromTailwindClass } from '../data/moodWords';

function CalendarTile({ day, entry, isToday, isMissed, hasEntry, isDarkMode, onTileClick }) { // REINSTATED: isMissed prop
  const baseBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  const emptyTileBgClass = 'bg-transparent';

  let moodIndicator = null;
  let tileBgStyle = {};

  if (hasEntry && entry?.moods && Array.isArray(entry.moods) && entry.moods.length > 0) {
    const moods = [...entry.moods];
    moods.sort((a, b) => (b.intensity || 0) - (a.intensity || 0));

    const totalIntensity = moods.reduce((sum, m) => sum + (m.intensity || 0), 0);

    if (totalIntensity > 0) {
      let gradientParts = [];
      let currentPosition = 0;

      moods.forEach((moodItem, index) => {
        const baseColor = moodItem.mood?.baseColor || 'gray';
        const intensity = moodItem.intensity || 1;

        const proportion = intensity / totalIntensity;
        const startShadeClass = getMoodBgColorClass(baseColor, 1);
        const endShadeClass = getMoodBgColorClass(baseColor, 4);

        const startRgb = getRgbValueFromTailwindClass(startShadeClass);
        const endRgb = getRgbValueFromTailwindClass(endShadeClass);

        const nextPosition = currentPosition + (proportion * 100);

        if (index === 0) {
            gradientParts.push(`rgb(${startRgb}) ${currentPosition}%`);
        } else {
            const prevMoodEndBaseColor = moods[index-1].mood?.baseColor || 'gray';
            const prevMoodEndRgb = getRgbValueFromTailwindClass(getMoodBgColorClass(prevMoodEndBaseColor, 4));
            gradientParts.push(`rgb(${prevMoodEndRgb}) ${currentPosition}%`);
            gradientParts.push(`rgb(${startRgb}) ${currentPosition}%`);
        }
        
        gradientParts.push(`rgb(${endRgb}) ${nextPosition}%`);

        currentPosition = nextPosition;
      });

      tileBgStyle.background = `linear-gradient(to bottom right, ${gradientParts.join(', ')})`;

      moodIndicator = (
          <div className="flex justify-center flex-wrap mt-1 gap-0.5">
              {moods.map((moodItem, idx) => (
                  <span
                      key={moodItem.mood?.id || idx}
                      className={`h-2 w-2 rounded-full`}
                      style={{ backgroundColor: `rgb(${getRgbValueFromTailwindClass(getMoodBgColorClass(moodItem.mood?.baseColor || 'gray', moodItem.intensity || 1))})` }}
                  ></span>
              ))}
          </div>
      );
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
    ${day && !hasEntry ? `${baseBgClass}/50 backdrop-blur-sm` : emptyTileBgClass}
    ${day ? (isDarkMode ? 'dark:text-white' : 'text-gray-800') : 'text-transparent'}
    ${isToday ? 'border-2 border-indigo-500 ring-2 ring-indigo-500' : ''}
    ${isMissed ? 'bg-red-900/30 text-red-300 border border-red-700' : ''} {/* REINSTATED: isMissed styling */}
    ${day ? 'hover:scale-105 hover:shadow-lg' : ''}
  `;

  return (
    <div
      className={tileClasses}
      onClick={() => day && hasEntry && onTileClick(day)}
      style={hasEntry && entry?.moods && Array.isArray(entry.moods) && entry.moods.length > 0 ? tileBgStyle : {}}
    >
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