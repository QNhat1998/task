import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';
import { Category } from '../categories/entities/category.entity';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Vòng đời của TasksModule:
 * 1. Khởi tạo (Module Decorator)
 * 2. Import các module phụ thuộc
 * 3. Đăng ký controllers và providers
 * 4. Export services để các module khác sử dụng
 */

@Module({
  imports: [
    // Đăng ký các entity với TypeORM để có thể sử dụng repository
    TypeOrmModule.forFeature([Task, Subtask, Category]),
    // Import UsersModule để sử dụng UsersService
    UsersModule,
    // Import CategoriesModule để sử dụng CategoriesService
    CategoriesModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  // Đăng ký controller để xử lý các request
  controllers: [TasksController],
  // Đăng ký service để xử lý business logic
  providers: [TasksService],
  // Export service để các module khác có thể sử dụng
  exports: [TasksService],
})
export class TasksModule {} 