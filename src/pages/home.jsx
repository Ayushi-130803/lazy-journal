import React, { useState } from 'react';
import prompts from '../data/prompts';
import phrases from '../data/phrases';
import MoodSlider from '../components/moodslider';

function Home({ addJournalEntry, isDarkMode }) { // Receive isDarkMode prop
  const [entries, setEntries] = useState(
    prompts.reduce((acc, prompt) => ({ ...acc, [prompt.id]: '' }), {})
  );

  const [moods, setMoods] = useState(
    prompts.reduce((acc, prompt) => ({ ...acc, [prompt.id]: 50 }), {})
  );

  const handleEntryChange = (promptId, value) => {
    setEntries((prevEntries) => ({
      ...prevEntries,
      [promptId]: value,
    }));
  };

  const handleMoodChange = (promptId, value) => {
    setMoods((prevMoods) => ({
      ...prevMoods,
      [promptId]: value,
    }));
  };

  const handleSaveEntry = () => {
    const fullEntry = prompts.map(prompt => ({
      promptId: prompt.id,
      promptText: prompt.text,
      entryText: entries[prompt.id],
      moodValue: moods[prompt.id]
    }));

    addJournalEntry(fullEntry);

    console.log('Journal Entry Saved:', fullEntry);
    alert(phrases.postEntryFeedback[Math.floor(Math.random() * phrases.postEntryFeedback.length)]);

    setEntries(prompts.reduce((acc, prompt) => ({ ...acc, [prompt.id]: '' }), {}));
    setMoods(prompts.reduce((acc, prompt) => ({ ...acc, [prompt.id]: 50 }), {}));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-gray-800 dark:text-gray-200 drop-shadow-md">
        <span role="img" aria-label="journal icon" className="mr-3 text-5xl md:text-6xl transform hover:scale-110 transition-transform duration-200 inline-block">
          📖
        </span>
        Today's Journal
      </h2>

      <div className="space-y-6">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <label htmlFor={`prompt-text-${prompt.id}`} className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {prompt.text}
            </label>
            <textarea
              id={`prompt-text-${prompt.id}`}
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base resize-y min-h-[80px] dark:text-gray-100"
              placeholder="Type here..."
              value={entries[prompt.id]}
              onChange={(e) => handleEntryChange(prompt.id, e.target.value)}
            ></textarea>

            {prompt.id === 'emotionalState' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  How intensely are you feeling this? (1-100)
                </p>
                <MoodSlider
                  value={moods[prompt.id]}
                  onChange={(value) => handleMoodChange(prompt.id, value)}
                  isDarkMode={isDarkMode} // Pass isDarkMode to MoodSlider
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleSaveEntry}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
        >
          Save Entry
        </button>
      </div>
    </div>
  );
}

export default Home;