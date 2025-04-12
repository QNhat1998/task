import { IsString, IsOptional, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Vòng đời của DTOs:
 * 1. Validate input data
 * 2. Transform data
 * 3. Document API với Swagger
 */

export class CreateCategoryDto {
  @ApiProperty({ example: 'Công việc', description: 'Category name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '#FF5733', description: 'Category color', required: false })
  @IsHexColor()
  @IsOptional()
  color?: string;

  @ApiProperty({ description: 'Description of the category', required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 