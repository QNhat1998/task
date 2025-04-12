import { IsString, IsOptional, IsBoolean, IsDate, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

/**
 * Vòng đời của DTOs:
 * 1. Validate input data
 * 2. Transform data
 * 3. Document API với Swagger
 */

// DTO cho subtask
export class CreateSubtaskDto {
  @ApiProperty({ description: 'Title of the subtask' }) // Swagger documentation
  @IsString() // Validate kiểu string
  title: string;

  @ApiProperty({ description: 'Completion status of the subtask', default: false })
  @IsBoolean() // Validate kiểu boolean
  @IsOptional() // Có thể không có
  is_completed?: boolean;
}

// DTO cho task
export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Completion status of the task', default: false })
  @IsBoolean()
  @IsOptional()
  is_completed?: boolean;

  @ApiProperty({ description: 'Due date of the task', required: false })
  @IsDate()
  @Type(() => Date) // Chuyển đổi kiểu dữ liệu
  @IsOptional()
  due_date?: Date;

  @ApiProperty({ description: 'Priority of the task', enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority) // Validate giá trị enum
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ description: 'Status of the task', enum: TaskStatus, default: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ description: 'ID of the category', required: false })
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({ description: 'Subtasks of the task', type: [CreateSubtaskDto], required: false })
  @IsArray() // Validate kiểu array
  @ValidateNested({ each: true }) // Validate từng phần tử trong array
  @Type(() => CreateSubtaskDto) // Chuyển đổi kiểu dữ liệu
  @IsOptional()
  subtasks?: CreateSubtaskDto[];
} 