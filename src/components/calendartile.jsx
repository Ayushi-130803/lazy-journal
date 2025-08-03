import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'; // Solid icons for visual pop

function CalendarTile({ day, moodData, isToday, isMissed, hasEntry }) { // Removed isDarkMode from props as it's not directly used here
  // Function to determine the background gradient based on mood and intensity
  const getBackgroundGradient = (mood, intensity) => { // Removed isDark parameter
    // Ensure mood and intensity are valid before using
    const safeMood = mood || 'neutral'; // Default to 'neutral' if mood is undefined/null
    const safeIntensity = typeof intensity === 'number' ? intensity : 50; // Default to 50 if intensity is not a number

    // Define softer/cuter base colors for different moods
    const moodColors = {
      happy: { start: '#FFECB3', end: '#FFD54F' }, // Pale Yellow to Muted Gold
      sad: { start: '#BBDEFB', end: '#90CAF9' },   // Light Blue to Soft Blue
      neutral: { start: '#CFD8DC', end: '#B0BEC5' }, // Light Gray-Blue to Medium Gray-Blue
      angry: { start: '#FFCDD2', end: '#EF9A9A' }, // Pale Red to Soft Red
      calm: { start: '#C8E6C9', end: '#A5D6A7' },  // Pale Green to Soft Green
      anxious: { start: '#FFE0B2', end: '#FFCC80' }, // Pale Orange to Soft Orange
    };

    const colors = moodColors[safeMood] || { start: '#E0E0E0', end: '#BDBDBD' }; // Default soft gray for unknown mood

    // Adjust saturation/lightness based on intensity for a subtle effect
    // We'll use HSL for easier manipulation. Convert RGB to HSL, adjust, then back to RGB.
    // For simplicity, let's just make the gradient slightly more vibrant/darker with higher intensity
    // by blending more towards the 'end' color.
    const blendFactor = safeIntensity / 100; // 0 to 1

    const startR = parseInt(colors.start.slice(1, 3), 16);
    const startG = parseInt(colors.start.slice(3, 5), 16);
    const startB = parseInt(colors.start.slice(5, 7), 16);

    const endR = parseInt(colors.end.slice(1, 3), 16);
    const endG = parseInt(colors.end.slice(3, 5), 16);
    const endB = parseInt(colors.end.slice(5, 7), 16);

    // Simple linear interpolation for color components based on intensity
    const interpolatedStartR = Math.round(startR * (1 - blendFactor) + endR * blendFactor * 0.5); // Blend start less
    const interpolatedStartG = Math.round(startG * (1 - blendFactor) + endG * blendFactor * 0.5);
    const interpolatedStartB = Math.round(startB * (1 - blendFactor) + endB * blendFactor * 0.5);

    const interpolatedEndR = Math.round(endR * (1 - blendFactor * 0.5) + startR * blendFactor * 0.5); // Blend end more
    const interpolatedEndG = Math.round(endG * (1 - blendFactor * 0.5) + startG * blendFactor * 0.5);
    const interpolatedEndB = Math.round(endB * (1 - blendFactor * 0.5) + startB * blendFactor * 0.5);


    const finalStartColor = `rgb(${interpolatedStartR}, ${interpolatedStartG}, ${interpolatedStartB})`;
    const finalEndColor = `rgb(${interpolatedEndR}, ${interpolatedEndG}, ${interpolatedEndB})`;

    return `linear-gradient(to bottom right, ${finalStartColor}, ${finalEndColor})`;
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center aspect-square rounded-lg p-2 text-lg font-semibold border-2 cursor-pointer
        ${day === null ? 'bg-transparent border-transparent' : ''}
        ${isToday ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500 dark:ring-indigo-400' : ''}
        ${hasEntry ? 'text-gray-900 dark:text-gray-900 shadow-md' : 'text-gray-800 dark:text-gray-200'}
        ${isMissed ? 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700' : ''}
        overflow-hidden transition-all duration-200 hover:scale-105`}
      style={hasEntry ? { background: getBackgroundGradient(moodData?.mood, moodData?.intensity) } : {}} // Removed isDarkMode from call
    >
      {day && (
        <>
          <span className={`relative z-10 text-xl ${hasEntry ? 'text-gray-900 dark:text-gray-900' : 'text-gray-800 dark:text-gray-200'}`}>
            {day}
          </span>
          {/* Visual indicator for entry/missed */}
          {hasEntry && (
            <CheckCircleIcon className="absolute bottom-1 right-1 h-5 w-5 text-green-700 opacity-80 z-10" />
          )}
          {isMissed && (
            <XCircleIcon className="absolute bottom-1 right-1 h-5 w-5 text-red-700 opacity-80 z-10" />
          )}
        </>
      )}
      {/* Overlay for blank/grayed out days if no entry AND not a missed day (i.e., future or current day with no entry yet) */}
      {day !== null && !hasEntry && !isMissed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 rounded-lg">
          <span className="text-gray-400 dark:text-gray-500 text-xs"></span>
        </div>
      )}
    </div>
  );
}

export default CalendarTile;