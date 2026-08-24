import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, MessageSquareText } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getMyRequests } from "../../services/chat.service";

function Avatar({ name, image }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
      />
    );
  }
  const initials = (name || "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-lg font-semibold text-white">
      {initials}
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ConsultationClosed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getMyRequests();
        const found = list.find((c) => c._id === id);
        if (!found) {
          setError("Consultation not found.");
        } else {
          setConsultation(found);
        }
      } catch (err) {
        setError("Could not load this consultation.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <PageLayout title="Consultation Closed" backTo="/chat/my-consultations">
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error || !consultation) {
    return (
      <PageLayout title="Consultation Closed" backTo="/chat/my-consultations">
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Consultation not found."}
        </div>
      </PageLayout>
    );
  }

  const doctor = consultation.doctor;

  return (
    <PageLayout title="Consultation Closed" backTo="/chat/my-consultations">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5EAEF]">
            <CheckCircle2 className="h-8 w-8 text-[#8F8C8C]" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-[#0D0D0D]">
            Consultation Closed
          </h2>
          <p className="mt-2 text-sm text-[#8F8C8C]">
            This consultation has ended. You can still view your chat
            history below, but no new messages can be sent.
          </p>

          <div className="mt-6 flex flex-col items-center gap-2 rounded-xl bg-[#FEF4F4] p-4">
            <Avatar name={doctor?.fullName} image={doctor?.profilePicture} />
            <p className="text-sm font-semibold text-[#0D0D0D]">
              Dr. {doctor?.fullName}
            </p>
            <p className="text-xs text-[#8F8C8C]">
              Closed on {formatDateTime(consultation.closedAt)}
            </p>
          </div>

          <button
            onClick={() => navigate(`/chat/${id}`)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#F33B7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5"
          >
            <MessageSquareText className="h-4 w-4" /> View Chat History
          </button>
          <button
            onClick={() => navigate("/chat/my-consultations")}
            className="mt-3 w-full rounded-full border border-[#F0DCE4] bg-white px-6 py-3 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
          >
            Back to Consultations
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
