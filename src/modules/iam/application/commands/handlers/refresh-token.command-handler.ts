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
import { ActiveUserData } from 'src/common/interfaces/active-user-data.interface';
import { SignInResponseDto } from 'src/modules/iam/presenters/http/dto/sign-in.response.dto';
import { RefreshTokenResponseDto } from 'src/modules/iam/presenters/http/dto/refresh-token.response.dto';
import { User } from 'src/modules/iam/domain/user';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(RefreshTokenCommandHandler.name);

  constructor(
    private readonly userRepository: FindUserRepository,
    private readonly hashingService: HashingService,
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

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (!isValid) {
        throw new UnauthorizedException(
          ErrorMsg.ERR_AUTH_REFRESH_TOKEN_INVALID,
        );
      }
      await this.refreshTokenIdsStorage.invalidate(user.id);

      return this.generateTokens(user);
    } catch (err) {
      // TODO: 應該做額外處理，例如： 紀錄log、通知用戶
      throw new UnauthorizedException(ErrorMsg.ERR_AUTH_REFRESH_TOKEN_INVALID);
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        expiresIn,
      },
    );
  }

  private async generateTokens(user: User): Promise<SignInResponseDto> {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        +process.env.JWT_ACCESS_TOKEN_TTL,
        { email: user.email },
      ),
      // TODO: 應該使用強型別
      this.signToken(user.id, +process.env.JWT_REFRESH_TOKEN_TTL, {
        refreshTokenId,
      }),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }
}
