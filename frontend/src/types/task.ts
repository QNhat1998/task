export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Subtask {
  id: number;
  title: string;
  is_completed: boolean;
  task_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubtask {
  title: string;
  is_completed: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  category_id?: number;
  category?: Category;
  subtasks?: (Subtask | CreateSubtask)[];
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTask {
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  category_id?: number;
  subtasks?: CreateSubtask[];
}
