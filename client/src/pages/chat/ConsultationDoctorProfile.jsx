import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarX2,
  Coins,
  GraduationCap,
  MapPin,
  MessageSquareText,
  Phone,
  Mail,
  Stethoscope,
  XCircle,
} from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getConsultationDoctorProfile, closePatientConsultation } from "../../services/chat.service";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Avatar({ name, image }) {
  const [imageError, setImageError] = useState(false);
  const initials = (name || "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (image && !imageError) {
    return (
      <img
        src={image}
        alt={name || "Doctor"}
        onError={() => setImageError(true)}
        className="h-28 w-28 rounded-full object-cover ring-4 ring-[#FEE4EB]"
      />
    );
  }

  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F33B7D] text-3xl font-semibold text-white ring-4 ring-[#FEE4EB]">
      {initials}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
    return null;
  return (
    <div className="rounded-xl bg-[#FCE4EB] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white">
          <Icon className="h-5 w-5 text-[#F33B7D]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[#8F8C8C]">{label}</p>
          <p className="mt-1 break-words text-sm font-medium text-[#0D0D0D]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function WeeklySchedule({ schedule = [] }) {
  // Normalize: accept either an array of day objects, or an object keyed by day
  const days = Array.isArray(schedule)
    ? schedule
    : schedule && typeof schedule === "object"
      ? Object.values(schedule)
      : [];

  const hasAny = days.length > 0;

  if (!hasAny) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
            Weekly Schedule
          </h2>
          <p className="mt-1 text-sm text-[#8F8C8C]">
            The doctor's availability for the week.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEE4EB]">
            <CalendarX2 className="h-6 w-6 text-[#F33B7D]" />
          </span>
          <p className="mt-3 text-sm font-medium text-[#0D0D0D]">
            No weekly schedule set
          </p>
          <p className="mt-1 text-xs text-[#8F8C8C]">
            This doctor hasn't published their availability yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-[#0D0D0D]">
          Weekly Schedule
        </h2>
        <p className="mt-1 text-sm text-[#8F8C8C]">
          The doctor's availability for the week.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {days.map((day, i) => {
          const slots = Array.isArray(day?.slots) ? day.slots : [];
          const hasSchedule =
            (day?.enabled ?? slots.length > 0) && slots.length > 0;

          const dayName =
            day?.name ||
            (typeof day?.day === "number" ? DAY_NAMES[day.day] : null) ||
            "—";

          return (
            <div
              key={day?.day ?? day?.name ?? i}
              className={`flex flex-col rounded-2xl p-3 ring-1 transition ${
                hasSchedule
                  ? "bg-gradient-to-br from-[#FEE4EB] to-[#FCE4EB] ring-[#F8C9DA]"
                  : "bg-[#FDF6F8] ring-[#F5E4EC]"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p
                  className={`text-xs font-bold uppercase tracking-wide ${
                    hasSchedule ? "text-[#F33B7D]" : "text-[#C9A8B8]"
                  }`}
                >
                  {dayName.slice(0, 3)}
                </p>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasSchedule ? "bg-[#F33B7D]" : "bg-[#E8D5DD]"
                  }`}
                />
              </div>

              {hasSchedule ? (
                <div className="flex flex-1 flex-col gap-1.5">
                  {slots.map((slot, index) => (
                    <span
                      key={`${dayName}-${index}`}
                      className="rounded-lg bg-white/80 px-2 py-1 text-[10px] font-semibold text-[#F33B7D] shadow-sm"
                    >
                      {slot.start} – {slot.end}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-auto text-[10px] font-medium text-[#C9A8B8]">
                  Not available
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ConsultationDoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");
  const [closeError, setCloseError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getConsultationDoctorProfile(id);
        setDoctor(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Could not load doctor profile."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleClose = async () => {
    if (
      !window.confirm("Are you sure you want to close this consultation?")
    )
      return;
    try {
      setClosing(true);
      setCloseError("");
      await closePatientConsultation(id);
      navigate(`/chat/${id}/closed`, { replace: true });
    } catch (err) {
      setCloseError(
        err?.response?.data?.message || "Could not close the consultation."
      );
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Doctor Profile" backTo={`/chat/${id}`}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#8F8C8C]">Loading doctor profile...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !doctor) {
    return (
      <PageLayout title="Doctor Profile" backTo={`/chat/${id}`}>
        <div className="mx-auto max-w-lg rounded-2xl bg-red-50 p-5 text-center text-sm text-red-600">
          {error || "Doctor not found."}
        </div>
      </PageLayout>
    );
  }

  const active = doctor.consultationStatus === "active";

  // Try multiple possible field names for the schedule
  const scheduleData =
    doctor.weeklySchedule ||
    doctor.schedule ||
    doctor.availability ||
    [];

  return (
    <PageLayout title="Doctor Profile" backTo={`/chat/${id}`}>
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <Avatar name={doctor.fullName} image={doctor.profilePicture} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="font-display text-2xl font-semibold text-[#0D0D0D]">
                  {doctor.fullName}
                </h1>
                {doctor.verificationStatus === "verified" && (
                  <BadgeCheck className="h-5 w-5 text-[#F33B7D]" />
                )}
              </div>
              <p className="mt-1 text-base font-medium text-[#F33B7D]">
                {doctor.specialization || "General Physician"}
              </p>
              <p className="mt-2 text-sm text-[#8F8C8C]">
                Consultation status:{" "}
                <span className="font-semibold capitalize">
                  {doctor.consultationStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-[#0D0D0D]">
            Doctor Details
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem
              icon={Stethoscope}
              label="Specialization"
              value={doctor.specialization}
            />
            <DetailItem
              icon={Building2}
              label="Hospital / Clinic"
              value={doctor.hospital}
            />
            <DetailItem
              icon={Briefcase}
              label="Experience"
              value={
                doctor.yearsOfExperience != null
                  ? `${doctor.yearsOfExperience} years`
                  : null
              }
            />
            <DetailItem icon={MapPin} label="City" value={doctor.city} />
            <DetailItem icon={Mail} label="Email" value={doctor.email} />
            <DetailItem icon={Phone} label="Phone" value={doctor.phone} />
            <DetailItem
              icon={Coins}
              label="Consultation Fee"
              value={
                doctor.consultationFee != null
                  ? `PKR ${doctor.consultationFee}`
                  : null
              }
            />
          </div>
        </div>

        {doctor.qualifications?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-[#F33B7D]" />
              <h2 className="text-xl font-semibold">Qualifications</h2>
            </div>
            <div className="mt-4 space-y-3">
              {doctor.qualifications.map((q, i) => (
                <div key={i} className="rounded-xl bg-[#FCE4EB] p-4">
                  <p className="font-semibold">
                    {q.degree || "Qualification"}
                  </p>
                  <p className="text-sm text-[#6F6A6D]">
                    {q.institution || ""}
                    {q.completionYear ? ` • ${q.completionYear}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {doctor.areasOfExpertise?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="text-xl font-semibold">Areas of Expertise</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.areasOfExpertise.map((x, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#FCE4EB] px-3 py-1.5 text-sm text-[#3D3939]"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        )}

        {doctor.languages?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <MessageSquareText className="h-5 w-5 text-[#F33B7D]" />
              <h2 className="text-xl font-semibold">Languages</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.languages.map((x, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#FCE4EB] px-3 py-1.5 text-sm text-[#3D3939]"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        )}

        <WeeklySchedule schedule={scheduleData} />

        {doctor.bio && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="text-xl font-semibold">About the Doctor</h2>
            <p className="mt-4 rounded-xl bg-[#FCE4EB] p-5 text-sm leading-7 text-[#3D3939]">
              {doctor.bio}
            </p>
          </div>
        )}

        {closeError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {closeError}
          </div>
        )}

        {active && (
          <button
            disabled={closing}
            onClick={handleClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(220,38,38,0.5)] transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <XCircle className="h-4 w-4" />
            {closing ? "Closing consultation..." : "Close Consultation"}
          </button>
        )}
      </div>
    </PageLayout>
  );
}