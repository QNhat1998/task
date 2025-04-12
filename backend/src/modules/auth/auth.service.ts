import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AccessToken } from './entities/access-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

/**
 * Vòng đời của AuthService:
 * 1. Khởi tạo (Constructor)
 * 2. Xử lý business logic
 * 3. Tương tác với database
 * 4. Trả về kết quả cho controller
 */

@Injectable() // Decorator đánh dấu class là một service có thể inject
export class AuthService {
  // Constructor injection: Khi AuthService được khởi tạo, NestJS sẽ tự động inject các dependencies
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // Inject JwtService
    @InjectRepository(User) // Inject repository cho User entity
    private readonly userRepository: Repository<User>,
    @InjectRepository(AccessToken)
    private accessTokenRepository: Repository<AccessToken>,
  ) {}

  /**
   * Đăng ký tài khoản mới
   * @param registerDto DTO chứa thông tin đăng ký
   * @returns User đã được tạo và access token
   */
  async register(registerDto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Tạo user mới
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    // Tạo access token
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user,
      accessToken,
    };
  }

  /**
   * Đăng nhập
   * @param loginDto DTO chứa thông tin đăng nhập
   * @returns User và access token
   */
  async login(loginDto: LoginDto) {
    // Tìm user theo email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Tạo access token
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    // Save access token to database
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    await this.accessTokenRepository.save({
      token: accessToken,
      user_id: user.id,
      expires_at: expiresAt,
    });

    return {
      user,
      accessToken,
    };
  }
} 