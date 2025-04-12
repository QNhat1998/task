import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '../../decorators/public.decorator';
import { AuthGuard } from '../../guards/auth.guard';

/**
 * Vòng đời của CategoriesController:
 * 1. Khởi tạo (Constructor)
 * 2. Xử lý request (Route Handlers)
 * 3. Gọi service tương ứng
 * 4. Trả về response
 */

@ApiTags('Categories') // Nhóm các API liên quan đến categories trong Swagger
@Controller('categories') // Base route cho controller
export class CategoriesController {
  // Constructor injection: Khi CategoriesController được khởi tạo, NestJS sẽ tự động inject CategoriesService
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Tạo category mới
   * Route: POST /categories
   * 
   * Ví dụ request:
   * POST /categories
   * Body: {
   *   "name": "Công việc",
   *   "description": "Các công việc cần làm",
   *   "color": "#FF5733"
   * }
   */
  @Public() // Cho phép truy cập mà không cần xác thực
  @Post()
  @ApiOperation({ summary: 'Create a new category' }) // Mô tả API trong Swagger
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Lấy tất cả category
   * Route: GET /categories
   * 
   * Ví dụ request:
   * GET /categories
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * Lấy category theo id
   * Route: GET /categories/:id
   * 
   * Ví dụ request:
   * GET /categories/1
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ status: 200, description: 'Return the category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  /**
   * Cập nhật category
   * Route: PATCH /categories/:id
   * 
   * Ví dụ request:
   * PATCH /categories/1
   * Body: {
   *   "name": "Công việc quan trọng",
   *   "color": "#FF0000"
   * }
   */
  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * Xóa category
   * Route: DELETE /categories/:id
   * 
   * Ví dụ request:
   * DELETE /categories/1
   */
  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
} 