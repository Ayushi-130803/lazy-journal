import React, { useState } from 'react';

function PinEntryScreen({ expectedPin, onAuthenticate }) {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState('');

  const handlePinChange = (e) => {
    const value = e.target.value;
    // Allow only digits and limit to 4 characters
    if (/^\d*$/.test(value) && value.length <= 4) {
      setEnteredPin(value);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enteredPin === expectedPin) {
      onAuthenticate(); // Call the function passed from App.jsx to authenticate
    } else {
      setError('Incorrect PIN. Please try again.');
      setEnteredPin(''); // Clear input on error
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">App Locked</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Please enter your 4-digit PIN to unlock.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password" // Use password type to hide input
            inputMode="numeric" // Suggest numeric keyboard on mobile
            pattern="[0-9]*" // Restrict to numbers
            maxLength="4"
            value={enteredPin}
            onChange={handlePinChange}
            placeholder="PIN"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
          />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
          >
            Unlock App
          </button>
        </form>
      </div>
    </div>
  );
}

export default PinEntryScreen;