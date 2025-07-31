import React from 'react';
import { HomeIcon, CalendarDaysIcon, ChartBarIcon, Cog6ToothIcon, UserCircleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Using Heroicons for icons

function Sidebar({ navigateTo, currentPage, toggleDarkMode, isDarkMode }) {
  // Array of navigation items
  const navItems = [
    { name: 'home', icon: HomeIcon, label: 'Journal' },
    { name: 'calendar', icon: CalendarDaysIcon, label: 'Calendar' },
    { name: 'reports', icon: ChartBarIcon, label: 'Reports' },
    { name: 'settings', icon: Cog6ToothIcon, label: 'Settings' },
    { name: 'profile', icon: UserCircleIcon, label: 'Profile' },
  ];

  return (
    <div className="w-16 bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center py-6 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="mb-8 text-2xl font-bold text-indigo-600 dark:text-indigo-400">🧠</div> {/* App Logo/Icon */}
      <nav className="flex flex-col space-y-4 flex-grow">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigateTo(item.name)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPage === item.name
                ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-100 shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-indigo-500 dark:hover:text-indigo-300'
            } flex flex-col items-center group`}
            title={item.label}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-6 bg-gray-700 text-white text-xs px-2 py-1 rounded-md hidden md:block">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      {/* Dark/Light mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="mt-auto p-2 rounded-lg transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-indigo-500 dark:hover:text-indigo-300"
        title={isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
      >
        {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
      </button>
    </div>
  );
}

export default Sidebar;