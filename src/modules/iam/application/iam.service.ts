import { Injectable } from '@nestjs/common';
import { SignUpCommand } from './commands/sign-up.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignUpResponseDto } from '../presenters/http/dto/sign-up.response.dto';
import { SignInQuery } from './queries/sign-in.query';

@Injectable()
export class IamService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  async signUp(signUpCommand: SignUpCommand): Promise<SignUpResponseDto> {
    return this.commandBus.execute(signUpCommand);
  }

  async signIn(signInQuery: SignInQuery) {
    return this.queryBus.execute(signInQuery);
  }
}
