import {
  ArgumentsHost,
  BadGatewayException,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ErrorDetailResponseDto } from '../dtos/response.dto';

@Catch(WsException)
export class WsExceptionFilter<T> extends BaseWsExceptionFilter {
  private logger = new Logger(WsExceptionFilter.name);

  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    const data = host.switchToWs().getData();
    const error = exception.getError();
    this.logger.error('======= Error =======');
    this.logger.error(`data: ${JSON.stringify(data)}`);
    this.logger.error(`error: ${JSON.stringify(error)}`);
    this.logger.error('======== End =========');
    const detail: ErrorDetailResponseDto =
      typeof error === 'string'
        ? { message: error }
        : (error as ErrorDetailResponseDto);

    client.emit('exception', detail);
    if (detail.statusCode === HttpStatus.UNAUTHORIZED) {
      client.disconnect();
    }
  }
}
