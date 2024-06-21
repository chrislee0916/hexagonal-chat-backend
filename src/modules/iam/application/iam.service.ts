import { Injectable } from '@nestjs/common';
import { SignUpCommand } from './commands/impl/sign-up.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpResponseDto } from '../presenters/http/dto/response/sign-up.response.dto';
import { SignInCommand } from './commands/impl/sign-in.command';
import { SignInResponseDto } from '../presenters/http/dto/response/sign-in.response.dto';
import { RefreshTokenCommand } from './commands/impl/refresh-token.command';
import { RefreshTokenResponseDto } from '../presenters/http/dto/response/refresh-token.response.dto';
import { AskFriendCommand } from './commands/impl/ask-friend.command';
import { SuccessResponseDto } from 'src/common/dtos/response.dto';
import { AcceptFriendCommand } from './commands/impl/accept-friend.command';
import { GetUserQuery } from './querys/impl/get-user.query';

@Injectable()
export class IamService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async signUp(signUpCommand: SignUpCommand): Promise<SignUpResponseDto> {
    return this.commandBus.execute(signUpCommand);
  }

  async signIn(signInCommand: SignInCommand): Promise<SignInResponseDto> {
    return this.commandBus.execute(signInCommand);
  }

  async refreshToken(
    refreshTokenCommand: RefreshTokenCommand,
  ): Promise<RefreshTokenResponseDto> {
    return this.commandBus.execute(refreshTokenCommand);
  }

  async getUser(getUserQuery: GetUserQuery) {
    return this.queryBus.execute(getUserQuery);
  }

  async askFriend(
    askFriendCommand: AskFriendCommand,
  ): Promise<SuccessResponseDto> {
    return this.commandBus.execute(askFriendCommand);
  }

  async acceptFriend(
    acceptFriendCommand: AcceptFriendCommand,
  ): Promise<SuccessResponseDto> {
    return this.commandBus.execute(acceptFriendCommand);
  }
}
