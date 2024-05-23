import { Injectable } from '@nestjs/common';
import { SignUpCommand } from './commands/impl/sign-up.command';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpResponseDto } from '../presenters/http/dto/response/sign-up.response.dto';
import { SignInCommand } from './commands/impl/sign-in.command';
import { SignInResponseDto } from '../presenters/http/dto/response/sign-in.response.dto';
import { RefreshTokenCommand } from './commands/impl/refresh-token.command';
import { RefreshTokenResponseDto } from '../presenters/http/dto/response/refresh-token.response.dto';
import { AskFriendCommand } from './commands/impl/add-friend.command';
import { SuccessResponseDto } from 'src/common/dtos/response.dto';

@Injectable()
export class IamService {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: CommandBus,
  ) {}

  async signUp(signUpCommand: SignUpCommand): Promise<SignUpResponseDto> {
    return this.commandBus.execute(signUpCommand);
  }

  async signIn(signInCommand: SignInCommand): Promise<SignInResponseDto> {
    return this.commandBus.execute(signInCommand);
  }

  async refreshToken(
    refreshToken: RefreshTokenCommand,
  ): Promise<RefreshTokenResponseDto> {
    return this.commandBus.execute(refreshToken);
  }

  async askFriend(
    askFriendCommand: AskFriendCommand,
  ): Promise<SuccessResponseDto> {
    return this.commandBus.execute(askFriendCommand);
  }
}
