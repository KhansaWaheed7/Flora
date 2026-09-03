import api from "../api/axios";

export const getPendingVerifications = async () => {
  const response = await api.get("/admin/verification/pending");
  return response.data;
};

export const getDoctorVerificationDetails = async (doctorId) => {
  const response = await api.get(`/admin/verification/doctors/${doctorId}`);
  return response.data;
};

export const approveDoctorVerification = async (doctorId) => {
  const response = await api.patch(`/admin/verification/doctors/${doctorId}/approve`);
  return response.data;
};

export const rejectDoctorVerification = async (doctorId, rejectionReason) => {
  const response = await api.patch(`/admin/verification/doctors/${doctorId}/reject`, {
    rejectionReason,
  });
  return response.data;
};

export const deleteDoctorDocument = async (doctorId, documentId) => {
  const response = await api.delete(
    `/admin/verification/doctors/${doctorId}/documents/${documentId}`
  );
  return response.data;
};