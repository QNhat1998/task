import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

/**
 * Vòng đời của NotesService:
 * 1. Khởi tạo (Constructor)
 * 2. Xử lý business logic
 * 3. Tương tác với database
 * 4. Trả về kết quả cho controller
 */

@Injectable() // Decorator đánh dấu class là một service có thể inject
export class NotesService {
  // Constructor injection: Khi NotesService được khởi tạo, NestJS sẽ tự động inject Note repository
  constructor(
    @InjectRepository(Note) // Inject repository cho Note entity
    private readonly noteRepository: Repository<Note>,
  ) {}

  /**
   * Tạo note mới
   * @param createNoteDto DTO chứa thông tin note
   * @returns Note đã được tạo
   */
  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create(createNoteDto);
    return await this.noteRepository.save(note);
  }

  /**
   * Lấy tất cả note
   * @returns Danh sách note
   */
  async findAll(): Promise<Note[]> {
    return await this.noteRepository.find();
  }

  /**
   * Lấy note theo id
   * @param id ID của note
   * @returns Note tìm thấy
   * @throws NotFoundException nếu không tìm thấy note
   */
  async findOne(id: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  /**
   * Cập nhật note
   * @param id ID của note
   * @param updateNoteDto DTO chứa thông tin cập nhật
   * @returns Note đã được cập nhật
   */
  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const note = await this.findOne(id);
    Object.assign(note, updateNoteDto);
    return await this.noteRepository.save(note);
  }

  /**
   * Xóa note
   * @param id ID của note
   * @returns Note đã bị xóa
   */
  async remove(id: number): Promise<Note> {
    const note = await this.findOne(id);
    return await this.noteRepository.remove(note);
  }
} 