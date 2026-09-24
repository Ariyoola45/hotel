import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wrap a route element to require authentication, and optionally restrict
 * it to one or more roles (e.g. ["admin"]). Unauthenticated users are sent
 * to /login; authenticated users lacking the required role are sent to
 * their own dashboard instead of the one they tried to access.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const fallback = role === "admin" ? "/admin" : "/receptionist";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
