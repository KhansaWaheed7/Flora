import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/public/Landing/LandingPage";
import TermsAndConditions from "./pages/public/TermsAndConditions";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";

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

// ===== ADMIN PORTAL IMPORTS =====
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorApproval from "./pages/admin/DoctorApproval";
import DoctorDetails from "./pages/admin/DoctorDetails";
import UsersManagement from "./pages/admin/UsersManagement";
import ChatMonitoring from "./pages/admin/ChatMonitoring";
import Consultations from "./pages/admin/Consultations";
import Notifications from "./pages/admin/Notifications";
import AdminSettings from "./pages/admin/Settings";

// ===== DOCTOR PORTAL IMPORTS =====
import DoctorRoute from "./routes/DoctorRoute";
import DoctorDashboard from "./pages/doctor-portal/DoctorDashboard";
import ConsultationRequests from "./pages/doctor-portal/ConsultationRequests";
import ActivePatients from "./pages/doctor-portal/ActivePatients";
import DoctorChat from "./pages/doctor-portal/DoctorChat";
import ClosedConsultations from "./pages/doctor-portal/ClosedConsultations";

import DoctorVerification from "./pages/doctor-portal/DoctorVerification";

// ===== MAIN BRANCH IMPORTS =====
import ProtectedRoute from "./routes/ProtectedRoute";
import GynaeAssistantPage from "./pages/gynae-assistant/GynaeAssistantPage";
import GynaeConversationHistoryPage from "./pages/gynae-assistant/GynaeConversationHistoryPage";
import GynaeConversationDetailPage from "./pages/gynae-assistant/GynaeConversationDetailPage";
import MedicalReportsPage from "./pages/medical-reports/MedicalReportsPage";
import UploadMedicalReportPage from "./pages/medical-reports/UploadMedicalReportPage";
import ReportProcessingPage from "./pages/medical-reports/ReportProcessingPage";
import MedicalReportDetailsPage from "./pages/medical-reports/MedicalReportDetailsPage";

// ===== FEATURE/CHAT IMPORTS =====
import FindDoctor from "./pages/chat/FindDoctor";

import ConsultationRequestConfirmation from "./pages/chat/ConsultationRequestConfirmation";
import MyConsultations from "./pages/chat/MyConsultations";
import PendingConsultation from "./pages/chat/PendingConsultation";
import RejectedConsultation from "./pages/chat/RejectedConsultation";
import ChatWithDoctor from "./pages/chat/ChatWithDoctor";
import ConsultationClosed from "./pages/chat/ConsultationClosed";
import DoctorMessages from "./pages/doctor-portal/DoctorMessages";
import DoctorSchedule from "./pages/doctor-portal/DoctorSchedule";
import DoctorProfile from "./pages/doctor-portal/DoctorProfile";
import DoctorSettings from "./pages/doctor-portal/DoctorSettings";

function App() {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

      {/* ==================== DASHBOARD ==================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* ==================== PROFILE ==================== */}
      <Route
        path="/profile/details"
        element={
          <ProtectedRoute>
            <ProfileDetailsPage />
          </ProtectedRoute>
        }
      />
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

      {/* ==================== CYCLE TRACKER ==================== */}
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

      {/* ==================== PCOS DETECTION ==================== */}
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

      {/* ==================== PREGNANCY ==================== */}
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

      {/* ==================== GYNAE ASSISTANT (MAIN BRANCH) ==================== */}
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

      {/* ==================== MEDICAL REPORTS (MAIN BRANCH) ==================== */}
      <Route
        path="/medical-reports"
        element={
          <ProtectedRoute>
            <MedicalReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-reports/upload"
        element={
          <ProtectedRoute>
            <UploadMedicalReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-reports/:id/processing"
        element={
          <ProtectedRoute>
            <ReportProcessingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-reports/:id"
        element={
          <ProtectedRoute>
            <MedicalReportDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* ==================== CHAT (FEATURE/CHAT BRANCH) ==================== */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <MyConsultations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/doctors"
        element={
          <ProtectedRoute>
            <FindDoctor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/doctors/:id"
        element={
          <ProtectedRoute>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/request-sent"
        element={
          <ProtectedRoute>
            <ConsultationRequestConfirmation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/my-consultations"
        element={
          <ProtectedRoute>
            <MyConsultations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:id/pending"
        element={
          <ProtectedRoute>
            <PendingConsultation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:id/rejected"
        element={
          <ProtectedRoute>
            <RejectedConsultation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:id/closed"
        element={
          <ProtectedRoute>
            <ConsultationClosed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <ChatWithDoctor />
          </ProtectedRoute>
        }
      />

      {/* ==================== ADMIN PORTAL ==================== */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/doctor-approval"
        element={
          <AdminRoute>
            <DoctorApproval />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/doctor-details/:id"
        element={
          <AdminRoute>
            <DoctorDetails />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UsersManagement />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/chat-monitoring"
        element={
          <AdminRoute>
            <ChatMonitoring />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/consultations"
        element={
          <AdminRoute>
            <Consultations />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/notifications"
        element={
          <AdminRoute>
            <Notifications />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />

      {/* ==================== DOCTOR PORTAL ==================== */}
      <Route
        path="/doctor/dashboard"
        element={
          <DoctorRoute>
            <DoctorDashboard />
          </DoctorRoute>
        }
      />

      <Route
        path="/doctor/consultation-requests"
        element={
          <DoctorRoute>
            <ConsultationRequests />
          </DoctorRoute>
        }
      />

      <Route
        path="/doctor/active-patients"
        element={
          <DoctorRoute>
            <ActivePatients />
          </DoctorRoute>
        }
      />

      <Route
        path="/doctor/messages/:id"
        element={
          <DoctorRoute> 
            <DoctorChat />
          </DoctorRoute>
        }
      />

      <Route
        path="/doctor/closed-consultations"
        element={
          <DoctorRoute>
            <ClosedConsultations />
          </DoctorRoute>
        }
      />
      <Route
  path="/doctor/verification"
  element={
    <DoctorRoute>
      <DoctorVerification />
    </DoctorRoute>
  }
/>

<Route
  path="/doctor/messages"
  element={
    <DoctorRoute>
      <DoctorMessages />
    </DoctorRoute>
  }
/>

<Route
  path="/doctor/schedule"
  element={
    <DoctorRoute>
      <DoctorSchedule />
    </DoctorRoute>
  }
/>

<Route
  path="/doctor/profile"
  element={
    <DoctorRoute>
      <DoctorProfile />
    </DoctorRoute>
  }
/>

<Route
  path="/doctor/settings"
  element={
    <DoctorRoute>
      <DoctorSettings />
    </DoctorRoute>
  }
/>

      {/* ==================== FALLBACK ==================== */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;