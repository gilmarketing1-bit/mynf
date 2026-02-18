import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    if (email.length === 0 || password.length === 0) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessToken = await this.jwtService.signAsync({ sub: email, tenantId: 'dev-tenant' });
    const refreshToken = await this.jwtService.signAsync(
      { sub: email, type: 'refresh' },
      { secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret', expiresIn: '7d' },
    );

    return { accessToken, refreshToken, expiresIn: 900 };
  }
}
