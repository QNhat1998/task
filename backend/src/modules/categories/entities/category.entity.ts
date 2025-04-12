import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '../../../modules/tasks/entities/task.entity';

/**
 * Vòng đời của Category Entity:
 * 1. Định nghĩa cấu trúc bảng
 * 2. Định nghĩa quan hệ với Task
 * 3. Tự động cập nhật timestamps
 */

@Entity('categories') // Định nghĩa tên bảng trong database
export class Category {
  @PrimaryGeneratedColumn() // Primary key tự tăng
  id: number;

  @Column() // Column bình thường
  name: string;

  @Column({ nullable: true }) // Column có thể null
  description: string;

  @Column({ nullable: true }) // Column có thể null
  color: string;

  @CreateDateColumn() // Tự động cập nhật thời gian tạo
  created_at: Date;

  @UpdateDateColumn() // Tự động cập nhật thời gian sửa
  updated_at: Date;

  @OneToMany(() => Task, task => task.category) // Quan hệ một category có nhiều task
  tasks: Task[];
} 