import React, { useState, useEffect } from 'react';
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

// Firebase Auth imports
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import getDoc here too for Auth component

const Auth = ({ db, auth, onAuthSuccess, isFirebaseReady }) => { // Added isFirebaseReady prop
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

  const baseInputClasses = "appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isFirebaseReady || !auth || !db) { // Check isFirebaseReady first
      setError("Firebase services are still loading. Please wait a moment.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Firebase: User logged in:', userCredential.user.uid);
        const appSpecificId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
        const userDocRef = doc(db, 'artifacts', appSpecificId, 'users', userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let profileData = {};
        if (userDocSnap.exists()) {
          profileData = userDocSnap.data().profile || {};
        }

        onAuthSuccess(userCredential.user, profileData);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Firebase: User signed up:', userCredential.user.uid);

        const appSpecificId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
        const userDocRef = doc(db, 'artifacts', appSpecificId, 'users', userCredential.user.uid);

        const profileData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          dob: dob.trim(),
          nickname: nickname.trim(),
          phoneNumber: phoneNumber.trim(),
        };

        await setDoc(userDocRef, { profile: profileData }, { merge: true });
        console.log('Firestore: User profile saved for new user:', userCredential.user.uid);

        onAuthSuccess(userCredential.user, profileData);
      }
    } catch (err) {
      console.error("Firebase Auth Error:", err);
      let errorMessage = 'An unexpected error occurred.';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use. Try logging in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password authentication is not enabled. Please contact support.';
          break;
        default:
          errorMessage = err.message || 'Authentication failed. Please try again.';
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setDob('');
    setNickname('');
    setPhoneNumber('');
    setError('');
  };

  // Button is disabled if loading, or if Firebase isn't yet ready
  const isSubmitDisabled = loading || !isFirebaseReady;

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
            {!isLogin && (
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
                  className={baseInputClasses + " rounded-t-md"}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            {isLogin ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="login-email"
                  name="loginEmail"
                  type="email"
                  required
                  className={baseInputClasses + " rounded-t-md"}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    required
                    className={baseInputClasses + " rounded-none"}
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
                    className={baseInputClasses + " rounded-none"}
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
                    className={baseInputClasses + " rounded-none"}
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
                    className={baseInputClasses + " rounded-none"}
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
                    className={baseInputClasses + " rounded-none"}
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
                className={baseInputClasses + " " + (isLogin ? 'rounded-b-md' : 'rounded-none')}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {!isFirebaseReady && (
            <p className="text-yellow-600 dark:text-yellow-400 text-sm text-center">
              Waiting for Firebase services...
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24">
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
