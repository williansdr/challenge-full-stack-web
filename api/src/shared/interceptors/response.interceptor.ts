import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

import { ApiResponse } from '../interfaces';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(data => {
        const statusCode = response.statusCode;
        const success = statusCode >= 200 && statusCode < 300;

        const isPaginated = data && typeof data === 'object' && 'items' in data && 'meta' in data;

        if (isPaginated) {
          return {
            code: statusCode,
            success,
            currentPage: data.meta.currentPage,
            pageSize: data.meta.pageSize,
            totalCount: data.meta.totalCount,
            totalPages: data.meta.totalPages,
            data: data.items,
          };
        }

        return {
          code: statusCode,
          success,
          data,
        };
      }),
    );
  }
}
