import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { SignInCommand } from "./sign-in.command";
import { Inject, Logger, UnauthorizedException } from "@nestjs/common";
import { FindUserRepository } from "../ports/find-user.repository";
import { HashingService } from "../ports/hashing.service";
import { ErrorMsg } from "src/common/enums/err-msg.enum";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../../domain/config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { User } from "../../domain/user";
import { ActiveUserData } from "../../domain/interfaces/active-user-data.interface";
import { SignInResponseDto } from "../../presenters/http/dto/sign-in.response.dto";
import { randomUUID } from "crypto";
import { RefreshTokenIdsStorage } from "../ports/refresh-token-ids.storage";


@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(SignInCommandHandler.name);

  constructor(
    private readonly userRepository: FindUserRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) { }

  async execute(command: SignInCommand): Promise<SignInResponseDto> {
    this.logger.debug(
      `Processing "${SignInCommand.name}": ${JSON.stringify(command)}`,
    );
    const { email, password } = command;
    const user = await this.userRepository.findByEmail(email);
    const isEqual = await this.hashingService.compare(password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException(ErrorMsg.ERR_AUTH_SIGNIN_PASSWORD);
    }
    return this.generateTokens(user);
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      }
    )
  }

  private async generateTokens(user: User): Promise<SignInResponseDto> {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email }
      ),
      // TODO: 應該使用強型別
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId
      })
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken
    }
  }
}