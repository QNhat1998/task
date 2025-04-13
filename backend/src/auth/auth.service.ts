import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(loginDto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.jwtService.sign({ userId: user.id }, { expiresIn: "1d" });

    return { user, token };
  }
}
