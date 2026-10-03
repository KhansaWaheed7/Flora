import api from "../api/axios";


export const getAvailableDoctors = async () => {
  const response = await api.get("/chat/doctors");
  return response.data.data;
};


export const getConversations = async () => {
  const response = await api.get("/chat/conversations");
  return response.data.data;
};


export const requestConsultation = async (doctorId, reason = "") => {
  const response = await api.post("/chat/request", { doctorId, reason });
  return response.data.data;
};


export const getMyRequests = async () => {
  const response = await api.get("/chat/my-requests");
  return response.data.data;
};


export const getChatMessages = async (chatId) => {
  const response = await api.get(`/messages/${chatId}`);
  return response.data.data;
};


export const sendChatMessage = async (chatId, message) => {
  const response = await api.post(`/messages/${chatId}`, { message });
  return response.data.data;
};



export const sendChatAttachment = async (
  chatId,
  file,
  message = ""
) => {
  const formData = new FormData();

  formData.append("file", file);

  if (message.trim()) {
    formData.append("message", message.trim());
  }

  const response = await api.post(
    `/messages/${chatId}`,
    formData
  );

  return response.data.data;
};
export const getChatAttachment = async (
  chatId,
  messageId
) => {
  const response = await api.get(
    `/messages/${chatId}/${messageId}/attachment`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};
export const getConsultationDoctorProfile = async (chatId) => {
  const response = await api.get(`/chat/${chatId}/doctor-profile`);
  return response.data.data;
};

export const closePatientConsultation = async (chatId) => {
  const response = await api.put(`/chat/${chatId}/close`);
  return response.data.data;
};
