import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  BriefcaseMedical,
  Building2,
  GraduationCap,
  Languages,
  MapPin,
  MessageCircle,
  Stethoscope,
} from "lucide-react";

import PageLayout from "../../layouts/PageLayout";
import { getAvailableDoctors, requestConsultation } from "../../services/chat.service";

function Avatar({ name, image, size = "h-24 w-24" }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${size} flex-shrink-0 rounded-full object-cover`}
      />
    );
  }

  const initials = (name || "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-2xl font-semibold text-white`}
    >
      {initials}
    </div>
  );
}

function DetailItem({ icon: Icon, label, children }) {
  if (!children) return null;

  return (
    <div className="rounded-xl bg-[#FEF4F4] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white">
          <Icon className="h-5 w-5 text-[#F33B7D]" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-[#B8AEB2]">{label}</p>
          <p className="mt-1 break-words text-sm font-medium text-[#0D0D0D]">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DoctorProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!doctor);
  const [error, setError] = useState("");

  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (doctor) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const list = await getAvailableDoctors();
        const found = list?.find((d) => d._id === id);

        if (!found) {
          setError("Doctor not found.");
        } else {
          setDoctor(found);
        }
      } catch (err) {
        console.error("Failed to load doctor:", err);
        setError(
          err?.response?.data?.message ||
            "Could not load this doctor. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, doctor]);

  const handleRequest = async () => {
    if (!reason.trim()) {
      setRequestError("Please enter a reason for your consultation.");
      return;
    }

    setRequesting(true);
    setRequestError("");

    try {
      const chat = await requestConsultation(
        doctor._id,
        reason.trim()
      );

      navigate("/chat/request-sent", {
        state: {
          chat,
          doctor,
        },
      });
    } catch (err) {
      console.error("Failed to send consultation request:", err);

      setRequestError(
        err?.response?.data?.message ||
          "Could not send consultation request. Try again."
      );
    } finally {
      setRequesting(false);
    }
  };

  // =========================================
  // Loading State
  // =========================================

  if (loading) {
    return (
      <PageLayout
        title="Doctor Profile"
        backTo="/chat/doctors"
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#FEE4EB] border-t-[#F33B7D]" />

            <p className="mt-4 text-sm text-[#8F8C8C]">
              Loading doctor profile...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // =========================================
  // Error State
  // =========================================

  if (error || !doctor) {
    return (
      <PageLayout
        title="Doctor Profile"
        backTo="/chat/doctors"
      >
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl bg-red-50 px-5 py-4 text-center text-sm text-red-600">
            {error || "Doctor not found."}
          </div>

          <button
            onClick={() => navigate("/chat/doctors")}
            className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-[#F33B7D] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Find Doctor
          </button>
        </div>
      </PageLayout>
    );
  }

  const fullName = doctor.fullName || "Doctor";
  const specialization =
    doctor.specialization || "General Physician";

  return (
    <PageLayout
      title="Doctor Profile"
      backTo="/chat/doctors"
    >
      <div className="mx-auto max-w-3xl space-y-5">

        {/* =========================================
            Doctor Header Card
        ========================================= */}

        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}
            <Avatar
              name={fullName}
              image={doctor.profilePicture}
              size="h-24 w-24"
            />

            {/* Basic Information */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="font-display text-2xl font-semibold text-[#0D0D0D]">
                  {fullName}
                </h2>

                {doctor.verificationStatus === "verified" && (
                  <div
                    className="flex items-center"
                    title="Verified Doctor"
                  >
                    <BadgeCheck
                      size={21}
                      className="text-[#F33B7D]"
                      fill="#FEE4EB"
                    />
                  </div>
                )}
              </div>

              <p className="mt-1 text-base font-medium text-[#F33B7D]">
                {specialization}
              </p>

              {/* Quick Details */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#8F8C8C] sm:justify-start">

                {doctor.hospital && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-[#F33B7D]" />
                    <span>{doctor.hospital}</span>
                  </div>
                )}

                {doctor.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#F33B7D]" />
                    <span>{doctor.city}</span>
                  </div>
                )}

                {doctor.yearsOfExperience !== undefined &&
                  doctor.yearsOfExperience !== null && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-[#F33B7D]" />
                      <span>
                        {doctor.yearsOfExperience} years experience
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            Professional Information
        ========================================= */}

        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
              Professional Information
            </h2>

            <p className="mt-1 text-sm text-[#8F8C8C]">
              Get to know the doctor's professional background.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Specialization */}
            <DetailItem
              icon={Stethoscope}
              label="Specialization"
            >
              {specialization}
            </DetailItem>

            {/* Hospital */}
            <DetailItem
              icon={Building2}
              label="Hospital / Clinic"
            >
              {doctor.hospital}
            </DetailItem>

            {/* Experience */}
            {doctor.yearsOfExperience !== undefined &&
              doctor.yearsOfExperience !== null && (
                <DetailItem
                  icon={Briefcase}
                  label="Years of Experience"
                >
                  {doctor.yearsOfExperience} years
                </DetailItem>
              )}

            {/* Location */}
            <DetailItem
              icon={MapPin}
              label="Location"
            >
              {doctor.city}
            </DetailItem>
          </div>
        </div>

        {/* =========================================
            Consultation Fee
        ========================================= */}

        {doctor.consultationFee !== undefined &&
          doctor.consultationFee !== null &&
          doctor.consultationFee !== "" && (
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
                    Consultation Fee
                  </h2>

                  <p className="mt-1 text-sm text-[#8F8C8C]">
                    Fee for a consultation with this doctor.
                  </p>
                </div>

                <div className="rounded-xl bg-[#FEE4EB] px-5 py-3 text-center">
                  <p className="text-xs text-[#8F8C8C]">
                    Consultation
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#F33B7D]">
                    Rs. {doctor.consultationFee}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* =========================================
            Qualifications
        ========================================= */}

        {doctor.qualifications?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB]">
                <GraduationCap
                  size={20}
                  className="text-[#F33B7D]"
                />
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
                  Qualifications
                </h2>

                <p className="text-sm text-[#8F8C8C]">
                  Medical qualifications and education.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {doctor.qualifications.map(
                (qualification, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-[#FEF4F4] p-4"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-[#0D0D0D]">
                          {qualification.degree ||
                            "Medical Degree"}
                        </p>

                        {qualification.institution && (
                          <p className="mt-1 text-sm text-[#8F8C8C]">
                            {qualification.institution}
                          </p>
                        )}
                      </div>

                      {qualification.completionYear && (
                        <span className="text-sm font-medium text-[#F33B7D]">
                          {qualification.completionYear}
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* =========================================
            Areas of Expertise
        ========================================= */}

        {doctor.areasOfExpertise?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB]">
                <BriefcaseMedical
                  size={19}
                  className="text-[#F33B7D]"
                />
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
                  Areas of Expertise
                </h2>

                <p className="text-sm text-[#8F8C8C]">
                  Conditions and areas this doctor specializes in.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {doctor.areasOfExpertise.map(
                (area, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#FEE4EB] px-4 py-2 text-sm font-medium text-[#F33B7D]"
                  >
                    {area}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* =========================================
            Languages
        ========================================= */}

        {doctor.languages?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB]">
                <Languages
                  size={19}
                  className="text-[#F33B7D]"
                />
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
                  Languages
                </h2>

                <p className="text-sm text-[#8F8C8C]">
                  Languages this doctor can communicate in.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {doctor.languages.map(
                (language, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#FEF4F4] px-4 py-2 text-sm font-medium text-[#5F5A5D] ring-1 ring-[#FEE4EB]"
                  >
                    {language}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* =========================================
            About Doctor
        ========================================= */}

        {doctor.bio && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
              About Dr. {fullName}
            </h2>

            <p className="mt-1 text-sm text-[#8F8C8C]">
              Professional introduction.
            </p>

            <div className="mt-5 rounded-xl bg-[#FEF4F4] p-5">
              <p className="text-sm leading-7 text-[#5F5A5D]">
                {doctor.bio}
              </p>
            </div>
          </div>
        )}

        {/* =========================================
            Verification Status
        ========================================= */}

        {doctor.verificationStatus && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEE4EB]">
                  <BadgeCheck
                    size={20}
                    className="text-[#F33B7D]"
                  />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
                    Verification
                  </h2>

                  <p className="text-sm text-[#8F8C8C]">
                    Doctor's professional verification.
                  </p>
                </div>
              </div>

              {doctor.verificationStatus === "verified" ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-2 text-xs font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-current" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-yellow-100 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-600">
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {doctor.verificationStatus === "pending"
                    ? "Pending"
                    : doctor.verificationStatus}
                </span>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            Consultation Request
        ========================================= */}

        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
              Request a Consultation
            </h2>

            <p className="mt-1 text-sm text-[#8F8C8C]">
              Tell the doctor briefly why you would like to
              consult them.
            </p>
          </div>

          <label
            htmlFor="reason"
            className="mb-2 block text-sm font-semibold text-[#3D3939]"
          >
            Reason for consultation
          </label>

          <textarea
            id="reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);

              if (requestError) {
                setRequestError("");
              }
            }}
            maxLength={500}
            rows={4}
            placeholder="Briefly describe why you would like to consult this doctor..."
            className="w-full resize-none rounded-xl border border-[#F0DCE4] bg-white px-4 py-3 text-sm text-[#3D3939] outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
          />

          <div className="mt-1 text-right text-[10px] text-[#B8AEB2]">
            {reason.length}/500
          </div>

          {requestError && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {requestError}
            </div>
          )}

          <button
            onClick={handleRequest}
            disabled={requesting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MessageCircle className="h-4 w-4" />

            {requesting
              ? "Sending Request..."
              : "Request Consultation"}
          </button>
        </div>

        {/* =========================================
            Bottom Back Button
        ========================================= */}

        <div className="flex justify-start pb-2">
          <button
            onClick={() => navigate("/chat/doctors")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#FEE4EB] bg-white px-5 py-3 text-sm font-medium text-[#5F5A5D] transition hover:bg-[#FEF4F4]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Find Doctor
          </button>
        </div>
      </div>
    </PageLayout>
  );
}