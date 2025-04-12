import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Vòng đời của Note Entity:
 * 1. Định nghĩa cấu trúc bảng
 * 2. Định nghĩa quan hệ với User
 * 3. Tự động cập nhật timestamps
 */

@Entity('notes') // Định nghĩa tên bảng trong database
export class Note {
  @PrimaryGeneratedColumn() // Primary key tự tăng
  id: number;

  @Column() // Column bình thường
  title: string;

  @Column({ nullable: true }) // Column có thể null
  content: string;

  @CreateDateColumn() // Tự động cập nhật thời gian tạo
  created_at: Date;

  @UpdateDateColumn() // Tự động cập nhật thời gian sửa
  updated_at: Date;

  @ManyToOne(() => User, user => user.notes) // Quan hệ nhiều note thuộc về một user
  @JoinColumn({ name: 'user_id' }) // Tên column foreign key
  user: User;
} 