import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import Avatar from "../../components/common/Avatar";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../services/doctorPortal.service";
import {
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
  ShieldCheck,
  Stethoscope,
  Building2,
  BriefcaseMedical,
  Phone,
  User,
  GraduationCap,
  BadgeCheck,
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
// Main Component
// =========================================

export default function DoctorEditProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    hospital: "",
    yearsOfExperience: "",
    profilePicture: "",
  });

  const [qualifications, setQualifications] = useState([]);

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

      // Backend ApiResponse structure:
      // response.data = actual doctor profile
      const data = response?.data || {};

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
        profilePicture: doctor?.profilePicture || "",
      });

      setQualifications(
        doctor?.doctorVerification?.qualifications || []
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
  // Qualification Handlers
  // =========================================

  const addQualification = () => {
    setQualifications((prev) => [
      ...prev,
      {
        degree: "",
        institution: "",
        completionYear: "",
      },
    ]);
  };

  const removeQualification = (index) => {
    setQualifications((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleQualificationChange = (
    index,
    field,
    value
  ) => {
    setQualifications((prev) =>
      prev.map((qualification, i) =>
        i === index
          ? {
              ...qualification,
              [field]: value,
            }
          : qualification
      )
    );
  };

  // =========================================
  // Save Profile
  // =========================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const cleanedQualifications = qualifications
        .filter(
          (qualification) =>
            qualification.degree?.trim() ||
            qualification.institution?.trim() ||
            qualification.completionYear
        )
        .map((qualification) => ({
          degree: qualification.degree?.trim() || "",
          institution:
            qualification.institution?.trim() || "",
          completionYear: qualification.completionYear
            ? Number(qualification.completionYear)
            : undefined,
        }));

      await updateDoctorProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        specialization: formData.specialization,
        hospital: formData.hospital,
        yearsOfExperience: formData.yearsOfExperience
          ? Number(formData.yearsOfExperience)
          : null,
        doctorVerification: {
          qualifications: cleanedQualifications,
        },
      });

      setSaved(true);

      // Refresh data from backend
      await fetchProfile();

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
        {/* =========================================
            Top Profile Card
        ========================================= */}

        <div className="mb-4 rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                name={formData.fullName || "Doctor"}
                image={formData.profilePicture}
                size="h-24 w-24 text-xl"
              />

              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#F33B7D] text-white shadow-[0_4px_10px_rgba(243,59,125,0.4)]">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            {/* Doctor info */}
            <div>
              <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
                {formData.fullName || "Doctor"}
              </h2>

              <p className="mt-1 text-sm text-[#F33B7D]">
                {formData.specialization || "Specialization not added"}
              </p>

              <p className="mt-1 text-sm text-[#8F8C8C]">
                {formData.email}
              </p>

              <p className="text-sm text-[#8F8C8C]">
                {formData.phone || "Phone not added"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#FFF7F9] px-4 py-3">
            <div className="flex items-start gap-3">
              <Camera className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F33B7D]" />

              <div>
                <p className="text-xs font-semibold text-[#3D3939]">
                  Profile picture
                </p>

                <p className="mt-0.5 text-[11px] text-[#9E9E9E]">
                  Profile picture upload can be connected when the
                  doctor avatar upload endpoint is added.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            Main Grid
        ========================================= */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* =====================================
              Personal Information
          ===================================== */}

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
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

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-3">
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            </div>

            {/* Information cards */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
            </div>
          </div>

          {/* =====================================
              Qualifications
          ===================================== */}

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-3">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D]">
                  <GraduationCap className="h-4 w-4" />
                </span>

                <div>
                  <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                    Qualifications
                  </h2>

                  <p className="text-xs text-[#B8AEB2]">
                    Add your academic and professional qualifications
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addQualification}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE4EB] px-3.5 py-2 text-xs font-semibold text-[#F33B7D] transition hover:bg-[#FCE4EB]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Qualification
              </button>
            </div>

            {qualifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#F0DCE4] bg-[#FFF9FA] px-5 py-8 text-center">
                <GraduationCap className="mx-auto h-7 w-7 text-[#F33B7D]" />

                <p className="mt-2 text-sm font-medium text-[#3D3939]">
                  No qualifications added
                </p>

                <p className="mt-1 text-xs text-[#B8AEB2]">
                  Add your degrees and institutions to strengthen your
                  professional profile.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {qualifications.map((qualification, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-[#FEF4F4] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#3D3939]">
                        Qualification {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeQualification(index)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#F33B7D] transition hover:bg-white"
                        title="Remove qualification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <Field
                        label="Degree"
                        value={qualification.degree || ""}
                        onChange={(e) =>
                          handleQualificationChange(
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                        placeholder="e.g. MBBS"
                      />

                      <Field
                        label="Institution"
                        value={qualification.institution || ""}
                        onChange={(e) =>
                          handleQualificationChange(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Aga Khan University"
                      />

                      <Field
                        label="Completion Year"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={
                          qualification.completionYear || ""
                        }
                        onChange={(e) =>
                          handleQualificationChange(
                            index,
                            "completionYear",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 2022"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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