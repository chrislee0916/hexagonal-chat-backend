import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { REQUEST_USER_KEY } from 'src/common/decorators/active-user.decorator';
import { AUTH_TYPE_KEY } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

@Injectable()
export class AuthenticationWebsocketGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient<Socket>();
    const { token } = context.switchToWs().getData();
    console.log('token: ...', token);
    if (!token) {
      throw new WsException({
        statusCode: 401,
        message: ErrorMsg.ERR_AUTH_INVALID_ACCESS_TOKEN,
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
      });
      socket[REQUEST_USER_KEY] = payload;
    } catch (err) {
      console.log('here catch errorL ', err);
      throw new WsException({
        statusCode: 401,
        message: ErrorMsg.ERR_AUTH_INVALID_ACCESS_TOKEN,
      });
    }
    return true;
  }

  // private extractTokenFromHandshake(socket: Socket): string | undefined {
  //   const [type, token] =
  //     socket.handshake.headers?.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }
}
