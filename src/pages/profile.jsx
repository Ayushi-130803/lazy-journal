import React, { useState, useEffect, useRef } from 'react';
import {
  UserCircleIcon, CakeIcon, SparklesIcon, ClockIcon, CameraIcon
} from '@heroicons/react/24/outline';

// Custom Date Picker Component
const CustomDatePicker = ({ selectedDate, onChange, onClose }) => {
  // Fix: Initialize date from selectedDate string carefully to avoid timezone issues.
  const initialDate = selectedDate ? new Date(selectedDate.replace(/-/g, '/')) : new Date();
  const [date, setDate] = useState(initialDate);
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear());

  useEffect(() => {
    if (selectedDate) {
      const newDate = new Date(selectedDate.replace(/-/g, '/'));
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
  }, [selectedDate]);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDayClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    // Fix: Ensure the date is formatted correctly to avoid timezone shifts
    const formattedDate = newDate.getFullYear() + '-' +
      String(newDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(day).padStart(2, '0');
    onChange(formattedDate);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const renderDays = () => {
    const days = [];
    const emptyCells = firstDayOfMonth(currentMonth, currentYear);
    const numDays = daysInMonth(currentMonth, currentYear);
    const today = new Date();
    const selectedDateObj = selectedDate ? new Date(selectedDate.replace(/-/g, '/')) : null;

    for (let i = 0; i < emptyCells; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= numDays; day++) {
      const isSelected = selectedDateObj && selectedDateObj.getDate() === day && selectedDateObj.getMonth() === currentMonth && selectedDateObj.getFullYear() === currentYear;
      const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`p-2 rounded-full font-semibold transition-all duration-200
            ${isSelected ? 'bg-indigo-600 text-white shadow-md transform scale-110' : ''}
            ${isToday && !isSelected ? 'bg-indigo-200 text-indigo-800' : ''}
            ${!isSelected && !isToday ? 'hover:bg-gray-200 dark:hover:bg-gray-600' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const yearOptions = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).reverse();

  return (
    <div className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"><span className="text-gray-600 dark:text-gray-300">{'<'}</span></button>
        <div className="flex gap-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="bg-transparent text-lg font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="bg-transparent text-lg font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"><span className="text-gray-600 dark:text-gray-300">{'>'}</span></button>
      </div>
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 dark:text-gray-400 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 text-center text-sm mt-2 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

// Main Profile component
function App() {
  const [profile, setProfile] = useState({
    // Change: The initial name is now an empty string, with a placeholder for user guidance.
    name: '',
    nickname: '',
    dob: '2000-01-01',
    bio: 'A humble journal enthusiast.',
    greetingPreference: 'Good morning, {Name}!',
    customGreeting: '',
    journalingTimeSlot: 'morning',
  });

  const [profilePic, setProfilePic] = useState('');
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // A default name to display if the user hasn't entered one.
  const displayName = profile.name || 'Journal Keeper';

  // Function to get initials from the display name
  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    let initials = '';
    if (nameParts.length > 0 && nameParts[0].length > 0) {
      initials += nameParts[0][0];
    }
    if (nameParts.length > 1 && nameParts[nameParts.length - 1].length > 0) {
      initials += nameParts[nameParts.length - 1][0];
    }
    return initials.toUpperCase();
  };

  // Handle changes for text and select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  // Handle changes for the date of birth
  const handleDobChange = (date) => {
    setProfile(prev => ({ ...prev, dob: date }));
  };

  // Handle changes for the journaling time slot
  const handleTimeSlotClick = (slot) => {
    setProfile(prev => ({ ...prev, journalingTimeSlot: slot }));
  };

  // Logic to handle the file upload for the profile picture
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setProfilePic(newImageUrl);
    }
  };

  // Trigger the hidden file input when the avatar is clicked
  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleSave = () => {
    console.log('Profile Saved:', profile, 'with picture:', profilePic);
    setIsEditing(false);
    console.log('Profile updated successfully!');
  };
  
  // Closes the date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest('#dob-input-container')) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  const initials = getInitials(displayName);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300 font-sans">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center text-gray-800 dark:text-gray-200">
        <span role="img" aria-label="diary-icon" className="mr-2 text-3xl transition-all duration-200 hover:scale-110">
          📖
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 underline">Your Profile</span>
      </h2>

      <div className="flex flex-col items-center mb-8 relative">
        {/* Profile Picture Upload Section */}
        <div
          className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-indigo-400 dark:border-indigo-600 shadow-md cursor-pointer group"
        >
          {profilePic ? (
            // Display image if a profile picture URL exists
            <img
              src={profilePic}
              alt="Profile Avatar"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              // Fallback in case of a broken image URL
              onError={(e) => {
                e.target.onerror = null;
                setProfilePic(''); // Revert to initials on image error
              }}
            />
          ) : (
            // Display initials if no profile picture is set
            <div className="flex items-center justify-center w-full h-full bg-indigo-500 text-white text-5xl font-bold">
              {initials}
            </div>
          )}

          {/* Camera icon for explicit photo upload */}
          {isEditing && (
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white dark:border-gray-800 transform translate-x-1/4 translate-y-1/4 hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-8"
              aria-label="Upload profile picture"
            >
              <CameraIcon className="w-5 h-5" />
            </button>
          )}
          

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        
        <h3 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-gray-200">{displayName}</h3>
        {profile.nickname && <p className="text-gray-500 dark:text-gray-400 text-sm">({profile.nickname})</p>}
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{profile.dob}</p>
      </div>

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <UserCircleIcon className="inline-block h-5 w-5 mr-1 text-indigo-500" /> Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            readOnly={!isEditing}
            // Change: Added a placeholder that will show when the input is empty.
            placeholder="Journal Keeper"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
            `}
          />
        </div>

        {/* Nickname Field */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <UserCircleIcon className="inline-block h-5 w-5 mr-1 text-purple-500" /> Nickname (Optional)
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={profile.nickname}
            onChange={handleChange}
            readOnly={!isEditing}
            placeholder="e.g., Journal Buddy"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
            `}
          />
        </div>

        {/* New: Personalized Greeting Preference */}
        <div>
          <label htmlFor="greetingPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <SparklesIcon className="inline-block h-5 w-5 mr-1 text-yellow-500" /> How should I greet you?
          </label>
          <select
            id="greetingPreference"
            name="greetingPreference"
            value={profile.greetingPreference}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
            `}
          >
            <option value="Good morning, {Name}!">Good morning, {displayName}!</option>
            <option value="Welcome back, {Nickname}!">Welcome back, {profile.nickname || displayName}!</option>
            <option value="Hello, {Name}!">Hello, {displayName}!</option>
            <option value="Hey there, {Name}!">Hey there, {displayName}!</option>
            <option value="Let's make some memories, {Name}!">Let's make some memories, {displayName}!</option>
            <option value="Shine bright, {Name}!">Shine bright, {displayName}!</option>
            <option value="Sending you good vibes, {Name}!">Sending you good vibes, {displayName}!</option>
            <option value="Other">Other (Type below)</option>
          </select>
          {profile.greetingPreference === 'Other' && isEditing && (
            <input
              type="text"
              name="customGreeting"
              value={profile.customGreeting}
              onChange={handleChange}
              placeholder="e.g., Hey there, sunshine!"
              className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
          )}
        </div>

        {/* Date of Birth Field with custom date picker */}
        <div id="dob-input-container" className="relative">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <CakeIcon className="inline-block h-5 w-5 mr-1 text-pink-500" /> Date of Birth
          </label>
          <div className="relative">
            <input
              type="text"
              id="dob"
              name="dob"
              value={profile.dob}
              readOnly
              onClick={() => isEditing && setShowDatePicker(!showDatePicker)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer
                ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
              `}
            />
            {isEditing && (
                <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <CakeIcon className="h-5 w-5" />
                </button>
            )}
          </div>
          {isEditing && showDatePicker && (
            <CustomDatePicker
              selectedDate={profile.dob}
              onChange={handleDobChange}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </div>

        {/* New: Favorite Journaling Time Slot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <ClockIcon className="inline-block h-5 w-5 mr-1 text-orange-500" /> Your Favorite Journaling Time
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['morning', 'afternoon', 'evening', 'night'].map((slot) => (
              <button
                key={slot}
                onClick={() => handleTimeSlotClick(slot)}
                disabled={!isEditing}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center
                  ${profile.journalingTimeSlot === slot
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
                  ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Replaced Heroicons with emojis for a more colorful look */}
                {slot === 'morning' && <span role="img" aria-label="sun icon" className="mr-1">☀️</span>}
                {slot === 'afternoon' && <span role="img" aria-label="coffee icon" className="mr-1">☕</span>}
                {slot === 'evening' && <span role="img" aria-label="moon icon" className="mr-1">🌙</span>}
                {slot === 'night' && <span role="img" aria-label="owl icon" className="mr-1">🦉</span>}
                {slot.charAt(0).toUpperCase() + slot.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bio/Additional Details Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <span role="img" aria-label="memo icon" className="mr-1">📝</span> Bio / About Me
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            readOnly={!isEditing}
            rows="3"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base resize-y min-h-[80px]
              ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
            `}
          ></textarea>
        </div>
      </div>

      <div className="mt-8 text-center">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-8 transition-all duration-200 transform hover:scale-105"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-8 transition-all duration-200 transform hover:scale-105"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

export default App;