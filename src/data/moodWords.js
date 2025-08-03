// src/data/moodWords.js

export const initialMoodWords = [
  { id: 'happy', word: 'Happy', baseColor: 'green' },
  { id: 'calm', word: 'Calm', baseColor: 'blue' },
  { id: 'energetic', word: 'Energetic', baseColor: 'yellow' },
  { id: 'sad', word: 'Sad', baseColor: 'purple' },
  { id: 'stressed', word: 'Stressed', baseColor: 'red' },
  { id: 'excited', word: 'Excited', baseColor: 'pink' },
  { id: 'relaxed', word: 'Relaxed', baseColor: 'teal' },
];

export const tailwindColorOptions = [
  'red', 'orange', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'gray', 'slate', 'zinc', 'neutral', 'stone',
];

const colorShades = {
  // ... (colorShades object remains the same)
  green: {
    bg: ['bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'],
    text: ['text-green-800', 'text-green-800', 'text-white', 'text-white'],
  },
  blue: {
    bg: ['bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'],
    text: ['text-blue-800', 'text-blue-800', 'text-white', 'text-white'],
  },
  yellow: {
    bg: ['bg-yellow-200', 'bg-yellow-400', 'bg-yellow-600', 'bg-yellow-800'],
    text: ['text-yellow-800', 'text-yellow-800', 'text-white', 'text-white'],
  },
  purple: {
    bg: ['bg-purple-200', 'bg-purple-400', 'bg-purple-600', 'bg-purple-800'],
    text: ['text-purple-800', 'text-purple-800', 'text-white', 'text-white'],
  },
  red: {
    bg: ['bg-red-200', 'bg-red-400', 'bg-red-600', 'bg-red-800'],
    text: ['text-red-800', 'text-red-800', 'text-white', 'text-white'],
  },
  pink: {
    bg: ['bg-pink-200', 'bg-pink-400', 'bg-pink-600', 'bg-pink-800'],
    text: ['text-pink-800', 'text-pink-800', 'text-white', 'text-white'],
  },
  teal: {
    bg: ['bg-teal-200', 'bg-teal-400', 'bg-teal-600', 'bg-teal-800'],
    text: ['text-teal-800', 'text-teal-800', 'text-white', 'text-white'],
  },
  indigo: {
    bg: ['bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600', 'bg-indigo-800'],
    text: ['text-indigo-800', 'text-indigo-800', 'text-white', 'text-white'],
  },
  orange: {
    bg: ['bg-orange-200', 'bg-orange-400', 'bg-orange-600', 'bg-orange-800'],
    text: ['text-orange-800', 'text-orange-800', 'text-white', 'text-white'],
  },
  lime: {
    bg: ['bg-lime-200', 'bg-lime-400', 'bg-lime-600', 'bg-lime-800'],
    text: ['text-lime-800', 'text-lime-800', 'text-white', 'text-white'],
  },
  cyan: {
    bg: ['bg-cyan-200', 'bg-cyan-400', 'bg-cyan-600', 'bg-cyan-800'],
    text: ['text-cyan-800', 'text-cyan-800', 'text-white', 'text-white'],
  },
  emerald: {
    bg: ['bg-emerald-200', 'bg-emerald-400', 'bg-emerald-600', 'bg-emerald-800'],
    text: ['text-emerald-800', 'text-emerald-800', 'text-white', 'text-white'],
  },
  gray: {
    bg: ['bg-gray-200', 'bg-gray-400', 'bg-gray-600', 'bg-gray-800'],
    text: ['text-gray-800', 'text-gray-800', 'text-white', 'text-white'],
  },
  sky: {
    bg: ['bg-sky-200', 'bg-sky-400', 'bg-sky-600', 'bg-sky-800'],
    text: ['text-sky-800', 'text-sky-800', 'text-white', 'text-white'],
  },
  violet: {
    bg: ['bg-violet-200', 'bg-violet-400', 'bg-violet-600', 'bg-violet-800'],
    text: ['text-violet-800', 'text-violet-800', 'text-white', 'text-white'],
  },
  fuchsia: {
    bg: ['bg-fuchsia-200', 'bg-fuchsia-400', 'bg-fuchsia-600', 'bg-fuchsia-800'],
    text: ['text-fuchsia-800', 'text-fuchsia-800', 'text-white', 'text-white'],
  },
  rose: {
    bg: ['bg-rose-200', 'bg-rose-400', 'bg-rose-600', 'bg-rose-800'],
    text: ['text-rose-800', 'text-rose-800', 'text-white', 'text-white'],
  },
  slate: {
    bg: ['bg-slate-200', 'bg-slate-400', 'bg-slate-600', 'bg-slate-800'],
    text: ['text-slate-800', 'text-slate-800', 'text-white', 'text-white'],
  },
  zinc: {
    bg: ['bg-zinc-200', 'bg-zinc-400', 'bg-zinc-600', 'bg-zinc-800'],
    text: ['text-zinc-800', 'text-zinc-800', 'text-white', 'text-white'],
  },
  neutral: {
    bg: ['bg-neutral-200', 'bg-neutral-400', 'bg-neutral-600', 'bg-neutral-800'],
    text: ['text-neutral-800', 'text-neutral-800', 'text-white', 'text-white'],
  },
  stone: {
    bg: ['bg-stone-200', 'bg-stone-400', 'bg-stone-600', 'bg-stone-800'],
    text: ['text-stone-800', 'text-stone-800', 'text-white', 'text-white'],
  },
};

export const getMoodBgColorClass = (baseColor, intensity) => {
  const normalizedIntensity = Math.min(Math.max(intensity, 1), 4);
  return colorShades[baseColor]?.bg[normalizedIntensity - 1] || 'bg-gray-500';
};

export const getMoodTextColorClass = (baseColor, intensity) => {
  const normalizedIntensity = Math.min(Math.max(intensity, 1), 4);
  return colorShades[baseColor]?.text[normalizedIntensity - 1] || 'text-white';
};

export const getMoodAccentColorClass = (baseColor) => {
  return `accent-${baseColor}-500`;
};