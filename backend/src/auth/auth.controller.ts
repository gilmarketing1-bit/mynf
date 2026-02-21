import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService, LoginResponse } from './auth.service';
import { Throttle } from '@nestjs/throttler';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Rate limit estrito: máximo 10 tentativas por minuto
  @Throttle({ strict: { ttl: 60000, limit: 10 } })
  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponse> {
    return this.authService.login(body.email, body.password);
  }

  @Throttle({ strict: { ttl: 60000, limit: 5 } })
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<LoginResponse> {
    return this.authService.register(body.name, body.email, body.password);
  }
}