import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { HttpException, Logger } from '@nestjs/common';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserSignedUpEvent } from '../../domain/events/user-signed-up.event';
import { CreateUserRepository } from '../ports/create-user.repository';
import { HashingService } from '../ports/hashing.service';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  private readonly logger = new Logger(SignUpCommandHandler.name);

  constructor(
    private readonly userFactory: UserFactory,
    private readonly eventBus: EventBus,
    private readonly userRepository: CreateUserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: SignUpCommand) {
    this.logger.debug(
      `Processing "${SignUpCommand.name}": ${JSON.stringify(command)}`,
    );
    const hashedPassword = await this.hashingService.hash(command.password);
    const user = this.userFactory.create(command.email, hashedPassword);
    // this.eventBus.publish(new UserSignedUpEvent(user));
    await this.userRepository.save(user);
    return user;
  }
}
