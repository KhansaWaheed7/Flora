import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  GraduationCap,
  Languages,
  MapPin,
  Phone,
  Mail,
  Stethoscope,
  XCircle,
} from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getConsultationDoctorProfile, closePatientConsultation } from "../../services/chat.service";

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
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="rounded-xl bg-[#FEF4F4] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white">
          <Icon className="h-5 w-5 text-[#F33B7D]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[#B8AEB2]">{label}</p>
          <p className="mt-1 break-words text-sm font-medium text-[#0D0D0D]">{value}</p>
        </div>
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
        setError(err?.response?.data?.message || "Could not load doctor profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleClose = async () => {
    if (!window.confirm("Are you sure you want to close this consultation?")) return;
    try {
      setClosing(true);
      setCloseError("");
      await closePatientConsultation(id);
      navigate(`/chat/${id}/closed`, { replace: true });
    } catch (err) {
      setCloseError(err?.response?.data?.message || "Could not close the consultation.");
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return <PageLayout title="Doctor Profile" backTo={`/chat/${id}`}><div className="flex min-h-[60vh] items-center justify-center"><p className="text-sm text-[#8F8C8C]">Loading doctor profile...</p></div></PageLayout>;
  }

  if (error || !doctor) {
    return <PageLayout title="Doctor Profile" backTo={`/chat/${id}`}><div className="mx-auto max-w-lg rounded-2xl bg-red-50 p-5 text-center text-sm text-red-600">{error || "Doctor not found."}</div></PageLayout>;
  }

  const active = doctor.consultationStatus === "active";

  return (
    <PageLayout title="Doctor Profile" backTo={`/chat/${id}`}>
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <Avatar name={doctor.fullName} image={doctor.profilePicture} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="font-display text-2xl font-semibold text-[#0D0D0D]">{doctor.fullName}</h1>
                {doctor.verificationStatus === "verified" && <BadgeCheck className="h-5 w-5 text-[#F33B7D]" />}
              </div>
              <p className="mt-1 text-base font-medium text-[#F33B7D]">{doctor.specialization || "General Physician"}</p>
              <p className="mt-2 text-sm text-[#8F8C8C]">Consultation status: <span className="font-semibold capitalize">{doctor.consultationStatus}</span></p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-[#0D0D0D]">Doctor Details</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem icon={Stethoscope} label="Specialization" value={doctor.specialization} />
            <DetailItem icon={Building2} label="Hospital / Clinic" value={doctor.hospital} />
            <DetailItem icon={Briefcase} label="Experience" value={doctor.yearsOfExperience != null ? `${doctor.yearsOfExperience} years` : null} />
            <DetailItem icon={MapPin} label="City" value={doctor.city} />
            <DetailItem icon={Mail} label="Email" value={doctor.email} />
            <DetailItem icon={Phone} label="Phone" value={doctor.phone} />
            <DetailItem icon={Briefcase} label="Consultation Fee" value={doctor.consultationFee != null ? `PKR ${doctor.consultationFee}` : null} />
          </div>
        </div>

        {doctor.qualifications?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="flex items-center gap-3"><GraduationCap className="h-5 w-5 text-[#F33B7D]" /><h2 className="text-xl font-semibold">Qualifications</h2></div>
            <div className="mt-4 space-y-3">
              {doctor.qualifications.map((q, i) => <div key={i} className="rounded-xl bg-[#FEF4F4] p-4"><p className="font-semibold">{q.degree || "Qualification"}</p><p className="text-sm text-[#8F8C8C]">{q.institution || ""}{q.completionYear ? ` • ${q.completionYear}` : ""}</p></div>)}
            </div>
          </div>
        )}

        {doctor.areasOfExpertise?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"><h2 className="text-xl font-semibold">Areas of Expertise</h2><div className="mt-4 flex flex-wrap gap-2">{doctor.areasOfExpertise.map((x, i) => <span key={i} className="rounded-full bg-[#FEF4F4] px-3 py-1.5 text-sm">{x}</span>)}</div></div>
        )}

        {doctor.languages?.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"><div className="flex items-center gap-3"><Languages className="h-5 w-5 text-[#F33B7D]" /><h2 className="text-xl font-semibold">Languages</h2></div><div className="mt-4 flex flex-wrap gap-2">{doctor.languages.map((x, i) => <span key={i} className="rounded-full bg-[#FEF4F4] px-3 py-1.5 text-sm">{x}</span>)}</div></div>
        )}

        {doctor.bio && <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"><h2 className="text-xl font-semibold">About the Doctor</h2><p className="mt-4 rounded-xl bg-[#FEF4F4] p-5 text-sm leading-7 text-[#5F5A5D]">{doctor.bio}</p></div>}

        {closeError && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{closeError}</div>}
        {active && <button disabled={closing} onClick={handleClose} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-100 hover:bg-red-100 disabled:opacity-60"><XCircle className="h-4 w-4" />{closing ? "Closing consultation..." : "Close Consultation"}</button>}
      </div>
    </PageLayout>
  );
}
