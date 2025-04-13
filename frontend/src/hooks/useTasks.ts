import { useState, useEffect } from "react";
import { Task, CreateTask } from "@/types/task";
import Cookies from "js-cookie";

const API_URL = "http://188.166.225.136:4000";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy user_id từ localStorage
  const getUserId = () => {
    const userId = localStorage.getItem("userId");
    console.log("User ID from localStorage:", userId);
    return userId;
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      const token = Cookies.get("token");

      console.log("Fetching tasks - User ID:", userId);
      console.log("Fetching tasks - Token:", token);

      if (!userId || !token) {
        throw new Error("User not logged in");
      }

      const response = await fetch(`${API_URL}/users/${userId}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Tasks data:", data);

      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: CreateTask) => {
    try {
      const userId = getUserId();
      const token = Cookies.get("token");

      if (!userId || !token) {
        throw new Error("User not logged in");
      }

      console.log("Creating task for user:", userId);
      console.log("Task data:", taskData);

      const response = await fetch(`${API_URL}/users/${userId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Created task:", data);

      setTasks((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      const userId = getUserId();
      const token = Cookies.get("token");

      if (!userId || !token) {
        throw new Error("User not logged in");
      }

      console.log("Updating task:", id);
      console.log("Update data:", taskData);

      const response = await fetch(`${API_URL}/users/${userId}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated task:", data);

      setTasks((prev) => prev.map((task) => (task.id === id ? data : task)));
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const userId = getUserId();
      const token = Cookies.get("token");

      if (!userId || !token) {
        throw new Error("User not logged in");
      }

      console.log("Deleting task:", id);

      const response = await fetch(`${API_URL}/users/${userId}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Task deleted successfully");
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
