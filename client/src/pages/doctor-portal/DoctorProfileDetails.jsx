import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Building2,
  BriefcaseMedical,
  GraduationCap,
  Languages,
  BadgeCheck,
  Stethoscope,
  Clock3,
  IndianRupee,
} from "lucide-react";

import DoctorLayout from "../../layouts/DoctorLayout";
import Avatar from "../../components/common/Avatar";
import { getDoctorProfile } from "../../services/doctorPortal.service";

export default function DoctorProfileDetails() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDoctorProfile();
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to load doctor profile:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load your profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const getVerificationStyles = (status) => {
    switch (status) {
      case "verified":
        return {
          bg: "bg-green-50",
          border: "border-green-100",
          text: "text-green-600",
          label: "Verified",
        };

      case "rejected":
        return {
          bg: "bg-red-50",
          border: "border-red-100",
          text: "text-red-600",
          label: "Rejected",
        };

      case "suspended":
        return {
          bg: "bg-orange-50",
          border: "border-orange-100",
          text: "text-orange-600",
          label: "Suspended",
        };

      default:
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-100",
          text: "text-yellow-600",
          label: "Pending",
        };
    }
  };

  if (loading) {
    return (
      <DoctorLayout
        title="Profile"
        subtitle="View and manage your professional profile."
        showSearch={false}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FEE4EB] border-t-[#F33B7D]" />

            <p className="mt-4 text-sm text-[#8F8C8C]">
              Loading your profile...
            </p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  if (error) {
    return (
      <DoctorLayout
        title="Profile"
        subtitle="View and manage your professional profile."
        showSearch={false}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="text-sm text-red-500">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-[#F33B7D] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e82f70]"
            >
              Try Again
            </button>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  if (!profile) return null;

  const verification = getVerificationStyles(profile.verificationStatus);

  return (
    <DoctorLayout
      title="Profile"
      subtitle="View and manage your professional profile."
      showSearch={false}
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/doctor/profile"
            className="text-[#8F8C8C] transition hover:text-[#F33B7D]"
          >
            Profile
          </Link>

          <span className="text-[#B8AEB2]">›</span>

          <span className="text-[#F33B7D]">My Profile</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#0D0D0D]">
              Profile Details
            </h1>

            <p className="mt-1 text-sm text-[#8F8C8C]">
              View your professional and personal information.
            </p>
          </div>

          <Link
            to="/doctor/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F33B7D] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#e82f70]"
          >
            <Edit3 size={16} />
            Edit Profile
          </Link>
        </div>

        {/* Main Profile Card */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <Avatar
              src={profile.profilePicture}
              name={profile.fullName}
              size="xl"
            />

            {/* Basic Information */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-semibold text-[#0D0D0D]">
                  {profile.fullName}
                </h2>

                {profile.verificationStatus === "verified" && (
                  <BadgeCheck
                    size={22}
                    className="text-[#F33B7D]"
                    fill="#FEE4EB"
                  />
                )}
              </div>

              <p className="mt-1 text-base font-medium text-[#F33B7D]">
                {profile.specialization || "Medical Specialist"}
              </p>

              <div className="mt-3 flex flex-col gap-2 text-sm text-[#8F8C8C]">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#F33B7D]" />
                    <span>{profile.email}</span>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-[#F33B7D]" />
                    <span>{profile.phone}</span>
                  </div>
                )}

                {profile.city && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#F33B7D]" />
                    <span>{profile.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
              Professional Information
            </h2>

            <p className="mt-1 text-sm text-[#8F8C8C]">
              Your current professional details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Specialization */}
            <div className="rounded-xl bg-[#FEF4F4] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                  <Stethoscope size={19} className="text-[#F33B7D]" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-[#B8AEB2]">Specialization</p>
                  <p className="mt-1 font-medium text-[#0D0D0D]">
                    {profile.specialization || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Hospital */}
            <div className="rounded-xl bg-[#FEF4F4] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                  <Building2 size={19} className="text-[#F33B7D]" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-[#B8AEB2]">Hospital / Clinic</p>
                  <p className="mt-1 truncate font-medium text-[#0D0D0D]">
                    {profile.hospital || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="rounded-xl bg-[#FEF4F4] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                  <Clock3 size={19} className="text-[#F33B7D]" />
                </div>

                <div>
                  <p className="text-xs text-[#B8AEB2]">
                    Years of Experience
                  </p>

                  <p className="mt-1 font-medium text-[#0D0D0D]">
                    {profile.yearsOfExperience ?? 0} years
                  </p>
                </div>
              </div>
            </div>

            {/* Consultation Fee */}
            <div className="rounded-xl bg-[#FEF4F4] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                  <IndianRupee size={19} className="text-[#F33B7D]" />
                </div>

                <div>
                  <p className="text-xs text-[#B8AEB2]">
                    Consultation Fee
                  </p>

                  <p className="mt-1 font-medium text-[#0D0D0D]">
                    {profile.consultationFee
                      ? `Rs. ${profile.consultationFee}`
                      : "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* City */}
            <div className="rounded-xl bg-[#FEF4F4] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                  <MapPin size={19} className="text-[#F33B7D]" />
                </div>

                <div>
                  <p className="text-xs text-[#B8AEB2]">Location</p>

                  <p className="mt-1 font-medium text-[#0D0D0D]">
                    {profile.city || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB]">
              <GraduationCap size={20} className="text-[#F33B7D]" />
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
                Qualifications
              </h2>

              <p className="text-sm text-[#8F8C8C]">
                Your registered medical qualifications.
              </p>
            </div>
          </div>

          {profile.qualifications?.length > 0 ? (
            <div className="space-y-3">
              {profile.qualifications.map((qualification, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-[#FEF4F4] p-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-[#0D0D0D]">
                        {qualification.degree || "Medical Degree"}
                      </p>

                      <p className="mt-1 text-sm text-[#8F8C8C]">
                        {qualification.institution || "Institution not provided"}
                      </p>
                    </div>

                    {qualification.completionYear && (
                      <span className="text-sm font-medium text-[#F33B7D]">
                        {qualification.completionYear}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#FEF4F4] p-5 text-center">
              <p className="text-sm text-[#8F8C8C]">
                No qualifications added yet.
              </p>
            </div>
          )}
        </div>

        {/* About Me */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
            About Me
          </h2>

          <p className="mt-1 text-sm text-[#8F8C8C]">
            Professional introduction.
          </p>

          <div className="mt-5 rounded-xl bg-[#FEF4F4] p-5">
            <p className="text-sm leading-7 text-[#5F5A5D]">
              {profile.bio ||
                "You have not added a professional bio yet. Add a short introduction about yourself and your medical experience."}
            </p>
          </div>
        </div>

        {/* Areas of Expertise */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB]">
              <BriefcaseMedical size={19} className="text-[#F33B7D]" />
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
                Areas of Expertise
              </h2>

              <p className="text-sm text-[#8F8C8C]">
                Your professional areas of expertise.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.areasOfExpertise?.length > 0 ? (
              profile.areasOfExpertise.map((area, index) => (
                <span
                  key={index}
                  className="rounded-full bg-[#FEE4EB] px-4 py-2 text-sm font-medium text-[#F33B7D]"
                >
                  {area}
                </span>
              ))
            ) : (
              <p className="text-sm text-[#8F8C8C]">
                No areas of expertise added yet.
              </p>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB]">
              <Languages size={19} className="text-[#F33B7D]" />
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
                Languages
              </h2>

              <p className="text-sm text-[#8F8C8C]">
                Languages you can communicate with patients in.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.languages?.length > 0 ? (
              profile.languages.map((language, index) => (
                <span
                  key={index}
                  className="rounded-full bg-[#FEF4F4] px-4 py-2 text-sm font-medium text-[#5F5A5D] ring-1 ring-[#FEE4EB]"
                >
                  {language}
                </span>
              ))
            ) : (
              <p className="text-sm text-[#8F8C8C]">
                No languages added yet.
              </p>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEE4EB]">
                <BadgeCheck size={21} className="text-[#F33B7D]" />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
                  Verification Status
                </h2>

                <p className="mt-1 text-sm text-[#8F8C8C]">
                  Your professional verification status.
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${verification.bg} ${verification.border} ${verification.text}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {verification.label}
            </span>
          </div>

          {profile.verificationStatus !== "verified" && (
            <div className="mt-5 rounded-xl bg-[#FEF4F4] p-4">
              <p className="text-sm leading-6 text-[#8F8C8C]">
                Your professional verification is currently{" "}
                <span className={`font-medium ${verification.text}`}>
                  {verification.label.toLowerCase()}
                </span>
                . You can check the verification section for more details.
              </p>

              <Link
                to="/doctor/verification"
                className="mt-3 inline-flex text-sm font-medium text-[#F33B7D] hover:underline"
              >
                View Verification Details →
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/doctor/profile"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FEE4EB] bg-white px-5 py-3 text-sm font-medium text-[#5F5A5D] transition hover:bg-[#FEF4F4]"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>

          <Link
            to="/doctor/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F33B7D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#e82f70]"
          >
            <Edit3 size={16} />
            Edit Profile
          </Link>
        </div>
      </div>
    </DoctorLayout>
  );
}