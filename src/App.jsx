import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Navbar from './pages/Navbar';
import Footer from "./pages/Footer";
import HomePage from './pages/Home/HomePage';
import BillingPage from './pages/Billing/BillingPage';
import CompalintPage from './pages/Complaint/CompalintPage';
import CustomerPage from './pages/Customer/CustomerPage';
import ReportPage from './pages/Reports/ReportPage';
import Dashboard from './pages/Dashboards/Dashboard';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';        // ← Add this page
import SencerPage from './pages/Sencer/SencerPage';

import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() > payload.exp * 1000) {
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }
    } catch (err) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    const token = localStorage.getItem("token");

    return (
        <Router>
            <div className="app">
                {/* Navbar only for logged-in users */}
                {token && <Navbar />}

                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/billing"
                        element={
                            <ProtectedRoute>
                                <BillingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/complaints"
                        element={
                            <ProtectedRoute>
                                <CompalintPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/customers"
                        element={
                            <ProtectedRoute>
                                <CustomerPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <ReportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/sencer"
                        element={
                            <ProtectedRoute>
                                <SencerPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect unknown routes */}
                    <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
                </Routes>

                {/* Footer only for logged-in users */}
                {token && <Footer />}
            </div>
        </Router>
    );
}

export default App;