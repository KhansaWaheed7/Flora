import api from "../api/axios";
import { GYNAE_ASSISTANT } from "../api/endpoints";

export const createGynaeConversation = async () => {
  const response = await api.post(GYNAE_ASSISTANT.CREATE);
  return response.data;
};

export const sendGynaeMessage = async (conversationId, message) => {
  const response = await api.post(GYNAE_ASSISTANT.MESSAGE, {
    conversationId,
    message,
  });

  return response.data;
};

export const getGynaeHistory = async () => {
  const response = await api.get(GYNAE_ASSISTANT.HISTORY);
  return response.data;
};

export const getGynaeConversation = async (conversationId) => {
  const response = await api.get(
    GYNAE_ASSISTANT.CONVERSATION(conversationId)
  );

  return response.data;
};