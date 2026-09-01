import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

export default function DoctorRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (user?.role !== "doctor") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
