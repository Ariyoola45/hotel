import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// After login, Firestore user profile (with role) may take a tick to load.
// This tiny route waits for that, then sends the user to the right dashboard.
export default function RoleRedirect() {
  const { role, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading…</div>;
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "receptionist") return <Navigate to="/receptionist" replace />;
  return <Navigate to="/login" replace />;
}
