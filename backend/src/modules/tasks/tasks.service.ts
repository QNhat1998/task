import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Subtask } from './entities/subtask.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable() // Decorator đánh dấu class có thể được inject vào các module khác
export class TasksService {
  constructor(
    @InjectRepository(Task) // Inject repository của Task entity
    private taskRepository: Repository<Task>,
    @InjectRepository(Subtask) // Inject repository của Subtask entity
    private subtaskRepository: Repository<Subtask>,
    @InjectRepository(Category) // Inject repository của Category entity
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Vòng đời của một Task:
   * 1. Tạo mới (create)
   * 2. Cập nhật (update)
   * 3. Xóa (remove)
   * 
   * Các trạng thái của Task:
   * - TODO: Chưa bắt đầu
   * - IN_PROGRESS: Đang thực hiện
   * - DONE: Đã hoàn thành
   */

  /**
   * Tạo task mới
   * @param user_id - ID của user tạo task
   * @param createTaskDto - Dữ liệu để tạo task
   * @returns Task mới được tạo
   * 
   * Ví dụ:
   * {
   *   title: "Hoàn thành báo cáo",
   *   description: "Viết báo cáo tuần",
   *   priority: "high",
   *   category_id: 1,
   *   subtasks: [
   *     { title: "Thu thập dữ liệu" },
   *     { title: "Phân tích dữ liệu" }
   *   ]
   * }
   */
  async create(user_id: number, createTaskDto: CreateTaskDto): Promise<Task> {
    // 1. Tách dữ liệu từ DTO
    const { subtasks, category_id, ...taskData } = createTaskDto;

    // 2. Tạo task mới
    const task = this.taskRepository.create({
      ...taskData,
      user: { id: user_id }, // Gán user cho task
      category: category_id ? { id: category_id } : null, // Gán category nếu có
    });

    // 3. Lưu task vào database
    const savedTask = await this.taskRepository.save(task);

    // 4. Xử lý subtasks nếu có
    if (subtasks && subtasks.length > 0) {
      const subtaskEntities = subtasks.map(subtask =>
        this.subtaskRepository.create({
          ...subtask,
          task: savedTask, // Gán task cho subtask
        })
      );
      await this.subtaskRepository.save(subtaskEntities);
    }

    // 5. Trả về task đã được tạo
    return this.findOne(user_id, savedTask.id);
  }

  /**
   * Lấy tất cả task của user
   * @param user_id - ID của user
   * @returns Danh sách task của user
   * 
   * Ví dụ kết quả:
   * [
   *   {
   *     id: 1,
   *     title: "Hoàn thành báo cáo",
   *     status: "todo",
   *     subtasks: [...],
   *     category: {...}
   *   },
   *   ...
   * ]
   */
  async findAll(user_id: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { user: { id: user_id } }, // Filter theo user_id
      relations: ['subtasks', 'category'], // Load relations
    });
  }

  /**
   * Lấy task theo id
   * @param user_id - ID của user
   * @param id - ID của task
   * @returns Task tìm thấy
   * @throws NotFoundException nếu không tìm thấy task
   * 
   * Ví dụ kết quả:
   * {
   *   id: 1,
   *   title: "Hoàn thành báo cáo",
   *   status: "todo",
   *   subtasks: [...],
   *   category: {...}
   * }
   */
  async findOne(user_id: number, id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user_id } }, // Filter theo id và user_id
      relations: ['subtasks', 'category'], // Load relations
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  /**
   * Cập nhật task
   * @param user_id - ID của user
   * @param id - ID của task
   * @param updateTaskDto - Dữ liệu cập nhật
   * @returns Task đã được cập nhật
   * 
   * Ví dụ updateTaskDto:
   * {
   *   title: "Cập nhật báo cáo",
   *   status: "in_progress",
   *   subtasks: [
   *     { id: 1, title: "Thu thập dữ liệu", is_completed: true },
   *     { title: "Viết kết luận" }
   *   ]
   * }
   */
  async update(user_id: number, id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // 1. Tìm task cần cập nhật
    const task = await this.findOne(user_id, id);

    // 2. Tách dữ liệu từ DTO
    const { subtasks, category_id, ...updateData } = updateTaskDto;

    // 3. Cập nhật dữ liệu task
    Object.assign(task, updateData);
    
    // 4. Cập nhật category nếu có
    if (category_id) {
      task.category = { id: category_id } as Category;
    }

    // 5. Xử lý subtasks nếu có
    if (subtasks) {
      // Xóa subtasks cũ
      await this.subtaskRepository.delete({ task: { id: task.id } });

      // Tạo subtasks mới
      const subtaskEntities = subtasks.map(subtask =>
        this.subtaskRepository.create({
          ...subtask,
          task: task,
        })
      );
      await this.subtaskRepository.save(subtaskEntities);
    }

    // 6. Lưu task đã cập nhật
    return this.taskRepository.save(task);
  }

  /**
   * Xóa task
   * @param user_id - ID của user
   * @param id - ID của task
   * @returns void
   * 
   * Lưu ý:
   * - Khi xóa task, tất cả subtasks liên quan cũng sẽ bị xóa (cascade)
   * - Không thể khôi phục task đã xóa
   */
  async remove(user_id: number, id: number): Promise<void> {
    const task = await this.findOne(user_id, id);
    await this.taskRepository.remove(task);
  }
}