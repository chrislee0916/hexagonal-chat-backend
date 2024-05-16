import { Injectable } from '@nestjs/common';
import { SignUpCommand } from './commands/sign-up.command';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpResponseDto } from '../presenters/http/dto/sign-up.response.dto';
import { SignInCommand } from './commands/sign-in.command';
import { SignInResponseDto } from '../presenters/http/dto/sign-in.response.dto';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import { RefreshTokenResponseDto } from '../presenters/http/dto/refresh-token.response.dto';

@Injectable()
export class IamService {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: CommandBus,
  ) { }

  async signUp(signUpCommand: SignUpCommand): Promise<SignUpResponseDto> {
    return this.commandBus.execute(signUpCommand);
  }

  async signIn(signInCommand: SignInCommand): Promise<SignInResponseDto> {
    return this.commandBus.execute(signInCommand);
  }

  async refreshToken(refreshToken: RefreshTokenCommand): Promise<RefreshTokenResponseDto> {
    return this.commandBus.execute(refreshToken)
  }
}
