// LiveSensors.jsx
import React from "react";

// ✅ sensors = [] default rakha hai
const LiveSensors = ({ sensors = [], loading = false }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Live Sensors</h2>
        <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Auto Refresh
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading sensors...</span>
        </div>
      ) : sensors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            📡
          </div>
          <p>No sensor data available</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sensors.slice(0, 8).map((sensor) => (
            <SensorCard key={sensor._id} sensor={sensor} />
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Helper component internal hi rakho
const SensorCard = ({ sensor }) => {
  const hasAlert =
    sensor.leakageDetected ||
    sensor.pressureDropAlert ||
    sensor.highConsumptionAlert ||
    sensor.qualityAlert;

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
        hasAlert
          ? "border-red-200 bg-red-50 shadow-md"
          : "border-gray-100 hover:border-blue-200"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-800">
          {sensor.meterId || "Unknown"}
        </h4>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            sensor.deviceStatus === "online"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {sensor.deviceStatus === "online" ? "🟢 Live" : "🔴 Offline"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Flow</span>
          <p className="font-mono">{sensor.flowRate?.toFixed(1) || 0} LPM</p>
        </div>
        <div>
          <span className="text-gray-500">Pressure</span>
          <p className="font-mono">{sensor.pressure?.toFixed(1) || 0} PSI</p>
        </div>
        <div>
          <span className="text-gray-500">Volume</span>
          <p className="font-mono">{sensor.volume?.toFixed(0) || 0} L</p>
        </div>
        <div>
          <span className="text-gray-500">pH</span>
          <p className="font-mono">{sensor.phLevel?.toFixed(1) || "-"} </p>
        </div>
      </div>

      {hasAlert && (
        <div className="mt-3 p-2 bg-red-100 rounded-lg">
          <span className="text-red-800 text-xs font-medium">🚨 Alert Active</span>
        </div>
      )}
    </div>
  );
};

// ✅ Default export only LiveSensors
export default LiveSensors;
