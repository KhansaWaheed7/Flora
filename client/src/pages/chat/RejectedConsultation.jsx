import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getMyRequests } from "../../services/chat.service";

export default function RejectedConsultation() {
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
      <PageLayout title="Rejected Consultation" backTo="/chat/my-consultations">
        <p className="text-sm text-[#8F8C8C]">Loading...</p>
      </PageLayout>
    );
  }

  if (error || !consultation) {
    return (
      <PageLayout title="Rejected Consultation" backTo="/chat/my-consultations">
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Consultation not found."}
        </div>
      </PageLayout>
    );
  }

  const doctor = consultation.doctor;

  return (
    <PageLayout title="Rejected Consultation" backTo="/chat/my-consultations">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-[#0D0D0D]">
            Your consultation request was declined
          </h2>
          <p className="mt-2 text-sm text-[#8F8C8C]">
            {doctor ? `Dr. ${doctor.fullName}` : "This doctor"} was unable to
            accept your request at this time. This can happen for a variety
            of reasons and isn't a reflection of your health needs.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/chat/my-consultations")}
              className="flex-1 rounded-full border border-[#F0DCE4] bg-white px-4 py-3 text-sm font-semibold text-[#3D3939] transition hover:bg-[#FEF4F4]"
            >
              Back to Consultations
            </button>
            <button
              onClick={() => navigate("/chat/doctors")}
              className="flex-1 rounded-full bg-[#F33B7D] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-6px_rgba(243,59,125,0.5)] transition hover:-translate-y-0.5"
            >
              Find Another Doctor
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
