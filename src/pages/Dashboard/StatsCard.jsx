import React from 'react';

export default function StatsCard({ title, value, children }) {
  return (
    <div className="stats-card" style={{backgroundColor:"black"}}>
      <div className="stats-icon">{children || <span>•</span>}</div>
      <div className="stats-info">
        <div className="stats-title">{title}</div>
        <div className="stats-value">{value}</div>
      </div>
    </div>
  );
}
