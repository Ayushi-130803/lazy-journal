import React, { useState } from 'react';

function SettingsPage() {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [theme, setTheme] = useState('light');

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Reminder Time</label>
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="border p-2 rounded">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="border p-4 mt-6">[Manage skip reasons, post-entry messages, etc. here]</div>
    </div>
  );
}

export default SettingsPage;
