import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from './task.entity';

/**
 * Vòng đời của Subtask Entity:
 * 1. Định nghĩa cấu trúc bảng
 * 2. Định nghĩa quan hệ với Task
 * 3. Tự động cập nhật timestamps
 */

@Entity('subtasks') // Định nghĩa tên bảng trong database
export class Subtask {
  @PrimaryGeneratedColumn() // Primary key tự tăng
  id: number;

  @Column() // Column bình thường
  title: string;

  @Column({ default: false }) // Column với giá trị mặc định
  is_completed: boolean;

  @CreateDateColumn() // Tự động cập nhật thời gian tạo
  created_at: Date;

  @UpdateDateColumn() // Tự động cập nhật thời gian sửa
  updated_at: Date;

  @ManyToOne(() => Task, task => task.subtasks) // Quan hệ nhiều subtask thuộc về một task
  @JoinColumn({ name: 'task_id' }) // Tên column foreign key
  task: Task;
} 