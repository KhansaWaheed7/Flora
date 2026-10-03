import api from "../api/axios";


export const getDoctorDashboard = async () => {
  const response = await api.get("/doctor/dashboard");
  return response.data.data;
};

export const getPendingRequests = async () => {
  const response = await api.get("/doctor/requests");
  return response.data.data;
};


export const getAssignedPatients = async () => {
  const response = await api.get("/doctor/patients");
  return response.data.data;
};


export const acceptConsultation = async (chatId) => {
  const response = await api.put(`/doctor/chat/${chatId}/accept`);
  return response.data.data;
};


export const rejectConsultation = async (chatId) => {
  const response = await api.put(`/doctor/chat/${chatId}/reject`);
  return response.data.data;
};


export const getClosedConsultations = async () => {
  const response = await api.get("/doctor/closed");
  return response.data.data;
};


export const closeConsultation = async (chatId) => {
  const response = await api.put(`/doctor/chat/${chatId}/close`);
  return response.data.data;
};


export const getConversations = async () => {
  const response = await api.get("/chat/conversations");
  return response.data.data;
};


export const getDoctorProfile = async () => {
  const response = await api.get("/doctor/profile");
  return response.data.data;
};

export const updateDoctorProfile = async (data) => {
  const response = await api.patch("/doctor/profile", data);
  return response.data.data;
};


// Doctor Profile Picture

export const uploadDoctorAvatar = async (formData) => {
  const response = await api.post(
    "/doctor/profile/avatar",
    formData
  );

  return response.data;
};

export const removeDoctorAvatar = async () => {
  const response = await api.delete(
    "/doctor/profile/avatar"
  );

  return response.data;
};
export const getPatientProfileForConsultation = async (chatId) => {
  const response = await api.get(`/doctor/chat/${chatId}/patient-profile`);
  return response.data.data;
};


export const getDoctorSchedule = async () => {
  const response = await api.get("/doctor/schedule");
  return response.data.data;
};

export const updateDoctorSchedule = async (schedule, scheduleTimezone = "Asia/Karachi") => {
  const response = await api.put("/doctor/schedule", {
    schedule,
    scheduleTimezone,
  });
  return response.data.data;
};
