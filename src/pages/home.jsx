// src/pages/home.jsx

import React, { useEffect, useState } from 'react';
import JournalPage from './journal';

function Home({ addJournalEntry, isDarkMode }) {
  const [hasEntry, setHasEntry] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setHasEntry(savedEntries.some(entry => entry.date === today));
    setLoading(false);
  }, [addJournalEntry]); // Added addJournalEntry to the dependency array to re-run when an entry is added.

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="p-6">
      {hasEntry ? (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center text-xl font-semibold text-green-600 dark:text-green-400">
          ✅ You’ve already written your journal for today!
        </div>
      ) : (
        <JournalPage addJournalEntry={addJournalEntry} isDarkMode={isDarkMode} />
      )}
    </div>
  );
}

export default Home;