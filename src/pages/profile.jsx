import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  TagIcon,
  CalendarDaysIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Profile = ({ userProfile, updateUserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(userProfile || {});
  const [feedback, setFeedback] = useState('');

  // Sync internal state with props from App.jsx
  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile);
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Placeholder for saving the data (e.g., to a database)
    updateUserProfile(profileData);
    setIsEditing(false);
    setFeedback('Profile updated successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleCancel = () => {
    // Revert changes and exit editing mode
    setProfileData(userProfile);
    setIsEditing(false);
    setFeedback('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200 flex items-center justify-center">
        <UserCircleIcon className="h-8 w-8 mr-2 text-indigo-500" />
        User Profile
      </h2>
      
      {feedback && (
        <div className={`p-3 rounded-md text-center mb-4 ${feedback.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {feedback}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
            <div className="flex items-center mt-1">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              ) : (
                <span className="text-lg text-gray-900 dark:text-gray-100">{profileData.firstName || 'N/A'}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <div className="flex items-center mt-1">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              ) : (
                <span className="text-lg text-gray-900 dark:text-gray-100">{profileData.lastName || 'N/A'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <div className="flex items-center mt-1">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profileData.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            ) : (
              <span className="text-lg text-gray-900 dark:text-gray-100">{profileData.email || 'N/A'}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nickname</label>
            <div className="flex items-center mt-1">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="text"
                  name="nickname"
                  value={profileData.nickname || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              ) : (
                <span className="text-lg text-gray-900 dark:text-gray-100">{profileData.nickname || 'N/A'}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <div className="flex items-center mt-1">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profileData.phoneNumber || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              ) : (
                <span className="text-lg text-gray-900 dark:text-gray-100">{profileData.phoneNumber || 'N/A'}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
          <div className="flex items-center mt-1">
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
            {isEditing ? (
              <input
                type="date"
                name="dob"
                value={profileData.dob || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            ) : (
              <span className="text-lg text-gray-900 dark:text-gray-100">{profileData.dob || 'N/A'}</span>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center"
              >
                <CheckIcon className="h-5 w-5 mr-2" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors flex items-center"
              >
                <XMarkIcon className="h-5 w-5 mr-2" /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center"
            >
              <PencilSquareIcon className="h-5 w-5 mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;