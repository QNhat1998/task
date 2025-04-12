import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * Vòng đời của CategoriesService:
 * 1. Khởi tạo (Constructor)
 * 2. Xử lý business logic
 * 3. Tương tác với database
 * 4. Trả về kết quả cho controller
 */

@Injectable() // Decorator đánh dấu class là một service có thể inject
export class CategoriesService {
  // Constructor injection: Khi CategoriesService được khởi tạo, NestJS sẽ tự động inject Category repository
  constructor(
    @InjectRepository(Category) // Inject repository cho Category entity
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Tạo category mới
   * @param createCategoryDto DTO chứa thông tin category
   * @returns Category đã được tạo
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  /**
   * Lấy tất cả category
   * @returns Danh sách category
   */
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  /**
   * Lấy category theo id
   * @param id ID của category
   * @returns Category tìm thấy
   * @throws NotFoundException nếu không tìm thấy category
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  /**
   * Cập nhật category
   * @param id ID của category
   * @param updateCategoryDto DTO chứa thông tin cập nhật
   * @returns Category đã được cập nhật
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  /**
   * Xóa category
   * @param id ID của category
   * @returns Category đã bị xóa
   */
  async remove(id: number): Promise<Category> {
    const category = await this.findOne(id);
    return await this.categoryRepository.remove(category);
  }
} 