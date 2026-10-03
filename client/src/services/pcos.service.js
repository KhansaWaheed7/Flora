import api from "../api/axios";


export const submitAssessment = async (answers) => {
  const response = await api.post("/pcos", answers);
  return response.data.message?.assessment;
};

export const getLatestAssessment = async () => {
  const response = await api.get("/pcos");
  return response.data.message?.assessment;
};


export const getAssessmentHistory = async () => {
  const response = await api.get("/pcos/history");
  return response.data.message?.history || [];
};

export const getDashboard = async () => {
  const response = await api.get("/pcos/dashboard");
  return response.data.message;
};


export const deleteAssessment = async (id) => {
  const response = await api.delete(`/pcos/${id}`);
  return response.data;
};
