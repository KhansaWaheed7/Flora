import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/profile.service";
import DashboardLayout from "../../layouts/DashboardLayout";
import { deleteAccount } from "../../services/auth.service";
import {
  MessageCircle,
  HeartHandshake,
  BookOpen,
  Mail,
  Phone,
  Lock,
  Globe,
  Ruler,
  Clock,
  ShieldCheck,
  History,
  Smartphone,
  Download,
  Trash2,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

function Row({ icon: Icon, label, value, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition ${
        onClick ? "hover:bg-[#FEF4F4] cursor-pointer" : "cursor-default"
      } ${danger ? "text-[#EF4444]" : "text-[#0D0D0D]"}`}
    >
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
          danger
            ? "bg-[#FEE2E2] text-[#EF4444]"
            : "bg-[#FEE4EB] text-[#F33B7D]"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{label}</p>

        <p
          className={`truncate text-xs ${
            danger ? "text-[#F87171]" : "text-[#8F8C8C]"
          }`}
        >
          {value}
        </p>
      </div>

      {onClick && (
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#B8AEB2]" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordClick = () => {
    setShowPasswordModal(true);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const handleDeleteAccount = async () => {
  try {
    setIsDeleting(true);

    await deleteAccount();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/login");
  } catch (error) {
    console.error("Failed to delete account:", error);

    alert(
      error.response?.data?.message ||
      "Failed to delete account. Please try again."
    );
  } finally {
    setIsDeleting(false);
  }
};

  const handleConfirmPasswordChange = () => {
    setShowPasswordModal(false);
    navigate("/forgot-password");
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordModal(false);
  };

  const accountRows = [
    {
      icon: Mail,
      label: "Email",
      value: profileData?.user?.email || "Not added",
    },
    {
      icon: Phone,
      label: "Phone Number",
      value: profileData?.user?.phone || "Not added",
    },
    {
      icon: Lock,
      label: "Password",
      value: "••••••••",
      onClick: handlePasswordClick,
    },
    {
      icon: Globe,
      label: "Language",
      value: "English",
    },
    {
      icon: Clock,
      label: "Time Zone",
      value: "(GMT+05:00) Pakistan Time",
    },
  ];

  const securityRows = [
    {
      icon: History,
      label: "Login Activity",
      value: "See recent activity",
      onClick: () => {
        /* Navigate to login activity */
      },
    },
  ];

  return (
    <DashboardLayout
      title="Account Settings"
      subtitle="Manage your account preferences and security."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Account Settings */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="mb-2 font-display text-base font-semibold text-[#0D0D0D]">
            Account Settings
          </h2>
          <div className="divide-y divide-[#F5EAEF]">
            {accountRows.map((row) => (
              <Row key={row.label} {...row} />
            ))}
          </div>
        </div>

        {/* Security + Data & Privacy */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-2 font-display text-base font-semibold text-[#0D0D0D]">
              Security
            </h2>
            <div className="divide-y divide-[#F5EAEF]">
              {securityRows.map((row) => (
                <Row key={row.label} {...row} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-2 font-display text-base font-semibold text-[#0D0D0D]">
              Data & Privacy
            </h2>
            <div className="divide-y divide-[#F5EAEF]">
              <Row
                icon={Download}
                label="Download My Data"
                value="Get a copy of your data"
                onClick={() => {
                  /* Handle data download */
                }}
              />
              <Row
  icon={Trash2}
  label="Delete Account"
  value="Permanently delete your account"
  danger
  onClick={() => setShowDeleteModal(true)}
/>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Confirmation Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Close button */}
            <button
              onClick={handleCancelPasswordChange}
              className="absolute right-4 top-4 rounded-full p-1 text-[#8F8C8C] transition hover:bg-[#FEF4F4] hover:text-[#0D0D0D]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal content */}
            <div className="mt-2 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE4EB]">
                <Lock className="h-7 w-7 text-[#F33B7D]" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-[#0D0D0D]">
                Change Password?
              </h3>
              <p className="mb-6 text-sm text-[#8F8C8C]">
                You'll be redirected to the password reset page where you can
                update your password securely.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelPasswordChange}
                className="flex-1 rounded-xl border border-[#F5EAEF] py-2.5 text-sm font-semibold text-[#0D0D0D] transition hover:bg-[#FEF4F4]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPasswordChange}
                className="flex-1 rounded-xl bg-[#F33B7D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#E02A6B]"
              >
                Yes, Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

      {/* Close */}
      <button
        type="button"
        onClick={() => setShowDeleteModal(false)}
        disabled={isDeleting}
        className="absolute right-4 top-4 rounded-full p-1 text-[#8F8C8C] transition hover:bg-[#FEF4F4] hover:text-[#0D0D0D]"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Icon */}
      <div className="mt-2 text-center">

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE2E2]">
          <Trash2 className="h-7 w-7 text-[#EF4444]" />
        </div>

        <h3 className="mb-2 font-display text-xl font-semibold text-[#0D0D0D]">
          Delete Account?
        </h3>

        <p className="mb-6 text-sm leading-6 text-[#8F8C8C]">
          Are you sure you want to permanently delete your Flora account?
          This action cannot be undone and your account data will be removed.
        </p>

      </div>

      {/* Buttons */}
      <div className="flex gap-3">

        <button
          type="button"
          onClick={() => setShowDeleteModal(false)}
          disabled={isDeleting}
          className="flex-1 rounded-xl border border-[#F5EAEF] py-2.5 text-sm font-semibold text-[#0D0D0D] transition hover:bg-[#FEF4F4] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="flex-1 rounded-xl bg-[#EF4444] py-2.5 text-sm font-semibold text-white transition hover:bg-[#DC2626] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Yes, Delete Account"}
        </button>

      </div>

    </div>
  </div>
)}
    </DashboardLayout>
  );
}