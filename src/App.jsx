import React, { useState, useEffect } from 'react';

// Import components
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Calendar from './pages/Calendar';
import Profile from './pages/profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PinEntryScreen from './components/PinEntryScreen';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Theme states
  const [backgroundColor, setBackgroundColor] = useState('#F0F8FF'); // Alice Blue - a very soft, soothing light blue
  const [backgroundImage, setBackgroundImage] = useState(''); // No default background image

  // New: Font state
  const [selectedFont, setSelectedFont] = useState('font-nunito'); // Default font class

  // App Lock states
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [appPin, setAppPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // True if PIN entered correctly

  // In-memory store for journal entries (temporary, will be replaced by Firestore)
  const [journalEntries, setJournalEntries] = useState([]); // This is the correct declaration and should not cause errors.

  // Load app lock settings and font from localStorage on initial render
  useEffect(() => {
    const storedLockStatus = localStorage.getItem('isAppLocked');
    const storedAppPin = localStorage.getItem('appPin');
    const storedFont = localStorage.getItem('selectedFont');

    if (storedLockStatus === 'true' && storedAppPin) {
      setIsAppLocked(true);
      setAppPin(storedAppPin);
      setIsAuthenticated(false); // App starts locked, needs authentication
    } else {
      setIsAppLocked(false);
      setIsAuthenticated(true); // App starts unlocked
    }

    if (storedFont) {
      setSelectedFont(storedFont); // Apply stored font
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
    // Remove previous font classes
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('font-')) {
        document.documentElement.classList.remove(cls);
      }
    });
    // Add the new selected font class
    document.documentElement.classList.add(selectedFont);
    localStorage.setItem('selectedFont', selectedFont); // Persist font choice
  }, [selectedFont]);


  // Effect to handle window resize for initial sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to add a new journal entry
  const addJournalEntry = (newEntry) => {
    const today = new Date().toISOString().slice(0, 10);
    // This line uses journalEntries
    const existingEntryIndex = journalEntries.findIndex(entry => entry.date === today);

    if (existingEntryIndex !== -1) {
      // This line uses setJournalEntries
      setJournalEntries(prevEntries => {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = {
          date: today,
          entryDetails: newEntry,
        };
        return updatedEntries;
      });
    } else {
      // This line also uses setJournalEntries
      setJournalEntries((prevEntries) => [
        ...prevEntries,
        {
          date: today,
          entryDetails: newEntry,
        },
      ]);
    }
  };

  // Function to navigate between pages
  const navigateTo = (page) => {
    console.log(`Navigating to: ${page}`); // DEBUG: Log the page being navigated to
    setCurrentPage(page);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Function to toggle dark mode (defined in App.jsx)
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Function to toggle sidebar (defined in App.jsx)
  const toggleSidebar = () => {
    setSidebarOpen((prevOpen) => !prevOpen);
  };

  // Handle background color change
  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
    setBackgroundImage(''); // Clear image if color is set
  };

  // Handle background image change
  const handleBackgroundImageChange = (url) => {
    setBackgroundImage(url);
    setBackgroundColor(''); // Clear color if image is set
  };

  // Handle successful PIN entry
  const handlePinAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Determine header title based on current page
  const getHeaderTitle = () => {
    switch (currentPage) {
      case 'home':
        return "Today's Journal";
      case 'calendar':
        return "Mood Calendar";
      case 'reports':
        return "Reports & Summaries";
      case 'settings':
        return "Settings";
      case 'profile':
        return "Your Profile";
      default:
        return "Lazy Journal";
    }
  };

  // If app is locked and not authenticated, show PIN entry screen
  if (isAppLocked && !isAuthenticated) {
    return <PinEntryScreen expectedPin={appPin} onAuthenticate={handlePinAuthenticated} />;
  }

  return (
    <div
      className="flex h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300"
      style={{
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Keeps background fixed when scrolling
      }}
    >
      {/* Sidebar navigation */}
      <Sidebar
        navigateTo={navigateTo}
        currentPage={currentPage}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} title={getHeaderTitle()} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {currentPage === 'home' && <Home addJournalEntry={addJournalEntry} isDarkMode={isDarkMode} />}
          {currentPage === 'calendar' && <Calendar journalEntries={journalEntries} isDarkMode={isDarkMode} />}
          {currentPage === 'profile' && <Profile />}
          {currentPage === 'reports' && <Reports journalEntries={journalEntries} isDarkMode={isDarkMode} />}
          {currentPage === 'settings' && (
            <Settings
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              backgroundColor={backgroundColor}
              onBackgroundColorChange={handleBackgroundColorChange}
              backgroundImage={backgroundImage}
              onBackgroundImageChange={handleBackgroundImageChange}
              isAppLocked={isAppLocked}
              appPin={appPin}
              setIsAppLocked={setIsAppLocked}
              setAppPin={setAppPin}
              setIsAuthenticated={setIsAuthenticated}
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;