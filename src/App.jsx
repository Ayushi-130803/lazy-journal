import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import components
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PinEntryScreen from './components/PinEntryScreen';

// Helper function to get the local date string in YYYY-MM-DD format
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('src/utils/theme1.jpg');
  const [selectedFont, setSelectedFont] = useState('font-nunito');

  const [isAppLocked, setIsAppLocked] = useState(false);
  const [appPin, setAppPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [journalEntries, setJournalEntries] = useState([]);
  const [entryToEdit, setEntryToEdit] = useState(null);
  // NEW: State to hold the date selected in JournalPage's date picker
  const [journalPageSelectedDate, setJournalPageSelectedDate] = useState(getLocalDateString());


  useEffect(() => {
    console.log("App: Initial useEffect - Loading from localStorage");
    const storedLockStatus = localStorage.getItem('isAppLocked');
    const storedAppPin = localStorage.getItem('appPin');
    const storedFont = localStorage.getItem('selectedFont');
    const storedJournalEntries = localStorage.getItem('journalEntries');

    if (storedLockStatus === 'true' && storedAppPin) {
      setIsAppLocked(true);
      setAppPin(storedAppPin);
      setIsAuthenticated(false);
    } else {
      setIsAppLocked(false);
      setIsAuthenticated(true);
    }

    if (storedFont) {
      setSelectedFont(storedFont);
    }

    if (storedJournalEntries) {
      try {
        const parsedEntries = JSON.parse(storedJournalEntries);
        const sanitizedEntries = parsedEntries.map(entry => ({
            ...entry,
            entryDetails: Array.isArray(entry.entryDetails) ? entry.entryDetails : [],
            moods: Array.isArray(entry.moods) ? entry.moods : []
        }));
        setJournalEntries(sanitizedEntries);
        console.log("App: Loaded journal entries from localStorage:", sanitizedEntries);
      } catch (e) {
        console.error("App: Error parsing journal entries from localStorage:", e);
        setJournalEntries([]);
      }
    } else {
      console.log("App: No journal entries found in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (journalEntries !== null) {
      console.log("App: Saving journal entries to localStorage:", journalEntries);
      localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }
  }, [journalEntries]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('font-')) {
        document.documentElement.classList.remove(cls);
      }
    });
    document.documentElement.classList.add(selectedFont);
    localStorage.setItem('selectedFont', selectedFont);
  }, [selectedFont]);

  const saveJournalEntry = useCallback((date, promptResponses, selectedMoods) => {
    console.log("App: saveJournalEntry received promptResponses:", promptResponses);
    console.log("App: saveJournalEntry received selectedMoods:", selectedMoods);

    const newEntry = {
      date: date,
      entryDetails: promptResponses,
      moods: selectedMoods,
      timestamp: new Date().toISOString(),
    };
    console.log("App: saveJournalEntry final new entry data:", newEntry);

    setJournalEntries(prevEntries => {
      const existingEntryIndex = prevEntries.findIndex(entry => entry.date === date);
      let updatedEntries;

      if (existingEntryIndex !== -1) {
        updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = newEntry;
        console.log("App: Updated existing journal entry for", date);
      } else {
        updatedEntries = [...prevEntries, newEntry];
        console.log("App: Added new journal entry for", date);
      }
      return updatedEntries;
    });

    setEntryToEdit(null); // Clear editing state after save
    setJournalPageSelectedDate(date); // Keep the current date selected after saving
    console.log("App: Cleared entryToEdit state. Set journalPageSelectedDate to:", date);
  }, []);

  // NEW: Function to delete a journal entry
  const deleteJournalEntry = useCallback((dateToDelete) => {
    console.log("App: deleteJournalEntry called for date:", dateToDelete);
    setJournalEntries(prevEntries => {
      const updatedEntries = prevEntries.filter(entry => entry.date !== dateToDelete);
      console.log("App: Entries after deletion:", updatedEntries);
      return updatedEntries;
    });
    setEntryToEdit(null); // Clear editing state
    // No need to reset journalPageSelectedDate, as it should remain on the current (now blank) day
    console.log("App: Cleared entryToEdit state after deletion.");
  }, []);

  const handleEditFromCalendar = useCallback((entry) => {
    console.log("App: handleEditFromCalendar called for entry:", entry);
    setEntryToEdit(entry);
    setJournalPageSelectedDate(entry.date); // Set JournalPage's date to the edited entry's date
    navigate('/home');
  }, [navigate]);

  // NEW: Callback for JournalPage to update its selected date
  const handleJournalPageDateChange = useCallback((date) => {
    console.log("App: handleJournalPageDateChange called, setting date:", date);
    setJournalPageSelectedDate(date);
    setEntryToEdit(null); // Always clear edit state when date changes manually in JournalPage
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
      />

      <div className="flex-1 flex flex-col overflow-hidden md:pl-16">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={
                <Home
                  saveJournalEntry={saveJournalEntry}
                  deleteJournalEntry={deleteJournalEntry} // Pass delete function
                  initialEntry={entryToEdit}
                  setEntryToEdit={setEntryToEdit}
                  isDarkMode={isDarkMode}
                  journalEntries={journalEntries}
                  getLocalDateString={getLocalDateString}
                  journalPageSelectedDate={journalPageSelectedDate} // Pass selected date
                  onJournalPageDateChange={handleJournalPageDateChange} // Pass date change handler
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
            <Route path="/profile" element={<Profile />} />
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
