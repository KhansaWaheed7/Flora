import api from "../api/axios";

/*
 Register
*/

export const register = async (data) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

/*
Login
*/

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

/*
 Logout
*/

export const logout = async (token) => {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/*
Refresh Token
*/

export const refreshToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh-token", {
    refreshToken,
  });

  return response.data;
};

/*
Forgot Password
*/

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

/*
Reset Password
*/

export const resetPassword = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    password,
  });

  return response.data;
};

/*
Verify Email
*/

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);

  return response.data;
};

/*
Resend Verification Email
*/

export const resendVerification = async (email) => {
  const response = await api.post("/auth/resend-verification", {
    email,
  });

  return response.data;
};