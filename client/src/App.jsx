import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LandingPage from "./pages/public/Landing/LandingPage";
import TermsAndConditions from "./pages/public/TermsAndConditions"
import PrivacyPolicy from "./pages/public/PrivacyPolicy"
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
import CycleTrackerDashboard from "./pages/cycle-tracker/CycleTrackerDashboard";
import LogPeriod from "./pages/cycle-tracker/LogPeriod";
import EditCycle from "./pages/cycle-tracker/EditCycle";
import CycleHistory from "./pages/cycle-tracker/CycleHistory";
import CycleDetails from "./pages/cycle-tracker/CycleDetails";
import Predictions from "./pages/cycle-tracker/Predictions";
import CycleStatistics from "./pages/cycle-tracker/CycleStatistics";
import PCOSIntro from "./pages/pcos-detection/PCOSIntro";
import PCOSQuestionnaire from "./pages/pcos-detection/PCOSQuestionnaire";
import PCOSAnalyzing from "./pages/pcos-detection/PCOSAnalyzing";
import PCOSResult from "./pages/pcos-detection/PCOSResult";
import PCOSRecommendations from "./pages/pcos-detection/PCOSRecommendations";
import PCOSHistory from "./pages/pcos-detection/PCOSHistory";
import PCOSDetails from "./pages/pcos-detection/PCOSDetails";
import PregnancyDashboard from "./pages/pregnancy/PregnancyDashboard";
import RegisterPregnancy from "./pages/pregnancy/RegisterPregnancy";
import PregnancyOverview from "./pages/pregnancy/PregnancyOverview";
import PregnancyTimeline from "./pages/pregnancy/PregnancyTimeline";
import WeeklyGuide from "./pages/pregnancy/WeeklyGuide";
import WeekDetails from "./pages/pregnancy/WeekDetails";
import PregnancyReminders from "./pages/pregnancy/PregnancyReminders";
import ReminderDetails from "./pages/pregnancy/ReminderDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import GynaeAssistantPage from "./pages/gynae-assistant/GynaeAssistantPage";
import GynaeConversationHistoryPage from "./pages/gynae-assistant/GynaeConversationHistoryPage";
import GynaeConversationDetailPage from "./pages/gynae-assistant/GynaeConversationDetailPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
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
        <Route
  path="/cycle-tracker"
  element={
    <ProtectedRoute>
      <CycleTrackerDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/cycle-tracker/log"
  element={
    <ProtectedRoute>
      <LogPeriod />
    </ProtectedRoute>
  }
/>
        <Route
  path="/cycle-tracker/history"
  element={
    <ProtectedRoute>
      <CycleHistory />
    </ProtectedRoute>
  }
/>
        <Route
  path="/cycle-tracker/predictions"
  element={
    <ProtectedRoute>
      <Predictions />
    </ProtectedRoute>
  }
/>
        <Route
  path="/cycle-tracker/statistics"
  element={
    <ProtectedRoute>
      <CycleStatistics />
    </ProtectedRoute>
  }
/>
        <Route
  path="/cycle-tracker/:id/edit"
  element={
    <ProtectedRoute>
      <EditCycle />
    </ProtectedRoute>
  }
/>
        <Route
  path="/cycle-tracker/:id"
  element={
    <ProtectedRoute>
      <CycleDetails />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pcos-detection"
  element={
    <ProtectedRoute>
      <PCOSIntro />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pcos-detection/assessment"
  element={
    <ProtectedRoute>
      <PCOSQuestionnaire />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pcos-detection/analyzing"
  element={
    <ProtectedRoute>
      <PCOSAnalyzing />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pcos-detection/result"
  element={
    <ProtectedRoute>
      <PCOSResult />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pcos-detection/recommendations"
  element={
    <ProtectedRoute>
      <PCOSRecommendations />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pcos-detection/history"
  element={
    <ProtectedRoute>
      <PCOSHistory />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pcos-detection/:id"
  element={
    <ProtectedRoute>
      <PCOSDetails />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pregnancy"
  element={
    <ProtectedRoute>
      <PregnancyDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pregnancy/update"
  element={
    <ProtectedRoute>
      <RegisterPregnancy />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pregnancy/overview"
  element={
    <ProtectedRoute>
      <PregnancyOverview />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pregnancy/timeline"
  element={
    <ProtectedRoute>
      <PregnancyTimeline />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pregnancy/weekly-guide"
  element={
    <ProtectedRoute>
      <WeeklyGuide />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pregnancy/weekly-guide/:week"
  element={
    <ProtectedRoute>
      <WeekDetails />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pregnancy/reminders"
  element={
    <ProtectedRoute>
      <PregnancyReminders />
    </ProtectedRoute>
  }
/>
        <Route
  path="/pregnancy/reminders/:id"
  element={
    <ProtectedRoute>
      <ReminderDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/gynae-assistant"
  element={
    <ProtectedRoute>
      <GynaeAssistantPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/gynae-assistant/history"
  element={
    <ProtectedRoute>
      <GynaeConversationHistoryPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/gynae-assistant/history/:id"
  element={
    <ProtectedRoute>
      <GynaeConversationDetailPage />
    </ProtectedRoute>
  }
/>

      </Routes>

  );
}

export default App;