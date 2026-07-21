import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LandingPage from "./pages/public/Landing/LandingPage";
import LoginPage from "./pages/auth/Login/LoginPage";
import RegisterPage from "./pages/auth/Register/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgetPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPassword/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmail/VerifyEmailPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProfileDetailsPage from "./pages/profile/ProfileDetailsPage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
        <Route path="/profile/details" element={<ProtectedRoute>
      <ProfileDetailsPage />
    </ProtectedRoute>} />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
        <Route
  path="/profile/edit"
  element={
    <ProtectedRoute>
      <EditProfilePage />
    </ProtectedRoute>
  }
/>
        <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  }
/>
      </Routes>

  );
}

export default App;