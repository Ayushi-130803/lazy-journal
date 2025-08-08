import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PinEntryScreen from './components/PinEntryScreen';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme state for background image only, set to theme1.jpg as default
  const [backgroundImage, setBackgroundImage] = useState('src/utils/theme1.jpg');

  // New: Font state
  const [selectedFont, setSelectedFont] = useState('font-nunito');

  // App Lock states
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [appPin, setAppPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In-memory store for journal entries
  const [journalEntries, setJournalEntries] = useState([]);

  // Load app lock settings and font from localStorage on initial render
  useEffect(() => {
    const storedLockStatus = localStorage.getItem('isAppLocked');
    const storedAppPin = localStorage.getItem('appPin');
    const storedFont = localStorage.getItem('selectedFont');

    if (storedLockStatus === 'true' && storedAppPin) {
      setIsAppLocked(true);
      setAppPin(storedAppPin);
      setIsAuthenticated(false);
    } else {
      setIsAppLocked(false);
      setIsAuthenticated(true);
    }

    if (storedFont) {
      setSelectedFont(storedFont);
    }
  }, []);

  // Effect to apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Effect to apply selected font class to body
  useEffect(() => {
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('font-')) {
        document.documentElement.classList.remove(cls);
      }
    });
    document.documentElement.classList.add(selectedFont);
    localStorage.setItem('selectedFont', selectedFont);
  }, [selectedFont]);

  // Function to add a new journal entry
  const addJournalEntry = (newEntry) => {
    const today = new Date().toISOString().slice(0, 10);
    const existingEntryIndex = journalEntries.findIndex(entry => entry.date === today);

    if (existingEntryIndex !== -1) {
      setJournalEntries(prevEntries => {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = {
          date: today,
          entryDetails: newEntry,
        };
        return updatedEntries;
      });
    } else {
      setJournalEntries((prevEntries) => [
        ...prevEntries,
        {
          date: today,
          entryDetails: newEntry,
        },
      ]);
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Handle background theme change (images or custom upload)
  const onBackgroundImageChange = (url) => {
    setBackgroundImage(url);
  };

  // Handle successful PIN entry
  const handlePinAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (isAppLocked && !isAuthenticated) {
    return <PinEntryScreen expectedPin={appPin} onAuthenticate={handlePinAuthenticated} />;
  }

  return (
    <div
      className="flex h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* The Sidebar component now uses the new, fixed mini-sidebar design */}
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      {/* Main content area, pushed to the right by the sidebar's width */}
      <div className="flex-1 flex flex-col overflow-hidden md:pl-16">
        <Header />
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
                  onBackgroundImageChange={onBackgroundImageChange}
                  isAppLocked={isAppLocked}
                  appPin={appPin}
                  setIsAppLocked={setIsAppLocked}
                  setAppPin={setAppPin}
                  setIsAuthenticated={setIsAuthenticated}
                  selectedFont={selectedFont}
                  setSelectedFont={setSelectedFont}
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