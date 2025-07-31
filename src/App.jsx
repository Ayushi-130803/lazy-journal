import React, { useState, useEffect } from 'react';

// Import components
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  // State for current page, default to 'home'
  const [currentPage, setCurrentPage] = useState('home');
  // State for dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Function to navigate between pages
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Render the main application layout
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar navigateTo={navigateTo} currentPage={currentPage} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page content based on currentPage state */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {currentPage === 'home' && <Home />}
          {/* Placeholder for other pages */}
          {currentPage === 'calendar' && (
            <div className="flex items-center justify-center h-full text-2xl font-semibold">
              Mood Calendar - Coming Soon!
            </div>
          )}
          {currentPage === 'reports' && (
            <div className="flex items-center justify-center h-full text-2xl font-semibold">
              Reports & Summaries - Coming Soon!
            </div>
          )}
          {currentPage === 'settings' && (
            <div className="flex items-center justify-center h-full text-2xl font-semibold">
              Settings - Coming Soon!
            </div>
          )}
          {currentPage === 'profile' && (
            <div className="flex items-center justify-center h-full text-2xl font-semibold">
              Profile - Coming Soon!
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;