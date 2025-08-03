/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Add the safelist property here
  safelist: [
    // This pattern matches all your mood color buttons
    // The `tailwindColorOptions` array you have in moodWords.js contains
    // these color names. The `500` is the shade used for the color grid buttons.
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500',
    'bg-gray-500', 'bg-slate-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500',

    // It's also a good idea to safelist the shades for the mood cards,
    // as they are also dynamically generated.
    {
      pattern: /bg-(red|orange|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc|neutral|stone)-(200|400|600|800)/,
    },
    {
      pattern: /text-(red|orange|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc|neutral|stone)-(800|white)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}