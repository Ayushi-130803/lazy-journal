import React from 'react';

function ProfilePage() {
  const user = {
    name: 'Chetna',
    dob: '2004-07-20',
    gender: 'Female',
    profilePic: '', // Future upload feature
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="border p-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>DOB:</strong> {user.dob}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Profile Picture:</strong> [To be uploaded]</p>
      </div>
    </div>
  );
}

export default ProfilePage;
