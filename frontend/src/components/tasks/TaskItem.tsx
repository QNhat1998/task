"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Task } from "@/types/task";

interface Subtask {
  id: number;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => Promise<void>;
}

export const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "todo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return priority;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return "Hoàn thành";
      case "in_progress":
        return "Đang thực hiện";
      case "todo":
        return "Chưa bắt đầu";
      default:
        return status;
    }
  };

  const handleDelete = () => {
    if (task.id) {
      onDelete(task.id);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          {task.description && <p className="mt-1 text-sm text-gray-500">{task.description}</p>}
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(task)} className="text-indigo-600 hover:text-indigo-900">
            Sửa
          </button>
          <button onClick={handleDelete} className="text-red-600 hover:text-red-900">
            Xóa
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.due_date && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{format(new Date(task.due_date), "dd/MM/yyyy", { locale: vi })}</span>}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>{getPriorityText(task.priority)}</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>{getStatusText(task.status)}</span>
        {task.category && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${task.category.color}20`, color: task.category.color }}>
            {task.category.name}
          </span>
        )}
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Công việc con:</h4>
          <ul className="mt-2 space-y-1">
            {task.subtasks.map((subtask, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <input type="checkbox" checked={subtask.is_completed} readOnly className="px-2.5 text-black bg-white rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                <span className={`ml-2 ${subtask.is_completed ? "line-through text-gray-400" : ""}`}>{subtask.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        {task.created_at && <p>Tạo lúc: {format(new Date(task.created_at), "HH:mm dd/MM/yyyy", { locale: vi })}</p>}
        {task.updated_at && <p>Cập nhật: {format(new Date(task.updated_at), "HH:mm dd/MM/yyyy", { locale: vi })}</p>}
      </div>
    </div>
  );
};
