import React from 'react';

function MoodSlider({ value, onChange, isDarkMode }) {
  // Function to determine the background gradient based on the slider value
  const getTrackBackground = (val) => {
    const numericVal = typeof val === 'number' ? val : 0;

    // Define base colors for the gradient (Red -> Yellow -> Green)
    const redHue = 0;
    const yellowHue = 60;
    const greenHue = 120;

    // Adjust saturation and lightness based on dark mode for better visibility
    const baseSaturation = 80;
    const baseLightness = isDarkMode ? 50 : 60; // Slightly darker for dark mode

    // Calculate current hue based on value, interpolating through yellow
    let currentHue;
    if (numericVal <= 50) {
      // Interpolate from red to yellow for the first half (0-50)
      currentHue = redHue + (numericVal / 50) * (yellowHue - redHue);
    } else {
      // Interpolate from yellow to green for the second half (50-100)
      currentHue = yellowHue + ((numericVal - 50) / 50) * (greenHue - yellowHue);
    }

    // The color at the current thumb position
    const currentColor = `hsl(${currentHue}, ${baseSaturation}%, ${baseLightness}%)`;

    // The color for the "unfilled" part of the track
    const unfilledColor = isDarkMode ? 'hsl(0, 0%, 25%)' : 'hsl(0, 0%, 75%)'; // Darker gray for dark mode, lighter for light mode

    return `linear-gradient(to right, ${currentColor} ${numericVal}%, ${unfilledColor} ${numericVal}%)`;
  };

  // Function to get a cuter, more connecting emoji based on the slider's value
  const getEmojiForValue = (val) => {
    if (val < 10) return '😩'; // Exhausted/Overwhelmed
    if (val < 30) return '😟'; // Worried/Anxious
    if (val < 50) return '😐'; // Neutral/Meh
    if (val < 70) return '😊'; // Content/Happy
    if (val < 90) return '😄'; // Joyful/Excited
    return '🤩'; // Amazed/Fantastic
  };

  return (
    <div className="flex items-center space-x-3 w-full">
      {/* Dynamic Emoji next to the slider */}
      <span className="text-3xl transition-transform duration-200 transform hover:scale-110" role="img" aria-label="mood emoji">
        {getEmojiForValue(value)}
      </span>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="flex-grow h-3 rounded-full appearance-none cursor-pointer focus:outline-none
                   /* Custom track styles - Background is handled by style prop */
                   [&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:rounded-full
                   [&::-webkit-slider-runnable-track]:shadow-inner
                   [&::-webkit-slider-runnable-track]:transition-colors [&::-webkit-slider-runnable-track]:duration-300
                   
                   /* Custom thumb styles */
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 dark:[&::-webkit-slider-thumb]:bg-indigo-400
                   [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:-mt-[6px] /* Adjust thumb position */
                   [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:duration-300
                   [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-125
                   "
        style={{
          background: getTrackBackground(value), // Apply the dynamic gradient to the track
        }}
      />

      {/* Display numeric value */}
      <span className="text-gray-800 dark:text-gray-200 font-semibold w-8 text-right">{value}</span>
    </div>
  );
}

export default MoodSlider;
