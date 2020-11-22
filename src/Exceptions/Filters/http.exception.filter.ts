import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../Logger/Services/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    /**
     *Creates an instance of HttpExceptionFilter.
     * @param {LoggerService} logger
     * @memberof HttpExceptionFilter
     */
    constructor(private readonly logger: LoggerService) {}

    /**
     *
     *
     * @param {HttpException} exception
     * @param {ArgumentsHost} host
     * @memberof HttpExceptionFilter
     */
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        this.logger.error(exception.message, exception.stack);

        response.status(status).json({
            statusCode: status,
            error: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}
