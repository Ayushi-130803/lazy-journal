import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, onSnapshot, deleteDoc, where, addDoc, getDocs } from 'firebase/firestore';

// Import components
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PinEntryScreen from './components/PinEntryScreen';
import Auth from './components/Auth'; // Your new Auth component

// Helper function to get the local date string in YYYY-MM-DD format
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const navigate = useNavigate();

  // --- Firebase State ---
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null); // Firebase authenticated user object
  const [userId, setUserId] = useState(null); // Firebase user UID or anonymous ID
  const [isFirebaseReady, setIsFirebaseReady] = useState(false); // New state for Firebase readiness

  // --- App-specific UI States (can remain in localStorage) ---
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('src/utils/theme1.jpg');
  const [selectedFont, setSelectedFont] = useState('font-nunito');

  // --- Local App Lock States (can remain in localStorage) ---
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [appPin, setAppPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Refers to local PIN authentication

  // --- Journal Data State (now from Firestore) ---
  const [journalEntries, setJournalEntries] = useState([]);
  const [entryToEdit, setEntryToEdit] = useState(null);
  const [journalPageSelectedDate, setJournalPageSelectedDate] = useState(getLocalDateString());

  // --- User Profile State (now from Firestore) ---
  const [userProfile, setUserProfile] = useState({});

  // --- Firebase Configuration (Hardcoded for reliability) ---
  const firebaseConfig = {
    apiKey: "AIzaSyCc8uSTc3Az1USy2yZsOnV0TgNCZIMtrbU",
    authDomain: "lazy-journal-4dea2.firebaseapp.com",
    projectId: "lazy-journal-4dea2",
    storageBucket: "lazy-journal-4dea2.firebasestorage.app",
    messagingSenderId: "846140539871",
    appId: "1:846140539871:web:526d3ea9f7207795463a6a",
    measurementId: "G-JGJSF05319"
  };


  // --- Firebase Initialization and Auth Listener ---
  useEffect(() => {
    let unsubscribeAuth = () => {}; // Initialize with a no-op function

    try {
      // Use the hardcoded firebaseConfig directly
      const app = initializeApp(firebaseConfig);
      setFirebaseApp(app);

      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      const signInUser = async () => {
        try {
          // Check for __initial_auth_token but ensure Firebase is already initialized
          if (typeof window.__initial_auth_token !== 'undefined' && firebaseAuth) {
            await signInWithCustomToken(firebaseAuth, window.__initial_auth_token);
            console.log("Firebase: Signed in with custom token.");
          } else {
            await signInAnonymously(firebaseAuth);
            console.log("Firebase: Signed in anonymously.");
          }
        } catch (error) {
          console.error("Firebase Auth Error during initial sign-in:", error);
          await signInAnonymously(firebaseAuth); // Fallback to anonymous
        } finally {
          setIsFirebaseReady(true); // Set ready after initial sign-in attempt
        }
      };
      signInUser();

      unsubscribeAuth = onAuthStateChanged(firebaseAuth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          setUserId(currentUser.uid);
          console.log("Firebase: Auth state changed. User:", currentUser.uid);
        } else {
          setUserId(null);
          setIsAuthenticated(false);
          console.log("Firebase: Auth state changed. No user logged in.");
        }
        setIsFirebaseReady(true); // Ensure ready state is set after auth check
      });

    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setIsFirebaseReady(true); // Still set ready even if there's an init error, to unblock UI
    }

    // Cleanup subscription on unmount
    return () => unsubscribeAuth();
  }, []); // Run only once on component mount

  // --- Load app settings from localStorage ---
  useEffect(() => {
    console.log("App: Initial useEffect - Loading settings from localStorage");
    const storedLockStatus = localStorage.getItem('isAppLocked');
    const storedAppPin = localStorage.getItem('appPin');
    const storedFont = localStorage.getItem('selectedFont');

    if (storedLockStatus === 'true' && storedAppPin) {
      setIsAppLocked(true);
      setAppPin(storedAppPin);
    } else {
      setIsAppLocked(false);
      setIsAuthenticated(true); // No lock set, so consider authenticated
    }

    if (storedFont) {
      setSelectedFont(storedFont);
    }
  }, []);

  // --- Save app settings to localStorage on change ---
  useEffect(() => {
    localStorage.setItem('isAppLocked', isAppLocked);
    localStorage.setItem('appPin', appPin);
    localStorage.setItem('selectedFont', selectedFont);
  }, [isAppLocked, appPin, selectedFont]);

  // --- Load Journal Entries & User Profile from Firestore ---
  useEffect(() => {
    if (!db || !userId || !isFirebaseReady) { // Also wait for isFirebaseReady
      console.log("Firestore: DB, userId, or Firebase not ready. Skipping data load.");
      setJournalEntries([]); // Clear entries if no user
      setUserProfile({}); // Clear profile if no user
      return;
    }

    const appSpecificId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
    const userDocRef = doc(db, 'artifacts', appSpecificId, 'users', userId);
    const journalsCollectionRef = collection(userDocRef, 'journalEntries');

    console.log("Firestore: Attempting to load user profile for:", userId);
    const fetchUserProfile = async () => {
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data().profile || {};
          setUserProfile(profileData);
          console.log("Firestore: Loaded user profile:", profileData);
        } else {
          console.log("Firestore: No user profile found for", userId, ". Initializing empty.");
          setUserProfile({});
        }
      } catch (e) {
        console.error("Firestore: Error fetching user profile:", e);
        setUserProfile({});
      }
    };
    fetchUserProfile();

    console.log("Firestore: Setting up real-time listener for journal entries for:", userId);
    const unsubscribeJournals = onSnapshot(journalsCollectionRef, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const sanitizedEntries = entries.map(entry => ({
        ...entry,
        entryDetails: Array.isArray(entry.entryDetails) ? entry.entryDetails : [],
        moods: Array.isArray(entry.moods) ? entry.moods : []
      }));
      setJournalEntries(sanitizedEntries);
      console.log("Firestore: Real-time journal entries updated:", sanitizedEntries);
    }, (error) => {
      console.error("Firestore: Error listening to journal entries:", error);
    });

    return () => {
      unsubscribeJournals();
      console.log("Firestore: Unsubscribed from journal entries.");
    };
  }, [db, userId, isFirebaseReady]); // Re-run when db, userId, or isFirebaseReady changes


  // --- Dark Mode Toggling ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Font Selection ---
  useEffect(() => {
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('font-')) {
        document.documentElement.classList.remove(cls);
      }
    });
    document.documentElement.classList.add(selectedFont);
  }, [selectedFont]);

  // --- Journal Entry Management (now interacting with Firestore) ---
  const saveJournalEntry = useCallback(async (date, promptResponses, selectedMoods) => {
    if (!db || !userId) {
      console.error("Firestore: Cannot save journal entry. DB or userId is not available.");
      return;
    }
    const appSpecificId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
    const userDocRef = doc(db, 'artifacts', appSpecificId, 'users', userId);
    const journalsCollectionRef = collection(userDocRef, 'journalEntries');

    const newEntryData = {
      date: date,
      entryDetails: promptResponses,
      moods: selectedMoods,
      timestamp: new Date().toISOString(),
    };

    try {
      const existingEntryQuery = query(journalsCollectionRef, where("date", "==", date));
      const querySnapshot = await getDocs(existingEntryQuery);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        await setDoc(doc(journalsCollectionRef, existingDoc.id), newEntryData, { merge: true });
        console.log("Firestore: Updated existing journal entry for", date, "ID:", existingDoc.id);
      } else {
        const docRef = await addDoc(journalsCollectionRef, newEntryData);
        console.log("Firestore: Added new journal entry with ID:", docRef.id);
      }

      setEntryToEdit(null);
      setJournalPageSelectedDate(date);
    } catch (e) {
      console.error("Firestore: Error saving journal entry:", e);
    }
  }, [db, userId]);


  const deleteJournalEntry = useCallback(async (dateToDelete) => {
    if (!db || !userId) {
      console.error("Firestore: Cannot delete journal entry. DB or userId is not available.");
      return;
    }
    const appSpecificId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
    const userDocRef = doc(db, 'artifacts', appSpecificId, 'users', userId);
    const journalsCollectionRef = collection(userDocRef, 'journalEntries');

    try {
      const entryToDeleteQuery = query(journalsCollectionRef, where("date", "==", dateToDelete));
      const querySnapshot = await getDocs(entryToDeleteQuery);

      if (!querySnapshot.empty) {
        const docIdToDelete = querySnapshot.docs[0].id;
        await deleteDoc(doc(journalsCollectionRef, docIdToDelete));
        console.log("Firestore: Deleted journal entry for date:", dateToDelete, "ID:", docIdToDelete);
      } else {
        console.warn("Firestore: No entry found to delete for date:", dateToDelete);
      }
      setEntryToEdit(null);
    } catch (e) {
      console.error("Firestore: Error deleting journal entry:", e);
    }
  }, [db, userId]);

  // --- User Profile Management (interacting with Firestore) ---
  const updateUserProfile = useCallback(async (profileData) => {
    if (!db || !userId) {
      console.error("Firestore: Cannot update user profile. DB or userId is not available.");
      return false;
    }
    const appSpecificId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
    const userDocRef = doc(db, 'artifacts', appSpecificId, 'users', userId);

    try {
      await setDoc(userDocRef, { profile: profileData }, { merge: true });
      setUserProfile(profileData);
      console.log("Firestore: User profile updated successfully for", userId);
      return true;
    } catch (e) {
      console.error("Firestore: Error updating user profile:", e);
      return false;
    }
  }, [db, userId]);

  // --- Handlers for Navigation and UI ---
  const handleEditFromCalendar = useCallback((entry) => {
    setEntryToEdit(entry);
    setJournalPageSelectedDate(entry.date);
    navigate('/home');
  }, [navigate]);

  const handleJournalPageDateChange = useCallback((date) => {
    setJournalPageSelectedDate(date);
    setEntryToEdit(null);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  const onBackgroundImageChange = useCallback((url) => {
    setBackgroundImage(url);
  }, []);

  const handlePinAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleFirebaseAuthSuccess = useCallback((userCredentialUser, profileData) => {
    setUser(userCredentialUser);
    setUserId(userCredentialUser.uid);
    setUserProfile(profileData);
    setIsAuthenticated(true);
    navigate('/home');
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    if (auth) {
      try {
        await signOut(auth);
        console.log("Firebase: User signed out.");
        setUser(null);
        setUserId(null);
        setJournalEntries([]);
        setUserProfile({});
        setIsAuthenticated(false);
        navigate('/');
      } catch (error) {
        console.error("Firebase: Error signing out:", error);
      }
    }
  }, [auth, navigate]);

  // --- Conditional Rendering for Auth/Pin/Main App ---
  // Only render Auth if Firebase is ready AND no user
  if (!user && isFirebaseReady) {
    return <Auth db={db} auth={auth} onAuthSuccess={handleFirebaseAuthSuccess} isFirebaseReady={isFirebaseReady} />;
  }
  // Render loading screen if Firebase is not ready yet
  if (!isFirebaseReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="flex flex-col items-center p-8 rounded-lg shadow-xl bg-white dark:bg-gray-800">
          <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">Loading Firebase services...</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">This should only take a moment.</p>
        </div>
      </div>
    );
  }

  if (isAppLocked && !isAuthenticated) {
    return <PinEntryScreen expectedPin={appPin} onAuthenticate={handlePinAuthenticated} />;
  }

  return (
    <div
      className="flex h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        handleSignOut={handleSignOut}
      />

      <div className="flex-1 flex flex-col overflow-hidden md:pl-16">
        <Header
          user={user}
          userProfile={userProfile}
          handleSignOut={handleSignOut}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={
                <Home
                  saveJournalEntry={saveJournalEntry}
                  deleteJournalEntry={deleteJournalEntry}
                  initialEntry={entryToEdit}
                  setEntryToEdit={setEntryToEdit}
                  isDarkMode={isDarkMode}
                  journalEntries={journalEntries}
                  getLocalDateString={getLocalDateString}
                  journalPageSelectedDate={journalPageSelectedDate}
                  onJournalPageDateChange={handleJournalPageDateChange}
                />
              }
            />
            <Route
              path="/calendar"
              element={
                <Calendar
                  journalEntries={journalEntries}
                  isDarkMode={isDarkMode}
                  onEditEntry={handleEditFromCalendar}
                  getLocalDateString={getLocalDateString}
                />
              }
            />
            <Route
              path="/profile"
              element={<Profile userProfile={userProfile} updateUserProfile={updateUserProfile} userId={userId} />}
            />
            <Route path="/reports" element={<Reports journalEntries={journalEntries} isDarkMode={isDarkMode} getLocalDateString={getLocalDateString} />} />
            <Route
              path="/settings"
              element={
                <Settings
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  backgroundImage={backgroundImage}
                  onBackgroundImageChange={onBackgroundImageChange}
                  isAppLocked={isAppLocked}
                  appPin={appPin}
                  setIsAppLocked={setIsAppLocked}
                  setAppPin={setAppPin}
                  setIsAuthenticated={setIsAuthenticated}
                  selectedFont={selectedFont}
                  setSelectedFont={setSelectedFont}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
