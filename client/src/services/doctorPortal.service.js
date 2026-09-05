import api from "../api/axios";

/*
GET /doctor/dashboard
Returns: { pendingRequests, activePatients, activeChats, recentPatients }
*/
export const getDoctorDashboard = async () => {
  const response = await api.get("/doctor/dashboard");
  return response.data.data;
};

/*
GET /doctor/requests
Returns: array of pending Chat docs, populated with patient
*/
export const getPendingRequests = async () => {
  const response = await api.get("/doctor/requests");
  return response.data.data;
};

/*
GET /doctor/patients
Returns: array of active Chat docs, populated with patient
*/
export const getAssignedPatients = async () => {
  const response = await api.get("/doctor/patients");
  return response.data.data;
};

/*
PUT /doctor/chat/:id/accept
*/
export const acceptConsultation = async (chatId) => {
  const response = await api.put(`/doctor/chat/${chatId}/accept`);
  return response.data.data;
};

/*
PUT /doctor/chat/:id/reject
*/
export const rejectConsultation = async (chatId) => {
  const response = await api.put(`/doctor/chat/${chatId}/reject`);
  return response.data.data;
};

/*
GET /doctor/closed
Returns: array of closed Chat docs, populated with patient
*/
export const getClosedConsultations = async () => {
  const response = await api.get("/doctor/closed");
  return response.data.data;
};

/*
PUT /doctor/chat/:id/close
*/
export const closeConsultation = async (chatId) => {
  const response = await api.put(`/doctor/chat/${chatId}/close`);
  return response.data.data;
};

/*
GET /chat/conversations
Shared endpoint (also used by patients) - returns active/pending
conversations for whoever is logged in, each with otherParticipant,
lastMessage, unreadCount.
*/
export const getConversations = async () => {
  const response = await api.get("/chat/conversations");
  return response.data.data;
};


export const getDoctorProfile = async () => {
  const response = await api.get("/doctor/profile");
  return response.data;
};

export const updateDoctorProfile = async (data) => {
  const response = await api.patch("/doctor/profile", data);
  return response.data;
};