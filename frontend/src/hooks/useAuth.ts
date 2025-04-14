"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/task";
import { useToken } from "@/hooks/useToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { getToken } = useToken();

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }
        throw new Error("Đăng nhập thất bại");
      }

      const { accessToken, user } = await response.json();
      // Lưu token và user data vào localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id.toString());
      router.push("/tasks");
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng nhập");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Email đã tồn tại");
        }
        throw new Error("Đăng ký thất bại");
      }

      router.push("/login");
    } catch (error) {
      console.error("Register error:", error);
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      // Xóa token và user data từ localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Có lỗi xảy ra khi đăng xuất");
    }
  };

  // Lấy user data từ localStorage
  const getUser = (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  // Lấy token từ localStorage
  const token = getToken();

  // Lấy userId từ localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    token,
    userId: userId ? parseInt(userId) : null,
    user: getUser(),
  };
};
