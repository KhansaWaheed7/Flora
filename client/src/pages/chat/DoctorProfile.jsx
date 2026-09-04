import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Building2, Briefcase, MessageCircle } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import {
  getAvailableDoctors,
  requestConsultation,
} from "../../services/chat.service";

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
    if (doctor) return;
    const load = async () => {
      try {
        const list = await getAvailableDoctors();
        const found = list.find((d) => d._id === id);
        if (!found) {
          setError("Doctor not found.");
        } else {
          setDoctor(found);
        }
      } catch (err) {
        setError("Could not load this doctor.");
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
      const chat = await requestConsultation(doctor._id, reason.trim());

      navigate("/chat/request-sent", {
        state: { chat, doctor },
      });
    } catch (err) {
      setRequestError(
        err?.response?.data?.message ||
          "Could not send consultation request. Try again."
      );
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Doctor Profile" backTo="/chat/doctors">
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error || !doctor) {
    return (
      <PageLayout title="Doctor Profile" backTo="/chat/doctors">
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Doctor not found."}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Doctor Profile" backTo="/chat/doctors">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl bg-white p-6 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mx-auto">
            <Avatar name={doctor.fullName} image={doctor.profilePicture} />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-[#0D0D0D]">
            Dr. {doctor.fullName}
          </h2>
          <p className="mt-1 text-sm text-[#F33B7D]">
            {doctor.specialization || "General Physician"}
          </p>

          <div className="mt-5 space-y-2 border-t border-[#F7DCE4] pt-5 text-left">
            {doctor.hospital && (
              <p className="flex items-center gap-2 text-sm text-[#3D3939]">
                <Building2 className="h-4 w-4 text-[#8F8C8C]" />{" "}
                {doctor.hospital}
              </p>
            )}
            {doctor.yearsOfExperience !== undefined && (
              <p className="flex items-center gap-2 text-sm text-[#3D3939]">
                <Briefcase className="h-4 w-4 text-[#8F8C8C]" />{" "}
                {doctor.yearsOfExperience} years of experience
              </p>
            )}
          </div>

          <div className="mt-5 text-left">
            <label
              htmlFor="reason"
              className="mb-2 block text-sm font-semibold text-[#3D3939]"
            >
              Reason for consultation
            </label>

            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Briefly describe why you would like to consult this doctor..."
              className="w-full resize-none rounded-xl border border-[#F0DCE4] bg-white px-4 py-3 text-sm text-[#3D3939] outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
            />

            <div className="mt-1 text-right text-[10px] text-[#B8AEB2]">
              {reason.length}/500
            </div>
          </div>

          {requestError && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {requestError}
            </div>
          )}

          <button
            onClick={handleRequest}
            disabled={requesting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            <MessageCircle className="h-4 w-4" />
            {requesting ? "Sending Request..." : "Request Consultation"}
          </button>
        </div>
      </div>
    </PageLayout>
  );
}