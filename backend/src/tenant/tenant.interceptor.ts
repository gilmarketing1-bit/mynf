import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      tenantId?: string;
      userId?: string;
      userRole?: string;
    }>();

    try {
      const authHeader = request.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = this.jwtService.decode(token) as any;
        if (payload?.tenantId) {
          request.tenantId = payload.tenantId;
          request.userId = payload.sub;
          request.userRole = payload.role;
          return next.handle();
        }
      }
    } catch {
      // token inválido — cai no fallback
    }

    // fallback para desenvolvimento
    request.tenantId = request.headers['x-tenant-id'] ?? 'dev-tenant';
    return next.handle();
  }
}