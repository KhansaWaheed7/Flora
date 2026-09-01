import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { getDoctors, approveDoctor, rejectDoctor, getPendingDoctors } from "../../services/admin.service";
import { CheckCircle, XCircle, ArrowLeft, Mail, Stethoscope } from "lucide-react";

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        // Try to get from pending doctors first (most likely to be there)
        const res = await getPendingDoctors();
        const found = res.data?.doctors?.find(d => d._id === id);
        
        if (found) {
          setDoctor(found);
        } else {
          // If not in pending, try all doctors
          const allRes = await getDoctors({ page: 1, limit: 100 });
          const foundInAll = allRes.data?.doctors?.find(d => d._id === id);
          if (!foundInAll) throw new Error("Doctor not found");
          setDoctor(foundInAll);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveDoctor(id);
      navigate("/admin/doctor-approval");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve doctor");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject this doctor?")) return;
    
    try {
      setActionLoading(true);
      await rejectDoctor(id);
      navigate("/admin/doctor-approval");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reject doctor");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Doctor Details" subtitle="Review doctor application">
        <div className="flex justify-center py-12">
          <p className="text-sm text-[#8F8C8C]">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!doctor) {
    return (
      <AdminLayout title="Doctor Details" subtitle="Review doctor application">
        <div className="text-center py-12">
          <p className="text-sm text-red-600">Doctor not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={doctor.fullName} subtitle="Review and make approval decision">
      <button
        onClick={() => navigate("/admin/doctor-approval")}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F33B7D] hover:text-[#d92b6b]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Approvals
      </button>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-[#F33B7D] flex items-center justify-center text-white text-xl font-bold">
              {doctor.fullName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0D0D0D]">{doctor.fullName}</h2>
              <p className="text-sm text-[#8F8C8C]">{doctor.specialization}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-[#F0DCE4] pb-4">
              <h3 className="text-sm font-semibold text-[#0D0D0D] mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#3D3939]">
                  <Mail className="h-4 w-4 text-[#8F8C8C]" />
                  {doctor.email}
                </div>
                {doctor.phone && (
                  <div className="text-sm text-[#3D3939]">
                    Phone: {doctor.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="border-b border-[#F0DCE4] pb-4">
              <h3 className="text-sm font-semibold text-[#0D0D0D] mb-3">Professional Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8F8C8C]">Specialization:</span>
                  <span className="text-[#0D0D0D] font-medium">{doctor.specialization}</span>
                </div>
                {doctor.hospital && (
                  <div className="flex justify-between">
                    <span className="text-[#8F8C8C]">Hospital/Clinic:</span>
                    <span className="text-[#0D0D0D] font-medium">{doctor.hospital}</span>
                  </div>
                )}
                {doctor.licenseNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#8F8C8C]">License Number:</span>
                    <span className="text-[#0D0D0D] font-medium">{doctor.licenseNumber}</span>
                  </div>
                )}
                {doctor.yearsOfExperience && (
                  <div className="flex justify-between">
                    <span className="text-[#8F8C8C]">Years of Experience:</span>
                    <span className="text-[#0D0D0D] font-medium">{doctor.yearsOfExperience}</span>
                  </div>
                )}
              </div>
            </div>

            {doctor.bio && (
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D] mb-2">Bio</h3>
                <p className="text-sm text-[#3D3939]">{doctor.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 h-fit">
          <h3 className="text-sm font-semibold text-[#0D0D0D] mb-4">Approval Decision</h3>
          
          <div className="space-y-3">
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#22C55E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#16a34a] disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              {actionLoading ? "Processing..." : "Approve"}
            </button>

            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              <XCircle className="h-4 w-4" />
              {actionLoading ? "Processing..." : "Reject"}
            </button>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#FEF4F4] text-xs text-[#3D3939]">
            <p className="font-semibold mb-1">Review checklist:</p>
            <ul className="space-y-1 text-[#8F8C8C]">
              <li>✓ Verify credentials</li>
              <li>✓ Check specialization</li>
              <li>✓ Review experience</li>
              <li>✓ Validate license</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}