import React from 'react';
import { HomeIcon, CalendarDaysIcon, ChartBarIcon, Cog6ToothIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'; // XMarkIcon is for the mobile close button

function Sidebar({ navigateTo, currentPage, sidebarOpen, toggleSidebar }) {
  // Array of navigation items
  const navItems = [
    { name: 'home', icon: HomeIcon, label: 'Journal' },
    { name: 'calendar', icon: CalendarDaysIcon, label: 'Calendar' },
    { name: 'reports', icon: ChartBarIcon, label: 'Reports' },
    { name: 'settings', icon: Cog6ToothIcon, label: 'Settings' },
    { name: 'profile', icon: UserCircleIcon, label: 'Profile' },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 shadow-lg flex flex-col py-6 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full'}
        md:w-16 md:relative md:flex md:translate-x-0`} // Fixed width for desktop, relative positioning
    >
      {/* Close button for mobile */}
      <div className="flex justify-end pr-4 md:hidden">
        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-8 text-2xl font-bold text-indigo-600 dark:text-indigo-400 self-center">🧠</div> {/* App Logo/Icon */}
      <nav className="flex flex-col space-y-4 flex-grow items-center"> {/* Centered items for icon-only display */}
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigateTo(item.name)}
            className={`relative p-2 rounded-lg transition-all duration-200 flex flex-col items-center group
              ${
                currentPage === item.name
                  ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-100 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-indigo-500 dark:hover:text-indigo-300'
              }
            `}
            title={item.label} 
          >
            <item.icon className="h-6 w-6" />
            {/* The label that appears on hover */}
            <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-6 bg-gray-700 text-white text-xs px-2 py-1 rounded-md hidden md:block">
              {item.label}
            </span>
            {/* For mobile, when sidebar is open, show text */}
            {sidebarOpen && window.innerWidth < 768 && (
              <span className="text-sm font-medium mt-1 text-gray-800 dark:text-gray-200">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;