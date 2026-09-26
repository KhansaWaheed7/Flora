import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import Avatar from "../../components/common/Avatar";
import {
  getDoctorProfile,
  updateDoctorProfile,
  uploadDoctorAvatar,
  removeDoctorAvatar,
} from "../../services/doctorPortal.service";
import { useAuth } from "../../context/AuthContext";

import {
  ArrowLeft,
  Camera,
  ShieldCheck,
  Stethoscope,
  Building2,
  BriefcaseMedical,
  User,
  BadgeCheck,
  FileText,
  Briefcase,
  Speech,
  Plus,
  X,
  Coins,
  MapPin,
} from "lucide-react";

// =========================================
// Reusable Input
// =========================================

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#3D3939]">
        {label}
      </span>

      <input
        {...props}
        className="w-full rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm text-[#0D0D0D] outline-none placeholder:text-[#B8AEB2] transition focus:border-[#F33B7D] focus:ring-1 focus:ring-[#F33B7D]/20"
      />
    </label>
  );
}

// =========================================
// Reusable Textarea
// =========================================

function TextArea({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#3D3939]">
        {label}
      </span>

      <textarea
        {...props}
        rows={5}
        className="w-full resize-none rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm leading-6 text-[#0D0D0D] outline-none placeholder:text-[#B8AEB2] transition focus:border-[#F33B7D] focus:ring-1 focus:ring-[#F33B7D]/20"
      />

      {hint && (
        <span className="mt-1 block text-[10px] text-[#B8AEB2]">
          {hint}
        </span>
      )}
    </label>
  );
}

// =========================================
// Reusable Tag Input
// =========================================

