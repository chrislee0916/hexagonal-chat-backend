import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { SuccessResponseDto } from '../dtos/response.dto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDto> {
    // const request = context.switchToHttp().getRequest();
    // const controller = context.getClass().name;
    // const handler = context.getHandler().name;

    // return next.handle();
    const reqTime = dayjs();
    return next.handle().pipe<SuccessResponseDto>(
      map((data) => {
        const respTime = dayjs();
        return {
          success: true,
          data: data,
          runTimes: respTime.diff(reqTime),
          time: respTime.format(),
          timestamp: respTime.valueOf(),
        };
      }),
    );
  }
}
