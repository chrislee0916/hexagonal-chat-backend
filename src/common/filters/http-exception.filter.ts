import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/response.interface';
import * as dayjs from 'dayjs';
import { ErrorMsg } from '../enums/err-msg.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { url } = ctx.getRequest<Request>();

    const status =
      typeof exception.getStatus == 'function'
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exccptionResponse =
      typeof exception.getResponse == 'function'
        ? exception.getResponse()
        : ErrorMsg.ERR_CORE_UNKNOWN_ERROR;

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

    Logger.error('======= Error =======');
    Logger.error(`name: ${exception.name}`);
    Logger.error(`message: ${exception.message}`);
    Logger.error(`stack: ${exception.stack}`);
    Logger.error('======== End =========');

    response.status(status).json(res);
  }
}
