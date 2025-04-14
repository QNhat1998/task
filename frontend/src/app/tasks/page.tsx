"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useTasks } from "@/hooks/useTasks";
import { Task, Category, CreateTask } from "@/types/task";
import Cookies from "js-cookie";
import { useToken } from "@/hooks/useToken";

const categories: Category[] = [
  {
    id: 1,
    name: "Công việc",
    description: "Các công việc hàng ngày",
    color: "#FF5733",
    created_at: "2025-04-11T04:13:06.832Z",
    updated_at: "2025-04-11T04:13:06.832Z",
  },
  {
    id: 2,
    name: "Học tập",
    description: "Các nhiệm vụ liên quan đến học tập",
    color: "#33FF57",
    created_at: "2025-04-11T04:13:06.832Z",
    updated_at: "2025-04-11T04:13:06.832Z",
  },
  {
    id: 3,
    name: "Cá nhân",
    description: "Các việc riêng tư",
    color: "#3357FF",
    created_at: "2025-04-11T04:13:06.832Z",
    updated_at: "2025-04-11T04:13:06.832Z",
  },
  {
    id: 4,
    name: "Mua sắm",
    description: "Danh sách mua sắm",
    color: "#F033FF",
    created_at: "2025-04-11T04:13:06.832Z",
    updated_at: "2025-04-11T04:13:06.832Z",
  },
  {
    id: 5,
    name: "Sức khỏe",
    description: "Các hoạt động liên quan đến sức khỏe",
    color: "#33FFF3",
    created_at: "2025-04-11T04:13:06.832Z",
    updated_at: "2025-04-11T04:13:06.832Z",
  },
];

export default function TasksPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();

  useEffect(() => {
    setIsMounted(true);
    const { getToken } = useToken();
    const token = getToken();
    console.log(token);
    
    const user = localStorage.getItem("userId");

    console.log("Token:", token);
    console.log("User data:", user);

    if (!token || !user) {
      console.log("No token or user data found, redirecting to login");
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(user);
      console.log("Parsed user data:", userData);

      if (!userData) {
        console.log("No user ID found in user data");
        router.push("/login");
        return;
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      router.push("/login");
      return;
    }

    fetchTasks();
  }, [router]);

  const handleCreateTask = async (taskData: CreateTask) => {
    try {
      await createTask(taskData);
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      await updateTask(id, taskData);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <button onClick={() => setIsCreating(true)} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Create Task
          </button>
        </div>

        {isCreating && (
          <div className="mb-6">
            <TaskForm categories={categories} onSubmit={handleCreateTask} onCancel={() => setIsCreating(false)} />
          </div>
        )}

        <TaskList tasks={tasks} onDelete={handleDeleteTask} onUpdate={handleUpdateTask} categories={categories} />
      </div>
    </Layout>
  );
}
