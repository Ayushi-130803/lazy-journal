import React, { useState, useEffect } from "react";
import { promptsData } from "../data/prompts";
import { initialMoodWords, getMoodBgColorClass, getMoodTextColorClass, tailwindColorOptions } from "../data/moodWords";
import './journal.css'; // Custom CSS for the slider

const JournalPage = ({ addJournalEntry, isDarkMode }) => {
  const [responses, setResponses] = useState({});
  const [showSaved, setShowSaved] = useState(false);
  const [showSkipOptions, setShowSkipOptions] = useState({});

  const [moodWords, setMoodWords] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);

  const [showAddMoodModal, setShowAddMoodModal] = useState(false);
  const [showEditMoodModal, setShowEditMoodModal] = useState(false);
  const [editingMood, setEditingMood] = useState(null);
  const [newMoodWord, setNewMoodWord] = useState('');
  const [newMoodColor, setNewMoodColor] = useState('');
  const [addMoodError, setAddMoodError] = useState('');
  
  // --- Load Mood Words from LocalStorage on Mount ---
  useEffect(() => {
    const storedMoodWords = localStorage.getItem('journalAppMoodWords');
    if (storedMoodWords) {
      setMoodWords(JSON.parse(storedMoodWords));
    } else {
      setMoodWords(initialMoodWords);
      localStorage.setItem('journalAppMoodWords', JSON.stringify(initialMoodWords));
    }
  }, []);

  // --- Auto-update selected moods when moodWords changes ---
  useEffect(() => {
    if (selectedMoods.length > 0) {
      const updatedSelectedMoods = selectedMoods.map(selected => {
        const matchingMood = moodWords.find(mw => mw.id === selected.mood.id);
        if (matchingMood) {
          return { ...selected, mood: matchingMood };
        }
        return selected;
      });
      setSelectedMoods(updatedSelectedMoods);
    }
  }, [moodWords]);

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
        [id]: prev[id] ? `${prev[id]}; ${word}` : word,
      }));
    }
  };

  const handleClearInput = (id) => {
    setResponses((prev) => ({ ...prev, [id]: '' }));
  };

  const handleToggleSkipOptions = (id) => {
    setShowSkipOptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectSkipPhrase = (id, selectedPhrase) => {
    setResponses((prev) => ({ ...prev, [id]: `[Skipped] ${selectedPhrase}` }));
    setShowSkipOptions((prev) => ({ ...prev, [id]: false }));
  };

  const handleSaveEntry = () => {
    const newEntryDetails = Object.keys(responses).map(promptId => {
      if (promptId === 'emotionalState') {
        return {
          promptId,
          entryText: responses[promptId],
          moodValue: selectedMoods.length > 0 ? selectedMoods[0].intensity : 50,
          mood: selectedMoods.length > 0 ? selectedMoods[0].mood.word : 'Neutral',
        };
      }
      return {
        promptId,
        entryText: responses[promptId],
      };
    });

    addJournalEntry(newEntryDetails);

    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);

    setResponses({});
    setSelectedMoods([]);
  };

  // --- Handlers for Mood Card ---
  const handleMoodWordClick = (mood) => {
    const isAlreadySelected = selectedMoods.some(item => item.mood.id === mood.id);
    if (!isAlreadySelected) {
      setSelectedMoods(prev => [...prev, { mood: mood, intensity: 2 }]);
    }
  };

  const handleMoodIntensityChange = (moodId, e) => {
    const newIntensity = parseInt(e.target.value);
    setSelectedMoods(prev =>
      prev.map(item =>
        item.mood.id === moodId ? { ...item, intensity: newIntensity } : item
      )
    );
  };

  const handleRemoveSelectedMood = (moodId) => {
    setSelectedMoods(prev => prev.filter(item => item.mood.id !== moodId));
  };
  
  // --- Handlers for Add/Edit Mood Word Modal ---
  const handleAddNewMoodWord = () => {
    setAddMoodError('');
    if (!newMoodWord.trim() || !newMoodColor.trim()) {
      setAddMoodError('Both word and color are required.');
      return;
    }

    const wordExists = moodWords.some(mw => mw.word.toLowerCase() === newMoodWord.toLowerCase());
    if (wordExists) {
      setAddMoodError('This mood word already exists.');
      return;
    }

    const newId = newMoodWord.toLowerCase().replace(/\s/g, '-');
    const updatedMoodWords = [
      ...moodWords,
      {
        id: newId,
        word: newMoodWord.trim(),
        baseColor: newMoodColor.trim(),
      }
    ];
    setMoodWords(updatedMoodWords);
    localStorage.setItem('journalAppMoodWords', JSON.stringify(updatedMoodWords));

    setNewMoodWord('');
    setNewMoodColor('');
    setShowAddMoodModal(false);
  };

  const handleEditMood = (mood) => {
    setEditingMood(mood);
    setNewMoodWord(mood.word);
    setNewMoodColor(mood.baseColor);
    setShowEditMoodModal(true);
  };

  const handleSaveEditMood = () => {
    setAddMoodError('');
    if (!newMoodWord.trim() || !newMoodColor.trim()) {
      setAddMoodError('Both word and color are required.');
      return;
    }

    const wordExists = moodWords.some(mw => mw.word.toLowerCase() === newMoodWord.toLowerCase() && mw.id !== editingMood.id);
    if (wordExists) {
      setAddMoodError('This mood word already exists.');
      return;
    }

    const updatedMoodWords = moodWords.map(mw =>
      mw.id === editingMood.id
        ? { ...mw, word: newMoodWord.trim(), baseColor: newMoodColor.trim() }
        : mw
    );

    setMoodWords(updatedMoodWords);
    localStorage.setItem('journalAppMoodWords', JSON.stringify(updatedMoodWords));

    setEditingMood(null);
    setNewMoodWord('');
    setNewMoodColor('');
    setShowEditMoodModal(false);
  };
  
  const getUsedColors = () => {
    return moodWords.map(mw => mw.baseColor);
  };

  // --- Dynamic Class Definitions ---
  const cardClasses = isDarkMode ? "bg-gray-800/50" : "bg-white/50";
  const inputBgClasses = isDarkMode ? "bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-500" : "bg-white text-gray-900 border-gray-300 placeholder-gray-400";
  const buttonBgClasses = isDarkMode ? "bg-gray-700 hover:bg-blue-600 text-gray-300" : "bg-gray-200 hover:bg-blue-600 text-gray-800";
  const addMoodButtonClasses = "px-4 py-2 rounded-full font-medium bg-gray-700 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center justify-center";
  const modalCardClasses = isDarkMode ? "bg-gray-800/75" : "bg-white/75";

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <header className="text-center my-8">
        <div className="inline-block p-4 rounded-xl shadow-lg bg-gradient-to-r from-transparent via-pink-400 via-purple-500 to-transparent">
          <h1 className={`text-4xl font-extrabold text-white`}>
            Today's Journal
          </h1>
        </div>
        <p className={`p-2 rounded-xl shadow-md bg-gradient-to-r from-transparent via-teal-200 to-transparent text-lg text-gray-800 font-medium`}>
          Reflect on your day, one prompt at a time.
        </p>
      </header>

      {/* Mood Card Section */}
      <section className={`${cardClasses} backdrop-blur-md p-6 rounded-2xl shadow-xl mb-6 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>How are you feeling?</h2>

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
                <span
                  className={`px-4 py-1.5 rounded-full border border-white font-semibold text-sm
                              ${bgClass} ${textClass}`}
                >
                  {mood.word}
                </span>

                <input
                  type="range"
                  min="1"
                  max="4"
                  value={intensity}
                  onChange={(e) => handleMoodIntensityChange(mood.id, e)}
                  className="custom-range-slider w-full h-2 rounded-lg appearance-none cursor-pointer"
                />

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
            <div key={mood.id} className="relative group">
              <button
                onClick={() => handleMoodWordClick(mood)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200
                          ${getMoodBgColorClass(mood.baseColor, 4)}
                          ${getMoodTextColorClass(mood.baseColor, 4)}
                          ${selectedMoods.some(item => item.mood.id === mood.id) ? 'ring-2 ring-offset-2 ring-blue-400 ring-offset-gray-800' : ''}
                          hover:scale-105`}
              >
                {mood.word}
              </button>
              <button
                onClick={() => handleEditMood(mood)}
                className="absolute top-0 right-0 -mt-2 -mr-2 p-1 text-xs text-white bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Edit Mood Word"
              >
                ✏️
              </button>
            </div>
          ))}
          <button
            onClick={() => setShowAddMoodModal(true)}
            className={addMoodButtonClasses}
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
            className={`${cardClasses} backdrop-blur-md p-6 rounded-2xl shadow-xl mb-6 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300`}
          >
            <h3 className="text-lg font-bold mb-3">{prompt.text}</h3>
            <div className="relative">
              <textarea
                className={`w-full border rounded-lg p-3 min-h-[120px] text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputBgClasses}`}
                value={responses[prompt.id] || ""}
                onChange={(e) => handleInputChange(prompt.id, e.target.value)}
                placeholder="Write your thoughts here..."
              />
              {responses[prompt.id] && (
                <button
                  onClick={() => handleClearInput(prompt.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition"
                  aria-label="Clear text area"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {prompt.wordSuggestions.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(prompt.id, word)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors duration-200 ${buttonBgClasses}`}
                >
                  {word}
                </button>
              ))}
            </div>

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
                      className={`text-xs px-3 py-1 rounded-full transition-colors duration-200 ${buttonBgClasses}`}
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

      {/* Add New Mood Word Modal */}
      {showAddMoodModal && (
        <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center p-4 z-50">
          <div className={`backdrop-blur-md p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700/50 ${modalCardClasses}`}>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Add New Mood Word</h3>
            <div className="mb-4">
              <label htmlFor="newMoodWord" className="block text-sm font-medium text-gray-300 mb-1">Mood Word</label>
              <input
                type="text"
                id="newMoodWord"
                value={newMoodWord}
                onChange={(e) => setNewMoodWord(e.target.value)}
                className={`w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClasses}`}
                placeholder="e.g., Joyful"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {tailwindColorOptions.map(color => {
                  const isColorUsed = getUsedColors().includes(color);
                  const isSelected = newMoodColor === color;
                  const buttonClasses = `
                    w-8 h-8 rounded-full border-2 transition-all duration-200
                    ${isColorUsed ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'}
                    ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-gray-900' : ''}
                    bg-${color}-500
                  `;

                  return (
                    <button
                      key={color}
                      type="button"
                      className={buttonClasses}
                      onClick={() => !isColorUsed && setNewMoodColor(color)}
                      disabled={isColorUsed}
                      aria-label={`Select ${color} color`}
                    ></button>
                  );
                })}
              </div>
            </div>
            {addMoodError && (
              <p className="text-red-400 text-sm mb-4">{addMoodError}</p>
            )}
            <div className="flex justify-end gap-3 mt-4">
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

      {/* Edit Mood Word Modal */}
      {showEditMoodModal && (
        <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center p-4 z-50">
          <div className={`backdrop-blur-md p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700/50 ${modalCardClasses}`}>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Edit Mood Word</h3>
            <div className="mb-4">
              <label htmlFor="editMoodWord" className="block text-sm font-medium text-gray-300 mb-1">Mood Word</label>
              <input
                type="text"
                id="editMoodWord"
                value={newMoodWord}
                onChange={(e) => setNewMoodWord(e.target.value)}
                className={`w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClasses}`}
                placeholder="e.g., Joyful"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {tailwindColorOptions.map(color => {
                  const isColorUsed = getUsedColors().includes(color) && color !== editingMood.baseColor;
                  const isSelected = newMoodColor === color;
                  const buttonClasses = `
                    w-8 h-8 rounded-full border-2 transition-all duration-200
                    ${isColorUsed ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'}
                    ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-gray-900' : ''}
                    bg-${color}-500
                  `;

                  return (
                    <button
                      key={color}
                      type="button"
                      className={buttonClasses}
                      onClick={() => !isColorUsed && setNewMoodColor(color)}
                      disabled={isColorUsed}
                      aria-label={`Select ${color} color`}
                    ></button>
                  );
                })}
              </div>
            </div>
            {addMoodError && (
              <p className="text-red-400 text-sm mb-4">{addMoodError}</p>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setShowEditMoodModal(false); setAddMoodError(''); setEditingMood(null); setNewMoodWord(''); setNewMoodColor(''); }}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditMood}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;