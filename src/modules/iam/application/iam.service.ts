import { Injectable } from '@nestjs/common';
import { SignUpCommand } from './commands/sign-up.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class IamService {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: QueryBus,
  ) {}

  signUp(signUpCommand: SignUpCommand) {
    return this.commandBus.execute(signUpCommand);
  }
}