function TagInput({
  label,
  placeholder,
  tags,
  onAdd,
  onRemove,
  emptyText,
}) {
  const [input, setInput] = useState("");

  const commit = () => {
    const value = input.trim();

    if (!value) return;

    const exists = tags.some(
      (t) => t.toLowerCase() === value.toLowerCase()
    );

    if (!exists) onAdd(value);

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onRemove(tags.length - 1);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-[#3D3939]">
        {label}
      </span>

      {tags.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE4EB] px-3 py-1.5 text-xs font-medium text-[#F33B7D]"
            >
              {tag}

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="flex h-4 w-4 items-center justify-center rounded-full transition hover:bg-[#F33B7D]/10"
                title={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="mb-3 text-xs text-[#B8AEB2]">{emptyText}</p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm text-[#0D0D0D] outline-none placeholder:text-[#B8AEB2] transition focus:border-[#F33B7D] focus:ring-1 focus:ring-[#F33B7D]/20"
        />

        <button
          type="button"
          onClick={commit}
          disabled={!input.trim()}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition ${
            input.trim()
              ? "bg-[#F33B7D] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)]"
              : "cursor-not-allowed bg-[#FEE4EB] text-[#F33B7D]/40"
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <p className="mt-1.5 text-[10px] text-[#B8AEB2]">
        Press Enter or comma to add. Backspace on empty input removes the last.
      </p>
    </div>
  );
}

// =========================================
// Main Component
// =========================================

export default function DoctorEditProfile() {
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    hospital: "",
    yearsOfExperience: "",
    consultationFee: "",
    city: "",
    profilePicture: "",
    bio: "",
  });

  const [areasOfExpertise, setAreasOfExpertise] = useState([]);
  const [languages, setLanguages] = useState([]);

  // =========================================
  // Fetch Doctor Profile
  // =========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDoctorProfile();

      const data = response || {};

      const doctor = data?.user || data?.doctor || data;

      setFormData({
        fullName: doctor?.fullName || "",
        email: doctor?.email || "",
        phone: doctor?.phone || "",
        specialization: doctor?.specialization || "",
        hospital: doctor?.hospital || "",
        yearsOfExperience:
          doctor?.yearsOfExperience !== undefined &&
          doctor?.yearsOfExperience !== null
            ? doctor.yearsOfExperience
            : "",
        consultationFee:
          doctor?.consultationFee !== undefined &&
          doctor?.consultationFee !== null
            ? doctor.consultationFee
            : "",
        city: doctor?.city || "",
        profilePicture: doctor?.profilePicture || "",
        bio: doctor?.bio || "",
      });

      setAreasOfExpertise(
        Array.isArray(doctor?.areasOfExpertise)
          ? doctor.areasOfExpertise
          : []
      );

      setLanguages(
        Array.isArray(doctor?.languages) ? doctor.languages : []
      );
    } catch (err) {
      console.error("Doctor profile fetch error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        setAvatarMessage(
          "Please select a JPG, PNG, or WEBP image."
        );

        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setAvatarMessage(
          "Profile picture must not exceed 5 MB."
        );

        e.target.value = "";
        return;
      }

      setAvatarLoading(true);
      setIsUploading(true);
      setAvatarMessage("");

      const data = new FormData();

      data.append("avatar", file);

      const res = await uploadDoctorAvatar(data);

      const avatarUrl =
        res?.data?.avatar || res?.data || "";

      setFormData((prev) => ({
        ...prev,
        profilePicture: avatarUrl,
      }));

      setAvatarMessage(
        "Profile picture uploaded successfully!"
      );

      await fetchProfile();
      await refreshUser();

      e.target.value = "";
    } catch (err) {
      console.error(
        "Doctor avatar upload error:",
        err.response?.data || err.message || err
      );

      setAvatarMessage(
        err.response?.data?.message ||
          "Failed to upload profile picture. Please try again."
      );
    } finally {
      setAvatarLoading(false);
      setIsUploading(false);

      setTimeout(() => {
        setAvatarMessage("");
      }, 3000);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setAvatarLoading(true);
      setIsUploading(false);
      setAvatarMessage("");

      await removeDoctorAvatar();

      setFormData((prev) => ({
        ...prev,
        profilePicture: "",
      }));

      setAvatarMessage(
        "Profile picture removed successfully!"
      );

      await fetchProfile();
      await refreshUser();
    } catch (err) {
      console.error(
        "Doctor avatar removal error:",
        err
      );

      setAvatarMessage(
        err.response?.data?.message ||
          "Failed to remove profile picture."
      );
    } finally {
      setAvatarLoading(false);

      setTimeout(() => {
        setAvatarMessage("");
      }, 3000);
    }
  };

  // =========================================
  // Input Change
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // Tag Handlers
  // =========================================

  const addArea = (value) =>
    setAreasOfExpertise((prev) => [...prev, value]);

  const removeArea = (index) =>
    setAreasOfExpertise((prev) =>
      prev.filter((_, i) => i !== index)
    );

  const addLanguage = (value) =>
    setLanguages((prev) => [...prev, value]);

  const removeLanguage = (index) =>
    setLanguages((prev) =>
      prev.filter((_, i) => i !== index)
    );

  // =========================================
  // Save Profile
  // =========================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      await updateDoctorProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        specialization: formData.specialization,
        hospital: formData.hospital,
        yearsOfExperience: formData.yearsOfExperience
          ? Number(formData.yearsOfExperience)
          : null,
        consultationFee: formData.consultationFee
          ? Number(formData.consultationFee)
          : null,
        city: formData.city.trim(),
        bio: formData.bio.trim(),
        areasOfExpertise: areasOfExpertise.map((a) => a.trim()).filter(Boolean),
        languages: languages.map((l) => l.trim()).filter(Boolean),
      });

      setSaved(true);

      await fetchProfile();
      await refreshUser();

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error(
        "Doctor profile update error:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // Loading Screen
  // =========================================

  if (loading) {
    return (
      <DoctorLayout
        title="Edit Profile"
        subtitle="Update your professional information."
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

  // =========================================
  // UI
  // =========================================

  return (
    <DoctorLayout
      title="Edit Profile"
      subtitle="Update your professional information."
      showSearch={false}
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-xs text-[#9E9E9E]">
          Home
          <span className="mx-2">›</span>
          Profile
          <span className="mx-2">›</span>
          <span className="font-medium text-[#F33B7D]">
            Edit Profile
          </span>
        </p>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">
            Edit Profile
          </h1>

          <p className="mt-1 text-sm text-[#8F8C8C]">
            Manage your personal and professional information.
          </p>
        </div>

        <Link
          to="/doctor/profile"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8F8C8C] transition hover:text-[#F33B7D]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Profile
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* =========================================
              Profile Picture Section
          ========================================= */}

          <div className="lg:col-span-1">
            <div className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <h2 className="mb-4 self-start font-display text-base font-semibold text-[#0D0D0D]">
                Profile Picture
              </h2>

              <div className="relative">
                <Avatar
                  name={formData.fullName || "Doctor"}
                  image={formData.profilePicture}
                  size="h-24 w-24 text-xl"
                />

                <label
                  htmlFor="doctor-avatar"
                  className={`absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.4)] transition hover:scale-105 ${
                    avatarLoading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                  title="Change profile picture"
                >
                  <Camera className="h-3.5 w-3.5" />
                </label>
              </div>

              {avatarMessage && (
                <div
                  className={`mt-4 text-sm font-medium ${
                    avatarMessage.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {avatarMessage}
                </div>
              )}

              <p className="mt-4 text-[10px] text-[#B8AEB2]">
                JPG, PNG or WEBP. Max size 5MB.
              </p>

              <input
                type="file"
                id="doctor-avatar"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleAvatarUpload}
                disabled={avatarLoading}
              />

              <label
                htmlFor="doctor-avatar"
                className={`mt-4 w-full cursor-pointer rounded-full px-4 py-2.5 text-center text-xs font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition hover:-translate-y-0.5 ${
                  avatarLoading && isUploading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-[#F33B7D]"
                }`}
              >
                {avatarLoading && isUploading
                  ? "Uploading..."
                  : "Change Photo"}
              </label>

              {formData.profilePicture && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={avatarLoading}
                  className={`mt-2 w-full rounded-full border border-[#F0DCE4] bg-white px-4 py-2.5 text-xs font-semibold text-[#F33B7D] transition ${
                    avatarLoading && !isUploading
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-[#FFF5F8]"
                  }`}
                >
                  {avatarLoading && !isUploading
                    ? "Removing..."
                    : "Remove Photo"}
                </button>
              )}
            </div>
          </div>

          {/* =========================================
              Main Content (Right Side)
          ========================================= */}

          <div className="lg:col-span-3 space-y-4">
            {/* =====================================
                Personal Information
            ===================================== */}

            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
                  <User className="h-4 w-4" />
                </span>

                <div>
                  <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                    Personal Information
                  </h2>

                  <p className="text-xs text-[#B8AEB2]">
                    Your basic account information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <Field
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  readOnly
                />

                <Field
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* =====================================
                Verification Status
            ===================================== */}

            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
                  <ShieldCheck className="h-4 w-4" />
                </span>

                <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                  Verification
                </h2>
              </div>

              <div className="rounded-xl bg-[#FEF4F4] p-4">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#B8AEB2]">
                  Account Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-green-500" />

                  <span className="text-sm font-semibold capitalize text-[#0D0D0D]">
                    Verified
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-[#8F8C8C]">
                  Your professional verification details are managed
                  through the verification process.
                </p>
              </div>
            </div>

            {/* =====================================
                Professional Information
            ===================================== */}

            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
                  <Stethoscope className="h-4 w-4" />
                </span>

                <div>
                  <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                    Professional Information
                  </h2>

                  <p className="text-xs text-[#B8AEB2]">
                    Information patients can use to understand your
                    professional background
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Gynaecology"
                  required
                />

                <Field
                  label="Hospital / Clinic"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  placeholder="Enter hospital or clinic"
                />

                <Field
                  label="Years of Experience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                />

                <Field
                  label="Consultation Fee (PKR)"
                  name="consultationFee"
                  type="number"
                  min="0"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                />

                <Field
                  label="Location (City)"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Lahore"
                />
              </div>

              {/* Information cards */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <div className="flex items-center gap-3 rounded-xl bg-[#FEF4F4] p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#F33B7D]">
                    <Stethoscope className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-[#0D0D0D]">
                      Specialization
                    </p>
                    <p className="text-[10px] text-[#B8AEB2]">
                      Your medical specialty
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#FEF4F4] p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#F33B7D]">
                    <Building2 className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-[#0D0D0D]">
                      Hospital
                    </p>
                    <p className="text-[10px] text-[#B8AEB2]">
                      Your workplace
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#FEF4F4] p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#F33B7D]">
                    <BriefcaseMedical className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-[#0D0D0D]">
                      Experience
                    </p>
                    <p className="text-[10px] text-[#B8AEB2]">
                      Years of practice
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#FEF4F4] p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#F33B7D]">
                    <Coins className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-[#0D0D0D]">
                      Consultation Fee
                    </p>
                    <p className="text-[10px] text-[#B8AEB2]">
                      Per appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#FEF4F4] p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#F33B7D]">
                    <MapPin className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-[#0D0D0D]">
                      Location
                    </p>
                    <p className="text-[10px] text-[#B8AEB2]">
                      Your city
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================
                Areas of Expertise
            ===================================== */}

            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
                  <Briefcase className="h-4 w-4" />
                </span>

                <div>
                  <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                    Areas of Expertise
                  </h2>

                  <p className="text-xs text-[#B8AEB2]">
                    Add the areas you specialize in (e.g. PCOS, Fertility, High-Risk Pregnancy)
                  </p>
                </div>
              </div>

              <TagInput
                label="Your Areas of Expertise"
                placeholder="e.g. PCOS Management"
                tags={areasOfExpertise}
                onAdd={addArea}
                onRemove={removeArea}
                emptyText="No areas of expertise added yet."
              />
            </div>

            {/* =====================================
                Languages
            ===================================== */}

            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
                  <Speech className="h-4 w-4" />
                </span>

                <div>
                  <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                    Languages
                  </h2>

                  <p className="text-xs text-[#B8AEB2]">
                    Add the languages you can consult in (e.g. English, Urdu)
                  </p>
                </div>
              </div>

              <TagInput
                label="Languages You Speak"
                placeholder="e.g. Urdu"
                tags={languages}
                onAdd={addLanguage}
                onRemove={removeLanguage}
                emptyText="No languages added yet."
              />
            </div>

            {/* =====================================
                About / Bio
            ===================================== */}

            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
                  <FileText className="h-4 w-4" />
                </span>

                <div>
                  <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                    About Me
                  </h2>

                  <p className="text-xs text-[#B8AEB2]">
                    A short professional introduction patients will see
                    on your profile
                  </p>
                </div>
              </div>

              <TextArea
                label="Professional Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short introduction about yourself and your medical experience..."
                maxLength={600}
                hint={`${formData.bio.length}/600 characters`}
              />
            </div>
          </div>
        </div>

        {/* =========================================
            Save Buttons
        ========================================= */}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <Link
            to="/doctor/profile"
            className="rounded-full border border-[#F0DCE4] bg-white px-5 py-2.5 text-sm font-semibold text-[#8F8C8C] transition hover:bg-[#FFF5F8] hover:text-[#F33B7D]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_16px_-4px_rgba(243,59,125,0.4)] transition ${
              saving
                ? "cursor-not-allowed bg-gray-400"
                : "bg-[#F33B7D] hover:-translate-y-0.5"
            }`}
          >
            {saving
              ? "Saving..."
              : saved
              ? "Saved ✓"
              : "Save Changes"}
          </button>
        </div>
      </form>
    </DoctorLayout>
  );
}