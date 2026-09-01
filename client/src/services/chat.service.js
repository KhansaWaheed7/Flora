import api from "../api/axios";

/*
GET /chat/doctors - list of available (approved, verified) doctors
*/
export const getAvailableDoctors = async () => {
  const response = await api.get("/chat/doctors");
  return response.data.data;
};

/*
GET /chat/conversations - active/pending conversations for current user
*/
export const getConversations = async () => {
  const response = await api.get("/chat/conversations");
  return response.data.data;
};

/*
POST /chat/request - send a consultation request to a doctor
Body: { doctorId }
*/
export const requestConsultation = async (doctorId, reason = "") => {
  const response = await api.post("/chat/request", { doctorId, reason });
  return response.data.data;
};

/*
GET /chat/my-requests - patient's full consultation history
(includes pending, active, closed, rejected)
*/
export const getMyRequests = async () => {
  const response = await api.get("/chat/my-requests");
  return response.data.data;
};

/*
GET /messages/:chatId - confirmed real route (message.routes.js),
mounted separately from /chat. Returns full message history for a
chat, sorted oldest -> newest.
*/
export const getChatMessages = async (chatId) => {
  const response = await api.get(`/messages/${chatId}`);
  return response.data.data;
};

/*
POST /messages/:chatId - send a text message (chat must be "active")
Body: { message }
*/
export const sendChatMessage = async (chatId, message) => {
  const response = await api.post(`/messages/${chatId}`, { message });
  return response.data.data;
};
