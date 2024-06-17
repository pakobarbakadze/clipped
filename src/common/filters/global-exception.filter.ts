import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/shared/logger/logger.service';

@Catch()
export default class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LoggerService) private loggerService: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || 'Internal server error';

    this.loggerService.error(message);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
