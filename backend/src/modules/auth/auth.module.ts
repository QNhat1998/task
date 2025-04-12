import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AccessToken } from './entities/access-token.entity';

/**
 * Vòng đời của AuthModule:
 * 1. Khởi tạo (Module Decorator)
 * 2. Import các module phụ thuộc
 * 3. Đăng ký controllers và providers
 * 4. Export services để các module khác sử dụng
 */

@Module({
  imports: [
    // Import UsersModule để sử dụng UsersService
    UsersModule,
    // Import TypeOrmModule để sử dụng User repository
    TypeOrmModule.forFeature([User, AccessToken]),
    // Cấu hình JwtModule với secret key từ ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  // Đăng ký controller để xử lý các request
  controllers: [AuthController],
  // Đăng ký service để xử lý business logic
  providers: [AuthService],
  // Export service để các module khác có thể sử dụng
  exports: [AuthService],
})
export class AuthModule {} 