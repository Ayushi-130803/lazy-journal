import React from 'react';
import { Bars3Icon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';

function Header({ user, userProfile, handleSignOut }) {
  const displayName = userProfile.nickname || userProfile.firstName || user?.email || 'Guest';
  const displayInitials = (userProfile.nickname || userProfile.firstName || (user?.email ? user.email.charAt(0) : 'J')).slice(0, 2).toUpperCase();

  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* This button could toggle a mobile sidebar if you implemented one */}
      <button /* onClick={toggleSidebar} */ className="text-gray-500 dark:text-gray-400 md:hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
        <Bars3Icon className="h-6 w-6" />
      </button>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 md:ml-0 ml-auto">Lazy Journal</h1> {/* Hardcoded title */}
      <div className="flex items-center space-x-4 ml-auto md:ml-0">
        {user && (
          <>
            <span className="text-gray-700 dark:text-gray-300 text-sm hidden sm:block">
              Welcome, <span className="font-semibold">{displayName}</span>!
            </span>
            <div className="w-8 h-8 bg-indigo-200 dark:bg-indigo-600 rounded-full flex items-center justify-center text-sm font-medium text-indigo-800 dark:text-indigo-100">
              {displayInitials}
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-700 hover:text-red-600 dark:hover:text-red-300 transition-colors"
              title="Sign Out"
            >
              <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
