"use client";

export const useToken = () => {
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  return {
    getToken,
    isAuthenticated,
  };
};
