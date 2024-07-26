import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { SignUpCommand } from '../impl/sign-up.command';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { HashingService } from '../../ports/hashing.service';
import { UserFactory } from 'src/modules/iam/domain/factories/user.factory';
import { SignUpResponseDto } from 'src/modules/iam/presenters/http/dto/response/sign-up.response.dto';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { UserSignedUpEvent } from 'src/modules/iam/domain/events/user-signed-up.event';
import { User } from 'src/modules/iam/domain/user';
import { FindUserRepository } from '../../ports/find-user.repository';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  private readonly logger = new Logger(SignUpCommandHandler.name);

  constructor(
    private readonly userFactory: UserFactory,
    private readonly createUserRepository: CreateUserRepository,
    private readonly findUserRepository: FindUserRepository,
    private readonly hashingService: HashingService,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(command: SignUpCommand): Promise<SignUpResponseDto> {
    this.logger.debug(
      `Processing "${SignUpCommand.name}": ${JSON.stringify(command)}`,
    );

    // * check user is already exist or not
    const userReadModel = await this.findUserRepository.findOneByEmail(
      command.email,
    );
    if (userReadModel) {
      throw new ConflictException(ErrorMsg.ERR_AUTH_SIGNUP_USER_CONFLICT);
    }

    const hashedPassword = await this.hashingService.hash(command.password);
    // * create new user to write-db
    let user = await this.createUserRepository.save(
      this.userFactory.create(command.name, command.email, hashedPassword),
    );

    // * sync to read-db
    user.signedUp();
    this.eventPublisher.mergeObjectContext(user);
    user.commit();

    return { id: user.id, name: user.name, email: user.email };
  }
}
