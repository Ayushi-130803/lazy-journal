import React from 'react';

function MoodSlider({ value, onChange }) {
  // Function to get a color based on the slider value for gradient effect
  const getColor = (val) => {
    // Simple linear interpolation from red (0) to green (100)
    const red = Math.floor(255 * (1 - val / 100));
    const green = Math.floor(255 * (val / 100));
    return `rgb(${red}, ${green}, 0)`; // Keep blue at 0 for a red-green spectrum
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-gray-600 dark:text-gray-400 text-sm">Low</span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
        // Inline style for the track to show a gradient based on the current value
        style={{
          background: `linear-gradient(to right, ${getColor(0)}, ${getColor(value)}, ${getColor(100)})`,
          // Override default browser styles for range input track
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
        }}
      />
      <span className="text-gray-600 dark:text-gray-400 text-sm">High</span>
      <span className="text-gray-800 dark:text-gray-200 font-semibold w-8 text-right">{value}</span>
    </div>
  );
}

export default MoodSlider;