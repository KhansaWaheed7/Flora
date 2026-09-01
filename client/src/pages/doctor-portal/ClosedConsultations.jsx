import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getClosedConsultations } from "../../services/doctorPortal.service";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ClosedConsultations() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getClosedConsultations();
        setChats(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load closed consultations");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...chats];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.patient?.fullName?.toLowerCase().includes(q));
    }

    if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.closedAt || b.updatedAt) - new Date(a.closedAt || a.updatedAt));
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.patient?.fullName || "").localeCompare(b.patient?.fullName || ""));
    }

    return list;
  }, [chats, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DoctorLayout title="Closed Consultations" subtitle="View your past consultations." showSearch={false}>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="flex flex-col gap-3 border-b border-[#F0DCE4] p-5 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-[#F0DCE4] bg-white px-4 py-2.5 text-sm text-[#3D3939] placeholder:text-[#B8B4B4] focus:border-[#F33B7D] focus:outline-none focus:ring-1 focus:ring-[#F33B7D] sm:max-w-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm text-[#3D3939] focus:border-[#F33B7D] focus:outline-none"
          >
            <option value="recent">Sort by: Recently Closed</option>
            <option value="name">Sort by: Name</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-[#8F8C8C]">Loading closed consultations...</p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-[#8F8C8C]">No closed consultations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0DCE4]">
            {pageItems.map((c) => (
              <div key={c._id} className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-sm font-bold text-white">
                    {c.patient?.fullName?.charAt(0) || "P"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0D0D0D]">{c.patient?.fullName || "Unknown"}</p>
                    <p className="text-xs text-[#8F8C8C]">
                      Consultation closed · {formatDate(c.closedAt)}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/doctor/messages/${c._id}`}
                  className="flex-shrink-0 rounded-lg bg-[#FEE4EB] px-4 py-2 text-xs font-semibold text-[#F33B7D] hover:bg-[#F9CBDA] transition-colors"
                >
                  View Chat
                </Link>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#F0DCE4] px-5 py-4">
            <p className="text-xs text-[#8F8C8C]">
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} results
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg p-1.5 text-[#8F8C8C] hover:bg-[#FEE4EB] disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-7 w-7 rounded-lg text-xs font-medium ${
                    page === n ? "bg-[#F33B7D] text-white" : "text-[#4A4A4A] hover:bg-[#FEE4EB]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg p-1.5 text-[#8F8C8C] hover:bg-[#FEE4EB] disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
