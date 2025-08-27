import React, { useEffect, useState } from 'react';
import JournalPage from './Journal';

function Home({ saveJournalEntry, journalEntries, isDarkMode, initialEntry, setEntryToEdit, getLocalDateString }) { // Receive getLocalDateString
  const [hasEntry, setHasEntry] = useState(false);
  const [loading, setLoading] = useState(true);

  // Determine if today's entry exists
  useEffect(() => {
    const today = getLocalDateString(); // Use the helper for local date
    console.log("Home: useEffect - Checking journalEntries for today's entry:", today);
    setHasEntry(journalEntries.some(entry => entry.date === today));
    setLoading(false);
    console.log("Home: hasEntry for today:", hasEntry);
  }, [journalEntries, getLocalDateString]); // Add getLocalDateString to deps

  useEffect(() => {
    console.log("Home: initialEntry useEffect triggered. current initialEntry:", initialEntry);
    if (initialEntry === null && hasEntry) {
      setEntryToEdit(null);
      console.log("Home: Cleared initialEntry because today's entry exists and no explicit edit was triggered.");
    }
  }, [initialEntry, hasEntry, setEntryToEdit]);


  if (loading) return <div className="text-center p-4">Loading...</div>;

  const today = getLocalDateString(); // Use the helper for local date
  const todaysEntry = journalEntries.find(entry => entry.date === today);

  const showJournalForToday = !hasEntry || initialEntry;
  console.log("Home: showJournalForToday decision:", showJournalForToday, "hasEntry:", hasEntry, "initialEntry:", initialEntry);


  return (
    <div className="p-6">
      {showJournalForToday ? (
        <JournalPage
          onSaveEntry={saveJournalEntry}
          initialEntry={initialEntry}
          onCancelEdit={() => {
            setEntryToEdit(null);
            console.log("Home: JournalPage cancelled/saved, clearing initialEntry.");
          }}
          isDarkMode={isDarkMode}
          getLocalDateString={getLocalDateString} // Pass to JournalPage
        />
      ) : (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center text-xl font-semibold text-green-600 dark:text-green-400">
          ✅ You’ve already written your journal for today!
          {todaysEntry && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setEntryToEdit(todaysEntry);
                  console.log("Home: Clicking View/Edit, setting initialEntry to:", todaysEntry);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
              >
                View/Edit Today's Entry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
