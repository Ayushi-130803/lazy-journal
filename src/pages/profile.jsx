import React, { useState } from 'react';
import {
  UserCircleIcon, CakeIcon, PhotoIcon, BellAlertIcon, CalendarDaysIcon, MusicalNoteIcon,
  SparklesIcon, SunIcon, MoonIcon, ClockIcon, PencilSquareIcon // Added new icons
} from '@heroicons/react/24/outline';

function Profile() {
  // State to manage profile details
  const [profile, setProfile] = useState({
    name: 'Journal Keeper',
    nickname: '',
    avatarUrl: 'https://placehold.co/128x128/a78bfa/ffffff?text=JK',
    dob: '2000-01-01',
    bio: 'A humble journal enthusiast.',
    notificationSound: 'chime',
    journalFrequency: 'daily',
    // New: Personalized Greeting Preference
    greetingPreference: 'Good morning, {Name}!', // Default greeting
    customGreeting: '', // For 'Other' option
    // New: Journaling Time Slot
    journalingTimeSlot: 'morning', // Default time slot
    // New: My Journaling Journey
    journalingJourney: 'My journaling journey is about finding peace and clarity in my daily life.',
  });

  // State to manage editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes for text fields and select dropdowns
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle file input change for avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatarUrl: imageUrl,
      }));
    }
  };

  // Handle saving profile changes
  const handleSave = () => {
    console.log('Profile Saved:', profile);
    // In a real app, you would send this data to a backend.
    setIsEditing(false);
    alert('Profile updated successfully!'); // IMPORTANT: Do NOT use alert() in final applications.
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        <span role="img" aria-label="profile icon" className="mr-2">
          👤
        </span>
        Your Profile
      </h2>

      <div className="flex flex-col items-center mb-8 relative">
        <img
          src={profile.avatarUrl}
          alt="User Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-400 dark:border-indigo-600 shadow-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/128x128/a78bfa/ffffff?text=JK';
          }}
        />
        {isEditing && (
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4
                       bg-indigo-500 text-white p-2 rounded-full cursor-pointer
                       hover:bg-indigo-600 transition-colors duration-200 shadow-lg"
            title="Change Profile Picture"
          >
            <PhotoIcon className="h-5 w-5" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        )}
        <h3 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-gray-200">{profile.name}</h3>
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
            <option value="Good morning, {Name}!">Good morning, {profile.name}!</option>
            <option value="Welcome back, {Nickname}!">Welcome back, {profile.nickname || profile.name}!</option>
            <option value="Hello, {Name}!">Hello, {profile.name}!</option>
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

        {/* Date of Birth Field */}
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <CakeIcon className="inline-block h-5 w-5 mr-1 text-pink-500" /> Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
            `}
          />
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
                onClick={() => isEditing && setProfile(prev => ({ ...prev, journalingTimeSlot: slot }))}
                disabled={!isEditing}
                className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center
                  ${profile.journalingTimeSlot === slot
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
                  ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {slot === 'morning' && <SunIcon className="h-5 w-5 mr-1" />}
                {slot === 'afternoon' && <ClockIcon className="h-5 w-5 mr-1" />}
                {slot === 'evening' && <MoonIcon className="h-5 w-5 mr-1" />}
                {slot === 'night' && <span role="img" aria-label="owl icon" className="mr-1">🦉</span>}
                {slot.charAt(0).toUpperCase() + slot.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Journaling Frequency */}
        <div>
          <label htmlFor="journalFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <CalendarDaysIcon className="inline-block h-5 w-5 mr-1 text-blue-500" /> Journaling Frequency
          </label>
          <select
            id="journalFrequency"
            name="journalFrequency"
            value={profile.journalFrequency}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
            `}
          >
            <option value="daily">Daily</option>
            <option value="everyOtherDay">Every Other Day</option>
            <option value="weekly">Weekly</option>
            <option value="whenIFeelLikeIt">When I Feel Like It</option>
          </select>
        </div>

        {/* Notification Sound Type */}
        <div>
          <label htmlFor="notificationSound" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <MusicalNoteIcon className="inline-block h-5 w-5 mr-1 text-green-500" /> Notification Sound
          </label>
          <select
            id="notificationSound"
            name="notificationSound"
            value={profile.notificationSound}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
            `}
          >
            <option value="chime">Gentle Chime</option>
            <option value="bell">Soft Bell</option>
            <option value="ping">Subtle Ping</option>
            <option value="none">None</option>
          </select>
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

        {/* New: My Journaling Journey */}
        <div>
          <label htmlFor="journalingJourney" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <PencilSquareIcon className="inline-block h-5 w-5 mr-1 text-teal-500" /> My Journaling Journey
          </label>
          <textarea
            id="journalingJourney"
            name="journalingJourney"
            value={profile.journalingJourney}
            onChange={handleChange}
            readOnly={!isEditing}
            rows="4"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base resize-y min-h-[100px]
              ${isEditing ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' : 'bg-gray-50 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300 cursor-default'}
            `}
            placeholder="What does journaling mean to you? What are your aspirations for your practice?"
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
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-8 transition-all duration-200 transform hover:scale-105"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;