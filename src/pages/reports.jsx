import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { SparklesIcon, TrophyIcon, BookOpenIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/solid';
import { getMoodBgColorClass, getMoodTextColorClass, getRgbValueFromTailwindClass } from '../data/moodWords';
import { promptsData } from '../data/prompts'; // Import promptsData to get prompt text

function Reports({ journalEntries, isDarkMode, getLocalDateString }) { // Receive getLocalDateString
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState(getLocalDateString()); // Use helper for initial state

  // --- Helper Functions for Date/Period Filtering ---

  // Get entries for a specific day
  const getDailyEntries = (dateString) => {
    if (!Array.isArray(journalEntries)) return [];
    return journalEntries.filter(entry => entry.date === dateString);
  };

  // Get entries for the current week (Sunday to Saturday)
  const getWeeklyEntries = () => {
    if (!Array.isArray(journalEntries)) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Saturday
    lastDayOfWeek.setHours(23, 59, 59, 999);

    return journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      if (isNaN(entryDate.getTime())) return false;
      return entryDate >= firstDayOfWeek && entryDate <= lastDayOfWeek;
    });
  };

  // Get entries for the current month
  const getMonthlyEntries = () => {
    if (!Array.isArray(journalEntries)) return [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    return journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      if (isNaN(entryDate.getTime())) return false;
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
  };

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
  const moodTrendData = filteredEntries
    .map(entry => {
      if (!Array.isArray(entry.moods) || entry.moods.length === 0) {
        return null;
      }

      const totalIntensity = entry.moods.reduce((sum, moodItem) => sum + (moodItem.intensity || 0), 0);
      const averageMood = entry.moods.length > 0 ? (totalIntensity / entry.moods.length) : 0;

      return {
        date: entry.date,
        averageMood: parseFloat(averageMood.toFixed(2)),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date));


  // 2. Mood Distribution Data (Count of each mood word)
  const moodDistributionMap = {};
  filteredEntries.forEach(entry => {
    if (Array.isArray(entry.moods)) {
      entry.moods.forEach(moodItem => {
        const moodWord = moodItem.mood?.word;
        if (moodWord) {
          moodDistributionMap[moodWord] = (moodDistributionMap[moodWord] || 0) + 1;
        }
      });
    }
  });
  const moodDistributionData = Object.keys(moodDistributionMap).map(mood => ({
    name: mood,
    count: moodDistributionMap[mood],
  }));

  // Journaling Streak Calculation (now based on ALL entries)
  const calculateJournalingStreak = (entries) => {
    if (!Array.isArray(entries) || entries.length === 0) return 0;

    const validDates = entries
      .map(entry => {
        const d = new Date(entry.date);
        return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
      })
      .filter(Boolean)
      .sort((a, b) => a.getTime() - b.getTime());

    if (validDates.length === 0) return 0;

    let currentStreak = 0;
    let lastDate = null;

    for (let i = 0; i < validDates.length; i++) {
      const currentDate = validDates[i];

      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const diffTime = currentDate.getTime() - lastDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }
      lastDate = currentDate;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (lastDate && lastDate.toDateString() !== today.toDateString()) {
      const diffTimeFromLastEntry = today.getTime() - lastDate.getTime();
      const diffDaysFromLastEntry = diffTimeFromLastEntry / (1000 * 60 * 60 * 24);
      if (diffDaysFromLastEntry > 1) {
        return 0;
      }
    }

    return currentStreak;
  };
  const journalingStreak = calculateJournalingStreak(journalEntries);


  // Dominant Mood Calculation (using filtered mood distribution)
  const getDominantMood = (moodData) => {
    if (!Array.isArray(moodData) || moodData.length === 0) return { mood: 'N/A', emoji: '🤔' };

    let dominantMood = '';
    let maxCount = 0;
    let dominantEmoji = '🤔';

    moodData.forEach(item => {
      if (item.count > maxCount) {
        maxCount = item.count;
        dominantMood = item.name;
        const moodEmojis = {
          'Happy': '😊', 'Sad': '😔', 'Angry': '😠', 'Calm': '😌', 'Anxious': '😟', 'Neutral': '😐',
          'Energetic': '⚡', 'Excited': '🤩', 'Relaxed': '🧘',
          'Red': '🔴', 'Blue': '🔵', 'Green': '🟢', 'Yellow': '🟡', 'Purple': '🟣', 'Pink': '🌸', 'Teal': '💎',
        };
        dominantEmoji = moodEmojis[dominantMood] || '🤔';
      }
    });

    return {
      mood: dominantMood,
      emoji: dominantEmoji,
    };
  };
  const dominantMoodForPeriod = getDominantMood(moodDistributionData);

  // Common Skip Reasons
  const getCommonSkipReasons = (entries) => {
    const skipReasonMap = {};
    entries.forEach(entry => {
      if (Array.isArray(entry.entryDetails)) {
        entry.entryDetails.forEach(detail => {
          if (detail.entryText && detail.entryText.startsWith('[Skipped]')) {
            const reason = detail.entryText.replace('[Skipped]', '').trim();
            if (reason) {
              skipReasonMap[reason] = (skipReasonMap[reason] || 0) + 1;
            }
          }
        });
      }
    });
    return Object.keys(skipReasonMap).map(reason => ({
      reason: reason,
      count: skipReasonMap[reason]
    })).sort((a, b) => b.count - a.count);
  };
  const commonSkipReasons = getCommonSkipReasons(filteredEntries);

  // Productivity Words
  const getProductivityWords = (entries) => {
    const wordMap = {};
    entries.forEach(entry => {
      if (Array.isArray(entry.entryDetails)) {
        entry.entryDetails.forEach(detail => {
          if (detail.entryText && !detail.entryText.startsWith('[Skipped]')) {
            const words = detail.entryText.toLowerCase().match(/\b\w+\b/g);
            if (words) {
              words.forEach(word => {
                if (word.length > 2) {
                  wordMap[word] = (wordMap[word] || 0) + 1;
                }
              });
            }
          }
        });
      }
    });
    return Object.keys(wordMap).map(word => ({
      word: word,
      count: wordMap[word]
    })).sort((a, b) => b.count - a.count).slice(0, 10);
  };
  const productivityWords = getProductivityWords(filteredEntries);


  const renderChartsAndInsights = (currentMoodData, currentMoodTrendData, dominantMoodForPeriod) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

        <div className="bg-purple-50 dark:bg-purple-900/50 p-6 rounded-lg shadow-md border border-purple-100 dark:border-purple-800 flex items-center justify-between">
          <div className="flex items-center">
            <SparklesIcon className="h-10 w-10 text-purple-600 dark:text-purple-300 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200">Dominant Mood</h3>
              <p className="text-gray-700 dark:text-gray-300">Your most frequent emotion this {selectedPeriod}</p>
            </div>
          </div>
          <span className="text-5xl font-bold text-purple-700 dark:text-purple-100">
            {dominantMoodForPeriod.emoji}
            <span className="text-2xl ml-2">{dominantMoodForPeriod.mood}</span>
          </span>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Mood Trend Over Time</h3>
        {currentMoodTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={currentMoodTrendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4a4a4a" : "#e0e0e0"} />
              <XAxis dataKey="date" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
              <YAxis domain={[0, 4]}
                  ticks={[1, 2, 3, 4]}
                  stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                  label={{ value: 'Mood Intensity (1-4)', angle: -90, position: 'insideLeft', fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e0e0e0', borderRadius: '8px' }}
                labelStyle={{ color: isDarkMode ? '#d1d5db' : '#1f2937' }}
                itemStyle={{ color: isDarkMode ? '#d1d5db' : '#1f2937' }}
                formatter={(value, name) => [`${value.toFixed(2)}/4`, name]}
              />
              <Legend />
              <Line type="monotone" dataKey="averageMood" stroke="#8884d8" activeDot={{ r: 8 }} name="Average Mood Intensity" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No mood trend data for this period.</p>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Mood Distribution</h3>
        {currentMoodData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={currentMoodData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4a4a4a" : "#e0e0e0"} />
              <XAxis dataKey="name" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
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
    <div className="max-w-3xl mx-auto p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        Reports & Summaries
      </h2>

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

      {Array.isArray(journalEntries) && journalEntries.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 text-lg mt-10">
          No journal entries yet. Start journaling to see your reports!
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-2 text-blue-500" /> Written Report for this {selectedPeriod}
            </h3>
            {filteredEntries.length > 0 ? (
              <>
                <p className="text-gray-700 dark:text-gray-300">
                  This is where a detailed, emotionally intelligent summary of your entries for the {selectedPeriod} will appear. It will highlight key themes, mood shifts, and insights based on your journaling.
                  <br/><br/>
                  For example, for your entries this {selectedPeriod}, you seemed to focus on [common themes]. Your mood generally [increased/decreased/stayed stable] towards the [beginning/middle/end] of the period.
                </p>
                {selectedPeriod === 'daily' && filteredEntries[0]?.entryDetails && Array.isArray(filteredEntries[0].entryDetails) && (
                  <div className="mt-4 space-y-2">
                    {filteredEntries[0].entryDetails.map(detail => {
                      const promptText = promptsData.find(p => p.id === detail.promptId)?.text || `Prompt ${detail.promptId || 'null'} (Unknown)`;
                      return (
                        <p key={detail.promptId} className="text-gray-700 dark:text-gray-300 text-sm">
                          <strong>{promptText}:</strong> {detail.entryText || 'No entry.'}
                        </p>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">No entries for this {selectedPeriod} to generate a report.</p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-purple-500" /> Mood Charts & Insights for this {selectedPeriod}
            </h3>
            {filteredEntries.length > 0 ? (
              renderChartsAndInsights(moodDistributionData, moodTrendData, dominantMoodForPeriod)
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">No entries for this {selectedPeriod} to display charts.</p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Common Skip Reasons ({selectedPeriod === 'daily' ? 'for this day' : 'for this ' + selectedPeriod})</h3>
            {commonSkipReasons.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {commonSkipReasons.map((item, index) => (
                  <li key={index} className="mb-1">{item.reason} ({item.count} {item.count === 1 ? 'time' : 'times'})</li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">No skipped prompts for this {selectedPeriod}.</p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Key Words from Entries ({selectedPeriod === 'daily' ? 'for this day' : 'for this ' + selectedPeriod})</h3>
            {productivityWords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {productivityWords.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 rounded-full text-sm font-medium">
                    {item.word} ({item.count})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">No key words found for this {selectedPeriod}.</p>
            )}
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