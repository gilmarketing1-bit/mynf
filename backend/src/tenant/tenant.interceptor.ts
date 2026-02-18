import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; tenantId?: string }>();
    const headerTenant = request.headers['x-tenant-id'];
    request.tenantId = headerTenant ?? 'dev-tenant';
    return next.handle();
  }
}
