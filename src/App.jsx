// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Sidebar from './components/sidebar';
import Home from './pages/home';
import Calendar from './pages/calendar';
import Profile from './pages/profile';
import Reports from './pages/reports';
import Settings from './pages/settings';

function App() {
  // Initialize states from localStorage or use defaults
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('isDarkMode');
    return storedMode === 'true' || (storedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [backgroundImage, setBackgroundImage] = useState('');

  const [journalEntries, setJournalEntries] = useState(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    return storedEntries ? JSON.parse(storedEntries) : [];
  });

  // Effect to apply dark mode class and save preference to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  // Effect to save journal entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Function to add a new journal entry
  const addJournalEntry = (newEntryDetails) => {
    const today = new Date().toISOString().slice(0, 10);
    const existingEntryIndex = journalEntries.findIndex(entry => entry.date === today);

    const fullNewEntry = {
      date: today,
      entryDetails: newEntryDetails,
    };

    if (existingEntryIndex !== -1) {
      // If entry exists, update it
      setJournalEntries(prevEntries => {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = fullNewEntry;
        return updatedEntries;
      });
    } else {
      // If no entry, add a new one
      setJournalEntries((prevEntries) => [
        ...prevEntries,
        fullNewEntry,
      ]);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleBackgroundImageChange = (url) => {
    setBackgroundImage(url);
  };

  return (
    <div
      className="flex h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home addJournalEntry={addJournalEntry} isDarkMode={isDarkMode} />} />
            <Route path="/calendar" element={<Calendar journalEntries={journalEntries} isDarkMode={isDarkMode} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reports" element={<Reports journalEntries={journalEntries} isDarkMode={isDarkMode} />} />
            <Route
              path="/settings"
              element={
                <Settings
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  backgroundImage={backgroundImage}
                  onBackgroundImageChange={handleBackgroundImageChange}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
