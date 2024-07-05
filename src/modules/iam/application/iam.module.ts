import { DynamicModule, Module, Type } from '@nestjs/common';
import { IamController } from '../presenters/http/iam.controller';
import { IamService } from './iam.service';
import { SignUpCommandHandler } from './commands/handlers/sign-up.command-handler';
import { UserFactory } from '../domain/factories/user.factory';
import { SignInCommandHandler } from './commands/handlers/sign-in.command-handler';
import { RefreshTokenCommandHandler } from './commands/handlers/refresh-token.command-handler';
import { UserSignedUpEventHandler } from './event-handlers/user-signed-up.event-handler';
import { UserAskedFriendEventHandler } from './event-handlers/user-asked-friend.event-handler';
import { AskFriendCommandHandler } from './commands/handlers/ask-friend.command-handler';
import { AcceptFriendCommandHandler } from './commands/handlers/accept-friend.command-handler';
import { UserAcceptedFriendEventHandler } from './event-handlers/user-accepted-friend.event-handler';
import { GetFriendsQueryHandler } from './querys/handlers/get-user.query-handler';
import { ChatModule } from 'src/modules/chat/application/chat.module';

@Module({
  controllers: [IamController],
  providers: [
    IamService,
    SignUpCommandHandler,
    SignInCommandHandler,
    RefreshTokenCommandHandler,
    AskFriendCommandHandler,
    UserFactory,
    UserSignedUpEventHandler,
    UserAskedFriendEventHandler,
    AcceptFriendCommandHandler,
    UserAcceptedFriendEventHandler,
    GetFriendsQueryHandler,
  ],
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
