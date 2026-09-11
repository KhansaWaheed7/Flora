import api from "../api/axios";

export const getNotifications = async ({ limit = 50, unreadOnly = false } = {}) => {
  const response = await api.get("/notifications", {
    params: { limit, unreadOnly },
  });
  return response.data?.data || [];
};

export const getUnreadNotificationCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data?.data?.count || 0;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data?.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};
