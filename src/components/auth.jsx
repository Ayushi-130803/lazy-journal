import React, { useState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightCircleIcon,
  PhoneIcon,
  TagIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle the form submission for both log-in and sign-up
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC PLACEHOLDER ---
        // For log-in, we use the first name and password
        console.log('Attempting to log in with:', firstName, password);
        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        // On success, pass the minimal user data
        onAuthSuccess({ firstName });
        // --- END LOGIN LOGIC ---
      } else {
        // --- SIGN UP LOGIC PLACEHOLDER ---
        // For sign-up, all new user data is collected
        const userData = {
          email,
          password,
          firstName,
          lastName,
          dob,
          nickname,
          phoneNumber
        };
        console.log('Attempting to sign up with:', userData);
        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        // On success, pass the full user data
        onAuthSuccess(userData);
        // --- END SIGN UP LOGIC ---
      }
    } catch (err) {
      // Handle authentication errors here
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to switch between log-in and sign-up forms and reset state
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset all form fields when switching modes
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setDob('');
    setNickname('');
    setPhoneNumber('');
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 font-poppins">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="flex flex-col items-center">
          <UserCircleIcon className="h-16 w-16 text-indigo-500 mb-4" />
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
            {isLogin ? 'Welcome Back!' : 'Join the Journal'}
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm space-y-4">
            {isLogin ? (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="login-name"
                    name="loginName"
                    type="text"
                    required
                    className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="First Name (required)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="last-name"
                    name="lastName"
                    type="text"
                    className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Last Name (optional)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="phone-number"
                    name="phoneNumber"
                    type="tel"
                    className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className={`appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${isLogin ? 'rounded-b-md' : 'rounded-none'}`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <ArrowRightCircleIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                  </span>
                  {isLogin ? 'Log In' : 'Sign Up'}
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          <button
            onClick={toggleAuthMode}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;