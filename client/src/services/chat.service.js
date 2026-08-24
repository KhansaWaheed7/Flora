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
export const requestConsultation = async (doctorId) => {
  const response = await api.post("/chat/request", { doctorId });
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
NOTE: no confirmed REST endpoint exists for fetching a chat's message
history (only real-time send/receive via socket events were shared:
join-chat, send-message, new-message). This guesses a conventional
path - if it 404s, message history simply won't preload and the chat
will still work for new real-time messages. Share the actual route
if one exists and this will be corrected.
*/
export const getChatMessages = async (chatId) => {
  const response = await api.get(`/chat/${chatId}/messages`);
  return response.data.data;
};
