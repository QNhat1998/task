import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Vòng đời của DTOs:
 * 1. Validate input data
 * 2. Transform data
 * 3. Document API với Swagger
 */

export class CreateNoteDto {
  @ApiProperty({ description: 'Title of the note' }) // Swagger documentation
  @IsString() // Validate kiểu string
  title: string;

  @ApiProperty({ description: 'Content of the note', required: false })
  @IsString()
  @IsOptional() // Có thể không có
  content?: string;
} 