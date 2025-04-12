import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import { Category } from '../../../modules/categories/entities/category.entity';
import { Subtask } from './subtask.entity';

/**
 * Vòng đời của Task Entity:
 * 1. Định nghĩa cấu trúc bảng
 * 2. Định nghĩa các quan hệ
 * 3. Định nghĩa các enum
 * 4. Tự động cập nhật timestamps
 */

// Enum định nghĩa trạng thái của task
export enum TaskStatus {
  TODO = 'todo', // Chưa bắt đầu
  IN_PROGRESS = 'in_progress', // Đang thực hiện
  DONE = 'done' // Đã hoàn thành
}

// Enum định nghĩa độ ưu tiên của task
export enum TaskPriority {
  LOW = 'low', // Ưu tiên thấp
  MEDIUM = 'medium', // Ưu tiên trung bình
  HIGH = 'high' // Ưu tiên cao
}

@Entity('tasks') // Định nghĩa tên bảng trong database
export class Task {
  @PrimaryGeneratedColumn() // Primary key tự tăng
  id: number;

  @Column() // Column bình thường
  title: string;

  @Column({ nullable: true }) // Column có thể null
  description: string;

  @Column({ default: false }) // Column với giá trị mặc định
  is_completed: boolean;

  @Column({ nullable: true }) // Column có thể null
  due_date: Date;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status: TaskStatus;

  @CreateDateColumn() // Tự động cập nhật thời gian tạo
  created_at: Date;

  @UpdateDateColumn() // Tự động cập nhật thời gian sửa
  updated_at: Date;

  @ManyToOne(() => User, user => user.tasks) // Quan hệ nhiều task thuộc về một user
  @JoinColumn({ name: 'user_id' }) // Tên column foreign key
  user: User;

  @ManyToOne(() => Category, category => category.tasks, { nullable: true }) // Quan hệ nhiều task thuộc về một category
  @JoinColumn({ name: 'category_id' }) // Tên column foreign key
  category: Category;

  @OneToMany(() => Subtask, subtask => subtask.task) // Quan hệ một task có nhiều subtask
  subtasks: Subtask[];
} 