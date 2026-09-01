import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DoctorLayout from "../../layouts/DoctorLayout";
import { getConversations, getDoctorDashboard } from "../../services/doctorPortal.service";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d`;
}

function Donut({ value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 100;
  return (
    <div
      className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#F33B7D ${pct * 3.6}deg, #FEE4EB 0deg)`,
      }}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
        <span className="text-xl font-bold text-[#0D0D0D]">{value}</span>
        <span className="text-[10px] text-[#8F8C8C]">Active</span>
      </div>
    </div>
  );
}

export default function ActivePatients() {
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [convos, dashboard] = await Promise.all([
          getConversations(),
          getDoctorDashboard(),
        ]);
        setConversations(convos.filter((c) => c.status === "active"));
        setStats(dashboard);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load active patients");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const patients = useMemo(() => {
    let list = [...conversations];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.otherParticipant?.fullName?.toLowerCase().includes(q));
    }

    if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.lastMessageAt || b.updatedAt) - new Date(a.lastMessageAt || a.updatedAt));
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.otherParticipant?.fullName || "").localeCompare(b.otherParticipant?.fullName || ""));
    } else if (sortBy === "unread") {
      list.sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));
    }

    return list;
  }, [conversations, search, sortBy]);

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <DoctorLayout title="Active Patients" subtitle="Continue your ongoing consultations." showSearch={false}>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Patients list */}
        <div className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
          <div className="flex flex-col gap-3 border-b border-[#F0DCE4] p-5 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#F0DCE4] bg-white px-4 py-2.5 text-sm text-[#3D3939] placeholder:text-[#B8B4B4] focus:border-[#F33B7D] focus:outline-none focus:ring-1 focus:ring-[#F33B7D] sm:max-w-xs"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-[#F0DCE4] bg-white px-3 py-2.5 text-sm text-[#3D3939] focus:border-[#F33B7D] focus:outline-none"
            >
              <option value="recent">Sort by: Recent</option>
              <option value="name">Sort by: Name</option>
              <option value="unread">Sort by: Unread</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-sm text-[#8F8C8C]">Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="flex justify-center py-12">
              <p className="text-sm text-[#8F8C8C]">No active patients yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0DCE4]">
              {patients.map((c) => (
                <Link
                  key={c._id}
                  to={`/doctor/messages/${c._id}`}
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-[#FEF4F4]"
                >
                  <div className="relative h-11 w-11 flex-shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F33B7D] text-sm font-bold text-white">
                      {c.otherParticipant?.fullName?.charAt(0) || "P"}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-[#0D0D0D]">
                        {c.otherParticipant?.fullName || "Unknown"}
                      </p>
                      <span className="flex-shrink-0 text-[11px] text-[#B8B4B4]">
                        {timeAgo(c.lastMessage?.createdAt || c.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-[#8F8C8C]">
                      {c.lastMessage?.message || "No messages yet"}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-[10px] font-bold text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-4 text-left text-sm font-semibold text-[#0D0D0D]">Patient Overview</h2>
            <Donut value={stats?.activePatients ?? 0} total={stats?.activePatients ?? 0} />
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h2 className="mb-3 text-sm font-semibold text-[#0D0D0D]">Today's Stats</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Messages</span>
                <span className="font-semibold text-[#0D0D0D]">{stats?.todaysMessages ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">New Messages</span>
                <span className="font-semibold text-[#0D0D0D]">{totalUnread}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Avg. Response Time</span>
                <span className="text-[#B8B4B4]">—</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F8C8C]">Appointments Today</span>
                <span className="text-[#B8B4B4]">—</span>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-[#B8B4B4]">
              Response time and appointments will populate once scheduling is live.
            </p>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
