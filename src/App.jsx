import React, { useState, useEffect } from 'react';

// Import components
import Home from './pages/home';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Reports from './pages/reports';
import Settings from './pages/settings';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Theme states - Changed default background color to a soothing pastel
  const [backgroundColor, setBackgroundColor] = useState('#F0F8FF'); // Alice Blue - a very soft, soothing light blue
  const [backgroundImage, setBackgroundImage] = useState(''); // No default background image

  // In-memory store for journal entries (temporary, will be replaced by Firestore)
  const [journalEntries, setJournalEntries] = useState([]);

  // Function to add a new journal entry
  const addJournalEntry = (newEntry) => {
    // Check if an entry for today already exists
    const today = new Date().toISOString().slice(0, 10);
    const existingEntryIndex = journalEntries.findIndex(entry => entry.date === today);

    if (existingEntryIndex !== -1) {
      // If entry exists, update it
      setJournalEntries(prevEntries => {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = {
          date: today,
          entryDetails: newEntry,
        };
        return updatedEntries;
      });
    } else {
      // If no entry, add a new one
      setJournalEntries((prevEntries) => [
        ...prevEntries,
        {
          date: today,
          entryDetails: newEntry,
        },
      ]);
    }
  };

  // Effect to apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  // Function to navigate between pages
  const navigateTo = (page) => {
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
          {currentPage === 'home' && <Home addJournalEntry={addJournalEntry} isDarkMode={isDarkMode} />} {/* Pass isDarkMode */}
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
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
