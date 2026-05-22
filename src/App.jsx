import React, { useState, useEffect } from "react";
import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './pages/Navbar';
import Footer from "./pages/Footer";
import HomePage from './pages/Home/HomePage';
import BillingPage from './pages/Billing/BillingPage';
import CompalintPage from './pages/Complaint/CompalintPage';
import CustomerPage from './pages/Customer/CustomerPage';
import ReportPage from './pages/Reports/ReportPage';
import Dashboard from './pages/Dashboards/Dashboard';
import Login from './pages/Login/Login';
import SencerPage from './pages/Sencer/SencerPage';

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() > payload.exp * 1000;

      if (isExpired) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } catch (err) {
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {/* Navbar/Footer sirf tab dikhao jab token hai */}
      {token && <Navbar />}
      <Routes>
        {/* Public Route - Login Page */}
        <Route path="/Login" element={<Login />} />

        {/* ✅ Protected Routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute><CompalintPage /></ProtectedRoute>} />
        <Route path="/Customers" element={<ProtectedRoute><CustomerPage /></ProtectedRoute>} />
        <Route path="/Reports" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/Sensors" element={<ProtectedRoute><SencerPage /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {token && <Footer />}
    </Router>
  );
}

export default App;
