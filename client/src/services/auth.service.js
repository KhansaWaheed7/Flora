import api from "../api/axios";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const registerWithFiles = async (formData) => {
  const response = await api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const googleLogin = async (token) => {
  const response = await api.post("/auth/google-login", { token });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh-token", { refreshToken });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/auth/me");
  return response.data;
};