import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/response.interface';
import * as dayjs from 'dayjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { url } = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exccptionResponse = exception.getResponse();

    const detail =
      typeof exccptionResponse === 'string'
        ? { message: exccptionResponse }
        : (exccptionResponse as object);

    const now = dayjs();
    const res: ErrorResponse = {
      success: false,
      path: url,
      detail,
      time: now.format(),
      timestamp: now.valueOf(),
    };

    Logger.error(res);
    response.status(status).json(res);
  }
}
