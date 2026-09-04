import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  getPendingDoctors, 
  approveDoctor, 
  rejectDoctor 
} from "../../services/admin.service";
import { Mail, Stethoscope, Eye, Check, X, Clock } from "lucide-react";

export default function DoctorApproval() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await getPendingDoctors();
      setDoctors(res.data?.doctors || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load pending doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (doctorId) => {
    if (!window.confirm("Are you sure you want to approve this doctor?")) return;

    try {
      setActionLoading(prev => ({ ...prev, [doctorId]: "approve" }));
      await approveDoctor(doctorId);
      // Remove from list or update status
      setDoctors(doctors.filter(d => d._id !== doctorId));
      alert("✅ Doctor approved successfully! An email notification has been sent.");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve doctor");
    } finally {
      setActionLoading(prev => ({ ...prev, [doctorId]: null }));
    }
  };

  const handleReject = async (doctorId) => {
    const reason = prompt("Please enter the reason for rejection:");
    if (reason === null) return; // User cancelled
    if (!reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [doctorId]: "reject" }));
      await rejectDoctor(doctorId, reason);
      setDoctors(doctors.filter(d => d._id !== doctorId));
      alert("❌ Doctor rejected. An email notification has been sent.");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject doctor");
    } finally {
      setActionLoading(prev => ({ ...prev, [doctorId]: null }));
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Doctor Approval" subtitle="Review and approve pending doctor applications">
        <div className="flex justify-center py-12">
          <p className="text-sm text-[#8F8C8C]">Loading pending applications...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Doctor Approval" subtitle="Review and approve pending doctor applications">
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden">
        {doctors.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-[#8F8C8C]">No pending doctor applications</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0DCE4]">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="p-5 hover:bg-[#FEF4F4] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-full bg-[#F33B7D] flex items-center justify-center text-white font-bold">
                        {doctor.fullName?.charAt(0) || "D"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0D0D0D]">{doctor.fullName}</p>
                        <p className="text-xs text-[#8F8C8C]">{doctor.specialization || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-[#3D3939]">
                        <Mail className="h-4 w-4 text-[#8F8C8C]" />
                        {doctor.email}
                      </div>
                      {doctor.hospital && (
                        <div className="flex items-center gap-2 text-[#3D3939]">
                          <Stethoscope className="h-4 w-4 text-[#8F8C8C]" />
                          {doctor.hospital}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-[#8F8C8C]">
                        <Clock className="h-3 w-3" />
                        Applied: {new Date(doctor.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/admin/doctor-details/${doctor._id}`}
                      className="flex items-center gap-2 rounded-lg bg-[#8F8C8C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#6B6B6B] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleApprove(doctor._id)}
                      disabled={actionLoading[doctor._id] === "approve"}
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      {actionLoading[doctor._id] === "approve" ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(doctor._id)}
                      disabled={actionLoading[doctor._id] === "reject"}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      {actionLoading[doctor._id] === "reject" ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}