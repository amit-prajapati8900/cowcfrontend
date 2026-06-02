import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");

  if (!token || !loginTime || token === "undefined" || loginTime === "undefined") {
    return <Navigate to="/Login" replace />;
  }

  // Session expiry: match backend token lifetime (24 hours)
  const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
  const currentTime = Date.now();
  const timePassed = currentTime - Number(loginTime || 0);

  if (isNaN(timePassed) || timePassed > TOKEN_EXPIRY_MS) {
    localStorage.clear();
    return <Navigate to="/Login" replace />;
  }

  // If route requires admin, verify stored user role
  if (adminOnly) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const isAdmin = Boolean(user?.isAdmin) || (user?.role && String(user.role).toLowerCase() === 'admin');
      if (!isAdmin) return <Navigate to="/Login" replace />;
    } catch (e) {
      return <Navigate to="/Login" replace />;
    }
  }

  return children;
}