import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";

function Avatar({ name, image }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
      />
    );
  }
  const initials = (name || "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

export default function ConsultationRequestConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chat, doctor } = location.state || {};

  if (!doctor) {
    return (
      <PageLayout title="Request Sent" subtitle="">
        <div className="mx-auto max-w-md rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          No request data found.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Consultation Request" subtitle="">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-[#0D0D0D]">
            Request Sent!
          </h2>
          <p className="mt-2 text-sm text-[#8F8C8C]">
            Your consultation request has been sent successfully. The doctor
            will review your request and respond shortly.
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#FEF4F4] p-4 text-left">
            <Avatar name={doctor.fullName} image={doctor.profilePicture} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0D0D0D]">
                Dr. {doctor.fullName}
              </p>
              <p className="truncate text-xs text-[#8F8C8C]">
                {doctor.specialization || "General Physician"}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
              <Clock className="h-3 w-3" /> Pending
            </span>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 rounded-full border border-[#F0DCE4] bg-white px-4 py-3 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/chat/my-consultations")}
              className="flex-1 rounded-full bg-[#F33B7D] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5"
            >
              View My Consultations
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
