import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getDoctors,
  updateDoctorStatus,
} from "../../services/admin.service";
import {
  Search,
  Stethoscope,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDoctors = async (searchTerm = "", pageNum = 1) => {
    try {
      setLoading(true);
      setError("");
      const res = await getDoctors({
        page: pageNum,
        limit: 10,
        search: searchTerm,
      });
      setDoctors(res.data?.doctors || []);
      setPagination(res.data?.pagination || null);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load doctors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(search, page);
  }, [page]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    fetchDoctors(value, 1);
  };

  const handleStatusChange = async (doctorId, newStatus) => {
    try {
      setUpdatingId(doctorId);
      setError("");
      await updateDoctorStatus(doctorId, newStatus);
      await fetchDoctors(search, page);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update doctor status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout
      title="Doctor Management"
      subtitle="View and manage verified doctors"
    >
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8C8C]" />
        <input
          type="text"
          placeholder="Search by name, email, specialization..."
          value={search}
          onChange={handleSearch}
          className="w-full rounded-xl border border-[#F0DCE4] bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-[#B8AEB2] focus:border-[#F33B7D]"
        />
      </div>

      {/* Doctors Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F33B7D] border-t-transparent" />
              <p className="text-sm text-[#8F8C8C]">Loading doctors...</p>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE4EB]">
              <Stethoscope className="h-6 w-6 text-[#F33B7D]" />
            </div>
            <p className="text-sm font-semibold text-[#3D3939]">
              No verified doctors found
            </p>
            <p className="mt-1 text-xs text-[#8F8C8C]">
              Try changing your search.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on small screens */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#F0DCE4]">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#0D0D0D]">
                      Doctor
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#0D0D0D]">
                      Email
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#0D0D0D]">
                      Specialization
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#0D0D0D]">
                      Hospital
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#0D0D0D]">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-[#0D0D0D]">
                      Joined
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-[#0D0D0D]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="border-b border-[#F0DCE4] transition-colors hover:bg-[#FEF4F4]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#A855F7] text-sm font-semibold text-white">
                            {doctor.fullName?.charAt(0)?.toUpperCase() || "D"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#0D0D0D] truncate max-w-[120px]">
                              {doctor.fullName || "Unknown Doctor"}
                            </p>
                            <p className="text-xs text-[#8F8C8C]">
                              Verified Doctor
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#3D3939] truncate max-w-[150px]">
                        {doctor.email || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#3D3939] truncate max-w-[120px]">
                        {doctor.specialization || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#3D3939] truncate max-w-[120px]">
                        {doctor.hospital || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-semibold text-[#22C55E]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                            Verified
                          </span>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              doctor.accountStatus === "active"
                                ? "bg-[#22C55E]/10 text-[#22C55E]"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {doctor.accountStatus === "active"
                              ? "Active"
                              : "Suspended"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#8F8C8C] whitespace-nowrap">
                        {doctor.createdAt
                          ? new Date(doctor.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {doctor.accountStatus === "active" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(doctor._id, "suspended")
                            }
                            disabled={updatingId === doctor._id}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                          >
                            <Shield className="h-3 w-3" />
                            {updatingId === doctor._id ? "..." : "Suspend"}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusChange(doctor._id, "active")
                            }
                            disabled={updatingId === doctor._id}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#22C55E] px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#16a34a] disabled:opacity-50"
                          >
                            {updatingId === doctor._id ? "..." : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View - Hidden on large screens */}
            <div className="lg:hidden divide-y divide-[#F0DCE4]">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="p-4 hover:bg-[#FEF4F4] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#A855F7] text-sm font-semibold text-white">
                      {doctor.fullName?.charAt(0)?.toUpperCase() || "D"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-[#0D0D0D] truncate">
                            {doctor.fullName || "Unknown Doctor"}
                          </p>
                          <p className="text-xs text-[#8F8C8C] truncate">
                            {doctor.email || "—"}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-semibold text-[#22C55E]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                              Verified
                            </span>
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                doctor.accountStatus === "active"
                                  ? "bg-[#22C55E]/10 text-[#22C55E]"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {doctor.accountStatus === "active"
                                ? "Active"
                                : "Suspended"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {doctor.accountStatus === "active" ? (
                            <button
                              onClick={() =>
                                handleStatusChange(doctor._id, "suspended")
                              }
                              disabled={updatingId === doctor._id}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                            >
                              <Shield className="h-3 w-3" />
                              {updatingId === doctor._id ? "..." : "Suspend"}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleStatusChange(doctor._id, "active")
                              }
                              disabled={updatingId === doctor._id}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#22C55E] px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#16a34a] disabled:opacity-50"
                            >
                              {updatingId === doctor._id ? "..." : "Activate"}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-[#3D3939]">
                        <div>
                          <span className="text-[#8F8C8C]">Specialization:</span>{" "}
                          {doctor.specialization || "—"}
                        </div>
                        <div>
                          <span className="text-[#8F8C8C]">Hospital:</span>{" "}
                          {doctor.hospital || "—"}
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#8F8C8C]">Joined:</span>{" "}
                          {doctor.createdAt
                            ? new Date(doctor.createdAt).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0DCE4] px-4 sm:px-6 py-4">
                <p className="text-xs text-[#8F8C8C] order-2 sm:order-1">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </p>
                <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 rounded-lg border border-[#F0DCE4] px-3 py-2 text-xs font-semibold text-[#3D3939] transition-colors hover:bg-[#FEF4F4] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 rounded-lg border border-[#F0DCE4] px-3 py-2 text-xs font-semibold text-[#3D3939] transition-colors hover:bg-[#FEF4F4] disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
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