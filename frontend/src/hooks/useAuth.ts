"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (data: LoginFormData) => {
    console.log(data);

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Đăng nhập thất bại");
      }

      const { accessToken, user } = await response.json();
      // Lưu token vào Cookies với thời hạn 7 ngày
      Cookies.set("token", accessToken, { expires: 7 });
      console.log(accessToken);

      localStorage.setItem("token", accessToken);
      // Lưu userId vào localStorage
      localStorage.setItem("userId", user.id.toString());
      router.push("/tasks");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Đăng ký thất bại");
      }

      router.push("/login");
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Xóa cả token và userId
    Cookies.remove("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  // Lấy token từ Cookies
  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
  // Lấy userId từ localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  return {
    login,
    register,
    logout,
    isLoading,
    token,
    userId: userId ? parseInt(userId) : null,
  };
};
