import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../../guards/auth.guard';

/**
 * Vòng đời của TasksController:
 * 1. Khởi tạo (Constructor)
 * 2. Xử lý request (Route Handlers)
 * 3. Gọi service tương ứng
 * 4. Trả về response
 */

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('users/:user_id/tasks') // Base route cho controller
@UseGuards(AuthGuard) // Bảo vệ tất cả các route trong controller
export class TasksController {
  // Constructor injection: Khi TasksController được khởi tạo, NestJS sẽ tự động inject TasksService
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Tạo task mới
   * Route: POST /users/:user_id/tasks
   * 
   * Ví dụ request:
   * POST /users/1/tasks
   * Body: {
   *   "title": "Hoàn thành báo cáo",
   *   "description": "Viết báo cáo tuần"
   * }
   */
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(
    @Param('user_id', ParseIntPipe) user_id: number, // Lấy user_id từ param và parse sang number
    @Body() createTaskDto: CreateTaskDto, // Lấy dữ liệu từ body
  ) {
    return this.tasksService.create(user_id, createTaskDto);
  }

  /**
   * Lấy tất cả task của user
   * Route: GET /users/:user_id/tasks
   * 
   * Ví dụ request:
   * GET /users/1/tasks
   */
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  findAll(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.tasksService.findAll(user_id);
  }

  /**
   * Lấy task theo id
   * Route: GET /users/:user_id/tasks/:id
   * 
   * Ví dụ request:
   * GET /users/1/tasks/1
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(user_id, id);
  }

  /**
   * Cập nhật task
   * Route: PATCH /users/:user_id/tasks/:id
   * 
   * Ví dụ request:
   * PATCH /users/1/tasks/1
   * Body: {
   *   "title": "Cập nhật báo cáo",
   *   "status": "in_progress"
   * }
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user_id, id, updateTaskDto);
  }

  /**
   * Xóa task
   * Route: DELETE /users/:user_id/tasks/:id
   * 
   * Ví dụ request:
   * DELETE /users/1/tasks/1
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.remove(user_id, id);
  }
} 