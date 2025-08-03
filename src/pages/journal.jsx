// src/pages/journal.jsx

import React, { useState, useEffect } from "react";
import { promptsData } from "../data/prompts";
import { initialMoodWords, getMoodBgColorClass, getMoodTextColorClass } from "../data/moodWords";

const JournalPage = () => {
  const [responses, setResponses] = useState({});
  const [showSaved, setShowSaved] = useState(false);
  const [showSkipOptions, setShowSkipOptions] = useState({});

  // Mood words state, now managed with localStorage
  const [moodWords, setMoodWords] = useState([]); // Initialize as empty, will load from localStorage
  const [selectedMoods, setSelectedMoods] = useState([]); // Array to store multiple selected mood objects

  // State for adding new mood word modal
  const [showAddMoodModal, setShowAddMoodModal] = useState(false);
  const [newMoodWord, setNewMoodWord] = useState('');
  const [newMoodColor, setNewMoodColor] = useState('');
  const [addMoodError, setAddMoodError] = useState('');

  // --- Load Mood Words from LocalStorage on Mount ---
  useEffect(() => {
    const storedMoodWords = localStorage.getItem('journalAppMoodWords');
    if (storedMoodWords) {
      setMoodWords(JSON.parse(storedMoodWords));
    } else {
      // If no stored words, use initial defaults and save them
      setMoodWords(initialMoodWords);
      localStorage.setItem('journalAppMoodWords', JSON.stringify(initialMoodWords));
    }
  }, []); // Empty dependency array means this runs once on mount

  // --- Handlers for Journal Prompts ---
  const handleInputChange = (id, value) => {
    if (responses[id] && responses[id].startsWith("[Skipped]")) {
      setResponses((prev) => ({ ...prev, [id]: value }));
      setShowSkipOptions((prev) => ({ ...prev, [id]: false }));
    } else {
      setResponses((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSuggestionClick = (id, word) => {
    if (responses[id] && responses[id].startsWith("[Skipped]")) {
      setResponses((prev) => ({ ...prev, [id]: word }));
      setShowSkipOptions((prev) => ({ ...prev, [id]: false }));
    } else {
      setResponses((prev) => ({
        ...prev,
        [id]: prev[id] ? `${prev[id]} ${word}` : word,
      }));
    }
  };

  const handleToggleSkipOptions = (id) => {
    setShowSkipOptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectSkipPhrase = (id, selectedPhrase) => {
    setResponses((prev) => ({ ...prev, [id]: `[Skipped] ${selectedPhrase}` }));
    setShowSkipOptions((prev) => ({ ...prev, [id]: false }));
  };

  const handleSaveEntry = () => {
    console.log("Journal Entry Saved:", { responses, selectedMoods });

    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);

    setResponses({}); // Clear responses after saving
    setSelectedMoods([]); // Clear selected mood words
  };

  // --- Handlers for Mood Card ---
  const handleMoodWordClick = (mood) => {
    // Add mood to selectedMoods only if it's not already there
    const isAlreadySelected = selectedMoods.some(item => item.mood.id === mood.id);
    if (!isAlreadySelected) {
      setSelectedMoods(prev => [...prev, { mood: mood, intensity: 2 }]); // Default to 50% intensity
    }
  };

  // Updates intensity for a specific selected mood word
  const handleMoodIntensityChange = (moodId, e) => {
    const newIntensity = parseInt(e.target.value);
    setSelectedMoods(prev =>
      prev.map(item =>
        item.mood.id === moodId ? { ...item, intensity: newIntensity } : item
      )
    );
  };

  // Removes a selected mood word from the top display
  const handleRemoveSelectedMood = (moodId) => {
    setSelectedMoods(prev => prev.filter(item => item.mood.id !== moodId));
  };

  // --- Handlers for Add New Mood Word Modal ---
  const handleAddNewMoodWord = () => {
    setAddMoodError('');
    if (!newMoodWord.trim() || !newMoodColor.trim()) {
      setAddMoodError('Both word and color are required.');
      return;
    }

    // Basic validation for uniqueness (case-insensitive)
    const wordExists = moodWords.some(mw => mw.word.toLowerCase() === newMoodWord.toLowerCase());
    if (wordExists) {
      setAddMoodError('This mood word already exists.');
      return;
    }

    const colorExists = moodWords.some(mw => mw.baseColor.toLowerCase() === newMoodColor.toLowerCase());
    if (colorExists) {
      setAddMoodError('This color is already assigned to another mood word. Please choose a different color.');
      return;
    }

    // Basic check for valid Tailwind color format (e.g., 'red', 'blue', not 'rgb(255,0,0)')
    const validTailwindColors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'teal', 'indigo', 'orange', 'lime', 'cyan', 'emerald', 'gray'];
    if (!validTailwindColors.includes(newMoodColor.toLowerCase())) {
        setAddMoodError('Please enter a valid Tailwind CSS base color name (e.g., red, blue, green, indigo).');
        return;
    }

    // Add the new mood word to the local state
    const newId = newMoodWord.toLowerCase().replace(/\s/g, '-'); // Generate a simple ID
    const updatedMoodWords = [
      ...moodWords,
      {
        id: newId,
        word: newMoodWord.trim(),
        baseColor: newMoodColor.trim().toLowerCase(),
      }
    ];
    setMoodWords(updatedMoodWords);
    // Save updated mood words to localStorage
    localStorage.setItem('journalAppMoodWords', JSON.stringify(updatedMoodWords));

    setNewMoodWord('');
    setNewMoodColor('');
    setShowAddMoodModal(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl font-extrabold text-blue-400">Today's Journal</h1>
          <p className="mt-2 text-lg text-gray-400">Reflect on your day, one prompt at a time.</p>
        </header>

        {/* Mood Card Section */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-6 border border-gray-700 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">How are you feeling?</h2>

          {/* Display selected mood words with their sliders */}
          <div className="space-y-4 mb-4">
            {selectedMoods.map((selectedMoodItem) => {
                const { mood, intensity } = selectedMoodItem;
                const bgClass = getMoodBgColorClass(mood.baseColor, intensity);
                const textClass = getMoodTextColorClass(mood.baseColor, intensity);

                return (
                <div
                    key={mood.id}
                    className="flex items-center gap-4 px-3 py-2 rounded-full"
                >
                    {/* Mood chip with dynamic fill */}
                    <span
                    className={`px-4 py-1.5 rounded-full border border-white font-semibold text-sm
                                ${bgClass} ${textClass}`}
                    >
                    {mood.word}
                    </span>

                    {/* Slider with visual track */}
                    <input
                    type="range"
                    min="1"
                    max="4"
                    value={intensity}
                    onChange={(e) => handleMoodIntensityChange(mood.id, e)}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-${mood.baseColor}-200 via-${mood.baseColor}-500 to-${mood.baseColor}-800`}
                    style={{
                        background: `linear-gradient(to right,
                        var(--tw-color-${mood.baseColor}-200) 0%,
                        var(--tw-color-${mood.baseColor}-400) 33%,
                        var(--tw-color-${mood.baseColor}-600) 66%,
                        var(--tw-color-${mood.baseColor}-800) 100%)`
                    }}
                    />

                    {/* Remove Button */}
                    <button
                    onClick={() => handleRemoveSelectedMood(mood.id)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition"
                    aria-label={`Remove ${mood.word}`}
                    >
                    ✕
                    </button>
                </div>
                );
            })}
            </div>


          <div className="flex flex-wrap gap-3 mt-4">
            {moodWords.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodWordClick(mood)}
                // Apply styling based on whether it's selected or not
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200
                          ${getMoodBgColorClass(mood.baseColor, 4)}
                          ${getMoodTextColorClass(mood.baseColor, 4)}
                          ${selectedMoods.some(item => item.mood.id === mood.id) ? 'ring-2 ring-offset-2 ring-blue-400 ring-offset-gray-800' : ''}
                          hover:scale-105`}
              >
                {mood.word}
              </button>
            ))}
            <button
              onClick={() => setShowAddMoodModal(true)}
              className="px-4 py-2 rounded-full font-medium bg-gray-700 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Mood
            </button>
          </div>
        </section>

        {/* Journal Prompts Section */}
        <section>
          {promptsData.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-6 border border-gray-700 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-3">{prompt.text}</h3>
              <textarea
                className="w-full border border-gray-700 rounded-lg p-3 min-h-[120px] text-base bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                value={responses[prompt.id] || ""}
                onChange={(e) => handleInputChange(prompt.id, e.target.value)}
                placeholder="Write your thoughts here..."
              />

              {/* Word Suggestions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {prompt.wordSuggestions.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(prompt.id, word)}
                    className="text-sm font-medium text-gray-300 bg-gray-700 hover:bg-blue-600 transition-colors duration-200 px-4 py-1.5 rounded-full"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Skip Button and Skip Phrase Options */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleToggleSkipOptions(prompt.id)}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  {showSkipOptions[prompt.id] ? "Hide Skip Options" : "Skip this prompt"}
                </button>

                {showSkipOptions[prompt.id] && (
                  <div className="flex flex-wrap gap-2 ml-4">
                    {prompt.skipPhrases.map((phrase, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectSkipPhrase(prompt.id, phrase)}
                        className="text-xs text-gray-300 bg-gray-700 hover:bg-blue-600 px-3 py-1 rounded-full transition-colors duration-200"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Save Entry Button */}
        <div className="text-center mt-8 mb-8">
          <button
            onClick={handleSaveEntry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save Entry
          </button>
          {showSaved && (
            <div className="mt-4 text-green-400 text-sm font-medium">
              Entry saved successfully!
            </div>
          )}
        </div>
      </div>

      {/* Add New Mood Word Modal */}
      {showAddMoodModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Add New Mood Word</h3>
            <div className="mb-4">
              <label htmlFor="newMoodWord" className="block text-sm font-medium text-gray-300 mb-1">Mood Word</label>
              <input
                type="text"
                id="newMoodWord"
                value={newMoodWord}
                onChange={(e) => setNewMoodWord(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Joyful"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newMoodColor" className="block text-sm font-medium text-gray-300 mb-1">Tailwind Color Name</label>
              <input
                type="text"
                id="newMoodColor"
                value={newMoodColor}
                onChange={(e) => setNewMoodColor(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., indigo, lime, orange"
              />
              <p className="text-xs text-gray-400 mt-1">Use standard Tailwind color names (e.g., red, blue, green, pink, indigo, etc.)</p>
            </div>
            {addMoodError && (
              <p className="text-red-400 text-sm mb-4">{addMoodError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowAddMoodModal(false); setAddMoodError(''); setNewMoodWord(''); setNewMoodColor(''); }}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewMoodWord}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Add Mood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
