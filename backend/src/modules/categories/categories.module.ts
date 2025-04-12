import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

/**
 * Vòng đời của CategoriesModule:
 * 1. Khởi tạo (Module Decorator)
 * 2. Import các module phụ thuộc
 * 3. Đăng ký controllers và providers
 * 4. Export services để các module khác sử dụng
 */

@Module({
  imports: [
    // Đăng ký Category entity với TypeORM để có thể sử dụng repository
    TypeOrmModule.forFeature([Category]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UsersModule, // Import UsersModule để sử dụng UsersService
  ],
  // Đăng ký controller để xử lý các request
  controllers: [CategoriesController],
  // Đăng ký service để xử lý business logic
  providers: [CategoriesService],
  // Export service để các module khác có thể sử dụng
  exports: [CategoriesService],
})
export class CategoriesModule {} 