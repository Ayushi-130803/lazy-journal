import React, { useState } from 'react';
import CalendarTile from '../components/Calendartile';
import { getMoodBgColorClass, getMoodTextColorClass, getRgbValueFromTailwindClass } from '../data/moodWords';
import { promptsData } from '../data/prompts'; // Import promptsData to show prompt text in modal

function Calendar({ journalEntries, isDarkMode, onEditEntry }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEntryPopup, setShowEntryPopup] = useState(false);
  const [selectedDayEntry, setSelectedDayEntry] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  console.log("Calendar: Component re-rendering. Current date:", currentDate.toISOString().slice(0, 7));
  console.log("Calendar: Received journalEntries:", journalEntries);

  const safeJournalEntries = Array.isArray(journalEntries) ? journalEntries : [];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const findEntryForDate = (dateString) => {
    return safeJournalEntries.find(entry => entry.date === dateString);
  };

  const entriesForMonth = safeJournalEntries.reduce((acc, entry) => {
    const entryDate = new Date(entry.date);
    if (isNaN(entryDate.getTime())) {
      console.warn("Calendar: Skipping entry with invalid date format:", entry.date);
      return acc;
    }
    
    if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
      const day = entryDate.getDate();
      acc[day] = entry;
    }
    return acc;
  }, {});
  console.log("Calendar: entriesForMonth pre-processed:", entriesForMonth);


  const getEntryForDate = (day) => {
    return entriesForMonth[day] || null;
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleTileClick = (day) => {
    if (!day) return;

    const clickedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log("Calendar: Tile clicked. Looking for entry on date:", clickedDate);
    const entry = findEntryForDate(clickedDate);
    if (entry) {
      setSelectedDayEntry(entry);
      setShowEntryPopup(true);
      console.log("Calendar: Entry found and setting popup to true for entry:", entry);
    } else {
      console.log("Calendar: No entry found for date:", clickedDate);
    }
  };

  const EntryModal = ({ entry, onClose, onEdit, isDarkMode }) => {
    if (!entry) {
      console.error("EntryModal: 'entry' prop is null or undefined.");
      return null;
    }

    const modalBgClass = isDarkMode ? "bg-gray-800" : "bg-white";
    const textColorClass = isDarkMode ? "text-gray-100" : "text-gray-900";
    const borderColorClass = isDarkMode ? "border-gray-700/50" : "border-gray-200/50";

    console.log("EntryModal: Rendering for entry:", entry);

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className={`relative ${modalBgClass} backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${borderColorClass} border ${textColorClass}`}>
          {/* Edit Button */}
          <button
            onClick={() => {
              onClose();
              onEdit(entry);
            }}
            className="absolute top-4 left-4 p-2 text-blue-400 hover:text-blue-300 rounded-full hover:bg-gray-700 transition"
            aria-label="Edit Journal Entry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition"
            aria-label="Close"
          >
            ✕
          </button>

          <h3 className={`text-2xl font-bold mb-4 text-center ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
            Journal Entry for {entry.date}
          </h3>

          {/* Display Moods */}
          {entry.moods && Array.isArray(entry.moods) && entry.moods.length > 0 ? (
            <div className="mb-6">
              <p className={`font-semibold mb-2 ${textColorClass}`}>Moods:</p>
              <div className="flex flex-wrap gap-2">
                {entry.moods.map((moodItem, index) => (
                  <span
                    key={moodItem.mood?.id || index}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium
                               ${getMoodBgColorClass(moodItem.mood?.baseColor || 'gray', moodItem.intensity || 1)}
                               ${getMoodTextColorClass(moodItem.mood?.baseColor || 'gray', moodItem.intensity || 1)}`}
                  >
                    {moodItem.mood?.word || 'Unknown Mood'}
                  </span>
                ))}
              </div>
            </div>
          ) : (
             <p className={`mb-6 italic ${textColorClass}`}>No mood recorded for this entry.</p>
          )}


          {/* Display Journal Prompts and Responses */}
          <div className="space-y-4">
            {entry.entryDetails && Array.isArray(entry.entryDetails) && entry.entryDetails.length > 0 ? (
              entry.entryDetails.map((detail, index) => {
                const promptText = promptsData.find(p => p.id === detail.promptId)?.text || `Prompt ${detail.promptId || 'null'} (Unknown)`;
                return (
                  <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <p className={`font-semibold mb-1 ${textColorClass}`}>
                      {promptText}:
                    </p>
                    <p className={`text-sm ${textColorClass}`}>{detail.entryText || '[No response]'}</p>
                  </div>
                );
              })
            ) : (
              <p className={`italic ${textColorClass}`}>No journal responses recorded for this entry.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto font-sans">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 min-h-[70vh] transition-all duration-300">
        <h2 className="text-lg font-bold mb-2 text-center text-gray-800 dark:text-gray-200">
          <span role="img" aria-label="calendar icon" className="mr-2">
            📅
          </span>
          Mood Calendar
        </h2>

        <div className="flex justify-between items-center mb-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            &lt;
          </button>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            {getMonthName(currentDate)} {year}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
          >
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((dayName) => (
            <div key={dayName} className="text-center font-medium text-gray-600 dark:text-gray-400 text-xs">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 h-full">
          {days.map((day, index) => {
            const entry = day ? getEntryForDate(day) : null;
            const today = new Date();
            const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
            const isToday = day && isCurrentMonth && day === today.getDate();
            const hasEntry = !!entry;
            // REINSTATED: isMissed calculation
            const isPastDay = day && isCurrentMonth && day < today.getDate();
            const isMissed = day && isPastDay && !hasEntry;
            
            return (
              <CalendarTile
                key={index}
                day={day}
                entry={entry}
                isToday={isToday}
                isMissed={isMissed} // REINSTATED: Pass isMissed prop
                hasEntry={hasEntry}
                isDarkMode={isDarkMode}
                onTileClick={handleTileClick}
              />
            );
          })}
        </div>
      </div>

      {showEntryPopup && (
        <EntryModal
          entry={selectedDayEntry}
          onClose={() => setShowEntryPopup(false)}
          onEdit={onEditEntry}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default Calendar;
