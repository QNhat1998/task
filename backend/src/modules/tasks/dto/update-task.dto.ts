import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

/**
 * Vòng đời của UpdateTaskDto:
 * 1. Kế thừa từ CreateTaskDto
 * 2. Tất cả các trường đều optional
 * 3. Sử dụng cho PATCH request
 */

export class UpdateTaskDto extends PartialType(CreateTaskDto) {} 