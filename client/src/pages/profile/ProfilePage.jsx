import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Avatar from "../../components/common/Avatar";
import * as profileService from "../../services/profile.service";
import { useAuth } from "../../context/AuthContext";
import {
  Camera,
  Cake,
  Venus,
  Droplet,
  MapPin,
  UserCog,
  ShieldCheck,
  Heart,
  KeyRound,
  ChevronRight,
  User,
} from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fields = [
    profile?.user?.fullName,
    profile?.user?.email,
    profile?.user?.phone,
    profile?.user?.gender,
    profile?.user?.dateOfBirth,
    profile?.user?.bloodGroup,
    profile?.user?.location,
  ];

  const completion = profile?.completion || 0;

  const badges = [
    {
      icon: Cake,
      value: profile?.profile?.dateOfBirth
        ? new Date(profile.profile.dateOfBirth).toLocaleDateString()
        : "Not added",
      label: "Date of Birth",
    },
    {
      icon: Venus,
      value: profile?.profile?.gender || "Not added",
      label: "Gender",
    },
    {
      icon: Droplet,
      value: profile?.profile?.bloodGroup || "Not added",
      label: "Blood Group",
    },
    {
      icon: MapPin,
      value: profile?.profile?.location || "Not added",
      label: "Location",
    },
  ];

  const healthSummary = [
    {
      label: "BMI",
      value: profile?.bmi || "--",
      sub: profile?.bmiCategory || "",
    },
    {
      label: "Height",
      value: profile?.profile?.height
        ? `${profile.profile.height} cm`
        : "--",
      sub: "",
    },
    {
      label: "Weight",
      value: profile?.profile?.weight
        ? `${profile.profile.weight} kg`
        : "--",
      sub: "",
    },
    {
      label: "Age",
      value: profile?.age || "--",
      sub: "",
    },
  ];

  const quickActions = [
    {
      icon: UserCog,
      label: "Edit Profile",
      to: "/profile/edit",
    },
    {
      icon: User,
      label: "View Full Profile",
      to: "/profile/details",
    },
    {
      icon: ShieldCheck,
      label: "Account Settings",
      to: "/settings",
    },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();

      setProfile(response.data);

      const latestUser = {
        ...response.data.user,
        ...response.data.profile,
        age: response.data.age,
        bmi: response.data.bmi,
        bmiCategory: response.data.bmiCategory,
        completion: response.data.completion,
      };

      setUser(latestUser);

      localStorage.setItem(
        "user",
        JSON.stringify(latestUser)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="My Profile"
        subtitle="Loading profile..."
      >
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Profile"
      subtitle="Manage your personal information and health preferences."
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-xs text-[#9E9E9E]">
          Home <span className="mx-2">›</span>
          <span className="font-medium text-[#F33B7D]">Profile</span>
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">
          My Profile
        </h1>
      </div>

      {/* Profile summary + completion */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
          <div className="flex flex-wrap items-start gap-5">
            <div className="relative">
              <Avatar
                name={profile?.user?.fullName}
                image={profile?.profile?.avatar}
                size="h-20 w-20 text-lg"
              />
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.4)]">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
                {user.fullName}
              </h2>
              <p className="mt-1 text-sm text-[#8F8C8C]">{user.email}</p>
              <p className="text-sm text-[#8F8C8C]">{user.phone || "Not added"}</p>
              <Link
                to="/profile/details"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#F33B7D] hover:underline"
              >
                View Full Profile <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl bg-[#FEF4F4] px-3 py-2.5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[#F33B7D]">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#0D0D0D]">{value}</p>
                  <p className="text-[10px] text-[#B8AEB2]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-xs font-semibold text-[#F33B7D]">Profile Completion</p>
          <div className="relative mt-4 h-28 w-28">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#FEE4EB" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#F33B7D"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - completion / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-semibold text-[#0D0D0D]">{completion}%</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#8F8C8C]">
            Complete your profile to get more personalized insights.
          </p>
          <Link
            to="/profile/edit"
            className="mt-4 w-full rounded-full bg-[#F33B7D] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
          >
            Complete Now
          </Link>
        </div>
      </div>

      {/* Health Summary + Quick Actions */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#0D0D0D]">Health Summary</h2>
            <Link 
              to="/profile/details" 
              className="text-xs font-semibold text-[#F33B7D] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {healthSummary.map(({ label, value, sub }) => (
              <div key={label} className="rounded-xl bg-[#FEF4F4] p-3">
                <p className="text-[10px] text-[#8F8C8C]">{label}</p>
                <p className="mt-1 font-display text-sm font-semibold text-[#0D0D0D]">{value}</p>
                {sub && <p className="mt-0.5 text-[10px] text-[#B8AEB2]">{sub}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="mb-3 font-display text-base font-semibold text-[#0D0D0D]">Quick Actions</h2>
          <div className="space-y-1">
            {quickActions.map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm text-[#3D3939] transition hover:bg-[#FEF4F4]"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#FEE4EB] text-[#F33B7D]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1 font-medium">{label}</span>
                <ChevronRight className="h-4 w-4 text-[#B8AEB2]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}