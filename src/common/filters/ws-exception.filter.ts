import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

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
    client.emit('exception', error);
    client.disconnect();
  }
}
