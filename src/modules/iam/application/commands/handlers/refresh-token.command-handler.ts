import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../impl/refresh-token.command';
import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { FindUserRepository } from '../../ports/find-user.repository';
import { HashingService } from '../../ports/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenIdsStorage } from '../../ports/refresh-token-ids.storage';
import { randomUUID } from 'crypto';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { ActiveUserData } from 'src/modules/iam/domain/interfaces/active-user-data.interface';
import { SignInResponseDto } from 'src/modules/iam/presenters/http/dto/response/sign-in.response.dto';
import { RefreshTokenResponseDto } from 'src/modules/iam/presenters/http/dto/response/refresh-token.response.dto';
import { User } from 'src/modules/iam/domain/user';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(RefreshTokenCommandHandler.name);

  constructor(
    private readonly userRepository: FindUserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<RefreshTokenResponseDto> {
    this.logger.debug(
      `Processing "${RefreshTokenCommand.name}": ${JSON.stringify(command)}`,
    );
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(command.refreshToken, {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
      });

      const user = await this.userRepository.findOneById(sub);
      if (!user) throw new Error();

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (!isValid) throw new Error();
      await this.refreshTokenIdsStorage.invalidate(user.id);

      return this.refreshTokenIdsStorage.generateTokens(user);
    } catch (err) {
      // TODO: 應該做額外處理，例如： 紀錄log、通知用戶
      throw new UnauthorizedException(ErrorMsg.ERR_AUTH_REFRESH_TOKEN_INVALID);
    }
  }
}
