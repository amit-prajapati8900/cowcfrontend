// SensorAlerts.jsx
import React from 'react';

const SensorAlerts = ({ alerts }) => {
  const alertTypes = {
    leakageDetected: '💧 Leakage Detected',
    pressureDropAlert: '📉 Pressure Drop',
    highConsumptionAlert: '📈 High Usage',
    qualityAlert: '🧪 Water Quality'
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200 shadow-lg">
      <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
        🚨 Active Alerts ({alerts.length})
      </h3>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            ✅
          </div>
          <p>All systems normal</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.slice(0, 5).map((alert) => (
            <AlertItem key={alert._id} alert={alert} alertTypes={alertTypes} />
          ))}
        </div>
      )}
    </div>
  );
};

// NewSensorForm.jsx
import { useState } from 'react';
import axios from 'axios';

const NewSensorForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    meterId: '',
    flowRate: '',
    pressure: '',
    volume: '',
    phLevel: '',
    temperature: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_BASE = 'http://localhost:2323';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_BASE}/sensor/new`, formData);
      setSuccess(true);
      onSuccess(); // Refresh data
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ meterId: '', flowRate: '', pressure: '', volume: '', phLevel: '', temperature: '' });
    } catch (error) {
      console.error('Error saving sensor:', error);
      alert('Error saving sensor data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Sensor Data</h3>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm">
          ✅ Sensor data saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Meter ID (MTR001)"
            value={formData.meterId}
            onChange={(e) => setFormData({...formData, meterId: e.target.value})}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <input
            type="number"
            placeholder="Flow Rate (LPM)"
            value={formData.flowRate}
            onChange={(e) => setFormData({...formData, flowRate: e.target.value})}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            step="0.1"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Pressure (PSI)"
            value={formData.pressure}
            onChange={(e) => setFormData({...formData, pressure: e.target.value})}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            step="0.1"
            required
          />
          <input
            type="number"
            placeholder="Volume (L)"
            value={formData.volume}
            onChange={(e) => setFormData({...formData, volume: e.target.value})}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="pH Level"
            value={formData.phLevel}
            onChange={(e) => setFormData({...formData, phLevel: e.target.value})}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            step="0.1"
          />
          <input
            type="number"
            placeholder="Temperature (°C)"
            value={formData.temperature}
            onChange={(e) => setFormData({...formData, temperature: e.target.value})}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            step="0.1"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save Sensor Data</span>
              <span>💾</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// AlertItem.jsx (Helper Component)
const AlertItem = ({ alert, alertTypes }) => (
  <div className="flex items-center p-3 bg-white rounded-xl shadow-sm border-l-4 border-red-400">
    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
      🚨
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-red-900 truncate">{alert.meterId}</p>
      <p className="text-sm text-gray-600">
        {Object.entries(alertTypes).map(([key, label]) => 
          alert[key] ? label : null
        ).filter(Boolean).join(', ')}
      </p>
    </div>
    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
      {new Date(alert.timestamp).toLocaleTimeString()}
    </span>
  </div>
);

export { SensorAlerts, NewSensorForm };