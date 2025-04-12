import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Public } from '../../decorators/public.decorator';
import { AuthGuard } from '../../guards/auth.guard';

/**
 * Vòng đời của NotesController:
 * 1. Khởi tạo (Constructor)
 * 2. Xử lý request (Route Handlers)
 * 3. Gọi service tương ứng
 * 4. Trả về response
 */

@UseGuards(AuthGuard) // Bảo vệ tất cả các route trong controller
@ApiTags('Notes') // Nhóm các API liên quan đến notes trong Swagger
@Controller('notes') // Base route cho controller
export class NotesController {
  // Constructor injection: Khi NotesController được khởi tạo, NestJS sẽ tự động inject NotesService
  constructor(private readonly notesService: NotesService) {}

  /**
   * Tạo note mới
   * Route: POST /notes
   * 
   * Ví dụ request:
   * POST /notes
   * Body: {
   *   "title": "Ghi chú quan trọng",
   *   "content": "Nội dung ghi chú"
   * }
   */
  @Public() // Cho phép truy cập mà không cần xác thực
  @Post()
  @ApiOperation({ summary: 'Create a new note' }) // Mô tả API trong Swagger
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  /**
   * Lấy tất cả note
   * Route: GET /notes
   * 
   * Ví dụ request:
   * GET /notes
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({ status: 200, description: 'Return all notes' })
  findAll() {
    return this.notesService.findAll();
  }

  /**
   * Lấy note theo id
   * Route: GET /notes/:id
   * 
   * Ví dụ request:
   * GET /notes/1
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a note by id' })
  @ApiResponse({ status: 200, description: 'Return the note' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findOne(id);
  }

  /**
   * Cập nhật note
   * Route: PATCH /notes/:id
   * 
   * Ví dụ request:
   * PATCH /notes/1
   * Body: {
   *   "title": "Cập nhật ghi chú",
   *   "content": "Nội dung mới"
   * }
   */
  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }

  /**
   * Xóa note
   * Route: DELETE /notes/:id
   * 
   * Ví dụ request:
   * DELETE /notes/1
   */
  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.remove(id);
  }
} 