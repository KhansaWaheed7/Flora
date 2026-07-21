import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/common/Avatar";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Camera,
  ArrowRight,
  Edit,
  Eye,
} from "lucide-react";

const storedUser = JSON.parse(localStorage.getItem("user")) || {};

const user = {
  name: storedUser.fullName || "",
  email: storedUser.email || "",
  phone: storedUser.phone || "",
  gender: storedUser.gender || "",
  bloodGroup: storedUser.bloodGroup || "",
  location: storedUser.location || "",
  dateOfBirth: storedUser.dateOfBirth || "",
};

const personalInfo = [
  { label: "Full Name", value: user.name || "Not added" },
  { label: "Email Address", value: user.email || "Not added" },
  { label: "Phone Number", value: user.phone || "Not added" },
  { label: "Date of Birth", value: user.dateOfBirth || "Not added" },
  { label: "Gender", value: user.gender || "Not added" },
  { label: "Blood Group", value: user.bloodGroup || "Not added" },
  { label: "Location", value: user.location || "Not added" },
];

const healthOverview = [
  { label: "Cycle Length (Avg)", value: "28 Days" },
  { label: "Period Length (Avg)", value: "5 Days" },
  { label: "Last Period", value: "10 May 2025" },
  { label: "Next Period", value: "15 May 2025" },
];

const connectedAccounts = [
  { name: "Google", detail: user.email, status: "connected" },
  { name: "Apple", detail: "Not Connected", status: "not-connected" },
  { name: "Facebook", detail: "Not Connected", status: "not-connected" },
];

export default function ProfileDetailsPage() {
  

  return (
    <DashboardLayout
    title="My Profile"
    subtitle="View and manage your profile details"
>

      {/* Main content */}
      
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-xs text-[#9E9E9E]">
            Home <span className="mx-2">›</span>
            <span className="font-medium text-[#F33B7D]">Profile</span>
          </p>
        </div>

        {/* Profile Header with Edit Button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-[#8F8C8C]">
              View and manage your personal information
            </p>
          </div>
          <Link
            to="/profile/edit"
            className="flex items-center gap-2 rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(243,59,125,0.5)]"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Personal Information */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                Personal Information
              </h2>
              <div className="flex items-center gap-2">
                <Link
                  to="/profile/edit"
                  className="flex items-center gap-1.5 rounded-full bg-[#FEE4EB] px-3 py-1.5 text-xs font-semibold text-[#F33B7D] transition hover:bg-[#FCE4EB]"
                >
                  <Edit className="h-3 w-3" />
                  Edit All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-[#F5EAEF]">
              {personalInfo.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-[#8F8C8C]">{label}</span>
                  <span className="font-medium text-[#0D0D0D]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-4 self-start font-display text-base font-semibold text-[#0D0D0D]">
              Profile Picture
            </h2>
            <div className="relative">
              <Avatar name={user.name} size="h-24 w-24 text-xl" />
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.4)]">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-4 text-[10px] text-[#B8AEB2]">
              JPG, PNG or GIF. Max size 2MB.
            </p>
            <Link
              to="/profile/edit"
              className="mt-4 w-full rounded-full bg-[#F33B7D] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
            >
              Change Now
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Health Overview */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                Health Overview
              </h2>
              <Link
                to="/profile/edit"
                className="text-xs font-semibold text-[#F33B7D] hover:underline"
              >
                Update
              </Link>
            </div>
            <div className="divide-y divide-[#F5EAEF]">
              {healthOverview.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-[#8F8C8C]">{label}</span>
                  <span className="font-medium text-[#0D0D0D]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-4 font-display text-base font-semibold text-[#0D0D0D]">
              Connected Accounts
            </h2>
            <div className="space-y-3">
              {connectedAccounts.map(({ name, detail, status }) => (
                <div key={name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0D0D0D]">{name}</p>
                    <p className="text-xs text-[#B8AEB2]">{detail}</p>
                  </div>
                  {status === "connected" ? (
                    <span className="text-xs font-semibold text-[#22C55E]">Connected</span>
                  ) : (
                    <button className="rounded-full border border-[#F33B7D] px-3 py-1 text-xs font-semibold text-[#F33B7D] hover:bg-[#FEE4EB] transition-colors">
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Profile Button - Bottom */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/profile/edit"
            className="flex items-center gap-2 rounded-full border-2 border-[#F33B7D] px-6 py-3 text-sm font-semibold text-[#F33B7D] transition hover:bg-[#F33B7D] hover:text-white hover:shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)]"
          >
            <Eye className="h-4 w-4" />
            Edit Profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </DashboardLayout>
  );
}