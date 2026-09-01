import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getPatients, updatePatientStatus } from "../../services/admin.service";
import { Search, Shield, ChevronLeft, ChevronRight } from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [suspendingId, setSuspendingId] = useState(null);

  const fetchUsers = async (searchTerm = "", pageNum = 1) => {
    try {
      setLoading(true);
      const res = await getPatients({ page: pageNum, limit: 10, search: searchTerm });
      setUsers(res.data?.patients || []);
      setPagination(res.data?.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(search, page);
  }, [page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    fetchUsers(e.target.value, 1);
  };

  const handleSuspend = async (userId) => {
    const newStatus = "suspended";
    try {
      setSuspendingId(userId);
      await updatePatientStatus(userId, newStatus);
      fetchUsers(search, page);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user status");
    } finally {
      setSuspendingId(null);
    }
  };

  const handleActivate = async (userId) => {
    const newStatus = "active";
    try {
      setSuspendingId(userId);
      await updatePatientStatus(userId, newStatus);
      fetchUsers(search, page);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user status");
    } finally {
      setSuspendingId(null);
    }
  };

  return (
    <AdminLayout title="Users Management" subtitle="View, search and manage patient accounts">
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
        <input
          type="text"
          placeholder="Search by name, email..."
          value={search}
          onChange={handleSearch}
          className="w-full rounded-xl border border-[#F0DCE4] bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
        />
      </div>

      <div className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-[#8F8C8C]">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-sm text-[#8F8C8C]">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0DCE4]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D0D0D]">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D0D0D]">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D0D0D]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D0D0D]">Joined</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-[#0D0D0D]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-[#F0DCE4] hover:bg-[#FEF4F4] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#F33B7D] flex items-center justify-center text-white font-semibold text-sm">
                            {user.fullName?.charAt(0) || "U"}
                          </div>
                          <p className="text-sm font-medium text-[#0D0D0D]">{user.fullName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#3D3939]">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            user.accountStatus === "active"
                              ? "bg-[#22C55E]/10 text-[#22C55E]"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {user.accountStatus === "active" ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8F8C8C]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.accountStatus === "active" ? (
                          <button
                            onClick={() => handleSuspend(user._id)}
                            disabled={suspendingId === user._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                          >
                            <Shield className="h-3 w-3" />
                            {suspendingId === user._id ? "..." : "Suspend"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user._id)}
                            disabled={suspendingId === user._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#22C55E] px-3 py-1 text-xs font-semibold text-white hover:bg-[#16a34a] disabled:opacity-50 transition-colors"
                          >
                            {suspendingId === user._id ? "..." : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="border-t border-[#F0DCE4] px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-[#8F8C8C]">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="flex items-center gap-1 rounded-lg border border-[#F0DCE4] px-3 py-2 text-xs font-semibold text-[#3D3939] hover:bg-[#FEF4F4] disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="flex items-center gap-1 rounded-lg border border-[#F0DCE4] px-3 py-2 text-xs font-semibold text-[#3D3939] hover:bg-[#FEF4F4] disabled:opacity-50 transition-colors"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
