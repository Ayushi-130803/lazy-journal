import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import the new Auth component and the old PinEntryScreen
import Auth from './components/auth';
import PinEntryScreen from './components/PinEntryScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';


function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme state for background image only, set to theme1.jpg as default
  const [backgroundImage, setBackgroundImage] = useState('src/utils/theme1.jpg');

  // New: Font state
  const [selectedFont, setSelectedFont] = useState('font-nunito');

  // App Lock states
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [appPin, setAppPin] = useState('');
  
  // State for user authentication. This is the key state for controlling access.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State to hold user data after successful authentication
  const [user, setUser] = useState(null);

  // Load app lock settings and font from localStorage on initial render
  useEffect(() => {
    const storedLockStatus = localStorage.getItem('isAppLocked');
    const storedAppPin = localStorage.getItem('appPin');
    const storedFont = localStorage.getItem('selectedFont');
    
    // Check if a PIN is set. If so, and the app is locked, require a PIN entry.
    if (storedLockStatus === 'true' && storedAppPin) {
      setIsAppLocked(true);
      setAppPin(storedAppPin);
      setIsAuthenticated(false);
    } else {
      setIsAppLocked(false);
      setIsAuthenticated(false); // User needs to log in via Auth component
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
    // Placeholder for adding an entry to the database
    // For now, entries are not persistent across sessions
    console.log("Adding new journal entry:", newEntry);
  };
  
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Handle background theme change (images or custom upload)
  const onBackgroundImageChange = (url) => {
    setBackgroundImage(url);
  };

  // Function to handle successful authentication from Auth component
  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };
  
  // Function to handle successful PIN entry from PinEntryScreen
  const handlePinAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Conditional rendering based on authentication state
  if (isAppLocked && !isAuthenticated) {
    return <PinEntryScreen expectedPin={appPin} onAuthenticate={handlePinAuthenticated} />;
  }
  
  if (!isAuthenticated) {
    return (
      <Auth onAuthSuccess={handleAuthSuccess} />
    );
  }

  // Once authenticated, render the main application
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
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden md:pl-16">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home addJournalEntry={addJournalEntry} isDarkMode={isDarkMode} />} />
            <Route path="/calendar" element={<Calendar isDarkMode={isDarkMode} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reports" element={<Reports isDarkMode={isDarkMode} />} />
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