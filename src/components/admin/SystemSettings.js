import React, { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettings } from '../../firebase/helpers';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    maintenanceMode: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSystemSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    await updateSystemSettings(settings);
    alert('Settings updated successfully!');
  };

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Site Name:</label>
        <input
          type="text"
          name="siteName"
          value={settings.siteName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          name="maintenanceMode"
          checked={settings.maintenanceMode}
          onChange={handleChange}
          className="w-5 h-5"
        />
        <label className="font-medium">Maintenance Mode</label>
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>
    </div>
  );
};

export default SystemSettings;
