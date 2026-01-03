"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
// import api from "@/lib/api";
import api from "../lib/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = Cookies.get("token");
    const userData = Cookies.get("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data.data;

      // Store in cookies
      Cookies.set("token", token, { expires: 7 }); // 7 days
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      setUser(user);

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/parent/dashboard");
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log("trying to register user");
      const response = await api.post("/auth/register", userData);
      const { user, token } = response.data.data;

      // Store in cookies
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });

      setUser(user);
      router.push("/parent/dashboard");

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed,,,",
      };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
  };

  const updateUser = (userData) => {
    setUser(userData);
    Cookies.set("user", JSON.stringify(userData), { expires: 7 });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isParent: user?.role === "parent",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
