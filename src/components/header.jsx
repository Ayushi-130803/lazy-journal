import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline'; // Using Heroicons for icons

function Header() {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Hamburger menu icon (can be used to toggle sidebar on smaller screens) */}
      <button className="text-gray-500 dark:text-gray-400 md:hidden">
        <Bars3Icon className="h-6 w-6" />
      </button>
      {/* Page Title - dynamically set based on current page in App.jsx */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Today's Journal</h1>
      {/* Right-aligned elements (e.g., user avatar, notifications) */}
      <div className="flex items-center space-x-4">
        {/* Placeholder for user avatar or other icons */}
        <div className="w-8 h-8 bg-indigo-200 dark:bg-indigo-600 rounded-full flex items-center justify-center text-sm font-medium text-indigo-800 dark:text-indigo-100">
          JD
        </div>
      </div>
    </header>
  );
}

export default Header;