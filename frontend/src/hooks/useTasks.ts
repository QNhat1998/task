import { useState, useEffect } from "react";
import { Task, CreateTask } from "@/types/task";

const API_URL = "http://188.166.225.136:4000";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy user_id từ token hoặc localStorage
  const getUserId = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return userData.id;
    }
    return null;
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not logged in");
      }
      const response = await fetch(`${API_URL}/users/${userId}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: CreateTask) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not logged in");
      }
      const response = await fetch(`${API_URL}/users/${userId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      setTasks((prev) => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not logged in");
      }
      const response = await fetch(`${API_URL}/users/${userId}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      setTasks((prev) => prev.map((task) => (task.id === id ? data : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not logged in");
      }
      await fetch(`${API_URL}/users/${userId}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
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
