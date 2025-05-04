import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import PropertyDashboard from "./pages/PropertyDashboard";
import ExpenseDashboard from "./pages/ExpenseDashboard";
import MonthlySummaryTable from "./pages/MonthlySummaryTable";
import BookingDashboard from "./pages/BookingDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Financials from "./pages/Financials";

import { useAuth } from "./context/AuthContext";

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useLocation();

  React.useEffect(() => {
    logout();
    window.location.href = "/login";
  }, [logout]);

  return <div>Logging out...</div>;
};

// Wrap protected sections
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard">
          <Route index element={<Dashboard />} />
          <Route path="summary" element={<MonthlySummaryTable />} />
        </Route>
        <Route path="properties" element={<PropertyDashboard />} />
        <Route path="expenses" element={<ExpenseDashboard />} />
        <Route path="bookings" element={<BookingDashboard />} />
        <Route path="financials" element={<Financials />} />
      </Route>
    </Routes>
  );
};

export default App;
