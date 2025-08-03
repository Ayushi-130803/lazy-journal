import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Journal from './pages/journal';
import Calendar from './pages/calendar';
import Reports from './pages/reports';
import Settings from './pages/settings';
import Profile from './pages/profile';

function AppShell() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'calendar': return <Calendar />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'profile': return <Profile />;
      default: return <Journal />;
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar
        navigateTo={setCurrentPage}
        currentPage={currentPage}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
        {renderPage()}
      </main>
    </div>
  );
}

export default AppShell;
