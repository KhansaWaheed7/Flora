import api from "../api/axios";

/*
Dashboard stats
Real shape from backend: { totalPatients, totalDoctors, pendingDoctors, suspendedAccounts }
*/
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

/*
Doctors
*/
export const getPendingDoctors = async () => {
  const response = await api.get("/admin/doctors/pending");
  return response.data;
};

export const getDoctors = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const response = await api.get("/admin/doctors", {
    params: { page, limit, search },
  });
  return response.data;
};

export const approveDoctor = async (id) => {
  const response = await api.put(`/admin/doctors/${id}/approve`);
  return response.data;
};

export const rejectDoctor = async (id) => {
  const response = await api.put(`/admin/doctors/${id}/reject`);
  return response.data;
};

export const updateDoctorStatus = async (id, status) => {
  const response = await api.patch(`/admin/doctors/${id}/status`, { status });
  return response.data;
};

/*
Patients (Users Management)
*/
export const getPatients = async ({ page = 1, limit = 10, search = "" } = {}) => {
  const response = await api.get("/admin/patients", {
    params: { page, limit, search },
  });
  return response.data;
};

export const updatePatientStatus = async (patientId, status) => {
  const response = await api.patch(`/admin/patients/${patientId}/status`, {
    status,
  });
  return response.data;
};

/*
Audit logs
*/
export const getAuditLogs = async ({ page = 1, limit = 20 } = {}) => {
  const response = await api.get("/admin/audit-logs", {
    params: { page, limit },
  });
  return response.data;
};
