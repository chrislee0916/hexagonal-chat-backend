import { Injectable } from '@nestjs/common';
import { SignUpCommand } from './commands/sign-up.command';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpResponseDto } from '../presenters/http/dto/sign-up.response.dto';
import { SignInCommand } from './commands/sign-in.command';

@Injectable()
export class IamService {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: CommandBus,
  ) { }

  async signUp(signUpCommand: SignUpCommand): Promise<SignUpResponseDto> {
    return this.commandBus.execute(signUpCommand);
  }

  async signIn(signInCommand: SignInCommand) {
    return this.commandBus.execute(signInCommand);
  }
}
