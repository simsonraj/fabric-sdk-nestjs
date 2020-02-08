import { Injectable, NestInterceptor, ExecutionContext, Logger, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from '../logger/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    constructor(private logger: AppLogger) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const url = req.url;
        const now = Date.now();

        this.logger.api(`${new Date().toLocaleString()}: [${context.getClass().name}] ${method} ${url} ${Date.now() - now}ms`);

        return next
            .handle()
            .pipe(
                tap(() => Logger.log(`${method} ${url} ${Date.now() - now}ms`, context.getClass().name)),
            );
    }
}
