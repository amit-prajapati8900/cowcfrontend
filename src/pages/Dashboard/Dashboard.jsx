import React, { useState } from 'react';
import './Dashboard.css';
import StatsCard from './StatsCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

const lineData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 450 },
  { name: 'May', value: 600 },
  { name: 'Jun', value: 700 },
];

const barData = [
  { name: 'Week 1', amount: 1200 },
  { name: 'Week 2', amount: 2100 },
  { name: 'Week 3', amount: 800 },
  { name: 'Week 4', amount: 1600 },
];

export default function Dashboard() {
  const [items, setItems] = useState([
    { id: 1, name: 'Sensor A', status: 'online', lastSeen: '2026-05-28 10:12', details: 'Temperature sensor at Zone 1' },
    { id: 2, name: 'Sensor B', status: 'offline', lastSeen: '2026-05-26 08:02', details: 'Pressure sensor at Zone 3' },
    { id: 3, name: 'Sensor C', status: 'online', lastSeen: '2026-05-29 09:40', details: 'Flow sensor at Main Line' },
  ]);
  const [expandedId, setExpandedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', status: '', details: '' });

  const handleShow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this item?')) return;
    setItems(items.filter(i => i.id !== id));
    if (expandedId === id) setExpandedId(null);
    if (editId === id) setEditId(null);
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditForm({ name: item.name, status: item.status, details: item.details });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: '', status: '', details: '' });
  };

  const saveEdit = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, ...editForm } : i));
    setEditId(null);
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  return (
    <div className="dashboard-page container" >
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="stats-row">
        <StatsCard title="Total Customers" value={1245} />
        <StatsCard title="Active Sensors" value={87} />
        <StatsCard title="Open Complaints" value={12} />
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h4 className="card-title">Sensor Activity (last 6 months)</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4 className="card-title">Weekly Billing</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2e7d32" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="items-section">
        <h4 style={{ marginTop: 18 }}>Managed Sensors</h4>
        <div className="items-table">
          {items.map(item => (
            <div key={item.id} className="item-row">
              <div className="item-main">
                <div>
                  <strong>{item.name}</strong>
                  <div className="muted">Status: {item.status} • Last seen: {item.lastSeen}</div>
                </div>
                <div className="action-btns">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleShow(item.id)}>Show</button>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => startEdit(item)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="item-details">{item.details}</div>
              )}

              {editId === item.id && (
                <div className="item-edit">
                  <input name="name" value={editForm.name} onChange={handleEditChange} className="form-control form-control-sm mb-2" />
                  <input name="status" value={editForm.status} onChange={handleEditChange} className="form-control form-control-sm mb-2" />
                  <input name="details" value={editForm.details} onChange={handleEditChange} className="form-control form-control-sm mb-2" />
                  <div>
                    <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(item.id)}>Save</button>
                    <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
