"use client";

import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { useState } from "react";
import { Task, Category } from "@/types/task";
import { CreateTask } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, taskData: Partial<Task>) => Promise<void>;
  categories: Category[];
}

export const TaskList = ({ tasks = [], onDelete, onUpdate, categories }: TaskListProps) => {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleUpdateTask = async (id: number, data: CreateTask) => {
    await onUpdate(id, data);
    setEditingTaskId(null);
  };

  const handleDeleteTask = async (id: number) => {
    await onDelete(id);
  };

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">Chưa có công việc nào. Hãy tạo công việc mới để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id}>{editingTaskId === task.id ? <TaskForm initialData={task} onSubmit={(data) => (task.id ? handleUpdateTask(task.id, data) : Promise.resolve())} onCancel={() => setEditingTaskId(null)} categories={categories} /> : <TaskItem task={task} onEdit={() => (task.id ? setEditingTaskId(task.id) : undefined)} onDelete={() => (task.id ? handleDeleteTask(task.id) : Promise.resolve())} />}</div>
      ))}
    </div>
  );
};
