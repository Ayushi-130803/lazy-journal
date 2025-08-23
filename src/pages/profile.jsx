import React, { useState, useEffect } from 'react';
import {
  EnvelopeIcon,
  TagIcon,
  CalendarDaysIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Profile = ({ userProfile, updateUserProfile }) => {
  // isEditing controls the toggle between view mode and edit mode.
  const [isEditing, setIsEditing] = useState(false);
  // profileData holds the local state of the user profile, which can be edited.
  const [profileData, setProfileData] = useState(userProfile || {});
  const [feedback, setFeedback] = useState('');

  // This effect syncs the local state (profileData) with the prop (userProfile)
  // whenever the parent component updates the userProfile. This ensures the
  // component always displays the latest data from the database.
  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile);
    }
  }, [userProfile]);

  // Handles input changes in the form fields.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles the save action.
  const handleSave = async () => {
    // Call the parent function to update the profile in the database.
    const success = await updateUserProfile(profileData);
    if (success) {
      // If the database update is successful, exit editing mode.
      setIsEditing(false);
      setFeedback('Profile updated successfully!');
      setTimeout(() => setFeedback(''), 3000);
    } else {
      // If the update fails, show an error and stay in editing mode.
      setFeedback('Failed to update profile. Please try again.');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  // Handles the cancel action.
  const handleCancel = () => {
    // Revert the local state back to the last saved profile from props.
    setProfileData(userProfile);
    // Exit editing mode without saving changes.
    setIsEditing(false);
    setFeedback('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      {/* Heading */}
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 dark:text-blue-400 underline">
        User Profile
      </h2>

      {/* Feedback message */}
      {feedback && (
        <div className={`p-3 rounded-md text-center mb-4 ${feedback.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {feedback}
        </div>
      )}

      {/* Personal Information Section */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center">
          <UserIcon className="h-6 w-6 mr-2 text-blue-600" />
          Personal Information
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
            <div className="flex items-center mt-1">
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-lg text-slate-900 dark:text-white">{profileData.firstName || 'N/A'}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <div className="flex items-center mt-1">
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-lg text-slate-900 dark:text-white">{profileData.lastName || 'N/A'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center">
          <EnvelopeIcon className="h-6 w-6 mr-2 text-blue-600" />
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <div className="flex items-center mt-1">
              <span className="text-lg text-slate-900 dark:text-white">{profileData.email || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Other Details Section */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center">
          <PencilSquareIcon className="h-6 w-6 mr-2 text-blue-600" />
          Other Details
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nickname</label>
            <div className="flex items-center mt-1">
              {isEditing ? (
                <input
                  type="text"
                  name="nickname"
                  value={profileData.nickname || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-lg text-slate-900 dark:text-white">{profileData.nickname || 'N/A'}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
            <div className="flex items-center mt-1">
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={profileData.dob || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-lg text-slate-900 dark:text-white">{profileData.dob || 'N/A'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons section */}
      <div className="pt-4 flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 flex items-center"
            >
              <CheckIcon className="h-5 w-5 mr-2" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-rose-600 text-white font-semibold rounded-full shadow-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-transform transform hover:scale-105 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 mr-2" /> Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105 flex items-center"
          >
            <PencilSquareIcon className="h-5 w-5 mr-2" /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;