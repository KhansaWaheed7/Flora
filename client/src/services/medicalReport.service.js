import api from "../api/axios";

export const getMedicalReports = async (page = 1, limit = 6) => {
  const response = await api.get("/medical-reports", {
    params: { page, limit },
  });

  return response.data;
};

export const getMedicalReport = async (reportId) => {
  const response = await api.get(`/medical-reports/${reportId}`);

  return response.data;
};

export const getReportStatus = async (reportId) => {
  const response = await api.get(
    `/medical-reports/${reportId}/status`
  );

  return response.data;
};

export const uploadMedicalReport = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("uploadedFrom", "web");

  const response = await api.post(
    "/medical-reports/upload",
    formData
  );

  return response.data;
};

export const downloadMedicalReport = async (reportId) => {
  const response = await api.get(
    `/medical-reports/${reportId}/download`,
    {
      responseType: "blob",
    }
  );

  return response;
};

export const deleteMedicalReport = async (reportId) => {
  const response = await api.delete(
    `/medical-reports/${reportId}`
  );

  return response.data;
};