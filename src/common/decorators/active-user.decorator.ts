import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ActiveUserData } from '../../modules/iam/domain/interfaces/active-user-data.interface';

export const REQUEST_USER_KEY = 'user';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const contextType = new Map<ContextType, any>([
      ['ws', ctx.switchToWs().getClient()],
      ['http', ctx.switchToHttp().getRequest()],
    ]);
    const request = contextType.get(ctx.getType());
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
