import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './entities/note.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

/**
 * Vòng đời của NotesModule:
 * 1. Khởi tạo (Module Decorator)
 * 2. Import các module phụ thuộc
 * 3. Đăng ký controllers và providers
 * 4. Export services để các module khác sử dụng
 */

@Module({
  imports: [
    // Đăng ký Note entity với TypeORM để có thể sử dụng repository
    TypeOrmModule.forFeature([Note]),
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
  controllers: [NotesController],
  // Đăng ký service để xử lý business logic
  providers: [NotesService],
  // Export service để các module khác có thể sử dụng
  exports: [NotesService],
})
export class NotesModule {} 