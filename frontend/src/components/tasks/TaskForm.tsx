"use client";

import { useState } from "react";
import { Task, Category, CreateSubtask, CreateTask } from "@/types/task";

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: CreateTask) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
}

export const TaskForm = ({ initialData, onSubmit, onCancel, categories }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(initialData?.due_date || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(initialData?.priority || "medium");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">(initialData?.status || "todo");
  const [isCompleted, setIsCompleted] = useState(initialData?.is_completed || false);
  const [categoryId, setCategoryId] = useState<number | undefined>(initialData?.category_id);
  const [subtasks, setSubtasks] = useState<CreateSubtask[]>(initialData?.subtasks?.map((st) => ({ title: st.title, is_completed: st.is_completed })) || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      due_date: dueDate || undefined,
      priority,
      status,
      is_completed: isCompleted,
      category_id: categoryId || undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
    });
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: "", is_completed: false }]);
  };

  const updateSubtask = (index: number, field: "title" | "is_completed", value: string | boolean) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = { ...newSubtasks[index], [field]: value };
    setSubtasks(newSubtasks);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Tiêu đề
        </label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full h-10 text-black bg-white px-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Mô tả
        </label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full h-10 text-black bg-white px-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Hạn chót
        </label>
        <input type="datetime-local" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 block w-full h-10 text-black bg-white px-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Danh mục
        </label>
        <select id="category" value={categoryId || ""} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)} className="mt-1 block w-full h-10 text-black bg-white px-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Ưu tiên
        </label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} className="mt-1 block w-full h-10 text-black bg-white px-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          <option value="low">Thấp</option>
          <option value="medium">Trung bình</option>
          <option value="high">Cao</option>
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Trạng thái
        </label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as "todo" | "in_progress" | "done")} className="mt-1 block w-full h-10 text-black bg-white px-2.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          <option value="todo">Chưa bắt đầu</option>
          <option value="in_progress">Đang thực hiện</option>
          <option value="done">Hoàn thành</option>
        </select>
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="isCompleted" checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
        <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-900">
          Đã hoàn thành
        </label>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Công việc con</label>
          <button type="button" onClick={addSubtask} className="text-sm text-indigo-600 hover:text-indigo-900">
            Thêm công việc con
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="checkbox" checked={subtask.is_completed} onChange={(e) => updateSubtask(index, "is_completed", e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <input type="text" value={subtask.title} onChange={(e) => updateSubtask(index, "title", e.target.value)} className="flex-1 h-10 px-2.5 text-black bg-white rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Tiêu đề công việc con" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Hủy
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">
          Lưu
        </button>
      </div>
    </form>
  );
};
