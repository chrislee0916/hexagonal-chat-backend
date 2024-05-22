import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { SignUpCommand } from '../impl/sign-up.command';
import { ConflictException, Logger } from '@nestjs/common';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { HashingService } from '../../ports/hashing.service';
import { UserFactory } from 'src/modules/iam/domain/factories/user.factory';
import { SignUpResponseDto } from 'src/modules/iam/presenters/http/dto/sign-up.response.dto';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { UserSignedUpEvent } from 'src/modules/iam/domain/events/user-signed-up.event';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  private readonly logger = new Logger(SignUpCommandHandler.name);

  constructor(
    private readonly userFactory: UserFactory,
    // private readonly eventBus: EventBus,
    private readonly userRepository: CreateUserRepository,
    private readonly hashingService: HashingService,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(command: SignUpCommand): Promise<SignUpResponseDto> {
    this.logger.debug(
      `Processing "${SignUpCommand.name}": ${JSON.stringify(command)}`,
    );
    const hashedPassword = await this.hashingService.hash(command.password);

    try {
      let user = await this.userRepository.save(
        this.userFactory.create(command.name, command.email, hashedPassword),
      );
      user.signedUp();
      this.eventPublisher.mergeObjectContext(user);
      user.commit();
      return { id: user.id, name: user.name, email: user.name };
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(ErrorMsg.ERR_AUTH_SIGNUP_USER_CONFLICT);
      }
      throw err;
    }
  }
}
