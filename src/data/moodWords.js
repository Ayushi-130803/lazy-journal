// This file manages the mood words data and helper functions for color classes.

// Define initial default mood words.
// 'baseColor' should correspond to a valid Tailwind CSS color name (e.g., 'red', 'blue', 'green').
export const initialMoodWords = [
  { id: 'happy', word: 'Happy', baseColor: 'green' },
  { id: 'calm', word: 'Calm', baseColor: 'blue' },
  { id: 'energetic', word: 'Energetic', baseColor: 'yellow' },
  { id: 'sad', word: 'Sad', baseColor: 'purple' },
  { id: 'stressed', word: 'Stressed', baseColor: 'red' },
  { id: 'excited', word: 'Excited', baseColor: 'pink' },
  { id: 'relaxed', word: 'Relaxed', baseColor: 'teal' },
];

// Helper function to get Tailwind color class based on baseColor and intensity.
// Intensity (1-4) maps to Tailwind shades (200, 400, 600, 800) for background.
export const getMoodBgColorClass = (baseColor, intensity) => {
  const shades = {
    1: '200', // 25% intensity
    2: '400', // 50% intensity
    3: '600', // 75% intensity
    4: '800', // 100% intensity
  };
  // Default to 500 if intensity is invalid or not provided
  return `bg-${baseColor}-${shades[intensity] || '500'}`;
};

// Helper function to get Tailwind text color class for contrast.
// For lighter backgrounds (lower intensity), use darker text.
// For darker backgrounds (higher intensity), use lighter text.
export const getMoodTextColorClass = (baseColor, intensity) => {
  const shades = {
    1: '800', // Darker text for lighter backgrounds
    2: '800',
    3: '100', // Lighter text for darker backgrounds
    4: '100',
  };
  return `text-${baseColor}-${shades[intensity] || '500'}`;
};

// Helper function to get Tailwind accent color for the slider thumb.
export const getMoodAccentColorClass = (baseColor) => {
  return `accent-${baseColor}-500`;
};
