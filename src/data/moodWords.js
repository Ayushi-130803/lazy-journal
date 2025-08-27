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

// This object maps a base color to an array of Tailwind background classes and text classes
// corresponding to intensities 1 (palest) to 4 (darkest).
const colorShades = {
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

// Comprehensive internal mapping of Tailwind color-shade names to RGB values.
// This is critical for dynamic inline styles where full class names cannot be used.
const tailwindRgbValues = {
  // Red
  'red-50': '254 242 242', 'red-100': '254 226 226', 'red-200': '254 205 211', 'red-300': '252 165 165', 'red-400': '248 113 113', 'red-500': '239 68 68', 'red-600': '220 38 38', 'red-700': '185 28 28', 'red-800': '153 27 27', 'red-900': '127 29 29', 'red-950': '69 10 10',
  // Blue
  'blue-50': '239 246 255', 'blue-100': '219 234 254', 'blue-200': '191 219 254', 'blue-300': '147 197 253', 'blue-400': '96 165 250', 'blue-500': '59 130 246', 'blue-600': '37 99 235', 'blue-700': '29 78 216', 'blue-800': '30 64 175', 'blue-900': '30 58 138', 'blue-950': '23 37 84',
  // Green
  'green-50': '240 253 244', 'green-100': '220 252 231', 'green-200': '187 247 208', 'green-300': '134 239 172', 'green-400': '74 222 128', 'green-500': '34 197 94', 'green-600': '22 163 74', 'green-700': '21 128 61', 'green-800': '34 139 34', 'green-900': '4 66 21', 'green-950': '2 44 10',
  // Yellow
  'yellow-50': '255 251 235', 'yellow-100': '254 249 195', 'yellow-200': '254 240 138', 'yellow-300': '253 224 71', 'yellow-400': '250 204 21', 'yellow-500': '234 179 8', 'yellow-600': '217 119 6', 'yellow-700': '161 98 7', 'yellow-800': '133 77 14', 'yellow-900': '113 63 18', 'yellow-950': '69 41 4',
  // Purple
  'purple-50': '250 245 255', 'purple-100': '243 232 255', 'purple-200': '233 213 255', 'purple-300': '221 178 247', 'purple-400': '192 132 252', 'purple-500': '168 85 247', 'purple-600': '139 92 246', 'purple-700': '126 34 206', 'purple-800': '91 33 182', 'purple-900': '76 29 149', 'purple-950': '49 11 81',
  // Pink
  'pink-50': '253 242 248', 'pink-100': '252 231 243', 'pink-200': '253 213 220', 'pink-300': '251 189 204', 'pink-400': '251 113 133', 'pink-500': '236 72 153', 'pink-600': '219 39 119', 'pink-700': '190 24 93', 'pink-800': '157 23 77', 'pink-900': '131 24 67', 'pink-950': '76 19 44',
  // Teal
  'teal-50': '240 253 250', 'teal-100': '204 251 241', 'teal-200': '153 246 228', 'teal-300': '99 246 200', 'teal-400': '45 212 191', 'teal-500': '20 184 166', 'teal-600': '13 148 136', 'teal-700': '15 118 107', 'teal-800': '17 94 89', 'teal-900': '19 78 74', 'teal-950': '8 47 45',
  // Indigo
  'indigo-50': '238 242 255', 'indigo-100': '224 231 255', 'indigo-200': '199 210 254', 'indigo-300': '165 180 252', 'indigo-400': '129 140 248', 'indigo-500': '99 102 241', 'indigo-600': '79 70 229', 'indigo-700': '67 56 202', 'indigo-800': '55 48 163', 'indigo-900': '49 46 129', 'indigo-950': '30 27 75',
  // Orange
  'orange-50': '255 247 237', 'orange-100': '255 237 213', 'orange-200': '254 215 170', 'orange-300': '253 186 116', 'orange-400': '251 146 60', 'orange-500': '249 115 22', 'orange-600': '234 88 12', 'orange-700': '194 65 12', 'orange-800': '153 27 27', 'orange-900': '124 45 18', 'orange-950': '76 29 14',
  // Lime
  'lime-50': '254 255 240', 'lime-100': '250 253 220', 'lime-200': '236 252 203', 'lime-300': '217 249 157', 'lime-400': '163 230 53', 'lime-500': '132 204 22', 'lime-600': '101 163 13', 'lime-700': '77 124 15', 'lime-800': '63 98 18', 'lime-900': '54 83 20', 'lime-950': '33 47 12',
  // Cyan
  'cyan-50': '240 254 255', 'cyan-100': '224 251 252', 'cyan-200': '207 250 254', 'cyan-300': '165 243 252', 'cyan-400': '103 232 249', 'cyan-500': '6 182 212', 'cyan-600': '8 145 178', 'cyan-700': '10 113 134', 'cyan-800': '21 94 117', 'cyan-900': '22 79 95', 'cyan-950': '11 41 50',
  // Emerald
  'emerald-50': '236 253 245', 'emerald-100': '209 250 229', 'emerald-200': '167 243 240', 'emerald-300': '110 231 183', 'emerald-400': '52 211 153', 'emerald-500': '16 185 129', 'emerald-600': '4 120 87', 'emerald-700': '4 87 60', 'emerald-800': '6 78 59', 'emerald-900': '5 56 46', 'emerald-950': '2 26 20',
  // Gray
  'gray-50': '249 250 251', 'gray-100': '243 244 246', 'gray-200': '229 231 235', 'gray-300': '209 213 219', 'gray-400': '156 163 175', 'gray-500': '107 114 128', 'gray-600': '75 85 99', 'gray-700': '55 65 81', 'gray-800': '31 41 55', 'gray-900': '17 24 39', 'gray-950': '3 7 18',
  // Sky
  'sky-50': '240 253 255', 'sky-100': '224 249 253', 'sky-200': '186 230 253', 'sky-300': '125 211 252', 'sky-400': '78 188 247', 'sky-500': '14 165 233', 'sky-600': '2 132 199', 'sky-700': '3 105 161', 'sky-800': '7 89 133', 'sky-900': '8 68 109', 'sky-950': '5 33 59',
  // Violet
  'violet-50': '245 243 255', 'violet-100': '237 233 254', 'violet-200': '221 214 254', 'violet-300': '196 181 253', 'violet-400': '167 139 250', 'violet-500': '139 92 246', 'violet-600': '124 58 237', 'violet-700': '109 40 217', 'violet-800': '91 28 147', 'violet-900': '79 24 120', 'violet-950': '49 10 74',
  // Fuchsia
  'fuchsia-50': '253 242 255', 'fuchsia-100': '250 223 255', 'fuchsia-200': '243 194 249', 'fuchsia-300': '232 153 238', 'fuchsia-400': '216 93 234', 'fuchsia-500': '192 38 211', 'fuchsia-600': '162 28 190', 'fuchsia-700': '131 24 162', 'fuchsia-800': '109 16 139', 'fuchsia-900': '88 28 116', 'fuchsia-950': '50 8 64',
  // Rose
  'rose-50': '255 240 245', 'rose-100': '255 228 238', 'rose-200': '254 205 211', 'rose-300': '253 164 175', 'rose-400': '251 113 133', 'rose-500': '244 63 94', 'rose-600': '225 29 72', 'rose-700': '190 18 60', 'rose-800': '159 18 57', 'rose-900': '134 25 60', 'rose-950': '76 19 44',
  // Slate
  'slate-50': '248 250 252', 'slate-100': '241 245 249', 'slate-200': '226 232 240', 'slate-300': '203 213 225', 'slate-400': '148 163 184', 'slate-500': '100 116 139', 'slate-600': '71 85 105', 'slate-700': '51 65 85', 'slate-800': '30 41 59', 'slate-900': '15 23 42', 'slate-950': '2 6 23',
  // Zinc
  'zinc-50': '250 250 250', 'zinc-100': '244 244 245', 'zinc-200': '228 228 231', 'zinc-300': '212 212 216', 'zinc-400': '161 161 170', 'zinc-500': '113 113 122', 'zinc-600': '82 82 91', 'zinc-700': '63 63 70', 'zinc-800': '39 39 42', 'zinc-900': '24 24 27', 'zinc-950': '9 9 11',
  // Neutral
  'neutral-50': '250 250 250', 'neutral-100': '245 245 245', 'neutral-200': '229 229 229', 'neutral-300': '212 212 212', 'neutral-400': '163 163 163', 'neutral-500': '115 115 115', 'neutral-600': '82 82 82', 'neutral-700': '64 64 64', 'neutral-800': '38 38 38', 'neutral-900': '23 23 23', 'neutral-950': '10 10 10',
  // Stone
  'stone-50': '250 250 249', 'stone-100': '245 245 244', 'stone-200': '231 229 228', 'stone-300': '214 211 209', 'stone-400': '168 162 158', 'stone-500': '120 113 108', 'stone-600': '87 83 78', 'stone-700': '68 64 60', 'stone-800': '41 37 36', 'stone-900': '28 25 24', 'stone-950': '12 10 9',
};


export const getMoodBgColorClass = (baseColor, intensity) => {
  const normalizedIntensity = Math.min(Math.max(intensity, 1), 4);
  return colorShades[baseColor]?.bg[normalizedIntensity - 1] || 'bg-gray-500';
};

export const getMoodTextColorClass = (baseColor, intensity) => {
  const normalizedIntensity = Math.min(Math.max(intensity, 1), 4);
  return colorShades[baseColor]?.text[normalizedIntensity - 1] || 'text-white';
};

// Function to get the RGB value from a Tailwind class string.
// This is more robust as it can handle any valid Tailwind color class.
export const getRgbValueFromTailwindClass = (tailwindClass) => {
  // Extract the color name and shade number from the class string (e.g., 'bg-red-400' -> 'red-400')
  const match = tailwindClass.match(/(?:bg|text|accent)-([a-z]+-\d{2,3})/);
  if (match && tailwindRgbValues[match[1]]) {
    return tailwindRgbValues[match[1]];
  }
  // Fallback for cases like 'red-500' which might be implied or directly used.
  const simpleMatch = tailwindClass.match(/(?:bg|text|accent)-([a-z]+)-(\d{2,3})/);
  if (simpleMatch && tailwindRgbValues[`${simpleMatch[1]}-${simpleMatch[2]}`]) {
    return tailwindRgbValues[`${simpleMatch[1]}-${simpleMatch[2]}`];
  }
  return '0 0 0'; // Default to black RGB if not found
};