import React, { useState } from 'react';
import {
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  LockClosedIcon,
  LockOpenIcon,
  CheckBadgeIcon,
  XCircleIcon,
  SwatchIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

// Note: To make the fonts work throughout your app, you must perform two steps:
// 1. Add the font link tags to your public/index.html file (e.g., from Google Fonts).
//    <link rel="preconnect" href="https://fonts.googleapis.com">
//    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//    <link href="https://fonts.googleapis.com/css2?family=Lato&family=Merriweather&family=Montserrat&family=Nunito&family=Open+Sans&family=Roboto&display=swap" rel="stylesheet">
//
// 2. Extend your Tailwind CSS configuration to include these fonts.
//    In your tailwind.config.js file, add the following to the `theme.extend` section:
//    theme: {
//      extend: {
//        fontFamily: {
//          nunito: ['Nunito', 'sans-serif'],
//          lato: ['Lato', 'sans-serif'],
//          opensans: ['"Open Sans"', 'sans-serif'],
//          montserrat: ['Montserrat', 'sans-serif'],
//          roboto: ['Roboto', 'sans-serif'],
//          merriweather: ['Merriweather', 'serif'],
//        }
//      }
//    }


// Import local images from the assets folder. These paths are relative to the public folder.
const themeImages = [
  'src/utils/theme1.jpg',
  'src/utils/theme2.jpg',
  'src/utils/theme3.jpg'
];

function Settings({
  isDarkMode,
  toggleDarkMode,
  backgroundImage,
  onBackgroundImageChange,
  isAppLocked,
  appPin,
  setIsAppLocked,
  setAppPin,
  setIsAuthenticated,
  selectedFont,
  setSelectedFont,
}) {
  const [isPinSetup, setIsPinSetup] = useState(!!appPin);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  const handlePinChange = (e) => {
    setNewPin(e.target.value);
    setPinError('');
    setPinSuccess('');
  };

  const handleConfirmPinChange = (e) => {
    setConfirmPin(e.target.value);
    setPinError('');
    setPinSuccess('');
  };

  const handlePinSubmit = () => {
    if (newPin.length !== 4 || isNaN(newPin)) {
      setPinError('PIN must be a 4-digit number.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match.');
      return;
    }

    setAppPin(newPin);
    localStorage.setItem('appPin', newPin);
    setIsPinSetup(true);
    setPinSuccess('PIN set successfully!');
    setNewPin('');
    setConfirmPin('');
  };

  const handleRemovePin = () => {
    setAppPin('');
    localStorage.removeItem('appPin');
    setIsPinSetup(false);
    setIsAppLocked(false);
    setIsAuthenticated(true);
    setPinSuccess('PIN removed successfully!');
  };

  const handleLockToggle = () => {
    if (isPinSetup) {
      setIsAppLocked(!isAppLocked);
      localStorage.setItem('isAppLocked', !isAppLocked);
      // If locking the app, de-authenticate the user to force PIN entry
      if (!isAppLocked) {
        setIsAuthenticated(false);
      }
      setPinSuccess(`App lock ${isAppLocked ? 'disabled' : 'enabled'}!`);
    } else {
      setPinError('Please set a PIN first.');
    }
  };

  // Handle custom image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onBackgroundImageChange(imageUrl);
    }
  };

  const fonts = [
    { name: 'Nunito', class: 'font-nunito' },
    { name: 'Lato', class: 'font-lato' },
    { name: 'Open Sans', class: 'font-opensans' },
    { name: 'Montserrat', class: 'font-montserrat' },
    { name: 'Roboto', class: 'font-roboto' },
    { name: 'Merriweather', class: 'font-merriweather' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200 flex items-center justify-center">
        <Cog6ToothIcon className="h-8 w-8 mr-2 text-indigo-500" />
        Settings
      </h2>

      {/* Dark Mode Toggle */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isDarkMode ? <MoonIcon className="h-7 w-7 text-yellow-400 mr-3" /> : <SunIcon className="h-7 w-7 text-indigo-500 mr-3" />}
            <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Dark Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>

      {/* Font Selection */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <PencilSquareIcon className="h-6 w-6 mr-2 text-blue-500" />
          Font Style
        </h3>
        <div className="flex flex-wrap gap-2">
          {fonts.map((font) => (
            <button
              key={font.class}
              onClick={() => setSelectedFont(font.class)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 text-sm
                ${selectedFont === font.class
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'}
                ${font.class}`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Background Theme Section */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <SwatchIcon className="h-6 w-6 mr-2 text-teal-500" />
          Background Theme
        </h3>

        {/* Background Image Options */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Choose a pre-set background</p>
          <div className="flex flex-wrap gap-4">
            {themeImages.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => onBackgroundImageChange(imgUrl)}
                className={`w-24 h-16 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 border-2 ${
                  backgroundImage === imgUrl
                    ? 'border-indigo-500'
                    : 'border-transparent hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                title={`Theme Image ${index + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`Theme Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Image Upload */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Or upload your own custom background</p>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              id="backgroundImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-800 dark:file:text-indigo-100 dark:hover:file:bg-indigo-700"
            />
            {backgroundImage && !themeImages.includes(backgroundImage) && (
              <img src={backgroundImage} alt="Custom Background Preview" className="w-16 h-16 object-cover rounded-md shadow-sm" />
            )}
          </div>
        </div>
      </div>

      {/* App Lock Section */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          {isAppLocked ? <LockClosedIcon className="h-6 w-6 mr-2 text-red-500" /> : <LockOpenIcon className="h-6 w-6 mr-2 text-green-500" />}
          App Lock
        </h3>

        {pinSuccess && (
          <p className="mb-4 text-green-600 dark:text-green-400 flex items-center">
            <CheckBadgeIcon className="h-5 w-5 mr-1" /> {pinSuccess}
          </p>
        )}
        {pinError && (
          <p className="mb-4 text-red-600 dark:text-red-400 flex items-center">
            <XCircleIcon className="h-5 w-5 mr-1" /> {pinError}
          </p>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {!isPinSetup ? (
            <>
              <div className="flex-1 space-y-2">
                <label htmlFor="new-pin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Set a 4-digit PIN
                </label>
                <input
                  type="password"
                  id="new-pin"
                  value={newPin}
                  onChange={handlePinChange}
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <label htmlFor="confirm-pin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  id="confirm-pin"
                  value={confirmPin}
                  onChange={handleConfirmPinChange}
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="md:ml-4">
                <button
                  onClick={handlePinSubmit}
                  className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Set PIN
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                PIN is set. App lock is currently{' '}
                <span className={`font-semibold ${isAppLocked ? 'text-red-500' : 'text-green-500'}`}>
                  {isAppLocked ? 'Enabled' : 'Disabled'}
                </span>.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleLockToggle}
                  className={`w-full md:w-auto px-4 py-2 font-semibold rounded-md shadow-md transition-colors
                    ${isAppLocked
                      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                    }`}
                >
                  {isAppLocked ? 'Disable Lock' : 'Enable Lock'}
                </button>
                <button
                  onClick={handleRemovePin}
                  className="w-full md:w-auto px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Remove PIN
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
