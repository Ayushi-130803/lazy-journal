import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

function Header({ toggleSidebar, title }) {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 md:hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
        <Bars3Icon className="h-6 w-6" />
      </button>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 md:ml-0 ml-auto">{title}</h1>
      <div className="flex items-center space-x-4 ml-auto md:ml-0">
        <div className="w-8 h-8 bg-indigo-200 dark:bg-indigo-600 rounded-full flex items-center justify-center text-sm font-medium text-indigo-800 dark:text-indigo-100">
          JD
        </div>
      </div>
    </header>
  );
}

export default Header;