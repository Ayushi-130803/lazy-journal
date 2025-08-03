import React, { useState } from 'react'; // Removed useEffect
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { SparklesIcon, TrophyIcon, BookOpenIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/solid'; // New icons

function Reports({ journalEntries, isDarkMode }) {
  // State to manage the selected time period: 'daily', 'weekly', 'monthly'
  const [selectedPeriod, setSelectedPeriod] = useState('weekly'); // Default to weekly view
  // State for selected date (for daily view)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Today's date YYYY-MM-DD

  // --- Helper Functions for Date/Period Filtering ---

  // Get entries for a specific day
  const getDailyEntries = (dateString) => {
    return journalEntries.filter(entry => entry.date === dateString);
  };

  // Get entries for the current week (Sunday to Saturday)
  const getWeeklyEntries = () => {
    const today = new Date();
    // Clone today to avoid modifying the original date object in place
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() - today.getDay() + 6); // Saturday
    lastDayOfWeek.setHours(23, 59, 59, 999);

    return journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= firstDayOfWeek && entryDate <= lastDayOfWeek;
    });
  };

  // Get entries for the current month
  const getMonthlyEntries = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    return journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
  };

  // Filter entries based on selected period
  const filteredEntries = (() => {
    switch (selectedPeriod) {
      case 'daily':
        return getDailyEntries(selectedDate);
      case 'weekly':
        return getWeeklyEntries();
      case 'monthly':
        return getMonthlyEntries();
      default:
        return [];
    }
  })();

  // --- Data Processing for Charts (using filteredEntries) ---

  // 1. Mood Trend Data (Average Mood Intensity Over Time)
  const moodTrendData = filteredEntries.map(entry => {
    const emotionalStateEntry = entry.entryDetails.find(detail => detail.promptId === 'emotionalState');
    const moodValue = emotionalStateEntry ? emotionalStateEntry.moodValue : 50;
    return {
      date: entry.date,
      averageMood: moodValue,
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  // 2. Mood Distribution Data (Count of Moods)
  const moodDistributionMap = {};
  filteredEntries.forEach(entry => {
    const emotionalStateEntry = entry.entryDetails.find(detail => detail.promptId === 'emotionalState');
    if (emotionalStateEntry && emotionalStateEntry.entryText) {
      let moodCategory = 'Neutral';
      const lowerCaseText = emotionalStateEntry.entryText.toLowerCase();

      if (lowerCaseText.includes('happy') || lowerCaseText.includes('joy') || lowerCaseText.includes('great') || lowerCaseText.includes('good') || lowerCaseText.includes('excited')) {
        moodCategory = 'Happy';
      } else if (lowerCaseText.includes('sad') || lowerCaseText.includes('down') || lowerCaseText.includes('unhappy') || lowerCaseText.includes('lonely')) {
        moodCategory = 'Sad';
      } else if (lowerCaseText.includes('angry') || lowerCaseText.includes('frustrated') || lowerCaseText.includes('annoyed')) {
        moodCategory = 'Angry';
      } else if (lowerCaseText.includes('calm') || lowerCaseText.includes('peaceful') || lowerCaseText.includes('relaxed')) {
        moodCategory = 'Calm';
      } else if (lowerCaseText.includes('anxious') || lowerCaseText.includes('stressed') || lowerCaseText.includes('worried')) {
        moodCategory = 'Anxious';
      }

      moodDistributionMap[moodCategory] = (moodDistributionMap[moodCategory] || 0) + 1;
    }
  });
  const moodDistributionData = Object.keys(moodDistributionMap).map(mood => ({
    name: mood,
    count: moodDistributionMap[mood],
  }));

  // Journaling Streak Calculation (now based on ALL entries, not just filtered)
  const calculateJournalingStreak = (entries) => {
    if (entries.length === 0) return 0;
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentStreak = 0;
    let lastDate = null;

    for (let i = 0; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i].date);
      currentDate.setHours(0,0,0,0); // Normalize to start of day

      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Use round for reliability

        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }
      lastDate = currentDate;
    }

    // Check if today is part of the streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (lastDate && lastDate.toDateString() === today.toDateString()) {
      return currentStreak;
    } else if (lastDate) {
      const diffTimeFromLastEntry = Math.abs(today - lastDate);
      const diffDaysFromLastEntry = Math.round(diffTimeFromLastEntry / (1000 * 60 * 60 * 24));
      if (diffDaysFromLastEntry === 1) { // If last entry was yesterday
        return currentStreak;
      }
    }
    return 0; // Streak broken or no entries
  };
  const journalingStreak = calculateJournalingStreak(journalEntries); // Always calculate global streak

  // Dominant Mood Calculation (using filtered mood distribution)
  const getDominantMood = (moodData) => {
    if (moodData.length === 0) return { mood: 'N/A', emoji: '🤔' };

    let dominantMood = '';
    let maxCount = 0;

    moodData.forEach(item => {
      if (item.count > maxCount) {
        maxCount = item.count;
        dominantMood = item.name;
      }
    });

    const moodEmojis = {
      'Happy': '😊', 'Sad': '😔', 'Angry': '😠', 'Calm': '😌', 'Anxious': '😟', 'Neutral': '😐',
    };
    return {
      mood: dominantMood,
      emoji: moodEmojis[dominantMood] || '🤔',
    };
  };
  // Calculate dominantMood for the currently filtered period
  const dominantMoodForPeriod = getDominantMood(moodDistributionData);


  // Placeholder for Common Skip Reasons (can be refined later)
  const commonSkipReasons = [
    "Too busy (3 times)",
    "Forgot (2 times)",
    "Didn't feel like it (1 time)",
  ];

  // Placeholder for Productivity Words (can be refined later)
  const productivityWords = [
    { word: 'completed', count: 5 },
    { word: 'finished', count: 3 },
    { word: 'started', count: 4 },
    { word: 'progress', count: 2 },
  ];

  // renderChartsAndInsights now receives dominantMoodForPeriod directly
  const renderChartsAndInsights = (currentMoodData, currentMoodTrendData, dominantMoodForPeriod) => ( // Removed currentJournalEntries
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Journaling Streak - Always global for motivation */}
        <div className="bg-indigo-50 dark:bg-indigo-900/50 p-6 rounded-lg shadow-md border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
          <div className="flex items-center">
            <TrophyIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-300 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200">Journaling Streak</h3>
              <p className="text-gray-700 dark:text-gray-300">Consecutive days with an entry</p>
            </div>
          </div>
          <span className="text-5xl font-bold text-indigo-700 dark:text-indigo-100">
            {journalingStreak}
            <span className="text-2xl ml-1">days</span>
          </span>
        </div>

        {/* Dominant Mood for the selected period */}
        <div className="bg-purple-50 dark:bg-purple-900/50 p-6 rounded-lg shadow-md border border-purple-100 dark:border-purple-800 flex items-center justify-between">
          <div className="flex items-center">
            <SparklesIcon className="h-10 w-10 text-purple-600 dark:text-purple-300 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200">Dominant Mood</h3>
              <p className="text-gray-700 dark:text-gray-300">Your most frequent emotion this {selectedPeriod}</p>
            </div>
          </div>
          <span className="text-5xl font-bold text-purple-700 dark:text-purple-100">
            {dominantMoodForPeriod.emoji} {/* Use the passed dominantMoodForPeriod */}
            <span className="text-2xl ml-2">{dominantMoodForPeriod.mood}</span> {/* Use the passed dominantMoodForPeriod */}
          </span>
        </div>
      </div>

      {/* Mood Trend Over Time Chart */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Mood Trend Over Time</h3>
        {currentMoodTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={currentMoodTrendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" dark:stroke="#4a4a4a" />
              <XAxis dataKey="date" stroke="#6b7280" dark:stroke="#9ca3af" />
              <YAxis domain={[0, 100]} stroke="#6b7280" dark:stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e0e0e0', borderRadius: '8px' }}
                labelStyle={{ color: isDarkMode ? '#d1d5db' : '#1f2937' }}
                itemStyle={{ color: isDarkMode ? '#d1d5db' : '#1f2937' }}
              />
              <Legend />
              <Line type="monotone" dataKey="averageMood" stroke="#8884d8" activeDot={{ r: 8 }} name="Average Mood Intensity" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No mood trend data for this period.</p>
        )}
      </div>

      {/* Mood Distribution Chart */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Mood Distribution</h3>
        {currentMoodData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={currentMoodData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" dark:stroke="#4a4a4a" />
              <XAxis dataKey="name" stroke="#6b7280" dark:stroke="#9ca3af" />
              <YAxis stroke="#6b7280" dark:stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e0e0e0', borderRadius: '8px' }}
                labelStyle={{ color: isDarkMode ? '#d1d5db' : '#1f2937' }}
                itemStyle={{ color: isDarkMode ? '#d1d5db' : '#1f2937' }}
              />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Number of Entries" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No mood distribution data for this period.</p>
        )}
      </div>
    </>
  );


  return (
    <div className="max-w-5xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        <span role="img" aria-label="chart icon" className="mr-2">
          📊
        </span>
        Reports & Summaries
      </h2>

      {/* Period Selection Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setSelectedPeriod('daily')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${selectedPeriod === 'daily' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
          `}
        >
          <ClockIcon className="inline-block h-5 w-5 mr-2" /> Daily
        </button>
        <button
          onClick={() => setSelectedPeriod('weekly')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${selectedPeriod === 'weekly' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
          `}
        >
          <CalendarDaysIcon className="inline-block h-5 w-5 mr-2" /> Weekly
        </button>
        <button
          onClick={() => setSelectedPeriod('monthly')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-200
            ${selectedPeriod === 'monthly' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
          `}
        >
          <BookOpenIcon className="inline-block h-5 w-5 mr-2" /> Monthly
        </button>
      </div>

      {/* Date picker for Daily view */}
      {selectedPeriod === 'daily' && (
        <div className="mb-6 text-center">
          <label htmlFor="daily-date-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select a Date:
          </label>
          <input
            type="date"
            id="daily-date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

      {journalEntries.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 text-lg mt-10">
          No journal entries yet. Start journaling to see your reports!
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section for Written Report */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-2 text-blue-500" /> Written Report for this {selectedPeriod}
            </h3>
            {filteredEntries.length > 0 ? (
              <p className="text-gray-700 dark:text-gray-300">
                {/* Placeholder for LLM-generated summary */}
                This is where a detailed, emotionally intelligent summary of your entries for the {selectedPeriod} will appear. It will highlight key themes, mood shifts, and insights based on your journaling.
                <br/><br/>
                For example, for your entries this {selectedPeriod}, you seemed to focus on [common themes]. Your mood generally [increased/decreased/stayed stable] towards the [beginning/middle/end] of the period.
                {selectedPeriod === 'daily' && filteredEntries[0].entryDetails.map(detail => (
                    <p key={detail.promptId} className="mt-2 text-sm">
                        <strong>{detail.promptText}:</strong> {detail.entryText || 'No entry.'}
                    </p>
                ))}
              </p>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">No entries for this {selectedPeriod} to generate a report.</p>
            )}
          </div>

          {/* Section for Mood Charts & Overall Mood */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-purple-500" /> Mood Charts & Insights for this {selectedPeriod}
            </h3>
            {filteredEntries.length > 0 ? (
              renderChartsAndInsights(moodDistributionData, moodTrendData, dominantMoodForPeriod) // Pass dominantMoodForPeriod
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">No entries for this {selectedPeriod} to display charts.</p>
            )}
          </div>

          {/* Common Skip Reasons (can be refined later to be period-specific) */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Common Skip Reasons (Overall)</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {commonSkipReasons.map((reason, index) => (
                <li key={index} className="mb-1">{reason}</li>
              ))}
            </ul>
          </div>

          {/* Productivity Words (Placeholder for Word Cloud) */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Key Words from Entries (Overall)</h3>
            <div className="flex flex-wrap gap-2">
              {productivityWords.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 rounded-full text-sm font-medium">
                  {item.word} ({item.count})
                </span>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
              (Future: This section will feature a word cloud or more advanced text analysis.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;