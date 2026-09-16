import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Droplets, HeartPulse, Mail, MapPin, Phone, Ruler, Scale, XCircle } from "lucide-react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getPatientProfileForConsultation, closeConsultation } from "../../services/doctorPortal.service";

function Avatar({ name, image }) {
  const initials = (name || "P").split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();
  return image ? <img src={image} alt={name} className="h-28 w-28 rounded-full object-cover ring-4 ring-[#FEE4EB]" /> : <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F33B7D] text-3xl font-semibold text-white ring-4 ring-[#FEE4EB]">{initials}</div>;
}

function Detail({ icon: Icon, label, value }) {
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
  return <div className="rounded-xl bg-[#FEF4F4] p-4"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white"><Icon className="h-5 w-5 text-[#F33B7D]" /></div><div><p className="text-xs text-[#B8AEB2]">{label}</p><p className="mt-1 break-words text-sm font-medium text-[#0D0D0D]">{Array.isArray(value) ? value.join(", ") : value}</p></div></div></div>;
}

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try { setData(await getPatientProfileForConsultation(id)); }
      catch (err) { setError(err?.response?.data?.message || "Could not load patient profile."); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleClose = async () => {
    if (!window.confirm("Are you sure you want to close this consultation?")) return;
    try { setClosing(true); await closeConsultation(id); navigate("/doctor/closed-consultations", { replace: true }); }
    catch (err) { setError(err?.response?.data?.message || "Could not close the consultation."); }
    finally { setClosing(false); }
  };

  if (loading) return <DoctorLayout title="Patient Profile" showSearch={false}><div className="flex h-96 items-center justify-center text-sm text-[#8F8C8C]">Loading patient profile...</div></DoctorLayout>;
  if (error || !data?.patient) return <DoctorLayout title="Patient Profile" showSearch={false}><div className="mx-auto max-w-lg rounded-2xl bg-red-50 p-5 text-center text-sm text-red-600">{error || "Patient not found."}</div></DoctorLayout>;

  const p = data.patient;
  const active = data.consultationStatus === "active";

  return <DoctorLayout title="Patient Profile" subtitle="View patient details for this consultation." showSearch={false}>
    <div className="mx-auto max-w-4xl space-y-5">
      <button onClick={() => navigate(`/doctor/messages/${id}`)} className="inline-flex items-center gap-2 text-sm font-medium text-[#F33B7D] hover:underline"><ArrowLeft className="h-4 w-4" />Back to Chat</button>
      <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"><div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left"><Avatar name={p.fullName} image={p.avatar || p.profilePicture} /><div><h1 className="text-2xl font-semibold text-[#0D0D0D]">{p.fullName}</h1><p className="mt-1 text-sm text-[#8F8C8C]">Consultation status: <span className="font-semibold capitalize">{data.consultationStatus}</span></p></div></div></div>

      <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"><h2 className="text-xl font-semibold">Patient Details</h2><div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Detail icon={Mail} label="Email" value={p.email} /><Detail icon={Phone} label="Phone" value={p.phone} /><Detail icon={CalendarDays} label="Date of Birth" value={p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : null} /><Detail icon={HeartPulse} label="Age" value={p.age != null ? `${p.age} years` : null} /><Detail icon={HeartPulse} label="Gender" value={p.gender} /><Detail icon={Droplets} label="Blood Group" value={p.bloodGroup} /><Detail icon={MapPin} label="Location" value={p.location} /><Detail icon={Ruler} label="Height" value={p.height != null ? `${p.height} cm` : null} /><Detail icon={Scale} label="Weight" value={p.weight != null ? `${p.weight} kg` : null} />
      </div></div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"><h2 className="text-lg font-semibold">Allergies</h2>{p.allergies?.length ? <div className="mt-4 flex flex-wrap gap-2">{p.allergies.map((x, i) => <span key={i} className="rounded-full bg-[#FEF4F4] px-3 py-1.5 text-sm">{x}</span>)}</div> : <p className="mt-3 text-sm text-[#8F8C8C]">No allergies recorded.</p>}</div>
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5"><h2 className="text-lg font-semibold">Medical Conditions</h2>{p.medicalConditions?.length ? <div className="mt-4 flex flex-wrap gap-2">{p.medicalConditions.map((x, i) => <span key={i} className="rounded-full bg-[#FEF4F4] px-3 py-1.5 text-sm">{x}</span>)}</div> : <p className="mt-3 text-sm text-[#8F8C8C]">No medical conditions recorded.</p>}</div>
      </div>

      {active && <button disabled={closing} onClick={handleClose} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-100 hover:bg-red-100 disabled:opacity-60"><XCircle className="h-4 w-4" />{closing ? "Closing consultation..." : "Close Consultation"}</button>}
    </div>
  </DoctorLayout>;
}
