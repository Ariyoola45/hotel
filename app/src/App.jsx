import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import RoleRedirect from "./pages/RoleRedirect";
import Overview from "./pages/Overview";
import Guests from "./pages/Guests";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import Payments from "./pages/Payments";
import Housekeeping from "./pages/Housekeeping";
import Reports from "./pages/Reports";
import Staff from "./pages/Staff";

import "./styles/app.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/redirect" element={<RoleRedirect />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="guests" element={<Guests />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="payments" element={<Payments />} />
            <Route path="housekeeping" element={<Housekeeping />} />
            <Route path="reports" element={<Reports />} />
            <Route path="staff" element={<Staff />} />
          </Route>

          {/* Receptionist routes */}
          <Route
            path="/receptionist"
            element={
              <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="guests" element={<Guests />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="checkin" element={<CheckIn />} />
            <Route path="checkout" element={<CheckOut />} />
            <Route path="payments" element={<Payments />} />
            <Route path="housekeeping" element={<Housekeeping />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
