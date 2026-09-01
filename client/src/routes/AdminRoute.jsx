import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

export default function AdminRoute({ children }) {
  if (!isAuthenticated()) {
    console.log("❌ Not authenticated");
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();
  console.log("👤 Current User:", user);
  console.log("🔍 User Role:", user?.role);

  if (user?.role !== "admin") {
    console.log("❌ Not an admin, redirecting to dashboard. User role is:", user?.role);
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ Admin access granted");
  return children;
}