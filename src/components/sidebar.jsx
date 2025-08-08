import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

function Sidebar({ toggleDarkMode, isDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mapping route paths to nav item names
  const navItems = [
    { name: 'home', icon: HomeIcon, label: 'Journal', path: '/home' },
    { name: 'calendar', icon: CalendarDaysIcon, label: 'Calendar', path: '/calendar' },
    { name: 'reports', icon: ChartBarIcon, label: 'Reports', path: '/reports' },
    { name: 'settings', icon: Cog6ToothIcon, label: 'Settings', path: '/settings' },
    { name: 'profile', icon: UserCircleIcon, label: 'Profile', path: '/profile' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="fixed top-0 left-0 h-full w-16 bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center py-6 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 z-50">
      <div className="mb-8 text-2xl font-bold text-indigo-600 dark:text-indigo-400">🧠</div>

      <nav className="flex flex-col space-y-4 flex-grow">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-100 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-indigo-500 dark:hover:text-indigo-300'
              } flex flex-col items-center group relative`}
              title={item.label}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-md hidden md:block z-10">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* The dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="mt-auto p-2 rounded-lg transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-indigo-500 dark:hover:text-indigo-300"
        title={isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
      >
        {isDarkMode ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
      </button>
    </div>
  );
}

export default Sidebar;
