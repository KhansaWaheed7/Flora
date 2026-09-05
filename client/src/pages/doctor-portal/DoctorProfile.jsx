import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import Avatar from "../../components/common/Avatar";
import { getDoctorProfile } from "../../services/doctorPortal.service";

import {
  Camera,
  Stethoscope,
  Building2,
  BriefcaseMedical,
  MapPin,
  Languages,
  BadgeCheck,
  UserCog,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Banknote,
} from "lucide-react";

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getDoctorProfile();
      setProfile(data.data);
    } catch (error) {
      console.error("Doctor profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DoctorLayout
        title="Profile"
        subtitle="View and manage your professional profile."
        showSearch={false}
      >
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FEE4EB] border-t-[#F33B7D]" />
            <p className="mt-4 text-sm text-[#8F8C8C]">
              Loading profile...
            </p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  const verificationStatus =
    profile?.verificationStatus || "pending";

  const statusLabel =
    verificationStatus.charAt(0).toUpperCase() +
    verificationStatus.slice(1);

  const statusColor =
    verificationStatus === "verified"
      ? "text-green-600 bg-green-50"
      : verificationStatus === "rejected"
      ? "text-red-600 bg-red-50"
      : "text-amber-600 bg-amber-50";

  const badges = [
    {
      icon: Stethoscope,
      value: profile?.specialization || "Not added",
      label: "Specialization",
    },
    {
      icon: Building2,
      value: profile?.hospital || "Not added",
      label: "Hospital",
    },
    {
      icon: BriefcaseMedical,
      value:
        profile?.yearsOfExperience !== undefined &&
        profile?.yearsOfExperience !== null
          ? `${profile.yearsOfExperience} years`
          : "Not added",
      label: "Experience",
    },
    {
      icon: MapPin,
      value: profile?.city || "Not added",
      label: "Location",
    },
  ];

  const professionalSummary = [
    {
      label: "Specialization",
      value: profile?.specialization || "Not added",
    },
    {
      label: "Hospital",
      value: profile?.hospital || "Not added",
    },
    {
      label: "Experience",
      value:
        profile?.yearsOfExperience !== undefined &&
        profile?.yearsOfExperience !== null
          ? `${profile.yearsOfExperience} years`
          : "Not added",
    },
    {
      label: "Consultation Fee",
      value:
        profile?.consultationFee !== null &&
        profile?.consultationFee !== undefined
          ? `PKR ${profile.consultationFee}`
          : "Not added",
    },
  ];

  const quickActions = [
    {
      icon: UserCog,
      label: "Edit Profile",
      to: "/doctor/profile/edit",
    },
    {
      icon: GraduationCap,
      label: "View Full Profile",
      to: "/doctor/profile/details",
    },
    {
      icon: ShieldCheck,
      label: "Verification",
      to: "/doctor/verification",
    },
  ];

  return (
    <DoctorLayout
      title="Profile"
      subtitle="View and manage your professional profile."
      showSearch={false}
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-xs text-[#9E9E9E]">
          Home <span className="mx-2">›</span>
          <span className="font-medium text-[#F33B7D]">
            Profile
          </span>
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">
          My Profile
        </h1>
      </div>

      {/* Profile Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main Profile Card */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
          <div className="flex flex-wrap items-start gap-5">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                name={profile?.fullName || "Doctor"}
                image={profile?.profilePicture}
                size="h-20 w-20 text-lg"
              />

              <Link
                to="/doctor/profile/edit"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.4)]"
              >
                <Camera className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Doctor Basic Info */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
                  {profile?.fullName || "Doctor"}
                </h2>

                {verificationStatus === "verified" && (
                  <BadgeCheck className="h-5 w-5 text-[#F33B7D]" />
                )}
              </div>

              <p className="mt-1 text-sm text-[#F33B7D]">
                {profile?.specialization || "Specialization not added"}
              </p>

              <p className="mt-1 text-sm text-[#8F8C8C]">
                {profile?.email}
              </p>

              <p className="text-sm text-[#8F8C8C]">
                {profile?.phone || "Phone not added"}
              </p>

              <Link
                to="/doctor/profile/details"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#F33B7D] hover:underline"
              >
                View Full Profile
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Profile Badges */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl bg-[#FEF4F4] px-3 py-2.5"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[#F33B7D]">
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#0D0D0D]">
                    {value}
                  </p>

                  <p className="text-[10px] text-[#B8AEB2]">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Card */}
        <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <p className="text-xs font-semibold text-[#F33B7D]">
            Verification Status
          </p>

          <div className="mt-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#FEF4F4]">
            <ShieldCheck className="h-12 w-12 text-[#F33B7D]" />
          </div>

          <span
            className={`mt-4 rounded-full px-4 py-1.5 text-xs font-semibold ${statusColor}`}
          >
            {statusLabel}
          </span>

          <p className="mt-4 text-xs leading-5 text-[#8F8C8C]">
            Your verification status is based on the professional
            documents submitted during registration.
          </p>

          <Link
            to="/doctor/verification"
            className="mt-4 w-full rounded-full bg-[#F33B7D] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5"
          >
            View Verification
          </Link>
        </div>
      </div>

      {/* Professional Summary + Quick Actions */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Professional Summary */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
              Professional Summary
            </h2>

            <Link
              to="/doctor/profile/details"
              className="text-xs font-semibold text-[#F33B7D] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {professionalSummary.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl bg-[#FEF4F4] p-3"
              >
                <p className="text-[10px] text-[#8F8C8C]">
                  {label}
                </p>

                <p className="mt-1 truncate font-display text-sm font-semibold text-[#0D0D0D]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="mb-3 font-display text-base font-semibold text-[#0D0D0D]">
            Quick Actions
          </h2>

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

                <span className="flex-1 font-medium">
                  {label}
                </span>

                <ChevronRight className="h-4 w-4 text-[#B8AEB2]" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
            About Me
          </h2>

          <Link
            to="/doctor/profile/edit"
            className="text-xs font-semibold text-[#F33B7D] hover:underline"
          >
            Edit
          </Link>
        </div>

        <p className="text-sm leading-6 text-[#8F8C8C]">
          {profile?.bio ||
            "Add a professional bio to help patients learn more about you."}
        </p>
      </div>

      {/* Expertise + Languages */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Areas of Expertise */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
              Areas of Expertise
            </h2>

            <Stethoscope className="h-5 w-5 text-[#F33B7D]" />
          </div>

          {profile?.areasOfExpertise?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.areasOfExpertise.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full bg-[#FEE4EB] px-3 py-1.5 text-xs font-medium text-[#F33B7D]"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#B8AEB2]">
              No areas of expertise added yet.
            </p>
          )}
        </div>

        {/* Languages */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
              Languages
            </h2>

            <Languages className="h-5 w-5 text-[#F33B7D]" />
          </div>

          {profile?.languages?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language, index) => (
                <span
                  key={`${language}-${index}`}
                  className="rounded-full bg-[#FEF4F4] px-3 py-1.5 text-xs font-medium text-[#3D3939]"
                >
                  {language}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#B8AEB2]">
              No languages added yet.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Edit Button */}
      <div className="mt-6 flex justify-center">
        <Link
          to="/doctor/profile/edit"
          className="flex items-center gap-2 rounded-full border-2 border-[#F33B7D] px-6 py-3 text-sm font-semibold text-[#F33B7D] transition hover:bg-[#F33B7D] hover:text-white hover:shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)]"
        >
          <UserCog className="h-4 w-4" />
          Edit Profile
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </DoctorLayout>
  );
}