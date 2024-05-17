import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from '../impl/sign-up.command';
import { ConflictException, Logger } from '@nestjs/common';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { HashingService } from '../../ports/hashing.service';
import { UserFactory } from 'src/modules/iam/domain/factories/user.factory';
import { SignUpResponseDto } from 'src/modules/iam/presenters/http/dto/sign-up.response.dto';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  private readonly logger = new Logger(SignUpCommandHandler.name);

  constructor(
    private readonly userFactory: UserFactory,
    // private readonly eventBus: EventBus,
    private readonly userRepository: CreateUserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: SignUpCommand): Promise<SignUpResponseDto> {
    this.logger.debug(
      `Processing "${SignUpCommand.name}": ${JSON.stringify(command)}`,
    );
    const hashedPassword = await this.hashingService.hash(command.password);
    const user = this.userFactory.create(command.email, hashedPassword);
    // this.eventBus.publish(new UserSignedUpEvent(user));
    try {
      const { id, email } = await this.userRepository.save(user);
      return { id, email };
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(ErrorMsg.ERR_AUTH_SIGNUP_USER_CONFLICT);
      }
      throw err;
    }
  }
}
