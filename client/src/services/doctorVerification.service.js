import api from "../api/axios";


export const getDoctorVerification = async () => {
  const response = await api.get("/doctor-verification");

  return response.data?.data || response.data;
};

export const uploadDoctorDocument = async (
  file,
  documentType
) => {
  const formData = new FormData();

  formData.append("document", file);
  formData.append("documentType", documentType);

  const response = await api.post(
    "/doctor-verification/documents",
    formData
  );

  return response.data?.data || response.data;
};