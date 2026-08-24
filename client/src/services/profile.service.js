import api from "../api/axios";

export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/profile", data);
  return response.data;
};

export const uploadAvatar = async (formData) => {
  const response = await api.post(
    "/profile/avatar",
    formData
  );

  return response.data;
};

export const removeAvatar = async () => {
  const response = await api.delete("/profile/avatar");
  return response.data;
};