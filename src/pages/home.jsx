import React, { useEffect, useState } from 'react';
import JournalEntry from './journal';

function Home() {
  const [hasEntry, setHasEntry] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries')) || {};
    setHasEntry(!!savedEntries[today]);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="p-6">
      {hasEntry ? (
        <div className="text-center text-xl font-semibold text-green-600 dark:text-green-400">
          ✅ You’ve already written your journal for today!
        </div>
      ) : (
        <JournalEntry />
      )}
    </div>
  );
}

export default Home;
