import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

/**
 * Vòng đời của UpdateNoteDto:
 * 1. Kế thừa từ CreateNoteDto
 * 2. Tất cả các trường đều optional
 * 3. Sử dụng cho PATCH request
 */

export class UpdateNoteDto extends PartialType(CreateNoteDto) {} 