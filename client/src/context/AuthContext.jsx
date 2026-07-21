import { createContext, useContext, useEffect, useState } from "react";

import * as authService from "../services/auth.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);

    localStorage.setItem("refreshToken", refreshToken);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setUser(user);

    return response;
  };

  const register = async (data) => {
    return await authService.register(data);
  };

  const logout = async () => {
    try {
      const token =
        localStorage.getItem("accessToken");

      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};