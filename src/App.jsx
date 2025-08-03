import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';

import Home from './pages/home';
import Calendar from './pages/calendar';
import Reports from './pages/reports';
import Settings from './pages/settings';
import Profile from './pages/profile';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen w-screen overflow-hidden`}>
      <div className="flex h-full">
        <Sidebar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <div className="flex-grow overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
