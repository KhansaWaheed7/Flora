import { useEffect, useMemo, useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import {
  getPendingRequests,
  acceptConsultation,
  rejectConsultation,
} from "../../services/doctorPortal.service";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ConsultationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [tab, setTab] = useState("all"); // all | new | reviewed
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load consultation requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (chatId, action) => {
    try {
      setActioningId(chatId);
      if (action === "approve") {
        await acceptConsultation(chatId);
      } else {
        await rejectConsultation(chatId);
      }
      setRequests((prev) => prev.filter((r) => r._id !== chatId));
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${action} request`);
    } finally {
      setActioningId(null);
    }
  };

  // "New" = requested in the last 24h, "Reviewed" = older pending
  // requests that have been sitting for a while. There's no separate
  // "viewed" flag in the backend yet, so this is an age-based split.
  const { newCount, reviewedCount } = useMemo(() => {
    const now = Date.now();
    let newCount = 0;
    let reviewedCount = 0;
    requests.forEach((r) => {
      if (now - new Date(r.createdAt).getTime() < ONE_DAY_MS) newCount++;
      else reviewedCount++;
    });
    return { newCount, reviewedCount };
  }, [requests]);

  const filtered = useMemo(() => {
    const now = Date.now();
    let list = requests;

    if (tab === "new") {
      list = list.filter((r) => now - new Date(r.createdAt).getTime() < ONE_DAY_MS);
    } else if (tab === "reviewed") {
      list = list.filter((r) => now - new Date(r.createdAt).getTime() >= ONE_DAY_MS);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.patient?.fullName?.toLowerCase().includes(q));
    }

    return list;
  }, [requests, tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs = [
    { key: "all", label: "All Requests", count: requests.length },
    { key: "new", label: "New", count: newCount },
    { key: "reviewed", label: "Reviewed", count: reviewedCount },
  ];

  return (
    <DoctorLayout
      title="Consultation Requests"
      subtitle="Review and manage patient consultation requests."
      showSearch={false}
    >
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[#F0DCE4] px-5 pt-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border-b-2 border-[#F33B7D] text-[#F33B7D]"
                  : "text-[#8F8C8C] hover:text-[#4A4A4A]"
              }`}
            >
              {t.label} {t.count}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-[#F0DCE4] bg-white px-4 py-2.5 text-sm text-[#3D3939] placeholder:text-[#B8B4B4] focus:border-[#F33B7D] focus:outline-none focus:ring-1 focus:ring-[#F33B7D] sm:max-w-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-[#8F8C8C]">Loading requests...</p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-[#8F8C8C]">No consultation requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F0DCE4] text-xs font-medium text-[#8F8C8C]">
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Age</th>
                  <th className="px-5 py-3">Requested On</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0DCE4]">
                {pageItems.map((r) => (
                  <tr key={r._id} className="hover:bg-[#FEF4F4]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-xs font-bold text-white">
                          {r.patient?.fullName?.charAt(0) || "P"}
                        </div>
                        <span className="font-medium text-[#0D0D0D]">{r.patient?.fullName || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#3D3939]">{r.patient?.age ?? "—"}</td>
                    <td className="px-5 py-4 text-[#3D3939]">{formatDate(r.createdAt)}</td>
                    <td className="px-5 py-4 text-[#3D3939]">{r.reason || "Not specified"}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={actioningId === r._id}
                          onClick={() => handleAction(r._id, "approve")}
                          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-200 hover:bg-green-100 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={actioningId === r._id}
                          onClick={() => handleAction(r._id, "reject")}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-100 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
