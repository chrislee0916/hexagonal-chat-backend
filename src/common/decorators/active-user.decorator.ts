import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../../modules/iam/domain/interfaces/active-user-data.interface';

export const REQUEST_USER_KEY = 'user';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
