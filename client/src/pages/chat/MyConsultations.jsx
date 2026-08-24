import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MessageCircle, XCircle, CheckCircle2 } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { getMyRequests } from "../../services/chat.service";

function Avatar({ name, image }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
      />
    );
  }
  const initials = (name || "Dr")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

const statusMeta = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    path: (id) => `/chat/${id}/pending`,
  },
  active: {
    label: "Active",
    icon: MessageCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    path: (id) => `/chat/${id}`,
  },
  rejected: {
    label: "Declined",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    path: (id) => `/chat/${id}/rejected`,
  },
  closed: {
    label: "Closed",
    icon: CheckCircle2,
    color: "text-[#8F8C8C]",
    bg: "bg-[#F5EAEF]",
    path: (id) => `/chat/${id}/closed`,
  },
};

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

export default function MyConsultations() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getMyRequests();
        setConsultations(list || []);
      } catch (err) {
        setError("Could not load your consultations.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    filter === "all"
      ? consultations
      : consultations.filter((c) => c.status === filter);

  return (
    <PageLayout
      title="My Consultations"
      subtitle="View and manage your doctor consultations."
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex flex-wrap gap-2">
          {["all", "pending", "active", "closed", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f
                  ? "bg-[#F33B7D] text-white"
                  : "bg-white text-[#8F8C8C] ring-1 ring-black/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-[#8F8C8C]">Loading...</p>}
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <p className="text-sm text-[#8F8C8C]">No consultations yet.</p>
            <button
              onClick={() => navigate("/chat/doctors")}
              className="mt-4 rounded-full bg-[#F33B7D] px-6 py-2.5 text-sm font-semibold text-white"
            >
              Find a Doctor
            </button>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((c) => {
            const meta = statusMeta[c.status] || statusMeta.pending;
            const Icon = meta.icon;
            return (
              <button
                key={c._id}
                onClick={() => navigate(meta.path(c._id))}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(243,59,125,0.1)]"
              >
                <Avatar name={c.doctor?.fullName} image={c.doctor?.profilePicture} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0D0D0D]">
                    Dr. {c.doctor?.fullName}
                  </p>
                  <p className="truncate text-xs text-[#8F8C8C]">
                    {c.doctor?.specialization || "General Physician"}
                  </p>
                  <p className="text-[10px] text-[#B8AEB2]">
                    {formatDateTime(c.createdAt)}
                  </p>
                </div>
                <span
                  className={`flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${meta.bg} ${meta.color}`}
                >
                  <Icon className="h-3 w-3" /> {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
