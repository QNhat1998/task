import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

/**
 * Vòng đời của UpdateCategoryDto:
 * 1. Kế thừa từ CreateCategoryDto
 * 2. Tất cả các trường đều optional
 * 3. Sử dụng cho PATCH request
 */

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {} 