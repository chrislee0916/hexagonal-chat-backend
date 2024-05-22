import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from '../impl/sign-in.command';
import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { FindUserRepository } from '../../ports/find-user.repository';
import { HashingService } from '../../ports/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { RefreshTokenIdsStorage } from '../../ports/refresh-token-ids.storage';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { SignInResponseDto } from 'src/modules/iam/presenters/http/dto/sign-in.response.dto';
import { User } from 'src/modules/iam/domain/user';
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(SignInCommandHandler.name);

  constructor(
    private readonly userRepository: FindUserRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async execute(command: SignInCommand): Promise<SignInResponseDto> {
    this.logger.debug(
      `Processing "${SignInCommand.name}": ${JSON.stringify(command)}`,
    );
    const { email, password } = command;
    const user = await this.userRepository.findOneByEmail(email);
    const isEqual = await this.hashingService.compare(password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException(ErrorMsg.ERR_AUTH_SIGNIN_PASSWORD);
    }
    const tokens = await this.refreshTokenIdsStorage.generateTokens(user);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      ...tokens,
    };
  }
}
