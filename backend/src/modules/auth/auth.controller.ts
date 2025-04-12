import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../decorators/public.decorator';

/**
 * Vòng đời của AuthController:
 * 1. Khởi tạo (Constructor)
 * 2. Xử lý request (Route Handlers)
 * 3. Gọi service tương ứng
 * 4. Trả về response
 */

@ApiTags('Auth') // Nhóm các API liên quan đến xác thực trong Swagger
@Controller('auth') // Base route cho controller
export class AuthController {
  // Constructor injection: Khi AuthController được khởi tạo, NestJS sẽ tự động inject AuthService
  constructor(private readonly authService: AuthService) {}

  /**
   * Đăng ký tài khoản mới
   * Route: POST /auth/register
   * 
   * Ví dụ request:
   * POST /auth/register
   * Body: {
   *   "email": "user@example.com",
   *   "password": "password123",
   *   "name": "John Doe"
   * }
   */
  @Public() // Cho phép truy cập mà không cần xác thực
  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Set HTTP status code là 201
  @ApiOperation({ summary: 'Register a new user' }) // Mô tả API trong Swagger
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Đăng nhập
   * Route: POST /auth/login
   * 
   * Ví dụ request:
   * POST /auth/login
   * Body: {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK) // Set HTTP status code là 200
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
} 