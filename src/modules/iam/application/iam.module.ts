import { DynamicModule, Module, Type } from '@nestjs/common';
import { IamController } from '../presenters/http/iam.controller';
import { IamService } from './iam.service';
import { SignUpCommandHandler } from './commands/sign-up.command-handler';
import { UserFactory } from '../domain/factories/user.factory';
import { SignInCommandHandler } from './commands/sign-in.command-handler';
import { RefreshTokenCommandHandler } from './commands/refresh-token.command-handler';

@Module({
  controllers: [IamController],
  providers: [IamService, SignUpCommandHandler, SignInCommandHandler, RefreshTokenCommandHandler, UserFactory],
})
export class IamModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: IamModule,
      imports: [infrastructureModule],
    };
  }
}
