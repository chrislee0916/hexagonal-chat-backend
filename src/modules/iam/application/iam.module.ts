import { DynamicModule, Module, Type } from '@nestjs/common';
import { IamController } from '../presenters/http/iam.controller';
import { IamService } from './iam.service';
import { SignUpCommandHandler } from './commands/sign-up.command-handler';
import { UserFactory } from '../domain/factories/user.factory';

@Module({
  controllers: [IamController],
  providers: [IamService, SignUpCommandHandler, UserFactory],
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
