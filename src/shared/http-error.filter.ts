import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger } from '@nestjs/common';
import { AppLogger } from '../logger/logger';

const logger = new AppLogger();

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        const errorResponse = {
            code: status,
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
            message: exception.message.message || exception.message.error || exception.message || null,
        };

        logger.error(exception.message.message || exception.message.error || exception.message || null, '');

        Logger.error(`${request.method} ${request.url}`,
            JSON.stringify(errorResponse),
            'ExceptionFilter',
        );

        response.status(status).json(errorResponse);
    }
}
