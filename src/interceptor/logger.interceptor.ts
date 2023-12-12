import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor<T> implements NestInterceptor {
  private readonly Logger;

  constructor(context: string) {
    this.Logger = new Logger(context);
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        const ctx = context.switchToHttp();
        const req: Request = ctx.getRequest();
        const res: Response = ctx.getResponse();
        const { originalUrl, method, params, body, query, path } = req;
        const { statusCode: status } = res;

        const logData = {
          duration: `${Date.now() - now}ms`,
          request: {
            path,
            method,
            params,
            body,
            query,
            originalUrl,
          },
          response: {
            status,
            data,
          },
        };
        return this.Logger.log(JSON.stringify(logData));
      }),
    );
  }
}
