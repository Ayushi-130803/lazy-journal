import React, { useState } from 'react';
import { SunIcon, MoonIcon, PaintBrushIcon, PhotoIcon, BellAlertIcon, MusicalNoteIcon, KeyIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'; // Added Lock icons

function Settings({
  isDarkMode, toggleDarkMode, backgroundImage, onBackgroundImageChange,
  isAppLocked, appPin, setIsAppLocked, setAppPin, setIsAuthenticated // New App Lock props
}) {
  // Local state for notification sound and reminder duration (can be synced with Profile later if needed)
  const [notificationSound, setNotificationSound] = useState('chime');
  const [reminderDuration, setReminderDuration] = useState('1hour');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Handle background image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onBackgroundImageChange(imageUrl);
    }
  };

  // Handle password change (placeholder)
  const handleChangePassword = () => {
    alert('Password change functionality not yet implemented.');
    // In a real app, this would involve backend calls
  };

  // Handle App Lock toggle
  const handleAppLockToggle = () => {
    if (isAppLocked) {
      // If currently locked, unlocking it
      setIsAppLocked(false);
      localStorage.setItem('isAppLocked', 'false');
      setIsAuthenticated(true); // Automatically authenticate when unlocked from settings
      alert('App lock disabled.'); // IMPORTANT: Replace with custom modal
    } else {
      // If currently unlocked, enabling it
      if (appPin) { // Only enable if a PIN is already set
        setIsAppLocked(true);
        localStorage.setItem('isAppLocked', 'true');
        setIsAuthenticated(false); // Require authentication next time
        alert('App lock enabled.'); // IMPORTANT: Replace with custom modal
      } else {
        alert('Please set a PIN first before enabling app lock.'); // IMPORTANT: Replace with custom modal
      }
    }
  };

  // Handle setting/changing PIN
  const handleSetPin = () => {
    setPinError('');
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setPinError('PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match.');
      return;
    }

    setAppPin(newPin);
    localStorage.setItem('appPin', newPin);
    setNewPin('');
    setConfirmPin('');
    alert('PIN set successfully!'); // IMPORTANT: Replace with custom modal
  };

  // Handle reset to defaults
  const handleResetDefaults = () => {
    onBackgroundImageChange(''); // Clear background image
    toggleDarkMode(false); // Use the passed toggleDarkMode function to reset to light mode
    setNotificationSound('chime');
    setReminderDuration('1hour');
    // Also reset app lock settings
    setIsAppLocked(false);
    setAppPin('');
    setIsAuthenticated(true); // Ensure app is unlocked after reset
    localStorage.removeItem('isAppLocked');
    localStorage.removeItem('appPin');
    alert('Settings reset to defaults!'); // IMPORTANT: Replace with custom modal
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        <span role="img" aria-label="settings icon" className="mr-2">
          ⚙️
        </span>
        Settings
      </h2>

      <div className="space-y-8">
        {/* Appearance Settings */}
        <div className="bg-white/50 dark:bg-gray-700/50 p-5 rounded-lg shadow-md border border-gray-100/50 dark:border-gray-600/50">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
            <PaintBrushIcon className="h-6 w-6 mr-2 text-indigo-500" /> Appearance
          </h3>

          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isDarkMode ? 'bg-indigo-600 focus:ring-indigo-500' : 'bg-gray-200 focus:ring-gray-500'}
              `}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                  ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs">
                {isDarkMode ? <MoonIcon className="h-4 w-4 text-gray-800" /> : <SunIcon className="h-4 w-4 text-gray-500" />}
              </span>
            </button>
          </div>

          {/* Themes */}
          <div>
            <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Theme
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                id="backgroundImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-800 dark:file:text-indigo-100 dark:hover:file:bg-indigo-700"
              />
              {backgroundImage && (
                <img src={backgroundImage} alt="Background Preview" className="w-16 h-16 object-cover rounded-md shadow-sm" />
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload an image to use as your app background. This will override the background color.
            </p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/50 dark:bg-gray-700/50 p-5 rounded-lg shadow-md border border-gray-100/50 dark:border-gray-600/50">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
            <BellAlertIcon className="h-6 w-6 mr-2 text-green-500" /> Notification Settings
          </h3>

          {/* Reminder Duration */}
          <div className="mb-4">
            <label htmlFor="reminderDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reminder Duration (Remind me later)
            </label>
            <select
              id="reminderDuration"
              name="reminderDuration"
              value={reminderDuration}
              onChange={(e) => setReminderDuration(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            >
              <option value="1hour">1 Hour</option>
              <option value="2hours">2 Hours</option>
              <option value="4hours">4 Hours</option>
              <option value="tomorrow">Tomorrow Morning</option>
            </select>
          </div>

          {/* Notification Sound Type */}
          <div>
            <label htmlFor="notificationSound" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MusicalNoteIcon className="inline-block h-5 w-5 mr-1 text-green-500" /> Notification Sound
            </label>
            <select
              id="notificationSound"
              name="notificationSound"
              value={notificationSound}
              onChange={(e) => setNotificationSound(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            >
              <option value="chime">Gentle Chime</option>
              <option value="bell">Soft Bell</option>
              <option value="ping">Subtle Ping</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white/50 dark:bg-gray-700/50 p-5 rounded-lg shadow-md border border-gray-100/50 dark:border-gray-600/50">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
            <KeyIcon className="h-6 w-6 mr-2 text-red-500" /> Account
          </h3>

          {/* Change Password (Placeholder) */}
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              placeholder="Enter current password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              placeholder="Enter new password"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
          >
            Change Password
          </button>
        </div>

        {/* New: Privacy & Security (App Lock) */}
        <div className="bg-white/50 dark:bg-gray-700/50 p-5 rounded-lg shadow-md border border-gray-100/50 dark:border-gray-600/50">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
            <LockClosedIcon className="h-6 w-6 mr-2 text-purple-500" /> Privacy & Security
          </h3>

          {/* App Lock Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Enable App Lock</span>
            <button
              onClick={handleAppLockToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isAppLocked ? 'bg-purple-600 focus:ring-purple-500' : 'bg-gray-200 focus:ring-gray-500'}
              `}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                  ${isAppLocked ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs">
                {isAppLocked ? <LockClosedIcon className="h-4 w-4 text-gray-800" /> : <LockOpenIcon className="h-4 w-4 text-gray-500" />}
              </span>
            </button>
          </div>

          {/* Set/Change PIN */}
          <div className="mt-4">
            <label htmlFor="newPin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Set/Change 4-digit PIN
            </label>
            <input
              type="password"
              id="newPin"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="4"
              value={newPin}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 4) {
                  setNewPin(value);
                }
              }}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              placeholder="New PIN"
            />
          </div>
          <div className="mt-2 mb-4">
            <input
              type="password"
              id="confirmPin"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="4"
              value={confirmPin}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 4) {
                  setConfirmPin(value);
                }
              }}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              placeholder="Confirm PIN"
            />
            {pinError && <p className="text-red-600 text-sm mt-2">{pinError}</p>}
          </div>
          <button
            onClick={handleSetPin}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
          >
            Set PIN
          </button>
        </div>

        {/* Reset to Defaults */}
        <div className="text-center mt-8">
          <button
            onClick={handleResetDefaults}
            className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Reset All Settings to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;