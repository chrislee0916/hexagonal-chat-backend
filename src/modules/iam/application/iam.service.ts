import { Injectable } from '@nestjs/common';
import { SignUpCommand } from './commands/sign-up.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../domain/user';
import { SignUpResponseDto } from '../presenters/http/dto/sign-up.response.dto';

@Injectable()
export class IamService {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: QueryBus,
  ) {}

  async signUp(signUpCommand: SignUpCommand): Promise<SignUpResponseDto> {
    return this.commandBus.execute(signUpCommand);
  }
}
