// src/pages/Home.jsx
import React, { useState } from 'react';
import prompts from '../data/prompts'; // Import prompts data
import phrases from '../data/phrases'; // Make sure this line is present and correct
import MoodSlider from '../components/MoodSlider'; // Import the new MoodSlider component

function Home() {
  // State to store journal entries for each prompt
  const [entries, setEntries] = useState(
    prompts.reduce((acc, prompt) => ({ ...acc, [prompt.id]: '' }), {})
  );

  // State to store mood slider values for each prompt
  const [moods, setMoods] = useState(
    prompts.reduce((acc, prompt) => ({ ...acc, [prompt.id]: 50 }), {}) // Default to 50 (middle)
  );

  // Handle input change for journal entries
  const handleEntryChange = (promptId, value) => {
    setEntries((prevEntries) => ({
      ...prevEntries,
      [promptId]: value,
    }));
  };

  // Handle mood slider change
  const handleMoodChange = (promptId, value) => {
    setMoods((prevMoods) => ({
      ...prevMoods,
      [promptId]: value,
    }));
  };

  // Handle saving the journal entry
  const handleSaveEntry = () => {
    // Combine entries and moods for saving
    const fullEntry = prompts.map(prompt => ({
      promptId: prompt.id,
      promptText: prompt.text,
      entryText: entries[prompt.id],
      moodValue: moods[prompt.id]
    }));

    console.log('Full Journal Entry:', fullEntry);
    // In a real app, you would save this data to a backend or local storage
    alert(phrases.postEntryFeedback[Math.floor(Math.random() * phrases.postEntryFeedback.length)]);
    // Optionally clear entries after saving or mark as complete
    // setEntries(prompts.reduce((acc, prompt) => ({ ...acc, [prompt.id]: '' }), {}));
    // setMoods(prompts.reduce((acc, prompt) => ({ ...acc, [prompt.id]: 50 }), {}));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        <span role="img" aria-label="journal icon" className="mr-2">
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

            {/* Render MoodSlider only for prompts that are flagged for mood (e.g., 'emotionalState') */}
            {prompt.id === 'emotionalState' && ( // You can add a 'hasMood' property to prompts if more are needed
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  How intensely are you feeling this? (1-100)
                </p>
                <MoodSlider
                  value={moods[prompt.id]}
                  onChange={(value) => handleMoodChange(prompt.id, value)}
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