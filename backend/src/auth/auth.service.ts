import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private getClient() {
    return new Client({ connectionString: process.env.DATABASE_URL });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const client = this.getClient();
    await client.connect();
    try {
      // Busca usuário no banco
      const result = await client.query(
        `SELECT u.*, t.slug as tenant_slug, t.plan as tenant_plan
         FROM users u
         JOIN tenants t ON t.id = u.tenant_id
         WHERE u.email = $1 AND u.status = 'active'`,
        [email]
      );

      if (result.rows.length === 0) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const user = result.rows[0];

      // Verifica senha
      if (!user.password_hash) {
        throw new UnauthorizedException('Use o login com Google para esta conta');
      }

      const senhaValida = await bcrypt.compare(password, user.password_hash);
      if (!senhaValida) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      // Gera tokens
      const payload = {
        sub: user.id,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.jwtService.signAsync(
        { sub: user.id, type: 'refresh' },
        {
          secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
          expiresIn: '7d',
        }
      );

      return {
        accessToken,
        refreshToken,
        expiresIn: 900,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenant_id,
        },
      };
    } finally {
      await client.end();
    }
  }

  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    const client = this.getClient();
    await client.connect();
    try {
      // Verifica se email já existe
      const existing = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      if (existing.rows.length > 0) {
        throw new UnauthorizedException('E-mail já cadastrado');
      }

      // Cria tenant
      const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Date.now();
      const tenantResult = await client.query(
        `INSERT INTO tenants (name, slug) VALUES ($1, $2) RETURNING *`,
        [name, slug]
      );
      const tenant = tenantResult.rows[0];

      // Cria usuário
      const passwordHash = await bcrypt.hash(password, 12);
      const userResult = await client.query(
        `INSERT INTO users (tenant_id, name, email, password_hash, role)
         VALUES ($1, $2, $3, $4, 'owner') RETURNING *`,
        [tenant.id, name, email, passwordHash]
      );
      const user = userResult.rows[0];

      // Gera tokens
      const payload = {
        sub: user.id,
        email: user.email,
        tenantId: tenant.id,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.jwtService.signAsync(
        { sub: user.id, type: 'refresh' },
        {
          secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
          expiresIn: '7d',
        }
      );

      return {
        accessToken,
        refreshToken,
        expiresIn: 900,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: tenant.id,
        },
      };
    } finally {
      await client.end();
    }
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ?? 'dev-secret',
      });
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}